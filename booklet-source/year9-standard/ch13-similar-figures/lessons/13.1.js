// Lesson 13.1 Similar figures (three pages: Notes, Example 1 and Question 1; the Easy drill; Example 2, the Medium set
// and three worded problems). Every drill question is a pair of similar figures, the second often turned or flipped,
// with its vertices lettered: name the side that matches the measured one, then scale factor = image side ÷ original
// side. Questions 1 and 2 mark the matching sides (ticks) and angles (arcs); Question 3 puts both figures on a grid to
// count squares; Question 4 has no marks, so students write the similarity statement first. See ../chapter.js.
// Textbook 13.01 (Test Yourself 13, Questions 1 and 2).
const { sf, k, n, pw, ratio, parts, mq, set } = require('../helpers');
const { pair, onGrid, tri, parts: { FILL2 } } = require('../shapes');

const sideOf = (L, i) => `${L[i]}${L[(i + 1) % L.length]}`;
// Ticks on the first three sides (1, 2, 3) and arcs in the first three angles, on both figures
const marks = (A, o = {}) => ({ ticks: A.slice(0, 3).map((_, j) => [j, j + 1]), arcs: A.slice(0, 3).map((_, j) => [j, j + 1]).filter(([j]) => !(o.right || []).includes(j)) });
// One part: the original's vertices A, the scale factor kk, the letters [original, image] and the measured side i
// (length a); o: as pair()
const part = (A, kk, L, i, a, o = {}) => {
  const b = +(a * kk).toFixed(2);
  return [pair(A, kk, { L, sides: [[i, `${n(a)} cm`, `${n(b)} cm`]], ...marks(A, o), w: 54, h: 25, ...o }),
    `${sideOf(L[0], i)} matches ${sideOf(L[1], i)}; Scale factor = ${sf(b, a)}`, [`${sideOf(L[0], i)} matches`, 'Scale factor =']];
};
// Question 3: both figures on a grid (in squares; the image's vertices listed in the matching order)
const squares = (A, B, L, i, grid) => {
  const d = (P) => Math.hypot(P[(i + 1) % P.length][0] - P[i][0], P[(i + 1) % P.length][1] - P[i][1]);
  return [onGrid({ g: 4.2, ...grid, shapes: [{ pts: A, L: L[0] }, { pts: B, L: L[1], fill: FILL2 }] }),
    `${sideOf(L[0], i)} matches ${sideOf(L[1], i)} (${d(A)} and ${d(B)} squares); Scale factor = ${sf(d(B), d(A))}`, [`${sideOf(L[0], i)} matches`, 'Scale factor =']];
};
// Question 4 (less help): triangles with every side measured and no marks; the statement comes from matching the
// shortest, middle and longest sides
const said = (s, kk, L, o = {}) => {
  const img = s.map((x) => +(x * kk).toFixed(2)), j = s.indexOf(Math.min(...s));
  return [pair(tri(...s), kk, { L, sides: s.map((x, i) => [i, `${n(x)} cm`, `${n(img[i])} cm`]), w: 52, h: 24, ...o }),
    `${L[0].join('')} ||| ${L[1].join('')}; Scale factor = ${sf(img[j], s[j])}`, ['Statement', 'Scale factor =']];
};
const DO = 'Name the matching side. Then scale factor = image side ÷ original side.';

// Example 1: FECD ||| TRMP, the image half as big again and flipped (Test Yourself 13, Question 1)
const FE = [[0, 2], [2.4, 3], [4, 0], [0, 0]], FL = [[...'FECD'], [...'TRMP']], EK = 3 / 2;
const ex = (o) => pair(FE, EK, { L: FL, flip: true, w: 31, h: 15, gap: 6.5, size: 2.3, arcR: 1.5, ...o });
const pairs = (L, f) => L[0].map((_, i) => f(i)).join(', ');

module.exports = {
  code: '13.1', title: 'Similar figures',
  li: 'name the matching parts of similar figures and find the scale factor.',
  sc: ['name the matching sides and angles of similar figures', 'write a similarity statement with |||', 'find the scale factor: image side ÷ original side'],
  notes: {
    terms: [['similar', 'the same shape, any size'], ['matching', 'in the same place on both figures'], ['image', 'the new figure'],
      ['scale factor', 'how many times bigger'], ['enlargement', 'scale factor more than 1'], ['reduction', 'scale factor less than 1']],
    formulas: ['Scale factor = image side ÷ original side', 'ABC ||| PQR: A with P, B with Q, C with R', 'Matching angles are equal', 'Matching sides are in the same ratio'],
    steps: ['match the vertices', 'pick a pair of matching sides', 'image side ÷ original side', 'simplify the fraction'],
    fig: pair(tri(3, 4, 2.5), 2, { L: [[...'ABC'], [...'PQR']], ...marks([0, 1, 2]), w: 33, h: 15, size: 2.4, gap: 4, arcR: 1.6 }),
  },
  easy: {
    ex: { stem: 'The quadrilaterals FECD and TRMP are similar.', parts: [
      { t: 'List the matching sides.', fig: ex({ ticks: [[0, 1], [1, 2], [2, 3]] }) }, { t: 'List the matching angles.', fig: ex({ arcs: [[0, 1], [1, 2], [2, 3]], right: [3] }) },
      { t: 'Write the similarity statement.', fig: ex({ arcs: [[0, 1], [1, 2], [2, 3]], right: [3] }) },
      { t: 'Find the scale factor.', fig: ex({ sides: [[2, '4 cm', '6 cm']] }) }] },
    exAns: [pairs(FL, (i) => `${sideOf(FL[0], i)} and ${sideOf(FL[1], i)}`), pairs(FL, (i) => `∠${FL[0][i]} and ∠${FL[1][i]}`), `${FL[0].join('')} ||| ${FL[1].join('')}`,
      `CD matches MP; Scale factor = ${sf(6, 4)}`],
    hint: 'Matching sides have the same number of ticks · matching angles have the same number of arcs · simplify the scale factor',
    work: true,
    rounds: [parts(DO, [part(tri(3, 4, 2.5), 2, [[...'ABC'], [...'PQR']], 0, 3),
      part([[0, 0], [4, 0], [2.8, 2.2], [0, 2.2]], 2, [[...'ABCD'], [...'PQRS']], 0, 4, { right: [0, 3], turn: 180 })])],
  },
  drill: {
    hint: 'Turn or flip the second figure in your head until it sits like the first · count the squares along each side · no marks: shortest side with shortest side',
    rounds: [
      parts(DO, [part(tri(6, 4, 5), 1 / 2, [[...'ABC'], [...'MNL']], 2, 5, { turn: 180 }), part(tri(4, 4.5, 3), 3 / 2, [[...'ABC'], [...'FDE']], 0, 4, { flip: true })]),
      parts('Count the squares along each side. Name the matching side, then the scale factor.', [
        squares([[1, 1], [1, 4], [3, 1]], [[5, 5], [11, 5], [5, 1]], [[...'ABC'], [...'PQR']], 0, { cols: 12, rows: 6 }),
        squares([[1, 1], [7, 1], [7, 5], [1, 5]], [[12, 3], [9, 3], [9, 1], [12, 1]], [[...'ABCD'], [...'RSPQ']], 1, { cols: 13, rows: 6 })]),
      parts('No marks: match shortest, middle and longest sides. Write the statement, then the scale factor.', [
        said([4, 6, 5], 3 / 2, [[...'ABC'], [...'YZX']], { flip: true }), said([6, 10, 8], 1 / 2, [[...'ABC'], [...'NLM']], { turn: 90 })]),
    ],
  },
  medium: {
    ex: { stem: 'Triangle ABC: AB = 6, BC = 9, CA = 12 cm. Triangle XYZ: XY = 8, YZ = 4, ZX = 6 cm.', parts: [
      'List the matching sides, shortest to longest.', 'Write the similarity statement.', 'Find the scale factor. Enlargement or reduction?', 'Which angle matches ∠B?'] },
    exAns: ['AB and YZ (6 and 4), BC and ZX (9 and 6), CA and XY (12 and 8)', 'ABC ||| YZX', `Scale factor = ${sf(4, 6)}: a reduction (less than 1)`, '∠B matches ∠Z'],
    hint: 'Shortest with shortest, longest with longest · the statement lists matching vertices in the same order · less than 1: a reduction',
    work: true, set: true,
    rounds: [set([
      mq('Write the similarity statement.', 'ABC ||| RPQ', { fig: pair(tri(4, 3, 3.5), 3 / 2, { L: [[...'ABC'], [...'RPQ']], ...marks([0, 1, 2]), turn: 180, w: 24, h: 10, size: 2.3, arcR: 1.4, gap: 5 }), lines: ['Statement'] }),
      mq('Simplify the ratio 12 : 18.', `12 : 18 = ${ratio(12, 18)}`, { form: false, from: 'Yr 8' }),
      mq('Find the scale factor.', `Scale factor = ${sf(7.5, 5)}`, { fig: pair([[0, 0], [5, 0], [5, 3], [0, 3]], 3 / 2, { sides: [[0, '5 cm', '7.5 cm']], w: 24, h: 10, size: 2.3, gap: 5 }), lines: ['Scale factor ='] }),
      mq('PQR ||| XYZ: match side QR and ∠P.', 'QR matches YZ; ∠P matches ∠X', { lines: ['QR matches', '∠P matches'] }),
      mq('A die is rolled. Find P(less than 3).', `P(less than 3) = ${pw(2, 6)}`, { form: false, from: '12.1' }),
      mq('Scale factor? Enlargement or reduction?', `Scale factor = ${sf(4, 6)}: a reduction`, { fig: pair(tri(6, 4.5, 3.5), 2 / 3, { sides: [[0, '6 cm', '4 cm']], flip: true, w: 24, h: 10, size: 2.3, gap: 5 }), lines: ['Scale factor =', 'Type'] }),
    ])],
  },
  worded: [
    { q: 'Triangle ABC has sides AB = 6 cm, BC = 8 cm and CA = 10 cm. Triangle KLM has sides KL = 9 cm, LM = 12 cm and MK = 15 cm. Write the similarity statement and find the scale factor.',
      a: `AB and KL, BC and LM, CA and MK: ABC ||| KLM; Scale factor = ${sf(9, 6)} (also ${sf(12, 8)})` },
    { q: 'A drawing of a car is 12 cm long. The real car is 4.2 m long. Find the scale factor from the drawing to the real car. (Change 4.2 m to cm first.)',
      a: `4.2 m = 420 cm; Scale factor = ${sf(420, 12)}` },
    { q: 'Are all squares similar? Are all rectangles similar? Explain, using a 1 cm by 2 cm rectangle and a 2 cm by 3 cm rectangle.',
      a: `All squares are similar: every angle is 90° and every side is enlarged by the same scale factor. Not all rectangles: ${n(2)} ÷ ${n(1)} = ${k(2, 1)} but ${n(3)} ÷ ${n(2)} = ${k(3, 2)}, so the sides are not in the same ratio` },
  ],
};
