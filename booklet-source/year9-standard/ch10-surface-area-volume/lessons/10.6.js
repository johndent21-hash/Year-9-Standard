// Lesson 10.6 Circumference and arc length (three pages: Easy with the Notes box, Easy drill, then Medium with earlier
// lessons mixed in and three worded problems).
// See lib/lesson-two.js.
// Textbook 10.06 (first half). Every circle answer is correct to one decimal place, using the calculator's π.
const { PI, num, u, circ, limits, meas, pctErr } = require('../helpers');
const S = require('../shapes');
const { C, f, T, svg, seg, dot, rightMark, arcD, FILL, SHADE } = S.parts;

const d1 = (v, unit) => u(v, unit, 1);
const arcLen = (angle, r) => (angle / 360) * circ(r);
// Points round an arc centred at (cx, cy), from angle a0 to a1 in degrees (y up), for drawing a curved edge with shape()
const arc = (cx, cy, r, a0, a1, n = 24) => Array.from({ length: n + 1 }, (_, i) => {
  const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
});
// A circle, semicircle, quadrant or sector of radius R mm, drawn anticlockwise from its bottom radius (pointing right).
// show 'r': the radius (a full circle draws it in blue; a sector labels its bottom edge), 'd': the diameter,
// 'up': a blue radius straight up (a semicircle whose radius is given). angleLabel shows the angle at the centre.
// The given length is drawn in blue. The question's unknown (ask) is marked with a ?: 'd' a measurement line up the
// right of the circle, top to bottom, labelled 'd = ?'; 'r' a dashed radius straight down with a measurement line beside
// it labelled 'r = ?'; 'C' or 'P' written beside the shape; 'arc' the arc drawn in blue with 'arc = ?' by it.
// given: a value beside the shape that is not a length on it ('C = 50 cm').
const part = ({ angle = 360, R = 10, lab = '', show = 'r', angleLabel = '', ask = '', given = '' }) => {
  const full = angle >= 360, m = 1, rad = (a) => (a * Math.PI) / 180;
  const ends = full ? [0, 90, 180, 270] : [0, angle, ...[90, 180, 270].filter((a) => a < angle)];
  const xs = [...(full ? [] : [0]), ...ends.map((a) => R * Math.cos(rad(a)))], ys = [...(full ? [] : [0]), ...ends.map((a) => R * Math.sin(rad(a)))];
  const c = [m - Math.min(...xs), m + Math.max(...ys)], at = (a, r = R) => [c[0] + r * Math.cos(rad(a)), c[1] - r * Math.sin(rad(a))];
  const blue = { stroke: C.blue, w: 0.45 }, Q = { size: 3, weight: 700 }, xR = c[0] + Math.max(...xs);
  let b = full ? `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(R)}" fill="${FILL}" stroke="${C.charcoal}" stroke-width="0.45"/>`
    : `<path d="M${f(c[0])},${f(c[1])} L${f(at(0)[0])},${f(at(0)[1])} ${arcD(c, R, 0, angle).d} Z" fill="${FILL}" stroke="${C.charcoal}" stroke-width="0.45"/>`;
  if (angle === 90) b += rightMark(c, at(0), at(90), 2.2);
  if (angleLabel) {
    // The label goes on the angle's bisector, as close to the centre as it fits: its box clear of the angle mark, both
    // radii and the arc (so in a small sector it touches nothing). A small sector has a smaller angle mark.
    const rm = R < 12 ? 2.6 : 3.4, w = angleLabel.length * 2.8 * 0.58, h2 = angle / 2;
    const fits = (d) => { const cx = d * Math.cos(rad(h2)), cy = d * Math.sin(rad(h2)); // the box, y up from the centre
      return [[cx - w / 2, cy - 1.1], [cx + w / 2, cy - 1.1], [cx - w / 2, cy + 1.3], [cx + w / 2, cy + 1.3]].every(([x, y]) => {
        const r = Math.hypot(x, y), t = (Math.atan2(y, x) * 180) / Math.PI, th = t < -90 ? t + 360 : t;
        return r <= R - 1.1 && r >= rm + 0.5 && (angle >= 180 || (th >= 0 && th <= angle && r * Math.sin(rad(th)) >= 0.5 && r * Math.sin(rad(angle - th)) >= 0.5)); }); };
    let d = rm + 1.6; while (d < R && !fits(d)) d += 0.2;
    if (!fits(d)) d = Math.max(6.6, 3.8 / Math.sin(rad(Math.min(angle, 180) / 2)));
    const a = arcD(c, rm, 0, angle), p = at(h2, d);
    b += `<path d="M${f(a.p0[0])},${f(a.p0[1])} ${a.d}" fill="none" stroke="${C.blue}" stroke-width="0.35"/>` + T(p[0], p[1] + 1, angleLabel, { size: 2.8, fill: C.blue, weight: 600 });
  }
  if (ask === 'arc') { // the label off the arc's right-hand part, so it stays beside the shape
    const a = arcD(c, R, 0, angle), p = at(Math.min(angle / 2, 35), R + 2.2);
    b += `<path d="M${f(a.p0[0])},${f(a.p0[1])} ${a.d}" fill="none" stroke="${C.blue}" stroke-width="1"/>` + T(p[0], p[1] + 1, 'arc = ?', { ...Q, anchor: 'start' });
  }
  // the given radius or diameter
  if (full) b += lab ? seg(show === 'd' ? at(180) : c, at(0), blue) + T(show === 'd' ? c[0] : c[0] + R * 0.34, c[1] - 1.4, lab, { size: 3 }) : '';
  else if (show === 'up') b += seg(c, at(90), blue) + T(c[0] + 1.4, c[1] - R / 2 + 1, lab, { size: 3, anchor: 'start' });
  else b += seg(show === 'd' ? at(180) : c, at(0), blue) + T(show === 'd' ? c[0] : c[0] + R / 2, c[1] + 4, lab, { size: 3 });
  // a measurement line up the right of the circle, from y0 to y1, with its label
  const dim = (y0, y1, t) => { const x = xR + 2.2, g = { stroke: C.grey, w: 0.3 };
    return seg([x, y0], [x, y1], g) + seg([x - 0.8, y0], [x + 0.8, y0], g) + seg([x - 0.8, y1], [x + 0.8, y1], g) + T(x + 1.2, (y0 + y1) / 2 + 1, t, { ...Q, anchor: 'start' }); };
  if (full && ask === 'd') b += dim(c[1] - R, c[1] + R, 'd = ?');
  if (full && ask === 'r') b += seg(c, at(270), { stroke: C.grey, w: 0.4, dash: true }) + dim(c[1], c[1] + R, 'r = ?');
  // C = ? or P = ? beside the shape, halfway up it; a given value beside it (above the r line when r is asked)
  const top = full ? c[1] - R : c[1] - R * Math.min(1, Math.sin(rad(Math.min(angle, 90)))), bottom = full ? c[1] + R : c[1];
  if (ask === 'C' || ask === 'P') b += T(xR + 1.5, (top + bottom) / 2 + 1, `${ask} = ?`, { ...Q, anchor: 'start' });
  if (given) b += T(xR + 1.5, ask === 'r' ? c[1] - R / 2 + 1 : (top + bottom) / 2 + 1, given, { size: 3, anchor: 'start' });
  b += dot(c);
  return svg(f(Math.max(...xs) - Math.min(...xs) + 2 * m), f(Math.max(...ys) - Math.min(...ys) + 2 * m), b);
};
// A rectangle l by w with a semicircle (diameter w) on its right end, or on both ends; the joins are dashed. One round
// end: the length under the bottom edge, the width on the left edge. Both ends round: the length on a measurement line
// under the shape from one dashed join to the other (so it is not read as the length end to end), the width on one
// up its right.
const rectEnds = (l, w, ends, unit, o = {}) => {
  const r = w / 2, L = `${num(l)} ${unit}`, W = `${num(w)} ${unit}`;
  const pts = [[0, 0], ...arc(l, r, r, -90, 90), ...(ends === 2 ? arc(0, r, r, 90, 270).slice(0, -1) : [[0, w]])];
  if (ends === 2) return S.shape({ pts, dash: [[[l, 0], [l, w]], [[0, 0], [0, w]]], dims: [[[0, 0], [l, 0], L, -1], [[l + r, 0], [l + r, w], W, -1]], ...o });
  const sides = pts.map((p, i) => (i === 0 ? L : i === pts.length - 1 ? W : ''));
  return S.shape({ pts, sides, dash: [[[l, 0], [l, w]]], right: [0], ...o });
};

// Each question: [picture, answer, caption]
const semiD = (d, unit, R = 15, ask) => [part({ angle: 180, R, lab: `${num(d)} ${unit}`, show: 'd', ask }), d1((PI * d) / 2 + d, unit)];
const semiR = (r, unit, R = 15, ask) => [part({ angle: 180, R, lab: `${num(r)} ${unit}`, show: 'up', ask }), d1(PI * r + 2 * r, unit)];
const quad = (r, unit, R = 17, ask) => [part({ angle: 90, R, lab: `${num(r)} ${unit}`, ask }), d1(circ(r) / 4 + 2 * r, unit)];
// A drill circle: the radius or diameter given (k: 'r' or 'd', value v), the unknown marked with a ? (ask)
const circleQ = (v, unit, k, ask, R = 8) => part({ R, lab: `${num(v)} ${unit}`, show: k, ask });
const sect = (angle, r, unit, R) => [part({ angle, R, lab: `${num(r)} ${unit}`, angleLabel: `${angle}°` }), d1(arcLen(angle, r) + 2 * r, unit)];
const figRound = (text, list) => ({ text, items: list.map(([fig, , t = '']) => ({ t, fig })), ans: list.map((x) => x[1]), cols: 4 });
// Formula questions (Formula / Substitute / Answer lines) from [picture, answer, text?, formula?], with the round's formula
// printed (a string) or left for students to write (true)
const formFig = (list, form) => ({ items: list.map(([fig, , t = '', own]) => ({ t, fig, form: own || form })), ans: list.map((x) => x[1]) });

// Composite shapes (Medium round 2), drawn from the same lengths as their perimeters
const track = (l, w, unit) => [rectEnds(l, w, 2, unit, { size: 20, maxH: 6 }), d1(2 * l + PI * w, unit)];
const archway = (w, h, unit) => [S.shape({ pts: [[0, 0], [w, 0], ...arc(w / 2, h, w / 2, 0, 180)], sides: [`${num(w)} ${unit}`], dash: [[[0, h], [w, h]]], right: [0, 1], size: 22, maxH: 16,
  // the straight side's length on a measurement line, so it cannot be read as the height of the whole arch
  dims: [[[w, 0], [w, h], `${num(h)} ${unit}`, -1]] }),
  d1(h + w + h + (PI * w) / 2, unit)];
const biteSemi = (l, w, unit) => {
  const pts = [[0, 0], ...arc(l, w / 2, w / 2, 270, 90), [0, w]];
  return [S.shape({ pts, sides: pts.map((p, i) => (i === 0 ? `${num(l)} ${unit}` : i === pts.length - 1 ? `${num(w)} ${unit}` : '')), dash: [[[l, 0], [l, w]]], right: [0], size: 24, maxH: 14 }),
    d1(l + w + l + (PI * w) / 2, unit), `Cut-out: d = ${num(w)} ${unit}`];
};
// A rectangle l by w with a quadrant of radius w cut from its top right corner (the quadrant's radii dashed). The
// quadrant's radius is labelled on its dashed right-hand edge, which is also the rectangle's width.
const biteQuad = (l, w, unit) => {
  const pts = [[0, 0], ...arc(l, w, w, 270, 180), [0, w]];
  return [S.shape({ pts, sides: [`${num(l)} ${unit}`], dash: [[[l, 0], [l, w], `${num(w)} ${unit}`, -1], [[l, w], [l - w, w]]], right: [0], size: 16, maxH: 8 }),
    d1(l + circ(w) / 4 + (l - w) + w, unit), `Cut-out: r = ${num(w)} ${unit}`];
};

const EX2 = { l: 10, w: 6 };

// The Notes diagram: a circle with its centre, radius, diameter, an arc and a sector (with the angle θ at its centre)
const notesFig = () => {
  const R = 13, a0 = 15, a1 = 85, c = [R + 3, R + 3];
  const at = (a, r = R) => [c[0] + r * Math.cos((a * Math.PI) / 180), c[1] - r * Math.sin((a * Math.PI) / 180)];
  const s = arcD(c, R, a0, a1), th = arcD(c, 3.4, a0, a1), mid = (a0 + a1) / 2;
  let b = `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${R}" fill="${FILL}" stroke="${C.charcoal}" stroke-width="0.45"/>`;
  b += `<path d="M${f(c[0])},${f(c[1])} L${f(s.p0[0])},${f(s.p0[1])} ${s.d} Z" fill="${SHADE}" stroke="${C.charcoal}" stroke-width="0.4"/>`;
  b += `<path d="M${f(s.p0[0])},${f(s.p0[1])} ${s.d}" fill="none" stroke="${C.blue}" stroke-width="1.1"/>`;
  b += `<path d="M${f(th.p0[0])},${f(th.p0[1])} ${th.d}" fill="none" stroke="${C.charcoal}" stroke-width="0.3"/>`;
  b += seg(at(180), at(0), { stroke: C.charcoal, w: 0.45 }) + dot(c);
  b += T(c[0], c[1] + 3.6, 'diameter d', { size: 2.5 }) + T(at(a1, R * 0.5)[0] - 1.2, at(a1, R * 0.5)[1] + 1, 'r', { size: 2.8, anchor: 'end', weight: 600 });
  b += T(at(mid, 5.6)[0], at(mid, 5.6)[1] + 1, 'θ', { size: 2.6 }) + T(at(mid, R * 0.7)[0] + 0.6, at(mid, R * 0.7)[1] + 1, 'sector', { size: 2.4 });
  b += T(at(mid, R + 2.4)[0] + 1, at(mid, R + 2.4)[1], 'arc', { size: 2.6, fill: C.blue, weight: 600, anchor: 'start' }) + T(c[0], c[1] + R + 3.8, 'circumference', { size: 2.5 });
  return svg(f(2 * R + 6), f(2 * R + 8), b);
};

module.exports = {
  code: '10.6', title: 'Circumference and arc length',
  li: 'find circumferences, arc lengths and perimeters of curved shapes.',
  sc: ['use C = πd or C = 2πr to find a circumference', 'find an arc length: θ ÷ 360 × 2πr', 'find the perimeter of sectors and composite shapes'],
  notes: {
    terms: [['circumference (C)', 'the distance around a circle'], ['radius (r)', 'from the centre to the edge'], ['diameter (d)', 'across through the centre; d = 2r'],
      ['arc', 'part of the circumference'], ['sector', 'a slice of a circle between two radii'], ['θ', 'the angle at the centre of a sector'],
      ['perimeter', 'the distance around a shape']],
    formulas: ['C = πd = 2πr', 'Arc length = θ ÷ 360 × 2πr', 'Semicircle: P = ½πd + d', 'Quadrant: P = ¼ × 2πr + 2r', 'Sector: P = arc + 2r'],
    steps: ['r = d ÷ 2', 'write the formula', 'substitute (π key)', 'round to 1 d.p. + unit'],
    fig: notesFig(),
  },
  easy: {
    ex: { stem: 'Find each circumference or perimeter, correct to one decimal place.', parts: [
      { t: 'Circumference', fig: part({ R: 9.5, lab: '5 cm' }) }, { t: 'Circumference', fig: part({ R: 9.5, lab: '12 m', show: 'd' }) },
      { t: 'Perimeter', fig: part({ angle: 180, R: 14, lab: '10 cm', show: 'd' }) }, { t: 'Perimeter', fig: part({ angle: 90, R: 14.5, lab: '6 m' }) }] },
    exAns: [`C = 2 × π × 5 = ${d1(circ(5), 'cm')}`, `C = π × 12 = ${d1(PI * 12, 'm')}`, `P = ½ × π × 10 + 10 = ${d1((PI * 10) / 2 + 10, 'cm')}`, `P = ¼ × 2 × π × 6 + 6 + 6 = ${d1(circ(6) / 4 + 12, 'm')}`],
    hint: 'd = 2r · r = d ÷ 2 · C = πd · Use the π key, then round to one decimal place.',
    work: true,
    // Small steps: the radius and diameter, then C = πd (the formula printed on the Formula line). Each question is its
    // diagram: the given length on it, the unknown marked with a ?. The round heading says what to find.
    rounds: [
      { text: 'find the diameter or the radius.', cols: 4, ...formFig([[4, 'cm', 'r'], [10, 'm', 'd'], [7, 'm', 'r'], [9, 'cm', 'd']]
        .map(([v, x, k]) => [circleQ(v, x, k, k === 'r' ? 'd' : 'r', 8.5), u(k === 'r' ? 2 * v : v / 2, x), '', k === 'r' ? 'd = 2r' : 'r = d ÷ 2'])) },
      { text: 'find the circumference. The diameter is given.', cols: 4, ...formFig([[6, 'cm'], [10, 'm'], [2.5, 'm'], [14, 'cm']]
        .map(([v, x]) => [circleQ(v, x, 'd', 'C'), d1(PI * v, x)]), 'C = πd') },
    ],
  },
  // Page 2: more drill. C = 2πr, then choose the formula, then semicircles and quadrants (formula given).
  drill: {
    hint: 'C = 2πr = πd · Semicircle P = ½πd + d · Quadrant P = ¼ × 2πr + 2r · Find d first when r is given.',
    rounds: [
      { text: 'find the circumference. The radius is given.', ...formFig([[2, 'cm'], [8, 'm'], [1.5, 'm']].map(([v, x]) => [circleQ(v, x, 'r', 'C', 11), d1(circ(v), x)]), 'C = 2πr') },
      { text: 'is it r or d? Write the right formula, then find the circumference.', ...formFig([[4, 'cm', 'r'], [9, 'm', 'd'], [12, 'mm', 'r']]
        .map(([v, x, k]) => [circleQ(v, x, k, 'C', 11), d1(k === 'r' ? circ(v) : PI * v, x)]), true) },
      { text: 'find the perimeter of each semicircle.', ...formFig([semiD(8, 'cm', 16, 'P'), semiD(12, 'm', 16, 'P'), semiR(5, 'm', 16, 'P')], 'P = ½πd + d') },
      { text: 'find the perimeter of each quadrant.', ...formFig([quad(4, 'cm', 19, 'P'), quad(10, 'm', 19, 'P'), quad(6, 'cm', 19, 'P')], 'P = ¼ × 2πr + 2r') },
    ],
  },
  medium: {
    ex: { stem: 'Give each answer correct to one decimal place.', parts: [
      { t: 'Arc length', fig: part({ angle: 60, R: 11.5, lab: '9 cm', angleLabel: '60°', ask: 'arc' }) }, { t: 'Perimeter', fig: part({ angle: 60, R: 11.5, lab: '9 cm', angleLabel: '60°', ask: 'P' }) },
      { t: 'Perimeter', fig: rectEnds(EX2.l, EX2.w, 1, 'm', { size: 24, maxH: 12 }) }, { t: 'Radius', fig: part({ R: 7.5, ask: 'r', given: 'C = 50 cm' }) }] },
    exAns: [`l = 60/360 × 2 × π × 9 = ${d1(arcLen(60, 9), 'cm')}`, `P = ${num(arcLen(60, 9), 2)}… + 9 + 9 = ${d1(arcLen(60, 9) + 18, 'cm')}`,
      `P = 10 + 6 + 10 + ½ × π × 6 = ${d1(EX2.l * 2 + EX2.w + (PI * EX2.w) / 2, 'm')} (not the dashed side)`,
      `50 = 2 × π × r, so r = 50 ÷ (2 × π) = ${d1(50 / (2 * PI), 'cm')}`],
    hint: 'Arc = θ ÷ 360 × 2πr (θ = angle at the centre) · Sector P = arc + 2r · Composite: add the outside edges only',
    work: true, set: true,
    // One set: today's skill, building from arcs to composite shapes, with a question from an earlier lesson (tagged)
    // in each row. Every question that can be drawn is its diagram, with a word saying what to find; a question that
    // needs a formula has Formula / Substitute / Answer lines (form: true).
    rounds: [(() => {
      const fq = (t, a, from) => [{ t, form: true, ...(from ? { from } : {}) }, a];
      const ff = ([fig, a], t = 'Perimeter', from) => [{ t, fig, form: true, ...(from ? { from } : {}) }, a];
      const Q = [
        ff([part({ angle: 120, R: 9, lab: '3 m', angleLabel: '120°', ask: 'arc' }), d1(arcLen(120, 3), 'm')], 'Arc length'),
        ff([S.kite(6, 5, 1.7, { xLabel: '6 m', yLabel: '5 m', size: 9, maxH: 6 }), u((6 * 5) / 2, 'm²')], 'Area', '10.5'),
        ff([part({ angle: 72, R: 9.5, lab: '10 cm', angleLabel: '72°', ask: 'arc' }), d1(arcLen(72, 10), 'cm')], 'Arc length'),
        ff(sect(120, 6, 'cm', 9)), ff(track(8, 4, 'cm')), ff(biteQuad(9, 5, 'cm')),
        [{ t: 'Write the limits of accuracy of 4.5 m.', from: '10.2' }, limits('4.5 m')],
        ff([part({ R: 6, ask: 'r', given: 'C = 18.85 m' }), d1(18.85 / (2 * PI), 'm')], 'Radius'),
        fq('Find the percentage error of 20 cm, measured to the nearest cm.', `${num(pctErr(meas('20 cm').e, 20))}%`, '10.3'),
      ];
      return { text: '', items: Q.map((x) => x[0]), ans: Q.map((x) => x[1]) };
    })()],
  },
  worded: [
    { q: 'A round garden bed has a diameter of 3.2 m. Edging costs $12 per metre. Find the cost to edge the bed, to the nearest dollar.',
      a: `C = π × 3.2 = ${num(PI * 3.2, 2)} m; ${num(PI * 3.2, 2)} × $12 = $${num(Math.round(PI * 3.2 * 12))}` },
    { q: 'A bike wheel has a radius of 33 cm. How many full turns does it make to travel 1 km?',
      a: `C = 2 × π × 33 = ${num(circ(33), 1)} cm; 100 000 ÷ ${num(circ(33), 1)} = ${num(100000 / +circ(33).toFixed(1), 1)}, so ${num(Math.floor(100000 / circ(33)))} full turns` },
    { q: 'A running track is a rectangle 84 m long with a semicircle on each end. Each semicircle has a diameter of 64 m. Find one lap, to the nearest metre.',
      a: `84 + 84 + π × 64 = ${num(168 + PI * 64, 1)}, so ${u(Math.round(168 + PI * 64), 'm')}` },
  ],
};
