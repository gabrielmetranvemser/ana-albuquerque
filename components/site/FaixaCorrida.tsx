import { lerConteudo } from '@/lib/conteudo/ler'
import { Texto } from '@/components/ui/TextoComDestaque'

/**
 * A faixa com as frases-chave, logo abaixo da primeira dobra.
 *
 * ⚠️ ANA: JÁ FOI FITA ADESIVA AMARELA, TORTA, EM CAIXA ALTA ITÁLICA — e
 *    a campanha reprovou: "ficou feia, muito ruim de ler". Letra
 *    condensada itálica, andando e inclinada, é três obstáculos de
 *    leitura somados. Agora é reta, na letra do corpo em caixa normal, e
 *    anda devagar: são frases para serem lidas, não textura.
 *
 * ⚠️ DEPOIS FOI MARINHO, com um ponto laranja entre as frases. Legível,
 *    mas a campanha sentiu "falta bastante do laranja". Virou o laranja
 *    claro da logo, chapado, com letra marinho fosco (5,9:1) — é a primeira
 *    superfície laranja que se vê ao sair da dobra azul. Letra branca ali
 *    daria 2,5:1, e por isso não é branca.
 *
 * A lista é repetida DUAS vezes no HTML, e não é engano. O laço anda
 * a trilha inteira até -50% e recomeça: como a segunda metade é igual
 * à primeira, o ponto de emenda cai exatamente onde o desenho se
 * repete e a volta não aparece. A segunda cópia é aria-hidden.
 */
export async function FaixaCorrida() {
  const { faixa } = await lerConteudo()
  if (faixa.itens.length === 0) return null

  const fila = (oculta: boolean) =>
    faixa.itens.map((item) => (
      <li key={`${oculta ? 'b' : 'a'}-${item.id}`} className="flex shrink-0 items-center gap-8 px-8">
        <span className="text-lg font-semibold whitespace-nowrap md:text-xl">
          <Texto>{item.texto}</Texto>
        </span>
        <span aria-hidden className="size-2 shrink-0 rounded-full bg-azul-escuro" />
      </li>
    ))

  return (
    <div className="faixa relative isolate overflow-hidden bg-laranja py-5 text-azul-escuro">
      {/* Mais lenta que a do modelo: frase inteira precisa de tempo na tela. */}
      <ul className="faixa-trilha" style={{ animationDuration: '140s' }}>
        {fila(false)}
        <li aria-hidden className="contents">
          <ul className="contents">{fila(true)}</ul>
        </li>
      </ul>
    </div>
  )
}
