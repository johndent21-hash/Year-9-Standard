// Lesson 13.4 Shadows and scale drawings (three pages: Notes, Example 1 and Question 1; the Easy drill; Example 2, the
// Medium set and three worded problems). Every drill question is a small known object beside a large one, found by
// similar triangles or a scale: the scale factor (large shadow ÷ small shadow, or the scale of the plan or map), then
// the real length with its unit, changed from cm to m (or km). Questions 1 and 2 are shadows (a stick and a pole, a
// person and a tree); Question 3 is a floor plan and a map with the plan lengths printed; Question 4 (less help) is the
// shadow problem in words, for students to draw. Real lengths have their own letters: h for a height, d for a distance.
// See ../chapter.js. Textbook 13.03 (Test Yourself 13, Questions 6 and 7).
const { sf, n, up, len, pw, parts, mq, set } = require('../helpers');
const { shadow, ground, plan, map } = require('../shapes');

// A length [value, unit] as a label and in cm
const lab = ([v, u]) => `${n(v)} ${u}`;
const cm = ([v, u]) => (u === 'm' ? v * 100 : v);
// The shadow working: the small object's height and shadow and the large one's shadow, each [value, unit]. Mixed units
// are all changed to cm first, and a height of 100 cm or more is changed back to m.
const shade = (hs, ss, S) => {
  const mixed = new Set([hs[1], ss[1], S[1]]).size > 1, c = (x) => (mixed ? cm(x) : x[0]), u = mixed ? 'cm' : S[1], h = (c(hs) * c(S)) / c(ss);
  const conv = mixed ? [hs, ss, S].filter((x) => x[1] === 'm').map((x) => `${n(x[0])} m = ${n(x[0] * 100)} cm; `).join('') : '';
  return `${conv}Scale factor = ${sf(c(S), c(ss))}; h = ${up(c(hs), c(S), c(ss), u)}${mixed && h >= 100 ? ` = ${len(h / 100, 'm')}` : ''}`;
};
// A real length from a plan or map length v (cm) at the scale 1 : sc, in m (or km)
const real = (name, v, sc, km) => { const c = v * sc; return `${name} = ${n(v)} × ${n(sc)} = ${len(c, 'cm')} = ${len(c / 100, 'm')}${km ? ` = ${len(c / 100000, 'km')}` : ''}`; };
// One shadow part: the large and small objects, the small one's height, its shadow and the large one's shadow
const part = ([big, small], hs, ss, S, o = {}) => [shadow({ big, small, h: ['h', lab(hs)], s: [lab(S), lab(ss)], H: 24, ...o }), shade(hs, ss, S), ['Scale factor =', 'h =']];
// Question 3: a floor plan (AB printed) and a map (the distance d printed)
const HOUSE = [[0, 0], [6, 0], [6, 2.5], [4, 2.5], [4, 4], [0, 4]];
const onPlan = (v, sc) => [plan(HOUSE, { L: ['', '', '', '', 'B', 'A'], sides: [[4, `${n(v)} cm`]], scale: sc, w: 40, h: 24 }), `Scale factor = ${n(sc)}; ${real('AB', v, sc)}`, ['Scale factor =', 'AB =']];
const onMap = (v, sc, names) => [map({ names, label: `${n(v)} cm`, scale: sc, w: 46, rise: 12 }), `Scale factor = ${n(sc)}; ${real('d', v, sc, sc * v >= 100000)}`, ['Scale factor =', 'd =']];
// Question 4 (less help): the shadows in words, drawn by the students on the ground under the sun
const said = (hs, ss, S, t) => [ground(42, 30), shade(hs, ss, S), ['Scale factor =', 'h ='], t];
const DO = 'Scale factor = large shadow ÷ small shadow (same units). Then find h.';
// Example 2's plan: Test Yourself 13, Question 7 (scale 1 : 200)
const TY = [[0, 5], [6, 5], [6, 3], [2, 3], [2, 0], [0, 0]];

module.exports = {
  code: '13.4', title: 'Shadows and scale drawings',
  li: 'use shadows, scale drawings and maps to find real heights and lengths.',
  sc: ['find the scale factor from two shadows', 'find a real height from its shadow', 'use a scale like 1 : 200 to find real lengths'],
  notes: {
    terms: [['shadows', 'the sun makes similar triangles'], ['scale 1 : 200', '1 cm on the plan is 200 cm'], ['plan', 'a scale drawing from above'],
      ['scale factor', 'large ÷ small, or real ÷ plan'], ['units', 'make them the same first'], ['h, d', 'a height, a distance']],
    formulas: ['Scale factor = large shadow ÷ small shadow', 'h = small height × scale factor', 'Real length = plan length × scale', '100 cm = 1 m · 1000 m = 1 km'],
    steps: ['change to the same units', 'find the scale factor', 'multiply the known length', 'change cm to m (or km)'],
    fig: shadow({ h: ['h', '1 m'], s: ['6 m', '1.5 m'], H: 15, slope: 1.2 }),
  },
  easy: {
    ex: { stem: 'Find each real height or length. Change cm to m.', parts: [
      { t: 'The pole’s height h', fig: shadow({ h: ['h', '1 m'], s: ['14 m', '2 m'], H: 11, slope: 1.2 }) },
      { t: 'The tree’s height h', fig: shadow({ big: 'tree', small: 'person', h: ['h', '1.8 m'], s: ['6 m', '1.2 m'], H: 11, slope: 0.95 }) },
      { t: 'AB, scale 1 : 100', fig: plan(HOUSE, { L: ['', '', '', '', 'B', 'A'], sides: [[4, '5.5 cm']], scale: 100, w: 24, h: 13 }) },
      { t: 'd, scale 1 : 25 000', fig: map({ names: ['P', 'Q'], label: '8 cm', scale: 25000, w: 24, rise: 7 }) }] },
    exAns: [shade([1, 'm'], [2, 'm'], [14, 'm']), shade([1.8, 'm'], [1.2, 'm'], [6, 'm']), `Scale factor = 100; ${real('AB', 5.5, 100)}`, `Scale factor = ${n(25000)}; ${real('d', 8, 25000, true)}`],
    hint: 'Scale factor = large shadow ÷ small shadow · use the same units: 1 m = 100 cm · a scale 1 : 200 means real = plan × 200',
    work: true,
    rounds: [parts(DO, [part(['pole', 'stick'], [50, 'cm'], [80, 'cm'], [8, 'm']), part(['pole', 'stick'], [1, 'm'], [1.5, 'm'], [12, 'm'])])],
  },
  drill: {
    hint: 'Change every length to cm first if the units are mixed · the tall object’s shadow ÷ the small one’s shadow · real length = plan length × the scale',
    rounds: [
      parts(DO, [part(['tree', 'person'], [1.5, 'm'], [2, 'm'], [10, 'm'], { H: 22 }), part(['tree', 'person'], [160, 'cm'], [2, 'm'], [9, 'm'], { H: 22 })]),
      parts('Scale 1 : 200 means scale factor 200. Real length = plan length × scale factor, in m.', [
        onPlan(4, 200), onMap(6, 5000, ['Ayton', 'Beeville'])]),
      parts('Draw the two shadows. Then find the scale factor and h.', [
        said([2, 'm'], [3, 'm'], [24, 'm'], 'A post 2 m tall has a shadow 3 m long. A building’s shadow is 24 m long. Find its height h.'),
        said([1.2, 'm'], [80, 'cm'], [6, 'm'], 'A girl 1.2 m tall has a shadow 80 cm long. A tree’s shadow is 6 m long. Find its height h.')]),
    ],
  },
  medium: {
    ex: { stem: 'This floor plan is drawn to a scale of 1 : 200.', parts: [
      { t: 'Find the real length AB.', fig: plan(TY, { L: [...'ABCDEF'], sides: [[0, '6 cm'], [2, '4 cm']], w: 24, h: 15 }) }, 'Find the real length CD.',
      'A wall is 9 m long. How long is it on the plan?', 'A door is 0.8 m wide. How wide is it on the plan?'] },
    exAns: [real('AB', 6, 200), real('CD', 4, 200), `9 m = 900 cm; 900 ÷ 200 = ${len(900 / 200, 'cm')}`, `0.8 m = 80 cm; 80 ÷ 200 = ${len(80 / 200, 'cm')}`],
    hint: 'Real = plan × 200 · plan = real ÷ 200 · change m to cm first: 1 m = 100 cm',
    work: true, set: true,
    rounds: [set([
      mq('Find the pole’s height h.', shade([1, 'm'], [1.6, 'm'], [8, 'm']), { fig: shadow({ h: ['h', '1 m'], s: ['8 m', '1.6 m'], H: 9, slope: 1.25 }), lines: ['Scale factor =', 'h ='] }),
      mq('Divide 60 in the ratio 1 : 4.', `1 + 4 = 5 parts; 60 ÷ 5 = ${60 / 5}; ${60 / 5} and ${4 * 60 / 5}`, { form: false, from: 'Yr 8' }),
      mq('Map 1 : 50 000. Find d for 3 cm.', real('d', 3, 50000, true), { lines: ['d ='] }),
      mq('Find the real length AB.', `Scale factor = 50; ${real('AB', 7, 50)}`, { fig: plan([[0, 0], [7, 0], [7, 3], [0, 3]], { L: ['', '', 'B', 'A'], sides: [[2, '7 cm']], scale: 50, w: 16, h: 6 }), lines: ['Scale factor =', 'AB ='] }),
      mq('Two coins: find P(at least one head).', `HH, HT, TH, TT: P(at least one head) = ${pw(3, 4)}`, { form: false, from: '12.4' }),
      mq('Plan 1 : 200: how long is a 9 m wall?', `9 m = 900 cm; 900 ÷ 200 = ${len(900 / 200, 'cm')}`, { lines: ['Plan length'] }),
    ])],
  },
  worded: [
    { q: 'A flagpole’s shadow is 20 m long. At the same time, a stick 60 cm tall casts a shadow 150 cm long. Draw a diagram and find the height h of the flagpole.',
      a: shade([60, 'cm'], [150, 'cm'], [20, 'm']) },
    { q: 'A model plane is built to a scale of 1 : 48. The model is 35 cm long. How long is the real plane, in metres?',
      a: `Real length = 35 × 48 = ${len(35 * 48, 'cm')} = ${len(35 * 48 / 100, 'm')}` },
    { q: 'On a map with a scale of 1 : 25 000, two towns are 18 cm apart. Find the real distance d between the towns, in km.',
      a: real('d', 18, 25000, true) },
  ],
};
