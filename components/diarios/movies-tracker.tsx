
'use client';

import React from 'react';
import { AnnualTracker } from './annual-tracker';

const defaultLegend = [
  { id: '1', label: 'Vi película', color: '#F59E0B', shortLabel: 'VP' },
  { id: '2', label: 'Vi serie', color: '#8B5CF6', shortLabel: 'VS' },
  { id: '3', label: 'Maratón', color: '#EC4899', shortLabel: 'MA' },
];

export function MoviesTracker() {
  const handleSave = (data: any) => {
    console.log('Saving movies tracker:', data);
  };

  return (
    <AnnualTracker
      title="Tracker de Películas y Series"
      icon="🎬"
      description="Registra lo que ves durante el año"
      defaultLegend={defaultLegend}
      onSave={handleSave}
    />
  );
}
