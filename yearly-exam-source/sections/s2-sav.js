// Section 2: Surface area and volume (Chapter 10). 22 marks: 4 multiple choice (1 mark each), short answer
// (8 marks), 2 worded problems (5 marks each). Levels: 12 green, 10 blue.
// 2026 edit: easier measurement. Simple shapes (a right-angled triangle, a circle) for perimeter and area, the lawn
// has every side labelled, the cylinder gives the radius, and no 3D object is open. A question part that takes
// 2 steps is worth 2 marks, 3 steps 3 marks.
//
// Every question is a NEW question in the style of a GREEN (Foundation) or BLUE (Standard) Test yourself 10
// question (src names it). Chapter 10 has no PATH sections. Green types: 10.01 metric units, 10.04 perimeter and
// area (the triangle formula included), 10.05 areas of quadrilaterals. Blue types: 10.06 circles,
// 10.07 surface area of prisms, 10.08 surface area of cylinders, 10.09 volumes of prisms and cylinders.
'use strict';
const { num, unit, money, nw, pi, PI, HALF, q } = require('../lib/helpers');
const F = require('../lib/figs');

const it = (s) => `<i>${s}</i>`;
const sq = (x) => `${num(x)}²`;

module.exports = {
  id: 's2',
  title: 'Surface area and volume',
  short: 'Surface area and volume',
  questions: [
    // ================================================================ multiple choice (4 x 1 mark, all green)

    // Q1. Capacity conversion kL -> L (TY10 Q1i: 125 kL to L).
    q(() => {
      const kL = 4.6, L = kL * 1000;
      return {
        type: 'mc', level: 'green', src: 'TY10 Q1i (10.01, green)', topic: 'Metric units: capacity (kL to L)',
        text: `A rainwater tank holds ${unit(kL, 'kL')} of water. How many litres is this?`,
        options: [unit(kL * 100, 'L'), unit(kL * 10000, 'L'), unit(L, 'L'), unit(kL / 1000, 'L')], answer: 2,
        why: `1 kL = 1000 L, so ${num(kL)} × 1000 = ${num(L)} L. The others use × 100, × ${num(10000)} or ÷ 1000.`,
      };
    }),

    // Q2. Choosing the formula for the area of a triangle (TY10 Q5: area). Replaces precision and absolute error.
    q(() => ({
      type: 'mc', level: 'green', src: 'TY10 Q5 (10.04, green)', topic: 'Formula for the area of a triangle',
      text: 'Select the correct formula for the area of a triangle.',
      formula: `${it('b')} is the base and ${it('h')} is the perpendicular height`,
      fig: F.triangle({ b: 10, h: 8, a: 3, labels: { b: it('b'), h: it('h') }, size: 30, maxH: 26 }), figPos: 'right',
      options: [`${it('A')} = 2${it('bh')}`, `${it('A')} = ${it('bh')}`, `${it('A')} = ${HALF}${it('bh')}`, `${it('A')} = ${HALF}(${it('b')} + ${it('h')})`].map(nw), answer: 2,
      why: `A triangle is half of a parallelogram with the same base and height, so ${it('A')} = ${HALF}${it('bh')}. A doubles instead of halving, B is the parallelogram formula, D adds ${it('b')} and ${it('h')} instead of multiplying.`,
    })),

    // Q3. Area of a parallelogram, A = bh, with the sloping side as a distractor (TY10 Q6a).
    q(() => {
      const b = 12, h = 6, s = 4.5, side = Math.hypot(s, h); // 7.5 cm sloping side (to scale)
      const A = b * h;
      return {
        type: 'mc', level: 'green', src: 'TY10 Q6a (10.05, green)', topic: 'Area of a parallelogram',
        text: 'What is the area of this parallelogram?',
        formula: `Area of a parallelogram: ${nw(`${it('A')} = ${it('bh')}`)}`,
        fig: F.parallelogram({ b, h, s, unit: 'cm', labels: { side: unit(side, 'cm') }, size: 46, maxH: 26 }), figPos: 'right',
        options: [unit(b * side, 'cm²'), unit(b * h / 2, 'cm²'), unit(2 * (b + side), 'cm²'), unit(A, 'cm²')], answer: 3,
        why: `${it('A')} = ${b} × ${h} = ${A} cm² (the height is the perpendicular height, ${h} cm, not the sloping side).`,
      };
    }),

    // Q4. Area of a kite, A = ½xy (TY10 Q6b, e, f).
    q(() => {
      const x = 16, y = 22, A = (x * y) / 2;
      return {
        type: 'mc', level: 'green', src: 'TY10 Q6b (10.05, green)', topic: 'Area of a kite',
        text: 'What is the area of this kite?',
        formula: `Area of a kite: ${nw(`${it('A')} = ${HALF}${it('xy')}`)} (${it('x')} and ${it('y')} are the diagonals)`,
        fig: F.kite({ x, y, c: 15, unit: 'cm', size: 30, maxH: 32 }), figPos: 'right',
        options: [unit(x * y, 'cm²'), unit(A, 'cm²'), unit(A / 2, 'cm²'), unit(x + y, 'cm²')], answer: 1,
        why: `${it('A')} = ${HALF} × ${x} × ${y} = ${A} cm². ${x * y} cm² forgets the ${HALF}.`,
      };
    }),

    // ================================================================ short answer (8 marks: 2 green, 6 blue)

    // Q5. Perimeter and area of a right-angled triangle, all three sides given (TY10 Q4 and Q5: perimeter and area).
    q(() => {
      const b = 12, h = 9, c = Math.hypot(b, h); // 15 cm: all three sides are labelled, so no Pythagoras is needed
      const P = b + h + c, A = (b * h) / 2;
      return {
        type: 'sa', src: 'TY10 Q4 and Q5 (10.04, green)', topic: 'Perimeter and area of a triangle',
        text: 'For this right-angled triangle, find:',
        fig: F.rightTriangle({ base: b, height: h, corner: 'BL', labels: { base: unit(b, 'cm'), height: unit(h, 'cm'), hyp: unit(c, 'cm') }, size: 40 }),
        formula: `Area of a triangle: ${nw(`${it('A')} = ${HALF}${it('bh')}`)}`,
        parts: [
          { text: 'its perimeter', marks: 1, level: 'green',
            answer: unit(P, 'cm'), working: [`${it('P')} = ${b} + ${h} + ${c}`],
            marking: [`${P} cm`] },
          { text: 'its area.', marks: 1, level: 'green',
            answer: unit(A, 'cm²'), working: [`${it('A')} = ${HALF} × ${b} × ${h}`],
            marking: [`${A} cm²`],
            notes: `Common errors: ${b * h} cm² (no ${HALF}) or ${HALF} × ${b} × ${c} = ${(b * c) / 2} cm² (uses the sloping side): 0 marks.` },
        ],
      };
    }),

    // Q6. Circumference and area of a circle, radius given (TY10 Q7: perimeter and area of circles and sectors).
    q(() => {
      const r = 6.5;
      const C = 2 * pi * r, A = pi * r * r;
      return {
        type: 'sa', src: 'TY10 Q7 (10.06, blue)', topic: 'Circumference and area of a circle',
        text: 'For this circle, find, correct to 1 decimal place:',
        fig: F.circle({ r, unit: 'cm', size: 30 }),
        formula: [`Circumference: ${nw(`${it('C')} = 2${PI}${it('r')}`)}`, `Area: ${nw(`${it('A')} = ${PI}${it('r')}²`)}`],
        parts: [
          { text: 'its circumference', marks: 1, level: 'blue',
            answer: unit(C, 'cm', 1), working: [`${it('C')} = 2 × ${PI} × ${num(r)} = ${num(C, 3)}…`],
            marking: [`${num(C, 1)} cm`] },
          { text: 'its area.', marks: 1, level: 'blue',
            answer: unit(A, 'cm²', 1), working: [`${it('A')} = ${PI} × ${sq(r)} = ${num(A, 3)}…`],
            marking: [`${num(A, 1)} cm²`],
            notes: `Common error: ${PI} × ${num(2 * r)}² (uses the diameter) = ${num(pi * 4 * r * r, 1)} cm²: 0 marks.` },
        ],
      };
    }),

    // Q7. Volume and surface area of a closed cylinder, radius given (TY10 Q12 and Q11).
    q(() => {
      const r = 6, h = 15;
      const V = pi * r * r * h, ends = 2 * pi * r * r, curved = 2 * pi * r * h, SA = ends + curved;
      return {
        type: 'sa', level: 'blue', src: 'TY10 Q12 and Q11 (10.09, 10.08, blue)', topic: 'Volume and surface area of a cylinder',
        text: `This closed cylinder has a radius of ${unit(r, 'cm')} and a height of ${unit(h, 'cm')}.`,
        fig: F.cylinder({ r, h, unit: 'cm', size: 22, maxH: 28 }),
        formula: [`Volume: ${nw(`${it('V')} = ${PI}${it('r')}²${it('h')}`)}`, `Surface area: ${nw(`${it('SA')} = 2${PI}${it('r')}² + 2${PI}${it('rh')}`)}`],
        parts: [
          {
            text: 'Find its volume, correct to 1 decimal place.', marks: 2,
            answer: unit(V, 'cm³', 1),
            working: [`${it('V')} = ${PI} × ${sq(r)} × ${h} = ${num(V, 3)}…`],
            marking: [`correct substitution: ${PI} × ${sq(r)} × ${h}`, `${num(V, 1)} cm³`],
          },
          {
            text: 'Find its surface area, correct to 1 decimal place.', marks: 2,
            answer: unit(SA, 'cm²', 1),
            working: [`${it('SA')} = 2 × ${PI} × ${sq(r)} + 2 × ${PI} × ${r} × ${h}`, `= ${num(ends, 2)}… + ${num(curved, 2)}…`],
            marking: [`correct area of the two circular ends (2 × ${PI} × ${sq(r)} = ${num(ends, 1)} cm²) or of the curved surface (2 × ${PI} × ${r} × ${h} = ${num(curved, 1)} cm²)`, `${num(SA, 1)} cm²`],
            notes: `Leaving out one or both circular ends (${num(SA - pi * r * r, 1)} or ${num(curved, 1)} cm²) earns the first mark only.`,
          },
        ],
      };
    }),

    // ================================================================ worded problems (2 x 5 marks)

    // Q8. L-shaped lawn, every side labelled: perimeter (edging), area, cost of turf (TY10 Q4a and Q5). All green.
    q(() => {
      const pts = [[0, 0], [18, 0], [18, 7], [8, 7], [8, 12], [0, 12]];
      const W = 18, H = 12, a = 7, t = 8; // bottom strip 18 x 7, top-left block 8 wide
      const missX = W - t, missY = H - a;
      const P = W + a + missX + missY + t + H;
      const A1 = W * a, A2 = t * missY, A = A1 + A2;
      const rate = 12.4, cost = A * rate;
      return {
        type: 'worded', src: 'TY10 Q4a and Q5 (10.04, green)', topic: 'Perimeter and area of a composite shape (lawn)',
        text: 'The plan shows an L-shaped lawn at a primary school. All of the corners are right angles.',
        keepTogether: true,
        fig: F.composite({ pts, sides: 'auto', unit: 'm', size: 48, maxH: 24 }),
        formula: `Area of a rectangle: ${nw(`${it('A')} = ${it('lb')}`)}`,
        parts: [
          {
            text: 'Garden edging is laid around the outside of the lawn. How many metres of edging are needed?', marks: 1, level: 'green', space: 24,
            answer: unit(P, 'm'),
            working: [`${it('P')} = ${W} + ${a} + ${missX} + ${missY} + ${t} + ${H}`],
            marking: [`${P} m`],
          },
          {
            text: 'Find the area of the lawn.', marks: 3, level: 'green', space: 50,
            answer: unit(A, 'm²'),
            working: [`Bottom rectangle: ${W} × ${a} = ${A1} m²`, `Top rectangle: ${t} × ${missY} = ${A2} m²`, `Area = ${A1} + ${A2}`],
            marking: [`bottom rectangle ${A1} m²`, `top rectangle ${A2} m²`, `total area ${A} m²`],
            notes: `Another split (left ${t} × ${H} = ${t * H} m² and right ${missX} × ${a} = ${missX * a} m²) or ${W} × ${H} − ${missX} × ${missY} earns the same marks.`,
          },
          {
            text: `New turf costs ${money(rate, 2)} per square metre. Find the cost of the turf for the whole lawn.`, marks: 1, level: 'green', space: 24,
            answer: money(cost, 2),
            working: [`${A} × ${money(rate, 2)}`],
            marking: [`${money(cost, 2)}`],
            notes: 'Follow-through from part b.',
          },
        ],
      };
    }),

    // Q9. A closed storage box: volume, capacity in litres, surface area (TY10 Q14 (blue), Q1i (green), Q9a (blue)).
    q(() => {
      const l = 60, w = 40, h = 30;
      const V = l * w * h, L = V / 1000;
      const top = l * w, front = l * h, end = w * h, SA = 2 * (top + front + end);
      return {
        type: 'worded', keepTogether: true, src: 'TY10 Q14 (10.09, blue), Q1i (10.01, green) and Q9a (10.07, blue)', topic: 'Volume, capacity and surface area of a closed box',
        text: `A closed wooden storage box is a rectangular prism ${unit(l, 'cm')} long, ${unit(w, 'cm')} wide and ${unit(h, 'cm')} high.`,
        fig: F.rectPrism({ l, w, h, unit: 'cm', size: 44, maxH: 30 }),
        parts: [
          {
            text: 'Find the volume of the box in cm³.', marks: 1, level: 'blue', space: 26,
            formula: `Volume of a rectangular prism: ${nw(`${it('V')} = ${it('lwh')}`)}`,
            answer: unit(V, 'cm³'),
            working: [`${it('V')} = ${l} × ${w} × ${h}`],
            marking: [`${num(V)} cm³`],
          },
          {
            text: 'How many litres does the box hold?', marks: 1, level: 'green', space: 26,
            formula: '1 L = 1000 cm³',
            answer: unit(L, 'L'),
            working: [`${num(V)} ÷ 1000`],
            marking: [`${num(L)} L`],
            notes: 'Follow-through from part a.',
          },
          {
            text: 'The outside of the box is to be painted. Find the surface area of the box.', marks: 3, level: 'blue', space: 50,
            formula: `Surface area = the total area of the 6 faces; area of a rectangle: ${nw(`${it('A')} = ${it('lb')}`)}`,
            answer: unit(SA, 'cm²'),
            working: [
              `Top and bottom: 2 × ${l} × ${w} = ${num(2 * top)} cm²`,
              `Front and back: 2 × ${l} × ${h} = ${num(2 * front)} cm²`,
              `Two ends: 2 × ${w} × ${h} = ${num(2 * end)} cm²`,
              `${it('SA')} = ${num(2 * top)} + ${num(2 * front)} + ${num(2 * end)}`,
            ],
            marking: [`the three different face areas: ${num(top)}, ${num(front)} and ${num(end)} cm²`, 'each face area doubled (six faces)', `surface area ${num(SA)} cm²`],
            notes: `Three faces only (${num(top + front + end)} cm²) earns the first mark only.`,
          },
        ],
      };
    }),
  ],
};
