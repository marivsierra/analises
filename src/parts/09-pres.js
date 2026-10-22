/* Peso do presidente: resultados-chave, direção, atribuição (a=alta, m=média, b=baixa) e o que mais pesou. Atribuição é julgamento analítico segundo a regra do painel de critérios. */
var ATTR={a:"alta",m:"média",b:"baixa"};
var PRES={
 fhc:{tx:"Plano Real, tripé macro, privatizações e LRF partiram do Executivo (Fazenda e Banco Central), com Congresso aliado. O crescimento ficou limitado por choques externos, e a dívida mais que dobrou. A emenda da reeleição passou com votos de PSDB e PFL.",
  it:[
   ["Inflação cai de ~900% (1994) para ~9% (1996)","m","a","Efeito direto do Plano Real; amplamente aceito."],
   ["Dívida líquida sobe de ~30% para ~60% do PIB","p","m","Decisões do governo (resgate de bancos, passivos) e choques externos de câmbio e juros."],
   ["Crescimento médio de 2,4% ao ano","x","b","Crises da Ásia, da Rússia e da Argentina, racionamento de 2001 e câmbio."],
   ["Acesso à telefonia após as privatizações","m","m","Mudança de regime, ajuda da tecnologia móvel."],
   ["Pobreza cai em 1994–96","m","m","Fim da inflação; o efeito se estabiliza depois."]
  ]},
 lula1:{tx:"A manutenção do tripé e do superávit primário foi decisão do Executivo (Fazenda e Banco Central) e quebrou a expectativa de ruptura. A Previdência dos servidores e a reforma do Judiciário passaram pelo Congresso. O crescimento dependeu do ambiente externo favorável a partir de 2004.",
  it:[
   ["Inflação cai de 9,2% para 6,4% (médias)","m","m","Juros altos do BC, câmbio apreciado e commodities."],
   ["Dívida líquida cai de 60% para ~45% do PIB","m","m","Superávit primário alto do governo; crescimento e câmbio ajudaram."],
   ["Crescimento médio de 3,5% ao ano","m","b","Liquidez global e preços de commodities."],
   ["Desigualdade cai (Gini de ~0,58 para ~0,56)","m","a","Bolsa Família é instrumento direto do Executivo; emprego e renda também pesaram."],
   ["Mensalão (2005)","p","m","Esquema atribuído a dirigentes do partido e da Casa Civil; não envolveu o presidente nas condenações do STF."]
  ]},
 lula2:{tx:"Salário mínimo, PAC, Minha Casa Minha Vida, o uso do BNDES e a resposta à crise de 2008 foram decisões do Executivo, com custo fiscal posterior. O superciclo de commodities explica parte do crescimento, e o desmatamento caiu por política e por preços agrícolas.",
  it:[
   ["Crescimento médio de 4,6% ao ano","m","b","Superciclo de commodities, crédito e retomada rápida após 2009."],
   ["Desmatamento cai ~55% (média 21,6 → 9,8 mil km²)","m","m","Política federal (PPCDAm, crédito condicionado) e queda de preços agrícolas."],
   ["Desigualdade cai (Gini de ~0,56 para ~0,53)","m","m","Salário mínimo e Bolsa Família (decisão do Executivo), emprego (ciclo)."],
   ["Aportes do Tesouro ao BNDES (>R$ 150 bi em 2009–10)","p","a","Decisão direta do Executivo; custo fiscal depois."],
   ["Hidrelétricas na Amazônia: mais oferta, mais impacto local","x","a","Leilões e licenças federais; impactos documentados no Madeira e no Xingu."]
  ]},
 dilma:{tx:"A nova matriz econômica (desonerações, crédito público e controle de preços) foi escolha do Executivo e coincide com PIB de 0,4% a.a. e piora fiscal. Pesaram também o fim das commodities, a seca, a Lava Jato e a ruptura com o Congresso.",
  it:[
   ["Crescimento médio de 0,4% ao ano","p","m","Nova matriz econômica e fatores externos (fim das commodities, seca)."],
   ["Inflação média de 6,9%","p","m","Preços administrados represados e depois liberados; câmbio."],
   ["Déficit primário e dívida em alta","p","a","Desonerações, gasto e pedaladas, todas decisões do Executivo."],
   ["Desemprego: mínima em 2014 e disparada em 2015–16","p","m","A recessão teve causas internas e externas."],
   ["Desmatamento cai ~39% (9,8 → 6,0 mil km²)","m","m","Política (Código Florestal, fiscalização) e ciclo agrícola."],
   ["Rating perde o grau de investimento","p","b","Recessão, déficit e crise política; a Lava Jato pesou menos."]
  ]},
 temer:{tx:"A agenda (teto, reforma trabalhista, Ensino Médio) foi aprovada com forte articulação do Executivo, mas pouco capital político do presidente após as denúncias da JBS, que travaram a Previdência. Queda de inflação e juros reflete também a recessão herdada.",
  it:[
   ["Inflação cai de 6,9% para 3,4% (médias)","m","b","Recessão herdada, câmbio e queda de preços de alimentos."],
   ["Crescimento médio de 1,5% ao ano","m","b","Recuperação cíclica após a recessão de 2015–16."],
   ["Dívida líquida sobe de 46% para 53% do PIB","p","m","Déficits do período e custo de juros; o teto limitou o gasto, mas não zerou o déficit."],
   ["Desemprego estável em ~11–12%","x","b","Reforma trabalhista com efeito disputado; recuperação lenta."],
   ["Governabilidade: denúncias da JBS e Previdência paralisada","p","a","Envolve diretamente o presidente; a Câmara barrou as denúncias."]
  ]},
 bolsonaro:{tx:"Previdência, autonomia do BC, saneamento e Eletrobras foram impulsionados pelo Congresso e pela equipe econômica; o Auxílio Emergencial foi ampliado pelo Congresso. O Executivo teve peso direto na resposta à pandemia, na política ambiental e no conflito com o STF. Choques externos dominam PIB e inflação.",
  it:[
   ["Crescimento médio de 1,4% ao ano","x","b","Pandemia (−3,3% em 2020), rebote em 2021 e guerra na Ucrânia."],
   ["Inflação média de 6,2%","p","b","Choques globais de energia, alimentos e câmbio; Selic subiu de 2% para 13,75%."],
   ["Desmatamento na Amazônia sobe ~58% (7,2 → 11,4 mil km²)","p","a","Fiscalização reduzida e decisões do Executivo; preços agrícolas também pesaram."],
   ["Mortes por Covid-19: mais de 680 mil até dez/2022","p","m","Executivo federal, estados e municípios; início tardio da vacina pesou."],
   ["Reforma da Previdência aprovada","m","m","Proposta do Executivo, moldada pelo Congresso (Maia, Samuel Moreira)."],
   ["Desemprego cai de 11,6% para 7,9%","m","b","Recuperação cíclica após a pandemia."]
  ]},
 lula3:{tx:"A agenda estruturante (reforma tributária, arcabouço, isenção de IR) passou pelo Congresso, com o Executivo mais articulador que autor. Política ambiental e Bolsa Família são de peso direto do Executivo. Mandato em curso: resultados de 2026 e da transição tributária inconclusivos.",
  it:[
   ["Crescimento médio de ~3,0% ao ano","m","m","Agropecuária, consumo e transferências; juros altos freiam."],
   ["Desemprego em ~5%, mínima da série","m","b","Ciclo e demografia; política de renda ajuda."],
   ["Desmatamento cai ~50% (2022–25)","m","a","Retomada de fiscalização e PPCDAm; seca e fogo ainda ameaçam."],
   ["Pobreza e extrema pobreza na mínima da série","m","m","Bolsa Família (Executivo) e emprego (ciclo)."],
   ["Déficit primário, dívida em alta e Selic de 15%","p","m","Arcabouço flexibilizado, emendas e BC; juros também refletem expectativas."],
   ["Inflação média de ~4,6%","m","b","BC e queda de preços de alimentos; expectativas acima da meta."]
  ]}
};
