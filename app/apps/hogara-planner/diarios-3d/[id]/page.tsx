'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  PREDEFINED_DIARIES,
  Diary,
  TrackerConfig,
} from '@/lib/diary-types';
import { DiaryBookLayout } from '@/components/diarios/diary-book-layout';
import { CustomTracker } from '@/components/diarios/custom-tracker';
import { ReadingDiarySection } from '@/components/diarios/reading-diary-section';
import { MoviesDiarySection } from '@/components/diarios/movies-diary-section';
import { ExerciseDiarySection } from '@/components/diarios/exercise-diary-section';
import { FinanceDiarySection } from '@/components/diarios/finance-diary-section';
import { WellnessDiarySection } from '@/components/diarios/wellness-diary-section';
import { DreamsDiarySection } from '@/components/diarios/dreams-diary-section';
import { GratitudeDiarySection } from '@/components/diarios/gratitude-diary-section';
import { ManifestationDiarySection } from '@/components/diarios/manifestation-diary-section';
import { MusicPlayer } from '@/components/diarios/music-player';
import { StickersPanel, Sticker } from '@/components/diarios/stickers-panel';
import { Sparkles, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function DiaryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const diaryId = params?.id as string;

  const [diary, setDiary] = useState<Diary | null>(null);
  const [activeTab, setActiveTab] = useState<string>('');
  const [showStickers, setShowStickers] = useState(false);

  // Tracker de ejemplo para demostración
  const [trackerConfig, setTrackerConfig] = useState<TrackerConfig>({
    id: 'demo-tracker',
    name: 'Mi Tracker Personal',
    icon: '✓',
    type: 'monthly',
    legend: [
      { id: '1', label: 'Hecho', color: '#4CAF50', shortLabel: 'H' },
      { id: '2', label: 'No hecho', color: '#F44336', shortLabel: 'NH' },
      { id: '3', label: 'Parcial', color: '#FF9800', shortLabel: 'P' },
    ],
    cells: [],
  });

  const handleStickerDragStart = (sticker: Sticker) => {
    console.log('Arrastrando sticker:', sticker);
  };

  useEffect(() => {
    const foundDiary = PREDEFINED_DIARIES.find((d) => d.id === diaryId);
    if (foundDiary) {
      const diaryWithDates = {
        ...foundDiary,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setDiary(diaryWithDates);
      setActiveTab(foundDiary.sections[0]?.id || '');
    } else {
      router.push('/premium/diarios-3d');
    }
  }, [diaryId, router]);

  if (!diary) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Cargando diario...</p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    // TODO: Implementar guardado en la base de datos
    console.log('Guardando diario...', diary);
    toast.success('¡Diario guardado exitosamente!');
  };

  const handleExport = () => {
    // Implementación básica de exportación
    const dataStr = JSON.stringify(diary, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${diary.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Diario exportado correctamente');
  };

  const handleShare = () => {
    // Implementación básica de compartir
    if (navigator.share) {
      navigator
        .share({
          title: diary.title,
          text: diary.description,
          url: window.location.href,
        })
        .then(() => toast.success('Compartido exitosamente'))
        .catch(() => toast.error('Error al compartir'));
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard.writeText(window.location.href);
      toast.success('Enlace copiado al portapapeles');
    }
  };

  const tabs = diary.sections.map((section) => ({
    id: section.id,
    label: section.label,
    icon: section.icon,
    color: section.color,
  }));

  const renderSectionContent = () => {
    const currentSection = diary.sections.find((s) => s.id === activeTab);
    if (!currentSection) return null;

    // Botones de acción en la parte superior de cada sección
    const ActionButtons = () => (
      <div className="flex flex-wrap gap-2 mb-6 justify-end">
        <Button
          onClick={() => setShowStickers(!showStickers)}
          variant="outline"
          size="sm"
          className="border-2"
          style={{ borderColor: `${diary.coverColor}40` }}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Stickers
        </Button>
        <Button
          onClick={handleExport}
          variant="outline"
          size="sm"
          className="border-2"
          style={{ borderColor: `${diary.coverColor}40` }}
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
        <Button
          onClick={handleShare}
          variant="outline"
          size="sm"
          className="border-2"
          style={{ borderColor: `${diary.coverColor}40` }}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Compartir
        </Button>
      </div>
    );

    return (
      <div>
        <ActionButtons />

        {/* Renderizar el componente apropiado según el tipo de diario */}
        {diary.type === 'tracker' && (
          <CustomTracker
            config={trackerConfig}
            onUpdate={setTrackerConfig}
            onSave={handleSave}
          />
        )}

        {diary.type === 'reading' && <ReadingDiarySection />}

        {diary.type === 'movies' && <MoviesDiarySection />}

        {diary.type === 'exercise' && <ExerciseDiarySection />}

        {diary.type === 'finance' && <FinanceDiarySection />}

        {diary.type === 'wellness' && <WellnessDiarySection />}

        {diary.type === 'dreams' && <DreamsDiarySection />}

        {diary.type === 'gratitude' && <GratitudeDiarySection />}

        {diary.type === 'manifestation' && <ManifestationDiarySection />}
      </div>
    );
  };

  return (
    <>
      <DiaryBookLayout
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        coverColor={diary.coverColor}
        diaryTitle={diary.title}
        onClose={() => router.push('/premium/diarios-3d')}
      >
        {renderSectionContent()}
      </DiaryBookLayout>

      {/* Música ambiente */}
      <MusicPlayer />

      {/* Panel de stickers */}
      <StickersPanel
        open={showStickers}
        onClose={() => setShowStickers(false)}
        onStickerDragStart={handleStickerDragStart}
      />
    </>
  );
}
