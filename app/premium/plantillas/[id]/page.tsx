
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PremiumGuard } from '@/components/premium/premium-guard';
import { InteractiveTemplateCanvas } from '@/components/premium/interactive-template-canvas';
import { useSession } from 'next-auth/react';

interface Template {
  id: string;
  name: string;
  description: string | null;
  category: string;
  pdf_url: string;
  thumbnail: string | null;
  is_colorable: boolean;
}

export default function TemplatePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession() || {};
  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTemplate();
  }, [params.id]);

  const loadTemplate = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/templates/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Plantilla cargada:', data);
        setTemplate(data.template);
      } else {
        console.error('❌ Error al cargar plantilla:', response.status);
      }
    } catch (error) {
      console.error('❌ Error al cargar plantilla:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <PremiumGuard>
        <div className="min-h-screen bg-gradient-to-br from-[#F5F1ED] via-white to-[#F8F5F0] flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-[#C8A882] mx-auto" />
            <p className="text-muted-foreground">Cargando plantilla interactiva...</p>
          </div>
        </div>
      </PremiumGuard>
    );
  }

  if (!template) {
    return (
      <PremiumGuard>
        <div className="min-h-screen bg-gradient-to-br from-[#F5F1ED] via-white to-[#F8F5F0] flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-lg text-muted-foreground">Plantilla no encontrada</p>
            <Button onClick={() => router.push('/premium/plantillas')}>
              Volver a plantillas
            </Button>
          </div>
        </div>
      </PremiumGuard>
    );
  }

  return (
    <PremiumGuard>
      <div className="min-h-screen bg-gradient-to-br from-[#F5F1ED] via-white to-[#F8F5F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.push('/premium/plantillas')}
              className="mb-4 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a plantillas
            </Button>
            
            <div className="space-y-2">
              <h1 className="text-4xl font-serif font-bold text-[#1A1A1A]">
                {template.name}
              </h1>
              {template.description && (
                <p className="text-lg text-muted-foreground max-w-3xl">
                  {template.description}
                </p>
              )}
              <div className="flex items-center gap-2 text-sm text-[#C8A882]">
                <span>✨ Plantilla interactiva</span>
                <span>•</span>
                <span>🎨 Colorea con tu dedo o Apple Pencil</span>
                <span>•</span>
                <span>💾 Se guarda automáticamente</span>
              </div>
            </div>
          </div>

          {/* Canvas interactivo */}
          <InteractiveTemplateCanvas
            templateId={template.id}
            pdfUrl={template.pdf_url}
            templateName={template.name}
          />
        </div>
      </div>
    </PremiumGuard>
  );
}
