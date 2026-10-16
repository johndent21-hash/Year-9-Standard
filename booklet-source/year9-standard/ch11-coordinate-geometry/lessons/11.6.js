// Lesson 11.6 Finding the equation of a line (three pages; see ../chapter.js and lib/lesson-two.js). Textbook 11.06.
const { n, eq, frac, lenAns, formFig, mq, set } = require('../helpers');
const { graph, linePts, cornerNote } = require('../shapes');

// The line y = (p/r)x + c through two marked points with their coordinates: (0, c) and a grid point about 3 across
const lp = (p, r, c, o = {}) => { const x2 = r * Math.ceil(3 / r) > 3 ? r : r * Math.ceil(3 / r); return [linePts(p / r, c, [[0, c], [x2, c + (p / r) * x2]], { size: 20, maxH: 9, axes: false, ...o }), eq([p, r], c)]; };
// The line on a numbered grid, two grid points on it marked, its equation asked
const gq = (p, r, c, { x = [-4, 4], y = [-4, 4], k = 2.4, ask = 'y = ?' } = {}) => [graph({ x, y, k, lines: [[{ m: p / r, c }]], pts: [[0, c], [r, c + p]],
  notes: ask ? [cornerNote([x[0], (p / r) * x[0] + c], [x[1], (p / r) * x[1] + c], x, y, ask)] : [] }), eq([p, r], c)];
// Through two points: [picture, answer, words]
const two = (a, b) => { const p = b[1] - a[1], r = b[0] - a[0], c = a[1] - (p / r) * a[0]; return ['', `m = ${frac(p, r)}, c = ${n(c)}: ${eq([p, r], c)}`, `(${n(a[0])}, ${n(a[1])}) and (${n(b[0])}, ${n(b[1])})`]; };
const notesFig = () => graph({ x: [-2, 5], y: [-1, 4], k: 4, every: 1, lines: [[{ m: 0.5, c: 1 }, 'y = ½x + 1', 3.5, 'n']], pts: [[0, 1, 'c = 1', 'nw'], [2, 2]],
  steps: [[[0, 1], [2, 2], 'run 2', 'rise 1']] });

module.exports = {
  code: '11.6', title: 'Finding the equation of a line',
  li: 'find the equation of a straight line from its graph or from two points on it.',
  sc: ['read the y-intercept and gradient from a graph', 'write the equation of a line as y = mx + c', 'find the equation of a line through two points'],
  notes: {
    terms: [['y-intercept (c)', 'where the line crosses the y-axis'], ['gradient (m)', 'rise ÷ run between two points'], ['y = mx + c', 'the equation of the line']],
    formulas: ['y = mx + c', 'm = rise ÷ run = (y₂ − y₁) ÷ (x₂ − x₁)', 'Two points: find m, then substitute a point to find c'],
    steps: ['find c where the line crosses the y-axis', 'find m from two points', 'write y = mx + c', 'check with another point'],
    fig: notesFig(),
  },
  easy: {
    ex: { stem: 'Find the equation of each line.', parts: [
      { t: 'Equation', fig: gq(2, 1, 1, { x: [-3, 3], y: [-3, 4], k: 2.3, ask: '' })[0] }, { t: 'Equation', fig: gq(-3, 1, 2, { x: [-3, 3], y: [-3, 4], k: 2.3, ask: '' })[0] },
      { t: 'Equation', fig: gq(1, 2, -1, { x: [-3, 3], y: [-3, 3], k: 2.6, ask: '' })[0] }, { t: 'Equation', fig: gq(-1, 1, -2, { x: [-3, 3], y: [-4, 2], k: 2.4, ask: '' })[0] }] },
    exAns: [`c = 1, m = 2 ÷ 1 = 2: ${eq(2, 1)}`, `c = 2, m = −3 ÷ 1 = −3: ${eq(-3, 2)}`, `c = −1, m = 1 ÷ 2 = ½: ${eq([1, 2], -1)}`, `c = −2, m = −1: ${eq(-1, -2)}`],
    hint: 'c: where the line crosses the y-axis · m = rise ÷ run between the two points · then write y = mx + c',
    work: true,
    rounds: [
      { text: 'find the equation of each line.', cols: 4, ...formFig([lp(1, 1, 2), lp(2, 1, -1), lp(-1, 1, 1), lp(3, 1, 0)], 'y = mx + c') },
      { text: 'find the equation of each line.', cols: 4, ...formFig([lp(-2, 1, 3), lp(1, 2, 1), lp(-3, 1, -1), lp(1, 1, -3)], true) },
    ],
  },
  drill: {
    hint: 'No point on the y-axis? Find m, then substitute one point into y = mx + c to find c.',
    rounds: [
      { text: 'find the equation of each line.', ...formFig([gq(3, 1, -2), gq(-1, 2, 2), gq(-2, 1, -1)], 'y = mx + c') },
      { text: 'find the equation of the line through the two points.', ...formFig([two([0, 3], [2, 7]), two([0, -1], [4, 1]), two([0, 4], [2, -2])], true) },
      { text: 'find the equation of the line through the two points.', ...formFig([two([1, 5], [3, 9]), two([2, 1], [4, 7]), two([-2, 6], [2, -2])], true, ['m', 'c', 'Equation']) },
      { text: 'find the equation from the gradient and a point.', ...formFig([['', `c = 5 − 3 × 2 = −1: ${eq(3, -1)}`, 'm = 3, through (2, 5)'], ['', `c = 4 + 2 × 1 = 6: ${eq(-2, 6)}`, 'm = −2, through (1, 4)'],
        ['', `c = 1 − ½ × 4 = −1: ${eq([1, 2], -1)}`, 'm = ½, through (4, 1)']], true, ['m', 'c', 'Equation']) },
    ],
  },
  medium: {
    ex: { stem: 'Find each equation.', parts: [
      { t: 'Equation', fig: gq(-2, 3, 2, { x: [-1, 4], y: [-1, 3], k: 3.4, ask: '' })[0] }, 'Find the equation of the line through (−1, 7) and (2, −2).',
      'A line has gradient 4 and passes through (−1, −6). Find its equation.', 'Does (3, 10) lie on the line in part c?'] },
    exAns: [`c = 2, m = −2 ÷ 3: ${eq([-2, 3], 2)}`, `m = −9 ÷ 3 = −3; 7 = −3 × (−1) + c, so c = 4: ${eq(-3, 4)}`, `−6 = 4 × (−1) + c, so c = −2: ${eq(4, -2)}`, '4 × 3 − 2 = 10 ✓ Yes'],
    work: true, set: true,
    rounds: [set([
      mq('Find the equation of the line through (0, −5) with gradient 4.', eq(4, -5)),
      mq('State m and c for y = 7 − 2x.', 'm = −2, c = 7', { from: '11.5' }),
      mq('Find the equation of the line through (1, 1) and (3, 7).', eq(3, -2)),
      mq('Equation', eq(-1, 3), { fig: linePts(-1, 3, [[0, 3], [4, -1]], { size: 26, maxH: 7 }) }),
      mq('Find the y-intercept of 2x + 5y = 20.', '4', { from: '11.4' }),
      mq('Find the equation of the line through (−2, 3) and (4, 6).', eq([1, 2], 4)),
      mq('A line with gradient −3 passes through (2, −1). Find its equation.', eq(-3, 5)),
      mq('Find the distance between (−3, 0) and (3, 8).', lenAns(100), { from: '11.1' }),
      mq('Find the equation of the line through (−1, 4) that is parallel to y = 2x − 7.', `m = 2; 4 = 2 × (−1) + c, c = 6: ${eq(2, 6)}`),
    ])],
  },
  worded: [
    { q: 'A candle is 24 cm tall when it is lit, and 18 cm tall after 2 hours. It burns at a steady rate. Write an equation for its height h cm after t hours, and find when it burns out.', a: 'm = (18 − 24) ÷ 2 = −3, c = 24: h = −3t + 24. 0 = −3t + 24, so t = 8 hours' },
    { q: 'A 4 km taxi trip costs $13 and a 10 km trip costs $25. Find an equation for the cost C dollars of a d km trip. What is the flagfall (the charge for 0 km)?', a: 'm = (25 − 13) ÷ (10 − 4) = 2; 13 = 2 × 4 + c, c = 5: C = 2d + 5. Flagfall $5' },
    { q: 'Find the equation of the line through A(−2, −1) and B(4, 11), then find where it crosses the x-axis.', a: `m = 12 ÷ 6 = 2; −1 = 2 × (−2) + c, c = 3: ${eq(2, 3)}. 0 = 2x + 3, x = −1.5: (−1.5, 0)` },
  ],
};
