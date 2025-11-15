
'use client';

import React from 'react';
import { AnnualTracker } from './annual-tracker';

const defaultLegend = [
  { id: '1', label: 'Leí', color: '#8B5CF6', shortLabel: 'LE' },
  { id: '2', label: 'No leí', color: '#F87171', shortLabel: 'NL' },
  { id: '3', label: 'Terminé un libro', color: '#10B981', shortLabel: 'TL' },
];

export function ReadingTracker() {
  const handleSave = (data: any) => {
    console.log('Saving reading tracker:', data);
  };

  return (
    <AnnualTracker
      title="Tracker de Lectura"
      icon="📚"
      description="Registra tus días de lectura durante el año"
      defaultLegend={defaultLegend}
      onSave={handleSave}
    />
  );
}
