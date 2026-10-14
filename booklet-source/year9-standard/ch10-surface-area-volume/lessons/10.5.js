// Lesson 10.5 Areas of quadrilaterals (three pages: Easy with the Notes box, Easy drill, then Medium with earlier
// lessons mixed in and three worded problems). See lib/lesson-two.js.
// Textbook 10.05. Every shape is drawn to scale from the question's own lengths, and its answer is calculated from the
// same lengths, so the picture, the numbers and the answers always agree.
const { num, u, meas, pctErr, limits } = require('../helpers');
const S = require('../shapes');
const { C, f, T, svg, seg, poly, rightMark, fitter, FILL, SHADE } = S.parts;

const L = (v, unit) => `${num(v)} ${unit}`;
const SZ = 2.8, Q = { size: 3, weight: 700 };
const blueDash = { stroke: C.blue, w: 0.42, dash: true }, grey = { stroke: C.grey, w: 0.3 };

// A flat shape drawn to scale from its corners (x right, y up, in the question's units): size and maxH are its largest
// width and height in mm. Every label's box is worked out and placed just clear of the line it labels, and recorded, so
// 'A = ?' and a given value beside the shape can be placed clear of them.
//   sides: [[i, text, across]] a label outside side i (corner i to corner i + 1); across: level with its midpoint
//   right: corners with a right-angle mark
//   hts: [[x, foot, top, text, side]] a perpendicular height, drawn blue and dashed from (x, top) to (x, foot), with a
//        right-angle mark at its foot and its label beside it on side (1 right, −1 left), raised clear of the mark
//   diag: [[p, q]] blue dashed diagonals; cross: [x, y] where they cross (a right-angle mark there)
//   split: [[p, q]] grey dashed lines that cut the shape into parts      holes: [[corners]] white parts (shape shaded)
//   dims: [[p, q, text, dir, bold]] a measurement line with end ticks beside p → q, 2 mm out towards dir ('down',
//        'left', 'right', 'up'), labelled beyond it; bold marks the unknown ('h = ?')
//   ask: 'A' or 'P' → 'A = ?' beside the shape on the right, halfway up; given: a value written inside the shape ('A = 54 cm²')
const quad = (o) => {
  const { pts, size = 22, maxH = 15, sides = [], right = [], hts = [], diag = [], cross, split = [], holes = [], dims = [], ask, given } = o;
  const { map, w, h } = fitter(pts, size, 1, maxH);
  const P = pts.map(map), n = P.length, boxes = [];
  // a label with its box recorded (baseline y; the box is the digits' height, 0.72 × the size)
  const put = (x, y, s, q = {}) => { const sz = q.size || SZ, an = q.anchor || 'middle', wd = String(s).length * sz * 0.58;
    const x0 = an === 'start' ? x : an === 'end' ? x - wd : x - wd / 2; boxes.push([x0, y - sz * 0.72, x0 + wd, y]); return T(x, y, s, { size: sz, ...q }); };
  // a label beside the point p, out along the unit direction nn: its box g mm clear of the line through p
  const out = (p, nn, s, q = {}, g = 1.1) => { const sz = q.size || SZ, wd = String(s).length * sz * 0.58, hh = sz * 0.36;
    const d = g + (Math.abs(nn[0]) * wd) / 2 + Math.abs(nn[1]) * hh; return put(p[0] + nn[0] * d, p[1] + nn[1] * d + hh, s, q); };
  const signed = P.reduce((t, p, i) => { const q = P[(i + 1) % n]; return t + p[0] * q[1] - q[0] * p[1]; }, 0);
  const outN = (i) => { const a = P[i], c = P[(i + 1) % n], dx = c[0] - a[0], dy = c[1] - a[1], l = Math.hypot(dx, dy); return signed > 0 ? [dy / l, -dx / l] : [-dy / l, dx / l]; };
  const DIR = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] };
  let b = poly(P, holes.length ? SHADE : FILL);
  // a hole's sharp corners touch the outline: round joins, so no mitred spur pokes past it, then the outline again on top
  holes.forEach((hp) => { b += poly(hp.map(map), '#fff').replace('/>', ' stroke-linejoin="round"/>'); });
  if (holes.length) b += poly(P, 'none');
  split.forEach(([p, q]) => { b += seg(map(p), map(q), { stroke: C.grey, w: 0.32, dash: true }); });
  right.forEach((i) => { b += rightMark(P[i], P[(i + n - 1) % n], P[(i + 1) % n], 1.5); });
  diag.forEach(([p, q]) => { b += seg(map(p), map(q), blueDash); });
  if (cross) { const c = map(cross); b += rightMark(c, [c[0], c[1] - 1], [c[0] + 1, c[1]], 1.3); }
  sides.forEach(([i, s, across]) => { const a = P[i], c = P[(i + 1) % n], m = [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2], nn = outN(i);
    if (!across) { b += out(m, nn, s); return; }
    // across: level with the side's midpoint, out to the side, so the label adds no height (a slanted side whose label
    // would otherwise stand above the shape); far enough out that the label's box is 1.2 mm clear of the slanted side,
    // measured square to the side
    const dx = Math.abs(c[0] - a[0]), dy = Math.abs(c[1] - a[1]), sd = Math.sign(nn[0]), g = (1.2 * Math.hypot(dx, dy)) / dy + (dx / dy) * SZ * 0.36;
    b += put(m[0] + sd * g, m[1] + SZ * 0.36, s, { anchor: sd > 0 ? 'start' : 'end' }); });
  hts.forEach(([x, foot, top, s, sd = 1]) => {
    const a = map([x, top]), c = map([x, foot]), up = c[1] > a[1]; // up: the foot is at the bottom
    b += seg(a, c, blueDash) + rightMark(c, a, [c[0] + sd, c[1]], 1.5);
    // the label centred between the far edge and the right-angle mark (raised clear of the mark when the shape is flat)
    const hh = SZ * 0.72, e0 = up ? a[1] + 0.9 : c[1] + 2.2, e1 = up ? c[1] - 2.2 : a[1] - 0.9;
    b += put(c[0] + sd * 1, (e0 + e1) / 2 + hh / 2, s, { anchor: sd > 0 ? 'start' : 'end' });
  });
  dims.forEach(([p, q, s, dir, bold]) => {
    const nn = DIR[dir], a = map(p), c = map(q), A = [a[0] + nn[0] * 2, a[1] + nn[1] * 2], B = [c[0] + nn[0] * 2, c[1] + nn[1] * 2];
    const tick = (t) => seg([t[0] - nn[0] * 0.8, t[1] - nn[1] * 0.8], [t[0] + nn[0] * 0.8, t[1] + nn[1] * 0.8], grey);
    b += seg(A, B, grey) + tick(A) + tick(B) + out([(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], nn, s, bold ? Q : {}, 1.2);
  });
  const ys = P.map((p) => p[1]), ym = (Math.min(...ys) + Math.max(...ys)) / 2;
  if (ask) { // beside the shape, halfway up it, clear of every label at that height
    const y = ym + 1.1, x = Math.max(...P.map((p) => p[0]), ...boxes.filter((bx) => bx[3] > y - 3 && bx[1] < y + 0.6).map((bx) => bx[2])) + 1.6;
    b += put(x, y, `${ask} = ?`, { ...Q, anchor: 'start' });
  }
  if (given) { // inside the shape, centred across it halfway up (where the shape is cut by the line y = ym)
    const xs = P.flatMap((p, i) => { const q = P[(i + 1) % n]; return (p[1] - ym) * (q[1] - ym) <= 0 && p[1] !== q[1] ? [p[0] + ((ym - p[1]) * (q[0] - p[0])) / (q[1] - p[1])] : []; });
    b += put((Math.min(...xs) + Math.max(...xs)) / 2, ym + 1, given);
  }
  return svg(f(w), f(h), b);
};

// ---------------------------------------------------------------- the shapes: each returns [picture, answer]
// Parallelogram: base b, perpendicular height h, its top shifted s to the right (s < 0: to the left). The height is
// dashed from a top corner that sits over the base. o.slant labels the left-hand slanted side (a length not needed).
// o.askH: the height is the unknown: 'h = ?' on a measurement line up the left, the area (given) inside the shape.
const para = (b, h, s, unit, o = {}) => {
  const pts = [[0, 0], [b, 0], [b + s, h], [s, h]], x0 = Math.min(0, s), A = b * h;
  const fig = quad({ pts, size: o.size, maxH: o.maxH, sides: [[0, L(b, unit)], ...(o.slant ? [[3, L(o.slant, unit)]] : [])],
    ...(o.askH ? { dims: [[[x0, 0], [x0, h], 'h = ?', 'left', true]], given: `A = ${L(A, `${unit}²`)}` }
      : { hts: [[s >= 0 ? s : b + s, 0, h, L(h, unit), s >= 0 ? 1 : -1]], ask: o.noAsk ? '' : 'A' }) });
  return [fig, o.askH ? u(h, unit) : u(A, `${unit}²`)];
};
// Trapezium: parallel sides bot (along the bottom) and top, perpendicular height h, the top starting at x = s. s = 0: a
// right-angled trapezium, its height the left side. o.slant labels the left-hand slanted side; o.askH as for para.
const trap = (bot, top, h, s, unit, o = {}) => {
  const pts = [[0, 0], [bot, 0], [s + top, h], [s, h]], A = ((bot + top) / 2) * h;
  const base = { pts, size: o.size, maxH: o.maxH, sides: [[0, L(bot, unit)], [2, L(top, unit)], ...(o.slant ? [[3, L(o.slant, unit)]] : [])] };
  let fig;
  if (o.askH) fig = quad({ ...base, dims: [[[Math.min(0, s), 0], [Math.min(0, s), h], 'h = ?', 'left', true]], given: `A = ${L(A, `${unit}²`)}` });
  else if (s === 0) fig = quad({ ...base, sides: [...base.sides, [3, L(h, unit)]], right: [0, 3], ask: o.noAsk ? '' : 'A' });
  else fig = quad({ ...base, hts: [[s, 0, h, L(h, unit), 1]], ask: o.noAsk ? '' : 'A' });
  return [fig, o.askH ? u(h, unit) : u(A, `${unit}²`)];
};
// Rhombus or kite from its diagonals: x across, y up; the across diagonal crosses the up one at height c (a rhombus:
// c = y ÷ 2). The diagonals are dashed blue; their lengths are on measurement lines outside the shape (x below it, y up
// its left), so the labels never crowd a small kite. o.side: [i, text] a side's length (not needed).
const kite = (x, y, c, unit, o = {}) => {
  const pts = [[0, 0], [x / 2, c], [0, y], [-x / 2, c]];
  const fig = quad({ pts, size: o.size, maxH: o.maxH, diag: [[[-x / 2, c], [x / 2, c]], [[0, 0], [0, y]]], cross: [0, c], sides: o.side ? [o.side] : [],
    dims: [[[-x / 2, 0], [x / 2, 0], L(x, unit), 'down'], [[-x / 2, 0], [-x / 2, y], L(y, unit), 'left']], ask: o.noAsk ? '' : 'A' });
  return [fig, u((x * y) / 2, `${unit}²`)];
};
const rhombus = (x, y, unit, o) => kite(x, y, y / 2, unit, o);

// Formula questions (Formula / Substitute / Answer lines) from [picture, answer, text?, own formula?], with the round's
// formula printed (a string) or left for students to write (true). (As in 10.6.)
const formFig = (list, form) => ({ items: list.map(([fig, , t = '', own]) => ({ t, fig, form: own || form })), ans: list.map((x) => x[1]) });

// Example 1: one of each shape
const EX1 = { para: [9, 5, 2], trap: [14, 8, 6, 3], rh: [10, 6], kite: [7, 12, 8.5] };
// Example 2: a parallelogram and a trapezium each with a slanted side that is not needed (each slant's offset is
// √(slant² − h²), so the picture is true), a height from the area, and a rectangle with a trapezium on top
const EX2 = { para: { b: 10, h: 6, sl: 7 }, trap: { bot: 7.5, top: 4.5, h: 3.2, sl: 4 }, ht: { A: 91, b: 13, s: 1 },
  comp: { l: 10, w: 3, top: 6, h: 4 } };
const off = (sl, h) => Math.sqrt(sl * sl - h * h);
const compFig = ({ l, w, top, h }, unit, o = {}) => quad({ pts: [[0, 0], [l, 0], [l, w], [(l + top) / 2, w + h], [(l - top) / 2, w + h], [0, w]],
  sides: [[0, L(l, unit)], [1, L(w, unit)], [3, L(top, unit)]], right: [0, 1], split: [[[0, w], [l, w]]],
  hts: [[(l - top) / 2, w, w + h, L(h, unit), 1]], ...o });

// The Notes diagram: a parallelogram and a trapezium side by side, a kite below them, with b, h, a, x and y marked
const notesFig = () => {
  const k = { size: 2.8, weight: 700 }, kb = { ...k, fill: C.blue }, ink = { stroke: C.charcoal, w: 0.45 };
  let b = '';
  // parallelogram: base b along the bottom, the height h dashed from its top-left corner
  const pa = [[1, 12], [13.5, 12], [16.5, 3.5], [4, 3.5]];
  b += poly(pa, FILL) + seg([4, 3.5], [4, 12], blueDash) + rightMark([4, 12], [4, 3.5], [5, 12], 1.3) + seg(pa[0], pa[1], ink);
  b += T(7.25, 15.4, 'b', k) + T(5.1, 8.9, 'h', { ...kb, anchor: 'start' });
  // trapezium: parallel sides a (top) and b (bottom), the height h dashed
  const tr = [[19.5, 12], [35, 12], [31, 3.5], [23, 3.5]];
  b += poly(tr, FILL) + seg([23, 3.5], [23, 12], blueDash) + rightMark([23, 12], [23, 3.5], [24, 12], 1.3);
  b += T(27, 2.2, 'a', k) + T(27.25, 15.4, 'b', k) + T(24.1, 8.9, 'h', { ...kb, anchor: 'start' });
  // kite: the diagonals x (across) and y (up), dashed, crossing at right angles
  const ki = [[18, 33.5], [26, 21.5], [18, 17.5], [10, 21.5]];
  b += poly(ki, FILL) + seg([10, 21.5], [26, 21.5], blueDash) + seg([18, 17.5], [18, 33.5], blueDash) + rightMark([18, 21.5], [18, 20.2], [19.3, 21.5], 1.2);
  b += T(21.5, 24.6, 'x', kb) + T(17.1, 27.2, 'y', { ...kb, anchor: 'end' });
  return svg(36, 34, b);
};

module.exports = {
  code: '10.5', title: 'Areas of quadrilaterals',
  li: 'find the area of a parallelogram, a trapezium, a rhombus and a kite.',
  sc: ['use A = bh for a parallelogram', 'use A = ½(a + b)h for a trapezium', 'use A = ½xy for a rhombus or a kite'],
  notes: {
    terms: [['parallelogram', 'two pairs of parallel sides'], ['trapezium', 'one pair of parallel sides, a and b'], ['rhombus', 'a parallelogram with 4 equal sides'],
      ['kite', 'two pairs of equal sides, next to each other'], ['base (b)', 'the side the height is measured from'], ['height (h)', 'perpendicular (at right angles) to b'],
      ['diagonals (x, y)', 'join opposite corners']],
    formulas: ['Parallelogram: A = bh', 'Trapezium: A = ½(a + b)h', 'Rhombus or kite: A = ½xy', 'Missing length: substitute, then solve'],
    steps: ['name the shape', 'write the formula', 'substitute', 'work out + unit (cm²)'],
    fig: notesFig(),
  },
  easy: {
    ex: { stem: 'Find the area of each shape. Write the formula first.', parts: [
      { t: 'Parallelogram', fig: para(...EX1.para, 'cm', { size: 31, maxH: 13.5, noAsk: true })[0] }, { t: 'Trapezium', fig: trap(...EX1.trap, 'cm', { size: 26, maxH: 11, noAsk: true })[0] },
      { t: 'Rhombus', fig: rhombus(...EX1.rh, 'm', { size: 20, maxH: 12, noAsk: true })[0] }, { t: 'Kite', fig: kite(...EX1.kite, 'cm', { maxH: 12, noAsk: true })[0] }] },
    exAns: [`A = bh = ${num(EX1.para[0])} × ${num(EX1.para[1])} = ${para(...EX1.para, 'cm')[1]}`,
      `A = ½(a + b)h = ½ × (${num(EX1.trap[1])} + ${num(EX1.trap[0])}) × ${num(EX1.trap[2])} = ${trap(...EX1.trap, 'cm')[1]}`,
      `A = ½xy = ½ × ${num(EX1.rh[0])} × ${num(EX1.rh[1])} = ${rhombus(...EX1.rh, 'm')[1]}`,
      `A = ½xy = ½ × ${num(EX1.kite[0])} × ${num(EX1.kite[1])} = ${kite(...EX1.kite, 'cm')[1]}`],
    hint: 'h is the perpendicular height (the dashed line), at right angles to the base · a and b are the parallel sides.',
    work: true,
    // Small steps: parallelograms (A = bh printed), then trapeziums (formula printed). Each question is its diagram:
    // the given lengths on it, the height dashed in blue, the unknown marked A = ?. The round heading says what to find.
    rounds: [
      { text: 'find the area of each parallelogram.', cols: 4, ...formFig([
        para(8, 5, 2, 'cm', { size: 17, maxH: 12 }), para(10, 6, 3, 'm', { size: 17, maxH: 12 }),
        para(7, 6, -2, 'cm', { size: 17, maxH: 12 }), para(5, 3.5, 1.5, 'm', { size: 17, maxH: 12 })], 'A = bh') },
      { text: 'find the area of each trapezium.', cols: 4, ...formFig([
        trap(10, 6, 4, 2, 'cm', { size: 17, maxH: 10 }), trap(9, 5, 6, 1.5, 'm', { size: 17, maxH: 10 }),
        trap(8, 4, 5, 2, 'm', { size: 16, maxH: 10 }), trap(12, 8, 5, 2, 'cm', { size: 17, maxH: 10 })], 'A = ½(a + b)h') },
    ],
  },
  // Page 2: choose between the two formulas, then rhombuses and kites (A = ½xy printed), then any of the four shapes
  drill: {
    hint: 'Parallelogram A = bh · Trapezium A = ½(a + b)h · Rhombus or kite A = ½xy (x and y are the diagonals)',
    rounds: [
      { text: 'parallelogram or trapezium? Write the formula, then find the area.', ...formFig([
        para(11, 6, 2, 'cm', { size: 31.5, maxH: 20 }), trap(10, 4, 5, 3, 'm', { size: 26, maxH: 15 }), para(8, 4.5, -2, 'm', { size: 31.5, maxH: 20 })], true) },
      { text: 'find the area of each rhombus.', ...formFig([
        rhombus(8, 6, 'cm', { size: 23, maxH: 18 }), rhombus(12, 9, 'm', { size: 26, maxH: 18 }), rhombus(5, 10, 'cm', { size: 24, maxH: 18 })], 'A = ½xy') },
      { text: 'find the area of each kite.', ...formFig([
        kite(6, 10, 6.5, 'cm', { maxH: 18 }), kite(8, 11, 7.5, 'm', { maxH: 18 }), kite(4.5, 8, 5.5, 'm', { maxH: 18 })], 'A = ½xy') },
      { text: 'which shape is it? Write the formula, then find the area.', ...formFig([
        kite(9, 14, 10, 'cm', { maxH: 18 }), trap(8, 5, 6, 0, 'm', { size: 22, maxH: 16 }), para(6.5, 4, 1.5, 'cm', { size: 31.5, maxH: 20 })], true) },
    ],
  },
  medium: {
    ex: { stem: 'Choose the right formula. Some lengths are not needed.', parts: [
      { t: 'Area', fig: para(EX2.para.b, EX2.para.h, off(EX2.para.sl, EX2.para.h), 'cm', { slant: EX2.para.sl, size: 24, maxH: 11, noAsk: true })[0] },
      { t: 'Area', fig: trap(EX2.trap.bot, EX2.trap.top, EX2.trap.h, off(EX2.trap.sl, EX2.trap.h), 'm', { slant: EX2.trap.sl, size: 24, maxH: 8, noAsk: true })[0] },
      { t: 'Height', fig: para(EX2.ht.b, EX2.ht.A / EX2.ht.b, EX2.ht.s, 'cm', { askH: true, size: 20, maxH: 10 })[0] },
      { t: 'Area', fig: compFig(EX2.comp, 'm', { size: 22, maxH: 8.8 }) }] },
    exAns: [`the ${num(EX2.para.sl)} cm side is not needed: A = bh = ${num(EX2.para.b)} × ${num(EX2.para.h)} = ${u(EX2.para.b * EX2.para.h, 'cm²')}`,
      `the ${num(EX2.trap.sl)} m side is not needed: A = ½(a + b)h = ½ × (${num(EX2.trap.top)} + ${num(EX2.trap.bot)}) × ${num(EX2.trap.h)} = ${u(((EX2.trap.top + EX2.trap.bot) / 2) * EX2.trap.h, 'm²')}`,
      `A = bh, so ${num(EX2.ht.A)} = ${num(EX2.ht.b)} × h, h = ${num(EX2.ht.A)} ÷ ${num(EX2.ht.b)} = ${u(EX2.ht.A / EX2.ht.b, 'cm')}`,
      (() => { const { l, w, top, h } = EX2.comp, r = l * w, t = ((l + top) / 2) * h;
        return `A = l × w + ½(a + b)h = ${num(l)} × ${num(w)} + ½ × (${num(top)} + ${num(l)}) × ${num(h)} = ${num(r)} + ${num(t)} = ${u(r + t, 'm²')}`; })()],
    hint: 'The slanted side is not the height · Missing h: substitute, then solve · Composite: add the parts',
    work: true, set: true,
    // One set: today's skill, building from shapes with a length that is not needed to missing heights and composite
    // shapes, with a question from an earlier lesson (tagged) in each row. Every question that can be drawn is its
    // diagram, with a word saying what to find; a question that needs a formula has Formula / Substitute / Answer lines.
    rounds: [(() => {
      const ff = ([fig, a], t = 'Area', from) => [{ t, fig, form: true, ...(from ? { from } : {}) }, a];
      // (As in 10.6, the word above each Medium diagram says what to find: only a missing length is marked with a ?.)
      const no = { noAsk: true };
      const house = { l: 8, w: 5, h: 3 }, sh = { l: 12, w: 6 };
      const Q = [
        ff(para(9, 4, 3, 'm', { slant: 5, size: 24, maxH: 8, ...no })),
        ff([quad({ pts: [[0, 0], [house.l, 0], [house.l, house.w], [house.l / 2, house.w + house.h], [0, house.w]], sides: [[0, L(house.l, 'm')], [1, L(house.w, 'm')]], right: [0, 1],
          split: [[[0, house.w], [house.l, house.w]]], dims: [[[0, house.w], [0, house.w + house.h], L(house.h, 'm'), 'left']], size: 11, maxH: 9 }),
        u(house.l * house.w + (house.l * house.h) / 2, 'm²')], 'Area', '10.4'),
        ff(trap(13, 7, 4, 3, 'cm', { slant: 5, size: 22, maxH: 6.5, ...no })),
        ff(rhombus(16, 12, 'cm', { side: [1, '10 cm', true], size: 11, maxH: 6.8, ...no })),
        [{ t: 'Find the percentage error of 25 kg, measured to the nearest kg.', form: true, from: '10.3' }, `${num(pctErr(meas('25 kg').e, 25))}%`],
        ff(para(12, 6, 2, 'cm', { askH: true, size: 20, maxH: 9.5 }), 'Height'),
        ff(trap(14, 10, 4, 2, 'cm', { askH: true, size: 20, maxH: 6.5 }), 'Height'),
        [{ t: 'Write the limits of accuracy of 8.5 m.', from: '10.2' }, limits('8.5 m')],
        ff([quad({ pts: [[0, 0], [sh.l, 0], [sh.l, sh.w], [0, sh.w]], holes: [[[sh.l / 2, 0], [sh.l, sh.w / 2], [sh.l / 2, sh.w], [0, sh.w / 2]]], sides: [[0, L(sh.l, 'cm')], [1, L(sh.w, 'cm')]],
          size: 15, maxH: 8 }), u(sh.l * sh.w - (sh.l * sh.w) / 2, 'cm²')], 'Shaded area'),
      ];
      return { text: '', items: Q.map((x) => x[0]), ans: Q.map((x) => x[1]) };
    })()],
  },
  worded: [
    { q: 'A courtyard is a parallelogram with base 8.5 m and perpendicular height 6 m. Pavers cost $42 per m². Find the cost to pave it.',
      a: `A = 8.5 × 6 = ${u(8.5 * 6, 'm²')}; ${num(8.5 * 6)} × $42 = $${num(8.5 * 6 * 42)}` },
    { q: 'A kite is made from two rods, 80 cm and 50 cm long, that cross at right angles. Find the area of material needed to cover it.',
      a: `A = ½xy = ½ × 80 × 50 = ${u((80 * 50) / 2, 'cm²')}` },
    { q: 'A block of land is a trapezium with parallel sides of 30 m and 45 m. Its area is 750 m². Find the distance between the parallel sides.',
      a: `750 = ½ × (30 + 45) × h = ${num((30 + 45) / 2)} × h, so h = 750 ÷ ${num((30 + 45) / 2)} = ${u(750 / ((30 + 45) / 2), 'm')}` },
  ],
};
