// Lesson 11.3 The gradient of an interval (three pages; see ../chapter.js and lib/lesson-two.js). Textbook 11.03.
const { n, P, mid, frac, gradWork, lenAns, formFig, mq, set } = require('../helpers');
const { plane, graph, pair, askNote } = require('../shapes');

const MF = 'm = (y₂−y₁) ÷ (x₂−x₁)';
const m = (a, b) => frac(b[1] - a[1], b[0] - a[0]);
// An interval on a small grid (no axes) going run across and rise up (or down, when rise < 0); labels: show the run and
// rise (true) or leave students to count them (false)
const slope = (run, rise, { k = 2, labels = true } = {}) => {
  const a = [1, rise < 0 ? 1 - rise : 1], c = [1 + run, a[1] + rise], top = Math.max(a[1], c[1]);
  return plane({ x: [0, run + 2], y: [0, top + 1], k, grid: true, axes: false, segs: [[a, c]], pts: [a, c],
    steps: labels ? [[a, c, n(run), n(rise)]] : [], notes: [askNote(a, c, k, 'm = ?', rise > 0 ? 1 : -1)] });
};
const q = (a, b, o) => [pair(a, b, { ask: 'm = ?', size: 30, maxH: 16, axes: false, ...o }), m(a, b)];
// A whole line y = mx + c on a numbered grid, with two grid points on it marked
const lineQ = (p, r, c, { x = [-4, 4], y = [-4, 4], k = 2.4, pts } = {}) => [graph({ x, y, k, lines: [[{ m: p / r, c }]], pts: pts || [[0, c], [r, c + p]],
  notes: [[x[0] + 0.2, y[1] - 0.6, 'm = ?', { anchor: 'start' }]] }), frac(p, r)];

const notesFig = () => plane({ x: [0, 7], y: [0, 5], k: 4.4, grid: true, nums: true, segs: [[[1, 1], [5, 3]]], pts: [[1, 1], [5, 3]],
  steps: [[[1, 1], [5, 3], 'run = 4', 'rise = 2']], notes: [[2.4, 3.2, 'm = 2 ÷ 4 = ½', { anchor: 'middle', blue: true }]] });

module.exports = {
  code: '11.3', title: 'The gradient of an interval',
  li: 'find the gradient (steepness) of an interval or a line.',
  sc: ['say whether a gradient is positive, negative, zero or undefined', 'find a gradient by counting rise and run on a grid', 'use the gradient formula with any two points'],
  notes: {
    terms: [['gradient (m)', 'the steepness of a line: rise ÷ run'], ['rise', 'change in y: up +, down −'], ['run', 'change in x, left to right'],
      ['positive', 'goes up to the right'], ['negative', 'goes down to the right'], ['zero', 'horizontal line'], ['undefined', 'vertical line (run = 0)']],
    formulas: ['m = rise ÷ run', MF, 'Horizontal: m = 0', 'Vertical: m is undefined'],
    steps: ['pick two points on the line', 'count the run (to the right)', 'count the rise (up + or down −)', 'm = rise ÷ run, simplified'],
    fig: notesFig(),
  },
  easy: {
    ex: { stem: 'Find each gradient.', parts: [
      { t: 'Gradient', fig: slope(4, 2, { k: 2.6 }) }, { t: 'Gradient', fig: slope(3, -6, { k: 2.2, labels: false }) },
      { t: 'Gradient', fig: pair([1, 2], [5, 10], { ask: 'm = ?', size: 22, maxH: 12, axes: false }) }, { t: 'Gradient', fig: pair([-3, 2], [4, 2], { ask: 'm = ?', size: 24, maxH: 8, axes: false }) }] },
    exAns: ['m = rise ÷ run = 2 ÷ 4 = ½', 'm = −6 ÷ 3 = −2 (down to the right)', gradWork([1, 2], [5, 10]), 'm = 0 ÷ 7 = 0 (horizontal)'],
    hint: 'm = rise ÷ run · up is +, down is − · always run to the right · simplify the fraction',
    work: true,
    rounds: [
      { text: 'find the gradient of each interval.', cols: 4, ...formFig([[2, 4], [4, 2], [3, 3], [2, 6]].map(([r, s]) => [slope(r, s), frac(s, r)]), 'm = rise ÷ run') },
      { text: 'count the rise and run, then find each gradient.', cols: 4, ...formFig([[2, -4], [4, 2], [3, -3], [2, 6]].map(([r, s], i) => [slope(r, s, { labels: false, k: i === 3 ? 1.9 : 2 }), frac(s, r)]), true) },
    ],
  },
  drill: {
    hint: 'm = (y₂ − y₁) ÷ (x₂ − x₁) · subtract in the same order · a negative ÷ a positive is negative',
    rounds: [
      { text: 'use the gradient formula.', ...formFig([q([1, 3], [4, 9]), q([2, 8], [6, 0]), q([-1, -1], [5, 2])], MF) },
      { text: 'find each gradient. Simplify fractions.', ...formFig([q([-2, -5], [1, 4]), q([-1, -1], [5, -3]), q([3, -2], [-3, 2])], true) },
      { text: 'is the gradient positive, negative, zero or undefined? Find it if you can.', ...formFig([
        [pair([-3, 2], [4, 2], { ask: 'm = ?', size: 30, maxH: 8, axes: false }), '0 (zero: horizontal)'], [pair([2, -3], [2, 4], { ask: 'm = ?', size: 10, maxH: 16, axes: false }), 'undefined (vertical)'],
        q([-3, 3], [3, -1])], true, ['Type', 'Working', 'Gradient']) },
      { text: 'find the gradient of each line.', ...formFig([lineQ(2, 1, -1), lineQ(-1, 1, 3), lineQ(1, 2, 1)], true) },
    ],
  },
  medium: {
    ex: { stem: 'Find each gradient or value.', parts: [
      { t: 'Gradient', fig: pair([-3, 4], [5, -2], { ask: 'm = ?', size: 22, maxH: 12 }) }, { t: 'Gradient', fig: lineQ(3, 2, 0, { x: [-3, 3], y: [-3, 3], k: 2.5, pts: [[-2, -3], [2, 3]] })[0] },
      'The line through (1, 2) and (4, k) has gradient 3. Find k.', 'Which line is steeper: m = −3 or m = 2?'] },
    exAns: [gradWork([-3, 4], [5, -2]), 'm = 6 ÷ 4 = 3/2', '(k − 2) ÷ 3 = 3, so k − 2 = 9 and k = 11', 'm = −3: it changes by 3 for each 1 across (the sign only gives the direction)'],
    work: true, set: true,
    rounds: [set([
      mq('Find the gradient of the interval joining (2, −1) and (6, 7).', m([2, -1], [6, 7])),
      mq('Find the midpoint of (−2, 5) and (6, 1).', P(mid([-2, 5], [6, 1])), { from: '11.2' }),
      mq('Find the gradient of the line through (−4, 3) and (2, −6).', m([-4, 3], [2, -6])),
      mq('Gradient', m([-1, 3], [2, -3]), { fig: pair([-1, 3], [2, -3], { ask: 'm = ?', size: 20, maxH: 6, axes: false }) }),
      mq('Find the length of the interval from (−1, 2) to (5, 10).', lenAns(100), { from: '11.1' }),
      mq('Is the gradient of the line through (3, 5) and (3, −2) zero or undefined? Explain.', 'Undefined: the run is 3 − 3 = 0 (a vertical line)', { form: false }),
      mq('A ramp rises 1.2 m over a run of 4.8 m. Find its gradient.', 'm = 1.2 ÷ 4.8 = 0.25 (¼)'),
      mq('Find the volume of a rectangular prism 8 cm long, 5 cm wide and 3 cm high.', 'V = 8 × 5 × 3 = 120 cm³', { from: '10.10' }),
      mq('The line through (2, k) and (5, 11) has gradient 3. Find k.', '(11 − k) ÷ 3 = 3, so 11 − k = 9 and k = 2', { form: false }),
    ])],
  },
  worded: [
    { q: 'A road climbs 45 m over a horizontal distance of 600 m. Find its gradient as a decimal and as a percentage.', a: 'm = 45 ÷ 600 = 0.075, which is 7.5%' },
    { q: 'A roof rises 2.4 m over a horizontal distance of 4 m. A builder says the roof is steeper than a ramp with gradient ½. Is the builder right? Explain.', a: 'Roof: m = 2.4 ÷ 4 = 0.6. Ramp: 0.5. 0.6 > 0.5, so yes, the roof is steeper' },
    { q: 'Show that the points A(0, 1), B(2, 5) and C(5, 11) lie on one straight line.', a: `m(AB) = 4 ÷ 2 = 2 and m(BC) = 6 ÷ 3 = 2: the same gradient through the shared point B, so A, B and C are on one line` },
  ],
};
