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
      className="relative isolate overflow-hidden bg-verde grao pt-20 pb-24 text-white md:pt-28 md:pb-32"
    >
      <span id="votar" aria-hidden className="absolute -top-24" />

      <div className="container-lp relative grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div data-revelar className="mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-none">
          <MarcaNumero
            url={slots['marca.lockup']?.url ?? null}
            className="h-auto w-full drop-shadow-[0_24px_36px_rgba(10,20,82,0.35)]"
          />
        </div>

        <div>
          <h2 data-revelar className="titulo-cartaz text-white">
            {ctaFinal.titulo.map((linha, i) => (
              <span key={i} className="block">
                <TextoComDestaque texto={linha} tom="capa" />
              </span>
            ))}
          </h2>

          {/* Semibold e a partir de 20px: branco sobre este laranja só
              passa em contraste como texto grande. */}
          {ctaFinal.texto ? (
            <p data-revelar className="mt-6 max-w-[52ch] text-xl leading-relaxed font-semibold text-white">
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
                <span className="toque inline-flex min-h-14 items-center justify-center rounded-full bg-amarelo px-8 text-lg font-semibold text-azul-escuro shadow-[0_14px_30px_-16px_rgba(10,20,82,0.6)] transition-[filter] hover:brightness-105">
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
                  className="toque inline-flex min-h-14 items-center justify-center rounded-full border-2 border-white/80 px-7 text-lg font-semibold text-white transition-colors hover:bg-white/10"
                >
                  {futuro.etiqueta}
                </a>
              ) : null}
            </div>
          ) : (
            <p className="mt-10 rounded-2xl bg-azul-escuro/40 px-5 py-4">{ctas.silencio}</p>
          )}
        </div>
      </div>

      <Onda cor="#ffffff" variante={0} />
    </section>
  )
}
