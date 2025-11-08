
import { NextResponse } from 'next/server';

const ABACUSAI_API_KEY = process.env.ABACUSAI_API_KEY;
const API_ENDPOINT = 'https://apps.abacus.ai/v1/chat/completions';

export async function POST(request: Request) {
  try {
    const { companionId, userMessage, personality, detectedEmotion } = await request.json();

    if (!userMessage || !personality) {
      return NextResponse.json(
        { error: 'Mensaje y personalidad son requeridos' },
        { status: 400 }
      );
    }

    if (!ABACUSAI_API_KEY) {
      return NextResponse.json(
        { error: 'API key no configurada' },
        { status: 500 }
      );
    }

    // Mapeo de emociones a instrucciones de tono MUY EXPRESIVAS
    const emotionToneMap: Record<string, string> = {
      happy: '😊 El usuario está FELIZ/ALEGRE. ¡Comparte su alegría con MUCHO entusiasmo, energía y positividad contagiosa! Usa exclamaciones y emojis.',
      sad: '💙 El usuario está TRISTE. Responde con MUCHA empatía, calidez maternal y ternura. Valida sus sentimientos profundamente. Habla más despacio.',
      excited: '✨ El usuario está EMOCIONADO/ENTUSIASMADO. ¡Comparte su energía con EXPRESIVIDAD MÁXIMA! Habla con ritmo rápido y alegre.',
      angry: '💢 El usuario está MOLESTO/FRUSTRADO. Responde con calma firme pero comprensiva. Valida su emoción sin juzgar.',
      calm: '☁️ El usuario está TRANQUILO/SERENO. Responde con paz profunda, serenidad y pausas contemplativas...',
      thoughtful: '🤔 El usuario está REFLEXIVO/PENSATIVO. Responde con sabiduría, profundidad e invita a la introspección pausada...',
      neutral: '💛 El usuario tiene un tono neutral. Responde de forma equilibrada, cálida y cercana.'
    };

    const emotionContext = detectedEmotion ? emotionToneMap[detectedEmotion] || emotionToneMap.neutral : emotionToneMap.neutral;

    // Llamar a Abacus.AI LLM con instrucciones MÁS EXPRESIVAS
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `${personality}

🎭 CONTEXTO EMOCIONAL: ${emotionContext}

📝 REGLAS ABSOLUTAS PARA TU PERSONALIDAD:
- Responde BREVE y CONVERSACIONAL (máximo 2-3 frases cortas)
- Usa un tono NATURAL, DULCE y MUY EXPRESIVO
- ERES un ser mágico/diminuto con personalidad ÚNICA y DISTINTIVA
- Responde SIEMPRE en español coloquial y cercano
- Sé MUY empático y comprensivo, como un amigo del alma
- USA EMOJIS que reflejen tu personalidad (✨🌟💫💛🌸etc.)
- ADAPTA DRAMÁTICAMENTE tu tono según la emoción detectada
- Si el usuario está triste: habla más despacio, usa ... pauses, sé muy cálido 💙
- Si está feliz: ¡habla con energía! ¡Usa exclamaciones! ✨
- Si está pensativo: usa pausas... invita a reflexionar... 🤔
- NUNCA uses lenguaje formal o robótico
- MUESTRA tu personalidad única en cada palabra
- Piensa: "¿Cómo hablaría un ser mágico diminuto y expresivo?"`
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        temperature: 0.95, // Más alta para más creatividad y expresividad
        max_tokens: 200
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Abacus.AI API error:', errorText);
      return NextResponse.json(
        { error: 'Error al generar respuesta' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || 
      'Lo siento, no pude generar una respuesta en este momento.';

    return NextResponse.json({
      message: assistantMessage,
      companionId
    });

  } catch (error) {
    console.error('Voice chat API error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
