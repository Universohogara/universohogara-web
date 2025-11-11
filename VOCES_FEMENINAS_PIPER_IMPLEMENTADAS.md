# 🎤 VOCES FEMENINAS GRATUITAS CON PIPER TTS

## ✅ ¿Qué se implementó?

He configurado **voces 100% gratuitas y locales** usando **Piper TTS** (sistema de código abierto) para que **Hada y Aurora** tengan voces claramente femeninas y naturales.

## 🎭 Nuevas Voces Configuradas

### 🧚‍♀️ **Hada** 
- **Voz**: `Sharvard` (español europeo)
- **Calidad**: Media-Alta
- **Características**: Voz femenina cristalina y mágica, perfecta para el personaje de Hada

### 🌅 **Aurora**
- **Voz**: `Claude` (español mexicano)  
- **Calidad**: Alta
- **Características**: Voz femenina cálida y dulce, perfecta para Aurora

### 💎 **Ada**
- **Voz**: `Claude` (español mexicano)
- **Calidad**: Alta
- **Características**: Voz femenina clara y expresiva

## 🆓 **100% GRATIS - Sin límites**

- ✅ **Sin costes de API** - Todo se ejecuta localmente en tu servidor
- ✅ **Sin límites de uso** - Genera tantas voces como necesites
- ✅ **Caché inteligente** - Las respuestas se guardan para ser más rápido
- ✅ **Voces naturales** - Modelos de alta calidad entrenados con datos reales

## 📊 Modelos Descargados

Los siguientes modelos de voz están ahora disponibles en `/home/ubuntu/piper/models/`:

```
✅ es_ES-sharvard-medium.onnx (74 MB) - Voz femenina española
✅ es_MX-claude-high.onnx (73 MB) - Voz femenina mexicana
```

## 🔧 Cambios Técnicos Realizados

### 1. **Actualizado `/lib/piper-tts-service.ts`**
   - Configuradas las voces femeninas para Hada, Aurora y Ada
   - Mapeados todos los companions a sus voces correspondientes

### 2. **Actualizado `/api/tts/route.ts`**
   - Cambiado de Abacus AI a Piper TTS (local y gratis)
   - Implementado sistema de caché inteligente
   - Formato de audio: WAV (alta calidad)

### 3. **Mantenido `voice-config.ts`**
   - Las configuraciones de pitch y rate se mantienen para el Web Speech API
   - Elfo ahora tiene voz aguda (intercambiada con Hada)

## 🎯 Cómo Funciona

1. **Usuario envía mensaje** → Companion responde
2. **Sistema limpia el texto** → Elimina emojis y símbolos
3. **Piper TTS genera audio** → Usando el modelo de voz femenina configurado
4. **Sistema verifica caché** → Si ya se generó antes, lo reutiliza
5. **Audio se reproduce** → El navegador reproduce la voz natural femenina

## 📝 Testing

Puedes probar las voces con:

```bash
# Voz de Hada (Sharvard - español europeo)
echo "Hola, soy Hada. Mi voz es mágica y cristalina." | /home/ubuntu/piper/piper/piper --model /home/ubuntu/piper/models/es_ES-sharvard-medium.onnx --output_file test_hada.wav

# Voz de Aurora (Claude - español mexicano)
echo "Hola, soy Aurora. Mi voz es cálida como el amanecer." | /home/ubuntu/piper/piper/piper --model /home/ubuntu/piper/models/es_MX-claude-high.onnx --output_file test_aurora.wav
```

## 🎨 Características de las Voces

| Companion | Modelo | Idioma | Calidad | Género | Pitch |
|-----------|--------|--------|---------|---------|-------|
| **Hada** | Sharvard | 🇪🇸 ES | Media | ♀️ Femenina | Alto |
| **Aurora** | Claude | 🇲🇽 MX | Alta | ♀️ Femenina | Medio-Alto |
| **Ada** | Claude | 🇲🇽 MX | Alta | ♀️ Femenina | Alto |
| Luna | Sharvard | 🇪🇸 ES | Media | ♀️ Femenina | Alto |
| Lumi | Sharvard | 🇪🇸 ES | Media | ♀️ Femenina | Alto |
| Ember | Claude | 🇲🇽 MX | Alta | ♀️ Femenina | Medio-Alto |

## 🚀 Ventajas del Nuevo Sistema

1. **Coste $0** - No pagas nada por las voces
2. **Privacidad** - Todo se procesa localmente, no se envía información externa
3. **Velocidad** - Generación rápida con caché inteligente
4. **Calidad** - Voces naturales y expresivas
5. **Escalabilidad** - Sin límites de uso o cuotas

## 💡 Próximos Pasos

Si quieres probar las voces:

1. **Ve a tu app** → https://hogaraplanner.abacusai.app/
2. **Inicia sesión** con tu cuenta
3. **Selecciona Hada o Aurora** como companion
4. **Envía un mensaje** y escucha su voz femenina natural

¡Las voces ahora suenan claramente femeninas y sin ningún coste adicional! 🎉

---

**Fecha de implementación**: 31 de octubre de 2025  
**Checkpoint guardado**: "Voces femeninas Piper TTS gratuitas"
