'use client'

import { useConteudo } from '@/lib/conteudo/contexto'
import type { MunicipioComGrupo } from '@/lib/tipos'
import { achatarDestinos } from '@/lib/destinos'
import { LinhaMunicipio } from './LinhaMunicipio'

/**
 * Os 52, abertos, sem accordion. Público mais velho não caça botão
 * escondido — isso é regra do plano, não preferência de layout.
 *
 * Mais os distritos que têm grupo próprio, cada um logo abaixo da sua
 * sede. Por isso a conta ao lado do título perdeu o "de 52": a lista
 * mostra 54 linhas e continuam sendo 52 municípios. Número que não
 * bate com o que está na tela lê como defeito.
 *
 * ⚠️ ANA: o título da lista vem do painel (`useConteudo`), como o resto
 *    dos textos de grupos. Era importado direto de content/copy.ts, e
 *    editar "Grupos" no painel mudava tudo nesta tela menos este título.
 */
export function ListaMunicipios({ municipios }: { municipios: MunicipioComGrupo[] }) {
  const { grupos: copy } = useConteudo()
  const linhas = achatarDestinos(municipios)
  const abertos = linhas.filter((l) => l.destino.disponivel).length

  return (
    <div className="mt-12">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-xl">{copy.listaTitulo}</h3>
        <p className="text-sm text-grafite">
          {abertos} {abertos === 1 ? 'grupo aberto' : 'grupos abertos'}
        </p>
      </div>

      <ul className="mt-4 grid gap-1 rounded-2xl border border-linha bg-white p-2 sm:grid-cols-2 lg:grid-cols-3">
        {linhas.map(({ destino, dentroDe }) => (
          <LinhaMunicipio
            key={destino.slug}
            destino={destino}
            dentroDe={dentroDe}
            origem="lista"
          />
        ))}
      </ul>
    </div>
  )
}
