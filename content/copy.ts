/**
 * COPY DA CAMPANHA — o texto de fábrica, num arquivo só.
 *
 * Tudo que é texto vive aqui. Nenhum componente escreve frase solta.
 * É o que este projeto chama de separar "motor" de "maquiagem": o
 * motor (`lib/`, `app/painel/`, `app/g/`) se repete em qualquer
 * campanha; a maquiagem é este arquivo, `content/campanha.ts` e as
 * cinco cores.
 *
 * ⚠️ ISTO É O ESTADO INICIAL, NÃO O SITE NO AR
 *    O banco guarda só o que a campanha editou, e `lib/conteudo`
 *    mescla um sobre o outro. Com o banco vazio, o site é exatamente
 *    o que está escrito aqui. Ao apagar a linha de uma seção no
 *    banco, ela volta para cá. Por isso nada disto é semeado por
 *    migration: semear congelaria a copy no dia do deploy.
 *
 * ⚠️ TEXTO DE FÁBRICA NÃO SE PUBLICA
 *    Todo bloco abaixo marcado com  // ✍️ ESCREVER  está com texto
 *    genérico, escrito para o site ficar de pé e mostrar a forma — não
 *    para ir ao ar. O painel sabe disso: a tela Início lista quais
 *    seções ainda estão no texto de fábrica, comparando o banco com
 *    este arquivo. Publicar com a lista cheia é publicar um modelo.
 *
 * ⚠️ SOBRE OS CAMPOS `id`
 *    Toda lista de OBJETO carrega um `id` estável. Não é enfeite: as
 *    chaves de React vinham do próprio conteúdo (`key={item.numero}`),
 *    e no dia em que alguém digitar "01" duas vezes no painel o React
 *    embaralha ou some com itens. O `id` nunca é exibido.
 *
 *    Listas de STRING não têm `id` de propósito — string não tem
 *    identidade, e ali a chave por índice é a correta.
 */

import { campanha, g, nomeComNumero, REGIAO } from './campanha'

/**
 * O vídeo vazio.
 *
 * Todo espaço de vídeo nasce sem endereço, e um espaço sem endereço
 * não desenha nada — nem moldura, nem "em breve". A campanha cola o
 * link no painel e o bloco aparece. Enquanto não colar, a seção fica
 * exatamente como se o vídeo não existisse no desenho.
 */
const VIDEO = {
  titulo: '',
  url: '',
  formato: 'deitado',
  opcoes: {
    controles: true,
    inicio: 'clique',
    telaCheia: true,
    carregamento: 'ao-clicar',
    botaoRotulo: '',
    botaoDestino: '',
  },
} as const

// ═══════════════════════════════════════════════════════════════
// QUEM É — espelha content/campanha.ts.
//
// Existe como seção de conteúdo (e não só como import) porque o
// painel edita estes campos: trocar o handle do Instagram em campanha
// não pode exigir deploy. `content/campanha.ts` é o valor inicial.
// ═══════════════════════════════════════════════════════════════
export const candidato = {
  nome: campanha.nome,
  numero: campanha.numero,
  cargo: campanha.cargo,
  estado: campanha.estado,
  uf: campanha.uf,
  partido: campanha.partido,
  partidoExtenso: campanha.partidoExtenso,
  instagram: campanha.instagram,
  instagramHandle: campanha.instagramHandle,
  whatsapp: campanha.whatsapp,
} as const

export const meta = {
  titulo: `${nomeComNumero} — ${campanha.cargo} por ${campanha.estado}`,
  tituloCurto: nomeComNumero,
  // Esta frase é o que o Google mostra embaixo do título. Ela precisa
  // dizer nome, número, cargo e o que a pessoa ganha ao clicar. Máximo
  // ~155 caracteres úteis. Para a Ana, "policial militar, psicóloga e
  // mãe" é a abertura do documento da campanha — é o que a diferencia
  // numa lista de resultados cheia de nomes.
  //
  // `partidoExtenso` e não `partido`: a sigla é SOLIDARIEDADE, e em
  // caixa alta no meio da frase ela grita.
  descricao:
    `${campanha.nome} ${campanha.numero}: policial militar, psicóloga e mãe, ${g.candidato} a ` +
    `${campanha.cargo} por ${campanha.estado} pelo ${campanha.partidoExtenso}. ` +
    `Entre no grupo de WhatsApp da sua ${REGIAO.rotuloBusca}.`,
  palavrasChave: [
    campanha.nome,
    nomeComNumero,
    campanha.numero,
    `${campanha.cargo} ${campanha.estado}`,
    `${campanha.partidoExtenso} ${campanha.uf}`,
    `eleições ${campanha.eleicao.ano} ${campanha.estado}`,
    `${campanha.nome} policial militar`,
  ],
  og: {
    titulo: `${campanha.nome.toUpperCase()} · ${campanha.numero}`,
    subtitulo: `${campanha.cargo} por ${campanha.estado}`,
    // A frase que aparece no cartão do WhatsApp: o lema que assina o
    // documento da campanha.
    chamada: 'Trabalho, coragem e cuidado.',
  },
  /**
   * O código do Google Search Console.
   *
   * ⚠️ VAZIO É O ESTADO NORMAL. Ele só é preenchido se a verificação
   *    de propriedade for feita pela meta tag; quem verificar pelo DNS
   *    (o caminho recomendado, porque vale para o domínio inteiro e
   *    não se perde numa republicação) deixa isto em branco para
   *    sempre — e o site não emite tag nenhuma.
   *
   * Não é segredo: a tag fica visível no HTML de qualquer visitante.
   * Ela não dá acesso a nada — só prova ao Google que quem a colocou
   * ali manda no site. Preenchido em Painel ▸ Buscas.
   */
  verificacaoGoogle: '',
} as const

/**
 * Metadata por página. Fica aqui, e não hardcoded em cada
 * `export const metadata`, porque mudar o título de uma aba não pode
 * custar um deploy.
 */
export const paginas = {
  filtro: {
    tituloAba: `Coloque o ${campanha.numero} na sua foto`,
    descricao:
      'Gere sua foto de perfil e seu story com a moldura da campanha. ' +
      'Sem cadastro. Sua foto não sai do seu aparelho.',
    ogTitulo: `Coloque o ${campanha.numero} na sua foto · ${campanha.nome}`,
    ogDescricao: 'Sem cadastro. Sua foto não sai do seu aparelho.',
  },
  grupos: {
    tituloAba: `Grupos de WhatsApp por ${REGIAO.singular}`,
    descricao:
      `Encontre o grupo de WhatsApp da campanha na sua ${REGIAO.rotuloBusca}. ` +
      `Um grupo para cada ${REGIAO.singular}.`,
    ogTitulo: `Grupos de WhatsApp · ${nomeComNumero}`,
    ogDescricao: `Um grupo para cada ${REGIAO.singular}.`,
  },
  privacidade: {
    tituloAba: 'Política de Privacidade',
    descricao:
      'Como esta página trata (e não trata) seus dados: a foto do filtro não sai do seu aparelho ' +
      'e a localização é usada no aparelho e descartada.',
    ogTitulo: `Política de Privacidade · ${nomeComNumero}`,
    ogDescricao: 'A foto do filtro não sai do seu aparelho.',
  },
} as const

// Objeto, e não array solto: toda seção do CMS precisa ser objeto
// (a constraint `jsonb_typeof(dados) = 'object'` existe para impedir
// que uma ação forjada grave um tipo inesperado).
//
// ANA: são os nove itens da "sugestão de menu" do documento, na ordem
// dele. Todos aparecem no menu aberto; `noTopo` escolhe os poucos que
// cabem na barra do desktop — nove itens em linha viram letra miúda, e
// a barra deixa de ser lida.
export const navegacao = {
  itens: [
    { id: 'nav-01', rotulo: 'Início', href: '/#inicio', noTopo: false },
    { id: 'nav-02', rotulo: 'Minha história', href: '/#minha-historia', noTopo: true },
    { id: 'nav-03', rotulo: 'Minhas causas', href: '/#causas', noTopo: true },
    { id: 'nav-04', rotulo: 'O que levarei para Brasília', href: '/#propostas', noTopo: true },
    { id: 'nav-05', rotulo: 'Ana na segurança pública', href: '/#seguranca', noTopo: false },
    { id: 'nav-06', rotulo: 'Mãe e defensora da inclusão', href: '/#inclusao', noTopo: false },
    { id: 'nav-07', rotulo: 'Causa animal', href: '/#causa-animal', noTopo: false },
    { id: 'nav-08', rotulo: 'Acompanhe a Ana', href: '/#acompanhe', noTopo: true },
    { id: 'nav-09', rotulo: campanha.numero, href: '/filtro', noTopo: false },
  ],
} as const

export const ctas = {
  grupo: `Entrar no grupo da minha ${REGIAO.rotuloBusca}`,
  grupoCurto: 'Entrar no grupo',
  filtro: `Colocar o ${campanha.numero} na minha foto`,
  filtroCurto: `Colocar o ${campanha.numero}`,
  compartilhar: 'Compartilhar esta página',
  instagram: 'Seguir no Instagram',
  // Texto exibido no lugar dos CTAs a partir do silêncio eleitoral.
  silencio:
    'Período de silêncio eleitoral. Os canais de campanha estão suspensos até o fim da votação.',
} as const

// ─────────────────────────────────────────────────────────────
// 1. HERO — a primeira dobra
//
// ✍️ ESCREVER, e escrever primeiro. É a única seção que TODO
//    visitante vê. O título é uma frase de duas linhas: a segunda vem
//    entre [[colchetes duplos]] e sai realçada na cor de ação.
//
//    Regra que vale para toda a página: a frase é de quem fala, na
//    primeira pessoa. "Eu fiz", não "ele fez".
// ─────────────────────────────────────────────────────────────
//
// ✍️ ANA — escrito a partir do documento da campanha ("TEXTO SITE ANA
//    ALBUQUERQUE 7766"). O documento é em terceira pessoa; a página
//    passou para a primeira, que é a regra deste projeto. Nenhum fato
//    foi acrescentado: o que não está no documento não está aqui.
export const hero = {
  // As três primeiras linhas do documento, na ordem dele.
  etiqueta: `${campanha.cargo} por ${campanha.estado}`,
  titulo: ['Uma vida de trabalho.', 'Uma história de coragem.', '[[Compromisso com pessoas.]]'],
  subtitulo: 'Sou policial militar, psicóloga, mãe e defensora de causas que conheço de perto.',
  numeroLegenda: `Escreva ${campanha.numero} na urna`,
  /**
   * A assinatura da arte oficial, abaixo do número. Apagar aqui tira
   * ela da página — não quebra nada.
   */
  lema: 'Trabalho, coragem e cuidado',
  ctaPrimario: ctas.grupo,
  ctaSecundario: 'Conhecer minha história',
  ctaSecundarioHref: '#minha-historia',
  rodapeHero: `${g.Candidato} a ${campanha.cargo} por ${campanha.estado}.`,
} as const

// ─────────────────────────────────────────────────────────────
// CAPÍTULOS — a página da Ana, na ordem do documento da campanha
//
// ⚠️ POR QUE UMA LISTA, E NÃO UMA SEÇÃO POR BLOCO. O documento tem doze
//    blocos de história e causa, e a campanha pediu a página "exatamente
//    na ordem do doc". As seções do modelo (origem, álbum, rua,
//    problema, bandeiras, cena) obrigavam o texto a caber em formas
//    pensadas para outra pessoa — foi o que deixou a página "100% igual
//    ao template". Como lista, cada bloco é um capítulo com o mesmo
//    conjunto de campos, o painel reordena e acrescenta sem deploy, e o
//    `layout` escolhe a forma que o texto pede.
//
// ⚠️ TODO CAPÍTULO TEM TODOS OS CAMPOS, mesmo vazios. Campo ausente num
//    item e presente em outro vira união de tipos, e o componente
//    passaria a checar existência campo por campo. Vazio esconde.
//
// A ordem dos campos na tela é sempre a mesma, e é a ordem em que o
// documento os usa: título, primeiro parágrafo, citação, demais
// parágrafos, marcos, lista, fecho.
//
// ✍️ Texto do documento, passado para a primeira pessoa (regra do
//    projeto). Nenhum fato acrescentado.
// ─────────────────────────────────────────────────────────────
export interface Capitulo {
  /** Estável: batiza os espaços de foto (`capitulo.<id>.<n>`). */
  id: string
  /** O endereço na página (`/#ancora`). É para onde o menu aponta. */
  ancora: string
  layout: 'carta' | 'foto' | 'album' | 'indice' | 'fotos' | 'manifesto' | 'destaque' | 'lista' | 'bandeira'
  fundo: 'papel' | 'areia' | 'branco' | 'azul' | 'marinho' | 'laranja'
  /** De que lado fica a foto, nos layouts que têm foto ao lado. */
  lado: 'esquerda' | 'direita'
  /** O título em caixa alta do documento. */
  etiqueta: string
  titulo: string
  citacao: string
  paragrafos: string[]
  lista: string[]
  fecho: string
  marcos: { id: string; ano: string; texto: string }[]
  atalhos: { id: string; rotulo: string; href: string }[]
}

function capitulo(
  c: Pick<Capitulo, 'id' | 'ancora' | 'layout' | 'etiqueta' | 'titulo'> & Partial<Capitulo>,
): Capitulo {
  return {
    fundo: 'papel',
    lado: 'direita',
    citacao: '',
    paragrafos: [],
    lista: [],
    fecho: '',
    marcos: [],
    atalhos: [],
    ...c,
  }
}

export const capitulos: { itens: Capitulo[] } = {
  itens: [
    capitulo({
      id: 'abertura',
      ancora: 'quem-e',
      layout: 'carta',
      fundo: 'papel',
      etiqueta: `Quem é ${g.o} ${campanha.primeiroNome}`,
      titulo: 'Minha história começou [[muito antes da política.]]',
      paragrafos: [
        'Sou filha de um homem que veio do Nordeste para Rondônia como soldado da borracha e depois ' +
          'se tornou comerciante. Cresci aprendendo, desde cedo, o valor do trabalho.',
        'Ainda criança, acompanhava meu pai no comércio. Depois, comecei a trabalhar fora muito cedo. ' +
          'Foi assim que construí quem eu sou: com disciplina, responsabilidade, coragem e disposição ' +
          'para enfrentar desafios.',
        'Hoje, depois de décadas dedicadas à segurança pública, coloco meu nome à disposição para uma ' +
          'nova missão: levar para Brasília a experiência de quem vive os problemas de verdade — e ' +
          'transformar essa experiência em propostas.',
      ],
      fecho: campanha.nome,
    }),
    capitulo({
      id: 'historia',
      ancora: 'minha-historia',
      layout: 'foto',
      fundo: 'branco',
      lado: 'direita',
      etiqueta: 'Uma história feita de trabalho',
      titulo: 'Antes da política, [[veio o trabalho.]]',
      paragrafos: [
        'Comecei minha trajetória profissional muito cedo. Entrei na universidade e cursei dois anos de ' +
          'Direito antes de prestar concurso para a Polícia Militar. Depois, fiz Psicologia na ' +
          'Universidade Federal e tive experiência na área, inclusive na Secretaria de Segurança ' +
          'Pública. Mas, mesmo com outra formação, permaneci na Polícia Militar. Porque, como eu mesma digo:',
        'Poderia ter escolhido outro caminho. Não escolhi. Permaneci na segurança pública porque ' +
          'entendi que aquela era a minha missão.',
      ],
      citacao: 'A policialidade sempre foi o que teve de mais forte dentro do meu coração.',
      marcos: [
        { id: 'marco-01', ano: '1995', texto: 'Concurso para a Polícia Militar' },
        { id: 'marco-02', ano: '1998', texto: 'Entrada na Polícia Militar' },
        { id: 'marco-03', ano: '2000', texto: 'Psicologia na Universidade Federal' },
      ],
    }),
    capitulo({
      id: 'infancia',
      ancora: 'infancia',
      layout: 'album',
      fundo: 'areia',
      etiqueta: 'Uma infância que ensinou o valor da comunidade',
      titulo: '[[Todas as mães eram mães de todo mundo.]]',
      paragrafos: [
        'Cresci numa época em que as crianças brincavam na rua, caminhavam até o cinema, entravam na ' +
          'casa dos amigos e tinham liberdade para viver a infância. As casas permaneciam abertas. Os ' +
          'vizinhos cuidavam uns dos outros.',
        'Essa memória me marcou. E despertou uma preocupação que hoje está entre as minhas causas: o ' +
          'desenvolvimento saudável de crianças e adolescentes. A infância não deveria ser substituída ' +
          'pelo isolamento, pela violência ou pelo excesso de tecnologia.',
      ],
      lista: [
        'Criança precisa de proteção.',
        'Precisa de convivência.',
        'Precisa brincar.',
        'Precisa ter condições de viver cada fase da vida.',
      ],
    }),
    // O índice das causas não é um bloco do documento: é a porta do
    // item "Minhas causas" do menu, que o documento sugere. Ele não
    // reordena nada — só aponta para os três capítulos que vêm depois.
    capitulo({
      id: 'causas',
      ancora: 'causas',
      layout: 'indice',
      fundo: 'azul',
      etiqueta: 'Minhas causas',
      titulo: 'Causas que eu [[conheço de perto.]]',
      atalhos: [
        { id: 'atalho-01', rotulo: 'Segurança pública', href: '#seguranca' },
        { id: 'atalho-02', rotulo: 'Mãe e defensora da inclusão', href: '#inclusao' },
        { id: 'atalho-03', rotulo: 'Causa animal', href: '#causa-animal' },
      ],
    }),
    capitulo({
      id: 'seguranca',
      ancora: 'seguranca',
      layout: 'fotos',
      fundo: 'marinho',
      etiqueta: 'Uma policial que conhece a realidade',
      titulo: '[[Eu queria proteger as pessoas.]]',
      paragrafos: [
        'Foi essa vontade que me levou para a Polícia Militar. No começo, havia o sonho de vestir a ' +
          'farda, proteger pessoas e fazer a diferença.',
      ],
      lista: [
        'Depois veio a realidade.',
        'Os obstáculos.',
        'As limitações.',
        'As dificuldades de quem está na linha de frente.',
      ],
      fecho:
        'E foi vivendo essa realidade que percebi: proteger a população também passa por cuidar de ' +
        'quem está todos os dias nas ruas para protegê-la.',
    }),
    capitulo({
      id: 'ser-humano',
      ancora: 'saude-mental',
      layout: 'manifesto',
      fundo: 'papel',
      etiqueta: 'Policial também é ser humano',
      titulo: 'A farda transmite força. [[Mas existe uma pessoa dentro dela.]]',
      paragrafos: [
        'Um profissional que tem família, problemas, medos, preocupações e limites. A saúde mental dos ' +
          'profissionais de segurança precisa deixar de ser tratada como uma questão secundária.',
        'O caminho precisa começar pela prevenção. Não basta esperar o problema aparecer: é preciso ' +
          'criar políticas, programas e mecanismos permanentes de acompanhamento psicológico e cuidado ' +
          'com os agentes de segurança.',
      ],
      fecho: 'Porque um [[policial cuidado]] também está mais preparado para cuidar da sociedade.',
    }),
    capitulo({
      id: 'linha-de-frente',
      ancora: 'linha-de-frente',
      layout: 'foto',
      fundo: 'branco',
      lado: 'esquerda',
      etiqueta: 'Valorizar quem está na linha de frente',
      titulo: 'Segurança pública também começa pela [[valorização do policial.]]',
      paragrafos: [
        'Conheço a rotina de quem trabalha nas ruas. Especialmente das praças, que estão diariamente na ' +
          'linha de frente — profissionais que saem de casa sem saber como será o dia e, muitas vezes, ' +
          'sem saber se voltarão para casa.',
        'Por isso defendo uma valorização mais cuidadosa dos profissionais de segurança pública, ' +
          'incluindo melhores condições de trabalho e valorização salarial. Não apenas por uma questão ' +
          'financeira: um profissional exausto não consegue oferecer o melhor serviço possível.',
        'Quando o policial consegue descansar, cuidar da família, investir na própria formação e ' +
          'cuidar da saúde, a população também ganha.',
      ],
      fecho: '[[Policial valorizado é segurança pública fortalecida.]]',
    }),
    capitulo({
      id: 'leis',
      ancora: 'leis',
      // Cena da bandeira pintada pela rolagem: título no verde, texto no
      // amarelo, fecho no azul. Foi "destaque" sobre o laranja — "tá
      // desalinhada, estranha, contraste ruim". O fundo é ignorado ali.
      layout: 'bandeira',
      fundo: 'laranja',
      etiqueta: 'Lei que existe precisa funcionar',
      titulo: 'Não basta criar uma lei [[bonita no papel.]]',
      paragrafos: [
        'Brasília precisa olhar também para um problema que muitas vezes passa despercebido: é preciso ' +
          'garantir que a lei seja efetivamente aplicada. Existem direitos e normas que já estão ' +
          'previstos, mas que encontram dificuldades para chegar à vida real.',
        'Por isso, uma das minhas bandeiras é trabalhar para que a legislação tenha mecanismos capazes ' +
          'de garantir sua efetivação.',
      ],
      fecho: 'Lei precisa sair do papel e [[chegar às pessoas.]]',
    }),
    capitulo({
      id: 'inclusao',
      ancora: 'inclusao',
      layout: 'lista',
      fundo: 'papel',
      etiqueta: 'Mãe antes de ser candidata',
      titulo: 'Algumas causas a gente [[conhece porque vive.]]',
      paragrafos: [
        'A maternidade me mudou. Ser mãe de crianças que precisam de cuidados diferenciados fez com que ' +
          'eu enxergasse desafios que, antes, conhecia apenas de fora. Descobri, de perto:',
      ],
      lista: [
        'As dificuldades do diagnóstico.',
        'O custo dos atendimentos.',
        'A falta de informação.',
        'Os desafios da inclusão escolar.',
        'A falta de preparo de profissionais.',
        'O bullying.',
        'A burocracia para acessar direitos que já estão garantidos em lei.',
      ],
      fecho:
        'E, principalmente, percebi que muitas famílias precisam de apoio para entender e enfrentar ' +
        'essa realidade.',
    }),
    capitulo({
      id: 'familias-atipicas',
      ancora: 'familias-atipicas',
      layout: 'lista',
      fundo: 'azul',
      etiqueta: 'A causa das famílias atípicas',
      titulo: 'Não basta exigir inclusão. [[É preciso oferecer estrutura.]]',
      paragrafos: [
        'Defendo políticas que aproximem educação, saúde e família, para que a inclusão aconteça de ' +
          'verdade. Isso significa:',
      ],
      lista: [
        'Capacitação de profissionais da educação.',
        'Treinamento específico para trabalhar com crianças atípicas.',
        'Programas e projetos de inclusão.',
        'Recursos destinados à formação desses profissionais.',
        'Apoio e orientação às famílias.',
        'Suporte psicológico e social aos pais.',
        'Redução da burocracia para acesso aos direitos já garantidos.',
      ],
      fecho:
        '[[Inclusão não é apenas colocar na sala.]] É garantir que a criança consiga aprender, ' +
        'conviver, participar e desenvolver seu potencial.',
    }),
    capitulo({
      id: 'burocracia',
      ancora: 'burocracia',
      layout: 'destaque',
      fundo: 'branco',
      etiqueta: 'Direitos não podem ficar presos à burocracia',
      titulo: 'A lei existe. [[Mas o caminho até ela pode ser difícil.]]',
      paragrafos: [
        'Conheço, na própria experiência, a dificuldade de acessar direitos que já existem. Para muitas ' +
          'famílias, conseguir um direito significa enfrentar documentos, comprovações, questionamentos ' +
          'e desconfiança.',
        'Defendo políticas que reduzam essa burocracia e facilitem o acesso das famílias aos direitos ' +
          'assegurados.',
      ],
      fecho:
        'Quem já enfrenta uma rotina difícil não deveria precisar enfrentar também um labirinto ' +
        'burocrático.',
    }),
    capitulo({
      id: 'animal',
      ancora: 'causa-animal',
      layout: 'foto',
      fundo: 'areia',
      lado: 'direita',
      etiqueta: 'Defesa da causa animal',
      titulo: '[[Eu sempre fui muito envolvida com os animais.]]',
      paragrafos: [
        'A defesa dos animais me acompanha desde a infância. Conheço a sensação de encontrar um animal ' +
          'abandonado, atropelado ou doente e não ter estrutura para ajudar.',
        'Hoje, o custo de uma consulta veterinária, de um exame ou de um tratamento pode ser alto demais ' +
          'para quem cuida por conta própria. Por isso defendo políticas públicas que fortaleçam a ' +
          'proteção animal. Entre as propostas que pretendo defender:',
      ],
      lista: [
        'Programas amplos de castração.',
        'Recursos destinados à proteção animal.',
        'Apoio a ONGs.',
        'Apoio a cuidadores independentes.',
        'Incentivo a estruturas de atendimento veterinário.',
        'Políticas de prevenção ao abandono.',
        'Mecanismos que ampliem o atendimento aos animais em situação de vulnerabilidade.',
      ],
      fecho: '[[Quem ama e cuida também precisa de apoio.]]',
    }),
    capitulo({
      id: 'por-que',
      ancora: 'por-que-a-politica',
      layout: 'manifesto',
      fundo: 'marinho',
      etiqueta: 'Por que a política?',
      titulo: 'Não era um [[projeto de vida.]]',
      paragrafos: [
        'Não passei anos planejando uma carreira política. O convite surgiu quando eu já estava no final ' +
          'da carreira policial. E foi justamente a experiência acumulada ao longo dos anos que fez ' +
          'nascer uma pergunta:',
        'Percebi que algumas mudanças não poderiam ser feitas individualmente. Seria necessário sair da ' +
          'zona de conforto.',
      ],
      citacao: 'Se eu não lutar por isso, quem vai?',
      lista: ['Aprender.', 'Estudar.', 'Dialogar.', 'Propor.', 'Cobrar.'],
      fecho:
        'E tentar transformar em políticas públicas aquilo que eu já conhecia na prática. Foi assim que ' +
        'decidi colocar meu nome à disposição.',
    }),
  ],
}

// ─────────────────────────────────────────────────────────────
// 2. ORIGEM — de onde veio
//
// ⚠️ ANA: ESTA E AS SEÇÕES 2.5, 2.6, 3, 4, 4b, 5, 5.5 E 5.8 ESTÃO FORA
//    DA PÁGINA DELA (ver `exibir` e CAPÍTULOS, acima). Continuam aqui
//    porque o motor do painel ainda as tipa; o conteúdo delas não vai
//    ao ar.
//
// ✍️ ESCREVER. É a seção que faz a página não ser um santinho.
//    Quatro parágrafos, primeira pessoa, fatos concretos: lugar,
//    idade, ofício, a virada. Nada de adjetivo sobre si.
// ─────────────────────────────────────────────────────────────
export const origem = {
  etiqueta: 'Minha história',
  titulo: 'Antes da política, [[veio o trabalho.]]',
  paragrafos: [
    'Sou filha de um homem que veio do Nordeste para Rondônia como soldado da borracha e depois ' +
      'virou comerciante. Ainda criança, eu acompanhava meu pai no comércio, e comecei a trabalhar ' +
      'fora muito cedo. Foi assim que aprendi disciplina, responsabilidade e coragem.',
    'Cursei dois anos de Direito antes de prestar concurso para a Polícia Militar. Fiz a prova em ' +
      '1995 e entrei na corporação em 1998. Em 2000, comecei Psicologia na Universidade Federal e ' +
      'trabalhei na área, inclusive na Secretaria de Segurança Pública.',
    'Poderia ter escolhido outro caminho. Não escolhi. Mesmo com outra formação, fiquei na Polícia ' +
      'Militar, porque entendi que a segurança pública era a minha missão.',
    'O convite para a política chegou quando eu já estava no fim da carreira policial. E a ' +
      'experiência desses anos fez nascer uma pergunta: se eu não lutar por isso, quem vai? Foi ' +
      'assim que decidi colocar meu nome à disposição.',
  ],
  citacao: 'A policialidade sempre foi o que teve de mais forte dentro do meu coração.',

  /**
   * O vídeo em que a pessoa conta a própria história.
   *
   * Nasce vazio: com o campo em branco a coluna de fotos fica exatamente
   * como está, e o bloco de vídeo não reserva espaço nem aparece como
   * "em breve". Colar o endereço no painel liga tudo.
   */
  video: { ...VIDEO },
} as const

// ─────────────────────────────────────────────────────────────
// 3. PROBLEMA — o que está errado
//
// ✍️ ESCREVER. Quatro dores que o eleitor VIVE, não quatro pautas
//    que o candidato defende. Cada uma com um dado local verificável.
//    Se a dor não for da região, ela não convence ninguém.
// ─────────────────────────────────────────────────────────────
//
// ⚠️ ANA: AS QUATRO DORES ESTÃO SEM NÚMERO, e é de propósito. O
//    documento da campanha não traz nenhum dado com fonte, e número sem
//    fonte não entra. Quando a campanha tiver um dado local conferível
//    (afastamentos por saúde mental na PM de Rondônia, fila de
//    diagnóstico, castrações por ano), ele entra no texto do item.
export const problema = {
  etiqueta: 'O que precisa mudar',
  titulo: 'Algumas causas a gente [[conhece porque vive.]]',
  intro:
    'Não falo de estatística. Falo do que vivi como policial, como psicóloga e como mãe — ' +
    'problemas que existem longe de Brasília e que Brasília precisa enxergar.',
  itens: [
    {
      id: 'item-01',
      numero: '01',
      titulo: 'A farda transmite força. Dentro dela há uma pessoa.',
      texto:
        'Policial tem família, medos e limites. Mesmo assim, a saúde mental de quem trabalha na ' +
        'segurança ainda é tratada como assunto secundário — e o cuidado quase sempre chega só ' +
        'depois que o problema aparece.',
    },
    {
      id: 'item-02',
      numero: '02',
      titulo: 'Quem está na linha de frente está exausto',
      texto:
        'As praças saem de casa sem saber como será o dia e, muitas vezes, sem saber se voltam. ' +
        'Sem condições de trabalho nem valorização, um profissional esgotado não consegue ' +
        'oferecer o melhor serviço.',
    },
    {
      id: 'item-03',
      numero: '03',
      titulo: 'Lei bonita no papel não chega a ninguém',
      texto:
        'Existem direitos e normas que já estão previstos, mas encontram dificuldade para chegar à ' +
        'vida real. Sem mecanismos que garantam a aplicação, a lei fica no papel.',
    },
    {
      id: 'item-04',
      numero: '04',
      titulo: 'Família atípica enfrenta um labirinto',
      texto:
        'Diagnóstico difícil, atendimento caro, falta de informação, escola despreparada, bullying ' +
        'e burocracia para acessar direitos que já estão na lei. Conheço esse caminho como mãe.',
    },
  ],
  video: { ...VIDEO },
} as const

// ─────────────────────────────────────────────────────────────
// 4. VALORES — as bandeiras
//
// ✍️ ESCREVER. Seis, e cada uma com uma lei, um projeto ou uma ação
//    real por trás. Bandeira sem lastro é slogan, e slogan o
//    adversário copia.
//
// A chave `chave` escolhe o ícone: liberdade · lei · armas · familia ·
// producao · imposto · fe · segurança — e, acrescentados para a Ana,
// policia · saude-mental · animal · infancia. Ver
// components/site/Valores.tsx.
//
// ANA: as seis são as "causas" do documento. O lastro delas não é lei
// aprovada (não há mandato anterior): é a vida dela — farda,
// psicologia, maternidade atípica e o cuidado com os animais. Por isso
// a seção fala de causa, e não de bandeira com resultado.
//
// Famílias atípicas e inclusão viraram UM cartão: são a mesma causa no
// documento, e sete cartões numa grade de três deixam um órfão na
// última linha. Os dois voltam separados nos compromissos.
// ─────────────────────────────────────────────────────────────
export const valores = {
  etiqueta: 'Minhas causas',
  titulo: 'Causas que eu [[conheço de perto.]]',
  intro:
    'Não passei anos planejando uma carreira política. Estas causas vêm da minha vida: da farda, ' +
    'da psicologia, da maternidade e do cuidado com os animais.',
  itens: [
    {
      id: 'item-05',
      chave: 'policia',
      titulo: 'Segurança pública',
      texto:
        'Policial valorizado é segurança pública fortalecida. Melhores condições de trabalho e ' +
        'atenção a quem está todo dia na linha de frente.',
    },
    {
      id: 'item-06',
      chave: 'saude-mental',
      titulo: 'Saúde mental policial',
      texto:
        'Prevenção e acompanhamento psicológico permanente para os agentes de segurança. Um ' +
        'policial cuidado está mais preparado para cuidar da sociedade.',
    },
    {
      id: 'item-07',
      chave: 'lei',
      titulo: 'Leis que funcionam',
      texto:
        'Lei precisa sair do papel e chegar às pessoas. Quero mecanismos que garantam a aplicação ' +
        'dos direitos que já estão previstos.',
    },
    {
      id: 'item-08',
      chave: 'familia',
      titulo: 'Famílias atípicas',
      texto:
        'Inclusão não é apenas colocar na sala. Escola preparada, apoio aos pais e menos ' +
        'burocracia para acessar direitos já garantidos.',
    },
    {
      id: 'item-09',
      chave: 'animal',
      titulo: 'Causa animal',
      texto:
        'Castração, apoio a ONGs e a cuidadores independentes e atendimento veterinário. Quem ama ' +
        'e cuida também precisa de apoio.',
    },
    {
      id: 'item-10',
      chave: 'infancia',
      titulo: 'Proteção à infância',
      texto:
        'Criança precisa de proteção, de convivência e de brincar. Precisa ter condições de viver ' +
        'cada fase da vida.',
    },
  ],
  /** A linha que fecha a seção, ao lado da foto de apoio. */
  frase: 'Trabalho. Coragem. Cuidado.',
} as const

// ─────────────────────────────────────────────────────────────
// 4b. CENA — três telas pintadas pela rolagem
//
// A ordem das cores é FIXA: secundária, ação, primária. A cena
// começa na cor em que a seção anterior termina e acaba na cor em que
// a seguinte começa — é isso que faz a emenda sumir. Por isso são
// três campos fixos e não uma lista.
//
// ✍️ ESCREVER: são três frases contando um arco. Antes → a virada →
//    agora.
// ─────────────────────────────────────────────────────────────
export const cena = {
  verde: {
    etiqueta: 'Desde 1998',
    titulo: 'Na linha de frente [[da segurança.]]',
    texto:
      'Aprendi que proteger pessoas exige preparo, e que nenhuma instituição é forte se não cuidar ' +
      'de quem faz parte dela.',
  },
  amarelo: {
    etiqueta: 'A virada',
    titulo: 'Se eu não lutar, [[quem vai?]]',
    texto:
      'Tem mudança que não se faz sozinha. Foi preciso sair da zona de conforto, estudar, dialogar ' +
      'e propor.',
  },
  azul: {
    etiqueta: `Por isso o ${campanha.numero}`,
    titulo: 'Da farda [[para Brasília.]]',
    texto:
      'Não para abandonar o que construí, mas para ampliar a luta: pela segurança, pelas famílias, ' +
      'pelas crianças e pelos animais.',
  },
} as const

// ─────────────────────────────────────────────────────────────
// 5. PROVAS — o que já foi feito
//
// ✍️ ESCREVER, e só com o que estiver em registro público. Esta é a
//    seção que separa candidato sério de vendedor de promessa, e ela
//    só funciona se o leitor puder conferir sozinho. Número sem fonte
//    aqui destrói a página inteira.
//
// Sem mandato anterior: troque as entregas por realizações
// verificáveis da vida profissional, ou desligue a seção em
// `exibir.provas`. Uma seção de provas com promessa dentro é pior do
// que não ter seção de provas.
// ─────────────────────────────────────────────────────────────
export const provas = {
  etiqueta: 'O que eu fiz',
  titulo: 'Pesquisa [[o que eu fiz.]]',
  intro:
    'Qualquer um sobe num palanque e fala bonito. O que separa candidato sério de vendedor de ' +
    'promessa é uma coisa só: o que já está feito e pode ser conferido no registro público.',
  video: { ...VIDEO },
  entregas: [
    {
      id: 'entrega-01',
      titulo: 'A primeira entrega',
      municipio: campanha.cidadeBase,
      texto:
        'O que a lei ou a ação mudou na vida de quem lê — não o que ela diz no papel. ' +
        'Uma frase de efeito prático.',
      valor: 'Lei 0.000/0000',
    },
    {
      id: 'entrega-02',
      titulo: 'A segunda entrega',
      municipio: campanha.cidadeBase,
      texto: 'Mesma regra: efeito prático primeiro, número da lei no rótulo.',
      valor: 'Lei 0.000/0000',
    },
    {
      id: 'entrega-03',
      titulo: 'A terceira entrega',
      municipio: campanha.cidadeBase,
      texto: 'Mesma regra.',
      valor: 'Lei 0.000/0000',
    },
  ],
  aviso: 'E tem mais: a lista das outras entregas, em tópico, numa linha só.',
  /**
   * O print do registro público. É o que separa "eu fiz" de "eu digo
   * que fiz" — e é a única coisa nesta seção que o leitor pode ir
   * conferir sozinho, agora, sem confiar em nós.
   */
  documento: {
    titulo: 'Pesquisa o que eu fiz.',
    texto:
      'O histórico está no registro público da casa legislativa. Não precisa acreditar em mim: ' +
      'confere.',
    rotuloLink: 'Abrir o registro oficial',
    // ✍️ ESCREVER — o endereço do sistema de proposições (SAPL, portal
    //    da Câmara, Diário Oficial). Vazio esconde o botão.
    link: '',
  },
} as const

// ─────────────────────────────────────────────────────────────
// 5.8 TRILHA DE VÍDEOS
//
// O mesmo mecanismo da seção de compromissos — a tela prende e a fita
// anda de lado conforme a página desce — com vídeo no lugar de texto.
//
// Fica logo acima de Compromissos de propósito: é o último bloco de
// prova antes de a página parar de olhar para trás e começar a
// prometer.
//
// Todos os itens nascem sem endereço, e A SEÇÃO INTEIRA SOME enquanto
// nenhum deles tiver link. Não é preciso desligar nada no painel.
// ─────────────────────────────────────────────────────────────
export const trilha = {
  etiqueta: 'Vídeos',
  titulo: 'Em vídeo, [[na minha voz.]]',
  intro: 'A minha história e as causas que eu defendo, contadas por mim.',
  itens: [
    { id: 'trilha-01', ...VIDEO },
    { id: 'trilha-02', ...VIDEO },
    { id: 'trilha-03', ...VIDEO },
    { id: 'trilha-04', ...VIDEO },
    { id: 'trilha-05', ...VIDEO },
    { id: 'trilha-06', ...VIDEO },
    { id: 'trilha-07', ...VIDEO },
    { id: 'trilha-08', ...VIDEO },
  ],
} as const

// ─────────────────────────────────────────────────────────────
// 6. FUTURO — os compromissos
//
// ✍️ ESCREVER. Seis pautas escritas de um jeito que dê para COBRAR
//    em quatro anos. "Lutar por saúde" não é compromisso; é enfeite.
// ─────────────────────────────────────────────────────────────
//
// ⚠️ ANA: SÃO SETE, e o texto é o do documento da campanha, quase
//    palavra por palavra. Eles ainda estão no verbo "defender/buscar",
//    que não dá para cobrar em quatro anos. Fica registrado em
//    PENDENCIAS.md: a campanha precisa dizer COMO cada um se mede
//    (um projeto de lei, um programa, um valor no orçamento).
export const futuro = {
  etiqueta: 'O que levo para Brasília',
  titulo: 'Experiência de quem [[viveu os problemas.]]',
  intro:
    'Não prometo saber tudo. Reconheço que estou entrando em uma nova área e que ainda tenho muito a ' +
    'aprender sobre a política. Mas sei o que levo comigo:',
  /** As cinco palavras que o documento lista, uma a uma. Vazia, some. */
  bagagem: ['Força de vontade', 'Disciplina', 'Honestidade', 'Experiência', 'Trabalho'],
  fecho: 'E, principalmente, disposição para fazer o melhor que eu puder.',
  itens: [
    {
      id: 'item-11',
      numero: '01',
      titulo: 'Saúde mental dos profissionais de segurança',
      texto:
        'Criar e fortalecer políticas nacionais de prevenção e cuidado com a saúde mental dos ' +
        'agentes de segurança pública.',
    },
    {
      id: 'item-12',
      numero: '02',
      titulo: 'Valorização dos profissionais de segurança',
      texto:
        'Defender melhores condições de trabalho, valorização profissional e atenção especial aos ' +
        'servidores que estão diariamente na linha de frente.',
    },
    {
      id: 'item-13',
      numero: '03',
      titulo: 'Leis que funcionam',
      texto:
        'Trabalhar para fortalecer mecanismos que garantam a efetiva aplicação dos direitos ' +
        'previstos na legislação.',
    },
    {
      id: 'item-14',
      numero: '04',
      titulo: 'Inclusão de verdade',
      texto:
        'Defender capacitação, estrutura e recursos para que escolas e profissionais estejam ' +
        'preparados para atender crianças atípicas.',
    },
    {
      id: 'item-15',
      numero: '05',
      titulo: 'Apoio às famílias atípicas',
      texto:
        'Buscar políticas de orientação, suporte psicológico e social e facilitação do acesso aos ' +
        'direitos já garantidos.',
    },
    {
      id: 'item-16',
      numero: '06',
      titulo: 'Proteção animal',
      texto:
        'Defender programas de castração, apoio às organizações e aos cuidadores e políticas ' +
        'públicas de atendimento e proteção aos animais.',
    },
    {
      id: 'item-17',
      numero: '07',
      titulo: 'Proteção à infância',
      texto:
        'Defender condições para que crianças e adolescentes cresçam com segurança, convivência e ' +
        'oportunidade de viver plenamente cada fase da infância.',
    },
  ],
} as const

// ─────────────────────────────────────────────────────────────
// UMA NOVA MISSÃO — o penúltimo bloco do documento
//
// Fica fora de CAPÍTULOS porque o documento o põe DEPOIS das
// propostas: a lista de capítulos termina em "Por que a política?", as
// propostas vêm, e só então a missão. Como seção própria, a ordem da
// página continua sendo a do documento sem truque de posição.
// ─────────────────────────────────────────────────────────────
export const missao = {
  etiqueta: 'Uma nova missão',
  titulo: 'Da farda [[para Brasília.]]',
  paragrafos: [
    'Durante décadas, estive na linha de frente da segurança pública. Aprendi que proteger pessoas ' +
      'exige preparo. Que cuidar de alguém exige responsabilidade. Que nenhuma instituição é forte se ' +
      'não cuidar das pessoas que fazem parte dela.',
    'Agora, quero levar essa experiência para outro espaço. Não para abandonar aquilo que construí, ' +
      'mas para ampliar a luta.',
  ],
  por: [
    'Pela segurança.',
    'Pelas famílias.',
    'Pelas crianças.',
    'Pelos profissionais que cuidam da sociedade.',
    'Pelos animais.',
    'Pelas pessoas que precisam que seus direitos saiam do papel.',
  ],
}

// ─────────────────────────────────────────────────────────────
// 7. GRUPOS — o objetivo número um da página
//
// Estes rótulos são de INTERFACE, não de campanha: quase nenhum
// precisa ser reescrito. Os que precisam estão marcados.
// ─────────────────────────────────────────────────────────────
export const grupos = {
  etiqueta: 'Acompanhe a Ana',
  // ✍️ ESCREVER
  titulo: `Tem um grupo ${g.do} ${campanha.primeiroNome} [[na sua ${REGIAO.rotuloBusca}.]]`,
  intro:
    `Um grupo de WhatsApp para cada ${REGIAO.singular}. É por ali que a campanha avisa de ` +
    'carreata, agenda e o que estiver acontecendo perto de você.',
  rotuloBusca: `Digite o nome da sua ${REGIAO.rotuloBusca}`,
  placeholderBusca: 'Comece a digitar…',
  botaoGeo: 'Usar minha localização',
  botaoGeoCarregando: 'Localizando…',
  geoNegado: 'Sem problema. Procure na lista abaixo.',
  sugestaoTitulo: 'Você está em',
  sugestaoPergunta: 'Confirma para entrar no grupo daqui.',
  sugestaoNao: `Não é minha ${REGIAO.rotuloBusca}`,
  dicaBusca: 'Pode digitar sem acento.',
  vazio: 'Nada com esse nome. Veja a lista completa.',
  listaTitulo: `Todos os ${REGIAO.plural}`,
  verTodos: `Ver todos os ${REGIAO.plural}`,
  abertos: 'grupos abertos',
  folhaTitulo: `Encontre sua ${REGIAO.rotuloBusca}`,
  folhaFechar: 'Fechar',
  proximasTitulo: 'As mais perto de você',
  abertosTitulo: 'Grupos abertos agora',
  mapaTitulo: 'Onde você mora?',
  mapaDica: `Toque na sua ${REGIAO.rotuloBusca}. Verde é grupo aberto.`,
  mapaLegendaAberto: 'Grupo aberto',
  sugestaoSim: 'Sim, entrar no grupo',
  sugestaoLonge: `Confira se é mesmo a sua ${REGIAO.rotuloBusca} — a sede mais próxima está longe.`,
  emBreve: 'Em breve',
  cheio: 'Grupo cheio',
  aberto: 'Entrar',
  avisoEmBreve:
    'O grupo daqui ainda não abriu. Siga o Instagram da campanha que avisamos assim que abrir.',
} as const

// ─────────────────────────────────────────────────────────────
// 8. FILTRO — a moldura na foto de perfil
//
// Rótulos de interface. Foram escritos para um público de 35 a 64
// anos usando o celular, e cada um deles resolveu um problema real de
// teste. Reescrever por gosto costuma piorar. O que muda por campanha
// é só o número.
// ─────────────────────────────────────────────────────────────
export const filtro = {
  etiqueta: 'Mostre seu apoio',
  titulo: `Coloque o [[${campanha.numero}]] na sua foto.`,
  intro:
    'Sua foto não sai do seu aparelho. Nada é enviado, nada é guardado, não precisa cadastro. ' +
    'É tudo feito aqui dentro do seu celular.',
  passos: [
    { id: 'passo-01', numero: '1', titulo: 'Escolha a moldura', texto: 'Story para postar ou quadrado para foto de perfil.' },
    { id: 'passo-02', numero: '2', titulo: 'Escolha sua foto', texto: 'Do rolo da câmera mesmo. Ela não sai daqui.' },
    { id: 'passo-03', numero: '3', titulo: 'Ajuste', texto: 'Arraste e dê zoom até o rosto ficar bem enquadrado.' },
    { id: 'passo-04', numero: '4', titulo: 'Salve e poste', texto: 'Baixe, compartilhe ou segure na foto para salvar.' },
  ],
  formatos: {
    story: { rotulo: 'Story', descricao: '1080 × 1920 — para postar no Instagram e no status' },
    perfil: { rotulo: 'Perfil', descricao: '1080 × 1080 — para foto de perfil do WhatsApp' },
  },
  botaoEscolherFoto: 'Escolher minha foto',
  botaoTrocarFoto: 'Trocar foto',
  botaoGerar: 'Gerar minha foto',
  botaoGerando: 'Gerando…',
  botaoBaixar: 'Baixar foto',
  botaoCompartilhar: 'Compartilhar',
  botaoStory: 'Abrir o Instagram',
  notaStory:
    'Salve a foto primeiro. O Instagram abre na câmera de story — aí é só escolher a foto salva.',
  botaoRefazer: 'Fazer outra',
  botaoVoltar: 'Voltar',
  botaoAvancar: 'Continuar',
  dicaSalvar: 'No celular: segure o dedo na foto acima e escolha "Salvar imagem".',
  vazioPrevia: 'Sua foto entra aqui.',
  rotuloZoom: 'Zoom',
  botaoCentralizar: 'Centralizar',
  dicaAjuste: 'Arraste a foto para posicionar. No celular, use dois dedos para aproximar.',
  tituloPronto: 'Sua foto está pronta.',
  textoPronto: 'Agora é postar. Story, perfil, status do WhatsApp — onde a sua gente vê.',
  avisoInstagram:
    'Você abriu pelo Instagram. Aqui o download costuma falhar — toque para abrir no navegador.',
  avisoInstagramBotao: 'Abrir no navegador',
  naoBaixouTitulo: 'Não baixou?',
  naoBaixouTexto:
    'Dentro do Instagram o download costuma não funcionar. Segure o dedo na foto acima e ' +
    'escolha "Salvar imagem", ou abra esta página no navegador.',
  erroFormato:
    'Essa foto está num formato que o navegador não abre (comum em fotos de iPhone). ' +
    'Tire um print dela e use o print.',
  erroPequena: 'Essa foto é pequena e vai sair borrada. Sugerimos escolher outra.',
  erroGerar: 'Não foi possível gerar a imagem neste aparelho. Tente uma foto menor.',
  avisoZonaSegura: 'Deixe o rosto aqui dentro',
  privacidade: 'Sua foto nunca sai do seu aparelho.',
  // O número entra na frente, vindo do banco. Só aparece depois de
  // passar de um piso que não constranja — ver lib/apoios.ts.
  apoios: 'pessoas já colocaram o {{candidato.numero}} na foto.',
} as const

// ─────────────────────────────────────────────────────────────
// 9. COMPARTILHAR
// ─────────────────────────────────────────────────────────────
export const compartilhar = {
  etiqueta: 'Espalhe',
  // "Eu não posso lutar sozinha" é a primeira das frases-chave do
  // documento da campanha.
  titulo: 'Eu não posso [[lutar sozinha.]]',
  intro:
    'Não tem verba que compre o que a sua indicação faz. Mande esta página para três pessoas ' +
    'que confiam em você.',
  // É o texto que sai no WhatsApp de quem compartilha. Precisa fazer
  // sentido lido sozinho, sem a página junto.
  textoWhatsapp:
    `Conheça ${g.o} ${nomeComNumero}: policial militar, psicóloga e mãe, ${g.candidato} a ` +
    `${campanha.cargo} por ${campanha.estado}. Tem grupo de WhatsApp da nossa ` +
    `${REGIAO.rotuloBusca} e dá pra colocar o ${campanha.numero} na sua foto:`,
  botaoWhatsapp: 'Enviar no WhatsApp',
  botaoCopiar: 'Copiar o link',
  copiado: 'Link copiado.',
} as const

// ─────────────────────────────────────────────────────────────
// 10. CTA FINAL
// ─────────────────────────────────────────────────────────────
export const ctaFinal = {
  // ANA: é o último bloco do documento, a assinatura — nome, lema,
  // cargo com número e "Conheça. Acompanhe. Participe.".
  titulo: ['Trabalho, coragem', '[[e cuidado.]]'],
  texto:
    'Sou uma policial que decidiu entrar na política porque entendeu que algumas mudanças precisam ' +
    'ser construídas também em Brasília.',
  cargo: `${campanha.cargo} — ${campanha.numero}`,
  chamada: 'Conheça. Acompanhe. Participe.',
  ctaPrimario: ctas.grupo,
  ctaSecundario: ctas.filtro,
} as const

// ─────────────────────────────────────────────────────────────
// FAIXA — a tarja que corre entre a primeira dobra e o resto.
// Serve para o que precisa ser lembrado sem ocupar seção: número,
// nome de urna, partido, o que a campanha quiser martelar.
// ─────────────────────────────────────────────────────────────
export const faixa = {
  itens: [
    // ANA: as oito "frases-chave para o design do site" do documento.
    { id: 'faixa-01', texto: 'Eu não posso lutar sozinha' },
    { id: 'faixa-02', texto: 'A farda representa força. Mas dentro dela existe uma pessoa' },
    { id: 'faixa-03', texto: 'Lei precisa sair do papel e chegar às pessoas' },
    { id: 'faixa-04', texto: 'Inclusão não é apenas colocar na sala' },
    { id: 'faixa-05', texto: 'Policial valorizado é segurança pública fortalecida' },
    { id: 'faixa-06', texto: 'Algumas causas a gente conhece porque vive' },
    { id: 'faixa-07', texto: 'Tudo tem um primeiro passo' },
    { id: 'faixa-08', texto: 'Eu vou fazer o melhor que eu puder' },
  ],
} as const

// ─────────────────────────────────────────────────────────────
// 11. RODAPÉ
// ─────────────────────────────────────────────────────────────
export const rodape = {
  assinatura: `Feito em ${campanha.estado}.`,
  links: [
    { id: 'link-01', rotulo: 'Grupos de WhatsApp', href: '/grupos' },
    { id: 'link-02', rotulo: `Coloque o ${campanha.numero} na sua foto`, href: '/filtro' },
    { id: 'link-03', rotulo: 'Política de privacidade', href: '/politica-de-privacidade' },
  ],
  legalRotulo: 'Propaganda eleitoral',
  aviso: 'Esta página é propaganda eleitoral e não coleta dados pessoais dos visitantes.',

  /**
   * ⚠️ IDENTIFICAÇÃO ELEITORAL OBRIGATÓRIA — NÃO PUBLICAR EM BRANCO.
   *
   * Estes campos não moram em variável de ambiente de propósito: pelo
   * painel, corrigir um dado errado leva trinta segundos em vez de um
   * deploy, e é isso que importa numa campanha. Em compensação, quem
   * tem a senha do painel pode mudar o CNPJ da peça — que é exposição
   * jurídica. O histórico de versões cobre parte disso: toda alteração
   * fica registrada e dá para restaurar.
   *
   * Preenchidos em Painel ▸ Identidade ▸ Rodapé.
   *
   * ANA: o padrão já nasce preenchido, com o rodapé legal que a própria
   * campanha imprime nos posts oficiais — lido dos posts e CONFIRMADO
   * pela coordenação em 14/09/2026. O dígito verificador do CNPJ confere.
   * O painel continua vencendo: corrigir não exige deploy.
   */
  legal: {
    eleicao: `ELEIÇÃO ${campanha.eleicao.ano}`,
    candidato: campanha.nomeUrna,
    // ⚠️ "DEPUTADO", no masculino, e não é descuido: é o nome do cargo
    //    no registro, e é como a campanha escreve o rodapé legal dos
    //    posts. O resto da página continua dizendo "Deputada".
    cargo: 'DEPUTADO FEDERAL',
    partido: `PARTIDO ${campanha.partido} ${campanha.partidoNumero}`,
    // O CNPJ da campanha, emitido no registro de candidatura.
    cnpj: 'CNPJ 68.519.559/0001-66',
    coligacao:
      'COLIGAÇÃO: GENTE QUE GOSTA DE GENTE PSD / AVANTE / FEDERAÇÃO RENOVAÇÃO SOLIDÁRIA ' +
      '(25-PRD/77-SOLIDARIEDADE)',
    // ✍️ Endereço do comitê: a campanha ainda não informou.
    comite: '',
  },
} as const

// ─────────────────────────────────────────────────────────────
// 12. PRIVACIDADE
//
// ⚠️ ESTE TEXTO DESCREVE O QUE O CÓDIGO FAZ. Ele é verdadeiro para
//    este projeto como ele está: a foto do filtro não sai do
//    aparelho, a coordenada é usada e descartada, e não há cookie de
//    rastreamento — ENQUANTO o pixel estiver desligado.
//
//    Ligar o pixel da Meta torna o item 4 falso. A tela Painel ▸
//    Tráfego entrega o parágrafo substituto pronto para colar. Não
//    ligue o pixel sem trocar o texto: é a única parte deste site que
//    tem consequência fora dele.
//
// Os textos aceitam {{tokens}}. A lista permitida está em
// lib/conteudo/tokens.ts — é whitelist, não acesso livre ao objeto.
// ─────────────────────────────────────────────────────────────
export const privacidade = {
  titulo: 'Política de Privacidade',
  atualizadoEm: '',
  resumo:
    'Resumo em uma frase: esta página não pede seu nome, não pede seu telefone, ' +
    'não guarda sua foto e não guarda sua localização.',

  secoes: [
    {
      id: 'priv-01',
      titulo: '1. Quem é o responsável',
      conteudo: [
        'Esta página é mantida pela campanha de {{candidato.nome}}, candidatura a ' +
          '{{candidato.cargo}} por {{candidato.estado}} pelo {{candidato.partidoExtenso}}, ' +
          'número {{candidato.numero}}. Os dados de identificação da campanha, incluindo CNPJ e ' +
          'endereço do comitê, estão no rodapé de todas as páginas.',
      ],
    },
    {
      id: 'priv-02',
      titulo: '2. A sua foto no gerador de moldura',
      conteudo: [
        'O gerador de moldura funciona inteiramente dentro do seu aparelho. A foto que você escolhe ' +
          'é lida pelo próprio navegador, desenhada numa tela interna junto com a moldura e salva por você.',
        'Em nenhum momento a foto é enviada para um servidor, para a campanha ou para terceiros. ' +
          'Não guardamos, não vemos e não temos como recuperar nenhuma imagem gerada aqui. ' +
          'Por isso o gerador não pede cadastro nem login.',
      ],
    },
    {
      id: 'priv-03',
      titulo: '3. A sua localização',
      conteudo: [
        'Ao tocar em "Usar minha localização", o navegador pede a sua permissão e informa a coordenada ' +
          'apenas para o código que roda no seu próprio aparelho. Essa coordenada é usada para calcular ' +
          'qual sede está mais perto e é descartada em seguida.',
        'A coordenada não é enviada para nenhum servidor nem armazenada. Se você recusar a permissão, ' +
          'a página continua funcionando normalmente: basta buscar pelo nome.',
        'Independentemente disso, a hospedagem pode inferir a cidade aproximada a partir do endereço de rede, ' +
          'como qualquer site faz. Usamos essa informação apenas para sugerir uma cidade na tela, ' +
          'no momento em que a página carrega. Ela não é gravada.',
      ],
    },
    {
      id: 'priv-04',
      titulo: '4. O que medimos',
      conteudo: [
        'Registramos eventos de uso sem identificar pessoas: página vista, rolagem, busca, ' +
          'clique no botão do grupo, uso do gerador de moldura e compartilhamento.',
        'A cada visita é gerado um identificador aleatório, guardado apenas enquanto a aba estiver aberta, ' +
          'cuja única função é evitar que a mesma visita seja contada várias vezes. ' +
          'Ele não contém nome, telefone, e-mail nem endereço de rede, e desaparece quando você fecha a aba.',
        'Não usamos cookies de rastreamento e não montamos perfil de navegação.',
      ],
    },
    {
      id: 'priv-09',
      titulo: '5. Os vídeos da página',
      conteudo: [
        'Os vídeos desta página são hospedados no YouTube e no Vimeo, e não neste site. ' +
          'Enquanto você não toca no botão de play, nada é pedido a esses serviços: o que aparece na tela ' +
          'é apenas uma imagem de capa e um botão, servidos por nós.',
        'Ao tocar em play, o player do serviço é carregado e, a partir daí, o tratamento dos seus dados ' +
          'dentro dele segue a política de privacidade do próprio serviço. ' +
          'Usamos os endereços que não gravam cookie de publicidade, mas não temos como falar pelo que eles fazem.',
      ],
    },
    {
      id: 'priv-05',
      titulo: '6. Grupos de WhatsApp',
      conteudo: [
        'Ao entrar num grupo de WhatsApp da campanha, o tratamento dos seus dados dentro do aplicativo ' +
          'passa a seguir a política de privacidade do próprio WhatsApp e as regras do grupo. ' +
          'Você pode sair do grupo a qualquer momento pelo próprio aplicativo.',
      ],
    },
    {
      id: 'priv-06',
      titulo: '7. Compartilhamento com terceiros',
      conteudo: [
        'Não vendemos, alugamos nem cedemos dados de visitantes. ' +
          'Os serviços de hospedagem e de banco de dados utilizados pelo site processam dados ' +
          'exclusivamente para manter a página no ar e gerar as métricas agregadas descritas acima.',
      ],
    },
    {
      id: 'priv-07',
      titulo: '8. Seus direitos',
      conteudo: [
        'Como não coletamos dados que identifiquem você, não há cadastro para consultar, corrigir ou apagar. ' +
          'Ainda assim, se tiver qualquer dúvida sobre esta política ou sobre o tratamento de dados, ' +
          'a campanha responde pelos canais indicados no rodapé.',
      ],
    },
    {
      id: 'priv-08',
      titulo: '9. Mudanças nesta política',
      conteudo: [
        'Se esta política mudar, a data de atualização no topo desta página muda junto. ' +
          'Recomendamos conferir esta página caso tenha alguma dúvida.',
      ],
    },
  ],
} as const

// ─────────────────────────────────────────────────────────────
// 2.5 ÁLBUM — o acervo de família
//
// O material mais difícil de forjar que existe numa campanha, e por
// isso ele aparece COMO papel: borda, amarelado, data no canto.
//
// ✍️ As legendas são de quem viveu a cena. "No colo do pai, com a vó
//    do lado" vale mais que "Infância". O campo `ano` aceita ano,
//    lugar ou as duas coisas.
// ─────────────────────────────────────────────────────────────
//
// ⚠️ ANA: QUATRO FOTOS, E LEGENDAS QUE SÓ DIZEM O QUE SE VÊ. As duas
//    primeiras são fotos de papel escaneadas (ela jovem, com um gato e
//    com cachorros); as outras duas são de família. Quem está em cada
//    foto, onde e quando, não veio escrito — e legenda inventada em
//    álbum de família é a mentira mais fácil de desmontar. A campanha
//    troca pelo que viveu (fica em PENDENCIAS.md). O `ano` vazio some.
//
//    Uma quinta foto do acervo (crianças pequenas num banco) ficou fora:
//    são crianças sem roupa, e isso a campanha decide, não o site.
export const album = {
  etiqueta: 'Arquivo de família',
  titulo: 'Todas as mães eram [[mães de todo mundo.]]',
  intro:
    'Cresci numa época em que as crianças brincavam na rua, as casas ficavam abertas e os vizinhos ' +
    'cuidavam uns dos outros. E, desde cedo, sempre com um bicho por perto.',
  fotos: [
    { id: 'album-01', legenda: 'Sempre fui muito envolvida com os animais.', ano: '' },
    { id: 'album-02', legenda: 'A causa animal me acompanha desde cedo', ano: '' },
    { id: 'album-03', legenda: 'Com a família', ano: '' },
    { id: 'album-04', legenda: 'Dia de formatura, com a família', ano: '' },
  ],
  rodape: 'Fotos do arquivo da família.',
} as const

// ─────────────────────────────────────────────────────────────
// 2.6 A RUA — a prova de que a manchete é literal
//
// Se a primeira dobra afirma alguma coisa sobre a rua, esta seção é
// onde ela se prova. Sem ela a página afirma e não mostra — que é
// exatamente o que ela acusa os outros de fazer duas seções abaixo.
// ─────────────────────────────────────────────────────────────
//
// ANA: a "rua" dela é a linha de frente — as fotos são de serviço, do
// acervo que a campanha mandou (em campo, com o helicóptero do Ibama,
// num treinamento de reanimação). Legenda só com o que se vê; o `local`
// vazio some.
export const rua = {
  etiqueta: 'Na linha de frente',
  titulo: 'Eu queria [[proteger as pessoas.]]',
  texto:
    'Foi essa vontade que me levou para a Polícia Militar. Depois do sonho de vestir a farda, ' +
    'vieram a realidade, os obstáculos e as limitações de quem está na rua — e entendi que ' +
    'proteger a população passa por cuidar de quem protege.',
  video: { ...VIDEO },
  fotos: [
    { id: 'rua-01', legenda: 'De farda, em campo', local: '' },
    { id: 'rua-02', legenda: 'Em campo, com o helicóptero do Ibama', local: '' },
    { id: 'rua-03', legenda: 'Treinamento de reanimação', local: '' },
  ],
  // ⚠️ As melhores fotos de rua são de fotógrafo e de veículo de
  //    imprensa. Este crédito não é enfeite: é a condição de uso.
  //    As da Ana são do arquivo pessoal dela; a terceira mostra um
  //    colega de farda, e a autorização dele fica em PENDENCIAS.md.
  credito: 'Fotos do meu arquivo pessoal.',
} as const

// ─────────────────────────────────────────────────────────────
// 5.5 PROVA SOCIAL — o que os outros dizem
//
// Vem DEPOIS de Provas de propósito: primeiro eu provo com lei,
// depois outro fala por mim. Invertido, os elogios chegam antes de
// haver motivo para eles.
//
// ⛔ NASCE DESLIGADA (ver `exibir.social`). São prints de comentários
//    de terceiros e menções a processos judiciais: os primeiros
//    exigem autorização de uso de imagem, os segundos exigem o
//    jurídico assinando embaixo. Ligar antes disso é criar problema
//    onde não havia.
// ─────────────────────────────────────────────────────────────
export const social = {
  etiqueta: 'O que dizem',
  titulo: 'Aqui não sou eu [[falando de mim.]]',
  intro:
    'São comentários que as pessoas escreveram por conta própria, nos posts, sem eu pedir. ' +
    'Deixei do jeito que chegaram.',
  legendas: [
    { id: 'leg-01', texto: 'Quem escreveu, sem nome completo' },
    { id: 'leg-02', texto: '' },
    { id: 'leg-03', texto: '' },
    { id: 'leg-04', texto: '' },
    { id: 'leg-05', texto: '' },
    { id: 'leg-06', texto: '' },
  ],
  videos: [
    { id: 'svid-01', ...VIDEO, titulo: 'Comentário 1' },
    { id: 'svid-02', ...VIDEO, titulo: 'Comentário 2' },
  ],
  ataques: {
    etiqueta: 'O outro lado',
    titulo: 'E o que dizem [[contra mim?]]',
    intro: 'O que o adversário publica, reproduzido sem edição.',
    fecho: 'A leitura da campanha sobre o que está acima, em duas linhas.',
  },
  /**
   * ⛔ MENÇÃO A PROCESSO JUDICIAL NÃO SOBE SEM O JURÍDICO.
   *    Nem para dizer que a campanha ganhou. O texto precisa ser
   *    conferido por quem responde por ele.
   */
  processos: [
    {
      id: 'proc-01',
      titulo: 'O caso, em uma frase',
      texto: 'O que foi alegado, por quem, quando.',
      resultado: 'O que a Justiça decidiu.',
      videos: [{ id: 'pvid-01', ...VIDEO, titulo: 'O processo' }],
    },
  ],
  nota: 'Comentários públicos, reproduzidos com identificação preservada apenas onde houve autorização.',
} as const

// ─────────────────────────────────────────────────────────────
// EXIBIR — quais seções vão ao ar
//
// Um interruptor por seção. Serve para duas coisas reais de campanha:
// tirar do ar um bloco cuja prova ainda não chegou, e encurtar a
// página quando o tráfego pago pedir caminho mais curto até o grupo.
//
// ⚠️ Hero, chamada final e rodapé NÃO estão aqui de propósito. O
//    rodapé carrega a identificação exigida pela lei eleitoral, e uma
//    página de campanha sem primeira dobra nem pedido de voto não é
//    uma página mais curta: é outra coisa.
// ─────────────────────────────────────────────────────────────
export const exibir = {
  faixa: true,
  capitulos: true,
  futuro: true,
  missao: true,
  grupos: true,
  filtro: true,
  compartilhar: true,
  // ⚠️ ANA: as seções do modelo abaixo não fazem parte da página dela
  //    (ver CAPÍTULOS). Ficam falsas e fora do painel; a página nem as
  //    importa. Provas já estaria desligada de qualquer jeito: não há
  //    mandato anterior, logo não há registro público para mostrar.
  origem: false,
  album: false,
  rua: false,
  problema: false,
  valores: false,
  cena: false,
  provas: false,
  social: false,
  trilha: false,
} as const

// ─────────────────────────────────────────────────────────────
// APARÊNCIA
//
// Os poucos ajustes visuais que a campanha decide sem chamar
// ninguém. Não é um editor de tema: são três chaves, e cada uma
// existe porque alguém já quis mexer nela. As CORES ficam em
// content/campanha.ts.
// ─────────────────────────────────────────────────────────────
export const aparencia = {
  /**
   * As cores da primeira dobra.
   *
   * Seis combinações: azul · verde · amarelo · verde-amarelo ·
   * azul-verde · amarelo-azul. Ver `.capa` em globals.css — cada uma
   * define a própria cor de realce e de botão, para os dois
   * continuarem saltando do fundo em vez de afundar nele.
   *
   * Lembrando que os nomes são PAPÉIS: "azul" é a cor primária da
   * campanha, seja ela qual for.
   */
  heroCor: 'azul',

  /** nenhuma · halftone · ruido · tracejado */
  textura: 'halftone',
  /** De 0 a 100. Ver .textura em globals.css: 100 é o teto do tipo. */
  texturaForca: 20,
} as const

// ═══════════════════════════════════════════════════════════════
// PADRÃO DE FÁBRICA
//
// Este objeto é a VERDADE PADRÃO do site. As chaves daqui são as
// chaves que o banco aceita — acrescentar seção é acrescentar linha
// aqui, em content/esquema.ts e em content/mapa.ts.
// ═══════════════════════════════════════════════════════════════
export const PADRAO = {
  candidato,
  aparencia,
  meta,
  paginas,
  navegacao,
  ctas,
  hero,
  capitulos,
  missao,
  origem,
  album,
  rua,
  problema,
  valores,
  faixa,
  cena,
  provas,
  social,
  trilha,
  futuro,
  grupos,
  filtro,
  compartilhar,
  ctaFinal,
  rodape,
  privacidade,
  exibir,
} as const

/** As chaves de seção que o banco aceita. */
export const SECOES = Object.keys(PADRAO) as (keyof typeof PADRAO)[]
