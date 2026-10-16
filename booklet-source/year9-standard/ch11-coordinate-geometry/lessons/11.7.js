// Lesson 11.7 Solving linear equations graphically (three pages; see ../chapter.js and lib/lesson-two.js).
// Textbook 11.07.
const { n, eq, formFig, mq, set } = require('../helpers');
const { graph, plane } = require('../shapes');

const sol = (m, c, k) => (k - c) / m;
const lhs = (m, c) => eq(m, c).replace('y = ', '');
// The graph of y = mx + c (labelled) on a small numbered grid; withK: also draw the line y = k (dashed? no: blue, labelled)
const solveFig = (m, c, k, { x = [-1, 4], y = [-1, 6], kmm = 2, withK = true, every = 2 } = {}) => graph({ x, y, k: kmm, every,
  lines: [[{ m, c }], ...(withK ? [[{ y: k }, `y = ${n(k)}`, x[1] - 0.2, k > y[1] - 1.5 ? 's' : 'n']] : [])] });
// [picture, answer, words, own formula]: solve mx + c = k from the graph
const sq = (m, c, k, o = {}) => [solveFig(m, c, k, o), `x = ${n(sol(m, c, k))}`, o.words ? `${lhs(m, c)} = ${n(k)}` : '', o.print ? `${lhs(m, c)} = ${n(k)}` : undefined];
// Two lines on a grid: their point of intersection asked
const cross = (l1, l2, { x = [-2, 4], y = [-3, 5], k = 2.15 } = {}) => {
  const X = (l2[1] - l1[1]) / (l1[0] - l2[0]), Y = l1[0] * X + l1[1];
  return [graph({ x, y, k, lines: [[{ m: l1[0], c: l1[1] }], [{ m: l2[0], c: l2[1] }]] }), `(${n(X)}, ${n(Y)})`];
};
const notesFig = () => graph({ x: [-1, 4], y: [-4, 6], k: 3, every: 1, lines: [[{ m: 3, c: -4 }, 'y = 3x − 4', 1.2, 'w'], [{ y: 5 }, 'y = 5', 0.2, 'n']], pts: [[3, 5, '(3, 5)', 'e']] });

module.exports = {
  code: '11.7', title: 'Solving linear equations graphically',
  li: 'solve linear equations by reading a straight-line graph.',
  sc: ['use the graph of y = mx + c to solve mx + c = k', 'find the point where two lines cross', 'check a graphical solution by substituting'],
  notes: {
    terms: [['solution', 'the value of x that makes the equation true'], ['point of intersection', 'where two lines cross'], ['y = k', 'a horizontal line at height k']],
    formulas: ['Solve 3x − 4 = 5: graph y = 3x − 4 and y = 5; read x where they meet', 'Two lines: the solution is the crossing point (x, y)', 'Check: substitute x into the equation'],
    steps: ['graph y = mx + c', 'draw the line y = k', 'read x at the crossing', 'check by substituting'],
    fig: notesFig(),
  },
  easy: {
    ex: { stem: 'Use the graphs to solve.', parts: [
      { t: '2x + 1 = 5', fig: solveFig(2, 1, 5, { kmm: 2.3 }) }, { t: '2x + 1 = −3', fig: solveFig(2, 1, -3, { x: [-3, 2], y: [-4, 3], kmm: 2.3 }) },
      { t: 'Crossing point', fig: cross([1, 1], [-1, 5], { x: [-1, 5], y: [-1, 6], k: 2.3 })[0] }, 'Check part a by substituting.'] },
    exAns: ['The line y = 5 meets y = 2x + 1 at x = 2', 'y = −3 meets the line at x = −2', 'The lines cross at (2, 3)', '2 × 2 + 1 = 5 ✓'],
    hint: 'Find the height k on the y-axis · go across to the line · go down to read x',
    work: true,
    rounds: [
      { text: 'use each graph to solve the equation.', cols: 4, ...formFig([sq(2, 1, 5, { print: true }), sq(1, -1, 2, { print: true }), sq(-1, 5, 1, { print: true }), sq(3, -3, 3, { print: true })], true, ['Equation', 'Read x', 'Answer']) },
      { text: 'draw the line y = k on each graph, then solve.', cols: 4, ...formFig([sq(2, -1, 3, { withK: false, words: true, kmm: 1.8 }), sq(-1, 4, 1, { withK: false, words: true, kmm: 1.8 }), sq(1, 2, 5, { withK: false, words: true, kmm: 1.8 }), sq(3, -2, 4, { withK: false, words: true, kmm: 1.8 })], true, ['Draw y =', 'Read x', 'Answer']) },
    ],
  },
  drill: {
    hint: 'Read the x-value straight down (or up) from the crossing · two lines: read both x and y.',
    rounds: [
      { text: 'use the graph of y = 2x − 3 to solve each equation.', ...formFig([[1, 2], [-5, -1], [3, 3]].map(([k]) => sq(2, -3, k, { x: [-2, 4], y: [-5, 5], kmm: 1.95, withK: false, print: true })), true, ['Equation', 'Read x', 'Answer']) },
      { text: 'find the point where the two lines cross.', ...formFig([cross([1, 1], [-2, 7]), cross([2, -1], [-1, 2]), cross([1, -3], [-1, 1])], true, ['Read x', 'Read y', 'Point']) },
      { text: 'solve from the graph, then check by substituting.', ...formFig([sq(-2, 4, 8, { x: [-3, 3], y: [-2, 9], kmm: 1.75, withK: false, words: true }), sq(0.5, 1, 3, { x: [-1, 5], y: [-1, 4], kmm: 2.5, withK: false, words: true }),
        sq(3, -2, 4, { x: [-1, 3], y: [-3, 5], kmm: 2.6, withK: false, words: true })], true, ['Read x', 'Check', 'Answer']) },
      { text: 'the answers are halves. Solve from the graph.', ...formFig([sq(2, 1, 4, { x: [-1, 3], y: [-1, 6], kmm: 3, withK: false, words: true }), sq(-1, 2, 4.5, { x: [-4, 2], y: [-1, 6], kmm: 3, withK: false, words: true }),
        sq(2, -4, 3, { x: [-1, 5], y: [-4, 4], kmm: 2.6, withK: false, words: true })], true, ['Read x', 'Check', 'Answer']) },
    ],
  },
  medium: {
    ex: { stem: 'Solve using graphs, then check.', parts: [
      { t: 'Solve 3x − 4 = 5', fig: solveFig(3, -4, 5, { x: [-1, 4], y: [-4, 6], kmm: 1.5 }) }, { t: 'Crossing point', fig: cross([2, -1], [-1, 5], { x: [-1, 4], y: [-2, 6], k: 1.9 })[0] },
      'Use the graphs of y = x + 3 and y = −2x + 6 to solve x + 3 = −2x + 6.', 'Check your answer to part b in both equations.'] },
    exAns: ['y = 5 meets the line at x = 3', '(2, 3)', 'The lines cross at (1, 4), so x = 1', 'y = 2 × 2 − 1 = 3 ✓ and y = −2 + 5 = 3 ✓'],
    work: true, set: true,
    rounds: [set([
      mq('The graph of y = −2x + 1 passes through (−2, 5). Use this to solve −2x + 1 = 5.', 'x = −2', { form: false }),
      mq('Find the equation of the line through (0, 2) and (3, 8).', eq(2, 2), { from: '11.6' }),
      mq('Solve 4x − 3 = 9 by algebra.', 'x = 3', { form: false }),
      mq('Crossing point', '(1, 3)', { fig: plane({ x: [-1, 4], y: [-1, 5], k: 1.8, lines: [[{ m: 1, c: 2 }], [{ m: -1, c: 4 }]] }), form: false }),
      mq('Find the x- and y-intercepts of y = −x + 6.', '(6, 0) and (0, 6)', { from: '11.4' }),
      mq('The lines y = 2x + 1 and y = 7 cross. Find the point without drawing.', '2x + 1 = 7, x = 3: (3, 7)', { form: false }),
      mq('Where do y = 3x − 2 and y = x + 4 meet? Use a table of values for x = 0 to 4.', '(3, 7)', { form: false }),
      mq('Write the equation of the line parallel to y = −x + 2 with y-intercept 6.', eq(-1, 6), { from: '11.5' }),
      mq('Sketch y = 0.5x + 2, then use it to solve 0.5x + 2 = 4.5.', 'x = 5', { form: false }),
    ])],
  },
  worded: [
    { q: 'Plan A costs C = 20 + 5n dollars and plan B costs C = 10 + 7n dollars for n lessons. Graph both for n = 0 to 8. After how many lessons do they cost the same, and how much is it?', a: 'They cross at n = 5: 20 + 25 = 45 and 10 + 35 = 45, so 5 lessons, $45' },
    { q: 'A tank holds 40 L and drains at 5 L per minute, so V = 40 − 5t. Graph V for t = 0 to 8 and use it to find when the tank holds 15 L.', a: 'V = 15 when t = 5: 40 − 5 × 5 = 15 ✓, so after 5 minutes' },
    { q: 'Sam has $30 and saves $12 a week. Mia has $90 and spends $8 a week. Graph both amounts. After how many weeks do they have the same amount, and how much is it?', a: '30 + 12w = 90 − 8w at w = 3: both have $66' },
  ],
};
