// Extension 10.10 Volumes of prisms and cylinders: a 1 L cylinder, changing the radius and height, a sloping pool,
// a cube melted into a cylinder and rain filling a tank. Review: 10.9 (surface areas), 10.1 (mm, m³ and L) and
// 10.7 (a rectangle with a semicircle).
const { num, PI } = require('../../ch10-surface-area-volume/helpers');
const S = require('../shapes');

const d1 = (v) => num(v, 1);
const cyl = (r, h) => PI * r * r * h;
// 1: a cylinder of radius 5 cm holding 1 L, then 2 L
const h1 = 1000 / (PI * 25), h2 = 2000 / (PI * 25);
// 3: a pool 25 m long and 10 m wide, 2.5 m deep at one end and 1 m at the other; filled at 250 L a minute
const side = ((1 + 2.5) / 2) * 25, litres = side * 10 * 1000, mins = litres / 250;
// 4: a 6 cm cube made into a cylinder of radius 3 cm
const hc = 216 / (PI * 9), sc = 2 * PI * 9 + 2 * PI * 3 * hc;
// 5: 15 mm of rain on a 12 m by 8 m roof, into a tank 2 m across
const rain = 12 * 8 * 0.015, rise = rain / (PI * 1 ** 2);
// 6: a 10 cm by 6 cm rectangle with a semicircle on one end, the cross-section of a prism 20 cm long
const a6 = 10 * 6 + (PI * 3 ** 2) / 2;

module.exports = {
  rows: [
    { cols: '1fr 1fr', g: 1.05, qs: [
      { type: 'U', stars: 2, t: 'This cylinder holds exactly 1 L of water when it is full. (1 L = 1000 cm³)',
        parts: ['Find its height h.', 'How tall would a 2 L cylinder with the same radius be?'],
        fig: S.cylinder({ r: 5, h: h1, lab: '5 cm', hLab: 'h', size: 18, maxH: 26 }), ans: ['a', 'b'],
        key: `a ${d1(h1)} cm (1000 ÷ (π × 5²)) b ${d1(h2)} cm (twice as tall)` },
      { type: 'R', stars: 2, t: 'A cylinder has radius 4 cm and height 10 cm.',
        parts: ['Find its volume.', 'Find the volume when the radius is doubled and the height is halved.', 'What happens to the volume? Explain why.'],
        ans: ['a', 'b'], lines: [['c', 2]],
        key: `a ${d1(cyl(4, 10))} cm³ b ${d1(cyl(8, 5))} cm³ (r = 8, h = 5) c It doubles: doubling r makes r² four times as big, and halving h halves that.` },
    ] },
    { cols: '1.1fr 1fr', g: 1.05, qs: [
      { type: 'PS', stars: 3, t: 'A swimming pool is 25 m long and 10 m wide. The diagram shows its side: it is 2.5 m deep at one end and 1 m deep at the other.',
        parts: ['Find the area of the side of the pool (a trapezium).', 'Find the volume of the pool in litres. (1 m³ = 1000 L)', 'A pump fills the pool at 250 L per minute. How long does it take, in hours and minutes?'],
        fig: S.shape({ pts: [[0, 0], [25, 4.5], [25, 7.5], [0, 7.5]], sides: ['', '1 m', '25 m', '2.5 m'], right: [2, 3], size: 33, maxH: 13,
          labels: [['Side view, not to scale', 25, -2.2, { anchor: 'end', size: 2.4, fill: '#7d7a70' }]] }),
        ans: ['a', 'b', 'c'],
        key: `a ${num(side)} m² (½ × (2.5 + 1) × 25) b ${num(litres)} L (${num(side * 10)} m³) c ${Math.floor(mins / 60)} h ${mins % 60} min (${num(litres)} ÷ 250 = ${num(mins)} minutes)` },
      { type: 'R', stars: 2, from: '10.9', t: 'A metal cube with edges of 6 cm is melted down and made into a cylinder with a radius of 3 cm.',
        parts: ['Find the height of the cylinder.', 'Do the cube and the cylinder have the same surface area? Show your working.'],
        ans: ['a', 'b'],
        key: `a ${d1(hc)} cm (the volume stays 216 cm³: h = 216 ÷ (π × 3²)) b No: the cube’s is 216 cm², the cylinder’s ${d1(sc)} cm².` },
    ] },
    { cols: '1fr 1fr', g: 1.1, qs: [
      { type: 'PS', stars: 3, from: '10.1', draw: true, t: '15 mm of rain falls on a flat roof 12 m long and 8 m wide. All of it runs into a cylindrical tank 2 m across.',
        parts: ['How many litres of water fall on the roof?', 'How many centimetres does the water in the tank rise?'],
        ans: ['a', 'b'],
        key: `a ${num(rain * 1000)} L (15 mm = 0.015 m: 12 × 8 × 0.015 = ${num(rain)} m³) b ${d1(rise * 100)} cm (${num(rain)} ÷ (π × 1²) = ${num(rise, 3)} m)` },
      { type: 'U', stars: 2, from: '10.7', t: 'This shape is a rectangle with a semicircle on one end.',
        parts: ['Find its area.', 'The shape is the cross-section of a prism 20 cm long. Find the volume of the prism.'],
        fig: S.rectSemi({ l: 10, w: 6, ends: 1, labL: '10 cm', labW: '6 cm', size: 32 }), ans: ['a', 'b'],
        key: `a ${d1(a6)} cm² (10 × 6 + ½ × π × 3²) b ${d1(a6 * 20)} cm³ (${d1(a6)} × 20)` },
    ] },
  ],
};
