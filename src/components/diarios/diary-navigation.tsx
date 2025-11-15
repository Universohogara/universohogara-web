
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DiaryNavigation as DiaryNav, DiaryView } from '@/lib/diary-types';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DiaryNavigationProps {
  navigation: DiaryNav;
  onNavigate: (nav: DiaryNav) => void;
  availableViews: DiaryView[];
}

export function DiaryNavigation({
  navigation,
  onNavigate,
  availableViews,
}: DiaryNavigationProps) {
  const viewLabels: Record<DiaryView, string> = {
    yearly: 'Anual',
    monthly: 'Mensual',
    weekly: 'Semanal',
    daily: 'Diario',
  };

  const handlePrevious = () => {
    const newDate = new Date(navigation.currentDate);
    switch (navigation.currentView) {
      case 'yearly':
        newDate.setFullYear(newDate.getFullYear() - 1);
        break;
      case 'monthly':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case 'weekly':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'daily':
        newDate.setDate(newDate.getDate() - 1);
        break;
    }
    onNavigate({ ...navigation, currentDate: newDate });
  };

  const handleNext = () => {
    const newDate = new Date(navigation.currentDate);
    switch (navigation.currentView) {
      case 'yearly':
        newDate.setFullYear(newDate.getFullYear() + 1);
        break;
      case 'monthly':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case 'weekly':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'daily':
        newDate.setDate(newDate.getDate() + 1);
        break;
    }
    onNavigate({ ...navigation, currentDate: newDate });
  };

  const handleViewChange = (view: DiaryView) => {
    onNavigate({ ...navigation, currentView: view });
  };

  const getDateLabel = () => {
    const date = navigation.currentDate;
    const months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    switch (navigation.currentView) {
      case 'yearly':
        return date.getFullYear().toString();
      case 'monthly':
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
      case 'weekly':
        return `Semana del ${date.getDate()} ${months[date.getMonth()]}`;
      case 'daily':
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    }
  };

  return (
    <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-hogara-gold/20">
      {/* View Selector */}
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-hogara-gold" />
        <Select
          value={navigation.currentView}
          onValueChange={(value) => handleViewChange(value as DiaryView)}
        >
          <SelectTrigger className="w-32 border-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableViews.map((view) => (
              <SelectItem key={view} value={view}>
                {viewLabels[view]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={handlePrevious}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <motion.div
          key={getDateLabel()}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-w-48 text-center font-serif font-bold text-hogara-gray"
        >
          {getDateLabel()}
        </motion.div>
        <Button variant="ghost" size="sm" onClick={handleNext}>
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Today Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          onNavigate({
            ...navigation,
            currentDate: new Date(),
          })
        }
        className="border-hogara-gold text-hogara-gold hover:bg-hogara-gold/10"
      >
        Hoy
      </Button>
    </div>
  );
}
