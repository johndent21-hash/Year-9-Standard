// Lesson 11.7 Solving linear equations graphically (four pages; see ../chapter.js). Every drill question is the same: a
// line on a number plane with its equation, and the dashed line y = k (drawn on pages 1 and 2; drawn by the students on
// page 3): read x where they meet. The Medium set: two lines, read where they cross. Textbook 11.07.
const { n, eq, formFig, mq, set } = require('../helpers');
const { std, lineAB, freeCorner, lineTagAt, SIZE, graph } = require('../shapes');

const sol = (m, c, k) => (k - c) / m;
const lhs = (m, c) => eq(m, c).replace('y = ', '');
// Each line's equation beside the line itself (tags): the sloping line near its right end, y = k near its left end
const tagFor = (size, m, c, text, side = 1) => [lineTagAt(m, c, SIZE[size].R, side), text];
// One question: y = mx + c (and y = k, dashed, unless the students draw it), x where they meet asked
const sq = (m, c, k, { size = 'big', drawK = true, label = true } = {}) => {
  const tags = [tagFor(size, m, c, eq(m, c)), ...(drawK ? [[[-SIZE[size].R + 0.6, -SIZE[size].R + 2, -SIZE[size].R + 4].map((x) => [x, k]), `y = ${n(k)}`]] : [])];
  return [std(size, { lines: [[{ m, c }], ...(drawK ? [[{ y: k, dash: true }]] : [])], tags: label ? tags : [] }), `x = ${n(sol(m, c, k))} (${lhs(m, c)} = ${n(k)})`, drawK ? '' : `${lhs(m, c)} = ${n(k)}`];
};
// Two lines: the point where they cross asked
const cross = (l1, l2, size = 'small', label = true) => {
  const X = (l2[1] - l1[1]) / (l1[0] - l2[0]), Y = l1[0] * X + l1[1];
  return [std(size, { lines: [[{ m: l1[0], c: l1[1] }], [{ m: l2[0], c: l2[1] }]], tags: label ? [tagFor(size, ...l1, eq(...l1), 1), tagFor(size, ...l2, eq(...l2), -1)] : [] }), `(${n(X)}, ${n(Y)})`];
};
const L1 = ['Read x', 'Check', 'Answer'], L3 = ['Draw y =', 'Read x', 'Check'];
const notesFig = () => graph({ x: [-1, 4], y: [-4, 6], k: 3, lines: [[{ m: 3, c: -4 }, 'y = 3x − 4', 1.2, 'w'], [{ y: 5 }, 'y = 5', 0.2, 'n']], pts: [[3, 5, '(3, 5)', 'e']] });

module.exports = {
  code: '11.7', title: 'Solving linear equations graphically',
  li: 'solve linear equations by reading a straight-line graph.',
  sc: ['use the graph of y = mx + c to solve mx + c = k', 'draw the line y = k and read x where the lines meet', 'check a graphical solution by substituting'],
  notes: {
    terms: [['solution', 'the value of x that makes the equation true'], ['point of intersection', 'where two lines cross'], ['y = k', 'a horizontal line at height k']],
    formulas: ['Solve 3x − 4 = 5: graph y = 3x − 4 and y = 5; read x where they meet', 'Two lines: the solution is the crossing point (x, y)', 'Check: substitute x into the equation'],
    steps: ['graph y = mx + c', 'draw the line y = k', 'read x where they meet', 'check by substituting'],
    fig: notesFig(),
  },
  easy: {
    ex: { stem: 'Use each graph to solve the equation.', parts: [
      { t: '2x + 1 = 5', fig: sq(2, 1, 5, { size: 'mid', label: false })[0] }, { t: '2x + 1 = −3', fig: sq(2, 1, -3, { size: 'mid', label: false })[0] },
      { t: '−x + 4 = 1', fig: sq(-1, 4, 1, { size: 'mid', label: false })[0] }, { t: '½x + 2 = 4', fig: sq(0.5, 2, 4, { size: 'mid', label: false })[0] }] },
    exAns: ['The lines meet at x = 2. Check: 2 × 2 + 1 = 5 ✓', 'x = −2. Check: 2 × (−2) + 1 = −3 ✓', 'x = 3. Check: −3 + 4 = 1 ✓', 'x = 4. Check: ½ × 4 + 2 = 4 ✓'],
    hint: 'Find where the dashed line meets the other line · read x straight down (or up) to the x-axis · check by substituting',
    work: true,
    rounds: [{ text: 'read x where the lines meet, then check.', cols: 2, ...formFig([sq(2, 1, 5), sq(-1, 3, 5)], true, L1) }],
  },
  drill: {
    hint: 'The answer is the x-value of the meeting point, not the y-value.',
    rounds: [
      { text: 'read x where the lines meet, then check.', cols: 2, ...formFig([sq(2, -1, 3), sq(1, 2, -1)], true, L1) },
      { text: 'read x where the lines meet, then check.', cols: 2, ...formFig([sq(-2, 1, -3), sq(0.5, 1, 3)], true, L1) },
      { text: 'read x where the lines meet, then check.', cols: 2, ...formFig([sq(-1, -2, 2), sq(3, 1, -5)], true, L1) },
    ],
  },
  drill2: {
    hint: 'To solve 2x − 3 = 1, draw the dashed line y = 1 across the plane first.',
    rounds: [
      { text: 'draw the line y = k, then solve.', cols: 2, ...formFig([sq(2, -3, 1, { drawK: false }), sq(-1, 2, 5, { drawK: false })], true, L3) },
      { text: 'draw the line y = k, then solve.', cols: 2, ...formFig([sq(0.5, -1, 1, { drawK: false }), sq(3, 2, -4, { drawK: false })], true, L3) },
      { text: 'draw the line y = k, then solve.', cols: 2, ...formFig([sq(-2, -1, 3, { drawK: false }), sq(1, -4, 0, { drawK: false })], true, L3) },
    ],
  },
  medium: {
    ex: { stem: 'Find where each pair of lines crosses.', parts: [
      { t: 'Crossing point', fig: cross([2, -1], [-1, 5], 'mid', false)[0] }, { t: 'Crossing point', fig: cross([1, 3], [-2, 6], 'mid', false)[0] },
      { t: 'Crossing point', fig: cross([1, -2], [-1, 2], 'mid', false)[0] }, { t: 'Crossing point', fig: cross([0.5, 1], [-1, -2], 'mid', false)[0] }] },
    exAns: ['(2, 3). Check: 2 × 2 − 1 = 3 ✓ and −2 + 5 = 3 ✓', '(1, 4), so x + 3 = −2x + 6 has solution x = 1', '(2, 0)', '(−2, 0)'],
    work: true, set: true,
    rounds: [set([
      mq('', cross([1, 1], [-1, 3])[1], { fig: cross([1, 1], [-1, 3])[0], lines: ['Read x', 'Read y', 'Point'] }),
      mq('', 'm = 2, c = −1: y = 2x − 1', { fig: lineAB(2, -1, [-1, -3], [2, 3], { size: 'small', coords: false }), from: '11.6', lines: ['A and B', 'm and c', 'Equation'] }),
      mq('', cross([2, -2], [-1, 4])[1], { fig: cross([2, -2], [-1, 4])[0], lines: ['Read x', 'Read y', 'Point'] }),
      mq('', cross([-2, 4], [1, -2])[1], { fig: cross([-2, 4], [1, -2])[0], lines: ['Read x', 'Read y', 'Point'] }),
      mq('', '(3, 0) and (0, 3)', { fig: std('small', { lines: [[{ m: -1, c: 3 }]], notes: [freeCorner('small', [], 'y = −x + 3', [(x) => 3 - x])] }), from: '11.4', lines: ['x-intercept', 'y-intercept', 'Check'] }),
      mq('', cross([1, 3], [-1, -1])[1], { fig: cross([1, 3], [-1, -1])[0], lines: ['Read x', 'Read y', 'Point'] }),
    ])],
  },
  worded: [
    { q: 'Plan A costs C = 20 + 5n dollars and plan B costs C = 10 + 7n dollars for n lessons. Graph both for n = 0 to 8. After how many lessons do they cost the same, and how much is it?', a: 'They cross at n = 5: 20 + 25 = 45 and 10 + 35 = 45, so 5 lessons, $45' },
    { q: 'A tank holds 40 L and drains at 5 L per minute, so V = 40 − 5t. Graph V for t = 0 to 8 and use it to find when the tank holds 15 L.', a: 'V = 15 when t = 5: 40 − 5 × 5 = 15 ✓, so after 5 minutes' },
    { q: 'Sam has $30 and saves $12 a week. Mia has $90 and spends $8 a week. Graph both amounts. After how many weeks do they have the same amount, and how much is it?', a: '30 + 12w = 90 − 8w at w = 3: both have $66' },
  ],
};
