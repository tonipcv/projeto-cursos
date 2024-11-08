import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} min-h-screen bg-dark antialiased`}>
        {children}
      </body>
    </html>
  )
}

export const metadata = {
  title: 'Plataforma de Cursos',
  description: 'Gerencie seus cursos de forma simples e eficiente',
}
