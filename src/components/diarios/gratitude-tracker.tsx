
'use client';

import React from 'react';
import { AnnualTracker } from './annual-tracker';

const defaultLegend = [
  { id: '1', label: 'Practiqué gratitud', color: '#F59E0B', shortLabel: 'PG' },
  { id: '2', label: 'No practiqué', color: '#94A3B8', shortLabel: 'NP' },
];

export function GratitudeTracker() {
  const handleSave = (data: any) => {
    console.log('Saving gratitude tracker:', data);
  };

  return (
    <AnnualTracker
      title="Tracker de Gratitud"
      icon="🙏"
      description="Registra tus momentos de gratitud durante el año"
      defaultLegend={defaultLegend}
      onSave={handleSave}
    />
  );
}
