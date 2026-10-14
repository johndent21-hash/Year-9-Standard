// Lesson 10.1 Metric units (three pages: Easy with the Notes box, Easy drill, then Medium with Year 8 skills mixed in
// and three worded problems). See lib/lesson-two.js.
// Textbook 10.01. There is no formula, so each conversion question has Rule / Working / Answer lines, with the rule
// (× 1000, ÷ 100, …) printed in the first rounds. Every question is a picture of the thing measured: the given
// measurement on it (a length on a blue measurement line), and the unit to convert to marked '? mm' beside it.
const { num, u, UNIT, conv } = require('../helpers');
const { C, f, T, svg, seg, poly, dot, rightMark, FILL } = require('../shapes').parts;

const RULE = ['Rule', 'Working', 'Answer'];
const G = { size: 3 }, Q = { size: 3, weight: 700 }, BLUE = { stroke: C.blue, w: 0.45 };
// 1000 → '1000', 100 000 → '100 000' (a rule's number)
const big = (n) => (n >= 1e4 ? num(n) : String(+n.toPrecision(12)));
// The rule from unit a to unit b: '× 1000' to a smaller unit, '÷ 100' to a bigger one
const rule = (a, b) => { const k = UNIT[a] / UNIT[b]; return k >= 1 ? `× ${big(k)}` : `÷ ${big(1 / k)}`; };
// The working: '3.5 × 1000 = 3 500 g'
const work = (v, a, b) => `${num(v)} ${rule(a, b)} = ${u(conv(v, a, b), b)}`;

// ---------------------------------------------------------------- drawing bits (mm)
const rect = (x, y, w, h, fill, o = {}) => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}"${o.rx ? ` rx="${f(o.rx)}"` : ''} fill="${fill}" stroke="${o.stroke || C.charcoal}" stroke-width="${f(o.w || 0.4)}"/>`;
const path = (d, fill, o = {}) => `<path d="${d}" fill="${fill}" stroke="${o.stroke || C.charcoal}" stroke-width="${f(o.w || 0.4)}" stroke-linejoin="round"/>`;
const ring = (c, r, fill, o = {}) => `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(r)}" fill="${fill}" stroke="${o.stroke || C.charcoal}" stroke-width="${f(o.w || 0.4)}"/>`;
// An object drawn in its own units at (x, y), s times its drawn size (its outlines stay 0.4 mm)
const at = (x, y, s, body) => `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})">${body}</g>`;
// The width of the bold '? unit' label (size 3), from its letters, so the picture's frame always holds all of it
const CW = { '?': 0.6, ' ': 0.26, m: 0.96, c: 0.54, k: 0.62, g: 0.66, L: 0.61, s: 0.49, i: 0.3, n: 0.65, h: 0.63, M: 0.88, B: 0.69, G: 0.79, 'μ': 0.61 };
const askW = (unit) => 3 * [...`? ${unit}`].reduce((t, ch) => t + (CW[ch] ?? 0.65), 0);
// The picture: its drawing (w by h) with the unknown in bold beside it at (x, y), '? mm'
const pic = (w, h, b, [x, y, unit]) => svg(f(Math.max(w, x + askW(unit) + 0.4)), f(h), b + T(x, y, `? ${unit}`, { ...Q, anchor: 'start' }));
// A measurement line from x0 to x1 at height y (blue, with end ticks), its label under it
const dimH = (x0, x1, y, lab) => seg([x0, y], [x1, y], BLUE) + seg([x0, y - 1], [x0, y + 1], BLUE) + seg([x1, y - 1], [x1, y + 1], BLUE) + T((x0 + x1) / 2, y + 4, lab, G);
// A measurement line up the left of a picture, from y0 to y1, its label to the left of it
const dimV = (x, y0, y1, lab) => seg([x, y0], [x, y1], BLUE) + seg([x - 1, y0], [x + 1, y0], BLUE) + seg([x - 1, y1], [x + 1, y1], BLUE) + T(x - 1.4, (y0 + y1) / 2 + 1.05, lab, { ...G, anchor: 'end' });

// ---------------------------------------------------------------- the pictures: (given label, unit to find, size)
// Lengths: a pencil, a plank, a door (its height) and a route between two map pins, each L mm long on the page
const pencil = (lab, unit, L = 16) => {
  const x1 = 1 + L, tip = x1 - 4.6, h = 4.2, y = 1;
  let b = rect(1, y, 2.2, h, '#f2b8c6', { w: 0.35 }) + rect(3.2, y, 1.8, h, '#d3d7df', { w: 0.35 }) + rect(5, y, tip - 5, h, '#f7dc78', { w: 0.35 });
  b += seg([5, y + h / 2], [tip, y + h / 2], { stroke: '#c9a63e', w: 0.25 });
  b += poly([[tip, y], [x1, y + h / 2], [tip, y + h]], '#f0d9b0', { w: 0.35 }) + poly([[x1 - 1.7, y + h / 2 - 0.78], [x1, y + h / 2], [x1 - 1.7, y + h / 2 + 0.78]], C.charcoal, { w: 0.2 });
  b += dimH(1, x1, y + h + 2.4, lab);
  return pic(x1 + 1, y + h + 7.4, b, [x1 + 2, y + h / 2 + 1.05, unit]);
};
const plank = (lab, unit, L = 17) => {
  const x1 = 1 + L, h = 4.4, y = 1;
  let b = rect(1, y, L, h, '#e6c891', { w: 0.35 }) + seg([4, y + 1.4], [1 + L * 0.45, y + 1.4], { stroke: '#b58f52', w: 0.22 }) + seg([1 + L * 0.55, y + 3], [x1 - 3, y + 3], { stroke: '#b58f52', w: 0.22 });
  b += dimH(1, x1, y + h + 2.4, lab);
  return pic(x1 + 1, y + h + 7.4, b, [x1 + 2, y + h / 2 + 1.05, unit]);
};
// The door's height on a measurement line up its left, the label left of that
const door = (lab, unit, H = 16) => {
  const W = 7, y = 1, xd = 0.3 + lab.length * 3 * 0.58 + 1.4, x = xd + 1.8;
  let b = rect(x, y, W, H, '#dcbc8c') + rect(x + 1.1, y + 1.2, W - 3.2, H * 0.36, 'none', { w: 0.25 }) + rect(x + 1.1, y + H * 0.47, W - 3.2, H * 0.45, 'none', { w: 0.25 });
  b += dot([x + W - 1.1, y + H * 0.53], 0.55) + dimV(xd, y, y + H, lab);
  return pic(x + W + 1, y + H + 1, b, [x + W + 2, y + H / 2 + 1.05, unit]);
};
// A map pin (k times its size) with its tip at (x, y)
const pin = (x, y, k = 1.15) => path(`M${f(x)},${f(y)} L${f(x - 1.5 * k)},${f(y - 3.1 * k)} A${f(1.9 * k)},${f(1.9 * k)} 0 1 1 ${f(x + 1.5 * k)},${f(y - 3.1 * k)} Z`, '#e07a6f', { w: 0.3 }) + ring([x, y - 4.27 * k], 0.7 * k, '#fff', { w: 0.25 });
const route = (lab, unit, L = 16) => {
  const x0 = 2.6, x1 = x0 + L, y = 8.2;
  const b = seg([x0, y], [x1, y], { stroke: C.blue, w: 0.6 }) + pin(x0, y) + pin(x1, y) + T((x0 + x1) / 2, y + 4.2, lab, G);
  return pic(x1 + 2.6, y + 5.2, b, [x1 + 2.4, y + 1.05, unit]);
};
// Mass: a sack (18 × 22 at s = 1), a parcel (22 × 15) and a box of tablets (22 × 11.5), the mass printed on it
const sack = (lab, unit, s = 1) => {
  const w = 0.4 / s;
  const body = path('M6,6 C1.5,8.5 0.6,13 1,18.5 Q1.3,21.6 4.5,21.6 L13.5,21.6 Q16.7,21.6 17,18.5 C17.4,13 16.5,8.5 12,6 Z', '#f1e4c6', { w })
    + path('M6.4,6 L4.6,1.4 L7.6,3.1 L9,0.8 L10.4,3.1 L13.4,1.4 L11.6,6 Z', '#f1e4c6', { w }) + rect(5.6, 5.1, 6.8, 1.7, '#b98b54', { rx: 0.6, w: w * 0.8 });
  return pic(18 * s + 2, 22 * s + 2, at(1, 1, s, body) + T(1 + 9 * s, 1 + 15.4 * s + 1.05, lab, G), [18 * s + 3, 1 + 13 * s + 1.05, unit]);
};
const parcel = (lab, unit, s = 1) => {
  const w = 0.4 / s;
  const body = poly([[0, 4], [4, 0], [22, 0], [18, 4]], '#ecd2a6', { w }) + poly([[18, 4], [22, 0], [22, 11], [18, 15]], '#cfa66c', { w }) + poly([[0, 4], [18, 4], [18, 15], [0, 15]], '#e2c08d', { w })
    + poly([[8.2, 4], [12.2, 0], [13.8, 0], [9.8, 4]], '#c39556', { w: w * 0.6 });
  return pic(22 * s + 2, 15 * s + 2, at(1, 1, s, body) + T(1 + 9 * s, 1 + 9.6 * s + 1.05, lab, G), [22 * s + 3.2, 1 + 7.5 * s + 1.05, unit]);
};
const tablets = (lab, unit) => {
  const body = poly([[0, 3], [3, 0], [22, 0], [19, 3]], '#f4f6fb') + poly([[19, 3], [22, 0], [22, 8.5], [19, 11.5]], '#dfe5f2') + poly([[0, 3], [19, 3], [19, 11.5], [0, 11.5]], '#fff')
    + rect(0, 9.2, 19, 2.3, '#8ea8e6', { w: 0.35 });
  return pic(24, 13.5, at(1, 1, 1, body) + T(10.5, 1 + 6.1 + 1.05, lab, G), [26, 1 + 6.1 + 1.05, unit]);
};
// Capacity: a bottle (16 × 22 at s = 1), a carton (15 × 21) and a swimming pool (24 × 12), the capacity on its label
const bottle = (lab, unit, s = 1) => {
  const w = 0.4 / s;
  const body = path('M5.5,4.6 C5.5,6.4 0.5,6.6 0.5,9 L0.5,21 Q0.5,22 1.5,22 L14.5,22 Q15.5,22 15.5,21 L15.5,9 C15.5,6.6 10.5,6.4 10.5,4.6 Z', '#e3ecfb', { w })
    + rect(5.5, 2.2, 5, 2.4, '#e3ecfb', { w }) + rect(5.1, 0, 5.8, 2.2, '#8ea8e6', { rx: 0.5, w }) + rect(0.5, 11.8, 15, 6.6, '#fff', { w: w * 0.7 });
  return pic(16 * s + 2, 22 * s + 2, at(1, 1, s, body) + T(1 + 8 * s, 1 + 15.1 * s + 1.05, lab, G), [16 * s + 3, 1 + 12 * s + 1.05, unit]);
};
const carton = (lab, unit, s = 1) => {
  const w = 0.4 / s;
  const body = poly([[11, 6], [15, 4.2], [15, 19.2], [11, 21]], '#dfe5f2', { w }) + poly([[2.6, 2.4], [8.4, 2.4], [12.4, 0.6], [6.6, 0.6]], '#dfe5f2', { w })
    + poly([[8.4, 2.4], [12.4, 0.6], [15, 4.2], [11, 6]], '#eef1f8', { w })
    + poly([[0, 21], [0, 6], [2.6, 2.4], [8.4, 2.4], [11, 6], [11, 21]], '#f7f9fd', { w }) + seg([0, 6], [11, 6], { w })
    + `<rect x="0" y="17.6" width="11" height="3.4" fill="#8ea8e6" stroke="${C.charcoal}" stroke-width="${f(w)}"/>`;
  return pic(15 * s + 2, 21 * s + 2, at(1, 1, s, body) + T(1 + 5.5 * s, 1 + 12 * s + 1.05, lab, G), [15 * s + 3, 1 + 12 * s + 1.05, unit]);
};
const pool = (lab, unit, s = 1) => {
  const w = 0.4 / s;
  const body = rect(0, 0, 24, 12, '#cfe0f7', { rx: 0.6, w }) + path('M2,2.6 q1.5,-1.1 3,0 t3,0 t3,0 t3,0 t3,0', 'none', { stroke: C.blue, w: 0.3 / s })
    + seg([19.8, -1.4], [19.8, 3.8], { w: 0.35 / s }) + seg([21.6, -1.4], [21.6, 3.8], { w: 0.35 / s }) + seg([19.8, 0.4], [21.6, 0.4], { w: 0.3 / s }) + seg([19.8, 2.2], [21.6, 2.2], { w: 0.3 / s });
  return pic(24 * s + 2, 12 * s + 2.4, at(1, 1.4, s, body) + T(1 + 11 * s, 1.4 + 8 * s + 1.05, lab, G), [24 * s + 3, 1.4 + 6 * s + 1.05, unit]);
};
// Time: a stopwatch (18 × 19.6 at s = 1) with the time on its face, and a digital timer (20 × 11) with it on its screen
const watch = (lab, unit, s = 1) => {
  const w = 0.4 / s, c = [9, 11], R = 8.5;
  let body = rect(7.6, 0, 2.8, 1.5, '#8ea8e6', { rx: 0.4, w }) + rect(8.4, 1.5, 1.2, 1.2, '#d3d7df', { w: w * 0.7 }) + ring(c, R, '#fff', { w: w * 1.1 });
  body += `<rect x="13.7" y="2.6" width="2.4" height="1.5" rx="0.4" fill="#d3d7df" stroke="${C.charcoal}" stroke-width="${f(w * 0.8)}" transform="rotate(45 14.9 3.35)"/>`;
  if (s >= 0.8) for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6, r0 = i % 3 ? 7.5 : 6.9; body += seg([c[0] + r0 * Math.sin(a), c[1] - r0 * Math.cos(a)], [c[0] + 8 * Math.sin(a), c[1] - 8 * Math.cos(a)], { w: 0.25 / s }); }
  return pic(18 * s + 2, 19.6 * s + 2, at(1, 1, s, body) + T(1 + c[0] * s, 1 + c[1] * s + 1.05, lab, G), [18 * s + 3, 1 + c[1] * s + 1.05, unit]);
};
const timer = (lab, unit) => {
  const body = rect(3.5, 0, 3.4, 2, '#8ea8e6', { rx: 0.4, w: 0.3 }) + rect(13.1, 0, 3.4, 2, '#d3d7df', { rx: 0.4, w: 0.3 })
    + rect(0, 1.6, 20, 9.6, '#d5d9e2', { rx: 1.8 }) + rect(1.8, 3.2, 16.4, 6.4, '#eef3fc', { rx: 0.6, w: 0.3 });
  return pic(22, 13.2, at(1, 1, 1, body) + T(11, 1 + 6.4 + 1.05, lab, G), [24, 1 + 6.4 + 1.05, unit]);
};
// Digital storage: a phone on its side (24 × 13) and a USB stick (20 × 10.4), the size on the screen or the stick
const phone = (lab, unit, s = 1) => {
  const w = 0.4 / s;
  const body = rect(0, 0, 24, 13, '#d5d9e2', { rx: 2.2, w }) + rect(2.8, 1.3, 18.6, 10.4, '#eef3fc', { rx: 0.6, w: w * 0.8 }) + dot([1.4, 6.5], 0.45);
  return pic(24 * s + 2, 13 * s + 2, at(1, 1, s, body) + T(1 + 12.1 * s, 1 + 6.5 * s + 1.05, lab, G), [24 * s + 3, 1 + 6.5 * s + 1.05, unit]);
};
const usb = (lab, unit) => {
  const body = rect(14.6, 2.2, 5.4, 6, '#e8e8ea') + rect(16.4, 3.4, 1.4, 1.1, '#9a9a9a', { w: 0.2 }) + rect(16.4, 5.9, 1.4, 1.1, '#9a9a9a', { w: 0.2 })
    + rect(0, 0, 15, 10.4, '#cfd9f2', { rx: 1.8 }) + ring([1.9, 5.2], 0.75, '#fff', { w: 0.3 });
  return pic(22, 12.4, at(1, 1, 1, body) + T(1 + 8.6, 1 + 5.2 + 1.05, lab, G), [23.2, 1 + 5.2 + 1.05, unit]);
};
// Very small: a grain of sand (a measurement line under it) and a blood cell (its diameter drawn in blue across it,
// as in a circle's diameter)
const GRAIN = [[0, 4], [1.2, 1.4], [4, 0.2], [7.4, 0.6], [10.4, 1.6], [12, 4.2], [11, 6.8], [7.6, 8], [3.6, 7.6], [0.9, 6.4]];
const grain = (lab, unit, s = 1) => {
  const pts = GRAIN.map(([x, y]) => [1 + x * s, 1 + y * s]), x1 = 1 + 12 * s, yd = 1 + 8 * s + 2.4;
  const b = poly(pts, '#ecdcaa', { w: 0.35 }) + [[3.4, 3], [6.6, 2.2], [8.8, 4.6], [5, 5.6]].map(([x, y]) => dot([1 + x * s, 1 + y * s], 0.35)).join('');
  return pic(x1 + 1, yd + 5, b + dimH(1, x1, yd, lab), [x1 + 2.2, 1 + 4 * s + 1.05, unit]);
};
const cell = (lab, unit, R = 6.3) => {
  const c = [0.5 + R, 0.5 + R];
  const b = ring(c, R, '#f3c4c4', { w: 0.4 }) + `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(R * 0.4)}" fill="#f7d6d6"/>`
    + seg([c[0] - R, c[1]], [c[0] + R, c[1]], BLUE) + T(c[0], c[1] - 1.6, lab, G);
  return pic(2 * R + 1, 2 * R + 1, b, [2 * R + 2.7, c[1] + 1.05, unit]);
};
// Scales to read: a ruler (cm, with a crayon from 0) and a measuring jug (mL printed on it, filled to level)
const rulerQ = (to, unit, max = 5, k = 6) => {
  const x0 = 3, y0 = 8, H = 7.6, X = (v) => x0 + v * k, cy = y0 - 3.4;
  let b = rect(1, y0, max * k + 4, H, '#fbf6e6', { rx: 0.6, w: 0.35 });
  for (let i = 0; i <= max * 2; i++) { const v = i / 2; b += seg([X(v), y0], [X(v), y0 + (i % 2 ? 1.8 : 3)], { w: 0.28 }); if (i % 2 === 0) b += T(X(v), y0 + 6.1, String(v), { size: 2.8 }); }
  b += T(max * k + 6.2, y0 + H + 0.2, 'cm', { size: 2.8, anchor: 'start' });
  b += path(`M${f(X(0))},${f(cy - 2)} L${f(X(to) - 2.2)},${f(cy - 2)} L${f(X(to))},${f(cy)} L${f(X(to) - 2.2)},${f(cy + 2)} L${f(X(0))},${f(cy + 2)} Z`, '#8ea8e6', { w: 0.35 });
  b += seg([X(to), cy], [X(to), y0], { stroke: C.grey, w: 0.25, dash: true });
  return pic(max * k + 6, y0 + H + 1, b, [X(to) + 2.2, cy + 1.05, unit]);
};
const jug = (max, major, minor, level, unit, H = 21.5) => {
  const x0 = 4, W = 13, top = 2.6, bot = top + H, Y = (v) => bot - (v / max) * H;
  let b = path(`M${x0 - 0.2},${top + 3} C${x0 - 4},${top + 3} ${x0 - 4},${top + 11} ${x0 - 0.2},${top + 11}`, 'none', { w: 0.9 });
  b += `<rect x="${x0}" y="${f(Y(level))}" width="${W}" height="${f(bot - Y(level))}" fill="#c9d6f2"/>`;
  b += path(`M${x0 - 1},${top - 1.6} L${x0},${top - 0.6} L${x0},${bot} L${x0 + W},${bot} L${x0 + W},${top - 1.6}`, 'none', { w: 0.45 });
  for (let v = minor; v <= max + 1e-9; v += minor) { const isM = Math.abs(v / major - Math.round(v / major)) < 1e-6; b += seg([x0 + W - (isM ? 3 : 1.6), Y(v)], [x0 + W, Y(v)], { w: 0.28 }); if (isM) b += T(x0 + W + 1.2, Y(v) + 1, num(v), { size: 2.8, anchor: 'start' }); }
  b += T(x0 + 4.4, top + 3.6, 'mL', { size: 2.8, weight: 600 }); // the unit printed on the jug, above the liquid
  return pic(x0 + W + 8, bot + 1, b, [x0 + W + 11, (top + bot) / 2 + 1.05, unit]);
};
// A rectangle l by w (drawn to scale, L mm long), its length under it and its width on its left (Year 8 area)
const rectQ = (l, w, unit, L = 12.5) => {
  const lw = `${num(w)} ${unit}`, x = 0.3 + lw.length * 3 * 0.58 + 1.5, y = 1, H = (L * w) / l;
  const b = rect(x, y, L, H, FILL, { w: 0.45 }) + rightMark([x, y + H], [x + 1, y + H], [x, y], 1.6) + T(x + L / 2, y + H + 3.8, `${num(l)} ${unit}`, G)
    + T(x - 1.5, y + H / 2 + 1.05, lw, { ...G, anchor: 'end' });
  return svg(f(x + L + 1), f(y + H + 1), b);
};

// ---------------------------------------------------------------- questions
// A conversion question from [picture, value, from unit, to unit]: [its picture, its answer, no words, its rule]
const cv = (draw, v, a, b, ...o) => [draw(`${num(v)} ${a}`, b, ...o), u(conv(v, a, b), b), '', rule(a, b)];
// A round of conversion questions (Rule / Working / Answer lines) from [picture, answer, text?, rule?], with each
// question's rule printed (true: printed) or left for students to write (false)
const ruleFig = (list, print = true) => ({ items: list.map(([fig, , t = '', own]) => ({ t, fig, form: print ? own : true, lines: RULE })), ans: list.map((x) => x[1]) });

// The Notes diagram: the length ladder km → m → cm → mm, × going down (to a smaller unit), ÷ going up, with mass and
// capacity under it
const notesFig = () => {
  const U = ['km', 'm', 'cm', 'mm'], K = [1000, 100, 10], cx = 15.5, bw = 8.4, bh = 4.2, gap = 3.6, y = (i) => 1 + i * (bh + gap);
  const arrow = (x, y0, y1, col) => { const d = y1 > y0 ? 1 : -1; return seg([x, y0], [x, y1 - d * 0.9], { stroke: col, w: 0.4 }) + poly([[x - 0.8, y1 - d * 1.3], [x + 0.8, y1 - d * 1.3], [x, y1]], col, { stroke: col, w: 0.1 }); };
  let b = '';
  U.forEach((t, i) => { b += rect(cx - bw / 2, y(i), bw, bh, FILL, { rx: 0.8, w: 0.4 }) + T(cx, y(i) + bh / 2 + 1.05, t, { size: 2.9, weight: 700 }); });
  K.forEach((k, i) => {
    const y0 = y(i) + bh + 0.4, y1 = y(i + 1) - 0.4, m = (y0 + y1) / 2 + 0.95;
    b += arrow(cx + 2, y0, y1, C.blue) + T(cx + bw / 2 + 0.9, m, `× ${k}`, { size: 2.6, weight: 600, fill: C.blue, anchor: 'start' });
    b += arrow(cx - 2, y1, y0, C.grey) + T(cx - bw / 2 - 0.9, m, `÷ ${k}`, { size: 2.6, weight: 600, fill: C.grey, anchor: 'end' });
  });
  const yb = y(3) + bh + 3.4;
  b += T(cx, yb, 'kg → g, L → mL: × 1000', { size: 2.5, weight: 600 });
  return svg(f(2 * cx), f(yb + 0.8), b);
};

module.exports = {
  code: '10.1', title: 'Metric units',
  li: 'convert between metric units, including time and digital storage.',
  sc: ['convert units of length, mass and capacity', 'convert units of time and digital storage', 'use the prefixes mega-, giga- and micro-'],
  notes: {
    terms: [['kilo- (k)', 'a thousand: 1 km = 1000 m'], ['centi- (c)', 'a hundredth: 1 cm = 0.01 m'], ['milli- (m)', 'a thousandth: 1 mm = 0.001 m'],
      ['micro- (μ)', 'a millionth: 1 mm = 1000 μm'], ['mega- (M)', 'a million: 1 ML = 1 000 000 L'], ['giga- (G)', 'a billion: 1 GB = 1000 MB'],
      ['capacity', 'how much a container holds']],
    formulas: ['Bigger unit → smaller unit: ×', 'Smaller unit → bigger unit: ÷', '1 kg = 1000 g · 1 t = 1000 kg', '1 L = 1000 mL · 1 kL = 1000 L', '1 h = 60 min · 1 min = 60 s'],
    steps: ['bigger or smaller unit?', 'write the rule', 'work it out', 'write the new unit'],
    fig: notesFig(),
  },
  easy: {
    ex: { stem: 'Convert each one. To a smaller unit, multiply. To a bigger unit, divide.', parts: [
      { t: 'Length', fig: pencil('14 cm', 'mm', 20) }, { t: 'Length', fig: plank('250 cm', 'm', 22) },
      { t: 'Mass', fig: sack('3.5 kg', 'g', 0.86) }, { t: 'Capacity', fig: bottle('750 mL', 'L', 0.86) }] },
    exAns: [`cm → mm: ${work(14, 'cm', 'mm')}`, `cm → m: ${work(250, 'cm', 'm')}`, `kg → g: ${work(3.5, 'kg', 'g')}`, `mL → L: ${work(750, 'mL', 'L')}`],
    hint: 'To a smaller unit, multiply · To a bigger unit, divide · 1 km = 1000 m · 1 m = 100 cm · 1 cm = 10 mm',
    work: true,
    // Small steps: one-step conversions between neighbouring units of length, to the smaller unit (×), then to the
    // bigger unit (÷), whole numbers only. Each question's rule is printed on its Rule line.
    rounds: [
      { text: 'convert each length to the smaller unit.', cols: 4, ...ruleFig([cv(pencil, 9, 'cm', 'mm'), cv(door, 2, 'm', 'cm'), cv(route, 4, 'km', 'm'), cv(plank, 6, 'm', 'cm')]) },
      { text: 'convert each length to the bigger unit.', cols: 4, ...ruleFig([cv(pencil, 120, 'mm', 'cm'), cv(plank, 300, 'cm', 'm'), cv(route, 5000, 'm', 'km'), cv(door, 200, 'cm', 'm')]) },
    ],
  },
  // Page 2: mass and capacity (rule printed), then a round where students write the rule (reading two scales), then time.
  drill: {
    hint: '1 kg = 1000 g · 1 L = 1000 mL · 1 min = 60 s · 1 h = 60 min · To a smaller unit, ×. To a bigger unit, ÷.',
    rounds: [
      { text: 'convert each mass.', ...ruleFig([cv(sack, 2, 'kg', 'g'), cv(parcel, 4000, 'g', 'kg'), cv(sack, 1.5, 'kg', 'g')]) },
      { text: 'convert each capacity.', ...ruleFig([cv(carton, 2, 'L', 'mL'), cv(bottle, 500, 'mL', 'L'), cv(bottle, 1.5, 'L', 'mL')]) },
      { text: '× or ÷? Write the rule, then convert. Read the scales carefully.', ...ruleFig([
        [rulerQ(4.5, 'mm'), u(conv(4.5, 'cm', 'mm'), 'mm')], [jug(1000, 200, 100, 600, 'L'), u(conv(600, 'mL', 'L'), 'L')], cv(parcel, 2500, 'g', 'kg')], false) },
      { text: 'convert each time. 1 min = 60 s and 1 h = 60 min.', ...ruleFig([cv(watch, 3, 'min', 's'), cv(watch, 2, 'h', 'min'), cv(watch, 240, 's', 'min')]) },
    ],
  },
  medium: {
    ex: { stem: 'Convert each one. Write the rule first.', parts: [
      { t: 'Time', fig: watch('2.5 h', 'min', 0.62) }, { t: 'Storage', fig: phone('4.2 GB', 'MB', 0.95) },
      { t: 'Two steps', fig: route('1.5 km', 'cm', 20) }, { t: 'Micro', fig: grain('0.5 mm', 'μm', 0.8) }] },
    exAns: [`h → min: ${work(2.5, 'h', 'min')}`, `GB → MB: ${work(4.2, 'GB', 'MB')}`,
      `km → m → cm: × 1000 then × 100, so 1.5 × 1000 × 100 = ${u(conv(1.5, 'km', 'cm'), 'cm')}`, `mm → μm: ${work(0.5, 'mm', 'μm')}`],
    hint: '1 GB = 1000 MB · 1 ML = 1 000 000 L · 1 g = 1000 mg · 1 mm = 1000 μm · m → mm: × 100, then × 10',
    work: true, set: true,
    // One set: today's skill, building from two-step lengths to very large and very small units, with a Year 8
    // question (tagged) in each row. Each picture question has a word saying what it is, then Rule / Working / Answer
    // lines (the Year 8 area: Formula / Substitute / Answer). Rounding and a percentage are plain working boxes.
    rounds: [(() => {
      const c = (t, [fig, a]) => [{ t, fig, form: true, lines: RULE }, a];
      const r2 = +(4.0862).toFixed(2);
      const Q = [
        c('Length', cv(plank, 1.8, 'm', 'mm', 18)),
        [{ t: 'Area', fig: rectQ(8, 5, 'cm'), form: true, from: 'Year 8' }, u(8 * 5, 'cm²')],
        c('Time', cv(timer, 150, 's', 'min')),
        [{ t: 'Round 4.0862 m to two decimal places.', from: 'Year 8' }, u(r2, 'm', 2)],
        c('Storage', cv(usb, 32, 'GB', 'MB')),
        c('Mass', cv(tablets, 250, 'mg', 'g')),
        c('Capacity', cv(pool, 2.5, 'ML', 'L', 0.85)),
        c('Length', cv(cell, 8, 'μm', 'mm')),
        [{ t: 'Find 15% of 60 kg.', from: 'Year 8' }, u((15 / 100) * 60, 'kg')],
      ];
      return { text: '', items: Q.map((x) => x[0]), ans: Q.map((x) => x[1]) };
    })()],
  },
  worded: [
    { q: 'A phone has 64 GB of free space. Each video is 800 MB. How many videos fit on the phone?',
      a: `64 GB = 64 × 1000 = ${u(conv(64, 'GB', 'MB'), 'MB')}; ${num(conv(64, 'GB', 'MB'))} ÷ 800 = ${num(conv(64, 'GB', 'MB') / 800)} videos` },
    { q: 'Mia runs laps of a 400 m track. How many laps does she run to cover 6 km?',
      a: `6 km = 6 × 1000 = ${u(conv(6, 'km', 'm'), 'm')}; ${num(conv(6, 'km', 'm'))} ÷ 400 = ${num(conv(6, 'km', 'm') / 400)} laps` },
    (() => { const run = 135, h = Math.floor(run / 60), m = run % 60, end = 19 * 60 + 30 + run;
      return { q: `A movie runs for ${run} minutes. It starts at 7:30 pm. At what time does it finish?`,
        a: `${run} min = ${h * 60} min + ${m} min = ${h} h ${m} min; 7:30 pm + ${h} h ${m} min = ${Math.floor(end / 60) - 12}:${String(end % 60).padStart(2, '0')} pm` }; })(),
  ],
};
