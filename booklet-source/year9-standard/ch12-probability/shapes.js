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

// ---------------------------------------------------------------- tables
// A grid of cells: m[i][j] the text in row i, column j ('' a blank cell for students), ws the column widths, h the row
// height; the header row and/or column shaded, in bold
const cellGrid = (m, ws, h, { headRow = false, headCol = true, z = 2.6, x0 = 0.5, y0 = 0.5 } = {}) => {
  let body = '';
  m.forEach((row, i) => row.forEach((t, j) => {
    const x = x0 + ws.slice(0, j).reduce((a, b) => a + b, 0), y = y0 + i * h, head = (headRow && i === 0) || (headCol && j === 0);
    body += rect(x, y, ws[j], h, head ? '#eceef4' : '#fff', { w: 0.25 }) + T0(x + ws[j] / 2, y + h / 2 + z * 0.36, t === '' ? '' : String(t), { size: z, weight: head ? 600 : 400, fill: INK });
  }));
  return { body, W: ws.reduce((a, b) => a + b, 0), H: m.length * h };
};
const wd = (s, z) => String(s).length * z * 0.6;
// A table of results: the outcomes across the top and their frequencies under them ('' leaves a cell blank for
// students). o.tally adds a blank Tally row; o.down stands it upright (Outcome and Frequency columns)
const results = (outs, freqs, o = {}) => {
  const z = o.size || 2.6, h = o.h || z * 1.7;
  let g;
  if (o.down) {
    const w1 = Math.max(wd('Outcome', z), ...outs.map((x) => wd(x, z))) + 2, w2 = wd('Frequency', z) + 2;
    g = cellGrid([['Outcome', 'Frequency'], ...outs.map((x, i) => [x, freqs[i]])], [w1, w2], h, { headRow: true, headCol: false, z });
  } else {
    const rows = [['Outcome', ...outs], ...(o.tally ? [['Tally', ...outs.map(() => '')]] : []), ['Frequency', ...freqs]];
    g = cellGrid(rows, [wd('Frequency', z) + 2, ...outs.map(() => o.w || Math.max(z * 2.3, ...freqs.map((x) => wd(x, z) + 1.6)))], h, { z });
  }
  return svg(f(g.W + 1), f(g.H + 1), g.body + tall((g.W + 1) / 2, g.H + 1));
};
// Two pictures side by side as one picture (a spinner and its table), their middles level
const side = (pics, gap = 2.5) => {
  const box = (s) => ({ v: s.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number), inner: s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '') });
  const P = pics.map(box), H = Math.max(...P.map((p) => p.v[3]));
  let x = 0; const g = P.map((p) => { const s = `<g transform="translate(${f(x - p.v[0])},${f((H - p.v[3]) / 2 - p.v[1])})">${p.inner}</g>`; x += p.v[2] + gap; return s; }).join('');
  const W = f(x - gap);
  return `<svg class="graph" viewBox="0 0 ${W} ${f(H)}" xmlns="http://www.w3.org/2000/svg" style="aspect-ratio:${W}/${f(H)}; --w:${W}mm; --ar:${W}/${f(H)}">${g}</svg>`;
};

// ---------------------------------------------------------------- spinners and dice
const TINT = { red: '#f4a9a9', blue: '#b3c3ef', yellow: '#f8e596', green: '#addab4', purple: '#cdbbe7', white: '#ffffff', orange: '#f9c9a0' };
const LETTER = Object.fromEntries(Object.entries(COL).map(([k, v]) => [v[1], k])); // 'R' → 'red'
// A spinner: its sectors clockwise from the top, each a label or [label, size] (sizes in equal parts: [['R', 2], 'B', 'G']
// makes red twice each other sector). A colour's letter (R, B, G, Y, P) fills its sector in that colour; numbers are on
// white. r: the radius. The pointer is short, so it never reaches a label.
const spinner = (sectors, o = {}) => {
  const S = sectors.map((s) => (Array.isArray(s) ? s : [s, 1])), tot = S.reduce((a, s) => a + s[1], 0), r = o.r || 9, z = o.size || 2.8, c = [r + 0.6, r + 0.6];
  const at = (deg, k = r) => [c[0] + k * Math.sin((deg * Math.PI) / 180), c[1] - k * Math.cos((deg * Math.PI) / 180)];
  let a = 0, b = '', lab = '';
  S.forEach(([l, k]) => {
    const a1 = a + (360 * k) / tot, p0 = at(a), p1 = at(a1), m = at((a + a1) / 2, r * (o.lr || 0.62));
    b += path(`M${f(c[0])},${f(c[1])} L${f(p0[0])},${f(p0[1])} A${f(r)},${f(r)} 0 ${a1 - a > 180 ? 1 : 0} 1 ${f(p1[0])},${f(p1[1])} Z`, LETTER[l] ? TINT[LETTER[l]] : '#fff', { w: 0.3 });
    lab += T(m[0], m[1] + z * 0.36, l, { size: z, weight: 700 });
    a = a1;
  });
  const th = ((o.arrow ?? 28) * Math.PI) / 180, tip = at(o.arrow ?? 28, r * 0.42), bk = at(o.arrow ?? 28, r * 0.42 - 1.4), px = Math.cos(th) * 0.65, py = Math.sin(th) * 0.65;
  b += circ(c, r, 'none', { w: 0.4 }) + seg(c, bk, { stroke: INK, w: 0.45 }) + `<polygon points="${f(tip[0])},${f(tip[1])} ${f(bk[0] + px)},${f(bk[1] + py)} ${f(bk[0] - px)},${f(bk[1] - py)}" fill="${INK}"/>` + circ(c, 0.7, INK, { w: 0.1 });
  return svg(f(2 * r + 1.2), f(2 * r + 1.2), b + lab);
};
const PIP = { 1: [[0.5, 0.5]], 2: [[0.28, 0.28], [0.72, 0.72]], 3: [[0.28, 0.28], [0.5, 0.5], [0.72, 0.72]], 4: [[0.28, 0.28], [0.72, 0.28], [0.28, 0.72], [0.72, 0.72]],
  5: [[0.28, 0.28], [0.72, 0.28], [0.5, 0.5], [0.28, 0.72], [0.72, 0.72]], 6: [[0.28, 0.25], [0.72, 0.25], [0.28, 0.5], [0.72, 0.5], [0.28, 0.75], [0.72, 0.75]] };
// A die: a cube in perspective with v pips on its front, s mm across the front
const die = (v = 5, s = 10) => {
  const d = s * 0.32, x = 0.5, y = 0.5 + d;
  let b = poly([[x, y], [x + d, y - d], [x + s + d, y - d], [x + s, y]], '#f1f2f7', { w: 0.35 }) + poly([[x + s, y], [x + s + d, y - d], [x + s + d, y + s - d], [x + s, y + s]], '#dfe3ec', { w: 0.35 });
  b += rect(x, y, s, s, '#fff', { w: 0.4 }) + PIP[v].map(([px, py]) => circ([x + px * s, y + py * s], s * 0.085, INK, { w: 0.1 })).join('');
  return svg(f(s + d + 1), f(s + d + 1), b);
};

// ---------------------------------------------------------------- Venn diagrams
// Two circles named names[0] and names[1] in a rectangle, a count in each region: n = [first only, both, second only,
// neither] ('' leaves a region blank). shade: 'a', 'and', 'or' or 'neither' shades that event's regions (the examples)
const venn = (names, n, o = {}) => {
  const W = o.w || 42, H = o.h || W * 0.58, r = o.r || H * 0.36, d = r * 1.1, x0 = 0.5, y0 = 0.5, cx = x0 + W / 2, cy = y0 + H / 2 + H * 0.03, z = o.size || 3;
  const A = [cx - d / 2, cy], B = [cx + d / 2, cy], SH = '#bccaee', s = o.shade, hh = Math.sqrt(r * r - (d / 2) ** 2);
  let b = rect(x0, y0, W, H, s === 'neither' ? SH : '#fff', { w: 0.4 });
  if (!s) b += `<circle cx="${f(A[0])}" cy="${f(cy)}" r="${f(r)}" fill="#dfe6f8" fill-opacity="0.8"/><circle cx="${f(B[0])}" cy="${f(cy)}" r="${f(r)}" fill="#f6e3c8" fill-opacity="0.7"/>`;
  else if (s === 'neither') b += circ(A, r, '#fff', { w: 0 }) + circ(B, r, '#fff', { w: 0 });
  else if (s === 'and') b += `<path d="M${f(cx)},${f(cy - hh)} A${f(r)},${f(r)} 0 0 1 ${f(cx)},${f(cy + hh)} A${f(r)},${f(r)} 0 0 1 ${f(cx)},${f(cy - hh)} Z" fill="${SH}"/>`;
  else b += circ(A, r, SH, { w: 0 }) + (s === 'or' ? circ(B, r, SH, { w: 0 }) : '');
  b += circ(A, r, 'none', { w: 0.4 }) + circ(B, r, 'none', { w: 0.4 });
  b += T(A[0] - r * 0.78, cy - r * 0.8, names[0], { size: z, weight: 700, anchor: 'end' }) + T(B[0] + r * 0.78, cy - r * 0.8, names[1], { size: z, weight: 700, anchor: 'start' });
  const num = (x, y, t, anchor = 'middle') => (t === '' ? '' : T(x, y + z * 0.36, String(t), { size: z, weight: 600, anchor }));
  b += num(A[0] - r * 0.42, cy, n[0]) + num(cx, cy, n[1]) + num(B[0] + r * 0.42, cy, n[2]) + num(x0 + W - 1.6, y0 + H - 1.6 - z * 0.36, n[3], 'end');
  return svg(f(W + 1), f(H + 1), b);
};

// ---------------------------------------------------------------- tree diagrams
// A two-step tree diagram: first, the first step's outcomes; second, the second step's (an array: the same after each
// first outcome; or a function of the first: without replacement). o.ends writes each outcome at the end of its branch
// ('HT'), otherwise a line is left for students; a label '' is left as a short line to fill in. o.heads names the steps.
const tree = (first, second, o = {}) => {
  const z = o.size || 2.7, dy = o.dy || 3.6, gx = o.gap || 13, gg = o.gg ?? 0.8, sec = (a) => (typeof second === 'function' ? second(a) : second);
  const [h1, h2] = o.heads || ['1st', '2nd'], top = o.top || 5.6, pair = o.pair || ((a, s) => `${a}${s}`);
  const x0 = 1, x1 = x0 + gx, x2 = x1 + gx, x3 = x2 + Math.max(...first.flatMap((a) => sec(a).map((s) => wd(s, z) / 2)), wd(h2, 2.4) / 2 - 1) + 2.4;
  const node = (x, y, l) => (l === '' ? seg([x - 1.8, y + 1], [x + 1.8, y + 1], { stroke: C.grey, w: 0.3 }) : T(x, y + z * 0.36, l, { size: z, weight: 600 }));
  const off = (l) => Math.max(1.8, wd(l, z) / 2 + 0.8);
  let b = '', lab = '', i = 0;
  const ones = first.map((a, k) => {
    const ss = sec(a), ys = ss.map(() => top + (i++) * dy + k * gg), y1 = (ys[0] + ys[ys.length - 1]) / 2;
    ss.forEach((s, j) => {
      b += seg([x1 + off(a), y1], [x2 - off(s), ys[j]], { stroke: INK, w: 0.3 });
      lab += node(x2, ys[j], s) + (o.ends ? T(x3, ys[j] + z * 0.36, pair(a, s), { size: z, anchor: 'start' }) : seg([x3, ys[j] + 1], [x3 + 8, ys[j] + 1], { stroke: C.grey, w: 0.25 }));
    });
    return [a, y1];
  });
  const yr = (ones[0][1] + ones[ones.length - 1][1]) / 2;
  ones.forEach(([a, y]) => { b += seg([x0, yr], [x1 - off(a), y], { stroke: INK, w: 0.3 }); lab += node(x1, y, a); });
  b += circ([x0, yr], 0.55, INK, { w: 0.1 });
  const g = { size: 2.4, fill: C.grey, weight: 600 };
  lab += T(x1, top - 3.2, h1, g) + T(x2, top - 3.2, h2, g) + T(x3, top - 3.2, 'Outcome', { ...g, anchor: 'start' });
  return svg(f(x3 + 9), f(top + (i - 1) * dy + (first.length - 1) * gg + 2), b + lab);
};
// The frame for a tree the students draw: the steps' names over the columns and the starting dot
const treeFrame = (heads = ['1st', '2nd'], gx = 12, h = 32) => {
  const g = { size: 2.4, fill: C.grey, weight: 600 }, x1 = 1 + gx, x2 = x1 + gx, x3 = x2 + Math.max(1, wd(heads[1], 2.4) / 2 - 1) + 2.4;
  return svg(f(x3 + 9), f(h), circ([1, h / 2 + 1.5], 0.55, INK, { w: 0.1 }) + T(x1, 2.4, heads[0], g) + T(x2, 2.4, heads[1], g) + T(x3, 2.4, 'Outcome', { ...g, anchor: 'start' }));
};

// ---------------------------------------------------------------- tables of outcomes
// A table of outcomes for two steps: across (the top) and down (the side), cell(a, d) the result in each cell;
// show(i, j) picks the cells filled in (the rest are left blank; default all). names: [across, down] ('Die 1', 'Die 2');
// op: the sign in the corner ('+', '−', '×')
const outcomes = (across, down, cell, o = {}) => {
  const z = o.size || 2.6, w = o.w || 5.4, h = o.h || 4.2, show = o.show || (() => true), [na, nd] = o.names || ['', ''];
  const lx = nd ? z + 1.8 : 0.5, ty = na ? z + 1.8 : 0.5;
  const m = [[o.op || '', ...across], ...down.map((dn, i) => [dn, ...across.map((a, j) => (show(i, j) ? cell(a, dn) : ''))])];
  const g = cellGrid(m, m[0].map(() => w), h, { headRow: true, headCol: true, z, x0: lx, y0: ty });
  let b = g.body;
  if (na) b += T(lx + w + (across.length * w) / 2, ty - 1.2, na, { size: z, weight: 600 });
  // the side name, turned upright; the frame grows to hold it when it is longer than the table is tall
  if (nd) { const x = lx - 1.3, y = ty + h + (down.length * h) / 2, half = wd(nd, z) / 2; b += T0(x, y - half + 0.6, ' ', { size: 1 }) + T0(x, y + half + 0.6, ' ', { size: 1 }) + halo(`<text x="${f(x)}" y="${f(y)}" font-size="${z}" text-anchor="middle" font-weight="600" fill="${INK}" transform="rotate(-90 ${f(x)} ${f(y)})">${nd}</text>`); }
  return svg(f(lx + g.W + 0.5), f(ty + g.H + 0.5), b + tall((lx + g.W) / 2, ty + g.H + 0.5));
};

module.exports = { jar, bag, cards, deck, probScale, counter, mix, table, results, side, spinner, die, venn, tree, treeFrame, outcomes, cellGrid,
  parts: { C, f, T, T0, svg, seg, poly, path, rect, circ, tall, halo, wd, COL, TINT, LETTER, SUIT, RED, BLACK, GRID, BLUE, INK, LINE } };
