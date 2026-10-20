// Answer and question helpers shared by the Chapter 11 lessons (lessons/*.js). Every answer is calculated with these.
const { num, u } = require('../ch10-surface-area-volume/helpers');

const n = (v) => num(+(+v).toFixed(6));                       // −3, 2.5
const P = ([x, y]) => `(${n(x)}, ${n(y)})`;                   // (2, −3)
const par = (v) => (v < 0 ? `(${n(v)})` : n(v));               // a negative in brackets, for a substitution
const sq = (v) => `${par(v)}²`;
const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const grad = (a, b) => (b[1] - a[1]) / (b[0] - a[0]);
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const VULGAR = { '1/2': '½', '1/3': '⅓', '2/3': '⅔', '1/4': '¼', '3/4': '¾', '1/5': '⅕', '2/5': '⅖', '3/5': '⅗', '4/5': '⅘' };
// p/q in lowest terms as text: frac(6, 8) → '¾', frac(-4, 2) → '−2', frac(5, 3) → '5/3'
const frac = (p, q) => {
  if (q < 0) { p = -p; q = -q; }
  const g = gcd(p, q) || 1, a = p / g, b = q / g, s = a < 0 ? '−' : '';
  if (b === 1) return `${s}${Math.abs(a)}`;
  return `${s}${VULGAR[`${Math.abs(a)}/${b}`] || `${Math.abs(a)}/${b}`}`;
};
// A length: whole numbers as they are, otherwise √(sum) and the value correct to one decimal place
const lenAns = (d2) => (Number.isInteger(Math.sqrt(d2)) ? n(Math.sqrt(d2)) : `√${n(d2)} = ${num(Math.sqrt(d2), 1)}`);
// Working for the distance formula: d = √((6 − 2)² + (7 − 4)²) = √(16 + 9) = 5
const distWork = (a, b) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], d2 = dx * dx + dy * dy;
  return `d = √((${n(b[0])} − ${par(a[0])})² + (${n(b[1])} − ${par(a[1])})²) = √(${sq(dx)} + ${sq(dy)}) = √${n(d2)}${Number.isInteger(Math.sqrt(d2)) ? ` = ${n(Math.sqrt(d2))}` : ` = ${num(Math.sqrt(d2), 1)}`}`;
};
const midWork = (a, b) => `M = ((${n(a[0])} + ${par(b[0])}) ÷ 2, (${n(a[1])} + ${par(b[1])}) ÷ 2) = ${P(mid(a, b))}`;
const gradWork = (a, b) => `m = (${n(b[1])} − ${par(a[1])}) ÷ (${n(b[0])} − ${par(a[0])}) = ${n(b[1] - a[1])} ÷ ${n(b[0] - a[0])} = ${frac(b[1] - a[1], b[0] - a[0])}`;
// The term mx as text: 2x, −x, ½x, x
const mx = (p, q = 1, x = 'x') => { const s = frac(p, q); return s === '1' ? x : s === '−1' ? `−${x}` : s === '0' ? '' : `${s}${x}`; };
// y = mx + c as text: eq(2, -3) → 'y = 2x − 3'; eq(-1, 4) → 'y = −x + 4'; eq(0, 5) → 'y = 5'; eq([1, 2], 3) → 'y = ½x + 3'
const eq = (m, c, y = 'y', x = 'x') => {
  const [p, q] = Array.isArray(m) ? m : [m, 1], t = mx(p, q, x);
  if (!t) return `${y} = ${n(c)}`;
  return `${y} = ${t}${c === 0 ? '' : c < 0 ? ` − ${n(-c)}` : ` + ${n(c)}`}`;
};
// Each question: [picture, answer, caption?, own formula?]. A round of formula questions from such a list, with the round's
// formula printed (a string) or left for students to write (true)
const formFig = (list, form, lines) => ({ items: list.map(([fig, , t = '', own]) => ({ t, fig, form: own || form, ...(lines ? { lines } : {}) })), ans: list.map((x) => x[1]) });
// A Medium question: words (and a picture), Formula / Substitute / Answer lines when form, tagged when from
const mq = (t, a, { fig, form = true, from, lines } = {}) => [{ t, ...(fig ? { fig } : {}), ...(form ? { form } : {}), ...(from ? { from } : {}), ...(lines ? { lines } : {}) }, a];
const set = (Q) => ({ text: '', items: Q.map((x) => x[0]), ans: Q.map((x) => x[1]) });

module.exports = { num, u, n, P, par, sq, dist, mid, grad, frac, lenAns, distWork, midWork, gradWork, mx, eq, formFig, mq, set };
