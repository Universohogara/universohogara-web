
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Palette, Save, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface TrackerLegendItem {
  id: string;
  label: string;
  color: string;
  shortLabel: string;
}

interface TrackerCell {
  date: Date;
  color: string | null;
  legendItemId: string | null;
}

interface AnnualTrackerProps {
  title: string;
  icon: string;
  description: string;
  defaultLegend?: TrackerLegendItem[];
  onSave?: (data: { cells: TrackerCell[]; legend: TrackerLegendItem[] }) => void;
}

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export function AnnualTracker({ 
  title, 
  icon, 
  description, 
  defaultLegend = [],
  onSave 
}: AnnualTrackerProps) {
  const currentYear = new Date().getFullYear();
  const [currentPage, setCurrentPage] = useState(0); // 0, 1, 2 (3 hojas)
  const [cells, setCells] = useState<TrackerCell[]>([]);
  const [legend, setLegend] = useState<TrackerLegendItem[]>(defaultLegend);
  const [selectedCell, setSelectedCell] = useState<{ month: number; day: number } | null>(null);
  const [editingLegend, setEditingLegend] = useState(false);
  const [newLegendItem, setNewLegendItem] = useState({ label: '', color: '#D8B480' });

  // Cada hoja muestra 4 meses
  const monthsPerPage = 4;
  const startMonth = currentPage * monthsPerPage;
  const endMonth = Math.min(startMonth + monthsPerPage, 12);
  const visibleMonths = MONTHS.slice(startMonth, endMonth);

  const getDaysInMonth = (month: number) => {
    return new Date(currentYear, month + 1, 0).getDate();
  };

  const getCellColor = (month: number, day: number) => {
    const cell = cells.find(
      c => c.date.getMonth() === month && c.date.getDate() === day
    );
    return cell?.color || null;
  };

  const handleCellClick = (month: number, day: number) => {
    setSelectedCell({ month, day });
  };

  const handleColorSelect = (legendItem: TrackerLegendItem) => {
    if (!selectedCell) return;

    const date = new Date(currentYear, selectedCell.month, selectedCell.day);
    const existingCellIndex = cells.findIndex(
      c => c.date.getMonth() === selectedCell.month && c.date.getDate() === selectedCell.day
    );

    if (existingCellIndex >= 0) {
      const newCells = [...cells];
      newCells[existingCellIndex] = {
        ...newCells[existingCellIndex],
        color: legendItem.color,
        legendItemId: legendItem.id
      };
      setCells(newCells);
    } else {
      setCells([...cells, {
        date,
        color: legendItem.color,
        legendItemId: legendItem.id
      }]);
    }

    setSelectedCell(null);
  };

  const handleAddLegendItem = () => {
    if (!newLegendItem.label.trim()) return;

    const item: TrackerLegendItem = {
      id: `legend-${Date.now()}`,
      label: newLegendItem.label,
      color: newLegendItem.color,
      shortLabel: newLegendItem.label.substring(0, 2).toUpperCase(),
    };

    setLegend([...legend, item]);
    setNewLegendItem({ label: '', color: '#D8B480' });
  };

  const handleRemoveLegendItem = (id: string) => {
    setLegend(legend.filter(l => l.id !== id));
    // Limpiar celdas que usan este item
    setCells(cells.filter(c => c.legendItemId !== id));
  };

  const handleSave = () => {
    if (onSave) {
      onSave({ cells, legend });
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-serif font-bold text-hogara-gray flex items-center gap-2">
            <span className="text-3xl">{icon}</span>
            {title}
          </h3>
          <p className="text-sm text-hogara-gray/60 mt-1">{description}</p>
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
              onClick={handleSave}
              className="bg-hogara-gold text-white hover:bg-hogara-gold/90"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </Button>
          )}
        </div>
      </div>

      {/* Leyenda */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-hogara-gold/20">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-hogara-gold" />
          <span className="text-sm font-medium text-hogara-gray">Leyenda:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {legend.map((item) => (
            <Badge
              key={item.id}
              className="text-sm"
              style={{ backgroundColor: item.color, color: '#fff' }}
            >
              {item.label}
            </Badge>
          ))}
          {legend.length === 0 && (
            <span className="text-sm text-hogara-gray/40">
              No hay elementos en la leyenda. Haz clic en "Editar Leyenda" para agregar.
            </span>
          )}
        </div>
      </div>

      {/* Tracker Anual - Vista de 4 meses por hoja */}
      <div className="bg-gradient-to-br from-white to-hogara-pink/5 rounded-2xl p-6 shadow-lg border border-hogara-gold/20">
        {/* Navegación de páginas */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="text-hogara-gray"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Anterior
          </Button>
          <div className="text-sm font-medium text-hogara-gray">
            Hoja {currentPage + 1} de 3 • {currentYear}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage(Math.min(2, currentPage + 1))}
            disabled={currentPage === 2}
            className="text-hogara-gray"
          >
            Siguiente
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Grid de 4 meses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleMonths.map((monthName, index) => {
            const monthIndex = startMonth + index;
            const daysInMonth = getDaysInMonth(monthIndex);
            
            return (
              <div key={monthName} className="space-y-3">
                <h4 className="text-lg font-serif font-bold text-hogara-gray text-center">
                  {monthName}
                </h4>
                <div className="grid grid-cols-7 gap-1">
                  {/* Headers días de la semana */}
                  {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => (
                    <div
                      key={day}
                      className="text-center text-[10px] font-medium text-hogara-gray/60 pb-1"
                    >
                      {day}
                    </div>
                  ))}

                  {/* Celdas del mes */}
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                    const date = new Date(currentYear, monthIndex, day);
                    const dayOfWeek = date.getDay();
                    const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                    const cellColor = getCellColor(monthIndex, day);

                    // Agregar espacios vacíos para el primer día
                    if (day === 1 && offset > 0) {
                      return (
                        <React.Fragment key={`${monthName}-${day}`}>
                          {Array.from({ length: offset }).map((_, i) => (
                            <div key={`empty-${i}`} />
                          ))}
                          <TrackerCell
                            day={day}
                            color={cellColor}
                            onClick={() => handleCellClick(monthIndex, day)}
                          />
                        </React.Fragment>
                      );
                    }

                    return (
                      <TrackerCell
                        key={`${monthName}-${day}`}
                        day={day}
                        color={cellColor}
                        onClick={() => handleCellClick(monthIndex, day)}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Color Selector Dialog */}
      <Dialog open={!!selectedCell} onOpenChange={() => setSelectedCell(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-hogara-gold" />
              Selecciona un Color
            </DialogTitle>
            <DialogDescription>
              {selectedCell && `${selectedCell.day} de ${MONTHS[selectedCell.month]}`} - Elige el color que representa este día
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-3 py-4">
            {legend.map((item) => (
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
            {legend.length === 0 && (
              <div className="col-span-3 text-center py-8 text-sm text-hogara-gray/40">
                No hay colores disponibles. Edita la leyenda para agregar.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Legend Editor Dialog */}
      <Dialog open={editingLegend} onOpenChange={setEditingLegend}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Editar Leyenda</DialogTitle>
            <DialogDescription>
              Define los estados que quieres trackear durante el año
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Existing Legend Items */}
            <div className="space-y-2">
              {legend.map((item) => (
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
                    ✕
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
                <Button 
                  size="sm" 
                  onClick={handleAddLegendItem} 
                  disabled={!newLegendItem.label.trim()}
                  className="bg-hogara-gold text-white hover:bg-hogara-gold/90"
                >
                  +
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
function TrackerCell({
  day,
  color,
  onClick,
}: {
  day: number;
  color: string | null;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`
        aspect-square rounded-md border relative
        transition-all duration-200 text-[10px] font-medium
        ${!color && 'bg-white hover:bg-gray-50 border-gray-200'}
        hover:shadow-md hover:scale-110
      `}
      style={{
        backgroundColor: color || 'white',
        borderColor: color ? color : '#e5e7eb',
        color: color ? 'white' : '#6b7280'
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {day}
    </motion.button>
  );
}
