// Lesson 11.10 Parabolas in real life (three pages; see ../chapter.js and lib/lesson-two.js). Textbook 11.11.
const { num, n, eq, formFig, mq, set } = require('../helpers');
const { plane, table } = require('../shapes');

const h = (a, c) => (t) => a * t * t + c;
// A table of t (or x) values with the second row blank
const tab = (rule, xs, name = 't', title = rule) => [table([[name, ...xs.map(n)], [rule.split(' ')[0], ...xs.map(() => '')]], { w: 5.4, head: 6, title }), ''];
// A model's graph from t = 0 to t1, different scales across and up; read: a t-value marked with a ? on the curve
const model = (fn, { t1, y1, k, ky, everyY, gy, xl = 't (s)', yl = 'h (m)', every = 1, read }) => plane({ x: [0, t1], y: [0, y1], k, ky, grid: true, nums: true, gx: every === 1 ? 1 : 0.5, gy, every, everyY, xl, yl,
  curves: [[fn]], pts: read === undefined ? [] : [[read, fn(read), '?', 'ne']], segs: read === undefined ? [] : [[[read, 0], [read, fn(read)], { dash: true, blue: false, w: 0.35 }]] });
// [picture, answer, words, own formula]: substitute into a rule
const sub = (rule, at, v, unit) => ['', `${num(v)} ${unit}`, `${rule}, when ${at}`, rule];
const notesFig = () => model(h(-5, 20), { t1: 2, y1: 20, k: 14, ky: 1.4, everyY: 5, gy: 5, pts: [] });

module.exports = {
  code: '11.10', title: 'Parabolas in real life',
  li: 'use parabolas to model real situations, such as falling objects and arches.',
  sc: ['complete a table of values for a quadratic model', 'read values from the graph of a model', 'find the start, the highest point and when the model reaches a value'],
  notes: {
    terms: [['model', 'an equation that describes a real situation'], ['y-intercept', 'the starting value (t = 0)'], ['vertex', 'the highest or lowest point'],
      ['x-intercepts', 'where the height is 0 (on the ground)'], ['sensible values', 'only the times or lengths that make sense, e.g. t ≥ 0']],
    formulas: ['Falling stone: h = −5t² + c (c = starting height)', 'Start: put t = 0', 'On the ground: put h = 0 and solve', 'Area of a square: A = x²'],
    steps: ['substitute to make a table', 'plot and join with a smooth curve', 'read the value asked for', 'check by substituting'],
    fig: notesFig(),
  },
  easy: {
    ex: { stem: 'A stone is dropped from a cliff. Its height after t seconds is h = −5t² + 20 metres.', parts: [
      { t: 'Table', fig: tab('h = −5t² + 20', [0, 1, 2], 't')[0] }, 'What is the h-intercept, and what does it mean?', 'Find the height after 0.5 seconds.', 'When does the stone hit the ground?'] },
    exAns: ['h: 20, 15, 0', '20: the stone starts 20 m up (the cliff’s height)', `h = −5 × 0.5² + 20 = ${num(h(-5, 20)(0.5))} m`, '−5t² + 20 = 0, t² = 4, t = 2 seconds (t ≥ 0)'],
    hint: 'Square t first, then × −5, then + the starting height · on the ground means h = 0',
    work: true,
    rounds: [
      { text: 'use each rule to find the value.', cols: 4, ...formFig([sub('h = −5t² + 45', 't = 2', 25, 'm'), sub('h = −5t² + 80', 't = 3', 35, 'm'), sub('A = x²', 'x = 7', 49, 'cm²'), sub('d = 5t²', 't = 4', 80, 'm')], true, ['Rule', 'Substitute', 'Answer']) },
      { text: 'complete each table of values.', cols: 4, ...formFig([
        [tab('h = −5t² + 45', [0, 1, 2, 3])[0], 'h: 45, 40, 25, 0'], [tab('d = 5t²', [0, 1, 2, 3])[0], 'd: 0, 5, 20, 45'],
        [tab('A = x²', [1, 2, 3, 4], 'x')[0], 'A: 1, 4, 9, 16'], [tab('h = −t² + 9', [0, 1, 2, 3])[0], 'h: 9, 8, 5, 0']], true, ['Square', 'Working', 'Values']) },
    ],
  },
  drill: {
    hint: 'Read across from the axis to the curve · to find t: put in the value, then solve t² = …, keep t ≥ 0.',
    rounds: [
      { text: 'h = −5t² + 45. Read the height marked ? from the graph.', ...formFig([0, 1, 2].map((t) => [model(h(-5, 45), { t1: 3, y1: 50, k: 8.8, ky: 0.37, everyY: 10, gy: 5, read: t }), `${num(h(-5, 45)(t))} m`]), true, ['Read', 'Check', 'Answer']) },
      { text: 'find when the model reaches the value.', ...formFig([['', '−5t² + 80 = 0, t² = 16, t = 4 s', 'h = −5t² + 80; when is h = 0?'], ['', '−5t² + 45 = 25, t² = 4, t = 2 s', 'h = −5t² + 45; when is h = 25?'],
        ['', '5t² = 125, t² = 25, t = 5 s', 'd = 5t²; when is d = 125?']], true, ['Equation', 'Solve', 'Answer']) },
      { text: 'use the area model.', ...formFig([['', 'x² = 64, x = 8 cm', 'A = x²; find x when A = 64'], ['', `A = 2 × 5² = ${num(50)} cm²`, 'A = 2x²; find A when x = 5'], ['', '2x² = 72, x² = 36, x = 6 cm', 'A = 2x²; find x when A = 72']], true, ['Equation', 'Solve', 'Answer']) },
      { text: 'when does each dropped object hit the ground?', ...formFig([[20, 2], [180, 6], [31.25, 2.5]].map(([c, t]) => ['', `−5t² + ${num(c)} = 0, t² = ${num(c / 5)}, t = ${num(t)} s`, `h = −5t² + ${num(c)}`]), true, ['h = 0', 'Solve', 'Answer']) },
    ],
  },
  medium: {
    ex: { stem: 'A ball is dropped from 80 m. Its height after t seconds is h = −5t² + 80 metres.', parts: [
      { t: 'Graph', fig: model(h(-5, 80), { t1: 4, y1: 80, k: 5.4, ky: 0.17, everyY: 20, gy: 10 }) }, 'Find the height after 2.5 seconds.', 'When is the ball 35 m above the ground?', 'How far does it fall in the first 2 seconds?'] },
    exAns: ['From the table h: 80, 75, 60, 35, 0 (t = 0 to 4)', `h = −5 × 2.5² + 80 = ${num(h(-5, 80)(2.5))} m`, '−5t² + 80 = 35, t² = 9, t = 3 seconds', 'At t = 2, h = 60: it has fallen 80 − 60 = 20 m'],
    work: true, set: true,
    rounds: [set([
      mq('A stone is dropped: h = −5t² + 125. Find its height after 3 seconds.', `${num(h(-5, 125)(3))} m`),
      mq('Find the vertex of y = −x² + 6.', '(0, 6)', { from: '11.9', form: false }),
      mq('When does the stone in question 1 hit the ground?', '−5t² + 125 = 0, t² = 25, t = 5 s'),
      mq('Read', '15 m', { fig: model(h(-5, 20), { t1: 2, y1: 20, k: 7.8, ky: 0.48, everyY: 10, gy: 5, read: 1 }), form: false }),
      mq('A plumber charges C = 60h + 90 dollars. Find C for 2 hours.', '$210', { from: '11.8' }),
      mq('A square tile has area A = x² cm². What side length gives an area of 144 cm²?', 'x² = 144, x = 12 cm'),
      mq('Which is higher after 1 second: h = −5t² + 50 or h = −4t² + 48?', 'h = −5t² + 50 (45 m, not 44 m)', { form: false }),
      mq('Find the equation of the line through (0, 2) and (4, 10).', eq(2, 2), { from: '11.6' }),
      mq('A dropped stone falls d = 5t² metres in t seconds. How far does it fall between t = 1 and t = 3?', '45 − 5 = 40 m', { form: false }),
    ])],
  },
  worded: [
    { q: 'A diver jumps from a 20 m cliff. Her height above the water after t seconds is h = −5t² + 20 metres. How long until she reaches the water? How high is she after 1.5 seconds?', a: `−5t² + 20 = 0, t² = 4, t = 2 s. h = −5 × 1.5² + 20 = ${num(h(-5, 20)(1.5))} m` },
    { q: 'A garden arch is modelled by y = −0.25x² + 4 (in metres). Find its height and its width at ground level. Can a 3 m tall cart pass under it 1.8 m from the centre?', a: `Height 4 m; −0.25x² + 4 = 0, x = ±4, so 8 m wide. At x = 1.8: y = ${num(h(-0.25, 4)(1.8), 2)} m, which is more than 3 m, so yes` },
    { q: 'A square photo has area A = x² cm². A frame needs a photo with an area of 50 cm². Find the side length, correct to one decimal place.', a: `x² = 50, x = √50 = ${num(Math.sqrt(50), 1)} cm` },
  ],
};
