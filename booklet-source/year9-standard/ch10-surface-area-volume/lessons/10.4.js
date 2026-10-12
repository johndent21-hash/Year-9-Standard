// Lesson 10.4 Perimeter and area of composite shapes (two pages: Easy, then Medium, then Mixed practice).
// Each shape is drawn from its corners, and its perimeter and area are calculated from the same corners.
const { num, u, conv, limits, pctErr, meas, mix } = require('../helpers');
const S = require('../shapes');

// Perimeter and area (shoelace) of a polygon, holes subtracted from the area
const perim = (pts) => pts.reduce((t, p, i) => { const q = pts[(i + 1) % pts.length]; return t + Math.hypot(q[0] - p[0], q[1] - p[1]); }, 0);
const areaOf = (pts) => Math.abs(pts.reduce((t, p, i) => { const q = pts[(i + 1) % pts.length]; return t + p[0] * q[1] - q[0] * p[1]; }, 0)) / 2;
// A question: { t, fig } with its answer, from a shape spec (see shapes.js shape()); unit is the length unit
const P = (o, unit, t = '') => [{ t, fig: S.shape(o) }, u(perim(o.pts), unit)];
const A = (o, unit, t = '') => [{ t, fig: S.shape(o) }, u(areaOf(o.pts) - (o.holes || []).reduce((s, h) => s + areaOf(h), 0), `${unit}²`)];
// A caption above the picture, inside it (so the picture keeps its height), e.g. naming the white part of a shaded shape
const cap = (o, text) => { const xs = o.pts.map((p) => p[0]), ys = o.pts.map((p) => p[1]), { k } = S.parts.fitter(o.pts, o.size || 22, 1.5, o.maxH || 15);
  return { ...o, labels: [...(o.labels || []), [text, (Math.min(...xs) + Math.max(...xs)) / 2, Math.max(...ys) + 3 / k]] }; };
const figRound = (text, list) => ({ text, items: list.map((x) => x[0]), ans: list.map((x) => x[1]), cols: 4 });

const L1 = { pts: [[0, 0], [10, 0], [10, 4], [4, 4], [4, 9], [0, 9]], sides: ['10 m', '4 m', '', '', '4 m', '9 m'], right: [0, 1, 4, 5] };
const HOUSE = { pts: [[0, 0], [8, 0], [8, 5], [4, 8], [0, 5]], sides: ['8 cm', '5 cm'], dash: [[[0, 5], [8, 5]], [[4, 8], [4, 5]]], dims: [[[0, 5], [0, 8], '3 cm', 1]], right: [0, 1] };
// The white part's width and height on measurement lines in the shaded band (width above it, height on its right)
const HOLE = { pts: [[0, 0], [10, 0], [10, 6], [0, 6]], sides: ['10 m', '6 m'], shade: true, holes: [[[3, 1], [6, 1], [6, 3], [3, 3]]], dims: [[[3, 3], [6, 3], '3 m', 1], [[6, 3], [6, 1], '2 m', 1]] };
const STAIRS = { pts: [[0, 0], [12, 0], [12, 3], [8, 3], [8, 6], [4, 6], [4, 9], [0, 9]], sides: ['12 m', '3 m', '', '3 m', '', '', '', '9 m'], right: [0, 7] };
const ROOF = { pts: [[0, 0], [7.5, 0], [7.5, 4], [3.75, 6.4], [0, 4]], sides: ['7.5 cm', '4 cm'], dash: [[[0, 4], [7.5, 4]], [[3.75, 6.4], [3.75, 4]]], dims: [[[0, 4], [0, 6.4], '2.4 cm', 1]], right: [0, 1] };
const TRIHOLE = { pts: [[0, 0], [12, 0], [12, 8], [0, 8]], sides: ['', '', '12 m', '8 m'], shade: true, holes: [[[2, 2], [7, 2], [4.5, 6]]], dims: [[[7, 2], [7, 6], '4 m', -1]], labels: [['5 m', 4.5, 1.1]] };

module.exports = {
  code: '10.4', title: 'Perimeter and area of composite shapes',
  li: 'find the perimeter and area of shapes made from rectangles and triangles.',
  sc: ['find missing side lengths, then the perimeter', 'find an area by splitting a shape into rectangles and triangles', 'find a shaded area by subtracting'],
  easy: {
    ex: { stem: 'Find the perimeter or area. Find any missing sides first.', parts: [
      { t: 'Perimeter', fig: S.shape({ size: 24, maxH: 16, ...L1 }) }, 'Area of the shape in part a', { t: 'Area', fig: S.shape({ size: 24, maxH: 16, ...HOUSE }) }, { t: 'Shaded area', fig: S.shape({ size: 24, maxH: 16, ...HOLE }) }] },
    exAns: [`missing sides 6 m and 5 m; P = 10 + 4 + 6 + 5 + 4 + 9 = ${u(perim(L1.pts), 'm')}`, `10 × 4 + 4 × 5 = 40 + 20 = ${u(areaOf(L1.pts), 'm²')}`,
      `8 × 5 + ½ × 8 × 3 = 40 + 12 = ${u(areaOf(HOUSE.pts), 'cm²')}`, `10 × 6 − 3 × 2 = 60 − 6 = ${u(60 - 6, 'm²')}`],
    hint: 'Rectangle A = l × w · Triangle A = ½ × b × h · Shaded area = whole shape − the white part · Perimeter: add every side.',
    rounds: [
      figRound('find the area of each shape.', [
        A({ pts: [[0, 0], [8, 0], [8, 3], [3, 3], [3, 7], [0, 7]], sides: ['8 cm', '3 cm', '', '', '3 cm', '7 cm'], right: [0, 5] }, 'cm'),
        A({ pts: [[0, 0], [10, 0], [10, 8], [6, 8], [6, 3], [0, 3]], sides: ['10 m', '8 m', '4 m', '', '', '3 m'], right: [0, 1] }, 'm'),
        A({ pts: [[0, 0], [6, 0], [6, 4], [3, 7], [0, 4]], sides: ['6 cm', '4 cm'], dash: [[[0, 4], [6, 4]], [[3, 7], [3, 4]]], dims: [[[0, 4], [0, 7], '3 cm', 1]], right: [0, 1] }, 'cm'),
        A({ pts: [[0, 0], [14, 0], [8, 5], [0, 5]], sides: ['14 m', '', '8 m', '5 m'], dash: [[[8, 5], [8, 0]]], right: [0, 3] }, 'm'),
      ]),
      figRound('find each shaded area.', [
        A(cap({ pts: [[0, 0], [10, 0], [10, 6], [0, 6]], sides: ['10 m', '6 m'], shade: true, holes: [[[3, 1.5], [7, 1.5], [7, 4.5], [3, 4.5]]] }, 'White: 4 m by 3 m'), 'm'),
        A(cap({ pts: [[0, 0], [8, 0], [8, 8], [0, 8]], sides: ['8 cm', '8 cm'], shade: true, holes: [[[1.5, 1.5], [6.5, 1.5], [6.5, 6.5], [1.5, 6.5]]] }, 'White square: 5 cm'), 'cm'),
        A({ pts: [[0, 0], [12, 0], [12, 7], [0, 7]], sides: ['12 m', '7 m'], shade: true, holes: [[[0, 0], [12, 0], [6, 7]]] }, 'm'),
        A(cap({ pts: [[0, 0], [11, 0], [11, 7], [0, 7]], sides: ['11 cm', '7 cm'], shade: true, holes: [[[1.5, 1.5], [9.5, 1.5], [9.5, 5.5], [1.5, 5.5]]] }, 'White: 8 cm by 4 cm'), 'cm'),
      ]),
    ],
  },
  medium: {
    ex: { stem: 'Find the perimeter or area. Split the shape, or subtract.', parts: [
      { t: 'Perimeter', fig: S.shape({ size: 24, maxH: 16, ...STAIRS }) }, 'Area of the shape in part a. Each step is 4 m wide.', { t: 'Area', fig: S.shape({ size: 24, maxH: 16, ...ROOF }) }, { t: 'Shaded area', fig: S.shape({ size: 24, maxH: 16, ...TRIHOLE }) }] },
    exAns: [`the steps add to 12 m across and 9 m up: P = 2 × (12 + 9) = ${u(perim(STAIRS.pts), 'm')}`, `12 × 3 + 8 × 3 + 4 × 3 = ${u(areaOf(STAIRS.pts), 'm²')}`,
      `7.5 × 4 + ½ × 7.5 × 2.4 = 30 + 9 = ${u(areaOf(ROOF.pts), 'cm²')}`, `12 × 8 − ½ × 5 × 4 = 96 − 10 = ${u(96 - 10, 'm²')}`],
    hint: 'Missing sides: use the opposite sides (across the shape the lengths add up). Split into rectangles and triangles, or take away.',
    rounds: [
      figRound('find the perimeter of each shape.', [
        P({ pts: [[0, 0], [10, 0], [10, 4], [5, 4], [5, 8], [0, 8]], sides: ['10 cm', '4 cm', '', '', '', '8 cm'], right: [0, 5] }, 'cm'),
        P({ pts: [[0, 0], [9, 0], [9, 6], [7, 6], [7, 2.5], [2, 2.5], [2, 6], [0, 6]], sides: ['9 m', '6 m', '2 m', '', '', '', '2 m', '6 m'], dims: [[[7, 6], [7, 2.5], '3.5 m', -1]] }, 'm'),
        P({ pts: [[0, 0], [8, 0], [8, 5], [4, 8], [0, 5]], sides: ['8 m', '5 m', '5 m', '5 m', '5 m'], right: [0, 1] }, 'm'),
        P({ pts: [[4, 0], [8, 0], [8, 5], [12, 5], [12, 8], [0, 8], [0, 5], [4, 5]], sides: ['4 cm', '5 cm', '', '3 cm', '12 cm', '', '', ''] }, 'cm', 'It is symmetrical.'),
      ]),
      figRound('find the area of each shape.', [
        A({ pts: [[0, 0], [10, 0], [10, 6], [8, 6], [8, 3], [2, 3], [2, 6], [0, 6]], sides: ['10 m', '6 m', '2 m', '', '', '', '2 m', ''], dims: [[[8, 6], [8, 3], '3 m', -1]], right: [0, 1] }, 'm'),
        A({ pts: [[0, 0], [9, 0], [13, 3], [9, 6], [0, 6]], sides: ['9 cm', '', '', '', '6 cm'], dash: [[[9, 0], [9, 6]], [[9, 3], [13, 3]]], dims: [[[9, 0], [13, 0], '4 cm', -1]], right: [0, 4] }, 'cm'),
        A({ pts: [[0, 0], [10, 0], [10, 10], [0, 10]], sides: ['', '', '10 m', '10 m'], shade: true, holes: [[[4, 0], [10, 0], [10, 5]]], labels: [['6 m', 7, -1.5], ['5 m', 10.5, 2.1, { anchor: 'start' }]] }, 'm'),
        A(cap({ pts: [[0, 0], [12, 0], [12, 8], [0, 8]], sides: ['12 cm', '8 cm'], shade: true, holes: [[[2, 2], [10, 2], [10, 6], [2, 6]]] }, 'White: 8 cm by 4 cm'), 'cm'),
      ]),
    ],
  },
  mixed: mix(
    ['A rectangle is 12 m by 5 m. Find its perimeter.', u(2 * (12 + 5), 'm'), '10.4'],
    ['Find the percentage error of 40 cm, to the nearest cm.', `${num(pctErr(meas('40 cm').e, 40))}%`, '10.3'],
    ['A 12 m by 8 m yard has a 3 m by 2 m garden bed; the rest is lawn. Lawn area?', u(12 * 8 - 3 * 2, 'm²'), '10.4'],
    ['Convert 2.4 m to cm.', u(conv(2.4, 'm', 'cm'), 'cm'), '10.1'],
    ['A triangle has base 9 m and height 4 m. Find its area.', u(0.5 * 9 * 4, 'm²'), '10.4'],
    ['Write the limits of 7.2 m.', limits('7.2 m'), '10.2'],
    ['An L-shape is made of a 6 m by 2 m and a 3 m by 2 m rectangle. Area?', u(12 + 6, 'm²'), '10.4'],
    ['A square has an area of 49 cm². Find its perimeter.', u(4 * 7, 'cm'), '10.4'],
  ),
};
