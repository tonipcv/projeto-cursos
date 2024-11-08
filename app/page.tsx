import Link from 'next/link'
import React from 'react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark to-dark-lighter">
      <main className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent mb-4">
            Plataforma de Cursos
          </h1>
          <p className="text-gray-400 text-lg">
            Gerencie seus cursos de forma simples e eficiente
          </p>
        </div>

        {/* Botão de Adicionar Curso */}
        <div className="flex justify-center mb-16">
          <Link
            href="/courses/new"
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-primary to-primary-light px-8 py-4 rounded-lg text-white font-medium shadow-lg hover:shadow-primary/50 transition-all duration-300"
          >
            <span className="text-2xl group-hover:rotate-90 transition-transform duration-300">+</span>
            <span>Adicionar Novo Curso</span>
          </Link>
        </div>

        {/* Lista de Cursos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card de exemplo - você pode mapear seus cursos aqui */}
          <div className="glass-effect rounded-xl p-6 border border-primary/10 hover:border-primary/30 transition-all group">
            <h2 className="text-xl font-semibold text-primary-light mb-3 group-hover:text-primary transition-colors">
              Nome do Curso
            </h2>
            <p className="text-gray-400 mb-4 text-sm">
              Breve descrição do curso...
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-primary/60 bg-primary/10 px-3 py-1 rounded-full">
                4 módulos
              </span>
              <Link 
                href="/courses/0b142441-1815-497f-8122-aa312ac2a0d1"
                className="text-primary hover:text-primary-light transition-colors"
              >
                Ver detalhes →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 