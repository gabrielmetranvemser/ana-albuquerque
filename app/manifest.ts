import type { MetadataRoute } from 'next'
import { campanha } from '@/content/campanha'
import { lerConteudo } from '@/lib/conteudo/ler'
import { lerSlots } from '@/lib/midia/ler'

// Assíncrono para ler o ícone do painel. O atalho na tela inicial do
// celular usa ESTES ícones, não o da aba — então trocar um sem o outro
// deixaria o site com duas caras.
//
// ANA: o nome e a descrição também saem do painel ("Busca e
// compartilhamento"), e não de content/copy.ts. A aba já lia do painel;
// o atalho na tela inicial ficava com o texto de fábrica.
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const [icone, { meta }] = await Promise.all([
    lerSlots().then((s) => s['marca.favicon']?.url ?? null),
    lerConteudo(),
  ])

  return {
    name: meta.titulo,
    short_name: meta.tituloCurto,
    description: meta.descricao,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: campanha.cores.primariaEscura,
    lang: 'pt-BR',
    icons: icone
      ? [{ src: icone, sizes: '512x512', type: 'image/webp', purpose: 'any' }]
      : // Sem ícone enviado pelo painel, o atalho na tela inicial usa o
        // mesmo SVG da aba (app/icon.svg). Um SVG serve em qualquer
        // tamanho, o que dispensa manter dois PNGs no repositório —
        // e PNG de campanha antiga esquecido em /public é justamente
        // o tipo de coisa que vaza para o site novo.
        [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  }
}
