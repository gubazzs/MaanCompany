import { z } from 'zod'

const requiredText = (label: string, max = 160, min = 2) =>
  z.string()
    .trim()
    .min(min, `${label} é obrigatório`)
    .max(max, `${label} está muito longo`)

const optionalText = (max = 160) =>
  z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.string().trim().max(max, 'Campo muito longo').optional(),
  )

export const segmentoOptions = [
  'Estética automotiva premium',
  'Detailing / vitrificação / PPF / envelopamento',
  'Oficina especializada',
  'Loja de seminovos / importados',
  'Performance / preparação / remap',
  'Autopeças ou acessórios',
  'Serviço automotivo local',
  'Outro segmento automotivo',
  'Não sou do setor automotivo',
] as const

export const gargaloOptions = [
  'Gerar mais oportunidades qualificadas',
  'Parar de depender tanto de indicação',
  'Melhorar posicionamento e percepção de valor',
  'Organizar atendimento e follow-up',
  'Entender melhor os números comerciais',
  'Produzir criativos, fotos e vídeos melhores',
  'Estruturar uma operação completa de crescimento',
  'Ainda não tenho clareza',
] as const

export const canaisOptions = [
  'Indicação',
  'Instagram',
  'Google',
  'WhatsApp',
  'Tráfego pago',
  'Classificados',
  'Movimento local',
  'Clientes antigos',
  'Não temos clareza',
] as const

export const followOptions = [
  'Sim, temos processo claro',
  'Parcialmente, mas ainda é desorganizado',
  'Não, muitos leads se perdem',
  'Não sabemos medir isso hoje',
] as const

export const investeOptions = [
  'Sim, investimos de forma recorrente',
  'Já investimos, mas sem consistência',
  'Investimos pontualmente',
  'Ainda não investimos de forma estruturada',
] as const

export const frenteOptions = [
  'Aquisição e performance por 90 dias',
  'CRM, agentes, automações e dashboards',
  'Produção audiovisual e criativos comerciais',
  'Primeiro organizar oferta, funil e posicionamento',
  'Quero entender qual caminho faz sentido',
] as const

export const investimentoOptions = [
  'Até R$ 3.000',
  'R$ 3.000 a R$ 6.000',
  'R$ 6.000 a R$ 12.000',
  'R$ 12.000 a R$ 20.000',
  'Acima de R$ 20.000',
  'Prefiro entender antes',
] as const

export const intentOptions = [
  'Já considero investir se fizer sentido',
  'Estou comparando possibilidades',
  'Quero apenas entender valores',
  'Ainda não tenho intenção de contratar',
] as const

export const timingOptions = [
  'O quanto antes',
  'Nos próximos 15 dias',
  'No próximo mês',
  'Em até 3 meses',
  'Ainda estou avaliando',
] as const

export const diagnosticoOutcomeOptions = [
  'out_icp',
  'out_invest_low',
  'out_nutricao',
  'final_qualified',
] as const

const whatsappSchema = z.string()
  .trim()
  .min(1, 'WhatsApp é obrigatório')
  .refine((value) => {
    const digits = value.replace(/\D/g, '')
    return digits.length >= 10 && digits.length <= 13
  }, 'Informe um WhatsApp válido')

const instagramSchema = optionalText(80).refine((value) => {
  if (!value) return true
  return /^@?[\w.]{2,30}$/.test(value)
}, 'Informe um Instagram válido')

export const diagnosticoFieldSchemas = {
  nome: requiredText('Nome', 120),
  empresa: requiredText('Empresa', 160),
  instagram: instagramSchema,
  whatsapp: whatsappSchema,
  cidade: requiredText('Cidade e estado', 120),
  segmento: z.enum(segmentoOptions),
  servico: requiredText('Serviço prioritário', 1000, 5),
  gargalo: z.enum(gargaloOptions),
  canais: z.array(z.enum(canaisOptions)).min(1, 'Selecione pelo menos uma opção'),
  follow: z.enum(followOptions),
  investe: z.enum(investeOptions),
  frente: z.enum(frenteOptions),
  investimento: z.enum(investimentoOptions),
  intent: z.enum(intentOptions),
  timing: z.enum(timingOptions),
} as const

export type DiagnosticoFieldName = keyof typeof diagnosticoFieldSchemas

export const diagnosticoAnswersSchema = z.object({
  nome: diagnosticoFieldSchemas.nome,
  empresa: diagnosticoFieldSchemas.empresa,
  instagram: instagramSchema,
  whatsapp: whatsappSchema,
  cidade: diagnosticoFieldSchemas.cidade,
  segmento: diagnosticoFieldSchemas.segmento,
  servico: optionalText(1000),
  gargalo: z.enum(gargaloOptions).optional(),
  canais: z.array(z.enum(canaisOptions)).min(1).optional(),
  follow: z.enum(followOptions).optional(),
  investe: z.enum(investeOptions).optional(),
  frente: z.enum(frenteOptions).optional(),
  investimento: z.enum(investimentoOptions).optional(),
  intent: z.enum(intentOptions).optional(),
  timing: z.enum(timingOptions).optional(),
}).strict()

export type DiagnosticoAnswers = z.infer<typeof diagnosticoAnswersSchema>
export type DiagnosticoOutcome = typeof diagnosticoOutcomeOptions[number]

const requiredByOutcome: Record<DiagnosticoOutcome, DiagnosticoFieldName[]> = {
  out_icp: ['nome', 'empresa', 'whatsapp', 'cidade', 'segmento'],
  out_invest_low: [
    'nome',
    'empresa',
    'whatsapp',
    'cidade',
    'segmento',
    'servico',
    'gargalo',
    'canais',
    'follow',
    'investe',
    'frente',
    'investimento',
  ],
  out_nutricao: [
    'nome',
    'empresa',
    'whatsapp',
    'cidade',
    'segmento',
    'servico',
    'gargalo',
    'canais',
    'follow',
    'investe',
    'frente',
    'investimento',
    'intent',
  ],
  final_qualified: [
    'nome',
    'empresa',
    'whatsapp',
    'cidade',
    'segmento',
    'servico',
    'gargalo',
    'canais',
    'follow',
    'investe',
    'frente',
    'investimento',
    'timing',
  ],
}

export const diagnosticoSubmissionSchema = z.object({
  outcome: z.enum(diagnosticoOutcomeOptions),
  answers: diagnosticoAnswersSchema,
  metadata: z.object({
    source: z.string().max(80).optional(),
    path: z.string().max(240).optional(),
    startedAt: z.string().datetime().optional(),
    submittedAt: z.string().datetime().optional(),
    userAgent: z.string().max(500).optional(),
  }).optional(),
}).superRefine(({ outcome, answers }, ctx) => {
  for (const field of requiredByOutcome[outcome]) {
    const value = answers[field]
    const isMissing = Array.isArray(value)
      ? value.length === 0
      : value == null || value === ''

    if (isMissing) {
      ctx.addIssue({
        code: 'custom',
        path: ['answers', field],
        message: 'Campo obrigatório para este resultado',
      })
    }
  }

  if (outcome === 'final_qualified' && answers.investimento === 'Prefiro entender antes' && !answers.intent) {
    ctx.addIssue({
      code: 'custom',
      path: ['answers', 'intent'],
      message: 'Campo obrigatório para este resultado',
    })
  }
})

export type DiagnosticoSubmission = z.infer<typeof diagnosticoSubmissionSchema>
