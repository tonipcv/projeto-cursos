import React from 'react'
import './globals.css'
import FloatingAddButton from './components/FloatingAddButton'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-dark antialiased" suppressHydrationWarning>
        {children}
        <FloatingAddButton />
      </body>
    </html>
  )
} 