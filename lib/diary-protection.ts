
/**
 * Sistema de protección para Diarios 3D
 * Previene copias, descargas y capturas no autorizadas
 */

export const diaryProtection = {
  // Prevenir clic derecho
  preventContextMenu: (e: MouseEvent) => {
    e.preventDefault();
    return false;
  },

  // Prevenir arrastrar imágenes
  preventDragStart: (e: DragEvent) => {
    e.preventDefault();
    return false;
  },

  // Prevenir selección de texto
  preventSelection: (e: Event) => {
    e.preventDefault();
    return false;
  },

  // Detectar captura de pantalla (limitado en web)
  detectScreenshot: () => {
    // Listener para combinaciones de teclas comunes de captura
    document.addEventListener('keyup', (e) => {
      // Windows: PrtScn, Alt+PrtScn, Win+Shift+S
      // Mac: Cmd+Shift+3, Cmd+Shift+4, Cmd+Shift+5
      if (
        e.key === 'PrintScreen' ||
        (e.shiftKey && e.metaKey && ['3', '4', '5'].includes(e.key)) ||
        (e.shiftKey && e.metaKey && e.key === 's')
      ) {
        console.log('⚠️ Captura de pantalla detectada');
        // Aquí podrías añadir marca de agua adicional o notificación
      }
    });
  },

  // Aplicar todas las protecciones
  applyAll: () => {
    if (typeof window !== 'undefined') {
      document.addEventListener('contextmenu', diaryProtection.preventContextMenu);
      document.addEventListener('dragstart', diaryProtection.preventDragStart);
      document.addEventListener('selectstart', diaryProtection.preventSelection);
      diaryProtection.detectScreenshot();
    }
  },

  // Remover todas las protecciones (cleanup)
  removeAll: () => {
    if (typeof window !== 'undefined') {
      document.removeEventListener('contextmenu', diaryProtection.preventContextMenu);
      document.removeEventListener('dragstart', diaryProtection.preventDragStart);
      document.removeEventListener('selectstart', diaryProtection.preventSelection);
    }
  },
};

// CSS para marca de agua
export const watermarkStyles = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%) rotate(-45deg)',
  fontSize: '6rem',
  fontWeight: 'bold',
  color: 'rgba(216, 180, 128, 0.08)',
  pointerEvents: 'none' as const,
  userSelect: 'none' as const,
  zIndex: 1,
  width: '100%',
  textAlign: 'center' as const,
};
