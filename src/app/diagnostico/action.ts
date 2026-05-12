'use server'

import { createHash } from 'node:crypto'
import { headers } from 'next/headers'
import {
  diagnosticoSubmissionSchema,
  type DiagnosticoSubmission,
} from '@/lib/diagnostico/schema'

const tableName = 'diagnostico_entries'
const rateLimitWindowMs = 5 * 60 * 1000

type SaveDiagnosticoResult =
  | { ok: true; id: string | null }
  | { ok: false; error: string; message?: string }

type SupabaseInsertError = {
  message?: string
}

function getClientIp(headerStore: Headers) {
  const forwardedFor = headerStore.get('x-forwarded-for')?.split(',')[0]?.trim()

  return (
    forwardedFor ||
    headerStore.get('x-real-ip') ||
    headerStore.get('cf-connecting-ip') ||
    'unknown'
  )
}

function hashIp(ip: string, salt: string) {
  return createHash('sha256')
    .update(`${salt}:${ip}`)
    .digest('hex')
}

export async function saveDiagnosticoSubmission(
  input: DiagnosticoSubmission,
): Promise<SaveDiagnosticoResult> {
  const parsed = diagnosticoSubmissionSchema.safeParse(input)

  if (!parsed.success) {
    return {
      ok: false,
      error: 'VALIDATION_ERROR',
      message: 'Dados incompletos ou inválidos',
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return {
      ok: false,
      error: 'SUPABASE_NOT_CONFIGURED',
      message: 'Supabase não configurado',
    }
  }

  const headerStore = await headers()
  const clientIp = getClientIp(headerStore)
  const ipHash = hashIp(clientIp, serviceRoleKey)
  const since = new Date(Date.now() - rateLimitWindowMs).toISOString()
  const rateLimitParams = new URLSearchParams({
    select: 'id,created_at',
    ip_hash: `eq.${ipHash}`,
    created_at: `gte.${since}`,
    limit: '1',
  })

  const rateLimitResponse = await fetch(
    `${supabaseUrl}/rest/v1/${tableName}?${rateLimitParams}`,
    {
      method: 'GET',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      cache: 'no-store',
    },
  )

  if (!rateLimitResponse.ok) {
    return {
      ok: false,
      error: 'RATE_LIMIT_CHECK_FAILED',
      message: 'Falha ao validar limite de envio',
    }
  }

  const recentEntries = await rateLimitResponse
    .json()
    .catch(() => []) as Array<{ id?: string }>

  if (recentEntries.length > 0) {
    return {
      ok: false,
      error: 'RATE_LIMITED',
      message: 'Aguarde 5 minutos antes de enviar outro diagnóstico',
    }
  }

  const { answers, outcome, metadata } = parsed.data
  const insertPayload = {
    outcome,
    ip_hash: ipHash,
    nome: answers.nome,
    empresa: answers.empresa,
    instagram: answers.instagram ?? null,
    whatsapp: answers.whatsapp,
    cidade: answers.cidade,
    segmento: answers.segmento,
    servico: answers.servico ?? null,
    gargalo: answers.gargalo ?? null,
    canais: answers.canais ?? [],
    follow: answers.follow ?? null,
    investe: answers.investe ?? null,
    frente: answers.frente ?? null,
    investimento: answers.investimento ?? null,
    intent: answers.intent ?? null,
    timing: answers.timing ?? null,
    answers,
    metadata: {
      ...metadata,
      rateLimitWindowMs,
    },
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${tableName}`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(insertPayload),
    cache: 'no-store',
  })

  if (!response.ok) {
    const error = await response.json().catch(() => null) as SupabaseInsertError | null

    return {
      ok: false,
      error: 'SUPABASE_INSERT_FAILED',
      message: error?.message ?? 'Falha ao salvar diagnóstico',
    }
  }

  const data = await response.json().catch(() => []) as Array<{ id?: string }>

  return {
    ok: true,
    id: data[0]?.id ?? null,
  }
}
