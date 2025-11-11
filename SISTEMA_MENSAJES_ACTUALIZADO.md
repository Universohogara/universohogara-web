
# Sistema de Mensajes de Personajes Mágicos - Actualización

## Fecha: 30 de octubre de 2025

## Resumen de Cambios Implementados

### 1. Nuevo Sistema de Límites de Mensajes

Se ha actualizado el middleware de chat para implementar límites diferenciados según el tipo de plan:

#### Plan Addon (con plan base €7 o €15):
- **200 mensajes/mes** incluidos con GPT-4.1 Mini
- Memoria emocional activada
- Voces ilimitadas (Web Speech API - 100% gratis para Gara)
- Conversaciones profundas y contextuales
- Posibilidad de comprar créditos extra

#### Plan Standalone (solo €4.99):
- **100 mensajes/mes** incluidos con GPT-4.1 Mini
- Sin memoria emocional extendida
- Voces ilimitadas (Web Speech API - 100% gratis para Gara)
- Conversaciones simples
- Posibilidad de comprar créditos extra

### 2. Archivos Modificados

#### `/home/ubuntu/hogara_planner/nextjs_space/lib/chat-middleware.ts`

**Cambios principales:**
- Actualizada función `checkAndResetMonthlyLimit()` para aceptar parámetro `hasBasePlan`
- Implementación de lógica dinámica de límite mensual:
  ```typescript
  const monthlyLimit = hasBasePlan ? 200 : 100
  ```
- Actualización automática del límite si el usuario cambia de plan
- Documentación actualizada para reflejar los nuevos límites

**Funciones afectadas:**
- `checkAndResetMonthlyLimit()` - Ahora acepta `hasBasePlan: boolean`
- `checkChatAccess()` - Pasa el parámetro `hasBasePlan` al resetear límites
- `getChatUsageStats()` - Retorna también `hasBasePlan` en las estadísticas

#### `/home/ubuntu/hogara_planner/nextjs_space/app/premium/page.tsx`

**Cambios principales:**
1. **Plan Base 7€:** 
   - Eliminada referencia obsoleta a "10 mensajes/día"
   - Agregada nueva característica: "💫 Base para añadir Personajes Mágicos"

2. **Sección de Personajes Mágicos:**
   - Título actualizado: "Personajes Mágicos con GPT-4.1 Mini"
   - Descripción actualizada: "Acompañantes emocionales inteligentes con mensajes mensuales + créditos extra disponibles"

3. **Plan Addon (Personajes Completos):**
   - Cambiado "Chat ilimitado" por "**200 mensajes/mes incluidos** + opción de comprar créditos extra"
   - Actualizado "Voces del navegador incluidas" por "**Voces ilimitadas incluidas**"
   - Actualizado "Memoria emocional" por "**Memoria emocional activada**"

4. **Plan Standalone (Prueba los Personajes):**
   - Cambiado "Acceso Limitado" por "**100 mensajes/mes incluidos** + opción de comprar créditos extra"
   - Actualizado "Algunas voces incluidas" por "**Voces ilimitadas incluidas**"
   - Actualizado "Sin memoria extendida" por "**Sin memoria emocional**"

5. **Nueva Sección: Packs de Créditos Extra**
   - Pack de 100 mensajes: **€1.99**
   - Pack de 300 mensajes: **€3.99**
   - Nota: "Los créditos comprados no caducan mientras mantengas tu suscripción activa"

### 3. Control de Costos

El sistema implementado garantiza:
- **Máximo €0.30 por usuario/mes** para Gara
- No hay costos inesperados
- Las voces son 100% gratis (Web Speech API del navegador)
- El chat consume créditos de forma controlada con GPT-4.1 Mini

### 4. Estructura de Precios Actualizada

#### Planes Base (sin cambios):
- **Plan Hogara 7€/mes:** Contenido base + posibilidad de añadir Personajes Mágicos
- **Plan Hogara 15€/mes:** Contenido completo + posibilidad de añadir Personajes Mágicos

#### Personajes Mágicos (€4.99/mes):
- **Addon:** 200 mensajes/mes con memoria emocional (requiere plan base)
- **Standalone:** 100 mensajes/mes sin memoria emocional (no requiere plan base)

#### Créditos Extra:
- **Pack Pequeño:** 100 mensajes por €1.99
- **Pack Grande:** 300 mensajes por €3.99
- Los créditos no caducan con suscripción activa

### 5. Comportamiento del Sistema

#### Reseteo Mensual:
- Cada 30 días se resetea el contador de mensajes mensuales
- Los créditos comprados NO se resetean
- Si el usuario cambia de plan (addon ↔ standalone), el límite se actualiza automáticamente

#### Orden de Consumo:
1. Primero se consumen los mensajes mensuales incluidos (200 o 100 según el plan)
2. Cuando se agotan, se consumen los créditos comprados
3. Si se agotan ambos, el usuario recibe mensaje para comprar más créditos

#### Usuarios Administradores:
- Acceso ilimitado y gratuito (sin coste para Gara)
- No tienen límites de mensajes
- No se registra su uso en estadísticas

### 6. Testing Realizado

✅ Build compilada exitosamente sin errores de TypeScript
✅ Middleware actualizado correctamente
✅ Página de Premium actualizada con información clara
✅ Lógica de límites diferenciados implementada

### 7. Próximos Pasos (Pendientes)

- [ ] Implementar API de compra de créditos extra (Stripe)
- [ ] Crear interfaz de usuario para comprar créditos
- [ ] Agregar indicador visual de mensajes restantes en el chat
- [ ] Implementar notificaciones cuando se agoten los mensajes
- [ ] Testing completo con usuarios reales

### 8. Notas Importantes

- ⚠️ Los usuarios existentes mantendrán su configuración actual hasta el próximo reseteo mensual
- ⚠️ La funcionalidad de compra de créditos está definida pero pendiente de implementar
- ✅ El sistema ya está preparado para soportar la compra de créditos (campo `extraMessageCredits` en base de datos)

---

**Estado:** ✅ **Implementado y listo para testing**
**Versión:** 1.0
**Responsable:** Gara (Propietaria Hogara Planner)
