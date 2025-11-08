
'use client';

import React from 'react';
import { AnnualTracker } from './annual-tracker';

const defaultLegend = [
  { id: '1', label: 'Ahorré', color: '#10B981', shortLabel: 'AH' },
  { id: '2', label: 'Balance neutro', color: '#FCD34D', shortLabel: 'BN' },
  { id: '3', label: 'Gasto extra', color: '#F87171', shortLabel: 'GE' },
  { id: '4', label: 'Inversión', color: '#8B5CF6', shortLabel: 'IN' },
];

export function FinanceTracker() {
  const handleSave = (data: any) => {
    console.log('Saving finance tracker:', data);
    // Aquí podrías guardar en la base de datos
  };

  return (
    <AnnualTracker
      title="Tracker Financiero"
      icon="💰"
      description="Monitorea tu salud financiera durante todo el año"
      defaultLegend={defaultLegend}
      onSave={handleSave}
    />
  );
}
