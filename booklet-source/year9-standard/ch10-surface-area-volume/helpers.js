// Answer and question helpers shared by the Chapter 10 lessons (lessons/*.js). Every answer is calculated with these.
const { fmt, F } = require('../../lib/calc');

const PI = Math.PI;
// 1234.5 → '1 234.5'; dp fixes the number of decimal places (31.4159, 1 → '31.4'; 25, 1 → '25.0')
const num = (v, dp) => {
  if (dp === undefined) return fmt(+(+v).toPrecision(12), 9);
  const [i, d] = Math.abs(+v).toFixed(dp).split('.');
  return `${v < 0 ? '−' : ''}${fmt(+i)}${d ? `.${d}` : ''}`;
};
// a value with its unit: u(40, 'cm²') → '40 cm²'
const u = (v, unit, dp) => `${num(v, dp)} ${unit}`;

// Metric units, each as a multiple of its base unit (m, g, L, s, B).
const UNIT = {
  km: 1e3, m: 1, cm: 1e-2, mm: 1e-3, Mm: 1e6, 'μm': 1e-6,
  t: 1e6, kg: 1e3, g: 1, mg: 1e-3,
  kL: 1e3, L: 1, mL: 1e-3, ML: 1e6,
  day: 86400, h: 3600, min: 60, s: 1, ms: 1e-3, 'μs': 1e-6,
  B: 1, kB: 1e3, MB: 1e6, GB: 1e9, TB: 1e12,
};
const NAME = { day: 'days', h: 'h', min: 'min' };
// conv(2.5, 'km', 'm') → 2500
const conv = (v, a, b) => +((v * UNIT[a]) / UNIT[b]).toPrecision(12);
// A conversion question and its answer: '2.5 km to m' and '2 500 m'
const cq = ([v, a, b]) => `${num(v)} ${NAME[a] || a} to ${NAME[b] || b}`;
const ca = ([v, a, b]) => u(conv(v, a, b), NAME[b] || b);

// Measurement: the precision of a measurement is the place value of its last digit; absolute error is half of it.
const decimals = (s) => (String(s).split('.')[1] || '').length;
const precisionOf = (s) => 10 ** -decimals(s);
const absErr = (p) => +(p / 2).toPrecision(12);
// A measurement written as text ('3.6 cm'): its value, unit, precision and absolute error.
const meas = (s) => { const [v, ...rest] = String(s).split(' '); const p = precisionOf(v); return { v: +v, unit: rest.join(' '), p, e: absErr(p) }; };
const prec = (s) => u(meas(s).p, meas(s).unit);
const aerr = (s) => u(meas(s).e, meas(s).unit);
// The smallest and largest possible true value (e: an absolute error other than half the last place)
const limits = (s, e) => { const m = meas(s), E = e ?? m.e; return `${u(m.v - E, m.unit)} to ${u(m.v + E, m.unit)}`; };
// Percentage error = absolute error ÷ measurement × 100
const pctErr = (e, m) => (e / m) * 100;

// Circles. dp = 1 unless the question says otherwise.
const circ = (r) => 2 * PI * r;
const area = (r) => PI * r * r;

const pairs = (list, q, a) => ({ items: list.map((x) => q(x)), ans: list.map((x) => a(x)) });
// A round of short questions, four to a row, each with an answer line: round(text, values, value => question, value => answer)
const round = (text, list, q, a, o = {}) => ({ text, ...pairs(list, q, a), cols: 4, ...o });
// A round of word problems, two to a row, each with a working box: problems(text, [[question, answer], ..])
const problems = (text, list, o = {}) => ({ text, items: list.map((x) => x[0]), ans: list.map((x) => x[1]), cols: 2, work: true, ...o });
// Mixed practice questions: mix([question, answer, from, work?], ..)
const mix = (...list) => list.map(([q, a, from, work]) => ({ q, a, from, work }));

module.exports = { fmt, F, PI, num, u, UNIT, conv, cq, ca, decimals, precisionOf, absErr, meas, prec, aerr, limits, pctErr, circ, area, round, problems, mix };
