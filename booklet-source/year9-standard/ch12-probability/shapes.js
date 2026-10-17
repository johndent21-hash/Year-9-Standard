// Diagrams for Chapter 12 Probability (SVG, units in mm), in a classic textbook style: thin dark outlines, light fills,
// labels with a white halo, nothing overlapping. Built from the Chapter 10 drawing parts (labels grow the picture's
// frame; see ../ch10…/shapes.js) and the Chapter 11 table and colours. Each counter carries its colour's letter (R, B, …)
// so a black-and-white copy still reads. Every picture is drawn from the question's own numbers.
const { C, f, T: T0, svg, seg, poly } = require('../ch10-surface-area-volume/shapes').parts;
const { table, parts: { GRID, BLUE, INK, LINE } } = require('../ch11-coordinate-geometry/shapes');

const halo = (s) => s.replace('<text ', '<text paint-order="stroke" stroke="#ffffff" stroke-width="0.9" stroke-linejoin="round" ');
const T = (x, y, s, o = {}) => halo(T0(x, y, s, { fill: INK, ...o }));
// A short picture gets invisible space above and below, so it is at least 12 mm tall (the builder's layout check treats
// a shorter graph as squashed), as Chapter 11's tall()
const tall = (x, H) => (H < 14 ? T0(x, H / 2 - 5.6, ' ', { size: 2.8 }) + T0(x, H / 2 + 6.2, ' ', { size: 2.8 }) : '');
const path = (d, fill, o = {}) => `<path d="${d}" fill="${fill}" stroke="${o.stroke || INK}" stroke-width="${f(o.w || 0.35)}" stroke-linejoin="round"/>`;
const rect = (x, y, w, h, fill, o = {}) => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}"${o.rx ? ` rx="${f(o.rx)}"` : ''} fill="${fill}" stroke="${o.stroke || INK}" stroke-width="${f(o.w || 0.35)}"/>`;
const circ = (c, r, fill, o = {}) => `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(r)}" fill="${fill}" stroke="${o.stroke || INK}" stroke-width="${f(o.w || 0.3)}"/>`;

// ---------------------------------------------------------------- counters
// Each colour: [fill, letter, letter colour]
const COL = {
  red: ['#e05a5a', 'R', '#fff'], blue: ['#5577d0', 'B', '#fff'], yellow: ['#f4d34e', 'Y', INK], green: ['#53a964', 'G', '#fff'],
  white: ['#ffffff', 'W', INK], purple: ['#8f6cc4', 'P', '#fff'], orange: ['#f39a52', 'O', INK],
};
const counter = (c, r, col) => { const [fill, l, ink] = COL[col]; return circ(c, r, fill) + T0(c[0], c[1] + r * 0.42, l, { size: r * 1.15, weight: 700, fill: ink }); };
// The counters in a fixed shuffled order (the same picture every build): counts { red: 3, blue: 5 }
const mix = (counts) => {
  const list = Object.entries(counts).flatMap(([c, k]) => Array(k).fill(c));
  let s = list.length * 97 + 13;
  for (let i = list.length - 1; i > 0; i--) { s = (s * 1103515245 + 12345) % 2147483648; const j = s % (i + 1); [list[i], list[j]] = [list[j], list[i]]; }
  return list;
};
// Counters packed in rows from the bottom (y = the bottom row's lowest point), cols to a row, the top row centred
const pack = (list, x0, yb, cols, r, p) => list.map((col, i) => {
  const row = Math.floor(i / cols), inRow = Math.min(cols, list.length - row * cols), j = i % cols;
  return counter([x0 + (cols - inRow) * p / 2 + p / 2 + j * p, yb - p / 2 - row * p], r, col);
}).join('');
const grid = (N, o) => { const cols = o.cols || Math.max(3, Math.ceil(Math.sqrt(N * 1.6))); return { cols, rows: Math.max(o.rows || 0, Math.ceil(N / cols)) }; };

// A glass jar of counters (counts { red: 3, blue: 5 }); { cols, rows, r }: the counter grid and radius. An empty jar
// ({}) with cols and rows is a jar to draw in.
const jar = (counts, o = {}) => {
  const list = mix(counts), r = o.r || 2.8, p = 2 * r + 0.45, { cols, rows } = grid(list.length, o);
  const x0 = 0.6, W = cols * p + 2.4, x1 = x0 + W, top = 4.6, bot = top + rows * p + 2.6, nx0 = x0 + W * 0.2, nx1 = x1 - W * 0.2;
  let b = path(`M${f(nx0)},${f(top - 2.2)} L${f(nx0)},${f(top - 0.8)} Q${f(x0)},${f(top - 0.6)} ${f(x0)},${f(top + 1.6)} L${f(x0)},${f(bot - 2)} Q${f(x0)},${f(bot)} ${f(x0 + 2)},${f(bot)} L${f(x1 - 2)},${f(bot)} Q${f(x1)},${f(bot)} ${f(x1)},${f(bot - 2)} L${f(x1)},${f(top + 1.6)} Q${f(x1)},${f(top - 0.6)} ${f(nx1)},${f(top - 0.8)} L${f(nx1)},${f(top - 2.2)}`, '#f2f5fb', { w: 0.4 });
  b += rect(nx0 - 0.9, 0.4, nx1 - nx0 + 1.8, 2.1, '#d6dbe6', { rx: 0.5, w: 0.35 });
  b += pack(list, x0 + 1.2, bot - 1.2, cols, r, p);
  return svg(f(x1 + 0.6), f(bot + 0.5), b + tall((x0 + x1) / 2, bot));
};
// A cloth bag of counters, the same grid: a gathered neck with a tie, the sides bulging out to a rounded bottom
const bag = (counts, o = {}) => {
  const list = mix(counts), r = o.r || 2.8, p = 2 * r + 0.45, { cols, rows } = grid(list.length, o);
  const x0 = 0.6, W = cols * p + 4, x1 = x0 + W, cx = (x0 + x1) / 2, yt = 3.6, yb = yt + 5 + rows * p + 1.8, xl = cx - W * 0.16, xr = cx + W * 0.16;
  let b = path(`M${f(xl)},${f(yt)} C${f(xl - 1)},${f(yt + 1.8)} ${f(x0)},${f(yt + 2.4)} ${f(x0)},${f(yt + 5.6)} L${f(x0)},${f(yb - 3)} Q${f(x0)},${f(yb)} ${f(x0 + 3)},${f(yb)} L${f(x1 - 3)},${f(yb)} Q${f(x1)},${f(yb)} ${f(x1)},${f(yb - 3)} L${f(x1)},${f(yt + 5.6)} C${f(x1)},${f(yt + 2.4)} ${f(xr + 1)},${f(yt + 1.8)} ${f(xr)},${f(yt)} Z`, '#f3e7cc', { w: 0.4 });
  b += path(`M${f(xl)},${f(yt)} L${f(xl - 1.8)},${f(yt - 3)} L${f(cx - 1.2)},${f(yt - 2.1)} L${f(cx)},${f(yt - 3.3)} L${f(cx + 1.2)},${f(yt - 2.1)} L${f(xr + 1.8)},${f(yt - 3)} L${f(xr)},${f(yt)} Z`, '#f3e7cc', { w: 0.35 });
  b += rect(xl - 0.7, yt - 0.75, xr - xl + 1.4, 1.5, '#b98b54', { rx: 0.6, w: 0.3 });
  b += pack(list, x0 + 2, yb - 1.4, cols, r, p);
  return svg(f(x1 + 0.6), f(yb + 0.5), b + tall(cx, yb));
};

// ---------------------------------------------------------------- cards
// Cards with a letter or number on each ({ w, perRow, red: a test for the cards printed in red })
const cards = (labels, o = {}) => {
  const w = o.w || 6, h = o.h || w * 1.38, g = o.gap || 1.1, per = o.perRow || labels.length, rows = Math.ceil(labels.length / per), size = o.size || w * 0.6;
  let b = '';
  labels.forEach((t, i) => {
    const x = 0.5 + (i % per) * (w + g), y = 0.5 + Math.floor(i / per) * (h + g);
    b += rect(x, y, w, h, '#fff', { rx: 0.8, w: 0.35 }) + T0(x + w / 2, y + h / 2 + size * 0.36, String(t), { size, weight: 700, fill: o.red && o.red(t) ? '#c8323c' : INK });
  });
  const W = per * (w + g) - g + 1, H = rows * (h + g) - g + 1;
  return svg(f(W), f(H), b + tall(W / 2, H));
};
// Suits, drawn (not typed, so every printer shows them): centre (x, y), height s
const heartD = (x, y, s, k = 1) => { const Y = (d) => f(y + k * d * s), X = (d) => f(x + d * s);
  return `M${X(0)},${Y(0.45)} C${X(-0.12)},${Y(0.32)} ${X(-0.55)},${Y(0.08)} ${X(-0.52)},${Y(-0.2)} C${X(-0.48)},${Y(-0.52)} ${X(-0.06)},${Y(-0.52)} ${X(0)},${Y(-0.2)} C${X(0.06)},${Y(-0.52)} ${X(0.48)},${Y(-0.52)} ${X(0.52)},${Y(-0.2)} C${X(0.55)},${Y(0.08)} ${X(0.12)},${Y(0.32)} ${X(0)},${Y(0.45)} Z`; };
const RED = '#c8323c', BLACK = '#2b2b30';
const SUIT = {
  heart: (x, y, s) => `<path d="${heartD(x, y + 0.03 * s, s)}" fill="${RED}"/>`,
  diamond: (x, y, s) => `<polygon points="${f(x)},${f(y - 0.5 * s)} ${f(x + 0.36 * s)},${f(y)} ${f(x)},${f(y + 0.5 * s)} ${f(x - 0.36 * s)},${f(y)}" fill="${RED}"/>`,
  club: (x, y, s) => [[0, -0.24], [-0.23, 0.06], [0.23, 0.06]].map(([dx, dy]) => `<circle cx="${f(x + dx * s)}" cy="${f(y + dy * s)}" r="${f(0.21 * s)}" fill="${BLACK}"/>`).join('')
    + `<polygon points="${f(x)},${f(y)} ${f(x - 0.14 * s)},${f(y + 0.5 * s)} ${f(x + 0.14 * s)},${f(y + 0.5 * s)}" fill="${BLACK}"/>`,
  spade: (x, y, s) => `<path d="${heartD(x, y - 0.06 * s, s * 0.9, -1)}" fill="${BLACK}"/><polygon points="${f(x)},${f(y + 0.05 * s)} ${f(x - 0.14 * s)},${f(y + 0.5 * s)} ${f(x + 0.14 * s)},${f(y + 0.5 * s)}" fill="${BLACK}"/>`,
};
// A standard deck: one card of each suit (its symbol and A to K), and how many cards there are
const deck = (o = {}) => {
  const w = o.w || 7, h = w * 1.4, g = 1.2;
  let b = '';
  ['heart', 'diamond', 'club', 'spade'].forEach((s, i) => {
    const x = 0.5 + i * (w + g);
    b += rect(x, 0.5, w, h, '#fff', { rx: 0.8, w: 0.35 }) + SUIT[s](x + w / 2, 0.5 + h * 0.56, w * 0.62) + T0(x + 1, 0.5 + 2.6, i < 2 ? 'K' : 'A', { size: 2.2, weight: 700, anchor: 'start', fill: i < 2 ? RED : BLACK });
  });
  const W = 4 * (w + g) - g + 1;
  b += T(W / 2, h + 4.2, o.caption || '4 suits × 13 = 52', { size: 2.6 });
  return svg(f(W), f(h + 5), b);
};

// ---------------------------------------------------------------- the Notes diagram: the probability scale
// Upright, to fit the Notes box's narrow picture column: 0 at the bottom, 1 at the top, the words on the right
const probScale = () => {
  const x = 6, y0 = 30, y1 = 2, Y = (v) => y0 + v * (y1 - y0);
  let b = seg([x, y0], [x, y1], { stroke: INK, w: 0.4 });
  [[0, '0', 'impossible'], [0.25, '', 'unlikely'], [0.5, '1/2', 'even chance'], [0.75, '', 'likely'], [1, '1', 'certain']].forEach(([v, nm, w]) => {
    const k = v % 0.5 ? 0.8 : 1.3;
    b += seg([x - k, Y(v)], [x + k, Y(v)], { stroke: INK, w: 0.35 }) + T(x - 2, Y(v) + 0.95, nm, { size: 2.7, weight: 700, anchor: 'end' }) + T(x + 2.4, Y(v) + 0.9, w, { size: 2.6, anchor: 'start' });
  });
  return svg(f(x + 18), f(y0 + 1.5), b);
};

module.exports = { jar, bag, cards, deck, probScale, counter, mix, table, parts: { C, f, T, T0, svg, seg, poly, path, rect, circ, tall, halo, COL, SUIT, RED, BLACK, GRID, BLUE, INK, LINE } };
