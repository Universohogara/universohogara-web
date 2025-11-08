
/**
 * 🧠 Sistema de Memoria para Companions
 * 
 * Cada companion recuerda conversaciones recientes con LÍMITES CLAROS
 * para controlar costes de API.
 * 
 * LÍMITES CONFIGURABLES:
 * - Máximo de mensajes en memoria: 10 por sesión
 * - Se mantienen los más recientes
 * - Se limpian automáticamente al cerrar sesión
 */

export interface CompanionMemory {
  companionId: string;
  companionName: string;
  recentMessages: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    emotionDetected?: string;
  }[];
  conversationStarted: Date;
  lastInteraction: Date;
}

// Límites de memoria (CONFIGURABLES para controlar costes)
export const MEMORY_LIMITS = {
  MAX_MESSAGES: 10, // Máximo 10 mensajes en memoria
  MAX_TOKENS_PER_MESSAGE: 200, // Máximo ~200 tokens por mensaje
  MEMORY_EXPIRATION_HOURS: 24, // La memoria expira después de 24 horas
};

/**
 * Gestiona la memoria de un companion en el cliente (sessionStorage)
 */
export class CompanionMemoryManager {
  private storageKey: string;

  constructor(userId: string, companionId: string) {
    this.storageKey = `companion_memory_${userId}_${companionId}`;
  }

  /**
   * Obtiene la memoria actual del companion
   */
  getMemory(): CompanionMemory | null {
    if (typeof window === 'undefined') return null;

    const stored = sessionStorage.getItem(this.storageKey);
    if (!stored) return null;

    try {
      const memory: CompanionMemory = JSON.parse(stored);
      
      // Verificar si la memoria ha expirado
      const hoursSinceStart = (new Date().getTime() - new Date(memory.conversationStarted).getTime()) / (1000 * 60 * 60);
      if (hoursSinceStart > MEMORY_LIMITS.MEMORY_EXPIRATION_HOURS) {
        this.clearMemory();
        return null;
      }

      return memory;
    } catch {
      return null;
    }
  }

  /**
   * Agrega un mensaje a la memoria del companion
   */
  addMessage(role: 'user' | 'assistant', content: string, emotionDetected?: string): CompanionMemory {
    let memory = this.getMemory();

    // Si no existe memoria, crear una nueva
    if (!memory) {
      memory = {
        companionId: this.getCompanionIdFromKey(),
        companionName: '', // Se llenará con el nombre real
        recentMessages: [],
        conversationStarted: new Date(),
        lastInteraction: new Date(),
      };
    }

    // Truncar el mensaje si es muy largo (para controlar tokens)
    const truncatedContent = this.truncateMessage(content);

    // Agregar el nuevo mensaje
    memory.recentMessages.push({
      role,
      content: truncatedContent,
      timestamp: new Date(),
      emotionDetected,
    });

    // Mantener solo los últimos N mensajes (límite configurable)
    if (memory.recentMessages.length > MEMORY_LIMITS.MAX_MESSAGES) {
      memory.recentMessages = memory.recentMessages.slice(-MEMORY_LIMITS.MAX_MESSAGES);
    }

    // Actualizar última interacción
    memory.lastInteraction = new Date();

    // Guardar en sessionStorage
    sessionStorage.setItem(this.storageKey, JSON.stringify(memory));

    return memory;
  }

  /**
   * Obtiene el contexto de memoria como string para el prompt
   */
  getMemoryContext(): string {
    const memory = this.getMemory();
    if (!memory || memory.recentMessages.length === 0) {
      return '';
    }

    const contextLines = memory.recentMessages.map(msg => {
      const speaker = msg.role === 'user' ? 'Usuario' : memory.companionName || 'Yo';
      const emotion = msg.emotionDetected ? ` [${msg.emotionDetected}]` : '';
      return `${speaker}${emotion}: ${msg.content}`;
    });

    return `\n--- Contexto de conversación reciente (últimos ${memory.recentMessages.length} mensajes) ---\n${contextLines.join('\n')}\n---\n`;
  }

  /**
   * Trunca un mensaje si excede el límite de tokens
   */
  private truncateMessage(content: string): string {
    const maxChars = MEMORY_LIMITS.MAX_TOKENS_PER_MESSAGE * 4; // ~4 chars por token
    if (content.length <= maxChars) return content;

    return content.substring(0, maxChars) + '... [truncado]';
  }

  /**
   * Limpia la memoria del companion
   */
  clearMemory(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(this.storageKey);
  }

  /**
   * Extrae el companionId de la storageKey
   */
  private getCompanionIdFromKey(): string {
    const parts = this.storageKey.split('_');
    return parts[parts.length - 1];
  }

  /**
   * Obtiene estadísticas de uso de memoria
   */
  getMemoryStats(): {
    messagesCount: number;
    maxMessages: number;
    approximateTokens: number;
    percentageFull: number;
  } {
    const memory = this.getMemory();
    if (!memory) {
      return {
        messagesCount: 0,
        maxMessages: MEMORY_LIMITS.MAX_MESSAGES,
        approximateTokens: 0,
        percentageFull: 0,
      };
    }

    const approximateTokens = memory.recentMessages.reduce((sum, msg) => {
      return sum + Math.ceil(msg.content.length / 4); // ~4 chars por token
    }, 0);

    return {
      messagesCount: memory.recentMessages.length,
      maxMessages: MEMORY_LIMITS.MAX_MESSAGES,
      approximateTokens,
      percentageFull: (memory.recentMessages.length / MEMORY_LIMITS.MAX_MESSAGES) * 100,
    };
  }
}

/**
 * Hook de React para usar la memoria del companion
 */
import { useEffect, useState } from 'react';

export function useCompanionMemory(userId: string | null, companionId: string | null) {
  const [memoryManager, setMemoryManager] = useState<CompanionMemoryManager | null>(null);
  const [memoryContext, setMemoryContext] = useState<string>('');

  useEffect(() => {
    if (userId && companionId) {
      const manager = new CompanionMemoryManager(userId, companionId);
      setMemoryManager(manager);
      setMemoryContext(manager.getMemoryContext());
    }
  }, [userId, companionId]);

  const addMessage = (role: 'user' | 'assistant', content: string, emotionDetected?: string) => {
    if (!memoryManager) return;
    
    const updatedMemory = memoryManager.addMessage(role, content, emotionDetected);
    setMemoryContext(memoryManager.getMemoryContext());
    return updatedMemory;
  };

  const clearMemory = () => {
    if (!memoryManager) return;
    memoryManager.clearMemory();
    setMemoryContext('');
  };

  const getStats = () => {
    if (!memoryManager) return null;
    return memoryManager.getMemoryStats();
  };

  return {
    memoryContext,
    addMessage,
    clearMemory,
    getStats,
  };
}
