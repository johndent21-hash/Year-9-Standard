// Extension 10.8 Surface area of a prism: a tent (Pythagoras' theorem for the slant), a prism whose missing lengths
// are worked out first, boxes with the same volume, an open box folded from card and painting a room.
// Review: 10.7 (a segment of a quarter circle).
const { num, PI } = require('../../ch10-surface-area-volume/helpers');
const S = require('../shapes');

const d1 = (v) => num(v, 1);
const box = (l, w, h) => 2 * (l * w + l * h + w * h);
// 1: a tent 4 m long with isosceles ends, base 3 m and height 2 m, and a floor
const sT = Math.hypot(1.5, 2), tent = 2 * (0.5 * 3 * 2) + 4 * (sT + sT + 3);
// 2: a prism 4 cm long whose front is an 8 by 6 rectangle with a 3 by 4 notch at the bottom left
const aL = 8 * 6 - 3 * 4, pL = 5 + 6 + 8 + 2 + 3 + 4, sL = 2 * aL + pL * 4;
// 3: the segment of a quarter circle of radius 6 cm
const seg = (PI * 36) / 4 - (6 * 6) / 2;
// 5: a 30 cm by 20 cm card with 5 cm squares cut from the corners
const [bl, bw, bh] = [30 - 10, 20 - 10, 5], open = bl * bw + 2 * bl * bh + 2 * bw * bh;
// 6: a room 5 m by 4 m by 2.7 m: four walls and the ceiling, less a door and a window; 12 m² per litre, two coats
const walls = 2 * (5 + 4) * 2.7, paint = walls + 5 * 4 - 2 * 0.9 - 1.5 * 1.2, litres = (2 * paint) / 12;

module.exports = {
  rows: [
    { cols: '1fr 1fr', g: 1.05, qs: [
      { type: 'PS', stars: 2, t: 'A tent is a triangular prism with a floor. Its ends are isosceles triangles.',
        parts: ['Use Pythagoras’ theorem to find the slant length s.', 'Find the area of canvas needed to make the tent, floor included.'],
        fig: S.prism2({ face: [[0, 0], [3, 0], [1.5, 2]], len: 4, sides: ['3 m', '', 's'], dash: [[[1.5, 2], [1.5, 0]]], labels: [['2 m', 1.62, 0.42, { anchor: 'start' }]], marks: [[[1.5, 0], [1.5, 1], [2.5, 0]]], lenLabel: '4 m', size: 36, maxH: 26 }),
        ans: ['a', 'b'],
        key: `a s = ${num(sT)} m (√(1.5² + 2²)) b ${num(tent)} m² (two ends 2 × ½ × 3 × 2 = 6, then 4 × (${num(sT)} + ${num(sT)} + 3) = ${num(tent - 6)})` },
      { type: 'U', stars: 3, t: 'Some lengths of this prism are not marked. Work them out first.',
        parts: ['Find the area of the front face.', 'Find the perimeter of the front face.', 'Find the surface area of the prism.'],
        fig: S.prism2({ face: [[3, 0], [8, 0], [8, 6], [0, 6], [0, 4], [3, 4]], len: 4, sides: ['5 cm', '', '', '2 cm'], labels: [['3 cm', 1.5, 3.45], ['4 cm', 2.75, 1.1, { anchor: 'end' }]], lenLabel: '4 cm', size: 34 }),
        ans: ['a', 'b', 'c'],
        key: `a ${aL} cm² (8 × 6 − 3 × 4) b ${pL} cm (the top is 3 + 5 = 8 cm and the right side 2 + 4 = 6 cm) c ${sL} cm² (2 × ${aL} + ${pL} × 4)` },
    ] },
    { cols: '1fr 1fr', g: 1, qs: [
      { type: 'U', stars: 2, from: '10.7', t: 'A straight cut across a quarter circle of radius 6 cm makes the shaded segment. Find the area of the segment.',
        fig: S.segment({ r: 6, k: 3.3, lab: '6 cm' }), ans: ['Area ='],
        key: `${d1(seg)} cm² (quarter circle ¼ × π × 6² = ${d1((PI * 36) / 4)}, minus the triangle ½ × 6 × 6 = 18)` },
      { type: 'R', stars: 2, t: 'Box A measures 2 cm × 3 cm × 4 cm. Box B measures 1 cm × 4 cm × 6 cm.',
        parts: ['Show that the two boxes have the same volume.', 'Find the surface area of each box.', 'Which box needs less cardboard? Why might a company choose it?'],
        ans: ['a', 'b'], lines: [['c', 2]],
        key: `a both 24 cm³ b A ${box(2, 3, 4)} cm², B ${box(1, 4, 6)} cm² c Box A: it holds the same amount but uses ${box(1, 4, 6) - box(2, 3, 4)} cm² less card, so it costs less to make.` },
    ] },
    { cols: '1fr 1fr', g: 1.15, qs: [
      { type: 'R', stars: 2, t: 'An open box (no lid) is made from a card 30 cm by 20 cm: a 5 cm square is cut from each corner and the sides are folded up.',
        parts: ['Find the length, width and height of the box.', 'Find the outside surface area of the box.', 'Explain a quick way to get the answer to b from the card.'],
        fig: S.cardNet({ L: 30, W: 20, s: 5, k: 0.95, labL: '30 cm', labW: '20 cm', labS: '5 cm' }), ans: ['a', 'b'], lines: [['c', 1]],
        key: `a ${bl} cm × ${bw} cm × ${bh} cm b ${open} cm² (${bl * bw} + 2 × ${bl * bh} + 2 × ${bw * bh}) c It is the card less the four squares: 30 × 20 − 4 × 5² = ${30 * 20 - 100} cm².` },
      { type: 'PS', stars: 3, draw: true, t: 'A room is 5 m long, 4 m wide and 2.7 m high. Its four walls and the ceiling are painted. There is a door 2 m by 0.9 m and a window 1.5 m by 1.2 m.',
        parts: ['Find the area to be painted.', '1 L of paint covers 12 m². How many 4 L tins are needed for two coats?'],
        ans: ['a', 'b'],
        key: `a ${num(paint)} m² (walls 2 × (5 + 4) × 2.7 = ${num(walls)}, ceiling 20, less the door 1.8 and the window 1.8) b ${Math.ceil(litres / 4)} tins (two coats: ${num(2 * paint)} m² ÷ 12 = ${d1(litres)} L)` },
    ] },
  ],
};
