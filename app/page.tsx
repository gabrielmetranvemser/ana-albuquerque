import { g, GRUPO_UNICO } from '@/content/campanha'
import { headers } from 'next/headers'
import { listarMunicipiosComStatus } from '@/lib/dados'
import { casarCidadePorHeader } from '@/lib/geo'
import { config, emSilencioEleitoral } from '@/lib/config'
import { lerConteudo } from '@/lib/conteudo/ler'
import { destinoDoGrupo, secoesOcultas } from '@/lib/conteudo/secoes'

import { Header } from '@/components/site/Header'
import { BotaoFlutuante } from '@/components/site/BotaoFlutuante'
import { RegistroDePagina } from '@/components/site/RegistroDePagina'
import { FaixaCorrida } from '@/components/site/FaixaCorrida'
import { SecaoGrupos } from '@/components/site/SecaoGrupos'
import { SecaoFiltro } from '@/components/site/SecaoFiltro'
import { Compartilhar } from '@/components/site/Compartilhar'
import { RodapeLegal } from '@/components/site/RodapeLegal'
import { Abertura } from '@/components/ana/Abertura'
import { Capitulos } from '@/components/ana/Capitulos'
import { Propostas } from '@/components/ana/Propostas'
import { Missao } from '@/components/ana/Missao'
import { Assinatura } from '@/components/ana/Assinatura'

/**
 * Revalida de hora em hora. Dois motivos:
 *  · o status dos grupos muda no painel e precisa aparecer sem redeploy
 *  · o silêncio eleitoral vira sozinho, sem alguém lembrar de apagar CTA
 */
export const revalidate = 3600

/**
 * ⚠️ ANA: A ORDEM DESTA PÁGINA É A DO DOCUMENTO DA CAMPANHA, e foi um
 *    pedido explícito ("siga exatamente a ordem do doc"). A ordem do
 *    modelo — origem, álbum, rua, problema, bandeiras, cena, provas —
 *    contava a história de outra pessoa com a estrutura de outra pessoa.
 *
 *    Documento → página:
 *      título e apresentação ........... Abertura
 *      "frases-chave para o design" .... a fita logo abaixo
 *      "Uma história feita de trabalho"
 *        … até "Por que a política?" ... Capítulos (em lista, no painel)
 *      "O que Ana leva para Brasília" .. Propostas
 *      "Uma nova missão" ............... Missão
 *      "Ana Albuquerque — Trabalho,
 *       coragem e cuidado" ............. Assinatura
 *      "Conheça. Acompanhe. Participe."  grupos, filtro e compartilhar
 *
 *    As ferramentas de campanha (grupos, filtro) ficam no fim porque é
 *    ali que o documento põe o "Participe" — e os botões delas aparecem
 *    desde a primeira dobra, então o funil não espera a página acabar.
 */
export default async function Home() {
  // ANA: `candidato` e `meta` saem do painel, e não de content/copy.ts —
  // eram lidos direto do arquivo só para os dados estruturados abaixo, e
  // trocar o nome ou a descrição no painel não chegava ao que o Google lê.
  const conteudo = await lerConteudo()
  const { exibir, candidato, meta } = conteudo

  // ANA: GRUPO ÚNICO (content/campanha.ts ▸ modoGrupos). A seção dos 52
  // municípios não vai ao ar, e a lista nem sai do banco. Os botões de
  // grupo levam a /g/geral — ou somem, enquanto o link não foi preenchido.
  const mostrarGrupos = exibir.grupos && !GRUPO_UNICO
  const destino = destinoDoGrupo(conteudo)
  const [municipios, cabecalhos] = await Promise.all([
    mostrarGrupos ? listarMunicipiosComStatus() : Promise.resolve([]),
    headers(),
  ])

  // Sugestão silenciosa por IP: o header vem da Vercel, de graça,
  // sem pedir permissão nenhuma para a pessoa.
  const sugerido = casarCidadePorHeader(
    municipios,
    cabecalhos.get('x-vercel-ip-city'),
    cabecalhos.get('x-vercel-ip-country-region'),
  )

  const silencio = emSilencioEleitoral()

  return (
    <>
      <RegistroDePagina />
      <Header silencio={silencio} ocultas={secoesOcultas(exibir)} destino={destino} />

      <main id="conteudo">
        <Abertura silencio={silencio} />
        {exibir.faixa ? <FaixaCorrida /> : null}
        {exibir.capitulos ? <Capitulos corDepois="var(--color-papel)" /> : null}
        {exibir.futuro ? <Propostas /> : null}
        {exibir.missao ? <Missao /> : null}
        <Assinatura silencio={silencio} />
        {mostrarGrupos ? <SecaoGrupos municipios={municipios} sugerido={sugerido} /> : null}
        {exibir.filtro ? <SecaoFiltro /> : null}
        {exibir.compartilhar ? <Compartilhar siteUrl={config.siteUrl} /> : null}
      </main>

      <RodapeLegal />
      {destino ? <BotaoFlutuante silencio={silencio} destino={destino} /> : null}

      {/* Dados estruturados: ajuda o Google a entender quem é a pessoa.

          ⚠️ O `replace` NÃO É ENFEITE, e é o único ponto da página que
          escreve HTML sem passar pelo React. `JSON.stringify` escapa
          aspas, mas NÃO escapa `</script>` — e o navegador fecha a tag
          ao ver essa sequência, esteja ela dentro de uma string JSON ou
          não. Trocar `<` pelo escape unicode resolve na origem. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: candidato.nome,
            jobTitle: `${g.Candidato} a ${candidato.cargo}`,
            description: meta.descricao,
            url: config.siteUrl,
            sameAs: [candidato.instagram],
            affiliation: { '@type': 'Organization', name: candidato.partidoExtenso },
            homeLocation: {
              '@type': 'Place',
              address: {
                '@type': 'PostalAddress',
                addressRegion: candidato.uf,
                addressCountry: 'BR',
              },
            },
          }).replace(/</g, '\\u003c'),
        }}
      />
    </>
  )
}
