// Lesson 10.7 Areas of circles and sectors (three pages: Easy with the Notes box, Easy drill, then Medium with earlier
// lessons mixed in and three worded problems).
// See lib/lesson-two.js. The twin of lesson 10.6: the same circle and sector pictures, now asking for areas.
// Textbook 10.06 (second half). Every circle answer is correct to one decimal place, using the calculator's π.
const { PI, num, u, circ, area } = require('../helpers');
const S = require('../shapes');
const { C, f, T, svg, seg, dot, rightMark, arcD, FILL, SHADE } = S.parts;

const d1 = (v, unit) => u(v, unit, 1);
const A2 = (v, unit) => u(v, `${unit}²`, 1); // an area, correct to one decimal place: A2(78.54, 'cm') → '78.5 cm²'
const sectorA = (angle, r) => (angle / 360) * area(r);
const arcLen = (angle, r) => (angle / 360) * circ(r);
// Points round an arc centred at (cx, cy), from angle a0 to a1 in degrees (y up), for drawing a curved edge with shape()
const arc = (cx, cy, r, a0, a1, n = 24) => Array.from({ length: n + 1 }, (_, i) => {
  const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
});
// A circle, semicircle, quadrant or sector of radius R mm, drawn anticlockwise from its bottom radius (pointing right).
// (10.6's part(), with 'A = ?' for an area.)
// show 'r': the radius (a full circle draws it in blue; a sector labels its bottom edge), 'd': the diameter,
// 'up': a blue radius straight up (a semicircle whose radius is given). angleLabel shows the angle at the centre.
// The given length is drawn in blue. The question's unknown (ask) is marked with a ?: 'r' a dashed radius straight down
// with a measurement line beside it labelled 'r = ?'; 'A' (or 'C', 'P') written beside the shape; 'arc' the arc drawn
// in blue with 'arc = ?' by it. given: a value beside the shape that is not a length on it ('A = 78.5 cm²').
// m: the margin round the shape (a smaller one lets a small Medium sector be drawn larger in its 15 mm box).
const part = ({ angle = 360, R = 10, lab = '', show = 'r', angleLabel = '', ask = '', given = '', m = 1 }) => {
  const full = angle >= 360, rad = (a) => (a * Math.PI) / 180;
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
  if (full && ask === 'r') b += seg(c, at(270), { stroke: C.grey, w: 0.4, dash: true }) + dim(c[1], c[1] + R, 'r = ?');
  // A = ? (or C, P) beside the shape, halfway up it; a given value beside it (above the r line when r is asked)
  const top = full ? c[1] - R : c[1] - R * Math.min(1, Math.sin(rad(Math.min(angle, 90)))), bottom = full ? c[1] + R : c[1];
  if (['A', 'C', 'P'].includes(ask)) b += T(xR + 1.5, (top + bottom) / 2 + 1, `${ask} = ?`, { ...Q, anchor: 'start' });
  if (given) b += T(xR + 1.5, ask === 'r' ? c[1] - R / 2 + 1 : (top + bottom) / 2 + 1, given, { size: 3, anchor: 'start' });
  b += dot(c);
  return svg(f(Math.max(...xs) - Math.min(...xs) + 2 * m), f(Math.max(...ys) - Math.min(...ys) + 2 * m), b);
};
// A rectangle l by w with a semicircle (diameter w) on its right end, or on both ends; the joins are dashed. One round
// end: the length under the bottom edge, the width on the left edge. Both ends round: the length on a measurement line
// under the shape from one dashed join to the other (so it is not read as the length end to end), the width on one
// up its right. (As in 10.6.)
const rectEnds = (l, w, ends, unit, o = {}) => {
  const r = w / 2, L = `${num(l)} ${unit}`, W = `${num(w)} ${unit}`;
  const pts = [[0, 0], ...arc(l, r, r, -90, 90), ...(ends === 2 ? arc(0, r, r, 90, 270).slice(0, -1) : [[0, w]])];
  if (ends === 2) return S.shape({ pts, dash: [[[l, 0], [l, w]], [[0, 0], [0, w]]], dims: [[[0, 0], [l, 0], L, -1], [[l + r, 0], [l + r, w], W, -1]], ...o });
  const sides = pts.map((p, i) => (i === 0 ? L : i === pts.length - 1 ? W : ''));
  return S.shape({ pts, sides, dash: [[[l, 0], [l, w]]], right: [0], ...o });
};
// A rectangle l by w with a quadrant of radius w cut from its top right corner (the quadrant's radii dashed). The
// quadrant's radius is labelled on its dashed right-hand edge, which is also the rectangle's width. (As in 10.6.)
const biteQuad = (l, w, unit, o = {}) => {
  const pts = [[0, 0], ...arc(l, w, w, 270, 180), [0, w]];
  return S.shape({ pts, sides: [`${num(l)} ${unit}`], dash: [[[l, 0], [l, w], `${num(w)} ${unit}`, -1], [[l, w], [l - w, w]]], right: [0], ...o });
};
// A shaded ring: the outer circle's radius R (blue, from the centre down to the right, labelled just outside the
// circle) and the hole's diameter (blue, straight across the hole, labelled just above it). k: mm per unit.
const ring = (Ro, d, unit, k) => {
  const m = 1, R = Ro * k, r = (d / 2) * k, c = [m + R, m + R], a = (-28 * Math.PI) / 180, e = [c[0] + R * Math.cos(a), c[1] - R * Math.sin(a)];
  const circle = (rr, fill) => `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(rr)}" fill="${fill}" stroke="${C.charcoal}" stroke-width="0.45"/>`;
  const blue = { stroke: C.blue, w: 0.45 };
  let b = circle(R, SHADE) + circle(r, '#fff') + seg([c[0] - r, c[1]], [c[0] + r, c[1]], blue) + seg(c, e, blue);
  b += T(c[0], c[1] - 1.4, `${num(d)} ${unit}`, { size: 2.8 }) + T(e[0] + 1, e[1] + 1.9, `${num(Ro)} ${unit}`, { size: 3, anchor: 'start' });
  return svg(f(2 * R + 2 * m), f(2 * R + 2 * m), b + dot(c));
};

// Each question: [picture, answer, caption?, own formula?]
const circleQ = (v, unit, k, R) => [part({ R, lab: `${num(v)} ${unit}`, show: k, ask: 'A' }), A2(area(k === 'd' ? v / 2 : v), unit)];
const semiD = (d, unit, R = 16) => [part({ angle: 180, R, lab: `${num(d)} ${unit}`, show: 'd', ask: 'A' }), A2(area(d / 2) / 2, unit)];
const semiR = (r, unit, R = 16) => [part({ angle: 180, R, lab: `${num(r)} ${unit}`, show: 'up', ask: 'A' }), A2(area(r) / 2, unit)];
const quad = (r, unit, R = 19) => [part({ angle: 90, R, lab: `${num(r)} ${unit}`, ask: 'A' }), A2(area(r) / 4, unit)];
const sect = (angle, r, unit, R, ask = 'A', m) => [part({ angle, R, lab: `${num(r)} ${unit}`, angleLabel: `${angle}°`, ask, m }), A2(sectorA(angle, r), unit)];
// Formula questions (Formula / Substitute / Answer lines) from [picture, answer, text?, formula?], with the round's formula
// printed (a string) or left for students to write (true)
const formFig = (list, form) => ({ items: list.map(([fig, , t = '', own]) => ({ t, fig, form: own || form })), ans: list.map((x) => x[1]) });

// The teacher's examples
const EX2 = { l: 10, w: 6, R: 10, d: 16, A: 50 };

// The Notes diagram: a circle with its centre, radius, diameter and a shaded sector (with the angle θ at its centre)
const notesFig = () => {
  const R = 13, a0 = 15, a1 = 85, c = [R + 3, R + 3];
  const at = (a, r = R) => [c[0] + r * Math.cos((a * Math.PI) / 180), c[1] - r * Math.sin((a * Math.PI) / 180)];
  const s = arcD(c, R, a0, a1), th = arcD(c, 3.4, a0, a1), mid = (a0 + a1) / 2;
  let b = `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${R}" fill="${FILL}" stroke="${C.charcoal}" stroke-width="0.45"/>`;
  b += `<path d="M${f(c[0])},${f(c[1])} L${f(s.p0[0])},${f(s.p0[1])} ${s.d} Z" fill="${SHADE}" stroke="${C.charcoal}" stroke-width="0.4"/>`;
  b += `<path d="M${f(th.p0[0])},${f(th.p0[1])} ${th.d}" fill="none" stroke="${C.charcoal}" stroke-width="0.3"/>`;
  b += seg(at(180), at(0), { stroke: C.charcoal, w: 0.45 }) + seg(c, at(a1), { stroke: C.blue, w: 0.6 }) + dot(c);
  b += T(c[0], c[1] + 3.6, 'diameter d', { size: 2.5 }) + T(at(a1, R * 0.5)[0] - 1.2, at(a1, R * 0.5)[1] + 1, 'r', { size: 2.8, anchor: 'end', weight: 600, fill: C.blue });
  b += T(at(mid, 5.6)[0], at(mid, 5.6)[1] + 1, 'θ', { size: 2.6 }) + T(at(mid, R * 0.62)[0], at(mid, R * 0.62)[1] + 1, 'sector', { size: 2.4 });
  b += T(c[0], c[1] + R + 3.8, 'circle: A = πr²', { size: 2.5 });
  return svg(f(2 * R + 6), f(2 * R + 8), b);
};

module.exports = {
  code: '10.7', title: 'Areas of circles and sectors',
  li: 'find the areas of circles, semicircles, quadrants, sectors and composite shapes.',
  sc: ['use A = πr² to find the area of a circle', 'find the area of a sector: θ ÷ 360 × πr²', 'find composite and shaded areas'],
  notes: {
    terms: [['area (A)', 'the space inside a shape, in square units'], ['radius (r)', 'from the centre to the edge'], ['diameter (d)', 'across through the centre; r = d ÷ 2'],
      ['semicircle', 'half a circle'], ['quadrant', 'a quarter of a circle'], ['sector', 'a slice between two radii, angle θ'],
      ['shaded area', 'the whole shape − the part cut out']],
    formulas: ['Circle: A = πr²', 'Semicircle: A = ½πr²', 'Quadrant: A = ¼πr²', 'Sector: A = θ ÷ 360 × πr²', 'Ring: A = πR² − πr² (R outer, r inner)'],
    steps: ['r = d ÷ 2', 'write the formula', 'substitute (π key)', 'round to 1 d.p. + unit²'],
    fig: notesFig(),
  },
  easy: {
    ex: { stem: 'Find the area of each shape, correct to one decimal place.', parts: [
      { t: 'Area', fig: part({ R: 9.5, lab: '5 cm' }) }, { t: 'Area', fig: part({ R: 9.5, lab: '12 m', show: 'd' }) },
      { t: 'Area', fig: part({ angle: 180, R: 14, lab: '10 cm', show: 'd' }) }, { t: 'Area', fig: part({ angle: 90, R: 14.5, lab: '6 m' }) }] },
    exAns: [`A = π × 5² = ${A2(area(5), 'cm')}`, `r = 12 ÷ 2 = 6 m; A = π × 6² = ${A2(area(6), 'm')}`,
      `r = 10 ÷ 2 = 5 cm; A = ½ × π × 5² = ${A2(area(5) / 2, 'cm')}`, `A = ¼ × π × 6² = ${A2(area(6) / 4, 'm')}`],
    hint: 'A = πr² · r = d ÷ 2 · Use the π key, then round to one decimal place · Area units: cm², m².',
    work: true,
    // Small steps: A = πr² with the radius given, then with the diameter given (the formula printed on the Formula line).
    // Each question is its diagram: the given length on it, the unknown marked with a ?. The round heading says what to find.
    rounds: [
      { text: 'find the area of each circle. The radius is given.', cols: 4, ...formFig([[3, 'cm'], [7, 'm'], [5, 'm'], [9, 'cm']]
        .map(([v, x]) => circleQ(v, x, 'r', 8)), 'A = πr²') },
      { text: 'find the area. The diameter is given: halve it first.', cols: 4, ...formFig([[8, 'cm'], [12, 'm'], [2, 'm'], [20, 'cm']]
        .map(([v, x]) => circleQ(v, x, 'd', 8)), 'A = πr²') },
    ],
  },
  // Page 2: more drill. Choose r or d, then semicircles, quadrants and sectors (formula given).
  drill: {
    hint: 'A = πr² · Semicircle A = ½πr² · Quadrant A = ¼πr² · Sector A = θ ÷ 360 × πr² · Halve d first.',
    rounds: [
      { text: 'is it r or d? Write the formula, then find the area.', ...formFig([[11, 'mm', 'r'], [16, 'cm', 'd'], [1.5, 'm', 'r']]
        .map(([v, x, k]) => circleQ(v, x, k, 11)), true) },
      { text: 'find the area of each semicircle.', ...formFig([semiD(8, 'cm'), semiD(12, 'm'), semiR(7, 'm')], 'A = ½πr²') },
      { text: 'find the area of each quadrant.', ...formFig([quad(4, 'cm'), quad(9, 'm'), quad(5, 'cm')], 'A = ¼πr²') },
      { text: 'find the area of each sector.', ...formFig([sect(60, 9, 'cm', 20), sect(120, 3, 'm', 16), sect(45, 4, 'cm', 22)], 'A = θ ÷ 360 × πr²') },
    ],
  },
  medium: {
    ex: { stem: 'Give each answer correct to one decimal place.', parts: [
      { t: 'Area', fig: part({ angle: 120, R: 10, lab: '9 cm', angleLabel: '120°' }) }, { t: 'Area', fig: rectEnds(EX2.l, EX2.w, 1, 'm', { size: 24, maxH: 12 }) },
      { t: 'Shaded area', fig: ring(EX2.R, EX2.d, 'm', 0.75) }, { t: 'Radius', fig: part({ R: 6.5, ask: 'r', given: `A = ${num(EX2.A)} cm²` }) }] },
    exAns: [`A = 120 ÷ 360 × π × 9² = ${A2(sectorA(120, 9), 'cm')}`,
      `A = 10 × 6 + ½ × π × 3² = 60 + ${num(area(3) / 2, 1)} = ${A2(EX2.l * EX2.w + area(EX2.w / 2) / 2, 'm')}`,
      `r = ${num(EX2.d)} ÷ 2 = ${num(EX2.d / 2)} m; A = π × ${num(EX2.R)}² − π × ${num(EX2.d / 2)}² = ${num(area(EX2.R), 1)} − ${num(area(EX2.d / 2), 1)} = ${A2(area(EX2.R) - area(EX2.d / 2), 'm')}`,
      `${num(EX2.A)} = π × r², so r² = ${num(EX2.A)} ÷ π = ${num(EX2.A / PI, 1)} and r = √${num(EX2.A / PI, 1)} = ${d1(Math.sqrt(+(EX2.A / PI).toFixed(1)), 'cm')}`],
    hint: 'Sector A = θ ÷ 360 × πr² · Composite: add the parts · Shaded: whole − cut-out · Radius: r² = A ÷ π, then √',
    work: true, set: true,
    // One set: today's skill, building from sectors to composite shapes and finding the radius, with a question from an
    // earlier lesson (tagged) in each row. Every question is its diagram, with a word or two saying what to find, and
    // Formula / Substitute / Answer lines (form: true).
    rounds: [(() => {
      const ff = ([fig, a], t = 'Area', from) => [{ t, fig, form: true, ...(from ? { from } : {}) }, a];
      const Q = [
        ff(sect(72, 10, 'cm', 10, '', 0.4)),
        // the height on a measurement line beside the trapezium (the dashed height inside is too short to hold its label)
        ff([S.trap(9, 5, 4, 2, { sides: ['9 m', '', '5 m', ''], dims: [[[9, 0], [9, 4], '4 m', -1]], size: 15, maxH: 6.4 }), u(((9 + 5) / 2) * 4, 'm²')], 'Area', '10.5'),
        ff(sect(150, 6, 'm', 8, '')),
        ff([rectEnds(8, 4, 2, 'cm', { size: 20, maxH: 6 }), A2(8 * 4 + area(2), 'cm')]),
        ff([part({ angle: 80, R: 9.8, m: 0.4, lab: '9 m', angleLabel: '80°' }), d1(arcLen(80, 9) + 2 * 9, 'm')], 'Perimeter', '10.6'),
        ff([S.shape({ pts: [[0, 0], [8, 0], [8, 8], [0, 8]], sides: ['8 cm', '8 cm'], shade: true, circles: [[4, 4, 4]], size: 8.5, maxH: 8.5, m: 1 }), A2(8 * 8 - area(4), 'cm')], 'Shaded area'),
        ff([biteQuad(9, 5, 'cm', { size: 16, maxH: 8 }), A2(9 * 5 - area(5) / 4, 'cm')]),
        ff([part({ angle: 180, R: 9, lab: '16 cm', show: 'd' }), d1((PI * 16) / 2 + 16, 'cm')], 'Perimeter', '10.6'),
        ff([part({ R: 5.5, ask: 'r', given: 'A = 28.3 m²' }), d1(Math.sqrt(+(28.3 / PI).toFixed(1)), 'm')], 'Radius'),
      ];
      return { text: '', items: Q.map((x) => x[0]), ans: Q.map((x) => x[1]) };
    })()],
  },
  worded: [
    { q: 'A garden sprinkler sprays water 6 m and turns through an angle of 120°. Find the area of lawn it waters.',
      a: `A = 120 ÷ 360 × π × 6² = ${A2(sectorA(120, 6), 'm')}` },
    { q: 'A round pond has a radius of 3 m. A path 1 m wide goes all the way around it. Find the area of the path.',
      a: `R = 3 + 1 = 4 m; A = π × 4² − π × 3² = ${num(area(4), 1)} − ${num(area(3), 1)} = ${A2(area(4) - area(3), 'm')}` },
    { q: 'A pizza has a diameter of 30 cm. It is cut into 8 equal slices. Find the area of one slice.',
      a: `r = 30 ÷ 2 = 15 cm; A = π × 15² = ${num(area(15), 1)} cm²; ${num(area(15), 1)} ÷ 8 = ${A2(+area(15).toFixed(1) / 8, 'cm')}` },
  ],
};
