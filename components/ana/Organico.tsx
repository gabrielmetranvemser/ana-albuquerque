/**
 * AS FORMAS FEITAS À MÃO DA PÁGINA DA ANA.
 *
 * A campanha pediu a página "mais orgânica, menos degradê". Estas são
 * as peças que fazem isso sem gradiente nenhum: a borda ondulada entre
 * seções, a pincelada sob a palavra, a estrela do logotipo, o círculo
 * de caneta, a faixa verde-e-amarela e a mancha de papel recortado.
 *
 * ⚠️ TUDO EM SVG INLINE, E NÃO EM IMAGEM. São dezenas de usos na página;
 *    como arquivo, cada um seria uma requisição. Inline elas custam
 *    alguns bytes no HTML e pegam a cor do texto em volta (`currentColor`),
 *    então a mesma pincelada serve no azul, no laranja e no papel.
 *
 * ⚠️ Nenhuma forma aqui é lida por leitor de tela: todas são
 *    `aria-hidden`. São enfeite com função, não conteúdo.
 */

/**
 * Três ondas diferentes, para duas seções vizinhas não terem a mesma
 * emenda — onda repetida lê como padrão de computador, e é justamente
 * isso que se quer evitar.
 */
const ONDAS = [
  'M0 38C120 12 260 64 420 40S700 6 880 30s330 46 560 8V80H0Z',
  'M0 26C160 58 300 4 480 30s320 44 520 14 300-30 440 6V80H0Z',
  'M0 44C200 20 330 60 540 34S860 2 1040 28s260 38 400 16V80H0Z',
]

/**
 * A borda ondulada. Fica DENTRO da seção de cima, encostada no pé, e é
 * pintada com a cor da seção de BAIXO — assim a de baixo parece subir
 * sobre a de cima com a borda rasgada.
 *
 * `-bottom-px`: sem ele sobra uma linha de um pixel da cor de cima na
 * emenda, em telas com densidade fracionária.
 */
export function Onda({
  cor,
  variante = 0,
  className = '',
}: {
  /** Cor da seção seguinte. Aceita qualquer valor CSS, inclusive var(). */
  cor: string
  variante?: number
  className?: string
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 -bottom-px z-10 block h-5 w-full md:h-9 ${className}`}
      style={{ color: cor }}
    >
      <path d={ONDAS[variante % ONDAS.length]} fill="currentColor" />
    </svg>
  )
}

/** Uma pincelada de tinta, torta nas pontas. Esticável em qualquer largura. */
export function Pincelada({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 300 36" preserveAspectRatio="none" className={className}>
      <path
        fill="currentColor"
        d="M6 21C54 9 150 4 292 11c5 1 6 9 1 11C206 20 104 23 12 31c-8 1-12-8-6-10Z"
      />
    </svg>
  )
}

/** A estrela que separa "Ana" de "Albuquerque" no logotipo. */
export function Estrela({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className}>
      <path
        fill="currentColor"
        d="m12 1.8 2.9 6.6 7.1.7-5.4 4.8 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.1l7.1-.7L12 1.8Z"
      />
    </svg>
  )
}

/** Um círculo de caneta, que não fecha — como alguém marcando uma palavra. */
export function Circulo({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 220 90" preserveAspectRatio="none" fill="none" className={className}>
      <path
        d="M26 52C18 26 82 8 150 12c52 3 70 30 50 50-26 24-120 26-164 8C14 60 12 40 40 26"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  )
}

/**
 * A faixa verde, estrela, amarela — tirada do logotipo. É a assinatura
 * "Brasil" da página, e aparece pequena: faixa grande vira bandeira de
 * torcida, e a campanha é de deputada, não de seleção.
 */
export function FaixaBrasil({
  className = '',
  estrela = '#ffffff',
}: {
  className?: string
  /** Branca sobre azul, marinho sobre papel. */
  estrela?: string
}) {
  return (
    <svg aria-hidden viewBox="0 0 240 16" className={className}>
      <path d="M4 5h98l8 3-8 3H0Z" fill="var(--color-verde-bandeira)" />
      <path
        fill={estrela}
        d="m120 0 2.4 5.2 5.6.5-4.3 3.8 1.3 5.5-5-3-5 3 1.3-5.5-4.3-3.8 5.6-.5Z"
      />
      <path d="M138 5h102l-4 6H138l-8-3Z" fill="var(--color-amarelo)" />
    </svg>
  )
}

/** Mancha de papel recortado, para ficar atrás de foto e de número. */
export function Mancha({ className = '', variante = 0 }: { className?: string; variante?: number }) {
  const formas = [
    'M421 58c71 38 97 139 70 220-27 80-106 140-196 150S112 392 72 318 26 142 88 82 350 20 421 58Z',
    'M398 42c80 30 118 118 96 206-22 88-98 172-194 180S116 382 70 300 30 118 102 68 318 12 398 42Z',
    'M452 96c52 62 40 170-14 238-54 68-152 104-238 80S46 318 40 228 94 64 184 36s216-2 268 60Z',
  ]
  return (
    <svg aria-hidden viewBox="0 0 520 460" className={className}>
      <path d={formas[variante % formas.length]} fill="currentColor" />
    </svg>
  )
}
