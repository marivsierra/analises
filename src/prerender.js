/* Pré-renderiza o HTML: serializa o DOM depois do JS rodar, para que visualizadores sem JavaScript (ex.: prévia do WhatsApp) mostrem o conteúdo. */
const {chromium}=require('playwright'); const fs=require('fs');
(async()=>{
  const [inp,out]=process.argv.slice(2);
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}).catch(()=>chromium.launch());
  const p=await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e))); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await p.addInitScript(()=>{window.__PRERENDER=true;}); await p.goto('file://'+require('path').resolve(inp)); await p.waitForTimeout(300);
  let html=await p.evaluate(()=>{document.documentElement.removeAttribute('class');return '<!doctype html>\n'+document.documentElement.outerHTML;});
  await b.close();
  if(errs.length){console.error('ERROS',errs);process.exit(1);}
  fs.writeFileSync(out,html); console.log('ok',html.length);
})();
