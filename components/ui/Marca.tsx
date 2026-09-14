'use client'

import Image from 'next/image'
import { useConteudo } from '@/lib/conteudo/contexto'

/**
 * A marca da campanha.
 *
 * O `Image` do Next entra onde a arte é raster, com `sizes` certo: o
 * público está em 4G.
 *
 * ⚠️ É Client Component por necessidade, não por escolha: o `Header`
 *    (que é cliente) o importa, então na prática ele já era cliente.
 *    Como o texto alternativo vem do conteúdo editável, precisa do hook.
 *
 * ⚠️ ANA: SEM ARTE NO PAINEL, A MARCA OFICIAL CONTINUA NA TELA. No modelo,
 *    espaço vazio desenhava a marca em código — nome e número na fonte
 *    de título, e uma bandeira pintada com as cores da campanha. Para a
 *    Ana isso deu errado de um jeito que a campanha viu na hora: a
 *    bandeira saiu LARANJA e o nome em letra de template, e a resposta
 *    foi "a logo da Ana é outra". A arte oficial já existe, então ela
 *    virou o padrão: os arquivos em `public/marca/` saíram de
 *    "Marca Ana/" (logotipo, escudo e a arte do 7766 laranja).
 *
 *    O painel continua vencendo: quando um espaço `marca.*` recebe
 *    imagem, é ela que aparece, sem deploy.
 */

/** O escudo com a bandeira, com contorno branco (vale no azul e no papel). */
export function Simbolo({
  className = '',
  url = null,
  prioridade = false,
}: {
  className?: string
  /** Imagem enviada pelo painel (espaço `marca.simbolo`). Quando existe, ela manda. */
  url?: string | null
  prioridade?: boolean
}) {
  return (
    <Image
      src={url ?? '/marca/escudo.webp'}
      alt=""
      width={246}
      height={256}
      priority={prioridade}
      sizes="64px"
      className={className}
      aria-hidden
    />
  )
}

/**
 * O logotipo colorido — "Ana Albuquerque" em marinho, com o escudo.
 * Só sobre fundo claro: é o do cabeçalho de papel.
 */
export function LogoCor({ className = '', prioridade = false }: { className?: string; prioridade?: boolean }) {
  const { candidato } = useConteudo()
  return (
    <Image
      src="/marca/ana-cor.webp"
      alt={`${candidato.nome} — ${candidato.cargo}`}
      width={1000}
      height={437}
      priority={prioridade}
      sizes="(max-width: 768px) 40vw, 180px"
      className={className}
    />
  )
}

/** O logotipo branco. Só sobre fundo escuro: rodapé e superfícies azuis. */
export function LogoHorizontal({
  className = '',
  url = null,
}: {
  className?: string
  /** Imagem do painel (espaço `marca.logotipo`). Manda quando existe. */
  url?: string | null
}) {
  const { candidato } = useConteudo()
  return (
    <Image
      src={url ?? '/marca/ana-branca.webp'}
      alt={`${candidato.nome} — ${candidato.cargo}`}
      width={1000}
      height={437}
      sizes="(max-width: 768px) 80vw, 420px"
      className={className}
    />
  )
}

/** A marca com o número, em pé: nome em cima, 7766 laranja embaixo. */
export function MarcaNumero({
  className = '',
  prioridade = false,
  url = null,
}: {
  className?: string
  prioridade?: boolean
  /** Imagem do painel (espaço `marca.lockup`). */
  url?: string | null
}) {
  const { candidato } = useConteudo()
  return (
    <Image
      src={url ?? '/marca/lockup-7766.webp'}
      alt={`${candidato.nome} — ${candidato.numero}`}
      width={900}
      height={694}
      priority={prioridade}
      sizes="(max-width: 1024px) 60vw, 420px"
      className={className}
    />
  )
}

/** A mesma marca, deitada — nome à esquerda, número à direita. */
export function MarcaNumeroHorizontal({
  className = '',
  prioridade = false,
  url = null,
}: {
  className?: string
  prioridade?: boolean
  /** Imagem do painel (espaço `marca.lockupDeitado`). */
  url?: string | null
}) {
  const { candidato } = useConteudo()
  return (
    <Image
      src={url ?? '/marca/lockup-deitado.webp'}
      alt={`${candidato.nome} — ${candidato.numero}`}
      width={1400}
      height={286}
      priority={prioridade}
      sizes="(max-width: 1024px) 80vw, 560px"
      className={className}
    />
  )
}

/** O número sozinho, na arte oficial: 7766 laranja com contorno marinho. */
export function Numero({
  className = '',
  prioridade = false,
  url = null,
}: {
  className?: string
  prioridade?: boolean
  url?: string | null
}) {
  const { candidato } = useConteudo()
  return (
    <Image
      src={url ?? '/marca/numero-7766.webp'}
      alt={`Número ${candidato.numero}`}
      width={900}
      height={355}
      priority={prioridade}
      sizes="(max-width: 768px) 70vw, 420px"
      className={className}
    />
  )
}
