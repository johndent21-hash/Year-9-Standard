// Rise and run of an interval: a 2-page practice worksheet (Year 9 5.2, Chapter 11, before the length-of-an-interval
// lesson), in the Chapter 10 booklet's style. 12 intervals on grids, page 1 in the first quadrant, page 2 crossing the
// axes. Rise and run are lengths (always positive). No answers printed.
// Build: node worksheets/rise-run.js  →  worksheets/Year9-Rise-and-Run-Worksheet.pdf
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const A = path.resolve(__dirname, '../booklet-source/assets');
const OUT = path.join(__dirname, 'Year9-Rise-and-Run-Worksheet.pdf');
const ACCENT = '#3a1d5e', BLUE = '#3f63be', INK = '#26292e', GRID = '#c9cfdc', AXIS = '#3d3b3c';
const f = (v) => +v.toFixed(2);

// A coordinate grid from x0..x1, y0..y1 with s mm squares, the interval p→q (letters a, b), optionally the worked
// example's right-angled triangle. Axes through 0 when 0 is inside the range, else along the edge.
function grid({ x0, x1, y0, y1, s, p, q, a, b, tri = false }) {
  const m = 5, W = (x1 - x0) * s + 2 * m, H = (y1 - y0) * s + 2 * m;
  const X = (x) => m + (x - x0) * s, Y = (y) => m + (y1 - y) * s;
  let g = '';
  for (let x = x0; x <= x1; x++) g += `<line x1="${f(X(x))}" y1="${f(Y(y0))}" x2="${f(X(x))}" y2="${f(Y(y1))}" stroke="${GRID}" stroke-width="0.18"/>`;
  for (let y = y0; y <= y1; y++) g += `<line x1="${f(X(x0))}" y1="${f(Y(y))}" x2="${f(X(x1))}" y2="${f(Y(y))}" stroke="${GRID}" stroke-width="0.18"/>`;
  const ax = y0 <= 0 && 0 <= y1 ? 0 : y0, ay = x0 <= 0 && 0 <= x1 ? 0 : x0;
  g += `<line x1="${f(X(x0))}" y1="${f(Y(ax))}" x2="${f(X(x1) + 2.2)}" y2="${f(Y(ax))}" stroke="${AXIS}" stroke-width="0.35" marker-end="url(#ar)"/>`;
  g += `<line x1="${f(X(ay))}" y1="${f(Y(y0))}" x2="${f(X(ay))}" y2="${f(Y(y1) - 2.2)}" stroke="${AXIS}" stroke-width="0.35" marker-end="url(#ar)"/>`;
  g += `<text x="${f(X(x1) + 3.2)}" y="${f(Y(ax) + 1)}" class="al">x</text><text x="${f(X(ay))}" y="${f(Y(y1) - 3.3)}" class="al" text-anchor="middle">y</text>`;
  const lab = (x, y, t, anchor) => `<text x="${f(x)}" y="${f(y)}" class="n" text-anchor="${anchor}">${t < 0 ? '−' + -t : t}</text>`;
  for (let x = x0; x <= x1; x++) if (x !== ay || ay !== 0) g += lab(X(x), Y(ax) + 3, x, 'middle');
  for (let y = y0; y <= y1; y++) if (y !== ax) g += lab(X(ay) - 1, Y(y) + 0.8, y, 'end');
  if (ay === 0 && ax === 0) g += lab(X(0) - 1, Y(0) + 3, 0, 'end');
  if (tri) {
    const c = [q[0], p[1]];
    g += `<path d="M${f(X(p[0]))},${f(Y(p[1]))} H${f(X(c[0]))} V${f(Y(q[1]))}" fill="none" stroke="${ACCENT}" stroke-width="0.35" stroke-dasharray="1.2 0.8"/>`;
    g += `<path d="M${f(X(c[0]) - 1.6)},${f(Y(c[1]))} v-1.6 h1.6" fill="none" stroke="${ACCENT}" stroke-width="0.3"/>`;
    g += `<text x="${f((X(p[0]) + X(c[0])) / 2)}" y="${f(Y(c[1]) + 3.4)}" class="t" text-anchor="middle">run = ${Math.abs(q[0] - p[0])}</text>`;
    g += `<text x="${f(X(c[0]) + 1.4)}" y="${f((Y(c[1]) + Y(q[1])) / 2 + 1)}" class="t">rise = ${Math.abs(q[1] - p[1])}</text>`;
  }
  g += `<line x1="${f(X(p[0]))}" y1="${f(Y(p[1]))}" x2="${f(X(q[0]))}" y2="${f(Y(q[1]))}" stroke="${BLUE}" stroke-width="0.6"/>`;
  // each letter sits beyond its end of the interval, so it never touches the line
  const L = Math.hypot(X(q[0]) - X(p[0]), Y(q[1]) - Y(p[1])), ux = (X(q[0]) - X(p[0])) / L, uy = (Y(q[1]) - Y(p[1])) / L;
  [[p, a, -1], [q, b, 1]].forEach(([pt, t, k]) => {
    g += `<circle cx="${f(X(pt[0]))}" cy="${f(Y(pt[1]))}" r="0.9" fill="${BLUE}"/>`;
    g += `<text x="${f(X(pt[0]) + k * ux * 3.3)}" y="${f(Y(pt[1]) + k * uy * 3.3 + 1.1)}" class="pt" text-anchor="middle">${t}</text>`;
  });
  return `<svg viewBox="0 0 ${f(W + 3)} ${f(H)}" width="${f(W + 3)}mm" height="${f(H)}mm"><defs><marker id="ar" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="${AXIS}"/></marker></defs>${g}</svg>`;
}

// Page 1: first quadrant, uphill then downhill. Page 2: the intervals cross one axis, then both.
const P1 = { x0: 0, x1: 10, y0: 0, y1: 8, s: 4.2 };
const P2 = { x0: -6, x1: 6, y0: -5, y1: 5, s: 5.1 };
const Q = [
  [P1, [1, 1], [4, 5]], [P1, [2, 1], [8, 4]], [P1, [1, 2], [7, 7]],
  [P1, [1, 6], [5, 1]], [P1, [2, 7], [9, 3]], [P1, [1, 7], [9, 1]],
  [P2, [-4, 1], [2, 4]], [P2, [1, -3], [5, 2]], [P2, [-3, 5], [4, 1]],
  [P2, [-5, -4], [-2, 3]], [P2, [-5, 3], [3, -3]], [P2, [-5, -2], [4, -5]],
];
const LET = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const card = (i) => {
  const [G, p, q] = Q[i];
  return `<div class="card"><div class="num">${i + 1}</div><div class="fig">${grid({ ...G, p, q, a: LET[2 * i], b: LET[2 * i + 1] })}</div>
    <div class="ans"><span>Rise =</span><i></i><span>Run =</span><i></i></div></div>`;
};
const band = `<div class="band"><img src="file://${A}/kingscliff-logo.png"><div><div class="kick">Mathematics · Year 9 · Chapter 11</div>
  <div class="title">Rise and run of an interval</div></div><div class="tag">Practice</div></div>`;
const foot = (n) => `<div class="foot"><span>Kingscliff High School · Year 9 Mathematics</span><b>${n}</b><span>Chapter 11 · Coordinate geometry</span></div>`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Lexend; font-weight: 400; src: url(file://${A}/lexend-latin-400-normal.woff2); }
@font-face { font-family: Lexend; font-weight: 600; src: url(file://${A}/lexend-latin-600-normal.woff2); }
@font-face { font-family: Lexend; font-weight: 700; src: url(file://${A}/lexend-latin-700-normal.woff2); }
@page { size: A4; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: Lexend, sans-serif; color: ${INK}; font-size: 9.5pt; line-height: 1.3; }
.page { width: 210mm; height: 297mm; position: relative; overflow: hidden; page-break-after: always; }
.band { position: absolute; top: 0; left: 0; right: 0; height: 14.5mm; display: flex; align-items: center; gap: 4mm; padding: 0 12mm 0 10mm; color: #fff;
  background: linear-gradient(90deg, #3d3b3c 38%, rgba(61,59,60,0.55) 70%, rgba(61,59,60,0.1)), url(file://${A}/mandelbrot/silver-spiral-band.jpg) right center / auto 100% no-repeat, #3d3b3c;
  border-bottom: 0.9mm solid ${ACCENT}; }
.band img { height: 9mm; background: #fff; border-radius: 1.2mm; padding: 0.8mm 1.5mm; }
.kick { font-size: 6.5pt; letter-spacing: 0.2em; text-transform: uppercase; color: #d9d6cc; font-weight: 600; }
.title { font-size: 12pt; font-weight: 600; }
.tag { margin-left: auto; font-size: 7.5pt; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; background: rgba(255,255,255,0.92); color: #3d3b3c; padding: 1mm 2.5mm; border-radius: 1mm; }
.content { position: absolute; top: 20mm; left: 10mm; right: 10mm; bottom: 13mm; display: flex; flex-direction: column; gap: 4mm; }
.name { display: flex; gap: 4mm; font-size: 8pt; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #3d3b3c; }
.name i { flex: 1; border-bottom: 0.3mm solid #d8d4c4; }
.box { border: 0.6mm solid; border-radius: 2.5mm; padding: 3mm 3.5mm; }
.we { border-color: #3d3b3c; background: #f1f1f1; display: flex; gap: 5mm; align-items: center; }
.you { border-color: ${BLUE}; background: #e6ecf8; flex: 1; display: flex; flex-direction: column; gap: 2.5mm; }
.chip { display: inline-block; color: #fff; font-weight: 700; letter-spacing: 0.1em; padding: 0.8mm 3mm; border-radius: 1.2mm; font-size: 9pt; margin-right: 2mm; }
.head { font-weight: 600; font-size: 9.5pt; }
.you .head { color: ${BLUE}; }
.steps { flex: 1; }
.steps ol { margin: 2mm 0 0 5mm; display: flex; flex-direction: column; gap: 1.2mm; }
.steps .res { margin-top: 2.5mm; font-weight: 700; color: ${ACCENT}; }
.rem { background: #fff; border-left: 1mm solid ${BLUE}; padding: 1.5mm 3mm; font-size: 8.5pt; }
.rem b { color: ${BLUE}; letter-spacing: 0.12em; font-size: 7.5pt; margin-right: 2mm; }
.cards { flex: 1; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); grid-auto-rows: minmax(0, 1fr); gap: 3mm; }
.card { position: relative; min-height: 0; background: #fff; border: 0.3mm solid #b9c6e6; border-radius: 2mm; padding: 2.5mm; display: flex; flex-direction: column; }
.num { position: absolute; top: 2.5mm; left: 2.5mm; width: 6.5mm; height: 6.5mm; border-radius: 50%; border: 0.4mm solid ${BLUE}; color: ${BLUE}; font-weight: 700; display: flex; align-items: center; justify-content: center; font-size: 9pt; }
.fig { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; }
.ans { display: grid; grid-template-columns: auto 1fr auto 1fr; gap: 2mm; align-items: end; font-weight: 600; font-size: 9pt; margin-top: 2mm; }
.ans i { border-bottom: 0.3mm solid #8f9bb8; height: 5mm; }
svg text { font-family: Lexend, sans-serif; }
.n { font-size: 2.3px; fill: #555; paint-order: stroke; stroke: #fff; stroke-width: 0.6px; }
.al { font-size: 2.8px; font-style: italic; fill: ${AXIS}; }
.pt { font-size: 3.2px; font-weight: 700; fill: ${BLUE}; paint-order: stroke; stroke: #fff; stroke-width: 0.7px; }
.t { font-size: 2.8px; font-weight: 700; fill: ${ACCENT}; paint-order: stroke; stroke: #fff; stroke-width: 0.6px; }
.foot { position: absolute; bottom: 5mm; left: 10mm; right: 10mm; display: flex; justify-content: space-between; align-items: center; font-size: 7pt; color: #6b6a64; }
.foot b { width: 7mm; height: 7mm; border-radius: 50%; border: 0.5mm solid ${ACCENT}; color: ${ACCENT}; display: flex; align-items: center; justify-content: center; font-size: 8pt; }
</style></head><body>
<div class="page">${band}<div class="content">
  <div class="name"><span>Name</span><i></i><span>Date</span><i style="flex:0.4"></i></div>
  <div class="box we">${grid({ ...P1, s: 4.1, p: [2, 2], q: [6, 5], a: 'P', b: 'Q', tri: true })}
    <div class="steps"><span class="chip" style="background:#3d3b3c">EXAMPLE</span><span class="head">Find the rise and run of the interval PQ.</span>
      <ol><li>Draw a right-angled triangle with the interval as its longest side.</li>
      <li><b>Run:</b> count the squares <b>across</b> from one end to the other.</li>
      <li><b>Rise:</b> count the squares <b>up or down</b> from one end to the other.</li>
      <li>Rise and run are lengths, so they are <b>never negative</b>.</li></ol>
      <div class="res">Rise = 3 units, run = 4 units</div></div></div>
  <div class="box you"><div><span class="chip" style="background:${BLUE}">YOU DO</span><span class="head">Questions 1–6: draw the triangle, then find the rise and run of each interval.</span></div>
    <div class="rem"><b>REMEMBER</b>Count squares across for the run, and up or down for the rise.</div>
    <div class="cards">${[0, 1, 2, 3, 4, 5].map(card).join('')}</div></div>
</div>${foot(1)}</div>
<div class="page">${band}<div class="content">
  <div class="box you"><div><span class="chip" style="background:${BLUE}">YOU DO</span><span class="head">Questions 7–12: these intervals cross the axes. Find the rise and run of each interval.</span></div>
    <div class="rem"><b>REMEMBER</b>Count the squares, not the numbers on the axes. A rise or run is never negative.</div>
    <div class="cards">${[6, 7, 8, 9, 10, 11].map(card).join('')}</div></div>
</div>${foot(2)}</div>
</body></html>`;

(async () => {
  let pw;
  try { pw = require('playwright'); } catch { pw = require(require.resolve('playwright', { paths: [execSync('npm root -g').toString().trim()] })); }
  const browser = await pw.chromium.launch();
  const page = await browser.newPage();
  const tmp = path.join(__dirname, '.rise-run.html');
  fs.writeFileSync(tmp, html);
  await page.goto('file://' + tmp);
  await page.evaluate(() => document.fonts.ready);
  // layout check: nothing may spill out of a card or a page
  const bad = await page.evaluate(() => [...document.querySelectorAll('.card, .content')].filter((e) => e.scrollHeight > e.clientHeight + 1 || e.scrollWidth > e.clientWidth + 1).map((e) => `${e.className} ${e.scrollWidth}x${e.scrollHeight} > ${e.clientWidth}x${e.clientHeight}`));
  await page.pdf({ path: OUT, format: 'A4', printBackground: true, preferCSSPageSize: true });
  await browser.close();
  fs.unlinkSync(tmp);
  console.log(`${OUT}\n${bad.length ? `Layout check: overflow in ${bad.join('; ')}` : 'Layout check: no problems found'}`);
})();
