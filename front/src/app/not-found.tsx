import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">
          Página não encontrada
        </h2>
        <p className="text-gray-400 mb-4">
          A página que você está procurando não existe.
        </p>
        <Link
          href="/"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Voltar para Home
        </Link>
      </div>
    </div>
  );
} 