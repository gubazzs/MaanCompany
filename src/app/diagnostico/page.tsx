import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import DiagnosticoFunnel from '@/components/DiagnosticoFunnel'

export const metadata: Metadata = {
  title: 'Diagnóstico Privado — MANN Company',
  description: 'Análise inicial para entender o momento da empresa, o potencial de crescimento e encaixe com a metodologia MANN.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
}

type DiagnosticoPageProps = {
  searchParams?: Promise<{
    from?: string | string[]
  }>
}

export default async function DiagnosticoPage({ searchParams }: DiagnosticoPageProps) {
  const params = await searchParams
  const from = Array.isArray(params?.from) ? params.from[0] : params?.from

  if (from !== 'home') {
    redirect('/')
  }

  return <DiagnosticoFunnel />
}
