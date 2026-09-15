'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { evento, useSessao } from '@/lib/eventos'
import type { OrigemClique } from '@/lib/tipos'

/**
 * Envelope fino em volta de um CTA que leva à lista de grupos.
 *
 * Grava `clicou_cta`, NÃO `clicou_grupo`: este botão só rola a tela
 * até a lista. Quem grava a entrada de verdade é a rota /g/[slug],
 * quando a pessoa sai para o WhatsApp. Sem essa separação o painel
 * diria que o hero converte quando ele só rolou a página.
 *
 * ⚠️ QUANDO O DESTINO É O REDIRECIONADOR (/g/…), É <a>, E NÃO <Link>. No
 *    grupo único o botão leva direto a /g/geral. O `next/link` pré-carrega
 *    o destino quando o botão aparece na tela — e pré-carregar uma rota
 *    que conta clique e manda Lead para a Meta é inventar conversão a cada
 *    visita. E a resposta é um 307 para fora do site, que a navegação do
 *    Next não é feita para seguir. A origem e a sessão vão na URL, como na
 *    lista de municípios: é por elas que o redirecionador sabe de onde veio.
 */
export function CliqueGrupo({
  origem,
  children,
  href = '/#grupos',
  className = '',
  aoClicar,
}: {
  origem: OrigemClique
  children: ReactNode
  href?: string
  className?: string
  /** Algo além do evento — o menu, por exemplo, fecha. */
  aoClicar?: () => void
}) {
  const sessao = useSessao()
  const clicar = () => {
    aoClicar?.()
    evento('clicou_cta', { origem })
  }

  if (href.startsWith('/g/')) {
    return (
      <a href={`${href}?de=${origem}${sessao ? `&s=${sessao}` : ''}`} className={className} onClick={clicar}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={className} onClick={clicar}>
      {children}
    </Link>
  )
}
