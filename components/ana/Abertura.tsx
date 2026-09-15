import Image from 'next/image'
import { lerConteudo } from '@/lib/conteudo/ler'
import { lerSlots, type ImagemDoSlot } from '@/lib/midia/ler'
import { TextoComDestaque, Texto } from '@/components/ui/TextoComDestaque'
import { MarcaNumero } from '@/components/ui/Marca'
import { BotaoLink } from '@/components/ui/Botao'
import { CliqueGrupo } from '@/components/site/CliqueGrupo'
import { destinoDoGrupo } from '@/lib/conteudo/secoes'
import { SLOTS } from '@/content/slots'
import { FaixaBrasil } from './Organico'
import { BarraDaCapa } from './BarraDaCapa'

/**
 * A PRIMEIRA DOBRA DA ANA.
 *
 * ⚠️ ESTA É A QUINTA VERSÃO, E A PRIMEIRA COM FOTO ESCOLHIDA PELA CAMPANHA.
 *    As anteriores ensinaram, em ordem: degradê e foto em soft-light
 *    (modelo); recorte automático de foto de celular ("deixa que eu
 *    escolho"); azul chapado com a marca no lugar da foto; manchete de
 *    seis linhas ("muito grande"); laranja em letra sobre o azul ("desses
 *    azul com laranja").
 *
 * ⚠️ O DESENHO VEM DO POST DO SOLIDARIEDADE que a campanha mandou ("Pode
 *    contar com a gente!"), e dele saíram três regras:
 *
 *    · FUNDO CLARO, NÃO AZUL. Laranja e azul só vibram quando um é o fundo
 *      do outro; sobre o papel quadriculado os dois convivem, que é
 *      exatamente o que o post faz.
 *    · CADA LINHA NUMA VOZ: a primeira em azul e peso médio, a segunda em
 *      laranja forte e negrito, a terceira na manuscrita com o risco
 *      laranja por baixo. A regra é pela POSIÇÃO da linha, e não pelo
 *      texto, então o painel pode reescrever as três sem desmontar nada.
 *    · (Havia uma terceira, o número grande atrás da foto, como o "77" do
 *      post. Saiu — ver a placa, abaixo.)
 *
 * ⚠️ O NOME E O NÚMERO VÃO NUMA PLACA POR CIMA DA FOTO. Foram duas
 *    tentativas com um "7766" gigante em dois laranjas atrás dela. Com
 *    quatro dígitos atrás de uma pessoa no centro, os do meio somem, e a
 *    capa dizia "7   6" ("falta o número dela... bonito, mas estranho"). A
 *    segunda repetiu o número em contorno na frente da camisa, e foi
 *    reprovada na hora: "os números por cima ficaram horrorosos". A
 *    campanha pediu nome e número "por extenso", numa forma por cima. É a
 *    marca oficial com o 7766 (`marca.lockup`, a mesma da assinatura) numa
 *    placa branca que pisa na borda da foto.
 *
 * ⚠️ ATRÁS DA ANA, O ESCUDO DA MARCA EM LARANJA CHAPADO, de baixo até
 *    acima do topo da dobra e cortado na borda da tela. Sem ele a capa era
 *    "tudo branco": camisa branca sobre papel claro. A campanha pediu "algo
 *    laranja, bem grande, pode ser o formato da logo, mesmo cortando". Ele
 *    fica à direita do texto de propósito — laranja atrás de "Uma história
 *    de coragem." apagaria a linha laranja do título. Ver `escudo-chapado`
 *    em globals.css.
 *
 * ⚠️ A FOTO NUNCA TEM ALTURA E LARGURA FIXAS AO MESMO TEMPO. Com altura
 *    fixa, largura automática e uma coluna mais estreita que a conta, o
 *    navegador espremeu a largura e manteve a altura: a Ana saiu ESTICADA
 *    (proporção 0,51 em vez de 0,61) — "você esticou a foto?". Agora quem
 *    tem medida é a MOLDURA: no computador, a altura; no celular, a
 *    largura; a outra sai do `aspect-ratio`. A foto dentro dela tem só
 *    largura, e a altura é a dela mesma. Não há conta que a deforme.
 *
 * ⚠️ A FOTO É CORTADA NOS BRAÇOS (`CORTE_DA_CAPA`). Inteira, até a
 *    cintura, a cabeça ficava pequena: "pode cortar um pouco ela pra
 *    deixar ela maior, pegar só do braço pra cima". A moldura mostra o
 *    topo e esconde o resto; o corte reto some atrás da faixa corrida.
 *
 * ⚠️ A COLUNA DO TEXTO É LARGA (1.35fr) para a linha da manuscrita caber
 *    inteira no computador — com 1.2fr, "Compromisso com pessoas." quebrou
 *    em duas. A foto é bem mais larga que a própria coluna e transborda,
 *    empurrada 6% para a direita: sem o empurrão, o ombro encostava no fim
 *    do título. `shrink-0` impede o flex de espremê-la de volta.
 *
 * ⚠️ A SOMBRA E A ROLAGEM ESTÃO EM globals.css (`capa-escudo`, `capa-foto`,
 *    `capa-placa`). A sombra é quente de propósito: ela cai sobre o
 *    laranja, e sombra cinza sobre laranja vira sujeira.
 *
 * ⚠️ A FOTO É `public/ana.png`, entregue pela campanha: recorte sem fundo,
 *    cortado na cintura — por isso encosta no pé da dobra. O arquivo tem
 *    4MB e não vai assim para o celular: passa pelo `next/image`, que
 *    entrega no tamanho da tela. Imagem subida no painel (`hero.retrato`)
 *    vence a do arquivo. Sem nenhuma das duas, a dobra mostra a marca com
 *    o 7766 no lugar, que é um estado pronto e não um buraco.
 */

/**
 * Quanto da altura do retrato aparece, de cima para baixo. 0,76 é logo
 * abaixo dos braços cruzados do `ana.png` — as mãos ainda aparecem. Um
 * retrato trocado no painel com outro enquadramento pode pedir outro
 * número; 1 mostra a foto inteira.
 */
const CORTE_DA_CAPA = 0.76

const VOZ_DA_LINHA =['font-medium text-azul', 'font-bold text-laranja-forte', 'font-semibold text-azul-escuro']

function retratoDaCapa(slots: Record<string, ImagemDoSlot>): ImagemDoSlot | null {
  const doPainel = slots['hero.retrato']
  if (doPainel) return doPainel
  const def = SLOTS.find((s) => s.chave === 'hero.retrato')
  if (!def?.padrao || !def.padraoTamanho) return null
  return {
    url: def.padrao,
    largura: def.padraoTamanho[0],
    altura: def.padraoTamanho[1],
    alt: def.padraoAlt ?? '',
    blur: null,
    temAlpha: true,
  }
}

export async function Abertura({ silencio = false }: { silencio?: boolean }) {
  const [conteudo, slots] = await Promise.all([lerConteudo(), lerSlots()])
  const { ctas, hero, exibir } = conteudo
  // Nulo no grupo único ainda sem link: o botão principal some, e fica o
  // "Conhecer minha história".
  const paraOsGrupos = destinoDoGrupo(conteudo)
  const retrato = retratoDaCapa(slots)
  const lockup = slots['marca.lockup']?.url ?? null

  return (
    <>
    <section
      id="inicio"
      // `--capa-realce` é a variável que o realce `tom="capa"` lê.
      style={{ ['--capa-realce' as string]: 'var(--color-azul)' }}
      // ⚠️ ALTURA TOTAL NO COMPUTADOR. A dobra tinha a altura do conteúdo, e
      //    numa tela alta sobrava uma tira de papel vazio entre a faixa e o
      //    capítulo seguinte — "a hero poderia ser altura total, sem ter
      //    espaço assim". A conta desconta a faixa corrida (py-5 + uma linha
      //    de text-xl ≈ 4,625rem), para dobra e faixa fecharem juntas a tela;
      //    sem faixa, a dobra ocupa a tela inteira. No celular a dobra
      //    empilhada já é mais alta que a tela, e não leva altura mínima.
      className={`relative isolate flex flex-col overflow-hidden pt-28 md:pt-32 ${
        exibir.faixa ? 'lg:min-h-[calc(100svh-4.625rem)]' : 'lg:min-h-svh'
      }`}
    >
      <div className="container-lp relative grid flex-1 gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:gap-8">
        <div className="relative z-10 pb-4 lg:self-center lg:pt-4 lg:pb-16">
          <p className="anima-hero rotulo-ana flex items-center gap-3 text-azul-escuro">
            <FaixaBrasil variante="curta" className="h-3 w-[5.625rem] shrink-0" />
            {hero.etiqueta}
          </p>

          <h1 className="mt-6 titulo-cartaz">
            {hero.titulo.map((linha, i) => (
              <span
                key={i}
                className={`anima-hero block ${VOZ_DA_LINHA[i % VOZ_DA_LINHA.length]}`}
                style={{ animationDelay: `${100 + i * 90}ms` }}
              >
                <TextoComDestaque texto={linha} tom="capa" />
              </span>
            ))}
          </h1>

          <p
            className="anima-hero mt-7 max-w-xl text-xl leading-relaxed text-tinta/80 md:text-[1.3125rem]"
            style={{ animationDelay: '420ms' }}
          >
            <Texto>{hero.subtitulo}</Texto>
          </p>

          {!silencio ? (
            // No celular estes botões moram na barra do pé da tela
            // (`BarraDaCapa`, logo depois da <section>).
            <div
              className="anima-hero mt-9 hidden flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center md:flex"
              style={{ animationDelay: '520ms' }}
            >
              {paraOsGrupos ? (
              <CliqueGrupo origem="hero" href={paraOsGrupos} className="contents">
                {/* px-6 e seta escondida abaixo de 400px: com px-8 e seta,
                    "Entrar no grupo da minha cidade" quebrava em duas linhas
                    num celular de 390px. Sem `nowrap` no celular: num
                    aparelho de 360px o texto ainda precisa poder quebrar. */}
                <span className="toque inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full bg-laranja px-6 text-center text-lg font-semibold text-azul-escuro shadow-[0_16px_30px_-18px_rgba(242,90,18,0.9)] transition-[filter,transform] duration-300 hover:-translate-y-0.5 hover:brightness-105 sm:px-8 sm:whitespace-nowrap">
                  {ctas.grupo}
                  <svg viewBox="0 0 24 24" className="size-5 shrink-0 max-[400px]:hidden" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </CliqueGrupo>
              ) : null}
              <BotaoLink href={hero.ctaSecundarioHref} variante="contorno" tamanho="lg" className="text-azul sm:whitespace-nowrap">
                {hero.ctaSecundario}
              </BotaoLink>
            </div>
          ) : (
            <p className="anima-hero mt-9 max-w-xl rounded-2xl bg-azul/8 px-5 py-4 text-azul-escuro">{ctas.silencio}</p>
          )}
        </div>

        <div className="anima-surge relative mt-2 flex min-h-[22rem] items-end justify-center self-end lg:mt-0" style={{ animationDelay: '200ms' }}>
          {retrato ? (
            <>
              <span
                aria-hidden
                // No celular o escudo desce até o topo dele ficar abaixo da boca da
                // Ana: "é apenas um símbolo pra ficar bonito", e acima da cabeça
                // ele disputava com o botão e o rosto.
                className="escudo-chapado capa-escudo pointer-events-none absolute bottom-[-78%] left-1/2 z-0 aspect-[246/256] h-[140%] -translate-x-1/2 lg:bottom-[-10%] lg:-left-[6%] lg:h-[calc(100svh+10rem)] lg:translate-x-0"
              />
              {/* A moldura do corte — ver "A FOTO É CORTADA NOS BRAÇOS". */}
              <div
                className="capa-foto relative z-10 w-full max-w-[26rem] shrink-0 lg:h-[min(44rem,calc(100svh-12rem))] lg:w-auto lg:max-w-none lg:translate-x-[6%]"
                style={{ aspectRatio: `${retrato.largura} / ${Math.round(retrato.altura * CORTE_DA_CAPA)}` }}
              >
                <Image
                  src={retrato.url}
                  alt={retrato.alt}
                  width={retrato.largura}
                  height={retrato.altura}
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="absolute inset-x-0 top-0 h-auto w-full"
                  // ⚠️ O CORTE É `clip-path` NA FOTO, E NÃO `overflow-hidden` NA
                  //    MOLDURA. Com `overflow-hidden` e a sombra (`filter`) no
                  //    mesmo elemento, a foto não pintava na página parada — só
                  //    depois da primeira rolagem. Testado um a um: sem a sombra
                  //    aparecia, sem o `overflow` aparecia, sem a animação NÃO.
                  style={{ clipPath: `inset(0 0 ${Math.round((1 - CORTE_DA_CAPA) * 1000) / 10}% 0)` }}
                />
              </div>
              {/* A placa: nome e número por extenso, na arte oficial. */}
              <div className="capa-placa absolute bottom-6 left-0 z-20 w-[56%] max-w-[15rem] rounded-[1.5rem] bg-white/95 p-3.5 shadow-[0_24px_50px_-24px_rgba(10,20,82,0.55)] ring-1 ring-azul/10 sm:max-w-[17rem] lg:bottom-12 lg:-left-12 lg:w-[62%] lg:max-w-[19rem] lg:p-4">
                <MarcaNumero url={lockup} className="h-auto w-full" />
              </div>
            </>
          ) : (
            <div className="relative w-full max-w-md py-10">
              <MarcaNumero url={lockup} prioridade className="h-auto w-full drop-shadow-[0_26px_40px_rgba(10,20,82,0.25)]" />
            </div>
          )}
        </div>
      </div>
    </section>
    {!silencio ? (
      <BarraDaCapa
        destinoGrupo={paraOsGrupos}
        rotuloGrupo={ctas.grupoCurto}
        rotuloHistoria={hero.ctaSecundario}
        hrefHistoria={hero.ctaSecundarioHref}
      />
    ) : null}
    </>
  )
}
