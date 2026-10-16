// Draws every figure helper in lib/figs.js with the example from README.md, and runs the same label checks as the
// exam build. Use it to see what each helper makes before putting one in a question.
//
//   node gallery.js [--out <dir>] [--shots <dir>]      writes figure-gallery.pdf (default: build/)
'use strict';
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const F = require('./lib/figs');
const pageCode = require('./lib/page');

const ROOT = __dirname;
const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const OUT = path.resolve(opt('--out') || path.join(ROOT, 'build'));
const SHOTS = opt('--shots') ? path.resolve(opt('--shots')) : null;

const marks = [45, 67, 78, 54, 22, 38, 58, 64, 73, 89, 84, 70, 78, 62, 56, 59, 42, 47, 86, 90, 64, 63, 72, 77, 43, 85, 75, 71, 70, 83];
const girls = [160, 153, 155, 156, 142, 163, 162, 148, 150, 150, 131, 138, 147, 145];
const boys = [150, 165, 164, 178, 170, 171, 164, 148, 154, 176, 134, 180, 176, 175];

const EX = [
  ["F.dotPlot({ data: [2, 3, 3, 4, 4, 4, 5, 5, 6, 8], min: 0, max: 8, xTitle: 'Goals scored' })", () => F.dotPlot({ data: [2, 3, 3, 4, 4, 4, 5, 5, 6, 8], min: 0, max: 8, xTitle: 'Goals scored' })],
  ["F.histogram({ labels: [0, 1, 2, 3, 4, 5, 6], freq: [5, 9, 7, 4, 3, 1, 1], xTitle: 'Number of brothers and sisters' })", () => F.histogram({ labels: [0, 1, 2, 3, 4, 5, 6], freq: [5, 9, 7, 4, 3, 1, 1], xTitle: 'Number of brothers and sisters' })],
  ["F.histogram({ kind: 'column', labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], freq: [12, 7, 9, 15, 4], yStep: 2, xTitle: 'Day', yTitle: 'Students' })", () => F.histogram({ kind: 'column', labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], freq: [12, 7, 9, 15, 4], yStep: 2, xTitle: 'Day', yTitle: 'Students' })],
  ["F.histogram({ labels: [140, 150, 160, 170, 180], freq: [3, 8, 11, 6], edges: true, polygon: true, yStep: 2, xTitle: 'Height (cm)' })", () => F.histogram({ labels: [140, 150, 160, 170, 180], freq: [3, 8, 11, 6], edges: true, polygon: true, yStep: 2, xTitle: 'Height (cm)' })],
  ["F.stemLeaf({ data: marks, key: '4 | 5 = 45' })", () => F.stemLeaf({ data: marks, key: '4 | 5 = 45' })],
  ["F.stemLeaf({ rows: [[2, ['□']], [3, [0, 2, 3, 4]], [5, [2, 4, '□', 6, 9, 9]]], key: '3 | 2 = 32' })", () => F.stemLeaf({ rows: [[2, ['□']], [3, [0, 2, 3, 4]], [4, [1, 5, 7, 8]], [5, [2, 4, '□', 6, 9, 9]]], key: '3 | 2 = 32' })],
  ["F.backToBack({ left: girls, right: boys, heads: ['Girls', 'Boys'], key: '15 | 3 = 153' })", () => F.backToBack({ left: girls, right: boys, heads: ['Girls', 'Boys'], key: '15 | 3 = 153' })],
  ["F.rectPrism({ l: 12, w: 5, h: 4, unit: 'cm' })", () => F.rectPrism({ l: 12, w: 5, h: 4, unit: 'cm' })],
  ["F.triPrism({ b: 6, h: 8, len: 15, unit: 'cm', labels: { s: '10 cm' } })", () => F.triPrism({ b: 6, h: 8, len: 15, unit: 'cm', labels: { s: '10 cm' } })],
  ["F.triPrism({ b: 10, h: 6, len: 14, apex: 5, unit: 'm' })", () => F.triPrism({ b: 10, h: 6, len: 14, apex: 5, unit: 'm' })],
  ["F.prism({ face: [[0,0],[8,0],[8,3],[4,6],[0,3]], len: 10, sides: ['8 m'], lenLabel: '10 m' })", () => F.prism({ face: [[0, 0], [8, 0], [8, 3], [4, 6], [0, 3]], len: 10, sides: ['8 m'], lenLabel: '10 m' })],
  ["F.shape({ pts: [[0,0],[10,0],[6,5]], sides: ['10 cm', '', ''], right: [] })", () => F.shape({ pts: [[0, 0], [10, 0], [6, 5]], sides: ['10 cm', '', ''], right: [] })],
  ["F.cylinder({ r: 3.5, h: 10, unit: 'cm' })", () => F.cylinder({ r: 3.5, h: 10, unit: 'cm' })],
  ["F.cylinder({ r: 6, h: 4, unit: 'm', show: 'd', open: true })", () => F.cylinder({ r: 6, h: 4, unit: 'm', show: 'd', open: true })],
  ["F.composite({ pts: [[0,0],[7,0],[7,6],[13,6],[13,13],[0,13]], sides: 'auto', unit: 'm' })", () => F.composite({ pts: [[0, 0], [7, 0], [7, 6], [13, 6], [13, 13], [0, 13]], sides: 'auto', unit: 'm' })],
  ["F.composite({ pts: [[0,0],[3,0],[3,9],[21,9],[21,0],[24,0],[24,18],[0,18]], sides: ['', '', '18 cm', '9 cm', '', '', '24 cm', ''], size: 40 })", () => F.composite({ pts: [[0, 0], [3, 0], [3, 9], [21, 9], [21, 0], [24, 0], [24, 18], [0, 18]], sides: ['', '', '18 cm', '9 cm', '', '', '24 cm', ''], size: 40 })],
  ["F.rectangle({ l: 12, w: 5, unit: 'cm' })", () => F.rectangle({ l: 12, w: 5, unit: 'cm' })],
  ["F.triangle({ b: 10, h: 6, a: 3.5, unit: 'cm' })", () => F.triangle({ b: 10, h: 6, a: 3.5, unit: 'cm' })],
  ["F.trapezium({ a: 6, b: 10, h: 4, unit: 'cm' })", () => F.trapezium({ a: 6, b: 10, h: 4, unit: 'cm' })],
  ["F.trapezium({ a: 5, b: 9, h: 4, s: 0, unit: 'm' })", () => F.trapezium({ a: 5, b: 9, h: 4, s: 0, unit: 'm' })],
  ["F.parallelogram({ b: 10, h: 5, s: 3, unit: 'm' })", () => F.parallelogram({ b: 10, h: 5, s: 3, unit: 'm' })],
  ["F.rhombus({ x: 16, y: 10, unit: 'cm' })", () => F.rhombus({ x: 16, y: 10, unit: 'cm' })],
  ["F.kite({ x: 10, y: 16, c: 11, unit: 'cm' })", () => F.kite({ x: 10, y: 16, c: 11, unit: 'cm' })],
  ["F.sector({ r: 6, angle: 120, unit: 'cm', angleLabel: '120°' })", () => F.sector({ r: 6, angle: 120, unit: 'cm', angleLabel: '120°' })],
  ["F.circle({ r: 5, unit: 'mm' })", () => F.circle({ r: 5, unit: 'mm' })],
  ["F.semicircle({ r: 7, unit: 'm' })", () => F.semicircle({ r: 7, unit: 'm' })],
  ["F.quadrant({ r: 4, unit: 'cm' })", () => F.quadrant({ r: 4, unit: 'cm' })],
  ["F.rightTriangle({ base: 8, height: 6, unit: 'cm', labels: { hyp: '<i>x</i>' } })", () => F.rightTriangle({ base: 8, height: 6, unit: 'cm', labels: { hyp: '<i>x</i>' } })],
  ["F.rightTriangle({ base: 12, height: 5, corner: 'BL', labels: { base: '12 m', height: '<i>h</i>' }, angle: { at: 'base', label: '23°' } })", () => F.rightTriangle({ base: 12, height: 5, corner: 'BL', labels: { base: '12 m', height: '<i>h</i>' }, angle: { at: 'base', label: '23°' } })],
  ["F.rightTriangle({ base: 9, height: 14, corner: 'TR', labels: { base: '9 cm', height: '', hyp: '16 cm' }, angle: { at: 'vert', label: 'θ' } })", () => F.rightTriangle({ base: 9, height: 14, corner: 'TR', labels: { base: '9 cm', height: '', hyp: '16 cm' }, angle: { at: 'vert', label: 'θ' } })],
  ["F.network({ nodes: { A: [0, 0], B: [4, 1], C: [2, 3], D: [6, 3], E: [5, -1] }, edges: [['A','B',5], ['B','C',3], ['A','C',4], ['C','D',6], ['B','D',2], ['B','E',7], ['D','E',4]] })", () => F.network({ nodes: { A: [0, 0], B: [4, 1], C: [2, 3], D: [6, 3], E: [5, -1] }, edges: [['A', 'B', 5], ['B', 'C', 3], ['A', 'C', 4], ['C', 'D', 6], ['B', 'D', 2], ['B', 'E', 7], ['D', 'E', 4]] })],
  ["F.network({ nodes: { P: [0, 0], Q: [3, 2], R: [6, 0] }, edges: [['P','Q',8], ['Q','R',5], ['P','R',4,4], ['P','R',6,-4]], size: 45 })", () => F.network({ nodes: { P: [0, 0], Q: [3, 2], R: [6, 0] }, edges: [['P', 'Q', 8], ['Q', 'R', 5], ['P', 'R', 4, 4], ['P', 'R', 6, -4]], size: 45 })],
  ["F.rhombus({ x: 16, y: 10, unit: 'cm', dims: false })", () => F.rhombus({ x: 16, y: 10, unit: 'cm', dims: false })],
];
const TABLES = [
  ["F.freqTable({ values: [0, 1, 2, 3], freqs: [4, 7, 6, 3], fx: 'key', total: true })", () => F.freqTable({ values: [0, 1, 2, 3], freqs: [4, 7, 6, 3], fx: 'key', total: true })],
  ["F.table({ head: ['Score', 1, 2, 3, 4], rows: [['Frequency', 3, { key: '5' }, 8, 2]] })", () => F.table({ head: ['Score', 1, 2, 3, 4], rows: [['Frequency', 3, { key: '5' }, 8, 2]] })],
];

const tableHtml = (t) => `<table class="ft">${t.rows.map((r, i) => `<tr>${r.map((c, j) => { const tag = (t.headRow && i === 0) || (t.headCol && j === 0) ? 'th' : 'td'; return c && c.key !== undefined ? `<${tag} class="kc"><span class="key">${c.key}</span></${tag}>` : `<${tag}>${c && c.text !== undefined ? (c.b ? `<b>${c.text}</b>` : c.text) : c}</${tag}>`; }).join('')}</tr>`).join('')}</table>`;
const card = (code, inner) => `<div class="blk gcard"><div class="gcode">${code.replace(/</g, '&lt;')}</div><div class="gfig">${inner}</div></div>`;

(async () => {
  const css = fs.readFileSync(path.join(ROOT, 'lib', 'exam.css'), 'utf8');
  const extra = `.gcard { border: 0.26mm solid #1f1f1f; margin-bottom: 3mm; } .gcode { background: var(--tint); font: 8.5pt/1.3 "Liberation Mono", monospace; padding: 1.2mm 2mm; border-bottom: 0.26mm solid #1f1f1f; } .gfig { padding: 3mm; text-align: center; } .gfig .fig { display: inline-block; }`;
  const body = `<div class="flow" data-flow="gallery">${EX.map(([c, fn]) => card(c, `<span class="fig" data-fig="${c.split('(')[0]}">${fn()}</span>`)).join('')}${TABLES.map(([c, fn]) => card(c, tableHtml(fn()))).join('')}</div>`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Figure gallery</title><style>${css}${extra}</style></head><body class="guide">${body}</body></html>`;
  fs.mkdirSync(OUT, { recursive: true });
  const file = path.join(ROOT, 'build', 'gallery.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  let pw; try { pw = require('playwright'); } catch { pw = require(require.resolve('playwright', { paths: [execSync('npm root -g').toString().trim()] })); }
  const browser = await pw.chromium.launch();
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: SHOTS ? 1.5 : 1 });
  await page.goto(`file://${file}`);
  await page.evaluate(() => document.fonts.ready);
  const pg = await page.evaluate(`(${pageCode.paginate.toString()})()`);
  const res = await page.evaluate(`(${pageCode.checks.toString()})()`);
  await page.pdf({ path: path.join(OUT, 'figure-gallery.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
  if (SHOTS) {
    fs.mkdirSync(SHOTS, { recursive: true });
    const els = await page.$$('.page');
    for (let i = 0; i < els.length; i++) await els[i].screenshot({ path: path.join(SHOTS, `gallery-p${String(i + 1).padStart(2, '0')}.png`) });
  }
  await browser.close();
  [...pg.notes, ...res].forEach((r) => console.log(`  ! ${r}`));
  console.log(`figure-gallery.pdf: ${pg.pages} pages, ${EX.length} figures, ${TABLES.length} tables. ${res.length ? `${res.length} warning(s).` : 'Label checks passed.'}`);
})().catch((e) => { console.error(e); process.exit(1); });
