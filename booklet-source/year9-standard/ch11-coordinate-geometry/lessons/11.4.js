// Lesson 11.4 Graphing linear equations (three pages; see ../chapter.js and lib/lesson-two.js). Textbook 11.04.
const { n, P, mid, eq, frac, lenAns, formFig, mq, set } = require('../helpers');
const { plane, graph, table, askNote, cornerNote } = require('../shapes');

const ys = (m, c, xs) => xs.map((x) => n(m * x + c)).join(', ');
// A table of values for y = mx + c with the y row blank; title: print the equation above it
const tab = (m, c, xs, title = '') => [table([['x', ...xs.map(n)], ['y', ...xs.map(() => '')]], { w: 5, head: 6, title }), `y: ${ys(m, c, xs)}`];
// The line y = mx + c crossing both axes (no grid), its equation on it and a ? at each intercept
const icept = (m, c, label = eq(m, c), { size = 24, maxH = 13 } = {}) => {
  const xi = -c / m, x = [Math.min(0, xi) - 1, Math.max(0, xi) + 1], y = [Math.min(0, c) - 1, Math.max(0, c) + 1];
  const k = Math.min(size / (x[1] - x[0]), maxH / (y[1] - y[0])), A = [xi, 0], B = [0, c];
  const away = (xi * c > 0) ? -1 : 1;
  return [plane({ x, y, k, lines: [[{ m, c }]], pts: [[xi, 0, '?', c > 0 ? 's' : 'n'], [0, c, '?', xi > 0 ? 'w' : 'e']], notes: [askNote(A, B, k, label, away, 2)] }), `(${n(xi)}, 0) and (0, ${n(c)})`];
};
// A vertical or horizontal line on a numbered grid, its equation asked
const hv = (L) => { const x = [-4, 4], y = [-4, 4]; return [graph({ x, y, k: 2.4, lines: [[L]] }), L.x !== undefined ? `x = ${n(L.x)}` : `y = ${n(L.y)}`]; };
const notesFig = () => graph({ x: [-2, 4], y: [-3, 4], k: 4, every: 1, lines: [[{ m: 2, c: -2 }, 'y = 2x − 2', 2.8, 'w']], pts: [[1, 0, '(1, 0)', 'se'], [0, -2, '(0, −2)', 'w']] });

module.exports = {
  code: '11.4', title: 'Graphing linear equations',
  li: 'graph straight lines and find where they cross the axes.',
  sc: ['complete a table of values and graph a straight line', 'find the x- and y-intercepts of a line', 'test whether a point lies on a line, and graph lines like x = 3 and y = −2'],
  notes: {
    terms: [['linear equation', 'its graph is a straight line'], ['table of values', 'x-values and the y-values they give'], ['x-intercept', 'where a line crosses the x-axis (y = 0)'],
      ['y-intercept', 'where a line crosses the y-axis (x = 0)'], ['x = a', 'a vertical line'], ['y = b', 'a horizontal line']],
    formulas: ['x-intercept: put y = 0 and solve', 'y-intercept: put x = 0', 'On the line? Substitute x and y: both sides equal'],
    steps: ['make a table of values', 'substitute each x to find y', 'plot the points', 'rule a line through them'],
    fig: notesFig(),
  },
  easy: {
    ex: { stem: 'Complete, find or graph as shown.', parts: [
      { t: 'Table', fig: tab(2, 1, [-1, 0, 1, 2], 'y = 2x + 1')[0] }, { t: 'Intercepts', fig: icept(-3, 6, 'y = −3x + 6', { size: 26, maxH: 14 })[0] },
      'Does (4, −2) lie on the line y = x − 6?', { t: 'x = 3 and y = −2', fig: graph({ x: [-4, 4], y: [-4, 4], k: 1.9 }) }] },
    exAns: [`y: ${ys(2, 1, [-1, 0, 1, 2])}`, 'y = 0: 0 = −3x + 6, so x = 2 → (2, 0); x = 0: y = 6 → (0, 6)', 'y = 4 − 6 = −2 ✓ Yes, (4, −2) is on the line', 'x = 3: a vertical line through 3 on the x-axis; y = −2: a horizontal line through −2 on the y-axis'],
    hint: 'Substitute each x into the rule · y-intercept: x = 0 · x-intercept: y = 0',
    work: true,
    rounds: [
      { text: 'complete each table of values.', cols: 4, ...formFig([[2, 3], [1, -2], [3, 0], [-1, 4]].map(([m, c]) => [...tab(m, c, [0, 1, 2, 3]), '', eq(m, c)]), true, ['Rule', 'Working', 'y-values']) },
      { text: 'find the x- and y-intercepts of each line.', cols: 4, ...formFig([icept(2, -4), icept(-1, 3), icept(3, 6), icept(-2, 8)], true, ['y-intercept', 'x-intercept', 'Answer']) },
    ],
  },
  drill: {
    hint: 'A negative x: use brackets, 2 × (−1) − 1 = −3 · an x-intercept can be a fraction.',
    rounds: [
      { text: 'complete each table of values.', ...formFig([tab(2, -1, [-1, 0, 1, 2], 'y = 2x − 1'), tab(-2, 3, [-1, 0, 1, 2], 'y = −2x + 3'), tab(0.5, 2, [-2, 0, 2, 4], 'y = ½x + 2')], true, ['Substitute', 'Working', 'y-values']) },
      { text: 'test whether the point lies on the line.', ...formFig([
        [{ t: 'Is (3, 5) on y = 2x − 1?' }, 'Yes: 2 × 3 − 1 = 5'], [{ t: 'Is (−2, 4) on y = −3x − 1?' }, 'No: −3 × (−2) − 1 = 5, not 4'], [{ t: 'Is (1, −3) on y = 4x − 7?' }, 'Yes: 4 − 7 = −3']]
        .map(([q, a]) => ['', a, q.t]), true, ['Substitute', 'Working', 'Yes or no']) },
      { text: 'find both intercepts of each line.', ...formFig([icept(4, -8, '4x − y = 8', { size: 30, maxH: 16 }), icept(-2, 6, '2x + y = 6', { size: 30, maxH: 16 }), icept(0.5, -2, 'x − 2y = 4', { size: 30, maxH: 16 })], true, ['y-intercept', 'x-intercept', 'Answer']) },
      { text: 'write the equation of each line.', ...formFig([hv({ x: -2 }), hv({ y: 3 }), hv({ y: -1 })], true, ['Type', 'A point', 'Equation']) },
    ],
  },
  medium: {
    ex: { stem: 'Graph, test or find as shown.', parts: [
      { t: 'Graph y = −2x + 4', fig: graph({ x: [-3, 4], y: [-3, 5], k: 1.9 }) }, 'Does (4, −2) lie on the line x − 3y = 10?',
      { t: 'Intercepts', fig: icept(-0.75, 3, '3x + 4y = 12', { size: 26, maxH: 14 })[0] },
      { t: 'Area', fig: graph({ x: [-3, 4], y: [-2, 4], k: 2.3, lines: [[{ x: -2 }], [{ x: 3 }], [{ y: -1 }], [{ y: 3 }]] }) }] },
    exAns: ['Intercepts (2, 0) and (0, 4); rule a line through them', '4 − 3 × (−2) = 4 + 6 = 10 ✓ Yes', 'y = 0: 3x = 12, x = 4 → (4, 0); x = 0: 4y = 12, y = 3 → (0, 3)', 'x = −2, x = 3, y = −1, y = 3: a 5 by 4 rectangle, A = 20 square units'],
    work: true, set: true,
    rounds: [set([
      mq('Find the x- and y-intercepts of y = 2x + 10.', '(−5, 0) and (0, 10)'),
      mq('Find the gradient of the line through (−1, 4) and (3, −4).', frac(-8, 4), { from: '11.3' }),
      mq('Does the point (−3, 7) lie on y = −2x + 1? Show your working.', 'Yes: −2 × (−3) + 1 = 7', { form: false }),
      mq('Intercepts', '(−2, 0) and (0, 4)', { fig: icept(2, 4, 'y = 2x + 4', { size: 20, maxH: 7 })[0], form: false }),
      mq('Find the length of the interval joining (−2, −1) and (4, 7).', lenAns(100), { from: '11.1' }),
      mq('Write the equation of the horizontal line through (5, −3).', 'y = −3', { form: false }),
      mq('Find the x- and y-intercepts of 5x − 2y = 20.', '(4, 0) and (0, −10)'),
      mq('Find the midpoint of (−7, 2) and (3, −6).', P(mid([-7, 2], [3, -6])), { from: '11.2' }),
      mq('Find the area of the triangle between the axes and the line y = −2x + 6.', 'Intercepts (3, 0) and (0, 6): A = ½ × 3 × 6 = 9 square units', { form: false }),
    ])],
  },
  worded: [
    { q: 'A plumber charges C = 40 + 60h dollars for h hours of work. Make a table for h = 0, 1, 2 and 3. What is the C-intercept, and what does it mean?', a: 'C: 40, 100, 160, 220. C-intercept 40: the $40 call-out fee (charged for 0 hours)' },
    { q: 'The line 3x + 2y = 18 crosses both axes. Find where, then find the length of the interval between these two points, correct to one decimal place.', a: `(6, 0) and (0, 9); d = √(6² + 9²) = ${lenAns(117)}` },
    { q: 'The lines x = −1, x = 5, y = 2 and y = −3 enclose a rectangle. Find its perimeter and its area.', a: 'Width 5 − (−1) = 6, height 2 − (−3) = 5: P = 22 units, A = 30 square units' },
  ],
};
