// Extension 10.7 Areas of circles and sectors: a ring-shaped path, a tile with its corners cut away, pizza value and a
// goat on a rope. Review: 10.6 (a semicircle's radius from its perimeter) and 10.4 (a path round a lawn).
const { num, PI } = require('../../ch10-surface-area-volume/helpers');
const S = require('../shapes');

const d1 = (v) => num(v, 1);
// 1: a pond of radius 4 m with a path 1.5 m wide round it
const path1 = PI * (5.5 ** 2 - 4 ** 2), lily = PI * 1.5 ** 2;
// 2: a 10 cm tile with a quarter circle of radius 5 cm at each corner
const tile = 100 - PI * 25;
// 3: a 30 cm pizza for $18 and a 20 cm pizza for $9: cents per cm²
const big = PI * 15 ** 2, small = PI * 10 ** 2, cBig = 1800 / big, cSmall = 900 / small;
// 4: a semicircle with perimeter 36 cm: r(π + 2) = 36
const rS = 36 / (PI + 2), aS = (PI * rS ** 2) / 2;
// 5: a 12 m by 9 m lawn with a 1 m path round it, paved at $55 per m²
const lawn = 14 * 11 - 12 * 9;
// 6: a goat on a 5 m rope: half a circle by a fence, three-quarters at the corner of a shed
const half = (PI * 25) / 2, three = (3 * PI * 25) / 4;

module.exports = {
  rows: [
    { cols: '1fr 1fr', g: 1.12, qs: [
      { type: 'R', stars: 2, t: 'A circular pond with a radius of 4 m has a path 1.5 m wide around it.',
        parts: ['Find the area of the path.', 'Lily says the path’s area is π × 1.5². Explain why she is wrong.'],
        fig: S.ringPath({ r: 4, w: 1.5, k: 2.5, rLab: '4 m', wLab: '1.5 m' }), ans: ['a'], lines: [['b', 2]],
        key: `a ${d1(path1)} m² (π × 5.5² − π × 4²: the big circle has radius 4 + 1.5 = 5.5 m) b π × 1.5² is a circle of radius 1.5 m (only ${d1(lily)} m²); the path is the big circle minus the pond.` },
      { type: 'U', stars: 2, t: 'A square tile of side 10 cm has a quarter circle of radius 5 cm at each corner.',
        parts: ['Find the area of the shaded part.', 'What percentage of the tile is shaded?'],
        fig: S.squareQuads({ s: 10, k: 2.5, lab: '10 cm' }), ans: ['a', 'b'],
        key: `a ${d1(tile)} cm² (100 − 4 × ¼ × π × 5² = 100 − 25π) b ${d1(tile)}% (${d1(tile)} out of 100 cm²)` },
    ] },
    { cols: '1fr 1fr', g: 1, qs: [
      { type: 'R', stars: 2, t: 'A large pizza has a diameter of 30 cm and costs $18. A small pizza has a diameter of 20 cm and costs $9.',
        parts: ['Find the area of each pizza.', 'Which pizza is better value for money? Show your reasoning.'],
        ans: ['a'], lines: [['b', 2]],
        key: `a large ${d1(big)} cm², small ${d1(small)} cm² b The large: it costs ${d1(cBig)} cents per cm², the small ${d1(cSmall)} cents per cm² (or: it has 2.25 times the area for only twice the price).` },
      { type: 'U', stars: 3, from: '10.6', t: 'A semicircle has a perimeter of 36 cm. (Perimeter = curved part + diameter.)',
        parts: ['Find its radius r.', 'Find its area.'],
        fig: S.sector({ angle: 180, lab: 'r', show: 'r', size: 30 }), ans: ['a', 'b'],
        key: `a ${d1(rS)} cm (πr + 2r = 36, so r = 36 ÷ (π + 2)) b ${d1(aS)} cm² (½ × π × ${d1(rS)}²)` },
    ] },
    { cols: '1fr 1fr', g: 1, qs: [
      { type: 'PS', stars: 2, from: '10.4', draw: true, t: 'A rectangular lawn 12 m long and 9 m wide has a path 1 m wide all the way around the outside.',
        parts: ['Find the area of the path.', 'Paving costs $55 per square metre. Find the cost of paving the path.'],
        ans: ['a', 'b'],
        key: `a ${lawn} m² (the outside is 14 m by 11 m: 154 − 108) b $${lawn * 55} (${lawn} × $55)` },
      { type: 'PS', stars: 3, draw: true, t: 'A goat is tied to a post by a rope 5 m long.',
        parts: ['The post is halfway along a long straight fence. What area of grass can the goat reach?', 'The post is moved to the outside corner of a large shed, so the goat can walk three-quarters of the way around the post. Find the new area.'],
        ans: ['a', 'b'],
        key: `a ${d1(half)} m² (a semicircle: ½ × π × 5²) b ${d1(three)} m² (¾ × π × 5²)` },
    ] },
  ],
};
