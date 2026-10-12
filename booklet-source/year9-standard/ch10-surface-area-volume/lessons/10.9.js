// Lesson 10.9 Surface area of a cylinder (two pages: Easy, then Medium, then Mixed practice). See lib/lesson-two.js.
// Textbook 10.08. Every picture is drawn from the same numbers that give its answer, and every answer is correct to
// one decimal place (unless the question says otherwise), using the calculator's π.
// The cylinders are drawn here (with shapes.js parts), not with shapes.js cylinder(): that keeps a 6 mm margin round
// the picture, so in a quarter-width cell it shrinks and its labels get too small to read. These fill the cell (maxW,
// maxH: the most room a picture may take, in mm) and keep every label outside the cylinder.
const { PI, num, u, area, limits, round, problems, mix } = require('../helpers');
const { C, f, T, svg, seg, poly, dot, SIDE, SHADE } = require('../shapes').parts;

const INK = C.charcoal, BLUE = { stroke: C.blue, w: 0.45 }, GREY = { stroke: C.grey, w: 0.3 }, LID = '#d5ddf2';
const textW = (s, size = 2.8) => String(s).length * size * 0.58; // as shapes.js T measures a label
const BOX = { maxW: 33, maxH: 24 }; // a picture in a YOU DO round
const EXBOX = { maxW: 33, maxH: 21 }; // a picture in a WE DO example

// A measurement line beside a vertical edge from y0 to y1 at x, with its label to the right.
const hDim = (x, y0, y1, lab) => seg([x, y0], [x, y1], GREY) + seg([x - 0.7, y0], [x + 0.7, y0], GREY) + seg([x - 0.7, y1], [x + 0.7, y1], GREY)
  + T(x + 1.2, (y0 + y1) / 2 + 1, lab, { anchor: 'start' });

// A cylinder standing up, r and h in the question's units. lab is the radius (a blue radius on the top) or, with
// show 'd', the diameter (a blue line across the top); its label sits above the top rim. hLab is the height, on a
// measurement line to the right. open: the top is white (no lid). shade: 'top' or 'side' darkens that surface.
const cyl = ({ r, h, lab = '', show = 'r', hLab = '', open = false, shade = '', maxW, maxH }) => {
  const m = 1, up = lab ? 4.2 : 0, right = hLab ? 2.6 + textW(hLab) : 0, e = 0.32;
  const k = Math.min((maxW - 2 * m - right) / (2 * r), (maxH - 2 * m - up) / (h + 2 * e * r));
  const R = r * k, E = e * R, cx = m + R, top = m + up + E, bot = top + h * k;
  let b = `<path d="M${f(cx - R)},${f(top)} L${f(cx - R)},${f(bot)} A${f(R)},${f(E)} 0 0 0 ${f(cx + R)},${f(bot)} L${f(cx + R)},${f(top)}" fill="${shade === 'side' ? SHADE : SIDE}" stroke="${INK}" stroke-width="0.45"/>`;
  b += `<path d="M${f(cx - R)},${f(bot)} A${f(R)},${f(E)} 0 0 1 ${f(cx + R)},${f(bot)}" fill="none" stroke="${C.grey}" stroke-width="0.3" stroke-dasharray="1.2 0.9"/>`;
  b += `<ellipse cx="${f(cx)}" cy="${f(top)}" rx="${f(R)}" ry="${f(E)}" fill="${open ? '#fff' : shade === 'top' ? SHADE : LID}" stroke="${INK}" stroke-width="0.45"/>`;
  if (lab) {
    b += show === 'd' ? seg([cx - R, top], [cx + R, top], BLUE) : seg([cx, top], [cx + R, top], BLUE) + dot([cx, top], 0.45);
    b += T(show === 'd' ? cx : cx + R / 2, top - E - 0.9, lab, { size: 3 });
  }
  if (hLab) b += hDim(cx + R + 1.4, top, bot, hLab);
  return svg(f(2 * R + 2 * m + right), f(bot + E + m), b);
};

// The curved surface unrolled: a rectangle 2πr long and h high, labL under it and hLab on a measurement line beside it.
const sheet = ({ r, h, labL, hLab, maxW, maxH }) => {
  const m = 1, right = 2.6 + textW(hLab), L = 2 * PI * r;
  const k = Math.min((maxW - 2 * m - right) / L, (maxH - 2 * m - 4.4) / h), W = L * k, H = h * k;
  let b = poly([[m, m], [m + W, m], [m + W, m + H], [m, m + H]], SIDE);
  b += hDim(m + W + 1.4, m, m + H, hLab) + T(m + W / 2, m + H + 3.6, labL);
  return svg(f(W + 2 * m + right), f(H + 2 * m), b);
};

// Areas: the ends, the curved surface, and the total for a closed cylinder, no lid (one end) or open at both ends
const curved = (r, h) => 2 * PI * r * h;
const SA = (r, h, ends = 2) => ends * area(r) + curved(r, h);
// (no-break spaces after the thousands and before the unit, so '1 187.5 cm²' never splits across two lines)
const A = (v, unit, dp = 1) => `${num(v, dp).replace(/ /g, '\u00a0')}\u00a0${unit}²`;
const L = (v, unit) => `${num(v)} ${unit}`;
const ENDS = { closed: 2, lid: 1, open: 0 };
const CAPTION = { closed: 'Closed', lid: 'No lid', open: 'Open both ends' };
// A picture question: [{ t, fig }, answer]. d: the diameter is shown (otherwise the radius). kind: closed, lid or open.
const cylQ = (r, h, unit, { d = false, kind = 'closed', t, box = BOX } = {}) => [
  { t: t ?? (kind === 'closed' ? '' : CAPTION[kind]), fig: cyl({ r, h, lab: L(d ? 2 * r : r, unit), show: d ? 'd' : 'r', hLab: L(h, unit), open: kind !== 'closed', ...box }) },
  A(SA(r, h, ENDS[kind]), unit)];
// Question text: keep each measurement on one line ('r = 2 cm', '1.5 m'), so a line never breaks inside one
const keep = (s) => s.replace(/ = /g, '\u00a0=\u00a0').replace(/(\d) (?=(mm|cm|m)\b)/g, '$1\u00a0');
const figRound = (text, list) => ({ text, items: list.map((x) => x[0]), ans: list.map((x) => x[1]), cols: 4 });

// The teacher's examples
const EX1 = { r: 3, h: 8 };
const EX2 = [cylQ(4, 10, 'cm', { kind: 'lid', t: 'No lid', box: EXBOX }), cylQ(7, 20, 'cm', { d: true, t: 'Closed', box: EXBOX })];
const CAN = { r: 3.5, h: 11 };
const TANK = { d: 2, h: 1.5, cost: 12 };
const ROLLER = { d: 6, len: 25, turns: 10 };
const tankSA = SA(TANK.d / 2, TANK.h);

module.exports = {
  code: '10.9', title: 'Surface area of a cylinder',
  li: 'find a cylinder’s surface area: two circles and a rolled-up rectangle.',
  sc: ['find the area of the circular ends: A = πr²', 'find the curved surface area: A = 2πrh', 'find the surface area of closed and open cylinders'],
  easy: {
    ex: { stem: 'Find each area, correct to one decimal place.', parts: [
      { t: 'Area of the top', fig: cyl({ ...EX1, lab: '3 cm', hLab: '8 cm', shade: 'top', ...EXBOX }) },
      { t: 'Curved surface of part a, unrolled', fig: sheet({ ...EX1, labL: 'length = 2πr', hLab: '8 cm', ...EXBOX }) },
      'Total surface area of the cylinder in part a',
      cylQ(5, 4, 'm', { d: true, t: 'Total surface area', box: EXBOX })[0]] },
    exAns: [`A = π × 3² = ${A(area(3), 'cm')}`, `A = 2 × π × 3 × 8 = ${A(curved(3, 8), 'cm')}`, `SA = 2 × π × 3² + 2 × π × 3 × 8 = ${A(SA(3, 8), 'cm')}`,
      `r = 10 ÷ 2 = 5 m; SA = 2 × π × 5² + 2 × π × 5 × 4 = ${A(SA(5, 4), 'm')}`],
    hint: 'Each end: πr² · Curved surface: 2πrh (unrolled, a rectangle 2πr by h) · Closed cylinder: SA = 2πr² + 2πrh',
    rounds: [
      round('find the curved surface area (2πrh), correct to one decimal place.', [[2, 5, 'cm'], [5, 6, 'm'], [1, 9, 'm'], [7, 3, 'mm'], [2.5, 8, 'cm'], [10, 12, 'cm'], [1.5, 2, 'm'], [6, 2.5, 'm']],
        ([r, h, unit]) => `r = ${L(r, unit)}, h = ${L(h, unit)}`, ([r, h, unit]) => A(curved(r, h), unit)),
      figRound('find the total surface area of each closed cylinder, correct to one decimal place.', [cylQ(2, 6, 'cm'), cylQ(5, 3, 'm'), cylQ(4, 9, 'cm'), cylQ(1.5, 4, 'm')]),
      figRound('find the total surface area (all closed, r = d ÷ 2), correct to one decimal place.', [cylQ(3, 9, 'cm', { d: true }), cylQ(5, 12, 'm', { d: true }), cylQ(10, 5, 'cm', { d: true }), cylQ(2, 15, 'm', { d: true })]),
    ],
  },
  medium: {
    ex: { stem: 'Find each area, correct to one decimal place. List the surfaces first.', parts: [EX2[0][0], EX2[1][0],
      { t: 'The label', fig: cyl({ ...CAN, lab: '3.5 cm', hLab: '11 cm', shade: 'side', ...EXBOX }) },
      'A pipe open at both ends has r = 2 cm and length 50 cm. Find its outside area.'] },
    exAns: [`one end only: SA = π × 4² + 2 × π × 4 × 10 = ${EX2[0][1]}`, `r = 14 ÷ 2 = 7 cm; SA = 2 × π × 7² + 2 × π × 7 × 20 = ${EX2[1][1]}`,
      `the label is the curved surface: 2 × π × 3.5 × 11 = ${A(curved(CAN.r, CAN.h), 'cm')}`, `no ends: 2 × π × 2 × 50 = ${A(curved(2, 50), 'cm')}`],
    hint: 'No lid: πr² + 2πrh · Open at both ends, or a label: 2πrh only · Closed: 2πr² + 2πrh · r = d ÷ 2',
    rounds: [
      figRound('find the total surface area, correct to one decimal place. Some are open.', [
        cylQ(5, 12, 'cm', { d: true, kind: 'lid' }), cylQ(4, 3, 'm', { d: true, t: 'Closed' }), cylQ(3, 20, 'cm', { d: true, kind: 'open' }), cylQ(12, 9, 'cm', { d: true, kind: 'lid' })]),
      problems('solve each problem. Show your working.', [
        [keep(`A closed tank is a cylinder, d = ${L(TANK.d, 'm')}, h = ${L(TANK.h, 'm')}. Paint costs $${TANK.cost} per m². Cost to paint it?`),
          `r = 2 ÷ 2 = 1 m; SA = 2 × π × 1² + 2 × π × 1 × 1.5 = ${A(tankSA, 'm')}; cost = ${num(tankSA, 3)}… × $${TANK.cost} = $${(tankSA * TANK.cost).toFixed(2)} ($${(+tankSA.toFixed(1) * TANK.cost).toFixed(2)} using ${A(tankSA, 'm')})`],
        [keep(`A paint roller, d = ${L(ROLLER.d, 'cm')}, is ${L(ROLLER.len, 'cm')} long. Find the area it paints in ${ROLLER.turns} turns, to the nearest cm².`),
          `r = ${num(ROLLER.d)} ÷ 2 = ${L(ROLLER.d / 2, 'cm')}; one turn = 2 × π × ${num(ROLLER.d / 2)} × ${num(ROLLER.len)} = ${A(curved(ROLLER.d / 2, ROLLER.len), 'cm')}; ${ROLLER.turns} turns = ${A(ROLLER.turns * curved(ROLLER.d / 2, ROLLER.len), 'cm', 0)}`],
      ]),
    ],
  },
  mixed: mix(...[
    ['Curved surface area if d = 10 cm, h = 7 cm?', A(curved(10 / 2, 7), 'cm'), '10.9'],
    ['Find the area of a circle with diameter 13 cm.', A(area(13 / 2), 'cm'), '10.7'],
    ['Closed tin, r = 6 cm, h = 10 cm. Surface area?', A(SA(6, 10), 'cm'), '10.9'],
    ['Surface area of a 5 cm by 4 cm by 2 cm box?', u(2 * (5 * 4 + 5 * 2 + 4 * 2), 'cm²'), '10.8'],
    ['Bucket (no lid), d = 30 cm, h = 25 cm. SA?', A(SA(15, 25, 1), 'cm'), '10.9'],
    ['A can is 11.5 cm tall. Write the limits.', limits('11.5 cm'), '10.2'],
    ['Curved SA = 314.2 cm², h = 10 cm. r? (÷ 2πh)', `${u(314.2 / (2 * PI * 10), 'cm', 0)} (r = 314.2 ÷ (2 × π × 10))`, '10.9'],
    ['Which has more curved surface: r = 2 cm, h = 6 cm or r = 3 cm, h = 4 cm?', `neither: 2 × π × 2 × 6 = 2 × π × 3 × 4 = ${A(curved(2, 6), 'cm')}`, '10.9'],
  ].map(([q, ...rest]) => [keep(q), ...rest])),
};
