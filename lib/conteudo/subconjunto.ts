import 'server-only'

import { lerConteudo } from './ler'
import { CHAVES_CLIENTE, type ConteudoCliente } from './recorte'

/** Recorta, no servidor, só o que a árvore de cliente consome. */
export async function lerConteudoCliente(): Promise<ConteudoCliente> {
  const todo = await lerConteudo()
  const saida = {} as Record<string, unknown>
  for (const chave of CHAVES_CLIENTE) saida[chave] = todo[chave]

  // ⚠️ O LINK DO GRUPO GERAL NÃO DESCE PARA O NAVEGADOR. A seção `grupos`
  //    vai inteira para o cliente (os textos da busca), e com ela iria o
  //    link — que é justamente o que o redirecionador /g/ existe para
  //    esconder: link de grupo solto no HTML é o que robô de raspagem
  //    recolhe para lotar grupo de campanha. Desce em branco; quem precisa
  //    saber SE ele existe recebe o destino pronto do servidor
  //    (`destinoDoGrupo`, lib/conteudo/secoes.ts).
  if (todo.grupos) saida.grupos = { ...todo.grupos, linkGeral: '' }

  return saida as ConteudoCliente
}
