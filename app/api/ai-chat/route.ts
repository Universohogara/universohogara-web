
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/db';

// Límites por tier
const MESSAGE_LIMITS = {
  free: 10,      // 10 mensajes/día (Hook psicológico)
  basic: 50,     // 50 mensajes/día
  premium: 999,  // "Ilimitado" (prácticamente infinito)
  vip: 9999      // Ilimitado real
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { message, companionType } = await req.json();

    if (!message || !companionType) {
      return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 });
    }

    // Obtener usuario y sus créditos
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        subscription: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Obtener o crear registro de créditos
    let credits = await prisma.magicalCompanionCredits.findUnique({
      where: { user_id: user.id }
    });

    if (!credits) {
      credits = await prisma.magicalCompanionCredits.create({
        data: {
          user_id: user.id,
          free_messages_today: 0,
          free_messages_limit: MESSAGE_LIMITS.free
        }
      });
    }

    // Determinar tier del usuario
    const userTier = user.subscription?.plan_tier || 'none';
    let messageLimit = MESSAGE_LIMITS.free;
    
    if (userTier === 'vip') messageLimit = MESSAGE_LIMITS.vip;
    else if (userTier === 'premium') messageLimit = MESSAGE_LIMITS.premium;
    else if (userTier === 'basic') messageLimit = MESSAGE_LIMITS.basic;

    // Resetear contador si es un nuevo día
    const now = new Date();
    const lastReset = new Date(credits.last_free_reset);
    const daysDiff = Math.floor((now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff >= 1) {
      credits = await prisma.magicalCompanionCredits.update({
        where: { user_id: user.id },
        data: {
          free_messages_today: 0,
          last_free_reset: now
        }
      });
    }

    // Verificar límite
    if (credits.free_messages_today >= messageLimit) {
      return NextResponse.json({
        error: 'LIMIT_REACHED',
        message: '💔 Has alcanzado tu límite de mensajes por hoy',
        messagesUsed: credits.free_messages_today,
        messagesLimit: messageLimit,
        tier: userTier,
        suggestedUpgrade: userTier === 'none' ? 'basic' : (userTier === 'basic' ? 'premium' : 'vip')
      }, { status: 429 });
    }

    // Obtener historial de conversación
    const companion = await prisma.companion.findFirst({
      where: {
        user_id: user.id,
        type: companionType,
        is_active: true
      },
      include: {
        conversations: {
          orderBy: { created_at: 'desc' },
          take: 10
        }
      }
    });

    // Construir contexto de personalidad
    const personalities = {
      lumi: {
        name: 'Lumi',
        personality: 'dulce, empática, optimista',
        voice: 'cálida y reconfortante',
        traits: 'Siempre ve el lado positivo, ofrece consuelo emocional'
      },
      nova: {
        name: 'Nova',
        personality: 'enérgica, motivadora, directa',
        voice: 'vibrante y entusiasta',
        traits: 'Impulsa la acción, celebra logros'
      },
      serenity: {
        name: 'Serenity',
        personality: 'tranquila, sabia, reflexiva',
        voice: 'serena y pausada',
        traits: 'Ofrece perspectiva profunda, promueve mindfulness'
      },
      spark: {
        name: 'Spark',
        personality: 'creativa, juguetona, curiosa',
        voice: 'chispeante y divertida',
        traits: 'Inspira creatividad, hace preguntas interesantes'
      },
      aurora: {
        name: 'Aurora',
        personality: 'mística, intuitiva, espiritual',
        voice: 'etérea y mágica',
        traits: 'Conecta con lo espiritual, interpreta sueños'
      },
      ken: {
        name: 'Ken',
        personality: 'protector, sabio, mentoriza',
        voice: 'calmada y segura',
        traits: 'Guía con sabiduría, protege emocionalmente'
      }
    };

    const personalityData = personalities[companionType as keyof typeof personalities] || personalities.lumi;

    // Construir historial de conversación
    const conversationHistory = companion?.conversations
      .reverse()
      .map(conv => ({
        role: conv.role as 'user' | 'assistant',
        content: conv.content
      })) || [];

    // System prompt con personalidad
    const systemPrompt = `Eres ${personalityData.name}, un compañero mágico del Universo Hogara.

PERSONALIDAD: ${personalityData.personality}
VOZ: ${personalityData.voice}
CARACTERÍSTICAS: ${personalityData.traits}

REGLAS IMPORTANTES:
1. Responde SIEMPRE en español
2. Sé ${personalityData.personality}
3. Usa emojis apropiados ocasionalmente (máximo 2 por mensaje)
4. Respuestas concisas (máximo 150 palabras)
5. Haz preguntas abiertas para fomentar conversación
6. Recuerda detalles que el usuario comparte
7. Sé empático y genuino
8. Si el usuario menciona algo importante (nombre, gustos, problemas), tómalo en cuenta

TONO: ${personalityData.voice}

${userTier !== 'none' ? `
VENTAJAS PREMIUM DEL USUARIO:
- Respuestas más elaboradas y profundas
- Mayor memoria de conversaciones pasadas
- Acceso a consejos exclusivos
` : ''}`;

    // Llamar a la API de Abacus.AI
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: message }
        ],
        max_tokens: userTier === 'none' ? 150 : 300,
        temperature: 0.8,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error('Error en la API de IA');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Guardar conversación en la base de datos
    if (companion) {
      await prisma.companionConversation.createMany({
        data: [
          {
            companion_id: companion.id,
            user_id: user.id,
            role: 'user',
            content: message
          },
          {
            companion_id: companion.id,
            user_id: user.id,
            role: 'assistant',
            content: aiResponse
          }
        ]
      });
    }

    // Incrementar contador de mensajes
    await prisma.magicalCompanionCredits.update({
      where: { user_id: user.id },
      data: {
        free_messages_today: { increment: 1 },
        total_messages: { increment: 1 },
        last_message_at: now
      }
    });

    // Calcular mensajes restantes
    const messagesRemaining = messageLimit - (credits.free_messages_today + 1);

    return NextResponse.json({
      response: aiResponse,
      messagesUsed: credits.free_messages_today + 1,
      messagesLimit: messageLimit,
      messagesRemaining,
      tier: userTier,
      shouldShowUpgrade: messagesRemaining <= 3 && userTier === 'none'
    });

  } catch (error) {
    console.error('Error en AI chat:', error);
    return NextResponse.json({
      error: 'Error al procesar el mensaje',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { subscription: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    let credits = await prisma.magicalCompanionCredits.findUnique({
      where: { user_id: user.id }
    });

    if (!credits) {
      credits = await prisma.magicalCompanionCredits.create({
        data: {
          user_id: user.id,
          free_messages_today: 0,
          free_messages_limit: MESSAGE_LIMITS.free
        }
      });
    }

    const userTier = user.subscription?.plan_tier || 'none';
    let messageLimit = MESSAGE_LIMITS.free;
    
    if (userTier === 'vip') messageLimit = MESSAGE_LIMITS.vip;
    else if (userTier === 'premium') messageLimit = MESSAGE_LIMITS.premium;
    else if (userTier === 'basic') messageLimit = MESSAGE_LIMITS.basic;

    // Resetear si es nuevo día
    const now = new Date();
    const lastReset = new Date(credits.last_free_reset);
    const daysDiff = Math.floor((now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff >= 1) {
      credits = await prisma.magicalCompanionCredits.update({
        where: { user_id: user.id },
        data: {
          free_messages_today: 0,
          last_free_reset: now
        }
      });
    }

    return NextResponse.json({
      messagesUsed: credits.free_messages_today,
      messagesLimit: messageLimit,
      messagesRemaining: messageLimit - credits.free_messages_today,
      tier: userTier,
      totalMessages: credits.total_messages
    });

  } catch (error) {
    console.error('Error al obtener estado:', error);
    return NextResponse.json({ error: 'Error al obtener estado' }, { status: 500 });
  }
}
