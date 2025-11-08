import { NextRequest, NextResponse } from 'next/server'

/**
 * API de Text-to-Speech - Simple wrapper
 * Solo retorna un mensaje indicando que se use /api/tts/piper directamente
 */
export async function POST(request: NextRequest) {
  return NextResponse.json({
    error: 'This endpoint is deprecated. Please use /api/tts/piper instead.',
    redirect: '/api/tts/piper'
  }, { status: 400 })
}
