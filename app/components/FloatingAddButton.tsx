'use client'

import Link from 'next/link'
import React from 'react'

export default function FloatingAddButton() {
  return (
    <Link
      href="/courses/new"
      className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-primary to-primary-light rounded-full flex items-center justify-center shadow-lg hover:shadow-primary/50 transition-all duration-300 group"
    >
      <span className="text-white text-3xl transform group-hover:scale-110 transition-transform">
        +
      </span>
      
      {/* Tooltip */}
      <span className="absolute right-16 bg-dark-lighter px-3 py-1 rounded text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Adicionar novo curso
      </span>
    </Link>
  )
} 