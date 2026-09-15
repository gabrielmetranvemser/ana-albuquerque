/**
 * OS ESPAÇOS DE IMAGEM DA PÁGINA.
 *
 * Um slot é um lugar que aceita imagem, com chave estável. Vive em
 * código, não no banco: um slot só existe se algum componente o
 * renderiza. Adicionar slot é mudança de layout; trocar a imagem do
 * slot é ação do admin.
 *
 * Os requisitos declarados aqui são exatamente o que o painel imprime
 * na tela — "instruções de tamanho e formato" não é texto solto, é
 * este objeto. E agora são também o que o RECORTADOR obedece: a
 * proporção vira a janela de corte e o mínimo vira o tamanho de saída.
 * Por isso toda imagem que sai do painel já nasce válida.
 *
 * A ORDEM DA LISTA É A ORDEM DA PÁGINA. `SLOTS_POR_ONDE` preserva a
 * ordem de inserção, então quem abre o painel percorre os espaços na
 * mesma sequência em que o visitante percorre o site.
 *
 * ⚠️ ANA: OS ESPAÇOS DAS SEÇÕES DO MODELO SAÍRAM (origem, álbum, rua,
 *    bandeiras, provas, prova social, retrato de fechamento). A página
 *    dela segue o documento da campanha em capítulos, e as fotos agora
 *    moram nos espaços `capitulo.<id>.<n>`. Cada um nasce com a foto que
 *    a campanha mandou (`padrao`, em `public/fotos/`), e o painel troca.
 */

import { campanha, g } from './campanha'

export interface Slot {
  chave: string
  rotulo: string
  onde: string
  /** Proporção esperada. `null` = livre (recorte sem fundo, print). */
  proporcao: string | null
  larguraMin: number
  alturaMin: number
  /** Exige canal alpha — foto recortada, logo, moldura. */
  alpha?: boolean
  /** Dimensão EXATA, não mínima. Só molduras. */
  exata?: boolean
  balde?: 'midia' | 'molduras'
  nota?: string
  /** Arquivo em /public usado enquanto o slot não tem imagem. */
  padrao?: string
  /** Largura e altura do arquivo padrão. Sem isto o `padrao` é ignorado na página. */
  padraoTamanho?: [number, number]
  /** Texto alternativo da foto padrão. */
  padraoAlt?: string
  /**
   * O `padrao` mora numa pasta que NÃO vai para o git (`public/fotos/`):
   * existe no computador de quem tem o acervo, e não na Vercel. Fora do
   * `npm run dev`, espaço assim sem imagem no painel não aparece — ver
   * `comImagem` em components/ana/Capitulos.tsx.
   */
  padraoLocal?: boolean
}

/** Um espaço de foto de capítulo, já com a foto que a campanha mandou. */
function foto(
  capitulo: string,
  n: number,
  onde: string,
  proporcao: string,
  [largura, altura]: [number, number],
  arquivo: string,
  alt: string,
  nota?: string,
): Slot {
  return {
    chave: `capitulo.${capitulo}.${n}`,
    rotulo: `Foto ${n}`,
    onde,
    proporcao,
    larguraMin: largura,
    alturaMin: altura,
    padrao: `/fotos/${arquivo}`,
    padraoTamanho: [largura, altura],
    padraoAlt: alt,
    padraoLocal: true,
    nota,
  }
}

export const SLOTS: Slot[] = [
  // ── Marca ──────────────────────────────────────────────────────
  // O símbolo e o ícone do navegador. Ficam PRIMEIRO na lista porque
  // são os únicos espaços que aparecem em toda página do site, e não
  // numa seção só.
  {
    chave: 'marca.simbolo',
    rotulo: 'Símbolo da marca',
    onde: 'Marca',
    proporcao: null,
    larguraMin: 256,
    alturaMin: 190,
    alpha: true,
    nota: 'O escudo com a bandeira. PNG com fundo transparente — ele fica sobre o azul e sobre o papel. Sem imagem aqui, o site usa o escudo oficial que já vem no projeto.',
  },
  {
    chave: 'marca.favicon',
    rotulo: 'Ícone do navegador',
    onde: 'Marca',
    proporcao: '1/1',
    larguraMin: 512,
    alturaMin: 512,
    nota: 'Quadrado. É o ícone da aba do navegador e o do atalho na tela inicial do celular. Desenho simples: ele será visto com 16 pixels de lado.',
  },
  // ⚠️ A PROPORÇÃO NÃO É 16:9, e quem chega com uma arte de story ou
  //    de post vai estranhar. 1200×630 é o formato que o WhatsApp, o
  //    Facebook e o Telegram recortam para mostrar; mandar 16:9 faz o
  //    aplicativo aparar por conta própria, quase sempre cortando
  //    justamente o número. O recortador do painel resolve isso: ele
  //    abre a imagem nesta janela e deixa escolher o que fica.
  {
    chave: 'marca.cartaoLink',
    rotulo: 'Cartão do link (WhatsApp)',
    onde: 'Marca',
    proporcao: '1200/630',
    larguraMin: 1200,
    alturaMin: 630,
    nota: 'A imagem que aparece quando alguém cola o link do site no WhatsApp, no Facebook ou no Telegram. Deitada, com o rosto e o número no meio — as bordas são aparadas em telas pequenas. O WhatsApp guarda o cartão de um link por semanas: trocar aqui não muda os links já enviados.',
  },
  {
    chave: 'marca.logotipo',
    rotulo: 'Logotipo (branco)',
    onde: 'Marca',
    proporcao: null,
    larguraMin: 900,
    alturaMin: 145,
    alpha: true,
    nota: 'O logotipo com o nome em BRANCO e fundo transparente. Aparece no rodapé e nas superfícies azuis. Sem imagem aqui, vale o logotipo oficial que já vem no projeto.',
  },
  {
    chave: 'marca.lockup',
    rotulo: 'Marca com o número (em pé)',
    onde: 'Marca',
    proporcao: null,
    larguraMin: 700,
    alturaMin: 500,
    alpha: true,
    nota: 'Nome em cima, número embaixo, fundo transparente. Aparece na primeira dobra e na assinatura do fim da página. Sem imagem aqui, vale a arte oficial do 7766 laranja.',
  },
  {
    chave: 'marca.lockupDeitado',
    rotulo: 'Marca com o número (deitada)',
    onde: 'Marca',
    proporcao: null,
    larguraMin: 1400,
    alturaMin: 227,
    alpha: true,
    nota: 'Nome à esquerda, número à direita, em faixa. Sem imagem aqui, vale a versão montada com o logotipo e o 7766 oficiais.',
  },

  // ── Primeira dobra ─────────────────────────────────────────────
  {
    chave: 'hero.retrato',
    rotulo: `Foto ${g.do} ${campanha.primeiroNome}`,
    onde: 'Primeira dobra',
    proporcao: null,
    larguraMin: 1200,
    alturaMin: 1500,
    alpha: true,
    // ⚠️ A FOTO PADRÃO FOI A CAMPANHA QUE ESCOLHEU. A primeira versão vinha
    //    com um recorte automático de foto de celular, e a campanha
    //    reprovou: "deixa que eu escolho". Em 14/09/2026 ela mandou
    //    `public/ana.png` ("ideal pra colocar na capa"). Fica FORA de
    //    `public/fotos/` de propósito: aquela pasta não vai para o git, e
    //    a foto da capa precisa ir. Sem arquivo e sem painel, a dobra
    //    mostra a marca com o número — ver components/ana/Abertura.tsx.
    padrao: '/ana.png',
    padraoTamanho: [1302, 2128],
    padraoAlt: 'Ana Albuquerque, de camisa branca e óculos, com os braços cruzados',
    nota: 'O retrato da primeira dobra: PNG recortado, sem fundo, cortado na cintura. Sem imagem aqui, vale a foto que a campanha escolheu.',
  },
  {
    chave: 'hero.apoio',
    rotulo: 'Segunda figura (padrinho político)',
    onde: 'Primeira dobra',
    proporcao: null,
    larguraMin: 1200,
    alturaMin: 1500,
    alpha: true,
    nota: 'Opcional, e VAZIO É O ESTADO NORMAL. ⚠️ Uso de imagem de terceiro exige autorização por escrito.',
  },

  // ── Capítulos (a ordem do documento da campanha) ──────────────
  // A carta de abertura ganhou foto ao lado: "o formato ficou legal, mas
  // precisa ter espaço do lado pra foto".
  foto('abertura', 1, 'Quem é a Ana', '3/4', [600, 800], 'familia-1.webp',
    'Ana com a família', 'Vertical. A foto que acompanha a carta de abertura.'),
  foto('historia', 1, 'Uma história feita de trabalho', '4/5', [800, 1000], 'historia-farda.webp',
    'Ana de farda, com um cachorro, em serviço', 'Vertical. Ela de farda: é o capítulo em uma imagem.'),
  foto('historia', 2, 'Uma história feita de trabalho', '1/1', [700, 700], 'historia-selfie.webp',
    'Ana de farda, dentro da viatura'),
  foto('infancia', 1, 'Uma infância que ensinou o valor da comunidade', '3/4', [600, 800], 'infancia-cachorros.webp',
    'Foto antiga: Ana jovem com quatro cachorros', 'Fotos de papel. Endireite e recorte na borda antes de subir.'),
  foto('infancia', 2, 'Uma infância que ensinou o valor da comunidade', '3/4', [600, 800], 'infancia-gato.webp',
    'Foto antiga: Ana jovem com um gato no colo'),
  foto('infancia', 3, 'Uma infância que ensinou o valor da comunidade', '3/4', [600, 800], 'familia-1.webp',
    'Ana com a família'),
  foto('infancia', 4, 'Uma infância que ensinou o valor da comunidade', '3/4', [600, 800], 'familia-2.webp',
    'Dia de formatura, com a família'),
  foto('seguranca', 1, 'Uma policial que conhece a realidade', '4/3', [900, 675], 'seguranca-campo.webp',
    'Ana de farda, em campo', 'De farda, em serviço.'),
  foto('seguranca', 2, 'Uma policial que conhece a realidade', '4/3', [900, 675], 'seguranca-ibama.webp',
    'Ana em campo, ao lado do helicóptero do Ibama'),
  foto('seguranca', 3, 'Uma policial que conhece a realidade', '4/3', [900, 675], 'seguranca-treinamento.webp',
    'Treinamento de reanimação', '⚠️ Aparece um colega de farda: autorização de uso de imagem.'),
  // O manifesto ganhou foto ao lado: "poderia ter foto nessa seção com
  // espaço em branco muito visível". Ela de farda e colete, de rosto à
  // mostra: é "a pessoa dentro da farda".
  foto('ser-humano', 1, 'Policial também é ser humano', '4/5', [640, 800], 'ser-humano.webp',
    'Ana de farda e colete, dentro da viatura', 'Vertical. De farda, com o rosto à mostra.'),
  foto('linha-de-frente', 1, 'Valorizar quem está na linha de frente', '4/5', [800, 1000], 'linha-de-frente.webp',
    'Ana de farda, dentro da viatura'),
  foto('animal', 1, 'Defesa da causa animal', '1/1', [800, 800], 'animal-1.webp',
    'Ana com um filhote no colo'),
  foto('animal', 2, 'Defesa da causa animal', '3/4', [800, 1066], 'animal-2.webp',
    'Ana de farda camuflada, com um cachorro'),
  foto('animal', 3, 'Defesa da causa animal', '4/5', [800, 1000], 'animal-3.webp',
    'Ana com um cachorro no colo'),
  // "Por que a política?" é o capítulo em que a policial vira candidata, e
  // pediu foto como o anterior. É RECORTE (proporção livre, com fundo
  // transparente): o manifesto o encosta no pé da seção. O padrão é a
  // foto da capa, que está no git — `public/fotos/` não está, e um padrão
  // de lá quebraria na Vercel. Quando a campanha mandar outro retrato
  // recortado, troca no painel.
  {
    chave: 'capitulo.por-que.1',
    rotulo: 'Foto 1',
    onde: 'Por que a política?',
    proporcao: null,
    larguraMin: 1200,
    alturaMin: 1500,
    alpha: true,
    padrao: '/ana.png',
    padraoTamanho: [1302, 2128],
    padraoAlt: 'Ana Albuquerque, de camisa branca e óculos, com os braços cruzados',
    nota: 'PNG recortado, sem fundo, cortado na cintura — encosta no pé da seção. Sem imagem aqui, vale a foto da capa.',
  },

  // ── Gerador de filtro ──────────────────────────────────────────
  {
    chave: 'moldura.story',
    rotulo: 'Moldura de story',
    onde: 'Gerador de filtro',
    proporcao: '9/16',
    larguraMin: 1080,
    alturaMin: 1920,
    alpha: true,
    exata: true,
    balde: 'molduras',
    nota: 'PNG 1080×1920 com transparência no miolo. ⚠️ Exigência legal: o CNPJ da campanha precisa estar legível na arte.',
    padrao: '/molduras/story-apoio.svg',
  },
  {
    chave: 'moldura.perfil',
    rotulo: 'Moldura de perfil',
    onde: 'Gerador de filtro',
    proporcao: '1/1',
    larguraMin: 1080,
    alturaMin: 1080,
    alpha: true,
    exata: true,
    balde: 'molduras',
    nota: 'PNG 1080×1080 com transparência no miolo. ⚠️ CNPJ obrigatório na arte.',
    padrao: '/molduras/perfil-apoio.svg',
  },

  // ── Os apoiadores de exemplo ───────────────────────────────────
  // As fotos que giram DENTRO das duas molduras, na seção do site que
  // convida a usar o filtro.
  //
  // ⚠️ SÃO PARES, E O PAR É A UNIDADE. Cada apoiador tem as duas fotos,
  //    story e perfil, e as duas molduras trocam JUNTAS. Par incompleto
  //    simplesmente não entra na roda — ver `resolverExemplos` em
  //    lib/molduras.ts.
  //
  // ⚠️ MÍNIMOS BAIXOS DE PROPÓSITO. Estas fotos aparecem com menos de
  //    300px de largura na tela, e muitas chegam por WhatsApp, já
  //    comprimidas.
  ...Array.from({ length: 6 }, (_, i) => [
    {
      chave: `filtro.exemplo.${i + 1}.story`,
      rotulo: `Apoiador ${i + 1} · story`,
      onde: 'Gerador de filtro',
      proporcao: '9/16',
      larguraMin: 540,
      alturaMin: 960,
      nota:
        i === 0
          ? 'De três a seis apoiadores, cada um com as DUAS fotos. Rosto no terço de cima: a moldura escurece a metade de baixo. Peça autorização antes de subir a foto de alguém.'
          : undefined,
    },
    {
      chave: `filtro.exemplo.${i + 1}.perfil`,
      rotulo: `Apoiador ${i + 1} · perfil`,
      onde: 'Gerador de filtro',
      proporcao: '1/1',
      larguraMin: 540,
      alturaMin: 540,
      nota:
        i === 0
          ? 'A mesma pessoa da foto de story ao lado, enquadrada em quadrado. Sem as duas, o apoiador não entra na roda.'
          : undefined,
    },
  ]).flat(),
]

export const SLOTS_POR_CHAVE: Record<string, Slot> = Object.fromEntries(
  SLOTS.map((s) => [s.chave, s]),
)

/**
 * DE QUAL SEÇÃO DO PAINEL CADA ESPAÇO FAZ PARTE.
 *
 * O painel é organizado por SEÇÃO — porque é assim que quem edita
 * pensa: "quero mexer na primeira dobra", e não "quero mexer numa
 * imagem". Para juntar texto, imagem e vídeo na mesma tela, cada
 * espaço precisa dizer a que seção pertence.
 *
 * ⚠️ POR PREFIXO, e não um campo em cada objeto. A chave do espaço já
 *    carrega a informação (`capitulo.historia.1` é de `capitulos`). As
 *    exceções estão declaradas primeiro, pela chave inteira: a marca e o
 *    ícone não pertencem a nenhuma seção da página — aparecem em todas.
 */
const SECAO_DO_ESPACO: Record<string, string> = {
  'marca.simbolo': 'candidato',
  // ANA: o logotipo e as duas marcas com o 7766 estavam sem seção, e o
  // painel só mostra espaço de imagem dentro de uma seção — o site usava
  // as três (cabeçalho, rodapé, primeira dobra, assinatura) e o painel não
  // oferecia onde trocá-las. Ficam na Identidade, junto do símbolo.
  'marca.logotipo': 'candidato',
  'marca.lockup': 'candidato',
  'marca.lockupDeitado': 'candidato',
  'marca.favicon': 'meta',
  'marca.cartaoLink': 'meta',
  hero: 'hero',
  capitulo: 'capitulos',
  moldura: 'filtro',
  filtro: 'filtro',
}

export function secaoDoEspaco(chave: string): string | null {
  return SECAO_DO_ESPACO[chave] ?? SECAO_DO_ESPACO[chave.split('.')[0]] ?? null
}

/** Agrupados pela seção do painel a que pertencem. */
export const SLOTS_POR_SECAO = SLOTS.reduce<Record<string, Slot[]>>((acc, s) => {
  const secao = secaoDoEspaco(s.chave)
  if (secao) (acc[secao] ??= []).push(s)
  return acc
}, {})

/** Agrupados por seção da página, para a galeria do painel. */
export const SLOTS_POR_ONDE = SLOTS.reduce<Record<string, Slot[]>>((acc, s) => {
  ;(acc[s.onde] ??= []).push(s)
  return acc
}, {})

/**
 * O tamanho que o recortador deve produzir para um slot.
 *
 * Regra: nunca abaixo do mínimo (senão o servidor recusa) e nunca
 * acima de 2400 (o servidor reduz para lá de qualquer jeito, e subir
 * pixel que será jogado fora só custa dados do celular de quem edita).
 * Entre os dois, manda a resolução real da área escolhida.
 */
export const TETO_RECORTE = 2400

export function tamanhoDeSaida(
  slot: Slot,
  larguraDaArea: number,
  alturaDaArea: number,
): { largura: number; altura: number; ampliando: boolean } {
  if (slot.exata) {
    return {
      largura: slot.larguraMin,
      altura: slot.alturaMin,
      ampliando: larguraDaArea < slot.larguraMin,
    }
  }

  const escalaMinima = Math.max(
    slot.larguraMin / larguraDaArea,
    slot.alturaMin / alturaDaArea,
    // Área menor que o mínimo: amplia até caber. Ampliar é ruim, e a
    // tela avisa — mas é melhor que barrar a única foto que existe.
  )
  const escalaTeto = TETO_RECORTE / Math.max(larguraDaArea, alturaDaArea)
  const escala = escalaMinima > 1 ? escalaMinima : Math.min(1, escalaTeto)

  return {
    largura: Math.max(slot.larguraMin, Math.round(larguraDaArea * escala)),
    altura: Math.max(slot.alturaMin, Math.round(alturaDaArea * escala)),
    ampliando: escalaMinima > 1,
  }
}
