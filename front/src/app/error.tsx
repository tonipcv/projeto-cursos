'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">
          Algo deu errado!
        </h2>
        <div className="space-y-4">
          <p className="text-gray-400">
            {error.message || 'Ocorreu um erro inesperado'}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={reset}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Tentar novamente
            </button>
            <Link
              href="/"
              className="px-4 py-2 bg-dark-lighter text-white rounded-lg hover:bg-dark-card transition-colors"
            >
              Voltar para Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 