// Lesson 13.2 Enlargements (three pages: Notes, Example 1 and Question 1; the Easy drill; Example 2, the Medium set and
// three worded problems). Every drill question is a shape on a grid with a scale factor (2, 3 or 1/2): write the
// shape's lengths and the image's lengths, in squares, then draw the image in the empty part of the same grid.
// Questions 1 to 3 are rectangles, right-angled triangles and L-shapes; Question 4 (less help) is an irregular shape at
// scale factor 1/2 with only the image's lengths to write. See ../chapter.js.
// Textbook 13.01 (Test Yourself 13, Question 3).
const { k, sf, n, len, pw, parts, mq, set } = require('../helpers');
const { toDraw, onGrid, parts: { FILL2 } } = require('../shapes');

const rect = (w, h) => [[0, 0], [w, 0], [w, h], [0, h]];
const right = (b, h) => [[0, 0], [b, 0], [b, h]];
const ell = (w, h, a) => [[0, 0], [w, 0], [w, a], [a, a], [a, h], [0, h]]; // an L: w across, h up, the arms a wide
const cap = (kk) => `Scale factor ${k(...(kk < 1 ? [1, 1 / kk] : [kk, 1]))}`;
// The lengths going round from the bottom left corner (a slanted side as its run and rise)
const round = (P, kk = 1) => P.map((p, i) => { const q = P[(i + 1) % P.length], dx = (q[0] - p[0]) * kk, dy = (q[1] - p[1]) * kk;
  return dx && dy ? `slanted ${n(Math.abs(dx))} across and ${n(Math.abs(dy))} ${dy > 0 ? 'up' : 'down'}` : n(Math.abs(dx || dy)); }).join(', ');
// How each kind of shape's lengths are written: a rectangle 3 by 2, a triangle base 3, height 2, anything else round
const say = { rect: (P, kk) => `${n(P[2][0] * kk)} by ${n(P[2][1] * kk)}`, right: (P, kk) => `base ${n(P[1][0] * kk)}, height ${n(P[2][1] * kk)}`, round: (P, kk) => round(P, kk) };
// One part: the shape (in squares) to enlarge by kk on a grid with g mm squares
const part = (kind, P, kk, g) => [toDraw(P, kk, { g, cap: cap(kk) }), `Original lengths: ${say[kind](P, 1)}; Image lengths: ${say[kind](P, kk)} (squares)`, ['Original lengths', 'Image lengths']];
// Question 4 (less help): only the image's lengths
const said = (P, kk, g) => [toDraw(P, kk, { g, cap: cap(kk) }), `Image lengths: ${round(P, kk)} (squares, going round from the bottom left)`, ['Image lengths']];
const DO = 'Count each side in squares. Multiply by the scale factor. Draw the image on the grid.';
// Example 1's grids (small squares) and the Medium set's: a shape and its image both drawn, to find the scale factor
const ex = (P, kk) => toDraw(P, kk, { g: 3 });
const both = (A, B, cols, rows) => onGrid({ g: 2.6, cols, rows, shapes: [{ pts: A }, { pts: B, fill: FILL2 }] });

module.exports = {
  code: '13.2', title: 'Enlargements',
  li: 'draw enlargements and reductions on a grid.',
  sc: ['count the lengths of a shape on a grid', 'multiply every length by the scale factor', 'draw the image of a shape on a grid'],
  notes: {
    terms: [['enlargement', 'every length × the same number'], ['reduction', 'an enlargement that is smaller'], ['scale factor', 'the number every length is × by'],
      ['image', 'the shape after enlarging'], ['grid square', 'one unit of length'], ['angles', 'stay the same']],
    formulas: ['Image length = original length × scale factor', 'Scale factor 2: every length doubles', 'Scale factor 1/2: every length halves', 'The angles do not change'],
    steps: ['count each side in squares', 'multiply by the scale factor', 'draw the image side by side', 'check the angles match'],
    fig: both(ell(2, 2, 1).map(([x, y]) => [x + 1, y + 1]), ell(4, 4, 2).map(([x, y]) => [x + 4, y + 1]), 9, 6),
  },
  easy: {
    ex: { stem: 'Write the lengths of each shape and of its image. Then draw the image.', parts: [
      { t: 'Scale factor 2', fig: ex(rect(2, 1), 2) }, { t: 'Scale factor 3', fig: ex(right(2, 1), 3) },
      { t: 'Scale factor 1/2', fig: ex(rect(4, 2), 1 / 2) }, { t: 'Scale factor 2', fig: ex(ell(2, 2, 1), 2) }] },
    exAns: [`2 by 1; image ${say.rect(rect(2, 1), 2)} squares`, `base 2, height 1; image ${say.right(right(2, 1), 3)} squares`, `4 by 2; image ${say.rect(rect(4, 2), 1 / 2)} squares`,
      `${round(ell(2, 2, 1))}; image ${round(ell(2, 2, 1), 2)} squares (going round from the bottom left)`],
    hint: 'Image length = original length × scale factor · scale factor 1/2: halve every length · the angles stay the same',
    work: true,
    rounds: [parts(DO, [part('rect', rect(3, 2), 2, 5.5), part('rect', rect(2, 1), 3, 5.5)])],
  },
  drill: {
    hint: 'Count every side, going round · multiply each one by the scale factor · draw the image in the empty part of the grid',
    rounds: [
      parts(DO, [part('right', right(3, 2), 2, 5.5), part('right', right(6, 4), 1 / 2, 5.5)]),
      parts(DO, [part('round', ell(2, 2, 1), 3, 4), part('round', ell(4, 4, 2), 1 / 2, 4)]),
      parts('Halve every length. Write the image’s lengths, then draw the image on the grid.', [
        said([[0, 0], [6, 0], [6, 4], [4, 6], [2, 6], [2, 4], [0, 4]], 1 / 2, 4), said([[0, 0], [4, 0], [4, 2], [6, 2], [6, 6], [2, 6], [0, 4]], 1 / 2, 4)]),
    ],
  },
  medium: {
    ex: { stem: 'A rectangle is 4 cm long and 6 cm wide. It is enlarged.', parts: [
      'Find the image’s lengths for scale factor 3.', 'Find the image’s lengths for scale factor 1/2.', 'Find the image’s lengths for scale factor 2.5.',
      'Another image is 6 cm by 9 cm. Find its scale factor.'] },
    exAns: [`4 × 3 = ${len(12, 'cm')}, 6 × 3 = ${len(18, 'cm')}`, `4 × 1/2 = ${len(2, 'cm')}, 6 × 1/2 = ${len(3, 'cm')}`, `4 × 2.5 = ${len(10, 'cm')}, 6 × 2.5 = ${len(15, 'cm')}`,
      `Scale factor = ${sf(6, 4)} (also ${sf(9, 6)})`],
    hint: 'Image length = original length × scale factor · scale factor less than 1: a reduction · scale factor = image ÷ original',
    work: true, set: true,
    rounds: [set([
      mq('Scale factor 3: write the image lengths.', `${say.rect(rect(2, 1), 3)} squares`, { fig: toDraw(rect(2, 1), 3, { g: 2.4 }), lines: ['Image lengths'] }),
      mq('Divide $40 in the ratio 3 : 5.', `3 + 5 = 8 parts; $40 ÷ 8 = $${40 / 8}; $${3 * 40 / 8} and $${5 * 40 / 8}`, { form: false, from: 'Yr 8' }),
      mq('A 4 cm by 6 cm photo: scale factor 2.5.', `${len(4 * 2.5, 'cm')} by ${len(6 * 2.5, 'cm')}`, { lines: ['Image lengths'] }),
      mq('Find the scale factor.', `Scale factor = ${sf(2, 4)}`, { fig: both([[1, 1], [5, 1], [1, 3]], [[7, 1], [9, 1], [7, 2]], 10, 4), lines: ['Scale factor ='] }),
      mq('A coin is tossed twice. Find P(two heads).', `HH, HT, TH, TT: P(two heads) = ${pw(1, 4)}`, { form: false, from: '12.4' }),
      mq('Sides 3, 4, 5 cm; scale factor 1/2.', [3, 4, 5].map((s) => len(s / 2, 'cm')).join(', '), { lines: ['Image sides'] }),
    ])],
  },
  worded: [
    { q: 'A photo 12 cm long and 8 cm wide is enlarged by a scale factor of 3. What are the length and width of the enlarged photo?',
      a: `12 × 3 = ${len(36, 'cm')}, 8 × 3 = ${len(24, 'cm')}: ${len(36, 'cm')} by ${len(24, 'cm')}` },
    { q: 'A model car is a reduction of a real car with scale factor 1/20. The real car is 4.2 m long. How long is the model, in cm?',
      a: `4.2 m = 420 cm; 420 × 1/20 = ${len(420 / 20, 'cm')}` },
    { q: 'A square with sides of 3 cm is enlarged by a scale factor of 2. Draw both squares. How many times larger is the area of the image?',
      a: `Original area 3 × 3 = 9 cm²; image 6 × 6 = 36 cm²; 36 ÷ 9 = ${36 / 9} times` },
  ],
};
