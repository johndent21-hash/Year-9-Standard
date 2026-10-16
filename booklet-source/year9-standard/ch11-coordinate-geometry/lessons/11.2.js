// Lesson 11.2 The midpoint of an interval (three pages; see ../chapter.js and lib/lesson-two.js). Textbook 11.02.
const { num, P, mid, lenAns, distWork, midWork, formFig, mq, set } = require('../helpers');
const { plane, graph, pair, askNote, cornerNote } = require('../shapes');

const q = (a, b, o) => [pair(a, b, { ask: 'M = ?', mid: true, size: 18, maxH: 9, axes: false, ...o }), P(mid(a, b))];
const qd = (a, b, o) => q(a, b, { size: 30, maxH: 16, ...o });
// An interval on a numbered grid, its midpoint asked
const onGrid = (a, b, { x = [-5, 4], y = [-4, 4], k = 2.2 } = {}) => [graph({ x, y, k, segs: [[a, b]], pts: [a, b], notes: [cornerNote(a, b, x, y, 'M = ?')] }), P(mid(a, b))];
// One endpoint A and the midpoint M given, the other endpoint B asked (drawn to scale: B = 2M − A)
const endQ = (a, m, { size = 30, maxH = 16 } = {}) => {
  const b = [2 * m[0] - a[0], 2 * m[1] - a[1]], xs = [a[0], b[0]], ys = [a[1], b[1]];
  const x = [Math.min(...xs) - 0.4, Math.max(...xs) + 0.4], y = [Math.min(...ys) - 0.4, Math.max(...ys) + 0.4];
  const k = Math.min(size / (x[1] - x[0]), maxH / (y[1] - y[0]));
  return [plane({ x, y, k, axes: false, segs: [[a, b]], pts: [[...a, `A${P(a)}`, a[1] > b[1] ? 'n' : 's'], [...m], [...b, 'B = ?', b[1] >= a[1] ? 'n' : 's']],
    notes: [askNote(a, b, k, `M${P(m)}`, 1, 1.8)] }), P(b)];
};

const notesFig = () => plane({ x: [0, 7], y: [0, 6], k: 4.2, grid: true, nums: true, segs: [[[1, 1], [5, 5]]],
  pts: [[1, 1, 'A(1, 1)', 'e'], [5, 5, 'B(5, 5)', 'w'], [3, 3]], notes: [[3.3, 2.6, 'M(3, 3)', { anchor: 'start', blue: true }]] });

module.exports = {
  code: '11.2', title: 'The midpoint of an interval',
  li: 'find the midpoint of an interval on the number plane.',
  sc: ['find the midpoint by averaging the x-values and the y-values', 'find midpoints with negative and decimal coordinates', 'find an endpoint when the midpoint and the other endpoint are known'],
  notes: {
    terms: [['midpoint (M)', 'the point halfway along an interval'], ['average', 'add, then divide by how many'], ['endpoints', 'A(x₁, y₁) and B(x₂, y₂)']],
    formulas: ['M = ((x₁ + x₂) ÷ 2, (y₁ + y₂) ÷ 2)', 'x of M = average of the x-values', 'y of M = average of the y-values', 'Endpoint: B = 2 × M − A (for x and y)'],
    steps: ['add the x-values, ÷ 2', 'add the y-values, ÷ 2', 'write M as a point (x, y)'],
    fig: notesFig(),
  },
  easy: {
    ex: { stem: 'Find each midpoint, or the missing endpoint B.', parts: [
      { t: 'Midpoint', fig: pair([2, 4], [8, 10], { ask: 'M = ?', mid: true, size: 22, maxH: 12 }) }, { t: 'Midpoint', fig: pair([-3, 5], [5, 1], { ask: 'M = ?', mid: true, size: 22, maxH: 12 }) },
      { t: 'Midpoint', fig: onGrid([-4, -3], [2, 1], { x: [-5, 3], y: [-4, 3], k: 2.3 })[0] }, { t: 'Endpoint', fig: endQ([1, 3], [4, 5], { size: 24, maxH: 11 })[0] }] },
    exAns: [midWork([2, 4], [8, 10]), midWork([-3, 5], [5, 1]), midWork([-4, -3], [2, 1]), 'x: 2 × 4 − 1 = 7, y: 2 × 5 − 3 = 7, so B = (7, 7)'],
    hint: 'Add the two x-values and halve · add the two y-values and halve · write the answer as a point',
    work: true,
    rounds: [
      { text: 'find the midpoint of each interval.', cols: 4, ...formFig([q([2, 4], [6, 8]), q([1, 5], [7, 3]), q([3, 1], [9, 7]), q([2, 6], [8, 2])], '(x₁+x₂)÷2', ['x', 'y', 'M']) },
      { text: 'find each midpoint. The answers may be halves.', cols: 4, ...formFig([q([1, 2], [4, 8]), q([2, 7], [6, 2]), q([1, 1], [8, 4]), q([3, 6], [9, 9])], true) },
    ],
  },
  drill: {
    hint: 'Watch the signs: (−5 + 1) ÷ 2 = −2 · a midpoint can be a decimal.',
    rounds: [
      { text: 'use the midpoint formula.', ...formFig([qd([-2, 4], [6, -2]), qd([-5, -3], [1, 7]), qd([-6, 1], [-2, -5])], true) },
      { text: 'find the midpoint of each interval on the grid.', ...formFig([onGrid([-3, -2], [3, 4]), onGrid([-4, 3], [2, -1]), onGrid([-3, -3], [1, 3])], true) },
      { text: 'find each midpoint. Give decimals where needed.', ...formFig([qd([-3, 2], [4, -5]), qd([-1, -6], [6, 3]), qd([5, -4], [-2, -1])], true) },
      { text: 'M is the midpoint of AB. Find B.', ...formFig([endQ([1, 2], [4, 5]), endQ([-2, 3], [1, 1]), endQ([3, -4], [0, -1])], true) },
    ],
  },
  medium: {
    ex: { stem: 'Find each point.', parts: [
      { t: 'Midpoint', fig: pair([-4, 7], [6, -3], { ask: 'M = ?', mid: true, size: 22, maxH: 12 }) }, { t: 'Endpoint', fig: endQ([-3, 2], [1, -1], { size: 24, maxH: 11 })[0] },
      { t: 'Centre', fig: pair([-2, -1], [4, 5], { ask: 'centre = ?', mid: true, size: 22, maxH: 12 }) }, 'Find k if the midpoint of (k, 3) and (8, 9) is (5, 6).'] },
    exAns: [midWork([-4, 7], [6, -3]), 'x: 2 × 1 − (−3) = 5, y: 2 × (−1) − 2 = −4, so B = (5, −4)', `The centre is the midpoint of the diameter: ${midWork([-2, -1], [4, 5])}`,
      '(k + 8) ÷ 2 = 5, so k + 8 = 10 and k = 2'],
    work: true, set: true,
    rounds: [set([
      mq('Find the midpoint of the interval joining (−3, 8) and (7, −2).', P(mid([-3, 8], [7, -2]))),
      mq('Find the length of the interval joining (1, 1) and (7, 9).', lenAns(100), { from: '11.1' }),
      mq('M is the midpoint of AB. A is (2, −5) and M is (6, −1). Find B.', '(10, 3)'),
      mq('Midpoint', P(mid([-3, -1], [3, 2])), { fig: pair([-3, -1], [3, 2], { ask: 'M = ?', mid: true, size: 22, maxH: 7, axes: false }) }),
      mq('Solve (x + 4) ÷ 2 = 7.', 'x = 10', { from: 'Ch 7', form: false }),
      mq('The midpoint of (k, 3) and (8, 9) is (3, 6). Find k.', '(k + 8) ÷ 2 = 3, so k = −2', { form: false }),
      mq('Find the midpoint of PQ, where P is (−6, −1) and Q is (−1, −8).', P(mid([-6, -1], [-1, -8]))),
      mq('Find the area of a circle with diameter 10 cm, correct to one decimal place.', `A = π × 5² = ${num(Math.PI * 25, 1)} cm²`, { from: '10.7' }),
      mq('A is (1, 2), B is (7, 2) and C is (7, 8). Find the midpoint of AC, then its distance from B.', `M = (4, 5); ${distWork([7, 2], [4, 5])}`, { form: false }),
    ])],
  },
  worded: [
    { q: 'Two friends live at (−4, 3) and (8, −1) on a town map (units in km). They meet halfway between their homes. Where do they meet?', a: midWork([-4, 3], [8, -1]) },
    { q: 'A circle has a diameter with endpoints (−1, 2) and (7, 8). Find the centre and the radius of the circle.', a: `Centre: ${midWork([-1, 2], [7, 8])}; diameter ${distWork([-1, 2], [7, 8])}, so the radius is 5` },
    { q: 'A straight path runs from a gate G(2, 1) to a shed S(10, 7) (units in metres). A tap is halfway along the path. Find the tap’s position and how far it is from the gate.',
      a: `Tap: ${midWork([2, 1], [10, 7])}; ${distWork([2, 1], [6, 4])} m` },
  ],
};
