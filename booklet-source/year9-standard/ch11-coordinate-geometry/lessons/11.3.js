// Lesson 11.3 The gradient of an interval (four pages; see ../chapter.js). Every question is an interval AB on a
// number plane. Textbook 11.03.
const { P, mid, frac, lenAns, gradWork, formFig, mq, set } = require('../helpers');
const { interval, plane } = require('../shapes');

const MF = 'm = (y₂−y₁) ÷ (x₂−x₁)';
const m = (a, b) => (a[0] === b[0] ? 'undefined (vertical)' : frac(b[1] - a[1], b[0] - a[0]));
const q = (a, b, o = {}) => [interval(a, b, { ask: 'm = ?', ...o }), m(a, b)];
const L1 = ['Formula', 'Substitute', 'm ='], L3 = ['A and B', 'Substitute', 'm =']
const notesFig = () => plane({ x: [0, 7], y: [0, 5], k: 4.4, grid: true, nums: true, segs: [[[1, 1], [5, 3]]], pts: [[1, 1], [5, 3]],
  steps: [[[1, 1], [5, 3], 'run = 4', 'rise = 2']], notes: [[2.4, 3.3, 'm = 2 ÷ 4 = ½', { anchor: 'middle', blue: true }]] });

module.exports = {
  code: '11.3', title: 'The gradient of an interval',
  li: 'find the gradient (steepness) of an interval on the number plane.',
  sc: ['read the coordinates of the endpoints of an interval', 'use the gradient formula with the two points', 'say whether a gradient is positive, negative, zero or undefined'],
  notes: {
    terms: [['gradient (m)', 'the steepness: rise ÷ run'], ['rise', 'change in y: up +, down −'], ['run', 'change in x, left to right'],
      ['positive', 'goes up to the right'], ['negative', 'goes down to the right'], ['zero', 'horizontal'], ['undefined', 'vertical (run = 0)']],
    formulas: ['m = rise ÷ run', 'm = (y₂ − y₁) ÷ (x₂ − x₁)', 'Simplify the fraction'],
    steps: ['write the two points', 'rise: y₂ − y₁', 'run: x₂ − x₁', 'm = rise ÷ run, simplified'],
    fig: notesFig(),
  },
  easy: {
    ex: { stem: 'Find the gradient of each interval AB.', parts: [
      { t: 'Gradient', fig: interval([1, 1], [3, 5], { size: 'mid' }) }, { t: 'Gradient', fig: interval([-2, 3], [2, 1], { size: 'mid' }) },
      { t: 'Gradient', fig: interval([-3, -4], [1, 4], { size: 'mid' }) }, { t: 'Gradient', fig: interval([-4, 2], [4, 2], { size: 'mid' }) }] },
    exAns: [gradWork([1, 1], [3, 5]), gradWork([-2, 3], [2, 1]), gradWork([-3, -4], [1, 4]), 'm = 0 ÷ 8 = 0 (horizontal)'],
    hint: 'm = rise ÷ run · subtract the y-values, then the x-values, in the same order · simplify',
    work: true,
    rounds: [{ text: 'find the gradient of AB: m = rise ÷ run, using the coordinates of A and B.', cols: 2, ...formFig([q([1, 2], [3, 6]), q([-3, 4], [1, -4])], MF, L1) }],
  },
  drill: {
    hint: 'Up to the right: positive · down to the right: negative · a negative ÷ a positive is negative.',
    rounds: [
      { text: 'find the gradient of AB: m = rise ÷ run, using the coordinates of A and B.', cols: 2, ...formFig([q([-2, -1], [2, 3]), q([-4, 5], [2, -1])], true, L1) },
      { text: 'find the gradient of AB, then simplify the fraction.', cols: 2, ...formFig([q([-4, -3], [2, 0]), q([-3, 2], [3, -1])], true, L1) },
      { text: 'find the gradient of AB: m = rise ÷ run, using the coordinates of A and B.', cols: 2, ...formFig([q([-2, -5], [1, 4]), q([-5, 3], [3, -3])], true, L1) },
    ],
  },
  drill2: {
    hint: 'Read A and B off the grid first · horizontal: m = 0 · vertical: m is undefined.',
    rounds: [
      { text: 'write down A and B from the grid, then find the gradient of AB.', cols: 2, ...formFig([q([-1, -3], [2, 3], { coords: false }), q([-4, 1], [4, -3], { coords: false })], true, L3) },
      { text: 'write down A and B from the grid, then find the gradient of AB.', cols: 2, ...formFig([q([-5, -4], [3, 2], { coords: false }), q([-3, 5], [1, -3], { coords: false })], true, L3) },
      { text: 'write down A and B. Is the gradient zero (flat) or undefined (vertical)?', cols: 2, ...formFig([q([-4, -2], [4, -2], { coords: false }), q([2, -4], [2, 5], { coords: false })], true, L3) },
    ],
  },
  medium: {
    ex: { stem: 'Read the points, then find each gradient.', parts: [
      { t: 'Gradient', fig: interval([-4, -3], [4, 3], { size: 'mid', coords: false }) }, { t: 'Gradient', fig: interval([-2, 4], [2, -4], { size: 'mid', coords: false }) },
      { t: 'Gradient', fig: interval([-5, -1], [5, 3], { size: 'mid', coords: false }) }, { t: 'Gradient', fig: interval([2, -4], [2, 3], { size: 'mid', coords: false }) }] },
    exAns: [gradWork([-4, -3], [4, 3]), gradWork([-2, 4], [2, -4]), gradWork([-5, -1], [5, 3]), 'run = 2 − 2 = 0: the gradient is undefined (vertical)'],
    work: true, set: true,
    rounds: [set([
      mq('Find the gradient of AB.', m([-4, -4], [2, 2]), { fig: interval([-4, -4], [2, 2], { size: 'small', coords: false }), lines: L3 }),
      mq('Find the midpoint M.', P(mid([-3, -2], [3, 4])), { fig: interval([-3, -2], [3, 4], { size: 'small', coords: false, ask: 'M = ?' }), from: '11.2', lines: L3 }),
      mq('Find the gradient of AB.', m([-3, 4], [3, -2]), { fig: interval([-3, 4], [3, -2], { size: 'small', coords: false }), lines: L3 }),
      mq('Find the gradient of AB.', m([-4, -1], [4, 3]), { fig: interval([-4, -1], [4, 3], { size: 'small', coords: false }), lines: L3 }),
      mq('How long is AB?', lenAns(25), { fig: interval([-3, -2], [1, 1], { size: 'small', coords: false, ask: 'AB = ?' }), from: '11.1', lines: L3 }),
      mq('Find the gradient of AB.', m([-1, -4], [2, 4]), { fig: interval([-1, -4], [2, 4], { size: 'small', coords: false }), lines: L3 }),
    ])],
  },
  worded: [
    { q: 'A road climbs 45 m over a horizontal distance of 600 m. Find its gradient as a decimal and as a percentage.', a: 'm = 45 ÷ 600 = 0.075, which is 7.5%' },
    { q: 'A roof rises 2.4 m over a horizontal distance of 4 m. A builder says the roof is steeper than a ramp with gradient ½. Is the builder right? Explain.', a: 'Roof: m = 2.4 ÷ 4 = 0.6. Ramp: 0.5. 0.6 > 0.5, so yes, the roof is steeper' },
    { q: 'Show that the points A(0, 1), B(2, 5) and C(5, 11) lie on one straight line.', a: `m(AB) = 4 ÷ 2 = 2 and m(BC) = 6 ÷ 3 = 2: the same gradient through the shared point B, so A, B and C are on one line` },
  ],
};
