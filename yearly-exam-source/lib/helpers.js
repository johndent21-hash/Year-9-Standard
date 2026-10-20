// Number and text helpers for question files. Every answer in a section file is calculated with these from the
// numbers in the question, so the exam and the marking guide always agree.
//
// NSW / Australian conventions: $ amounts, metric units, a space between thousands for numbers of 5 or more digits
// (12 500, $420 000; but 2500 and $1640), "correct to 1 decimal place".

// The thousands separator (12 500, $420 000, 0.000 724). A no-break space (U+00A0): it never breaks across lines, and
// it is about 0.2 em wide in Caladea/Cambria. (The narrow no-break space U+202F is only 0.11 em in Caladea, so
// '$11 540' looked like '$11540' in the PDF.) The name NNBSP is kept for section files that import it.
const NNBSP = '\u00a0';
const NBSP = ' ';  // no-break space: between a number and its unit

// Group the digits of an integer string in threes. Numbers with 4 digits are not grouped unless force is true.
const group = (s, force = false) => {
  const neg = s.startsWith('-');
  const d = neg ? s.slice(1) : s;
  if (d.length < 5 && !force) return s;
  return (neg ? '-' : '') + d.replace(/\B(?=(\d{3})+(?!\d))/g, NNBSP);
};

// round(3.14159, 2) -> 3.14 (a number). Rounds half away from zero, and fixes binary errors (1.005 -> 1.01).
const round = (x, n = 0) => {
  const f = 10 ** n;
  const v = Math.abs(x) * f;
  const r = Math.round(+(v.toPrecision(12)));
  return (Math.sign(x) || 1) * r / f;
};

// num(12500) -> "12 500"; num(3.14159, 2) -> "3.14"; num(2.5) -> "2.5" (no rounding when n is omitted, at most
// 6 decimal places). opts.force groups 4-digit numbers too; opts.minus uses a true minus sign (default true).
const num = (x, n, opts = {}) => {
  let s;
  if (n === undefined) s = String(+(+x).toFixed(6));
  else s = round(x, n).toFixed(n);
  const neg = s.startsWith('-');
  if (neg) s = s.slice(1);
  const [i, d] = s.split('.');
  const out = group(i, opts.force) + (d ? `.${d}` : '');
  return neg && +s !== 0 ? (opts.minus === false ? '-' : '−') + out : out;
};

// Group the decimal places in threes, as NSW textbooks print small numbers: groupDec('0.000724') -> '0.000 724'.
// Takes a number or a numeric string (a string keeps its digits exactly as written).
const groupDec = (x) => { const [i, d] = String(x).split('.'); return d ? `${i}.${d.replace(/(\d{3})(?=\d)/g, `$1${NNBSP}`)}` : i; };

// dp(x, n): exactly n decimal places, grouped: dp(41.5698, 1) -> "41.6", dp(2, 2) -> "2.00".
const dp = (x, n) => num(x, n);

// money(1640) -> "$1640"; money(577.5) -> "$577.50"; money(12500) -> "$12 500"; money(x, 2) always shows cents;
// money(x, 0) rounds to whole dollars. Negative amounts: "−$45.20".
const money = (x, n) => {
  const whole = Math.abs(round(x, 2) - Math.round(x)) < 1e-9;
  const places = n === undefined ? (whole ? 0 : 2) : n;
  const s = num(Math.abs(x), places);
  return `${x < 0 ? '−' : ''}$${s}`;
};

// unit(41.57, 'cm²', 1) -> "41.6 cm²" (no-break space before the unit). Without n the number is not rounded.
const unit = (x, u, n) => `${typeof x === 'string' ? x : num(x, n)}${NBSP}${u}`;

// Common unit strings (plain Unicode, so they copy into Word as text).
const U = { mm: 'mm', cm: 'cm', m: 'm', km: 'km', mm2: 'mm²', cm2: 'cm²', m2: 'm²', km2: 'km²', mm3: 'mm³', cm3: 'cm³', m3: 'm³', mL: 'mL', L: 'L', kL: 'kL', ML: 'ML', ha: 'ha', g: 'g', kg: 'kg', t: 't' };

const pi = Math.PI;
const PI = 'π';
const TIMES = '×';
const DIV = '÷';
const MINUS = '−';
const HALF = '½';
const DEG = '°';

// Italic variable(s): v('x') -> <i>x</i>. Use for pronumerals in text: `Find ${v('x')}.`
const v = (s) => `<i>${s}</i>`;
// No-wrap span: keeps a short expression on one line in the PDF (ignored in Word).
const nw = (s) => `<span class="nw">${s}</span>`;
// Stacked fraction: frac(3, 4), frac('2<i>x</i>', 5). Becomes a real (editable) equation fraction in Word.
const frac = (a, b) => `<span class="fr"><span class="fn">${a}</span><span class="fd">${b}</span></span>`;
// Superscript power: pow('<i>x</i>', 3) -> x³ as <sup>. (For units prefer cm², cm³.)
const pow = (base, e) => `${base}<sup>${e}</sup>`;
// Degrees: deg(35) -> "35°"; deg(35.2, 1) -> "35.2°".
const deg = (x, n) => `${num(x, n)}°`;
// Join a data set for display: list([5, 3, 8]) -> "5, 3, 8"; list(a, '   ') spaces them out like the textbook.
const list = (arr, sep = ', ') => arr.map((x) => (typeof x === 'number' ? num(x) : x)).join(sep);
// Bold text.
const b = (s) => `<b>${s}</b>`;

// ---------- statistics (Chapter 9) ----------
const sum = (a) => a.reduce((s, x) => s + x, 0);
const sorted = (a) => [...a].sort((p, q) => p - q);
const mean = (a) => sum(a) / a.length;
const median = (a) => {
  const s = sorted(a), n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
};
// modes([...]) -> array of the most frequent value(s); [] when every value occurs once.
const modes = (a) => {
  const c = new Map();
  a.forEach((x) => c.set(x, (c.get(x) || 0) + 1));
  const top = Math.max(...c.values());
  if (top === 1 && a.length > 1) return [];
  return sorted([...c.keys()].filter((k) => c.get(k) === top));
};
const mode = (a) => modes(a)[0];
const range = (a) => Math.max(...a) - Math.min(...a);
// Quartiles by the textbook method: the median of the lower half and of the upper half (middle value left out when
// n is odd). Returns { q1, q2, q3, iqr }.
const quartiles = (a) => {
  const s = sorted(a), n = s.length, h = Math.floor(n / 2);
  const lo = s.slice(0, h), hi = s.slice(n % 2 ? h + 1 : h);
  const q1 = median(lo), q3 = median(hi);
  return { q1, q2: median(s), q3, iqr: q3 - q1 };
};
// Expand a frequency table: expand([0, 1, 2], [5, 9, 7]) -> [0,0,0,0,0,1,...].
const expand = (values, freqs) => values.flatMap((x, i) => Array(freqs[i]).fill(x));
// Frequency table summary: { n, fx: [..], sumFx, mean } from values and frequencies.
const freqStats = (values, freqs) => {
  const fx = values.map((x, i) => x * freqs[i]);
  const n = sum(freqs), sumFx = sum(fx);
  return { n, fx, sumFx, mean: sumFx / n };
};
// Count how often each value occurs: counts([3, 1, 3]) -> Map {1 => 1, 3 => 2}.
const counts = (a) => { const c = new Map(); sorted(a).forEach((x) => c.set(x, (c.get(x) || 0) + 1)); return c; };

// ---------- measurement (Chapter 10) ----------
const hyp = (a, c) => Math.sqrt(a * a + c * c);          // Pythagoras: hypotenuse from the two shorter sides
const leg = (h, a) => Math.sqrt(h * h - a * a);          // Pythagoras: a shorter side from the hypotenuse and the other side
const rad = (d) => (d * pi) / 180;
const sinD = (d) => Math.sin(rad(d));
const cosD = (d) => Math.cos(rad(d));
const tanD = (d) => Math.tan(rad(d));
const asinD = (x) => (Math.asin(x) * 180) / pi;
const acosD = (x) => (Math.acos(x) * 180) / pi;
const atanD = (x) => (Math.atan(x) * 180) / pi;
// Degrees and minutes: dms(35.2667) -> "35°16′".
const dms = (d) => { let D = Math.floor(d), M = Math.round((d - D) * 60); if (M === 60) { D += 1; M = 0; } return `${D}°${String(M).padStart(2, '0')}′`; };

// The question builder pattern: wrap a question in q(() => { ...numbers...; return {...} }) so its numbers stay local.
const q = (f) => f();

module.exports = {
  NNBSP, NBSP, group, groupDec, round, num, dp, money, unit, U, pi, PI, TIMES, DIV, MINUS, HALF, DEG, v, nw, frac, pow, deg, list, b,
  sum, sorted, mean, median, modes, mode, range, quartiles, expand, freqStats, counts,
  hyp, leg, rad, sinD, cosD, tanD, asinD, acosD, atanD, dms, q,
};
