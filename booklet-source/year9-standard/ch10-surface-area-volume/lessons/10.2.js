// Lesson 10.2 Precision and absolute error (three pages: Easy with the Notes box, Easy drill, then Medium with earlier
// lessons mixed in and three worded problems). See lib/lesson-two.js.
// Textbook 10.02. Precision (p): the gap between two marks on a scale, or the place value of a measurement's last digit.
// Absolute error = p ÷ 2. Limits of accuracy = m − absolute error to m + absolute error.
const { num, u, conv, absErr, meas, prec, aerr, limits } = require('../helpers');
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
  const padL = Math.max(1.8, tw(lab(min), 2.8) / 2 + 1), padR = Math.max(1.8, tw(lab(max), 2.8) / 2 + 1);
  const x0 = th ? 6.6 : 0.5 + padL, X = (v) => x0 + ((v - min) / (max - min)) * len;
  const y0 = th ? 1 : read !== undefined ? 3.6 : 0.5;
  let b = '', bottom, right;
  if (th) {
    const yc = y0 + 1.9, lv = read !== undefined ? read : min + (max - min) * 0.62;
    b += box(X(min) - 3, y0, len + 4.8, 3.8, '#fff', { rx: 1.9 });
    b += box(X(min) - 3.4, yc - 0.75, X(lv) - X(min) + 3.4, 1.5, RED, { none: true });
    b += `<circle cx="${f(X(min) - 3.4)}" cy="${f(yc)}" r="2.7" fill="${RED}" stroke="${C.charcoal}" stroke-width="0.4"/>`;
    for (let i = 0; i <= n; i++) { const v = min + i * minor, x = X(v); b += seg([x, y0 + 3.8], [x, y0 + 3.8 + tickLen(v, min, major, minor, [2.6, 2, 1.3])], TICK);
      if (tickLen(v, min, major, minor, [1, 0, 0])) b += T(x, y0 + 10.2, lab(v), N); }
    b += T(X(max) + 2.6, yc + 1, unit, { ...N, anchor: 'start' });
    bottom = y0 + 10.9; right = X(max) + 1.8;
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

// A measuring jug (upright), liquid up to level: the scale on its right with the unit after the top number, ask to the
// right of the numbers.
const jug = ({ min = 0, max, major, minor, unit = 'mL', len = 18, level, ask = '' }) => {
  const x0 = 0.6, W = 10, top = 2.6, bot = top + len, n = Math.round((max - min) / minor), Y = (v) => bot - ((v - min) / (max - min)) * len;
  let b = box(x0, top - 2, W, len + 2, '#fff');
  if (level !== undefined) b += box(x0, Y(level), W, bot - Y(level), LIQ, { none: true }) + box(x0, top - 2, W, len + 2, 'none');
  let wN = 0;
  for (let i = 0; i <= n; i++) { const v = min + i * minor, y = Y(v); b += seg([x0 + W - tickLen(v, min, major, minor, [3, 2.1, 1.3]), y], [x0 + W, y], TICK);
    if (tickLen(v, min, major, minor, [1, 0, 0])) { b += T(x0 + W + 1.2, y + 1, lab(v), { ...N, anchor: 'start' }); wN = Math.max(wN, tw(lab(v), 2.8)); } }
  b += T(x0 + W + 1.2 + tw(lab(max), 2.8) + 0.9, top + 1, unit, { ...N, anchor: 'start', weight: 600 });
  if (ask) b += T(x0 + W + 1.2 + wN + 2.2, (top + bot) / 2 + 1, ask, { ...Q, anchor: 'start' });
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

// Measured things, each with its measurement on it. ask: the unknown (under a plank, beside the others).
// A plank: its length on a blue measurement line under it.
const plank = (m, { w = 28, ask = '' } = {}) => {
  const x0 = 0.6, y0 = 0.6, h = 3.6, yd = y0 + h + 2, grain = { stroke: '#c9a46a', w: 0.25 };
  let b = box(x0, y0, w, h, WOOD) + seg([x0 + 3, y0 + 1.2], [x0 + w * 0.45, y0 + 1.2], grain) + seg([x0 + w * 0.32, y0 + 2.5], [x0 + w - 4, y0 + 2.5], grain);
  b += dimH(x0, x0 + w, yd, BLUE) + T(x0 + w / 2, yd + 4, m, G);
  if (ask) b += T(x0 + w / 2, yd + 8.4, ask, Q);
  return svg(f(w + 1.2), f(yd + 5), b);
};
// A pencil, its length on a blue measurement line under it, then the unit to change to under that ('15 cm', '= ? mm')
const pencil = (m, ask, { w = 20 } = {}) => {
  const x0 = 0.6, y0 = 0.6, h = 3, yd = y0 + h + 1.6;
  let b = box(x0, y0, 2.4, h, '#f2b8c6') + `<polygon points="${f(x0 + 2.4)},${f(y0)} ${f(x0 + w - 4)},${f(y0)} ${f(x0 + w)},${f(y0 + h / 2)} ${f(x0 + w - 4)},${f(y0 + h)} ${f(x0 + 2.4)},${f(y0 + h)}" fill="#f6d77a" stroke="${C.charcoal}" stroke-width="0.4"/>`;
  b += `<polygon points="${f(x0 + w - 1.4)},${f(y0 + h / 2 - 0.55)} ${f(x0 + w)},${f(y0 + h / 2)} ${f(x0 + w - 1.4)},${f(y0 + h / 2 + 0.55)}" fill="${C.charcoal}"/>`;
  b += dimH(x0, x0 + w, yd, BLUE) + T(x0 + w / 2, yd + 3.9, m, G) + T(x0 + w / 2, yd + 7.9, ask, Q);
  return svg(f(w + 1.2), f(yd + 5), b);
};
// A juice carton with its capacity on it, then the unit to change to under it ('750 mL', '= ? L')
const carton = (m, ask) => {
  const W = tw(m) + 2.6, x0 = 0.6, x1 = x0 + W, cx = x0 + W / 2, top = 1.2, sh = top + 2, H = sh + 6;
  // the sealed ridge along the top, then the sloping top, then the body
  let b = box(x0 + 1.6, top - 1, W - 3.2, 1, '#c9d6f2', { w: 0.3 });
  b += `<polygon points="${f(x0)},${f(sh)} ${f(x0 + 1.6)},${f(top)} ${f(x1 - 1.6)},${f(top)} ${f(x1)},${f(sh)}" fill="#dfe5f2" stroke="${C.charcoal}" stroke-width="0.4"/>`;
  b += box(cx - 1.1, top + 0.4, 2.2, 1, '#9fb3e0', { w: 0.3, rx: 0.3 });
  b += box(x0, sh, W, H - sh, '#f7f9fd') + T(cx, (sh + H) / 2 + 1.05, m, G) + T(cx, H + 4, ask, Q);
  return svg(f(x1 + 0.6), f(H + 0.6), b);
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
// The limits of a length on a number line: a blue band from lo to hi, the length (unknown) marked over its middle
const band = (lo, hi, unit) => {
  const L = `${lo} ${unit}`, H2 = `${hi} ${unit}`, xl = 0.6 + tw(L) / 2, xh = xl + 14, xm = (xl + xh) / 2, y = 6.6;
  let b = seg([xl - 3.5, y], [xh + 3.5, y], { stroke: C.charcoal, w: 0.35 }) + seg([xl, y], [xh, y], { stroke: C.blue, w: 1.1 });
  b += [xl, xh].map((x) => seg([x, y - 1.3], [x, y + 1.3], BLUE)).join('') + seg([xm, y - 0.9], [xm, y + 0.9], TICK);
  b += T(xm, 3.2, 'length = ?', Q) + T(xl, y + 4.6, L, G) + T(xh, y + 4.6, H2, G);
  return svg(f(xh + tw(H2) / 2 + 0.6), f(y + 5.4), b);
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
// The worked lines, all calculated: 'p = 200 ÷ 4 = 50 g', 'abs. error = 0.1 ÷ 2 = 0.05 kg',
// 'abs. error = 1 ÷ 2 = 0.5 m; limits = 24 − 0.5 to 24 + 0.5 = 23.5 m to 24.5 m'
const precWork = (o) => `p = ${num(o.major)} ÷ ${num(Math.round(o.major / o.minor))} = ${u(o.minor, o.unit)}`;
const aeWork = (p, unit) => `abs. error = ${num(p)} ÷ 2 = ${u(absErr(p), unit)}`;
// s: the measurement as written ('2.45 m'); p: the precision when it is not the last digit's place (a scale)
const lim = (s, p) => { const m = meas(s), P = p ?? m.p, e = absErr(P); return { ...m, P, e, lo: +(m.v - e).toPrecision(12), hi: +(m.v + e).toPrecision(12) }; };
const limWork = (s, p) => { const L = lim(s, p);
  return `${aeWork(L.P, L.unit)}; limits = ${num(L.v)} − ${num(L.e)} to ${num(L.v)} + ${num(L.e)} = ${limits(s, L.e)}`; };
const cap = (s) => s[0].toUpperCase() + s.slice(1);

// WE DO Example 1
const EX1a = { min: 0, max: 600, major: 200, minor: 50, unit: 'g', kind: 'dial', len: 24 };
const EX1b = { min: 0, max: 2, major: 1, minor: 0.1, unit: 'cm', len: 20 };
// WE DO Example 2
const EX2a = { min: 0, max: 400, major: 200, minor: 50, unit: 'mL', len: 10, level: 250 };
const EX2c = { min: 200, max: 400, major: 100, minor: 20, unit: 'g', kind: 'dial', len: 23, read: 340 };
// Medium: limits from a scale reading
const M4 = { min: 20, max: 40, major: 5, minor: 1, unit: '°C', kind: 'thermo', len: 20, read: 37 };
const M6 = { min: 40, max: 80, major: 10, minor: 5, unit: 'kg', kind: 'dial', len: 22.5, read: 65 };
const reading = (o) => `${o.read !== undefined ? o.read : o.level} ${o.unit}`;
const scaleLimits = (o) => limits(reading(o), absErr(o.minor));
// Medium 8: the limits given, the length and its absolute error to find
const M8 = { lo: 4.15, hi: 4.25, unit: 'm' };
const m8 = { v: +((M8.lo + M8.hi) / 2).toPrecision(12), e: +((M8.hi - M8.lo) / 2).toPrecision(12) };
// Worded problems
const W1 = lim('37.6 °C', 0.2), W2 = lim('1.5 m'), W3 = lim('13.4 s');

module.exports = {
  code: '10.2', title: 'Precision and absolute error',
  li: 'find the precision and absolute error of a measurement, and its limits of accuracy.',
  sc: ['find the precision of a scale or a measurement', 'find the absolute error: precision ÷ 2', 'write the limits of accuracy: m ± absolute error'],
  notes: {
    terms: [['precision (p)', 'the gap between two marks on a scale'], ['p of a measurement', 'the place value of its last digit'],
      ['absolute error', 'half the precision'], ['m', 'the measurement'], ['true value', 'the exact size, which we never know'],
      ['limits of accuracy', 'the smallest and largest the true value can be']],
    formulas: ['p = gap ÷ spaces', 'p of 3.45 m = 0.01 m', 'Abs. error = p ÷ 2', 'Limits = m ± abs. error', 'Lower m − abs. error, upper m + abs. error'],
    steps: ['find p', 'abs. error = p ÷ 2', 'lower = m − abs. error', 'upper = m + abs. error'],
    fig: notesFig(),
  },
  easy: {
    ex: { stem: 'Find the precision, the absolute error or the limits of accuracy.', parts: [
      { t: 'Precision', fig: hs(EX1a) }, { t: 'Abs. error', fig: hs(EX1b) }, { t: 'Abs. error', fig: bag('3.6 kg') }, { t: 'Limits', fig: plank('24 m', { w: 30 }) }] },
    exAns: [precWork(EX1a), `${precWork(EX1b)} (${u(conv(EX1b.minor, 'cm', 'mm'), 'mm')}); ${aeWork(EX1b.minor, 'cm')} (${u(conv(absErr(EX1b.minor), 'cm', 'mm'), 'mm')})`,
      `p = ${prec('3.6 kg')} (last digit); ${aeWork(meas('3.6 kg').p, 'kg')}`, cap(limWork('24 m'))],
    hint: 'p = gap between two numbers ÷ number of spaces between them · Abs. error = p ÷ 2',
    work: true,
    // Small steps: the precision of a scale (count the spaces), then the absolute error from a given precision. Each
    // question is its diagram: the unknown marked with a ?, the round heading says what to find.
    rounds: [
      { text: 'find the precision of each scale: the gap between two marks.', cols: 3, ...formFig([
        { min: 0, max: 6, major: 1, minor: 0.5, unit: 'cm', len: 24 },
        { min: 0, max: 40, major: 10, minor: 2, unit: 'kg', kind: 'dial', len: 24 },
        { min: 0, max: 40, major: 10, minor: 5, unit: '°C', kind: 'thermo', len: 20, read: 25 }].map((o) => scaleQ(o, 'p')), 'p = gap ÷ spaces') },
      { text: 'find the absolute error. The gap between two marks (the precision) is given.', cols: 3, ...formFig([
        ['2 cm', 2, 'cm'], ['10 mL', 10, 'mL'], ['0.2 kg', 0.2, 'kg']].map(([g, p, x]) => [piece(g), u(absErr(p), x)]), 'Abs. error = p ÷ 2') },
    ],
  },
  // Page 2: the absolute error of a scale (formula printed, then written by students), then of a measurement from its
  // last digit, then the limits of accuracy.
  drill: {
    hint: 'Abs. error = p ÷ 2 · p of 3.45 m = 0.01 m (its last digit) · Limits = m − abs. error to m + abs. error',
    rounds: [
      { text: 'find the absolute error of each scale.', ...formFig([
        { min: 0, max: 4, major: 1, minor: 0.2, unit: 'cm', len: 34 },
        { min: 0, max: 300, major: 100, minor: 25, unit: 'mL', kind: 'jug', len: 18, level: 175 },
        { min: 0, max: 40, major: 10, minor: 2, unit: '°C', kind: 'thermo', len: 30, read: 24 }].map((o) => scaleQ(o, 'e')), 'Abs. error = p ÷ 2') },
      { text: 'write the formula, then find the absolute error of each scale.', ...formFig([
        { min: 0, max: 2, major: 0.5, minor: 0.1, unit: 'kg', kind: 'dial', len: 34 },
        { min: 0, max: 600, major: 200, minor: 50, unit: 'mL', kind: 'jug', len: 18, level: 450 },
        { min: -20, max: 40, major: 20, minor: 5, unit: '°C', kind: 'vthermo', len: 12.5, level: 15 }].map((o) => scaleQ(o, 'e')), true) },
      { text: 'find the absolute error of each measurement. Its last digit gives the precision.', ...formFig([
        [plank('3.45 m', { w: 32, ask: 'abs. error = ?' }), aerr('3.45 m')], [bag('6.2 kg', { ask: 'abs. error = ?', H: 15 }), aerr('6.2 kg')],
        [timer('15 s', { ask: 'abs. error = ?' }), aerr('15 s')]], 'Abs. error = p ÷ 2') },
      { text: 'find the limits of accuracy of each measurement.', ...formFig([
        [plank('8 m', { w: 32, ask: 'limits = ?' }), limits('8 m')], [bottle('1.5 L', { ask: 'limits = ?' }), limits('1.5 L')],
        [bag('2.25 kg', { ask: 'limits = ?', H: 15 }), limits('2.25 kg')]], 'Limits = m ± abs. error') },
    ],
  },
  medium: {
    ex: { stem: 'Find the limits of accuracy of each measurement.', parts: [
      { t: 'Limits', fig: jug(EX2a) }, { t: 'Limits', fig: plank('2.45 m', { w: 30 }) },
      { t: 'Limits', fig: hs(EX2c) }, { t: 'Could it be 3.46 kg?', fig: bag('3.4 kg', { H: 13 }) }] },
    exAns: [`${precWork(EX2a)}; ${limWork(reading(EX2a), EX2a.minor)}`, cap(limWork('2.45 m')),
      `${precWork(EX2c)}; ${limWork(reading(EX2c), EX2c.minor)}`,
      `${cap(limWork('3.4 kg'))}. 3.46 kg is above ${u(lim('3.4 kg').hi, 'kg')}, so no.`],
    hint: 'Lower limit = m − abs. error · Upper limit = m + abs. error · The true value is between the limits',
    work: true, set: true,
    // One set: today's skill, building from absolute error to limits and reasoning, with a question from an earlier
    // lesson (tagged) in each row. Every question that can be drawn is its diagram, with a word saying what to find.
    rounds: [(() => {
      const ff = (t, fig, a, o = {}) => [{ t, fig, form: true, ...o }, a];
      const conv1 = { from: '10.1', lines: ['Rule', 'Working', 'Answer'] };
      const Q9 = [
        ff('Abs. error', bottle('1.125 L', { H: 13.4 }), aerr('1.125 L')),
        ff('Convert', pencil('15 cm', '= ? mm'), u(conv(15, 'cm', 'mm'), 'mm'), conv1),
        ff('Limits', timer('12.45 s'), limits('12.45 s')),
        ff('Limits', hs(M4), scaleLimits(M4)),
        ff('Area', S.rect(8, 5, { sides: ['8 m', '5 m'], right: [0], size: 12, maxH: 7.5 }), u(8 * 5, 'm²'), { from: 'Year 8' }),
        ff('Limits', hs(M6), scaleLimits(M6)),
        ff('Convert', carton('750 mL', '= ? L'), u(conv(750, 'mL', 'L'), 'L'), conv1),
        [{ t: 'These are the limits of accuracy of a length. Find the length and its absolute error.', fig: band(M8.lo, M8.hi, M8.unit) },
          `(${num(M8.lo)} + ${num(M8.hi)}) ÷ 2 = ${u(m8.v, M8.unit)}; abs. error = ${num(M8.hi)} − ${num(m8.v)} = ${u(m8.e, M8.unit)}`],
        [{ t: 'Could this plank really be 12.56 m long? Explain.', fig: plank('12.5 m', { w: 24 }) },
          `No: the limits are ${limits('12.5 m')}, and 12.56 m is more than ${u(lim('12.5 m').hi, 'm')}`],
      ];
      return { text: '', items: Q9.map((x) => x[0]), ans: Q9.map((x) => x[1]) };
    })()],
  },
  worded: [
    { q: 'A nurse’s thermometer is marked every 0.2 °C. It shows 37.6 °C. A fever is above 38 °C. Could the patient have a fever? Explain.',
      a: `${cap(limWork('37.6 °C', W1.P))}. The most it can be is ${u(W1.hi, '°C')}, below 38 °C: no fever.` },
    { q: 'Two planks are each 1.5 m long, to the nearest 0.1 m. They are laid end to end. Find the smallest and the largest possible total length.',
      a: `${cap(aeWork(W2.p, 'm'))}; each plank ${limits('1.5 m')}; smallest ${num(W2.lo)} + ${num(W2.lo)} = ${u(2 * W2.lo, 'm')}; largest ${num(W2.hi)} + ${num(W2.hi)} = ${u(2 * W2.hi, 'm')}` },
    { q: 'Sam ran 100 m in 13.4 s, timed to the nearest 0.1 s. Ali ran it in 13.36 s. Can we be sure that Ali was faster? Explain.',
      a: `Sam: ${aeWork(W3.p, 's')}, limits ${limits('13.4 s')}. 13.36 s is inside these limits, so Sam may have been faster: we cannot be sure.` },
  ],
};
