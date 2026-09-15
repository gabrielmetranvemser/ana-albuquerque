import { after, NextResponse, type NextRequest } from 'next/server'
import {
  grupoDeDestino,
  localidadePorSlug,
  municipioPorSlug,
  registrarCliqueNoGrupo,
} from '@/lib/dados'
import { GRUPO_UNICO } from '@/content/campanha'
import { config, emSilencioEleitoral } from '@/lib/config'
import { gravarEvento, origemDoPedido } from '@/lib/redirecionador'
import { enviarEvento, identidadeDoPedido } from '@/lib/trafego/meta'

/**
 * O REDIRECIONADOR.
 *
 * É a peça de maior valor do projeto: o link `/g/ji-parana` fica no
 * panfleto, no QR do carro de som e no botão da página. Trocar o
 * destino é editar uma linha no painel — nada de republicar site.
 *
 * `force-dynamic` é obrigatório. Se a Vercel cachear esta rota, o
 * clique não conta e o link antigo persiste depois de trocado.
 * Sintoma silencioso, diagnóstico difícil. Está no plano como risco médio.
 */
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ slug: string }> },
) {
  // No grupo único, todo /g/<qualquer-coisa> é o grupo geral — inclusive
  // um /g/ji-parana que tenha ido para panfleto antes de a campanha
  // decidir ter um grupo só. Origem, sessão e UTMs vão junto.
  if (GRUPO_UNICO) {
    const geral = new URL('/g/geral', req.url)
    geral.search = req.nextUrl.search
    return NextResponse.redirect(geral, 307)
  }

  const { slug } = await ctx.params
  // Distrito com grupo próprio (/g/iata) entra por aqui igual a
  // município. O que muda é a métrica: o evento é gravado no município
  // que ancora o grupo, senão o painel passa a ter linha para um lugar
  // que não existe na tabela de municípios. Quem separa os dois lá é o
  // `grupo_id`, que é diferente.
  const localidade = localidadePorSlug(slug)
  const municipio = municipioPorSlug(localidade?.municipioSlug ?? slug)

  // Lugar que não existe: manda para a lista, nunca erro 404 seco.
  if (!municipio) {
    return NextResponse.redirect(new URL('/grupos?nao-encontrado=1', req.url), 307)
  }

  // ⚠️ CONFORMIDADE. Esconder o CTA na página não basta: o link
  //    /g/ji-parana está impresso em panfleto e colado em QR de carro
  //    de som. Sem esta trava, alguém entra no grupo às 2h do dia da
  //    votação porque escaneou um adesivo. A checagem tem que estar
  //    aqui, no redirecionador, não só no layout.
  if (emSilencioEleitoral()) {
    const destino = new URL('/grupos', req.url)
    destino.searchParams.set('silencio', '1')
    return NextResponse.redirect(destino, 307)
  }

  const origem = origemDoPedido(req)

  const grupo = await grupoDeDestino(slug)
  const podeEntrar =
    grupo?.status === 'aberto' &&
    Boolean(grupo.link) &&
    (grupo.limite_cliques === null || grupo.cliques < grupo.limite_cliques)

  // Sem grupo aberto: volta para a lista com a mensagem certa.
  // "cheio" e "em breve" são situações diferentes e a pessoa merece
  // saber qual das duas é.
  if (!grupo || !podeEntrar) {
    await gravarEvento({
      tipo: 'entrou_grupo_indisponivel',
      municipio_slug: municipio.slug,
      grupo_id: grupo?.id ?? null,
      origem,
      req,
    })

    const destino = new URL('/grupos', req.url)
    destino.searchParams.set('cidade', municipio.slug)
    destino.searchParams.set('situacao', grupo?.status ?? 'em_breve')
    return NextResponse.redirect(destino, 307)
  }

  // Conta o clique e aplica a virada automática por limite.
  await Promise.all([
    registrarCliqueNoGrupo(grupo),
    gravarEvento({
      tipo: 'clicou_grupo',
      municipio_slug: municipio.slug,
      grupo_id: grupo.id,
      origem,
      req,
    }),
  ])

  // ── A CONVERSÃO, para a Meta ────────────────────────────────
  //
  // ⚠️ ESTE É O ÚNICO EVENTO SEM PAR NO NAVEGADOR, e não é escolha:
  //    daqui a resposta é um 307 para o WhatsApp. A página é
  //    descarregada, e o pixel não sobrevive para disparar nada. Todo
  //    site que manda gente para fora tem esse buraco; é exatamente
  //    para ele que a Conversions API existe.
  //
  //    Como não há par, também não há deduplicação a fazer — o id é
  //    gerado aqui mesmo, e serve só para a Meta reconhecer uma
  //    retentativa como repetição, e não como segunda conversão.
  //
  // ⚠️ `after` E NÃO `await`: o que está entre a pessoa e o grupo é
  //    esta função. Esperar 300ms da Graph API antes de redirecionar
  //    seria cobrar da pessoa o preço da nossa medição — e no celular,
  //    em 4G ruim, é assim que se perde alguém no meio do caminho.
  const identidade = identidadeDoPedido(req, req.nextUrl.searchParams.get('s'))
  const eventId = `grupo-${grupo.id}-${identidade.sessao ?? 'sem-sessao'}-${Date.now()}`
  after(async () => {
    await enviarEvento({
      nome: 'Lead',
      eventId,
      url: new URL(req.nextUrl.pathname + req.nextUrl.search, config.siteUrl).toString(),
      identidade,
      dados: { municipio: municipio.slug, origem, conteudo: 'grupo-whatsapp' },
    })
  })

  const resposta = NextResponse.redirect(grupo.link!, 307)
  resposta.headers.set('cache-control', 'no-store, max-age=0')
  return resposta
}

// `gravarEvento` e a lista de origens moram em lib/redirecionador.ts,
// divididos com /g/geral.
