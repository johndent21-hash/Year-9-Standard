// Extension 10.9 Surface area of a cylinder: the height from a curved surface area, a cylinder's net, two cylinders
// with equal curved surfaces, a half-cylinder trough (cm to m) and a pipe. Review: 10.8 (a triangular prism).
const { num, PI } = require('../../ch10-surface-area-volume/helpers');
const S = require('../shapes');

const d1 = (v) => num(v, 1);
// 1: radius 4 cm, curved surface area 301.6 cm²
const h1 = 301.6 / (2 * PI * 4), t1 = 301.6 + 2 * PI * 16;
// 2: the net: a rectangle 37.7 cm by 10 cm and two circles
const r2 = 37.7 / (2 * PI), t2 = 37.7 * 10 + 2 * PI * r2 ** 2;
// 3: P has r = 5, h = 10 and Q has r = 10, h = 5
const tot = (r, h) => 2 * PI * r * r + 2 * PI * r * h, cP = 2 * PI * 5 * 10;
// 4: a half-cylinder trough, radius 0.4 m, length 2 m, open at the top
const curved4 = (2 * PI * 0.4 * 2) / 2, ends4 = PI * 0.4 ** 2;
// 5: a right-angled triangular prism, legs 8 cm and 6 cm, 12 cm long
const hyp = Math.hypot(8, 6), tp = 2 * (0.5 * 8 * 6) + 12 * (8 + 6 + hyp);
// 6: a pipe 50 cm long, outside diameter 10 cm, inside diameter 8 cm
const out6 = PI * 10 * 50, in6 = PI * 8 * 50, ends6 = 2 * PI * (5 ** 2 - 4 ** 2);

module.exports = {
  rows: [
    { cols: '1fr 1fr', g: 1.1, qs: [
      { type: 'U', stars: 2, t: 'The curved surface area of this cylinder is 301.6 cm².',
        parts: ['Find its height h.', 'Find its total surface area (top and bottom included).'],
        fig: S.cylinder({ r: 4, h: 12, lab: '4 cm', hLab: 'h', size: 16, maxH: 30 }), ans: ['a', 'b'],
        key: `a ${d1(h1)} cm (301.6 ÷ (2 × π × 4)) b ${d1(t1)} cm² (301.6 + 2 × π × 4²)` },
      { type: 'R', stars: 2, t: 'This is the net of a cylinder.',
        parts: ['Explain why the rectangle is 37.7 cm long.', 'Find the radius r of each circle.', 'Find the total surface area.'],
        fig: S.cylNet({ L: 37.7, h: 10, r: 6, k: 0.9, labL: '37.7 cm', labH: '10 cm', labR: 'r' }), lines: [['a', 1]], ans: ['b', 'c'],
        key: `a It wraps round the circles, so its length is their circumference. b ${d1(r2)} cm (37.7 ÷ (2π)) c ${d1(t2)} cm² (37.7 × 10 + 2 × π × ${d1(r2)}²)` },
    ] },
    { cols: '1fr 1fr', g: 1, qs: [
      { type: 'R', stars: 2, t: 'Cylinder P has radius 5 cm and height 10 cm. Cylinder Q has radius 10 cm and height 5 cm.',
        parts: ['Show that their curved surface areas are equal.', 'Which cylinder has the greater total surface area, and by how much?', 'Explain why, using the parts of each net.'],
        ans: ['a', 'b'], lines: [['c', 1]],
        key: `a both 2 × π × 5 × 10 = 2 × π × 10 × 5 = ${d1(cP)} cm² b Q, by ${d1(tot(10, 5) - tot(5, 10))} cm² (P ${d1(tot(5, 10))} cm², Q ${d1(tot(10, 5))} cm²) c The rectangles are the same; Q’s two circles are much bigger.` },
      { type: 'PS', stars: 3, draw: true, t: 'A water trough is half a cylinder, open at the top. Its radius is 40 cm and it is 2 m long.',
        parts: ['Find the area of its curved part, in m².', 'The two ends are half circles. Find the total area of metal needed, in m².'],
        ans: ['a', 'b'],
        key: `a ${d1(curved4)} m² (40 cm = 0.4 m: ½ × 2 × π × 0.4 × 2) b ${d1(curved4 + ends4)} m² (the two half circles make one circle: π × 0.4² = ${num(ends4, 2)})` },
    ] },
    { cols: '1fr 1fr', g: 1.1, qs: [
      { type: 'U', stars: 2, from: '10.8', t: 'The ends of this prism are right-angled triangles.',
        parts: ['Use Pythagoras’ theorem to find the missing side of the triangle.', 'Find the surface area of the prism.'],
        fig: S.triPrism(8, 6, 12, ['8 cm', '6 cm', '', '12 cm'], { size: 27 }), ans: ['a', 'b'],
        key: `a ${num(hyp)} cm (√(8² + 6²)) b ${num(tp)} cm² (2 × ½ × 8 × 6 + 12 × (8 + 6 + 10))` },
      { type: 'PS', stars: 3, t: 'A pipe is 50 cm long. Its outside diameter is 10 cm and its inside diameter is 8 cm.',
        parts: ['Find the area of the outside curved surface.', 'Find the area of the inside curved surface.', 'Find the total surface area, including the two ring-shaped ends.'],
        fig: S.pipe({ R: 5, r: 4, len: 50, k: 1.05, labD: '10 cm', labL: '50 cm' }), ans: ['a', 'b', 'c'],
        key: `a ${d1(out6)} cm² (π × 10 × 50) b ${d1(in6)} cm² (π × 8 × 50) c ${d1(out6 + in6 + ends6)} cm² (the ends: 2 × (π × 5² − π × 4²) = ${d1(ends6)})` },
    ] },
  ],
};
