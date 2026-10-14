// Lesson 10.2 Precision and absolute error (three pages: Easy with the Notes box, Easy drill, then Medium with earlier
// lessons mixed in and three worded problems). See lib/lesson-two.js.
// Textbook 10.02. Precision: the gap between two marks on a scale, or the place value of a measurement's last digit.
// Absolute error = precision ÷ 2. Limits of accuracy = m − absolute error to m + absolute error.
const { num, u, conv, absErr, aerr, limits } = require('../helpers');
const S = require('../shapes');
const { C, f, T, svg, seg } = S.parts;

// ---------------------------------------------------------------- the pictures (lesson-only helpers)
// Every label is drawn at print size: given values 3 mm, the unknown 3 mm bold ('abs. error = ?'), numbers on a scale
// 2.8 mm. Each picture is drawn no bigger than its box, so nothing is scaled down.
const tw = (s, size = 3) => String(s).length * size * 0.58; // a label's width, as T measures it
const G = { size: 3 }, Q = { size: 3, weight: 700 }, N = { size: 2.8 };
const BLUE = { stroke: C.blue, w: 0.45 }, GREY = { stroke: C.grey, w: 0.3 }, TICK = { w: 0.25 };
const RED = '#d9534f', LIQ = '#c9d6f2', WOOD = '#ecd9b4', CREAM = '#fbf6e6';
const near = (a, b) => Math.abs(a - b) < 1e-6;
const box = (x, y, w, h, fill, o = {}) => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}"${o.rx ? ` rx="${o.rx}"` : ''} fill="${fill}" stroke="${o.stroke || (o.none ? 'none' : C.charcoal)}" stroke-width="${o.w || 0.4}"/>`;
const path = (d, fill, w = 0.4) => `<path d="${d}" fill="${fill}" stroke="${C.charcoal}" stroke-width="${w}"/>`;
// a measurement line from x0 to x1 at height y, with end ticks (blue: a given length)
const dimH = (x0, x1, y, o = GREY) => seg([x0, y], [x1, y], o) + seg([x0, y - 0.9], [x0, y + 0.9], o) + seg([x1, y - 0.9], [x1, y + 0.9], o);
// a given value, then the unknown after it on the same line ('15 cm', '= ? mm'), centred on cx
const pair = (cx, y, given, ask) => { const w = tw(given) + 1.2 + tw(ask), x = cx - w / 2;
  return T(x, y, given, { ...G, anchor: 'start' }) + T(x + tw(given) + 1.2, y, ask, { ...Q, anchor: 'start' }); };
const lab = (v) => num(+v.toFixed(6));
const tickLen = (v, min, major, minor, [big, mid, small]) => {
  const isMajor = near((v - min) / major, Math.round((v - min) / major));
  const isMid = Math.round(major / minor) % 2 === 0 && near((v - min) / (major / 2), Math.round((v - min) / (major / 2)));
  return isMajor ? big : isMid ? mid : small;
};

// A horizontal scale from min to max: a mark every minor step, a longer numbered mark every major step.
// kind 'ruler' (a cream ruler), 'dial' (kitchen or bathroom scales: a blue pointer at read), 'thermo' (a thermometer:
// red up to read). ask: the unknown, under the scale ('precision = ?').
const hs = ({ min = 0, max, major, minor, unit, kind = 'ruler', len = 26, read, ask = '' }) => {
  const n = Math.round((max - min) / minor), th = kind === 'thermo';
  const padL = Math.max(1.6, tw(lab(min), 2.8) / 2 + 0.7), padR = Math.max(1.6, tw(lab(max), 2.8) / 2 + 0.7);
  const x0 = th ? 6.6 : 0.5 + padL, X = (v) => x0 + ((v - min) / (max - min)) * len;
  const y0 = read !== undefined && !th ? 3.6 : 0.5;
  let b = '', bottom, right;
  if (th) {
    const yc = y0 + 1.7, lv = read !== undefined ? read : min + (max - min) * 0.62;
    b += box(X(min) - 3, y0, len + 4.8, 3.4, '#fff', { rx: 1.7 });
    b += box(X(min) - 3.4, yc - 0.7, X(lv) - X(min) + 3.4, 1.4, RED, { none: true });
    b += `<circle cx="${f(X(min) - 3.4)}" cy="${f(yc)}" r="2.6" fill="${RED}" stroke="${C.charcoal}" stroke-width="0.4"/>`;
    for (let i = 0; i <= n; i++) { const v = min + i * minor, x = X(v); b += seg([x, y0 + 3.4], [x, y0 + 3.4 + tickLen(v, min, major, minor, [2.6, 2, 1.3])], TICK);
      if (tickLen(v, min, major, minor, [1, 0, 0])) b += T(x, y0 + 8.9, lab(v), N); }
    b += T(X(max) + 2.6, yc + 1, unit, { ...N, anchor: 'start' });
    bottom = y0 + 9.6; right = X(max) + 1.8;
  } else {
    b += box(X(min) - padL, y0, len + padL + padR, 8.4, kind === 'ruler' ? CREAM : '#fff', { rx: 0.8 });
    for (let i = 0; i <= n; i++) { const v = min + i * minor, x = X(v); b += seg([x, y0], [x, y0 + tickLen(v, min, major, minor, [3.2, 2.4, 1.5])], TICK);
      if (tickLen(v, min, major, minor, [1, 0, 0])) b += T(x, y0 + 6.6, lab(v), N); }
    b += T(X(max) + padR + 1, y0 + 5.2, unit, { ...N, anchor: 'start' });
    if (read !== undefined) { const x = X(read);
      b += `<polygon points="${f(x - 1.3)},${f(y0 - 3)} ${f(x + 1.3)},${f(y0 - 3)} ${f(x)},${f(y0 - 0.4)}" fill="${C.blue}"/>` + seg([x, y0 - 0.4], [x, y0 + 3.4], BLUE); }
    bottom = y0 + 8.4; right = X(max) + padR;
  }
  if (ask) b += T((X(min) + X(max)) / 2, bottom + 4.2, ask, Q);
  return svg(f(right + 0.5), f(bottom + 0.5), b);
};

// A piece of a scale (k equal spaces, no numbers) with one space measured in blue: the precision is given.
const piece = (gap, { k = 5, sp = 5, ask = 'abs. error = ?' } = {}) => {
  const x0 = 2.2, y0 = 4.6, a = x0 + Math.floor(k / 2) * sp;
  let b = box(x0 - 1.7, y0, k * sp + 3.4, 5, CREAM, { rx: 0.8 });
  for (let i = 0; i <= k; i++) b += seg([x0 + i * sp, y0], [x0 + i * sp, y0 + 2.6], TICK);
  b += dimH(a, a + sp, y0 - 1.3, BLUE) + T(a + sp / 2, y0 - 2.6, gap, G);
  if (ask) b += T(x0 + (k * sp) / 2, y0 + 5 + 4.2, ask, Q);
  return svg(f(k * sp + 4.4), f(y0 + 5.5), b);
};

// A measuring jug (upright), liquid up to level: the scale on its right, the unit above the numbers, ask to the right.
const jug = ({ min = 0, max, major, minor, unit = 'mL', len = 18, level, ask = '' }) => {
  const x0 = 0.6, W = 12, top = 6, bot = top + len, n = Math.round((max - min) / minor), Y = (v) => bot - ((v - min) / (max - min)) * len;
  let b = box(x0, top - 2, W, len + 2, '#fff');
  if (level !== undefined) b += box(x0, Y(level), W, bot - Y(level), LIQ, { none: true }) + box(x0, top - 2, W, len + 2, 'none');
  let wN = 0;
  for (let i = 0; i <= n; i++) { const v = min + i * minor, y = Y(v); b += seg([x0 + W - tickLen(v, min, major, minor, [3, 2.1, 1.3]), y], [x0 + W, y], TICK);
    if (tickLen(v, min, major, minor, [1, 0, 0])) { b += T(x0 + W + 1.2, y + 1, lab(v), { ...N, anchor: 'start' }); wN = Math.max(wN, tw(lab(v), 2.8)); } }
  b += T(x0 + W + 1.2, top - 3.6, unit, { ...N, anchor: 'start', weight: 600 });
  if (ask) b += T(x0 + W + 1.2 + wN + 2.6, (top + bot) / 2 + 1, ask, { ...Q, anchor: 'start' });
  return svg(f(x0 + W + 1.2 + wN + 0.5), f(bot + 0.6), b);
};

// An upright thermometer: the scale on the right of the tube, red up to level, ask to the right.
const vthermo = ({ min, max, major, minor, unit = '°C', len = 13, level, ask = '' }) => {
  const x0 = 3.2, top = 6, bot = top + len, n = Math.round((max - min) / minor), Y = (v) => bot - ((v - min) / (max - min)) * len, xt = x0 + 3.4;
  let b = box(x0, top - 2, 3.4, len + 3.5, '#fff', { rx: 1.7 });
  const lv = level !== undefined ? level : min + (max - min) * 0.6;
  b += box(x0 + 1, Y(lv), 1.4, bot + 2 - Y(lv), RED, { none: true });
  b += `<circle cx="${f(x0 + 1.7)}" cy="${f(bot + 3.6)}" r="2.6" fill="${RED}" stroke="${C.charcoal}" stroke-width="0.4"/>`;
  let wN = 0;
  for (let i = 0; i <= n; i++) { const v = min + i * minor, y = Y(v); b += seg([xt, y], [xt + tickLen(v, min, major, minor, [2.6, 2, 1.3]), y], TICK);
    if (tickLen(v, min, major, minor, [1, 0, 0])) { b += T(xt + 3.4, y + 1, lab(v), { ...N, anchor: 'start' }); wN = Math.max(wN, tw(lab(v), 2.8)); } }
  b += T(xt + 3.4, top - 3.6, unit, { ...N, anchor: 'start', weight: 600 });
  if (ask) b += T(xt + 3.4 + wN + 2.6, (top + bot) / 2 + 1, ask, { ...Q, anchor: 'start' });
  return svg(f(xt + 3.4 + wN + 0.5), f(bot + 6.7), b);
};

// Measured things, each with its measurement on it. ask: the unknown (under a plank or pencil, beside the others).
// A plank: its length on a blue measurement line under it.
const plank = (m, { w = 28, ask = '' } = {}) => {
  const x0 = 0.6, y0 = 0.6, h = 3.6, yd = y0 + h + 2, grain = { stroke: '#c9a46a', w: 0.25 };
  let b = box(x0, y0, w, h, WOOD) + seg([x0 + 3, y0 + 1.2], [x0 + w * 0.45, y0 + 1.2], grain) + seg([x0 + w * 0.32, y0 + 2.5], [x0 + w - 4, y0 + 2.5], grain);
  b += dimH(x0, x0 + w, yd, BLUE) + T(x0 + w / 2, yd + 4, m, G);
  if (ask) b += T(x0 + w / 2, yd + 8.4, ask, Q);
  return svg(f(w + 1.2), f(yd + 5), b);
};
// A pencil, its length on a blue measurement line under it, then the unit to change to ('15 cm', '= ? mm')
const pencil = (m, ask, { w = 26 } = {}) => {
  const x0 = 0.6, y0 = 0.6, h = 3.4, yd = y0 + h + 2;
  let b = box(x0, y0, 2.4, h, '#f2b8c6') + `<polygon points="${f(x0 + 2.4)},${f(y0)} ${f(x0 + w - 4)},${f(y0)} ${f(x0 + w)},${f(y0 + h / 2)} ${f(x0 + w - 4)},${f(y0 + h)} ${f(x0 + 2.4)},${f(y0 + h)}" fill="#f6d77a" stroke="${C.charcoal}" stroke-width="0.4"/>`;
  b += `<polygon points="${f(x0 + w - 1.4)},${f(y0 + h / 2 - 0.6)} ${f(x0 + w)},${f(y0 + h / 2)} ${f(x0 + w - 1.4)},${f(y0 + h / 2 + 0.6)}" fill="${C.charcoal}"/>`;
  b += dimH(x0, x0 + w, yd, BLUE) + pair(x0 + w / 2, yd + 4, m, ask);
  return svg(f(w + 1.2), f(yd + 5), b);
};
// A bag (of flour, rice ...) with its mass on a white label
const bag = (m, { ask = '', H = 14 } = {}) => {
  const W = Math.max(12, tw(m) + 4.4), x0 = 0.6, x1 = x0 + W, cx = x0 + W / 2, top = 0.6, sh = top + 3.4, py = (sh + 2 + H) / 2 + 0.2;
  let b = path(`M${f(cx - 2)},${top} L${f(cx + 2)},${top} L${f(x1 - 0.8)},${f(sh)} Q${f(x1)},${f(sh + 0.6)} ${f(x1)},${f(sh + 2)} L${f(x1)},${f(H - 1.6)} Q${f(x1)},${f(H)} ${f(x1 - 1.6)},${f(H)} L${f(x0 + 1.6)},${f(H)} Q${f(x0)},${f(H)} ${f(x0)},${f(H - 1.6)} L${f(x0)},${f(sh + 2)} Q${f(x0)},${f(sh + 0.6)} ${f(x0 + 0.8)},${f(sh)} Z`, '#f3ead8');
  b += seg([cx - 2.6, top + 1.4], [cx + 2.6, top + 1.4], { w: 0.7 });
  b += box(cx - (tw(m) + 2.4) / 2, py - 2.5, tw(m) + 2.4, 5, '#fff', { stroke: C.grey, w: 0.25 }) + T(cx, py + 1.05, m, G);
  if (ask) b += T(x1 + 2.2, py + 1, ask, { ...Q, anchor: 'start' });
  return svg(f(x1 + 0.6), f(H + 0.6), b);
};
// A bottle with its capacity on a white label
const bottle = (m, { ask = '', H = 16 } = {}) => {
  const W = Math.max(10, tw(m) + 3.4), x0 = 0.6, x1 = x0 + W, cx = x0 + W / 2, cap = 0.6, sh = 5.6, py = (sh + 0.6 + H) / 2 + 0.3;
  let b = box(cx - 2, cap, 4, 1.8, '#9fb3e0');
  b += path(`M${f(cx - 1.6)},${f(cap + 1.8)} L${f(cx + 1.6)},${f(cap + 1.8)} L${f(cx + 1.6)},${f(sh - 1.6)} Q${f(x1)},${f(sh - 1.2)} ${f(x1)},${f(sh + 0.6)} L${f(x1)},${f(H - 1.2)} Q${f(x1)},${f(H)} ${f(x1 - 1.2)},${f(H)} L${f(x0 + 1.2)},${f(H)} Q${f(x0)},${f(H)} ${f(x0)},${f(H - 1.2)} L${f(x0)},${f(sh + 0.6)} Q${f(x0)},${f(sh - 1.2)} ${f(cx - 1.6)},${f(sh - 1.6)} Z`, '#dfe9f8');
  b += box(x0 + 0.5, py - 2.5, W - 1, 5, '#fff', { stroke: C.grey, w: 0.25 }) + T(cx, py + 1.05, m, G);
  if (ask) b += T(x1 + 2.2, py + 1, ask, { ...Q, anchor: 'start' });
  return svg(f(x1 + 0.6), f(H + 0.6), b);
};
// A stopwatch: the time on its display
const timer = (m, { ask = '' } = {}) => {
  const W = tw(m) + 5, x0 = 0.6, top = 2.4, H = 9, cx = x0 + W / 2;
  let b = box(cx - 1.4, 0.6, 2.8, 1.8, '#9aa6c8') + box(x0 + W - 4.2, 1.2, 2.2, 1.2, '#9aa6c8');
  b += box(x0, top, W, H, '#e1e6f3', { rx: 2 }) + box(x0 + 1.3, top + 1.7, W - 2.6, 5.6, '#fff', { w: 0.3 }) + T(cx, top + 1.7 + 2.8 + 1.05, m, G);
  if (ask) b += T(x0 + W + 2.2, top + H / 2 + 1, ask, { ...Q, anchor: 'start' });
  return svg(f(x0 + W + 0.6), f(top + H + 0.6), b);
};

// The Notes diagram: a pencil measured with a ruler marked in whole cm. Its end is between 4 and 5, nearer 4: it reads
// 4 cm. The precision is the gap between marks (1 cm); the true length lies between the half-way points 3.5 and 4.5.
const notesFig = () => {
  const k = 8.6, X = (v) => 0.6 + (v - 2.35) * k, top = 5, H = 7.6;
  let b = box(X(2.35), 1.2, X(4.3) - X(2.35), 2.6, LIQ, { stroke: C.blue, w: 0.4 });
  b += T(X(4.3) + 1.2, 3.6, 'reads 4 cm', { size: 2.6, anchor: 'start', weight: 600 });
  b += box(X(2.35), top, X(5.75) - X(2.35), H, CREAM, { rx: 0.8 });
  [3, 4, 5].forEach((v) => { b += seg([X(v), top], [X(v), top + 3.2], TICK) + T(X(v), top + 6.2, String(v), N); });
  b += T(X(5.75) - 0.6, top + 6.2, 'cm', { size: 2.4, anchor: 'end' });
  // the limits: the half-way points, dashed down from the ruler to a blue band
  const yb = top + H + 2.2;
  [3.5, 4.5].forEach((v) => { b += seg([X(v), top], [X(v), yb], { stroke: C.blue, w: 0.3, dash: true }); });
  b += box(X(3.5), yb, X(4.5) - X(3.5), 2.2, LIQ, { stroke: C.blue, w: 0.4 });
  b += T(X(3.5), yb + 5.4, '3.5', { size: 2.6, fill: C.blue, weight: 600 }) + T(X(4.5), yb + 5.4, '4.5', { size: 2.6, fill: C.blue, weight: 600 });
  b += T(X(4), yb + 8.8, 'limits', { size: 2.6 });
  // the precision: the gap between two marks
  const yp = yb + 12;
  b += dimH(X(4), X(5), yp) + T(X(4.5), yp + 3.6, 'precision 1 cm', { size: 2.6 });
  return svg(f(X(5.75) + 0.6), f(yp + 4.4), b);
};

// ---------------------------------------------------------------- the questions
// A round of formula questions from [picture, answer, text?, own formula?]: the formula printed (a string) or left for
// students to write (true); lines relabels the three lines.
const formFig = (list, form, lines) => ({ items: list.map(([fig, , t = '', own]) => ({ t, fig, form: own || form, ...(lines ? { lines } : {}) })), ans: list.map((x) => x[1]) });
// A scale question: its picture, and its precision ('p') or absolute error ('e')
const draw = (o) => (o.kind === 'jug' ? jug(o) : o.kind === 'vthermo' ? vthermo(o) : hs(o));
const scaleQ = (o, what) => [draw({ ...o, ask: what === 'p' ? 'precision = ?' : 'abs. error = ?' }), u(what === 'p' ? o.minor : absErr(o.minor), o.unit)];
// Working for a scale: 'Precision = 200 ÷ 4 = 50 g'
const precWork = (o) => `Precision = ${num(o.major)} ÷ ${num(Math.round(o.major / o.minor))} = ${u(o.minor, o.unit)}`;

// WE DO Example 1
const EX1a = { min: 0, max: 600, major: 200, minor: 50, unit: 'g', kind: 'dial', len: 30 };
const EX1b = { min: 0, max: 3, major: 1, minor: 0.1, unit: 'cm', len: 30 };
// WE DO Example 2
const EX2a = { min: 0, max: 400, major: 100, minor: 50, unit: 'mL', len: 13, level: 250 };
const EX2c = { min: 0, max: 500, major: 100, minor: 20, unit: 'g', kind: 'dial', len: 32, read: 340 };
// Medium: limits from a scale reading
const M4 = { min: 20, max: 40, major: 5, minor: 1, unit: '°C', kind: 'thermo', len: 22, read: 37 };
const M6 = { min: 0, max: 100, major: 20, minor: 5, unit: 'kg', kind: 'dial', len: 24, read: 65 };
const scaleLimits = (o) => limits(`${o.read !== undefined ? o.read : o.level} ${o.unit}`, absErr(o.minor));

module.exports = {
  code: '10.2', title: 'Precision and absolute error',
  li: 'find the precision and absolute error of a measurement, and its limits of accuracy.',
  sc: ['find the precision of a scale or a measurement', 'find the absolute error: precision ÷ 2', 'write the limits of accuracy: m ± absolute error'],
  notes: {
    terms: [['precision', 'the gap between two marks on a scale'], ['precision of a measurement', 'the place value of its last digit'],
      ['absolute error', 'half the precision'], ['m', 'the measurement'], ['true value', 'the exact size, which we never know'],
      ['limits of accuracy', 'the smallest and largest the true value can be']],
    formulas: ['Precision = gap ÷ spaces', 'Precision of 3.45 m = 0.01 m', 'Abs. error = precision ÷ 2', 'Limits = m ± abs. error', 'Lower m − abs. error, upper m + abs. error'],
    steps: ['find the precision', 'abs. error = precision ÷ 2', 'lower = m − abs. error', 'upper = m + abs. error'],
    fig: notesFig(),
  },
  easy: {
    ex: { stem: 'Find the precision, the absolute error or the limits of accuracy.', parts: [
      { t: 'Precision', fig: hs(EX1a) }, { t: 'Abs. error', fig: hs(EX1b) }, { t: 'Abs. error', fig: bag('3.6 kg') }, { t: 'Limits', fig: plank('24 m', { w: 30 }) }] },
    exAns: [precWork(EX1a), `${precWork(EX1b)} (1 mm); abs. error = 0.1 ÷ 2 = ${u(absErr(0.1), 'cm')} (0.5 mm)`,
      `Precision = 0.1 kg (last digit); abs. error = 0.1 ÷ 2 = ${aerr('3.6 kg')}`, `Abs. error = 1 ÷ 2 = ${aerr('24 m')}; limits = 24 − 0.5 to 24 + 0.5 = ${limits('24 m')}`],
    hint: 'Precision = gap between two numbers ÷ number of spaces between them · Absolute error = precision ÷ 2',
    work: true,
    // Small steps: the precision of a scale (count the spaces), then the absolute error from a given precision. Each
    // question is its diagram: the unknown marked with a ?, the round heading says what to find.
    rounds: [
      { text: 'find the precision of each scale: the gap between two marks.', cols: 3, ...formFig([
        { min: 0, max: 6, major: 1, minor: 0.5, unit: 'cm', len: 24 },
        { min: 0, max: 40, major: 10, minor: 2, unit: 'kg', kind: 'dial', len: 24 },
        { min: 0, max: 50, major: 10, minor: 5, unit: '°C', kind: 'thermo', len: 20 }].map((o) => scaleQ(o, 'p')), 'Precision = gap ÷ spaces') },
      { text: 'find the absolute error. The gap between two marks (the precision) is given.', cols: 3, ...formFig([
        ['2 cm', 2, 'cm'], ['10 mL', 10, 'mL'], ['0.2 kg', 0.2, 'kg']].map(([g, p, x]) => [piece(g), u(absErr(p), x)]), 'Abs. error = precision ÷ 2') },
    ],
  },
  // Page 2: the absolute error of a scale (formula printed, then written by students), then of a measurement from its
  // last digit, then the limits of accuracy.
  drill: {
    hint: 'Abs. error = precision ÷ 2 · The precision of 3.45 m is 0.01 m: the place value of its last digit · Limits = m − abs. error to m + abs. error',
    rounds: [
      { text: 'find the absolute error of each scale.', ...formFig([
        { min: 0, max: 4, major: 1, minor: 0.2, unit: 'cm', len: 34 },
        { min: 0, max: 300, major: 100, minor: 25, unit: 'mL', kind: 'jug', len: 18, level: 175 },
        { min: 0, max: 40, major: 10, minor: 2, unit: '°C', kind: 'thermo', len: 32 }].map((o) => scaleQ(o, 'e')), 'Abs. error = precision ÷ 2') },
      { text: 'write the formula, then find the absolute error of each scale.', ...formFig([
        { min: 0, max: 2, major: 0.5, minor: 0.1, unit: 'kg', kind: 'dial', len: 34 },
        { min: 0, max: 600, major: 200, minor: 50, unit: 'mL', kind: 'jug', len: 18, level: 450 },
        { min: -20, max: 40, major: 20, minor: 5, unit: '°C', kind: 'vthermo', len: 13, level: 15 }].map((o) => scaleQ(o, 'e')), true) },
      { text: 'find the absolute error of each measurement. Its last digit gives the precision.', ...formFig([
        [plank('3.45 m', { w: 32, ask: 'abs. error = ?' }), aerr('3.45 m')], [bag('6.2 kg', { ask: 'abs. error = ?', H: 15 }), aerr('6.2 kg')],
        [timer('15 s', { ask: 'abs. error = ?' }), aerr('15 s')]], 'Abs. error = precision ÷ 2') },
      { text: 'find the limits of accuracy of each measurement.', ...formFig([
        [plank('8 m', { w: 32, ask: 'limits = ?' }), limits('8 m')], [bottle('1.5 L', { ask: 'limits = ?' }), limits('1.5 L')],
        [bag('2.25 kg', { ask: 'limits = ?', H: 15 }), limits('2.25 kg')]], 'Limits = m ± abs. error') },
    ],
  },
  medium: {
    ex: { stem: 'Find the limits of accuracy of each measurement.', parts: [
      { t: 'Limits', fig: jug(EX2a) }, { t: 'Limits', fig: plank('2.45 m', { w: 30 }) },
      { t: 'Limits', fig: hs(EX2c) }, { t: 'Could it be 3.46 kg?', fig: bag('3.4 kg') }] },
    exAns: [`${precWork(EX2a)}; abs. error = 50 ÷ 2 = 25 mL; limits = 250 − 25 to 250 + 25 = ${scaleLimits(EX2a)}`,
      `Abs. error = 0.01 ÷ 2 = ${aerr('2.45 m')}; limits = 2.45 − 0.005 to 2.45 + 0.005 = ${limits('2.45 m')}`,
      `${precWork(EX2c)}; abs. error = 20 ÷ 2 = 10 g; limits = 340 − 10 to 340 + 10 = ${scaleLimits(EX2c)}`,
      `Abs. error = 0.1 ÷ 2 = ${aerr('3.4 kg')}; limits ${limits('3.4 kg')}. 3.46 kg is above 3.45 kg, so no.`],
    hint: 'Lower limit = m − abs. error · Upper limit = m + abs. error · The true value is between the limits',
    work: true, set: true,
    // One set: today's skill, building from absolute error to limits and reasoning, with a question from an earlier
    // lesson (tagged) in each row. Every question that can be drawn is its diagram, with a word saying what to find.
    rounds: [(() => {
      const ff = (t, fig, a, o = {}) => [{ t, fig, form: true, ...o }, a];
      const conv1 = { from: '10.1', lines: ['Rule', 'Working', 'Answer'] };
      const Q9 = [
        ff('Abs. error', bottle('1.125 L', { H: 14 }), aerr('1.125 L')),
        ff('Convert', pencil('15 cm', '= ? mm'), u(conv(15, 'cm', 'mm'), 'mm'), conv1),
        ff('Limits', timer('12.45 s'), limits('12.45 s')),
        ff('Limits', hs(M4), scaleLimits(M4)),
        ff('Area', S.rect(8, 5, { sides: ['8 m', '5 m'], right: [0], size: 16, maxH: 10 }), u(8 * 5, 'm²'), { from: 'Year 8' }),
        ff('Limits', hs(M6), scaleLimits(M6)),
        ff('Convert', bottle('750 mL', { ask: '= ? L', H: 14 }), u(conv(750, 'mL', 'L'), 'L'), conv1),
        [{ t: 'The limits of a length are 4.15 m and 4.25 m. Find the length and its absolute error.' },
          `${u((4.15 + 4.25) / 2, 'm')}; absolute error ${u((4.25 - 4.15) / 2, 'm')}`],
        [{ t: 'Could this plank really be 12.56 m long? Explain.', fig: plank('12.5 m', { w: 24 }) },
          `No: the limits are ${limits('12.5 m')}, and 12.56 m is more than 12.55 m`],
      ];
      return { text: '', items: Q9.map((x) => x[0]), ans: Q9.map((x) => x[1]) };
    })()],
  },
  worded: [
    { q: 'A nurse’s thermometer is marked every 0.2 °C. It shows 37.6 °C. A fever is above 38 °C. Could the patient have a fever? Explain.',
      a: `Abs. error = 0.2 ÷ 2 = ${u(absErr(0.2), '°C')}; limits 37.6 − 0.1 to 37.6 + 0.1 = ${limits('37.6 °C', absErr(0.2))}. The most it can be is 37.7 °C, below 38 °C: no fever.` },
    { q: 'Two planks are each 1.5 m long, to the nearest 0.1 m. They are laid end to end. Find the smallest and the largest possible total length.',
      a: `Abs. error = 0.1 ÷ 2 = ${aerr('1.5 m')}; each plank ${limits('1.5 m')}; smallest 1.45 + 1.45 = ${u(1.45 * 2, 'm')}; largest 1.55 + 1.55 = ${u(1.55 * 2, 'm')}` },
    { q: 'Sam ran 100 m in 13.4 s, timed to the nearest 0.1 s. Ali ran it in 13.36 s. Can we be sure that Ali was faster? Explain.',
      a: `Sam: abs. error = 0.1 ÷ 2 = ${aerr('13.4 s')}, limits ${limits('13.4 s')}. 13.36 s is inside these limits, so Sam may have been faster: we cannot be sure.` },
  ],
};
