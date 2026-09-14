-- ═══════════════════════════════════════════════════════════════
-- 0015 · SEÇÕES DA PÁGINA DA ANA: capítulos e missão
--
-- A página da Ana segue a ordem do documento da campanha, capítulo por
-- capítulo, e isso pediu duas seções que o modelo não tinha:
-- `capitulos` (a história e as causas, em lista) e `missao` ("Uma nova
-- missão"). Sem elas nesta trava, o painel recusaria o salvamento com
-- "violates check constraint conteudo_secao_conhecida" — o mesmo
-- tropeço que a 0014 registra.
--
-- ⚠️ E CORRIGE UM ERRO QUE VEIO DO MODELO: a lista tinha 'candidata',
--    e a seção se chama `candidato` em content/copy.ts. Salvar a tela
--    "Quem é" do painel batia na trava. 'candidata' não existe em lugar
--    nenhum do código e saiu.
-- ═══════════════════════════════════════════════════════════════

alter table public.conteudo drop constraint if exists conteudo_secao_conhecida;

alter table public.conteudo add constraint conteudo_secao_conhecida check (secao in (
  'candidato','aparencia','meta','paginas','navegacao','ctas',
  'hero','origem','album','rua','problema','valores','faixa','cena',
  'provas','social','trilha','futuro','grupos','filtro','compartilhar',
  'ctaFinal','rodape','privacidade','exibir',
  'capitulos','missao'
));
