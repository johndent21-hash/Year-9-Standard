// Year 10 Yearly Test 2026 revision booklet (Year 10 Transition, Kingscliff High School).
// Builds two PDFs into "../Year 10 yearly test revision":
//   Year10-Yearly-Test-2026-Revision-Booklet.pdf   questions, then the help sheet, then the answer key
//   Year10-Yearly-Test-2026-Help-Sheet.pdf         the help sheet on its own
// Every answer is calculated here from the question's numbers.
//   node build.js [--shots <dir>]

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const OUT = path.join(__dirname, '..', 'Year 10 yearly test revision');
const BUILD = path.join(__dirname, 'build');
const LOGO = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, 'assets', 'kingscliff-logo.png')).toString('base64');

// ---------- number formatting ----------
const space = (s) => { const [i, d] = s.split('.'); const j = i.length >= 5 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : i; return d ? j + '.' + d : j; };
const num = (x, dp) => space(dp === undefined ? String(+x.toFixed(6)) : x.toFixed(dp));
const money = (x) => { const r = Math.round(x * 100) / 100; return '$' + (Number.isInteger(r) ? num(r) : num(r, 2)); };
const d1 = (x) => num(x, 1);
const fr = (a, b) => `<span class="fr"><span>${a}</span><span>${b}</span></span>`;
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const frac = (a, b) => { const g = gcd(a, b); return b / g === 1 ? String(a / g) : fr(a / g, b / g); };
const fracW = (a, b) => (gcd(a, b) === 1 ? fr(a, b) : `${fr(a, b)} = ${frac(a, b)}`);
const v = (s) => `<i class="v">${s}</i>`;
const sup = (s) => `<sup>${s}</sup>`;

// ---------- figures (inline SVG) ----------
const S = (w, h, body) => `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" font-size="12">${body}</svg>`;
const T = (x, y, t, a = 'middle', extra = '') => `<text x="${x}" y="${y}" text-anchor="${a}" ${extra}>${t}</text>`;
const STROKE = 'stroke="#1f3864" stroke-width="1.6" fill="#eaf2fb"';
const rightMark = (x, y, dx, dy) => `<path d="M${x + dx} ${y} L${x + dx} ${y + dy} L${x} ${y + dy}" fill="none" stroke="#1f3864" stroke-width="1"/>`;
const fig = {
  rect(top, side) {
    return S(170, 96, `<rect x="10" y="10" width="120" height="66" ${STROKE}/>` + T(70, 92, top) + T(136, 47, side, 'start'));
  },
  circle(label, diameter = false) {
    const line = diameter
      ? `<line x1="15" y1="50" x2="95" y2="50" stroke="#c00000" stroke-width="1.6"/>` + T(55, 44, label)
      : `<line x1="55" y1="50" x2="95" y2="50" stroke="#c00000" stroke-width="1.6"/>` + T(75, 44, label);
    return S(112, 100, `<circle cx="55" cy="50" r="40" ${STROKE}/><circle cx="55" cy="50" r="2" fill="#1f3864"/>` + line);
  },
  triangle(b, h) {
    return S(150, 100, `<path d="M10 80 L130 80 L45 15 Z" ${STROKE}/><line x1="45" y1="15" x2="45" y2="80" stroke="#c00000" stroke-dasharray="4 3"/>` +
      `<path d="M45 72 L53 72 L53 80" fill="none" stroke="#1f3864"/>` + T(70, 95, b) + T(40, 52, h, 'end'));
  },
  trap(a, b, h) {
    return S(160, 104, `<path d="M15 80 L135 80 L105 20 L45 20 Z" ${STROKE}/><line x1="75" y1="20" x2="75" y2="80" stroke="#c00000" stroke-dasharray="4 3"/>` +
      `<path d="M75 72 L83 72 L83 80" fill="none" stroke="#1f3864"/>` + T(75, 14, a) + T(75, 96, b) + T(88, 54, h, 'start'));
  },
  box(l, w, h) {
    return S(210, 110, `<g transform="translate(30 0)"><path d="M15 45 L125 45 L125 95 L15 95 Z" ${STROKE}/><path d="M15 45 L50 15 L160 15 L125 45 Z" stroke="#1f3864" stroke-width="1.6" fill="#d7e6f6"/>` +
      `<path d="M125 45 L160 15 L160 65 L125 95 Z" stroke="#1f3864" stroke-width="1.6" fill="#c3d7ee"/>` +
      T(70, 108, l) + T(148, 88, w, 'start') + T(10, 74, h, 'end') + '</g>');
  },
  cube(s) {
    return S(120, 112, `<path d="M15 35 L75 35 L75 95 L15 95 Z" ${STROKE}/><path d="M15 35 L40 12 L100 12 L75 35 Z" stroke="#1f3864" stroke-width="1.6" fill="#d7e6f6"/>` +
      `<path d="M75 35 L100 12 L100 72 L75 95 Z" stroke="#1f3864" stroke-width="1.6" fill="#c3d7ee"/>` + T(45, 110, s));
  },
  cyl(r, h) {
    return S(150, 136, `<path d="M20 28 L20 114 A40 10 0 0 0 100 114 L100 28" ${STROKE}/><ellipse cx="60" cy="28" rx="40" ry="10" stroke="#1f3864" stroke-width="1.6" fill="#d7e6f6"/>` +
      `<line x1="60" y1="28" x2="100" y2="28" stroke="#c00000" stroke-width="1.6"/>` + T(80, 12, r) + T(106, 76, h, 'start'));
  },
  pyth(a, b, c = 'c') {
    // right angle bottom-right, a = vertical, b = horizontal
    return S(170, 110, `<path d="M15 90 L135 90 L135 20 Z" ${STROKE}/><path d="M125 90 L125 80 L135 80" fill="none" stroke="#1f3864"/>` +
      T(75, 105, b) + T(141, 58, a, 'start') + T(66, 50, c, 'end', 'font-style="italic" font-weight="bold"'));
  },
  trig(angle, adj) {
    return S(215, 110, `<path d="M15 90 L145 90 L145 20 Z" ${STROKE}/><path d="M135 90 L135 80 L145 80" fill="none" stroke="#1f3864"/>` +
      `<path d="M43 90 A28 28 0 0 0 40 77" fill="none" stroke="#c00000" stroke-width="1.4"/>` + T(50, 84, angle + '°', 'start') +
      T(80, 105, adj + ' (adjacent)') + T(151, 52, '<tspan font-style="italic" font-weight="bold">x</tspan>', 'start') + T(151, 66, '(opposite)', 'start', 'font-size="10"'));
  },
  line(title, labels, values, ymax, step, ylab) {
    const W = 250, H = 150, x0 = 40, y0 = 118, pw = 195, ph = 95;
    let g = '';
    for (let y = 0; y <= ymax; y += step) { const yy = y0 - (y / ymax) * ph; g += `<line x1="${x0}" y1="${yy}" x2="${x0 + pw}" y2="${yy}" stroke="#d9e2ee"/>` + T(x0 - 4, yy + 4, y, 'end', 'font-size="10"'); }
    const dx = pw / labels.length;
    const pts = values.map((val, i) => [x0 + dx * (i + 0.5), y0 - (val / ymax) * ph]);
    labels.forEach((l, i) => { g += T(x0 + dx * (i + 0.5), y0 + 13, l, 'middle', 'font-size="10"'); });
    g += `<polyline points="${pts.map((p) => p.join(',')).join(' ')}" fill="none" stroke="#2e75b6" stroke-width="2"/>` + pts.map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="#1f3864"/>`).join('');
    g += `<line x1="${x0}" y1="${y0}" x2="${x0 + pw}" y2="${y0}" stroke="#1f3864"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0 - ph - 4}" stroke="#1f3864"/>`;
    g += T(x0 + pw / 2, 12, title, 'middle', 'font-weight="bold" font-size="11"') + T(x0 + pw / 2, H - 2, 'Month', 'middle', 'font-size="10"') + `<text x="10" y="${y0 - ph / 2}" font-size="10" text-anchor="middle" transform="rotate(-90 10 ${y0 - ph / 2})">${ylab}</text>`;
    return S(W, H, g);
  },
  columns(labels, values, ymax, xlab) {
    const W = 260, H = 150, x0 = 34, y0 = 118, pw = 215, ph = 95;
    let g = '';
    for (let y = 0; y <= ymax; y += 1) { const yy = y0 - (y / ymax) * ph; g += `<line x1="${x0}" y1="${yy}" x2="${x0 + pw}" y2="${yy}" stroke="#e3e9f1"/>` + (y % 2 === 0 ? T(x0 - 4, yy + 4, y, 'end', 'font-size="10"') : ''); }
    const dx = pw / labels.length;
    values.forEach((val, i) => { const hh = (val / ymax) * ph; g += `<rect x="${x0 + dx * i}" y="${y0 - hh}" width="${dx}" height="${hh}" fill="#9dc3e6" stroke="#1f3864"/>`; });
    labels.forEach((l, i) => { g += T(x0 + dx * (i + 0.5), y0 + 13, l, 'middle', 'font-size="10"'); });
    g += `<line x1="${x0}" y1="${y0}" x2="${x0 + pw}" y2="${y0}" stroke="#1f3864"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0 - ph - 4}" stroke="#1f3864"/>`;
    g += T(x0 + pw / 2, H - 2, xlab, 'middle', 'font-size="10"') + `<text x="10" y="${y0 - ph / 2}" font-size="10" text-anchor="middle" transform="rotate(-90 10 ${y0 - ph / 2})">Frequency</text>`;
    return S(W, H, g);
  },
  spinner(n, red) {
    let g = '';
    for (let i = 0; i < n; i++) {
      const a1 = (i / n) * 2 * Math.PI - Math.PI / 2, a2 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2;
      const p = (a) => [50 + 40 * Math.cos(a), 50 + 40 * Math.sin(a)].map((z) => z.toFixed(1)).join(' ');
      const isRed = i < red;
      g += `<path d="M50 50 L${p(a1)} A40 40 0 0 1 ${p(a2)} Z" fill="${isRed ? '#e06666' : '#ffffff'}" stroke="#1f3864" stroke-width="1.2"/>`;
      const m = (a1 + a2) / 2;
      g += T((50 + 26 * Math.cos(m)).toFixed(1), (54 + 26 * Math.sin(m)).toFixed(1), isRed ? 'R' : 'W', 'middle', 'font-size="10"');
    }
    return S(100, 100, g);
  },
};
const stemLeaf = (rows, key) => `<table class="sl"><tr><th>Stem</th><th>Leaf</th></tr>${rows.map(([s, l]) => `<tr><td>${s}</td><td>${l.join(' ')}</td></tr>`).join('')}</table><div class="key">${key}</div>`;

// ---------- question and answer builders ----------
const answers = { A: [], B: [], C: [], D: [] };
let qn = 0;
const parts = (list, cols = 2) => `<div class="parts c${cols}">${list.map((p, i) => `<div><b>${String.fromCharCode(97 + i)}</b> ${p}</div>`).join('')}</div>`;
const steps = (list) => `<ol class="steps">${list.map((p, i) => `<li><b>${String.fromCharCode(97 + i)}</b> ${p}</li>`).join('')}</ol>`;
function Q(sec, topic, help, body, figure) {
  qn += 1;
  const f = figure ? `<div class="fig">${figure}</div>` : '';
  return { n: qn, html: `<div class="q"><div class="n">${qn}</div><div class="body"><div class="qhead"><span class="topic">${topic}</span><span class="help">Help sheet ${help}</span></div><div class="flex"><div class="grow">${body}</div>${f}</div></div></div>`, sec };
}
function A(sec, n, topic, rows, cols = 1) {
  const body = rows.map((r, i) => `<div class="pt">${rows.length > 1 || r.label ? `<b>${r.label || String.fromCharCode(97 + i)}</b> ` : ''}${r.w ? `<span class="w">${r.w}</span> ` : ''}${r.w ? '→ ' : ''}<span class="ans">${r.a}</span></div>`).join('');
  answers[sec].push(`<div class="q"><div class="n">${n}</div><div class="body"><div class="topic">${topic}</div><div class="${cols === 2 ? 'grid2' : ''}">${body}</div></div></div>`);
}
const mcOpts = (opts) => `<div class="mc${opts.some((o) => o.replace(/<[^>]+>/g, '').length > 14) ? ' long' : ''}">${opts.map((o, i) => `<span><b>${'ABCD'[i]}</b> ${o}</span>`).join('')}</div>`;

// ================= SECTION A: FINANCIAL MATHEMATICS =================
const secA = [];
{
  // MC (test Q1-4)
  let q = Q('A', 'Multiple choice', 'A1–A4', `<p>Choose the correct answer: A, B, C or D.</p>
    ${steps([`What is 18% of $65? ${mcOpts(['$11.70', '$18.00', '$53.30', '$83.00'])}`,
      `A price tag says “$99 (GST inc.)”. How much GST is included? ${mcOpts(['$9.00', '$9.90', '$90.00', '$108.90'])}`,
      `A bag costs $40. It is discounted by 15%. What is the new price? ${mcOpts(['$6.00', '$25.00', '$34.00', '$46.00'])}`,
      `Find the simple interest on $500 at 6% per year for 3 years. ${mcOpts(['$9.00', '$30.00', '$90.00', '$590.00'])}`])}`);
  secA.push(q);
  const mcA = [[0.18 * 65, 'A'], [99 / 11, 'A'], [40 * 0.85, 'C'], [500 * 0.06 * 3, 'C']];
  A('A', q.n, 'Multiple choice', [
    { w: '0.18 × 65 = $11.70', a: 'A' }, { w: '99 ÷ 11 = $9', a: 'A' },
    { w: '40 × 0.15 = $6, 40 − 6 = $34', a: 'C' }, { w: '500 × 0.06 × 3 = $90', a: 'C' }], 2);
  if (Math.abs(mcA[0][0] - 11.7) > 1e-9 || mcA[1][0] !== 9 || mcA[2][0] !== 34 || Math.abs(mcA[3][0] - 90) > 1e-9) throw new Error('Section A MC answers changed');

  // Percentage of an amount
  const pc = [[15, 60], [32, 75], [8, 240], [45, 120]];
  q = Q('A', 'Percentage of an amount', 'A1', `<p>Find:</p>${parts(pc.map(([p, x]) => `${p}% of ${money(x)}`), 4)}`);
  secA.push(q);
  A('A', q.n, 'Percentage of an amount', pc.map(([p, x]) => ({ w: `${num(p / 100)} × ${num(x)}`, a: money((p / 100) * x) })), 2);

  // GST
  q = Q('A', 'GST', 'A2', steps([
    'A price tag says “$66 (GST inc.)”. How much GST is included?',
    'A price tag says “$143 (GST inc.)”. How much GST is included?',
    'A haircut costs $80 before GST. Add 10% GST to find the price.',
    'A cap costs $77 including GST. What was the price before GST?']));
  secA.push(q);
  A('A', q.n, 'GST', [
    { w: '66 ÷ 11', a: money(66 / 11) }, { w: '143 ÷ 11', a: money(143 / 11) },
    { w: '80 × 1.1', a: money(80 * 1.1) }, { w: '77 ÷ 1.1', a: money(77 / 1.1) }], 2);

  // Discount
  const dc = [[80, 25], [45, 10], [120, 35]];
  q = Q('A', 'Discounts', 'A3', `<p>Find the new (sale) price of each item.</p>${parts(dc.map(([x, p]) => `A ${money(x)} jacket with ${p}% off`.replace('jacket', ['jacket', 'game', 'speaker'][dc.findIndex((d) => d[0] === x)])), 3)}`);
  secA.push(q);
  A('A', q.n, 'Discounts', dc.map(([x, p]) => ({ w: `${num(p / 100)} × ${num(x)} = ${money((p / 100) * x)}, ${num(x)} − ${num((p / 100) * x)}`, a: money(x - (p / 100) * x) })));

  // Simple interest
  const si = [[800, 5, 3], [1500, 4, 3], [2000, 3, 5]];
  q = Q('A', 'Simple interest', 'A4', `${steps(si.map(([P, R, N]) => `Find the simple interest on ${money(P)} at ${R}% per year for ${N} years.`))}<p class="sub">d&nbsp; For part c, what is the total value of the investment after 5 years?</p>`);
  secA.push(q);
  A('A', q.n, 'Simple interest', [...si.map(([P, R, N]) => ({ w: `I = ${num(P)} × ${num(R / 100)} × ${N}`, a: money(P * (R / 100) * N) })),
    { label: 'd', w: `${num(2000)} + ${num(2000 * 0.03 * 5)}`, a: money(2000 + 2000 * 0.03 * 5) }]);

  // Multipliers
  const mu = [[250, 8, 1], [640, 15, -1], [1200, 12, 1], [86, 30, -1]];
  q = Q('A', 'Percentage increase and decrease', 'A5', `<p>Use a multiplier and your calculator.</p>${parts(mu.map(([x, p, s]) => `${s > 0 ? 'Increase' : 'Decrease'} ${money(x)} by ${p}%`), 2)}`);
  secA.push(q);
  A('A', q.n, 'Percentage increase and decrease', mu.map(([x, p, s]) => { const m = 1 + (s * p) / 100; return { w: `${num(x)} × ${num(m, 2)}`, a: money(x * m) }; }), 2);

  // Mark-up and profit
  const mk = [[12, 40, 'a sandwich press'], [8.5, 60, 'a phone case']];
  q = Q('A', 'Mark-up and profit', 'A6', mk.map(([c, p, item], k) => `<p class="sub">${'ab'[k]}&nbsp; A shop buys ${item} for ${money(c)} (the cost price) and adds a ${p}% mark-up.<br>&nbsp;&nbsp;&nbsp; i&nbsp; Find the selling price. &nbsp;&nbsp; ii&nbsp; How much profit does the shop make?</p>`).join(''));
  secA.push(q);
  A('A', q.n, 'Mark-up and profit', mk.flatMap(([c, p], k) => { const s = c * (1 + p / 100); return [
    { label: `${'ab'[k]} i`, w: `${num(c, 2)} × ${num(1 + p / 100)}`, a: money(s) },
    { label: `${'ab'[k]} ii`, w: `${num(s, 2)} − ${num(c, 2)}`, a: money(s - c) }]; }), 2);

  // Wages and overtime
  const rate = 18.5, hrs = 25, ot = 3, dt = 2;
  q = Q('A', 'Wages and overtime', 'A7', `<p>Kayla is paid ${money(rate)} per hour at a café.</p>${steps([
    `One week she works ${hrs} hours at the normal rate. How much is she paid?`,
    `She also works ${ot} hours of overtime at time and a half. How much is she paid for the overtime?`,
    `On Sunday she works ${dt} hours at double time. How much is she paid for Sunday?`,
    'What is her total pay for the week?'])}`);
  secA.push(q);
  const wN = hrs * rate, wO = ot * 1.5 * rate, wD = dt * 2 * rate;
  A('A', q.n, 'Wages and overtime', [
    { w: `${hrs} × ${num(rate, 2)}`, a: money(wN) }, { w: `${ot} × 1.5 × ${num(rate, 2)}`, a: money(wO) },
    { w: `${dt} × 2 × ${num(rate, 2)}`, a: money(wD) }, { w: `${num(wN, 2)} + ${num(wO, 2)} + ${num(wD, 2)}`, a: money(wN + wO + wD) }], 2);

  // Commission
  const cm = [[5, 2400, 'Jai sells cars and earns 5% commission. His sales this week are $2400.'], [3.5, 860, 'Lena sells shoes and earns 3.5% commission. Her sales today are $860.']];
  q = Q('A', 'Commission', 'A8', `<p>How much commission does each person earn?</p>${steps(cm.map((c) => c[2]))}`);
  secA.push(q);
  A('A', q.n, 'Commission', cm.map(([p, s]) => ({ w: `${num(p / 100)} × ${num(s)}`, a: money((p / 100) * s) })), 2);

  // Gross and net pay
  const gh = 38, gr = 24.5, tax = 160.4, sup_ = 45;
  q = Q('A', 'Gross pay and net pay', 'A9', `<p>Sam works ${gh} hours at ${money(gr)} per hour.</p>${steps([
    'Find Sam’s gross pay (total pay before anything is taken out).',
    `Sam pays ${money(tax)} in tax and ${money(sup_)} in super. Find his net pay (the pay he takes home).`])}`);
  secA.push(q);
  const gross = gh * gr;
  A('A', q.n, 'Gross pay and net pay', [{ w: `${gh} × ${num(gr, 2)}`, a: money(gross) }, { w: `${num(gross, 2)} − ${num(tax, 2)} − ${num(sup_, 2)}`, a: money(gross - tax - sup_) }], 2);

  // Payment plans
  const pp = [[900, 45, 2, 'Ari buys a TV on a payment plan. He borrows $900 and repays $45 a month for 2 years.'], [2000, 100, 2, 'Bella borrows $2000 for a scooter. She repays $100 a month for 2 years.']];
  q = Q('A', 'Loans and payment plans', 'A10', `<p>For each loan, find i&nbsp; the total amount repaid &nbsp; ii&nbsp; the interest paid.</p>${steps(pp.map((p) => p[3]))}`);
  secA.push(q);
  A('A', q.n, 'Loans and payment plans', pp.flatMap(([b, m, y], k) => [
    { label: `${'ab'[k]} i`, w: `${y} years = ${12 * y} months, ${m} × ${12 * y}`, a: money(m * 12 * y) },
    { label: `${'ab'[k]} ii`, w: `${num(m * 12 * y)} − ${num(b)}`, a: money(m * 12 * y - b) }]), 2);

  // Compound interest
  const ci = [[3000, 5, 2], [4000, 3, 3]];
  q = Q('A', 'Compound interest', 'A11', `<p>For each investment, find i&nbsp; the value after the time given &nbsp; ii&nbsp; the interest earned.</p>${steps(ci.map(([P, R, n]) => `${money(P)} is invested for ${n} years at ${R}% compound interest each year.`))}`);
  secA.push(q);
  A('A', q.n, 'Compound interest', ci.flatMap(([P, R, n], k) => { const Am = Math.round(P * (1 + R / 100) ** n * 100) / 100; return [
    { label: `${'ab'[k]} i`, w: `A = ${P} × ${num(1 + R / 100, 2)}${sup(n)}`, a: money(Am) },
    { label: `${'ab'[k]} ii`, w: `${num(Am, 2)} − ${num(P)}`, a: money(Am - P) }]; }), 2);
}

// ================= SECTION B: MEASUREMENT =================
const secB = [];
{
  let q = Q('B', 'Multiple choice', 'B1–B4', `<p>Choose the correct answer: A, B, C or D.</p>${steps([
    `How many centimetres are in 1 metre? ${mcOpts(['10', '100', '1000', '10 000'])}`,
    `What is the area of a rectangle 5 cm long and 2 cm wide? ${mcOpts(['7 cm²', '10 cm', '14 cm', '10 cm²'])}`,
    `What is the volume of a cube with sides 4 cm long? ${mcOpts(['16 cm³', '12 cm³', '64 cm²', '64 cm³'])}`,
    `Which of these is 56 000 written in scientific notation? ${mcOpts(['5.6 × 10' + sup(4), '56 × 10' + sup(3), '5.6 × 10' + sup('−4'), '0.56 × 10' + sup(5)])}`])}`);
  secB.push(q);
  A('B', q.n, 'Multiple choice', [{ w: '1 m = 100 cm', a: 'B' }, { w: '5 × 2 = 10, area is in cm²', a: 'D' }, { w: '4 × 4 × 4 = 64 cm³', a: 'D' }, { w: '5.6 × 10 000 = 56 000', a: 'A' }], 2);

  // Units
  q = Q('B', 'Converting units', 'B1', `<p>Convert each measurement.</p>${parts(['2.7 km into metres', '4.2 L into millilitres', '3500 m into kilometres', '1500 mL into litres', '6 m into centimetres', '450 cm into metres'], 3)}`);
  secB.push(q);
  A('B', q.n, 'Converting units', [
    { w: '2.7 × 1000', a: `${num(2.7 * 1000)} m` }, { w: '4.2 × 1000', a: `${num(4.2 * 1000)} mL` }, { w: '3500 ÷ 1000', a: `${num(3500 / 1000)} km` },
    { w: '1500 ÷ 1000', a: `${num(1500 / 1000)} L` }, { w: '6 × 100', a: `${num(600)} cm` }, { w: '450 ÷ 100', a: `${num(450 / 100)} m` }], 2);

  // Scientific notation
  q = Q('B', 'Scientific notation', 'B2', `${parts(['Write 45 000 in scientific notation.', 'Write 3 200 000 in scientific notation.', 'Write 670 000 in scientific notation.', `Write 4.1 × 10${sup(3)} as an ordinary number.`], 2)}`);
  secB.push(q);
  A('B', q.n, 'Scientific notation', [{ a: `4.5 × 10${sup(4)}` }, { a: `3.2 × 10${sup(6)}` }, { a: `6.7 × 10${sup(5)}` }, { w: '4.1 × 1000', a: '4100' }], 2);

  // Perimeter
  q = Q('B', 'Perimeter', 'B3', `${steps(['A farmer puts a fence around this rectangular paddock. How many metres of fence are needed?',
    'Find the perimeter of a square with sides 6 cm long.', 'A triangle has sides 5 m, 7 m and 9 m. Find its perimeter.'])}`, fig.rect('15 m', '8 m'));
  secB.push(q);
  A('B', q.n, 'Perimeter', [{ w: '15 + 8 + 15 + 8', a: `${15 + 8 + 15 + 8} m` }, { w: '6 + 6 + 6 + 6', a: '24 cm' }, { w: '5 + 7 + 9', a: '21 m' }], 2);

  // Circles
  const circ = [['a', 4, 'cm', false], ['b', 6, 'm', false], ['c', 10, 'cm', true]];
  q = Q('B', 'Circles: circumference and area', 'B4', `<p>For each circle, find i&nbsp; the circumference &nbsp; ii&nbsp; the area. Give your answers to 1 decimal place.</p>
    <div class="figrow">${circ.map(([l, x, u, d]) => `<div><b>${l}</b> ${fig.circle(`${x} ${u}`, d)}<div class="cap">${d ? 'diameter' : 'radius'} ${x} ${u}</div></div>`).join('')}</div>`);
  secB.push(q);
  A('B', q.n, 'Circles', circ.flatMap(([l, x, u, d]) => { const r = d ? x / 2 : x; const pre = d ? `r = ${x} ÷ 2 = ${r}; ` : ''; return [
    { label: `${l} i`, w: `${pre}C = 2 × π × ${r}`, a: `${d1(2 * Math.PI * r)} ${u}` },
    { label: `${l} ii`, w: `A = π × ${r} × ${r}`, a: `${d1(Math.PI * r * r)} ${u}²` }]; }), 2);

  // Area triangle, trapezium
  const tri = [[8, 5], [12, 7]], trp = [[4, 10, 5], [6, 8, 3]];
  q = Q('B', 'Area of triangles and trapeziums', 'B5', `<p>Find the area of each shape.</p><div class="figrow">
    ${tri.map(([b, h], i) => `<div><b>${'ab'[i]}</b> ${fig.triangle(b + ' cm', h + ' cm')}</div>`).join('')}
    ${trp.map(([a, b, h], i) => `<div><b>${'cd'[i]}</b> ${fig.trap(a + ' cm', b + ' cm', h + ' cm')}</div>`).join('')}</div>`);
  secB.push(q);
  A('B', q.n, 'Area of triangles and trapeziums', [...tri.map(([b, h]) => ({ w: `½ × ${b} × ${h}`, a: `${num(0.5 * b * h)} cm²` })),
    ...trp.map(([a, b, h]) => ({ w: `½ × (${a} + ${b}) × ${h}`, a: `${num(0.5 * (a + b) * h)} cm²` }))], 2);

  // Volume of cube and prism
  q = Q('B', 'Volume of cubes and rectangular prisms', 'B6', `${steps(['Find the volume of a cube with sides 5 cm long.', 'Find the volume of a box 6 cm long, 3 cm wide and 2 cm high.', 'A fish tank is 50 cm long, 20 cm wide and 30 cm high. Find its volume.'])}`, fig.cube('5 cm'));
  secB.push(q);
  A('B', q.n, 'Volume of prisms', [{ w: '5 × 5 × 5', a: '125 cm³' }, { w: '6 × 3 × 2', a: '36 cm³' }, { w: '50 × 20 × 30', a: `${num(50 * 20 * 30)} cm³` }], 2);

  // Surface area of a box (table)
  const boxes = [[6, 3, 2], [5, 4, 3]];
  q = Q('B', 'Surface area of a box', 'B7', `<p>Find the surface area of each box. Copy and complete a table like the one below for each box.</p>
    <div class="figrow">${boxes.map(([l, w, h], i) => `<div><b>${'ab'[i]}</b> ${fig.box(l + ' cm', w + ' cm', h + ' cm')}</div>`).join('')}</div>
    <table class="t"><tr><th>Faces</th><th>Area of one face</th><th>Number of faces</th><th>Area</th></tr><tr><td>Top and bottom</td><td></td><td>2</td><td></td></tr><tr><td>Front and back</td><td></td><td>2</td><td></td></tr><tr><td>The two ends</td><td></td><td>2</td><td></td></tr><tr><td colspan="3">Surface area (add the last column)</td><td></td></tr></table>`);
  secB.push(q);
  A('B', q.n, 'Surface area of a box', boxes.map(([l, w, h]) => ({
    w: `top and bottom ${l} × ${w} = ${l * w}, × 2 = ${2 * l * w}; front and back ${l} × ${h} = ${l * h}, × 2 = ${2 * l * h}; ends ${w} × ${h} = ${w * h}, × 2 = ${2 * w * h}; ${2 * l * w} + ${2 * l * h} + ${2 * w * h}`,
    a: `${2 * (l * w + l * h + w * h)} cm²` })));

  // Cylinder
  const cy = [[3, 5], [2, 10]];
  q = Q('B', 'Volume of a cylinder', 'B8', `<p>For each cylinder, find i&nbsp; the volume, to 1 decimal place &nbsp; ii&nbsp; how many millilitres of water it can hold.</p>
    <div class="figrow">${cy.map(([r, h], i) => `<div><b>${'ab'[i]}</b> ${fig.cyl(r + ' cm', h + ' cm')}</div>`).join('')}</div>`);
  secB.push(q);
  A('B', q.n, 'Volume of a cylinder', cy.flatMap(([r, h], k) => { const V = d1(Math.PI * r * r * h); return [
    { label: `${'ab'[k]} i`, w: `V = π × ${r} × ${r} × ${h}`, a: `${V} cm³` }, { label: `${'ab'[k]} ii`, w: '1 cm³ holds 1 mL', a: `${V} mL` }]; }), 2);
}

// ================= SECTION C: STATISTICS AND PROBABILITY =================
const secC = [];
{
  let q = Q('C', 'Multiple choice', 'C1–C3', `<p>Choose the correct answer: A, B, C or D.</p>${steps([
    `A survey asks “What is your height in centimetres?” What type of data does this give? ${mcOpts(['numerical and discrete', 'numerical and continuous', 'categorical and ordinal', 'categorical and nominal'])}`,
    `A coin is tossed once. What is the probability of a tail? ${mcOpts(['0', fr(1, 4), fr(1, 2), '1'])}`])}`);
  secC.push(q);
  A('C', q.n, 'Multiple choice', [{ w: 'height is measured', a: 'B' }, { w: '1 tail out of 2 sides', a: 'C' }], 2);

  // Classifying data
  const cls = [['your favourite colour', 'Categorical, nominal', 'words, no order'], ['the number of pets you have', 'Numerical, discrete', 'counted'],
    ['your shirt size (S, M, L, XL)', 'Categorical, ordinal', 'groups with an order'], ['the time to run 100 m', 'Numerical, continuous', 'measured'],
    ['the number of goals in a soccer game', 'Numerical, discrete', 'counted'], ['your rating of a movie (poor, good, great)', 'Categorical, ordinal', 'has an order']];
  q = Q('C', 'Types of data', 'C1', `<p>Is each type of data <b>categorical</b> (nominal or ordinal) or <b>numerical</b> (discrete or continuous)?</p>${parts(cls.map((c) => c[0]), 2)}`);
  secC.push(q);
  A('C', q.n, 'Types of data', cls.map((c) => ({ a: c[1], w: '' })).map((r, i) => ({ a: `${r.a} <span class="w">(${cls[i][2]})</span>` })), 2);

  // Stem and leaf
  const sl = [15, 18, 23, 23, 23, 27, 30, 34, 36, 41, 45];
  const slRows = [[1, [5, 8]], [2, [3, 3, 3, 7]], [3, [0, 4, 6]], [4, [1, 5]]];
  if (slRows.flatMap(([s, l]) => l.map((x) => s * 10 + x)).join() !== sl.join()) throw new Error('stem-and-leaf mismatch');
  q = Q('C', 'Stem-and-leaf plots', 'C2', `<p>This stem-and-leaf plot shows the scores of ${sl.length} students in a quiz.</p>${steps(['How many students scored in the 20s?', 'What is the lowest score?', 'What is the highest score?', 'What is the mode (the most common score)?', 'What is the range?', 'What is the median (the middle score)?'])}`,
    stemLeaf(slRows, '3 | 4 means 34'));
  secC.push(q);
  A('C', q.n, 'Stem-and-leaf plots', [{ w: 'stem 2 has 4 leaves', a: '4 students' }, { a: String(sl[0]) }, { a: String(sl[sl.length - 1]) }, { w: '23 appears 3 times', a: '23' },
    { w: `${sl[sl.length - 1]} − ${sl[0]}`, a: String(sl[sl.length - 1] - sl[0]) }, { w: `the 6th score of ${sl.length}`, a: String(sl[(sl.length - 1) / 2]) }], 2);

  // Mean median range
  const lists = [[6, 2, 9, 4, 9], [12, 7, 15, 10, 7, 4, 8]];
  q = Q('C', 'Mean, median, mode and range', 'C2', `<p>For each set of numbers, find i&nbsp; the mean &nbsp; ii&nbsp; the median &nbsp; iii&nbsp; the mode &nbsp; iv&nbsp; the range.</p>${steps([`The goals a hockey player scored in 5 games: ${lists[0].join(', ')}`, `The number of hours Ella spent on her phone over 7 days: ${lists[1].join(', ')}`])}`);
  secC.push(q);
  A('C', q.n, 'Mean, median, mode and range', lists.flatMap((L, k) => {
    const s = [...L].sort((a, b) => a - b); const tot = L.reduce((a, b) => a + b, 0);
    const cnt = {}; s.forEach((x) => { cnt[x] = (cnt[x] || 0) + 1; }); const mx = Math.max(...Object.values(cnt)); const modes = Object.keys(cnt).filter((x) => cnt[x] === mx);
    if (modes.length !== 1) throw new Error('list needs one mode');
    return [{ label: `${'ab'[k]}`, a: `<span class="w">In order: ${s.join(', ')}</span>` },
      { label: `${'ab'[k]} i`, w: `${tot} ÷ ${L.length}`, a: num(tot / L.length) }, { label: `${'ab'[k]} ii`, w: 'middle number', a: String(s[(s.length - 1) / 2]) },
      { label: `${'ab'[k]} iii`, w: 'most common', a: modes[0] }, { label: `${'ab'[k]} iv`, w: `${s[s.length - 1]} − ${s[0]}`, a: String(s[s.length - 1] - s[0]) }]; }), 2);

  // Probability: dice, spinner
  q = Q('C', 'Probability', 'C3', `${steps(['A normal 6-sided dice is rolled once. Find the probability of rolling:<br>&nbsp; i&nbsp; a 5 &nbsp;&nbsp; ii&nbsp; an odd number &nbsp;&nbsp; iii&nbsp; a number greater than 4 &nbsp;&nbsp; iv&nbsp; a number less than 5',
    'This spinner has 8 equal parts. R is red and W is white. Find the probability of spinning:<br>&nbsp; i&nbsp; red &nbsp;&nbsp; ii&nbsp; white'])}`, fig.spinner(8, 3));
  secC.push(q);
  A('C', q.n, 'Probability', [{ label: 'a i', w: '1 way out of 6', a: frac(1, 6) }, { label: 'a ii', w: '1, 3, 5', a: fracW(3, 6) }, { label: 'a iii', w: '5, 6', a: fracW(2, 6) },
    { label: 'a iv', w: '1, 2, 3, 4', a: fracW(4, 6) }, { label: 'b i', w: '3 red out of 8', a: frac(3, 8) }, { label: 'b ii', w: '5 white out of 8', a: frac(5, 8) }], 2);

  // Letters
  const words = ['BANANA', 'COMMITTEE'];
  const P = (w, f) => [...w].filter(f).length;
  const vow = (c) => 'AEIOU'.includes(c);
  q = Q('C', 'Probability with letters', 'C3', steps([`One letter is chosen at random from the word <span class="word">${[...words[0]].join(' ')}</span>.<br>Find the probability that the letter is: &nbsp; i&nbsp; an A &nbsp;&nbsp; ii&nbsp; an N &nbsp;&nbsp; iii&nbsp; a B`,
    `One letter is chosen at random from the word <span class="word">${[...words[1]].join(' ')}</span>.<br>Find the probability that the letter is: &nbsp; i&nbsp; an M &nbsp;&nbsp; ii&nbsp; an E &nbsp;&nbsp; iii&nbsp; a vowel (A, E, I, O or U)`]));
  secC.push(q);
  const w0 = words[0], w1 = words[1];
  A('C', q.n, 'Probability with letters', [
    { label: 'a i', w: `${P(w0, (c) => c === 'A')} A’s out of ${w0.length} letters`, a: fracW(P(w0, (c) => c === 'A'), w0.length) },
    { label: 'a ii', w: `${P(w0, (c) => c === 'N')} N’s out of ${w0.length}`, a: fracW(P(w0, (c) => c === 'N'), w0.length) },
    { label: 'a iii', w: `1 B out of ${w0.length}`, a: frac(1, w0.length) },
    { label: 'b i', w: `${P(w1, (c) => c === 'M')} M’s out of ${w1.length} letters`, a: fracW(P(w1, (c) => c === 'M'), w1.length) },
    { label: 'b ii', w: `${P(w1, (c) => c === 'E')} E’s out of ${w1.length}`, a: fracW(P(w1, (c) => c === 'E'), w1.length) },
    { label: 'b iii', w: `O, I, E, E: ${P(w1, vow)} out of ${w1.length}`, a: fracW(P(w1, vow), w1.length) }], 2);

  // Time series
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  q = Q('C', 'Time-series graphs', 'C4', `<p>Describe the trend in each graph: <b>upward trend</b>, <b>downward trend</b> or <b>no trend</b>.</p><div class="figrow">
    <div><b>a</b> ${fig.line('Heaters sold each month', months, [4, 6, 11, 17, 24, 31], 35, 5, 'Heaters sold')}</div>
    <div><b>b</b> ${fig.line('Ice creams sold each month', months, [32, 29, 22, 15, 10, 6], 35, 5, 'Ice creams sold')}</div></div>
    <p class="sub">c&nbsp; Why do you think more heaters are sold in June than in January?</p>`);
  secC.push(q);
  A('C', q.n, 'Time-series graphs', [{ w: 'the line goes up', a: 'Upward trend' }, { w: 'the line goes down', a: 'Downward trend' }, { a: 'June is winter in Australia (cold), January is summer (hot).' }], 1);

  // Frequency table
  const ft = [['0–9', 4], ['10–19', 8], ['20–29', 5], ['30–39', 2], ['40–49', 1]];
  const tot = ft.reduce((a, b) => a + b[1], 0);
  q = Q('C', 'Frequency tables and column graphs', 'C5', `<p>Some students recorded how many text messages they sent in one day.</p>
    <table class="t"><tr><th>Messages</th>${ft.map((r) => `<th>${r[0]}</th>`).join('')}<th>Total</th></tr><tr><td>Frequency</td>${ft.map((r) => `<td>${r[1]}</td>`).join('')}<td></td></tr></table>
    ${steps(['Find the total number of students.', 'Draw a column graph of the data in your workbook. Label both axes.', 'What percentage of the students sent 10–19 messages?', 'What percentage of the students sent 0–9 messages?', 'Is the data symmetrical or skewed?'])}`);
  secC.push(q);
  A('C', q.n, 'Frequency tables and column graphs', [{ w: ft.map((r) => r[1]).join(' + '), a: `${tot} students` },
    { a: 'Columns of height 4, 8, 5, 2, 1 with no gaps; “Messages” on the horizontal axis, “Frequency” on the vertical axis.' },
    { w: `${ft[1][1]} ÷ ${tot} × 100`, a: `${num((ft[1][1] / tot) * 100)}%` }, { w: `${ft[0][1]} ÷ ${tot} × 100`, a: `${num((ft[0][1] / tot) * 100)}%` },
    { w: 'most data is at the low end with a tail to the right', a: 'Skewed' }]);
  A('C', '', 'Column graph for part b', [{ a: fig.columns(ft.map((r) => r[0]), ft.map((r) => r[1]), 9, 'Messages') }]);
}

// ================= SECTION D: OTHER YEAR 10 TOPICS =================
const secD = [];
{
  let q = Q('D', 'Multiple choice', 'D1', `<p>Choose the correct answer: A, B, C or D.</p>${steps([`Simplify y${sup(2)} × y${sup(6)} ${mcOpts(['y' + sup(8), 'y' + sup(12), '2y' + sup(8), '8y'])}`])}`);
  secD.push(q);
  A('D', q.n, 'Multiple choice', [{ w: '2 + 6 = 8', a: 'A' }]);

  // Index laws
  const il = [['a', 2, 5, '×'], ['m', 3, 6, '×'], ['x', 1, 4, '×'], ['k', 7, 2, '×'], ['b', 8, 3, '÷'], ['p', 9, 4, '÷']];
  const pw = (b, e) => (e === 1 ? b : `${b}${sup(e)}`);
  q = Q('D', 'Index laws', 'D1', `<p>Simplify each expression. Write your answer as a single power.</p>${parts(il.map(([b, x, y, o]) => `${v(pw(b, x))} ${o} ${v(pw(b, y))}`), 3)}`);
  secD.push(q);
  A('D', q.n, 'Index laws', il.map(([b, x, y, o]) => ({ w: o === '×' ? `add: ${x} + ${y}` : `subtract: ${x} − ${y}`, a: v(pw(b, o === '×' ? x + y : x - y)) })), 2);

  // Substitution
  const sb = [['a', 3, '4a + 1', (a) => 4 * a + 1, '4 × 3 + 1'], ['b', 5, '3b − 4', (b) => 3 * b - 4, '3 × 5 − 4'], ['x', 2, '10 − 2x', (x) => 10 - 2 * x, '10 − 2 × 2'], ['y', 7, '20 − y', (y) => 20 - y, '20 − 7'], ['p', 6, '2p + 3', (p) => 2 * p + 3, '2 × 6 + 3'], ['t', 4, '5t − 2', (t) => 5 * t - 2, '5 × 4 − 2']];
  q = Q('D', 'Substitution', 'D2', `<p>Find the value of each expression.</p>${parts(sb.map(([l, n, e]) => `If ${v(l)} = ${n}, find ${e.replace(/([a-z])/g, '<i class="v">$1</i>')}`), 3)}`);
  secD.push(q);
  A('D', q.n, 'Substitution', sb.map(([, n, , f, w]) => ({ w, a: String(f(n)) })), 2);

  // Equations
  const eq = [['3x + 4 = 19', (x) => 3 * x + 4 === 19, 5, 'take away 4: 3x = 15; divide by 3'], ['5x − 2 = 18', (x) => 5 * x - 2 === 18, 4, 'add 2: 5x = 20; divide by 5'], ['2x + 9 = 21', (x) => 2 * x + 9 === 21, 6, 'take away 9: 2x = 12; divide by 2'],
    [`${fr('x + 3', 2)} = 5`, (x) => (x + 3) / 2 === 5, 7, 'times by 2: x + 3 = 10; take away 3'], [`${fr('x − 1', 4)} = 3`, (x) => (x - 1) / 4 === 3, 13, 'times by 4: x − 1 = 12; add 1'], [`${fr('x + 5', 3)} = 4`, (x) => (x + 5) / 3 === 4, 7, 'times by 3: x + 5 = 12; take away 5']];
  eq.forEach(([, chk, x]) => { if (!chk(x)) throw new Error('equation answer wrong'); });
  const it = (s) => s.replace(/\bx\b/g, '<i class="v">x</i>');
  q = Q('D', 'Solving equations', 'D3', `<p>Solve each equation.</p>${parts(eq.map((e) => it(e[0])), 3)}`);
  secD.push(q);
  A('D', q.n, 'Solving equations', eq.map(([, , x, w]) => ({ w: it(w), a: `${v('x')} = ${x}` })), 2);

  // Straight-line graphs
  const lines = [[3, 1], [1, 2]];
  const lr = ([m, c]) => `${v('y')} = ${m === 1 ? '' : m}${v('x')} + ${c}`;
  q = Q('D', 'Straight-line graphs', 'D4', `${steps([`The rule for a straight line is ${lr(lines[0])}. Copy and complete the table.<table class="t"><tr><th>${v('x')}</th><td>0</td><td>1</td><td>2</td><td>3</td></tr><tr><th>${v('y')}</th><td></td><td></td><td></td><td></td></tr></table>`,
    'Plot the points from part a on a grid and join them with a straight line.',
    `Write the gradient and the ${v('y')}-intercept of ${lr(lines[0])}.`,
    `Write the gradient and the ${v('y')}-intercept of ${lr(lines[1])}.`,
    `Write the gradient and the ${v('y')}-intercept of ${v('y')} = 4${v('x')} + 5.`])}`);
  secD.push(q);
  const yv = [0, 1, 2, 3].map((x) => lines[0][0] * x + lines[0][1]);
  A('D', q.n, 'Straight-line graphs', [{ w: `${v('y')} = 3 × 0 + 1, 3 × 1 + 1, …`, a: `${v('y')} = ${yv.join(', ')}` }, { a: `Points (0, ${yv[0]}), (1, ${yv[1]}), (2, ${yv[2]}), (3, ${yv[3]}) joined with a ruler.` },
    { a: 'gradient = 3, y-intercept = 1' }, { a: 'gradient = 1, y-intercept = 2' }, { a: 'gradient = 4, y-intercept = 5' }]);

  // Pythagoras
  const py = [[5, 12], [9, 12], [8, 15], [7, 10]];
  q = Q('D', 'Pythagoras’ theorem', 'D5', `<p>Find the length of the hypotenuse, ${v('c')}. Give the answer to 1 decimal place where needed.</p>
    <div class="figrow">${py.map(([a, b], i) => `<div><b>${'abcd'[i]}</b> ${fig.pyth(a + ' cm', b + ' cm')}</div>`).join('')}</div>`);
  secD.push(q);
  A('D', q.n, 'Pythagoras’ theorem', py.map(([a, b]) => { const c2 = a * a + b * b, c = Math.sqrt(c2); return { w: `${v('c')}² = ${a * a} + ${b * b} = ${c2}, ${v('c')} = √${c2}`, a: `${Number.isInteger(c) ? c : d1(c)} cm` }; }), 2);

  // Trig
  const tg = [[40, 10], [25, 6], [60, 4], [15, 20]];
  q = Q('D', 'Trigonometry: finding a side', 'D6', `<p>Find the length of side ${v('x')}, to 1 decimal place. Check your calculator is in degrees.</p>
    <div class="figrow">${tg.map(([ang, adj], i) => `<div><b>${'abcd'[i]}</b> ${fig.trig(ang, adj + ' cm')}</div>`).join('')}</div>`);
  secD.push(q);
  A('D', q.n, 'Trigonometry', tg.map(([ang, adj]) => ({ w: `${v('x')} = ${adj} × tan ${ang}°`, a: `${d1(adj * Math.tan((ang * Math.PI) / 180))} cm` })), 2);
}

// ================= HELP SHEET =================
const eg = (t) => `<div class="eg"><span class="lbl">Example:</span> ${t}</div>`;
const box = (title, t) => `<div class="box"><b class="t">${title}</b><br>${t}</div>`;
const tip = (t) => `<div class="tip"><b>Watch out:</b> ${t}</div>`;
const h = (id, t) => `<h4><span class="hid">${id}</span> ${t}</h4>`;
const helpSheet = `
<h2>A · Financial mathematics</h2>
<div class="cols2">
<div>${h('A1', 'Percentage of an amount')}<p>Change the % into a decimal (divide by 100), then multiply.</p>${eg('28% of $50 → 0.28 × 50 = <b>$14</b>')}</div>
<div>${h('A2', 'GST (10%)')}<ul><li>Add GST: price × 1.1</li><li>GST in a price that already has GST (GST inc.): price ÷ 11</li><li>Price before GST: price ÷ 1.1</li></ul>${eg('$55 (GST inc.): GST = 55 ÷ 11 = <b>$5</b>')}</div>
<div>${h('A3', 'Discounts')}<p>Discount = price × rate. New price = price − discount.</p>${eg('$60 with 20% off: 0.2 × 60 = $12, 60 − 12 = <b>$48</b>')}</div>
<div>${h('A4', 'Simple interest')}${box('Formula', `${v('I')} = ${v('P')} × ${v('R')} × ${v('N')}`)}<p>${v('P')} = amount invested or borrowed, ${v('R')} = rate as a decimal (5% → 0.05), ${v('N')} = number of years. Total value = ${v('P')} + ${v('I')}.</p>${eg('$400 at 5% for 2 years: 400 × 0.05 × 2 = <b>$40</b>')}</div>
<div>${h('A5', 'Increase or decrease with a multiplier')}<ul><li>Increase by 8% → × 1.08</li><li>Decrease by 8% → × 0.92 (100% − 8% = 92%)</li></ul>${eg('Increase $50 by 10%: 50 × 1.10 = <b>$55</b>')}</div>
<div>${h('A6', 'Mark-up and profit')}<ul><li>Cost price = what the shop pays. Selling price = what the customer pays.</li><li>Mark-up of 30% → cost × 1.3</li><li>Profit = selling price − cost price</li></ul>${eg('Cost $10, mark-up 20%: 10 × 1.2 = $12, profit = 12 − 10 = <b>$2</b>')}</div>
<div>${h('A7', 'Wages and overtime')}<ul><li>Pay = hours × hourly rate</li><li>Time and a half = 1.5 × hourly rate</li><li>Double time = 2 × hourly rate</li></ul>${eg('$20 per hour, 3 hours at time and a half: 3 × 1.5 × 20 = <b>$90</b>')}</div>
<div>${h('A8', 'Commission')}<p>Commission = rate (as a decimal) × sales.</p>${eg('4% of $900 sales: 0.04 × 900 = <b>$36</b>')}</div>
<div>${h('A9', 'Gross pay and net pay')}<ul><li><b>Gross pay</b> = total pay before anything is taken out (hours × rate)</li><li><b>Net pay</b> = gross pay − tax − super (what you take home)</li></ul>${eg('Gross $800, tax $120, super $40: 800 − 120 − 40 = <b>$640</b>')}</div>
<div>${h('A10', 'Loans and payment plans')}<ul><li>Change years into months: 1 year = 12 months</li><li>Total repaid = repayment × number of months</li><li>Interest = total repaid − amount borrowed</li></ul>${eg('Borrow $500, repay $50 a month for 1 year: 50 × 12 = $600, interest = 600 − 500 = <b>$100</b>')}</div>
</div>
${h('A11', 'Compound interest')}
<div class="flex"><div class="grow">${box('Formula', `${v('A')} = ${v('P')}(1 + ${v('R')})${sup(v('n'))} &nbsp;&nbsp; ${v('A')} = final value, ${v('P')} = amount invested, ${v('R')} = rate as a decimal, ${v('n')} = number of years`)}
${eg(`$2000 at 5% for 2 years: ${v('A')} = 2000 × 1.05² = <b>$2205</b>. Interest = 2205 − 2000 = <b>$205</b>`)}</div>
<div class="grow">${tip('5% compound interest means × 1.05 each year. Calculator: type 2000 × 1.05 ^ 2 =. Interest = final value − amount invested.')}</div></div>

<h2>B · Measurement</h2>
<div class="cols2">
<div>${h('B1', 'Converting units')}${box('Length, capacity and mass', '1 cm = 10 mm &nbsp; 1 m = 100 cm &nbsp; 1 km = 1000 m<br>1 L = 1000 mL &nbsp; 1 kL = 1000 L &nbsp; 1 kg = 1000 g')}<p>Big unit → small unit: <b>multiply</b>. Small unit → big unit: <b>divide</b>.</p>${eg('5.3 km → m: 5.3 × 1000 = <b>5300 m</b>. 2500 mL → L: 2500 ÷ 1000 = <b>2.5 L</b>')}</div>
<div>${h('B2', 'Scientific notation')}<p>A number between 1 and 10, times a power of 10. Count how many places the decimal point moves.</p>${eg(`2 350 000 = <b>2.35 × 10${sup(6)}</b> (the point moves 6 places)`)}${eg(`4.1 × 10${sup(3)} = 4.1 × 1000 = <b>4100</b>`)}</div>
<div>${h('B3', 'Perimeter')}<p>Perimeter = add up the lengths of all the sides (the distance around the outside). Units: m, cm.</p>${eg('Rectangle 12 m by 7 m: 12 + 7 + 12 + 7 = <b>38 m</b>')}</div>
<div>${h('B4', 'Circles')}${box('Formulas', `Circumference ${v('C')} = 2 × π × ${v('r')} &nbsp;&nbsp; Area ${v('A')} = π × ${v('r')} × ${v('r')}`)}<p>${v('r')} = radius (centre to edge). If you are given the diameter, halve it first.</p>${eg('Radius 5 cm: C = 2 × π × 5 = <b>31.4 cm</b>, A = π × 5 × 5 = <b>78.5 cm²</b>')}</div>
<div>${h('B5', 'Area')}<table class="t"><tr><th>Shape</th><th>Area</th></tr><tr><td>Rectangle</td><td>length × width</td></tr><tr><td>Triangle</td><td>½ × base × height</td></tr><tr><td>Trapezium</td><td>½ × (top + bottom) × height</td></tr></table><p>Top and bottom are the parallel sides. The height makes a right angle with the base. Area units are squared: cm², m².</p>${eg('Triangle, base 8 cm, height 5 cm: ½ × 8 × 5 = <b>20 cm²</b>')}</div>
<div>${h('B6', 'Volume of cubes and boxes')}${box('Formulas', 'Cube: V = side × side × side<br>Box (rectangular prism): V = length × width × height')}<p>Volume units are cubed: cm³, m³.</p>${eg('Box 4 cm × 3 cm × 2 cm: 4 × 3 × 2 = <b>24 cm³</b>')}</div>
<div>${h('B7', 'Surface area of a box')}<p>A box has 6 faces in 3 matching pairs: top and bottom, front and back, the two ends. Find the area of one face of each pair, double it, then add.</p>${eg('Box 10 × 4 × 2: 2 × 40 + 2 × 20 + 2 × 8 = 80 + 40 + 16 = <b>136 cm²</b>')}</div>
<div>${h('B8', 'Volume of a cylinder')}${box('Formula', `V = π × ${v('r')} × ${v('r')} × ${v('h')}`)}<p>1 cm³ holds 1 mL, so the volume in cm³ is the capacity in mL.</p>${eg('r = 3 cm, h = 10 cm: π × 3 × 3 × 10 = <b>282.7 cm³</b> = 282.7 mL')}</div>
</div>
${tip('Round to 1 decimal place only at the end. Always write the units: cm for length, cm² for area, cm³ for volume.')}

<h2>C · Statistics and probability</h2>
<div class="cols2">
<div>${h('C1', 'Types of data')}<table class="t"><tr><th colspan="2">Categorical (words or groups)</th></tr><tr><td>Nominal</td><td>no order: eye colour, type of pet</td></tr><tr><td>Ordinal</td><td>has an order: small, medium, large</td></tr><tr><th colspan="2">Numerical (numbers)</th></tr><tr><td>Discrete</td><td>counted: number of goals</td></tr><tr><td>Continuous</td><td>measured: height, time, mass</td></tr></table></div>
<div>${h('C2', 'Mean, median, mode and range')}<ul><li><b>Mean</b> = add up the numbers, then divide by how many numbers there are</li><li><b>Median</b> = the middle number when they are in order</li><li><b>Mode</b> = the most common number</li><li><b>Range</b> = biggest − smallest</li></ul>${eg('3, 8, 1, 8, 5 → in order 1, 3, 5, 8, 8. Mean = 25 ÷ 5 = <b>5</b>, median = <b>5</b>, mode = <b>8</b>, range = 8 − 1 = <b>7</b>')}</div>
<div><h4><span class="hid">C2</span> Reading a stem-and-leaf plot</h4><div class="flex"><div class="grow"><p>The stem is the tens digit. The leaf is the units digit. The key tells you how to read it.</p><p>This plot shows 24, 29, 31, 31, 37. Lowest = 24, highest = 37, mode = 31.</p></div>${stemLeaf([[2, [4, 9]], [3, [1, 1, 7]]], '3 | 1 means 31')}</div></div>
<div>${h('C3', 'Probability')}${box('Formula', `Probability = ${fr('number of ways it can happen', 'total number of ways')}`)}<p>Write the answer as a fraction and simplify it if you can.</p>${eg(`A letter from BOOK: P(O) = ${fr(2, 4)} = ${fr(1, 2)}. &nbsp; Dice, an even number (2, 4, 6): ${fr(3, 6)} = ${fr(1, 2)}`)}</div>
<div>${h('C4', 'Time-series graphs')}<ul><li><b>Upward trend</b>: the line goes up over time</li><li><b>Downward trend</b>: the line goes down over time</li><li><b>No trend</b>: the line goes up and down with no pattern</li></ul></div>
<div>${h('C5', 'Frequency tables, graphs and shape')}<ul><li>Total = add up the frequency column</li><li>Percentage = frequency ÷ total × 100</li><li>Column graph: frequency up the side, groups along the bottom</li><li><b>Symmetrical</b>: the same shape on both sides of the middle. <b>Skewed</b>: bunched at one end with a long tail</li></ul>${eg('9 out of 20 students: 9 ÷ 20 × 100 = <b>45%</b>')}</div>
</div>
<div class="figrow shapes"><div>${fig.columns(['', '', '', '', ''], [2, 5, 8, 5, 2], 9, 'Symmetrical')}</div><div>${fig.columns(['', '', '', '', ''], [8, 6, 3, 2, 1], 9, 'Skewed')}</div></div>

<h2>D · Other Year 10 topics</h2>
<div class="cols2">
<div>${h('D1', 'Index laws')}<ul><li>When you <b>multiply</b>, add the powers: ${v('m')}² × ${v('m')}${sup(6)} = ${v('m')}${sup(8)}</li><li>When you <b>divide</b>, subtract the powers: ${v('m')}${sup(7)} ÷ ${v('m')}² = ${v('m')}${sup(5)}</li><li>${v('x')} on its own means ${v('x')}${sup(1)}</li></ul></div>
<div>${h('D2', 'Substitution')}<p>Swap the letter for its number. 5${v('a')} means 5 × ${v('a')}. Multiply before you add or subtract.</p>${eg(`If ${v('a')} = 3: 2${v('a')} + 1 = 2 × 3 + 1 = <b>7</b>`)}</div>
<div>${h('D3', 'Solving equations')}<p>Do the opposite to both sides, one step at a time.</p>${eg(`3${v('x')} + 1 = 13 → take away 1: 3${v('x')} = 12 → divide by 3: <b>${v('x')} = 4</b>`)}${eg(`${fr('x + 1', 2)} = 4 → times by 2: ${v('x')} + 1 = 8 → take away 1: <b>${v('x')} = 7</b>`)}<p>Check: put your answer back into the equation.</p></div>
<div>${h('D4', 'Straight-line graphs')}${box(`${v('y')} = ${v('m')}${v('x')} + ${v('c')}`, `${v('m')} is the gradient (how steep the line is). ${v('c')} is the ${v('y')}-intercept (where the line crosses the ${v('y')}-axis).`)}${eg(`For ${v('y')} = 3${v('x')} + 2, when ${v('x')} = 4: ${v('y')} = 3 × 4 + 2 = <b>14</b>. Gradient = 3, ${v('y')}-intercept = 2`)}<p>To plot (4, 9): go across to 4, then up to 9. Put a dot. Join the dots with a ruler.</p></div>
<div>${h('D5', 'Pythagoras’ theorem')}<div class="flex"><div class="grow">${box('Formula', `${v('c')}² = ${v('a')}² + ${v('b')}² &nbsp; (${v('c')} is the hypotenuse, the longest side, opposite the right angle)`)}${eg(`${v('a')} = 3, ${v('b')} = 4: ${v('c')}² = 9 + 16 = 25, ${v('c')} = √25 = <b>5</b>`)}</div>${fig.pyth('a', 'b')}</div></div>
<div>${h('D6', 'Trigonometry: tan')}<div class="flex"><div class="grow">${box('Formula', 'tan (angle) = opposite ÷ adjacent<br>so opposite = adjacent × tan (angle)')}${eg(`Angle 20°, adjacent 5 cm: ${v('x')} = 5 × tan 20° = <b>1.8 cm</b>`)}</div></div>${tip('The opposite side is across from the angle. The adjacent side is next to the angle (not the hypotenuse). Check your calculator shows D or DEG.')}</div>
</div>`;

// ================= PAGES =================
const SECTIONS = [['A', 'Financial mathematics', 'Test questions 1–11', secA], ['B', 'Measurement', 'Test questions 12–21', secB], ['C', 'Statistics and probability', 'Test questions 22–29', secC], ['D', 'Other Year 10 topics', 'Test questions 30–35', secD]];
const css = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8');
const head = (title) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${title}</title><style>${css}</style></head><body>`;
const banner = (title, sub) => `<div class="banner"><img src="${LOGO}" alt="Kingscliff High School"><div><h1>${title}</h1><div class="sub">${sub}</div></div></div><div class="rule"></div>`;

const booklet = head('Year 10 Yearly Test Revision') + banner('Year 10 Yearly Test Revision', 'Year 10 Transition · 2026 · Revision booklet, help sheet and answers') + `
<p class="intro">This booklet has practice questions for every type of question in the Year 10 Yearly Test. Write your answers in your <b>maths workbook</b> and show your working. A calculator is allowed.</p>
<table class="toc"><tr><td><b>Part 1</b></td><td>Revision questions: A Financial mathematics · B Measurement · C Statistics and probability · D Other Year 10 topics</td></tr>
<tr><td><b>Part 2</b></td><td>Help sheet: the formulas, rules and a worked example for every topic</td></tr>
<tr><td><b>Part 3</b></td><td>Answers with working, to check your work</td></tr></table>
<div class="tip"><b>Stuck?</b> Every question has a tag like <span class="help">Help sheet A4</span>. Turn to that box in Part 2 for the formula and an example, then try again.</div>
${SECTIONS.map(([id, name, tq, qs]) => `<h2>Part 1 · Section ${id}: ${name} <span class="tq">${tq}</span></h2>${qs.map((q) => q.html).join('')}`).join('')}
<div class="page-break"></div>${banner('Part 2 · Help sheet', 'Key ideas, formulas and worked examples for every Year 10 Yearly Test topic')}${helpSheet}
<div class="page-break"></div>${banner('Part 3 · Answers', 'Worked answers for the revision questions in Part 1')}
<p class="intro">Check each answer. If yours is different, compare your working line by line to find where it went wrong. Answers are rounded at the last step.</p>
${SECTIONS.map(([id, name]) => `<h2>Section ${id}: ${name}</h2>${answers[id].join('')}`).join('')}
</body></html>`;

const helpOnly = head('Year 10 Yearly Test Help Sheet') + banner('Year 10 Yearly Test Help Sheet', 'Year 10 Transition · 2026 · Key ideas, formulas and worked examples for every topic') +
  `<p class="intro">Use this help sheet while you revise. Each box (A1, A2, …) matches the questions in the revision booklet.</p>${helpSheet}</body></html>`;

// ================= BUILD =================
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(BUILD, { recursive: true });
  const shotDir = process.argv.includes('--shots') ? process.argv[process.argv.indexOf('--shots') + 1] : null;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const jobs = [['Year10-Yearly-Test-2026-Revision-Booklet', booklet, 'Year 10 Yearly Test Revision'], ['Year10-Yearly-Test-2026-Help-Sheet', helpOnly, 'Year 10 Yearly Test Help Sheet']];
  for (const [name, html, foot] of jobs) {
    const htmlPath = path.join(BUILD, name + '.html');
    fs.writeFileSync(htmlPath, html);
    await page.goto('file://' + htmlPath);
    await page.pdf({ path: path.join(OUT, name + '.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true, headerTemplate: '<div></div>',
      footerTemplate: `<div style="font-family:'DejaVu Serif',serif;font-size:8px;color:#555;width:100%;padding:0 14mm;display:flex;justify-content:space-between"><span>Kingscliff High School · ${foot}</span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>` });
    console.log('wrote', name + '.pdf');
  }
  await browser.close();
  if (shotDir) {
    fs.mkdirSync(shotDir, { recursive: true });
    for (const [name] of jobs) require('child_process').execFileSync('pdftoppm', ['-r', '60', '-png', path.join(OUT, name + '.pdf'), path.join(shotDir, name)]);
  }
})();
