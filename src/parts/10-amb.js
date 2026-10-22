/* Meio ambiente e energia: auxiliar (add) e contêiner AMB. Os dados ficam em 10-amb-<governo>.js */
function add(id,p){var g=GOVS.filter(function(x){return x.id===id;})[0]; if(!g) throw new Error('AMB: governo '+id); p.amb=1; g.pol.push(p);}
var AMB={};
