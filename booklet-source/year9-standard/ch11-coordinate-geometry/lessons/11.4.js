// Lesson 11.4 Graphing linear equations (four pages; see ../chapter.js). Every drill question is the same: a table of
// values for x = −2 to 2 beside a blank number plane: complete the table, graph the line, give both intercepts.
// The Medium set: a line drawn on a plane, its intercepts asked. Textbook 11.04.
const { n, eq, frac, lenAns, formFig, mq, set } = require('../helpers');
const { std, interval, table, tableGraph, freeCorner, graph } = require('../shapes');

const X = [-2, -1, 0, 1, 2];
const LINES = ['y-values', 'x-intercept', 'y-intercept'];
const ans = (m, c) => `y: ${X.map((x) => n(m * x + c)).join(', ')}; x-intercept (${n(-c / m)}, 0); y-intercept (0, ${n(c)})`;
// One drill question: the rule's table beside a blank plane
const tq = (m, c) => [tableGraph(eq(m, c), X), ans(m, c)];
// A Medium question: the line drawn, its equation in a free corner, the intercepts asked
const iq = (m, c, label = eq(m, c)) => [std('small', { k: 1.95, lines: [[{ m, c }]], notes: [freeCorner('small', [], label, [(x) => m * x + c])] }), `(${n(-c / m)}, 0) and (0, ${n(c)})`];
const notesFig = () => graph({ x: [-2, 4], y: [-3, 4], k: 4, lines: [[{ m: 2, c: -2 }, 'y = 2x − 2', 2.8, 'w']], pts: [[1, 0, '(1, 0)', 'se'], [0, -2, '(0, −2)', 'w']] });

module.exports = {
  code: '11.4', title: 'Graphing linear equations',
  li: 'graph straight lines from a table of values and find where they cross the axes.',
  sc: ['complete a table of values', 'plot the points and rule a straight line through them', 'find the x- and y-intercepts of a line'],
  notes: {
    terms: [['linear equation', 'its graph is a straight line'], ['table of values', 'x-values and the y-values they give'], ['x-intercept', 'where a line crosses the x-axis (y = 0)'],
      ['y-intercept', 'where a line crosses the y-axis (x = 0)'], ['x = a', 'a vertical line'], ['y = b', 'a horizontal line']],
    formulas: ['x-intercept: put y = 0 and solve', 'y-intercept: put x = 0', 'On the line? Substitute x and y: both sides equal'],
    steps: ['substitute each x into the rule', 'write the y-values in the table', 'plot the points', 'rule a line through them'],
    fig: notesFig(),
  },
  easy: {
    ex: { stem: 'For y = 2x + 1:', parts: [{ t: 'Table', fig: table([['x', ...X.map(n)], ['y', ...X.map(() => '')]], { w: 5.2, head: 6, title: 'y = 2x + 1' }) },
      { t: 'Graph', fig: std('mid') }, 'Find the x- and y-intercepts.', 'Does (3, 7) lie on the line?'] },
    exAns: [`y: ${X.map((x) => n(2 * x + 1)).join(', ')}`, 'Plot (−2, −3), (−1, −1), (0, 1), (1, 3), (2, 5) and rule a line', 'y = 0: 2x + 1 = 0, x = −½ → (−½, 0); x = 0: y = 1 → (0, 1)', '2 × 3 + 1 = 7 ✓ Yes'],
    hint: 'Substitute each x into the rule · brackets for negatives: 2 × (−2) + 1 = −3 · plot every point, then rule the line',
    work: true,
    rounds: [{ text: 'fill in the y-values, plot the points, rule the line, then write both intercepts.', cols: 2, ...formFig([tq(1, 2), tq(-1, 3)], true, LINES) }],
  },
  drill: {
    hint: 'x-intercept: where the line crosses the x-axis (y = 0) · y-intercept: where it crosses the y-axis (x = 0)',
    rounds: [
      { text: 'fill in the y-values, plot the points, rule the line, then write both intercepts.', cols: 2, ...formFig([tq(2, -2), tq(1, -2)], true, LINES) },
      { text: 'fill in the y-values, plot the points, rule the line, then write both intercepts.', cols: 2, ...formFig([tq(-2, 2), tq(3, 0)], true, LINES) },
      { text: 'fill in the y-values, plot the points, rule the line, then write both intercepts.', cols: 2, ...formFig([tq(1, 3), tq(-1, -2)], true, LINES) },
    ],
  },
  drill2: {
    hint: 'A fraction rule: ½ × (−2) = −1 · a negative gradient: the line goes down to the right.',
    rounds: [
      { text: 'fill in the y-values, plot the points, rule the line, then write both intercepts.', cols: 2, ...formFig([tq(0.5, 1), tq(-0.5, 2)], true, LINES) },
      { text: 'fill in the y-values, plot the points, rule the line, then write both intercepts.', cols: 2, ...formFig([tq(2, -4), tq(-3, 0)], true, LINES) },
      { text: 'fill in the y-values, plot the points, rule the line, then write both intercepts.', cols: 2, ...formFig([tq(-2, -2), tq(1, -3)], true, LINES) },
    ],
  },
  medium: {
    ex: { stem: 'Graph, test or find as shown.', parts: [{ t: 'Graph y = −2x + 3', fig: std('mid') }, 'Find the x- and y-intercepts of y = −2x + 3.',
      'Find the x- and y-intercepts of 3x + 2y = 6.', { t: 'Graph x = −2 and y = 3', fig: std('mid') }] },
    exAns: ['Table y: 7, 5, 3, 1, −1 (x = −2 to 2); plot and rule the line', 'y = 0: −2x + 3 = 0, x = 1.5 → (1.5, 0); x = 0: (0, 3)', 'y = 0: 3x = 6, x = 2 → (2, 0); x = 0: 2y = 6, y = 3 → (0, 3)', 'x = −2: a vertical line through −2 on the x-axis; y = 3: a horizontal line through 3 on the y-axis'],
    work: true, set: true,
    rounds: [set([
      mq('Find both intercepts.', iq(2, -4)[1], { fig: iq(2, -4)[0], lines: ['x-intercept', 'y-intercept', 'Check'] }),
      mq('Find the gradient.', frac(6, 4), { fig: interval([-3, -2], [1, 4], { size: 'small', coords: false, ask: 'm = ?', k: 1.95 }), from: '11.3', lines: ['A and B', 'Substitute', 'Answer'] }),
      mq('Find both intercepts.', iq(-1, 3)[1], { fig: iq(-1, 3)[0], lines: ['x-intercept', 'y-intercept', 'Check'] }),
      mq('Find both intercepts.', iq(0.5, 2)[1], { fig: iq(0.5, 2)[0], lines: ['x-intercept', 'y-intercept', 'Check'] }),
      mq('How long is AB?', lenAns(25), { fig: interval([-2, -1], [2, 2], { size: 'small', coords: false, ask: 'AB = ?', k: 1.95 }), from: '11.1', lines: ['A and B', 'Substitute', 'Answer'] }),
      mq('Find both intercepts.', iq(-1, -3, 'x + y = −3')[1], { fig: iq(-1, -3, 'x + y = −3')[0], lines: ['x-intercept', 'y-intercept', 'Check'] }),
    ])],
  },
  worded: [
    { q: 'A plumber charges C = 40 + 60h dollars for h hours of work. Make a table for h = 0, 1, 2 and 3. What is the C-intercept, and what does it mean?', a: 'C: 40, 100, 160, 220. C-intercept 40: the $40 call-out fee (charged for 0 hours)' },
    { q: 'The line 3x + 2y = 18 crosses both axes. Find where, then find the length of the interval between these two points, correct to one decimal place.', a: `(6, 0) and (0, 9); d = √(6² + 9²) = ${lenAns(117)}` },
    { q: 'The lines x = −1, x = 5, y = 2 and y = −3 enclose a rectangle. Find its perimeter and its area.', a: 'Width 5 − (−1) = 6, height 2 − (−3) = 5: P = 22 units, A = 30 square units' },
  ],
};
