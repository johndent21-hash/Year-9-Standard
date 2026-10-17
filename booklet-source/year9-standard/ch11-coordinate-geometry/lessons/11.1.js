// Lesson 11.1 The length of an interval (four pages: Notes, Example 1 and round 1; two drill pages; Example 2, the
// Medium set and three worded problems). Every question is an interval AB on a number plane. See ../chapter.js.
// Textbook 11.01.
const { num, dist, lenAns, distWork, formFig, mq, set } = require('../helpers');
const { std, interval, plane } = require('../shapes');

const D = 'd² = (x₂−x₁)² + (y₂−y₁)²';
const len = (a, b) => lenAns((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2);
// One question: AB on a plane, its length asked. coords: write the coordinates (pages 1 and 2) or letters only
const q = (a, b, o = {}) => [interval(a, b, { ask: 'AB = ?', ...o }), len(a, b)];
const L3 = ['A and B', 'Substitute', 'Answer']; // pages 3 and 4: read the points off the grid first
const notesFig = () => plane({ x: [0, 6], y: [0, 5], k: 4.6, grid: true, nums: true, segs: [[[1, 1], [5, 4]]], steps: [[[1, 1], [5, 4], 'run = 4', 'rise = 3']],
  pts: [[1, 1, 'A(1, 1)', 'nw'], [5, 4, 'B(5, 4)', 'ne']], notes: [[2.4, 3.3, 'AB = 5', { anchor: 'end', blue: true }]] });

module.exports = {
  code: '11.1', title: 'The length of an interval',
  li: 'find the length of an interval on the number plane.',
  sc: ['read the coordinates of the endpoints of an interval', 'use the distance formula to find its length', 'give a length as a whole number or correct to one decimal place'],
  notes: {
    terms: [['interval', 'part of a line between two endpoints'], ['run', 'the change in x: x₂ − x₁'], ['rise', 'the change in y: y₂ − y₁'],
      ['length (d)', 'the distance from one endpoint to the other'], ['(x₁, y₁), (x₂, y₂)', 'the two endpoints']],
    formulas: ['d² = run² + rise² (Pythagoras)', 'd² = (x₂ − x₁)² + (y₂ − y₁)²', 'then d = √(…)'],
    steps: ['write the two points', 'subtract the x-values and the y-values', 'square and add', 'square root, round to 1 d.p.'],
    fig: notesFig(),
  },
  easy: {
    ex: { stem: 'Find the length of each interval AB. Round to one decimal place where needed.', parts: [
      { t: 'Length', fig: interval([1, 1], [4, 5], { size: 'mid' }) }, { t: 'Length', fig: interval([-2, 2], [2, -1], { size: 'mid' }) },
      { t: 'Length', fig: interval([-1, 2], [3, -1], { size: 'mid' }) }, { t: 'Length', fig: interval([1, -2], [4, 4], { size: 'mid' }) }] },
    exAns: [distWork([1, 1], [4, 5]), distWork([-2, 2], [2, -1]), distWork([-1, 2], [3, -1]), distWork([1, -2], [4, 4])],
    hint: 'Subtract the x-values, subtract the y-values (same order) · square both and add · square root last',
    work: true,
    rounds: [{ text: 'find the length of AB.', cols: 2, ...formFig([q([1, 2], [4, 6]), q([-4, -3], [2, 5])], D) }],
  },
  drill: {
    hint: 'A negative squared is positive: (−3)² = 9 · round to one decimal place at the end.',
    rounds: [
      { text: 'find the length of AB.', cols: 2, ...formFig([q([-2, 1], [1, 5]), q([-3, -4], [3, 4])], true) },
      { text: 'find the length of AB, correct to one decimal place.', cols: 2, ...formFig([q([-4, -2], [1, 3]), q([-3, 4], [3, -1])], true) },
      { text: 'find the length of AB, correct to one decimal place.', cols: 2, ...formFig([q([-5, -3], [2, 1]), q([-4, 5], [4, 0])], true) },
    ],
  },
  drill2: {
    hint: 'Read A and B off the grid first: across (x), then up or down (y).',
    rounds: [
      { text: 'read A and B, then find the length of AB.', cols: 2, ...formFig([q([-1, -2], [2, 2], { coords: false }), q([-4, 3], [4, -3], { coords: false })], true, L3) },
      { text: 'read A and B, then find the length of AB, correct to one decimal place.', cols: 2, ...formFig([q([-5, -1], [1, 4], { coords: false }), q([-3, -5], [1, 2], { coords: false })], true, L3) },
      { text: 'read A and B, then find the length of AB.', cols: 2, ...formFig([q([-5, 2], [4, 2], { coords: false }), q([3, -5], [3, 3], { coords: false })], true, L3) },
    ],
  },
  medium: {
    ex: { stem: 'Read the points, then find each length. Round to one decimal place where needed.', parts: [
      { t: 'Length', fig: interval([-4, -1], [4, 5], { size: 'mid', coords: false }) }, { t: 'Length', fig: interval([-2, -3], [3, 2], { size: 'mid', coords: false }) },
      { t: 'Length', fig: interval([-5, 4], [1, -4], { size: 'mid', coords: false }) }, { t: 'Length', fig: interval([2, -4], [-3, 3], { size: 'mid', coords: false }) }] },
    exAns: [distWork([-4, -1], [4, 5]), distWork([-2, -3], [3, 2]), distWork([-5, 4], [1, -4]), distWork([2, -4], [-3, 3])],
    work: true, set: true,
    rounds: [set([
      mq('Length', len([-4, -3], [4, 3]), { fig: interval([-4, -3], [4, 3], { size: 'small', coords: false }), lines: L3 }),
      mq('', 'P(−3, 2), Q(4, −1)', { fig: std('small', { pts: [[-3, 2, 'P', 'nw'], [4, -1, 'Q', 'se']] }), from: 'Year 8', lines: ['P', 'Q', 'Check'] }),
      mq('Length', len([-5, 1], [2, -3]), { fig: interval([-5, 1], [2, -3], { size: 'small', coords: false }), lines: L3 }),
      mq('Length', len([-1, -4], [4, 4]), { fig: interval([-1, -4], [4, 4], { size: 'small', coords: false }), lines: L3 }),
      mq('', '6 × 4 = 24 square units', { fig: std('small', { poly: [[-3, -2], [3, -2], [3, 2], [-3, 2]] }), from: '10.4', lines: ['Length', 'Width', 'Area'] }),
      mq('Length', len([3, -2], [-3, 4]), { fig: interval([3, -2], [-3, 4], { size: 'small', coords: false }), lines: L3 }),
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
