// Lesson 11.2 The midpoint of an interval (four pages; see ../chapter.js). Every question is an interval AB on a number
// plane. Textbook 11.02.
const { P, mid, lenAns, distWork, midWork, formFig, mq, set } = require('../helpers');
const { std, interval, plane } = require('../shapes');

const MF = 'M = ((x₁+x₂)÷2, (y₁+y₂)÷2)';
const q = (a, b, o = {}) => [interval(a, b, { ask: 'M = ?', ...o }), P(mid(a, b))];
const L3 = ['A and B', 'Substitute', 'Answer'];
const notesFig = () => plane({ x: [0, 7], y: [0, 6], k: 4.2, grid: true, nums: true, segs: [[[1, 1], [5, 5]]],
  pts: [[1, 1, 'A(1, 1)', 'e'], [5, 5, 'B(5, 5)', 'w'], [3, 3]], notes: [[3.3, 2.6, 'M(3, 3)', { anchor: 'start', blue: true }]] });

module.exports = {
  code: '11.2', title: 'The midpoint of an interval',
  li: 'find the midpoint of an interval on the number plane.',
  sc: ['read the coordinates of the endpoints of an interval', 'find the midpoint by averaging the x-values and the y-values', 'find midpoints with negative and decimal coordinates'],
  notes: {
    terms: [['midpoint (M)', 'the point halfway along an interval'], ['average', 'add, then divide by how many'], ['endpoints', 'A(x₁, y₁) and B(x₂, y₂)']],
    formulas: ['M = ((x₁ + x₂) ÷ 2, (y₁ + y₂) ÷ 2)', 'x of M = average of the x-values', 'y of M = average of the y-values', 'Endpoint: B = 2 × M − A (for x and y)'],
    steps: ['write the two points', 'add the x-values, ÷ 2', 'add the y-values, ÷ 2', 'write M as a point (x, y)'],
    fig: notesFig(),
  },
  easy: {
    ex: { stem: 'Find the midpoint M of each interval AB.', parts: [
      { t: 'Midpoint', fig: interval([1, 1], [5, 3], { size: 'mid' }) }, { t: 'Midpoint', fig: interval([-4, 3], [2, -1], { size: 'mid' }) },
      { t: 'Midpoint', fig: interval([-3, -4], [3, 2], { size: 'mid' }) }, { t: 'Midpoint', fig: interval([-1, 4], [4, -3], { size: 'mid' }) }] },
    exAns: [midWork([1, 1], [5, 3]), midWork([-4, 3], [2, -1]), midWork([-3, -4], [3, 2]), midWork([-1, 4], [4, -3])],
    hint: 'Add the two x-values and halve · add the two y-values and halve · write the answer as a point',
    work: true,
    rounds: [{ text: 'find the midpoint M of AB.', cols: 2, ...formFig([q([2, 1], [4, 5]), q([-4, -2], [2, 4])], MF) }],
  },
  drill: {
    hint: 'Watch the signs: (−5 + 1) ÷ 2 = −2 · a midpoint can be a decimal, like 0.5.',
    rounds: [
      { text: 'find the midpoint M of AB.', cols: 2, ...formFig([q([-3, 1], [1, 5]), q([-5, -3], [1, -1])], true) },
      { text: 'find the midpoint M of AB. The answers have halves.', cols: 2, ...formFig([q([-2, -3], [3, 2]), q([-4, 4], [1, -1])], true) },
      { text: 'find the midpoint M of AB.', cols: 2, ...formFig([q([-5, 2], [4, -4]), q([-3, -5], [4, 3])], true) },
    ],
  },
  drill2: {
    hint: 'Read A and B off the grid first: across (x), then up or down (y).',
    rounds: [
      { text: 'read A and B, then find the midpoint M.', cols: 2, ...formFig([q([-4, -4], [2, 2], { coords: false }), q([-3, 5], [5, -1], { coords: false })], true, L3) },
      { text: 'read A and B, then find the midpoint M.', cols: 2, ...formFig([q([-5, -1], [2, 4], { coords: false }), q([1, -5], [4, 4], { coords: false })], true, L3) },
      { text: 'read A and B, then find the midpoint M.', cols: 2, ...formFig([q([-4, 1], [4, 1], { coords: false }), q([2, -5], [2, 3], { coords: false })], true, L3) },
    ],
  },
  medium: {
    ex: { stem: 'Read the points, then find each midpoint (or the endpoint B).', parts: [
      { t: 'Midpoint', fig: interval([-4, -1], [4, 5], { size: 'mid', coords: false }) }, { t: 'Midpoint', fig: interval([-3, 3], [4, -4], { size: 'mid', coords: false }) },
      { t: 'Midpoint', fig: interval([-5, -2], [1, 4], { size: 'mid', coords: false }) }, 'A is (−3, 2) and M is (1, −1). Find B.'] },
    exAns: [midWork([-4, -1], [4, 5]), midWork([-3, 3], [4, -4]), midWork([-5, -2], [1, 4]), 'x: 2 × 1 − (−3) = 5, y: 2 × (−1) − 2 = −4, so B = (5, −4)'],
    work: true, set: true,
    rounds: [set([
      mq('Midpoint', P(mid([-4, -3], [2, 3])), { fig: interval([-4, -3], [2, 3], { size: 'small', coords: false }), lines: L3 }),
      mq('', lenAns(25), { fig: interval([-2, -3], [1, 1], { size: 'small', coords: false, ask: 'AB = ?' }), from: '11.1', lines: L3 }),
      mq('Midpoint', P(mid([-4, 4], [3, -2])), { fig: interval([-4, 4], [3, -2], { size: 'small', coords: false }), lines: L3 }),
      mq('Midpoint', P(mid([-3, -4], [4, 2])), { fig: interval([-3, -4], [4, 2], { size: 'small', coords: false }), lines: L3 }),
      mq('', '2 × (6 + 5) = 22 units', { fig: std('small', { poly: [[-4, -2], [2, -2], [2, 3], [-4, 3]] }), from: '10.4', lines: ['Length', 'Width', 'Perimeter'] }),
      mq('Midpoint', P(mid([1, -4], [-4, 3])), { fig: interval([1, -4], [-4, 3], { size: 'small', coords: false }), lines: L3 }),
    ])],
  },
  worded: [
    { q: 'Two friends live at (−4, 3) and (8, −1) on a town map (units in km). They meet halfway between their homes. Where do they meet?', a: midWork([-4, 3], [8, -1]) },
    { q: 'A circle has a diameter with endpoints (−1, 2) and (7, 8). Find the centre and the radius of the circle.', a: `Centre: ${midWork([-1, 2], [7, 8])}; diameter ${distWork([-1, 2], [7, 8])}, so the radius is 5` },
    { q: 'A straight path runs from a gate G(2, 1) to a shed S(10, 7) (units in metres). A tap is halfway along the path. Find the tap’s position and how far it is from the gate.',
      a: `Tap: ${midWork([2, 1], [10, 7])}; ${distWork([2, 1], [6, 4])} m` },
  ],
};
