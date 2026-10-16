// Lesson 11.8 Linear modelling (three pages; see ../chapter.js and lib/lesson-two.js). Textbook 11.08.
const { num, n, eq, formFig, mq, set } = require('../helpers');
const { plane, table } = require('../shapes');

const money = (v) => `$${num(v, Number.isInteger(v) ? undefined : 2)}`;
// A table of values with both rows filled: the rule asked
const ruleTab = (m, c, xs = [0, 1, 2, 3]) => [table([['x', ...xs.map(n)], ['y', ...xs.map((x) => n(m * x + c))]], { w: 5.2, head: 6 }), eq(m, c)];
// A real-life graph: y = mx + c from x = 0 to x1, with different scales across and up
// read: an x-value marked with a dashed line up to the graph and a ? at the point, for the value to be read
const life = (m, c, { x1, y1, k, ky, every = 1, everyY, gy, xl = 'x', yl = 'y', pts = [], read }) => plane({ x: [0, x1], y: [0, y1], k, ky, grid: true, nums: true, gy, every, everyY, xl, yl,
  lines: [[{ m, c }]], pts: read === undefined ? pts : [[read, m * read + c, '?', m >= 0 ? 'nw' : 'ne']], segs: read === undefined ? [] : [[[read, 0], [read, m * read + c], { dash: true, blue: false, w: 0.35 }]] });
// [picture, answer, words, own formula]: substitute into a rule
const sub = (rule, x, v, unit = '') => ['', unit === '$' ? money(v) : `${n(v)}${unit}`, `${rule}, when ${x}`, rule];
const notesFig = () => life(2.25, 3.5, { x1: 6, y1: 20, k: 4.4, ky: 1.4, everyY: 5, gy: 5, xl: 'x (km)', yl: 'C ($)', pts: [[0, 3.5, 'c = 3.50', 'e']] });

module.exports = {
  code: '11.8', title: 'Linear modelling',
  li: 'use straight-line graphs and equations to model real situations.',
  sc: ['use a rule to find a value, and find a rule from a table', 'explain what the gradient and y-intercept mean in a real situation', 'write and use an equation to make predictions'],
  notes: {
    terms: [['model', 'an equation or graph that describes a real situation'], ['rate (gradient)', 'the change for each 1 unit, e.g. $2.25 per km'], ['starting value (c)', 'the value when x = 0, e.g. a flagfall'],
      ['predict', 'use the model to find a value']],
    formulas: ['y = mx + c', 'm = rate (change per unit)', 'c = starting value (x = 0)'],
    steps: ['find c: the value at the start', 'find m: the change for each 1', 'write y = mx + c', 'substitute to predict'],
    fig: notesFig(),
  },
  easy: {
    ex: { stem: 'A rideshare costs $3.50 flagfall plus $2.25 for each kilometre.', parts: [
      { t: 'Table', fig: table([['x (km)', 0, 1, 2, 3], ['C ($)', '', '', '', '']], { w: 6, head: 10 }) }, 'What do the gradient and the C-intercept mean?',
      'Write an equation for the cost C of an x km trip.', 'Find the cost of a 12 km trip.'] },
    exAns: ['C: 3.50, 5.75, 8.00, 10.25', 'Gradient 2.25: $2.25 per km. C-intercept 3.50: the flagfall', 'C = 2.25x + 3.5', `C = 2.25 × 12 + 3.5 = ${money(2.25 * 12 + 3.5)}`],
    hint: 'Substitute the value into the rule · c is the starting value · m is the change for each 1',
    work: true,
    rounds: [
      { text: 'use each rule to find the value.', cols: 4, ...formFig([sub('C = 5 + 2n', 'n = 8', 21, '$'), sub('C = 12 + 3h', 'h = 5', 27, '$'), sub('d = 60t', 't = 2.5', 150, ' km'), sub('V = 50 − 4t', 't = 6', 26, ' L')], true, ['Rule', 'Substitute', 'Answer']) },
      { text: 'find the rule for each table.', cols: 4, ...formFig([ruleTab(3, 5), ruleTab(4, 2), ruleTab(-3, 20), ruleTab(0.5, 1)], true) },
    ],
  },
  drill: {
    hint: 'Starting value → c · amount per unit → m · read across, then up (or down), to use a graph.',
    rounds: [
      { text: 'write a rule y = mx + c for each situation.', ...formFig([['', 'C = 2d + 4', 'Taxi: $4 flagfall, then $2 per km'], ['', 'C = 0.1t + 25', 'Phone: $25 a month, plus 10c per text'],
        ['', 'V = 15t + 200', 'Pool: holds 200 L, filling at 15 L a minute']], 'y = mx + c') },
      { text: 'read the value marked ? on each graph, then check it with a rule.', ...formFig([
        [life(5, 10, { x1: 6, y1: 40, k: 4.5, ky: 0.45, everyY: 10, gy: 5, xl: 'n', yl: 'C ($)', read: 4 }), 'C = $30 (rule C = 5n + 10)'],
        [life(-5, 40, { x1: 8, y1: 40, k: 3.3, ky: 0.45, everyY: 10, gy: 5, every: 2, xl: 't (min)', yl: 'V (L)', read: 3 }), 'V = 25 L (rule V = 40 − 5t)'],
        [life(15, 0, { x1: 4, y1: 60, k: 6.3, ky: 0.3, everyY: 20, gy: 10, xl: 't (h)', yl: 'd (km)', read: 2.5 }), 'd = 37.5 km (rule d = 15t)']], true, ['Read', 'Rule', 'Check']) },
      { text: 'say what m and c mean in each model.', ...formFig([['', '$30 per hour; $50 call-out fee', 'C = 50 + 30h (a plumber, h hours)'], ['', 'grows 6 mm a week; 150 mm at the start', 'H = 150 + 6w (a plant, w weeks)'],
        ['', 'spends $25 a week; $400 at the start', 'B = 400 − 25w (a bank balance, w weeks)']], true, ['m means', 'c means', 'Answer']) },
      { text: 'use the rule to find the missing value.', ...formFig([['', 'd = 13 km', 'C = 4 + 2d. Find d when C = 30'], ['', 't = 70 texts', 'C = 25 + 0.1t. Find t when C = 32'],
        ['', 't = 20 minutes', 'V = 200 + 15t. Find t when V = 500']], true, ['Equation', 'Solve', 'Answer']) },
    ],
  },
  medium: {
    ex: { stem: 'Use the rideshare model C = 2.25x + 3.5 (from Example 1).', parts: [
      { t: 'Read: cost of 3.5 km?', fig: life(2.25, 3.5, { x1: 6, y1: 20, k: 3.4, ky: 0.65, everyY: 5, gy: 5, xl: 'x', yl: 'C' }) }, 'Find the cost of a 76 km trip.',
      'A trip cost $12.05. How far was it?', 'A trip cost $82.25. How far was it?'] },
    exAns: [`About ${money(2.25 * 3.5 + 3.5)} (C = 2.25 × 3.5 + 3.5 = ${money(2.25 * 3.5 + 3.5)})`, `C = 2.25 × 76 + 3.5 = ${money(2.25 * 76 + 3.5)}`, '2.25x + 3.5 = 12.05, so 2.25x = 8.55 and x = 3.8 km', '2.25x + 3.5 = 82.25, so 2.25x = 78.75 and x = 35 km'],
    work: true, set: true,
    rounds: [set([
      mq('A plumber charges $80 plus $60 per hour. Write a rule for the cost C of h hours.', 'C = 60h + 80'),
      mq('Find the equation of the line through (0, 4) and (2, 10).', eq(3, 4), { from: '11.6' }),
      mq('Use your rule from question 1 to find the cost of 3.5 hours.', `C = 60 × 3.5 + 80 = ${money(290)}`),
      mq('Rule', eq(-2, 12), { fig: ruleTab(-2, 12)[0] }),
      mq('Where do y = x + 1 and y = 5 − x cross?', '(2, 3)', { from: '11.7', form: false }),
      mq('A car’s tank holds 60 L of fuel. The car uses 7.5 L per 100 km. Write a rule for the fuel F left after d hundred kilometres.', 'F = 60 − 7.5d'),
      mq('Using question 6, how far can the car go before the tank is empty?', '60 − 7.5d = 0, d = 8: 800 km'),
      mq('A line rises 6 for a run of 4. Find its gradient.', 'm = 6 ÷ 4 = 1.5', { from: '11.3' }),
      mq('Gym plan A: $50 + $10 a week. Plan B: $20 + $15 a week. After how many weeks do they cost the same?', '50 + 10w = 20 + 15w, so w = 6 weeks', { form: false }),
    ])],
  },
  worded: [
    { q: 'A candle is 30 cm tall and burns 2.5 cm each hour. Write a rule for its height h cm after t hours. Find its height after 5 hours, and when it burns out.', a: 'h = 30 − 2.5t; h = 30 − 12.5 = 17.5 cm; 30 − 2.5t = 0 at t = 12 hours' },
    { q: 'A mobile plan costs $20 a month plus 15c for each minute of calls. Write a rule for the monthly cost C of m minutes. Find the cost of 120 minutes, and how many minutes give a $50 bill.', a: `C = 20 + 0.15m; C = 20 + 18 = ${money(38)}; 20 + 0.15m = 50, so m = 200 minutes` },
    { q: 'A pool already holds 1200 L of water. Water is pumped in at 80 L a minute. Write a rule for the volume V after t minutes, and find how long until it holds 5000 L.', a: 'V = 1200 + 80t; 1200 + 80t = 5000, so 80t = 3800 and t = 47.5 minutes' },
  ],
};
