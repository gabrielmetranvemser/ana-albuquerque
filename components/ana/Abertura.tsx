import Image from 'next/image'
import { lerConteudo } from '@/lib/conteudo/ler'
import { lerSlots } from '@/lib/midia/ler'
import { TextoComDestaque, Texto } from '@/components/ui/TextoComDestaque'
import { MarcaNumero } from '@/components/ui/Marca'
import { BotaoLink } from '@/components/ui/Botao'
import { CliqueGrupo } from '@/components/site/CliqueGrupo'
import { destinoGrupo } from '@/lib/conteudo/secoes'
import { Mancha } from './Organico'

/**
 * A PRIMEIRA DOBRA DA ANA.
 *
 * Substitui o `Hero` do modelo (degradê em diagonal, fitas de foto em
 * soft-light). O texto são as três primeiras linhas do documento.
 *
 * ⚠️ SEM FOTO, A MARCA OCUPA O LUGAR DELA — E ISSO É O ESTADO NORMAL
 *    ATÉ A CAMPANHA ESCOLHER. A primeira versão vinha com um recorte
 *    automático de foto de celular, e a resposta foi "essa foto ficou
 *    ruim, deixa que eu escolho". Silhueta cinza no lugar diria "falta
 *    coisa"; a arte oficial do 7766 diz exatamente o que a dobra precisa
 *    dizer. Quando `hero.retrato` recebe imagem no painel, ela entra
 *    sobre a mancha laranja e a marca desce para o canto.
 *
 * ⚠️ AZUL CHAPADO E UMA FORMA SÓ. A versão anterior somava mancha,
 *    estrelas, faixa do Brasil, título em caixa alta itálica e adesivo —
 *    cinco vozes na mesma tela. Ficou o azul, a letra de título em caixa
 *    normal e uma mancha de papel, que é o que resta de "orgânico" sem
 *    virar enfeite.
 *
 * O realce é amarelo, e não laranja como nos posts: laranja sobre este
 * azul dá 2,9:1; o amarelo dá 8:1.
 */
export async function Abertura({ silencio = false }: { silencio?: boolean }) {
  const [{ ctas, hero, exibir }, slots] = await Promise.all([lerConteudo(), lerSlots()])
  const paraOsGrupos = destinoGrupo(exibir)
  const retrato = slots['hero.retrato'] ?? null
  const lockup = slots['marca.lockup']?.url ?? null

  return (
    <section
      id="inicio"
      // `--capa-realce` é a variável que o realce `tom="capa"` lê.
      style={{ ['--capa-realce' as string]: 'var(--color-amarelo)' }}
      className="relative isolate overflow-hidden bg-azul grao pt-32 pb-16 text-white md:pt-40 md:pb-24"
    >
      <div className="container-lp relative grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <p className="anima-hero rotulo-ana flex items-center gap-3 text-white/85">
            <span aria-hidden className="h-0.5 w-8 rounded-full bg-amarelo" />
            {hero.etiqueta}
          </p>

          <h1 className="mt-6 titulo-cartaz text-white">
            {hero.titulo.map((linha, i) => (
              <span key={i} className="anima-hero block" style={{ animationDelay: `${100 + i * 90}ms` }}>
                <TextoComDestaque texto={linha} tom="capa" />
              </span>
            ))}
          </h1>

          <p
            className="anima-hero mt-7 max-w-xl text-xl leading-relaxed text-white/90 md:text-[1.375rem]"
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
                <span className="toque inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full bg-amarelo px-8 text-lg font-semibold text-azul-escuro shadow-[0_14px_30px_-16px_rgba(0,0,0,0.55)] transition-[filter,transform] duration-300 hover:-translate-y-0.5 hover:brightness-105 sm:whitespace-nowrap">
                  {ctas.grupo}
                  <svg viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </CliqueGrupo>
              <BotaoLink href={hero.ctaSecundarioHref} variante="contorno" tamanho="lg" className="text-white sm:whitespace-nowrap">
                {hero.ctaSecundario}
              </BotaoLink>
            </div>
          ) : (
            <p className="anima-hero mt-9 max-w-xl rounded-2xl bg-azul-escuro/60 px-5 py-4">{ctas.silencio}</p>
          )}
        </div>

        <div className="anima-surge relative mx-auto w-full max-w-md lg:max-w-none" style={{ animationDelay: '200ms' }}>
          {retrato ? (
            <div className="relative flex items-end justify-center">
              <Mancha variante={0} className="absolute bottom-0 left-1/2 w-[110%] max-w-none -translate-x-1/2 text-laranja" />
              <Image
                src={retrato.url}
                alt={retrato.alt}
                width={retrato.largura}
                height={retrato.altura}
                priority
                sizes="(max-width: 1024px) 80vw, 40vw"
                className="relative z-10 h-[26rem] w-auto object-contain object-bottom sm:h-[32rem] lg:h-[38rem]"
              />
              <div className="absolute bottom-6 left-0 z-20 w-40 sm:w-52">
                <MarcaNumero url={lockup} prioridade className="h-auto w-full drop-shadow-[0_12px_24px_rgba(10,20,82,0.45)]" />
              </div>
            </div>
          ) : (
            <div className="relative flex items-center justify-center py-4">
              {/* Um tom de azul mais escuro, e não outra cor: dá corpo à
                  marca sem competir com o laranja do número. */}
              <Mancha variante={2} className="absolute inset-0 m-auto w-[112%] max-w-none text-azul-escuro/45" />
              <MarcaNumero
                url={lockup}
                prioridade
                className="relative z-10 h-auto w-[88%] drop-shadow-[0_26px_40px_rgba(10,20,82,0.45)]"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
