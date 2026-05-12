'use client'

import { useState, useEffect, useRef, useCallback, type FormEvent, type RefObject } from 'react'
import Link from 'next/link'
import { saveDiagnosticoSubmission } from '@/app/diagnostico/action'
import {
  canaisOptions,
  diagnosticoFieldSchemas,
  diagnosticoSubmissionSchema,
  type DiagnosticoAnswers,
  type DiagnosticoFieldName,
  type DiagnosticoOutcome,
  frenteOptions,
  followOptions,
  gargaloOptions,
  intentOptions,
  investimentoOptions,
  investeOptions,
  segmentoOptions,
  timingOptions,
} from '@/lib/diagnostico/schema'

// ── Types ──────────────────────────────────────────────────────────────────

type StepKind = 'cover' | 'input' | 'textarea' | 'single' | 'multi' | 'outcome'

interface Action {
  kind: 'continue' | 'link' | 'wa'
  label: string
  href?: string
  ghost?: boolean
}

interface StepDef {
  id: string
  kind: StepKind
  field?: DiagnosticoFieldName
  label?: string
  title: string
  text?: string
  help?: string
  placeholder?: string
  inputType?: string
  required?: boolean
  options?: readonly string[]
  nextOf?: (v: string) => string | null
  actions?: Action[]
  meta?: { k: string; v: string }[]
  cta?: string
  terminal?: boolean
  hideFromProgress?: boolean
}

// ── Steps data ─────────────────────────────────────────────────────────────

const STEPS: StepDef[] = [
  {
    id: 'cover', kind: 'cover',
    title: 'Sua empresa automotiva está pronta para operar em <em>outro nível</em>?',
    text: 'A MANN Company trabalha com um número limitado de negócios automotivos por ciclo. Antes de qualquer proposta, realizamos uma análise inicial para entender o momento da empresa, o potencial de crescimento e se existe encaixe com nossa metodologia.',
    meta: [
      { k: 'Duração', v: '2 — 3 minutos' },
      { k: 'Perguntas', v: '14' },
      { k: 'Etapa', v: 'Aplicação privada' },
    ],
    cta: 'Solicitar análise privada',
  },
  {
    id: 'nome', kind: 'input', field: 'nome', label: '01 — Identificação',
    title: 'Qual é o seu <em>nome</em>?', placeholder: 'Como devemos te chamar', required: true,
  },
  {
    id: 'empresa', kind: 'input', field: 'empresa', label: '02 — Identificação',
    title: 'Qual é o nome da <em>empresa</em>?', placeholder: 'Nome comercial', required: true,
  },
  {
    id: 'instagram', kind: 'input', field: 'instagram', label: '03 — Identificação',
    title: 'Qual é o <em>Instagram</em> da empresa?', placeholder: '@suaempresa',
  },
  {
    id: 'whatsapp', kind: 'input', field: 'whatsapp', inputType: 'tel', label: '04 — Identificação',
    title: 'Qual <em>WhatsApp</em> devemos usar para contato?', placeholder: '(00) 00000-0000', required: true,
  },
  {
    id: 'cidade', kind: 'input', field: 'cidade', label: '05 — Identificação',
    title: 'Qual <em>cidade e estado</em> vocês atendem?', placeholder: 'Cidade / UF', required: true,
  },
  {
    id: 'segmento', kind: 'single', field: 'segmento', label: '06 — Encaixe com o setor',
    title: 'Em qual categoria sua empresa se encaixa <em>hoje</em>?',
    options: segmentoOptions,
    nextOf: (v) => v === 'Não sou do setor automotivo' ? 'out_icp' : null,
  },
  {
    id: 'out_icp', kind: 'outcome', terminal: true, hideFromProgress: true,
    label: 'Final — Fora de ICP',
    title: 'Neste momento, a MANN é focada no <em>setor automotivo</em>.',
    text: 'Nossa metodologia, operação e estrutura foram desenhadas para negócios automotivos. Por isso, neste momento, priorizamos empresas desse mercado para manter profundidade, especialização e qualidade de entrega.',
    actions: [{ kind: 'link', label: 'Encerrar aplicação', href: '/' }],
  },
  {
    id: 'servico', kind: 'textarea', field: 'servico', label: '07 — Oferta e prioridade',
    title: 'Qual serviço ou produto vocês <em>mais querem vender</em> nos próximos meses?',
    help: 'Pense no serviço com maior margem, maior potencial ou maior importância estratégica.',
    placeholder: 'Conte em poucas linhas', required: true,
  },
  {
    id: 'gargalo', kind: 'single', field: 'gargalo', label: '08 — Oferta e prioridade',
    title: 'Hoje, qual é o <em>maior gargalo</em> da empresa?',
    options: gargaloOptions,
  },
  {
    id: 'canais', kind: 'multi', field: 'canais', label: '09 — Oferta e prioridade',
    title: 'Como os clientes <em>chegam hoje</em>?',
    help: 'Pode selecionar quantos fizerem sentido.',
    options: canaisOptions,
  },
  {
    id: 'follow', kind: 'single', field: 'follow', label: '10 — Maturidade comercial',
    title: 'Quando um lead entra em contato, vocês conseguem acompanhar <em>até o fechamento</em>?',
    options: followOptions,
  },
  {
    id: 'investe', kind: 'single', field: 'investe', label: '11 — Maturidade comercial',
    title: 'Hoje vocês já investem em <em>marketing, tráfego ou conteúdo</em>?',
    options: investeOptions,
  },
  {
    id: 'inter_posicionamento', kind: 'outcome', hideFromProgress: true,
    label: 'Pausa estratégica',
    title: 'A MANN não entrega <em>campanhas soltas</em>.',
    text: 'Nosso trabalho é construir estruturas comerciais para negócios automotivos que querem crescer com mais método, percepção de valor e controle. Podemos atuar em aquisição, funil, conteúdo, performance, inteligência comercial, dashboards, CRM, agentes e produção audiovisual — sempre de acordo com o estágio da empresa.',
    actions: [{ kind: 'continue', label: 'Continuar análise' }],
  },
  {
    id: 'frente', kind: 'single', field: 'frente', label: '12 — Direção de solução',
    title: 'Qual frente parece <em>mais importante</em> para o momento da empresa?',
    options: frenteOptions,
  },
  {
    id: 'investimento', kind: 'single', field: 'investimento', label: '13 — Investimento',
    title: 'Qual faixa de <em>investimento</em> faz sentido neste momento?',
    help: 'A MANN atua com projetos estratégicos e escopo fechado.',
    options: investimentoOptions,
    nextOf: (v) => {
      if (v === 'Até R$ 3.000') return 'out_invest_low'
      if (v === 'Prefiro entender antes') return 'intent'
      return null
    },
  },
  {
    id: 'out_invest_low', kind: 'outcome', terminal: true, hideFromProgress: true,
    label: 'Final — Momento de espera',
    title: 'Talvez ainda <em>não seja o melhor momento</em>.',
    text: 'O trabalho da MANN envolve estratégia, execução especializada, análise comercial e construção de estrutura para negócios automotivos. Nossos projetos costumam partir de investimentos acima de R$ 3.000, variando conforme escopo e profundidade da entrega. Se neste momento sua empresa busca algo abaixo desse valor, talvez faça mais sentido acompanhar nossos conteúdos e retornar quando estiver pronta para estruturar uma operação mais completa.',
    actions: [
      { kind: 'link', label: 'Acompanhar a MANN', href: '/' },
    ],
  },
  {
    id: 'intent', kind: 'single', field: 'intent', label: '13B — Intenção', hideFromProgress: true,
    title: 'Você está buscando apenas <em>referência de preço</em> ou já considera investir?',
    options: intentOptions,
    nextOf: (v) => {
      if (v === 'Quero apenas entender valores') return 'out_nutricao'
      if (v === 'Ainda não tenho intenção de contratar') return 'out_nutricao'
      return null
    },
  },
  {
    id: 'timing', kind: 'single', field: 'timing', label: '14 — Timing',
    title: 'Caso exista encaixe, <em>quando</em> você gostaria de iniciar?',
    options: timingOptions,
  },
  {
    id: 'final_qualified', kind: 'outcome', terminal: true, hideFromProgress: true,
    label: 'Final — Encaixe identificado',
    title: 'Existe <em>potencial de encaixe</em>.',
    text: 'Pelas suas respostas, sua empresa parece estar em um momento onde a MANN pode contribuir com estratégia, aquisição e estrutura comercial. O próximo passo é uma conversa privada para entender o cenário com mais profundidade e indicar o melhor caminho: MANN Start, Auto Growth, Softwares ou Visual Assets.',
    actions: [{ kind: 'wa', label: 'Falar com a MANN no WhatsApp' }],
  },
  {
    id: 'out_nutricao', kind: 'outcome', terminal: true, hideFromProgress: true,
    label: 'Final — Nutrição',
    title: 'Obrigado pelo <em>interesse</em> na MANN.',
    text: 'Neste momento, talvez ainda não exista alinhamento para uma conversa estratégica. A MANN trabalha com projetos de crescimento para negócios automotivos que estão prontos para investir em aquisição, posicionamento e estrutura comercial. Você pode acompanhar nossos conteúdos e retornar quando sua empresa estiver em um momento mais adequado.',
    actions: [{ kind: 'link', label: 'Acompanhar a MANN', href: '/' }],
  },
]

const stepIndex: Record<string, number> = Object.fromEntries(
  STEPS.map((s, i) => [s.id, i]),
)
const visibleSteps = STEPS.filter((s) => !s.hideFromProgress && s.kind !== 'cover')
const totalVisible = visibleSteps.length
const terminalOutcomes = new Set<string>(['out_icp', 'out_invest_low', 'out_nutricao', 'final_qualified'])

type SubmissionState = {
  status: 'idle' | 'submitting' | 'submitted' | 'error'
  message?: string
}

function isDiagnosticOutcome(id: string): id is DiagnosticoOutcome {
  return terminalOutcomes.has(id)
}

function compactAnswers(data: Partial<Record<DiagnosticoFieldName, unknown>>): Partial<DiagnosticoAnswers> {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => {
      if (value == null) return false
      if (typeof value === 'string') return value.trim().length > 0
      if (Array.isArray(value)) return value.length > 0
      return true
    }),
  ) as Partial<DiagnosticoAnswers>
}

function formatBrazilPhone(value: string) {
  const rawDigits = value.replace(/\D/g, '')
  const digits = rawDigits.length > 11 && rawDigits.startsWith('55')
    ? rawDigits.slice(2, 13)
    : rawDigits.slice(0, 11)

  if (digits.length === 0) return ''
  if (digits.length <= 2) return `(${digits}`

  const ddd = digits.slice(0, 2)
  const number = digits.slice(2)
  const prefixLength = digits.length > 10 ? 5 : 4
  const prefix = number.slice(0, prefixLength)
  const suffix = number.slice(prefixLength, prefixLength + 4)

  return `(${ddd}) ${prefix}${suffix ? `-${suffix}` : ''}`
}

// ── Component ───────────────────────────────────────────────────────────────

export default function DiagnosticoFunnel() {
  const [history, setHistory] = useState<number[]>([1]) // start at nome, skip cover
  const [inputVal, setInputVal] = useState('')
  const [inputError, setInputError] = useState('')
  const [inputInvalid, setInputInvalid] = useState(false)
  const [selectedOpts, setSelectedOpts] = useState<string[]>([])
  const [submission, setSubmission] = useState<SubmissionState>({ status: 'idle' })
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)
  const formDataRef = useRef<Partial<Record<DiagnosticoFieldName, unknown>>>({})
  const startedAtRef = useRef(new Date().toISOString())
  const submittedKeyRef = useRef<string | null>(null)
  const pendingSubmissionRef = useRef<{ key: string; promise: Promise<boolean> } | null>(null)

  const currentIdx = history[history.length - 1]
  const step = STEPS[currentIdx]

  // Sync local state when step changes
  useEffect(() => {
    const syncTimer = window.setTimeout(() => {
      const activeStep = STEPS[currentIdx]

      if (!activeStep?.field) {
        setInputVal('')
        setInputError('')
        setInputInvalid(false)
        setSelectedOpts([])
        return
      }

      const existing = formDataRef.current[activeStep.field]
      if (activeStep.kind === 'input' || activeStep.kind === 'textarea') {
        setInputVal(typeof existing === 'string' ? existing : '')
        setInputError('')
        setInputInvalid(false)
      } else if (activeStep.kind === 'single') {
        setSelectedOpts(typeof existing === 'string' ? [existing] : [])
      } else if (activeStep.kind === 'multi') {
        setSelectedOpts(Array.isArray(existing) ? existing : [])
      }
    }, 0)
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 350)

    return () => {
      window.clearTimeout(syncTimer)
      window.clearTimeout(focusTimer)
    }
  }, [currentIdx])

  const navigate = useCallback((nextIdx: number) => {
    if (nextIdx == null || nextIdx >= STEPS.length) return
    setHistory((prev) => [...prev, nextIdx])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const goNext = useCallback(
    (forceId?: string) => {
      const cur = STEPS[currentIdx]
      let nextIdx: number

      if (forceId) {
        nextIdx = stepIndex[forceId]
      } else {
        nextIdx = currentIdx + 1
        if (cur.id === 'segmento') nextIdx = stepIndex['servico']
        if (cur.id === 'investimento' && formDataRef.current.investimento !== 'Prefiro entender antes') {
          nextIdx = stepIndex['timing']
        }
        if (cur.id === 'intent') nextIdx = stepIndex['timing']
        if (cur.id === 'timing') nextIdx = stepIndex['final_qualified']
      }

      navigate(nextIdx)
    },
    [currentIdx, navigate],
  )

  const goBack = useCallback(() => {
    setHistory((prev) => (prev.length <= 1 ? prev : prev.slice(0, -1)))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const saveField = useCallback((field: DiagnosticoFieldName, value: unknown) => {
    formDataRef.current = { ...formDataRef.current, [field]: value }
  }, [])

  const getCurrentFieldError = (): string | null => {
    if (!step.field) return null

    const schema = diagnosticoFieldSchemas[step.field]
    const value = step.kind === 'multi'
      ? selectedOpts
      : step.kind === 'single'
        ? selectedOpts[0]
        : inputVal
    const parsed = schema.safeParse(value)

    return parsed.success ? null : parsed.error.issues[0]?.message ?? 'Campo inválido'
  }

  const validateInput = (): boolean => {
    return getCurrentFieldError() == null
  }

  const handleInputChange = (val: string) => {
    const nextValue = step.field === 'whatsapp' ? formatBrazilPhone(val) : val

    setInputVal(nextValue)
    if (step.field) saveField(step.field, nextValue)
    setInputError('')
    setInputInvalid(false)
  }

  const handleInputNext = () => {
    const error = getCurrentFieldError()

    if (error) {
      setInputInvalid(true)
      setInputError(error)
      inputRef.current?.focus()
      return
    }

    if (step.field) {
      const parsed = diagnosticoFieldSchemas[step.field].safeParse(inputVal)
      if (parsed.success) saveField(step.field, parsed.data)
    }

    goNext()
  }

  const handleMultiNext = () => {
    const error = getCurrentFieldError()

    if (error) {
      setInputError(error)
      return
    }

    goNext()
  }

  const submitDiagnostic = useCallback(async (outcome: DiagnosticoOutcome) => {
    const payload = {
      outcome,
      answers: compactAnswers(formDataRef.current),
      metadata: {
        source: 'diagnostico_funnel',
        path: window.location.pathname,
        startedAt: startedAtRef.current,
        submittedAt: new Date().toISOString(),
        userAgent: window.navigator.userAgent,
      },
    }
    const parsed = diagnosticoSubmissionSchema.safeParse(payload)

    if (!parsed.success) {
      setSubmission({
        status: 'error',
        message: 'Dados incompletos. Volte e revise as respostas obrigatórias.',
      })
      return false
    }

    const submissionKey = JSON.stringify(parsed.data)
    if (submittedKeyRef.current === submissionKey) return true
    if (pendingSubmissionRef.current?.key === submissionKey) {
      return pendingSubmissionRef.current.promise
    }

    setSubmission({ status: 'submitting' })

    const promise = (async () => {
      const result = await saveDiagnosticoSubmission(parsed.data)

      if (!result.ok) {
        throw new Error(result.message ?? 'Falha ao salvar diagnóstico')
      }

      submittedKeyRef.current = submissionKey
      setSubmission({ status: 'submitted' })
      return true
    })()

    pendingSubmissionRef.current = { key: submissionKey, promise }

    try {
      return await promise
    } catch (error) {
      setSubmission({
        status: 'error',
        message: error instanceof Error ? error.message : 'Falha ao salvar diagnóstico',
      })
      return false
    } finally {
      if (pendingSubmissionRef.current?.key === submissionKey) {
        pendingSubmissionRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const outcome = step.id

    if (step.kind === 'outcome' && step.terminal && isDiagnosticOutcome(outcome)) {
      const submitTimer = window.setTimeout(() => {
        void submitDiagnostic(outcome)
      }, 0)

      return () => window.clearTimeout(submitTimer)
    }
  }, [step.id, step.kind, step.terminal, submitDiagnostic])

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (step.kind === 'input' || step.kind === 'textarea') {
      handleInputNext()
      return
    }

    if (step.kind === 'multi') {
      handleMultiNext()
    }
  }

  const handleWhatsAppAction = async () => {
    if (step.terminal && isDiagnosticOutcome(step.id)) {
      await submitDiagnostic(step.id)
    }

    window.open(buildWhatsAppUrl(), '_blank', 'noopener')
  }

  const handleLinkAction = async (href: string) => {
    if (step.terminal && isDiagnosticOutcome(step.id)) {
      await submitDiagnostic(step.id)
    }

    window.location.assign(href)
  }

  const buildWhatsAppUrl = (): string => {
    const d = formDataRef.current
    const canais = Array.isArray(d.canais) ? (d.canais as string[]).join(', ') : (d.canais || '—')
    const msg = `Olá, sou ${d.nome || '—'}, da ${d.empresa || '—'}.

Acabei de preencher o Diagnóstico Privado da MANN.

Segmento: ${d.segmento || '—'}
Cidade: ${d.cidade || '—'}
Serviço prioritário: ${d.servico || '—'}
Principal gargalo: ${d.gargalo || '—'}
Clientes chegam hoje por: ${canais}
Frente de interesse: ${d.frente || '—'}
Faixa de investimento: ${d.investimento || '—'}
Prazo para iniciar: ${d.timing || '—'}

Gostaria de entender se existe encaixe para trabalharmos juntos.`
    return `https://wa.me/5511990128590?text=${encodeURIComponent(msg)}`
  }

  // Progress
  const progress = (() => {
    if (step.kind === 'cover') return { pct: 0, label: 'Diagnóstico Privado', count: `0 / ${totalVisible}` }
    if (step.hideFromProgress) {
      if (step.kind === 'outcome' && step.terminal) {
        return {
          pct: 100,
          label: step.label ?? 'Diagnóstico Privado',
          count: `${totalVisible} / ${totalVisible}`,
        }
      }

      const lastVisiblePos = [...history]
        .reverse()
        .map((idx) => visibleSteps.findIndex((x) => x.id === STEPS[idx]?.id) + 1)
        .find((pos) => pos > 0) ?? 0

      return {
        pct: (lastVisiblePos / totalVisible) * 100,
        label: step.label ?? 'Diagnóstico Privado',
        count: `${lastVisiblePos} / ${totalVisible}`,
      }
    }
    const pos = visibleSteps.findIndex((x) => x.id === step.id) + 1
    return { pct: (pos / totalVisible) * 100, label: 'Diagnóstico Privado', count: `${pos} / ${totalVisible}` }
  })()

  // ── Render helpers ──────────────────────────────────────────────────────

  const renderTitle = (title: string, cls: string) => (
    <h2
      className={cls}
      dangerouslySetInnerHTML={{ __html: title }}
    />
  )

  const renderActionBtn = (action: Action) => {
    if (action.kind === 'continue') {
      return (
        <button key="continue" type="button" className="step-next" onClick={() => goNext()}>
          {action.label} <span>→</span>
        </button>
      )
    }
    if (action.kind === 'link') {
      return (
        <button
          key="link"
          type="button"
          className="step-next"
          style={{ textDecoration: 'none' }}
          onClick={() => handleLinkAction(action.href || '/')}
        >
          {action.label}
        </button>
      )
    }
    if (action.kind === 'wa') {
      return (
        <button
          key="wa"
          type="button"
          className={action.ghost ? 'step-back' : 'wa-btn'}
          onClick={handleWhatsAppAction}
        >
          {!action.ghost && (
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}>
              <path d="M20.52 3.48A11.86 11.86 0 0 0 12.07 0C5.5 0 .15 5.34.15 11.91c0 2.1.55 4.14 1.6 5.94L0 24l6.32-1.66a11.92 11.92 0 0 0 5.75 1.47c6.57 0 11.92-5.34 11.92-11.91 0-3.18-1.24-6.17-3.48-8.42zM17.51 14.39c-.3-.15-1.76-.87-2.03-.97s-.47-.15-.67.15-.77.97-.94 1.16-.35.22-.65.07-1.26-.46-2.4-1.48a9.07 9.07 0 0 1-1.66-2.06c-.17-.3-.02-.46.13-.61.13-.14.3-.35.45-.52s.2-.3.3-.5.05-.37-.02-.52-.67-1.62-.92-2.22c-.24-.58-.49-.5-.67-.51l-.57-.01a1.1 1.1 0 0 0-.8.37c-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.1 3.2 5.08 4.49 1.78.77 2.48.83 3.37.7.54-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" />
            </svg>
          )}
          {action.label}
        </button>
      )
    }
  }

  const renderStepContent = () => {
    switch (step.kind) {
      case 'cover':
        return (
          <>
            <div className="step-num">Aplicação · MANN Company</div>
            <h1
              className="cover-title"
              dangerouslySetInnerHTML={{ __html: step.title }}
            />
            <p className="cover-text">{step.text}</p>
            <div className="cover-meta">
              {step.meta?.map((m) => (
                <div key={m.k}>
                  <span>{m.k}</span>
                  <strong>{m.v}</strong>
                </div>
              ))}
            </div>
            <div className="step-foot">
              <span />
              <button type="button" className="step-next" onClick={() => goNext()}>
                {step.cta} <span aria-hidden="true">→</span>
              </button>
            </div>
          </>
        )

      case 'input': {
        const isValid = validateInput()
        return (
          <>
            <div className="step-num">{step.label}</div>
            {renderTitle(step.title, 'step-title')}
            {step.help && <p className="step-help">{step.help}</p>}
            <div className="step-body">
              <input
                ref={inputRef as RefObject<HTMLInputElement>}
                className={`step-input${inputInvalid ? ' invalid' : ''}`}
                type={step.inputType || 'text'}
                placeholder={step.placeholder || ''}
                inputMode={step.inputType === 'tel' ? 'tel' : undefined}
                autoComplete="off"
                value={inputVal}
                onChange={(e) => handleInputChange(e.target.value)}
                onBlur={() => {
                  if (step.required && !inputVal.trim()) setInputInvalid(true)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); handleInputNext() }
                }}
              />
              <div className="field-error">{inputError}</div>
            </div>
            <div className="step-foot">
              {step.id !== 'nome' && (
                <button type="button" className="step-back" onClick={goBack}>Voltar</button>
              )}
              <button type="submit" className="step-next" disabled={!isValid}>
                Continuar <span aria-hidden="true">→</span>
              </button>
            </div>
          </>
        )
      }

      case 'textarea': {
        const isValid = validateInput()
        return (
          <>
            <div className="step-num">{step.label}</div>
            {renderTitle(step.title, 'step-title')}
            {step.help && <p className="step-help">{step.help}</p>}
            <div className="step-body">
              <textarea
                ref={inputRef as RefObject<HTMLTextAreaElement>}
                className={`step-input${inputInvalid ? ' invalid' : ''}`}
                placeholder={step.placeholder || ''}
                rows={4}
                value={inputVal}
                onChange={(e) => handleInputChange(e.target.value)}
                onBlur={() => {
                  if (step.required && !inputVal.trim()) setInputInvalid(true)
                }}
              />
              <div className="field-error">{inputError}</div>
            </div>
            <div className="step-foot">
              <button type="button" className="step-back" onClick={goBack}>Voltar</button>
              <button type="submit" className="step-next" disabled={!isValid}>
                Continuar <span aria-hidden="true">→</span>
              </button>
            </div>
          </>
        )
      }

      case 'single':
        return (
          <>
            <div className="step-num">{step.label}</div>
            {renderTitle(step.title, 'step-title')}
            {step.help && <p className="step-help">{step.help}</p>}
            <div className="step-body">
              <div className="step-options">
                {step.options?.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`opt${selectedOpts[0] === opt ? ' selected' : ''}`}
                    onClick={() => {
                      setSelectedOpts([opt])
                      if (step.field) saveField(step.field, opt)
                      const branch = step.nextOf ? step.nextOf(opt) : null
                      setTimeout(() => goNext(branch ?? undefined), 280)
                    }}
                  >
                    <span className="opt-mark" />
                    <span className="opt-label">{opt}</span>
                  </button>
                ))}
              </div>
              <div className="nudge">Toque na opção que mais se aproxima</div>
            </div>
            <div className="step-foot">
              <button type="button" className="step-back" onClick={goBack}>Voltar</button>
              <span />
            </div>
          </>
        )

      case 'multi': {
        const hasSelection = selectedOpts.length > 0
        return (
          <>
            <div className="step-num">{step.label}</div>
            {renderTitle(step.title, 'step-title')}
            {step.help && <p className="step-help">{step.help}</p>}
            <div className="step-body">
              <div className="step-options">
                {step.options?.map((opt) => {
                  const checked = selectedOpts.includes(opt)
                  return (
                    <button
                      key={opt}
                      type="button"
                      className={`opt${checked ? ' selected' : ''}`}
                      onClick={() => {
                        const next = checked
                          ? selectedOpts.filter((o) => o !== opt)
                          : [...selectedOpts, opt]
                        setSelectedOpts(next)
                        if (step.field) saveField(step.field, next)
                      }}
                    >
                      <span className="opt-mark square" />
                      <span className="opt-label">{opt}</span>
                    </button>
                  )
                })}
              </div>
              <div className="field-error">{inputError}</div>
            </div>
            <div className="step-foot">
              <button type="button" className="step-back" onClick={goBack}>Voltar</button>
              <button type="submit" className="step-next" disabled={!hasSelection}>
                Continuar <span aria-hidden="true">→</span>
              </button>
            </div>
          </>
        )
      }

      case 'outcome': {
        const backLabel = step.terminal ? 'Home' : 'Voltar'
        const handleBack = step.terminal ? () => window.location.assign('/') : goBack

        return (
          <>
            <div className="step-num">{step.label || ''}</div>
            <h2
              className="outcome-title"
              dangerouslySetInnerHTML={{ __html: step.title }}
            />
            <p
              className="step-help"
              style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.65, maxWidth: '60ch' }}
            >
              {step.text}
            </p>
            {step.terminal && submission.status === 'submitting' && (
              <div className="submit-status">Salvando diagnóstico...</div>
            )}
            {step.terminal && submission.status === 'error' && (
              <div className="submit-status error">{submission.message}</div>
            )}
            <div className="step-foot" style={{ gap: 12, flexWrap: 'wrap' }}>
              <button
                type="button"
                className="step-back"
                onClick={handleBack}
              >
                {backLabel}
              </button>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {step.actions?.map(renderActionBtn)}
              </div>
            </div>
          </>
        )
      }
    }
  }

  // ── Layout ──────────────────────────────────────────────────────────────

  return (
    <div className="funnel-shell">
      <div className="funnel-bg" />

      <header className="funnel-top">
        <Link href="/" className="funnel-brand">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <defs>
                <linearGradient id="funnelBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#f4f4f4" />
                  <stop offset="0.5" stopColor="#bdbdbd" />
                  <stop offset="1" stopColor="#5a5a5a" />
                </linearGradient>
              </defs>
              <rect x="6" y="11" width="5" height="14" rx="1" fill="url(#funnelBarGrad)" />
              <rect x="13.5" y="8" width="5" height="17" rx="1" fill="url(#funnelBarGrad)" />
              <rect x="21" y="5" width="5" height="20" rx="1" fill="url(#funnelBarGrad)" />
            </svg>
          </span>
          <span className="brand-name">MANN</span>
        </Link>

        <div className="funnel-progress-wrap">
          <div className="funnel-progress">
            <div
              className="funnel-progress-bar"
              style={{ width: `${progress?.pct ?? 0}%` }}
            />
          </div>
          <div className="funnel-progress-meta">
            <span>{progress?.label ?? step.label ?? 'Análise'}</span>
            <span>{progress?.count ?? `0 / ${totalVisible}`}</span>
          </div>
        </div>

        <Link href="/" className="funnel-exit">Sair</Link>
      </header>

      <main className="funnel-main">
        <form className="funnel-stage" onSubmit={handleFormSubmit} noValidate>
          {STEPS.map((s, i) => (
            <section
              key={s.id}
              className={`funnel-step step ${s.kind}${i === currentIdx ? ' active' : ''}`}
            >
              {i === currentIdx && renderStepContent()}
            </section>
          ))}
        </form>
      </main>
    </div>
  )
}
