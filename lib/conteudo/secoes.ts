import { GRUPO_UNICO } from '@/content/campanha'
import type { Conteudo } from './tipos'

/**
 * As seções que o painel pode desligar.
 *
 * ⚠️ Desligar uma seção não é só deixar de renderizá-la: é preciso
 *    cuidar de quem APONTA para ela. Um item de menu levando a uma
 *    âncora que não existe mais não dá erro — ele simplesmente não faz
 *    nada quando a pessoa toca, que é pior que um erro, porque parece
 *    site quebrado sem dizer o que quebrou.
 */
export type Exibir = Conteudo['exibir']

/** Os ids de seção desligados, no formato das âncoras (`origem`, `futuro`…). */
export function secoesOcultas(exibir: Exibir): string[] {
  return Object.entries(exibir)
    .filter(([, ligada]) => !ligada)
    .map(([chave]) => chave)
}

/**
 * Para onde os botões de grupo devem apontar.
 *
 * Com a seção de grupos no ar, é a âncora — rolar é mais rápido que
 * carregar página. Com ela desligada, a âncora não existe, e o destino
 * passa a ser `/grupos`, que é a mesma lista numa página própria e já
 * existia. Assim desligar a seção encurta a home sem derrubar o funil
 * inteiro da campanha, que é o que aconteceria se os botões virassem
 * cliques mortos.
 */
export function destinoGrupo(exibir: Exibir): string {
  return exibir.grupos ? '/#grupos' : '/grupos'
}

/** O redirecionador do grupo único. Ver app/g/geral/route.ts. */
export const CAMINHO_GRUPO_GERAL = '/g/geral'

/**
 * Para onde os botões de grupo apontam — ou `null`, e aí o botão some.
 *
 * ⚠️ NULL É ESTADO NORMAL, E NÃO ERRO. No grupo único, enquanto o link não
 *    foi preenchido no painel, não há para onde mandar ninguém: um "Entrar
 *    no grupo" que volta para a própria página é pior que botão nenhum. É a
 *    regra de sempre do projeto — campo vazio esconde o bloco.
 *
 * O botão aponta para o redirecionador, nunca para o chat.whatsapp.com: é
 * lá que o clique conta, que o silêncio eleitoral trava, e que o grupo
 * cheio se troca pelo painel sem republicar nada.
 *
 * Campanha por município continua exatamente como era (`destinoGrupo`).
 */
export function destinoDoGrupo({ exibir, grupos }: Pick<Conteudo, 'exibir' | 'grupos'>): string | null {
  if (!GRUPO_UNICO) return destinoGrupo(exibir)
  return grupos.linkGeral.trim() ? CAMINHO_GRUPO_GERAL : null
}
