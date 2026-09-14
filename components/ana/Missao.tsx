import { lerConteudo } from '@/lib/conteudo/ler'
import { TextoComDestaque, Texto } from '@/components/ui/TextoComDestaque'
import { Mancha } from './Organico'

/**
 * "UMA NOVA MISSÃO" — da farda para Brasília.
 *
 * O documento fecha este bloco com seis frases curtas começadas em
 * "Pela…/Pelos…". Elas são o ritmo do bloco, e por isso não viram
 * parágrafo: cada uma é uma linha própria.
 *
 * ⚠️ JÁ FORAM LINHAS EM CAIXA ALTA ITÁLICA, alternando branco e amarelo.
 *    Reprovadas junto com o resto: seis linhas gritando cansam. Agora
 *    são letra de título em caixa normal, com um ponto — a força vem de
 *    estarem uma embaixo da outra, não do tamanho.
 *
 * Sobre este azul, o laranja é o pêssego: no realce, no traço, nos pontos
 * e no risco sob a manuscrita. Laranja cheio aqui vibrava — ver
 * `--color-pessego`. De ponta a ponta, e com borda reta — ver
 * Capitulos.tsx.
 */
export async function Missao() {
  const { missao } = await lerConteudo()

  return (
    <section
      id="missao"
      style={{ ['--capa-realce' as string]: 'var(--color-pessego)', ['--risco' as string]: 'var(--risco-pessego)' }}
      className="relative isolate overflow-hidden bg-azul grao py-20 text-white md:py-28"
    >
      <Mancha
        variante={2}
        className="pointer-events-none absolute top-16 -left-48 w-[32rem] text-azul-escuro/30 md:w-[44rem]"
      />

      <div className="container-lp relative grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
        <div>
          <p data-revelar className="rotulo-ana flex items-center gap-3 text-white/85">
            <span aria-hidden className="h-0.5 w-8 rounded-full bg-pessego" />
            {missao.etiqueta}
          </p>
          <h2 data-revelar className="mt-5 titulo-cartaz">
            <TextoComDestaque texto={missao.titulo} tom="capa" />
          </h2>
          {missao.paragrafos.length > 0 ? (
            <div className="mt-8 max-w-[56ch] space-y-5">
              {missao.paragrafos.map((p, i) => (
                <p key={i} data-revelar className="text-lg leading-relaxed text-white/88 md:text-[1.1875rem]">
                  <Texto>{p}</Texto>
                </p>
              ))}
            </div>
          ) : null}
        </div>

        {missao.por.length > 0 ? (
          <ul className="space-y-4 border-l-2 border-white/20 pl-7">
            {missao.por.map((linha, i) => (
              <li
                key={i}
                data-revelar
                style={{ ['--atraso' as string]: `${i * 80}ms` }}
                className="relative font-[family-name:var(--font-titulo)] text-2xl leading-snug font-semibold tracking-[-0.02em] md:text-[1.85rem]"
              >
                <span aria-hidden className="absolute top-[0.6em] -left-[2.1rem] size-3 rounded-full bg-pessego ring-4 ring-azul" />
                <Texto>{linha}</Texto>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}
