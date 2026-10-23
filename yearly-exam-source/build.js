// Builds the Year 9 5.2 Yearly Exam 2026 and its marking guide.
//
//   node build.js [--only s1,s2,s3] [--out <dir>] [--build <dir>] [--shots <dir>] [--no-docx] [--verbose] [--exam <file>]
//
// Writes to --out (default: ../Yearly exam 2026):
//   Year9-5.2-Yearly-Exam-2026.pdf, Year9-5.2-Yearly-Exam-2026-Marking-Guide.pdf,
//   Year9-5.2-Yearly-Exam-2026.docx, Year9-5.2-Yearly-Exam-2026-Marking-Guide.docx (unless --no-docx)
// and to the build folder: exam.json (all questions, computed answers, totals, levels, page breaks), figs/*.png (every
// figure at 300 dpi, used by Word), and the HTML pages. The full build uses build/; a build with --only or --out uses
// its own folder (build/only-s1-s2, build/out-<name>, or --build <dir>), so builds run at the same time never
// overwrite each other's figures or exam.json. --shots <dir> saves a PNG of every PDF page. Layout checks print warnings.
'use strict';
const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');
const { buildModel } = require('./lib/model');
const { renderAll } = require('./lib/html');
const pageCode = require('./lib/page');

const ROOT = __dirname;
const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const flag = (name) => args.includes(name);
const ONLY = opt('--only') ? opt('--only').split(',').map((s) => s.trim()) : null;
// The build folder (HTML, figure PNGs, exam.json): build/ for the full build; a partial build (--only) or a build to
// another --out folder gets its own folder, so parallel builds never overwrite each other's files.
const safe = (s) => s.replace(/[^A-Za-z0-9._-]+/g, '-');
const BUILD = path.resolve(opt('--build') || (ONLY ? path.join(ROOT, 'build', `only-${safe(ONLY.join('-'))}`)
  : opt('--out') ? path.join(ROOT, 'build', `out-${safe(path.basename(path.resolve(opt('--out'))))}`) : path.join(ROOT, 'build')));
// a partial build (--only) writes its PDFs into its build folder unless --out is given, so it never replaces the full exam
const OUT = path.resolve(opt('--out') || (ONLY ? BUILD : path.join(ROOT, '..', 'Yearly exam 2026')));
const SHOTS = opt('--shots') ? path.resolve(opt('--shots')) : null;
const VERBOSE = flag('--verbose');

const loadPlaywright = () => {
  try { return require('playwright'); } catch {
    return require(require.resolve('playwright', { paths: [execSync('npm root -g').toString().trim()] }));
  }
};

(async () => {
  const exam = require(opt('--exam') ? path.resolve(opt('--exam')) : './exam');
  exam.sections = exam.sections.map((s, i) => ({ ...s, no: s.no || i + 1 })); // keep the section numbers when --only is used
  if (ONLY) exam.sections = exam.sections.filter((s) => ONLY.includes(s.id));
  const model = buildModel(exam);
  const base = exam.meta.fileBase;

  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(path.join(BUILD, 'figs'), { recursive: true });
  for (const f of fs.readdirSync(path.join(BUILD, 'figs'))) fs.unlinkSync(path.join(BUILD, 'figs', f));

  const { examHtml, guideHtml, figsHtml } = renderAll(model, { assets: path.relative(BUILD, path.join(ROOT, 'assets')).split(path.sep).join('/') });
  const jobs = [
    { key: 'exam', name: base, file: 'exam.html', html: examHtml },
    { key: 'guide', name: `${base}-Marking-Guide`, file: 'guide.html', html: guideHtml },
  ];

  const { chromium } = loadPlaywright();
  const browser = await chromium.launch();
  const layout = [];
  const pagesOut = {};
  const breaks = {}; // where each section table continues on a new page, per document (Word splits its tables there)
  for (const job of jobs) {
    const htmlPath = path.join(BUILD, job.file);
    fs.writeFileSync(htmlPath, job.html);
    const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: SHOTS ? 1.5 : 1 });
    await page.goto(`file://${htmlPath}`);
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(`(${pageCode.prepare.toString()})()`);
    const pg = await page.evaluate(`(${pageCode.paginate.toString()})()`);
    pg.notes.forEach((n) => layout.push(`${job.name}: ${n}`));
    const res = await page.evaluate(`(${pageCode.checks.toString()})()`);
    res.forEach((r) => layout.push(`${job.name}: ${r}`));
    await page.pdf({ path: path.join(OUT, `${job.name}.pdf`), format: 'A4', printBackground: true, preferCSSPageSize: true });
    pagesOut[job.name] = pg.pages;
    breaks[job.key] = pg.breaks;
    if (SHOTS) {
      fs.mkdirSync(SHOTS, { recursive: true });
      const els = await page.$$('.page');
      for (let i = 0; i < els.length; i++) await els[i].screenshot({ path: path.join(SHOTS, `${job.name}-p${String(i + 1).padStart(2, '0')}.png`) });
    }
    await page.close();
  }

  // every figure as a 300 dpi PNG (for Word), measured in mm
  const figPath = path.join(BUILD, 'figs.html');
  fs.writeFileSync(figPath, figsHtml);
  const fp = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 300 / 96 });
  await fp.goto(`file://${figPath}`);
  await fp.evaluate(() => document.fonts.ready);
  for (const id of Object.keys(model.figures)) {
    const el = await fp.$(`[data-fig="${id}"]`);
    const png = path.join(BUILD, 'figs', `${id}.png`);
    await el.screenshot({ path: png });
    const box = await el.boundingBox();
    Object.assign(model.figures[id], { png: path.relative(BUILD, png), wmm: +(box.width * 25.4 / 96).toFixed(2), hmm: +(box.height * 25.4 / 96).toFixed(2) });
  }
  await fp.close();
  await browser.close();

  // exam.json: everything the Word builder (and anyone checking the exam) needs
  const json = { ...model, generated: new Date().toISOString(), files: { exam: base, guide: `${base}-Marking-Guide` }, logo: path.join(ROOT, 'assets', 'kingscliff-logo.png'), partial: !!ONLY, breaks };
  // the question data without the SVG code (figures are in build/figs and listed under "figures")
  const noSvg = (x) => (typeof x === 'string' && x.trim().startsWith('<svg') ? '[figure]' : Array.isArray(x) ? x.map(noSvg)
    : x && typeof x === 'object' ? Object.fromEntries(Object.entries(x).map(([k, v]) => [k, noSvg(v)])) : x);
  json.sections = model.sections.map((S) => ({ ...S, questions: S.questions.map(noSvg) }));
  Object.values(json.figures).forEach((f) => { delete f.svg; });
  fs.writeFileSync(path.join(BUILD, 'exam.json'), JSON.stringify(json, null, 1));

  // Word
  if (!flag('--no-docx')) {
    const r = spawnSync('python3', [path.join(ROOT, 'build-docx.py'), '--json', path.join(BUILD, 'exam.json'), '--out', OUT], { stdio: 'inherit' });
    if (r.status !== 0) console.log('  ! build-docx.py failed');
  }

  // ---------- report ----------
  const warn = (list, title) => { if (list.length) { console.log(`\n${title} (${list.length}):`); list.forEach((w) => console.log(`  ! ${w}`)); } };
  warn(model.warnings, 'Question data warnings');
  warn(model.briefWarnings, 'Differences from the brief');
  const real = layout.filter((l) => !l.includes(': note:'));
  warn(real, 'Layout warnings');
  if (VERBOSE) warn(layout.filter((l) => l.includes(': note:')), 'Layout notes');
  else if (layout.length > real.length) console.log(`\n(${layout.length - real.length} layout note(s) about the marking guide; --verbose shows them)`);

  console.log(`\nWrote to ${OUT}:`);
  jobs.forEach((j) => console.log(`  ${j.name}.pdf (${pagesOut[j.name]} pages)${flag('--no-docx') ? '' : `, ${j.name}.docx`}`));
  const rel = path.relative(ROOT, BUILD) || '.';
  console.log(`  ${rel}/exam.json, ${Object.keys(model.figures).length} figure PNG(s) in ${rel}/figs${ONLY ? `  [partial build: ${ONLY.join(', ')}]` : ''}`);
  console.log('\nMarks           total  green  blue   MC  short  worded');
  model.sections.forEach((S) => console.log(`  Section ${S.no}      ${String(S.marks).padStart(3)}    ${String(S.green).padStart(3)}   ${String(S.blue).padStart(3)}  ${String(S.groups.mc.marks).padStart(3)}    ${String(S.groups.sa.marks).padStart(3)}    ${S.groups.worded.each.join('+') || '0'}`));
  console.log(`  Overall        ${String(model.total).padStart(3)}    ${String(model.green).padStart(3)}   ${String(model.blue).padStart(3)}   (brief: ${model.brief.total} = ${model.brief.green} green + ${model.brief.blue} blue)`);
  const ok = !model.warnings.length && !real.length;
  console.log(ok ? '\nLayout and data checks passed.' : `\n${model.warnings.length + real.length} warning(s).`);
})().catch((e) => { console.error(e); process.exit(1); });
