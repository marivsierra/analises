# Como atualizar a página (leia antes de mexer)

Página: https://analises-politica-brasil.vercel.app/ (Vercel publica sozinho a cada push na branch `main`).
Código-fonte: `src/parts/*` (HTML/JS em pedaços). Monte com `bash src/build.sh`: gera `index.html` e `version.json` na raiz.
Requer Node + Playwright (Chromium em /opt/pw-browsers). Se o build falhar, NÃO publique.

## O que a atualização diária faz
Só procura dado oficial NOVO ou revisado e atualiza o que mudou. Se nada mudou, não faça commit.
Só mexa em:
- `src/parts/00-gdp.js` (PIB anual: acrescente o ano quando o IBGE publicar).
- `src/parts/10z-fc.js` (valores `FCV` por governo, usados pelos indicadores com `src:`) e `src/parts/11-ind.js` (arrays `v` e textos `fonte`).
- Em geral só mudam as colunas do governo em exercício (Lula III, última posição dos arrays) e, quando houver revisão de série, os governos fechados.
- `src/parts/12-build.js`: troque `v` (formato AAAA-MM-DD.N) e `d` (dd/mm/aaaa) a cada publicação. É isso que dispara o aviso de nova versão para quem está com a página aberta.
- Acrescente uma linha em `src/CHANGELOG.md` (data, o que mudou, fonte).
NÃO altere: critérios, limiares, pesos de controle, texto de políticas e escândalos, nem a estrutura das abas.

## Regras de dado
- Só fonte oficial lida agora (BCB, IBGE, INPE, Ipea/FBSP, OCDE/Inep, FMI, Federal Reserve/FRED, Senado, Câmara, TSE). Nunca preencher de memória. Sem valor conferido = `null`/n/d.
- Se a fonte não abrir (bloqueio, captcha, URL fora da lista permitida), mantenha o valor anterior e anote no CHANGELOG. Não invente.
- Convenções: médias = média simples dos anos-calendário do governo (Dilma 2011–2016, Temer 2017–2018, Lula III 2023–atual); estoques/taxas pontuais = fim do governo (Dilma: ago/2016; Lula III: último dado publicado). Veja o texto `fonte` de cada indicador em `11-ind.js`.
- Mantenha a coerência de série: não misture PME e PNAD Contínua (campo `s`/rótulo da série).

## Séries e onde olhar (o que costuma mudar)
- PIB, IPCA, desemprego (PNAD Contínua), PIB per capita: IBGE (SIDRA 5932/6784/1737/4099; Contas Nacionais anuais ~março).
- Dívida líquida (SGS 4513), dívida bruta (13762), resultado primário (5793), Selic (432), reservas (3546), câmbio (3698), conta corrente % PIB (23079): BCB SGS.
- Gini (SIDRA 7435), pobreza (Síntese de Indicadores Sociais, ~dezembro), mortalidade infantil (Projeção da População, Anuário Estatístico).
- Homicídios: Atlas da Violência (Ipea/FBSP, ~maio). Desmatamento: INPE Prodes (estimativa ~novembro, consolidado ~meio do ano seguinte).
- Pisa: OCDE/Inep (a cada 3 anos). PIB mundial: FMI WEO (abril/outubro). Fed funds: FRED FEDFUNDS.

## Depois de montar
1. Abra o HTML com Playwright e confira: sem erros de página, as 6 abas, números dos indicadores alterados.
2. `git add -A && git commit` (mensagem curta com o que mudou) e `git push origin main`.
3. Confira que `https://analises-politica-brasil.vercel.app/version.json` mostra a nova versão (o deploy leva ~1 min).
