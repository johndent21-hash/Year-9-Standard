// Lesson 11.10 Parabolas in real life (four pages; see ../chapter.js). Every drill question is the same: the graph of a
// falling object's height h = −5t² + c with a ? to read (pages 1 and 2: the height at a marked time; page 3: the time
// at a marked height), checked with the rule. Textbook 11.11.
const { num, formFig, mq, set } = require('../helpers');
const { std, model, table, freeCorner, lineAB } = require('../shapes');

const h = (a, c) => (t) => a * t * t + c;
const SCALE = { 20: { x1: 2, gy: 2, everyY: 5 }, 45: { x1: 3, gy: 5, everyY: 10 }, 80: { x1: 4, gy: 10, everyY: 20 }, 125: { x1: 5, gy: 25, everyY: 25 } };
const graphOf = (c, o = {}) => model(h(-5, c), { ...SCALE[c], y1: c, gx: 0.5, xl: 't (s)', yl: 'h (m)', ...o });
// One question: h = −5t² + c; at: read the height at time t (or, with atH, the time at height atH)
const hq = (c, { t, atH, w } = {}) => (atH === undefined
  ? [graphOf(c, { readX: t, w, rule: `h = −5t² + ${c}` }), `h = −5 × ${num(t)}² + ${c} = ${num(h(-5, c)(t))} m`]
  : [graphOf(c, { readY: atH, w: w || 40, rule: `h = −5t² + ${c}` }), `t = ${num(Math.sqrt((c - atH) / 5))} s (−5 × ${num(Math.sqrt((c - atH) / 5))}² + ${c} = ${atH})`]);
const L1 = ['Read h', 'Substitute', 'Check'], L3 = ['Read t', 'Substitute', 'Check'];
const notesFig = () => graphOf(20, { w: 30 });

module.exports = {
  code: '11.10', title: 'Parabolas in real life',
  li: 'use parabolas to model real situations, such as falling objects.',
  sc: ['read a height or a time from the graph of a model', 'substitute into the rule to check a value', 'find the start (t = 0) and when the object hits the ground (h = 0)'],
  notes: {
    terms: [['model', 'an equation that describes a real situation'], ['h-intercept', 'the starting height (t = 0)'], ['vertex', 'the highest or lowest point'],
      ['t-intercept', 'when the height is 0 (on the ground)'], ['sensible values', 'only times that make sense: t ≥ 0']],
    formulas: ['Falling object: h = −5t² + c (c = starting height)', 'Start: put t = 0', 'On the ground: put h = 0 and solve'],
    steps: ['find the marked value on the axis', 'go to the curve, then across (or down)', 'read the value', 'check by substituting'],
    fig: notesFig(),
  },
  easy: {
    ex: { stem: 'A stone is dropped from a cliff. Its height after t seconds is h = −5t² + 20 metres.', parts: [
      { t: 'Table', fig: table([['t', 0, 1, 2], ['h', '', '', '']], { w: 6, head: 6 }) }, { t: 'Graph', fig: graphOf(20, { w: 21 }) },
      'Find the height after 0.5 seconds.', 'When does the stone hit the ground?'] },
    exAns: ['h: 20, 15, 0', 'Plot (0, 20), (1, 15), (2, 0) and join with a smooth curve', `h = −5 × 0.5² + 20 = ${num(h(-5, 20)(0.5))} m`, '−5t² + 20 = 0, t² = 4, t = 2 seconds (t ≥ 0)'],
    hint: 'Go up from the marked time to the curve, then across to read the height · square t first, then × −5, then + c',
    work: true,
    rounds: [{ text: 'h = height (m), t = time (s). Go up from the ? to the curve, read h, then check.', cols: 2, ...formFig([hq(20, { t: 1 }), hq(45, { t: 2 })], true, L1) }],
  },
  drill: {
    hint: 'Read the scale on each axis first: each grid square may be 2, 5, 10 or 25 metres.',
    rounds: [
      { text: 'h = height (m), t = time (s). Go up from the ? to the curve, read h, then check.', cols: 2, ...formFig([hq(80, { t: 3 }), hq(45, { t: 1 })], true, L1) },
      { text: 'h = height (m), t = time (s). Go up from the ? to the curve, read h, then check.', cols: 2, ...formFig([hq(20, { t: 1.5 }), hq(80, { t: 2 })], true, L1) },
      { text: 'h = height (m), t = time (s). Go up from the ? to the curve, read h, then check.', cols: 2, ...formFig([hq(125, { t: 4 }), hq(45, { t: 2.5 })], true, L1) },
    ],
  },
  drill2: {
    hint: 'Now the height is marked: go across from it to the curve, then down to read the time.',
    rounds: [
      { text: 'h = height (m), t = time (s). Go across from the ? to the curve, read t, then check.', cols: 2, ...formFig([hq(80, { atH: 60 }), hq(45, { atH: 40 })], true, L3) },
      { text: 'h = height (m), t = time (s). Go across from the ? to the curve, read t, then check.', cols: 2, ...formFig([hq(125, { atH: 80 }), hq(20, { atH: 15 })], true, L3) },
      { text: 'h = height (m), t = time (s). Go across from the ? to the curve, read t, then check.', cols: 2, ...formFig([hq(45, { atH: 25 }), hq(125, { atH: 45 })], true, L3) },
    ],
  },
  medium: {
    ex: { stem: 'A ball is dropped from 80 m. Its height after t seconds is h = −5t² + 80 metres.', parts: [
      { t: 'Graph', fig: graphOf(80, { w: 21 }) }, 'Find the height after 2.5 seconds.', 'When is the ball 35 m above the ground?', 'How far does it fall in the first 2 seconds?'] },
    exAns: ['h: 80, 75, 60, 35, 0 (t = 0 to 4); join with a smooth curve', `h = −5 × 2.5² + 80 = ${num(h(-5, 80)(2.5))} m`, '−5t² + 80 = 35, t² = 9, t = 3 seconds', 'At t = 2, h = 60: it has fallen 80 − 60 = 20 m'],
    work: true, set: true,
    rounds: [set([
      mq('Read the height at ?.', hq(20, { t: 0.5 })[1], { fig: hq(20, { t: 0.5, w: 21 })[0], lines: L1 }),
      mq('Find the equation.', 'y = −x² + 2', { fig: std('small', { curves: [[(x) => -x * x + 2]], notes: [freeCorner('small', [], 'y = ?', [(x) => -x * x + 2])] }), from: '11.9', lines: ['Vertex', 'Concave', 'Equation'] }),
      mq('Read the height at ?.', hq(45, { t: 1.5 })[1], { fig: hq(45, { t: 1.5, w: 21 })[0], lines: L1 }),
      mq('Read the height at ?.', hq(80, { t: 1 })[1], { fig: hq(80, { t: 1, w: 21 })[0], lines: L1 }),
      mq('Find the equation.', 'm = −1, c = 3: y = −x + 3', { fig: lineAB(-1, 3, [-2, 5], [3, 0], { size: 'small', coords: false }), from: '11.6', lines: ['A and B', 'm and c', 'Equation'] }),
      mq('Read the height at ?.', hq(125, { t: 3 })[1], { fig: hq(125, { t: 3, w: 21 })[0], lines: L1 }),
    ])],
  },
  worded: [
    { q: 'A diver jumps from a 20 m cliff. Her height above the water after t seconds is h = −5t² + 20 metres. How long until she reaches the water? How high is she after 1.5 seconds?', a: `−5t² + 20 = 0, t² = 4, t = 2 s. h = −5 × 1.5² + 20 = ${num(h(-5, 20)(1.5))} m` },
    { q: 'A garden arch has h = −0.25d² + 4 (h = height, d = distance from the centre, in m). Find its height and width. Will a 3 m tall cart fit under it 1.8 m from the centre?', a: `Height 4 m; −0.25d² + 4 = 0, d = ±4, so 8 m wide. At d = 1.8: h = ${num(h(-0.25, 4)(1.8), 2)} m, which is more than 3 m, so yes` },
    { q: 'A square photo with side length s cm has area A = s² cm². A frame needs a photo with an area of 50 cm². Find the side length, correct to one decimal place.', a: `s² = 50, s = √50 = ${num(Math.sqrt(50), 1)} cm` },
  ],
};
