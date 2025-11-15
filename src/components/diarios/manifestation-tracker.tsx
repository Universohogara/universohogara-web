
'use client';

import React from 'react';
import { AnnualTracker } from './annual-tracker';

const defaultLegend = [
  { id: '1', label: 'Manifesté', color: '#8B5CF6', shortLabel: 'MA' },
  { id: '2', label: 'Visualicé', color: '#EC4899', shortLabel: 'VI' },
  { id: '3', label: 'Afirmaciones', color: '#F59E0B', shortLabel: 'AF' },
];

export function ManifestationTracker() {
  const handleSave = (data: any) => {
    console.log('Saving manifestation tracker:', data);
  };

  return (
    <AnnualTracker
      title="Tracker de Manifestación"
      icon="✨"
      description="Registra tu práctica de manifestación durante el año"
      defaultLegend={defaultLegend}
      onSave={handleSave}
    />
  );
}
