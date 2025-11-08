
'use client';

import React from 'react';
import { AnnualTracker } from './annual-tracker';

const defaultLegend = [
  { id: '1', label: 'Entrenamiento completo', color: '#10B981', shortLabel: 'EC' },
  { id: '2', label: 'Ejercicio ligero', color: '#93C5FD', shortLabel: 'EL' },
  { id: '3', label: 'Descanso activo', color: '#FCD34D', shortLabel: 'DA' },
  { id: '4', label: 'No entrené', color: '#F87171', shortLabel: 'NT' },
];

export function ExerciseTracker() {
  const handleSave = (data: any) => {
    console.log('Saving exercise tracker:', data);
    // Aquí podrías guardar en la base de datos
  };

  return (
    <AnnualTracker
      title="Tracker de Ejercicio"
      icon="🏋️‍♀️"
      description="Trackea tus entrenamientos durante todo el año"
      defaultLegend={defaultLegend}
      onSave={handleSave}
    />
  );
}
