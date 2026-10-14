// Lesson 10.3 Percentage error (three pages: Easy with the Notes box, Easy drill, then Medium with earlier lessons mixed
// in and three worded problems). See lib/lesson-two.js.
// Textbook 10.03. Absolute error E = precision ÷ 2; percentage error = E ÷ M × 100% (M: the measurement). The Easy pages
// round to one decimal place where needed; the Medium page to two decimal places (percentage errors there are small).
const { num, u, conv, meas, pctErr, limits } = require('../helpers');
const { C, f, T, svg, seg, SHADE } = require('../shapes').parts;
const { text } = require('../../../lib/graphs');

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
const blue = { stroke: C.blue, w: 0.45 };
// Labels. A label's real width in this font (em per character: regular, bold), so each picture's frame fits its labels
// exactly and prints at full size.
const EM = { 0: [0.61, 0.68], 1: [0.5, 0.56], 2: [0.55, 0.55], 3: [0.53, 0.59], 4: [0.62, 0.66], 5: [0.57, 0.6], 6: [0.56, 0.58], 7: [0.54, 0.55], 8: [0.58, 0.6], 9: [0.55, 0.58],
  '.': [0.23, 0.26], ' ': [0.28, 0.32], m: [0.92, 0.96], L: [0.6, 0.61], k: [0.56, 0.62], g: [0.65, 0.67], s: [0.48, 0.5], c: [0.54, 0.55], E: [0.61, 0.65], e: [0.59, 0.59],
  '%': [0.84, 0.97], r: [0.4, 0.46], o: [0.62, 0.64], '=': [0.57, 0.62], '?': [0.51, 0.54], A: [0.7, 0.69], B: [0.68, 0.7], n: [0.6, 0.64], a: [0.63, 0.66], t: [0.38, 0.4] };
const tw = (s, size = 3, bold = false) => [...String(s)].reduce((w, ch) => w + (EM[ch] || [0.62, 0.66])[bold ? 1 : 0], 0) * size;
// A label with its baseline at y (size 3 unless o.size). Its box is kept, so the picture's frame (pic) holds it.
let BOXES = [];
const L = (x, y, s, o = {}) => {
  const size = o.size || 3, anchor = o.anchor || 'middle', weight = o.weight || 400, w = tw(s, size, weight >= 600);
  const x0 = anchor === 'start' ? x : anchor === 'end' ? x - w : x - w / 2;
  BOXES.push([x0, y - size * 0.75, x0 + w, y + size * 0.22]);
  return text(x, y, s, { size, anchor, weight, fill: o.fill || C.ink });
};
const Q = { weight: 700 }, NOTE = { size: 2.8, fill: C.grey }, READ = { fill: C.blue, weight: 700 };
// The picture: the drawing's box [x0, y0, x1, y1] grown to hold its labels, at least minH tall with the drawing centred
// in it (every diagram prints at least 12 mm tall).
const MINH = 11.4;
const pic = (box, b, minH = MINH) => {
  let [x0, y0, x1, y1] = box;
  BOXES.forEach(([a, c, d, e]) => { x0 = Math.min(x0, a); y0 = Math.min(y0, c); x1 = Math.max(x1, d); y1 = Math.max(y1, e); });
  BOXES = [];
  const h = Math.max(y1 - y0, minH), dy = (h - (y1 - y0)) / 2;
  return svg(f(x1 - x0), f(h), `<g transform="translate(${f(-x0)} ${f(dy - y0)})">${b}</g>`);
};
const box = (x, y, w, h, fill, o = {}) => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}"${o.rx ? ` rx="${o.rx}"` : ''} fill="${fill}" stroke="${o.stroke || C.charcoal}" stroke-width="${o.w || 0.4}"/>`;
// A measurement on a white label stuck on an object, centred at (cx, cy)
const tag = (cx, cy, s) => { const w = tw(s) + 2.4; return box(cx - w / 2, cy - 2.3, w, 4.6, '#fff', { w: 0.3, rx: 0.4 }) + L(cx, cy + 1.1, s); };

// Each object is drawn with its top left corner at (0, 0) and returns { b, w, h }.
// A parcel h mm tall with its mass on a label
const parcel = (lab, h = 10.5) => {
  const w = Math.max(h * 1.2, tw(lab) + 7), s = { stroke: STRING, w: 0.5 }, tx = (tw(lab) + 2.4) / 2, c = h / 2;
  // the string stops at the label's edges
  const str = seg([w / 2, 0], [w / 2, c - 2.3], s) + seg([w / 2, c + 2.3], [w / 2, h], s) + seg([0, c], [w / 2 - tx, c], s) + seg([w / 2 + tx, c], [w, c], s);
  return { b: box(0, 0, w, h, KRAFT, { rx: 0.6 }) + str + tag(w / 2, c, lab), w, h };
};
// A plank len mm long, its length on a blue measurement line above it
const plank = (lab, len = 20) => {
  const w = Math.max(len, tw(lab)), x0 = (w - len) / 2, yl = 4.4, end = (x) => seg([x, yl - 0.9], [x, yl + 0.9], blue);
  const b = L(w / 2, 2.4, lab) + seg([x0, yl], [x0 + len, yl], blue) + end(x0) + end(x0 + len)
    + box(x0, yl + 1.4, len, 3.2, WOOD, { rx: 0.3 }) + seg([x0 + len * 0.2, yl + 3], [x0 + len * 0.55, yl + 3], { stroke: STRING, w: 0.25 });
  return { b, w, h: yl + 4.6 };
};
// A bottle h mm tall with its volume on its label
const bottle = (lab, h = 14.5) => {
  const w = Math.max(11, tw(lab) + 5), cx = w / 2, n = Math.max(3.2, w * 0.34);
  const body = `<path d="M${f(cx - n / 2)},1.6 L${f(cx - n / 2)},3.4 Q0,3.6 0,6 L0,${f(h - 0.6)} Q0,${f(h)} 0.6,${f(h)} L${f(w - 0.6)},${f(h)} Q${f(w)},${f(h)} ${f(w)},${f(h - 0.6)} L${f(w)},6 Q${f(w)},3.6 ${f(cx + n / 2)},3.4 L${f(cx + n / 2)},1.6 Z" fill="${LIQ}" stroke="${C.charcoal}" stroke-width="0.4"/>`;
  return { b: body + box(cx - n / 2 - 0.3, 0, n + 0.6, 1.6, SHADE, { w: 0.35, rx: 0.3 }) + tag(cx, (h + 5.6) / 2 + 0.3, lab), w, h };
};
// A stopwatch (radius r mm) with its time on the display
const watch = (lab, r0 = 6.4) => {
  const r = Math.max(r0, tw(lab) / 2 + 1.8), cy = 2.2 + r;
  const b = box(r - 1.3, 0, 2.6, 1.2, SHADE, { w: 0.35, rx: 0.3 }) + seg([r, 1.2], [r, 2.2], { w: 0.5 })
    + `<circle cx="${f(r)}" cy="${f(cy)}" r="${f(r)}" fill="#eef1f9" stroke="${C.charcoal}" stroke-width="0.45"/>` + tag(r, cy, lab);
  return { b, w: 2 * r, h: 2 * r + 2.2 };
};

// The marks of a scale: a mark every minor (the precision), a longer one every major (numbered) and a middle-length one
// halfway between two numbers.
const kindOf = (v, min, major) => { const k = (v - min) / major; return Math.abs(k - Math.round(k)) < 1e-6 ? 'major' : Math.abs(2 * k - Math.round(2 * k)) < 1e-6 ? 'mid' : 'minor'; };
const markLen = { major: 2.6, mid: 1.9, minor: 1.2 };
// A measuring jug from 0 to max, numbered on its left, filled to level; the reading is written in blue on its right, at
// the level. len: the height of the scale in mm.
const jug = ({ max, minor, major, level, len = 20, unit = 'mL', jw = 7 }) => {
  const nw = tw(num(max), 2.8), jx = nw + 1.2, top = 5.6, bot = top + len, Y = (v) => bot - (v / max) * len;
  let b = `<path d="M${f(jx)},${f(top - 1.6)} L${f(jx)},${f(bot)} L${f(jx + jw)},${f(bot)} L${f(jx + jw)},${f(top - 1.6)}" fill="#fff" stroke="${C.charcoal}" stroke-width="0.4"/>`;
  b += `<rect x="${f(jx + 0.2)}" y="${f(Y(level))}" width="${f(jw - 0.4)}" height="${f(bot - Y(level) - 0.2)}" fill="${LIQ}"/>` + seg([jx, Y(level)], [jx + jw, Y(level)], blue);
  for (let i = 1; i <= Math.round(max / minor); i++) {
    const v = +(i * minor).toPrecision(12), k = kindOf(v, 0, major);
    b += seg([jx, Y(v)], [jx + markLen[k], Y(v)], { w: 0.25 });
    if (k === 'major') b += L(jx - 1.2, Y(v) + 1, num(v), { size: 2.8, anchor: 'end' });
  }
  const rd = `${num(level)} ${unit}`, rx = jx + jw + 1.2;
  b += L(jx - 1.2, top - 3.6, unit, { size: 2.8, weight: 600, anchor: 'end' }) + L(rx, Y(level) + 1, rd, { ...READ, anchor: 'start' });
  return { b, w: rx + tw(rd, 3, true), h: bot, ly: Y(level), top, bot, rx };
};
// A horizontal scale from min to max, numbered every major (fmt: how the numbers are written), its unit after the last
// number. kind 'dial': a blue pointer at the reading, with the reading above it; 'rod': a rod lying on the scale from min
// to the reading, the reading above it. len: the length of the scale in mm.
const strip = ({ min = 0, max, minor, major, at, unit, len = 36, kind = 'dial', fmt = num }) => {
  const pad = Math.max(2, tw(fmt(min), 2.8) / 2 + 1), X = (v) => pad + ((v - min) / (max - min)) * len;
  const ux = X(max) + tw(fmt(max), 2.8) / 2 + 1, W = ux + tw(unit, 2.8, true) + 1.6, rd = `${num(at)} ${unit}`, s0 = kind === 'rod' ? 6 : 5.4, H = 7;
  let b = box(0, s0, W, H, PAPER, { rx: 0.6 });
  for (let i = 0; i <= Math.round((max - min) / minor); i++) {
    const v = +(min + i * minor).toPrecision(12), k = kindOf(v, min, major);
    b += seg([X(v), s0], [X(v), s0 + markLen[k] + 0.2], { w: 0.25 });
    if (k === 'major') b += L(X(v), s0 + 5.9, fmt(v), { size: 2.8 });
  }
  b += L(ux, s0 + 5.9, unit, { size: 2.8, weight: 600, anchor: 'start' });
  if (kind === 'rod') b += box(X(min), s0 - 2.4, X(at) - X(min), 2.4, WOOD, { w: 0.35 }) + L((X(min) + X(at)) / 2, s0 - 3.3, rd, READ);
  else b += `<polygon points="${f(X(at) - 1.1)},${f(s0 - 1.9)} ${f(X(at) + 1.1)},${f(s0 - 1.9)} ${f(X(at))},${f(s0 - 0.1)}" fill="${C.blue}"/>` + L(X(at), s0 - 2.7, rd, READ);
  return { b, w: W, h: s0 + H };
};

// A question's picture: the object, with a note under it ('nearest m': the precision of a whole-number measurement) and
// on its right a given value (given) and the unknown (ask), one under the other. Beside a jug they sit at its top or
// bottom, away from the blue reading. below: the unknown under the picture, at its right (a wide scale).
const card = (p, { note = '', given = '', ask = '', below = false, gap = 2, minH } = {}) => {
  let b = p.b, H = p.h;
  if (note) { b += L(p.w / 2, H + 3.4, note, NOTE); H += 4; }
  const lines = [given && [given, {}], ask && [ask, Q]].filter(Boolean);
  if (below) lines.forEach(([s, o]) => { b += L(p.w, H + 4, s, { ...o, anchor: 'end' }); H += 4.4; });
  else if (lines.length) {
    const x = p.rx !== undefined ? p.rx : p.w + gap, n = lines.length - 1;
    const up = p.ly !== undefined && p.ly - p.top > p.bot - p.ly;
    const ys = lines.map((l, i) => (p.ly === undefined ? p.h / 2 + 1.1 - (n * 4.8) / 2 + i * 4.8 : up ? p.top + 1.4 + i * 4.8 : p.bot - 0.4 - (n - i) * 4.8));
    lines.forEach(([s, o], i) => { b += L(x, ys[i], s, { ...o, anchor: 'start' }); });
  }
  return pic([0, 0, p.w, H], b, minH);
};
// Two measurements to compare, A over B: a small picture of each (drawn at (x, y)) with its value after it
const pair = (a, c) => {
  let s = '', y = 0;
  [['A', a], ['B', c]].forEach(([k, d]) => { const p = d(4, y); s += L(0, y + p.h / 2 + 1.1, k, { ...Q, anchor: 'start' }) + p.b; y += p.h + 3; });
  return pic([0, 0, 4, y - 3], s);
};
// The small pictures in a pair: a plank len mm long (drawn to scale), a parcel; each with its value after it
const bar = (lab, len) => (x, y) => ({ b: box(x, y + 0.5, len, 3, WOOD, { w: 0.35, rx: 0.2 }) + L(x + len + 1.4, y + 3.1, lab, { anchor: 'start' }), h: 4 });
const mini = (lab) => (x, y) => { const s = { stroke: STRING, w: 0.4 };
  return { b: box(x, y, 6.4, 4.6, KRAFT, { rx: 0.4, w: 0.35 }) + seg([x + 3.2, y], [x + 3.2, y + 4.6], s) + seg([x, y + 2.3], [x + 6.4, y + 2.3], s) + L(x + 7.8, y + 3.4, lab, { anchor: 'start' }), h: 4.6 }; };

// ---------------------------------------------------------------- questions
// Each question: [picture, answer]. kind: the object (parcel, plank, bottle or watch), s: the measurement on it, size:
// the object's size (a plank's length, a parcel's or bottle's height, a watch's radius).
const Eq = (kind, s, size, note) => [card(kind(s, size), { note, ask: 'E = ?' }), eOf(s)];
const Gq = (kind, s, size, e) => [card(kind(s, size), { given: `E = ${e}`, ask: '% error = ?' }), pc(pctErr(meas(e).v, meas(s).v))];
const Pq = (kind, s, size, note) => [card(kind(s, size), { note, ask: '% error = ?' }), pe(s)];
// A scale question: the scale (jug or strip), its reading and precision (one mark)
const Sjug = (o) => [card(jug(o), { ask: '% error = ?' }), pe(`${o.level} ${o.unit || 'mL'}`, 1, o.minor)];
const Sstrip = (o) => [card(strip(o), { ask: '% error = ?', below: true }), pe(`${o.at} ${o.unit}`, 1, o.minor)];
// Formula questions (Formula / Substitute / Answer lines) from [picture, answer, text?, own formula?], with the round's
// formula printed (a string) or left for students to write (true)
const formFig = (list, form) => ({ items: list.map(([fig, , t = '', own]) => ({ t, fig, form: own || form })), ans: list.map((x) => x[1]) });

const PE = '% error = E ÷ M × 100';
const EX1 = { jug: { max: 400, minor: 50, major: 200, level: 300, len: 14 } };
const EX2 = { jug: { max: 400, minor: 25, major: 200, level: 375, len: 14 } };

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
      { t: 'Absolute error', fig: card(parcel('3.6 kg', 11), { ask: 'E = ?' }) }, { t: '% error', fig: card(plank('20 m', 12), { given: 'E = 0.5 m', ask: '% error = ?' }) },
      { t: '% error', fig: card(bottle('2.5 L', 15), { ask: '% error = ?' }) }, { t: '% error', fig: card(jug(EX1.jug), { ask: '% error = ?' }) }] },
    exAns: [`p = 0.1 kg, so E = 0.1 ÷ 2 = ${eOf('3.6 kg')}`, `% error = 0.5 ÷ 20 × 100 = ${pc(pctErr(0.5, 20))}`, `E = 0.1 ÷ 2 = ${eOf('2.5 L')}; % error = ${work('2.5 L')}`,
      `p = ${EX1.jug.minor} mL, so E = ${eOf('300 mL', EX1.jug.minor)}; % error = ${work('300 mL', 1, EX1.jug.minor)}`],
    hint: 'p: the place value of the last digit (3.6 kg → 0.1 kg) · E = p ÷ 2 · % error = E ÷ M × 100',
    work: true,
    // Small steps: the absolute error E of a measurement (the formula printed), then the percentage error with E given.
    // Each question is its diagram: the measurement on the object, the unknown marked with a ?.
    rounds: [
      { text: 'find the absolute error E of each measurement.', cols: 3, ...formFig([Eq(plank, '12 m', 16, 'nearest m'), Eq(parcel, '4.2 kg', 11), Eq(bottle, '1.25 L', 15)], 'E = p ÷ 2') },
      { text: 'find the percentage error. The absolute error E is given.', cols: 3, ...formFig([Gq(plank, '25 m', 12, '0.5 m'), Gq(parcel, '4 kg', 11, '0.5 kg'), Gq(bottle, '0.5 L', 15, '0.05 L')], PE) },
    ],
  },
  // Page 2: the percentage error from the measurement alone (find E first), then from a scale reading picture; each
  // with the formula printed, then a round where students write it.
  drill: {
    hint: 'E = p ÷ 2 · % error = E ÷ M × 100 · On a scale, p = the gap between two marks · Round to one decimal place.',
    rounds: [
      { text: 'find the percentage error. Find E first.', ...formFig([Pq(plank, '10 m', 22, 'nearest m'), Pq(parcel, '2.5 kg', 16), Pq(watch, '12.5 s', 10)], PE) },
      { text: 'write the formula, then find the percentage error.', ...formFig([Pq(plank, '7 m', 22, 'nearest m'), Pq(parcel, '3.7 kg', 16), Pq(bottle, '0.6 L', 22)], true) },
      { text: 'read the scale, then find the percentage error. p is one mark.', ...formFig([
        Sjug({ max: 400, minor: 20, major: 100, level: 300, len: 19 }), Sstrip({ max: 3, minor: 0.1, major: 1, at: 2.5, unit: 'kg', len: 30 }),
        Sstrip({ max: 6, minor: 0.5, major: 1, at: 4.5, unit: 'cm', kind: 'rod', len: 30 })], PE) },
      { text: 'write the formula, then find the percentage error.', ...formFig([
        Sjug({ max: 200, minor: 10, major: 50, level: 140, len: 19 }), Sstrip({ min: 200, max: 300, minor: 10, major: 50, at: 260, unit: 'g', len: 30 }),
        Sstrip({ max: 3, minor: 0.1, major: 1, at: 1.8, unit: 'm', kind: 'rod', len: 30 })], true) },
    ],
  },
  medium: {
    ex: { stem: 'Give each answer correct to two decimal places.', parts: [
      { t: '% error', fig: card(plank('24 m', 22), { note: 'nearest m' }) }, { t: '% error', fig: card(jug(EX2.jug)) },
      { t: '% error', fig: card(parcel('3.25 kg', 11)) }, 'Which of a, b and c is the most accurate? Why?'] },
    exAns: [`E = 1 ÷ 2 = 0.5 m; % error = ${work('24 m', 2)}`, `p = ${EX2.jug.minor} mL, so E = ${eOf('375 mL', EX2.jug.minor)}; % error = ${work('375 mL', 2, EX2.jug.minor)}`,
      `E = 0.01 ÷ 2 = ${eOf('3.25 kg')}; % error = ${work('3.25 kg', 2)}`, `c: it has the smallest percentage error (${pe('3.25 kg', 2)})`],
    hint: '% error = E ÷ M × 100, to two decimal places · On a scale, p = one mark · Smaller % error: more accurate',
    work: true, set: true,
    // One set: today's skill, building from measurements to scales and comparing accuracy, with a question from an
    // earlier lesson (tagged) in each row. Every question is drawn, with a word or two saying what to find.
    rounds: [(() => {
      const ff = (p, a, t = '% error', o = {}) => [{ t, fig: card(p, o.card), form: true, ...o.q }, a];
      const more = (sa, sb) => { const [x, y] = [sa, sb].map((s) => pctErr(M(s).e, M(s).v)); return `${x < y ? 'A' : 'B'} (A ${pe(sa, 2)}, B ${pe(sb, 2)})`; };
      const cmp = (fig, sa, sb) => [{ t: 'Which is more accurate?', fig, form: true }, more(sa, sb)];
      const Q9 = [
        ff(plank('28 m', 18), pe('28 m', 2), '% error', { card: { note: 'nearest m' } }),
        ff(parcel('4.5 kg'), u(conv(4.5, 'kg', 'g'), 'g'), 'Convert to grams', { card: { ask: '= ? g' }, q: { lines: ['Rule', 'Working', 'Answer'], from: '10.1' } }),
        ff(strip({ min: 300, max: 400, minor: 10, major: 50, at: 370, unit: 'g', len: 20 }), pe('370 g', 2, 10)),
        ff(bottle('0.75 L', 12.5), pe('0.75 L', 2)),
        [{ t: 'Write the limits of accuracy.', fig: card(jug({ max: 100, minor: 10, major: 50, level: 60, len: 13 })), from: '10.2' }, limits('60 mL', 5)],
        ff(strip({ min: 1, max: 1.3, minor: 0.05, major: 0.1, at: 1.15, unit: 'm', len: 20, fmt: (v) => num(v, 1) }), pe('1.15 m', 2, 0.05)),
        cmp(pair(bar('6 m', 1.75), bar('48 m', 14)), '6 m', '48 m'),
        ff(strip({ max: 200, minor: 10, major: 100, at: 140, unit: 'g', len: 18 }), eOf('140 g', 10), 'Absolute error', { q: { from: '10.2' } }),
        cmp(pair(mini('0.75 kg'), mini('2.5 kg')), '0.75 kg', '2.5 kg'),
      ];
      return { text: '', items: Q9.map((x) => x[0]), ans: Q9.map((x) => x[1]) };
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
