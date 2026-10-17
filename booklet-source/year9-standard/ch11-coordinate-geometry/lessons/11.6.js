// Lesson 11.6 Finding the equation of a line (four pages; see ../chapter.js). Every question is the same: a line on a
// number plane through two marked points A and B (with their coordinates on pages 1 and 2, letters only on pages 3
// and 4): find its equation. Textbook 11.06.
const { frac, eq, formFig, mq, set } = require('../helpers');
const { std, lineAB, freeCorner, graph } = require('../shapes');

// One question: y = (p/r)x + c through the points a and b
const lq = (p, r, c, a, b, o = {}) => [lineAB(p / r, c, a, b, o), `m = ${frac(p, r)}, c = ${c}: ${eq([p, r], c)}`];
const L1 = ['Formula', 'm and c', 'Equation'], L3 = ['A and B', 'm and c', 'Equation'];
const notesFig = () => graph({ x: [-2, 5], y: [-1, 4], k: 4, lines: [[{ m: 0.5, c: 1 }, 'y = ½x + 1', 3.5, 'n']], pts: [[0, 1, 'c = 1', 'nw'], [2, 2]],
  steps: [[[0, 1], [2, 2], 'run 2', 'rise 1']] });

module.exports = {
  code: '11.6', title: 'Finding the equation of a line',
  li: 'find the equation of a straight line from its graph.',
  sc: ['read the y-intercept where the line crosses the y-axis', 'find the gradient from two points on the line', 'write the equation of the line as y = mx + c'],
  notes: {
    terms: [['y-intercept (c)', 'where the line crosses the y-axis'], ['gradient (m)', 'rise ÷ run between two points'], ['y = mx + c', 'the equation of the line']],
    formulas: ['y = mx + c', 'm = (y₂ − y₁) ÷ (x₂ − x₁)', 'Two points not on the y-axis: find m, then substitute a point to find c'],
    steps: ['read c where the line crosses the y-axis', 'find m from A and B', 'write y = mx + c', 'check with another point'],
    fig: notesFig(),
  },
  easy: {
    ex: { stem: 'Find the equation of each line.', parts: [
      { t: 'Equation', fig: lineAB(1, 2, [0, 2], [2, 4], { size: 'mid', ask: '' }) }, { t: 'Equation', fig: lineAB(-2, 3, [0, 3], [2, -1], { size: 'mid', ask: '' }) },
      { t: 'Equation', fig: lineAB(0.5, -1, [0, -1], [4, 1], { size: 'mid', ask: '' }) }, { t: 'Equation', fig: lineAB(-1, 1, [0, 1], [3, -2], { size: 'mid', ask: '' }) }] },
    exAns: [`c = 2, m = 2 ÷ 2 = 1: ${eq(1, 2)}`, `c = 3, m = −4 ÷ 2 = −2: ${eq(-2, 3)}`, `c = −1, m = 2 ÷ 4 = ½: ${eq([1, 2], -1)}`, `c = 1, m = −3 ÷ 3 = −1: ${eq(-1, 1)}`],
    hint: 'c: where the line crosses the y-axis · m = rise ÷ run from A to B · then write y = mx + c',
    work: true,
    rounds: [{ text: 'find the equation of the line.', cols: 2, ...formFig([lq(2, 1, 1, [0, 1], [2, 5]), lq(-1, 1, 3, [0, 3], [4, -1])], 'y = mx + c', L1) }],
  },
  drill: {
    hint: 'Check your equation: substitute B’s x-value and you should get B’s y-value.',
    rounds: [
      { text: 'find the equation of the line.', cols: 2, ...formFig([lq(3, 1, -2, [0, -2], [2, 4]), lq(-2, 1, 1, [0, 1], [2, -3])], true, L1) },
      { text: 'find the equation of the line.', cols: 2, ...formFig([lq(1, 2, 1, [0, 1], [4, 3]), lq(1, 1, -3, [0, -3], [4, 1])], true, L1) },
      { text: 'find the equation of the line.', cols: 2, ...formFig([lq(-1, 2, 2, [0, 2], [-4, 4]), lq(2, 1, 3, [0, 3], [-2, -1])], true, L1) },
    ],
  },
  drill2: {
    hint: 'Read A and B off the grid · read c where the line crosses the y-axis.',
    rounds: [
      { text: 'read A and B, then find the equation of the line.', cols: 2, ...formFig([lq(2, 1, -1, [-1, -3], [2, 3], { coords: false }), lq(-1, 1, 2, [-2, 4], [3, -1], { coords: false })], true, L3) },
      { text: 'read A and B, then find the equation of the line.', cols: 2, ...formFig([lq(1, 2, -1, [-2, -2], [4, 1], { coords: false }), lq(-3, 1, 2, [-1, 5], [1, -1], { coords: false })], true, L3) },
      { text: 'read A and B, then find the equation of the line.', cols: 2, ...formFig([lq(1, 1, 1, [-4, -3], [2, 3], { coords: false }), lq(-2, 1, -2, [-3, 4], [1, -4], { coords: false })], true, L3) },
    ],
  },
  medium: {
    ex: { stem: 'Read the points, then find the equation of each line.', parts: [
      { t: 'Equation', fig: lineAB(-2 / 3, 2, [-3, 4], [3, 0], { size: 'mid', coords: false, ask: '' }) }, { t: 'Equation', fig: lineAB(3, -4, [1, -1], [3, 5], { size: 'mid', coords: false, ask: '' }) },
      { t: 'Equation', fig: lineAB(-1, 1, [-2, 3], [3, -2], { size: 'mid', coords: false, ask: '' }) }, { t: 'Equation', fig: lineAB(0.25, 2, [-4, 1], [4, 3], { size: 'mid', coords: false, ask: '' }) }] },
    exAns: [`m = −4 ÷ 6 = −⅔, c = 2: ${eq([-2, 3], 2)}`, `m = 6 ÷ 2 = 3; −1 = 3 × 1 + c, c = −4: ${eq(3, -4)}`, `m = −5 ÷ 5 = −1, c = 1: ${eq(-1, 1)}`, `m = 2 ÷ 8 = ¼, c = 2: ${eq([1, 4], 2)}`],
    work: true, set: true,
    rounds: [set([
      mq('Equation', lq(4, 1, -3, [0, -3], [2, 5])[1], { fig: lineAB(4, -3, [0, -3], [2, 5], { size: 'small', coords: false }), lines: L3 }),
      mq('', 'm = −2, c = 3: (0, 3) and (1, 1)', { fig: std('small', { notes: [freeCorner('small', [], 'y = 3 − 2x')] }), from: '11.5', lines: ['m and c', 'Two points', 'Graph'] }),
      mq('Equation', lq(-1, 2, 3, [-2, 4], [4, 1])[1], { fig: lineAB(-0.5, 3, [-2, 4], [4, 1], { size: 'small', coords: false }), lines: L3 }),
      mq('Equation', lq(3, 4, 0, [-4, -3], [4, 3])[1], { fig: lineAB(0.75, 0, [-4, -3], [4, 3], { size: 'small', coords: false }), lines: L3 }),
      mq('', '(4, 0) and (0, −4)', { fig: std('small', { lines: [[{ m: 1, c: -4 }]], notes: [freeCorner('small', [], 'y = x − 4', [(x) => x - 4])] }), from: '11.4', lines: ['x-intercept', 'y-intercept', 'Check'] }),
      mq('Equation', lq(-3, 1, -1, [-2, 5], [1, -4])[1], { fig: lineAB(-3, -1, [-2, 5], [1, -4], { size: 'small', coords: false }), lines: L3 }),
    ])],
  },
  worded: [
    { q: 'A candle is 24 cm tall when it is lit, and 18 cm tall after 2 hours. It burns at a steady rate. Write an equation for its height h cm after t hours, and find when it burns out.', a: 'm = (18 − 24) ÷ 2 = −3, c = 24: h = −3t + 24. 0 = −3t + 24, so t = 8 hours' },
    { q: 'A 4 km taxi trip costs $13 and a 10 km trip costs $25. Find an equation for the cost C dollars of a d km trip. What is the flagfall (the charge for 0 km)?', a: 'm = (25 − 13) ÷ (10 − 4) = 2; 13 = 2 × 4 + c, c = 5: C = 2d + 5. Flagfall $5' },
    { q: 'Find the equation of the line through A(−2, −1) and B(4, 11), then find where it crosses the x-axis.', a: `m = 12 ÷ 6 = 2; −1 = 2 × (−2) + c, c = 3: ${eq(2, 3)}. 0 = 2x + 3, x = −1.5: (−1.5, 0)` },
  ],
};
