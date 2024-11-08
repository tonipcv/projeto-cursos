'use client';

import React from 'react';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold flex items-center">
        <Settings className="mr-2" />
        Configurações
      </h1>
      {/* Resto do conteúdo */}
    </div>
  );
} 