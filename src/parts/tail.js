
var ESP = {E:["Esquerda","--E"],CE:["Centro-esquerda","--CE"],C:["Centro","--C"],CD:["Centro-direita","--CD"],D:["Direita","--D"]};
var VER = {m:"melhorou",p:"piorou",x:"misto",d:"disputado",i:"inconclusivo",n:"não mensurável"};
var DIMS = ["Econômico","Fiscal","Social","Ambiental","Institucional","Externo","Segurança","Tecnologia"];
var IMPK = {v:"apurado",e:"estimado",d:"disputado",n:"não mensurável"};
function aggV(rows){
  var s={}; rows.forEach(function(e){s[e[4]]=1;});
  if(s.m&&s.p) return "x";
  if(s.d) return "d";
  var o=["x","m","p","i"]; for(var i=0;i<o.length;i++) if(s[o[i]]) return o[i];
  return "n";
}
var CONF = {a:"alta",m:"média",b:"baixa"};
var PODER = {EX:"Executivo",LE:"Legislativo",JU:"Judiciário"};
var METRICS = [
 ["pib","PIB médio (% a.a.)",1,0.5,"abs"],
 ["ipca","IPCA médio (% a.a.)",-1,1,"abs"],
 ["dlsp","Dívida líquida do setor público (% do PIB, fim do período)",-1,3,"abs"],
 ["desm","Desmatamento na Amazônia, média Prodes (mil km²/ano)",-1,0.15,"rel"],
 ["desemp","Desemprego (%, fim do período; PME: média do último ano)",-1,1,"abs"]
];
var fState = {po:"all", ve:"all"};

function css(v){return getComputedStyle(document.documentElement).getPropertyValue(v).trim();}
function govColor(g){return css(ESP[g.esp][1]);}
function govOfYear(y){
  var r=y+0.5;
  for(var i=0;i<GOVS.length;i++){ if(r>=GOVS[i].ini && r<GOVS[i].fim) return GOVS[i]; }
  return GOVS[GOVS.length-1];
}
function dotEsp(k){
  if(!k) return '<i class="sp" style="background:#fff;border:1px solid #bbb" title="Judiciário (não partidário)"></i>';
  return '<i class="sp" style="background:'+css(ESP[k][1])+'" title="'+ESP[k][0]+'"></i>';
}
function fmt(n){return (Math.round(n*10)/10).toString().replace('.',',');}

function cmpTable(g,i){
  if(i===0){
    return '<p class="ctx"><b>Ponto de partida (1994, governo Itamar):</b> '+g.base+'</p>';
  }
  var p=GOVS[i-1], h='<table class="cmp"><thead><tr><th>Indicador</th><th>'+p.nome.split(' (')[0]+' ('+p.periodo+')</th><th>Este governo</th><th>Variação</th><th>Veredito</th><th>Contexto que pesa na leitura</th></tr></thead><tbody>';
  METRICS.forEach(function(m){
    var k=m[0], a=p.cmp[k], b=g.cmp[k], sa=null, sb=null;
    if(Array.isArray(a)){sa=a[1];a=a[0];}
    if(Array.isArray(b)){sb=b[1];b=b[0];}
    if(a===undefined||b===undefined||a===null||b===null) return;
    var nota=(g.cmpNota&&g.cmpNota[k])||'';
    var cell, ver;
    if(sa!==sb){
      cell='—'; ver='<span class="v e">não comparável</span>'; nota='Séries diferentes ('+sa+' x '+sb+'). '+nota;
    } else {
      var d=m[4]==='rel'?(b-a)/a:(b-a);
      cell=(d>0?'+':'')+(m[4]==='rel'?Math.round(d*100)+'%':fmt(d)+' p.p.'+(k==='desm'?'':''));
      if(k==='desm') cell=(d>0?'+':'')+Math.round(d*100)+'%';
      var good=d*m[2];
      if(Math.abs(d)<m[3]) ver='<span class="v e">estável</span>';
      else ver=good>0?'<span class="v m">melhorou</span>':'<span class="v p">piorou</span>';
    }
    h+='<tr><td>'+m[1]+(sa?' <span class="k">('+sa+')</span>':'')+'</td><td class="n">'+fmt(a)+'</td><td class="n">'+fmt(b)+'</td><td class="n">'+cell+'</td><td>'+ver+'</td><td class="k">'+nota+'</td></tr>';
  });
  return h+'</tbody></table>';
}

function hasData(p){return p.ef&&p.ef.length>0;}
function polCard(g,p){
  var ve=[], chips='';
  p.ef.forEach(function(e){ if(ve.indexOf(e[4])<0) ve.push(e[4]); });
  DIMS.forEach(function(d){
    var rows=p.ef.filter(function(e){return e[0]===d;});
    var v=rows.length?aggV(rows):"n";
    chips+='<span class="v '+v+'" title="'+d+': '+VER[v]+'">'+d+'</span> ';
  });
  var po=p.po.map(function(x){return PODER[x];}).join(' + ');
  var h='<details class="pol" data-po="'+p.po.join(' ')+'" data-ve="'+ve.join(' ')+'">';
  h+='<summary><span class="pa">'+p.a+'</span><span class="pt">'+p.t+'</span><span class="po">'+po+'</span><span class="k">'+p.ato+'</span><span class="chips">'+chips+'</span></summary><div class="pb">';
  h+='<div class="who">';
  h+='<div><b>Quem propôs</b>'+p.autor+'</div>';
  h+='<div><b>Quem liderou</b>'+dotEsp(p.le)+' '+p.lider+'</div>';
  h+='<div><b>Presidentes dos Poderes à época</b>Câmara: '+p.cam+' · Senado: '+p.sen+' · STF: '+p.stf+'</div>';
  h+='<div><b>Quem aprovou e de que lado</b>'+p.apr+'</div>';
  h+='<div><b>Quem aplicou</b>'+p.apl+'</div>';
  h+='</div>';
  var hasAntes=p.antes&&p.antes.trim()&&p.antes.trim()!=='—';
  h+='<div class="ba"'+(hasAntes?'':' style="grid-template-columns:1fr"')+'>'+(hasAntes?'<div><b>Antes (governo anterior)</b>'+p.antes+'</div>':'')+'<div><b>O que mudou</b>'+p.mud+'</div></div>';
  if(!p.ef.length) return h+'<p class="k">Sem indicador mensurável atribuível a esta política em nenhuma dimensão.</p></div></details>';
  h+='<table><thead><tr><th>Dimensão</th><th>Indicador</th><th>Antes → depois</th><th>Veredito</th><th>Confiança</th><th>Leitura</th></tr></thead><tbody>';
  DIMS.forEach(function(d){
    var rows=p.ef.filter(function(e){return e[0]===d;});
    if(!rows.length){
      return;
      h+='<tr class="nm"><td>'+d+'</td><td colspan="2">Sem indicador mensurável atribuível a esta política</td><td><span class="v n">não mensurável</span></td><td class="cf">—</td><td>Cinza: não há dado que isole o efeito desta política nesta dimensão. Não significa efeito zero.</td></tr>';
      return;
    }
    rows.forEach(function(e){
      h+='<tr><td>'+e[0]+'</td><td>'+e[1]+'</td><td>'+e[2]+' → '+e[3]+'</td><td><span class="v '+e[4]+'">'+VER[e[4]]+'</span></td><td class="cf">'+CONF[e[5]]+'</td><td>'+e[6]+'</td></tr>';
    });
  });
  return h+'</tbody></table></div></details>';
}

function pct(n,d){return d?Math.round(100*n/d):0;}
function presStats(g){
  var mk=function(){return {m:0,p:0,x:0,d:0,i:0,n:0};}, ex=mk(), ot=mk(), nEx=0, tot=mk();
  g.pol.forEach(function(p){
    var isEx=p.po[0]==="EX"; if(isEx) nEx++;
    p.ef.forEach(function(e){ (isEx?ex:ot)[e[4]]++; tot[e[4]]++; ex.n+=0; });
  });
  var sum=function(o){return o.m+o.p+o.x+o.d+o.i;};
  return {nPol:g.pol.length,nEx:nEx,ex:ex,ot:ot,tot:tot,sEx:sum(ex),sOt:sum(ot),sTot:sum(tot)};
}
function bar(o,s){
  var h='<div class="sbar" title="melhorou / piorou / misto+disputado / inconclusivo">';
  [["m",o.m],["p",o.p],["x",o.x+o.d],["i",o.i]].forEach(function(a){ if(a[1]) h+='<i class="v '+a[0]+'" style="flex:'+a[1]+'">'+a[1]+'</i>'; });
  return h+'</div>';
}
/* ===== Indicadores: cálculo ===== */
var WT={a:1,m:0.5,b:0.25}, CTLN={a:'alta',m:'média',b:'baixa'};
var VI={m:'melhorou',p:'piorou',e:'estável',n:'sem comparação',b:'ponto de partida',c:'contexto'};
function indVals(ind){
  return GOVS.map(function(g,i){
    var x=ind.src?g.cmp[ind.src]:ind.v[i], s=ind.ser?ind.ser[i]:null;
    if(Array.isArray(x)){s=x[1];x=x[0];}
    return {v:(x===undefined||x===null)?null:x,s:s};
  });
}
function indVer(ind,i,vals){
  if(ind.dir===0) return 'c';
  if(i===0) return 'b';
  var a=vals[i-1], b=vals[i];
  if(a.v===null||b.v===null||a.s!==b.s) return 'n';
  var d=ind.rel?(b.v-a.v)/a.v:(b.v-a.v);
  if(Math.abs(d)<ind.thr-1e-9) return 'e';
  return d*ind.dir>0?'m':'p';
}
function indDec(ind){return ind.dec===undefined?1:ind.dec;}
function indFmt(ind,v){return v===null?'n/d':v.toFixed(indDec(ind)).replace('.',',');}
function indDelta(ind,a,b){
  if(a.v===null||b.v===null||a.s!==b.s) return '';
  var d=ind.rel?(b.v-a.v)/a.v:(b.v-a.v);
  var t=ind.rel?Math.round(d*100)+'%':d.toFixed(indDec(ind)).replace('.',',');
  return (d>0?'+':'')+t;
}
function score(i){
  var c={m:0,p:0,e:0,n:0}, ws=0, wt=0, G={ac:{m:0,p:0,e:0},b:{m:0,p:0,e:0}}, rows=[];
  IND.forEach(function(ind){
    if(ind.dir===0) return;
    var vals=indVals(ind), v=indVer(ind,i,vals);
    rows.push({ind:ind,v:v,vals:vals});
    c[v]++;
    if(v==='n') return;
    var w=WT[ind.ctl], s=v==='m'?1:v==='p'?-1:0;
    ws+=w*s; wt+=w; G[ind.ctl==='b'?'b':'ac'][v]++;
  });
  var n=c.m+c.p+c.e, sg=function(o){var t=o.m+o.p+o.e; return t?Math.round(100*(o.m-o.p)/t):0;};
  var wp=wt?Math.round(100*ws/wt):0;
  return {c:c,n:n,tot:rows.length,w:wp,simple:n?Math.round(100*(c.m-c.p)/n):0,G:G,sAc:sg(G.ac),sB:sg(G.b),rows:rows,
    lab:wp>=25?'favorável':wp<=-25?'desfavorável':'neutro'};
}
function sgn(n){return (n>0?'+':'')+n+'%';}
function ibar(o){
  var h='<div class="sbar" title="melhorou / piorou / estável">';
  [["m",o.m],["p",o.p],["e",o.e]].forEach(function(a){ if(a[1]) h+='<i class="v '+a[0]+'" style="flex:'+a[1]+'">'+a[1]+'</i>'; });
  return h+'</div>';
}
function gname(g){return g.nome.split(' (')[0];}

/* ===== Aba: visão geral ===== */
function ovTab(){
  var h='<div class="sec">Placar de cada governo contra o anterior</div><div class="tw"><table class="ov"><thead><tr><th>Governo</th><th>Período</th><th>Frente</th><th>Partido</th><th>Vice</th><th>Indicadores: melhorou · piorou · estável</th><th>Desempenho ponderado</th></tr></thead><tbody>';
  GOVS.forEach(function(g,i){
    var sc=i?score(i):null;
    h+='<tr><td><i class="sp" style="background:'+govColor(g)+'"></i> <b>'+gname(g)+'</b></td><td>'+g.periodo+'</td><td>'+ESP[g.esp][0]+'</td><td>'+g.partido+'</td><td>'+g.vice.replace(/\s*\(.*?\)/,'')+'</td>';
    if(sc) h+='<td>'+ibar(sc.c)+'<span class="k">'+sc.n+' de '+sc.tot+' indicadores com comparação</span></td><td><b>'+sgn(sc.w)+'</b> · '+sc.lab+'</td>';
    else h+='<td colspan="2" class="k">Ponto de partida: sem governo anterior na série.</td>';
    h+='</tr>';
  });
  h+='</tbody></table></div><p class="k">Cada governo é comparado só com o anterior, dentro do país. Todos os números vêm de séries oficiais (BCB, IBGE, INPE, Ipea/FBSP, OCDE/Inep, FMI, Fed) lidas em 20/10/2026. Desempenho ponderado = saldo (melhorou − piorou) dos indicadores, com peso 1 para controle alto do Executivo, 0,5 para médio e 0,25 para baixo. Detalhes na aba Peso do presidente. Vice e mandato conferidos em páginas do Senado e da Câmara; o partido do presidente ao assumir não foi conferido em fonte oficial (o site do Planalto bloqueou o acesso).</p>';
  document.getElementById('ov').innerHTML=h;
}

/* ===== Aba: indicadores ===== */
var CELLC={m:'cm',p:'cp',e:'ce',n:'cn',b:'',c:''};
function indTab(){
  var groups=[]; IND.forEach(function(x){ if(groups.indexOf(x.g)<0) groups.push(x.g); });
  var h='<div class="legend"><span><i class="dot" style="background:#e6f2ea;border:1px solid #bcd"></i>melhorou</span><span><i class="dot" style="background:#f6e0dd;border:1px solid #dcb"></i>piorou</span><span><i class="dot" style="background:#f0efea;border:1px solid #ccc"></i>estável</span><span><i class="dot" style="background:#e9e8e3"></i>sem comparação (n/d ou série diferente)</span></div>';
  h+='<p class="k">Cada célula mostra o valor do governo e a variação sobre o governo anterior. O veredito é doméstico. Controle = quanto o Executivo federal comanda o instrumento (alto, médio ou baixo). "n/d" = sem valor conferido em fonte oficial: não foi preenchido de memória. Sem série oficial conferida, ficaram de fora: investimento (FBCF), carga tributária, acesso à internet, percepção de corrupção e partidos na Câmara. Pobreza e desigualdade antes de 2012, e desmatamento antes de 2023, aparecem como n/d.</p>';
  groups.forEach(function(gr){
    h+='<div class="sec">'+gr+'</div><div class="tw"><table class="it"><thead><tr><th>Indicador</th><th>Controle</th>';
    GOVS.forEach(function(g){h+='<th>'+SHORT[g.id]+'</th>';});
    h+='</tr></thead><tbody>';
    IND.filter(function(x){return x.g===gr;}).forEach(function(ind){
      var vals=indVals(ind);
      h+='<tr><td>'+ind.n+'<div class="k">Fonte: '+ind.fonte+'</div></td><td>'+(ind.dir===0?'<span class="k">contexto</span>':'<span class="at '+(ind.ctl==='a'?'a':ind.ctl==='m'?'m':'b')+'">'+CTLN[ind.ctl]+'</span>')+'</td>';
      vals.forEach(function(v,i){
        var vr=indVer(ind,i,vals), d=i?indDelta(ind,vals[i-1],v):'';
        var ar=vr==='m'?'▲ ':vr==='p'?'▼ ':vr==='e'?'= ':'';
        h+='<td class="ic '+CELLC[vr]+'" title="'+VI[vr]+(v.s?' · série: '+v.s:'')+'"><b>'+indFmt(ind,v.v)+'</b>'+(v.v!==null&&i&&d?'<small>'+ar+d+'</small>':(vr==='n'&&i&&v.v!==null?'<small>sem base</small>':''))+'</td>';
      });
      h+='</tr>';
    });
    h+='</tbody></table></div>';
  });
  document.getElementById('ind').innerHTML=h;
}

/* ===== Aba: peso do presidente ===== */
function presBlock(g,i){
  var sc=i?score(i):null;
  var h='<details class="gov" id="p-'+g.id+'" open style="--c:'+govColor(g)+'"><summary><span class="gt">'+g.nome+'</span><span class="gp">'+g.periodo+' · '+g.partido+'</span><span class="badge">'+ESP[g.esp][0]+'</span></summary><div class="gbody">';
  if(!sc){ return h+'<p class="ctx">Ponto de partida: sem governo anterior na série. Os valores estão na aba Indicadores.</p></div></details>'; }
  h+='<div class="pres">';
  h+='<div class="pk"><span class="lv">Desempenho ponderado (vs governo anterior)</span><b>'+sgn(sc.w)+' · '+sc.lab+'</b><span>Saldo dos '+sc.n+' indicadores com comparação ('+sc.c.m+' melhoraram, '+sc.c.p+' pioraram, '+sc.c.e+' estáveis), com peso 1 / 0,5 / 0,25 para controle alto / médio / baixo. Favorável ≥ +25% · desfavorável ≤ −25%. Sem ponderar: '+sgn(sc.simple)+'.</span></div>';
  h+='<div class="pk"><span class="lv">Onde veio o resultado</span><b>Controle alto/médio '+sgn(sc.sAc)+'</b><span>Indicadores que o Executivo comanda em parte ou no todo (n='+(sc.G.ac.m+sc.G.ac.p+sc.G.ac.e)+'). Controle baixo (ciclo externo, Estados): <b>'+sgn(sc.sB)+'</b> (n='+(sc.G.b.m+sc.G.b.p+sc.G.b.e)+').</span></div>';
  h+='<div class="pg"><div class="k">Indicadores de controle alto/médio</div>'+ibar(sc.G.ac)+'<div class="k" style="margin-top:6px">Indicadores de controle baixo</div>'+ibar(sc.G.b)+'<div class="k" style="margin-top:4px"><span class="v m">melhorou</span> <span class="v p">piorou</span> <span class="v e">estável</span></div></div>';
  h+='</div>';
  var dims={}; sc.rows.forEach(function(r){var d=dims[r.ind.g]||(dims[r.ind.g]={m:0,p:0,e:0,n:0}); d[r.v]=(d[r.v]||0)+1;});
  h+='<div class="sec">Por dimensão (contra o governo anterior)</div><div class="tw"><table class="pt2"><thead><tr><th>Dimensão</th><th>Melhorou</th><th>Piorou</th><th>Estável</th><th>Sem comparação</th></tr></thead><tbody>';
  Object.keys(dims).forEach(function(k){var d=dims[k]; h+='<tr><td>'+k+'</td><td class="n">'+(d.m||0)+'</td><td class="n">'+(d.p||0)+'</td><td class="n">'+(d.e||0)+'</td><td class="n">'+(d.n||0)+'</td></tr>';});
  h+='</tbody></table></div>';
  h+='<div class="sec">Indicador por indicador contra o governo anterior</div><div class="tw"><table class="pt2"><thead><tr><th>Indicador</th><th>Controle</th><th>Anterior</th><th>Este governo</th><th>Variação</th><th>Veredito</th></tr></thead><tbody>';
  sc.rows.forEach(function(r){
    var a=r.vals[i-1], b=r.vals[i];
    h+='<tr><td>'+r.ind.n+'</td><td><span class="at '+(r.ind.ctl==='a'?'a':r.ind.ctl==='m'?'m':'b')+'">'+CTLN[r.ind.ctl]+'</span></td><td class="n">'+indFmt(r.ind,a.v)+'</td><td class="n">'+indFmt(r.ind,b.v)+'</td><td class="n">'+indDelta(r.ind,a,b)+'</td><td><span class="v '+(r.v==='n'?'n':r.v)+'">'+VI[r.v]+'</span></td></tr>';
  });
  h+='</tbody></table></div></div></details>';
  return h;
}
function presTab(){
  var h='<p class="k">O peso do presidente sai só do conjunto de indicadores da aba Indicadores, todos de séries oficiais. Dois critérios: <b>desempenho ponderado</b> (saldo dos indicadores contra o governo anterior, ponderado pelo controle que o Executivo tem sobre cada um) e <b>onde veio o resultado</b> (separa o que o Executivo comanda do que depende de ciclo externo e de outros entes). O nível de controle de cada indicador é uma regra fixa do projeto, igual para todos os governos. Nenhum critério mede causalidade: mostram o que mudou e quanto do que mudou estava ao alcance do Executivo.</p>';
  GOVS.forEach(function(g,i){h+=presBlock(g,i);});
  document.getElementById('pres').innerHTML=h;
}

/* ===== Aba: meio ambiente e energia ===== */
function ambTab(){
  var h='<p class="k">Inclui desmatamento (também na aba Indicadores), terras indígenas, fontes de eletricidade, emissões e as políticas ambientais e de energia de cada governo.</p>';
  GOVS.forEach(function(g){
    var P=g.pol.filter(function(p){return p.amb;});
    h+='<details class="gov" open style="--c:'+govColor(g)+'"><summary><span class="gt">'+gname(g)+'</span><span class="gp">'+g.periodo+' · '+P.length+' políticas ambientais e de energia mapeadas</span></summary><div class="gbody">'+ambBlock(g);
    if(P.length){h+='<div class="sec">Políticas ambientais e de energia</div>'; P.forEach(function(p){h+=polCard(g,p);});}
    h+='</div></details>';
  });
  document.getElementById('amb').innerHTML=h;
}

/* ===== Aba: governos e políticas ===== */
function govTab(){
  var h='';
  GOVS.forEach(function(g,i){
    h+='<details class="gov" id="'+g.id+'" open style="--c:'+govColor(g)+'">';
    h+='<summary><span class="gt">'+g.nome+'</span><span class="gp">'+g.periodo+' · '+g.partido+'</span><span class="badge">'+ESP[g.esp][0]+'</span></summary><div class="gbody">';
    h+='<p class="ctx"><b>Vice:</b> '+g.vice+' · <b>Perfil:</b> '+g.espNota+'.</p>';
    h+='<p class="ctx"><b>Contexto:</b> '+g.ctx+'</p>';
    if(i===0&&g.base) h+='<p class="ctx"><b>Ponto de partida (1994, governo Itamar):</b> '+g.base+'</p>';
    h+='<div class="sec">Quem comandava os Poderes</div><div class="pow">';
    h+='<div><h4>Executivo</h4><ul><li>'+dotEsp(g.esp)+'<span>'+g.nome+' <span class="k">('+g.partido+')</span></span><span class="per">'+g.periodo+'</span></li><li><span class="k">Vice: '+g.vice+'</span></li></ul></div>';
    h+='<div><h4>Câmara dos Deputados</h4>'+powList(g.camara,true)+'</div>';
    h+='<div><h4>Senado Federal</h4>'+powList(g.senado,true)+'</div>';
    h+='<div><h4>Supremo Tribunal Federal</h4>'+powList(g.stf,false)+'<div class="k" style="margin-top:4px">Ministros constam com quem os indicou.</div></div>';
    h+='</div>';
    var PG=g.pol, om=0;
    h+='<div class="sec">Políticas e decisões dos três Poderes ('+PG.length+')</div>';
    if(om) h+='<p class="k">'+om+' política(s) sem nenhum indicador associado foram omitidas.</p>';
    PG.forEach(function(p){h+=polCard(g,p);});
    h+='<div class="saldo"><b>Saldo geral:</b> '+g.saldo+'</div>';
    h+='</div></details>';
  });
  document.getElementById('govs').innerHTML=h;
}

/* ===== Abas ===== */
var TABS=[["ov","Visão geral"],["ind","Indicadores por dimensão"],["pres","Peso do presidente"],["gov","Governos e políticas"],["amb","Meio ambiente e energia"],["esc","Escândalos"]];
function showTab(k){
  var r=document.getElementById('tab-'+k); if(r) r.checked=true;
  try{history.replaceState(null,'','#'+k);}catch(e){}
  window.scrollTo(0,0);
}
function buildTabs(){
  var rs=document.querySelectorAll('input.tabr');
  for(var i=0;i<rs.length;i++){ rs[i].onchange=function(){ try{history.replaceState(null,'','#'+this.id.replace('tab-',''));}catch(e){} }; }
  var k=(location.hash||'').replace('#',''); if(TABS.some(function(t){return t[0]===k;})){ var r=document.getElementById('tab-'+k); if(r) r.checked=true; }
}

function render(){
  var strip=document.getElementById('strip'), html='';
  GOVS.forEach(function(g){
    html+='<a href="#'+g.id+'" data-gov="'+g.id+'" style="flex:'+(g.fim-g.ini)+';background:'+govColor(g)+'"><b>'+gname(g)+'</b><i>'+g.periodo+' · '+g.partido+'</i></a>';
  });
  strip.innerHTML=html;
  strip.onclick=function(e){
    var a=e.target.closest('a'); if(!a) return; e.preventDefault();
    showTab('gov'); var d=document.getElementById(a.getAttribute('data-gov')); if(d){d.open=true; d.scrollIntoView();}
  };

  var svg=document.getElementById('gdp'), W=1040,H=220,padL=34,padB=22,padT=10;
  var years=Object.keys(GDP).map(Number), n=years.length, bw=(W-padL-8)/n;
  var min=-4,max=8,sy=function(v){return padT+(max-v)*(H-padT-padB)/(max-min);};
  var o='';
  for(var v=-4; v<=8; v+=2){
    o+='<line x1="'+padL+'" x2="'+W+'" y1="'+sy(v)+'" y2="'+sy(v)+'" stroke="#e4e2dc" stroke-width="'+(v===0?1.5:0.7)+'"/>';
    o+='<text x="'+(padL-6)+'" y="'+(sy(v)+4)+'" font-size="10" text-anchor="end" fill="#6b6b66">'+v+'</text>';
  }
  years.forEach(function(y,i){
    var val=GDP[y], x=padL+i*bw+2, g=govOfYear(y), top=sy(Math.max(val,0)), hh=Math.abs(sy(val)-sy(0));
    o+='<rect x="'+x+'" y="'+top+'" width="'+(bw-4)+'" height="'+Math.max(hh,1)+'" fill="'+govColor(g)+'" rx="2"><title>'+y+': '+fmt(val)+'% ('+gname(g)+')</title></rect>';
    o+='<text x="'+(x+(bw-4)/2)+'" y="'+(val>=0?top-3:top+hh+10)+'" font-size="9" text-anchor="middle" fill="#1d1d1b">'+val.toFixed(1).replace('.',',')+'</text>';
    if(y%5===0||y===1996) o+='<text x="'+(x+(bw-4)/2)+'" y="'+(H-6)+'" font-size="10" text-anchor="middle" fill="#6b6b66">'+y+'</text>';
  });
  svg.innerHTML=o;

  [ovTab,indTab,presTab,govTab,ambTab,scandSection,buildFilters,applyFilters,buildTabs].forEach(function(f){try{f();}catch(e){if(window.console)console.error(e);}});
}

function ambBlock(g){
  var R=AMB[g.id]; if(!R) return '';
  var h='<div class="sec">Meio ambiente e energia (comparativo)</div><table class="amb"><thead><tr><th>Indicador</th><th>Este governo</th><th>Governo anterior</th><th>Veredito</th><th>Nota</th></tr></thead><tbody>';
  R.forEach(function(r){ h+='<tr><td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td><td><span class="v '+r[3]+'">'+(r[3]==='n'?'sem veredito':VER[r[3]])+'</span></td><td class="k">'+r[4]+'</td></tr>'; });
  h+='</tbody></table><p class="k">Valores marcados como aproximados vêm de séries do EPE e do ISA que não reverifiquei ano a ano. "Sem veredito" = indicador informativo, sem direção desejável clara (por exemplo, a participação da hidrelétrica cai por diversificação, mas também por seca).</p>';
  return h;
}

function scandSection(){
  var h='';
  GOVS.forEach(function(g){
    var L=SCAND.filter(function(s){return s.g===g.id;});
    if(!L.length) return;
    var cnt={E:0,CE:0,C:0,CD:0,D:0};
    L.forEach(function(s){ var seen={}; s.pt.forEach(function(p){ if(!seen[p[1]]){seen[p[1]]=1; cnt[p[1]]++;} }); });
    h+='<details class="gov" open style="--c:'+govColor(g)+'"><summary><span class="gt">'+g.nome.split(' (')[0]+'</span><span class="gp">'+g.periodo+' · '+L.length+' casos mapeados</span><span class="k">Casos com ao menos um partido do espectro: '
      +['E','CE','C','CD','D'].map(function(k){return ESP[k][0]+' '+cnt[k];}).join(' · ')+'</span></summary><div class="gbody">';
    h+='<table class="sc"><thead><tr><th>Ano</th><th>Caso</th><th>Partidos citados</th><th>O que foi apurado</th><th>Situação</th><th>Impacto econômico</th></tr></thead><tbody>';
    L.forEach(function(s){
      var pts=s.pt.length?s.pt.map(function(p){return '<span class="pty">'+dotEsp(p[1])+p[0]+'</span>';}).join(' '):'<span class="k">sem partido único</span>';
      h+='<tr><td class="n">'+s.a+'</td><td><b>'+s.t+'</b></td><td>'+pts+'</td><td>'+s.fato+'</td><td>'+s.st+'</td><td><span class="v '+(s.imp.k==='n'?'n':s.imp.k==='d'?'d':s.imp.k==='e'?'x':'m')+'">'+IMPK[s.imp.k]+'</span><div>'+s.imp.tx+'</div></td></tr>';
    });
    h+='</tbody></table></div></details>';
  });
  document.getElementById('scand').innerHTML=h;
}

function powList(arr,withPartido){
  return '<ul>'+arr.map(function(p){
    if(withPartido) return '<li>'+dotEsp(p[2])+'<span>'+p[0]+' <span class="k">('+p[1]+')</span></span><span class="per">'+p[3]+'</span></li>';
    return '<li>'+dotEsp(null)+'<span>'+p[0]+'</span><span class="per">'+p[1]+'</span></li>';
  }).join('')+'</ul>';
}


function buildFilters(){
  var f=document.getElementById('flt'), h='<span>Poder de origem:</span>';
  [["all","Todos"],["EX","Executivo"],["LE","Legislativo"],["JU","Judiciário"]].forEach(function(x){h+='<button data-k="po" data-v="'+x[0]+'">'+x[1]+'</button>';});
  h+='<span style="margin-left:10px">Veredito (em qualquer dimensão):</span>';
  [["all","Todos"],["m","melhorou"],["p","piorou"],["x","misto"],["d","disputado"],["i","inconclusivo"]].forEach(function(x){h+='<button data-k="ve" data-v="'+x[0]+'">'+x[1]+'</button>';});
  f.innerHTML=h;
  f.onclick=function(e){
    var b=e.target.closest('button'); if(!b) return;
    fState[b.getAttribute('data-k')]=b.getAttribute('data-v'); applyFilters();
  };
}
function applyFilters(){
  document.querySelectorAll('#flt button').forEach(function(b){
    b.classList.toggle('on',fState[b.getAttribute('data-k')]===b.getAttribute('data-v'));
  });
  document.querySelectorAll('details.pol').forEach(function(d){
    var okP=fState.po==='all'||(' '+d.getAttribute('data-po')+' ').indexOf(' '+fState.po+' ')>=0;
    var okV=fState.ve==='all'||(' '+d.getAttribute('data-ve')+' ').indexOf(' '+fState.ve+' ')>=0;
    d.classList.toggle('hide',!(okP&&okV));
  });
}

function toggleAll(open){document.querySelectorAll('details.gov').forEach(function(d){d.open=open;});document.querySelectorAll('details.pol').forEach(function(d){d.open=open&&false;});}
function allTabs(on){document.querySelectorAll('.tab').forEach(function(t){t.classList.toggle('all',on);});}
window.addEventListener('beforeprint',function(){document.querySelectorAll('details').forEach(function(d){d.open=true;});allTabs(true);});
window.addEventListener('afterprint',function(){allTabs(false);});

function download(name,mime,content){
  var a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([content],{type:mime}));
  a.download=name; document.body.appendChild(a); a.click(); a.remove();
}
function exportJSON(){download('politicas-publicas-brasil-v3.json','application/json',JSON.stringify({governos:GOVS,escandalos:SCAND,indicadores:indJSON()},null,2));}
function indJSON(){
  return IND.map(function(ind){
    var vals=indVals(ind);
    return {grupo:ind.g,indicador:ind.n,controle:CTLN[ind.ctl],dado:ind.q==='o'?'oficial arredondado':'aproximado',nota:ind.nt,
      governos:GOVS.map(function(g,i){var v=indVer(ind,i,vals);return {governo:g.id,valor:vals[i].v,serie:vals[i].s,variacao:i?indDelta(ind,vals[i-1],vals[i]):'',veredito:VI[v]};})};
  });
}
function exportIndCSV(){
  var q=function(s){return '"'+String(s===undefined||s===null?'':s).replace(/"/g,'""')+'"';};
  var L=['\ufeffgrupo;indicador;controle;dado;governo;valor;serie;variacao_vs_anterior;veredito;nota'];
  indJSON().forEach(function(r){r.governos.forEach(function(x){L.push([r.grupo,r.indicador,r.controle,r.dado,x.governo,x.valor===null?'n/d':x.valor,x.serie||'',x.variacao,x.veredito,r.nota].map(q).join(';'));});});
  download('indicadores-por-governo.csv','text/csv;charset=utf-8',L.join('\n'));
}
function exportCSV(){
  var L=['﻿governo;ano;politica;ato;poder_origem;autor;lider;espectro_lider;presidente_camara;presidente_senado;presidente_stf;aprovacao;aplicacao;antes;mudanca;dimensao;indicador;antes_valor;depois_valor;veredito;confianca;leitura'];
  var q=function(s){return '"'+String(s===undefined||s===null?'':s).replace(/"/g,'""')+'"';};
  GOVS.forEach(function(g){g.pol.forEach(function(p){
    var base=[g.nome,p.a,p.t,p.ato,p.po.map(function(x){return PODER[x];}).join('+'),p.autor,p.lider,p.le?ESP[p.le][0]:'n/a',p.cam,p.sen,p.stf,p.apr,p.apl,p.antes,p.mud];
    DIMS.forEach(function(d){
      var rows=p.ef.filter(function(e){return e[0]===d;});
      if(!rows.length){ L.push(base.concat([d,'','','',VER.n,'','']).map(q).join(';')); return; }
      rows.forEach(function(e){ L.push(base.concat([e[0],e[1],e[2],e[3],VER[e[4]],CONF[e[5]],e[6]]).map(q).join(';')); });
    });
  });});
  download('politicas-publicas-brasil-v3.csv','text/csv;charset=utf-8',L.join('\n'));
}
function exportScandCSV(){
  var L=['\ufeffgoverno;ano;caso;partidos_citados;apurado;situacao;tipo_impacto;impacto_economico'];
  var q=function(s){return '"'+String(s===undefined||s===null?'':s).replace(/"/g,'""')+'"';};
  SCAND.forEach(function(s){
    var g=GOVS.filter(function(x){return x.id===s.g;})[0];
    L.push([g.nome,s.a,s.t,s.pt.map(function(p){return p[0]+' ('+ESP[p[1]][0]+')';}).join(', '),s.fato,s.st,IMPK[s.imp.k],s.imp.tx].map(q).join(';'));
  });
  download('escandalos-por-governo.csv','text/csv;charset=utf-8',L.join('\n'));
}
function exportPNG(){
  function go(){
    document.querySelectorAll('details').forEach(function(d){d.open=true;}); allTabs(true);
    var bar=document.getElementById('bar'), flt=document.getElementById('flt'); bar.style.display='none'; if(flt) flt.style.display='none';
    html2canvas(document.getElementById('app'),{scale:1.5,backgroundColor:'#fafaf8'}).then(function(cv){
      bar.style.display=''; if(flt) flt.style.display=''; allTabs(false);
      var a=document.createElement('a'); a.href=cv.toDataURL('image/png'); a.download='politicas-publicas-brasil-v3.png'; a.click();
    });
  }
  if(window.html2canvas){go();return;}
  var s=document.createElement('script');
  s.src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
  s.onload=go; s.onerror=function(){alert('Não foi possível carregar o exportador de PNG (precisa de internet). Use Imprimir / salvar PDF.');};
  document.head.appendChild(s);
}

/* ===== Aviso de versão ===== */
var SITE='https://analises-ashen.vercel.app/';
function showBuild(){var a=document.getElementById('bd'),b=document.getElementById('bv'); if(a)a.textContent=BUILD.d; if(b)b.textContent=BUILD.v;}
function checkVersion(){
  if(window.__PRERENDER||!window.fetch) return;
  var url=(location.protocol==='http:'||location.protocol==='https:'?'':SITE)+'version.json?t='+Date.now();
  fetch(url,{cache:'no-store'}).then(function(r){return r.ok?r.json():null;}).then(function(j){
    if(!j||!j.version||j.version===BUILD.v||window.__updShown) return;
    window.__updShown=true; var u=document.getElementById('upd'); if(u) u.className='on';
  }).catch(function(){});
}
(function(){
  var u=document.getElementById('upd'); if(!u) return;
  document.getElementById('updLater').onclick=function(){u.className='';};
  document.getElementById('updNow').onclick=function(){
    if(location.protocol==='http:'||location.protocol==='https:'){ location.href=location.pathname+'?v='+Date.now(); } else { window.open(SITE,'_blank'); u.className=''; }
  };
  document.addEventListener('visibilitychange',function(){ if(!document.hidden){window.__updShown=false; checkVersion();} });
  setInterval(function(){window.__updShown=false; checkVersion();},30*60*1000);
})();
showBuild();
render();
checkVersion();
</script>
</body>
</html>
