import { lerConteudo } from '@/lib/conteudo/ler'
import { lerSlots } from '@/lib/midia/ler'
import { TextoComDestaque } from '@/components/ui/TextoComDestaque'
import { MarcaNumero } from '@/components/ui/Marca'
import { CliqueGrupo } from '@/components/site/CliqueGrupo'
import { destinoGrupo } from '@/lib/conteudo/secoes'
import { Onda } from './Organico'

/**
 * A ASSINATURA — o último bloco do documento: "ANA ALBUQUERQUE /
 * Trabalho, coragem e cuidado / Deputada Federal — 7766 / CONHEÇA.
 * ACOMPANHE. PARTICIPE.", seguido dos botões de Instagram, WhatsApp e
 * Propostas.
 *
 * Substitui a chamada final do modelo. Para a Ana ela é LARANJA: é o
 * ponto em que a página deixa de contar e passa a pedir, e o laranja do
 * partido é a cor do pedido.
 *
 * ⚠️ É O LARANJA CLARO DA LOGO, COM LETRA MARINHO FOSCO. A primeira versão
 *    usava um laranja queimado (#d4540e), escolhido para a letra branca
 *    passar em contraste — e a campanha pediu "um laranja mais claro,
 *    mais vivo, da cor da logo", sem "esse degradê horroso e escuro".
 *    No laranja claro o branco não passa (2,5:1); o marinho fosco dá
 *    5,9:1. Por isso tudo aqui é marinho, e o botão principal inverte
 *    para marinho com letra branca: botão laranja sobre fundo laranja
 *    some.
 *
 * ⚠️ O REALCE DO TÍTULO É O MESMO MARINHO, e já foi o azul da marca. Azul
 *    saturado sobre laranja saturado vibrava ("o contraste tá meio feio,
 *    desses azul com laranja"). A letra de pincel sozinha já separa o
 *    trecho.
 *
 * ⚠️ O "Agenda" do documento não entrou: não há agenda publicada, e
 *    botão para lugar nenhum é pior que botão nenhum.
 *
 * ⚠️ `#votar` continua existindo, colado no topo: é a âncora antiga da
 *    chamada final, e link já compartilhado não pode morrer.
 */
export async function Assinatura({ silencio = false }: { silencio?: boolean }) {
  const [{ ctaFinal, ctas, exibir, candidato, futuro }, slots] = await Promise.all([lerConteudo(), lerSlots()])
  const paraOsGrupos = destinoGrupo(exibir)

  return (
    <section
      id="acompanhe"
      style={{ ['--capa-realce' as string]: 'var(--color-azul-escuro)' }}
      className="relative isolate overflow-hidden bg-laranja pt-20 pb-24 text-azul-escuro md:pt-28 md:pb-32"
    >
      <span id="votar" aria-hidden className="absolute -top-24" />

      <div className="container-lp relative grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div data-revelar className="mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-none">
          <MarcaNumero
            url={slots['marca.lockup']?.url ?? null}
            className="h-auto w-full drop-shadow-[0_24px_36px_rgba(10,20,82,0.3)]"
          />
        </div>

        <div>
          <h2 data-revelar className="titulo-cartaz text-azul-escuro">
            {ctaFinal.titulo.map((linha, i) => (
              <span key={i} className="block">
                <TextoComDestaque texto={linha} tom="capa" />
              </span>
            ))}
          </h2>

          {ctaFinal.texto ? (
            <p data-revelar className="mt-6 max-w-[52ch] text-xl leading-relaxed font-medium text-azul-escuro">
              {ctaFinal.texto}
            </p>
          ) : null}

          <div data-revelar className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            {ctaFinal.cargo ? (
              <span className="rounded-full bg-azul-escuro px-5 py-2 text-lg font-semibold text-white">{ctaFinal.cargo}</span>
            ) : null}
            {ctaFinal.chamada ? (
              <span className="font-[family-name:var(--font-titulo)] text-2xl font-semibold tracking-[-0.015em] text-azul-escuro md:text-[1.75rem]">
                {ctaFinal.chamada}
              </span>
            ) : null}
          </div>

          {!silencio ? (
            <div data-revelar className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <CliqueGrupo origem="cta_final" href={paraOsGrupos} className="contents">
                <span className="toque inline-flex min-h-14 items-center justify-center rounded-full bg-azul-escuro px-8 text-lg font-semibold text-white shadow-[0_14px_30px_-16px_rgba(10,20,82,0.6)] transition-colors hover:bg-azul">
                  {ctaFinal.ctaPrimario}
                </span>
              </CliqueGrupo>
              {candidato.instagram ? (
                <a
                  href={candidato.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="toque inline-flex min-h-14 items-center justify-center rounded-full bg-white px-7 text-lg font-semibold text-azul-escuro transition-colors hover:bg-papel"
                >
                  {ctas.instagram}
                </a>
              ) : null}
              {exibir.futuro ? (
                <a
                  href="#propostas"
                  className="toque inline-flex min-h-14 items-center justify-center rounded-full border-2 border-azul-escuro/70 px-7 text-lg font-semibold text-azul-escuro transition-colors hover:border-azul-escuro hover:bg-azul-escuro/10"
                >
                  {futuro.etiqueta}
                </a>
              ) : null}
            </div>
          ) : (
            <p className="mt-10 rounded-2xl bg-white/55 px-5 py-4 text-azul-escuro">{ctas.silencio}</p>
          )}
        </div>
      </div>

      <Onda cor="#ffffff" variante={0} />
    </section>
  )
}
