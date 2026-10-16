// Turns the section files into the exam model: numbered questions, marks, levels, totals, the rows of every section
// table, the marking guide data, and a registry of every figure. build.js renders this model to HTML (PDF) and writes
// it to exam.json, which build-docx.py renders to Word. Both outputs come from the same rows, so they match.
'use strict';

const LETTERS = 'ABCD';
const PARTS = 'abcdefgh';
const LEVELS = ['green', 'blue'];

// Default working space (mm) for a part worth m marks: 22 mm for 1 mark, 14 mm more for each extra mark.
// Worded problems get `wordedExtra` mm more per part. Authors can set `space` (mm) on a question or a part.
const SPACE = { base: 22, perMark: 14, wordedExtra: 6, floorBase: 16, floorPerMark: 10 };
const defaultSpace = (marks, worded) => SPACE.base + SPACE.perMark * Math.max(0, marks - 1) + (worded ? SPACE.wordedExtra : 0);
const floorSpace = (marks) => SPACE.floorBase + SPACE.floorPerMark * Math.max(0, marks - 1);

const arr = (x) => (x === undefined || x === null || x === '' ? [] : Array.isArray(x) ? x : [x]);
const isSvg = (x) => typeof x === 'string' && x.trim().startsWith('<svg');
const isTable = (x) => x && typeof x === 'object' && x.kind === 'table';
// Typography in text (never inside tags), applied to every string of the exam (questions, options, answers, working,
// criteria, notes, titles), so the PDF and Word always agree even when a section file types it plainly:
//   typographic apostrophes: Pythagoras' -> Pythagoras’, Mia's -> Mia’s, Kestrels' -> Kestrels’;
//   a no-break space between a number and its unit (84 cm², 12 m, 330 L), so a unit never starts a new line.
const UNIT_AFTER = /(\d) (?=(?:mm|cm|km|m|mL|kL|L|kg|g|min)(?:²|³)?(?![A-Za-z]))/g;
const curly = (s) => s.split(/(<[^>]*>)/).map((t, i) => (i % 2 ? t
  : t.replace(/([A-Za-z0-9])'(?=[A-Za-z])/g, '$1’').replace(/([A-Za-z])'(?=[\s.,;:!?)]|$)/g, '$1’').replace(UNIT_AFTER, '$1\u00a0'))).join('');
const typo = (x) => (typeof x === 'string' ? curly(x) : Array.isArray(x) ? x.map(typo)
  : x && typeof x === 'object' && Object.getPrototypeOf(x) === Object.prototype ? Object.fromEntries(Object.entries(x).map(([k, val]) => [k, typo(val)])) : x);
const strip = (h) => String(h).replace(/<span class="fr"><span class="fn">(.*?)<\/span><span class="fd">(.*?)<\/span><\/span>/g, '$1/$2').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');

function buildModel(examIn) {
  const exam = { ...examIn, instructions: typo(examIn.instructions), markingNotes: typo(examIn.markingNotes), sections: typo(examIn.sections) };
  const warnings = [];
  const brief = [];
  const figures = {};
  const warn = (m) => warnings.push(m);

  // ---------- figures ----------
  const figBlock = (svgStr, id) => {
    let fid = id, k = 2;
    while (figures[fid]) fid = `${id}-${k++}`;
    const w = +(/width="([\d.]+)mm"/.exec(svgStr) || [])[1];
    const h = +(/height="([\d.]+)mm"/.exec(svgStr) || [])[1];
    figures[fid] = { id: fid, svg: svgStr, w, h };
    return { t: 'fig', id: fid, w, h };
  };
  const tableBlock = (tb) => ({ t: 'table', rows: tb.rows.map((r) => r.map((c) => (c && typeof c === 'object' ? { ...c, text: c.text !== undefined ? String(c.text) : undefined } : { text: String(c ?? '') }))), headRow: tb.headRow, headCol: tb.headCol, footRow: tb.footRow, colW: tb.colW, align: tb.align || 'center' });
  // fig: an SVG string, a table object, or an array of them (placed side by side)
  const figBlocks = (fig, id) => {
    const list = arr(fig);
    if (!list.length) return [];
    const items = list.map((x, i) => {
      if (isSvg(x)) return figBlock(x, list.length > 1 ? `${id}-${i + 1}` : id);
      if (isTable(x)) return tableBlock(x);
      if (typeof x === 'string') return { t: 'p', html: x };
      throw new Error(`${id}: fig must be an SVG string (from figs.js) or a table (F.table / F.freqTable)`);
    });
    return items.length === 1 ? items : [{ t: 'figs', items }];
  };
  const paras = (text, cls) => arr(text).map((t) => {
    if (isSvg(t) || isTable(t)) throw new Error('Put figures and tables in `fig`, not in `text`.');
    return { t: 'p', html: String(t), cls };
  });
  const formulaBlocks = (formula, extra = '') => arr(formula).map((f) => ({ t: 'p', cls: `formula${extra ? ` ${extra}` : ''}`, html: `Note: ${f}` }));

  // ---------- marking ----------
  const markingList = (p, ref) => {
    const list = arr(p.marking).map((m) => (Array.isArray(m) ? [m[0], m[1]] : [1, m]));
    const total = list.reduce((s, m) => s + m[0], 0);
    if (!list.length) {
      if (p.marks > 1) warn(`${ref}: no marking criteria (marking: [...]) for a ${p.marks}-mark part`);
      return [[p.marks, `Correct answer: ${p.answer ?? ''}`]];
    }
    if (total !== p.marks) warn(`${ref}: marking criteria add to ${total}, but the part is worth ${p.marks}`);
    return list;
  };
  const keyBlocks = (p) => [...arr(p.working).map((w) => ({ t: 'p', cls: 'key', html: String(w) })), ...(p.answer !== undefined && p.answer !== '' ? [{ t: 'p', cls: 'key ans', html: String(p.answer) }] : [])];

  // ---------- sections ----------
  const sections = [];
  let qn = 0;
  exam.sections.forEach((sec, si) => {
    const sid = sec.id || `s${si + 1}`;
    const secNo = sec.no || si + 1;
    if (exam.numbering !== 'continuous') qn = 0;
    const S = { id: sid, no: secNo, title: sec.title, short: sec.short || sec.title, heading: `Section ${secNo}: ${sec.title}`, frontLabel: `Section ${secNo} - ${sec.short || sec.title}`, questions: [], marks: 0, green: 0, blue: 0, groups: { mc: { n: 0, marks: 0 }, sa: { n: 0, marks: 0 }, worded: { n: 0, marks: 0, each: [] } } };
    const order = { mc: 0, sa: 1, worded: 2 };
    let lastOrder = 0;
    (sec.questions || []).forEach((raw, qi) => {
      const type = raw.type || 'sa';
      if (type === 'info') { S.questions.push({ type: 'info', text: raw.text, fig: raw.fig, ref: `${sid} info ${qi + 1}` }); return; }
      if (!(type in order)) { warn(`${sid} question ${qi + 1}: unknown type '${type}' (use 'mc', 'sa', 'worded' or 'info')`); return; }
      if (order[type] < lastOrder) warn(`${sid} question ${qi + 1}: '${type}' comes after a later group; order must be mc, then sa, then worded`);
      lastOrder = Math.max(lastOrder, order[type]);
      qn += 1;
      const ref = `S${secNo} Q${qn}`;
      const q = { ...raw, type, n: qn, ref, secId: sid };
      if (type === 'mc') {
        q.marks = raw.marks || 1;
        q.level = raw.level;
        if (!Array.isArray(raw.options) || raw.options.length !== 4) warn(`${ref}: a multiple-choice question needs exactly 4 options`);
        if (!(raw.answer >= 0 && raw.answer <= 3)) warn(`${ref}: answer must be the index 0-3 of the right option`);
        const plainOpts = (raw.options || []).map((o) => (isSvg(o) ? `svg${Math.random()}` : strip(o)));
        if (new Set(plainOpts).size !== plainOpts.length) warn(`${ref}: two options are the same`);
        q.parts = [{ label: '', marks: q.marks, level: q.level, answer: `${LETTERS[raw.answer]}`, marking: [[q.marks, `${LETTERS[raw.answer]}${isSvg(raw.options[raw.answer]) ? '' : ` (${raw.options[raw.answer]})`}`]], notes: raw.why || raw.notes }];
      } else {
        const worded = type === 'worded';
        const parts = raw.parts && raw.parts.length ? raw.parts : [{ label: '', text: '', marks: raw.marks, answer: raw.answer, working: raw.working, marking: raw.marking, notes: raw.notes, level: raw.level, space: raw.space }];
        q.parts = parts.map((p, i) => {
          const label = p.label !== undefined ? p.label : (parts.length > 1 ? PARTS[i] : '');
          const marks = p.marks;
          const pref = `${ref}${label}`;
          if (!(marks > 0)) warn(`${pref}: marks missing`);
          const level = p.level || raw.level;
          const space = p.space ?? (parts.length === 1 ? raw.space : undefined) ?? defaultSpace(marks || 1, worded);
          if (space < floorSpace(marks || 1)) warn(`${pref}: working space ${space} mm is under the minimum of ${floorSpace(marks || 1)} mm for ${marks} mark(s)`);
          if (p.answer === undefined || p.answer === '') warn(`${pref}: no answer`);
          return { ...p, label, marks: marks || 0, level, space, ref: pref };
        });
        q.marks = q.parts.reduce((s, p) => s + p.marks, 0);
        if (raw.marks && raw.parts && raw.parts.length && raw.marks !== q.marks) warn(`${ref}: marks ${raw.marks} but the parts add to ${q.marks}`);
        q.layout = raw.layout || (worded && q.parts.length > 1 ? 'rows' : 'inline');
      }
      q.parts.forEach((p) => {
        if (!LEVELS.includes(p.level)) warn(`${p.ref || ref}: level must be 'green' or 'blue' (got ${p.level})`);
        else S[p.level] += p.marks;
        p.markingList = markingList(p, p.ref || ref);
      });
      if (!raw.src) warn(`${ref}: no src (which Test yourself question it is modelled on)`);
      S.marks += q.marks;
      S.groups[type].n += 1; S.groups[type].marks += q.marks;
      if (type === 'worded') S.groups.worded.each.push(q.marks);
      S.questions.push(q);
    });
    sections.push(S);
  });

  // ---------- rows of each section table ----------
  sections.forEach((S) => {
    const rows = [];
    rows.push({ k: 'title', text: S.heading, cont: `${S.heading} (continued)`, kn: true });
    let group = null;
    const info = [];
    S.questions.forEach((q) => {
      if (q.type === 'info') { info.push(q); return; }
      if (q.type !== group) {
        group = q.type;
        if (group === 'mc') rows.push({ k: 'sub', text: 'Multiple Choice:', markHead: 'Mark', rep: true, kn: true, part: 'mc' });
        else {
          rows.push({ k: 'sub', text: group === 'sa' ? 'Short Answer:' : 'Worded Problems:', kn: true, part: group });
          rows.push({ k: 'colhdr', rep: true, kn: true, part: group });
        }
      }
      // info rows (instructions or data shared by the next questions) sit just before the next question
      info.splice(0).forEach((x) => rows.push({ k: 'info', q: [...paras(x.text, 'c'), ...figBlocks(x.fig, `${S.id}-info`)], kn: true, ref: x.ref }));
      const id = `${S.id}-q${q.n}`;
      if (q.type === 'mc') {
        rows.push({
          k: 'mc', n: q.n, ref: q.ref, marks: q.marks,
          stem: [...paras(q.text, 'c'), ...formulaBlocks(q.formula, 'c')], fig: figBlocks(q.fig, id), figPos: q.figPos || 'below', // formula notes centred under the question
          options: q.options.map((o, i) => (isSvg(o) ? { fig: figBlock(o, `${id}-opt${LETTERS[i]}`) } : { html: String(o) })),
          optLayout: q.optLayout || autoOptLayout(q.options), answer: q.answer,
        });
        return;
      }
      const figs = figBlocks(q.fig, id);
      const formula = formulaBlocks(q.formula);
      if (q.layout === 'rows') {
        const figPos = q.figPos || (figs.length && figs[0].t === 'fig' && figs[0].w <= 85 ? 'right' : 'below');
        rows.push({ k: 'stem', n: q.n, ref: q.ref, q: paras(q.text), fig: figs, figPos, formula, kn: true });
        q.parts.forEach((p, i) => rows.push({
          k: 'part', label: p.label, ref: p.ref, q: [...paras(p.text), ...figBlocks(p.fig, `${id}${p.label}`), ...formulaBlocks(p.formula)],
          space: p.space, marks: p.marks, key: keyBlocks(p), kn: i < q.parts.length - 1 && !!q.keepTogether,
        }));
      } else {
        const multi = q.parts.length > 1 || q.parts[0].label;
        const partList = multi ? q.parts.map((p) => ({ t: 'p', cls: 'part', label: p.label, html: String(p.text || '') })) : [];
        const qBlocks = q.partsFirst ? [...paras(q.text), ...partList, ...figs, ...formula] : [...paras(q.text), ...figs, ...partList, ...formula];
        rows.push({ k: 'q', n: q.n, ref: q.ref, q: qBlocks, parts: q.parts.map((p) => ({ label: multi ? p.label : '', space: p.space, marks: p.marks, key: keyBlocks(p), ref: p.ref })) });
      }
    });
    if (rows.length > 1) rows[rows.length - 1].kn = true; // the last question stays with the Total row
    rows.push({ k: 'total', marks: S.marks });
    S.rows = rows;
  });

  // ---------- totals and the brief ----------
  const total = sections.reduce((s, x) => s + x.marks, 0);
  const green = sections.reduce((s, x) => s + x.green, 0);
  const blue = sections.reduce((s, x) => s + x.blue, 0);
  const B = exam.brief || {};
  const chk = (label, got, want) => { if (want !== undefined && got !== want) brief.push(`${label}: ${got}, brief says ${want}`); };
  chk('Total marks', total, B.total); chk('Green marks', green, B.green); chk('Blue marks', blue, B.blue);
  sections.forEach((S) => {
    const b = (B.sections || {})[S.id];
    if (!b) return;
    const L = `Section ${S.no}`;
    chk(`${L} marks`, S.marks, b.marks);
    chk(`${L} multiple-choice questions`, S.groups.mc.n, b.mc);
    chk(`${L} multiple-choice marks`, S.groups.mc.marks, b.mc);
    chk(`${L} short-answer marks`, S.groups.sa.marks, b.sa);
    chk(`${L} worded problems`, S.groups.worded.n, b.worded ? b.worded.length : undefined);
    if (b.worded && S.groups.worded.each.join(',') !== b.worded.join(',')) brief.push(`${L} worded problem marks: ${S.groups.worded.each.join(', ') || 'none'}, brief says ${b.worded.join(', ')}`);
    chk(`${L} green marks`, S.green, b.green); chk(`${L} blue marks`, S.blue, b.blue);
  });

  // ---------- marking guide ----------
  const summary = sections.map((S) => ({
    id: S.id, heading: S.heading, title: `Section ${S.no} answer summary – ${S.title}`, marks: S.marks, green: S.green, blue: S.blue,
    rows: S.questions.filter((q) => q.type !== 'info').flatMap((q) => q.parts.map((p, i) => ({
      q: `${q.n}${p.label}`, first: i === 0, answer: q.type === 'mc' ? `${LETTERS[q.answer]}${isSvg(q.options[q.answer]) ? '' : `&nbsp;&nbsp;(${q.options[q.answer]})`}` : String(p.answer ?? ''),
      marks: p.marks, level: p.level, topic: q.topic || '', src: q.src || '',
    }))),
  }));
  const criteria = sections.map((S) => ({
    id: S.id, heading: S.heading, title: `Section ${S.no} marking criteria – ${S.title}`,
    questions: S.questions.filter((q) => q.type !== 'info').map((q) => ({
      n: q.n, ref: q.ref, type: q.type, marks: q.marks, topic: q.topic || '', src: q.src || '',
      levels: [...new Set(q.parts.map((p) => p.level))],
      parts: q.parts.map((p) => ({
        label: p.label, marks: p.marks, level: p.level,
        answer: q.type === 'mc' ? `${LETTERS[q.answer]}${isSvg(q.options[q.answer]) ? '' : `&nbsp;&nbsp;(${q.options[q.answer]})`}` : String(p.answer ?? ''),
        working: arr(p.working).map(String), marking: p.markingList.map(([m, t]) => [m, String(t)]), notes: arr(p.notes).map(String),
      })),
    })),
  }));

  return {
    meta: exam.meta, instructions: exam.instructions, markingNotes: exam.markingNotes, brief: B,
    total, green, blue, sections, summary, criteria, figures, warnings, briefWarnings: brief, SPACE,
  };
}

// Options on one line when they are short, 2 x 2 when medium, one under the other when long.
function autoOptLayout(options) {
  if (options.some(isSvg)) return 'row';
  const len = Math.max(...options.map((o) => strip(o).length));
  const hasFrac = options.some((o) => String(o).includes('class="fr"'));
  if (len <= 16 || (hasFrac && len <= 20)) return 'row';
  if (len <= 38) return 'grid';
  return 'stack';
}

module.exports = { buildModel, defaultSpace, floorSpace, SPACE, LETTERS, strip, typo };
