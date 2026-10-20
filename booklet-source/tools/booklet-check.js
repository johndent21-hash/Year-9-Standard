// Run from booklet-source: node tools/booklet-check.js
// booklet-check.js: structural checks across every lesson of the Chapter 10 booklet (run from booklet-source).
//   each lesson: 3 pages, a Notes box (≤ 7 terms, ≤ 5 formulas, ≤ 4 steps, a diagram), 2 Easy rounds, 4 drill rounds,
//   one Medium set of 9 with 2–4 tagged questions whose tags are earlier lessons or 'Year 8', 3 worded problems;
//   no stacked fractions in printed text; no 'undefined', 'NaN', '[object Object]' or 'null' anywhere in the pages
//   or answers. Prints one line per lesson and exits 1 on any problem.
const c = require(require('path').resolve('year9-standard/ch10-surface-area-volume/chapter.js'));
const order = c.plan.map((p) => p.code);
let bad = 0;
for (const code of order) {
  const probs = [];
  let l;
  try { l = c.only(code).lessons[0](c); } catch (e) { console.log(`${code}: BUILD ERROR ${e.message.split('\n')[0]}`); bad++; continue; }
  const s = l.spec, html = l.pages.join('\n'), ans = JSON.stringify(l.answers);
  const tl = c.only(code, { teacher: true }).lessons[0]({ ...c, teacher: true });
  if (l.pages.length !== 3) probs.push(`${l.pages.length} pages`);
  if (!s.notes) probs.push('no notes'); else {
    if (s.notes.terms.length > 7) probs.push(`${s.notes.terms.length} terms`);
    if (s.notes.formulas.length > 5) probs.push(`${s.notes.formulas.length} formulas`);
    if ((s.notes.steps || []).length > 4) probs.push(`${s.notes.steps.length} steps`);
    if (!s.notes.fig) probs.push('no notes diagram');
  }
  if (s.easy.rounds.length !== 2) probs.push(`${s.easy.rounds.length} Easy rounds`);
  if (!s.drill || s.drill.rounds.length !== 4) probs.push(`${s.drill ? s.drill.rounds.length : 0} drill rounds`);
  const med = s.medium.rounds.flatMap((r) => r.items);
  if (s.medium.rounds.length !== 1 || med.length !== 9) probs.push(`Medium ${s.medium.rounds.map((r) => r.items.length).join('+')}`);
  const raw = require(require('path').resolve(`year9-standard/ch10-surface-area-volume/lessons/${code}.js`));
  const tags = raw.medium.rounds.flatMap((r) => r.items).filter((it) => it && typeof it === 'object' && it.from).map((it) => it.from);
  const idx = order.indexOf(code);
  const badTags = tags.filter((t) => t !== 'Year 8' && !(order.indexOf(t) >= 0 && order.indexOf(t) < idx));
  if (tags.length < 2 || tags.length > 4) probs.push(`${tags.length} tagged Medium questions`);
  if (badTags.length) probs.push(`tags not from earlier lessons: ${badTags.join(', ')}`);
  if ((s.worded || []).length !== 3) probs.push(`${(s.worded || []).length} worded problems`);
  if (s.mixed) probs.push('has a separate mixed box');
  const forms = [...s.easy.rounds, ...s.drill.rounds, ...s.medium.rounds].flatMap((r) => r.items).filter((it) => it && typeof it === 'object' && it.form).length;
  const textRx = /\bundefined\b|\bNaN\b|\[object Object\]|>null<|\bnull\b(?![-\w])/;
  for (const [name, t] of [['pages', html], ['answers', ans], ['teacher pages', tl.pages.join('\n')]]) { const m = t.match(textRx); if (m) probs.push(`'${m[0]}' in ${name}`); }
  const printed = [s.li, ...s.sc, ...(s.notes ? [...s.notes.formulas, ...s.notes.terms.flat(), ...(s.notes.steps || [])] : [])].join(' ');
  if (printed.includes('class="fr"')) probs.push('stacked fraction in LI/SC/notes');
  if (!tl.pages[0].includes('notes-grid')) probs.push('teacher copy has no notes');
  if (l.pages[0].includes('notes-grid')) probs.push('students\' copy shows the notes');
  const nAns = l.answers.map(([h, a]) => `${h} ${a.length}`).join(', ');
  console.log(`${code.padEnd(6)} ${probs.length ? 'PROBLEMS: ' + probs.join('; ') : 'ok'} | tags ${tags.join(',')} | formula boxes ${forms} | answers: ${nAns}`);
  bad += probs.length;
}
process.exit(bad ? 1 : 0);
