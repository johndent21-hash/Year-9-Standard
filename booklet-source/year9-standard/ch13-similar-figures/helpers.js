// Answer and question helpers shared by the Chapter 13 lessons (lessons/*.js). Every answer is calculated with these.
// Scale factors are whole numbers or fractions in simplest form ('3/2'); lengths carry their units, to one decimal
// place where needed.
const { num, n, fs, fr, pw, parts, mq, set } = require('../ch12-probability/helpers');

// Decimals made whole, so a ratio of lengths simplifies: whole(7.5, 5) → [75, 50]
const whole = (...v) => { const m = 10 ** Math.max(...v.map((x) => (String(x).split('.')[1] || '').length)); return v.map((x) => Math.round(x * m)); };
// A scale factor as text: k(12, 4) → '3', k(7.5, 5) → '3/2'
const k = (img, orig) => fs(...whole(img, orig));
// Its working: sf(12, 4) → '12 ÷ 4 = 3'
const sf = (img, orig) => `${n(img)} ÷ ${n(orig)} = ${k(img, orig)}`;
// A length with its unit, to one decimal place where needed: len(7.5, 'cm') → '7.5 cm', len(20000, 'cm') → '20 000 cm'
const len = (v, unit = '') => `${num(+(+v).toFixed(1))}${unit ? ` ${unit}` : ''}`;
// A side found from the scale factor: up(5, 6, 4, 'cm') → '5 × 3/2 = 7.5 cm' (the side on the larger figure);
// down(9, 6, 4, 'cm') → '9 ÷ 3/2 = 6 cm' (the side on the original)
const up = (side, img, orig, unit) => `${n(side)} × ${k(img, orig)} = ${len((side * img) / orig, unit)}`;
const down = (side, img, orig, unit) => `${n(side)} ÷ ${k(img, orig)} = ${len((side * orig) / img, unit)}`;
// A ratio a : b in simplest form: ratio(12, 18) → '2 : 3'
const ratio = (a, b) => { const x = fr(...whole(a, b)); return `${n(x.p)} : ${n(x.q)}`; };

module.exports = { num, n, fs, fr, pw, parts, mq, set, whole, k, sf, len, up, down, ratio };
