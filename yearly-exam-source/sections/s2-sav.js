// Section 2: Surface area and volume (Chapter 10). 24 marks: 5 multiple choice (1 mark each), short answer
// (11 marks), 2 worded problems (4 marks each). Levels: 17 green, 7 blue.
//
// Every question is a NEW question in the style of a GREEN (Foundation) or BLUE (Standard) Test yourself 10
// question (src names it). Chapter 10 has no PATH sections. Green types: 10.01 metric units, 10.02 precision and
// absolute error, 10.04 composite perimeter and area, 10.05 areas of quadrilaterals. Blue types: 10.07 surface area
// of prisms, 10.08 surface area of cylinders, 10.09 volumes of prisms and cylinders.
'use strict';
const { num, unit, money, nw, pi, PI, HALF, q } = require('../lib/helpers');
const F = require('../lib/figs');

const { reset, T, best, seg, poly, pline, rightMark, svg, FILL } = F.parts;
const it = (s) => `<i>${s}</i>`;
const sq = (x) => `${num(x)}²`;
const PM = '±';

// ---------------------------------------------------------------- one-off figures

// A measuring cylinder with a scale from 0 to `max` mL: a mark every `step` mL and a
// label every `labelEvery` mL, filled to `level` mL. `mmPer100` is the drawn height of 100 mL.
const jug = ({ max = 500, step = 50, labelEvery = 100, level = 350, mmPer100 = 7.2, width = 13 }) => {
  reset();
  const k = mmPer100 / 100;
  const x0 = 2, x1 = x0 + width, bot = 3.5 + (max + 40) * k, top = bot - (max + 40) * k;
  const y = (mL) => bot - mL * k;
  let b = '';
  // water, then the glass (open at the top, with a lip and a base plate)
  b += poly([[x0, y(level)], [x1, y(level)], [x1, bot], [x0, bot]], FILL, { w: 0.3 });
  b += pline([[x0 - 1, top], [x0, top + 1], [x0, bot], [x1, bot], [x1, top + 1], [x1 + 1, top]], { w: 0.45 });
  b += poly([[x0 - 3, bot], [x1 + 3, bot], [x1 + 3, bot + 1.6], [x0 - 3, bot + 1.6]], '#d7dde5', { w: 0.35 });
  // marks on the right-hand wall, labels outside it
  for (let mL = step; mL <= max; mL += step) {
    const major = mL % labelEvery === 0;
    b += seg([x1 - (major ? 5 : 3), y(mL)], [x1, y(mL)], { w: major ? 0.4 : 0.32 });
    if (major) b += T(x1 + 1.8, y(mL), `${num(mL)} mL`, { anchor: 'start', size: 3.2 });
  }
  return svg(x1 + 3.4, bot + 1.6, b);
};

// A rectangular photo frame: outer L x W with a rectangular hole l x w in the middle (question units, cm).
const frame = ({ L, W, l, w, unit: u = 'cm', size = 46 }) => {
  reset();
  const k = size / L, m = 1;
  const X = (x) => m + x * k, Y = (yy) => m + (W - yy) * k; // y up
  const ox = (L - l) / 2, oy = (W - w) / 2;
  const O = [[X(0), Y(0)], [X(L), Y(0)], [X(L), Y(W)], [X(0), Y(W)]];
  const I = [[X(ox), Y(oy)], [X(ox + l), Y(oy)], [X(ox + l), Y(oy + w)], [X(ox), Y(oy + w)]];
  let b = poly(O, FILL) + poly(I, '#ffffff');
  b += rightMark(O[0], O[1], O[3]) + rightMark(O[2], O[1], O[3]) + rightMark(I[0], I[1], I[3]);
  b += best([[F.parts.mid(O[0], O[1]), [0, 1]]], `${num(L)} ${u}`);
  b += best([[F.parts.mid(O[1], O[2]), [1, 0]]], `${num(W)} ${u}`);
  b += best([[F.parts.mid(I[3], I[2]), [0, 1]], [F.parts.mid(I[3], I[2], 0.6), [0, 1]]], `${num(l)} ${u}`);
  b += best([[F.parts.mid(I[2], I[1]), [-1, 0]], [F.parts.mid(I[2], I[1], 0.65), [-1, 0]]], `${num(w)} ${u}`);
  return svg(2 * m + L * k, 2 * m + W * k, b);
};

// ---- helpers that post-process an F.prism / F.rectPrism SVG (they read the drawn polygons, so they do not depend on
// the projection constants inside F.prism)
const { TOP, INK, tw, FS } = F.parts;
const fx = (n) => +(+n).toFixed(2);
const ptsOf = (s, fill) => { const m = s.match(new RegExp(`<polygon points="([^"]+)" fill="${fill}"`)); return m ? m[1].trim().split(/\s+/).map((t) => t.split(',').map(Number)) : null; };
const area2 = (Q) => Q.reduce((t, p, i) => { const r = Q[(i + 1) % Q.length]; return t + p[0] * r[1] - r[0] * p[1]; }, 0);
// Sutherland-Hodgman: the part of polygon `sub` inside the convex polygon `win`.
const clipTo = (sub, win) => {
  const o = Math.sign(area2(win));
  let out = sub;
  for (let i = 0; i < win.length && out.length; i++) {
    const a = win[i], b = win[(i + 1) % win.length];
    const side = (p) => o * ((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]));
    const inp = out; out = [];
    inp.forEach((p, j) => {
      const r = inp[(j + 1) % inp.length], sp = side(p), sr = side(r);
      if (sp >= -1e-9) out.push(p);
      if ((sp >= -1e-9) !== (sr >= -1e-9)) { const t = sp / (sp - sr); out.push([p[0] + t * (r[0] - p[0]), p[1] + t * (r[1] - p[1])]); }
    });
  }
  return out;
};
// Grow an SVG's viewBox (and its mm size) to hold the box [x0, y0, x1, y1].
const growTo = (s, [x0, y0, x1, y1]) => s.replace(/viewBox="([^"]+)" width="[^"]+mm" height="[^"]+mm"/, (m, vb) => {
  const [a, b, w, h] = vb.trim().split(/\s+/).map(Number);
  const nx = Math.min(a, x0), ny = Math.min(b, y0), W = fx(Math.max(a + w, x1) - nx), Hh = fx(Math.max(b + h, y1) - ny);
  return `viewBox="${fx(nx)} ${fx(ny)} ${W} ${Hh}" width="${W}mm" height="${Hh}mm"`;
});

// Draw a prism with NO TOP (an open tub or trough), as TY10 Q9b and Q15 do: the top face becomes an opening (the rim
// stays), and through it you see the inside of the far end, of the walls and of the floor (the faces that look away
// from the viewer), each clipped to the opening and shaded darker than the outside.
const openTop = (s) => {
  const top = ptsOf(s, TOP), front = ptsOf(s, FILL);
  if (!top || !front) throw new Error('openTop: no top or front face found');
  const D = [top[2][0] - top[1][0], top[2][1] - top[1][1]]; // front -> back
  const n = front.length, back = front.map((p) => [p[0] + D[0], p[1] + D[1]]);
  const sg = area2(front) > 0 ? 1 : -1;
  const faces = [[back, '#c3d4ec']];
  for (let i = 0; i < n; i++) {
    const p = front[i], r = front[(i + 1) % n], L = Math.hypot(r[0] - p[0], r[1] - p[1]);
    const u = [(r[0] - p[0]) / L, (r[1] - p[1]) / L], out = sg > 0 ? [u[1], -u[0]] : [-u[1], u[0]];
    if (out[0] * D[0] + out[1] * D[1] > 1e-6) continue; // seen from outside: not seen from inside
    faces.push([[p, r, back[(i + 1) % n], back[i]], out[1] > 0.5 ? '#d3e0f1' : '#adc3e2']);
  }
  const inside = faces.map(([Q, c]) => [clipTo(Q, top), c]).filter(([Q]) => Q.length > 2 && Math.abs(area2(Q)) > 0.02)
    .map(([Q, c]) => `<polygon points="${Q.map((p) => `${fx(p[0])},${fx(p[1])}`).join(' ')}" fill="${c}" stroke="${INK}" stroke-width="0.35" stroke-linejoin="round"/>`).join('');
  return s.replace(`fill="${TOP}"`, 'fill="none"').replace(/<polygon points="[^"]+" fill="none"/, (m) => `${inside}${m}`);
};

// Extras on a prism drawn by F.prism (mapping read from the drawn front face, so it matches the drawing):
//   mark: [foot, p1, p2] a right-angle mark on the front face (question units);
//   topLabel: a label above the BACK top edge (as TY10 Q15 labels the 28 cm top of the lunchbox).
const prismExtras = (s, face, { mark, topLabel } = {}) => {
  const front = ptsOf(s, FILL);
  const k = (front[1][0] - front[0][0]) / (face[1][0] - face[0][0]);
  const X0 = front[0][0] - face[0][0] * k, Y0 = front[0][1] + face[0][1] * k;
  const map = (p) => [X0 + p[0] * k, Y0 - p[1] * k];
  const top = ptsOf(s, 'none') || ptsOf(s, TOP); // [front i, front j, back j, back i] of the top face
  let extra = '';
  if (mark) extra += rightMark(map(mark[0]), map(mark[1]), map(mark[2]), 1.8);
  let box = null;
  if (topLabel) {
    const a = top[2], c = top[3], x = (a[0] + c[0]) / 2, yEdge = Math.min(a[1], c[1]), hh = FS * 0.41, y = yEdge - hh - 1.1, w = tw(topLabel);
    extra += T(x, y, topLabel);
    box = [x - w / 2 - 0.7, y - hh - 0.6, x + w / 2 + 0.7, y + hh + 0.6];
  }
  reset();
  const out = s.replace('</svg>', `${extra}</svg>`);
  return box ? growTo(out, box) : out;
};

module.exports = {
  id: 's2',
  title: 'Surface area and volume',
  short: 'Surface area and volume',
  questions: [
    // ================================================================ multiple choice (5 x 1 mark, all green)

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

    // Q2. Precision and absolute error read from a scale (TY10 Q2: thermometer, speedometer).
    q(() => {
      const step = 50, abs = step / 2;
      return {
        type: 'mc', level: 'green', src: 'TY10 Q2 (10.02, green)', topic: 'Precision and absolute error',
        text: [
          'The scale on this measuring cylinder is shown.',
          'What is the absolute error of a reading taken with this measuring cylinder?',
        ],
        formula: `absolute error = ${HALF} × precision (the smallest marked unit on the scale)`,
        fig: jug({ max: 500, step, labelEvery: 100, level: 350 }), figPos: 'right',
        options: [`${PM}${num(abs)} mL`, `${PM}${num(step)} mL`, `${PM}${num(2 * step)} mL`, `${PM}0.5 mL`], answer: 0,
        why: `The marks are ${step} mL apart, so the precision is ${step} mL and the absolute error is ${HALF} × ${step} = ${PM}${abs} mL. B is the precision, C the gap between the numbered marks, D half of 1 mL.`,
      };
    }),

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

    // Q5. Composite area by subtraction: a frame (TY10 Q5b: square frame, outer square minus inner square).
    q(() => {
      const L = 30, W = 25, l = 20, w = 15;
      const A = L * W - l * w;
      return {
        type: 'mc', level: 'green', src: 'TY10 Q5b (10.04, green)', topic: 'Area of a composite shape (frame)',
        text: [`A photo frame is a ${unit(L, 'cm')} by ${unit(W, 'cm')} rectangle with a ${unit(l, 'cm')} by ${unit(w, 'cm')} hole for the photo.`,
          'What is the area of the frame (the shaded part)?'],
        formula: `Area of a rectangle: ${nw(`${it('A')} = ${it('lb')}`)}`,
        fig: frame({ L, W, l, w, size: 40 }), figPos: 'right',
        options: [unit(L * W, 'cm²'), unit(L * W + l * w, 'cm²'), unit(A, 'cm²'), unit((L - l) * (W - w), 'cm²')], answer: 2,
        why: `${L} × ${W} − ${l} × ${w} = ${L * W} − ${l * w} = ${A} cm².`,
      };
    }),

    // ================================================================ short answer (11 marks: 5 green, 6 blue)

    // Q6. Perimeter of a right trapezium; the sloping side by Pythagoras (TY10 Q4b: 15, 17, 25 cm with an 8-15-17 triangle).
    q(() => {
      const base = 12, left = 9, right = 14, rise = right - left;
      const slant = Math.hypot(base, rise); // 13 (5-12-13)
      const P = base + right + slant + left;
      return {
        type: 'sa', level: 'green', src: 'TY10 Q4b (10.04, green)', topic: 'Perimeter of a composite shape (Pythagoras)',
        text: 'Find the perimeter of this shape.',
        fig: F.shape({ pts: [[0, 0], [base, 0], [base, right], [0, left]], sides: [unit(base, 'cm'), unit(right, 'cm'), '', unit(left, 'cm')], right: [0, 1], size: 34, maxH: 33 }),
        formula: `Pythagoras’ theorem: ${nw(`${it('c')}² = ${it('a')}² + ${it('b')}²`)}`,
        marks: 2,
        answer: unit(P, 'cm'),
        working: [
          `Sloping side: across ${base} cm, up ${right} − ${left} = ${rise} cm`,
          `${it('c')}² = ${sq(base)} + ${sq(rise)} = ${base * base + rise * rise}, so ${it('c')} = √${base * base + rise * rise} = ${slant} cm`,
          `${it('P')} = ${base} + ${right} + ${slant} + ${left}`,
        ],
        marking: [`sloping side ${slant} cm (Pythagoras with ${base} cm and ${rise} cm)`, `perimeter ${P} cm`],
        notes: 'Follow-through: a wrong sloping side added correctly to the other three sides earns the second mark.',
      };
    }),

    // Q7. Area of a composite shape: rectangle + triangle (TY10 Q5a: house shape, square + triangle).
    q(() => {
      const b = 14, hr = 9, ht = 6;
      const Ar = b * hr, At = (b * ht) / 2, A = Ar + At;
      return {
        type: 'sa', level: 'green', src: 'TY10 Q5a (10.04, green)', topic: 'Area of a composite shape (rectangle + triangle)',
        text: 'Find the area of this shape.',
        fig: F.shape({
          pts: [[0, 0], [b, 0], [b, hr], [b / 2, hr + ht], [0, hr]], sides: [unit(b, 'cm'), unit(hr, 'cm'), '', '', ''], right: [0, 1],
          dash: [[[0, hr], [b, hr]], [[b / 2, hr + ht], [b / 2, hr], unit(ht, 'cm')]], marks: [[[b / 2, hr], [b / 2, hr + 1], [b / 2 + 1, hr]]],
          size: 34, maxH: 35,
        }),
        formula: [`Area of a rectangle: ${nw(`${it('A')} = ${it('lb')}`)}`, `Area of a triangle: ${nw(`${it('A')} = ${HALF}${it('bh')}`)}`],
        marks: 3,
        answer: unit(A, 'cm²'),
        working: [
          `Rectangle: ${b} × ${hr} = ${Ar} cm²`,
          `Triangle: ${HALF} × ${b} × ${ht} = ${At} cm²`,
          `Total: ${Ar} + ${At}`,
        ],
        marking: [`rectangle ${Ar} cm²`, `triangle ${At} cm²`, `total area ${A} cm²`],
        notes: `Follow-through: the third mark for correctly adding the student’s two areas. Forgetting the ${HALF} in the triangle (${b * ht} cm², total ${Ar + b * ht} cm²) loses the triangle mark only.`,
      };
    }),

    // Q8. Surface area of an open rectangular prism (TY10 Q9b: open rectangular prism 8 m x 5.5 m x 4 m).
    q(() => {
      const l = 45, w = 30, h = 20;
      const base = l * w, fb = l * h, ends = w * h, SA = base + 2 * fb + 2 * ends;
      return {
        type: 'sa', level: 'blue', src: 'TY10 Q9b (10.07, blue)', topic: 'Surface area of an open rectangular prism',
        text: `A storage tub is a rectangular prism with <b>no lid</b> (it is open at the top). Find the surface area of the tub.`,
        fig: openTop(F.rectPrism({ l, w, h, unit: 'cm', size: 44, maxH: 29 })),
        formula: `Surface area = the total area of the faces; area of a rectangle: ${nw(`${it('A')} = ${it('lb')}`)}`,
        marks: 2,
        answer: unit(SA, 'cm²'),
        working: [
          `Base: ${l} × ${w} = ${num(base)} cm² (no top)`,
          `Front and back: 2 × ${l} × ${h} = ${num(2 * fb)} cm²`,
          `Two ends: 2 × ${w} × ${h} = ${num(2 * ends)} cm²`,
          `${it('SA')} = ${num(base)} + ${num(2 * fb)} + ${num(2 * ends)}`,
        ],
        marking: [`correct face areas: base ${num(base)} cm², front and back ${num(fb)} cm² each, ends ${num(ends)} cm² each`, `surface area ${num(SA)} cm² (five faces: no top)`],
        notes: `A closed-box answer of ${num(SA + base)} cm² (six faces) earns the first mark only.`,
      };
    }),

    // Q9. Volume and surface area of a closed cylinder, diameter given (TY10 Q11b and Q12b: diameter 15 mm, height 23 mm).
    q(() => {
      const d = 12, r = d / 2, h = 15;
      const V = pi * r * r * h, ends = 2 * pi * r * r, curved = 2 * pi * r * h, SA = ends + curved;
      return {
        type: 'sa', level: 'blue', src: 'TY10 Q12b and Q11b (10.09, 10.08, blue)', topic: 'Volume and surface area of a cylinder',
        text: `This closed cylinder has a diameter of ${unit(d, 'cm')} and a height of ${unit(h, 'cm')}.`,
        fig: F.cylinder({ r, h, unit: 'cm', show: 'd', size: 22, maxH: 28 }),
        formula: [`Volume: ${nw(`${it('V')} = ${PI}${it('r')}²${it('h')}`)}`, `Surface area: ${nw(`${it('SA')} = 2${PI}${it('r')}² + 2${PI}${it('rh')}`)}`],
        parts: [
          {
            text: 'Find its volume, correct to 1 decimal place.', marks: 2,
            answer: unit(V, 'cm³', 1),
            working: [`${it('r')} = ${d} ÷ 2 = ${r} cm`, `${it('V')} = ${PI} × ${sq(r)} × ${h} = ${num(V, 3)}…`],
            marking: [`correct substitution into ${it('V')} = ${PI}${it('r')}²${it('h')}: ${PI} × ${sq(r)} × ${h}`, `${num(V, 1)} cm³ (needs ${it('r')} = ${r})`],
            notes: `Using the diameter as the radius (${PI} × ${sq(d)} × ${h} = ${num(pi * d * d * h, 1)} cm³) earns the first mark only.`,
          },
          {
            text: 'Find its surface area, correct to 1 decimal place.', marks: 2,
            answer: unit(SA, 'cm²', 1),
            working: [`${it('SA')} = 2 × ${PI} × ${sq(r)} + 2 × ${PI} × ${r} × ${h}`, `= ${num(ends, 2)}… + ${num(curved, 2)}…`],
            marking: [`correct area of the two circular ends (2 × ${PI} × ${sq(r)} = ${num(ends, 1)} cm²) or of the curved surface (2 × ${PI} × ${r} × ${h} = ${num(curved, 1)} cm²)`, `${num(SA, 1)} cm²`],
            notes: `Follow-through from the radius used in part a. Leaving out one or both circular ends (${num(SA - pi * r * r, 1)} or ${num(curved, 1)} cm²) earns the first mark only.`,
          },
        ],
      };
    }),

    // ================================================================ worded problems (2 x 4 marks)

    // Q10. L-shaped lawn: perimeter (edging), area, cost of turf (TY10 Q4a and Q5: composite perimeter and area). All green.
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
        fig: F.composite({ pts, sides: 'auto', unit: 'm', hide: [2, 3], size: 48, maxH: 24 }),
        formula: `Area of a rectangle: ${nw(`${it('A')} = ${it('lb')}`)}`,
        parts: [
          {
            text: 'Garden edging is laid around the outside of the lawn. How many metres of edging are needed?', marks: 1, level: 'green', space: 24,
            answer: unit(P, 'm'),
            working: [`Missing sides: ${W} − ${t} = ${missX} m and ${H} − ${a} = ${missY} m`, `${it('P')} = ${W} + ${a} + ${missX} + ${missY} + ${t} + ${H}`],
            marking: [`${P} m`],
          },
          {
            text: 'Find the area of the lawn.', marks: 2, level: 'green', space: 34,
            answer: unit(A, 'm²'),
            working: [`Bottom rectangle: ${W} × ${a} = ${A1} m²`, `Top rectangle: ${t} × ${missY} = ${A2} m²`, `Area = ${A1} + ${A2}`],
            marking: [`splits the lawn into two rectangles with correct areas (${A1} m² and ${A2} m², or ${W * H} m² − ${missX * missY} m²)`, `${A} m²`],
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

    // Q11. Water trough: trapezium end, volume of the prism, capacity in litres (TY10 Q15 lunchbox and Q14 fish tank).
    q(() => {
      const a = 64, b = 46, h = 40, len = 150, s = (a - b) / 2;
      const A = (h * (a + b)) / 2, V = A * len, L = V / 1000;
      const face = [[0, 0], [b, 0], [b + s, h], [-s, h]];
      const hx = b / 2;
      return {
        type: 'worded', src: 'TY10 Q6d (green), Q15 and Q14 (blue), Q1i (green)', topic: 'Prism volume and capacity (water trough)',
        text: `A farmer’s water trough is a prism ${unit(len, 'cm')} long, open at the top. Its end is a trapezium with the measurements shown.`,
        fig: prismExtras(openTop(F.prism({
          face, len, sides: [unit(b, 'cm'), '', '', ''], lenLabel: unit(len, 'cm'), lenAt: 1,
          dash: [[[hx, 0], [hx, h], unit(h, 'cm')]], size: 72, maxH: 40,
        })), face, { mark: [[hx, 0], [hx, 1], [hx + 1, 0]], topLabel: unit(a, 'cm') }),
        parts: [
          {
            text: 'Find the area of the trapezium-shaped end of the trough.', marks: 2, level: 'green', space: 50,
            formula: `Trapezium: ${nw(`${it('A')} = ${HALF}${it('h')}(${it('a')} + ${it('b')})`)}`,
            answer: unit(A, 'cm²'),
            working: [`${it('A')} = ${HALF} × ${h} × (${a} + ${b})`, `= ${HALF} × ${h} × ${a + b}`],
            marking: [`correct substitution: ${HALF} × ${h} × (${a} + ${b})`, `${num(A)} cm²`],
          },
          {
            text: 'Find the volume of the trough in cm³.', marks: 1, level: 'blue', space: 36,
            formula: `Volume of a prism: ${nw(`${it('V')} = ${it('A')} × ${it('l')}`)}<br>(${it('A')} = area of the end, ${it('l')} = length of the prism)`,
            answer: unit(V, 'cm³'),
            working: [`${it('V')} = ${num(A)} × ${len}`],
            marking: [`${num(V)} cm³`],
            notes: 'Follow-through from part a.',
          },
          {
            text: 'How many litres of water does the trough hold when it is full?', marks: 1, level: 'green', space: 36,
            formula: '1 L = 1000 cm³',
            answer: unit(L, 'L'),
            working: [`${num(V)} ÷ 1000`],
            marking: [`${num(L)} L`],
            notes: 'Follow-through from part b.',
          },
        ],
      };
    }),
  ],
};
