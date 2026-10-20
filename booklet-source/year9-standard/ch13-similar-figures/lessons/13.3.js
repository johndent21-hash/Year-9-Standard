// Lesson 13.3 Finding unknown sides (three pages: Notes, Example 1 and Question 1; the Easy drill; Example 2, the Medium
// set and three worded problems). Every drill question is a pair of similar figures with one pair of matching sides
// measured and one unknown side x: the scale factor (image side ÷ original side), then x (× the scale factor on the
// image, ÷ it on the original). Ticks mark the matching sides; in Question 4 (less help) they are not marked and the
// similarity statement matches them. Testing for similarity is Example 2 and the Medium set. See ../chapter.js.
// Textbook 13.02 (Test Yourself 13, Questions 4 and 5).
const { sf, n, up, down, ratio, pw, parts, mq, set } = require('../helpers');
const { pair, tri } = require('../shapes');

const rect = (w, h) => [[0, 0], [w, 0], [w, h], [0, h]];
// One part: the original's vertices A and its side lengths s, the image kk times as big. The matching sides i are
// measured on both; x is side j of the image (on = 1) or of the original (on = 0). o: as pair()
const part = (A, s, kk, i, j, on, o = {}) => {
  const img = s.map((v) => +(v * kk).toFixed(2)), cm = (v) => `${n(v)} cm`;
  const sides = [[i, cm(s[i]), cm(img[i])], [j, on ? cm(s[j]) : 'x cm', on ? 'x cm' : cm(img[j])]];
  const fig = pair(A, kk, { sides, ticks: A.slice(0, 3).map((_, m) => [m, m + 1]), w: 54, h: 25, ...o });
  return [fig, `Scale factor = ${sf(img[i], s[i])}; x = ${on ? up(s[j], img[i], s[i], 'cm') : down(img[j], img[i], s[i], 'cm')}`, ['Scale factor =', 'x =']];
};
// Question 4 (less help): no ticks; the statement (words) matches the sides
const said = (s, kk, L, i, j, on, o = {}) => { const [fig, a, lines] = part(tri(...s), s, kk, i, j, on, { L, ticks: [], w: 38, h: 22, ...o });
  return [fig, a, lines, `${L[0].join('')} ||| ${L[1].join('')}`]; };
// A test for similarity: each pair [original, image] as a ratio
const test = (P) => { const r = P.map(([a, b]) => b / a), same = r.every((x) => Math.abs(x - r[0]) < 1e-9);
  return `${P.map(([a, b]) => `${n(b)} ÷ ${n(a)} = ${n(b / a)}`).join(', ')}: ${same ? 'all equal, so similar' : 'not all equal, so not similar'}`; };
const DO = 'Scale factor = image side ÷ original side. Then find x.';
const ex = (A, s, kk, i, j, on, o) => part(A, s, kk, i, j, on, { w: 31, h: 15, gap: 6, size: 2.3, ...o });
const EX = [ex(tri(3, 4, 2.5), [3, 4, 2.5], 2, 0, 1, 1), ex(rect(4, 2), [4, 2, 4, 2], 2, 3, 0, 1, { flip: true, ticks: [[0, 1], [3, 2]], w: 21 }), ex(tri(5, 4, 3.5), [5, 4, 3.5], 2, 0, 1, 0),
  ex(tri(4, 5, 3), [4, 5, 3], 3 / 2, 0, 1, 1, { turn: 180 })];

module.exports = {
  code: '13.3', title: 'Finding unknown sides',
  li: 'find unknown sides of similar figures and test whether figures are similar.',
  sc: ['find the scale factor from a pair of matching sides', 'find an unknown side of similar figures', 'test whether two figures are similar'],
  notes: {
    terms: [['similar', 'matching sides in the same ratio'], ['unknown side', 'the side marked x'], ['scale factor', 'image side ÷ original side'],
      ['matching sides', 'same ticks, or same order'], ['ratio', 'one length ÷ another'], ['test', 'are all the ratios equal?']],
    formulas: ['Scale factor = image ÷ original', 'Image side = original × scale factor', 'Original side = image ÷ scale factor', 'Similar: all the ratios are equal'],
    steps: ['find a measured matching pair', 'scale factor = image ÷ original', 'find the side matching x', '× or ÷ by the scale factor'],
    fig: part(tri(3, 4, 2.5), [3, 4, 2.5], 2, 0, 1, 1, { w: 33, h: 15, gap: 4, size: 2.4 })[0],
  },
  easy: {
    ex: { stem: 'Each pair of figures is similar. Find the scale factor, then x.', parts: [
      { t: 'x on the image', fig: EX[0][0] }, { t: 'Rectangles', fig: EX[1][0] }, { t: 'x on the original', fig: EX[2][0] }, { t: 'A fraction scale factor', fig: EX[3][0] }] },
    exAns: EX.map((x) => x[1]),
    hint: 'Scale factor = image side ÷ original side · x on the image: × the scale factor · x on the original: ÷ the scale factor',
    work: true,
    rounds: [parts(DO, [part(tri(3, 5, 4), [3, 5, 4], 2, 0, 1, 1), part(rect(5, 2), [5, 2, 5, 2], 3, 3, 0, 1, { flip: true, ticks: [[0, 1], [3, 2]] })])],
  },
  drill: {
    hint: 'Use the pair of matching sides with both lengths for the scale factor · then find the side that matches x · check: is x bigger or smaller?',
    rounds: [
      parts(DO, [part(tri(4, 7, 6), [4, 7, 6], 3 / 2, 0, 2, 1, { flip: true }), part(tri(6, 8, 5), [6, 8, 5], 2, 1, 0, 0, { turn: 180 })]),
      parts(DO, [part(tri(10, 8, 6), [10, 8, 6], 1 / 2, 0, 1, 1, { turn: 90 }),
        part([[0, 0], [4, 0], [3, 2], [0, 2]], [4, 0, 3, 2], 5 / 2, 3, 2, 1, { flip: true, ticks: [[0, 1], [2, 2], [3, 3]], right: [0, 3] })]),
      parts('The sides are not marked: use the statement to match them. Find the scale factor, then x.', [
        said([6, 4, 5], 3 / 2, [[...'ABC'], [...'QRP']], 0, 1, 1, { turn: 90 }), said([8, 6, 7], 1 / 2, [[...'ABC'], [...'NLM']], 2, 0, 0, { turn: 90 })]),
    ],
  },
  medium: {
    ex: { stem: 'Test whether each pair is similar, then find the unknown sides.', parts: [
      'Rectangles 20 mm by 12 mm and 29 mm by 18 mm.', 'Triangles with sides 8, 7, 10 cm and 6, 7.5, 5.25 cm.',
      'ABC ||| DEF, AB = 8 cm, BC = 12 cm, DE = 6 cm. Find EF.', 'In the same triangles, DF = 7.5 cm. Find AC.'] },
    exAns: [test([[20, 29], [12, 18]]), `In order of size: ${test([[7, 5.25], [8, 6], [10, 7.5]])} (scale factor ${sf(6, 8)})`,
      `Scale factor = ${sf(6, 8)}; EF = ${up(12, 6, 8, 'cm')}`, `AC = ${down(7.5, 6, 8, 'cm')}`],
    hint: 'Similar: every image side ÷ original side gives the same number · put the sides in order of size first · × or ÷ by the scale factor',
    work: true, set: true,
    rounds: [set([
      mq('Are the rectangles similar?', test([[6, 9], [4, 6]]), { fig: pair(rect(6, 4), 3 / 2, { sides: [[0, '6 cm', '9 cm'], [3, '4 cm', '6 cm']], flip: true, w: 19, h: 10, size: 2.3, gap: 5 }), lines: ['Ratios', 'Similar?'] }),
      mq('Simplify the ratio 45 : 60.', `45 : 60 = ${ratio(45, 60)}`, { form: false, from: 'Yr 8' }),
      mq('Find x.', part(tri(5, 6, 4), [5, 6, 4], 2, 0, 2, 1)[1], { fig: part(tri(5, 6, 4), [5, 6, 4], 2, 0, 2, 1, { flip: true, w: 15, h: 10, size: 2.3, gap: 5 })[0], lines: ['Scale factor =', 'x ='] }),
      mq('Similar? Sides 3, 4, 5 cm and 6, 8, 9 cm.', test([[3, 6], [4, 8], [5, 9]]), { lines: ['Ratios', 'Similar?'] }),
      mq('28 heads in 50 tosses. Observed P(head)?', `Observed P(head) = ${pw(28, 50)}`, { form: false, from: '12.2' }),
      mq('ABC ||| DEF, AB = 4, DE = 10, BC = 6: EF?', `Scale factor = ${sf(10, 4)}; EF = ${up(6, 10, 4, 'cm')}`, { lines: ['Scale factor =', 'EF ='] }),
    ])],
  },
  worded: [
    { q: 'A rectangle 8 cm long and 5 cm wide is similar to a rectangle 20 cm long. Find the width of the larger rectangle.',
      a: `Scale factor = ${sf(20, 8)}; width = ${up(5, 20, 8, 'cm')}` },
    { q: 'Two triangles are similar. The smaller has sides 6 cm, 8 cm and 10 cm. The longest side of the larger is 25 cm. Find its other two sides.',
      a: `Scale factor = ${sf(25, 10)}; ${up(6, 25, 10, 'cm')}, ${up(8, 25, 10, 'cm')}` },
    { q: 'A TV screen is 80 cm wide and 45 cm high. A phone screen is 16 cm wide and 9 cm high. Are the screens similar? Show why.',
      a: `${sf(16, 80)} and ${sf(9, 45)}: the same scale factor, so the screens are similar` },
  ],
};
