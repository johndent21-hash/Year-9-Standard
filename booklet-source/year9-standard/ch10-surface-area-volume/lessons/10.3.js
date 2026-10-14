// Lesson 10.3 Percentage error (three pages: Easy with the Notes box, Easy drill, then Medium with earlier lessons mixed
// in and three worded problems). See lib/lesson-two.js.
// Textbook 10.03. Absolute error E = precision ÷ 2; percentage error = E ÷ M × 100% (M: the measurement). The Easy pages
// round to one decimal place where needed; the Medium page to two decimal places (percentage errors there are small).
const { num, u, conv, meas, pctErr, limits } = require('../helpers');
const { C, f, T, svg, seg, SHADE } = require('../shapes').parts;

// ---------------------------------------------------------------- answers
// A measurement written as text ('3.6 kg'), or read from a scale marked every p units: its value, unit, precision, E
const M = (s, p) => { const m = meas(s), P = p ?? m.p; return { v: m.v, unit: m.unit, p: P, e: +(P / 2).toPrecision(12) }; };
// A percentage: exact when it has at most one decimal place (2%, 12.5%), otherwise rounded to dp places (3.3%)
const pc = (v, dp = 1) => { const x = +v.toPrecision(12); return `${Math.abs(x * 10 ** dp - Math.round(x * 10 ** dp)) < 1e-9 && dp <= 1 ? num(x) : num(x, dp)}%`; };
const pe = (s, dp, p) => { const m = M(s, p); return pc(pctErr(m.e, m.v), dp); };
// The working: 0.5 ÷ 24 × 100 = 2.08%
const work = (s, dp, p) => { const m = M(s, p); return `${num(m.e)} ÷ ${num(m.v)} × 100 = ${pe(s, dp, p)}`; };
const eOf = (s, p) => u(M(s, p).e, M(s, p).unit);

// ---------------------------------------------------------------- pictures (mm, drawn at print size)
const KRAFT = '#f3e3c3', STRING = '#b8975c', WOOD = '#ecd9b0', LIQ = '#c9d6f2', PAPER = '#fbf6e6';
const G = { size: 3 }, Q = { size: 3, weight: 700 }, NOTE = { size: 2.8, fill: C.grey }, READ = { size: 3, fill: C.blue, weight: 700 };
const blue = { stroke: C.blue, w: 0.45 };
const lw = (s, size = 3) => String(s).length * size * 0.58; // a label's width, as shapes.js's T estimates it
const box = (x, y, w, h, fill, o = {}) => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}"${o.rx ? ` rx="${o.rx}"` : ''} fill="${fill}" stroke="${o.stroke || C.charcoal}" stroke-width="${o.w || 0.4}"/>`;
const label = (cx, cy, s, o = G) => { const w = lw(s, o.size) + 1.4; return box(cx - w / 2, cy - 2.3, w, 4.6, '#fff', { w: 0.3, rx: 0.4 }) + T(cx, cy + 1.1, s, o); };

// Each object is drawn with its top left corner at (x, y) and returns { b, w, h }.
// A parcel with its mass on a label
const parcel = (lab) => (x, y) => {
  const w = Math.max(12, lw(lab) + 4), h = 9.6, cx = x + w / 2, cy = y + h / 2, s = { stroke: STRING, w: 0.5 };
  return { b: box(x, y, w, h, KRAFT, { rx: 0.6 }) + seg([cx, y], [cx, y + h], s) + seg([x, cy], [x + w, cy], s) + label(cx, cy, lab), w, h };
};
// A plank of length L mm, its length on a blue measurement line above it
const plank = (lab, L = 20) => (x, y) => {
  const w = Math.max(L, lw(lab)), x0 = x + (w - L) / 2, yl = y + 4.9;
  const b = T(x + w / 2, y + 2.5, lab, G) + seg([x0, yl], [x0 + L, yl], blue) + seg([x0, yl - 0.9], [x0, yl + 0.9], blue) + seg([x0 + L, yl - 0.9], [x0 + L, yl + 0.9], blue)
    + box(x0, yl + 1.6, L, 3.2, WOOD, { rx: 0.3 }) + seg([x0 + L * 0.2, yl + 3.2], [x0 + L * 0.55, yl + 3.2], { stroke: STRING, w: 0.25 });
  return { b, w, h: yl + 4.8 - y };
};
// A bottle with its volume on its label (h: its height)
const bottle = (lab, h = 14.5) => (x, y) => {
  const w = Math.max(10, lw(lab) + 3), cx = x + w / 2, n = Math.max(3.2, w * 0.34);
  const body = `<path d="M${f(cx - n / 2)},${f(y + 1.6)} L${f(cx - n / 2)},${f(y + 3.4)} Q${f(x)},${f(y + 3.6)} ${f(x)},${f(y + 6)} L${f(x)},${f(y + h - 0.6)} Q${f(x)},${f(y + h)} ${f(x + 0.6)},${f(y + h)} L${f(x + w - 0.6)},${f(y + h)} Q${f(x + w)},${f(y + h)} ${f(x + w)},${f(y + h - 0.6)} L${f(x + w)},${f(y + 6)} Q${f(x + w)},${f(y + 3.6)} ${f(cx + n / 2)},${f(y + 3.4)} L${f(cx + n / 2)},${f(y + 1.6)} Z" fill="${LIQ}" stroke="${C.charcoal}" stroke-width="0.4"/>`;
  return { b: body + box(cx - n / 2 - 0.3, y, n + 0.6, 1.6, SHADE, { w: 0.35, rx: 0.3 }) + label(cx, y + (h + 5.6) / 2 + 0.3, lab), w, h };
};
// A stopwatch with its time on the display
const watch = (lab) => (x, y) => {
  const r = Math.max(6.4, lw(lab) / 2 + 1.8), cx = x + r, cy = y + 2.2 + r;
  const b = box(cx - 1.3, y, 2.6, 1.2, SHADE, { w: 0.35, rx: 0.3 }) + seg([cx, y + 1.2], [cx, y + 2.2], { w: 0.5 })
    + `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="#eef1f9" stroke="${C.charcoal}" stroke-width="0.45"/>` + label(cx, cy, lab);
  return { b, w: 2 * r, h: 2 * r + 2.2 };
};

// The marks of a scale: a mark every minor (the precision), a longer one every major (numbered) and a middle-length one
// halfway between two numbers.
const kindOf = (v, min, major) => { const k = (v - min) / major; return Math.abs(k - Math.round(k)) < 1e-6 ? 'major' : Math.abs(2 * k - Math.round(2 * k)) < 1e-6 ? 'mid' : 'minor'; };
// A measuring jug from 0 to max, numbered on its left, filled to level; the reading is written in blue on its right, at
// the level. len: the height of the scale in mm.
const jug = ({ max, minor, major, level, len = 20, unit = 'mL', jw = 7 }) => (x, y) => {
  const nw = lw(max, 2.8), jx = x + nw + 1.2, top = y + 5.6, bot = top + len, Y = (v) => bot - (v / max) * len;
  let b = `<path d="M${f(jx)},${f(top - 1.6)} L${f(jx)},${f(bot)} L${f(jx + jw)},${f(bot)} L${f(jx + jw)},${f(top - 1.6)}" fill="#fff" stroke="${C.charcoal}" stroke-width="0.4"/>`;
  b += `<rect x="${f(jx + 0.2)}" y="${f(Y(level))}" width="${f(jw - 0.4)}" height="${f(bot - Y(level) - 0.2)}" fill="${LIQ}"/>` + seg([jx, Y(level)], [jx + jw, Y(level)], blue);
  for (let i = 1; i <= Math.round(max / minor); i++) {
    const v = +(i * minor).toPrecision(12), k = kindOf(v, 0, major);
    b += seg([jx, Y(v)], [jx + (k === 'major' ? 2.6 : k === 'mid' ? 1.9 : 1.2), Y(v)], { w: 0.25 });
    if (k === 'major') b += T(jx - 1.2, Y(v) + 1, num(v), { size: 2.8, anchor: 'end' });
  }
  const rd = `${num(level)} ${unit}`;
  b += T(jx - 1.2, top - 3, unit, { size: 2.8, weight: 600, anchor: 'end' }) + T(jx + jw + 1.2, Y(level) + 1, rd, { ...READ, anchor: 'start' });
  return { b, w: nw + 1.2 + jw + 1.2 + lw(rd), h: bot - y, ly: Y(level), top, bot, rx: jx + jw + 1.2 };
};
// A horizontal scale from min to max, numbered every major, its unit after the last number. kind 'dial': a blue pointer
// at the reading, with the reading above it; 'rod': a rod lying on the scale from min to the reading, the reading above
// it. len: the length of the scale in mm.
const strip = ({ min = 0, max, minor, major, at, unit, len = 36, kind = 'dial', fmt = num }) => (x, y) => {
  const pad = Math.max(2, lw(fmt(min), 2.8) / 2 + 1), X = (v) => x + pad + ((v - min) / (max - min)) * len;
  const ux = X(max) + lw(fmt(max), 2.8) / 2 + 1, W = ux + lw(unit, 2.8) + 1 - x, rd = `${fmt(at)} ${unit}`, s0 = y + (kind === 'rod' ? 6 : 5.4), H = 7;
  let b = box(x, s0, W, H, PAPER, { rx: 0.6 });
  for (let i = 0; i <= Math.round((max - min) / minor); i++) {
    const v = +(min + i * minor).toPrecision(12), k = kindOf(v, min, major);
    b += seg([X(v), s0], [X(v), s0 + (k === 'major' ? 2.8 : k === 'mid' ? 2 : 1.3)], { w: 0.25 });
    if (k === 'major') b += T(X(v), s0 + 5.9, fmt(v), { size: 2.8 });
  }
  b += T(ux, s0 + 5.9, unit, { size: 2.8, weight: 600, anchor: 'start' });
  if (kind === 'rod') b += box(X(min), s0 - 2.4, X(at) - X(min), 2.4, WOOD, { w: 0.35 }) + T((X(min) + X(at)) / 2, s0 - 3.3, rd, READ);
  else b += `<polygon points="${f(X(at) - 1.1)},${f(s0 - 1.9)} ${f(X(at) + 1.1)},${f(s0 - 1.9)} ${f(X(at))},${f(s0 - 0.1)}" fill="${C.blue}"/>` + T(X(at), s0 - 2.7, rd, READ);
  return { b, w: W, h: s0 + H - y };
};

// A question's picture: the object, with a note under it ('nearest m', the precision of a whole-number measurement) and
// on its right a given value (given) and the unknown (ask), one under the other. Beside a jug they sit at its top or
// bottom, away from the blue reading. below: the unknown under the picture, at its right (a wide scale).
const card = (draw, { note = '', given = '', ask = '', below = false, gap = 2 } = {}) => {
  const p = draw(0.5, 0.5);
  let b = p.b, H = p.h + 0.5, W = p.w + 0.5;
  if (note) { b += T(0.5 + p.w / 2, H + 3.5, note, NOTE); H += 4.2; }
  const lines = [given && [given, G], ask && [ask, Q]].filter(Boolean);
  if (!lines.length) return svg(f(W + 0.5), f(H + 0.5), b);
  if (below) { lines.forEach(([s, o]) => { b += T(0.5 + p.w, H + 4, s, { ...o, anchor: 'end' }); H += 4.4; }); return svg(f(W + 0.5), f(H + 0.5), b); }
  const x = p.rx !== undefined ? p.rx : W + gap;
  let ys;
  if (p.ly !== undefined) { const up = p.ly - p.top > p.bot - p.ly; ys = lines.map((l, i) => (up ? p.top + 1.4 + i * 4.4 : p.bot - 0.4 - (lines.length - 1 - i) * 4.4)); }
  else { const cy = 0.5 + p.h / 2; ys = lines.map((l, i) => cy + 1.1 - ((lines.length - 1) * 4.4) / 2 + i * 4.4); }
  lines.forEach(([s, o], i) => { b += T(x, ys[i], s, { ...o, anchor: 'start' }); W = Math.max(W, x + lw(s, o.size)); });
  return svg(f(W + 0.5), f(H + 0.5), b);
};
// Two measurements to compare, A over B: a small picture of each with its value after it (draw), and a note under them
const pair = (a, b, note = '') => {
  let s = '', y = 0.5, W = 0;
  [['A', a], ['B', b]].forEach(([k, d]) => { const p = d(3.6, y); s += T(0.5, y + p.h / 2 + 1.1, k, { size: 3, weight: 700, anchor: 'start' }) + p.b; y += p.h + 1.4; W = Math.max(W, 3.6 + p.w); });
  if (note) { s += T(0.5, y + 2.2, note, { ...NOTE, anchor: 'start' }); y += 3.2; }
  return svg(f(W + 0.5), f(y), s);
};
// The small pictures in a pair: a plank of length L mm, a parcel; each with its value after it
const bar = (lab, L) => (x, y) => ({ b: box(x, y + 0.7, L, 2.6, WOOD, { w: 0.35, rx: 0.2 }) + T(x + L + 1.2, y + 3.1, lab, { ...G, anchor: 'start' }), w: L + 1.2 + lw(lab), h: 4 });
const tinyParcel = (lab) => (x, y) => { const s = { stroke: STRING, w: 0.4 };
  return { b: box(x, y, 6, 4.4, KRAFT, { rx: 0.4, w: 0.35 }) + seg([x + 3, y], [x + 3, y + 4.4], s) + seg([x, y + 2.2], [x + 6, y + 2.2], s) + T(x + 7.2, y + 3.3, lab, { ...G, anchor: 'start' }), w: 7.2 + lw(lab), h: 4.4 }; };

// ---------------------------------------------------------------- questions
// Each question: [picture, answer]. kind: the object; o: card options.
const OBJ = { parcel, plank, bottle, watch };
const Ecard = (kind, s, note) => [card(OBJ[kind](s), { note, ask: 'E = ?' }), eOf(s)];
const Pgiven = (kind, s, e) => [card(OBJ[kind](s), { given: `E = ${e}`, ask: '% error = ?' }), pc(pctErr(+e.split(' ')[0], meas(s).v))];
const Pcard = (kind, s, note, dp = 1) => [card(OBJ[kind](s), { note, ask: '% error = ?' }), pe(s, dp)];
// A scale question: the scale (jug or strip), its reading and precision
const Sjug = (o, ask = '% error = ?', dp = 1) => [card(jug(o), { ask }), pe(`${o.level} ${o.unit || 'mL'}`, dp, o.minor)];
const Sstrip = (o, ask = '% error = ?', dp = 1) => [card(strip(o), { ask, below: true }), pe(`${o.at} ${o.unit}`, dp, o.minor)];
// Formula questions (Formula / Substitute / Answer lines) from [picture, answer, text?, own formula?], with the round's
// formula printed (a string) or left for students to write (true)
const formFig = (list, form) => ({ items: list.map(([fig, , t = '', own]) => ({ t, fig, form: own || form })), ans: list.map((x) => x[1]) });

const PE = '% error = E ÷ M × 100';
const EX1 = { jug: { max: 500, minor: 50, major: 100, level: 300, len: 15 } };
const EX2 = { jug: { max: 500, minor: 25, major: 100, level: 375, len: 17 } };

// The Notes diagram: 24 m measured to the nearest metre on a number line. The true length lies in the shaded band,
// up to E = 0.5 m either side; then the percentage error.
const notesFig = () => {
  const X = (v) => 2.4 + (v - 23) * 15, yA = 12.6, s = 2.5;
  const arrow = (a, b2) => { const d = Math.sign(b2 - a); return seg([X(a), 8.6], [X(b2), 8.6], blue) + `<polygon points="${f(X(b2))},8.6 ${f(X(b2) - d * 1.2)},7.9 ${f(X(b2) - d * 1.2)},9.3" fill="${C.blue}"/>`; };
  let b = T(X(24), 2.6, '24 m, nearest m', { size: s, weight: 700 });
  b += T(X(23.75), 6.9, 'E', { size: s, fill: C.blue, weight: 700 }) + T(X(24.25), 6.9, 'E', { size: s, fill: C.blue, weight: 700 }) + arrow(24, 23.5) + arrow(24, 24.5);
  b += `<rect x="${f(X(23.5))}" y="${yA - 2.6}" width="${f(X(24.5) - X(23.5))}" height="2.6" fill="${SHADE}"/>` + seg([X(23) - 1.2, yA], [X(25) + 1.2, yA], { w: 0.4 });
  [23, 23.5, 24, 24.5, 25].forEach((v) => { const half = v % 1 !== 0; b += seg([X(v), yA], [X(v), yA + (half ? 1.3 : 1.8)], { w: 0.3 }) + T(X(v), yA + 4.6, num(v), { size: s, ...(half ? { fill: C.blue, weight: 700 } : {}) }); });
  b += `<circle cx="${f(X(24))}" cy="${yA}" r="0.65" fill="${C.charcoal}"/>`;
  b += T(X(24), 21.4, 'E = 1 ÷ 2 = 0.5 m', { size: s }) + T(X(24), 25.2, '% error = 0.5 ÷ 24 × 100', { size: s }) + T(X(24), 29, `= ${pc(pctErr(0.5, 24))}`, { size: s, weight: 700 });
  return svg(f(X(25) + 2.4), 30, b);
};

module.exports = {
  code: '10.3', title: 'Percentage error',
  li: 'calculate the percentage error of a measurement, and use it to compare accuracy.',
  sc: ['find the absolute error: half the precision', 'calculate percentage error = E ÷ M × 100%', 'decide which measurement is more accurate'],
  notes: {
    terms: [['precision (p)', 'the place value of the last digit, or one mark on a scale'], ['absolute error (E)', 'half the precision: the most the measurement can be out by'],
      ['measurement (M)', 'the value that was measured'], ['percentage error', 'E as a percentage of M'], ['more accurate', 'the smaller percentage error']],
    formulas: ['E = p ÷ 2', '% error = E ÷ M × 100%', 'Limits: M − E to M + E', 'Smaller % error: more accurate'],
    steps: ['find p', 'E = p ÷ 2', 'E ÷ M × 100', 'round + %'],
    fig: notesFig(),
  },
  easy: {
    ex: { stem: 'Find each absolute error or percentage error, to one decimal place where needed.', parts: [
      { t: 'Absolute error', fig: card(parcel('3.6 kg'), { ask: 'E = ?' }) }, { t: '% error', fig: card(plank('20 m', 22), { given: 'E = 0.5 m', ask: '% error = ?' }) },
      { t: '% error', fig: card(bottle('2.5 L'), { ask: '% error = ?' }) }, { t: '% error', fig: card(jug(EX1.jug), { ask: '% error = ?' }) }] },
    exAns: [`p = 0.1 kg, so E = 0.1 ÷ 2 = ${eOf('3.6 kg')}`, `% error = 0.5 ÷ 20 × 100 = ${pc(pctErr(0.5, 20))}`, `E = 0.1 ÷ 2 = ${eOf('2.5 L')}; % error = ${work('2.5 L')}`,
      `p = 50 mL, so E = 25 mL; % error = ${work('300 mL', 1, 50)}`],
    hint: 'p: the place value of the last digit (3.6 kg → 0.1 kg) · E = p ÷ 2 · % error = E ÷ M × 100',
    work: true,
    // Small steps: the absolute error E of a measurement (the formula printed), then the percentage error with E given.
    // Each question is its diagram: the measurement on the object, the unknown marked with a ?.
    rounds: [
      { text: 'find the absolute error E of each measurement.', cols: 3, ...formFig([Ecard('plank', '12 m', 'nearest m'), Ecard('parcel', '4.2 kg'), Ecard('bottle', '1.25 L')], 'E = p ÷ 2') },
      { text: 'find the percentage error. The absolute error E is given.', cols: 3, ...formFig([Pgiven('plank', '25 m', '0.5 m'), Pgiven('parcel', '4 kg', '0.5 kg'), Pgiven('bottle', '0.5 L', '0.05 L')], PE) },
    ],
  },
  // Page 2: the percentage error from the measurement alone (find E first), then from a scale reading picture; each
  // with the formula printed, then a round where students write it.
  drill: {
    hint: 'Find p, then E = p ÷ 2, then % error = E ÷ M × 100 · On a scale, p = the gap between two marks · Round to one decimal place.',
    rounds: [
      { text: 'find the percentage error. Find E first.', ...formFig([Pcard('plank', '10 m', 'nearest m'), Pcard('parcel', '2.5 kg'), Pcard('watch', '12.5 s')], PE) },
      { text: 'write the formula, then find the percentage error, correct to one decimal place.', ...formFig([Pcard('plank', '7 m', 'nearest m'), Pcard('parcel', '3.7 kg'), Pcard('bottle', '0.6 L')], true) },
      { text: 'p is the gap between two marks. Find the percentage error, correct to one decimal place.', ...formFig([
        Sjug({ max: 400, minor: 20, major: 100, level: 300, len: 19 }), Sstrip({ max: 3, minor: 0.1, major: 1, at: 2.5, unit: 'kg' }), Sstrip({ max: 6, minor: 0.5, major: 1, at: 4.5, unit: 'cm', kind: 'rod' })], PE) },
      { text: 'write the formula, then find the percentage error, correct to one decimal place.', ...formFig([
        Sjug({ max: 200, minor: 10, major: 50, level: 140, len: 19 }), Sstrip({ min: 200, max: 300, minor: 10, major: 50, at: 260, unit: 'g' }), Sstrip({ max: 3, minor: 0.1, major: 1, at: 1.8, unit: 'm', kind: 'rod' })], true) },
    ],
  },
  medium: {
    ex: { stem: 'Give each answer correct to two decimal places.', parts: [
      { t: '% error', fig: card(plank('24 m', 24), { note: 'nearest m' }) }, { t: '% error', fig: card(jug(EX2.jug)) },
      { t: '% error', fig: card(parcel('3.25 kg')) }, 'Which of a, b and c is the most accurate? Why?'] },
    exAns: [`E = 0.5 m; % error = ${work('24 m', 2)}`, `p = 25 mL, so E = 12.5 mL; % error = ${work('375 mL', 2, 25)}`, `E = 0.005 kg; % error = ${work('3.25 kg', 2)}`,
      `c: it has the smallest percentage error (${pe('3.25 kg', 2)})`],
    hint: '% error = E ÷ M × 100, to two decimal places · On a scale, p = one mark · The smaller the % error, the more accurate',
    work: true, set: true,
    // One set: today's skill, building from measurements to scales and comparing accuracy, with a question from an
    // earlier lesson (tagged) in each row. Every question is drawn, with a word or two saying what to find.
    rounds: [(() => {
      const ff = ([fig, a], t = '% error', o = {}) => [{ t, fig, form: true, ...o }, a];
      const cmp = (a, b, [sa, sb], note, ans) => ff([pair(a, b, { note }), ans], 'More accurate?', { lines: ['A', 'B', 'Answer'] });
      const more = (sa, sb) => { const [x, y] = [pctErr(M(sa).e, M(sa).v), pctErr(M(sb).e, M(sb).v)]; return `${x < y ? 'A' : 'B'} (A ${pe(sa, 2)}, B ${pe(sb, 2)})`; };
      const Q = [
        ff([card(plank('28 m', 20), { note: 'nearest m' }), pe('28 m', 2)]),
        ff([card(parcel('4500 g'), { ask: '= ? kg' }), u(conv(4500, 'g', 'kg'), 'kg')], 'Convert', { lines: ['Rule', 'Working', 'Answer'], from: '10.1' }),
        ff([card(strip({ min: 300, max: 400, minor: 10, major: 50, at: 350, unit: 'g', len: 20 })), pe('350 g', 2, 10)]),
        ff([card(bottle('0.75 L')), pe('0.75 L', 2)]),
        [{ t: 'Write the limits of accuracy.', fig: card(jug({ max: 100, minor: 10, major: 50, level: 60, len: 11 })), from: '10.2' }, limits('60 mL', 5)],
        ff([card(strip({ min: 1, max: 1.3, minor: 0.05, major: 0.1, at: 1.2, unit: 'm', len: 21, fmt: (v) => num(v, 1) })), pe('1.2 m', 2, 0.05)]),
        cmp(bar('10 m', 1.6), bar('100 m', 16), ['10 m', '100 m'], 'each to the nearest m', more('10 m', '100 m')),
        ff([card(strip({ max: 400, minor: 20, major: 100, at: 240, unit: 'g', len: 24 })), eOf('240 g', 20)], 'Absolute error', { from: '10.2' }),
        cmp(tinyParcel('2.5 kg'), tinyParcel('0.75 kg'), ['2.5 kg', '0.75 kg'], '', more('2.5 kg', '0.75 kg')),
      ];
      return { text: '', items: Q.map((x) => x[0]), ans: Q.map((x) => x[1]) };
    })()],
  },
  worded: [
    { q: 'Mia’s pencil is 15 cm long and she is 168 cm tall, both to the nearest cm. Which measurement is more accurate? Give both percentage errors to two decimal places.',
      a: `pencil: ${work('15 cm', 2)}; height: ${work('168 cm', 2)}; her height is more accurate` },
    { q: 'A 100 m sprint is timed as 12.4 s. Find the percentage error of the time, correct to two decimal places.',
      a: `E = 0.1 ÷ 2 = 0.05 s; ${work('12.4 s', 2)}` },
    { q: 'A jug marked every 50 mL shows 750 mL. Kai says the percentage error is 6.67%. What mistake did he make? Find the correct percentage error.',
      a: `He used the precision (50 mL), not E = 25 mL. ${work('750 mL', 2, 50)}` },
  ],
};
