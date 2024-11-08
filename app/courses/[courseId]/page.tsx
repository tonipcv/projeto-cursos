'use client'

import React, { useEffect, useState } from 'react'

export default function CoursePage({ params }: { params: { courseId: string } }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark to-dark-lighter">
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header do curso */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            Nome do Curso
          </h1>
          <div className="mt-4 h-1 w-24 bg-gradient-to-r from-primary to-primary-light mx-auto rounded-full"></div>
        </div>

        {/* Conteúdo principal */}
        <div className="space-y-8">
          {/* Seção de descrição */}
          <section className="glass-effect rounded-xl p-6">
            <h2 className="text-xl font-medium text-primary-light mb-4">
              Sobre o curso
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Descrição do curso aqui...
            </p>
          </section>

          {/* Seção de módulos */}
          <section className="space-y-6">
            <h2 className="text-xl font-medium text-primary-light">
              Módulos do curso
            </h2>
            <div className="grid gap-4">
              {/* Card de módulo */}
              <div className="group glass-effect rounded-xl p-6 transition-all duration-300 hover:bg-dark-lighter/50 border border-primary/10 hover:border-primary/30">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-primary group-hover:text-primary-light transition-colors">
                    Módulo 1
                  </h3>
                  <span className="text-xs text-primary/60 bg-primary/10 px-3 py-1 rounded-full">
                    4 aulas
                  </span>
                </div>
                <p className="mt-3 text-gray-400 text-sm">
                  Descrição do módulo...
                </p>
              </div>
              
              {/* Mais módulos... */}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
} 