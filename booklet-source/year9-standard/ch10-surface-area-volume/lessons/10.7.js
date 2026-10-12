// Lesson 10.7 Areas of circles and sectors (two pages: Easy, then Medium, then Mixed practice). See lib/lesson-two.js.
// Textbook 10.06 (second half). Every picture is drawn from the same numbers that give its answer.
// The circle pictures are drawn here (with shapes.js parts), not with shapes.js sector(), ring() and rectSemi(): those
// keep a 5-6 mm margin, so in a quarter-width cell they shrink and their labels get too small to read. These fill the
// cell (maxW, maxH: the most room a picture may take, in mm) and keep every label clear of the lines.
const { F, PI, num, u, circ, area, meas, pctErr, round, mix } = require('../helpers');
const { C, f, T, svg, seg, poly, dot, rightMark, arcD, rad, FILL, SHADE } = require('../shapes').parts;

const INK = C.charcoal, BLUE = { stroke: C.blue, w: 0.45 };
const circleD = (c, r, fill) => `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(r)}" fill="${fill}" stroke="${INK}" stroke-width="0.45"/>`;
const textW = (s, size) => String(s).length * size * 0.58; // as shapes.js T measures a label
const BOX = { maxW: 33, maxH: 24 }; // a picture in a YOU DO round; the WE DO pictures are 21 mm high
const EXBOX = { maxW: 33, maxH: 21 };

// A circle (angle 360), semicircle, quadrant or sector, starting at rot degrees (0 or 180: the first radius is level).
// lab is the radius (on the first radius; a full circle draws it) or, with show 'd', the diameter (a semicircle's flat
// edge, or a line across a full circle). A full circle's label is inside it; a sector's is outside, by its flat edge.
const disc = ({ angle = 360, rot = 0, lab = '', show = 'r', angleLabel = '', maxW, maxH }) => {
  const m = 1, full = angle >= 360;
  const ang = [rot, rot + angle, ...[0, 90, 180, 270, 360, 450, 540].filter((a) => a > rot && a < rot + angle)];
  const pts = full ? [[-1, -1], [1, 1]] : [[0, 0], ...ang.map((a) => [Math.cos(rad(a)), Math.sin(rad(a))])];
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const below = Math.cos(rad(rot)) > 0; // a sector's label: below its first radius (rot 0) or above it (rot 180)
  const roomForLab = lab && !full && (below ? Math.min(...ys) > -0.3 : Math.max(...ys) < 0.3) ? 4.6 : 0;
  const R = Math.min((maxW - 2 * m) / (Math.max(...xs) - Math.min(...xs)), (maxH - 2 * m - roomForLab) / (Math.max(...ys) - Math.min(...ys)));
  const c = [m - Math.min(...xs) * R, m + roomForLab * (below ? 0 : 1) + Math.max(...ys) * R];
  const at = (a, r = R) => [c[0] + r * Math.cos(rad(a)), c[1] - r * Math.sin(rad(a))];
  let b;
  if (full) b = circleD(c, R, FILL);
  else { const a = arcD(c, R, rot, rot + angle); b = `<path d="M${f(c[0])},${f(c[1])} L${f(a.p0[0])},${f(a.p0[1])} ${a.d} Z" fill="${FILL}" stroke="${INK}" stroke-width="0.45"/>`; }
  b += dot(c);
  if (!full && Math.abs(angle - 90) < 0.01) b += rightMark(c, at(rot, 1), at(rot + 90, 1), 2.2);
  if (angleLabel) {
    // the angle's number sits inside the sector, clear of both radii, the angle's arc and the curved edge. A reflex
    // angle has room for it straight up, down or across (wherever it reaches out least), not only along the middle.
    const mid = rot + angle / 2, w = textW(angleLabel, 2.8), h = 2.8;
    const ext = (phi) => (w / 2) * Math.abs(Math.cos(rad(phi))) + (h / 2) * Math.abs(Math.sin(rad(phi)));
    const sideDist = angle >= 180 ? 0 : (Math.max(ext(rot + 90), ext(rot + angle + 90)) + 0.7) / Math.sin(rad(angle / 2));
    const dirs = angle > 180 ? [mid, ...[0, 90, 180, 270, 360, 450, 540].filter((a) => a > rot + 30 && a < rot + angle - 30)] : [mid];
    const dist = (phi) => Math.min(Math.max(angle > 180 ? 0 : 6.6, sideDist, 3.4 + 0.8 + ext(phi)), R - ext(phi) - 0.8);
    const dir = dirs.reduce((best, phi) => (dist(phi) + ext(phi) < dist(best) + ext(best) ? phi : best));
    const p = at(dir, dist(dir)), a = arcD(c, 3.4, rot, rot + angle);
    b += `<path d="M${f(a.p0[0])},${f(a.p0[1])} ${a.d}" fill="none" stroke="${C.blue}" stroke-width="0.35"/>`;
    b += T(p[0], p[1] + 0.9, angleLabel, { size: 2.8, fill: C.blue, weight: 600 });
  }
  if (lab) {
    const e = at(rot);
    if (full) b += seg(show === 'd' ? at(rot + 180) : c, e, BLUE);
    const x = show === 'd' ? c[0] : c[0] + (e[0] - c[0]) * (full ? 0.45 : 0.5);
    // a full circle: just above its radius or diameter; a sector: just outside its first radius (or flat edge)
    const y = full || !below ? c[1] - 1.5 : c[1] + 3.5;
    b += T(x, y, lab, { size: 3 });
  }
  return svg(f(R * (Math.max(...xs) - Math.min(...xs)) + 2 * m), f(R * (Math.max(...ys) - Math.min(...ys)) + 2 * m + roomForLab), b);
};

// A ring (annulus): the outer radius to the upper right, labelled outside the ring; the inner radius to the left, its
// label just below the centre (inside the hole). The shaded ring is the area to find.
const ringFig = ({ R, r, labR, labr, maxH }) => {
  const m = 1, k = (maxH - 2 * m) / (2 * R), c = [m + R * k, m + R * k], e = [c[0] + R * k * Math.cos(rad(35)), c[1] - R * k * Math.sin(rad(35))];
  let b = circleD(c, R * k, SHADE) + circleD(c, r * k, '#fff') + dot(c);
  b += seg(c, e, BLUE) + seg(c, [c[0] - r * k, c[1]], BLUE);
  b += T(e[0] + 1, e[1] - 0.8, labR, { size: 2.9, anchor: 'start' }) + T(c[0], c[1] + 3.3, labr, { size: 2.7 });
  return svg(f(2 * R * k + 2 * m), f(2 * R * k + 2 * m), b);
};

// A rectangle l by w with a semicircle (diameter w) on its right end, or on both ends (ends 2). The dashed lines are
// the semicircles' diameters; the width is labelled beside the right one, inside the rectangle.
const capsule = ({ l, w, ends = 1, labL, labW, maxW, maxH }) => {
  const m = 1, r = w / 2, k = Math.min((maxW - 2 * m) / (l + r * ends), (maxH - 2 * m - 4.4) / w);
  const X = (x) => m + (ends === 2 ? r * k : 0) + x * k, y0 = m, H = w * k, R = r * k;
  const leftEnd = ends === 2 ? `L${f(X(0))},${f(y0 + H)} A${f(R)},${f(R)} 0 0 1 ${f(X(0))},${f(y0)}` : `L${f(X(0))},${f(y0 + H)} Z`;
  let b = `<path d="M${f(X(0))},${f(y0)} L${f(X(l))},${f(y0)} A${f(R)},${f(R)} 0 0 1 ${f(X(l))},${f(y0 + H)} ${leftEnd}" fill="${FILL}" stroke="${INK}" stroke-width="0.45"/>`;
  b += seg([X(l), y0], [X(l), y0 + H], { stroke: C.grey, w: 0.3, dash: true });
  if (ends === 2) b += seg([X(0), y0], [X(0), y0 + H], { stroke: C.grey, w: 0.3, dash: true });
  b += T((X(0) + X(l)) / 2, y0 + H + 3.6, labL) + T(X(l) - 1.2, y0 + H / 2 + 1.1, labW, { anchor: 'end' });
  return svg(f((l + r * ends) * k + 2 * m), f(H + 2 * m), b);
};

// A shaded rectangle l by w with a white circle cut out (centre cx, cy and radius r, in the question's units, y up).
// labD labels the circle's diameter on a line across it (the label just above the line).
const holedFig = ({ l, w, hole: [cx, cy, r], labL, labW, labD = '', maxW, maxH }) => {
  const m = 1, k = Math.min((maxW - 2 * m - textW(labW, 2.8) - 1.6) / l, (maxH - 2 * m - 4.4) / w);
  const map = ([x, y]) => [m + x * k, m + (w - y) * k], c = map([cx, cy]);
  let b = poly([[0, 0], [l, 0], [l, w], [0, w]].map(map), SHADE) + circleD(c, r * k, '#fff');
  if (labD) b += seg([c[0] - r * k, c[1]], [c[0] + r * k, c[1]], BLUE) + T(c[0], c[1] - 1.5, labD);
  b += T(m + (l * k) / 2, m + w * k + 3.6, labL) + T(m + l * k + 1.4, m + (w * k) / 2 + 1.1, labW, { anchor: 'start' });
  return svg(f(l * k + 2 * m), f(w * k + 2 * m), b);
};

// Areas correct to one decimal place, with the unit squared: A(78.54, 'cm') → '78.5 cm²'
const A = (v, unit) => u(v, `${unit}²`, 1);
const L = (v, unit) => `${num(v)} ${unit}`;
// Each picture question: [{ t, fig }, answer]. box: BOX (a YOU DO round) or EXBOX (a WE DO example).
const circleQ = (r, unit, show = 'r', box = BOX) => [{ t: 'Circle', fig: disc({ lab: L(show === 'd' ? 2 * r : r, unit), show, ...box }) }, A(area(r), unit)];
const semiQ = (d, unit, rot = 0, box = BOX) => [{ t: 'Semicircle', fig: disc({ angle: 180, rot, lab: L(d, unit), show: 'd', ...box }) }, A(area(d / 2) / 2, unit)];
const quadQ = (r, unit, rot = 0, box = BOX) => [{ t: 'Quadrant', fig: disc({ angle: 90, rot, lab: L(r, unit), ...box }) }, A(area(r) / 4, unit)];
const sectorQ = (angle, r, unit, rot = 0, box = BOX) => [{ t: '', fig: disc({ angle, rot, lab: L(r, unit), angleLabel: `${angle}°`, ...box }) }, A((angle / 360) * area(r), unit)];
const ringQ = (R, r, unit, box = BOX) => [{ t: 'Shaded area', fig: ringFig({ R, r, labR: L(R, unit), labr: L(r, unit), ...box }) }, A(area(R) - area(r), unit)];
const capsuleQ = (l, w, unit, ends = 1, box = BOX) => [{ t: '', fig: capsule({ l, w, ends, labL: L(l, unit), labW: L(w, unit), ...box }) }, A(l * w + (ends * area(w / 2)) / 2, unit)];
const holedQ = (l, w, hole, unit, labD, box = BOX) => [{ t: 'Shaded area', fig: holedFig({ l, w, hole, labL: L(l, unit), labW: L(w, unit), labD: labD ? L(2 * hole[2], unit) : '', ...box }) }, A(l * w - area(hole[2]), unit)];
const figRound = (text, list) => ({ text, items: list.map((x) => x[0]), ans: list.map((x) => x[1]), cols: 4 });

// The teacher's examples
const EX1 = [circleQ(5, 'cm', 'r', EXBOX), circleQ(6, 'm', 'd', EXBOX), semiQ(10, 'cm', 0, EXBOX), quadQ(6, 'm', 0, EXBOX)];
const EX2 = [sectorQ(120, 9, 'cm', 0, EXBOX), capsuleQ(10, 6, 'm', 1, EXBOX), ringQ(10, 6, 'cm', EXBOX), holedQ(8, 8, [4, 4, 4], 'cm', false, EXBOX)];

module.exports = {
  code: '10.7', title: 'Areas of circles and sectors',
  li: 'find the area of circles, semicircles, quadrants, sectors and composite shapes.',
  sc: ['use A = πr² to find the area of a circle', `find the area of a sector: A = ${F('θ', 360)} × πr²`, 'find composite and shaded areas'],
  easy: {
    ex: { stem: 'Find the area of each shape, correct to one decimal place.', parts: EX1.map((x) => x[0]) },
    exAns: [`A = π × 5² = ${EX1[0][1]}`, `r = 12 ÷ 2 = 6 m; A = π × 6² = ${EX1[1][1]}`, `r = 10 ÷ 2 = 5 cm; A = ½ × π × 5² = ${EX1[2][1]}`, `A = ¼ × π × 6² = ${EX1[3][1]}`],
    hint: 'A = πr² · r = d ÷ 2 · Semicircle: ½ of a circle · Quadrant: ¼ of a circle · Use the π key, then round.',
    rounds: [
      round('find the area of each circle, correct to one decimal place.', [[3, 'cm'], [7, 'm'], [10, 'mm'], [4, 'cm'], [2.5, 'm'], [9, 'cm'], [1.5, 'km'], [12, 'm']],
        ([r, unit]) => `r = ${L(r, unit)}`, ([r, unit]) => A(area(r), unit)),
      round('find the area of each circle. Halve the diameter first. Correct to one decimal place.', [[16, 'm'], [22, 'mm'], [2, 'm'], [30, 'cm'], [7, 'cm'], [26, 'm'], [50, 'cm'], [1.2, 'km']],
        ([d, unit]) => `d = ${L(d, unit)}`, ([d, unit]) => A(area(d / 2), unit)),
      figRound('find the area of each shape, correct to one decimal place.', [semiQ(14, 'cm'), quadQ(8, 'm'), semiQ(20, 'm', 180), quadQ(11, 'cm', 180)]),
    ],
  },
  medium: {
    ex: { stem: 'Find each area, correct to one decimal place.', parts: [{ ...EX2[0][0], t: 'Sector' }, { ...EX2[1][0], t: 'Area' }, EX2[2][0], EX2[3][0]] },
    exAns: [`A = ${F(120, 360)} × π × 9² = ${EX2[0][1]}`, `10 × 6 + ½ × π × 3² = 60 + ${num(area(3) / 2, 1)} = ${EX2[1][1]}`,
      `π × 10² − π × 6² = ${num(area(10), 1)} − ${num(area(6), 1)} = ${EX2[2][1]}`, `the circle’s diameter is 8 cm: 8 × 8 − π × 4² = 64 − ${num(area(4), 1)} = ${EX2[3][1]}`],
    hint: `Sector: A = ${F('θ', 360)} × πr² (θ = the angle at the centre) · Composite: add the parts · Shaded: whole − white part · Ring: πR² − πr² (R = outer radius, r = inner radius)`,
    rounds: [
      figRound('find the area of each sector, correct to one decimal place.', [sectorQ(60, 6, 'cm'), sectorQ(270, 4, 'm'), sectorQ(45, 12, 'cm'), sectorQ(150, 8, 'm', 180)]),
      figRound('find each area, correct to one decimal place.', [ringQ(8, 5, 'm'), capsuleQ(14, 8, 'cm'), capsuleQ(12, 4, 'm', 2), holedQ(10, 8, [5, 4, 3], 'cm', true)]),
    ],
  },
  mixed: mix(
    ['Find the area of a quadrant with radius 4 cm.', A(area(4) / 4, 'cm'), '10.7'],
    ['Find the circumference of a circle, d = 10 m.', u(circ(10 / 2), 'm', 1), '10.6'],
    ['A sprinkler waters a circle of radius 4.5 m. Area watered?', A(area(4.5), 'm'), '10.7'],
    ['A rhombus has diagonals 8 m and 5 m. Area?', u((8 * 5) / 2, 'm²'), '10.5'],
    ['A pizza of diameter 30 cm is cut into 8 equal slices. Area of one slice?', `${A(area(30 / 2) / 8, 'cm')} (r = 15 cm; each slice is a ${360 / 8}° sector)`, '10.7'],
    ['A radius is 4 cm, to the nearest cm. Percentage error?', `${num(pctErr(meas('4 cm').e, 4))}%`, '10.3'],
    ['A circle has area 153.9 cm². Find its radius (÷\u00a0π,\u00a0then\u00a0√).', `${u(Math.sqrt(153.9 / PI), 'cm', 0)} (r² = 153.9 ÷ π ≈ ${num(153.9 / PI, 0)})`, '10.7'],
    ['A 10 m by 10 m yard has a round pond of radius 2 m. The rest is lawn. Lawn area?', A(10 * 10 - area(2), 'm'), '10.7'],
  ),
};
