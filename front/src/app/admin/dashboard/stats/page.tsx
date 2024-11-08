'use client';

import React from 'react';
import { BarChart } from 'lucide-react';

export default function StatsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold flex items-center">
        <BarChart className="mr-2" />
        Estatísticas
      </h1>
      {/* Resto do conteúdo */}
    </div>
  );
} 