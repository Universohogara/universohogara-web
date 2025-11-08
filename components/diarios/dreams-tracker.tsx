
'use client';

import React from 'react';
import { AnnualTracker } from './annual-tracker';

const defaultLegend = [
  { id: '1', label: 'Recordé sueño', color: '#8B5CF6', shortLabel: 'RS' },
  { id: '2', label: 'Sueño vívido', color: '#EC4899', shortLabel: 'SV' },
  { id: '3', label: 'Pesadilla', color: '#EF4444', shortLabel: 'PE' },
  { id: '4', label: 'No recordé', color: '#94A3B8', shortLabel: 'NR' },
];

export function DreamsTracker() {
  const handleSave = (data: any) => {
    console.log('Saving dreams tracker:', data);
  };

  return (
    <AnnualTracker
      title="Tracker de Sueños"
      icon="🌙"
      description="Registra tus sueños durante el año"
      defaultLegend={defaultLegend}
      onSave={handleSave}
    />
  );
}
