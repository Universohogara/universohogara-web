
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, readFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

const execPromise = promisify(exec);

/**
 * 🎙️ API de Piper TTS - Voces Femeninas Naturales
 * 
 * Genera audio usando Piper TTS instalado en el servidor
 */
export async function POST(request: Request) {
  try {
    const { text, voiceModel, characterType, emotion } = await request.json();
    
    if (!text || !voiceModel) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      );
    }
    
    // Ruta del modelo de voz
    const modelPath = `/home/ubuntu/piper/models/${voiceModel}.onnx`;
    const configPath = `/home/ubuntu/piper/models/${voiceModel}.onnx.json`;
    
    // Generar nombre de archivo temporal único
    const tempFile = join(tmpdir(), `piper_${Date.now()}.wav`);
    
    // Comando de Piper TTS
    const piperCommand = `echo "${text}" | /home/ubuntu/piper/piper --model ${modelPath} --config ${configPath} --output_file ${tempFile}`;
    
    console.log(`[Piper TTS] Generando audio para ${characterType} (${voiceModel})`);
    console.log(`[Piper TTS] Texto: "${text.substring(0, 50)}..."`);
    
    // Ejecutar Piper TTS
    await execPromise(piperCommand);
    
    // Leer el archivo generado
    const audioBuffer = await readFile(tempFile);
    
    // Eliminar archivo temporal
    await unlink(tempFile);
    
    // Retornar audio
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': audioBuffer.length.toString()
      }
    });
    
  } catch (error: any) {
    console.error('[Piper TTS] Error:', error);
    return NextResponse.json(
      { error: 'Error generando audio', details: error.message },
      { status: 500 }
    );
  }
}
