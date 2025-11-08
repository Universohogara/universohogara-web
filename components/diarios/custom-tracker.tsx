
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrackerConfig, TrackerLegendItem, TrackerCell } from '@/lib/diary-types';
import { Palette, Plus, X, Save, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface CustomTrackerProps {
  config: TrackerConfig;
  onUpdate: (config: TrackerConfig) => void;
  onSave?: () => void;
}

export function CustomTracker({ config, onUpdate, onSave }: CustomTrackerProps) {
  const [showLegendEditor, setShowLegendEditor] = useState(false);
  const [selectedCell, setSelectedCell] = useState<TrackerCell | null>(null);
  const [editingLegend, setEditingLegend] = useState(false);
  const [newLegendItem, setNewLegendItem] = useState({ label: '', color: '#D8B480' });

  // Generar celdas para el mes/año actual
  const generateCells = () => {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const cells: TrackerCell[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(today.getFullYear(), today.getMonth(), day);
      const existingCell = config.cells.find(
        (c) => c.date.getDate() === day && c.date.getMonth() === today.getMonth()
      );

      cells.push(
        existingCell || {
          id: `cell-${day}`,
          date,
          legendItemId: null,
          color: null,
        }
      );
    }

    return cells;
  };

  const cells = generateCells();

  const handleCellClick = (cell: TrackerCell) => {
    setSelectedCell(cell);
  };

  const handleColorSelect = (legendItem: TrackerLegendItem) => {
    if (!selectedCell) return;

    const updatedCells = config.cells.map((c) =>
      c.id === selectedCell.id
        ? { ...c, legendItemId: legendItem.id, color: legendItem.color }
        : c
    );

    // Si la celda no existía, agregarla
    if (!config.cells.find((c) => c.id === selectedCell.id)) {
      updatedCells.push({
        ...selectedCell,
        legendItemId: legendItem.id,
        color: legendItem.color,
      });
    }

    onUpdate({ ...config, cells: updatedCells });
    setSelectedCell(null);
  };

  const handleAddLegendItem = () => {
    if (!newLegendItem.label) return;

    const item: TrackerLegendItem = {
      id: `legend-${Date.now()}`,
      label: newLegendItem.label,
      color: newLegendItem.color,
      shortLabel: newLegendItem.label.substring(0, 2).toUpperCase(),
    };

    onUpdate({ ...config, legend: [...config.legend, item] });
    setNewLegendItem({ label: '', color: '#D8B480' });
  };

  const handleRemoveLegendItem = (id: string) => {
    onUpdate({ ...config, legend: config.legend.filter((l) => l.id !== id) });
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-serif font-bold text-hogara-gray flex items-center gap-2">
            <span className="text-3xl">{config.icon}</span>
            {config.name}
          </h3>
          <p className="text-sm text-hogara-gray/60 mt-1">
            Haz clic en cada día y asígnale un color según tu leyenda
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditingLegend(true)}
            className="border-hogara-gold text-hogara-gold hover:bg-hogara-gold/10"
          >
            <Palette className="w-4 h-4 mr-2" />
            Editar Leyenda
          </Button>
          {onSave && (
            <Button
              size="sm"
              onClick={onSave}
              className="bg-hogara-gold text-white hover:bg-hogara-gold/90"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </Button>
          )}
        </div>
      </div>

      {/* Leyenda Actual */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-hogara-gold/20">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-hogara-gold" />
          <span className="text-sm font-medium text-hogara-gray">Leyenda:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {config.legend.map((item) => (
            <Badge
              key={item.id}
              className="text-sm"
              style={{
                backgroundColor: item.color,
                color: '#fff',
              }}
            >
              {item.label}
            </Badge>
          ))}
          {config.legend.length === 0 && (
            <span className="text-sm text-hogara-gray/40">
              No hay elementos en la leyenda. Haz clic en "Editar Leyenda" para agregar.
            </span>
          )}
        </div>
      </div>

      {/* Tracker Grid */}
      <div className="bg-gradient-to-br from-white to-hogara-pink/5 rounded-2xl p-6 shadow-lg border border-hogara-gold/20">
        <div className="grid grid-cols-7 gap-2">
          {/* Headers de días de la semana */}
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-hogara-gray/60 pb-2"
            >
              {day}
            </div>
          ))}

          {/* Celdas del tracker */}
          {cells.map((cell, index) => {
            const dayOfWeek = cell.date.getDay();
            const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

            // Agregar celdas vacías para alinear el primer día
            if (index === 0 && offset > 0) {
              return (
                <React.Fragment key={`empty-${index}`}>
                  {Array.from({ length: offset }).map((_, i) => (
                    <div key={`empty-cell-${i}`} />
                  ))}
                  <TrackerCellComponent
                    cell={cell}
                    onClick={() => handleCellClick(cell)}
                    isSelected={selectedCell?.id === cell.id}
                  />
                </React.Fragment>
              );
            }

            return (
              <TrackerCellComponent
                key={cell.id}
                cell={cell}
                onClick={() => handleCellClick(cell)}
                isSelected={selectedCell?.id === cell.id}
              />
            );
          })}
        </div>
      </div>

      {/* Color Selector Dialog */}
      <AnimatePresence>
        {selectedCell && (
          <Dialog open={!!selectedCell} onOpenChange={() => setSelectedCell(null)}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-hogara-gold" />
                  Selecciona un Color
                </DialogTitle>
                <DialogDescription>
                  Día {selectedCell.date.getDate()} - Elige el color que representa este día
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-3 py-4">
                {config.legend.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleColorSelect(item)}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 border-transparent hover:border-hogara-gold transition-all"
                  >
                    <div
                      className="w-12 h-12 rounded-full shadow-md"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-center text-hogara-gray font-medium">
                      {item.label}
                    </span>
                  </button>
                ))}
                {config.legend.length === 0 && (
                  <div className="col-span-3 text-center py-8 text-sm text-hogara-gray/40">
                    No hay colores disponibles. Edita la leyenda para agregar.
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Legend Editor Dialog */}
      <Dialog open={editingLegend} onOpenChange={setEditingLegend}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Editar Leyenda</DialogTitle>
            <DialogDescription>
              Define los estados que quieres trackear (Hecho, No hecho, Sí, No, etc.)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Existing Legend Items */}
            <div className="space-y-2">
              {config.legend.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div
                    className="w-8 h-8 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="flex-1 font-medium text-sm">{item.label}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveLegendItem(item.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Add New Item */}
            <div className="border-t pt-4 space-y-3">
              <Label>Agregar Nuevo Estado</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ej: Hecho, Sí, Completado..."
                  value={newLegendItem.label}
                  onChange={(e) =>
                    setNewLegendItem({ ...newLegendItem, label: e.target.value })
                  }
                  className="flex-1"
                />
                <input
                  type="color"
                  value={newLegendItem.color}
                  onChange={(e) =>
                    setNewLegendItem({ ...newLegendItem, color: e.target.value })
                  }
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <Button size="sm" onClick={handleAddLegendItem} disabled={!newLegendItem.label}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Componente de celda individual
function TrackerCellComponent({
  cell,
  onClick,
  isSelected,
}: {
  cell: TrackerCell;
  onClick: () => void;
  isSelected: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`
        aspect-square rounded-lg border-2 relative
        transition-all duration-200
        ${isSelected ? 'border-hogara-gold scale-110 z-10' : 'border-gray-200'}
        ${!cell.color && 'bg-white hover:bg-gray-50'}
        hover:shadow-md
      `}
      style={{
        backgroundColor: cell.color || 'white',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span
        className={`
        text-xs font-medium
        ${cell.color ? 'text-white' : 'text-hogara-gray'}
      `}
      >
        {cell.date.getDate()}
      </span>
      {cell.notes && (
        <div className="absolute top-0 right-0 w-2 h-2 bg-hogara-gold rounded-full" />
      )}
    </motion.button>
  );
}
