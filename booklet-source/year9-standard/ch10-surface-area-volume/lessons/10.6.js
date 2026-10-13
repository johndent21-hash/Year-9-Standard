// Lesson 10.6 Circumference and arc length (two pages: Easy, then Medium, whose last round mixes in earlier lessons).
// See lib/lesson-two.js.
// Textbook 10.06 (first half). Every circle answer is correct to one decimal place, using the calculator's π.
const { F, PI, num, u, conv, circ, limits, meas, pctErr, round } = require('../helpers');
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
const part = ({ angle = 360, R = 10, lab = '', show = 'r', angleLabel = '' }) => {
  const full = angle >= 360, m = 1, rad = (a) => (a * Math.PI) / 180;
  const ends = full ? [0, 90, 180, 270] : [0, angle, ...[90, 180, 270].filter((a) => a < angle)];
  const xs = [...(full ? [] : [0]), ...ends.map((a) => R * Math.cos(rad(a)))], ys = [...(full ? [] : [0]), ...ends.map((a) => R * Math.sin(rad(a)))];
  const c = [m - Math.min(...xs), m + Math.max(...ys)], at = (a, r = R) => [c[0] + r * Math.cos(rad(a)), c[1] - r * Math.sin(rad(a))];
  const blue = { stroke: C.blue, w: 0.45 };
  let b = full ? `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(R)}" fill="${FILL}" stroke="${C.charcoal}" stroke-width="0.45"/>`
    : `<path d="M${f(c[0])},${f(c[1])} L${f(at(0)[0])},${f(at(0)[1])} ${arcD(c, R, 0, angle).d} Z" fill="${FILL}" stroke="${C.charcoal}" stroke-width="0.45"/>`;
  if (angle === 90) b += rightMark(c, at(0), at(90), 2.2);
  if (angleLabel) {
    const a = arcD(c, 3.4, 0, angle), d = Math.max(6.6, 3.8 / Math.sin(rad(Math.min(angle, 180) / 2))), p = at(angle / 2, d);
    b += `<path d="M${f(a.p0[0])},${f(a.p0[1])} ${a.d}" fill="none" stroke="${C.blue}" stroke-width="0.35"/>` + T(p[0], p[1] + 1, angleLabel, { size: 2.8, fill: C.blue, weight: 600 });
  }
  if (full) b += seg(show === 'd' ? at(180) : c, at(0), blue) + T(show === 'd' ? c[0] : c[0] + R * 0.34, c[1] - 1.4, lab, { size: 3 });
  else if (show === 'up') b += seg(c, at(90), blue) + T(c[0] + 1.4, c[1] - R / 2 + 1, lab, { size: 3, anchor: 'start' });
  else b += T(show === 'd' ? c[0] : c[0] + R / 2, c[1] + 4, lab, { size: 3 });
  b += dot(c);
  return svg(f(Math.max(...xs) - Math.min(...xs) + 2 * m), f(Math.max(...ys) - Math.min(...ys) + 2 * m), b);
};
// A rectangle l by w with a semicircle (diameter w) on its right end, or on both ends; the joins are dashed. The
// length goes under the bottom edge, the width on the left edge (or beside the dashed join when both ends are round).
const rectEnds = (l, w, ends, unit, o = {}) => {
  const r = w / 2, L = `${num(l)} ${unit}`, W = `${num(w)} ${unit}`;
  const pts = [[0, 0], ...arc(l, r, r, -90, 90), ...(ends === 2 ? arc(0, r, r, 90, 270).slice(0, -1) : [[0, w]])];
  const sides = pts.map((p, i) => (i === 0 ? L : ends === 1 && i === pts.length - 1 ? W : ''));
  return S.shape({ pts, sides, dash: [[[l, 0], [l, w], ends === 2 ? W : '', 1], ...(ends === 2 ? [[[0, 0], [0, w]]] : [])], right: ends === 1 ? [0] : [], ...o });
};

// Each question: [picture, answer, caption]
const semiD = (d, unit, R = 15) => [part({ angle: 180, R, lab: `${num(d)} ${unit}`, show: 'd' }), d1((PI * d) / 2 + d, unit)];
const semiR = (r, unit, R = 15) => [part({ angle: 180, R, lab: `${num(r)} ${unit}`, show: 'up' }), d1(PI * r + 2 * r, unit)];
const quad = (r, unit, R = 17) => [part({ angle: 90, R, lab: `${num(r)} ${unit}` }), d1(circ(r) / 4 + 2 * r, unit)];
const sect = (angle, r, unit, R) => [part({ angle, R, lab: `${num(r)} ${unit}`, angleLabel: `${angle}°` }), d1(arcLen(angle, r) + 2 * r, unit)];
const figRound = (text, list) => ({ text, items: list.map(([fig, , t = '']) => ({ t, fig })), ans: list.map((x) => x[1]), cols: 4 });

// Composite shapes (Medium round 2), drawn from the same lengths as their perimeters
const track = (l, w, unit) => [rectEnds(l, w, 2, unit, { size: 30, maxH: 14 }), d1(2 * l + PI * w, unit)];
const archway = (w, h, unit) => [S.shape({ pts: [[0, 0], [w, 0], ...arc(w / 2, h, w / 2, 0, 180)], sides: [`${num(w)} ${unit}`], dash: [[[0, h], [w, h]]], right: [0, 1], size: 22, maxH: 16,
  // the straight side's length on a measurement line, so it cannot be read as the height of the whole arch
  dims: [[[w, 0], [w, h], `${num(h)} ${unit}`, -1]] }),
  d1(h + w + h + (PI * w) / 2, unit)];
const biteSemi = (l, w, unit) => {
  const pts = [[0, 0], ...arc(l, w / 2, w / 2, 270, 90), [0, w]];
  return [S.shape({ pts, sides: pts.map((p, i) => (i === 0 ? `${num(l)} ${unit}` : i === pts.length - 1 ? `${num(w)} ${unit}` : '')), dash: [[[l, 0], [l, w]]], right: [0], size: 24, maxH: 14 }),
    d1(l + w + l + (PI * w) / 2, unit), `Cut-out: d = ${num(w)} ${unit}`];
};
// A rectangle l by w with a quadrant of radius w cut from its top right corner (the quadrant's radii dashed)
const biteQuad = (l, w, unit) => {
  const pts = [[0, 0], ...arc(l, w, w, 270, 180), [0, w]];
  return [S.shape({ pts, sides: pts.map((p, i) => (i === 0 ? `${num(l)} ${unit}` : i === pts.length - 1 ? `${num(w)} ${unit}` : '')), dash: [[[l, 0], [l, w]], [[l, w], [l - w, w]]], right: [0], size: 24, maxH: 14 }),
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
  sc: ['use C = πd or C = 2πr to find a circumference', `find an arc length: ${F('θ', 360)} × 2πr`, 'find the perimeter of sectors and composite shapes'],
  notes: {
    terms: [['circumference (C)', 'the distance around a circle'], ['radius (r)', 'from the centre to the edge'], ['diameter (d)', 'across through the centre; d = 2r'],
      ['arc', 'part of the circumference'], ['sector', 'a slice of a circle between two radii'], ['θ', 'the angle at the centre of a sector'],
      ['perimeter', 'the distance around the outside of a shape']],
    formulas: ['C = πd = 2πr', `Arc length = ${F('θ', 360)} × 2πr`, 'Semicircle: P = ½πd + d', 'Quadrant: P = ¼ × 2πr + 2r', 'Sector: P = arc + 2r'],
    steps: ['r = d ÷ 2', 'write the formula', 'substitute (π key)', 'round to 1 d.p. + unit'],
    fig: notesFig(),
  },
  easy: {
    ex: { stem: 'Find each circumference or perimeter, correct to one decimal place.', parts: [
      { t: 'Circumference', fig: part({ R: 9.5, lab: '5 cm' }) }, { t: 'Circumference', fig: part({ R: 9.5, lab: '12 m', show: 'd' }) },
      { t: 'Perimeter', fig: part({ angle: 180, R: 14, lab: '10 cm', show: 'd' }) }, { t: 'Perimeter', fig: part({ angle: 90, R: 14.5, lab: '6 m' }) }] },
    exAns: [`C = 2 × π × 5 = ${d1(circ(5), 'cm')}`, `C = π × 12 = ${d1(PI * 12, 'm')}`, `P = ½ × π × 10 + 10 = ${d1((PI * 10) / 2 + 10, 'cm')}`, `P = ¼ × 2 × π × 6 + 6 + 6 = ${d1(circ(6) / 4 + 12, 'm')}`],
    hint: 'C = πd = 2πr · Semicircle P = ½ × πd + d · Quadrant P = ¼ × 2πr + r + r · Use the π key.',
    work: true,
    rounds: [
      round('find the circumference of each circle, correct to one decimal place. Is it r or d?',
        [[3, 'cm', 'r'], [7, 'm', 'r'], [2.5, 'm', 'r'], [8, 'cm', 'd'], [15, 'm', 'd'], [1.4, 'km', 'd']],
        ([v, x, k]) => `${k} = ${num(v)} ${x}`, ([v, x, k]) => d1(k === 'r' ? circ(v) : PI * v, x)),
      figRound('find the perimeter of each shape, correct to one decimal place.', [semiD(8, 'cm'), quad(10, 'm'), semiR(7, 'm')]),
    ],
  },
  medium: {
    ex: { stem: 'Give each answer correct to one decimal place.', parts: [
      { t: 'Arc length', fig: part({ angle: 60, R: 17, lab: '9 cm', angleLabel: '60°' }) }, 'Perimeter of the sector in part a',
      { t: 'Perimeter', fig: rectEnds(EX2.l, EX2.w, 1, 'm', { size: 24, maxH: 16 }) }, 'Radius of a circle with circumference 50 cm'] },
    exAns: [`l = 60/360 × 2 × π × 9 = ${d1(arcLen(60, 9), 'cm')}`, `P = ${num(arcLen(60, 9), 2)}… + 9 + 9 = ${d1(arcLen(60, 9) + 18, 'cm')}`,
      `P = 10 + 6 + 10 + ½ × π × 6 = ${d1(EX2.l * 2 + EX2.w + (PI * EX2.w) / 2, 'm')} (not the dashed side)`,
      `50 = 2 × π × r, so r = 50 ÷ (2 × π) = ${d1(50 / (2 * PI), 'cm')}`],
    hint: 'Arc = θ ÷ 360 × 2πr (θ = angle at the centre) · Sector P = arc + 2r · Composite: add the outside edges only',
    work: true, set: true,
    // One set: today's skill, with a question from an earlier lesson (tagged) every third question
    rounds: [(() => {
      const Q = [
        [{ t: 'Perimeter', fig: sect(120, 6, 'cm', 15)[0] }, sect(120, 6, 'cm', 15)[1]],
        [{ t: 'Perimeter', fig: track(8, 4, 'cm')[0] }, track(8, 4, 'cm')[1]],
        [{ t: 'Perimeter. Cut-out: r = 5 cm', fig: biteQuad(9, 5, 'cm')[0] }, biteQuad(9, 5, 'cm')[1]],
        [{ t: 'A kite has diagonals of 6 m and 5 m. Find its area.', from: '10.5' }, u((6 * 5) / 2, 'm²')],
        ['Find the arc length of a 120° sector with r = 3 m.', d1(arcLen(120, 3), 'm')],
        [{ t: 'Write the limits of accuracy of 4.5 m.', from: '10.2' }, limits('4.5 m')],
        ['A circle has a circumference of 18.85 m. Find its radius.', d1(18.85 / (2 * PI), 'm')],
        ['Find the perimeter of a semicircle with d = 20 cm.', d1((PI * 20) / 2 + 20, 'cm')],
        [{ t: 'Percentage error of 20 cm, to the nearest cm?', from: '10.3' }, `${num(pctErr(meas('20 cm').e, 20))}%`],
      ];
      return { text: '', items: Q.map((x) => x[0]), ans: Q.map((x) => x[1]) };
    })()],
  },
  worded: [
    { q: 'A round garden bed has a diameter of 3.2 m. Edging costs $12 per metre. Find the cost to edge the bed, to the nearest dollar.',
      a: `C = π × 3.2 = ${num(PI * 3.2, 2)} m; ${num(PI * 3.2, 2)} × $12 = $${num(Math.round(PI * 3.2 * 12))}` },
    { q: 'A bike wheel has a radius of 33 cm. How many full turns does it make to travel 1 km?',
      a: `C = 2 × π × 33 = ${num(circ(33), 1)} cm; 100 000 ÷ ${num(circ(33), 1)} = ${num(100000 / circ(33), 1)}, so ${num(Math.floor(100000 / circ(33)))} full turns` },
    { q: 'A running track is a rectangle 84 m long with a semicircle on each end. Each semicircle has a diameter of 64 m. Find one lap, to the nearest metre.',
      a: `84 + 84 + π × 64 = ${num(168 + PI * 64, 1)}, so ${u(Math.round(168 + PI * 64), 'm')}` },
  ],
};
