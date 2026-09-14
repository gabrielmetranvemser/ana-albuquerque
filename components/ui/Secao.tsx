import type { ReactNode } from 'react'
import { TextoComDestaque } from './TextoComDestaque'

interface Props {
  id?: string
  children: ReactNode
  /**
   * Só cor cheia ou branco. Nada de pastel: fundo lavado tira a força
   * da paleta e deixa a página com cara de apresentação corporativa.
   */
  fundo?: 'branco' | 'areia' | 'azul-profundo' | 'verde' | 'amarelo'
  className?: string
  /** Espaçamento vertical. 'solto' para as seções principais. */
  espaco?: 'normal' | 'solto'
}

const FUNDOS = {
  branco: 'bg-white text-tinta',
  // ANA: areia é papel com grão.
  areia: 'papel text-tinta',
  // superfícies cheias: um matiz só, do claro ao escuro
  'azul-profundo': 'fundo-azul-profundo text-white',
  verde: 'fundo-verde text-white',
  // amarelo é chapado — gradiente em amarelo suja para ocre
  amarelo: 'bg-amarelo text-azul-escuro',
} as const

export function Secao({
  id,
  children,
  fundo = 'branco',
  className = '',
  espaco = 'normal',
}: Props) {
  return (
    <section
      id={id}
      className={`relative ${FUNDOS[fundo]} ${
        espaco === 'solto' ? 'py-20 md:py-32' : 'py-16 md:py-24'
      } ${className}`}
    >
      <div className="container-lp">{children}</div>
    </section>
  )
}

interface CabecalhoProps {
  etiqueta?: string
  titulo: ReactNode
  intro?: string
  tom?: 'claro' | 'escuro'
  /**
   * Como pintar o trecho entre [[colchetes]] no título.
   * Padrão: amarelo sobre fundo escuro, azul sobre claro.
   * 'grifo' é o traço amarelo sob a palavra — o design usa nas seções
   * em que o título é uma afirmação curta.
   */
  destaque?: 'auto' | 'grifo'
  /** Centraliza o bloco. Usado no CTA final e em seções de abertura. */
  centro?: boolean
  className?: string
}

export function CabecalhoSecao({
  etiqueta,
  titulo,
  intro,
  tom = 'claro',
  destaque = 'auto',
  centro = false,
  className = '',
}: CabecalhoProps) {
  return (
    <header className={`${centro ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'} ${className}`}>
      {/* A etiqueta é texto pequeno: sobre fundo escuro ela é branca,
          porque amarelo em 13px sobre o verde não passa em contraste.
          O traço, sim, é amarelo — é detalhe, não é leitura. */}
      {etiqueta ? (
        // ANA: a etiqueta é a dos capítulos — caixa alta condensada com
        // a estrela do logotipo —, para grupos e filtro falarem a mesma
        // língua do resto da página.
        <p
          data-revelar
          className={`rotulo-ana flex items-center gap-2.5 ${centro ? 'justify-center' : ''} ${
            tom === 'escuro' ? 'text-white' : 'text-azul-escuro'
          }`}
        >
          <span aria-hidden className={`h-0.5 w-6 shrink-0 rounded-full ${tom === 'escuro' ? 'bg-amarelo' : 'bg-laranja'}`} />
          {etiqueta}
        </p>
      ) : null}

      {/* String passa pelo interpretador de [[destaque]]; ReactNode
          continua aceito para os casos que ainda montam JSX à mão. */}
      <h2 data-revelar style={{ ['--atraso' as string]: '70ms' }} className="mt-4 titulo-secao">
        {typeof titulo === 'string' ? (
          <TextoComDestaque
            texto={titulo}
            // ANA: `grifo` virou pincel também. O traço amarelo por baixo
            // era a assinatura visual do modelo; aqui o realce de todo
            // título é a letra de pincel.
            tom={destaque === 'grifo' && tom !== 'escuro' ? 'azul' : tom === 'escuro' ? 'amarelo' : 'azul'}
          />
        ) : (
          titulo
        )}
      </h2>

      {intro ? (
        <p
          data-revelar
          style={{ ['--atraso' as string]: '140ms' }}
          className={`mt-5 text-lg md:text-xl ${
            tom === 'escuro' ? 'text-white/80' : 'text-grafite'
          } ${centro ? 'mx-auto' : ''}`}
        >
          {/* O `intro` de TODA seção passa por aqui. Sem o
              interpretador, negrito aplicado numa introdução aparecia
              como `**assim**` na página — foi o defeito relatado. */}
          {typeof intro === 'string' ? <TextoComDestaque texto={intro} tom={tom === 'escuro' ? 'amarelo' : 'azul'} /> : intro}
        </p>
      ) : null}
    </header>
  )
}
