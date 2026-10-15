// fit.js <lesson html>: the layout checks for a three-page lesson, in one report.
//   OVER    a question box (or Notes box, WE DO part, worded problem) whose contents run past its border
//   GAP     a box whose last writing line sits less than 0.9 mm above its bottom border
//   SCALE   a YOU DO diagram printed at less than 93% of its drawn size (its labels shrink below about 7.5 pt)
//   EDGE    a box or diagram poking out of its zone or cell
//   PAGE    content running past the bottom of the page, or a lesson that is not 3 pages
// Exit code 1 if anything FAILs. Diagram scales for every box are listed so you can tune sizes.
const path = require('path');
(async () => {
  let pw; try { pw = require('playwright'); } catch { pw = require(require.resolve('playwright', { paths: [require('child_process').execSync('npm root -g').toString().trim()] })); }
  const b = await pw.chromium.launch(); const pg = await b.newPage();
  await pg.goto('file://' + path.resolve(process.argv[2]));
  const want = +(process.argv[3] || 3); // the page count to expect (a whole booklet: 32)
  const r = await pg.evaluate((want) => {
    const mm = 96 / 25.4, out = [], fails = [];
    const pages = [...document.querySelectorAll('section.page')];
    if (pages.length !== want) fails.push(`PAGE: ${pages.length} pages (want ${want})`);
    pages.forEach((p, i) => {
      const P = `p${i + 1}`;
      const c = p.querySelector('.content'); if (c) { const cb = c.getBoundingClientRect().bottom; const bot = Math.max(...[...c.children].map((k) => k.getBoundingClientRect().bottom)); if (bot > cb + 1) fails.push(`PAGE ${P}: content ${((bot - cb) / mm).toFixed(1)} mm past the page`); }
      const boxName = (el) => { const n = el.querySelector('.q-num, .part-l'); return `${el.className.split(' ')[0]}${n ? ' ' + n.textContent.trim() : ''}`; };
      p.querySelectorAll('.wq, .wp, .notes-box, .ex-part').forEach((el) => {
        const eb = el.getBoundingClientRect(); const deep = Math.max(...[...el.querySelectorAll('*')].map((e) => e.getBoundingClientRect().bottom));
        if (deep > eb.bottom + 0.3 * mm) fails.push(`OVER ${P} ${boxName(el)}: ${((deep - eb.bottom) / mm).toFixed(1)} mm`);
        const lines = [...el.querySelectorAll('.fq-line i, .wq-ans i')]; if (lines.length) { const g = (eb.bottom - lines.pop().getBoundingClientRect().bottom) / mm; if (g < 0.9) fails.push(`GAP ${P} ${boxName(el)}: last line ${g.toFixed(1)} mm from the border`); }
        const er = el.getBoundingClientRect();
        el.querySelectorAll('.graph').forEach((gEl) => { const gr = gEl.getBoundingClientRect(); if (gr.right > er.right + 0.3 * mm || gr.left < er.left - 0.3 * mm) fails.push(`EDGE ${P} ${boxName(el)}: diagram wider than its box`); });
      });
      p.querySelectorAll('.zone').forEach((z) => { const zr = z.getBoundingClientRect(); z.querySelectorAll('.wq, .wp, .ex-part').forEach((el) => { const r2 = el.getBoundingClientRect(); if (r2.right > zr.right - 1 * mm || r2.left < zr.left + 1 * mm || r2.bottom > zr.bottom - 0.8 * mm) fails.push(`EDGE ${P} ${boxName(el)}: outside its zone`); }); });
      const sc = [...p.querySelectorAll('.graph')].map((gEl) => {
        const vb = gEl.viewBox.baseVal, gr = gEl.getBoundingClientRect(), k = Math.min(gr.width / mm / vb.width, gr.height / mm / vb.height);
        const host = gEl.closest('.wq, .ex-part, .nb-fig'); const name = host ? boxName(host) : 'fig';
        if (host && host.classList.contains('wq') && k < 0.93) fails.push(`SCALE ${P} ${name}: diagram at ${(k * 100).toFixed(0)}% (labels about ${(8 * k).toFixed(1)} pt)`);
        if (host && host.classList.contains('ex-part') && k < 0.9) fails.push(`SCALE ${P} ${name}: example diagram at ${(k * 100).toFixed(0)}%`);
        return `${name.replace('wq ', 'Q').replace('ex-part ', 'ex')}:${k.toFixed(2)}`; });
      out.push(`${P} diagram scales: ${sc.join(' ')}`);
      const free = [...p.querySelectorAll('.wq')].map((el) => { const s = el.querySelector('.wq-space, .fq-lines'); const l = el.querySelector('.fq-line'); return s ? ((s.getBoundingClientRect().height - (l ? 3 * l.getBoundingClientRect().height : 0)) / mm).toFixed(0) : '-'; });
      out.push(`${P} blank working space per box (mm): ${free.join(' ')}`);
    });
    return { out, fails };
  }, want);
  console.log(r.out.join('\n'));
  console.log(r.fails.length ? `FAIL (${r.fails.length}):\n  ${r.fails.join('\n  ')}` : 'PASS: no overflow, gaps, small diagrams or edges');
  await b.close();
  process.exit(r.fails.length ? 1 : 0);
})();
