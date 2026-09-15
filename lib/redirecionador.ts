import 'server-only'

import type { NextRequest } from 'next/server'
import { config } from '@/lib/config'
import { criarClienteAdmin } from '@/lib/supabase/admin'
import type { OrigemClique } from '@/lib/tipos'

/**
 * O QUE OS DOIS REDIRECIONADORES DIVIDEM: /g/[slug] (um grupo por
 * município) e /g/geral (o grupo único).
 *
 * ⚠️ MORA AQUI PARA NÃO EXISTIR EM DUAS CÓPIAS. Gravar o clique é a métrica
 *    que responde "a página converte?". Duas cópias divergem na primeira
 *    coluna nova, e a divergência não dá erro: um dos caminhos simplesmente
 *    para de contar.
 */

const ORIGENS_VALIDAS = new Set<OrigemClique>([
  'hero', 'topo', 'flutuante', 'lista', 'busca', 'geo', 'mapa',
  'cta_final', 'rodape', 'grupos_pagina', 'qr', 'direto',
])

/** De qual botão veio o clique (`?de=`). Sem origem conhecida, é 'direto'. */
export function origemDoPedido(req: NextRequest): OrigemClique {
  const deParam = req.nextUrl.searchParams.get('de')
  return ORIGENS_VALIDAS.has(deParam as OrigemClique) ? (deParam as OrigemClique) : 'direto'
}

export async function gravarEvento({
  tipo,
  municipio_slug,
  grupo_id,
  origem,
  req,
}: {
  tipo: string
  /** Nulo no grupo único: o clique não é de município nenhum. */
  municipio_slug: string | null
  grupo_id: string | null
  origem: OrigemClique
  req: NextRequest
}) {
  // Id de sessão que o navegador passou em `?s=`. É o mesmo aleatório
  // dos outros eventos, sem nome, sem telefone, sem IP — serve só para
  // o painel conseguir dizer PESSOAS, e não só cliques. Clique de QR
  // impresso não tem sessão, e aí fica null mesmo: é a verdade.
  const s = req.nextUrl.searchParams.get('s')
  const sessao = s && /^[0-9a-f-]{16,40}$/i.test(s) ? s : null

  if (!config.supabaseAtivo) return
  const sb = criarClienteAdmin()
  if (!sb) return

  const ua = req.headers.get('user-agent') ?? ''
  const utm = ['utm_source', 'utm_medium', 'utm_campaign']
    .map((k) => req.nextUrl.searchParams.get(k))
    .filter(Boolean)
    .join('|')

  try {
    await sb.from('eventos').insert({
      tipo,
      municipio_slug,
      grupo_id,
      origem,
      utm: utm || null,
      sessao,
      dispositivo: /Mobile|Android|iPhone/i.test(ua) ? 'celular' : 'desktop',
    })
  } catch {
    // Métrica nunca pode impedir a pessoa de entrar no grupo.
  }
}
