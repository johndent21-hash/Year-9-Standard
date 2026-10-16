// Lesson 11.5 The gradient–intercept equation y = mx + c (three pages; see ../chapter.js and lib/lesson-two.js).
// Textbook 11.05.
const { P, mid, eq, frac, formFig, mq, set } = require('../helpers');
const { graph, linePts } = require('../shapes');

// An equation question with no picture: [picture, answer, words, own formula]
const mc = (text, m, c) => ['', `m = ${m}, c = ${c}`, text];
const blank = (k = 2.4) => graph({ x: [-4, 4], y: [-4, 4], k });
const notesFig = () => graph({ x: [-2, 3], y: [-2, 5], k: 4, every: 1, lines: [[{ m: 2, c: 1 }, 'y = 2x + 1', 1.8, 'w']], pts: [[0, 1, 'c = 1', 'w'], [1, 3]],
  steps: [[[0, 1], [1, 3], 'run 1', 'rise 2']] });

module.exports = {
  code: '11.5', title: 'The gradient–intercept equation',
  li: 'use y = mx + c to find the gradient and y-intercept of a line, and to graph it.',
  sc: ['state the gradient and y-intercept of a line in the form y = mx + c', 'rearrange an equation into the form y = mx + c', 'graph a line from its gradient and y-intercept'],
  notes: {
    terms: [['y = mx + c', 'the gradient–intercept form'], ['m', 'the gradient: the number in front of x'], ['c', 'the y-intercept: the constant term'],
      ['parallel lines', 'lines with the same gradient'], ['subject', 'the variable on its own on one side (y = …)']],
    formulas: ['y = mx + c', 'm = gradient, c = y-intercept', 'Parallel lines: equal gradients'],
    steps: ['make y the subject', 'read m and c', 'plot (0, c)', 'step run 1, rise m; rule the line'],
    fig: notesFig(),
  },
  easy: {
    ex: { stem: 'State m and c, or graph the line.', parts: ['y = 3x + 1', 'y = 8 − x', 'y = ⅕x + 4', { t: 'Graph y = 2x − 3', fig: blank(1.9) }] },
    exAns: ['m = 3, c = 1', 'y = −x + 8: m = −1, c = 8', 'm = ⅕, c = 4', 'Plot (0, −3); from it go right 1, up 2 to (1, −1); rule the line'],
    hint: 'm is the number in front of x (with its sign) · c is the number on its own · y must be on its own first',
    work: true,
    rounds: [
      { text: 'state the gradient and the y-intercept.', cols: 4, ...formFig([mc('y = 4x + 3', 4, 3), mc('y = −2x + 5', '−2', 5), mc('y = x − 7', 1, '−7'), mc('y = ½x + 1', '½', 1)], 'y = mx + c', ['Formula', 'm =', 'c =']) },
      { text: 'state the gradient and the y-intercept.', cols: 4, ...formFig([mc('y = 6 − 3x', '−3', 6), mc('y = −x', '−1', 0), mc('y = 9', 0, 9), mc('y = 0.5x − 2', 0.5, '−2')], true, ['Rearrange', 'm =', 'c =']) },
    ],
  },
  drill: {
    hint: 'Move the x-term first, then divide every term · c is where you start; m is up (or down) for each 1 across.',
    rounds: [
      { text: 'rearrange into the form y = mx + c, then state m and c.', ...formFig([['', 'y = −2x + 7: m = −2, c = 7', '2x + y = 7'], ['', 'y = 3x + 4: m = 3, c = 4', 'y − 3x = 4'], ['', 'y = −2x + 5: m = −2, c = 5', '4x + 2y = 10']], 'y = mx + c', ['Formula', 'Rearrange', 'm and c']) },
      { text: 'graph each line from its gradient and y-intercept.', ...formFig([[blank(), '(0, −1) and (1, 1)', 'y = 2x − 1'], [blank(), '(0, 3) and (1, 2)', 'y = −x + 3'], [blank(), '(0, 1) and (2, 2)', 'y = ½x + 1']], true, ['Start (0, c)', 'Step', 'Two points']) },
      { text: 'write the equation of each line.', ...formFig([['', eq(3, -2), 'm = 3, c = −2'], ['', eq([-1, 2], 4), 'm = −½, c = 4'], ['', eq(0, 5), 'm = 0, c = 5']], true) },
      { text: 'are the two lines parallel?', ...formFig([['', 'Yes: both have m = 2', 'y = 2x + 1 and y = 2x − 5'], ['', 'No: m = 3 and m = −3', 'y = 3x + 2 and y = −3x + 2'], ['', 'Yes: both have m = −1', 'y = 4 − x and y = −x + 7']], true, ['m of each', 'Compare', 'Answer']) },
    ],
  },
  medium: {
    ex: { stem: 'Find, graph or write as shown.', parts: ['State m and c for 3x + 2y = 12.', { t: 'Graph y = −2x + 4', fig: blank(1.9) },
      'Write the equation of the line with gradient −3 and y-intercept 5.', 'Write the equation of the line parallel to y = 4x − 1 with y-intercept 3.'] },
    exAns: ['2y = −3x + 12, so y = −1.5x + 6: m = −1.5, c = 6', 'Plot (0, 4); right 1, down 2 to (1, 2); rule the line', eq(-3, 5), `Parallel, so m = 4: ${eq(4, 3)}`],
    work: true, set: true,
    rounds: [set([
      mq('State the gradient and y-intercept of y = −6x.', 'm = −6, c = 0'),
      mq('Find the x-intercept of y = 3x − 12.', 'x = 4', { from: '11.4' }),
      mq('Rearrange 6x + 3y = 9 into the form y = mx + c.', eq(-2, 3)),
      mq('Equation', eq(-1, 2), { fig: linePts(-1, 2, [[0, 2], [4, -2]], { size: 26, maxH: 7 }) }),
      mq('Find the gradient of the interval joining (2, 3) and (6, 11).', frac(8, 4), { from: '11.3' }),
      mq('Write the equation of the line with gradient ¾ and y-intercept −2.', eq([3, 4], -2)),
      mq('Are y = 2x + 7 and 4x − 2y = 6 parallel? Show your working.', '4x − 2y = 6 gives y = 2x − 3: both have m = 2, so yes', { form: false }),
      mq('Find the midpoint of (−3, −4) and (5, 10).', P(mid([-3, -4], [5, 10])), { from: '11.2' }),
      mq('A line is parallel to y = −3x + 1 and crosses the y-axis at −4. Write its equation.', eq(-3, -4)),
    ])],
  },
  worded: [
    { q: 'A phone plan costs C = 15 + 0.5g dollars a month for g gigabytes of data. State the gradient and the C-intercept, and say what each means.', a: 'Gradient 0.5: $0.50 for each gigabyte. C-intercept 15: the $15 monthly fee (0 GB used)' },
    { q: 'Line A has equation y = 2x + 3. Line B is parallel to line A and crosses the y-axis 5 units below it. Write the equation of line B, then find its x-intercept.', a: 'm = 2, c = 3 − 5 = −2: y = 2x − 2. x-intercept: 0 = 2x − 2, x = 1' },
    { q: 'A student rewrote 2y − 6x = 8 as y = 6x + 8. Find the mistake, write the correct equation and state m and c.', a: 'They did not divide every term by 2. 2y = 6x + 8, so y = 3x + 4: m = 3, c = 4' },
  ],
};
