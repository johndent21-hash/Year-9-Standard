// Lesson 10.9 Surface area of a cylinder (three pages: Easy with the Notes box, Easy drill, then Medium with earlier
// lessons mixed in and three worded problems).
// See lib/lesson-two.js. Textbook 10.08. Every picture is drawn to scale from the same numbers that give its answer,
// and every answer is correct to one decimal place, using the calculator's π.
// The cylinders, nets and solids are drawn here (with shapes.js parts), not with shapes.js cylinder(): that keeps a 6 mm
// margin round the picture, so in a question box it shrinks and its labels get too small. These are drawn at print
// size (k: mm per unit of the question) and keep every label outside the outlines.
const { PI, num, u, area } = require('../helpers');
const { C, f, T, svg, seg, poly, dot, rad, FILL, SHADE, SIDE, TOP } = require('../shapes').parts;

const A2 = (v, unit) => u(v, `${unit}²`, 1); // an area, correct to one decimal place: A2(78.54, 'cm') → '78.5 cm²'
const L = (v, unit) => `${num(v)} ${unit}`;
const curved = (r, h) => 2 * PI * r * h;
const SA = (r, h, ends = 2) => ends * area(r) + curved(r, h); // ends: 2 closed, 1 no lid, 0 open at both ends
const halfSA = (r, l) => area(r) + PI * r * l + 2 * r * l; // a closed half cylinder: two half circles, half the curved surface, the flat base
// Working that adds rounded parts: 'a + b = total', shown only when the rounded parts add up to the rounded total
const addUp = (parts, unit) => {
  const tot = parts.reduce((t, v) => t + v, 0), r1 = (v) => Math.round(v * 10) / 10;
  return Math.abs(parts.reduce((t, v) => t + r1(v), 0) - r1(tot)) < 1e-9 ? `${parts.map((v) => num(v, 1)).join(' + ')} = ${A2(tot, unit)}` : A2(tot, unit);
};

const INK = C.charcoal, BLUE = { stroke: C.blue, w: 0.45 }, GREY = { stroke: C.grey, w: 0.3 };
const LAB = { size: 3 }, Q = { size: 3, weight: 700 }; // a given length; the unknown (?)
const INSIDE = '#d5d8de'; // the inside wall seen through an open top: a neutral grey, never the blue that marks a surface asked for
const tw = (s, size = 3) => String(s).length * size * 0.58; // a label's width, as shapes.js T measures it
// A measurement line up the side, x from y0 to y1, with ticks; its label to the left (side −1) or right (side 1)
const vDim = (x, y0, y1, t, side = -1, o = LAB) => seg([x, y0], [x, y1], GREY) + seg([x - 0.7, y0], [x + 0.7, y0], GREY) + seg([x - 0.7, y1], [x + 0.7, y1], GREY)
  + T(x + side * 1.2, (y0 + y1) / 2 + 1, t, { ...o, anchor: side < 0 ? 'end' : 'start' });
// A measurement line across, y from x0 to x1, with ticks; its label below it
const hDim = (y, x0, x1, t, o = LAB) => seg([x0, y], [x1, y], GREY) + seg([x0, y - 0.7], [x0, y + 0.7], GREY) + seg([x1, y - 0.7], [x1, y + 0.7], GREY)
  + T((x0 + x1) / 2, y + 3.6, t, o);

// A cylinder standing up, r and h in the question's units, drawn k mm per unit.
//   lab: the radius (a blue radius on the top) or, with show 'd', the diameter (a blue line across the top); its label
//   sits above the top. hLab: the height, on a measurement line up the left. shade: 'top' or 'side' shades the surface
//   asked for. open: no lid (the inside shows through the top). ask: the unknown, written beside the shape: 'top'
//   'A = ?' beside the top, 'A' or 'SA' halfway up the side.
const cyl = ({ r, h, k, lab = '', show = 'r', hLab = '', shade = '', open = false, ask = '' }) => {
  const R = r * k, E = 0.32 * R, H = h * k, m = 0.5, cx = m + (hLab ? 1.6 : 0) + R, top = E + (lab ? 3.6 : m), bot = top + H;
  let b = `<path d="M${f(cx - R)},${f(top)} L${f(cx - R)},${f(bot)} A${f(R)},${f(E)} 0 0 0 ${f(cx + R)},${f(bot)} L${f(cx + R)},${f(top)}" fill="${shade === 'side' ? SHADE : SIDE}" stroke="${INK}" stroke-width="0.45"/>`;
  b += `<path d="M${f(cx - R)},${f(bot)} A${f(R)},${f(E)} 0 0 1 ${f(cx + R)},${f(bot)}" fill="none" stroke="${C.grey}" stroke-width="0.3" stroke-dasharray="1.2 0.9"/>`;
  b += `<ellipse cx="${f(cx)}" cy="${f(top)}" rx="${f(R)}" ry="${f(E)}" fill="${open ? '#fff' : shade === 'top' ? SHADE : FILL}" stroke="${INK}" stroke-width="0.45"/>`;
  // no lid: the inside of the far wall shows as a grey crescent at the back of the opening, down to where it meets the
  // floor (an arc bulging up); the rest of the opening stays white, so the top reads as a hole and not a shaded end
  if (open) b += `<path d="M${f(cx - R)},${f(top)} A${f(R)},${f(E)} 0 0 1 ${f(cx + R)},${f(top)} A${f(R)},${f(E * 0.55)} 0 0 0 ${f(cx - R)},${f(top)} Z" fill="${INSIDE}" stroke="${INK}" stroke-width="0.3"/>`;
  if (lab) {
    b += show === 'd' ? seg([cx - R, top], [cx + R, top], BLUE) : seg([cx, top], [cx + R, top], BLUE);
    b += dot([cx, top], 0.45) + T(show === 'd' ? cx : cx + R / 2, top - E - 1, lab, LAB);
  }
  if (hLab) b += vDim(cx - R - 1.6, top, bot, hLab, -1, hLab.includes('?') ? Q : LAB);
  if (ask === 'top') b += T(cx + R + 1.5, top + 2, 'A = ?', { ...Q, anchor: 'start' });
  else if (ask) b += T(cx + R + 1.5, (top + bot) / 2 + 1, `${ask} = ?`, { ...Q, anchor: 'start' });
  return svg(f(cx + R + m), f(bot + E + m), b);
};
// The net of a cylinder, r and h in the question's units, drawn k mm per unit: the curved surface unrolled (a rectangle
// 2πr long and h high) with a circle on its top edge and (ends 2) one on its bottom edge. lab: the radius, in blue in the
// top circle, labelled beside it. hLab: the height, beside the rectangle's left edge. len: a measurement line under the
// rectangle (ends 1), labelled with its length ('2πr'). ask 'SA': 'SA = ?' beside the rectangle.
const net = ({ r, h, k, lab = '', hLab = '', ends = 2, len = '', ask = '', o = LAB }) => {
  const R = r * k, W = 2 * PI * r * k, H = h * k, m = 0.5, x0 = m, y0 = m + 2 * R, cx = x0 + W / 2;
  const circle = (cy) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R)}" fill="${FILL}" stroke="${INK}" stroke-width="0.45"/>`;
  let b = poly([[x0, y0], [x0 + W, y0], [x0 + W, y0 + H], [x0, y0 + H]], SIDE) + circle(y0 - R) + (ends === 2 ? circle(y0 + H + R) : '');
  if (lab) b += seg([cx, y0 - R], [cx + R, y0 - R], BLUE) + dot([cx, y0 - R], 0.45) + T(cx + R + 1.2, y0 - R + 1, lab, { ...o, anchor: 'start' });
  if (hLab) b += T(x0 - 1.4, y0 + H / 2 + 1, hLab, { ...o, anchor: 'end' });
  if (len) b += hDim(y0 + H + 2.2, x0, x0 + W, len, { ...o, fill: C.blue, weight: 600 });
  if (ask) b += T(x0 + W + 1.5, y0 + H / 2 + 1, `${ask} = ?`, { ...Q, anchor: 'start' });
  return svg(f(x0 + W + m), f(y0 + H + (ends === 2 ? 2 * R : 0) + m), b);
};
// A cylinder lying on its side, r and l (its length) in the question's units, drawn k mm per unit: the right-hand end
// shows, with its diameter in blue labelled beside it; the length is on a measurement line underneath.
const lying = ({ r, l, k, dLab, lLab }) => {
  const R = r * k, e = 0.32 * R, W = l * k, m = 0.5, xL = m + e, xR = xL + W, cy = m + R;
  let b = `<path d="M${f(xL)},${f(cy - R)} L${f(xR)},${f(cy - R)} L${f(xR)},${f(cy + R)} L${f(xL)},${f(cy + R)} A${f(e)},${f(R)} 0 0 1 ${f(xL)},${f(cy - R)} Z" fill="${SIDE}" stroke="${INK}" stroke-width="0.45"/>`;
  b += `<path d="M${f(xL)},${f(cy - R)} A${f(e)},${f(R)} 0 0 1 ${f(xL)},${f(cy + R)}" fill="none" stroke="${C.grey}" stroke-width="0.3" stroke-dasharray="1.2 0.9"/>`;
  b += `<ellipse cx="${f(xR)}" cy="${f(cy)}" rx="${f(e)}" ry="${f(R)}" fill="${FILL}" stroke="${INK}" stroke-width="0.45"/>`;
  b += seg([xR, cy - R], [xR, cy + R], BLUE) + T(xR + e + 1.2, cy + 1, dLab, { ...LAB, anchor: 'start' });
  b += hDim(cy + R + 2.2, xL, xR, lLab);
  return svg(f(xR + e + m), f(cy + R + m), b);
};
// A half cylinder lying on its flat face, r and l (its length) in the question's units, drawn k mm per unit. The front
// end is a semicircle; the length goes back at 35° (drawn at 0.55 scale, as the chapter's prisms are). lab: the radius
// (or, with show 'd', the diameter) in blue along the front's flat edge, labelled under it; lLab beside the edge going back.
const halfCyl = ({ r, l, k, lab, show = 'r', lLab }) => {
  const R = r * k, D = [Math.cos(rad(35)) * 0.55 * l * k, -Math.sin(rad(35)) * 0.55 * l * k], m = 0.5;
  const F = [m + R, m - D[1] + R], B = [F[0] + D[0], F[1] + D[1]];
  const at = (c, a) => [c[0] + R * Math.cos(rad(a)), c[1] - R * Math.sin(rad(a))];
  const arcTo = (a0, a1, c) => { const p = at(c, a1); return `A${f(R)},${f(R)} 0 0 ${a1 > a0 ? 0 : 1} ${f(p[0])},${f(p[1])}`; };
  const M = (p) => `M${f(p[0])},${f(p[1])}`, Lp = (p) => `L${f(p[0])},${f(p[1])}`;
  // the curved surface that shows: the front arc from 0° to 125° (where the outline runs back), the back arc returning
  let b = `<path d="${M(at(F, 0))} ${arcTo(0, 125, F)} ${Lp(at(B, 125))} ${arcTo(125, 0, B)} Z" fill="${SIDE}" stroke="${INK}" stroke-width="0.45"/>`;
  const hid = { stroke: C.grey, w: 0.3, dash: true };
  b += `<path d="${M(at(B, 125))} ${arcTo(125, 180, B)}" fill="none" stroke="${C.grey}" stroke-width="0.3" stroke-dasharray="1.2 0.9"/>`;
  b += seg(at(B, 180), at(B, 0), hid) + seg(at(F, 180), at(B, 180), hid);
  b += `<path d="${M(at(F, 0))} ${arcTo(0, 180, F)} Z" fill="${FILL}" stroke="${INK}" stroke-width="0.45"/>`;
  b += seg(show === 'd' ? at(F, 180) : F, at(F, 0), BLUE) + dot(F, 0.45) + T(show === 'd' ? F[0] : F[0] + R / 2, F[1] + 3.8, lab, LAB);
  const e = [at(F, 0)[0] + D[0] / 2, at(F, 0)[1] + D[1] / 2];
  b += T(e[0] + 1.4, e[1] + 2.4, lLab, { ...LAB, anchor: 'start' });
  return svg(f(B[0] + R + m), f(F[1] + m), b);
};
// A rectangular prism (Lesson 10.8): l across, w going back, h up, drawn k mm per unit. l under the front; w beside the
// bottom edge going back and h beside the right-hand back edge, both on the right, so the labels take one label's width
// and the box itself can be drawn big enough.
const box = (l, w, h, [ll, lw, lh], k) => {
  const D = [Math.cos(rad(35)) * 0.55 * w * k, -Math.sin(rad(35)) * 0.55 * w * k], m = 0.5, X = l * k, Y = h * k;
  const p = [m, m - D[1] + Y], fr = [p, [p[0] + X, p[1]], [p[0] + X, p[1] - Y], [p[0], p[1] - Y]], bk = fr.map((q) => [q[0] + D[0], q[1] + D[1]]);
  const hid = { stroke: C.grey, w: 0.3, dash: true };
  let b = seg(bk[0], bk[1], hid) + seg(bk[0], bk[3], hid) + seg(bk[0], fr[0], hid);
  b += poly([fr[3], fr[2], bk[2], bk[3]], TOP) + poly([fr[1], bk[1], bk[2], fr[2]], SIDE) + poly(fr, FILL);
  b += T(p[0] + X / 2, p[1] + 3.8, ll, LAB) + T(bk[1][0] + 1.2, bk[1][1] - Y / 2 + 1, lh, { ...LAB, anchor: 'start' });
  b += T(fr[1][0] + D[0] / 2 + 1.4, fr[1][1] + D[1] / 2 + 2.4, lw, { ...LAB, anchor: 'start' });
  return svg(f(bk[2][0] + m), f(p[1] + m), b);
};
// A circle (Lessons 10.6 and 10.7) of radius R mm with its diameter in blue, labelled above the line (as 10.6's part())
const disc = (R, lab) => {
  const c = [R + 1, R + 1];
  return svg(f(2 * R + 2), f(2 * R + 2), `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(R)}" fill="${FILL}" stroke="${INK}" stroke-width="0.45"/>`
    + seg([c[0] - R, c[1]], [c[0] + R, c[1]], BLUE) + dot(c) + T(c[0], c[1] - 1.4, lab, LAB));
};
// A semicircle (Lesson 10.6) of radius R mm, flat edge down: its diameter in blue, labelled under it (as 10.6's part())
const semi = (R, lab) => {
  const c = [R + 1, R + 1];
  return svg(f(2 * R + 2), f(R + 2), `<path d="M${f(c[0] - R)},${f(c[1])} A${f(R)},${f(R)} 0 0 1 ${f(c[0] + R)},${f(c[1])} Z" fill="${FILL}" stroke="${INK}" stroke-width="0.45"/>`
    + seg([c[0] - R, c[1]], [c[0] + R, c[1]], BLUE) + dot(c) + T(c[0], c[1] + 3.8, lab, LAB));
};

// A picture drawn at print size: the biggest k (mm per unit) at which draw(k) fits in maxW by maxH mm (labels and all),
// so the picture fills its box without being scaled down
const vb = (pic) => { const x = /viewBox="[-\d.]+ [-\d.]+ ([\d.]+) ([\d.]+)"/.exec(pic); return [+x[1], +x[2]]; };
const fit = (draw, maxW, maxH) => { let lo = 0.05, hi = 20;
  for (let i = 0; i < 40; i++) { const k = (lo + hi) / 2, [w, h] = vb(draw(k)); if (w <= maxW && h <= maxH) lo = k; else hi = k; }
  return draw(lo); };
// Formula questions (Formula / Substitute / Answer lines) from [picture, answer, text?, own formula?], with the round's
// formula printed (a string) or left for students to write (true). (As 10.6's formFig.)
const formFig = (list, form) => ({ items: list.map(([fig, , t = '', own]) => ({ t, fig, form: own || form })), ans: list.map((x) => x[1]) });

// The room a picture may take, in mm: page 1 (four or three to a row), page 2, the Medium set, the WE DO examples
const P1 = [29, 19.6], P1W = [33.5, 19.6], P2 = [45, 25.6], MED = [24, 14.6], EXA = [38, 20.5], EXB = [38, 17.5];
// Drill questions: [picture, answer]. The given lengths are on the picture; the unknown is marked with a ?.
const endQ = (r, unit, h) => [fit((k) => cyl({ r, h, k, lab: L(r, unit), shade: 'top', ask: 'top' }), ...P1), A2(area(r), unit)];
const curvedQ = (r, h, unit) => [fit((k) => cyl({ r, h, k, lab: L(r, unit), hLab: L(h, unit), shade: 'side', ask: 'A' }), ...P1W), A2(curved(r, h), unit)];
const netQ = (r, h, unit) => [fit((k) => net({ r, h, k, lab: L(r, unit), hLab: L(h, unit), ask: 'SA' }), ...P2), A2(SA(r, h), unit)];
// a closed cylinder: the radius given (or, with d, the diameter v)
const closedQ = (v, h, unit, d = false) => { const r = d ? v / 2 : v;
  return [fit((k) => cyl({ r, h, k, lab: L(v, unit), show: d ? 'd' : 'r', hLab: L(h, unit), ask: 'SA' }), ...P2), A2(SA(r, h), unit)]; };
// which surface? 'top' the shaded end, 'side' the shaded curved surface, 'all' the surface area of the closed cylinder
const whichQ = (kind, v, h, unit, d = false) => { const r = d ? v / 2 : v;
  const fig = fit((k) => cyl({ r, h, k, lab: L(v, unit), show: d ? 'd' : 'r', hLab: kind === 'top' ? '' : L(h, unit), shade: kind === 'all' ? '' : kind, ask: { top: 'top', side: 'A', all: 'SA' }[kind] }), ...P2);
  return [fig, A2(kind === 'top' ? area(r) : kind === 'side' ? curved(r, h) : SA(r, h), unit)]; };

// The teacher's examples
const EX1 = { r: 3, h: 8 }, EX1D = { d: 10, h: 4 };
const EX2 = { lid: [4, 10], label: [7, 11], lie: [2, 5], half: [3, 10] };

// The Notes diagram: a cylinder beside its net (a circle, the curved surface unrolled into a rectangle 2πr by h, a circle),
// drawn to the same scale, so the rectangle is as high as the cylinder and the circles are its ends
const notesFig = () => {
  const R = 3, H = 12, E = 0.32 * R, W = 2 * PI * R, o = { size: 2.8, weight: 600 }, x1 = 12.6, y0 = 1 + 2 * R + 0.4, cx = 1.2 + R, cn = x1 + W / 2;
  // the cylinder, its top level with the rectangle's top edge
  let b = `<path d="M${f(cx - R)},${f(y0)} L${f(cx - R)},${f(y0 + H)} A${f(R)},${f(E)} 0 0 0 ${f(cx + R)},${f(y0 + H)} L${f(cx + R)},${f(y0)}" fill="${SIDE}" stroke="${INK}" stroke-width="0.45"/>`;
  b += `<path d="M${f(cx - R)},${f(y0 + H)} A${f(R)},${f(E)} 0 0 1 ${f(cx + R)},${f(y0 + H)}" fill="none" stroke="${C.grey}" stroke-width="0.3" stroke-dasharray="1.2 0.9"/>`;
  b += `<ellipse cx="${f(cx)}" cy="${f(y0)}" rx="${f(R)}" ry="${f(E)}" fill="${FILL}" stroke="${INK}" stroke-width="0.45"/>`;
  b += seg([cx, y0], [cx + R, y0], BLUE) + dot([cx, y0], 0.4) + T(cx + R / 2, y0 - E - 0.9, 'r', { ...o, fill: C.blue });
  b += vDim(cx + R + 1.4, y0, y0 + H, 'h', 1, o);
  // the net
  const circle = (cy) => `<circle cx="${f(cn)}" cy="${f(cy)}" r="${R}" fill="${FILL}" stroke="${INK}" stroke-width="0.45"/>`;
  b += poly([[x1, y0], [x1 + W, y0], [x1 + W, y0 + H], [x1, y0 + H]], SIDE) + circle(y0 - R) + circle(y0 + H + R);
  b += seg([cn, y0 - R], [cn + R, y0 - R], BLUE) + dot([cn, y0 - R], 0.4) + T(cn + R + 1.1, y0 - R + 1, 'r', { ...o, anchor: 'start', fill: C.blue });
  b += T(x1 + W + 1.1, y0 + H / 2 + 1, 'h', { ...o, anchor: 'start' });
  b += T(cn, y0 + H / 2 + 1, 'curved', { size: 2.4 }) + T(cn + R + 1.1, y0 + H + R + 1, 'end', { size: 2.4, anchor: 'start' });
  // the rectangle's length, 2πr: a ticked measurement line (as in Example 1b) under the net, clear of the bottom circle,
  // with thin lines down to it from the rectangle's bottom corners
  const yl = y0 + H + 2 * R + 1.6, ext = { stroke: C.grey, w: 0.2 };
  b += seg([x1, y0 + H + 0.6], [x1, yl + 0.7], ext) + seg([x1 + W, y0 + H + 0.6], [x1 + W, yl + 0.7], ext);
  b += hDim(yl, x1, x1 + W, '2πr', { ...o, fill: C.blue });
  return svg(f(x1 + W + 1), f(yl + 1), b);
};

module.exports = {
  code: '10.9', title: 'Surface area of a cylinder',
  li: 'find the surface area of a cylinder: two circles and a rolled-up rectangle.',
  sc: ['find the area of a circular end: A = πr²', 'find the curved surface area: A = 2πrh', 'find the surface area of closed and open cylinders'],
  notes: {
    terms: [['cylinder', 'a solid with two equal circular ends'], ['radius (r)', 'centre of an end to its edge; r = d ÷ 2'], ['height (h)', 'the distance between the two ends'],
      ['curved surface', 'the side; flat, a 2πr by h rectangle'], ['net', 'the flat shape that folds up into the solid'],
      ['surface area (SA)', 'the total area of all the surfaces'], ['no lid', 'an open cylinder: one end only']],
    formulas: ['End: A = πr²', 'Curved surface: A = 2πrh', 'Closed: SA = 2πr² + 2πrh', 'No lid: SA = πr² + 2πrh', 'Half cylinder: SA = πr² + πrh + 2rh'],
    steps: ['r = d ÷ 2', 'list the surfaces', 'substitute (π key)', 'round to 1 d.p. + unit²'],
    fig: notesFig(),
  },
  easy: {
    ex: { stem: 'Find each area, correct to one decimal place.', parts: [
      { t: 'End area', fig: fit((k) => cyl({ ...EX1, k, lab: '3 cm', hLab: '8 cm', shade: 'top' }), ...EXA) },
      { t: 'Curved surface', fig: fit((k) => net({ ...EX1, k, lab: '3 cm', hLab: '8 cm', ends: 1, len: '2πr' }), ...EXA) },
      { t: 'Surface area', fig: fit((k) => net({ ...EX1, k, lab: '3 cm', hLab: '8 cm' }), ...EXA) },
      { t: 'Surface area', fig: fit((k) => cyl({ r: EX1D.d / 2, h: EX1D.h, k, lab: '10 m', show: 'd', hLab: '4 m' }), ...EXA) }] },
    exAns: [`A = π × 3² = ${A2(area(3), 'cm')}`, `the rectangle is 2πr long: A = 2 × π × 3 × 8 = ${A2(curved(3, 8), 'cm')}`,
      `SA = 2 × π × 3² + 2 × π × 3 × 8 = ${addUp([2 * area(3), curved(3, 8)], 'cm')}`,
      `r = 10 ÷ 2 = 5 m; SA = 2 × π × 5² + 2 × π × 5 × 4 = ${addUp([2 * area(5), curved(5, 4)], 'm')}`],
    hint: 'End: A = πr² · Curved surface: A = 2πrh (h is the height) · Use the π key · Round to one decimal place.',
    work: true,
    // Small steps: the area of an end, then the curved surface (the formula printed on the Formula line). Each question
    // is its diagram: the surface asked for is shaded, the given lengths are on it, and the unknown is marked with a ?.
    rounds: [
      { text: 'find the area of the shaded end of each cylinder.', cols: 4, ...formFig([[4, 'cm', 5], [7, 'm', 9], [1.5, 'm', 2], [10, 'cm', 8]]
        .map(([r, x, h]) => endQ(r, x, h)), 'A = πr²') },
      { text: 'find the curved surface area (shaded).', cols: 3, ...formFig([[3, 5, 'cm'], [4, 7, 'm'], [2.5, 4, 'cm']]
        .map(([r, h, x]) => curvedQ(r, h, x)), 'A = 2πrh') },
    ],
  },
  // Page 2: more drill. The net (two circles and a rectangle), then closed cylinders with r and with d given (formula
  // printed), then a round choosing the surface and writing the formula.
  drill: {
    hint: 'Closed cylinder: SA = 2πr² + 2πrh (two ends + the curved surface) · r = d ÷ 2 · Round to one decimal place.',
    rounds: [
      { text: 'find the total area of each net. It is the surface area of the cylinder.', ...formFig([netQ(2, 5, 'cm'), netQ(3, 4, 'm'), netQ(1.5, 6, 'cm')], 'SA = 2πr² + 2πrh') },
      { text: 'find the surface area of each closed cylinder. The radius is given.', ...formFig([closedQ(2, 6, 'cm'), closedQ(6, 3, 'm'), closedQ(4, 9, 'cm')], 'SA = 2πr² + 2πrh') },
      { text: 'find the surface area. The diameter is given: halve it first.', ...formFig([closedQ(6, 10, 'cm', true), closedQ(8, 5, 'm', true), closedQ(2, 3, 'm', true)], 'SA = 2πr² + 2πrh') },
      { text: 'which surface? Write the formula, then find the area.', ...formFig([whichQ('side', 4, 5, 'cm'), whichQ('all', 10, 6, 'cm', true), whichQ('top', 12, 7, 'm', true)], true) },
    ],
  },
  medium: {
    ex: { stem: 'Find each area, correct to one decimal place. List the surfaces first.', parts: [
      { t: 'SA (no lid)', fig: fit((k) => cyl({ r: EX2.lid[0], h: EX2.lid[1], k, lab: '4 cm', hLab: '10 cm', open: true }), ...EXB) },
      { t: 'Label area', fig: fit((k) => cyl({ r: EX2.label[0] / 2, h: EX2.label[1], k, lab: '7 cm', show: 'd', hLab: '11 cm', shade: 'side' }), ...EXB) },
      { t: 'Surface area', fig: fit((k) => lying({ r: EX2.lie[0] / 2, l: EX2.lie[1], k, dLab: '2 m', lLab: '5 m' }), ...EXB) },
      { t: 'Surface area', fig: fit((k) => halfCyl({ r: EX2.half[0], l: EX2.half[1], k, lab: '3 m', lLab: '10 m' }), ...EXB) }] },
    exAns: [`one end only: SA = π × 4² + 2 × π × 4 × 10 = ${addUp([area(4), curved(4, 10)], 'cm')}`,
      `the label is the curved surface: r = 7 ÷ 2 = 3.5 cm; A = 2 × π × 3.5 × 11 = ${A2(curved(3.5, 11), 'cm')}`,
      `lying down, h is the length: r = 2 ÷ 2 = 1 m; SA = 2 × π × 1² + 2 × π × 1 × 5 = ${addUp([2 * area(1), curved(1, 5)], 'm')}`,
      `two half circles + half the curved surface + the flat base: SA = π × 3² + π × 3 × 10 + 6 × 10 = ${addUp([area(3), PI * 3 * 10, 60], 'm')}`],
    hint: 'No lid: SA = πr² + 2πrh · Label: 2πrh only · Half cylinder: SA = πr² + πrh + 2rh · Lying down: h is the length',
    work: true, set: true,
    // One set: today's skill, building from closed cylinders to open ones and half cylinders, with a question from an
    // earlier lesson (tagged) in each row. Every question is its diagram, with a word or two saying what to find, and
    // Formula / Substitute / Answer lines (form: true).
    rounds: [(() => {
      const ff = ([fig, a], t = 'Surface area', from) => [{ t, fig, form: true, ...(from ? { from } : {}) }, a];
      const Q = [
        ff([fit((k) => cyl({ r: 3, h: 2.5, k, lab: '6 m', show: 'd', hLab: '2.5 m' }), ...MED), A2(SA(3, 2.5), 'm')]),
        // (a short heading, so the earlier lesson's tag sits on its line: 'Circumference' + tag would wrap)
        ff([fit((k) => semi(5 * k, '10 cm'), 20, MED[1]), u((PI * 10) / 2 + 10, 'cm', 1)], 'Perimeter', '10.6'),
        ff([fit((k) => cyl({ r: 5, h: 8, k, lab: '5 cm', hLab: '8 cm', open: true }), ...MED), A2(SA(5, 8, 1), 'cm')], 'SA (no lid)'),
        ff([fit((k) => cyl({ r: 5, h: 7, k, lab: '10 cm', show: 'd', hLab: '7 cm', shade: 'side' }), ...MED), A2(curved(5, 7), 'cm')], 'Label area'),
        ff([fit((k) => box(5, 4, 3, ['5 cm', '4 cm', '3 cm'], k), ...MED), u(2 * (5 * 4 + 5 * 3 + 4 * 3), 'cm²')], 'SA', '10.8'),
        ff([fit((k) => lying({ r: 2, l: 9, k, dLab: '4 m', lLab: '9 m' }), ...MED), A2(SA(2, 9), 'm')]),
        ff([fit((k) => cyl({ r: 6, h: 9, k, lab: '12 cm', show: 'd', hLab: '9 cm', open: true }), ...MED), A2(SA(6, 9, 1), 'cm')], 'SA (no lid)'),
        ff([disc(5.8, '16 m'), A2(area(8), 'm')], 'Area', '10.7'),
        ff([fit((k) => halfCyl({ r: 4, l: 10, k, lab: '4 cm', lLab: '10 cm' }), ...MED), A2(halfSA(4, 10), 'cm')]),
      ];
      return { text: '', items: Q.map((x) => x[0]), ans: Q.map((x) => x[1]) };
    })()],
  },
  worded: [
    // To the nearest dollar, so the cost is the same whether or not SA is rounded first ($219.80 or $219.91: $220)
    { q: 'A closed cylindrical tank has a diameter of 2 m and a height of 1.5 m. Paint costs $14 per m². Find the cost to paint the whole tank, to the nearest dollar.',
      a: (() => { const sa = +SA(1, 1.5).toFixed(1), cost = sa * 14;
        if (Math.round(cost) !== Math.round(SA(1, 1.5) * 14)) throw new Error('10.9 worded 1: the cost depends on rounding SA first');
        return `r = 2 ÷ 2 = 1 m; SA = 2 × π × 1² + 2 × π × 1 × 1.5 = ${A2(SA(1, 1.5), 'm')}; ${num(sa, 1)} × $14 = $${cost.toFixed(2)}, so $${num(Math.round(cost))}`; })() },
    // 10 turns from the unrounded area of one turn, so the answer is correct to one decimal place
    { q: 'A paint roller is a cylinder 25 cm long with a diameter of 6 cm. Find the area it paints in 10 full turns.',
      a: `r = 6 ÷ 2 = 3 cm; one turn = 2 × π × 3 × 25 = ${A2(curved(3, 25), 'cm')}; 10 turns = 10 × 2 × π × 3 × 25 = ${A2(10 * curved(3, 25), 'cm')}` },
    { q: 'A bucket with no lid is a cylinder with a diameter of 30 cm and a height of 25 cm. Find the area of plastic needed to make it.',
      a: `r = 30 ÷ 2 = 15 cm; SA = π × 15² + 2 × π × 15 × 25 = ${addUp([area(15), curved(15, 25)], 'cm')}` },
  ],
};
