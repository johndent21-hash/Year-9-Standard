// Practice exams, Section 2: Surface area and volume. Every Section 2 skill of the yearly exam, once each:
// MC 1 metric units of capacity, MC 2 area of a triangle (A = ½bh), MC 3 area of a parallelogram, MC 4 area of a kite
// or rhombus; Q5 circumference and area of a circle; Q6 volume and surface area of a closed cylinder;
// Q7 composite (L-shaped) area: perimeter, area, cost; Q8 closed box: volume, litres, surface area.
// 20 marks. The numbers and contexts for each practice exam are in params.js.
'use strict';
const { num, unit, money, nw, pi, PI, HALF, q } = require('../lib/helpers');
const F = require('../lib/figs');

const it = (s) => `<i>${s}</i>`;
const sq = (x) => `${num(x)}²`;
const check = (cond, msg) => { if (!cond) throw new Error(`practice s2: ${msg}`); };
const put = (wrong, right, at) => { const a = [...wrong]; a.splice(at, 0, right); return a; };

module.exports = (P) => ({
  id: 's2',
  title: 'Surface area and volume',
  short: 'Surface area and volume',
  questions: [
    // MC 1. Metric units of capacity
    q(() => {
      const c = P.capacity;
      return {
        type: 'mc', level: 'green', src: 'TY10 Q1 (10.01, green)', topic: 'Metric units: capacity',
        text: c.text, options: c.options, answer: c.answer, why: c.why,
      };
    }),

    // MC 2. Area of a triangle: knowing A = ½bh
    q(() => {
      const { b, h, a } = P.tri;
      const A = (b * h) / 2;
      const wrong = [b * h, b + h, (b + h) / 2];
      check(new Set([...wrong, A]).size === 4, 'MC2 options must differ');
      const options = put(wrong, A, P.tri.answer).map((x) => unit(x, 'cm²'));
      return {
        type: 'mc', level: 'green', src: 'TY10 Q5 (10.04, green)', topic: 'Area of a triangle',
        text: 'What is the area of this triangle?',
        fig: F.triangle({ b, h, a, unit: 'cm', size: 34, maxH: 26 }), figPos: 'right',
        options, answer: P.tri.answer,
        why: `${it('A')} = ${HALF}${it('bh')} = ${HALF} × ${b} × ${h} = ${num(A)} cm². ${num(b * h)} cm² forgets the ${HALF}.`,
      };
    }),

    // MC 3. Area of a parallelogram, with the sloping side as a distractor
    q(() => {
      const { b, h, s } = P.para;
      const side = Math.hypot(s, h);
      check(Math.abs(side * 10 - Math.round(side * 10)) < 1e-9, 'MC3: the sloping side should be a tidy number');
      const A = b * h;
      const wrong = [b * side, (b * h) / 2, 2 * (b + side)];
      check(new Set([...wrong, A].map((x) => x.toFixed(2))).size === 4, 'MC3 options must differ');
      return {
        type: 'mc', level: 'green', src: 'TY10 Q6a (10.05, green)', topic: 'Area of a parallelogram',
        text: 'What is the area of this parallelogram?',
        formula: `Area of a parallelogram: ${nw(`${it('A')} = ${it('bh')}`)}`,
        fig: F.parallelogram({ b, h, s, unit: P.para.unit, labels: { side: unit(side, P.para.unit) }, size: 46, maxH: 26 }), figPos: 'right',
        options: put(wrong, A, P.para.answer).map((x) => unit(x, `${P.para.unit}²`)), answer: P.para.answer,
        why: `${it('A')} = ${num(b)} × ${num(h)} = ${num(A)} ${P.para.unit}² (use the perpendicular height, not the sloping side).`,
      };
    }),

    // MC 4. Area of a kite or a rhombus, A = ½xy
    q(() => {
      const k = P.kite;
      const A = (k.x * k.y) / 2;
      const wrong = [k.x * k.y, A / 2, k.x + k.y];
      check(new Set([...wrong, A]).size === 4, 'MC4 options must differ');
      const fig = k.shape === 'rhombus'
        ? F.rhombus({ x: k.x, y: k.y, unit: 'cm', size: 30, maxH: 32 })
        : F.kite({ x: k.x, y: k.y, c: k.c, unit: 'cm', size: 30, maxH: 32 });
      return {
        type: 'mc', level: 'green', src: 'TY10 Q6b (10.05, green)', topic: `Area of a ${k.shape}`,
        text: `What is the area of this ${k.shape}?`,
        formula: `Area of a ${k.shape}: ${nw(`${it('A')} = ${HALF}${it('xy')}`)} (${it('x')} and ${it('y')} are the diagonals)`,
        fig, figPos: 'right',
        options: put(wrong, A, k.answer).map((x) => unit(x, 'cm²')), answer: k.answer,
        why: `${it('A')} = ${HALF} × ${k.x} × ${k.y} = ${num(A)} cm². ${num(k.x * k.y)} cm² forgets the ${HALF}.`,
      };
    }),

    // Q5. Circumference and area of a circle (radius or diameter given)
    q(() => {
      const c = P.circle;
      const r = c.r, C = 2 * pi * r, A = pi * r * r;
      const fromD = c.show === 'd';
      return {
        type: 'sa', src: 'TY10 Q7 (10.06, blue)', topic: 'Circumference and area of a circle',
        text: 'For this circle, find, correct to 1 decimal place:',
        fig: F.circle({ r, unit: c.unit, size: 30, show: c.show || 'r' }),
        formula: [`Circumference: ${nw(`${it('C')} = 2${PI}${it('r')}`)}`, `Area: ${nw(`${it('A')} = ${PI}${it('r')}²`)}`],
        parts: [
          { text: 'its circumference', marks: 1, level: 'blue',
            answer: unit(C, c.unit, 1), working: [...(fromD ? [`${it('r')} = ${num(2 * r)} ÷ 2 = ${num(r)}`] : []), `${it('C')} = 2 × ${PI} × ${num(r)} = ${num(C, 3)}…`],
            marking: [`${num(C, 1)} ${c.unit}`] },
          { text: 'its area.', marks: 1, level: 'blue',
            answer: unit(A, `${c.unit}²`, 1), working: [`${it('A')} = ${PI} × ${sq(r)} = ${num(A, 3)}…`],
            marking: [`${num(A, 1)} ${c.unit}²`] },
        ],
      };
    }),

    // Q6. Volume and surface area of a closed cylinder
    q(() => {
      const { r, h, u } = P.cyl;
      const V = pi * r * r * h, ends = 2 * pi * r * r, curved = 2 * pi * r * h, SA = ends + curved;
      return {
        type: 'sa', level: 'blue', src: 'TY10 Q12 and Q11 (10.09, 10.08, blue)', topic: 'Volume and surface area of a cylinder',
        text: `${P.cyl.text} It has a radius of ${unit(r, u)} and a height of ${unit(h, u)}.`,
        fig: F.cylinder({ r, h, unit: u, size: 22, maxH: 28 }),
        formula: [`Volume: ${nw(`${it('V')} = ${PI}${it('r')}²${it('h')}`)}`, `Surface area: ${nw(`${it('SA')} = 2${PI}${it('r')}² + 2${PI}${it('rh')}`)}`],
        parts: [
          { text: 'Find its volume, correct to 1 decimal place.', marks: 2,
            answer: unit(V, `${u}³`, 1), working: [`${it('V')} = ${PI} × ${sq(r)} × ${num(h)} = ${num(V, 3)}…`],
            marking: [`correct substitution: ${PI} × ${sq(r)} × ${num(h)}`, `${num(V, 1)} ${u}³`] },
          { text: 'Find its surface area, correct to 1 decimal place.', marks: 2,
            answer: unit(SA, `${u}²`, 1),
            working: [`${it('SA')} = 2 × ${PI} × ${sq(r)} + 2 × ${PI} × ${num(r)} × ${num(h)}`, `= ${num(ends, 2)}… + ${num(curved, 2)}…`],
            marking: ['correct area of the two ends or of the curved surface', `${num(SA, 1)} ${u}²`] },
        ],
      };
    }),

    // Q7. L-shaped composite area: perimeter, area, cost
    q(() => {
      const { W, H, a, t, rate } = P.lshape;
      const pts = [[0, 0], [W, 0], [W, a], [t, a], [t, H], [0, H]];
      const missX = W - t, missY = H - a;
      const P1 = W + a + missX + missY + t + H;
      const A1 = W * a, A2 = t * missY, A = A1 + A2, cost = A * rate;
      return {
        type: 'worded', keepTogether: true, src: 'TY10 Q4a and Q5 (10.04, green)', topic: 'Perimeter and area of a composite shape',
        text: `${P.lshape.text} All of the corners are right angles.`,
        fig: F.composite({ pts, sides: 'auto', unit: 'm', size: 48, maxH: 24 }),
        formula: `Area of a rectangle: ${nw(`${it('A')} = ${it('lb')}`)}`,
        parts: [
          { text: P.lshape.perimQ, marks: 1, level: 'green', space: 24,
            answer: unit(P1, 'm'), working: [`${it('P')} = ${W} + ${a} + ${missX} + ${missY} + ${t} + ${H}`],
            marking: [`${P1} m`] },
          { text: `Find the area of the ${P.lshape.thing}.`, marks: 3, level: 'green', space: 50,
            answer: unit(A, 'm²'),
            working: [`Bottom rectangle: ${W} × ${a} = ${A1} m²`, `Top rectangle: ${t} × ${missY} = ${A2} m²`, `Area = ${A1} + ${A2}`],
            marking: [`bottom rectangle ${A1} m²`, `top rectangle ${A2} m²`, `total area ${A} m²`] },
          { text: `${P.lshape.costQ.replace('{rate}', money(rate, 2))}`, marks: 1, level: 'green', space: 24,
            answer: money(cost, 2), working: [`${A} × ${money(rate, 2)}`],
            marking: [money(cost, 2)] },
        ],
      };
    }),

    // Q8. A closed box: volume, capacity in litres, surface area
    q(() => {
      const { l, w, h } = P.box;
      const V = l * w * h, L = V / 1000;
      const top = l * w, front = l * h, end = w * h, SA = 2 * (top + front + end);
      return {
        type: 'worded', keepTogether: true, src: 'TY10 Q14 (10.09, blue), Q1 (10.01, green) and Q9a (10.07, blue)', topic: 'Volume, capacity and surface area of a closed box',
        text: `${P.box.text} It is a rectangular prism ${unit(l, 'cm')} long, ${unit(w, 'cm')} wide and ${unit(h, 'cm')} high.`,
        fig: F.rectPrism({ l, w, h, unit: 'cm', size: 44, maxH: 30 }),
        parts: [
          { text: 'Find the volume of the box in cm³.', marks: 1, level: 'blue', space: 26,
            formula: `Volume of a rectangular prism: ${nw(`${it('V')} = ${it('lwh')}`)}`,
            answer: unit(V, 'cm³'), working: [`${it('V')} = ${l} × ${w} × ${h}`], marking: [`${num(V)} cm³`] },
          { text: 'How many litres does the box hold?', marks: 1, level: 'green', space: 26,
            formula: '1 L = 1000 cm³',
            answer: unit(L, 'L'), working: [`${num(V)} ÷ 1000`], marking: [`${num(L)} L`] },
          { text: `${P.box.saQ} Find the surface area of the box.`, marks: 3, level: 'blue', space: 50,
            formula: `Surface area = the total area of the 6 faces; area of a rectangle: ${nw(`${it('A')} = ${it('lb')}`)}`,
            answer: unit(SA, 'cm²'),
            working: [`Top and bottom: 2 × ${l} × ${w} = ${num(2 * top)} cm²`, `Front and back: 2 × ${l} × ${h} = ${num(2 * front)} cm²`,
              `Two ends: 2 × ${w} × ${h} = ${num(2 * end)} cm²`, `${it('SA')} = ${num(2 * top)} + ${num(2 * front)} + ${num(2 * end)}`],
            marking: [`the three different face areas: ${num(top)}, ${num(front)} and ${num(end)} cm²`, 'each face area doubled (six faces)', `surface area ${num(SA)} cm²`] },
        ],
      };
    }),
  ],
});
