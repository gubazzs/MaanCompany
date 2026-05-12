import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  weight: ['300', '400', '500', '600'],
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  weight: ['400', '500'],
})

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://maan-company.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'MANN Company — Marketing e Tecnologia Automotiva',
    template: '%s | MANN Company' 
  },
  description: 'Agência especializada no setor automotivo. Estruturamos estratégias digitais, funis comerciais e soluções tecnológicas.',
  keywords: ['marketing automotivo', 'tecnologia', 'estratégia digital', 'oficinas', 'estética automotiva'],
  
  // Configuração Robusta de Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // OpenGraph Base (Pode ser sobrescrito em páginas internas)
  openGraph: {
    title: 'MANN Company — Marketing e Tecnologia Automotiva',
    description: 'Soluções tecnológicas e marketing estratégico para o mercado automotivo.',
    url: BASE_URL,
    siteName: 'MANN Company',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/logowithback.jpg', // Caminho relativo funciona por causa do metadataBase
        width: 1200,
        height: 630,
        alt: 'MANN Company'
      }
    ]
  },

  alternates: {
    canonical: './', // O Next.js resolve para a URL base automaticamente
  }
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${geist.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  )
}
