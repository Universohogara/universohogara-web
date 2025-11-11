
# ✅ Piper TTS Instalado y Configurado

## 📍 Ubicación de la Instalación

- **Binario de Piper**: `/home/ubuntu/piper/piper/piper`
- **Modelos de voz**: `/home/ubuntu/piper/models/`
- **Directorio de caché**: `/tmp/hogara_voices/`

## 🎤 Modelos de Voz Instalados

Se han instalado 2 modelos de voz en español de alta calidad:

1. **es_ES-davefx-medium** (61 MB)
   - Voz más expresiva y clara
   - Ideal para personajes principales
   - Usado por: Ada, Luna, Sol, Ken, Nimbo

2. **es_ES-mls_9972-low** (61 MB)
   - Voz más ligera y rápida
   - Ideal para respuestas frecuentes
   - Usado por: Coral, Eco, Lumi, Selene

## ⚡ Rendimiento

- **Factor de tiempo real**: 0.07-0.10 (muy rápido)
- **Velocidad de carga del modelo**: ~0.2 segundos
- **Procesamiento**: Local, sin costes de API

## 🔧 Configuración en el Código

El servicio de Piper TTS está configurado en:
- `lib/piper-tts-service.ts`

### Rutas configuradas:
```typescript
const PIPER_BINARY = '/home/ubuntu/piper/piper/piper'
const PIPER_MODELS_DIR = '/home/ubuntu/piper/models'
const VOICE_CACHE_DIR = '/tmp/hogara_voices'
```

## 📝 Mapeo de Personajes a Voces

| Personaje | Voz | Características |
|-----------|-----|-----------------|
| Ada | es_ES-davefx-medium | Voz femenina calmada |
| Coral | es_ES-mls_9972-low | Voz femenina joven |
| Luna | es_ES-davefx-medium | Voz femenina suave |
| Eco | es_ES-mls_9972-low | Voz masculina energética |
| Sol | es_ES-davefx-medium | Voz femenina cálida |
| Ken | es_ES-davefx-medium | Voz masculina profunda |
| Lumi | es_ES-mls_9972-low | Voz femenina brillante |
| Nimbo | es_ES-davefx-medium | Voz etérea |
| Selene | es_ES-mls_9972-low | Voz misteriosa |

## 🧪 Comando de Prueba

Para probar la generación de voz:

```bash
cd /home/ubuntu/piper
LD_LIBRARY_PATH=/home/ubuntu/piper/piper:$LD_LIBRARY_PATH \
  ./piper/piper \
  --model models/es_ES-davefx-medium.onnx \
  --output_file test.wav \
  <<< "Hola, soy tu acompañante mágico"
```

## 💰 Ventajas del Sistema

1. **Sin costes de API**: Todo se ejecuta localmente
2. **Control total**: No dependes de servicios externos
3. **Privacidad**: Los datos de los usuarios nunca salen del servidor
4. **Rápido**: Factor de tiempo real < 0.1 significa procesamiento instantáneo
5. **Escalable**: No hay límites de uso ni cuotas mensuales

## 🎯 Integración con el Sistema de Voces Mágicas

El servicio está listo para ser usado por:
- `/api/magic-voice` - Endpoint principal
- `lib/magic-voice-manager.ts` - Gestor de límites
- Caché de voces por personaje

## 📊 Siguiente Paso

Ahora que Piper TTS está instalado:
1. ✅ Piper instalado y funcionando
2. ⏳ Integrar con el sistema de voces mágicas
3. ⏳ Probar la generación de voces desde la aplicación
4. ⏳ Implementar el sistema de caché

## 🎨 Sistema de Voces Mágicas - Estructura Completa

### Plan Gratuito "Personajes Mágicos"
- 9 personajes desbloqueados
- Chat GPT-4 mini: 100 mensajes/mes
- Voces gratuitas vía Web Speech API (navegador)
- Conversaciones simples

### Plan Premium (€7 o €15)
- 200 mensajes/mes (100 base + 100 del plan mágico)
- Voces Piper TTS de alta calidad
- Funcionalidades avanzadas

### Sistema de Créditos
- Mensajes extra disponibles para compra
- Control estricto de costes (máx €0.30/usuario/mes para Gara)
