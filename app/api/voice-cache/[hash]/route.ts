
/**
 * API: Servir archivos de caché de voz
 * GET /api/voice-cache/[hash]
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const VOICE_CACHE_DIR = process.env.VOICE_CACHE_DIR || '/tmp/hogara_voices';

export async function GET(
  request: NextRequest,
  { params }: { params: { hash: string } }
) {
  try {
    const { hash } = params;

    // 1. Validar hash
    if (!hash || !/^[a-f0-9]{32}$/.test(hash)) {
      return NextResponse.json(
        { error: 'Hash inválido' },
        { status: 400 }
      );
    }

    // 2. Construir ruta del archivo
    const filePath = path.join(VOICE_CACHE_DIR, `${hash}.wav`);

    // 3. Verificar que el archivo existe
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json(
        { error: 'Archivo no encontrado' },
        { status: 404 }
      );
    }

    // 4. Leer el archivo
    const buffer = await fs.readFile(filePath);

    // 5. Devolver el audio con headers apropiados
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=2592000', // 30 días
        'Accept-Ranges': 'bytes',
      },
    });
  } catch (error) {
    console.error('❌ Error al servir audio:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

