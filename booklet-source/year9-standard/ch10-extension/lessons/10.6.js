// Extension 10.6 Circumference and arc length: reverse problems (θ from an arc, d from a lap), size changes, and a
// rope round a ball. Review: 10.5 (a trapezium's height).
const { num, PI } = require('../../ch10-surface-area-volume/helpers');
const S = require('../shapes');

const d1 = (v) => num(v, 1);
// 1: a sector with radius 9 cm and arc 12.6 cm
const r1 = 9, arc1 = 12.6, C1 = 2 * PI * r1, th1 = (arc1 / C1) * 360;
// 2: a trapezium with area 54 cm² and parallel sides 11 cm and 7 cm
const hT = (2 * 54) / (11 + 7);
// 3: a 400 m track with two 100 m straights; the outside lane's ends are 2.4 m wider
const dT = (400 - 200) / PI, extra = PI * 2.4;
// 4: a minute hand 15 cm long
const arc20 = (20 / 60) * 2 * PI * 15, day = 24 * 2 * PI * 15;
// 5: a semicircle of diameter 16 cm with two semicircles of diameter 8 cm on it
const p6 = (PI * 16) / 2 + 2 * ((PI * 8) / 2);
// 6: a rope 1 m longer round a 24 cm ball
const gap = 100 / (2 * PI);

module.exports = {
  rows: [
    { cols: '1.2fr 1fr', g: 0.9, qs: [
      { type: 'U', stars: 2, t: 'This sector has a radius of 9 cm and an arc length of 12.6 cm.',
        parts: ['Find the circumference of the whole circle.', 'Find the angle θ, to the nearest degree.', 'Find the perimeter of the sector.'],
        fig: S.sectorArc({ angle: 80, rot: 5, R: 17, rLab: '9 cm', arcLab: '12.6 cm', angLab: 'θ' }), ans: ['a', 'b', 'c'],
        key: `a ${d1(C1)} cm (2 × π × 9) b ${Math.round(th1)}° (12.6 ÷ ${d1(C1)} × 360° = ${d1(th1)}°) c ${d1(arc1 + 2 * r1)} cm (12.6 + 9 + 9)` },
      { type: 'U', stars: 1, from: '10.5', t: 'This trapezium has an area of 54 cm². Find its height h.',
        fig: S.trap(11, 7, 6, 2, { sides: ['11 cm', '', '7 cm', ''], hLabel: 'h', size: 34, maxH: 19 }), ans: ['h ='],
        key: `h = ${num(hT)} cm (54 = ½ × (11 + 7) × h, so h = 108 ÷ 18)` },
    ] },
    { cols: '1fr 1fr', g: 1.1, qs: [
      { type: 'PS', stars: 3, draw: true, t: 'A running track has two straight sides, each 100 m long, joined by two semicircular ends. One lap of the inside edge is 400 m.',
        parts: ['Find the diameter of the semicircular ends.', 'The outside lane has the same straights, but its ends have a diameter 2.4 m longer. How much further is one lap of the outside lane?'],
        ans: ['a', 'b'],
        key: `a ${d1(dT)} m (the two ends make one circle: πd = 400 − 200 = 200) b ${d1(extra)} m (π × 2.4: the straights do not change)` },
      { type: 'PS', stars: 2, t: 'The minute hand of a clock is 15 cm long.',
        parts: ['How far does the tip of the minute hand travel in 20 minutes?', 'How far does the tip travel in one whole day? Give your answer in metres.'],
        ans: ['a', 'b'],
        key: `a ${d1(arc20)} cm (20 minutes is ⅓ of a turn: ⅓ × 2 × π × 15) b ${d1(day / 100)} m (24 turns: 24 × ${d1(2 * PI * 15)} = ${d1(day)} cm)` },
    ] },
    { cols: '1fr 1fr', g: 1.2, qs: [
      { type: 'R', stars: 3, t: 'This shape is made from a semicircle with diameter 16 cm and two semicircles with diameter 8 cm.',
        parts: ['Find the perimeter of the shape.', 'Show that it is the same as the circumference of a circle with diameter 16 cm.'],
        fig: S.sCurve({ D: 16, k: 1.9, lab: '16 cm' }), ans: ['a'],
        key: `a ${d1(p6)} cm (½ × π × 16 + 2 × ½ × π × 8 = 8π + 8π) b π × 16 = ${d1(PI * 16)} cm: the two small curves together are as long as the big one.` },
      { type: 'R', stars: 3, draw: true, t: 'A rope fits tightly around a basketball with a diameter of 24 cm. The rope is made 1 m longer and held in a circle, the same distance from the ball all the way round.',
        parts: ['How big is the gap between the rope and the ball?', 'Would the gap be bigger, smaller or the same for a rope 1 m longer than the equator? Explain.'],
        ans: ['a'], lines: [['b', 2]],
        key: `a ${d1(gap)} cm (the radius grows by 100 ÷ (2π)) b The same: the gap is always 100 ÷ (2π) = ${d1(gap)} cm, whatever the size of the circle.` },
    ] },
  ],
};
