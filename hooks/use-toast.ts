// Este hook es un placeholder funcional que resuelve el error de compilación.
// En un proyecto real, se usaría una biblioteca como 'react-hot-toast' o 'sonner'.
// En Next.js, se asume que este archivo existe en la ruta '@/hooks/use-toast'.

interface ToastOptions {
  duration?: number;
  type?: 'success' | 'error' | 'info';
}

/**
 * Hook de notificación básico para mostrar mensajes temporales al usuario.
 * Resuelve el error de compilación 'Module not found: Can't resolve '@/hooks/use-toast''.
 */
export const useToast = () => {
  // Función principal para mostrar el mensaje
  const toast = (message: string, options?: ToastOptions) => {
    const { type = 'info' } = options || {};
    
    // En un entorno de navegador real, esto mostraría un componente modal o un banner.
    // Por simplicidad y para asegurar la compilación, solo hacemos un log en consola.
    
    let prefix = '💬 INFO:';
    if (type === 'success') prefix = '✅ ÉXITO:';
    if (type === 'error') prefix = '❌ ERROR:';

    console.log(`${prefix} ${message}`);
    
    // Opcionalmente, podrías usar la API nativa de notificaciones del navegador (si está disponible)
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(prefix, { body: message });
      }
    }
  };

  return {
    toast,
    success: (message: string) => toast(message, { type: 'success' }),
    error: (message: string) => toast(message, { type: 'error' }),
    info: (message: string) => toast(message, { type: 'info' }),
  };
};
