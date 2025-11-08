
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

// Algoritmo simple de encriptación (en producción usar una librería robusta)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'hogara-voice-encryption-key-32ch';
const ALGORITHM = 'aes-256-cbc';

function encrypt(text: string): string {
  const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text: string): string {
  const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
  const parts = text.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encryptedText = parts[1];
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// GET: Obtener configuración actual
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        role: true,
        voice_minutes_used: true,
        voice_minutes_limit: true,
        voice_reset_date: true,
        elevenLabsApiKey: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Verificar si necesita resetear el contador mensual
    const now = new Date();
    const resetDate = user.voice_reset_date ? new Date(user.voice_reset_date) : null;
    let shouldReset = false;

    if (resetDate) {
      const daysSinceReset = Math.floor((now.getTime() - resetDate.getTime()) / (1000 * 60 * 60 * 24));
      shouldReset = daysSinceReset >= 30;
    }

    if (shouldReset) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          voice_minutes_used: 0,
          voice_reset_date: now,
        },
      });
      user.voice_minutes_used = 0;
      user.voice_reset_date = now;
    }

    return NextResponse.json({
      hasCustomApiKey: !!user.elevenLabsApiKey,
      voiceMinutesUsed: user.voice_minutes_used,
      voiceMinutesLimit: user.voice_minutes_limit,
      voiceResetDate: user.voice_reset_date,
      isPremium: user.role === 'premium' || user.role === 'admin',
    });
  } catch (error) {
    console.error('Error al obtener configuración de voz:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

// POST: Guardar o actualizar API key
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { apiKey } = await req.json();

    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length < 10) {
      return NextResponse.json({ error: 'API key inválida' }, { status: 400 });
    }

    // Encriptar la API key antes de guardarla
    const encryptedKey = encrypt(apiKey.trim());

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        elevenLabsApiKey: encryptedKey,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'API key configurada correctamente',
    });
  } catch (error) {
    console.error('Error al guardar API key:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

// DELETE: Eliminar API key personal
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        elevenLabsApiKey: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'API key eliminada correctamente',
    });
  } catch (error) {
    console.error('Error al eliminar API key:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
