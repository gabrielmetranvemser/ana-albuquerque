import Image from 'next/image'
import { lerConteudo } from '@/lib/conteudo/ler'
import { lerSlots, type ImagemDoSlot } from '@/lib/midia/ler'
import { TextoComDestaque, Texto } from '@/components/ui/TextoComDestaque'
import { MarcaNumero } from '@/components/ui/Marca'
import { BotaoLink } from '@/components/ui/Botao'
import { CliqueGrupo } from '@/components/site/CliqueGrupo'
import { destinoGrupo } from '@/lib/conteudo/secoes'
import { SLOTS } from '@/content/slots'
import { FaixaBrasil } from './Organico'

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
 *    · O NÚMERO GRANDE EM DOIS LARANJAS atrás da foto, como o "77" do post.
 *      É enfeite e está fora do leitor de tela: o número de verdade está
 *      no logotipo do cabeçalho e no rodapé legal.
 *
 * ⚠️ O NÚMERO É MAIS LARGO QUE A FOTO, E TEM DE SER. Na primeira montagem
 *    ele tinha a largura dela e sumia inteiro atrás da camisa — só um "6"
 *    escapava. Agora sobra dos dois lados do corpo, no computador e no
 *    celular.
 *
 * ⚠️ A COLUNA DO TEXTO É LARGA (1.35fr) para a linha da manuscrita caber
 *    inteira no computador.
 *
 * ⚠️ A FOTO É `public/ana.png`, entregue pela campanha: recorte sem fundo,
 *    cortado na cintura — por isso encosta no pé da dobra. O arquivo tem
 *    4MB e não vai assim para o celular: passa pelo `next/image`, que
 *    entrega no tamanho da tela. Imagem subida no painel (`hero.retrato`)
 *    vence a do arquivo. Sem nenhuma das duas, a dobra mostra a marca com
 *    o 7766 no lugar, que é um estado pronto e não um buraco.
 */

const VOZ_DA_LINHA = ['font-medium text-azul', 'font-bold text-laranja-forte', 'font-semibold text-azul-escuro']

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

/** O número em dois laranjas, dígito sim, dígito não — o "77" do post. */
function NumeroGrande({ numero }: { numero: string }) {
  if (!numero) return null
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute right-1/2 bottom-[-0.07em] z-0 translate-x-1/2 font-[family-name:var(--font-titulo)] text-[clamp(9rem,50vw,16rem)] leading-[0.8] font-extrabold tracking-[-0.06em] whitespace-nowrap select-none lg:text-[clamp(15rem,24vw,21rem)]"
    >
      {numero.split('').map((d, i) => (
        <span key={i} className={i % 2 === 0 ? 'text-laranja-forte' : 'text-laranja'}>
          {d}
        </span>
      ))}
    </span>
  )
}

export async function Abertura({ silencio = false }: { silencio?: boolean }) {
  const [{ ctas, hero, exibir, candidato }, slots] = await Promise.all([lerConteudo(), lerSlots()])
  const paraOsGrupos = destinoGrupo(exibir)
  const retrato = retratoDaCapa(slots)
  const lockup = slots['marca.lockup']?.url ?? null

  return (
    <section
      id="inicio"
      // `--capa-realce` é a variável que o realce `tom="capa"` lê.
      style={{ ['--capa-realce' as string]: 'var(--color-azul)' }}
      className="relative isolate overflow-hidden pt-28 md:pt-32"
    >
      <div className="container-lp relative grid gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-end lg:gap-8">
        <div className="relative z-10 pb-4 lg:pt-8 lg:pb-28">
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
            <div
              className="anima-hero mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
              style={{ animationDelay: '520ms' }}
            >
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
              <BotaoLink href={hero.ctaSecundarioHref} variante="contorno" tamanho="lg" className="text-azul sm:whitespace-nowrap">
                {hero.ctaSecundario}
              </BotaoLink>
            </div>
          ) : (
            <p className="anima-hero mt-9 max-w-xl rounded-2xl bg-azul/8 px-5 py-4 text-azul-escuro">{ctas.silencio}</p>
          )}
        </div>

        <div className="anima-surge relative flex min-h-[22rem] items-end justify-center self-end" style={{ animationDelay: '200ms' }}>
          {retrato ? (
            <>
              <NumeroGrande numero={candidato.numero} />
              <Image
                src={retrato.url}
                alt={retrato.alt}
                width={retrato.largura}
                height={retrato.altura}
                priority
                sizes="(max-width: 1024px) 80vw, 30vw"
                className="relative z-10 h-auto w-[72%] max-w-[20rem] drop-shadow-[0_30px_40px_rgba(28,38,80,0.18)] sm:max-w-[23rem] lg:h-[min(38rem,calc(100svh-9rem))] lg:w-auto lg:max-w-none"
              />
            </>
          ) : (
            <div className="relative w-full max-w-md py-10">
              <MarcaNumero url={lockup} prioridade className="h-auto w-full drop-shadow-[0_26px_40px_rgba(10,20,82,0.25)]" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
