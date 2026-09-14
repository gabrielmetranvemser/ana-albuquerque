import { lerConteudo } from '@/lib/conteudo/ler'
import { lerSlots, type ImagemDoSlot } from '@/lib/midia/ler'
import { Imagem } from '@/components/ui/Imagem'
import { TextoComDestaque, Texto } from '@/components/ui/TextoComDestaque'
import { SLOTS, type Slot } from '@/content/slots'
import type { Conteudo } from '@/lib/conteudo/tipos'
import { Onda } from './Organico'

/**
 * OS CAPÍTULOS DA PÁGINA DA ANA — a história e as causas, na ordem do
 * documento da campanha. O conteúdo e o porquê da lista estão em
 * CAPÍTULOS, content/copy.ts.
 *
 * ⚠️ ESTE É O SEGUNDO DESENHO DOS CAPÍTULOS. O primeiro tinha fita
 *    crepe, adesivos tortos, títulos em caixa alta itálica, citação e
 *    lista em letra de pincel e fotos recortadas em bolha — que cortavam
 *    cabeça. A campanha: "muito ruim toda a hierarquia, a diagramação".
 *    As regras que saíram disso valem para as oito formas:
 *
 *    · UMA HIERARQUIA SÓ: rótulo pequeno → título → parágrafo. O rótulo
 *      nunca compete com o título, e o título nunca é caixa alta.
 *    · PINCEL SÓ EM ATÉ TRÊS PALAVRAS (quem garante é o TextoComDestaque).
 *      Citação é letra de título; lista é letra de corpo.
 *    · FOTO É RETÂNGULO DE CANTO ARREDONDADO. Rosto não se recorta.
 *    · NADA TORTO, exceto as fotos de papel do álbum: ali o giro é o que
 *      diz "foto de família", e é o único lugar em que diz algo.
 *
 * ⚠️ O `layout` ESCOLHE A FORMA, E A FORMA SEGUE O TEXTO. Um capítulo que
 *    é uma frase-manifesto não cabe no desenho de um capítulo de lista.
 *
 * ⚠️ AS SEÇÕES SE EMENDAM POR ONDA, pintada com a cor do capítulo
 *    SEGUINTE. Quando os dois têm a mesma cor, não há onda.
 */

type Cap = Conteudo['capitulos']['itens'][number]
type Slots = Record<string, ImagemDoSlot>

/**
 * `realce` é a cor do trecho [[entre colchetes]] do título — o que o tom
 * `capa` do TextoComDestaque lê. Sobre o laranja é marinho: amarelo sobre
 * laranja some.
 */
const FUNDOS: Record<string, { classe: string; cor: string; escuro: boolean; realce: string }> = {
  papel: { classe: 'papel text-tinta', cor: 'var(--color-papel)', escuro: false, realce: 'var(--color-azul)' },
  areia: { classe: 'bg-areia text-tinta', cor: 'var(--color-areia)', escuro: false, realce: 'var(--color-azul)' },
  branco: { classe: 'bg-white text-tinta', cor: '#ffffff', escuro: false, realce: 'var(--color-azul)' },
  azul: { classe: 'bg-azul grao text-white', cor: 'var(--color-azul)', escuro: true, realce: 'var(--color-amarelo)' },
  marinho: { classe: 'bg-azul-escuro grao text-white', cor: 'var(--color-azul-escuro)', escuro: true, realce: 'var(--color-amarelo)' },
  laranja: { classe: 'bg-verde grao text-white', cor: 'var(--color-verde)', escuro: true, realce: 'var(--color-azul-escuro)' },
}

export async function Capitulos({ corDepois = 'var(--color-papel)' }: { corDepois?: string }) {
  const [{ capitulos }, slots] = await Promise.all([lerConteudo(), lerSlots()])
  const itens = capitulos.itens

  return (
    <>
      {itens.map((cap, i) => {
        const seguinte = itens[i + 1]
        const cor = seguinte ? (FUNDOS[seguinte.fundo] ?? FUNDOS.papel).cor : corDepois
        return <Capitulo key={cap.id} cap={cap} slots={slots} indice={i} corSeguinte={cor} />
      })}
    </>
  )
}

function Capitulo({ cap, slots, indice, corSeguinte }: { cap: Cap; slots: Slots; indice: number; corSeguinte: string }) {
  const f = FUNDOS[cap.fundo] ?? FUNDOS.papel
  const fotos = SLOTS.filter((s) => s.chave.startsWith(`capitulo.${cap.id}.`))
  const escuro = f.escuro

  return (
    <section
      id={cap.ancora || undefined}
      style={{ ['--capa-realce' as string]: f.realce }}
      className={`relative isolate overflow-hidden ${f.classe} py-20 md:py-28`}
    >
      <div className="container-lp relative">
        {cap.layout === 'carta' ? <Carta cap={cap} fotos={fotos} slots={slots} /> : null}
        {cap.layout === 'foto' ? <ComFoto cap={cap} fotos={fotos} slots={slots} escuro={escuro} /> : null}
        {cap.layout === 'album' ? <Album cap={cap} fotos={fotos} slots={slots} escuro={escuro} /> : null}
        {cap.layout === 'indice' ? <Indice cap={cap} escuro={escuro} /> : null}
        {cap.layout === 'fotos' ? <Faixa cap={cap} fotos={fotos} slots={slots} escuro={escuro} /> : null}
        {cap.layout === 'manifesto' ? <Manifesto cap={cap} escuro={escuro} /> : null}
        {cap.layout === 'destaque' ? <Destaque cap={cap} escuro={escuro} /> : null}
        {cap.layout === 'lista' ? <ListaMarcada cap={cap} escuro={escuro} /> : null}
      </div>
      {corSeguinte !== f.cor ? <Onda cor={corSeguinte} variante={indice} /> : null}
    </section>
  )
}

// ── Peças comuns ──────────────────────────────────────────────────

function Cabeca({ cap, escuro, cartaz = false }: { cap: Cap; escuro: boolean; cartaz?: boolean }) {
  return (
    <>
      {cap.etiqueta ? (
        <p data-revelar className={`rotulo-ana flex items-center gap-3 ${escuro ? 'text-white/85' : 'text-azul-escuro'}`}>
          <span aria-hidden className={`h-0.5 w-8 shrink-0 rounded-full ${escuro ? 'bg-amarelo' : 'bg-laranja'}`} />
          {cap.etiqueta}
        </p>
      ) : null}
      {cap.titulo ? (
        <h2
          data-revelar
          style={{ ['--atraso' as string]: '60ms' }}
          className={`mt-5 ${cartaz ? 'titulo-cartaz' : 'titulo-secao'} ${escuro ? 'text-white' : 'text-azul-escuro'}`}
        >
          <TextoComDestaque texto={cap.titulo} tom="capa" />
        </h2>
      ) : null}
    </>
  )
}

function Paragrafos({ itens, escuro, className = '' }: { itens: string[]; escuro: boolean; className?: string }) {
  if (itens.length === 0) return null
  return (
    <div className={`max-w-[62ch] space-y-5 ${className}`}>
      {itens.map((p, i) => (
        <p key={i} data-revelar className={`text-lg leading-relaxed md:text-[1.1875rem] ${escuro ? 'text-white/88' : 'text-grafite'}`}>
          <Texto>{p}</Texto>
        </p>
      ))}
    </div>
  )
}

function Citacao({ texto, escuro }: { texto: string; escuro: boolean }) {
  if (!texto) return null
  return (
    <blockquote data-revelar className={`my-10 max-w-[40ch] border-l-4 pl-6 ${escuro ? 'border-amarelo' : 'border-laranja'}`}>
      <p className={`font-[family-name:var(--font-titulo)] text-[1.6rem] leading-snug font-semibold md:text-[2rem] ${escuro ? 'text-white' : 'text-azul-escuro'}`}>
        “{texto}”
      </p>
    </blockquote>
  )
}

/**
 * Primeiro parágrafo, citação, demais parágrafos — a ordem em que o
 * documento usa a citação: ela responde ao parágrafo que a anuncia
 * ("como eu mesma digo:", "fez nascer uma pergunta:").
 */
function Corpo({ cap, escuro, colado = false }: { cap: Cap; escuro: boolean; colado?: boolean }) {
  const [primeiro, ...resto] = cap.paragrafos
  return (
    <>
      {primeiro ? <Paragrafos itens={[primeiro]} escuro={escuro} className={colado ? '' : 'mt-7'} /> : null}
      <Citacao texto={cap.citacao} escuro={escuro} />
      {resto.length > 0 ? <Paragrafos itens={resto} escuro={escuro} className={cap.citacao ? '' : 'mt-5'} /> : null}
    </>
  )
}

function Visto({ escuro }: { escuro: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={`mt-0.5 size-6 shrink-0 ${escuro ? 'text-amarelo' : 'text-verde'}`}>
      <circle cx="12" cy="12" r="11" fill="currentColor" opacity="0.16" />
      <path d="m7.5 12.4 3 3 6-6.4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Marcos({ cap, escuro }: { cap: Cap; escuro: boolean }) {
  if (cap.marcos.length === 0) return null
  return (
    <ol data-revelar className="mt-10 grid gap-6 sm:grid-cols-3">
      {cap.marcos.map((m) => (
        <li key={m.id} className={`border-t-2 pt-4 ${escuro ? 'border-white/25' : 'border-azul/20'}`}>
          <span className={`block font-[family-name:var(--font-titulo)] text-3xl leading-none font-bold ${escuro ? 'text-amarelo' : 'text-azul'}`}>
            {m.ano}
          </span>
          <span className={`mt-2 block text-base leading-snug ${escuro ? 'text-white/85' : 'text-grafite'}`}>{m.texto}</span>
        </li>
      ))}
    </ol>
  )
}

function Lista({ itens, escuro, colunas = false }: { itens: string[]; escuro: boolean; colunas?: boolean }) {
  if (itens.length === 0) return null
  return (
    <ul className={`mt-8 grid gap-x-8 gap-y-3.5 ${colunas ? 'md:grid-cols-2' : ''}`}>
      {itens.map((item, i) => (
        <li key={i} data-revelar style={{ ['--atraso' as string]: `${i * 40}ms` }} className="flex items-start gap-3">
          <Visto escuro={escuro} />
          <span className={`text-lg leading-snug ${escuro ? 'text-white' : 'text-tinta'}`}>
            <Texto>{item}</Texto>
          </span>
        </li>
      ))}
    </ul>
  )
}

function Fecho({ texto, escuro, className = '' }: { texto: string; escuro: boolean; className?: string }) {
  if (!texto) return null
  return (
    <p
      data-revelar
      className={`mt-14 max-w-3xl font-[family-name:var(--font-titulo)] text-[1.75rem] leading-[1.18] font-semibold tracking-[-0.02em] md:text-[2.4rem] ${
        escuro ? 'text-white' : 'text-azul-escuro'
      } ${className}`}
    >
      <TextoComDestaque texto={texto} tom="capa" />
    </p>
  )
}

/** Uma foto de capítulo: retângulo de canto arredondado, sem cortar ninguém. */
function Foto({ slot, slots, sizes, className = '' }: { slot: Slot; slots: Slots; sizes: string; className?: string }) {
  return (
    <div
      className={`foto-ana relative overflow-hidden bg-azul/10 ${className}`}
      style={{ aspectRatio: (slot.proporcao ?? '4/5').replace('/', ' / ') }}
    >
      <Imagem slot={slot.chave} slots={slots} sizes={sizes} className="absolute inset-0 size-full object-cover" />
    </div>
  )
}

// ── As formas ─────────────────────────────────────────────────────

/**
 * Carta: a abertura em primeira pessoa, numa folha colada com fita,
 * assinada — e com a foto ao lado ("precisa ter espaço do lado pra foto").
 */
function Carta({ cap, fotos, slots }: { cap: Cap; fotos: Slot[]; slots: Slots }) {
  return (
    <div className={`grid items-center gap-12 lg:gap-16 ${fotos.length > 0 ? 'lg:grid-cols-[1.2fr_0.8fr]' : ''}`}>
      <div className={`relative ${fotos.length > 0 ? '' : 'mx-auto max-w-3xl'}`}>
        <span aria-hidden className="fita-crepe -top-3 left-1/2 z-10 -translate-x-1/2 -rotate-2" />
        <article data-revelar className="cartao-ana relative px-6 py-11 md:px-12 md:py-14">
          <Cabeca cap={cap} escuro={false} />
          <Corpo cap={cap} escuro={false} />
          {cap.fecho ? (
            <footer className="mt-9 border-t border-linha pt-6">
              <p className="font-[family-name:var(--fonte-rabisco)] text-4xl text-azul">{cap.fecho}</p>
            </footer>
          ) : null}
        </article>
      </div>
      {fotos.length > 0 ? (
        <div data-revelar className="mx-auto w-full max-w-sm lg:max-w-none">
          <Foto slot={fotos[0]} slots={slots} sizes="(max-width: 1024px) 80vw, 30vw" />
        </div>
      ) : null}
    </div>
  )
}

/** Foto ao lado do texto. A segunda foto entra menor, sobreposta ao canto. */
function ComFoto({ cap, fotos, slots, escuro }: { cap: Cap; fotos: Slot[]; slots: Slots; escuro: boolean }) {
  const esquerda = cap.lado === 'esquerda'
  const [principal, ...outras] = fotos
  return (
    <>
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div className={esquerda ? 'lg:order-2' : ''}>
          <Cabeca cap={cap} escuro={escuro} />
          <Corpo cap={cap} escuro={escuro} />
          <Marcos cap={cap} escuro={escuro} />
          <Lista itens={cap.lista} escuro={escuro} />
        </div>
        {principal ? (
          <div data-revelar className={`relative mx-auto w-full max-w-md pb-10 lg:max-w-none ${esquerda ? 'lg:order-1' : ''}`}>
            <Foto slot={principal} slots={slots} sizes="(max-width: 1024px) 90vw, 42vw" />
            {outras.slice(0, 2).map((s, i) => (
              <div
                key={s.chave}
                className={`absolute w-[42%] rounded-[1.4rem] bg-white p-1.5 shadow-[0_24px_40px_-24px_rgba(10,20,82,0.55)] ${
                  i === 0 ? '-bottom-2 -left-4 sm:-left-8' : '-top-6 -right-3 sm:-right-6'
                }`}
              >
                <Foto slot={s} slots={slots} sizes="18rem" className="!rounded-[1.1rem] !shadow-none" />
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <Fecho texto={cap.fecho} escuro={escuro} />
    </>
  )
}

/** Álbum: as fotos de família, soltas como papel; a lista vira frases curtas. */
function Album({ cap, fotos, slots, escuro }: { cap: Cap; fotos: Slot[]; slots: Slots; escuro: boolean }) {
  const giros = ['-2deg', '1.5deg', '1deg', '-1.5deg']
  return (
    <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
      <div>
        <Cabeca cap={cap} escuro={escuro} />
        <Corpo cap={cap} escuro={escuro} />
        {cap.lista.length > 0 ? (
          <ul className="mt-10 space-y-2.5">
            {cap.lista.map((linha, i) => (
              <li
                key={i}
                data-revelar
                style={{ ['--atraso' as string]: `${i * 70}ms` }}
                className={`flex items-center gap-4 font-[family-name:var(--font-titulo)] text-xl font-semibold tracking-[-0.01em] md:text-2xl ${
                  escuro ? 'text-white' : 'text-azul-escuro'
                }`}
              >
                <span aria-hidden className="size-2.5 shrink-0 rounded-full bg-laranja" />
                <Texto>{linha}</Texto>
              </li>
            ))}
          </ul>
        ) : null}
        <Fecho texto={cap.fecho} escuro={escuro} />
      </div>
      {fotos.length > 0 ? (
        <ul className="grid grid-cols-2 gap-5 sm:gap-6">
          {fotos.map((s, i) => (
            <li
              key={s.chave}
              data-revelar
              style={{ ['--atraso' as string]: `${i * 70}ms`, rotate: giros[i % giros.length] }}
              className={`rounded-[1.1rem] bg-white p-2 shadow-[0_22px_40px_-26px_rgba(10,20,82,0.55)] ${i % 2 === 1 ? 'mt-8' : ''}`}
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-[0.8rem]">
                <Imagem slot={s.chave} slots={slots} sizes="(max-width: 640px) 45vw, 18rem" className="absolute inset-0 size-full object-cover" />
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

/** Índice: os atalhos como cartões. É a porta de "Minhas causas". */
function Indice({ cap, escuro }: { cap: Cap; escuro: boolean }) {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
      <div>
        <Cabeca cap={cap} escuro={escuro} cartaz />
        <Corpo cap={cap} escuro={escuro} />
      </div>
      {cap.atalhos.length > 0 ? (
        <ol className="grid gap-4">
          {cap.atalhos.map((a, i) => (
            <li key={a.id} data-revelar style={{ ['--atraso' as string]: `${i * 80}ms` }}>
              <a
                href={a.href}
                className="group cartao-ana flex min-h-20 items-center gap-5 px-6 py-5 text-azul-escuro transition-transform duration-300 ease-(--ease-suave) hover:-translate-y-1 md:px-8 md:py-6"
              >
                <span className="font-[family-name:var(--font-titulo)] text-2xl font-bold text-verde tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 font-[family-name:var(--font-titulo)] text-2xl leading-tight font-semibold tracking-[-0.02em] md:text-[1.75rem]">
                  {a.rotulo}
                </span>
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-azul/10 transition-colors group-hover:bg-amarelo">
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </a>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  )
}

/** Fotos em faixa: a lista vira uma sequência de frases curtas, uma por linha. */
function Faixa({ cap, fotos, slots, escuro }: { cap: Cap; fotos: Slot[]; slots: Slots; escuro: boolean }) {
  return (
    <>
      <div className="grid gap-12 lg:grid-cols-2 lg:items-end lg:gap-20">
        <div>
          <Cabeca cap={cap} escuro={escuro} />
          <Corpo cap={cap} escuro={escuro} />
        </div>
        {cap.lista.length > 0 ? (
          <ol className={`space-y-3 border-l-2 pl-6 ${escuro ? 'border-white/25' : 'border-azul/20'}`}>
            {cap.lista.map((linha, i) => (
              <li
                key={i}
                data-revelar
                style={{ ['--atraso' as string]: `${i * 90}ms` }}
                className={`font-[family-name:var(--font-titulo)] text-2xl leading-snug font-semibold tracking-[-0.015em] md:text-[1.75rem] ${
                  i === cap.lista.length - 1 ? (escuro ? 'text-amarelo' : 'text-azul') : ''
                }`}
              >
                <Texto>{linha}</Texto>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
      {fotos.length > 0 ? (
        <ul className="mt-16 grid gap-5 sm:grid-cols-3">
          {fotos.map((s, i) => (
            <li key={s.chave} data-revelar style={{ ['--atraso' as string]: `${i * 80}ms` }}>
              <Foto slot={s} slots={slots} sizes="(max-width: 640px) 90vw, 30vw" />
            </li>
          ))}
        </ul>
      ) : null}
      <Fecho texto={cap.fecho} escuro={escuro} />
    </>
  )
}

/** Manifesto: a frase grande manda; o texto acompanha em duas colunas. */
function Manifesto({ cap, escuro }: { cap: Cap; escuro: boolean }) {
  return (
    <div className="max-w-5xl">
      <Cabeca cap={cap} escuro={escuro} cartaz />
      <Corpo cap={cap} escuro={escuro} />
      {cap.lista.length > 0 ? (
        <ul data-revelar className="mt-10 flex flex-wrap gap-3">
          {cap.lista.map((palavra, i) => (
            <li
              key={i}
              className={`rounded-full px-5 py-2.5 font-[family-name:var(--font-titulo)] text-xl font-semibold md:text-2xl ${
                escuro ? 'bg-white/10 text-white ring-1 ring-white/20' : 'bg-white text-azul-escuro shadow-[0_10px_24px_-18px_rgba(10,20,82,0.5)]'
              }`}
            >
              {palavra}
            </li>
          ))}
        </ul>
      ) : null}
      <Fecho texto={cap.fecho} escuro={escuro} />
    </div>
  )
}

/**
 * Destaque: o título de um lado e o texto num cartão claro do outro.
 *
 * ⚠️ O CARTÃO É SEMPRE CLARO, e é por leitura: corpo de texto branco
 *    sobre o laranja fica abaixo de 4,5:1. O laranja fica para o título
 *    e para a frase de fecho, que são grandes.
 */
function Destaque({ cap, escuro }: { cap: Cap; escuro: boolean }) {
  return (
    <>
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <Cabeca cap={cap} escuro={escuro} cartaz />
        </div>
        {cap.paragrafos.length > 0 || cap.citacao ? (
          <div data-revelar className={`cartao-ana px-7 py-8 md:px-10 md:py-10 ${escuro ? '' : '!bg-papel'}`}>
            <Corpo cap={cap} escuro={false} colado />
          </div>
        ) : null}
      </div>
      <Lista itens={cap.lista} escuro={escuro} colunas />
      <Fecho texto={cap.fecho} escuro={escuro} />
    </>
  )
}

/** Lista marcada: os itens em cartões, em duas colunas. */
function ListaMarcada({ cap, escuro }: { cap: Cap; escuro: boolean }) {
  const impar = cap.lista.length % 2 === 1
  return (
    <>
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <Cabeca cap={cap} escuro={escuro} />
          <Corpo cap={cap} escuro={escuro} />
        </div>
        {cap.lista.length > 0 ? (
          <ul className="grid gap-3 self-start sm:grid-cols-2 lg:pt-2">
            {cap.lista.map((item, i) => (
              <li
                key={i}
                data-revelar
                style={{ ['--atraso' as string]: `${i * 40}ms` }}
                className={`flex items-start gap-3 rounded-2xl px-5 py-4 ${impar && i === cap.lista.length - 1 ? 'sm:col-span-2' : ''} ${
                  escuro ? 'bg-white/10 ring-1 ring-white/15' : 'cartao-ana'
                }`}
              >
                <Visto escuro={escuro} />
                <span className={`text-[1.0625rem] leading-snug font-medium ${escuro ? 'text-white' : 'text-tinta'}`}>
                  <Texto>{item}</Texto>
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <Fecho texto={cap.fecho} escuro={escuro} />
    </>
  )
}
