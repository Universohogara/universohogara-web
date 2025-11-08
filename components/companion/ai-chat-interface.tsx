
'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Lock, TrendingUp, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatInterfaceProps {
  companionType: string;
  companionName: string;
  companionColor: string;
}

export default function AIChatInterface({ companionType, companionName, companionColor }: AIChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messagesUsed, setMessagesUsed] = useState(0);
  const [messagesLimit, setMessagesLimit] = useState(10);
  const [tier, setTier] = useState<string>('none');
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [upgradePromotion, setUpgradePromotion] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessageStatus();
    loadConversationHistory();
  }, [companionType]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessageStatus = async () => {
    try {
      const response = await fetch('/api/ai-chat');
      if (response.ok) {
        const data = await response.json();
        setMessagesUsed(data.messagesUsed);
        setMessagesLimit(data.messagesLimit);
        setTier(data.tier);
      }
    } catch (error) {
      console.error('Error al cargar estado:', error);
    }
  };

  const loadConversationHistory = async () => {
    // Aquí podrías cargar el historial si lo necesitas
    // Por ahora, empezamos con un mensaje de bienvenida
    setMessages([{
      role: 'assistant',
      content: `✨ ¡Hola! Soy ${companionName}, tu compañero mágico. ¿En qué puedo ayudarte hoy?`,
      timestamp: new Date()
    }]);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: inputMessage,
          companionType
        })
      });

      const data = await response.json();

      if (response.status === 429) {
        // Límite alcanzado
        setShowLimitDialog(true);
        setMessages(prev => prev.slice(0, -1)); // Remover mensaje del usuario
      } else if (response.ok) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);
        setMessagesUsed(data.messagesUsed);
        setMessagesLimit(data.messagesLimit);
        setTier(data.tier);

        // Mostrar promoción de upgrade si quedan pocos mensajes
        if (data.shouldShowUpgrade && data.messagesRemaining <= 3) {
          setUpgradePromotion(
            `⚠️ Solo te quedan ${data.messagesRemaining} mensajes hoy. ¡Actualiza para conversaciones ilimitadas!`
          );
        }
      } else {
        throw new Error(data.error || 'Error al enviar mensaje');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '😔 Lo siento, hubo un error. Por favor, intenta de nuevo.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const messagesRemaining = messagesLimit - messagesUsed;
  const usagePercentage = (messagesUsed / messagesLimit) * 100;
  const isNearLimit = messagesRemaining <= 3 && tier === 'none';
  const isAtLimit = messagesUsed >= messagesLimit;

  return (
    <div className="flex flex-col h-full">
      {/* Header con info de mensajes */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-t-lg border-b">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Chat con {companionName}</h3>
            {tier !== 'none' && (
              <Badge variant="secondary" className="ml-2">
                <Crown className="h-3 w-3 mr-1" />
                {tier.toUpperCase()}
              </Badge>
            )}
          </div>
          {tier === 'none' && (
            <Link href="/pricing">
              <Button size="sm" variant="outline" className="text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                Actualizar
              </Button>
            </Link>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Mensajes hoy: <strong>{messagesUsed}/{messagesLimit}</strong>
            </span>
            <span className={`font-semibold ${isNearLimit ? 'text-red-600' : 'text-gray-700'}`}>
              {messagesRemaining} restantes
            </span>
          </div>
          <Progress 
            value={usagePercentage} 
            className={`h-2 ${isNearLimit ? '[&>div]:bg-red-500' : '[&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-pink-500'}`}
          />
        </div>

        {isNearLimit && (
          <Alert variant="default" className="mt-3 bg-amber-50 border-amber-300">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-sm text-amber-800">
              ¡Solo te quedan <strong>{messagesRemaining}</strong> mensajes! 
              <Link href="/pricing" className="ml-2 underline font-semibold">
                ✨ Hazte Premium
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {upgradePromotion && (
          <Alert variant="default" className="mt-2 bg-purple-50 border-purple-300">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            <AlertDescription className="text-sm text-purple-800">
              {upgradePromotion}
              <button 
                onClick={() => setUpgradePromotion(null)}
                className="ml-2 text-xs underline"
              >
                Cerrar
              </button>
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              <span className={`text-xs mt-1 block ${msg.role === 'user' ? 'text-purple-100' : 'text-gray-500'}`}>
                {msg.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-gray-50 border-t rounded-b-lg">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isAtLimit ? "Límite alcanzado..." : `Escribe a ${companionName}...`}
            disabled={isLoading || isAtLimit}
            className="flex-1"
          />
          <Button 
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim() || isAtLimit}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {isAtLimit && (
          <p className="text-xs text-red-600 mt-2 text-center">
            Has alcanzado tu límite diario. Vuelve mañana o 
            <Link href="/pricing" className="ml-1 underline font-semibold">
              actualiza tu plan
            </Link>
          </p>
        )}
      </div>

      {/* Dialog de límite alcanzado */}
      <Dialog open={showLimitDialog} onOpenChange={setShowLimitDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-purple-600" />
              💔 Límite Alcanzado
            </DialogTitle>
            <DialogDescription>
              Se acabó la magia por hoy...
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600">
              <strong>{companionName}</strong> extrañará hablar contigo. Ya usaste tus <strong>{messagesLimit} mensajes</strong> de hoy.
            </p>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-purple-900 mb-2">
                ✨ Con Premium obtienes:
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• <strong>Conversaciones ilimitadas</strong></li>
                <li>• Respuestas más elaboradas</li>
                <li>• Todos los personajes desbloqueados</li>
                <li>• Memoria extendida del companion</li>
              </ul>
            </div>
            <div className="text-xs text-center text-gray-500">
              <strong>847 usuarios</strong> ya tienen conversaciones ilimitadas
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-col gap-2">
            <Link href="/pricing" className="w-full">
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Crown className="h-4 w-4 mr-2" />
                Ver Planes Premium
              </Button>
            </Link>
            <Button variant="outline" onClick={() => setShowLimitDialog(false)} className="w-full">
              Volver mañana
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
