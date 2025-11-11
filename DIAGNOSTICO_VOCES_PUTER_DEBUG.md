# 🔍 DIAGNÓSTICO: Sistema de Voces Puter.js - Debug Completo

## 📅 Fecha: 31 de Octubre de 2025

## 🎯 OBJETIVO

Diagnosticar por qué las voces femeninas están usando Piper TTS en lugar de Puter.js TTS (AWS Polly).

---

## ✅ VERIFICACIONES REALIZADAS

### 1. Configuración de Voces (`voice-config.ts`)

✅ **Ada (hada):**
- usePuter: true
- usePiper: false
- gender: female

✅ **Luna (lumi):**
- usePuter: true
- usePiper: false
- gender: female

✅ **Coral (nimbo):**
- usePuter: true
- usePiper: false
- gender: female

✅ **Aurora (human):**
- usePuter: true
- usePiper: false
- gender: female

### 2. Script de Puter.js en Layout

✅ **Ubicación:** `/app/layout.tsx`
✅ **Script:** `<script src="https://js.puter.com/v2/" defer></script>`
✅ **Estado:** CARGADO CORRECTAMENTE

### 3. Lógica de Selección de Voces

✅ **Prioridad 1:** Verificar `usePuter === true` → Usar Puter.js
✅ **Prioridad 2:** Verificar `usePiper === true` → Usar Piper TTS
✅ **Prioridad 3:** Default → Web Speech API

---

## 🔍 LOGS AGREGADOS PARA DEBUG

He agregado logs detallados en `simple-emotional-chat.tsx` para rastrear:

1. ⚙️ Configuración de voz detectada
2. ✨ Qué sistema de voz se está seleccionando
3. ✅ Si Puter.js está disponible en window
4. ❌ Cualquier error que ocurra

---

## 🧪 INSTRUCCIONES PARA PROBAR Y DIAGNOSTICAR

### Paso 1: Limpiar Caché Completamente

1. Abre DevTools (F12)
2. Ve a la pestaña **Application** (o Aplicación)
3. En el menú izquierdo, haz clic en **Clear storage** (Borrar almacenamiento)
4. Marca todas las casillas
5. Haz clic en **Clear site data**
6. **Recarga la página con Ctrl + Shift + R**

### Paso 2: Abrir la Consola

1. Mantén abierto DevTools (F12)
2. Ve a la pestaña **Console**
3. Asegúrate de que se muestren todos los niveles de log (Info, Warnings, Errors)

### Paso 3: Acceder al Chat con Voz

1. Ve a **Premium → Desahogo**
2. Selecciona **Ada, Luna, Coral o Aurora**
3. Espera a que cargue el companion

### Paso 4: Enviar un Mensaje

1. Escribe: "Hola, ¿cómo estás?"
2. Presiona Enter o haz clic en Enviar
3. **OBSERVA LA CONSOLA INMEDIATAMENTE**

---

## 📋 LOGS QUE DEBES VER

### Si Puter.js está funcionando correctamente:

```
═══════════════════════════════════════════
🎤 INICIANDO VOZ MÁGICA
═══════════════════════════════════════════
Companion: Ada ( hada )
Género: female
⚙️ CONFIGURACIÓN DE VOZ:
  - usePuter: true
  - usePiper: false
  - gender: female
Texto: Hola, ¿cómo estás?...
✨✨✨ USANDO PUTER.JS TTS - VOZ MÁGICA AWS POLLY ✨✨✨
  Personaje: Ada
  Verificando si Puter.js está disponible...
  ✅ Puter.js detectado y disponible
🌟 Iniciando Puter.js TTS Mágico...
✨ VOZ MÁGICA CONFIGURADA:
  - Personaje: Ada
  - Personalidad: 🧚 Hada mágica de los sueños
  - Motor: generative
  - Voz AWS Polly: Mia
  - Idioma: es-MX
🔊 Generando audio mágico con Puter.js + AWS Polly...
✅ Audio mágico generado para Ada
▶️ Ada está hablando...
🎵 Voz mágica de Ada reproduciéndose...
✅ Ada terminó de hablar ✨
✅ Reproducción Puter.js TTS completada con éxito
═══════════════════════════════════════════
```

### Si está cayendo a Piper TTS (PROBLEMA):

```
═══════════════════════════════════════════
🎤 INICIANDO VOZ MÁGICA
═══════════════════════════════════════════
Companion: Ada ( hada )
Género: female
⚙️ CONFIGURACIÓN DE VOZ:
  - usePuter: true      ← Debería ser true
  - usePiper: false     ← Debería ser false
  - gender: female
👩 Usando Piper TTS (voz femenina natural)    ← ❌ NO DEBERÍA LLEGAR AQUÍ
```

### Si Puter.js no está cargado:

```
✨✨✨ USANDO PUTER.JS TTS - VOZ MÁGICA AWS POLLY ✨✨✨
  Personaje: Ada
  Verificando si Puter.js está disponible...
  ❌ Puter.js NO está cargado aún    ← PROBLEMA: Script no cargó
```

---

## 🔧 SOLUCIONES SEGÚN EL PROBLEMA

### Problema 1: "usePuter: false" en la consola

**Causa:** La configuración no se está cargando correctamente

**Solución:**
```bash
# Verificar que la configuración esté bien
cd /home/ubuntu/hogara_planner/nextjs_space
grep -A 10 "hada:" lib/voice-config.ts
```

### Problema 2: "Puter.js NO está cargado"

**Causa:** El script de Puter.js no se cargó o se bloqueó

**Soluciones:**
1. Verificar la conexión a Internet
2. Abrir la pestaña Network en DevTools y buscar "puter.com"
3. Ver si hay errores de CORS o bloqueos
4. Verificar que no haya bloqueadores de scripts activos

### Problema 3: "Error con Puter.js TTS"

**Causa:** Puter.js está cargado pero falla al generar audio

**Solución:**
1. Ver el mensaje de error completo en la consola
2. Copiar el error exacto
3. Verificar si es un problema de permisos de audio en el navegador

### Problema 4: Cae directamente a Piper TTS

**Causa:** La lógica de decisión no está funcionando

**Solución:**
1. Verificar que `usePuter` sea exactamente `true` (booleano, no string)
2. Revisar la configuración en `voice-config.ts`

---

## 🎯 ACCIÓN INMEDIATA

**Por favor, haz lo siguiente:**

1. **Limpia la caché completamente** (Paso 1)
2. **Abre la consola** (Paso 2)
3. **Envía un mensaje a Ada** (Pasos 3-4)
4. **Copia TODOS los logs** que aparezcan en la consola
5. **Pégalos aquí** para que pueda ver exactamente qué está pasando

---

## 📊 ESTADO ACTUAL

- ✅ Configuración de voice-config.ts: CORRECTA
- ✅ Script de Puter.js en layout: CARGADO
- ✅ Lógica de selección: CORRECTA
- ✅ Logs de debugging: AGREGADOS
- ❓ Causa del problema: **PENDIENTE DE DIAGNOSTICAR CON LOGS**

---

## 💡 TEORÍAS SOBRE EL PROBLEMA

### Teoría 1: Caché del navegador
- El navegador está usando la versión vieja del código
- **Solución:** Limpieza completa de caché

### Teoría 2: Puter.js no carga a tiempo
- El script se carga con `defer`, puede tardar
- **Solución:** Verificar en la consola si `window.puter` existe

### Teoría 3: Configuración no se actualiza
- El getVoiceConfig está devolviendo valores viejos
- **Solución:** Verificar los logs de configuración

### Teoría 4: Error silencioso en Puter.js
- Puter.js falla y cae al fallback sin loguear
- **Solución:** Los nuevos logs lo detectarán

---

**PRÓXIMO PASO: Necesito que veas los logs en la consola y me digas qué mensaje aparece. Con eso sabré exactamente qué está fallando.**

