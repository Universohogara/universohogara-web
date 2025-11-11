# Sistema de Voces Emocionales - Implementación Completa

## 📋 Resumen Ejecutivo

Se ha implementado exitosamente el **Sistema de Voces Emocionales**, que permite reproducir frases pregrabadas con voces superrealistas de ElevenLabs en momentos emocionales clave, **sin consumir minutos por usuario en tiempo real**.

### Ventajas Clave
- ✅ **Costo fijo**: Las frases se generan una sola vez y se almacenan
- ✅ **Escalable**: No importa cuántos usuarios reproduzcan las frases
- ✅ **Experiencia premium**: Voces realistas en momentos importantes
- ✅ **Narrativa mágica**: Integrado con la identidad de marca Hogara
- ✅ **Flexible**: Fácil agregar, editar o eliminar frases

---

## 🏗️ Arquitectura del Sistema

### 1. Base de Datos

#### Tabla: `emotional_voice_phrases`
Almacena las frases pregrabadas con sus metadatos:
- `id`: Identificador único
- `companion_type`: Tipo de companion (ken, ada, lumi, etc.)
- `phrase_id`: ID único de la frase (ej: ken_consolo_01)
- `emotion_type`: Tipo de emoción (bienvenida, consolo, animo, felicitacion)
- `text_content`: Texto de la frase
- `audio_url`: URL del archivo MP3 en CDN
- `duration_seconds`: Duración del audio
- `language`: Idioma (default: es)
- `version`: Versión de la frase (para actualizaciones)
- `is_active`: Si está activa para usar
- `tone`: Tono de la voz (warm, gentle, encouraging, joyful)
- `metadata`: JSON con metadatos adicionales

#### Tabla: `emotional_voice_phrase_play_logs`
Registra cada reproducción para analytics:
- `id`: Identificador único
- `user_id`: Usuario que reprodujo
- `phrase_id`: Frase reproducida
- `trigger`: Descripción del trigger que la activó
- `context`: Contexto de la conversación
- `played_at`: Timestamp de reproducción

### 2. API Endpoints

#### `/api/companion/emotional-voices` (CRUD Principal)
- **GET**: Obtener frases (filtros: companion_type, emotion_type, is_active)
- **POST**: Crear nueva frase (solo admin)
- **PUT**: Actualizar frase existente (solo admin)
- **DELETE**: Eliminar frase (solo admin)

#### `/api/companion/emotional-voices/trigger`
- **POST**: Obtener frase por trigger + registrar reproducción
  - Input: `{ companion_type, emotion_type, trigger, context }`
  - Output: `{ phrase: { text_content, audio_url, duration_seconds, ... } }`
  - Selecciona frase aleatoria para variedad
  - Registra log de reproducción
  - Fallback si no hay frases disponibles

- **GET**: Obtener estadísticas de reproducción
  - Query params: companion_type, emotion_type, days
  - Output: `{ total_plays, by_emotion, by_companion, by_trigger }`

### 3. Sistema de Triggers Inteligente

**Archivo**: `lib/emotional-triggers.ts`

Detecta automáticamente cuándo activar cada tipo de voz emocional:

#### Tipos de Emociones
1. **Bienvenida** (🌟)
   - Primera interacción del día
   - Saludos explícitos ("hola", "buenos días")

2. **Consuelo** (💙)
   - Palabras clave: triste, llorar, dolor, solo/a, mal
   - Emojis: 😢, 😭, 💔
   - Mood negativo del usuario

3. **Ánimo** (⭐)
   - Palabras clave: necesito ánimo, motivame, voy a intentar
   - Usuario muestra esfuerzo o determinación

4. **Felicitación** (🎉)
   - Logros completados
   - Palabras clave: lo logré, éxito, feliz
   - Emojis: 🎉, 🥳, ✅

#### Funciones Principales
```typescript
// Analiza un mensaje y decide si activar trigger
analyzeTrigger(context: ConversationContext): TriggerResult

// Evita activar voces muy frecuentemente
shouldThrottleTrigger(lastTriggerTime, minimumIntervalMinutes): boolean

// Analiza patrones en la conversación
analyzeConversationPattern(messages): TriggerResult
```

### 4. Componente de Reproducción

**Archivo**: `components/companion/emotional-voice-player.tsx`

Componente visual que:
- Muestra animación de aura pulsante durante reproducción
- Reproduce el audio automáticamente (opcional)
- Muestra el texto de la frase con efecto elegante
- Maneja fallback si no hay audio disponible
- Animaciones suaves con framer-motion

**Props**:
```typescript
{
  companionType: string;          // "ken", "ada", etc.
  companionName?: string;         // Nombre del companion
  emotionType: EmotionType;       // "bienvenida" | "consolo" | "animo" | "felicitacion"
  trigger: string;                // Descripción del trigger
  context?: string;               // Contexto de la conversación
  onComplete?: () => void;        // Callback al terminar
  onError?: (error) => void;      // Callback en error
  autoPlay?: boolean;             // Auto-reproducir (default: true)
}
```

### 5. Integración en Chat Companion

**Archivo**: `components/companion/companion-chat.tsx`

El chat ahora:
1. Detecta triggers emocionales en cada mensaje del usuario
2. Verifica que no esté en throttle (mínimo 5 min entre voces)
3. Activa el `EmotionalVoicePlayer` cuando corresponde
4. Muestra la animación sobre el área de chat
5. Oculta el player automáticamente después de reproducir

### 6. Panel Administrativo

**Ruta**: `/premium/admin/voces-emocionales`

Panel completo para gestionar frases:
- ✅ Crear nuevas frases
- ✅ Editar frases existentes
- ✅ Eliminar frases
- ✅ Filtrar por companion y emoción
- ✅ Activar/desactivar frases
- ✅ Preview de audio integrado
- ✅ Versionado de frases
- ✅ Estadísticas de uso

---

## 🎯 Flujo de Usuario

### Ejemplo 1: Usuario triste necesita consuelo

1. **Usuario escribe**: "Me siento muy triste hoy 😢"
2. **Sistema detecta**:
   - Palabras clave: "triste"
   - Emoji: 😢
   - Confidence: 0.8 (alta)
   - Trigger: "consolo"
3. **Sistema verifica**: No hay throttle activo
4. **Sistema activa**: `EmotionalVoicePlayer` con emotion_type="consolo"
5. **Player hace fetch**: `POST /api/companion/emotional-voices/trigger`
6. **API selecciona**: Una frase aleatoria de Ken tipo "consolo"
7. **API registra**: Log de reproducción en base de datos
8. **Player muestra**: Animación + audio + texto
9. **Usuario escucha**: "Estoy aquí para escucharte. Respira conmigo, no estás sola."

### Ejemplo 2: Usuario logra un reto

1. **Usuario completa**: Un reto de 21 días
2. **Sistema detecta**: `recentAchievements` tiene datos
3. **Sistema activa**: Voz de "felicitacion"
4. **Usuario escucha**: "¡Lo lograste! Estoy tan orgulloso de ti. Celebra este momento."

---

## 📦 Archivos Creados/Modificados

### Nuevos Archivos
```
prisma/migrations/add_emotional_voice_phrases.sql
run-emotional-voice-migration.ts
app/api/companion/emotional-voices/route.ts
app/api/companion/emotional-voices/trigger/route.ts
components/companion/emotional-voice-player.tsx
lib/emotional-triggers.ts
app/premium/admin/voces-emocionales/page.tsx
scripts/seed-emotional-phrases.ts
```

### Archivos Modificados
```
prisma/schema.prisma                    - Nuevos modelos
components/companion/companion-chat.tsx  - Integración de triggers
```

---

## 🚀 Cómo Usar el Sistema

### Para el Equipo (Generación de Frases)

#### Paso 1: Preparar las Frases

1. **Escribir el texto** de cada frase en un documento
2. **Especificar metadatos**:
   - Companion (ken, ada, lumi, sprig, etc.)
   - Tipo de emoción (bienvenida, consolo, animo, felicitacion)
   - Tono deseado (warm, gentle, encouraging, joyful)
   - Idioma

**Ejemplo**:
```
Companion: Ken
Emoción: Consuelo
Tono: Gentle
Frase: "Estoy aquí para escucharte. Respira conmigo, no estás sola."
```

#### Paso 2: Generar con ElevenLabs

1. Ir a [ElevenLabs](https://elevenlabs.io)
2. Seleccionar la voz configurada para cada companion
3. Pegar el texto
4. Configurar settings:
   - Stability: 0.5-0.7 (para naturalidad)
   - Clarity: 0.7-0.9 (para claridad)
5. Generar y descargar como MP3

#### Paso 3: Subir al CDN

1. Subir el MP3 a tu CDN/S3
2. Copiar la URL pública del archivo
3. **Nombrar el archivo**: `companion_emocion_numero.mp3`
   - Ejemplo: `ken_consolo_01.mp3`

#### Paso 4: Registrar en la App

Opción A - **Panel Admin** (recomendado):
1. Ir a `/premium/admin/voces-emocionales`
2. Click en "Nueva Frase"
3. Llenar el formulario:
   - Companion: Ken
   - Tipo de emoción: Consuelo
   - ID de frase: ken_consolo_01
   - Texto: "Estoy aquí para escucharte..."
   - URL del audio: https://cdn.hogara.com/voices/ken_consolo_01.mp3
   - Duración: 5.5 segundos
   - Tono: Gentle
4. Guardar

Opción B - **API directa**:
```bash
curl -X POST https://hogaraplanner.abacusai.app/api/companion/emotional-voices \
  -H "Content-Type: application/json" \
  -d '{
    "companion_type": "ken",
    "phrase_id": "ken_consolo_01",
    "emotion_type": "consolo",
    "text_content": "Estoy aquí para escucharte...",
    "audio_url": "https://cdn.hogara.com/voices/ken_consolo_01.mp3",
    "duration_seconds": 5.5,
    "tone": "gentle"
  }'
```

### Para Desarrolladores

#### Activar manualmente una voz emocional

```typescript
import EmotionalVoicePlayer from '@/components/companion/emotional-voice-player';

// En tu componente
<EmotionalVoicePlayer
  companionType="ken"
  companionName="Ken"
  emotionType="consolo"
  trigger="Usuario solicitó apoyo"
  context="Me siento triste hoy"
  autoPlay={true}
  onComplete={() => console.log('Reproducción completa')}
  onError={(error) => console.error('Error:', error)}
/>
```

#### Analizar si debe activarse un trigger

```typescript
import { analyzeTrigger } from '@/lib/emotional-triggers';

const result = analyzeTrigger({
  userMessage: "Me siento muy triste hoy",
  previousMessages: chatHistory,
  userMood: "sad",
  isFirstInteractionToday: false
});

if (result.shouldTrigger) {
  console.log(`Activar: ${result.emotionType}`);
  console.log(`Confidence: ${result.confidence}`);
  console.log(`Reason: ${result.reason}`);
}
```

---

## 📊 Estadísticas y Analytics

### Ver estadísticas de reproducción

```bash
# Últimos 30 días, todos los companions
GET /api/companion/emotional-voices/trigger?days=30

# Filtrar por companion
GET /api/companion/emotional-voices/trigger?companion_type=ken&days=7

# Filtrar por emoción
GET /api/companion/emotional-voices/trigger?emotion_type=consolo&days=14
```

**Respuesta**:
```json
{
  "success": true,
  "stats": {
    "total_plays": 1247,
    "by_emotion": {
      "bienvenida": 523,
      "consolo": 312,
      "animo": 267,
      "felicitacion": 145
    },
    "by_companion": {
      "ken": 645,
      "ada": 378,
      "lumi": 224
    },
    "by_trigger": {
      "Primera interacción del día": 523,
      "Palabras clave: triste": 198,
      "Usuario solicitó apoyo explícitamente": 114
    }
  },
  "period_days": 30
}
```

---

## 🎨 Personalización

### Agregar un nuevo tipo de emoción

1. **Actualizar tipo en TypeScript**:
```typescript
// lib/emotional-triggers.ts
export type EmotionType = 'bienvenida' | 'consolo' | 'animo' | 'felicitacion' | 'celebracion';
```

2. **Agregar keywords**:
```typescript
const emotionKeywords = {
  // ... existentes
  celebracion: {
    strong: ['fiesta', 'cumpleaños', 'aniversario'],
    medium: ['especial', 'importante']
  }
};
```

3. **Agregar configuración visual**:
```typescript
// components/companion/emotional-voice-player.tsx
const emotionConfig = {
  // ... existentes
  celebracion: {
    color: '#FF1493',
    icon: '🎊',
    auraColor: 'from-pink-500/30 to-purple-500/20',
    label: 'Celebra contigo'
  }
};
```

4. **Crear frases** de ejemplo para el nuevo tipo

---

## 🔧 Mantenimiento

### Actualizar una frase existente

1. Generar nueva versión del audio
2. Subir al CDN con nuevo nombre (ej: `ken_consolo_01_v2.mp3`)
3. Actualizar en panel admin:
   - URL del audio → nueva URL
   - Versión se incrementa automáticamente

### Desactivar una frase temporalmente

1. Ir al panel admin
2. Encontrar la frase
3. Desmarcar "Activa"
4. La frase ya no se usará, pero se mantiene en BD

### Ver logs de reproducción

```sql
SELECT 
  p.companion_type,
  p.emotion_type,
  COUNT(*) as total_plays,
  COUNT(DISTINCT l.user_id) as unique_users
FROM emotional_voice_phrase_play_logs l
JOIN emotional_voice_phrases p ON l.phrase_id = p.id
WHERE l.played_at > NOW() - INTERVAL '7 days'
GROUP BY p.companion_type, p.emotion_type
ORDER BY total_plays DESC;
```

---

## 🐛 Troubleshooting

### Problema: No se activan las voces emocionales

**Verificar**:
1. ¿Hay frases en la base de datos?
   ```sql
   SELECT * FROM emotional_voice_phrases WHERE is_active = true;
   ```
2. ¿El confidence score es suficiente? (debe ser > 0.65)
3. ¿Está en throttle? (mínimo 5 min entre voces)
4. Revisar console logs del navegador

### Problema: Audio no se reproduce

**Verificar**:
1. ¿La URL del audio es accesible públicamente?
2. ¿El archivo es MP3 válido?
3. ¿Hay errores CORS?
4. Revisar Network tab en DevTools

### Problema: Triggers se activan muy frecuentemente

**Solución**: Ajustar el intervalo de throttle en `companion-chat.tsx`:
```typescript
// Cambiar de 5 minutos a 10 minutos
!shouldThrottleTrigger(lastVoiceTriggerTime, 10)
```

### Problema: Triggers no se activan cuando deberían

**Solución**: Ajustar el confidence threshold en `companion-chat.tsx`:
```typescript
// Reducir de 0.65 a 0.55
triggerAnalysis.confidence > 0.55
```

---

## 📈 Próximas Mejoras Sugeridas

1. **Multi-idioma**: Frases en inglés, catalán, etc.
2. **Horario dinámico**: Diferentes frases según hora del día
3. **Personalización**: Usuario puede elegir qué triggers activar
4. **A/B Testing**: Probar diferentes versiones de frases
5. **ML Triggers**: Usar ML para detectar emociones más precisamente
6. **Voice Cloning**: Clonar voz del usuario para respuestas personalizadas

---

## 🎓 Conceptos Clave

### Por qué este sistema es eficiente

**Problema Original**:
- Cada reproducción consume minutos de ElevenLabs
- Con 1000 usuarios × 10 frases/día = 10,000 solicitudes/día
- Costo y latencia inmanejables

**Solución Implementada**:
- Generar frases una sola vez
- Almacenar como archivos estáticos
- Reproducir desde CDN (gratis, instantáneo, escalable)
- Solo pagar por la generación inicial

**Resultado**:
- Costo fijo mensual en lugar de variable
- Latencia < 100ms (vs 2-5 segundos con API)
- Escalable a millones de usuarios
- Experiencia premium garantizada

---

## ✅ Checklist de Implementación

- [x] Modelos de base de datos creados
- [x] Migración ejecutada exitosamente
- [x] API endpoints implementados y testeados
- [x] Sistema de triggers inteligente
- [x] Componente de reproducción visual
- [x] Integración en chat companion
- [x] Panel administrativo completo
- [x] Script de seeding con ejemplos
- [x] Documentación completa
- [x] Build exitoso sin errores

---

## 🎉 ¡Sistema Listo para Producción!

El sistema está **completamente funcional** y listo para usar. Solo falta:

1. **Generar los audios reales** con ElevenLabs
2. **Subir a CDN** y obtener URLs
3. **Agregar frases** mediante panel admin
4. **¡Disfrutar de las voces emocionales!** ✨

---

**Fecha de implementación**: 29 de octubre de 2025
**Estado**: ✅ Completado y funcionando
**Checkpoint guardado**: "Sistema Voces Emocionales Completo"
