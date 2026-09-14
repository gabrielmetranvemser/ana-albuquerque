---
name: personalizar-campanha
description: Transforma este modelo de landing page eleitoral na campanha de um candidato específico — identidade, território (UF ou bairros), cores, textos, marca e banco. Use quando pedirem para personalizar, configurar, adaptar ou "montar o site" para um candidato, vereador, deputado, prefeito ou senador, ou quando pedirem para trocar o candidato de uma instalação existente.
---

# Personalizar a campanha

Este projeto é um modelo de LP eleitoral. Sua tarefa é transformá-lo na
página de uma pessoa real, sem inventar dado nenhum.

Leia `PERSONALIZAR.md` antes de começar — esta skill é a execução dele,
conversando. Leia também `AGENTS.md`, que tem as três regras do projeto.

## A regra que manda em todas

**Dado de campanha não se inventa.** Número de urna, CNPJ, número de
lei, coligação, votos, endereço de comitê, data de silêncio eleitoral.
Um número inventado numa página de campanha é problema jurídico.

Quando faltar um dado: **deixe o campo vazio, registre em
`PENDENCIAS.md` e diga ao usuário o que falta**. Nunca preencha com
algo plausível. Nunca use "exemplo" que pareça real.

Texto de posicionamento (a história, as bandeiras, as dores) você pode
*rascunhar* a partir do que o usuário contar — desde que diga
explicitamente que é rascunho para a campanha revisar, e não invente
fato dentro dele.

## Etapa 0 · Descobrir o que já se sabe

Antes de perguntar qualquer coisa, olhe: `content/campanha.ts`,
`content/copy.ts` e `data/municipios.json`. Pode ser uma instalação
nova (nome "Nome do Candidato", número "00000") ou uma campanha já
montada que vai ser trocada.

Se já houver campanha montada, avise antes de sobrescrever.

## Etapa 1 · O briefing mínimo

Pergunte de uma vez só, em uma mensagem, o bloco que trava tudo:

1. **nome** como a pessoa é conhecida, e o **nome na urna**
2. **número** da urna
3. **cargo** pretendido e **partido** (sigla e nome extenso)
4. **estado (UF)** ou, para campanha municipal, a **cidade**
5. **gênero** para as concordâncias (`'f'` ou `'m'`)
6. **cores** da campanha, se já existirem (hex, ou "usa a paleta
   padrão")
7. **Instagram** e **WhatsApp**, se houver
8. **ano da eleição** e **data da votação**

Diga que o resto (CNPJ, coligação, comitê, links de grupo, fotos) pode
vir depois e não trava o trabalho.

Se o usuário mandar um documento, um print ou um texto solto com esses
dados, extraia e **confirme o que extraiu** antes de escrever.

## Etapa 2 · Identidade

Preencha `content/campanha.ts` inteiro. É o único arquivo obrigatório.

Cuidados:

- `ufCodigoIbge` tem que casar com a `uf` — a tabela está em
  `scripts/ufs.mjs`;
- `slug` em minúsculas, sem acento e sem espaço;
- `genero` decide ~20 concordâncias do texto de fábrica;
- canal vazio esconde o link. É melhor esconder que deixar link morto.

Cores: se a campanha não tiver paleta, **não invente uma paleta
partidária** — pergunte ou mantenha a padrão. Respeite a regra da cor
de ação: ela nunca é texto sobre fundo claro, e se for escura, inverta
`acaoTexto` para branco.

## Etapa 3 · Território

```bash
npm run uf -- <UF>
```

Escreve `data/municipios.json`, `data/mapa.json`,
`data/grupos.local.json` e `sql/02-seed-municipios.sql`. Precisa de
rede (API do IBGE). Confira quantos municípios saíram e diga o número
ao usuário.

**Campanha municipal:** ponha `escopo: 'municipal'`, troque `regiao`
para bairro, e escreva `data/municipios.json` à mão com os bairros e
suas coordenadas (mesmo formato). O mapa some sozinho. Não rode
`npm run uf` nesse caso — ele traria os municípios do estado inteiro.

## Etapa 4 · Textos

`content/copy.ts`. Todo bloco marcado `// ✍️ ESCREVER` está com texto
de fábrica.

Ordem de retorno: **Hero → Origem → Problema → Futuro → Provas → o
resto**.

Como escrever aqui:

- primeira pessoa, sempre;
- `[[colchetes duplos]]` realçam um trecho do título na cor de ação —
  um por título;
- as dores da seção Problema são **locais e verificáveis**;
- os compromissos da seção Futuro precisam ser **cobráveis em quatro
  anos**;
- a seção Provas só aceita o que estiver em registro público. **Sem
  mandato anterior, desligue `exibir.provas`** em vez de encher de
  promessa;
- `exibir.social` nasce desligada. Só ligue se o usuário confirmar
  autorização de imagem dos comentários e aval do jurídico para
  qualquer menção a processo.

Ao rascunhar, marque no fim da resposta: *"os textos das seções X e Y
são rascunho meu a partir do que você contou — precisam da revisão de
quem responde pela campanha"*.

## Etapa 5 · Marca e imagens

Sem arte, o site desenha nome e número em código e fica apresentável.
**Não gere logotipo falso nem baixe imagem de terceiro.**

Diga ao usuário quais espaços existem no painel (`marca.simbolo`,
`marca.favicon`, `marca.logotipo`, `marca.lockup`,
`marca.lockupDeitado`, `marca.cartaoLink`, `hero.retrato`,
`hero.apoio`) e o que cada um exige. Lembre que `hero.apoio` — a foto
do padrinho político — exige autorização de uso de imagem.

Se as cores mudaram, os três hex de `app/icon.svg` precisam mudar
junto: aquele arquivo é servido isolado e não enxerga o CSS.

Molduras:

```bash
CAMPANHA_CNPJ="CNPJ ..." npm run molduras
```

Só rode com o CNPJ real. Sem ele, a moldura sai com aviso carimbado —
o que é o comportamento certo, mas avise o usuário.

## Etapa 6 · Banco

Só quando o usuário quiser sair do modo local. Ver `sql/README.md`.

1. `sql/01-instalacao.sql` — **conferindo o fuso antes** (procure por
   `FUSO DA CAMPANHA`; troque em campanha no AC, RO, AM ou MT);
2. `sql/02-seed-municipios.sql`;
3. as três chaves no `.env.local`.

⚠️ A `SUPABASE_SERVICE_ROLE_KEY` nunca leva prefixo `NEXT_PUBLIC_`.

Se houver MCP do Supabase conectado, você pode aplicar os SQLs por ele
— mas **peça confirmação antes**, dizendo em qual projeto vai rodar.
Rodar migration no projeto errado é o acidente clássico aqui.

## Etapa 7 · Fechar

```bash
npm run typecheck
npm run build
```

Depois **abra a página**: primeira dobra, `/grupos`, `/filtro`,
`/painel`. Build passando com a página quebrada é o caso mais comum
neste projeto, porque quase tudo é conteúdo.

Atualize `PENDENCIAS.md` com o que ficou faltando e entregue ao
usuário:

- o que foi preenchido;
- **o que ficou vazio e por quê** (a lista que ele precisa buscar);
- o que ainda trava a publicação — CNPJ, identificação do rodapé,
  links dos grupos, silêncio eleitoral;
- o lembrete do teste do Instagram, que é o que mais falha.

## Nunca

- inventar CNPJ, número de lei, coligação, votos ou qualquer dado
  legal;
- publicar, apontar domínio ou subir para produção sem o usuário pedir;
- mexer em `lib/`, `app/painel/`, `app/g/` ou `app/api/` para
  personalizar — isso é motor, e o que muda por campanha é maquiagem;
- pôr link de grupo de WhatsApp em arquivo versionado;
- ligar o pixel da Meta sem trocar o texto da política de privacidade.
