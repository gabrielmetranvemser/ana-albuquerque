import { lerConteudo } from '@/lib/conteudo/ler'
import { TextoComDestaque, Texto } from '@/components/ui/TextoComDestaque'
import { Onda } from './Organico'

/**
 * "O QUE ANA LEVA PARA BRASÍLIA" — as palavras e as sete propostas.
 *
 * Substitui o `Futuro` do modelo, que prendia a tela e fazia os cartões
 * andarem de lado conforme a página descia. Para sete propostas de
 * texto longo isso vira espera. Aqui é uma grade que se lê de uma vez.
 *
 * ⚠️ AS PALAVRAS JÁ FORAM ADESIVOS TORTOS EM CAIXA ALTA — reprovados com
 *    o resto do visual de cartum. Viraram etiquetas retas, na letra do
 *    corpo, com um ponto laranja: continuam lendo como "coisas que eu
 *    levo", sem gritar.
 *
 * ⚠️ A PRIMEIRA PROPOSTA OCUPA DUAS COLUNAS, no azul. É a primeira do
 *    documento e a que mais a define. Com ela larga, as sete fecham a
 *    grade de três colunas se a última também alargar — é a conta do
 *    `ultimaLarga`.
 *
 * ⚠️ A ÚLTIMA É LARANJA. A campanha sentiu "falta bastante do laranja";
 *    com a primeira azul e a última laranja, a grade abre e fecha nas
 *    duas cores do partido. Letra marinho, a única que passa sobre o
 *    laranja claro.
 *
 * ⚠️ O NÚMERO DOS CARTÕES BRANCOS É AZUL, e não laranja: laranja claro
 *    sobre branco dá 2,5:1, abaixo até do mínimo de texto grande.
 */
export async function Propostas() {
  const { futuro } = await lerConteudo()
  const ultimaLarga = (futuro.itens.length + 1) % 3 === 2

  return (
    <section
      id="propostas"
      style={{ ['--capa-realce' as string]: 'var(--color-azul)' }}
      className="papel relative isolate overflow-hidden py-20 text-tinta md:py-28"
    >
      <div className="container-lp relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-end lg:gap-20">
          <div>
            <p data-revelar className="rotulo-ana flex items-center gap-3 text-azul-escuro">
              <span aria-hidden className="h-0.5 w-8 rounded-full bg-laranja" />
              {futuro.etiqueta}
            </p>
            <h2 data-revelar className="mt-5 titulo-cartaz text-azul-escuro">
              <TextoComDestaque texto={futuro.titulo} tom="capa" />
            </h2>
            {futuro.intro ? (
              <p data-revelar className="mt-7 max-w-[56ch] text-lg leading-relaxed text-grafite md:text-[1.1875rem]">
                <Texto>{futuro.intro}</Texto>
              </p>
            ) : null}
          </div>

          {futuro.bagagem.length > 0 ? (
            <div data-revelar>
              <ul className="flex flex-wrap gap-2.5">
                {futuro.bagagem.map((palavra, i) => (
                  <li
                    key={i}
                    className="inline-flex items-center gap-2.5 rounded-full bg-white px-5 py-2.5 text-lg font-semibold text-azul-escuro shadow-[0_10px_24px_-18px_rgba(10,20,82,0.5)]"
                  >
                    <span aria-hidden className="size-2 rounded-full bg-laranja" />
                    {palavra}
                  </li>
                ))}
              </ul>
              {futuro.fecho ? (
                <p className="mt-6 max-w-[40ch] font-[family-name:var(--font-titulo)] text-2xl leading-snug font-semibold tracking-[-0.015em] text-azul-escuro">
                  <Texto>{futuro.fecho}</Texto>
                </p>
              ) : null}
            </div>
          ) : null}
        </div>

        <ol className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {futuro.itens.map((item, i) => {
            const primeira = i === 0
            const ultima = i === futuro.itens.length - 1
            const laranja = ultima && !primeira
            const fundo = primeira
              ? 'rounded-[1.5rem] bg-azul text-white md:col-span-2'
              : laranja
                ? 'rounded-[1.5rem] bg-laranja text-azul-escuro'
                : 'cartao-ana text-tinta'
            return (
              <li
                key={item.id}
                data-revelar
                style={{ ['--atraso' as string]: `${i * 50}ms` }}
                className={`flex flex-col p-7 md:p-8 ${fundo} ${ultima && ultimaLarga ? 'lg:col-span-2' : ''}`}
              >
                <span
                  className={`font-[family-name:var(--font-titulo)] text-4xl leading-none font-bold tabular-nums ${
                    primeira ? 'text-pessego' : laranja ? 'text-azul-escuro' : 'text-azul'
                  }`}
                >
                  {item.numero}
                </span>
                <h3 className="mt-5 font-[family-name:var(--font-titulo)] text-[1.5rem] leading-tight font-semibold tracking-[-0.02em] md:text-[1.65rem]">
                  <Texto>{item.titulo}</Texto>
                </h3>
                <p
                  className={`mt-3 text-[1.0625rem] leading-relaxed ${
                    primeira ? 'text-white/88' : laranja ? 'text-azul-escuro' : 'text-grafite'
                  }`}
                >
                  <Texto>{item.texto}</Texto>
                </p>
              </li>
            )
          })}
        </ol>
      </div>

      <Onda cor="var(--color-azul)" variante={1} />
    </section>
  )
}
