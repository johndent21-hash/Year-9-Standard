// node year9-standard/ch10-extension/check.js: checks every question card of the built extension booklet.
//   OVER   a card's contents run past its border
//   ROOM   the blank working space is under 20 mm tall (16 mm for a one-star card, 28 mm for a "Draw a diagram" card)
//   SCALE  a diagram prints at under 95% of its drawn size (its labels shrink)
// It lists each card's working space so the row heights (g in lessons/<code>.js) can be tuned. Exit code 1 on a FAIL.
const path = require('path');
(async () => {
  let pw; try { pw = require('playwright'); } catch { pw = require(require.resolve('playwright', { paths: [require('child_process').execSync('npm root -g').toString().trim()] })); }
  const b = await pw.chromium.launch(); const pg = await b.newPage();
  await pg.goto('file://' + path.join(__dirname, 'Year9-Standard-Ch10-Extension-Fast-Finishers.html'));
  await pg.evaluate(() => document.fonts.ready);
  const r = await pg.evaluate(() => {
    const mm = 96 / 25.4, fails = [], rows = [];
    document.querySelectorAll('section.page.xt').forEach((p, i) => {
      const code = p.querySelector('.xt-code b').textContent;
      p.querySelectorAll('.xq').forEach((q) => {
        const n = q.querySelector('.xq-num').textContent, name = `p${i + 2} ${code} Q${n}`;
        if (q.scrollHeight > q.clientHeight + 1) fails.push(`OVER ${name}: ${((q.scrollHeight - q.clientHeight) / mm).toFixed(1)} mm`);
        const w = q.querySelector('.xq-work').getBoundingClientRect().height / mm, want = q.classList.contains('drawq') ? 28 : q.querySelectorAll('.xq-stars polygon:not([fill="none"])').length === 1 ? 16 : 20;
        if (w < want) fails.push(`ROOM ${name}: ${w.toFixed(1)} mm (want ${want})`);
        const g = q.querySelector('svg.graph');
        const s = g ? g.getBoundingClientRect().width / mm / parseFloat(g.style.getPropertyValue('--w')) : 1;
        if (s < 0.95) fails.push(`SCALE ${name}: ${(s * 100).toFixed(0)}%`);
        rows.push(`${name}: working ${w.toFixed(0)} mm${g ? `, diagram ${(s * 100).toFixed(0)}%` : ''}`);
      });
    });
    return { fails, rows };
  });
  await b.close();
  console.log(r.rows.join('\n'));
  console.log(r.fails.length ? `FAIL\n  ${r.fails.join('\n  ')}` : 'PASS');
  process.exit(r.fails.length ? 1 : 0);
})();
