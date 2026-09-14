# Pendências — Ana Albuquerque 7766

O que falta para esta instalação sair do preview e ir ao ar. Marque
conforme resolver; acrescente o que aparecer.

> Estado em 14/09/2026. **Item aqui não se inventa** — o certo é
> continuar em branco até alguém da campanha responder.

---

## ⛔ Trava a publicação em domínio próprio

Exigência da lei eleitoral. Sem isto, mantenha o site em URL de
preview (o `robots.ts` já bloqueia a indexação sozinho).

- [x] **CNPJ da campanha** — `CNPJ 68.519.559/0001-66`. Lido do rodapé
      legal dos posts oficiais e confirmado pela coordenação; o dígito
      verificador confere
- [x] **Nome, cargo, partido, coligação** — `ANA LIDIA SOARES DE
      ALBUQUERQUE · DEPUTADO FEDERAL · COLIGAÇÃO: GENTE QUE GOSTA DE
      GENTE PSD / AVANTE / FEDERAÇÃO RENOVAÇÃO SOLIDÁRIA
      (25-PRD/77-SOLIDARIEDADE)`, idem
- [ ] **Endereço do comitê** — não informado. Painel ▸ Identidade ▸
      Rodapé (ou `rodape.legal.comite` em `content/copy.ts`)
- [x] **CNPJ na moldura** — `npm run molduras` rodado com o CNPJ
- [x] **Silêncio eleitoral** — `2026-10-03T04:00:00.000Z`, meia-noite
      de sábado em Porto Velho (UTC−4). Conferir com o jurídico se é
      esse o instante que a campanha quer
- [ ] **Domínio** comprado e apontado
- [ ] **Variáveis na Vercel** — `PAINEL_SENHA` e `PAINEL_SESSION_SECRET`
      foram gerados de novo (os anteriores vieram de outra instalação);
      copiar do `.env.local`. `NEXT_PUBLIC_SITE_URL` na Vercel é o
      endereço público, nunca `localhost`

---

## ⛔ Trava a operação

Sem isto o site está no ar, mas não faz o que veio fazer.

- [x] **Instalar o banco** — rodados `sql/01-instalacao.sql` e
      `sql/02-seed-municipios.sql` no projeto `nyqpdavhpsbivrgsjdgm`
      em 14/09/2026, pela API do Supabase com o
      `SUPABASE_ACCESS_TOKEN` do `.env.local`. O banco estava vazio.
      Conferido depois: 17 tabelas e views, os baldes `midia` e
      `molduras`, 52 municípios, 52 grupos "em breve", fuso
      `America/Porto_Velho` e a trava de seções com `capitulos` e
      `missao`
- [ ] **Revogar o `SUPABASE_ACCESS_TOKEN`** — Supabase ▸ Account ▸
      Access Tokens, e apagar a linha do `.env.local`. Ele não é chave
      do projeto: é da CONTA, e enxerga todos os projetos dela (hoje,
      além deste, o `ribeirosinpol`). O site não usa; foi só para a
      instalação. Nunca vai para a Vercel
- [ ] **Trocar a senha do banco** no Supabase — ela circulou em
      conversa
- [ ] **Subir as imagens** — prontas em `_imagens-painel/` (fora do
      git), um arquivo por espaço do painel. Ver o `LEIA-ME.md` de lá
- [ ] **Links dos grupos de WhatsApp** — painel ▸ Grupos, um por
      município. Enquanto vazios, todos aparecem como "em breve"
- [ ] **WhatsApp da campanha** — `campanha.whatsapp` está vazio, e o
      botão fica escondido

---

## ✍️ Texto — rascunho a partir do documento da campanha

Os textos saíram de "TEXTO SITE ANA ALBUQUERQUE 7766". Nenhum fato foi
acrescentado. Precisam da revisão de quem responde pela campanha.

- [ ] **Primeira pessoa** — o documento é em terceira ("Ana é…"); a
      página foi para a primeira, que é a regra do projeto. Conferir se
      a Ana fala assim
- [ ] **Compromissos (7)** — estão no verbo "defender/buscar", que não
      dá para cobrar. Dizer como cada um se mede: projeto de lei,
      programa, valor no orçamento
- [ ] **O que precisa mudar** — as quatro dores estão sem número. Entrar
      com dado local de fonte conferível quando houver
- [ ] **Legendas do álbum** — genéricas ("Com a família"), porque quem
      está em cada foto e quando não veio escrito. Trocar pelo que a
      família contar
- [ ] **Cidade da Ana** (`cidadeBase`) — não informada
- [x] **Menu** — os nove itens sugeridos pelo documento, na ordem dele
      (quatro na barra do computador, todos no menu aberto)
- [ ] **Índice "Minhas causas"** — não é bloco do documento: é a porta do
      item de menu de mesmo nome. Confirmar se a campanha quer

---

## 🖼 Material

- [x] **Foto da primeira dobra** — `public/ana.png`, escolhida pela
      campanha em 15/09/2026 (1302×2128, recortada, 4,4MB). Vai para o
      git e para a Vercel: está fora de `public/fotos/`, que é ignorada.
      O `next/image` entrega no tamanho da tela, então os 4MB não chegam
      ao celular — mas ficam no repositório. Trocar pelo painel
      (`hero.retrato`) também funciona, e a do painel vence
- [ ] **Fotos dos capítulos** — as que estão no ar vieram de "Fotos
      apoio site" e moram em `public/fotos/`. Trocar pelo painel (espaços
      `capitulo.*`) ou substituindo o arquivo de mesmo nome
- [ ] ⛔ **As fotos de `public/fotos/` NÃO estão no git** — e sem elas o
      site publicado mostra imagem quebrada nos capítulos. A linha
      `FOTOS/` do `.gitignore` pega a pasta porque o git do Mac não
      diferencia maiúscula (acontecia o mesmo com `public/marca/`, já
      corrigido). Decidir um dos dois ANTES do push: (a) versionar a
      pasta — o repositório é PÚBLICO, e as fotos ficam no histórico
      para sempre; ou (b) subir cada foto no painel, nos espaços
      `capitulo.*` (tabela em `_imagens-painel/LEIA-ME.md`), que agora
      funciona porque o banco está instalado
- [ ] **Fotos de apoiadores** para o filtro, em pares story + perfil,
      com autorização
- [ ] **Vídeos** — links do YouTube ou Vimeo. Todo espaço nasce vazio e
      some da página enquanto estiver assim
- [ ] **Moldura final da designer** — a gerada é rede de segurança, em
      Arial

---

## ⚖️ Depende de terceiro ou de decisão da campanha

- [ ] **Colegas de farda nas fotos** — o do treinamento (`rua.3`) e os
      que aparecem nas fotos de fundo da primeira dobra: autorização de
      uso de imagem
- [ ] **Fotos com crianças** ficaram de fora (a de crianças pequenas
      num banco, do álbum escaneado, e as selfies com menores). Imagem
      de menor de idade é decisão da família e da campanha
- [ ] **Pixel da Meta**, se houver tráfego pago — e, junto dele, o
      texto novo da política de privacidade (o painel entrega pronto)

---

## 🐞 Achados no modelo, corrigidos só nesta cópia

- **O SQL de instalação não rodava.** Em
  `supabase/migrations/20260819120200_metricas.sql` e
  `20260820030000_evento_cta.sql` a vírgula depois de `as dia` estava
  dentro do comentário `-- ⚠️ FUSO DA CAMPANHA,`. O
  `template-politicos-lp` continua com o erro.
- **Cores fixas da primeira campanha** em `app/globals.css` (um ciano e
  um verde nos degradês) e em `app/opengraph-image.tsx` — aqui viraram
  cores da paleta.
- **A trava de seções do banco dizia `candidata`**, e a seção se chama
  `candidato`: salvar "Quem é" no painel batia na trava. Corrigido na
  migração `20260914120000_secoes_ana.sql`.

---

## ✅ Testes antes de publicar

- [ ] **O filtro dentro do Instagram, no iPhone e no Android, até
      salvar a foto.** É o que mais falha — faça primeiro
- [ ] `/g/<municipio>` no celular cai no grupo certo
- [ ] trocar o link no painel e reabrir a mesma URL: novo destino sem
      republicar
- [ ] município sem grupo: mensagem tratada, nunca erro
- [ ] colar o link no WhatsApp: cartão com imagem e título
- [ ] cinco municípios distantes entre si conferidos no mapa
- [ ] celular antigo em 4G: teto de 3s até o botão principal ficar
      clicável
- [ ] `sql/09-zerar-metricas.sql` rodado, para o funil não começar com
      os seus próprios cliques
