import { after, NextResponse, type NextRequest } from 'next/server'
import { GRUPO_UNICO } from '@/content/campanha'
import { config, emSilencioEleitoral } from '@/lib/config'
import { lerConteudo } from '@/lib/conteudo/ler'
import { gravarEvento, origemDoPedido } from '@/lib/redirecionador'
import { enviarEvento, identidadeDoPedido } from '@/lib/trafego/meta'

/**
 * O REDIRECIONADOR DO GRUPO ÚNICO — a mesma peça de /g/[slug], para a
 * campanha que tem um grupo só (`modoGrupos: 'unico'`, content/campanha.ts).
 *
 * Os botões apontam para cá, e não direto para o chat.whatsapp.com, pelas
 * razões do outro redirecionador: o clique conta, a trava do silêncio
 * eleitoral vale até para QR impresso, e o grupo que enche se troca no
 * painel sem republicar o site.
 *
 * Pasta estática vence o `[slug]` no roteamento: /g/geral cai aqui, e não
 * na busca de um município chamado "geral".
 *
 * `force-dynamic` pelo mesmo motivo de lá: rota cacheada não conta clique
 * e continua mandando para o link antigo depois de trocado.
 */
export const dynamic = 'force-dynamic'
export const revalidate = 0

const LINK_DE_GRUPO = /^https:\/\/chat\.whatsapp\.com\//

export async function GET(req: NextRequest) {
  // Na campanha por município, "geral" não é lugar nenhum.
  if (!GRUPO_UNICO) {
    return NextResponse.redirect(new URL('/grupos?nao-encontrado=1', req.url), 307)
  }

  // ⚠️ CONFORMIDADE — ver o comentário igual em /g/[slug]. Durante o
  //    silêncio a página já mostra o aviso no lugar dos botões.
  if (emSilencioEleitoral()) {
    return NextResponse.redirect(new URL('/', req.url), 307)
  }

  // Sem link, os botões nem aparecem: quem chega aqui veio de link antigo
  // ou digitado. Volta para a página, nunca erro. Link que não é de grupo
  // do WhatsApp também não passa — o painel já recusa, e isto impede que
  // o redirecionador vire um mandar-para-qualquer-lugar.
  const { grupos } = await lerConteudo()
  const link = grupos.linkGeral.trim()
  if (!LINK_DE_GRUPO.test(link)) {
    return NextResponse.redirect(new URL('/', req.url), 307)
  }

  const origem = origemDoPedido(req)
  await gravarEvento({ tipo: 'clicou_grupo', municipio_slug: null, grupo_id: null, origem, req })

  // A conversão para a Meta, em `after` — ver "A CONVERSÃO" em /g/[slug].
  const identidade = identidadeDoPedido(req, req.nextUrl.searchParams.get('s'))
  const eventId = `grupo-geral-${identidade.sessao ?? 'sem-sessao'}-${Date.now()}`
  after(async () => {
    await enviarEvento({
      nome: 'Lead',
      eventId,
      url: new URL(req.nextUrl.pathname + req.nextUrl.search, config.siteUrl).toString(),
      identidade,
      dados: { municipio: 'geral', origem, conteudo: 'grupo-whatsapp' },
    })
  })

  const resposta = NextResponse.redirect(link, 307)
  resposta.headers.set('cache-control', 'no-store, max-age=0')
  return resposta
}
