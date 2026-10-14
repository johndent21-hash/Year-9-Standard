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

// A composite shape from its corners (x right, y up, in the question's units), drawn to scale: size and maxH are its
// largest width and height in mm. Every length printed on it is measured from the corners.
//   show: the sides labelled with their lengths, outside the shape (side i joins corner i to corner i + 1)
//   right: corners with a right-angle mark          split: [[p, q]] dashed lines that cut the shape into parts
//   hts: [[p, q, side]] a dashed height from p down to q (a right-angle mark at q), labelled beside it (side ±1)
//   dims: [[p, q, side]] a measurement line with end ticks beside p → q (side 1: to its left), labelled with its length
//   holes: [[corners]] white parts cut out (the shape is then shaded); holeShow: [[sides]] labelled inside each hole
//   ask: a side, drawn in blue and labelled ?; or 'P' / 'A' written beside the shape ('A = ?'), askY up its height (0–1)
const comp = (o) => {
  const { pts, unit = 'm', show = [], right = [], split = [], hts = [], dims = [], holes = [], holeShow = [], ask, askY = 0.5, size = 22, maxH = 15, m = 1.5 } = o;
  const { map, w, h } = fitter(pts, size, m, maxH);
  const Q = pts.map(map), n = Q.length, boxes = [], L = (v) => `${n2(v)} ${unit}`;
  // a label, its box recorded so 'A = ?' can be placed clear of every label
  const put = (x, y, s, q = {}) => { const sz = q.size || 2.8, an = q.anchor || 'middle', wd = String(s).length * sz * 0.58, x0 = an === 'start' ? x : an === 'end' ? x - wd : x - wd / 2;
    boxes.push([x0, y - sz * 0.8, x0 + wd, y + sz * 0.25]); return T(x, y, s, q); };
  // a label beside the edge a → b, on the side the unit normal nn points to, g mm clear of it
  const edge = (a, b, s, nn, q = {}, g = 1.6) => { const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    if (Math.abs(nn[0]) > 0.75) return put(mx + nn[0] * g, my + 1.1, s, { ...q, anchor: nn[0] > 0 ? 'start' : 'end' });
    return put(mx + nn[0] * g * 1.5, nn[1] > 0 ? my + g + 2.1 : my - g + 0.3, s, q); };
  const signed = (P) => P.reduce((t, p, i) => { const q = P[(i + 1) % P.length]; return t + p[0] * q[1] - q[0] * p[1]; }, 0);
  const outN = (P, i) => { const a = P[i], b = P[(i + 1) % P.length], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); return signed(P) > 0 ? [dy / l, -dx / l] : [-dy / l, dx / l]; };
  const normal = (a, c, sd) => { const dx = c[0] - a[0], dy = c[1] - a[1], l = Math.hypot(dx, dy); return [(dy / l) * sd, (-dx / l) * sd]; };
  const grey = { stroke: C.grey, w: 0.3 };
  let b = poly(Q, holes.length ? SHADE : FILL);
  holes.forEach((hp) => { b += poly(hp.map(map), '#fff'); });
  split.forEach(([p, q]) => { b += seg(map(p), map(q), { stroke: C.grey, w: 0.32, dash: true }); });
  right.forEach((i) => { b += rightMark(Q[i], Q[(i + n - 1) % n], Q[(i + 1) % n]); });
  if (typeof ask === 'number') b += seg(Q[ask], Q[(ask + 1) % n], { stroke: C.blue, w: 0.8 });
  show.forEach((i) => { b += edge(Q[i], Q[(i + 1) % n], L(side(pts, i)), outN(Q, i)); });
  if (typeof ask === 'number') b += edge(Q[ask], Q[(ask + 1) % n], '?', outN(Q, ask), { size: 3, weight: 700 });
  holes.forEach((hp, j) => { const H = hp.map(map); (holeShow[j] || []).forEach((i) => { const nn = outN(H, i); b += edge(H[i], H[(i + 1) % H.length], L(side(hp, i)), [-nn[0], -nn[1]]); }); });
  hts.forEach(([p, q, sd = 1]) => { const a = map(p), c = map(q), nn = normal(a, c, sd);
    b += seg(a, c, { stroke: C.grey, w: 0.32, dash: true }) + rightMark(c, a, [c[0] - nn[0], c[1] - nn[1]], 1.5) + edge(a, c, L(dist(p, q)), nn, {}, 1.2); });
  dims.forEach(([p, q, sd = 1, off = 2]) => { const a = map(p), c = map(q), nn = normal(a, c, sd);
    const A2 = [a[0] + nn[0] * off, a[1] + nn[1] * off], C2 = [c[0] + nn[0] * off, c[1] + nn[1] * off], t = (P) => seg([P[0] - nn[0] * 0.8, P[1] - nn[1] * 0.8], [P[0] + nn[0] * 0.8, P[1] + nn[1] * 0.8], grey);
    b += seg(A2, C2, grey) + t(A2) + t(C2) + edge(A2, C2, L(dist(p, q)), nn, {}, 1.2); });
  if (ask === 'P' || ask === 'A') { // beside the shape, clear of every label at its height
    const ys = Q.map((p) => p[1]), y = Math.max(...ys) - (Math.max(...ys) - Math.min(...ys)) * askY + 1.1;
    const x = Math.max(...Q.map((p) => p[0]), ...boxes.filter((bx) => bx[3] > y - 3 && bx[1] < y + 1.2).map((bx) => bx[2])) + 1.6;
    b += put(x, y, `${ask} = ?`, { size: 3, weight: 700, anchor: 'start' });
  }
  return svg(f(w), f(h), b);
};

// ---------------------------------------------------------------- the shapes, each { pts, unit, … } (see comp)
// L-shapes for a missing side (ask: the side marked ?) and for perimeters (P = ?)
const missL = (pts, unit, show, ask, o = {}) => [comp({ pts, unit, show, ask, right: [0], size: 17, maxH: 12, ...o }), u(side(pts, ask), unit)];
const perL = (pts, unit, show, o = {}) => [comp({ pts, unit, show, ask: 'P', right: [0], size: 13, maxH: 10.5, ...o }), u(perim(pts), unit)];
// Area questions: the answer is the shaded area (the whole shape less any holes)
const areaQ = (o, sz = {}) => [comp({ ask: 'A', ...o, ...sz }), u(areaIn(o), `${o.unit}²`)];
const rectS = (l, w, unit) => ({ pts: [[0, 0], [l, 0], [l, w], [0, w]], unit, show: [0, 1], right: [0, 1] });
// A triangle, base b along the bottom with its top above x = a: the height dashed (or its left side when a = 0)
const triS = (b, h, a, unit) => (a === 0 ? { pts: [[0, 0], [b, 0], [0, h]], unit, show: [0, 2], right: [0] }
  : { pts: [[0, 0], [b, 0], [a, h]], unit, show: [0], hts: [[[a, h], [a, 0], a > b / 2 ? -1 : 1]] });
// A rectangle with a rectangular hole (x, y its bottom-left corner): the hole's width and height labelled inside it
const holeS = (l, w, hl, hw, x, y, unit) => ({ pts: [[0, 0], [l, 0], [l, w], [0, w]], unit, show: [0, 1],
  holes: [[[x, y], [x + hl, y], [x + hl, y + hw], [x, y + hw]]], holeShow: [[2, 3]] });

// Example 1
const EX1 = {
  per: { pts: [[0, 0], [10, 0], [10, 4], [4, 4], [4, 9], [0, 9]], unit: 'm', show: [0, 1, 4, 5], right: [0] },
  tri: triS(8, 5, 2.5, 'cm'),
  ell: { pts: [[0, 0], [8, 0], [8, 3], [3, 3], [3, 7], [0, 7]], unit: 'cm', show: [0, 1, 4, 5], right: [0], split: [[[0, 3], [3, 3]]] },
  hole: holeS(10, 6, 7, 4, 1.5, 1, 'm'),
};
// Example 2
const EX2 = {
  stairs: { pts: [[0, 0], [12, 0], [12, 3], [8, 3], [8, 6], [4, 6], [4, 9], [0, 9]], unit: 'm', show: [0, 7], right: [0] },
  house: { pts: [[0, 0], [7.5, 0], [7.5, 4], [3.75, 6.4], [0, 4]], unit: 'cm', show: [0, 1], right: [0, 1], split: [[[0, 4], [7.5, 4]], [[3.75, 6.4], [3.75, 4]]], dims: [[[0, 4], [0, 6.4], 1]] },
  ramp: { pts: [[0, 0], [14, 0], [8, 5], [0, 5]], unit: 'm', show: [0, 2, 3], right: [0, 3], split: [[[8, 5], [8, 0]]] },
  corner: { pts: [[0, 0], [10, 0], [10, 10], [0, 10]], unit: 'm', show: [2, 3], holes: [[[4, 0], [10, 0], [10, 5]]], dims: [[[4, 0], [10, 0], -1], [[10, 0], [10, 5], -1]] },
};
const tw = (pts, i) => n2(side(pts, i));

// The Notes diagram: a composite shape split by a dashed line into a rectangle and a triangle, with the area of each
const notesFig = () => {
  const P = { bl: [3, 21], br: [31, 21], top: [20, 5], tl: [3, 5], foot: [20, 21] }, ink = { stroke: C.charcoal, w: 0.45 };
  let b = poly([P.bl, P.br, P.top, P.tl], FILL) + seg(P.top, P.foot, { stroke: C.grey, w: 0.35, dash: true });
  b += rightMark(P.bl, P.tl, P.br, 1.6) + rightMark(P.foot, P.top, P.br, 1.6) + seg(P.bl, P.br, ink);
  b += T(11.5, 11.6, 'rectangle', { size: 2.5 }) + T(11.5, 15.6, 'l × w', { size: 2.8, weight: 600 });
  b += T(11.5, 24.6, 'l', { size: 2.8, weight: 600 }) + T(1.6, 14, 'w', { size: 2.8, weight: 600, anchor: 'end' });
  b += T(25.5, 24.6, 'b', { size: 2.8, weight: 600 }) + T(21.2, 17.2, 'h', { size: 2.8, weight: 600, anchor: 'start' });
  b += T(23.2, 9.2, 'triangle', { size: 2.5, anchor: 'start' });
  b += T(17, 29.4, 'A = l × w + ½ × b × h', { size: 2.5, weight: 600, fill: C.blue });
  return svg(34, 30, b);
};

module.exports = {
  code: '10.4', title: 'Perimeter and area of composite shapes',
  li: 'find the perimeter and area of shapes made from rectangles and triangles.',
  sc: ['find missing side lengths, then the perimeter', 'find an area by splitting a shape into rectangles and triangles', 'find a shaded area by subtracting'],
  notes: {
    terms: [['composite shape', 'made of two or more simple shapes'], ['perimeter (P)', 'the distance around the outside'], ['area (A)', 'the space inside, in square units (cm², m²)'],
      ['missing side', 'use the opposite sides: whole − part'], ['split', 'cut the shape into parts with a dashed line'], ['height (h)', 'at right angles to the base (b)'],
      ['shaded area', 'the whole shape − the white hole']],
    formulas: ['Rectangle: A = l × w', 'Triangle: A = ½ × b × h', 'Split: A = part 1 + part 2', 'Shaded: A = whole − hole', 'Perimeter: add every outside side'],
    steps: ['find missing sides', 'split, or subtract', 'area of each part', 'add or subtract + unit'],
    fig: notesFig(),
  },
  easy: {
    ex: { stem: 'Find the perimeter or area. Find any missing sides first.', parts: [
      { t: 'Perimeter', fig: comp({ ...EX1.per, size: 17, maxH: 15 }) }, { t: 'Area', fig: comp({ ...EX1.tri, size: 22, maxH: 15 }) },
      { t: 'Area', fig: comp({ ...EX1.ell, size: 18, maxH: 15 }) }, { t: 'Shaded area', fig: comp({ ...EX1.hole, size: 28, maxH: 16 }) }] },
    exAns: [
      `missing sides ${n2(10 - 4)} m and ${n2(9 - 4)} m; P = ${EX1.per.pts.map((p, i) => tw(EX1.per.pts, i)).join(' + ')} = ${u(perim(EX1.per.pts), 'm')}`,
      `A = ½ × 8 × 5 = ${u(areaOf(EX1.tri.pts), 'cm²')}`,
      `A = 8 × 3 + 3 × 4 = ${n2(8 * 3)} + ${n2(3 * 4)} = ${u(areaOf(EX1.ell.pts), 'cm²')}`,
      `A = 10 × 6 − 7 × 4 = ${n2(10 * 6)} − ${n2(7 * 4)} = ${u(areaIn(EX1.hole), 'm²')}`],
    hint: 'Missing side = whole side − the other part · Perimeter: add every side, the missing ones too.',
    work: true,
    // Small steps: one missing side of an L-shape (marked ?), then the perimeter of an L-shape with two missing sides
    rounds: [
      { text: 'find the missing side.', cols: 4, ...formFig([
        missL([[0, 0], [10, 0], [10, 2], [4, 2], [4, 5], [0, 5]], 'cm', [0, 4], 2),
        missL([[0, 0], [9, 0], [9, 6], [6, 6], [6, 2], [0, 2]], 'm', [1, 5], 3),
        missL([[0, 0], [10, 0], [10, 3], [4, 3], [4, 8], [0, 8]], 'cm', [1, 5], 3),
        missL([[0, 0], [3, 0], [3, 3], [11, 3], [11, 6], [0, 6]], 'm', [0, 4], 2)], '? = whole − part') },
      { text: 'find the perimeter. Find the two missing sides first.', cols: 4, ...formFig([
        perL([[0, 0], [7, 0], [7, 2], [2, 2], [2, 6], [0, 6]], 'cm', [0, 1, 4, 5]),
        perL([[0, 0], [9, 0], [9, 7], [5, 7], [5, 3], [0, 3]], 'm', [0, 1, 2, 5]),
        perL([[0, 0], [3, 0], [3, 4], [8, 4], [8, 7], [0, 7]], 'cm', [0, 3, 4, 5]),
        perL([[0, 0], [12, 0], [12, 5], [8, 5], [8, 10], [0, 10]], 'm', [0, 1, 4, 5])], 'P = add all sides') },
    ],
  },
  // Page 2: rectangles and triangles (formula given), then choose the formula, then L-shapes split into two rectangles,
  // then shaded areas
  drill: {
    hint: 'Rectangle A = l × w · Triangle A = ½ × b × h (h at right angles to b) · Split: add the parts · Shaded: whole − hole',
    rounds: [
      { text: 'find the area of each rectangle or triangle.', ...formFig([
        [...areaQ(rectS(9, 5, 'cm'), { size: 26, maxH: 16 }), '', 'A = l × w'],
        [...areaQ(triS(10, 6, 3, 'm'), { size: 26, maxH: 16 }), '', 'A = ½ × b × h'],
        [...areaQ(triS(8, 5, 0, 'cm'), { size: 24, maxH: 16 }), '', 'A = ½ × b × h']]) },
      { text: 'rectangle or triangle? Write the formula, then find the area.', ...formFig([
        areaQ(triS(12, 5, 0, 'm'), { size: 26, maxH: 16 }), areaQ(rectS(6.5, 4, 'cm'), { size: 24, maxH: 16 }), areaQ(triS(9, 8, 6, 'cm'), { size: 24, maxH: 16 })], true) },
      { text: 'find the area. Add the two rectangles.', ...formFig([
        areaQ({ pts: [[0, 0], [9, 0], [9, 3], [4, 3], [4, 8], [0, 8]], unit: 'cm', show: [0, 1, 3, 4], right: [0], split: [[[0, 3], [4, 3]]] }, { size: 22, maxH: 17 }),
        areaQ({ pts: [[0, 0], [12, 0], [12, 9], [7, 9], [7, 3], [0, 3]], unit: 'm', show: [0, 2, 3, 5], right: [0], split: [[[7, 3], [12, 3]]] }, { size: 22, maxH: 17 }),
        areaQ({ pts: [[0, 0], [4, 0], [4, 5], [10, 5], [10, 8], [0, 8]], unit: 'm', show: [0, 2, 3, 5], right: [0], split: [[[4, 5], [4, 8]]] }, { size: 22, maxH: 17 })], 'A = l × w + l × w') },
      { text: 'find each shaded area.', ...formFig([
        areaQ(holeS(9, 7, 5, 4, 2, 1.5, 'cm'), { size: 26, maxH: 18 }), areaQ(holeS(12, 7, 6, 4, 3, 1.5, 'm'), { size: 28, maxH: 18 }),
        areaQ(holeS(10, 8, 5, 5, 2.5, 1.5, 'cm'), { size: 26, maxH: 18 })], 'A = whole − hole') },
    ],
  },
  medium: {
    ex: { stem: 'Find the perimeter or area. Split the shape, or subtract.', parts: [
      { t: 'Perimeter', fig: comp({ ...EX2.stairs, size: 20, maxH: 15 }) }, { t: 'Area', fig: comp({ ...EX2.house, size: 22, maxH: 17 }) },
      { t: 'Area', fig: comp({ ...EX2.ramp, size: 26, maxH: 14 }) }, { t: 'Shaded area', fig: comp({ ...EX2.corner, size: 16, maxH: 16 }) }] },
    exAns: [
      `the steps add to 12 m across and 9 m up, so P = 12 + 9 + 12 + 9 = ${u(perim(EX2.stairs.pts), 'm')}`,
      `A = 7.5 × 4 + ½ × 7.5 × 2.4 = ${n2(7.5 * 4)} + ${n2(0.5 * 7.5 * 2.4)} = ${u(areaOf(EX2.house.pts), 'cm²')}`,
      `triangle base 14 − 8 = ${n2(14 - 8)} m; A = 8 × 5 + ½ × 6 × 5 = ${n2(8 * 5)} + ${n2(0.5 * 6 * 5)} = ${u(areaOf(EX2.ramp.pts), 'm²')}`,
      `A = 10 × 10 − ½ × 6 × 5 = ${n2(100)} − ${n2(0.5 * 6 * 5)} = ${u(areaIn(EX2.corner), 'm²')}`],
    hint: 'Find missing sides from the opposite sides · Split into rectangles and triangles, or subtract the part that is not there',
    work: true, set: true,
    // One set: today's skill building from perimeters to split and shaded areas, with a question from an earlier lesson
    // (tagged) in each row. Every question that can be drawn is its diagram, with a word saying what to find.
    rounds: [(() => {
      const ff = ([fig, a], t = 'Area', from) => [{ t, fig, form: true, ...(from ? { from } : {}) }, a];
      const md = { size: 20, maxH: 9 };
      const plank = { pts: [[0, 0], [24.5, 0], [24.5, 2], [0, 2]], unit: 'm' };
      const Q = [
        ff([comp({ pts: [[0, 0], [12, 0], [12, 3], [7, 3], [7, 6], [0, 6]], unit: 'm', show: [0, 1, 2, 5], right: [0], ask: 'P', askY: 1, ...md }), u(perim([[0, 0], [12, 0], [12, 3], [7, 3], [7, 6], [0, 6]]), 'm')], 'Perimeter'),
        [{ t: 'Length in cm', fig: comp({ ...plank, size: 24, maxH: 3, show: [] }).replace('</svg>', '') + '</svg>', form: true, lines: ['Rule', 'Working', 'Answer'], from: '10.1' }, u(conv(2.45, 'm', 'cm'), 'cm')],
        ff(areaQ({ pts: [[0, 0], [12, 0], [12, 4], [6, 7], [0, 4]], unit: 'm', show: [0, 1], right: [0, 1], split: [[[0, 4], [12, 4]], [[6, 7], [6, 4]]], dims: [[[0, 4], [0, 7], 1]] }, { ...md, size: 17 })),
        ff(areaQ({ pts: [[0, 0], [12, 0], [12, 3], [5, 3], [5, 7], [0, 7]], unit: 'cm', show: [0, 1, 2, 5], right: [0] }, md)),
        [{ t: 'Write the limits of accuracy of 6.4 m.', from: '10.2' }, limits('6.4 m')],
        ff(areaQ({ pts: [[0, 0], [8, 0], [12, 3], [8, 6], [0, 6]], unit: 'cm', show: [0, 4], right: [0, 4], split: [[[8, 0], [8, 6]], [[8, 3], [12, 3]]], dims: [[[8, 0], [12, 0], -1]] }, { ...md, maxH: 8 })),
        ff(areaQ({ pts: [[0, 0], [12, 0], [12, 7], [0, 7]], unit: 'm', show: [0, 1], holes: [[[0, 0], [12, 0], [6, 7]]] }, md), 'Shaded area'),
        ff([comp({ pts: [[0, 0], [10, 0], [10, 2], [7, 2], [7, 4], [4, 4], [4, 6], [0, 6]], unit: 'm', show: [0, 7], right: [0], ask: 'P', ...md }), u(perim([[0, 0], [10, 0], [10, 2], [7, 2], [7, 4], [4, 4], [4, 6], [0, 6]]), 'm')], 'Perimeter'),
        [{ t: 'Find the percentage error of 40 cm, measured to the nearest cm.', form: true, from: '10.3' }, `${num(pctErr(meas('40 cm').e, 40))}%`],
      ];
      return { text: '', items: Q.map((x) => x[0]), ans: Q.map((x) => x[1]) };
    })()],
  },
  worded: [
    { q: 'An L-shaped room is made of a 6 m by 4 m rectangle and a 3 m by 2 m rectangle. Carpet costs $45 per m². Find the cost to carpet the room.',
      a: `A = 6 × 4 + 3 × 2 = ${n2(6 * 4)} + ${n2(3 * 2)} = ${u(6 * 4 + 3 * 2, 'm²')}; ${n2(6 * 4 + 3 * 2)} × $45 = $${num((6 * 4 + 3 * 2) * 45)}` },
    { q: 'An L-shaped garden bed is 8 m long and 6 m high on its outside edges, and 2 m wide all the way along. Edging costs $15 per metre. Find the cost to edge it.',
      a: `missing sides 8 − 2 = ${n2(8 - 2)} m and 6 − 2 = ${n2(6 - 2)} m; P = 8 + 2 + 6 + 4 + 2 + 6 = ${u(perim([[0, 0], [8, 0], [8, 2], [2, 2], [2, 6], [0, 6]]), 'm')}; ${n2(perim([[0, 0], [8, 0], [8, 2], [2, 2], [2, 6], [0, 6]]))} × $15 = $${num(perim([[0, 0], [8, 0], [8, 2], [2, 2], [2, 6], [0, 6]]) * 15)}` },
    { q: 'The end wall of a shed is a rectangle 4 m wide and 2.5 m high, with a triangle 1.5 m high on top. It has a door 0.9 m wide and 2 m high. Find the area of the wall to paint.',
      a: `A = 4 × 2.5 + ½ × 4 × 1.5 − 0.9 × 2 = ${n2(4 * 2.5)} + ${n2(0.5 * 4 * 1.5)} − ${n2(0.9 * 2)} = ${u(4 * 2.5 + 0.5 * 4 * 1.5 - 0.9 * 2, 'm²')}` },
  ],
};

// Formula questions (Formula / Substitute / Answer lines) from [picture, answer, text?, own formula?], with the round's
// formula printed (a string) or left for students to write (true)
function formFig(list, form) { return { items: list.map(([fig, , t = '', own]) => ({ t, fig, form: own || form })), ans: list.map((x) => x[1]) }; }
