// Year 10 Yearly Test 2026: two-page revision worksheet (one question per skill in the test) and its answers.
// Writes to "../Year 10 yearly test revision":
//   Year10-Yearly-Test-2026-Revision-Worksheet.pdf           exactly 2 pages (the build fails otherwise)
//   Year10-Yearly-Test-2026-Revision-Worksheet-Answers.pdf
// Every answer is calculated here from the question's numbers.
//   node worksheet.js [--shots <dir>]

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { num, money, d1, fr, frac, fracW, v, sup, fig, stemLeaf } = require('./lib');

const OUT = path.join(__dirname, '..', 'Year 10 yearly test revision');
const BUILD = path.join(__dirname, 'build');
const LOGO = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, 'assets', 'kingscliff-logo.png')).toString('base64');

const L = (i) => String.fromCharCode(97 + i);
const sections = { A: [], B: [], C: [], D: [] };
const answers = { A: [], B: [], C: [], D: [] };
let qn = 0;
let freqN = 0;
// q(sec, body, ansRows, figure): ansRows is [[working, answer], ...], one per part (or one row for a single question)
function q(sec, body, rows, figure) {
  qn += 1;
  const f = figure ? `<div class="fig">${figure}</div>` : '';
  sections[sec].push(`<div class="wq"><div class="n">${qn}</div><div class="body flex"><div class="grow">${body}</div>${f}</div></div>`);
  const a = rows.map(([w, ans], i) => `<span class="pt">${rows.length > 1 ? `<b>${L(i)}</b> ` : ''}${w ? `<span class="w">${w}</span> → ` : ''}<span class="ans">${ans}</span></span>`).join('');
  answers[sec].push(`<div class="wa"><div class="n">${qn}</div><div class="body">${a}</div></div>`);
}
const ps = (list, cols = list.length) => `<div class="parts c${Math.min(cols, 4)}">${list.map((p, i) => `<div><b>${L(i)}</b> ${p}</div>`).join('')}</div>`;

// ================= A FINANCIAL MATHEMATICS =================
{
  const p = [[35, 80], [12, 45]];
  q('A', `Find ${ps(p.map(([r, x]) => `${r}% of ${money(x)}`))}`, p.map(([r, x]) => [`${num(r / 100)} × ${x}`, money((r / 100) * x)]));
  q('A', ps(['How much GST is in a price of $88 (GST inc.)?', 'A meal costs $120 before GST. Find the price with 10% GST added.'], 2),
    [['88 ÷ 11', money(88 / 11)], ['120 × 1.1', money(120 * 1.1)]]);
  q('A', 'A pair of shoes costs $64. They are discounted by 25%. Find the sale price.', [['0.25 × 64 = $16, 64 − 16', money(64 - 0.25 * 64)]]);
  q('A', `Find the simple interest on $1200 at 4% per year for 3 years. Use ${v('I')} = ${v('P')} × ${v('R')} × ${v('N')}.`, [['1200 × 0.04 × 3', money(1200 * 0.04 * 3)]]);
  q('A', `Use a multiplier. ${ps(['Increase $350 by 6%', 'Decrease $72 by 20%'])}`, [['350 × 1.06', money(350 * 1.06)], ['72 × 0.8', money(72 * 0.8)]]);
  q('A', `A shop buys a lamp for $15 and adds a 40% mark-up. ${ps(['Find the selling price.', 'Find the profit.'])}`, [['15 × 1.4', money(15 * 1.4)], ['21 − 15', money(15 * 1.4 - 15)]]);
  const r = 22.4;
  q('A', `Ruby earns ${money(r)} per hour. ${ps(['Find her pay for 30 hours.', 'Find her pay for 5 hours at time and a half.', 'Find her total pay.'], 3)}`,
    [[`30 × ${num(r, 2)}`, money(30 * r)], [`5 × 1.5 × ${num(r, 2)}`, money(5 * 1.5 * r)], [`${num(30 * r, 2)} + ${num(7.5 * r, 2)}`, money(37.5 * r)]]);
  q('A', 'Leo earns 6% commission on sales of $1850. How much commission does he earn?', [['0.06 × 1850', money(0.06 * 1850)]]);
  const g = 35 * 26.8;
  q('A', `Mai works 35 hours at $26.80 per hour. ${ps(['Find her gross pay.', 'She pays $154.20 tax and $38.50 super. Find her net pay.'], 2)}`,
    [['35 × 26.80', money(g)], [`${num(g, 2)} − 154.20 − 38.50`, money(g - 154.2 - 38.5)]]);
  q('A', 'Josh borrows $1500 for a laptop. He repays $75 a month for 2 years. How much interest does he pay?', [['75 × 24 = $1800, 1800 − 1500', money(75 * 24 - 1500)]]);
  const A_ = Math.round(6000 * 1.04 ** 2 * 100) / 100;
  q('A', `$6000 is invested at 4% compound interest each year for 2 years. Use ${v('A')} = ${v('P')}(1 + ${v('R')})${sup(v('n'))}. ${ps(['Find the value after 2 years.', 'Find the interest earned.'], 2)}`,
    [[`6000 × 1.04${sup(2)}`, money(A_)], [`${num(A_, 2)} − 6000`, money(A_ - 6000)]]);
}

// ================= B MEASUREMENT =================
{
  q('B', `Convert: ${ps(['3.8 km to m', '1.75 L to mL', '2400 m to km', '350 cm to m'], 2)}`,
    [['3.8 × 1000', `${num(3800)} m`], ['1.75 × 1000', '1750 mL'], ['2400 ÷ 1000', '2.4 km'], ['350 ÷ 100', '3.5 m']]);
  q('B', `${ps(['Find the area of a rectangle 9 cm long and 4 cm wide.', 'Find the volume of a cube with sides 6 cm long.'], 2)}`, [['9 × 4', '36 cm²'], ['6 × 6 × 6', '216 cm³']]);
  q('B', `${ps(['Write 84 000 in scientific notation.', 'Write 5 600 000 in scientific notation.', `Write 3.9 × 10${sup(4)} as an ordinary number.`], 3)}`,
    [['', `8.4 × 10${sup(4)}`], ['', `5.6 × 10${sup(6)}`], ['3.9 × 10 000', num(39000)]]);
  q('B', 'Find the perimeter of this rectangular garden.', [['14 + 9 + 14 + 9', `${14 + 9 + 14 + 9} m`]], fig.rect('14 m', '9 m'));
  q('B', `A circle has a radius of 7 cm. Find, to 1 decimal place: ${ps(['the circumference', 'the area'])}`,
    [['2 × π × 7', `${d1(2 * Math.PI * 7)} cm`], ['π × 7 × 7', `${d1(Math.PI * 49)} cm²`]], fig.circle('7 cm'));
  q('B', `Find the area of <b>a</b> the triangle and <b>b</b> the trapezium.<div class="figrow"><div><b>a</b> ${fig.triangle('10 cm', '6 cm')}</div><div><b>b</b> ${fig.trap('5 cm', '9 cm', '4 cm')}</div></div>`, [['½ × 10 × 6', '30 cm²'], ['½ × (5 + 9) × 4', `${0.5 * 14 * 4} cm²`]]);
  q('B', 'Find the surface area of this box. Find the area of each pair of faces first.', [['2 × 40 + 2 × 24 + 2 × 15 = 80 + 48 + 30', `${2 * (40 + 24 + 15)} cm²`]], fig.box('8 cm', '5 cm', '3 cm'));
  const V = d1(Math.PI * 16 * 9);
  q('B', `This cylinder has radius 4 cm and height 9 cm. ${ps(['Find its volume, to 1 decimal place.', 'How many millilitres can it hold?'], 1)}`,
    [['π × 4 × 4 × 9', `${V} cm³`], ['1 cm³ = 1 mL', `${V} mL`]], fig.cyl('4 cm', '9 cm'));
}

// ================= C STATISTICS AND PROBABILITY =================
{
  const cl = [['the number of siblings you have', 'numerical, discrete'], ['your favourite food', 'categorical, nominal'], ['the mass of a dog', 'numerical, continuous'], ['a coffee size (small, medium, large)', 'categorical, ordinal']];
  q('C', `Classify each type of data as categorical (nominal or ordinal) or numerical (discrete or continuous). ${ps(cl.map((c) => c[0]), 2)}`, cl.map((c) => ['', c[1]]));
  const vals = [32, 36, 41, 45, 45, 48, 50, 53, 59];
  q('C', `The stem-and-leaf plot shows the scores of ${vals.length} players. Find ${ps(['the lowest score', 'the mode', 'the median', 'the range'], 2)}`,
    [['', String(vals[0])], ['45 appears twice', '45'], ['the 5th score', String(vals[4])], [`${vals[8]} − ${vals[0]}`, String(vals[8] - vals[0])]],
    stemLeaf([[3, [2, 6]], [4, [1, 5, 5, 8]], [5, [0, 3, 9]]], '4 | 1 means 41'));
  const list = [7, 3, 10, 4, 6], s = [...list].sort((a, b) => a - b), tot = list.reduce((a, b) => a + b, 0);
  q('C', `Kai’s goals in 5 games were ${list.join(', ')}. Find ${ps(['the mean', 'the median', 'the range'])}`,
    [[`${tot} ÷ 5`, num(tot / 5)], [`in order ${s.join(', ')}`, String(s[2])], [`${s[4]} − ${s[0]}`, String(s[4] - s[0])]]);
  q('C', `A normal 6-sided dice is rolled. Find the probability of rolling ${ps(['a 3', 'a number less than 3', 'an even number'])}`,
    [['1 out of 6', frac(1, 6)], ['1, 2', fracW(2, 6)], ['2, 4, 6', fracW(3, 6)]]);
  const w = 'PARALLEL', cnt = (f) => [...w].filter(f).length;
  q('C', `A letter is chosen at random from the word <span class="word">${w}</span>. Find the probability that it is ${ps(['an L', 'an A', 'a vowel'])}`,
    [[`${cnt((c) => c === 'L')} out of ${w.length}`, fracW(cnt((c) => c === 'L'), w.length)], [`${cnt((c) => c === 'A')} out of ${w.length}`, fracW(cnt((c) => c === 'A'), w.length)], [`A, A, E: ${cnt((c) => 'AEIOU'.includes(c))} out of ${w.length}`, fracW(cnt((c) => 'AEIOU'.includes(c)), w.length)]]);
  q('C', 'Describe the trend in this time-series graph: upward, downward or no trend.', [['the line goes down', 'downward trend']],
    fig.line('Swimsuits sold each month', ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], [30, 27, 19, 14, 8, 5], 35, 5, 'Swimsuits sold'));
  const ft = [['0–14', 2], ['15–29', 4], ['30–44', 8], ['45–59', 4], ['60–74', 2]], ftot = ft.reduce((a, b) => a + b[1], 0);
  q('C', `Students recorded their minutes of homework last night.
    <table class="t"><tr><th>Minutes</th>${ft.map((r) => `<th>${r[0]}</th>`).join('')}</tr><tr><td>Frequency</td>${ft.map((r) => `<td>${r[1]}</td>`).join('')}</tr></table>
    ${ps(['Find the total.', 'Draw a column graph of the data.', 'What percentage did 30–44 minutes?', 'Is the data symmetrical or skewed?'], 2)}`,
    [[ft.map((r) => r[1]).join(' + '), String(ftot)], ['', 'columns of height 2, 4, 8, 4, 2'], [`${ft[2][1]} ÷ ${ftot} × 100`, `${num((ft[2][1] / ftot) * 100)}%`], ['same shape on both sides', 'symmetrical']]);
  freqN = qn;
}

// ================= D OTHER YEAR 10 TOPICS =================
{
  q('D', `Simplify ${ps([`${v('x')}${sup(4)} × ${v('x')}${sup(3)}`, `${v('a')}${sup(9)} ÷ ${v('a')}${sup(4)}`])}`, [['add the powers', `${v('x')}${sup(7)}`], ['subtract the powers', `${v('a')}${sup(5)}`]]);
  q('D', `If ${v('m')} = 5, find ${ps([`3${v('m')} + 2`, `12 − 2${v('m')}`])}`, [['3 × 5 + 2', String(3 * 5 + 2)], ['12 − 2 × 5', String(12 - 10)]]);
  const x1 = (23 - 3) / 4, x2 = 5 * 3 - 4;
  if (4 * x1 + 3 !== 23 || (x2 + 4) / 3 !== 5) throw new Error('equation answers wrong');
  q('D', `Solve ${ps([`4${v('x')} + 3 = 23`, `${fr(`${v('x')} + 4`, 3)} = 5`])}`, [[`4${v('x')} = 20`, `${v('x')} = ${x1}`], [`${v('x')} + 4 = 15`, `${v('x')} = ${x2}`]]);
  const yv = [0, 1, 2, 3].map((x) => 2 * x + 3);
  q('D', `The rule for a line is ${v('y')} = 2${v('x')} + 3.
    ${ps([`Copy and complete the table. <table class="t inl"><tr><th>${v('x')}</th><td>0</td><td>1</td><td>2</td><td>3</td></tr><tr><th>${v('y')}</th><td></td><td></td><td></td><td></td></tr></table>`, 'Plot the points and join them with a ruler.', 'Write the gradient and the <i>y</i>-intercept.'], 3)}`,
    [['', `${v('y')} = ${yv.join(', ')}`], ['', `(0, ${yv[0]}), (1, ${yv[1]}), (2, ${yv[2]}), (3, ${yv[3]}) in a straight line`], ['', 'gradient 2, y-intercept 3']]);
  const c2 = 5 * 5 + 9 * 9;
  q('D', `Find the hypotenuse, ${v('c')}. Give <b>b</b> to 1 decimal place.<div class="figrow"><div><b>a</b> ${fig.pyth('7 cm', '24 cm')}</div><div><b>b</b> ${fig.pyth('5 cm', '9 cm')}</div></div>`,
    [[`${v('c')}² = 49 + 576 = 625`, `${Math.sqrt(625)} cm`], [`${v('c')}² = 25 + 81 = ${c2}`, `${d1(Math.sqrt(c2))} cm`]]);
  q('D', `Find ${v('x')}, to 1 decimal place.`, [[`${v('x')} = 12 × tan 30°`, `${d1(12 * Math.tan(Math.PI / 6))} cm`]], fig.trig(30, '12 cm'));
}

// ================= PAGES =================
const css = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8') + `
@page { margin: 9mm 10mm 11mm 10mm; }
body { font-size: 9.5pt; line-height: 1.33; }
h1 { font-size: 15pt; } .banner img { height: 34px; } .banner .sub { font-size: 9.5pt; }
h2 { font-size: 10.5pt; padding: 3px 8px; margin: 8px 0 3px; }
.wq .figrow svg { max-width: 100%; height: auto; }
.wq, .wa { display: flex; gap: 6px; padding: 4px 0; border-bottom: 1px solid var(--line); break-inside: avoid; }
.wq .n, .wa .n { flex: 0 0 auto; background: var(--blue); color: #fff; font-weight: bold; border-radius: 3px; min-width: 20px; height: 17px; text-align: center; font-size: 8.6pt; line-height: 17px; }
.wq .body, .wa .body { flex: 1; min-width: 0; }
.cols { column-count: 2; column-gap: 14px; }
.parts { margin: 1px 0; gap: 0 12px; }
.parts.c1 { grid-template-columns: 1fr; }
.fig svg { display: block; }
.figrow { margin: 0; gap: 0 8px; }
table.t { font-size: 8.6pt; margin: 2px 0; } table.t th, table.t td { padding: 1px 6px; min-width: 20px; }
table.t.inl { display: inline-table; vertical-align: middle; margin: 0 0 0 4px; }
.wa .pt { margin-right: 14px; display: inline-block; }
.tip { margin: 3px 0; padding: 2px 8px; }`;
const head = (title) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${title}</title><style>${css}</style></head><body>`;
const banner = (title, sub) => `<div class="banner"><img src="${LOGO}" alt="Kingscliff High School"><div><h1>${title}</h1><div class="sub">${sub}</div></div></div><div class="rule"></div>`;
const NAMES = { A: 'Financial mathematics', B: 'Measurement', C: 'Statistics and probability', D: 'Other Year 10 topics' };

const sheet = head('Year 10 Revision Worksheet') + banner('Year 10 Yearly Test Revision Worksheet', 'Year 10 Transition · 2026 · One question for every skill in the test') +
  `<p class="intro">Answer in your maths workbook. Show your working and write the units. A calculator is allowed. Stuck? Use the Year 10 Yearly Test help sheet.</p>
  <h2>A · ${NAMES.A}</h2><div class="cols">${sections.A.join('')}</div>
  <h2>B · ${NAMES.B}</h2><div class="cols">${sections.B.join('')}</div>
  <div class="page-break"></div>
  <h2>C · ${NAMES.C}</h2><div class="cols">${sections.C.join('')}</div>
  <h2>D · ${NAMES.D}</h2><div class="cols">${sections.D.join('')}</div></body></html>`;

const key = head('Year 10 Revision Worksheet Answers') + banner('Revision Worksheet Answers', 'Year 10 Yearly Test Revision Worksheet · 2026') +
  `<p class="intro">Working is shown before each answer. Answers are rounded at the last step.</p>` +
  Object.keys(NAMES).map((k) => `<h2>${k} · ${NAMES[k]}</h2>${answers[k].join('')}`).join('') +
  `<div class="wa"><div class="n"></div><div class="body"><span class="topic">Column graph for Question ${freqN}b</span><br>${fig.columns(['0–14', '15–29', '30–44', '45–59', '60–74'], [2, 4, 8, 4, 2], 9, 'Minutes')}</div></div></body></html>`;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(BUILD, { recursive: true });
  const shotDir = process.argv.includes('--shots') ? process.argv[process.argv.indexOf('--shots') + 1] : null;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const jobs = [['Year10-Yearly-Test-2026-Revision-Worksheet', sheet, 'Year 10 Yearly Test Revision Worksheet', 2], ['Year10-Yearly-Test-2026-Revision-Worksheet-Answers', key, 'Revision Worksheet Answers', null]];
  for (const [name, html, foot, pages] of jobs) {
    const htmlPath = path.join(BUILD, name + '.html');
    fs.writeFileSync(htmlPath, html);
    await page.goto('file://' + htmlPath);
    const pdf = path.join(OUT, name + '.pdf');
    await page.pdf({ path: pdf, format: 'A4', printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true, headerTemplate: '<div></div>',
      footerTemplate: `<div style="font-family:'DejaVu Serif',serif;font-size:7.5px;color:#555;width:100%;padding:0 10mm;display:flex;justify-content:space-between"><span>Kingscliff High School · ${foot}</span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>` });
    const n = (fs.readFileSync(pdf, 'latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
    console.log('wrote', name + '.pdf', `(${n} pages)`);
    if (pages && n !== pages) { await browser.close(); throw new Error(`${name} must be ${pages} pages, got ${n}`); }
  }
  await browser.close();
  if (shotDir) {
    fs.mkdirSync(shotDir, { recursive: true });
    for (const [name] of jobs) require('child_process').execFileSync('pdftoppm', ['-r', '70', '-png', path.join(OUT, name + '.pdf'), path.join(shotDir, name)]);
  }
})();
