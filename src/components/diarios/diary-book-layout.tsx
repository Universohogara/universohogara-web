
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen, X } from 'lucide-react';
import { DiaryView } from '@/lib/diary-types';
import { Button } from '@/components/ui/button';

interface DiaryTab {
  id: string;
  label: string;
  icon: string;
  color: string;
}

interface DiaryBookLayoutProps {
  tabs: DiaryTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: React.ReactNode;
  coverColor: string;
  diaryTitle: string;
  onClose?: () => void;
}

export function DiaryBookLayout({
  tabs,
  activeTab,
  onTabChange,
  children,
  coverColor,
  diaryTitle,
  onClose,
}: DiaryBookLayoutProps) {
  const [isPageTurning, setIsPageTurning] = useState(false);
  const [turnDirection, setTurnDirection] = useState<'left' | 'right'>('right');

  const currentTabIndex = tabs.findIndex((tab) => tab.id === activeTab);

  const handleTabChange = (newTabId: string, direction: 'left' | 'right') => {
    setIsPageTurning(true);
    setTurnDirection(direction);
    
    setTimeout(() => {
      onTabChange(newTabId);
      setIsPageTurning(false);
    }, 300);
  };

  const goToPrevTab = () => {
    if (currentTabIndex > 0) {
      handleTabChange(tabs[currentTabIndex - 1].id, 'left');
    }
  };

  const goToNextTab = () => {
    if (currentTabIndex < tabs.length - 1) {
      handleTabChange(tabs[currentTabIndex + 1].id, 'right');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 px-4">
      {/* Fondo con textura de papel sutil */}
      <div 
        className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='https://i.pinimg.com/736x/26/a9/0e/26a90e00bb294243b8bfc78eb53296c0.jpg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        {/* Contenedor del libro */}
        <div className="relative">
          {/* Pestañas laterales (marcadores del libro) */}
          <div className="absolute left-0 top-20 z-20 flex flex-col gap-1">
            {tabs.map((tab, index) => {
              const isActive = tab.id === activeTab;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => !isActive && handleTabChange(tab.id, index > currentTabIndex ? 'right' : 'left')}
                  className={`
                    relative group
                    transition-all duration-300
                    ${isActive ? 'w-32 pr-6' : 'w-20 pr-4'}
                  `}
                  whileHover={{ x: isActive ? 0 : 4 }}
                  style={{
                    background: isActive
                      ? `linear-gradient(90deg, ${tab.color} 0%, ${tab.color}dd 100%)`
                      : `linear-gradient(90deg, ${tab.color}88 0%, ${tab.color}aa 100%)`,
                  }}
                >
                  <div
                    className={`
                      py-4 px-4 rounded-l-xl
                      flex items-center gap-3
                      text-white font-medium text-sm
                      shadow-lg
                      ${isActive ? 'shadow-xl' : 'shadow-md opacity-80 hover:opacity-100'}
                    `}
                  >
                    <span className="text-2xl">{tab.icon}</span>
                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="whitespace-nowrap overflow-hidden"
                        >
                          {tab.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Detalle decorativo de la pestaña */}
                  <div
                    className="absolute right-0 top-0 bottom-0 w-2"
                    style={{
                      background: `linear-gradient(180deg, ${tab.color} 0%, ${tab.color}66 100%)`,
                      boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.1)',
                    }}
                  />
                </motion.button>
              );
            })}
          </div>

          {/* Libro principal */}
          <div className="ml-0 lg:ml-8 relative">
            {/* Sombra del libro */}
            <div className="absolute -bottom-4 left-8 right-8 h-8 bg-black/10 blur-2xl rounded-full" />

            {/* Páginas del libro */}
            <motion.div
              className="relative bg-white rounded-2xl shadow-2xl overflow-hidden"
              style={{
                minHeight: '800px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
              animate={{
                rotateY: isPageTurning ? (turnDirection === 'right' ? -5 : 5) : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Lomo del libro (borde izquierdo decorativo) */}
              <div
                className="absolute left-0 top-0 bottom-0 w-8 rounded-l-2xl"
                style={{
                  background: `linear-gradient(180deg, ${coverColor} 0%, ${coverColor}cc 100%)`,
                  boxShadow: 'inset -4px 0 8px rgba(0,0,0,0.1)',
                }}
              >
                {/* Líneas decorativas del lomo */}
                <div className="absolute inset-y-0 left-2 right-2 flex flex-col justify-evenly">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="h-px bg-white/20"
                    />
                  ))}
                </div>
              </div>

              {/* Encabezado del diario */}
              <div
                className="relative px-12 py-8 flex items-center justify-between border-b-2"
                style={{
                  background: `linear-gradient(135deg, ${coverColor}15 0%, transparent 100%)`,
                  borderColor: `${coverColor}30`,
                }}
              >
                <div className="flex items-center gap-4">
                  <BookOpen className="w-8 h-8" style={{ color: coverColor }} />
                  <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-800">
                      {diaryTitle}
                    </h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">
                      {tabs.find(t => t.id === activeTab)?.label || 'Sección'}
                    </p>
                  </div>
                </div>

                {onClose && (
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                )}
              </div>

              {/* Contenido de la página con animación */}
              <div className="relative px-8 lg:px-16 py-12 min-h-[700px]">
                {/* Textura de papel en el fondo */}
                <div
                  className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='https://media.istockphoto.com/id/990354646/vector/dotted-grid-seamless-pattern-with-dots-simplified-matrix-vector-refill.jpg?s=612x612&w=0&k=20&c=wUE_nshZvCbS-QuZo_3eU3RvpiHXxX0UHdgtzQcQMX4= fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z'/%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />

                {/* Contenido con animación de página */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{
                      opacity: 0,
                      x: turnDirection === 'right' ? 50 : -50,
                      rotateY: turnDirection === 'right' ? 5 : -5,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      rotateY: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: turnDirection === 'right' ? -50 : 50,
                      rotateY: turnDirection === 'right' ? -5 : 5,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {children}
                  </motion.div>
                </AnimatePresence>

                {/* Número de página decorativo */}
                <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                  <div
                    className="px-6 py-2 rounded-full text-sm font-serif font-medium"
                    style={{
                      background: `linear-gradient(135deg, ${coverColor}10 0%, ${coverColor}05 100%)`,
                      color: coverColor,
                      border: `1px solid ${coverColor}20`,
                    }}
                  >
                    Página {currentTabIndex + 1} de {tabs.length}
                  </div>
                </div>
              </div>

              {/* Controles de navegación de página */}
              <div className="absolute bottom-12 left-8 right-8 flex justify-between items-center pointer-events-none">
                <motion.div
                  className="pointer-events-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={goToPrevTab}
                    disabled={currentTabIndex === 0}
                    variant="outline"
                    size="lg"
                    className="rounded-full shadow-lg bg-white/80 backdrop-blur-sm border-2 disabled:opacity-30"
                    style={{
                      borderColor: `${coverColor}40`,
                      color: coverColor,
                    }}
                  >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Anterior
                  </Button>
                </motion.div>

                <motion.div
                  className="pointer-events-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={goToNextTab}
                    disabled={currentTabIndex === tabs.length - 1}
                    variant="outline"
                    size="lg"
                    className="rounded-full shadow-lg bg-white/80 backdrop-blur-sm border-2 disabled:opacity-30"
                    style={{
                      borderColor: `${coverColor}40`,
                      color: coverColor,
                    }}
                  >
                    Siguiente
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </div>

              {/* Marca de agua decorativa */}
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none text-9xl font-serif select-none"
                style={{ color: coverColor }}
              >
                Hogara
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
