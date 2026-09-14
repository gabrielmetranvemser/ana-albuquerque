'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useConteudo } from '@/lib/conteudo/contexto'
import { evento } from '@/lib/eventos'
import { LogoCor, LogoHorizontal } from '@/components/ui/Marca'

/**
 * O MENU DA ANA.
 *
 * ⚠️ ESTE É O TERCEIRO DESENHO, E OS DOIS ANTERIORES ENSINARAM ALGO.
 *
 *    1. O do modelo era uma cápsula de vidro fosco sobre o hero — o
 *       cabeçalho de qualquer site, e com um símbolo desenhado em código
 *       que a campanha não reconheceu como a marca dela.
 *
 *    2. O segundo era um adesivo de papel com contorno e sombra dura,
 *       links em caixa alta condensada e um "7766" laranja torto. A
 *       campanha: "muito feio, parecendo cartoon — gostamos de
 *       modernidade, mas com humanidade".
 *
 *    O que ficou: barra branca de ponta a ponta, logotipo oficial, links
 *    na letra do corpo em caixa normal, e um único botão cheio — o do
 *    grupo, que é a ação da página. A "humanidade" vem do detalhe e não
 *    do enfeite: o sublinhado laranja que cresce no passar do mouse, a
 *    sombra macia que só aparece ao rolar, o painel que desliza.
 *
 *    Os nove itens da sugestão de menu do documento continuam todos: a
 *    barra mostra os marcados `noTopo`, e o painel lateral mostra todos.
 *
 * `simbolo` continua aceito porque as outras páginas ainda o passam.
 */
export function Header({
  silencio = false,
  ocultas = [],
}: {
  silencio?: boolean
  simbolo?: string | null
  /** Ids de seção desligadas no painel. Somem do menu. */
  ocultas?: string[]
}) {
  const { candidato, ctas, navegacao } = useConteudo()
  // Com a seção de grupos desligada, a âncora não existe e o botão
  // viraria clique morto — que não dá erro nenhum, só não funciona.
  const paraOsGrupos = ocultas.includes('grupos') ? '/grupos' : '/#grupos'

  const itens = navegacao.itens.filter((item) => {
    const ancora = item.href.match(/#([\w-]+)/)
    return !ancora || !ocultas.includes(ancora[1])
  })
  const naBarra = itens.filter((item) => item.noTopo)

  const [rolou, setRolou] = useState(false)
  const [aberto, setAberto] = useState(false)
  const botaoFechar = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 12)
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  useEffect(() => {
    if (!aberto) return
    document.body.style.overflow = 'hidden'
    // O foco vai para o "fechar": quem navega por teclado precisa cair
    // dentro do painel, e não continuar tabulando a página atrás dele.
    botaoFechar.current?.focus()
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAberto(false)
    }
    window.addEventListener('keydown', aoTeclar)
    return () => {
      window.removeEventListener('keydown', aoTeclar)
      document.body.style.overflow = ''
    }
  }, [aberto])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-white transition-shadow duration-300 ${
        rolou ? 'shadow-[0_10px_30px_-20px_rgba(10,20,82,0.45)]' : ''
      }`}
    >
      <div className="container-lp flex h-[4.5rem] items-center justify-between gap-6 md:h-20">
        <Link href="/#inicio" className="shrink-0" aria-label={`${candidato.nome} — início`}>
          <LogoCor prioridade className="h-10 w-auto md:h-12" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          {naBarra.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group relative px-3.5 py-2 text-[0.96875rem] font-semibold text-tinta/80 transition-colors hover:text-azul-escuro"
            >
              {item.rotulo}
              <span
                aria-hidden
                className="absolute inset-x-3.5 bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-laranja transition-transform duration-300 ease-(--ease-suave) group-hover:scale-x-100"
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {!silencio ? (
            <Link
              href={paraOsGrupos}
              onClick={() => evento('clicou_cta', { origem: 'topo' })}
              className="toque hidden min-h-11 items-center rounded-full bg-laranja px-5 text-[0.9375rem] font-semibold text-azul-escuro transition-[filter] hover:brightness-105 sm:inline-flex"
            >
              {ctas.grupoCurto}
            </Link>
          ) : null}

          <button
            type="button"
            onClick={() => setAberto(true)}
            aria-expanded={aberto}
            aria-controls="menu-completo"
            className="toque inline-flex min-h-11 items-center gap-2.5 rounded-full px-3.5 text-[0.9375rem] font-semibold text-azul-escuro transition-colors hover:bg-azul-escuro/6"
          >
            <span>Menu</span>
            <span aria-hidden className="flex w-5 flex-col items-end gap-[5px]">
              <span className="block h-0.5 w-full rounded-full bg-current" />
              <span className="block h-0.5 w-3/4 rounded-full bg-laranja" />
            </span>
          </button>
        </div>
      </div>

      {/* Progresso de leitura: ligado à rolagem por animation-timeline,
          sem JavaScript. Onde não há suporte, fica invisível. */}
      <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 overflow-hidden">
        <span className="barra-progresso block h-full bg-laranja" />
      </span>

      {aberto ? (
        <div id="menu-completo" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[60]">
          {/* O véu fecha ao tocar: é o gesto que todo celular ensinou. */}
          <button
            type="button"
            tabIndex={-1}
            aria-hidden
            onClick={() => setAberto(false)}
            className="anima-surge absolute inset-0 bg-azul-noite/55 backdrop-blur-[2px]"
          />

          <div className="anima-etapa absolute inset-y-0 right-0 flex w-full max-w-md flex-col overflow-y-auto bg-azul-escuro text-white shadow-[-30px_0_60px_-30px_rgba(0,0,0,0.5)]">
            <div className="flex h-[4.5rem] shrink-0 items-center justify-between px-6 md:h-20 md:px-8">
              <LogoHorizontal className="h-9 w-auto md:h-10" />
              <button
                ref={botaoFechar}
                type="button"
                onClick={() => setAberto(false)}
                aria-label="Fechar menu"
                className="toque inline-flex size-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 px-6 pt-2 pb-6 md:px-8" aria-label="Menu completo">
              <ol className="divide-y divide-white/10 border-y border-white/10">
                {itens.map((item, i) => {
                  const ehNumero = item.rotulo.trim() === candidato.numero
                  return (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        onClick={() => setAberto(false)}
                        className="group flex min-h-14 items-center gap-4 py-3.5"
                      >
                        <span className="w-6 text-sm font-semibold text-white/40 tabular-nums">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="flex-1 font-[family-name:var(--font-titulo)] text-[1.35rem] leading-tight font-semibold transition-colors group-hover:text-laranja">
                          {ehNumero ? (
                            <span className="inline-flex items-center rounded-full bg-laranja px-3 py-0.5 text-azul-escuro">
                              {item.rotulo}
                            </span>
                          ) : (
                            item.rotulo
                          )}
                        </span>
                        <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-white/35 transition-all group-hover:translate-x-1 group-hover:text-laranja" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </Link>
                    </li>
                  )
                })}
              </ol>
            </nav>

            <div className="shrink-0 space-y-4 px-6 pb-8 md:px-8">
              {!silencio ? (
                <Link
                  href={paraOsGrupos}
                  onClick={() => {
                    setAberto(false)
                    evento('clicou_cta', { origem: 'topo' })
                  }}
                  className="toque flex min-h-14 w-full items-center justify-center rounded-full bg-laranja px-6 text-lg font-semibold text-azul-escuro transition-[filter] hover:brightness-105"
                >
                  {ctas.grupo}
                </Link>
              ) : (
                <p className="text-white/80">{ctas.silencio}</p>
              )}
              <div className="flex items-center justify-between gap-4 text-sm text-white/65">
                <span>
                  {candidato.cargo} · {candidato.numero}
                </span>
                {candidato.instagram ? (
                  <a
                    href={candidato.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center font-semibold text-white transition-colors hover:text-laranja"
                  >
                    {candidato.instagramHandle}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
