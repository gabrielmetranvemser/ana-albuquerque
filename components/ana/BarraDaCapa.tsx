'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { CliqueGrupo } from '@/components/site/CliqueGrupo'

/**
 * OS BOTÕES DA CAPA, NO CELULAR, PRESOS NO PÉ DA TELA.
 *
 * ⚠️ NO CELULAR A DOBRA NÃO RESPIRAVA: título de cinco linhas, texto, dois
 *    botões, e só depois a foto — abaixo da dobra. A campanha: "no mobile,
 *    pode subir ela, e deixar os botões fixos na página embaixo; fica
 *    melhor e dá mais respiro pra headline + foto". Os botões saem do meio
 *    da capa e ficam nesta barra enquanto a capa está à vista. No
 *    computador continuam no lugar (Abertura.tsx); a barra é `md:hidden`.
 *
 * ⚠️ É IRMÃ DA <section>, E NÃO FILHA. A capa tem `isolate`: um `fixed` lá
 *    dentro fica preso na pilha dela, e a faixa corrida e os capítulos, que
 *    vêm depois no HTML, passariam por cima da barra.
 *
 * ⚠️ SOME QUANDO A CAPA SAI DA TELA — e é nesse instante que o botão
 *    flutuante do grupo aparece (BotaoFlutuante.tsx olha a mesma capa).
 *    Os dois no pé da tela ao mesmo tempo seriam dois botões de grupo
 *    empilhados. Antes do JavaScript ela já está visível: o estado inicial
 *    é "na capa", que é onde toda visita começa.
 */
export function BarraDaCapa({
  destinoGrupo,
  rotuloGrupo,
  rotuloHistoria,
  hrefHistoria,
}: {
  /** `destinoDoGrupo`. Nulo, fica só o botão da história. */
  destinoGrupo: string | null
  rotuloGrupo: string
  rotuloHistoria: string
  hrefHistoria: string
}) {
  const [naCapa, setNaCapa] = useState(true)

  useEffect(() => {
    const capa = document.getElementById('inicio')
    if (!capa) return
    const observador = new IntersectionObserver(([e]) => setNaCapa(e.isIntersecting))
    observador.observe(capa)
    return () => observador.disconnect()
  }, [])

  return (
    <div
      inert={!naCapa}
      // A área segura do iPhone: sem ela o botão fica debaixo do indicador
      // de home e o toque cai no gesto do sistema.
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      className={`fixed inset-x-0 bottom-0 z-40 bg-white/90 px-4 pt-3 shadow-[0_-12px_30px_-22px_rgba(10,20,82,0.5)] backdrop-blur-md transition-[translate,opacity] duration-500 md:hidden ${
        naCapa ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'
      }`}
    >
      <div className="flex gap-2.5">
        {destinoGrupo ? (
          <CliqueGrupo
            origem="hero"
            href={destinoGrupo}
            className="toque inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-laranja px-4 text-center text-base leading-tight font-semibold text-azul-escuro shadow-[0_12px_24px_-16px_rgba(242,90,18,0.9)]"
          >
            {rotuloGrupo}
          </CliqueGrupo>
        ) : null}
        <Link
          href={hrefHistoria}
          className="toque inline-flex min-h-12 flex-1 items-center justify-center rounded-full border-2 border-azul/70 bg-white px-4 text-center text-base leading-tight font-semibold text-azul"
        >
          {rotuloHistoria}
        </Link>
      </div>
    </div>
  )
}
