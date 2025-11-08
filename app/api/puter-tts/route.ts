
/**
 * API Route para Puter.js TTS
 * Actúa como proxy para el servicio de Puter.js
 */

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { text, engine, voice, language } = await request.json();

    console.log('🌟 Puter TTS API Request:');
    console.log('  - Text length:', text?.length);
    console.log('  - Engine:', engine);
    console.log('  - Voice:', voice);
    console.log('  - Language:', language);

    // Validaciones
    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    if (text.length > 3000) {
      return NextResponse.json(
        { error: 'Text too long (max 3000 characters)' },
        { status: 400 }
      );
    }

    // Construir URL de Puter.js API
    // Nota: Puter.js se usa desde el cliente, pero si necesitamos hacer
    // la llamada desde el servidor, usamos su API directamente
    
    // Para simplificar, vamos a usar la librería desde el cliente
    // Este endpoint solo valida y retorna OK
    return NextResponse.json(
      { 
        success: true,
        message: 'Use Puter.js client-side library',
        config: { text, engine, voice, language }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Error in Puter TTS API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
