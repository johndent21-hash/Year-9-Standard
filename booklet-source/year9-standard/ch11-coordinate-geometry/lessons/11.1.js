// Lesson 11.1 The length of an interval (three pages: Easy with the Notes box, Easy drill, then Medium with earlier
// work mixed in and three worded problems). See lib/lesson-two.js and ../chapter.js. Textbook 11.01.
const { num, n, dist, lenAns, distWork, formFig, mq, set } = require('../helpers');
const { plane, pair, askNote, cornerNote } = require('../shapes');

const D = 'd² = (x₂−x₁)² + (y₂−y₁)²';
const len = (a, b) => lenAns((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2);
// A right-angled triangle on a grid (no axes): the run and rise given, the interval's length asked
const tri = (run, rise, k = 2.2) => plane({ x: [1, run + 3], y: [1, rise + 3], k, grid: true, segs: [[[2, 2], [2 + run, 2 + rise]]],
  steps: [[[2, 2], [2 + run, 2 + rise], n(run), n(rise)]], pts: [[2, 2], [2 + run, 2 + rise]], notes: [askNote([2, 2], [2 + run, 2 + rise], k, 'd = ?')] });
// An interval on a numbered grid, its length asked
const onGrid = (a, b, { x = [-5, 4], y = [-4, 4], k = 2.2, every = 2 } = {}) => plane({ x, y, k, grid: true, nums: true, every, segs: [[a, b]], pts: [a, b],
  notes: [cornerNote(a, b, x, y, 'd = ?')] });
const q = (a, b, o) => [pair(a, b, { ask: 'd = ?', size: 18, maxH: 9, axes: false, ...o }), len(a, b)];
// The drill size: on axes, up to 46 mm wide and 26 mm tall
const qd = (a, b, o) => q(a, b, { size: 30, maxH: 16, ...o });

const notesFig = () => plane({ x: [0, 6], y: [0, 5], k: 4.6, grid: true, nums: true, segs: [[[1, 1], [5, 4]]], steps: [[[1, 1], [5, 4], 'run = 4', 'rise = 3']],
  pts: [[1, 1, 'A(1, 1)', 'nw'], [5, 4, 'B(5, 4)', 'ne']], notes: [[2.6, 3.1, 'd = 5', { anchor: 'end', blue: true }]] });

module.exports = {
  code: '11.1', title: 'The length of an interval',
  li: 'find the length of an interval on the number plane.',
  sc: ['use Pythagoras’ theorem to find the length of an interval on a grid', 'use the distance formula with any two points', 'give a length as a whole number or correct to one decimal place'],
  notes: {
    terms: [['interval', 'part of a line between two endpoints'], ['run', 'the change in x: x₂ − x₁'], ['rise', 'the change in y: y₂ − y₁'],
      ['length (d)', 'the distance from one endpoint to the other'], ['(x₁, y₁), (x₂, y₂)', 'the two endpoints'], ['√', 'square root']],
    formulas: ['d² = run² + rise²', D, 'Horizontal: d = difference in x', 'Vertical: d = difference in y'],
    steps: ['find the run and the rise', 'square them and add', 'square root', 'round to 1 d.p.'],
    fig: notesFig(),
  },
  easy: {
    ex: { stem: 'Find the length of each interval. Round to one decimal place where needed.', parts: [
      { t: 'Length', fig: tri(3, 4, 2.4) }, { t: 'Length', fig: pair([2, 1], [8, 9], { ask: 'd = ?', size: 22, maxH: 12 }) },
      { t: 'Length', fig: pair([-1, 2], [3, -1], { ask: 'd = ?', size: 22, maxH: 12 }) }, { t: 'Length', fig: pair([1, 2], [4, 8], { ask: 'd = ?', size: 22, maxH: 12 }) }] },
    exAns: ['d² = 3² + 4² = 25, so d = √25 = 5', distWork([2, 1], [8, 9]), distWork([-1, 2], [3, -1]), distWork([1, 2], [4, 8])],
    hint: 'run = across, rise = up or down · d² = run² + rise² (Pythagoras) · square root last · round to 1 d.p.',
    work: true,
    // Small steps: the run and rise drawn and labelled, then two points with their coordinates (formula left blank).
    rounds: [
      { text: 'find the length of each interval.', cols: 4, ...formFig([[3, 4], [2, 3], [5, 1], [4, 4]].map(([r, s]) => [tri(r, s, 2), lenAns(r * r + s * s)]), 'c² = a² + b²') },
      { text: 'find the length of each interval.', cols: 4, ...formFig([q([1, 2], [4, 6]), q([1, 1], [7, 9]), q([1, 4], [6, 2]), q([2, 1], [5, 7])], true) },
    ],
  },
  drill: {
    hint: 'Subtract in the same order for x and y · a negative squared is positive.',
    rounds: [
      { text: 'use the distance formula to find each length.', ...formFig([qd([2, 3], [8, 11]), qd([1, 5], [6, -7]), qd([-3, 1], [1, 4])], D) },
      { text: 'find each length, correct to one decimal place.', ...formFig([qd([-2, -3], [4, 1]), qd([-5, 2], [1, -4]), qd([-1, -6], [3, -2])], true) },
      { text: 'find the length of each interval on the grid.', ...formFig([[onGrid([-3, -2], [2, 1]), len([-3, -2], [2, 1])], [onGrid([-2, 3], [3, -1]), len([-2, 3], [3, -1])], [onGrid([-4, 1], [2, -2]), len([-4, 1], [2, -2])]], true) },
      { text: 'each interval is horizontal or vertical. Find its length.', ...formFig([qd([-3, 2], [5, 2]), qd([1, -4], [1, 3]), qd([-6, -1], [-1, -1])], true) },
    ],
  },
  medium: {
    ex: { stem: 'Give lengths correct to one decimal place where needed.', parts: [
      { t: 'Length', fig: pair([-2, 5], [4, -3], { ask: 'd = ?', size: 22, maxH: 12 }) },
      { t: 'Length', fig: onGrid([-3, -2], [3, 1], { x: [-4, 4], y: [-3, 3], k: 2.4 }) },
      { t: 'Perimeter', fig: plane({ x: [-1, 5], y: [-1, 4], k: 3, poly: [[0, 0], [4, 0], [0, 3]], pts: [[4, 0, '(4, 0)', 's'], [0, 3, '(0, 3)', 'e']], notes: [[1.3, 0.8, 'P = ?']] }) },
      { t: 'Isosceles?', fig: plane({ x: [0, 6], y: [0, 6], k: 2.6, axes: false, poly: [[1, 1], [5, 1], [3, 5]], pts: [[1, 1, 'P(1, 1)', 's'], [5, 1, 'Q(5, 1)', 's'], [3, 5, 'R(3, 5)', 'e']] }) }] },
    exAns: [distWork([-2, 5], [4, -3]), distWork([-3, -2], [3, 1]), 'AB = √(4² + 3²) = 5, so P = 4 + 3 + 5 = 12',
      `PR = √(2² + 4²) = √20 and QR = √((−2)² + 4²) = √20, so PR = QR: isosceles`],
    work: true, set: true,
    // Less scaffolding than Chapter 10: no Remember hint, and most questions are words for students to set out.
    rounds: [set([
      mq('Find the length of the interval joining (3, −2) and (9, 6).', len([3, -2], [9, 6])),
      mq('Find the hypotenuse of a right-angled triangle with shorter sides 9 cm and 12 cm.', '15 cm', { from: 'Ch 2' }),
      mq('Find the distance between A(−4, 1) and B(2, −7).', len([-4, 1], [2, -7])),
      mq('Length', len([-3, -1], [3, 2]), { fig: pair([-3, -1], [3, 2], { ask: 'd = ?', size: 22, maxH: 7, axes: false }) }),
      mq('Solve 3x − 7 = 14.', 'x = 7', { from: 'Ch 7', form: false }),
      mq('Find the perimeter of the triangle with vertices (0, 0), (6, 0) and (6, 8).', `6 + 8 + 10 = 24 units`),
      mq('Which point is closer to the origin: A(5, −3) or B(−4, 4)?', `OA = ${len([0, 0], [5, -3])}, OB = ${len([0, 0], [-4, 4])}, so B`, { form: false }),
      mq('Find the volume of a cylinder with radius 3 cm and height 10 cm, correct to one decimal place.', `V = π × 3² × 10 = ${num(Math.PI * 90, 1)} cm³`, { from: '10.10' }),
      mq('The interval from (1, 2) to (k, 6) is 5 units long, and k > 1. Find k.', '(k − 1)² + 4² = 25, so k − 1 = 3 and k = 4', { form: false }),
    ])],
  },
  worded: [
    { q: 'On a map, 1 unit = 100 m. A drone flies in a straight line from (−3, 2) to (5, 8). How far does it fly, in metres?',
      a: `${distWork([-3, 2], [5, 8])} units, so ${num(dist([-3, 2], [5, 8]) * 100)} m` },
    { q: 'Town A is at (2, 1) and town B is at (14, 6) on a map grid in kilometres. The road goes 12 km east, then 5 km north. How much shorter is the straight-line distance than the road?',
      a: `${distWork([2, 1], [14, 6])} km; road 12 + 5 = 17 km, so 17 − 13 = 4 km shorter` },
    { q: 'Show that the triangle with vertices A(1, 1), B(7, 1) and C(4, 5) is isosceles, then find its perimeter.',
      a: `AC = √(3² + 4²) = 5, BC = √((−3)² + 4²) = 5, AB = 6: AC = BC, so isosceles. P = 5 + 5 + 6 = 16 units` },
  ],
};
