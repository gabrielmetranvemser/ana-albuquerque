/**
 * ███████████████████████████████████████████████████████████████
 * ██  A CAMPANHA. O ÚNICO ARQUIVO QUE TODA CAMPANHA PRECISA     ██
 * ██  EDITAR PARA O SITE PASSAR A SER DE OUTRA PESSOA.          ██
 * ███████████████████████████████████████████████████████████████
 *
 * Quem lê este arquivo: `content/copy.ts` (os textos), `app/layout.tsx`
 * (cores e metadados), `lib/config.ts`, o gerador de molduras e o
 * gerador de estado. Nenhum componente lê daqui direto — eles leem do
 * conteúdo mesclado, que nasce daqui e é sobrescrito pelo painel.
 *
 * ⚠️ REGRA DE OURO DESTE PROJETO
 *    Nada aqui é lei. Tudo o que está neste arquivo vira o PADRÃO DE
 *    FÁBRICA do site — e o painel (/painel) sobrescreve por cima, sem
 *    deploy. Este arquivo é o estado inicial; o banco é a verdade
 *    corrente. Se o banco estiver vazio, o site é exatamente isto.
 *
 * ⚠️ O QUE **NÃO** MORA AQUI
 *    · Senhas, chaves e tokens → `.env.local`
 *    · CNPJ, comitê, coligação → painel ▸ Identidade ▸ Rodapé
 *      (dado legal errado em campanha não pode esperar deploy)
 *    · Links dos grupos de WhatsApp → banco (tabela `grupos`)
 *
 * Ordem de personalização recomendada: ver PERSONALIZAR.md.
 */

/** Feminino muda concordância em ~20 frases do site. Não é enfeite. */
export type Genero = 'f' | 'm'

/**
 * ESTADUAL = a página divide o eleitorado por MUNICÍPIO (deputado
 * estadual/federal, senador, governador). É o modo com mapa.
 *
 * MUNICIPAL = a página divide por BAIRRO/ZONA (vereador, prefeito).
 * O mapa some sozinho — não existe malha oficial de bairro no IBGE —
 * e a busca passa a procurar bairro. Ver PERSONALIZAR.md ▸ campanha
 * municipal.
 */
export type Escopo = 'estadual' | 'municipal'

export const campanha = {
  // ═══════════════════════════════════════════════════════════════
  // 1 · QUEM É
  // ═══════════════════════════════════════════════════════════════

  /** Como a pessoa é conhecida. É o que aparece no cabeçalho. */
  nome: 'Ana Albuquerque',

  /** Usado nas frases em que o nome inteiro fica longo demais. */
  primeiroNome: 'Ana',

  /**
   * O nome que vai na urna, como registrado no TSE.
   *
   * ⚠️ AQUI VAI O NOME COMPLETO DO REGISTRO, porque é ele que o rodapé
   *    legal usa — e é assim que a própria campanha assina toda peça.
   *    Lido do rodapé legal dos posts oficiais e confirmado com a
   *    coordenação em 14/09/2026.
   */
  nomeUrna: 'ANA LIDIA SOARES DE ALBUQUERQUE',

  /** O número da urna. String, não número: '045' tem zero à esquerda. */
  numero: '7766',

  /** Sem o artigo. Ex.: 'Deputado Federal', 'Vereadora', 'Prefeito'. */
  cargo: 'Deputada Federal',

  /**
   * Decide "candidato/candidata", "eleito/eleita", "pronto/pronta" em
   * todo texto de fábrica. Trocar aqui reescreve as concordâncias.
   */
  genero: 'f' as Genero,

  /**
   * Sigla do partido, como no santinho.
   *
   * ⚠️ SEM ABREVIAR: a sigla é SOLIDARIEDADE, e é assim que os posts da
   *    campanha a escrevem ("77-SOLIDARIEDADE"). Ela passa dos 10
   *    caracteres que o painel aceitava para sigla; o limite subiu para
   *    15 em content/esquema.ts, senão salvar a Identidade no painel
   *    recusaria a sigla verdadeira.
   */
  partido: 'SOLIDARIEDADE',
  partidoExtenso: 'Solidariedade',
  /** O número do partido — os dois primeiros dígitos do número da urna. */
  partidoNumero: '77',

  // ═══════════════════════════════════════════════════════════════
  // 2 · ONDE
  // ═══════════════════════════════════════════════════════════════

  /**
   * ESTADUAL põe o mapa e os municípios no ar. MUNICIPAL troca
   * município por bairro e esconde o mapa.
   */
  escopo: 'estadual' as Escopo,

  /**
   * Sigla da UF.
   *
   * ⚠️ PARA A ANA, RONDÔNIA É A CAMPANHA, e não o exemplo: ela é
   *    candidata justamente por RO. Os arquivos de `data/` e o
   *    `sql/02` que vieram do modelo já eram de Rondônia e foram
   *    conferidos em vez de regerados — 52 municípios.
   *
   * ⚠️ O MODELO VEM COM RONDÔNIA DE EXEMPLO — é o estado com menos
   *    municípios (52), então o mapa que acompanha o repositório é
   *    leve e a página abre pronta na primeira execução. Não tem nada
   *    a ver com a campanha: troque a sigla e rode
   *
   *        npm run uf -- SP
   *
   *    para reescrever `data/municipios.json`, `data/mapa.json`,
   *    `data/grupos.local.json` e `sql/02-seed-municipios.sql` de uma
   *    vez. Funciona para as 27 UFs.
   */
  uf: 'RO',
  estado: 'Rondônia',
  /** Código do IBGE da UF. A tabela das 27 está em scripts/ufs.mjs. */
  ufCodigoIbge: 11,

  /**
   * A cidade da pessoa. Aparece em "Vereadora em ___".
   *
   * Vazio para a Ana: o documento da campanha não diz, e cidade não se
   * deduz de foto. Hoje só a seção de provas lê este campo — e ela está
   * desligada.
   */
  cidadeBase: '',

  /**
   * Como a página chama cada pedaço do território. Em campanha
   * estadual é município; em municipal, bairro. Trocar aqui troca em
   * toda a página, incluindo o painel.
   */
  regiao: {
    singular: 'município',
    plural: 'municípios',
    /** Com artigo, para caber em frase: "o município", "os municípios". */
    artigoSingular: 'o',
    /** O que a pessoa digita na busca: 'cidade' ou 'bairro'. */
    rotuloBusca: 'cidade',
  },

  // ═══════════════════════════════════════════════════════════════
  // 3 · CANAIS
  // ═══════════════════════════════════════════════════════════════

  /** Vazio = o link some do rodapé. Não deixa link quebrado no ar. */
  instagram: 'https://www.instagram.com/ana_albuquerque7766/',
  instagramHandle: '@ana_albuquerque7766',
  /** Formato wa.me/55DDDNÚMERO. Vazio esconde o botão. */
  whatsapp: '',
  facebook: '',
  youtube: '',
  tiktok: '',

  // ═══════════════════════════════════════════════════════════════
  // 4 · A ELEIÇÃO
  // ═══════════════════════════════════════════════════════════════

  eleicao: {
    ano: 2026,
    /** Como aparece escrito na chamada final. */
    dataVotacao: '4 de outubro de 2026',
    /**
     * ⚠️ O silêncio eleitoral REAL é lido de
     *    NEXT_PUBLIC_SILENCIO_ELEITORAL_EM (.env.local). Isto aqui é
     *    só o padrão de quem esqueceu de preencher — e o certo é
     *    preencher, porque tirar CTA do ar na hora certa não pode
     *    depender de alguém lembrar num domingo de manhã.
     */
    silencioPadraoUtc: '2026-10-03T04:00:00.000Z',
  },

  // ═══════════════════════════════════════════════════════════════
  // 5 · AS CORES
  //
  // Cinco hex e a página inteira muda de partido.
  //
  // ⚠️ OS NOMES SÃO PAPÉIS, NÃO CORES. `azul` é a cor primária;
  //    `verde`, a secundária; `amarelo`, a cor de AÇÃO. Uma campanha
  //    vermelha põe vermelho em `azul` e a página fica vermelha —
  //    os nomes ficam estranhos no CSS e nada mais acontece. Renomear
  //    as variáveis obrigaria a mexer em ~400 classes de utilitário
  //    espalhadas pelos componentes, o que é troca cara por um ganho
  //    cosmético.
  //
  // ⚠️ REGRA QUE NÃO SE NEGOCIA: a cor de AÇÃO nunca é texto sobre
  //    fundo claro. Ela é o que aponta o botão. Se a sua cor de ação
  //    for escura, inverta `acaoTexto` para branco.
  //
  // Estes valores são injetados como variáveis CSS em `app/layout.tsx`
  // e vencem os padrões de `app/globals.css` — o arquivo CSS não
  // precisa ser tocado.
  // ═══════════════════════════════════════════════════════════════

  // ⚠️ DE ONDE VEIO A PALETA DA ANA (14/09/2026). Não foi escolhida,
  //    foi medida: o azul-marinho é o do logotipo (#102084 no PNG
  //    oficial), o laranja é o do "7766" da arte de número — o laranja
  //    do Solidariedade — e o amarelo é o da bandeira dentro do escudo.
  //    A campanha pediu azul, laranja e as cores do Brasil.
  //
  // ⚠️ O LARANJA VIROU A COR DE AÇÃO (14/09/2026, quarta rodada). Na
  //    primeira paleta a ação era o amarelo da bandeira, e o laranja
  //    ficava na secundária num tom QUEIMADO (#d4540e), escolhido para
  //    aguentar letra branca. A campanha: "sinto falta bastante do
  //    laranja — não esse degradê horroso e escuro, um laranja mais
  //    claro, mais vivo, da cor da logo". O claro foi medido na arte
  //    laranja (#fb7f3d a #ff8a46 no "Ana"); `acao` é o meio dos dois.
  //
  //    O que isso obriga, e por quê:
  //    · em cima dele a letra é MARINHO (5,5:1). Branco dá 2,5:1;
  //    · sobre o azul da marca ele só serve em TÍTULO (3,2:1 — texto
  //      grande pede 3:1). Sobre o marinho, em qualquer tamanho;
  //    · a SECUNDÁRIA continua laranja, mas escura o bastante para texto
  //      PEQUENO sobre a areia de /filtro (4,7:1), o branco (5,8:1) e
  //      para letra branca em cima (5,8:1): é o laranja dos avisos e selos
  //      de /grupos e /filtro. Com #c4500f o aviso "Sua foto nunca sai do
  //      seu aparelho" dava 3,8:1 na areia. Superfície grande em laranja
  //      é `bg-laranja`, que lê a ação — nunca a secundária;
  //    · o amarelo saiu da página: ficou no escudo do logotipo, que é
  //      imagem, e na fita da carta (`fita-crepe`, globals.css).
  cores: {
    /** Superfície escura: primeira dobra, chamada final, rodapé. */
    primariaEscura: '#102084',
    /** A cor de marca. */
    primaria: '#1f45c4',
    /** Superfície escura alternativa. */
    secundariaEscura: '#8a3608',
    /** Laranja de TEXTO e de selo com letra branca. Superfície é `acao`. */
    secundaria: '#ad450b',
    /** AÇÃO: botões, realce de título, a faixa e a chamada final. */
    acao: '#fd8440',
    /** Texto que fica em cima da cor de ação. */
    acaoTexto: '#102084',
    /** O fim do gradiente da primeira dobra. Mais escuro que a primária. */
    noite: '#0a1452',
  },

  // ═══════════════════════════════════════════════════════════════
  // 6 · CHAVES TÉCNICAS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Identificador curto da campanha, em minúsculas e sem acento.
   *
   * Batiza o cookie da sessão do painel, a chave de sessão no
   * navegador e o nome dos arquivos que o visitante baixa
   * (`joao-1234-story.jpg`). Trocar depois de o site estar no ar
   * desloga quem estiver no painel — e nada mais.
   */
  slug: 'ana-albuquerque',
} as const

// ═══════════════════════════════════════════════════════════════
// DERIVADOS — não editar. Existem para as frases concordarem.
// ═══════════════════════════════════════════════════════════════

const f = campanha.genero === 'f'

export const g = {
  /** candidato · candidata */
  candidato: f ? 'candidata' : 'candidato',
  /** Candidato · Candidata — início de frase. */
  Candidato: f ? 'Candidata' : 'Candidato',
  /** o · a */
  o: f ? 'a' : 'o',
  /** do · da */
  do: f ? 'da' : 'do',
  /** ele · ela */
  ele: f ? 'ela' : 'ele',
  /** eleito · eleita */
  eleito: f ? 'eleita' : 'eleito',
  /** pronto · pronta */
  pronto: f ? 'pronta' : 'pronto',
  /** Ele mesmo · Ela mesma */
  mesmo: f ? 'mesma' : 'mesmo',
} as const

/** 'Fulano 1234' — o nome como a campanha o escreve em peça. */
export const nomeComNumero = campanha.nome.includes(campanha.numero)
  ? campanha.nome
  : `${campanha.nome} ${campanha.numero}`

/** 'município'/'bairro' já resolvido pelo escopo. */
export const REGIAO = campanha.regiao

/** O mapa só existe em campanha estadual: não há malha de bairro. */
export const TEM_MAPA = campanha.escopo === 'estadual'

/**
 * O nome do cookie de sessão do painel.
 *
 * ⚠️ MORA AQUI PORQUE TEM DOIS DONOS, e os dois precisam concordar:
 *    `lib/painel/sessao.ts` (Node) escreve o cookie e `middleware.ts`
 *    (Edge) o confere. O middleware não pode importar a lib — lá não
 *    existem `node:crypto` nem `next/headers` —, então a constante
 *    tinha de sair de um arquivo que os dois runtimes carreguem.
 *    Este arquivo é objeto puro: carrega em qualquer um.
 *
 *    Duas cópias divergiriam na primeira troca de campanha, e a
 *    divergência aparece do pior jeito possível: o login aceita a
 *    senha, grava o cookie, e o middleware devolve a pessoa para a
 *    tela de entrar — sem erro nenhum na tela.
 */
export const COOKIE_PAINEL = `${campanha.slug}_painel`
