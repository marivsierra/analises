/* Aplica linhas adicionais de efeitos nas políticas. Os dados ficam em 07-extra-<governo>.js */
function EXTRA_APPLY(rows){
  rows.forEach(function(x){
    var g=GOVS.filter(function(g){return g.id===x[0];})[0];
    if(!g||!g.pol[x[1]]) throw new Error('EXTRA inválido: '+x[0]+' '+x[1]);
    g.pol[x[1]].ef.push(x[2]);
  });
}
