
# 🎤 DIAGNÓSTICO COMPLETO: Sistema de Voz de Lumi

**Fecha**: 28 de octubre de 2025  
**Reporte**: Análisis técnico del problema de voz en acompañantes

---

## ❌ PROBLEMA REPORTADO

El usuario reporta que:
- ✅ El micrófono detecta la voz (reconocimiento funciona)
- ❌ No recibe respuesta del personaje (TTS no se ejecuta)

---

## 🔍 PROBLEMAS IDENTIFICADOS

### 1. **URL INCORRECTA en API de Voice Chat** 🚨 CRÍTICO
**Archivo**: `app/api/companion/voice-chat/route.ts` (línea 5)
```typescript
// ❌ INCORRECTO:
const API_ENDPOINT = 'https://apis.abacus.ai/chat/completions/v3';

// ✅ CORRECTO:
const API_ENDPOINT = 'https://apps.abacus.ai/v1/chat/completions';
```

**Impacto**: La API no responde porque el endpoint no existe → No hay respuesta del LLM → No hay TTS

---

### 2. **Arquitectura Desorganizada** ⚠️ MEDIO
- Se creó el hook `useVoiceChat.ts` pero NO se usa en el componente
- El componente `voice-companion-chat.tsx` implementa su propia lógica de voz
- Esto causa duplicación de código y dificulta el debugging

**Dos flujos diferentes**:
```
Flujo 1 (Hook - NO USADO):
  STT → useVoiceChat → /api/companion/voice-chat → LLM → TTS

Flujo 2 (Componente - USADO):
  STT → voice-companion-chat → /api/companion/chat → LLM → TTS
```

---

### 3. **Logs Excesivos** 💡 MENOR
El componente tiene muchos `console.log` que pueden ocultar errores reales en la consola del navegador.

---

### 4. **Posible Problema de Carga de Voces** ⚠️ MEDIO
Las voces del Web Speech API tardan en cargar. Si intentamos hablar antes de que estén disponibles, puede fallar silenciosamente.

**Código actual** (líneas 484-491):
```typescript
if (window.speechSynthesis.getVoices().length === 0) {
  window.speechSynthesis.onvoiceschanged = () => {
    speak()
  }
} else {
  speak()
}
```

---

## ✅ SOLUCIONES PROPUESTAS

### Solución 1: Corregir URL de API ✅ PRIORITARIO
Cambiar la URL en `/api/companion/voice-chat/route.ts` a:
```typescript
const API_ENDPOINT = 'https://apps.abacus.ai/v1/chat/completions';
```

### Solución 2: Simplificar Arquitectura ✅ RECOMENDADO
**Opción A**: Refactorizar `voice-companion-chat.tsx` para usar el hook `useVoiceChat.ts`  
**Opción B**: Eliminar el hook y mantener solo la implementación del componente (más simple)

### Solución 3: Mejorar Manejo de Errores ✅ RECOMENDADO
- Añadir console.error solo para errores críticos
- Mostrar mensajes de error al usuario
- Timeout más largo para carga de voces

### Solución 4: Verificar Permisos y Estado ✅ RECOMENDADO
- Verificar que el micrófono tiene permisos
- Verificar que las voces están disponibles antes de hablar
- Mostrar indicadores visuales claros del estado

---

## 🎯 PLAN DE ACCIÓN

1. **Corregir URL de API** (2 min)
2. **Eliminar logs innecesarios** (3 min)
3. **Mejorar manejo de errores en TTS** (5 min)
4. **Probar sistema completo** (10 min)

---

## 📊 ANÁLISIS TÉCNICO

### Flujo Actual (Problemático):
```mermaid
Usuario habla → STT detecta → Envía a /api/companion/chat → LLM responde → [FALLA AQUÍ] → TTS no ejecuta
```

### Causa raíz probable:
1. La API `/api/companion/voice-chat` tiene URL incorrecta
2. Aunque el componente usa `/api/companion/chat` (que funciona), puede haber problema en el TTS
3. Las voces pueden no estar cargadas cuando se intenta hablar

---

## 🧪 PRUEBAS A REALIZAR

1. ✅ Verificar que `/api/companion/chat` responde correctamente
2. ✅ Verificar que el LLM genera respuesta
3. ✅ Verificar que `speakText()` se ejecuta
4. ✅ Verificar que las voces están disponibles
5. ✅ Verificar que no hay errores en consola
6. ✅ Verificar que el audio del navegador no está silenciado

---

## 🔧 ARCHIVOS A MODIFICAR

1. `/app/api/companion/voice-chat/route.ts` - Corregir URL
2. `/components/companion/voice-companion-chat.tsx` - Mejorar TTS y logs
3. `/hooks/useVoiceChat.ts` - (Opcional) Simplificar o eliminar

---

## 📝 NOTAS IMPORTANTES

- La API key está correctamente configurada: `fcbbddb41f734773bff1a2501adc4f08`
- El endpoint `/api/companion/chat` usa la URL correcta: `https://apps.abacus.ai/v1/chat/completions`
- El endpoint `/api/companion/voice-chat` usa URL incorrecta (pero no se usa actualmente)
- Web Speech API requiere HTTPS (ya disponible en producción)
- Chrome/Edge son los navegadores más compatibles

---

## 🎬 PRÓXIMOS PASOS

1. Implementar las correcciones
2. Realizar pruebas exhaustivas
3. Documentar el flujo correcto
4. Desplegar y verificar

---

**Estado**: 🟡 En proceso de corrección  
**Prioridad**: 🔴 ALTA  
**Tiempo estimado**: 20 minutos

