// Lesson 10.5 Areas of quadrilaterals (two pages: Easy, then Medium, then Mixed practice). See lib/lesson-two.js.
const { F, num, u, conv, meas, pctErr, mix } = require('../helpers');
const S = require('../shapes');

const half = F(1, 2);
// Each question: [picture, area]. unit is the length unit.
const para = (b, h, s, unit, slant, o = {}) => [S.para(b, h, s, { sides: [`${num(b)} ${unit}`, slant ? `${num(slant)} ${unit}` : ''], hLabel: `${num(h)} ${unit}`, ...o }), u(b * h, `${unit}²`)];
const trap = (a, b, h, s, unit, slant) => [S.trap(a, b, h, s, { sides: [`${num(a)} ${unit}`, '', `${num(b)} ${unit}`, slant ? `${num(slant)} ${unit}` : ''], hLabel: s > 0.01 ? `${num(h)} ${unit}` : '', ...(s > 0.01 ? {} : { sides: [`${num(a)} ${unit}`, '', `${num(b)} ${unit}`, `${num(h)} ${unit}`] }) }), u(((a + b) / 2) * h, `${unit}²`)];
const kite = (x, y, c, unit) => [S.kite(x, y, c, { xLabel: `${num(x)} ${unit}`, yLabel: `${num(y)} ${unit}` }), u((x * y) / 2, `${unit}²`)];
const figRound = (text, list) => ({ text, items: list.map(([fig]) => ({ t: '', fig })), ans: list.map((x) => x[1]), cols: 4 });
// The 12 by 4 parallelogram is flat: its height label is raised (a third of the way down) so it clears the right-angle mark.
const raised = (s, h, lab) => ({ dash: [[[s, h], [s, 0], lab, 1, 0.35]] });

const EX = [para(12, 4, 3, 'cm', 0, raised(3, 4, '4 cm')), trap(14, 8, 6, 3, 'cm'), kite(10, 6, 3, 'm'), kite(8, 12, 4, 'cm')];
// Medium example a: base b, perpendicular height h and slant side s; the slant's offset is √(s² − h²), so the picture is true.
// Its height is dashed outside the right end (the base extended), so the picture can stay small and the label clear.
const M2A = { b: 10, h: 6, s: 7 };
const m2aFig = ({ b, h, s }, unit) => {
  const o = Math.sqrt(s * s - h * h);
  return S.shape({ pts: [[0, 0], [b, 0], [b + o, h], [o, h]], sides: [`${num(b)} ${unit}`, '', '', `${num(s)} ${unit}`],
    dash: [[[b + o, h], [b + o, 0], `${num(h)} ${unit}`], [[b, 0], [b + o, 0]]], marks: [[[b + o, 0], [b + o, 1], [b + o - 1, 0]]], maxH: 6 });
};

module.exports = {
  code: '10.5', title: 'Areas of quadrilaterals',
  li: 'find the area of a parallelogram, a trapezium, a rhombus and a kite.',
  sc: ['use A = bh for a parallelogram', `use A = ${half}(a + b)h for a trapezium`, `use A = ${half}xy for a rhombus or a kite`],
  easy: {
    ex: { stem: 'Find the area of each shape. Write the formula first.', parts: [{ t: 'Parallelogram', fig: EX[0][0] }, { t: 'Trapezium', fig: EX[1][0] }, { t: 'Rhombus', fig: EX[2][0] }, { t: 'Kite', fig: EX[3][0] }] },
    exAns: [`A = bh = 12 × 4 = ${EX[0][1]}`, `A = ½(a + b)h = ½ × (14 + 8) × 6 = ${EX[1][1]}`, `A = ½xy = ½ × 10 × 6 = ${EX[2][1]}`, `A = ½xy = ½ × 8 × 12 = ${EX[3][1]}`],
    hint: 'h is the perpendicular height (the dashed line) · a and b are the parallel sides · x and y are the diagonals.',
    rounds: [
      figRound('find the area of each parallelogram.', [para(10, 4, 2, 'cm'), para(8, 6, 3, 'm'), para(15, 7, 4, 'cm'), para(9, 5, 2.5, 'm')]),
      figRound('find the area of each trapezium.', [trap(10, 6, 4, 2, 'cm'), trap(12, 8, 5, 2, 'm'), trap(9, 5, 6, 1, 'cm'), trap(11, 7, 4, 0, 'm')]),
      figRound('find the area of each rhombus or kite.', [kite(8, 6, 3, 'cm'), kite(6, 10, 3, 'm'), kite(14, 6, 3, 'cm'), kite(9, 16, 4, 'm')]),
    ],
  },
  medium: {
    ex: { stem: 'Choose the right formula. Some measurements are not needed.', parts: [
      { t: 'Area', fig: m2aFig(M2A, 'cm') }, 'A trapezium has parallel sides 7.5 m and 4.5 m, 3.2 m apart. Find its area.',
      'A parallelogram has an area of 54 cm² and a base of 9 cm. Find its height.', 'A kite has diagonals of 1.2 m and 0.8 m. Find its area.'] },
    exAns: [`the ${num(M2A.s)} cm side is not needed: A = ${num(M2A.b)} × ${num(M2A.h)} = ${u(M2A.b * M2A.h, 'cm²')}`, `½ × (7.5 + 4.5) × 3.2 = ${u(((7.5 + 4.5) / 2) * 3.2, 'm²')}`, `54 = 9 × h, so h = 54 ÷ 9 = ${u(54 / 9, 'cm')}`, `½ × 1.2 × 0.8 = ${u((1.2 * 0.8) / 2, 'm²')}`],
    hint: 'The slanted side is not the height · Missing length: put the numbers into the formula, then work backwards.',
    rounds: [
      figRound('find the area of each shape. One length in each is not needed.', [para(9, 4, 3, 'm', 5), trap(13, 7, 4, 3, 'cm', 5),
        // the rhombus's 10 cm side is labelled outside its top-left side (as a side label it touched the side and the 12 cm line)
        [S.kite(16, 12, 6, { xLabel: '16 cm', yLabel: '12 cm', labels: [['10 cm', -5.9, 11.6]] }), u((16 * 12) / 2, 'cm²')],
        [S.trap(11, 7, 4.5, 2, { sides: ['11 m', '', '7 m', '4.9 m'], hLabel: '4.5 m' }), u(((11 + 7) / 2) * 4.5, 'm²')]]),
      { text: 'find the missing measurement. Show your working.', cols: 2, work: true, items: [
        'A parallelogram has an area of 72 cm² and a base of 9 cm. Find its height.', 'A rhombus has an area of 24 m² and one diagonal of 8 m. Find the other diagonal.',
        'A trapezium has parallel sides of 6 cm and 10 cm and an area of 40 cm². Find its height.', 'A square has diagonals of 10 cm. Use the rhombus formula to find its area.'],
      ans: [u(72 / 9, 'cm'), u((2 * 24) / 8, 'm'), u(40 / ((6 + 10) / 2), 'cm'), u((10 * 10) / 2, 'cm²')] },
    ],
  },
  mixed: mix(
    ['Find the area of a parallelogram with base 7 m and height 3 m.', u(7 * 3, 'm²'), '10.5'],
    ['Find the perimeter of a rectangle 9 cm by 4 cm.', u(2 * (9 + 4), 'cm'), '10.4'],
    ['A trapezium has parallel sides 4 cm and 6 cm, 5 cm apart. Area?', u(((4 + 6) / 2) * 5, 'cm²'), '10.5'],
    ['Percentage error of 16 kg, to the nearest kg?', `${num(pctErr(meas('16 kg').e, meas('16 kg').v))}%`, '10.3'],
    ['A rhombus has diagonals of 9 m and 4 m. Find its area.', u((9 * 4) / 2, 'm²'), '10.5'],
    ['Convert 0.6 km to m.', u(conv(0.6, 'km', 'm'), 'm'), '10.1'],
    ['A kite has diagonals of 10 cm and 7 cm. Find its area.', u((10 * 7) / 2, 'cm²'), '10.5'],
    ['A parallelogram has an area of 30 m² and a base of 6 m. Height?', u(30 / 6, 'm'), '10.5'],
  ),
};
