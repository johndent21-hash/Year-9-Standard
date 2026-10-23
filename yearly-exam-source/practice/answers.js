// Adds the answers to the back of a built practice exam.
//   node practice/answers.js <build dir with exam.json> <exam pdf> <output pdf>
// Two answer pages (Sections 1 and 2, then Section 3) in the exam's style, numbered on from the exam's last page.
// Each answer names the help sheet topic to read if the student got it wrong.
'use strict';
const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

const [buildDir, examPdf, outPdf] = process.argv.slice(2);
const model = JSON.parse(fs.readFileSync(path.join(buildDir, 'exam.json'), 'utf8'));

// help sheet topic for each question topic (the topic names are set in s1.js, s2.js and s3.js)
const HELP = [
  [/Classifying/, 'D1 Types of data'], [/Shape of a distribution/, 'D2 Shape of a distribution'],
  [/Mode from a histogram|column graph/, 'D3 Reading graphs'], [/outlier/, 'D5 Outliers'],
  [/Mean and median/, 'D4 Mean, median, mode, range'], [/Comparing two data sets/, 'D6 Comparing two data sets'],
  [/capacity\b|Metric units/, 'M1 Units'], [/triangle|parallelogram|kite|rhombus/, 'M2 Area of shapes'],
  [/circle/, 'M3 Circles'], [/composite/, 'M4 Composite shapes'], [/cylinder/, 'M5 Volume; M6 Surface area'],
  [/closed box/, 'M5 Volume; M6 Surface area'],
  [/Substitution/, 'A1 Substitution'], [/Pythagoras’ theorem: hypotenuse/, 'T1 Pythagoras'], [/Discount|Profit/, 'F1 Percentages and profit'],
  [/Index laws/, 'A5 Index laws'], [/Salary|Wages|Commission/, 'F3 Earning money'], [/Simplifying/, 'A2 Simplifying'],
  [/Expanding/, 'A3 Expanding'], [/Factorising/, 'A4 Factorising'], [/Simple interest/, 'F2 Simple interest'],
  [/Solving equations/, 'E1 Solving equations'], [/Using a formula/, 'E2 Formulas and word problems'],
  [/Ladder/, 'T1 Pythagoras; T2 Trigonometry'],
];
// parts of one question that need different help sheet topics
const PART = { 's2:6a': 'M5 Volume', 's2:6b': 'M6 Surface area', 's2:8a': 'M5 Volume', 's2:8b': 'M1 Units',
  's2:8c': 'M6 Surface area', 's3:15a': 'T1 Pythagoras', 's3:15b': 'T2 Trigonometry' };
const help = (S, r) => PART[`${S.id}:${r.q}`] || (HELP.find(([re]) => re.test(r.topic)) || [null, ''])[1];

const firstAnswerPage = (() => {
  const out = execSync(`pdfinfo "${examPdf}"`).toString();
  return +out.match(/Pages:\s+(\d+)/)[1] + 1;
})();

const table = (S) => `
  <table class="ak">
    <tr class="t"><td colspan="4">${S.title.replace('answer summary', 'answers')}</td></tr>
    <tr class="h"><td class="q">Q</td><td>Answer</td><td class="m">Marks</td><td class="hs">If you got it wrong, read…</td></tr>
    ${S.rows.map((r) => `<tr><td class="q">${r.q}</td><td>${r.answer}</td><td class="m">${r.marks}</td><td class="hs">${help(S, r)}</td></tr>`).join('')}
    <tr class="tot"><td></td><td>Total</td><td class="m">${S.marks}</td><td></td></tr>
  </table>`;

const [s1, s2, s3] = model.summary;
const page = (n, body, head = '') => `<div class="page">${head}${body}<div class="pn">${n}</div></div>`;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Caladea, Cambria, "Liberation Serif", serif; font-size: 10.5pt; line-height: 1.2; }
  .page { position: relative; width: 210mm; height: 297mm; padding: 16mm 13mm 0; page-break-after: always; overflow: hidden; }
  .pn { position: absolute; left: 25.4mm; top: 276.9mm; font: 11pt/4mm Carlito, Calibri, sans-serif; }
  h1 { font: 700 18pt/1.2 "Liberation Sans", Arial, sans-serif; color: #0f3a63; margin: 0 0 1.5mm; }
  p.note { margin: 0 0 4mm; font-size: 10pt; }
  table.ak { width: 100%; border-collapse: collapse; margin-bottom: 5mm; }
  table.ak td { border: 0.26mm solid #1f1f1f; padding: 1.1mm 2mm; vertical-align: top; }
  tr.t td { background: #0f3a63; color: #fff; font-weight: 700; font-size: 13pt; text-align: center; }
  tr.h td { background: #e9f0f8; font-weight: 700; }
  tr.tot td { background: #e9f0f8; font-weight: 700; }
  td.q { width: 10mm; text-align: center; font-weight: 700; }
  td.m { width: 14mm; text-align: center; }
  td.hs { width: 52mm; font-size: 9.5pt; color: #333; }
  sup { line-height: 0; }
</style></head><body>
${page(firstAnswerPage, table(s1) + table(s2), `<h1>Answers</h1><p class="note">Mark your own work. If an answer is wrong, read the help sheet topic in the last column, then try the question again.</p>`)}
${page(firstAnswerPage + 1, table(s3))}
</body></html>`;

const htmlPath = path.join(buildDir, 'answers.html');
fs.writeFileSync(htmlPath, html);
const ansPdf = path.join(buildDir, 'answers.pdf');

const loadPlaywright = () => {
  try { return require('playwright'); } catch {
    return require(require.resolve('playwright', { paths: [execSync('npm root -g').toString().trim()] }));
  }
};

(async () => {
  const { chromium } = loadPlaywright();
  const browser = await chromium.launch();
  const p = await browser.newPage();
  await p.goto(`file://${path.resolve(htmlPath)}`);
  await p.evaluate(() => document.fonts.ready);
  const over = await p.evaluate(() => [...document.querySelectorAll('.page')].map((pg) => {
    const last = [...pg.querySelectorAll('table')].pop();
    return last.getBoundingClientRect().bottom > pg.getBoundingClientRect().top + 270 * 96 / 25.4;
  }));
  if (over.some(Boolean)) console.log('  ! an answer page overflows');
  await p.pdf({ path: ansPdf, format: 'A4', printBackground: true, preferCSSPageSize: true });
  await browser.close();
  const r = spawnSync('python3', ['-c', `
import sys
from pypdf import PdfWriter
w = PdfWriter()
for f in sys.argv[1:3]: w.append(f)
w.write(sys.argv[3])`, examPdf, ansPdf, outPdf], { stdio: 'inherit' });
  if (r.status !== 0) process.exit(1);
  console.log(`Wrote ${outPdf} (answers on pages ${firstAnswerPage}-${firstAnswerPage + 1})`);
})();
