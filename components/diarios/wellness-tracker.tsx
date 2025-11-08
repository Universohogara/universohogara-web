
'use client';

import React from 'react';
import { AnnualTracker } from './annual-tracker';

const defaultLegend = [
  { id: '1', label: 'Día excelente', color: '#10B981', shortLabel: 'EX' },
  { id: '2', label: 'Día bueno', color: '#93C5FD', shortLabel: 'BU' },
  { id: '3', label: 'Día regular', color: '#FCD34D', shortLabel: 'RE' },
  { id: '4', label: 'Día difícil', color: '#F87171', shortLabel: 'DI' },
];

export function WellnessTracker() {
  const handleSave = (data: any) => {
    console.log('Saving wellness tracker:', data);
  };

  return (
    <AnnualTracker
      title="Tracker de Bienestar"
      icon="🌸"
      description="Monitorea tu bienestar emocional durante el año"
      defaultLegend={defaultLegend}
      onSave={handleSave}
    />
  );
}
