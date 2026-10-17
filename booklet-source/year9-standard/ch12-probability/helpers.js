// Answer and question helpers shared by the Chapter 12 lessons (lessons/*.js). Every answer is calculated with these.
// Probabilities are fractions in simplest form (divided by the gcd), written '5/36' (stacked fractions print too small).
const { num, n, formFig, mq, set } = require('../ch11-coordinate-geometry/helpers');

const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
// A fraction in simplest form: fr(6, 8) → { p: 3, q: 4 }
const fr = (p, q) => { const g = gcd(p, q) || 1, s = q < 0 ? -1 : 1; return { p: (s * p) / g, q: (s * q) / g }; };
// As text: fs(6, 8) → '3/4'; a whole number as it is: fs(0, 5) → '0', fs(5, 5) → '1'
const fs = (p, q) => { const x = fr(p, q); return x.q === 1 ? n(x.p) : `${n(x.p)}/${x.q}`; };
// k out of total, then its simplest form if that is different: pw(6, 10) → '6/10 = 3/5'; pw(3, 8) → '3/8'
const pw = (k, total) => { const s = fs(k, total); return s === `${k}/${total}` ? s : `${k}/${total} = ${s}`; };
// An event's probability as working: pe('red', 6, 10) → 'P(red) = 6/10 = 3/5'
const pe = (ev, k, total) => `P(${ev}) = ${pw(k, total)}`;
// The complement: pnot('red', 6, 10) → 'P(not red) = 1 − 3/5 = 2/5'
const pnot = (ev, k, total) => `P(not ${ev}) = 1 − ${fs(k, total)} = ${fs(total - k, total)}`;
// A decimal from a fraction: dec(29, 200) → '0.145'; dp rounds it
const dec = (k, total, dp) => num(k / total, dp);
// A percentage as a fraction in simplest form: pct(40) → '40/100 = 2/5'
const pct = (v) => pw(v, 100);
// A drill question in parts (chapter.parts): each part is [picture, answer, lines (what each line finds), words?]
const parts = (text, list, cols = 2) => ({ text, cols, items: list.map(([fig, , lines, t = '']) => ({ t, ...(fig ? { fig } : {}), form: true, lines })), ans: list.map((x) => x[1]) });

module.exports = { num, n, formFig, mq, set, gcd, fr, fs, pw, pe, pnot, dec, pct, parts };
