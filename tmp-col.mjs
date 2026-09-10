import { chromium } from 'playwright'
const b = await chromium.launch()
const p = await b.newPage({ viewport:{width:390,height:844} })
const errs=[]; p.on('pageerror', e=>errs.push(String(e).slice(0,200))); p.on('console', m=>{ if(m.type()==='error') errs.push('console: '+m.text().slice(0,200)) })
await p.goto('http://localhost:3001',{waitUntil:'domcontentloaded'})
await p.waitForSelector('#carta',{timeout:120000}); await p.waitForTimeout(4500)
await p.evaluate(()=>document.querySelector('#carta').scrollIntoView()); await p.waitForTimeout(1000)
const d = await p.evaluate(()=>{
  const s=document.querySelector('#carta')
  const sils=[...s.querySelectorAll('img')].filter(i=>i.src.includes('silueta')).slice(0,4).map(i=>{const d=i.closest('div'); const r=d.getBoundingClientRect(); return {f:i.src.split('%2F').pop().split('.')[0], left:+r.left.toFixed(0), top:+r.top.toFixed(0), w:+r.width.toFixed(0), vis:getComputedStyle(d).visibility, z:getComputedStyle(d).zIndex, tr:getComputedStyle(d).transform.slice(0,40)}})
  const rail=[...s.querySelectorAll('div')].find(x=>x.className.includes('snap-x'))
  const esc=rail.parentElement.getBoundingClientRect()
  return { escenario:{w:+esc.width.toFixed(0),h:+esc.height.toFixed(0)}, rail:{sw:rail.scrollWidth, cw:rail.clientWidth, sl:rail.scrollLeft, hijos:rail.children.length}, sils }
})
console.log(JSON.stringify(d,null,1)); console.log('errores:', errs.length?errs:'ninguno')
await b.close()
