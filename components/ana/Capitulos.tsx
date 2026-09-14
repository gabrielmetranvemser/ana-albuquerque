import type { CSSProperties } from 'react'
import { lerConteudo } from '@/lib/conteudo/ler'
import { lerSlots, type ImagemDoSlot } from '@/lib/midia/ler'
import { Imagem } from '@/components/ui/Imagem'
import { TextoComDestaque, Texto } from '@/components/ui/TextoComDestaque'
import { PalcoMotor } from '@/components/animacao/PalcoMotor'
import { SLOTS, type Slot } from '@/content/slots'
import type { Conteudo } from '@/lib/conteudo/tipos'
import { FaixaBrasil } from './Organico'

/**
 * OS CAPÍTULOS DA PÁGINA DA ANA — a história e as causas, na ordem do
 * documento da campanha. O conteúdo e o porquê da lista estão em
 * CAPÍTULOS, content/copy.ts.
 *
 * ⚠️ ESTE É O TERCEIRO DESENHO DOS CAPÍTULOS. O primeiro tinha fita
 *    crepe, adesivos tortos, títulos em caixa alta itálica, citação e
 *    lista em letra de pincel e fotos recortadas em bolha — que cortavam
 *    cabeça. A campanha: "muito ruim toda a hierarquia, a diagramação".
 *    As regras que saíram disso valem para todas as formas:
 *
 *    · UMA HIERARQUIA SÓ: rótulo pequeno → título → parágrafo. O rótulo
 *      nunca compete com o título, e o título nunca é caixa alta.
 *    · PINCEL SÓ EM ATÉ TRÊS PALAVRAS (quem garante é o TextoComDestaque).
 *      Citação é letra de título; lista é letra de corpo.
 *    · FOTO É RETÂNGULO DE CANTO ARREDONDADO. Rosto não se recorta.
 *    · NADA TORTO, exceto as fotos de papel do álbum: ali o giro é o que
 *      diz "foto de família", e é o único lugar em que diz algo.
 *    · TEXTO NÃO VAI EM CAIXA. Cartão ao lado de título ("desalinhada,
 *      estranha, mal diagramada") e itens em cartões translúcidos ("não
 *      gosto dessa diagramação") foram reprovados; o que sobrou de cartão
 *      é a carta, que é folha de papel de propósito, e as fotos.
 *
 * ⚠️ O `layout` ESCOLHE A FORMA, E A FORMA SEGUE O TEXTO. Um capítulo que
 *    é uma frase-manifesto não cabe no desenho de um capítulo de lista.
 *
 * ⚠️ O FUNDO: CLARO É TRANSPARENTE, COLORIDO É DE PONTA A PONTA.
 *    As seções já se emendaram por onda, pintada com a cor do capítulo
 *    seguinte. Com o papel quadriculado do post do Solidariedade (quinta
 *    rodada), o capítulo claro passou a ser transparente, deixando a
 *    grade do <body> correr. O colorido chegou a virar painel de canto
 *    arredondado e foi reprovado na hora: "achei feio todos os blocos,
 *    era melhor quando era largura total". Voltou de ponta a ponta, com
 *    borda reta: a onda, pintada na cor do papel, cobriria a grade com
 *    uma tira lisa.
 */

type Cap = Conteudo['capitulos']['itens'][number]
type Slots = Record<string, ImagemDoSlot>

/**
 * A TINTA DE CADA FUNDO — variáveis CSS que as peças leem, em vez de cada
 * peça perguntar "estou no escuro?".
 *
 * ⚠️ EXISTE PORQUE O LARANJA VIROU FUNDO DE VERDADE. Com claro e escuro
 *    bastava um booleano. O laranja claro da logo é um terceiro caso: a
 *    letra é escura como no papel, mas o acento não pode ser laranja,
 *    senão some. Um booleano a mais em cada peça espalharia a regra por
 *    todas as formas; a variável deixa a regra aqui, num lugar só.
 *
 *    · `--acento` ........ borda da citação e do fecho, ponto, visto
 *    · `--sobre-acento` .. o que vai desenhado em cima do acento
 *    · `--texto-suave` ... parágrafo e legenda
 *    · `--risco` ......... o risco à mão sob a manuscrita (globals.css)
 *
 * ⚠️ NO ESCURO O ACENTO É PÊSSEGO, E NÃO LARANJA. Laranja cheio sobre o
 *    azul foi reprovado ("o contraste tá meio feio, desses azul com
 *    laranja"): duas cores saturadas encostadas vibram. O pêssego é o
 *    mesmo matiz, mais claro e menos saturado. No claro o acento continua
 *    laranja cheio — sobre o papel não há o que vibrar.
 */
type Tinta = { acento: string; sobreAcento: string; suave: string; risco: string }

const TINTA_CLARA: Tinta = { acento: 'var(--color-laranja)', sobreAcento: 'var(--color-azul-escuro)', suave: 'var(--color-grafite)', risco: 'var(--risco-laranja)' }
const TINTA_ESCURA: Tinta = { acento: 'var(--color-pessego)', sobreAcento: 'var(--color-azul-escuro)', suave: 'rgb(255 255 255 / 0.88)', risco: 'var(--risco-pessego)' }
// Grafite sobre o laranja claro dá 3,3:1 — parágrafo ali é o marinho fosco (5,9:1).
const TINTA_LARANJA: Tinta = { acento: 'var(--color-azul-escuro)', sobreAcento: '#ffffff', suave: 'var(--color-azul-escuro)', risco: 'var(--risco-branco)' }

function tinta(t: Tinta): CSSProperties {
  return {
    ['--acento' as string]: t.acento,
    ['--sobre-acento' as string]: t.sobreAcento,
    ['--texto-suave' as string]: t.suave,
    ['--risco' as string]: t.risco,
  }
}

/**
 * `realce` é a cor do trecho [[entre colchetes]] do título — o que o tom
 * `capa` do TextoComDestaque lê. No claro é o azul da marca (com o risco
 * laranja por baixo, como no post). No azul e no marinho é o pêssego
 * (4,6:1 e 8,7:1). Sobre o laranja é o próprio marinho fosco: a
 * manuscrita já separa o trecho, e o azul da marca ali vibrava.
 *
 * ⚠️ O FUNDO `laranja` JÁ FOI O LARANJA QUEIMADO DA PALETA, com letra
 *    branca. A campanha pediu um laranja "mais claro, mais vivo, da cor
 *    da logo" — e nele a letra branca não passa (2,5:1). Por isso
 *    `escuro` é falso ali: a letra é marinho.
 */
const FUNDOS: Record<string, { classe: string; escuro: boolean; realce: string; tinta: Tinta }> = {
  papel: { classe: 'text-tinta', escuro: false, realce: 'var(--color-azul)', tinta: TINTA_CLARA },
  areia: { classe: 'text-tinta', escuro: false, realce: 'var(--color-azul)', tinta: TINTA_CLARA },
  branco: { classe: 'text-tinta', escuro: false, realce: 'var(--color-azul)', tinta: TINTA_CLARA },
  azul: { classe: 'bg-azul grao text-white', escuro: true, realce: 'var(--color-pessego)', tinta: TINTA_ESCURA },
  marinho: { classe: 'bg-azul-escuro grao text-white', escuro: true, realce: 'var(--color-pessego)', tinta: TINTA_ESCURA },
  laranja: { classe: 'bg-laranja text-azul-escuro', escuro: false, realce: 'var(--color-azul-escuro)', tinta: TINTA_LARANJA },
}

// `corDepois` era a cor da onda que emendava o último capítulo na seção
// seguinte. Sem onda, não há o que pintar; a prop fica aceita para a
// página não precisar mudar.
export async function Capitulos(_props: { corDepois?: string } = {}) {
  const [{ capitulos }, slots] = await Promise.all([lerConteudo(), lerSlots()])

  return (
    <>
      {capitulos.itens.map((cap) => (
        <Capitulo key={cap.id} cap={cap} slots={slots} />
      ))}
    </>
  )
}

function Capitulo({ cap, slots }: { cap: Cap; slots: Slots }) {
  // A bandeira é um palco de tela cheia, e não uma seção com respiro e
  // container: ela desenha a própria moldura.
  if (cap.layout === 'bandeira') return <Bandeira cap={cap} />

  const f = FUNDOS[cap.fundo] ?? FUNDOS.papel
  const fotos = SLOTS.filter((s) => s.chave.startsWith(`capitulo.${cap.id}.`))
  const escuro = f.escuro

  return (
    <section
      id={cap.ancora || undefined}
      style={{ ['--capa-realce' as string]: f.realce, ...tinta(f.tinta) }}
      className={`relative isolate overflow-hidden py-20 md:py-28 ${f.classe}`}
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
    </section>
  )
}

// ── Peças comuns ──────────────────────────────────────────────────

/**
 * Rótulo e título. O traço antes do rótulo é a faixa verde, estrela,
 * amarela do logotipo — ver FaixaBrasil. A estrela pega a cor do rótulo.
 */
function Cabeca({ cap, escuro, cartaz = false }: { cap: Cap; escuro: boolean; cartaz?: boolean }) {
  return (
    <>
      {cap.etiqueta ? (
        <p data-revelar className={`rotulo-ana flex items-center gap-3 ${escuro ? 'text-white/85' : 'text-azul-escuro'}`}>
          <FaixaBrasil variante="curta" className={`h-3 w-[5.625rem] shrink-0 ${escuro ? 'text-white' : ''}`} />
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

function Paragrafos({ itens, className = '' }: { itens: string[]; className?: string }) {
  if (itens.length === 0) return null
  return (
    <div className={`max-w-[62ch] space-y-5 ${className}`}>
      {itens.map((p, i) => (
        <p key={i} data-revelar className="text-lg leading-relaxed text-(--texto-suave) md:text-[1.1875rem]">
          <Texto>{p}</Texto>
        </p>
      ))}
    </div>
  )
}

function Citacao({ texto, escuro }: { texto: string; escuro: boolean }) {
  if (!texto) return null
  return (
    <blockquote data-revelar className="my-10 max-w-[40ch] border-l-4 border-(--acento) pl-6">
      <p className={`font-[family-name:var(--font-titulo)] text-[1.6rem] leading-snug font-medium tracking-[-0.02em] md:text-[2rem] ${escuro ? 'text-white' : 'text-azul-escuro'}`}>
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
      {primeiro ? <Paragrafos itens={[primeiro]} className={colado ? '' : 'mt-7'} /> : null}
      <Citacao texto={cap.citacao} escuro={escuro} />
      {resto.length > 0 ? <Paragrafos itens={resto} className={cap.citacao ? '' : 'mt-5'} /> : null}
    </>
  )
}

/**
 * O visto das listas: disco cheio no acento, risco por cima. Era um anel
 * a 16% de opacidade, que no laranja claro virava quase nada — cheio,
 * ele é também o laranja que a campanha sentiu falta, repetido em ritmo.
 */
function Visto() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="mt-0.5 size-6 shrink-0 text-(--acento)">
      <circle cx="12" cy="12" r="11" fill="currentColor" />
      <path d="m7.5 12.4 3 3 6-6.4" fill="none" stroke="var(--sobre-acento)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Marcos({ cap, escuro }: { cap: Cap; escuro: boolean }) {
  if (cap.marcos.length === 0) return null
  return (
    <ol data-revelar className="mt-10 grid gap-6 sm:grid-cols-3">
      {cap.marcos.map((m) => (
        <li key={m.id} className={`border-t-2 pt-4 ${escuro ? 'border-white/25' : 'border-azul/20'}`}>
          <span className={`block font-[family-name:var(--font-titulo)] text-3xl leading-none font-bold tracking-[-0.03em] ${escuro ? 'text-pessego' : 'text-laranja-forte'}`}>
            {m.ano}
          </span>
          <span className="mt-2 block text-base leading-snug text-(--texto-suave)">{m.texto}</span>
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
          <Visto />
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
      className={`mt-14 max-w-3xl font-[family-name:var(--font-titulo)] text-[1.75rem] leading-[1.18] font-semibold tracking-[-0.025em] md:text-[2.4rem] ${
        escuro ? 'text-white' : 'text-azul-escuro'
      } ${className}`}
    >
      <TextoComDestaque texto={texto} tom="capa" />
    </p>
  )
}

/**
 * O fecho das formas de texto (lista e destaque): um tamanho abaixo do
 * título, com o traço do acento à esquerda.
 *
 * ⚠️ NO TAMANHO DO `Fecho` ele era maior que o próprio título. "Inclusão
 *    não é apenas colocar na sala. É garantir que a criança consiga
 *    aprender, conviver, participar e desenvolver seu potencial." em 2.4rem
 *    ocupava quatro linhas e virava a manchete do capítulo.
 */
function FechoMarcado({ texto, escuro }: { texto: string; escuro: boolean }) {
  if (!texto) return null
  return (
    <p
      data-revelar
      className={`mt-16 max-w-4xl border-l-4 border-(--acento) pl-6 font-[family-name:var(--font-titulo)] text-[1.5rem] leading-snug font-semibold tracking-[-0.02em] md:text-[1.875rem] ${
        escuro ? 'text-white' : 'text-azul-escuro'
      }`}
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
 * A folha é sempre clara, então leva a tinta clara qualquer que seja o
 * fundo do capítulo. Sob a assinatura, a faixa do logotipo inteira: é o
 * "Ana ★ Albuquerque" da marca, escrito à mão.
 */
function Carta({ cap, fotos, slots }: { cap: Cap; fotos: Slot[]; slots: Slots }) {
  return (
    <div className={`grid items-center gap-12 lg:gap-16 ${fotos.length > 0 ? 'lg:grid-cols-[1.2fr_0.8fr]' : ''}`}>
      <div className={`relative ${fotos.length > 0 ? '' : 'mx-auto max-w-3xl'}`}>
        <span aria-hidden className="fita-crepe -top-3 left-1/2 z-10 -translate-x-1/2 -rotate-2" />
        <article data-revelar style={tinta(TINTA_CLARA)} className="cartao-ana relative px-6 py-11 md:px-12 md:py-14">
          <Cabeca cap={cap} escuro={false} />
          <Corpo cap={cap} escuro={false} />
          {cap.fecho ? (
            <footer className="mt-9 border-t border-linha pt-6">
              <p className="font-[family-name:var(--fonte-rabisco)] text-4xl text-azul">{cap.fecho}</p>
              <FaixaBrasil className="mt-3 h-3 w-[11.25rem] text-azul-escuro" />
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
                className={`flex items-center gap-4 font-[family-name:var(--font-titulo)] text-xl font-semibold tracking-[-0.015em] md:text-2xl ${
                  escuro ? 'text-white' : 'text-azul-escuro'
                }`}
              >
                <span aria-hidden className="size-2.5 shrink-0 rounded-full bg-(--acento)" />
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

/**
 * Índice: os atalhos como cartões. É a porta de "Minhas causas".
 *
 * O número é azul e a seta mora num disco laranja: laranja claro em
 * número sobre o cartão branco daria 2,5:1. Em forma, ele não precisa
 * de contraste de leitura — e põe o laranja em cada cartão. Ele fica
 * dentro do cartão branco, então não encosta no azul da seção.
 */
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
                <span className="font-[family-name:var(--font-titulo)] text-2xl font-bold text-azul tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 font-[family-name:var(--font-titulo)] text-2xl leading-tight font-semibold tracking-[-0.025em] md:text-[1.75rem]">
                  {a.rotulo}
                </span>
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-laranja text-azul-escuro transition-colors group-hover:bg-azul-escuro group-hover:text-white">
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
                className={`font-[family-name:var(--font-titulo)] text-2xl leading-snug font-semibold tracking-[-0.02em] md:text-[1.75rem] ${
                  i === cap.lista.length - 1 ? (escuro ? 'text-pessego' : 'text-azul') : ''
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

/**
 * Manifesto: a frase grande manda; o texto acompanha.
 *
 * No escuro as palavras da lista ("Aprender. Estudar. Dialogar.") são
 * pílulas pêssego com letra marinho: destacam como o laranja destacaria,
 * sem a vibração do laranja cheio sobre o marinho.
 */
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
                escuro ? 'bg-pessego text-azul-escuro' : 'bg-white text-azul-escuro shadow-[0_10px_24px_-18px_rgba(10,20,82,0.5)]'
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
 * Destaque: o título de um lado, o texto do outro, alinhados pelo topo.
 *
 * ⚠️ O TEXTO JÁ FOI UM CARTÃO CLARO ao lado do título, centrado na altura.
 *    No capítulo das leis a campanha disse "desalinhada, estranha, mal
 *    diagramada, contraste ruim": o título boiava no meio da altura do
 *    cartão, e o cartão brigava com o fundo. Sem cartão, o primeiro
 *    parágrafo abre maior, como linha fina, e tudo começa na altura do
 *    título.
 */
function Destaque({ cap, escuro }: { cap: Cap; escuro: boolean }) {
  const [primeiro, ...resto] = cap.paragrafos
  return (
    <>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <Cabeca cap={cap} escuro={escuro} cartaz />
        </div>
        {cap.paragrafos.length > 0 || cap.citacao ? (
          <div className="lg:col-span-6 lg:mt-10">
            {primeiro ? (
              <p
                data-revelar
                className={`font-[family-name:var(--font-titulo)] text-[1.375rem] leading-snug font-medium tracking-[-0.015em] md:text-[1.625rem] ${
                  escuro ? 'text-white' : 'text-azul-escuro'
                }`}
              >
                <Texto>{primeiro}</Texto>
              </p>
            ) : null}
            <Citacao texto={cap.citacao} escuro={escuro} />
            {resto.length > 0 ? <Paragrafos itens={resto} className={cap.citacao ? '' : 'mt-6'} /> : null}
          </div>
        ) : null}
      </div>
      <Lista itens={cap.lista} escuro={escuro} colunas />
      <FechoMarcado texto={cap.fecho} escuro={escuro} />
    </>
  )
}

/**
 * Lista marcada: título e texto de um lado, a lista do outro — uma linha
 * por item, com um fio entre elas.
 *
 * ⚠️ OS ITENS JÁ FORAM CARTÕES, dois por linha, translúcidos sobre o azul.
 *    A campanha: "não gosto dessa diagramação". Eram sete caixas de altura
 *    desigual, a coluna da direita duas vezes mais alta que a da esquerda,
 *    e o fecho em corpo de título, maior que o próprio título. Agora a
 *    lista é uma coluna só — lê como lista de verificação e começa na
 *    altura do título —, e o fecho desce um tamanho (`FechoMarcado`).
 */
function ListaMarcada({ cap, escuro }: { cap: Cap; escuro: boolean }) {
  const fio = escuro ? 'border-white/20' : 'border-azul/15'
  return (
    <>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Cabeca cap={cap} escuro={escuro} />
          <Corpo cap={cap} escuro={escuro} />
        </div>
        {cap.lista.length > 0 ? (
          <ul className={`self-start border-t lg:col-span-7 lg:mt-10 ${fio}`}>
            {cap.lista.map((item, i) => (
              <li
                key={i}
                data-revelar
                style={{ ['--atraso' as string]: `${i * 40}ms` }}
                className={`flex items-start gap-4 border-b py-4 md:py-[1.125rem] ${fio}`}
              >
                <Visto />
                <span className={`text-lg leading-snug font-medium md:text-[1.1875rem] ${escuro ? 'text-white' : 'text-tinta'}`}>
                  <Texto>{item}</Texto>
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <FechoMarcado texto={cap.fecho} escuro={escuro} />
    </>
  )
}

/**
 * Bandeira: a cena pintada pela rolagem, com a mecânica da cena do modelo
 * (components/animacao/CenaBandeira.tsx e "PALCO" em globals.css). A tela
 * fica presa; o verde recebe o losango amarelo e depois o círculo azul —
 * a bandeira — e cada cor traz uma parte do capítulo: o título no verde,
 * o texto no amarelo, o fecho no azul. Rolar para cima desfaz.
 *
 * ⚠️ NASCEU PARA "LEI QUE EXISTE PRECISA FUNCIONAR", que era título ao lado
 *    de um cartão branco sobre o laranja. A campanha: "tá desalinhada,
 *    estranha, mal diagramada, contraste ruim — talvez pudesse ser uma
 *    animação, semelhante à do Brasil que tem no template, mais verde,
 *    amarelo e azul". E depois: "no web, faça tudo vindo de baixo, ao
 *    invés do lado" — ver "ANA: NO COMPUTADOR TAMBÉM SOBE DE BAIXO".
 *
 * ⚠️ O `fundo` DO CAPÍTULO É IGNORADO nesta forma: as três cores são as da
 *    bandeira. E NÃO HÁ `data-revelar` AQUI DENTRO: quem mostra o texto é
 *    a rolagem, e a revelação por entrada na tela brigaria com ela.
 *
 * ⚠️ O RÓTULO NÃO LEVA A FAIXA DO LOGOTIPO aqui: a barra verde some sobre o
 *    verde. Fica o traço amarelo.
 *
 * ⚠️ SEM ANIMAÇÃO POR ROLAGEM (navegador sem suporte e sem JavaScript, ou
 *    movimento reduzido), o CSS empilha as três telas. O texto nunca fica
 *    recortado para fora — ver "Onde não existe animation-timeline".
 *
 * Sem fecho, o azul repete o título: a cena termina sempre com uma frase.
 */
function Bandeira({ cap }: { cap: Cap }) {
  const final = cap.fecho || cap.titulo
  const cores: CSSProperties = {
    ['--capa-realce' as string]: 'var(--color-bandeira-amarelo)',
    ['--risco' as string]: 'var(--risco-branco)',
  }

  return (
    <section id={cap.ancora || undefined} data-palco aria-label={cap.etiqueta || undefined} style={cores}>
      <div className="palco-trilho">
        <div className="palco-fixa">
          <PalcoMotor />

          <div className="cena-camada cena-verde">
            <div className="container-lp w-full">
              <div className="cena-texto max-w-4xl py-16">
                {cap.etiqueta ? (
                  <p className="rotulo-ana flex items-center gap-3 text-white/90">
                    <span aria-hidden className="h-0.5 w-8 shrink-0 rounded-full bg-bandeira-amarelo" />
                    {cap.etiqueta}
                  </p>
                ) : null}
                {cap.titulo ? (
                  <h2 className="mt-6 titulo-cartaz text-white">
                    <TextoComDestaque texto={cap.titulo} tom="capa" />
                  </h2>
                ) : null}
              </div>
            </div>
          </div>

          <div className="cena-camada cena-amarelo">
            <div className="container-lp w-full">
              <div className="cena-texto max-w-3xl py-16">
                {cap.paragrafos.map((p, i) => (
                  <p
                    key={i}
                    className={
                      i === 0
                        ? 'font-[family-name:var(--font-titulo)] text-[1.625rem] leading-snug font-medium tracking-[-0.02em] md:text-[2.1rem]'
                        : 'mt-6 text-lg leading-relaxed font-medium md:text-xl'
                    }
                  >
                    <Texto>{p}</Texto>
                  </p>
                ))}
                {cap.citacao ? (
                  <p className="mt-8 border-l-4 border-azul-escuro pl-5 font-[family-name:var(--font-titulo)] text-2xl leading-snug font-semibold">
                    “{cap.citacao}”
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="cena-camada cena-azul">
            <div className="container-lp w-full">
              <div className="cena-texto max-w-4xl py-16">
                <p className="titulo-cartaz text-white">
                  <TextoComDestaque texto={final} tom="capa" />
                </p>
                {cap.lista.length > 0 ? (
                  <ul className="mt-8 space-y-2 text-xl font-medium text-white/90">
                    {cap.lista.map((item, i) => (
                      <li key={i}>
                        <Texto>{item}</Texto>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
