// Lesson 11.8 Linear modelling (four pages; see ../chapter.js). Every drill question is the same: a real-life
// straight-line graph with a ? at the value to read (with its rule on pages 1 and 2; the students find the rule from
// the graph on page 3). Textbook 11.08.
const { num, formFig, mq, set } = require('../helpers');
const { std, lineAB, model, table } = require('../shapes');

const money = (v) => `$${num(v, Number.isInteger(v) ? undefined : 2)}`;
// One question: the model y = m x + c drawn from 0 to x1, the value at x = r marked ?. rule: the rule as words beside it
const mq1 = (m, c, { x1, y1, gy, everyY, xl, yl, r, name, unit = '', rule = true, w = 42 }) => {
  const v = m * r + c, x = xl.split(' ')[0], ruleText = `${name} = ${m === 1 ? '' : num(m)}${x}${c === 0 ? '' : c < 0 ? ` − ${num(-c)}` : ` + ${num(c)}`}`;
  return [model((x) => m * x + c, { x1, y1, gy, everyY, xl, yl, readX: r, w, rule: rule ? ruleText : '' }), `${unit === '$' ? money(v) : `${num(v)}${unit}`} (${ruleText})`];
};
const L1 = ['Read', 'Substitute', 'Check'], L3 = ['Rule', 'Read', 'Check'];
const notesFig = () => model((x) => 2.25 * x + 3.5, { x1: 6, y1: 20, gy: 5, everyY: 5, xl: 'x (km)', yl: 'C ($)', w: 30 });

module.exports = {
  code: '11.8', title: 'Linear modelling',
  li: 'use straight-line graphs and equations to model real situations.',
  sc: ['read a value from the graph of a real situation', 'use the rule to check the value', 'find the rule from the graph: the starting value and the rate'],
  notes: {
    terms: [['model', 'an equation or graph that describes a real situation'], ['rate (gradient)', 'the change for each 1 unit, e.g. $2.25 per km'], ['starting value (c)', 'the value when x = 0, e.g. a flagfall'],
      ['predict', 'use the model to find a value']],
    formulas: ['y = mx + c', 'm = rate (change per unit)', 'c = starting value (x = 0)'],
    steps: ['find c: the value at the start', 'find m: the change for each 1', 'write the rule', 'substitute to predict or check'],
    fig: notesFig(),
  },
  easy: {
    ex: { stem: 'A rideshare costs $3.50 flagfall plus $2.25 for each kilometre.', parts: [
      { t: 'Table', fig: table([['x (km)', 0, 1, 2, 3], ['C ($)', '', '', '', '']], { w: 6, head: 10 }) }, { t: 'Graph', fig: model((x) => 2.25 * x + 3.5, { x1: 6, y1: 20, gy: 5, everyY: 5, xl: 'x', yl: 'C', w: 26 }) },
      'Write the rule for the cost C of an x km trip.', 'Find the cost of a 12 km trip.'] },
    exAns: ['C: 3.50, 5.75, 8.00, 10.25', 'Plot the points and rule the line from (0, 3.5)', 'C = 2.25x + 3.5', `C = 2.25 × 12 + 3.5 = ${money(2.25 * 12 + 3.5)}`],
    hint: 'Go up from the marked value to the line, then across to read it · substitute into the rule to check',
    work: true,
    rounds: [{ text: 'read the value marked ?, then check it with the rule.', cols: 2, ...formFig([
      mq1(5, 10, { x1: 6, y1: 40, gy: 5, everyY: 10, xl: 'n', yl: 'C ($)', r: 4, name: 'C', unit: '$' }),
      mq1(-5, 40, { x1: 8, y1: 40, gy: 5, everyY: 10, xl: 't (min)', yl: 'V (L)', r: 3, name: 'V', unit: ' L' })], true, L1) }],
  },
  drill: {
    hint: 'Read the scale on each axis first: each grid square may be 2, 5 or 10.',
    rounds: [
      { text: 'read the value marked ?, then check it with the rule.', cols: 2, ...formFig([
        mq1(15, 0, { x1: 4, y1: 60, gy: 10, everyY: 20, xl: 't (h)', yl: 'd (km)', r: 2, name: 'd', unit: ' km' }),
        mq1(2, 4, { x1: 10, y1: 24, gy: 2, everyY: 4, xl: 'd (km)', yl: 'C ($)', r: 6, name: 'C', unit: '$' })], true, L1) },
      { text: 'read the value marked ?, then check it with the rule.', cols: 2, ...formFig([
        mq1(-4, 30, { x1: 7, y1: 30, gy: 5, everyY: 10, xl: 't (min)', yl: 'T (°C)', r: 5, name: 'T', unit: '°C' }),
        mq1(5, 20, { x1: 8, y1: 60, gy: 5, everyY: 10, xl: 'n', yl: 'C ($)', r: 6, name: 'C', unit: '$' })], true, L1) },
      { text: 'read the value marked ?, then check it with the rule.', cols: 2, ...formFig([
        mq1(8, 0, { x1: 5, y1: 40, gy: 5, everyY: 10, xl: 'h', yl: 'P ($)', r: 3.5, name: 'P', unit: '$' }),
        mq1(-10, 50, { x1: 5, y1: 50, gy: 5, everyY: 10, xl: 't (h)', yl: 'V (L)', r: 2, name: 'V', unit: ' L' })], true, L1) },
    ],
  },
  drill2: {
    hint: 'The rule: c is where the line starts on the vertical axis; m is how much it goes up (or down) for each 1 across.',
    rounds: [
      { text: 'find the rule from the graph, then read the value marked ?.', cols: 2, ...formFig([
        mq1(3, 6, { x1: 8, y1: 30, gy: 3, everyY: 6, xl: 'n', yl: 'C ($)', r: 5, name: 'C', unit: '$', rule: false }),
        mq1(-5, 40, { x1: 8, y1: 40, gy: 5, everyY: 10, xl: 't (h)', yl: 'H (cm)', r: 6, name: 'H', unit: ' cm', rule: false })], true, L3) },
      { text: 'find the rule from the graph, then read the value marked ?.', cols: 2, ...formFig([
        mq1(20, 0, { x1: 5, y1: 100, gy: 10, everyY: 20, xl: 't (h)', yl: 'd (km)', r: 3.5, name: 'd', unit: ' km', rule: false }),
        mq1(4, 10, { x1: 6, y1: 40, gy: 5, everyY: 10, xl: 'h', yl: 'C ($)', r: 4, name: 'C', unit: '$', rule: false })], true, L3) },
      { text: 'find the rule from the graph, then read the value marked ?.', cols: 2, ...formFig([
        mq1(-15, 60, { x1: 4, y1: 60, gy: 5, everyY: 10, xl: 't (min)', yl: 'V (L)', r: 2.5, name: 'V', unit: ' L', rule: false }),
        mq1(2.5, 5, { x1: 8, y1: 25, gy: 5, everyY: 5, xl: 'n', yl: 'C ($)', r: 6, name: 'C', unit: '$', rule: false })], true, L3) },
    ],
  },
  medium: {
    ex: { stem: 'Use the rideshare model C = 2.25x + 3.5 (from Example 1).', parts: [
      { t: 'Read: 3.5 km', fig: model((x) => 2.25 * x + 3.5, { x1: 6, y1: 20, gy: 5, everyY: 5, xl: 'x', yl: 'C', readX: 3.5, w: 22 }) }, 'Find the cost of a 76 km trip.',
      'A trip cost $12.05. How far was it?', 'A trip cost $82.25. How far was it?'] },
    exAns: [`About ${money(2.25 * 3.5 + 3.5)} (C = 2.25 × 3.5 + 3.5)`, `C = 2.25 × 76 + 3.5 = ${money(2.25 * 76 + 3.5)}`, '2.25x + 3.5 = 12.05, so 2.25x = 8.55 and x = 3.8 km', '2.25x + 3.5 = 82.25, so 2.25x = 78.75 and x = 35 km'],
    work: true, set: true,
    rounds: [set([
      mq('', mq1(4, 8, { x1: 6, y1: 32, gy: 4, everyY: 8, xl: 'n', yl: 'C', r: 3, name: 'C', unit: '$', w: 21.5, rule: false })[1], { fig: mq1(4, 8, { x1: 6, y1: 32, gy: 4, everyY: 8, xl: 'n', yl: 'C', r: 3, name: 'C', w: 21.5, rule: false })[0], lines: L3 }),
      mq('', 'm = 2, c = 1: y = 2x + 1', { fig: lineAB(2, 1, [-2, -3], [2, 5], { size: 'small', coords: false }), from: '11.6', lines: ['A and B', 'm and c', 'Equation'] }),
      mq('', mq1(-5, 30, { x1: 6, y1: 30, gy: 5, everyY: 10, xl: 't', yl: 'V', r: 4, name: 'V', unit: ' L', w: 21.5, rule: false })[1], { fig: mq1(-5, 30, { x1: 6, y1: 30, gy: 5, everyY: 10, xl: 't', yl: 'V', r: 4, name: 'V', w: 21.5, rule: false })[0], lines: L3 }),
      mq('', mq1(12, 0, { x1: 5, y1: 60, gy: 10, everyY: 20, xl: 't', yl: 'd', r: 2.5, name: 'd', unit: ' km', w: 21.5, rule: false })[1], { fig: mq1(12, 0, { x1: 5, y1: 60, gy: 10, everyY: 20, xl: 't', yl: 'd', r: 2.5, name: 'd', w: 21.5, rule: false })[0], lines: L3 }),
      mq('', '(2, 3)', { fig: std('small', { lines: [[{ m: 1, c: 1 }], [{ m: -1, c: 5 }]] }), from: '11.7', lines: ['Read x', 'Read y', 'Point'] }),
      mq('', mq1(2, 6, { x1: 8, y1: 24, gy: 2, everyY: 4, xl: 'h', yl: 'C', r: 7, name: 'C', unit: '$', w: 21.5, rule: false })[1], { fig: mq1(2, 6, { x1: 8, y1: 24, gy: 2, everyY: 4, xl: 'h', yl: 'C', r: 7, name: 'C', w: 21.5, rule: false })[0], lines: L3 }),
    ])],
  },
  worded: [
    { q: 'A candle is 30 cm tall and burns 2.5 cm each hour. Write a rule for its height h cm after t hours. Find its height after 5 hours, and when it burns out.', a: 'h = 30 − 2.5t; h = 30 − 12.5 = 17.5 cm; 30 − 2.5t = 0 at t = 12 hours' },
    { q: 'A mobile plan costs $20 a month plus 15c for each minute of calls. Write a rule for the monthly cost C of m minutes. Find the cost of 120 minutes, and how many minutes give a $50 bill.', a: `C = 20 + 0.15m; C = 20 + 18 = ${money(38)}; 20 + 0.15m = 50, so m = 200 minutes` },
    { q: 'A pool already holds 1200 L of water. Water is pumped in at 80 L a minute. Write a rule for the volume V after t minutes, and find how long until it holds 5000 L.', a: 'V = 1200 + 80t; 1200 + 80t = 5000, so 80t = 3800 and t = 47.5 minutes' },
  ],
};
