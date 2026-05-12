import Link from 'next/link'
import Nav from '@/components/Nav'
import CursorGlow from '@/components/CursorGlow'
import RevealObserver from '@/components/RevealObserver'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import ContactForm from '@/components/ContactForm'
import Tweaks from '@/components/Tweaks'
import { Metadata } from 'next'

// Defina a base URL aqui para facilitar a troca em produção
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'MANN Company — Marketing e Tecnologia Automotiva',
    template: '%s | MANN Company'
  },
  description: 'Especialistas em estratégias digitais, funis comerciais e soluções tecnológicas para o setor automotivo, estética e oficinas.',
  keywords: [
    'marketing automotivo', 
    'tecnologia para oficinas', 
    'estratégia digital automotiva', 
    'funil de vendas automotivo',
    'estética automotiva',
    'agência de tráfego pago'
  ],
  authors: [{ name: 'MANN Company' }],
  creator: 'MANN Company',
  
  openGraph: {
    title: 'MANN Company — Marketing e Tecnologia Automotiva',
    description: 'Transformamos a presença digital de empresas do setor automotivo com tecnologia e estratégia.',
    type: 'website',
    url: BASE_URL,
    siteName: 'MANN Company',
    locale: 'pt_BR',
    images: [
      {
        url: '/logowithback.jpg',
        width: 1200,
        height: 630,
        alt: 'Logo MANN Company — Especialistas em Setor Automotivo',
      }
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'MANN Company — Marketing e Tecnologia Automotiva',
    description: 'Estratégias digitais e tecnologia para o setor automotivo.',
    images: ['/logowithback.jpg'],
  },

  alternates: {
    canonical: BASE_URL,
  },

  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function HomePage() {
  return (
    <>
      <CursorGlow />
      <Nav />

      {/* ── HERO ── */}
      <section className="hero hero-centered" id="top">
        <div className="hero-bg" />
        <div className="wrap">
          <div className="hero-center">
            <div data-reveal className="eyebrow">Marketing · Aquisição · Tecnologia</div>
            <h1 data-reveal data-reveal-delay="1" className="hero-title">
              Marketing e tecnologia para empresas automotivas que{' '}
              <span className="sub-word">vendem com previsibilidade</span>.
            </h1>
            <div data-reveal data-reveal-delay="3" className="hero-ctas hero-ctas-center">
              <Link href="/diagnostico?from=home" className="btn btn-primary">
                Solicitar diagnóstico automotivo
                <span aria-hidden="true">→</span>
              </Link>
              <a href="#metodo" className="btn btn-ghost">Conhecer o Método MANN</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEMA ── */}
      <section id="problema">
        <div className="wrap">
          <div className="section-head">
            <div className="left">
              <div className="num" data-reveal>01 — Diagnóstico</div>
              <div className="eyebrow" data-reveal data-reveal-delay="1">O cenário atual</div>
            </div>
            <h2 data-reveal data-reveal-delay="2">
              O problema não é falta de post.<br />
              É falta de{' '}
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--silver)' }}>
                estrutura comercial digital
              </em>.
            </h2>
          </div>

          <p
            data-reveal
            style={{ fontSize: 17, color: 'var(--text)', maxWidth: '72ch', marginBottom: 64, lineHeight: 1.6 }}
          >
            A maioria das empresas automotivas ainda depende de indicação, movimento local, Instagram
            desorganizado e atendimento manual. O resultado é simples: leads chegam sem qualificação,
            oportunidades se perdem no WhatsApp e o gestor não sabe quais campanhas, canais ou ofertas
            estão funcionando.
          </p>

          <div className="problem-grid">
            <div className="problem-card" data-reveal>
              <span className="idx">/01</span>
              <span className="label">Campanhas sem funil geram curiosos, não oportunidades.</span>
            </div>
            <div className="problem-card" data-reveal data-reveal-delay="1">
              <span className="idx">/02</span>
              <span className="label">Conteúdo sem estratégia não aumenta percepção de valor.</span>
            </div>
            <div className="problem-card" data-reveal data-reveal-delay="2">
              <span className="idx">/03</span>
              <span className="label">WhatsApp sem processo faz o lead esfriar.</span>
            </div>
            <div className="problem-card" data-reveal data-reveal-delay="3">
              <span className="idx">/04</span>
              <span className="label">Sem dados, marketing vira achismo.</span>
            </div>
            <div className="problem-card" data-reveal data-reveal-delay="4">
              <span className="idx">/05</span>
              <span className="label">Sem pós-venda, a empresa compra clientes de novo todo mês.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUEM É MANN ── */}
      <section id="quem">
        <div className="wrap">
          <div className="about">
            <div className="about-image" data-reveal>
              <img
                src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1400&q=80&auto=format&fit=crop"
                alt="Operação automotiva premium"
              />
              <div className="caption">
                <span>MANN / 02</span>
                <span>QUEM SOMOS</span>
              </div>
            </div>
            <div className="about-copy">
              <div
                className="num"
                data-reveal
                style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--silver-lo)', letterSpacing: '.1em' }}
              >
                02 — A MANN
              </div>
              <h2 data-reveal data-reveal-delay="1">
                Agência de marketing e tecnologia especializada no{' '}
                <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--silver)' }}>
                  setor automotivo
                </em>.
              </h2>
              <p data-reveal data-reveal-delay="2">
                Construímos estratégias digitais, funis comerciais, campanhas de aquisição, conteúdo e
                soluções tecnológicas para empresas automotivas que querem atrair clientes qualificados,
                organizar o atendimento e crescer com mais controle.
              </p>
              <p data-reveal data-reveal-delay="3">
                Nossa atuação combina performance, posicionamento, automação, dados e produção de ativos
                comerciais. Não vendemos apenas anúncios ou postagens — estruturamos uma operação para
                captar, qualificar, acompanhar e converter oportunidades comerciais.
              </p>
              <div className="pull" data-reveal data-reveal-delay="4">
                Mais do que <em>aparecer</em>, sua empresa precisa ser <em>escolhida</em>.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MÉTODO MANN ── */}
      <section id="metodo">
        <div className="wrap">
          <div className="section-head">
            <div className="left">
              <div className="num" data-reveal>03 — Metodologia</div>
              <div className="eyebrow" data-reveal data-reveal-delay="1">Método MANN</div>
            </div>
            <div>
              <h2 data-reveal data-reveal-delay="2">
                Da presença digital à{' '}
                <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--silver)' }}>
                  oportunidade comercial
                </em>.
              </h2>
              <p
                data-reveal
                data-reveal-delay="3"
                style={{ marginTop: 20, fontSize: 16, lineHeight: 1.6, color: 'var(--text)', maxWidth: '60ch' }}
              >
                Nossa metodologia para transformar marketing automotivo em aquisição, relacionamento e
                números claros. Quatro etapas que dão estrutura à operação comercial.
              </p>
            </div>
          </div>

          <div className="method-grid">
            {[
              { stage: 'Etapa 01', letter: 'M', word: 'Mapeamento', desc: 'Entender mercado, público, oferta, margem, concorrência e gargalos comerciais.' },
              { stage: 'Etapa 02', letter: 'A', word: 'Aquisição',  desc: 'Canais de entrada com tráfego, conteúdo, presença local, WhatsApp e páginas simples.' },
              { stage: 'Etapa 03', letter: 'N', word: 'Nutrição',   desc: 'Atendimento, qualificação, follow-up, recuperação de leads e pós-venda.' },
              { stage: 'Etapa 04', letter: 'N', word: 'Números',    desc: 'Origem, custo, qualidade, status dos leads, conversões e pontos de melhoria.' },
            ].map((item, i) => (
              <article key={item.word} className="method-card" data-reveal data-reveal-delay={String(i)}>
                <span className="stage">{item.stage}</span>
                <div>
                  <div className="letter">{item.letter}</div>
                  <div className="word">{item.word}</div>
                  <div className="desc">{item.desc}</div>
                </div>
                <div />
              </article>
            ))}
          </div>

          <p
            data-reveal
            style={{ marginTop: 48, fontSize: 16, lineHeight: 1.6, color: 'var(--text-dim)', maxWidth: '72ch' }}
          >
            A metodologia permite que sua empresa pare de depender de indicação, postagens soltas e
            campanhas sem controle, criando uma estrutura clara, mensurável e orientada à venda.
          </p>
        </div>
      </section>

      {/* ── SOLUÇÕES ── */}
      <section id="solucoes">
        <div className="wrap">
          <div className="section-head">
            <div className="left">
              <div className="num" data-reveal>04 — Soluções</div>
              <div className="eyebrow" data-reveal data-reveal-delay="1">Operação modular</div>
            </div>
            <h2 data-reveal data-reveal-delay="2">
              Uma solução principal e dois módulos que{' '}
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--silver)' }}>
                ampliam a performance
              </em>.
            </h2>
          </div>

          <div className="solutions-grid">
            <article className="sol-card primary" data-reveal>
              <span className="badge">Solução principal</span>
              <span className="kicker">Projeto estratégico personalizado</span>
              <h3>MANN Auto Growth</h3>
              <p className="lead">
                Um projeto estratégico de aquisição e performance, desenhado sob medida para o
                cenário, a oferta e o momento da sua empresa automotiva.
              </p>
              <span className="more">Saber mais</span>
            </article>

            <article className="sol-card" data-reveal data-reveal-delay="1">
              <span className="kicker">Módulo complementar</span>
              <h3>MANN Softwares</h3>
              <p className="lead">
                Camada de tecnologia comercial para controlar leads, atendimento, oportunidades e indicadores.
              </p>
              <ul>
                <li>Agentes inteligentes de qualificação</li>
                <li>CRM comercial e pipeline</li>
                <li>Dashboards apresentáveis</li>
                <li>Automação de follow-up e pós-venda</li>
                <li>Relatórios para tomada de decisão</li>
              </ul>
              <span className="more">Saber mais</span>
            </article>

            <article className="sol-card" data-reveal data-reveal-delay="2">
              <span className="kicker">Módulo complementar</span>
              <h3>MANN Visual Assets</h3>
              <p className="lead">
                Produção audiovisual comercial para aumentar percepção de valor e performance dos anúncios.
              </p>
              <ul>
                <li>Captação presencial &amp; fotografia profissional</li>
                <li>Vídeos curtos para anúncios e redes</li>
                <li>Antes e depois, depoimentos, bastidores</li>
                <li>Banco de criativos para campanhas</li>
              </ul>
              <span className="more">Saber mais</span>
            </article>
          </div>

          <p
            data-reveal
            style={{ marginTop: 48, fontSize: 15, color: 'var(--text-dim)', maxWidth: '72ch', lineHeight: 1.6 }}
          >
            <span style={{ color: 'var(--silver)' }}>Auto Growth</span> gera demanda.{' '}
            <span style={{ color: 'var(--silver)' }}>Softwares</span> organizam a conversão.{' '}
            <span style={{ color: 'var(--silver)' }}>Visual Assets</span> aumentam percepção de valor e
            performance criativa.
          </p>
        </div>
      </section>

      {/* ── PARA QUEM ── */}
      <section id="para-quem">
        <div className="wrap">
          <div className="section-head">
            <div className="left">
              <div className="num" data-reveal>05 — Público</div>
              <div className="eyebrow" data-reveal data-reveal-delay="1">Para quem é</div>
            </div>
            <h2 data-reveal data-reveal-delay="2">
              Para negócios automotivos que querem deixar de depender do{' '}
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--silver)' }}>improviso</em>.
            </h2>
          </div>

          <div className="target-grid">
            {[
              { n: '/01', name: 'Estética automotiva & Detailing',          desc: 'Lavagem técnica, higienização, polimento e cristalização.' },
              { n: '/02', name: 'Vitrificação, PPF & Envelopamento',         desc: 'Proteção de pintura, películas e personalização de veículos.' },
              { n: '/03', name: 'Oficinas especializadas',                   desc: 'Performance, mecânica especializada e centros automotivos premium.' },
              { n: '/04', name: 'Lojas, seminovos & revendas premium',       desc: 'Concessionárias independentes e revendas de veículos selecionados.' },
              { n: '/05', name: 'Acessórios, rodas, pneus & som',            desc: 'Peças, serviços e produtos automotivos especializados.' },
              { n: '/06', name: 'Negócios automotivos locais',               desc: 'Empresas regionais que querem melhorar captação, atendimento e conversão.' },
            ].map((item, i) => (
              <div key={item.n} className="target-tile" data-reveal data-reveal-delay={String(i)}>
                <span className="num">{item.n}</span>
                <div>
                  <div className="name">{item.name}</div>
                  <div className="desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <p
            data-reveal
            style={{
              marginTop: 48, fontSize: 16, color: 'var(--text)', maxWidth: '64ch', lineHeight: 1.6,
              borderTop: '1px solid var(--border)', paddingTop: 32,
            }}
          >
            A MANN é para empresas que{' '}
            <span style={{ color: 'var(--silver)' }}>já têm serviço, operação ou potencial de mercado</span>,
            mas precisam transformar isso em aquisição previsível e posicionamento profissional.
          </p>
        </div>
      </section>

      {/* ── PROCESSO ── */}
      <section id="processo">
        <div className="wrap">
          <div className="section-head">
            <div className="left">
              <div className="num" data-reveal>06 — Processo</div>
              <div className="eyebrow" data-reveal data-reveal-delay="1">Como funciona</div>
            </div>
            <h2 data-reveal data-reveal-delay="2">
              Um processo claro,<br />
              sem{' '}
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--silver)' }}>achismo</em>.
            </h2>
          </div>

          <div className="process">
            {[
              { fase: 'Fase 01', name: 'Diagnóstico', desc: 'Entender cenário, oferta, canais, público, gargalos e oportunidades.' },
              { fase: 'Fase 02', name: 'Estratégia',  desc: 'Definir funil, campanha, conteúdo, captação e métricas principais.' },
              { fase: 'Fase 03', name: 'Execução',    desc: 'Ativar campanhas, conteúdos, fluxos e canais de aquisição.' },
              { fase: 'Fase 04', name: 'Otimização',  desc: 'Analisar dados, ajustar criativos, refinar ofertas e melhorar conversão.' },
              { fase: 'Fase 05', name: 'Expansão',    desc: 'Avaliar módulos Softwares, Visual Assets, CRM, dashboards e novas campanhas.' },
            ].map((item, i) => (
              <div key={item.name} className="process-step" data-reveal data-reveal-delay={String(i)}>
                <span className="dot" />
                <span className="stage">{item.fase}</span>
                <div className="name">{item.name}</div>
                <p className="desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIFERENCIAIS ── */}
      <section id="diferenciais">
        <div className="wrap">
          <div className="section-head">
            <div className="left">
              <div className="num" data-reveal>07 — Diferenciais</div>
              <div className="eyebrow" data-reveal data-reveal-delay="1">O que nos torna diferentes</div>
            </div>
            <h2 data-reveal data-reveal-delay="2">
              O que torna a MANN diferente de uma{' '}
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--silver)' }}>agência comum</em>.
            </h2>
          </div>

          <div className="diff-grid">
            {[
              'Especialização exclusiva no setor automotivo.',
              'Foco em funil de aquisição, não apenas em posts ou anúncios.',
              'Metodologia própria: Mapeamento, Aquisição, Nutrição e Números.',
              'Uso de dados para tomar decisões comerciais.',
              'Possibilidade de evoluir para agentes, CRM e dashboards personalizados.',
              'Produção audiovisual como ativo comercial, não como filmagem genérica.',
              'Visão integrada: aquisição, atendimento, conversão e pós-venda.',
              'Estética e linguagem alinhadas ao universo premium automotivo.',
            ].map((text, i) => (
              <div key={i} className="diff-row" data-reveal data-reveal-delay={String(i)}>
                <span className="num">{String(i + 1).padStart(2, '0')}</span>
                <span className="text">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA / FORM ── */}
      <section className="cta" id="contato">
        <div className="cta-bg" />
        <div className="wrap">
          <div className="cta-grid">
            <div className="cta-left">
              <div
                className="num"
                data-reveal
                style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--silver-lo)', letterSpacing: '.1em', marginBottom: 16 }}
              >
                08 — Contato
              </div>
              <h2 data-reveal data-reveal-delay="1">
                Pronto para transformar seu marketing automotivo em uma{' '}
                <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--silver)' }}>
                  operação comercial
                </em>?
              </h2>
              <p data-reveal data-reveal-delay="2">
                A MANN pode mapear o cenário atual da sua empresa, identificar oportunidades de captação
                e construir um plano para transformar presença digital em oportunidades reais de venda.
              </p>
              <p data-reveal data-reveal-delay="3" style={{ fontSize: 13, color: 'var(--silver-lo)' }}>
                Atendimento para empresas automotivas com operação ativa e intenção real de crescimento.
              </p>

              <div className="cta-info">
                <div className="cta-info-row">
                  <span>WhatsApp</span>
                  <strong>
                    <a href="https://wa.me/5511990128590" target="_blank" rel="noopener" style={{ color: 'var(--white)' }}>
                      +55 11 99012-8590
                    </a>
                  </strong>
                </div>
                <div className="cta-info-row">
                  <span>Email</span>
                  <strong>contato@manncompany.com.br</strong>
                </div>
                <div className="cta-info-row">
                  <span>Atendimento</span>
                  <strong>Seg — Sex / 09h — 19h</strong>
                </div>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="wrap">
          <div className="footer-grid">
            <div>
              <a href="#top" className="brand" style={{ marginBottom: 18 }}>
                <span className="brand-mark" aria-hidden="true">
                  <svg viewBox="0 0 32 32" fill="none">
                    <defs>
                      <linearGradient id="footerBarGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#f4f4f4" />
                        <stop offset="0.5" stopColor="#bdbdbd" />
                        <stop offset="1" stopColor="#5a5a5a" />
                      </linearGradient>
                    </defs>
                    <rect x="6" y="11" width="5" height="14" rx="1" fill="url(#footerBarGrad)" />
                    <rect x="13.5" y="8" width="5" height="17" rx="1" fill="url(#footerBarGrad)" />
                    <rect x="21" y="5" width="5" height="20" rx="1" fill="url(#footerBarGrad)" />
                  </svg>
                </span>
                <span className="brand-name">MANN COMPANY</span>
              </a>
              <p style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 16, maxWidth: '36ch' }}>
                Marketing e tecnologia para empresas automotivas que querem vender com mais previsibilidade.
              </p>
            </div>
            <div>
              <h5>Soluções</h5>
              <ul>
                <li><a href="#solucoes">Auto Growth</a></li>
                <li><a href="#solucoes">Softwares</a></li>
                <li><a href="#solucoes">Visual Assets</a></li>
              </ul>
            </div>
            <div>
              <h5>Empresa</h5>
              <ul>
                <li><a href="#quem">Quem somos</a></li>
                <li><a href="#metodo">Método MANN</a></li>
                <li><a href="#diferenciais">Diferenciais</a></li>
              </ul>
            </div>
            <div>
              <h5>Contato</h5>
              <ul>
                <li><a href="#contato">Diagnóstico</a></li>
                <li><a href="https://wa.me/5511990128590" target="_blank" rel="noopener">WhatsApp</a></li>
                <li><a href="#contato">contato@manncompany.com.br</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 MANN Company</span>
            <span>Marketing · Aquisição · Tecnologia</span>
          </div>
        </div>
      </footer>

      <WhatsAppFloat />

      <div id="tweaks-root">
        <Tweaks />
      </div>

      <RevealObserver />
    </>
  )
}
