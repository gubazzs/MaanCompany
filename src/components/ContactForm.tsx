'use client'

import { type FormEvent } from 'react'

export default function ContactForm() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    alert('Obrigado! Entraremos em contato em breve.')
  }

  return (
    <form
      className="form"
      data-reveal
      data-reveal-delay="2"
      onSubmit={handleSubmit}
    >
      <div className="form-title">Solicitar diagnóstico</div>
      <div className="form-row">
        <div className="field">
          <label htmlFor="nome">Nome</label>
          <input id="nome" type="text" required placeholder="Seu nome" />
        </div>
        <div className="field">
          <label htmlFor="empresa">Empresa</label>
          <input id="empresa" type="text" required placeholder="Nome da empresa" />
        </div>
      </div>
      <div className="form-row">
        <div className="field">
          <label htmlFor="cidade">Cidade</label>
          <input id="cidade" type="text" placeholder="Cidade / UF" />
        </div>
        <div className="field">
          <label htmlFor="whats">WhatsApp</label>
          <input id="whats" type="tel" required placeholder="(00) 00000-0000" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="nicho">Nicho automotivo</label>
        <select id="nicho">
          <option>Estética automotiva &amp; Detailing</option>
          <option>Vitrificação / PPF / Envelopamento</option>
          <option>Oficina especializada</option>
          <option>Loja de veículos / Revenda</option>
          <option>Acessórios / Rodas / Pneus</option>
          <option>Outro segmento automotivo</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="desafio">Principal desafio</label>
        <textarea
          id="desafio"
          placeholder="O que mais te incomoda hoje na captação ou no atendimento?"
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Enviar diagnóstico <span aria-hidden="true">→</span>
      </button>
      <div className="form-foot">Vamos entender se faz sentido para o seu momento.</div>
    </form>
  )
}
