// Lesson 10.4 Perimeter and area of composite shapes (three pages: Easy with the Notes box, Easy drill, then Medium with
// earlier lessons mixed in and three worded problems). See lib/lesson-two.js.
// Textbook 10.04. Each shape is drawn from its corners, and its labels, perimeter and area are calculated from the same
// corners, so the picture, the numbers and the answers always agree.
const { num, u, conv, limits, meas, pctErr } = require('../helpers');
const S = require('../shapes');
const { C, f, T, svg, seg, poly, rightMark, fitter, FILL, SHADE } = S.parts;

// Perimeter, area (shoelace) and side lengths of a polygon from its corners
const perim = (pts) => pts.reduce((t, p, i) => { const q = pts[(i + 1) % pts.length]; return t + Math.hypot(q[0] - p[0], q[1] - p[1]); }, 0);
const areaOf = (pts) => Math.abs(pts.reduce((t, p, i) => { const q = pts[(i + 1) % pts.length]; return t + p[0] * q[1] - q[0] * p[1]; }, 0)) / 2;
const side = (pts, i) => { const p = pts[i], q = pts[(i + 1) % pts.length]; return Math.hypot(q[0] - p[0], q[1] - p[1]); };
const dist = (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1]);
const n2 = (v) => num(+v.toFixed(4));
// The shaded area of a shape: the whole shape less its holes
const areaIn = (o) => areaOf(o.pts) - (o.holes || []).reduce((t, h) => t + areaOf(h), 0);

// A label's box [x0, y0, x1, y1] in mm (as shapes.js measures it), and whether it keeps g mm clear of the segment a → b
const boxOf = (x, y, s, q = {}) => { const sz = q.size || 2.8, an = q.anchor || 'middle', wd = String(s).length * sz * 0.58, x0 = an === 'start' ? x : an === 'end' ? x - wd : x - wd / 2;
  return [x0, y - sz * 0.8, x0 + wd, y + sz * 0.25]; };
const clearOf = (bx, a, b, g) => Array.from({ length: 41 }, (_, i) => i / 40).every((t) => { const x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t;
  return Math.hypot(Math.max(bx[0] - x, 0, x - bx[2]), Math.max(bx[1] - y, 0, y - bx[3])) >= g; });

// A composite shape from its corners (x right, y up, in the question's units), drawn to scale: size and maxH are its
// largest width and height in mm. Every length printed on it is measured from the corners. Labels are 2.8 mm text.
//   show: the sides labelled with their lengths, outside the shape (side i joins corner i to corner i + 1)
//   along: { i: t } a shown side's label moved along its edge (t from 0 to 1; 0.5, the middle, when not given)
//   right: corners with a right-angle mark          split: [[p, q]] dashed lines (a split, or a cut-off corner)
//   hts: [[p, q, side]] a dashed height from p down to q (a right-angle mark at q), labelled beside it, low enough
//        that the label is clear of the shape's sloping sides (side ±1: the side to try first)
//   dims: [[p, q, side, off, text]] a measurement line with end ticks beside p → q (side 1: to its left going p → q),
//        labelled with its length (or text)
//   holes: [[corners]] white parts cut out (the shape is then shaded); holeShow: [[sides]] labelled inside each hole
//   ask: a side, its unknown length on a measurement line labelled ? (as 10.6 marks an unknown length); or 'P' / 'A'
//        written beside the shape ('A = ?'), halfway up it (askY: how far up, 0–1), clear of every label
const comp = (o) => {
  const { pts, unit = 'm', show = [], along = {}, right = [], split = [], hts = [], dims = [], holes = [], holeShow = [], ask, askY = 0.5, size = 22, maxH = 15, m = 1.5 } = o;
  const { map, w, h } = fitter(pts, size, m, maxH);
  const Q = pts.map(map), n = Q.length, boxes = [], L = (v) => `${n2(v)} ${unit}`;
  const edges = Q.map((p, i) => [p, Q[(i + 1) % n]]);
  // a label, its box recorded so 'A = ?' can be placed clear of every label
  const put = (x, y, s, q = {}) => { boxes.push(boxOf(x, y, s, q)); return T(x, y, s, q); };
  // where a label beside the edge a → b goes (t of the way along it), on the side the unit normal nn points to, g mm clear
  const at = (a, b, nn, g = 1.6, t = 0.5) => { const mx = a[0] + (b[0] - a[0]) * t, my = a[1] + (b[1] - a[1]) * t;
    if (Math.abs(nn[0]) > 0.75) return [mx + nn[0] * g, my + 1.1, nn[0] > 0 ? 'start' : 'end'];
    return [mx + nn[0] * g * 1.5, nn[1] > 0 ? my + g + 2.1 : my - g + 0.3, 'middle']; };
  const edge = (a, b, s, nn, q = {}, g = 1.6, t = 0.5) => { const [x, y, anchor] = at(a, b, nn, g, t); return put(x, y, s, { ...q, anchor }); };
  const signed = (P) => P.reduce((t, p, i) => { const q = P[(i + 1) % P.length]; return t + p[0] * q[1] - q[0] * p[1]; }, 0);
  const outN = (P, i) => { const a = P[i], b = P[(i + 1) % P.length], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); return signed(P) > 0 ? [dy / l, -dx / l] : [-dy / l, dx / l]; };
  const normal = (a, c, sd) => { const dx = c[0] - a[0], dy = c[1] - a[1], l = Math.hypot(dx, dy); return [(dy / l) * sd, (-dx / l) * sd]; };
  const grey = { stroke: C.grey, w: 0.3 };
  // a measurement line beside a → c, off mm out along nn, with end ticks and its label. The label starts 1.2 mm out
  // and moves further out until its digits are 1 mm clear of both tick ends (on a short line the ticks reach the
  // label's height). The digits' own box is used here (cap height 0.73 of the size, nothing below the baseline).
  const dimLine = (a, c, nn, off, s, q = {}) => {
    const A2 = [a[0] + nn[0] * off, a[1] + nn[1] * off], C2 = [c[0] + nn[0] * off, c[1] + nn[1] * off], sz = q.size || 2.8;
    const tk = (P) => [[P[0] - nn[0] * 0.8, P[1] - nn[1] * 0.8], [P[0] + nn[0] * 0.8, P[1] + nn[1] * 0.8]], ticks = [tk(A2), tk(C2)];
    const clear = (g) => { const [x, y, anchor] = at(A2, C2, nn, g), bx = boxOf(x, y, s, { ...q, anchor });
      return ticks.every(([u, v]) => clearOf([bx[0], y - sz * 0.73, bx[2], y + 0.05], u, v, 1.1)); };
    let g = 1.2; while (g < 3 && !clear(g)) g += 0.1;
    const xs = ticks.flat().map((p) => p[0]), ys = ticks.flat().map((p) => p[1]);
    boxes.push([Math.min(...xs), Math.min(...ys) - 0.7, Math.max(...xs), Math.max(...ys) + 0.3]); // the line, for 'A = ?'
    return seg(A2, C2, grey) + ticks.map(([u, v]) => seg(u, v, grey)).join('') + edge(A2, C2, s, nn, q, g);
  };
  let b = poly(Q, holes.length ? SHADE : FILL);
  holes.forEach((hp) => { b += poly(hp.map(map), '#fff'); });
  split.forEach(([p, q]) => { b += seg(map(p), map(q), { stroke: C.grey, w: 0.32, dash: true }); });
  right.forEach((i) => { b += rightMark(Q[i], Q[(i + n - 1) % n], Q[(i + 1) % n]); });
  show.forEach((i) => { b += edge(Q[i], Q[(i + 1) % n], L(side(pts, i)), outN(Q, i), {}, 1.6, along[i] ?? 0.5); });
  if (typeof ask === 'number') b += dimLine(Q[ask], Q[(ask + 1) % n], outN(Q, ask), 2, '?', { size: 3, weight: 700 });
  // a hole's labels go inside it: its width under its top edge, its height beside its right edge (on opposite sides
  // of the hole, not stacked), level with the middle of the hole, or lower when that would crowd the width label
  holes.forEach((hp, j) => {
    const H = hp.map(map), list = holeShow[j] || [], inN = (i) => outN(H, i).map((v) => -v), ys = H.map((p) => p[1]);
    const top = Math.min(...ys), bot = Math.max(...ys); let lo = top, hi = bot;
    list.filter((i) => Math.abs(inN(i)[0]) <= 0.75).forEach((i) => { const [x, y, anchor] = at(H[i], H[(i + 1) % H.length], inN(i)), s = L(side(hp, i)), bx = boxOf(x, y, s, { anchor });
      if (inN(i)[1] > 0) lo = Math.max(lo, bx[3] + 0.6); else hi = Math.min(hi, bx[1] - 0.6);
      b += put(x, y, s, { anchor }); });
    list.filter((i) => Math.abs(inN(i)[0]) > 0.75).forEach((i) => { const [x, , anchor] = at(H[i], H[(i + 1) % H.length], inN(i));
      b += put(x, Math.min(Math.max((top + bot) / 2 + 0.77, lo + 2.24), hi - 1), L(side(hp, i)), { anchor }); });
  });
  hts.forEach(([p, q, sd = 1]) => { const a = map(p), c = map(q);
    b += seg(a, c, { stroke: C.grey, w: 0.32, dash: true }) + rightMark(c, a, [c[0] - normal(a, c, sd)[0], c[1] - normal(a, c, sd)[1]], 1.5);
    // the first spot down the height (from halfway) where the label is clear of every side and the right-angle mark
    const s = L(dist(p, q)), spots = [];
    [sd, -sd].forEach((k) => { for (let t = 0.5; t <= 0.86; t += 0.04) spots.push([k, t]); });
    const fits = ([k, t]) => { const nn = normal(a, c, k), y = a[1] + (c[1] - a[1]) * t, x = a[0] + nn[0] * 1.2, bx = boxOf(x, y + 1.1, s, { anchor: nn[0] > 0 ? 'start' : 'end' });
      return edges.every(([e0, e1]) => clearOf(bx, e0, e1, 0.7)) && bx[3] < c[1] - 2 ? [x, y + 1.1, nn[0] > 0 ? 'start' : 'end'] : null; };
    const spot = spots.map(fits).find(Boolean) || fits([sd, 0.5]) || [a[0] + normal(a, c, sd)[0] * 1.2, (a[1] + c[1]) / 2 + 1.1, normal(a, c, sd)[0] > 0 ? 'start' : 'end'];
    b += put(spot[0], spot[1], s, { anchor: spot[2] }); });
  dims.forEach(([p, q, sd = 1, off = 2, text]) => { const a = map(p), c = map(q); b += dimLine(a, c, normal(a, c, sd), off, text || L(dist(p, q))); });
  if (ask === 'P' || ask === 'A') { // beside the shape, about 1.5 mm or more clear of every label and measurement line
    const ys = Q.map((p) => p[1]), y = Math.max(...ys) - (Math.max(...ys) - Math.min(...ys)) * askY + 1.1;
    const x = Math.max(...Q.map((p) => p[0]), ...boxes.filter((bx) => bx[3] > y - 3 && bx[1] < y + 1.3).map((bx) => bx[2])) + 1.6;
    b += put(x, y, `${ask} = ?`, { size: 3, weight: 700, anchor: 'start' });
  }
  return svg(f(w), f(h), b);
};

// ---------------------------------------------------------------- the shapes, each { pts, unit, … } (see comp)
// Page 1: an L-shape with one missing side (ask: the side marked ?), and with two missing sides (P = ?). In the P = ?
// shapes the missing sides are the short right edge and the notch's floor or ceiling, so nothing is labelled on the
// right and 'P = ?' sits alone halfway up; the notch is wide, so its wall's label is well clear of the '?'.
const P1 = { size: 22, maxH: 9.6 };
const missL = (pts, unit, show, ask, o = {}) => [comp({ pts, unit, show, ask, right: [0], ...P1, ...o }), u(side(pts, ask), unit)];
const perL = (pts, unit, show, o = {}) => [comp({ pts, unit, show, ask: 'P', right: [0], ...P1, ...o }), u(perim(pts), unit)];
// Area questions: the answer is the shaded area (the whole shape less any holes)
const areaQ = (o, sz = {}) => [comp({ ask: 'A', ...o, ...sz }), u(areaIn(o), `${o.unit}²`)];
// A rectangle l by w: its length under it and its width up its left side, so A = ? has the right side to itself
const rectS = (l, w, unit) => ({ pts: [[0, 0], [l, 0], [l, w], [0, w]], unit, show: [0, 3], right: [0, 1] });
// A triangle, base b along the bottom with its top above x = a: the height dashed (or its left side when a = 0)
const triS = (b, h, a, unit) => (a === 0 ? { pts: [[0, 0], [b, 0], [0, h]], unit, show: [0, 2], right: [0] }
  : { pts: [[0, 0], [b, 0], [a, h]], unit, show: [0], hts: [[[a, h], [a, 0], a > b / 2 ? -1 : 1]] });
// A rectangle with a rectangular hole (x, y its bottom-left corner): the hole's width labelled inside it under its top
// edge, its height inside it beside its right edge. The holes are big (the shaded part a thin frame), so the two
// labels sit well apart.
const holeS = (l, w, hl, hw, x, y, unit) => ({ pts: [[0, 0], [l, 0], [l, w], [0, w]], unit, show: [0, 3],
  holes: [[[x, y], [x + hl, y], [x + hl, y + hw], [x, y + hw]]], holeShow: [[2, 1]] });

// Example 1
const EX1 = {
  per: { pts: [[0, 0], [10, 0], [10, 3], [4, 3], [4, 7], [0, 7]], unit: 'm', show: [0, 1, 4, 5], right: [0] },
  tri: triS(8, 4, 2, 'cm'),
  ell: { pts: [[0, 0], [8, 0], [8, 3], [3, 3], [3, 7], [0, 7]], unit: 'cm', show: [0, 1, 4, 5], right: [0], split: [[[0, 3], [3, 3]]] },
  hole: holeS(13, 7, 11, 5, 1, 1, 'm'),
};
// Example 2: a staircase (its steps add to the whole width and height), a house (rectangle + triangle, the roof's height
// on a measurement line), a ramp (rectangle + triangle) and a rectangle with a corner cut off (the cut-off corner dashed,
// and the solid parts of the two cut edges on measurement lines, so each length is read as that part only)
const EX2 = {
  stairs: { pts: [[0, 0], [12, 0], [12, 3], [8, 3], [8, 6], [4, 6], [4, 9], [0, 9]], unit: 'm', show: [0, 7], right: [0] },
  house: { pts: [[0, 0], [8, 0], [8, 5], [4, 8], [0, 5]], unit: 'cm', show: [0, 4], right: [0, 1], split: [[[0, 5], [8, 5]]], dims: [[[8, 5], [8, 8], -1]] },
  ramp: { pts: [[0, 0], [14, 0], [8, 5], [0, 5]], unit: 'm', show: [0, 2, 3], right: [0, 3], split: [[[8, 5], [8, 0]]] },
  corner: { pts: [[0, 0], [12, 0], [12, 4], [8, 7], [0, 7]], unit: 'm', show: [0, 4], right: [0, 1, 4], split: [[[8, 7], [12, 7]], [[12, 7], [12, 4]]],
    dims: [[[0, 7], [8, 7], 1, 1.6], [[12, 0], [12, 4], -1]] },
};
const tw = (pts, i) => n2(side(pts, i));
// A door h m tall and 0.82 m wide (drawn in tenths of a metre, to scale), its height on a measurement line beside it
const door = (h) => { const W = 8.2, H = h * 10, k = 11 / H, m = 1.5, x1 = m + W * k, y1 = m + H * k, g = { stroke: C.grey, w: 0.3 }, dx = x1 + 2;
  let b = poly([[m, m], [x1, m], [x1, y1], [m, y1]], FILL) + `<circle cx="${f(x1 - 1.3)}" cy="${f(m + H * k * 0.52)}" r="0.55" fill="${C.charcoal}"/>`;
  b += seg([dx, m], [dx, y1], g) + seg([dx - 0.8, m], [dx + 0.8, m], g) + seg([dx - 0.8, y1], [dx + 0.8, y1], g) + T(dx + 1.2, (m + y1) / 2 + 1, `${num(h)} m`, { anchor: 'start' });
  return svg(f(x1 + m), f(y1 + m), b); };

// The Notes diagram: a composite shape split by a dashed line into a rectangle and a triangle, with the area of each
const notesFig = () => {
  const P = { bl: [3, 22], br: [33, 22], top: [19, 6], tl: [3, 6], foot: [19, 22] }, B = { size: 2.8, weight: 600 };
  let b = poly([P.bl, P.br, P.top, P.tl], FILL) + seg(P.top, P.foot, { stroke: C.grey, w: 0.35, dash: true });
  b += rightMark(P.bl, P.tl, P.br, 1.6) + rightMark(P.foot, P.top, P.br, 1.6);
  b += T(11, 12.6, 'rectangle', { size: 2.5 }) + T(11, 16.8, 'l × w', B);
  b += T(11, 25.6, 'l', B) + T(1.6, 15, 'w', { ...B, anchor: 'end' }) + T(26, 25.6, 'b', B) + T(20.4, 15.4, 'h', { ...B, anchor: 'start' });
  b += T(25, 8.8, 'triangle', { size: 2.5, anchor: 'start' });
  b += T(18, 31.2, 'A = l × w + ½ × b × h', { size: 2.6, weight: 600, fill: C.blue });
  return svg(36, 32, b);
};

module.exports = {
  code: '10.4', title: 'Perimeter and area of composite shapes',
  li: 'find the perimeter and area of composite shapes.',
  sc: ['find missing side lengths, then the perimeter', 'find an area by splitting a shape into parts', 'find a shaded area by subtracting'],
  notes: {
    terms: [['composite shape', 'simple shapes joined together'], ['perimeter (P)', 'the distance around the outside'], ['area (A)', 'the space inside (cm², m²)'],
      ['missing side', 'use the opposite sides: whole − part'], ['split', 'cut the shape into parts with a dashed line'], ['height (h)', 'at right angles to the base (b)'],
      ['shaded area', 'the whole shape − the white hole']],
    formulas: ['Rectangle: A = l × w', 'Triangle: A = ½ × b × h', 'Split: A = part 1 + part 2', 'Shaded: A = whole − hole', 'Perimeter: add every outside side'],
    steps: ['find missing sides', 'split, or subtract', 'area of each part', 'add or subtract + unit'],
    fig: notesFig(),
  },
  easy: {
    ex: { stem: 'Find the perimeter or area. Find any missing sides first.', parts: [
      { t: 'Perimeter', fig: comp({ ...EX1.per, size: 17, maxH: 10.2 }) }, { t: 'Area', fig: comp({ ...EX1.tri, size: 24, maxH: 12.6 }) },
      { t: 'Area', fig: comp({ ...EX1.ell, size: 17, maxH: 10.2 }) }, { t: 'Shaded area', fig: comp({ ...EX1.hole, size: 27, maxH: 14.4 }) }] },
    exAns: [
      `missing sides 10 − 4 = ${n2(10 - 4)} m and 7 − 3 = ${n2(7 - 3)} m; P = ${EX1.per.pts.map((p, i) => tw(EX1.per.pts, i)).join(' + ')} = ${u(perim(EX1.per.pts), 'm')}`,
      `A = ½ × 8 × 4 = ${u(areaOf(EX1.tri.pts), 'cm²')}`,
      `top part 7 − 3 = ${n2(7 - 3)} cm high; A = 8 × 3 + 3 × 4 = ${n2(8 * 3)} + ${n2(3 * 4)} = ${u(areaOf(EX1.ell.pts), 'cm²')}`,
      `A = 13 × 7 − 11 × 5 = ${n2(13 * 7)} − ${n2(11 * 5)} = ${u(areaIn(EX1.hole), 'm²')}`],
    hint: 'Missing side = whole side − the other part · Perimeter: add every side, the missing ones too.',
    work: true,
    // Small steps: one missing side of an L-shape (marked ?), then the perimeter of an L-shape with two missing sides.
    // Three to a row: an L-shape with its labels is a wide picture.
    rounds: [
      { text: 'find the missing side.', cols: 3, ...formFig([
        missL([[0, 0], [10, 0], [10, 2], [4, 2], [4, 5], [0, 5]], 'cm', [0, 4], 2),
        missL([[0, 0], [9, 0], [9, 6], [6, 6], [6, 2], [0, 2]], 'm', [1, 5], 3),
        missL([[0, 0], [3, 0], [3, 3], [11, 3], [11, 6], [0, 6]], 'm', [0, 4], 2)], '? = whole − part') },
      { text: 'find the perimeter. Find the two missing sides first.', cols: 3, ...formFig([
        perL([[0, 0], [9, 0], [9, 2], [3, 2], [3, 6], [0, 6]], 'm', [0, 3, 4, 5]),
        perL([[0, 0], [2, 0], [2, 5], [10, 5], [10, 7], [0, 7]], 'cm', [0, 1, 4, 5]),
        perL([[0, 0], [11, 0], [11, 3], [3, 3], [3, 7], [0, 7]], 'm', [0, 3, 4, 5])], 'P = add all sides') },
    ],
  },
  // Page 2: rectangles and triangles (formula given), then choose the formula, then shapes split into two parts (two
  // L-shapes, then a house: a rectangle and a triangle, ready for page 3), then shaded areas
  drill: {
    hint: 'Rectangle A = l × w · Triangle A = ½ × b × h · Split: add the parts · Shaded: whole − hole',
    rounds: [
      { text: 'find the area of each rectangle or triangle.', ...formFig([
        [...areaQ(rectS(9, 5, 'cm'), { size: 22, maxH: 16 }), '', 'A = l × w'],
        [...areaQ(triS(10, 6, 3, 'm'), { size: 24, maxH: 17 }), '', 'A = ½ × b × h'],
        [...areaQ(triS(8, 5, 0, 'cm'), { size: 22, maxH: 17 }), '', 'A = ½ × b × h']]) },
      { text: 'rectangle or triangle? Write the formula, then find the area.', ...formFig([
        areaQ(triS(12, 5, 0, 'm'), { size: 24, maxH: 16 }), areaQ(rectS(6.5, 4, 'cm'), { size: 22, maxH: 16 }),
        areaQ(triS(9, 8, 6, 'cm'), { size: 22, maxH: 18 })], true) },
      { text: 'find the area. Split the shape, then add the parts.', ...formFig([
        areaQ({ pts: [[4, 0], [9, 0], [9, 8], [0, 8], [0, 5], [4, 5]], unit: 'cm', show: [0, 2, 3, 5], right: [0], split: [[[4, 5], [9, 5]]] }, { size: 20, maxH: 16.5 }),
        areaQ({ pts: [[0, 0], [12, 0], [12, 9], [7, 9], [7, 3], [0, 3]], unit: 'm', show: [0, 2, 3, 5], right: [0], split: [[[7, 3], [12, 3]]] }, { size: 20, maxH: 16.5 }),
        [...areaQ({ pts: [[0, 0], [8, 0], [8, 7], [4, 10], [0, 7]], unit: 'm', show: [0, 4], right: [0, 1], split: [[[0, 7], [8, 7]]], dims: [[[8, 7], [8, 10], -1]] }, { size: 20, maxH: 16.5 }), '', 'A = l × w + ½ × b × h']], 'A = l × w + l × w') },
      { text: 'find each shaded area.', ...formFig([
        areaQ(holeS(10, 9, 8, 7, 1, 1, 'cm'), { size: 22, maxH: 19 }), areaQ(holeS(12, 10, 10, 8, 1, 1, 'm'), { size: 22, maxH: 19 }),
        areaQ(holeS(11, 10, 8, 8, 1.5, 1, 'cm'), { size: 22, maxH: 19 })], 'A = whole − hole') },
    ],
  },
  medium: {
    ex: { stem: 'Find the perimeter or area. Split the shape, or subtract.', parts: [
      { t: 'Perimeter', fig: comp({ ...EX2.stairs, size: 20, maxH: 11 }) }, { t: 'Area', fig: comp({ ...EX2.house, size: 18, maxH: 11 }) },
      { t: 'Area', fig: comp({ ...EX2.ramp, size: 25, maxH: 11 }) }, { t: 'Area', fig: comp({ ...EX2.corner, size: 22, maxH: 8 }) }] },
    exAns: [
      `the steps add to 12 m across and 9 m up, so P = 12 + 9 + 12 + 9 = ${u(perim(EX2.stairs.pts), 'm')}`,
      `A = 8 × 5 + ½ × 8 × 3 = ${n2(8 * 5)} + ${n2(0.5 * 8 * 3)} = ${u(areaOf(EX2.house.pts), 'cm²')}`,
      `triangle base 14 − 8 = ${n2(14 - 8)} m; A = 8 × 5 + ½ × 6 × 5 = ${n2(8 * 5)} + ${n2(0.5 * 6 * 5)} = ${u(areaOf(EX2.ramp.pts), 'm²')}`,
      `cut-off corner 12 − 8 = ${n2(12 - 8)} m by 7 − 4 = ${n2(7 - 4)} m; A = 12 × 7 − ½ × 4 × 3 = ${n2(12 * 7)} − ${n2(0.5 * 4 * 3)} = ${u(areaOf(EX2.corner.pts), 'm²')}`],
    hint: 'Find missing sides first · Split into rectangles and triangles, or subtract the part cut out',
    work: true, set: true,
    // One set: today's skill building from perimeters to split and shaded areas, with a question from an earlier lesson
    // (tagged) in each row. Every question that can be drawn is its diagram, with a word saying what to find.
    rounds: [(() => {
      const ff = ([fig, a], t = 'Area', from) => [{ t, fig, form: true, ...(from ? { from } : {}) }, a];
      const md = { size: 20, maxH: 8 };
      const ell = [[0, 0], [9, 0], [9, 2], [2, 2], [2, 5], [0, 5]], stairs = [[0, 0], [10, 0], [10, 2], [7, 2], [7, 4], [4, 4], [4, 6], [0, 6]];
      const ell3 = [[0, 0], [10, 0], [10, 5], [8, 5], [8, 2], [0, 2]], house = [[0, 0], [10, 0], [10, 3], [5, 6], [0, 3]];
      const Q = [
        ff([comp({ pts: ell, unit: 'm', show: [0, 1, 2, 5], right: [0], ...md, size: 13.6 }), u(perim(ell), 'm')], 'Perimeter'),
        [{ t: 'In cm', fig: door(2.04), form: true, lines: ['Rule', 'Working', 'Answer'], from: '10.1' }, u(conv(2.04, 'm', 'cm'), 'cm')],
        ff([comp({ pts: ell3, unit: 'cm', show: [0, 1, 4, 5], right: [0], ...md }), u(areaOf(ell3), 'cm²')]),
        ff([comp({ pts: house, unit: 'm', show: [0, 4], right: [0, 1], dims: [[[10, 3], [10, 6], -1]], ...md }), u(areaOf(house), 'm²')]),
        [{ t: 'Write the limits of accuracy of 6.4 m.', from: '10.2' }, limits('6.4 m')],
        ff([comp({ pts: [[0, 0], [11, 0], [7, 4], [0, 4]], unit: 'cm', show: [0, 2, 3], right: [0, 3], ...md, maxH: 6 }), u(areaOf([[0, 0], [11, 0], [7, 4], [0, 4]]), 'cm²')]),
        ff([comp({ pts: [[0, 0], [12, 0], [12, 7], [0, 7]], unit: 'm', show: [0, 1], holes: [[[0, 0], [12, 0], [6, 7]]], ...md }), u(areaIn({ pts: [[0, 0], [12, 0], [12, 7], [0, 7]], holes: [[[0, 0], [12, 0], [6, 7]]] }), 'm²')], 'Shaded area'),
        ff([comp({ pts: stairs, unit: 'm', show: [0, 7], right: [0], ...md }), u(perim(stairs), 'm')], 'Perimeter'),
        [{ t: 'Find the percentage error of 40 cm, measured to the nearest cm.', form: true, from: '10.3' }, `${num(pctErr(meas('40 cm').e, 40))}%`],
      ];
      return { text: '', items: Q.map((x) => x[0]), ans: Q.map((x) => x[1]) };
    })()],
  },
  worded: [
    { q: 'An L-shaped room is made of a 6 m by 4 m rectangle and a 3 m by 2 m rectangle. Carpet costs $45 per m². Find the cost to carpet the room.',
      a: `A = 6 × 4 + 3 × 2 = ${n2(6 * 4)} + ${n2(3 * 2)} = ${u(6 * 4 + 3 * 2, 'm²')}; ${n2(6 * 4 + 3 * 2)} × $45 = $${num((6 * 4 + 3 * 2) * 45)}` },
    { q: 'An L-shaped garden bed has outside edges of 8 m and 6 m. Each arm of the L is 2 m wide. Edging costs $15 per metre. Find the cost to edge the whole bed.',
      a: (() => { const g = [[0, 0], [8, 0], [8, 2], [2, 2], [2, 6], [0, 6]];
        return `missing sides 8 − 2 = ${n2(8 - 2)} m and 6 − 2 = ${n2(6 - 2)} m; P = ${g.map((p, i) => tw(g, i)).join(' + ')} = ${u(perim(g), 'm')}; ${n2(perim(g))} × $15 = $${num(perim(g) * 15)}`; })() },
    { q: 'The end wall of a shed is a rectangle 4 m wide and 2.5 m high, with a triangle 1.5 m high on top. It has a door 0.9 m wide and 2 m high. Find the area of the wall to paint.',
      a: `A = 4 × 2.5 + ½ × 4 × 1.5 − 0.9 × 2 = ${n2(4 * 2.5)} + ${n2(0.5 * 4 * 1.5)} − ${n2(0.9 * 2)} = ${u(4 * 2.5 + 0.5 * 4 * 1.5 - 0.9 * 2, 'm²')}` },
  ],
};

// Formula questions (Formula / Substitute / Answer lines) from [picture, answer, text?, own formula?], with the round's
// formula printed (a string) or left for students to write (true)
function formFig(list, form) { return { items: list.map(([fig, , t = '', own]) => ({ t, fig, form: own || form })), ans: list.map((x) => x[1]) }; }
