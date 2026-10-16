// Lesson 11.9 Graphing parabolas (three pages; see ../chapter.js and lib/lesson-two.js). Textbook 11.10 (lesson codes
// run one behind the textbook from here, because textbook 11.09 is PATH and is left out).
const { n, formFig, mq, set } = require('../helpers');
const { graph, table } = require('../shapes');

const X5 = [-2, -1, 0, 1, 2];
// y = ax² + c as text: para(1, 1) → 'y = x² + 1', para(-2, 0) → 'y = −2x²'
const para = (a, c) => { const t = a === 1 ? 'x²' : a === -1 ? '−x²' : `${n(a)}x²`; return `y = ${t}${c === 0 ? '' : c < 0 ? ` − ${n(-c)}` : ` + ${n(c)}`}`; };
const vals = (a, c) => X5.map((x) => n(a * x * x + c)).join(', ');
// A table for x = −2 to 2 with the y row blank (title: the equation above it)
const tab = (a, c, title = '') => [table([['x', ...X5.map(n)], ['y', ...X5.map(() => '')]], { w: 4.6, head: 5, title }), `y: ${vals(a, c)}`];
// The parabola y = ax² + c on a numbered grid
const pg = (a, c, { x = [-3, 3], y = [-5, 5], k = 2.1, label = false } = {}) => graph({ x, y, k, curves: [[(t) => a * t * t + c, label ? para(a, c) : '', 1.6, 'e']] });
const vertex = (a, c) => `vertex (0, ${n(c)}), concave ${a > 0 ? 'up' : 'down'}`;
const notesFig = () => graph({ x: [-3, 3], y: [-3, 5], k: 3.6, every: 1, curves: [[(t) => t * t, 'y = x²', 1.9, 'e'], [(t) => -t * t + 3, 'y = −x² + 3', -1.9, 'w']], pts: [[0, 0], [0, 3]] });

module.exports = {
  code: '11.9', title: 'Graphing parabolas',
  li: 'graph parabolas of the form y = ax² + c and describe their features.',
  sc: ['complete a table of values and graph a parabola', 'find the vertex and say whether a parabola is concave up or concave down', 'describe how a and c change the shape and position of a parabola'],
  notes: {
    terms: [['parabola', 'the U-shaped graph of y = ax² + c'], ['vertex', 'the turning point: (0, c) here'], ['concave up', 'opens upward (∪): a > 0'], ['concave down', 'opens downward (∩): a < 0'],
      ['axis of symmetry', 'the line x = 0: each side is a mirror image'], ['wider / narrower', 'a closer to 0 is wider']],
    formulas: ['y = ax² + c', 'vertex (0, c)', 'a > 0: concave up; a < 0: concave down', 'bigger a (ignoring the sign): narrower'],
    steps: ['make a table for x = −2 to 2', 'square x first, then × a, then + c', 'plot the points', 'join them with a smooth curve'],
    fig: notesFig(),
  },
  easy: {
    ex: { stem: 'Complete, describe or match each parabola.', parts: [
      { t: 'Table', fig: tab(1, 1, 'y = x² + 1')[0] }, 'Find the vertex of y = −2x². Is it concave up or down?',
      'Which is wider: y = x² or y = 3x²?', { t: 'Equation', fig: pg(1, -3, { y: [-4, 3], k: 2.3 }) }] },
    exAns: [`y: ${vals(1, 1)}`, vertex(-2, 0), 'y = x² (a = 1 is closer to 0 than a = 3)', 'Vertex (0, −3), concave up, same shape as y = x²: y = x² − 3'],
    hint: 'Square x first: (−2)² = 4 · then multiply by a · then add c',
    work: true,
    rounds: [
      { text: 'complete each table of values.', cols: 4, ...formFig([[1, 0], [1, 2], [2, 0], [-1, 0]].map(([a, c]) => [...tab(a, c), '', para(a, c)]), true, ['Rule', 'Working', 'y-values']) },
      { text: 'complete each table of values.', cols: 4, ...formFig([[1, -3], [-1, 4], [3, 0], [-2, 1]].map(([a, c]) => tab(a, c, para(a, c))), true, ['Square x', 'Working', 'y-values']) },
    ],
  },
  drill: {
    hint: 'Vertex (0, c) · a > 0: ∪ · a < 0: ∩ · the a closer to 0 gives the wider parabola',
    rounds: [
      { text: 'state the vertex, and whether the parabola is concave up or down.', ...formFig([[1, -2], [-1, 3], [2, 1]].map(([a, c]) => [pg(a, c), vertex(a, c)]), true, ['Vertex', 'Concave', 'Answer']) },
      { text: 'state the vertex and the concavity from the equation.', ...formFig([[-4, 0, 'y = −4x²'], [0.5, -6, 'y = 0.5x² − 6'], [-1, 7, 'y = 7 − x²']].map(([a, c, t]) => ['', vertex(a, c), t]), true, ['Vertex', 'Concave', 'Answer']) },
      { text: 'which parabola is wider? Give a reason.', ...formFig([['', 'y = 2x² (2 is closer to 0)', 'y = 2x² or y = 5x²'], ['', 'y = −⅓x² (⅓ is closer to 0)', 'y = −x² or y = −⅓x²'], ['', 'y = x² + 4 (a = 1 is closer to 0)', 'y = 4x² + 1 or y = x² + 4']], true, ['Compare a', 'Reason', 'Answer']) },
      { text: 'write the equation of each parabola.', ...formFig([[1, 1], [-1, 2], [1, -4]].map(([a, c]) => [pg(a, c), para(a, c)]), true, ['Vertex', 'Concave', 'Equation']) },
    ],
  },
  medium: {
    ex: { stem: 'Graph, choose or find as shown.', parts: [{ t: 'Graph y = −x² + 4', fig: graph({ x: [-3, 3], y: [-5, 5], k: 1.5 }) },
      'Which is concave up with vertex (0, 0)? y = x² − 1, y = 2x², y = −x², y = 3x² + 2', 'Does (3, 10) lie on y = x² + 1?', 'Find the x-intercepts of y = x² − 9.'] },
    exAns: [`Table y: ${vals(-1, 4)}; vertex (0, 4), concave down`, 'y = 2x² (a > 0 and c = 0)', '3² + 1 = 10 ✓ Yes', 'x² − 9 = 0, x² = 9, so x = 3 or x = −3'],
    work: true, set: true,
    rounds: [set([
      mq('Find the vertex of y = −3x² + 5 and say whether it is concave up or down.', vertex(-3, 5), { form: false }),
      mq('State m and c for y = 4 − 2x.', 'm = −2, c = 4', { from: '11.5' }),
      mq('Does (−2, 7) lie on y = 2x² − 1? Show your working.', 'Yes: 2 × (−2)² − 1 = 8 − 1 = 7', { form: false }),
      mq('Equation', para(1, -1), { fig: pg(1, -1, { x: [-2, 2], y: [-2, 3], k: 2.2 }), form: false }),
      mq('Solve 2x + 1 = 7.', 'x = 3', { from: '11.7', form: false }),
      mq('Find the x-intercepts of y = x² − 16.', 'x² = 16, so x = 4 or x = −4'),
      mq('Which is narrower: y = 0.5x² or y = 2x²? Why?', 'y = 2x²: a = 2 is further from 0', { form: false }),
      mq('Find the y-intercept of y = 3x − 8.', '−8', { from: '11.4' }),
      mq('The point (2, 1) lies on y = x² + c. Find c and the vertex.', '4 + c = 1, so c = −3; vertex (0, −3)'),
    ])],
  },
  worded: [
    { q: 'The arch of a bridge is modelled by y = −0.5x² + 8 (in metres). How high is the top of the arch, and how wide is the arch at ground level?', a: 'Top: vertex (0, 8), so 8 m. Ground: −0.5x² + 8 = 0, x² = 16, x = ±4, so 8 m wide' },
    { q: 'A satellite dish has the shape of y = 0.25x² (in cm). How deep is the dish 6 cm out from its centre?', a: `y = 0.25 × 6² = ${n(0.25 * 36)} cm` },
    { q: 'Sketch y = x² and y = x² + 3 on the same axes, using x = −2 to 2. Describe how the second graph is related to the first.', a: `y = x²: ${vals(1, 0)}; y = x² + 3: ${vals(1, 3)}. The same shape, moved up 3: vertex (0, 3)` },
  ],
};
