// Lesson 11.9 Graphing parabolas (four pages; see ../chapter.js). Every drill question is the same: a table of values
// for x = −2 to 2 beside a blank number plane: complete the table, graph the parabola, give its vertex and whether it is
// concave up or down. The Medium set: a parabola drawn on a plane, its equation asked. Textbook 11.10 (lesson codes run
// one behind the textbook from here, because textbook 11.09 is PATH and is left out).
const { n, eq, formFig, mq, set } = require('../helpers');
const { std, table, tableGraph, freeCorner, lineTagAt, graph } = require('../shapes');

const X = [-2, -1, 0, 1, 2];
// y = ax² + c as text: para(1, 1) → 'y = x² + 1', para(-2, 0) → 'y = −2x²'
const para = (a, c) => { const t = a === 1 ? 'x²' : a === -1 ? '−x²' : a === 0.5 ? '½x²' : a === -0.5 ? '−½x²' : `${n(a)}x²`; return `y = ${t}${c === 0 ? '' : c < 0 ? ` − ${n(-c)}` : ` + ${n(c)}`}`; };
const vals = (a, c) => X.map((x) => n(a * x * x + c)).join(', ');
const vertex = (a, c) => `vertex (0, ${n(c)}), concave ${a > 0 ? 'up' : 'down'}`;
// One drill question: the rule's table beside a blank plane
const tq = (a, c) => [tableGraph(para(a, c), X), `y: ${vals(a, c)}; ${vertex(a, c)}`];
// A Medium question: the parabola drawn, its equation asked
const pq = (a, c) => [std('small', { curves: [[(x) => a * x * x + c]], notes: [freeCorner('small', [], 'y = ?', [(x) => a * x * x + c])] }), para(a, c)];
const LINES = ['y-values', 'Vertex', 'Up or down'];
const notesFig = () => graph({ x: [-3, 3], y: [-3, 5], k: 3.6, curves: [[(t) => t * t, 'y = x²', 1.9, 'e'], [(t) => -t * t + 3, 'y = −x² + 3', -1.9, 'w']], pts: [[0, 0], [0, 3]] });

module.exports = {
  code: '11.9', title: 'Graphing parabolas',
  li: 'graph parabolas of the form y = ax² + c and describe their features.',
  sc: ['complete a table of values for y = ax² + c', 'plot the points and join them with a smooth curve', 'give the vertex and say whether the parabola is concave up or down'],
  notes: {
    terms: [['parabola', 'the U-shaped graph of y = ax² + c'], ['vertex', 'the turning point: (0, c) here'], ['concave up', 'opens upward (∪): a > 0'], ['concave down', 'opens downward (∩): a < 0'],
      ['axis of symmetry', 'the line x = 0: each side is a mirror image'], ['wider / narrower', 'a closer to 0 is wider']],
    formulas: ['y = ax² + c', 'vertex (0, c)', 'a > 0: concave up; a < 0: concave down', 'bigger a (ignoring the sign): narrower'],
    steps: ['square x first: (−2)² = 4', 'then × a, then + c', 'plot the points', 'join them with a smooth curve'],
    fig: notesFig(),
  },
  easy: {
    ex: { stem: 'For y = x² + 1:', parts: [{ t: 'Table', fig: table([['x', ...X.map(n)], ['y', ...X.map(() => '')]], { w: 4.6, head: 5, title: 'y = x² + 1' }) },
      { t: 'Graph', fig: std('mid') }, 'Give the vertex. Is it concave up or down?', 'Which is wider: y = x² + 1 or y = 3x² + 1?'] },
    exAns: [`y: ${vals(1, 1)}`, 'Plot (−2, 5), (−1, 2), (0, 1), (1, 2), (2, 5); join with a smooth curve', vertex(1, 1), 'y = x² + 1 (a = 1 is closer to 0 than a = 3)'],
    hint: 'Square x first: (−2)² = 4 · then multiply by a · then add c · join the points with a smooth curve, not a ruler',
    work: true,
    rounds: [{ text: 'complete the table, graph the parabola, then describe it.', cols: 2, ...formFig([tq(1, 0), tq(1, 2)], true, LINES) }],
  },
  drill: {
    hint: 'a negative: the parabola is upside down (∩) · the vertex is (0, c)',
    rounds: [
      { text: 'complete the table, graph the parabola, then describe it.', cols: 2, ...formFig([tq(1, -2), tq(-1, 0)], true, LINES) },
      { text: 'complete the table, graph the parabola, then describe it.', cols: 2, ...formFig([tq(-1, 3), tq(1, -4)], true, LINES) },
      { text: 'complete the table, graph the parabola, then describe it.', cols: 2, ...formFig([tq(-1, 2), tq(1, -1)], true, LINES) },
    ],
  },
  drill2: {
    hint: 'y = 2x²: square first, then double · y = ½x²: square first, then halve',
    rounds: [
      { text: 'complete the table, graph the parabola, then describe it.', cols: 2, ...formFig([tq(2, -3), tq(-2, 4)], true, LINES) },
      { text: 'complete the table, graph the parabola, then describe it.', cols: 2, ...formFig([tq(0.5, 1), tq(-0.5, 2)], true, LINES) },
      { text: 'complete the table, graph the parabola, then describe it.', cols: 2, ...formFig([tq(2, -6), tq(-1, -1)], true, LINES) },
    ],
  },
  medium: {
    ex: { stem: 'Graph, choose or find as shown.', parts: [{ t: 'Graph y = −x² + 4', fig: std('mid') },
      'Which is concave up with vertex (0, 0)? y = x² − 1, y = 2x², y = −x², y = 3x² + 2', 'Does (3, 10) lie on y = x² + 1?', 'Find the x-intercepts of y = x² − 9.'] },
    exAns: [`Table y: ${vals(-1, 4)}; ${vertex(-1, 4)}`, 'y = 2x² (a > 0 and c = 0)', '3² + 1 = 10 ✓ Yes', 'x² − 9 = 0, x² = 9, so x = 3 or x = −3'],
    work: true, set: true,
    rounds: [set([
      mq('Equation', pq(1, -3)[1], { fig: pq(1, -3)[0], lines: ['Vertex', 'Concave', 'Equation'] }),
      mq('', 'm = 2, c = −1: (0, −1) and (1, 1)', { fig: std('small', { notes: [freeCorner('small', [], 'y = 2x − 1')] }), from: '11.5', lines: ['m and c', 'Two points', 'Graph'] }),
      mq('Equation', pq(-1, 4)[1], { fig: pq(-1, 4)[0], lines: ['Vertex', 'Concave', 'Equation'] }),
      mq('Equation', pq(1, 1)[1], { fig: pq(1, 1)[0], lines: ['Vertex', 'Concave', 'Equation'] }),
      mq('', 'x = 3', { fig: std('small', { lines: [[{ m: 2, c: -3 }], [{ y: 3, dash: true }]], tags: [[lineTagAt(2, -3, 5), eq(2, -3)], [[[-4.4, 3], [-3, 3]], 'y = 3']] }), from: '11.7', lines: ['Equation', 'Read x', 'Check'] }),
      mq('Equation', pq(-1, -1)[1], { fig: pq(-1, -1)[0], lines: ['Vertex', 'Concave', 'Equation'] }),
    ])],
  },
  worded: [
    { q: 'The arch of a bridge is modelled by y = −0.5x² + 8 (in metres). How high is the top of the arch, and how wide is the arch at ground level?', a: 'Top: vertex (0, 8), so 8 m. Ground: −0.5x² + 8 = 0, x² = 16, x = ±4, so 8 m wide' },
    { q: 'A satellite dish has the shape of y = 0.25x² (in cm). How deep is the dish 6 cm out from its centre?', a: `y = 0.25 × 6² = ${n(0.25 * 36)} cm` },
    { q: 'Sketch y = x² and y = x² + 3 on the same axes, using x = −2 to 2. Describe how the second graph is related to the first.', a: `y = x²: ${vals(1, 0)}; y = x² + 3: ${vals(1, 3)}. The same shape, moved up 3: vertex (0, 3)` },
  ],
};
