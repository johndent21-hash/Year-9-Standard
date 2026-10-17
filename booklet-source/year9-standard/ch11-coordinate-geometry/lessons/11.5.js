// Lesson 11.5 The gradient–intercept equation y = mx + c (four pages; see ../chapter.js). Every drill question is the
// same: an equation beside a blank number plane: state m and c, then graph the line from them. Textbook 11.05.
const { eq, frac, formFig, mq, set } = require('../helpers');
const { std, interval, freeCorner, graph } = require('../shapes');

// One question: the equation (words beside the plane), m and c, two points on the line
const gq = (text, m, c, size = 'big') => [std(size), `m = ${frac(...(Array.isArray(m) ? m : [m, 1]))}, c = ${c}: (0, ${c}) and (${Array.isArray(m) ? m[1] : 1}, ${(Array.isArray(m) ? m[0] : m) + c})`, text];
const L1 = ['Formula', 'm and c', 'Two points'], L2 = ['Rearrange', 'm and c', 'Two points'];
const notesFig = () => graph({ x: [-2, 3], y: [-2, 5], k: 4, lines: [[{ m: 2, c: 1 }, 'y = 2x + 1', 1.8, 'w']], pts: [[0, 1, 'c = 1', 'w'], [1, 3]],
  steps: [[[0, 1], [1, 3], 'run 1', 'rise 2']] });

module.exports = {
  code: '11.5', title: 'The gradient–intercept equation',
  li: 'use y = mx + c to find the gradient and y-intercept of a line, and to graph it.',
  sc: ['state the gradient and y-intercept of a line in the form y = mx + c', 'rearrange an equation into the form y = mx + c', 'graph a line from its gradient and y-intercept'],
  notes: {
    terms: [['y = mx + c', 'the gradient–intercept form'], ['m', 'the gradient: the number in front of x'], ['c', 'the y-intercept: the number on its own'],
      ['parallel lines', 'lines with the same gradient'], ['subject', 'the variable on its own on one side (y = …)']],
    formulas: ['y = mx + c', 'm = gradient, c = y-intercept', 'Parallel lines: equal gradients'],
    steps: ['make y the subject', 'read m and c', 'plot (0, c)', 'go across 1 and up m; rule the line'],
    fig: notesFig(),
  },
  easy: {
    ex: { stem: 'State m and c, then graph the line.', parts: ['y = 3x + 1', 'y = 8 − x', 'y = ⅕x + 4', { t: 'Graph y = 2x − 3', fig: std('mid') }] },
    exAns: ['m = 3, c = 1', 'y = −x + 8: m = −1, c = 8', 'm = ⅕, c = 4', 'Plot (0, −3); go across 1, up 2 to (1, −1); rule the line'],
    hint: 'm is the number in front of x (with its sign) · c is the number on its own · start at (0, c), then across 1 and up m',
    work: true,
    rounds: [{ text: 'write m and c, plot (0, c), then go across 1 and up (or down) m. Rule the line.', cols: 2, ...formFig([gq('y = 2x + 1', 2, 1), gq('y = −x + 4', -1, 4)], 'y = mx + c', L1) }],
  },
  drill: {
    hint: 'A negative m: go across 1 and down · m = ½: go across 2 and up 1.',
    rounds: [
      { text: 'write m and c, plot (0, c), then go across 1 and up (or down) m. Rule the line.', cols: 2, ...formFig([gq('y = 3x − 2', 3, -2), gq('y = −2x + 3', -2, 3)], true, L1) },
      { text: 'write m and c, plot (0, c), then go across 1 and up (or down) m. Rule the line.', cols: 2, ...formFig([gq('y = x − 4', 1, -4), gq('y = ½x + 2', [1, 2], 2)], true, L1) },
      { text: 'write m and c, plot (0, c), then go across 1 and up (or down) m. Rule the line.', cols: 2, ...formFig([gq('y = −x − 1', -1, -1), gq('y = 2x', 2, 0)], true, L1) },
    ],
  },
  drill2: {
    hint: 'Get y on its own first: move the x-term, then divide every term.',
    rounds: [
      { text: 'rearrange into y = mx + c, write m and c, then graph the line.', cols: 2, ...formFig([gq('2x + y = 4', -2, 4), gq('y − 3x = 1', 3, 1)], true, L2) },
      { text: 'rearrange into y = mx + c, write m and c, then graph the line.', cols: 2, ...formFig([gq('x + y = −2', -1, -2), gq('2y = x + 4', [1, 2], 2)], true, L2) },
      { text: 'rearrange into y = mx + c, write m and c, then graph the line.', cols: 2, ...formFig([gq('4x + 2y = 6', -2, 3), gq('y + 2 = x', 1, -2)], true, L2) },
    ],
  },
  medium: {
    ex: { stem: 'Find, graph or write as shown.', parts: ['State m and c for 3x + 2y = 12.', { t: 'Graph y = −2x + 4', fig: std('mid') },
      'Write the equation with gradient −3 and y-intercept 5.', 'Write the equation of the line parallel to y = 4x − 1 with y-intercept 3.'] },
    exAns: ['2y = −3x + 12, so y = −1.5x + 6: m = −1.5, c = 6', 'Plot (0, 4); go across 1, down 2 to (1, 2); rule the line', eq(-3, 5), `Parallel, so m = 4: ${eq(4, 3)}`],
    work: true, set: true,
    rounds: [set([
      mq('Graph y = −3x + 2.', gq('', -3, 2)[1], { fig: std('small', { k: 2.05 }), lines: L2 }),
      mq('Find the intercepts.', '(2, 0) and (0, 4)', { fig: std('small', { lines: [[{ m: -2, c: 4 }]], notes: [freeCorner('small', [], 'y = −2x + 4', [(x) => -2 * x + 4])] }), from: '11.4', lines: ['x-intercept', 'y-intercept', 'Check'] }),
      mq('Graph 2x + y = −1.', gq('', -2, -1)[1], { fig: std('small', { k: 2.05 }), lines: L2 }),
      mq('Graph y = −½x + 1.', gq('', [-1, 2], 1)[1], { fig: std('small', { k: 2.05 }), lines: L2 }),
      mq('Find the gradient.', frac(4, 8), { fig: interval([-4, -1], [4, 3], { size: 'small', coords: false, ask: 'm = ?' }), from: '11.3', lines: ['A and B', 'Substitute', 'Answer'] }),
      mq('Graph 3x − y = 2.', gq('', 3, -2)[1], { fig: std('small', { k: 2.05 }), lines: L2 }),
    ])],
  },
  worded: [
    { q: 'A phone plan costs C = 15 + 0.5g dollars a month for g gigabytes of data. State the gradient and the C-intercept, and say what each means.', a: 'Gradient 0.5: $0.50 for each gigabyte. C-intercept 15: the $15 monthly fee (0 GB used)' },
    { q: 'Line A has equation y = 2x + 3. Line B is parallel to line A and crosses the y-axis 5 units below it. Write the equation of line B, then find its x-intercept.', a: 'm = 2, c = 3 − 5 = −2: y = 2x − 2. x-intercept: 0 = 2x − 2, x = 1' },
    { q: 'A student rewrote 2y − 6x = 8 as y = 6x + 8. Find the mistake, write the correct equation and state m and c.', a: 'They did not divide every term by 2. 2y = 6x + 8, so y = 3x + 4: m = 3, c = 4' },
  ],
};
