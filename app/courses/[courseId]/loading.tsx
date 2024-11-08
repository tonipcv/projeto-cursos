import React from 'react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark to-dark-lighter">
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header skeleton */}
        <div className="mb-12 text-center">
          <div className="h-10 w-64 bg-dark-lighter rounded-lg mx-auto animate-pulse"></div>
          <div className="mt-4 h-1 w-24 bg-dark-lighter mx-auto rounded-full animate-pulse"></div>
        </div>

        {/* Content skeleton */}
        <div className="space-y-8">
          <section className="glass-effect rounded-xl p-6">
            <div className="h-6 w-40 bg-dark-lighter rounded animate-pulse mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 w-full bg-dark-lighter rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-dark-lighter rounded animate-pulse"></div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="h-6 w-48 bg-dark-lighter rounded animate-pulse"></div>
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-effect rounded-xl p-6">
                  <div className="flex justify-between items-center mb-3">
                    <div className="h-5 w-32 bg-dark-lighter rounded animate-pulse"></div>
                    <div className="h-4 w-16 bg-dark-lighter rounded-full animate-pulse"></div>
                  </div>
                  <div className="h-4 w-2/3 bg-dark-lighter rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
} 