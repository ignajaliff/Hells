import { chromium } from 'playwright'
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 } })
await p.goto('http://localhost:3000'); await p.waitForTimeout(4500)
const top = await p.evaluate(() => document.querySelector('video').closest('li').getBoundingClientRect().top + scrollY)
await p.evaluate(y=>scrollTo(0,y), top+195-422); await p.waitForTimeout(600)
console.log(await p.evaluate(()=>{const r=document.querySelector('img[alt="Belcebú"]').getBoundingClientRect(); return {w:Math.round(r.width),left:Math.round(r.left)}}))
await p.screenshot({ path: process.env.TMP+'/belsebu/sticker2.png', clip:{x:0,y:200,width:390,height:420} })
await b.close(); process.exit(0)
