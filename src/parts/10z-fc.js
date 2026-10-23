/* Lula III (dlsp, desemp) atualizado em 23/10/2026 (BCB 30/09/2026; IBGE 29/09/2026). Demais: valores conferidos em 20/10/2026 em fontes oficiais (BCB SGS, IBGE SIDRA, INPE). Médias = média simples dos anos-calendário do governo (Dilma 2011-2016, Temer 2017-2018). Estoques = fim do período (Dilma: ago/2016). */
var FCV={
 fhc:{pib:2.19,ipca:9.24,dlsp:59.93,desm:null,desemp:[11.9,"PME"]},
 lula1:{pib:3.53,ipca:6.43,dlsp:46.49,desm:null,desemp:[9.7,"PME"]},
 lula2:{pib:4.65,ipca:5.15,dlsp:37.98,desm:null,desemp:[6.2,"PME"]},
 dilma:{pib:0.43,ipca:6.94,dlsp:42.81,desm:null,desemp:[11.9,"PNAD Contínua"]},
 temer:{pib:1.5,ipca:3.35,dlsp:52.77,desm:null,desemp:[11.7,"PNAD Contínua"]},
 bolsonaro:{pib:1.45,ipca:6.17,dlsp:56.13,desm:null,desemp:[7.9,"PNAD Contínua"]},
 lula3:{pib:2.97,ipca:4.57,dlsp:69.3,desm:7.13,desemp:[5.3,"PNAD Contínua"]}
};
GOVS.forEach(function(g){ g.cmp=FCV[g.id]; delete g.cmpNota; delete g.extra; delete g.base; });
