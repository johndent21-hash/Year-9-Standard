// SVG figures for the exam. Units are millimetres on paper: every figure prints at the size it is drawn, to scale
// from the values given. Labels are 3.4 mm (about 9.6 pt). Labels are placed by a small collision check against the
// lines and other labels already drawn, so they do not sit on a line or on each other; build.js checks this again in
// the browser and prints a warning if anything still touches.
//
// Every figure function returns an SVG string. Put it in a question's `fig` field (or in an MC option). Table helpers
// (table, freqTable) return a table object instead; it prints as a real table (and a real Word table).
//
// Light fills in a Kingscliff-blue tint, black lines, dashed lines for heights, diagonals and hidden edges.
'use strict';
const H = require('./helpers');

const INK = '#1a1a1a';
const GREY = '#4a4a4a';
const FILL = '#e3ecf7';
const SIDE = '#c8d8ee';
const TOP = '#f0f5fb';
const BAR = '#bfd3ec';
const GRID = '#a3abb4';
const KEY = '#c00000';
const FS = 3.4; // label size, mm
const FONT = "Caladea, Cambria, 'Liberation Serif', serif";

const f = (n) => +(+n).toFixed(2);
const P = (p) => `${f(p[0])},${f(p[1])}`;
const rad = (d) => (d * Math.PI) / 180;
const fmt = (x) => (typeof x === 'number' ? H.num(x) : String(x));
const withUnit = (x, u) => (x === undefined || x === null ? '' : typeof x === 'number' ? (u ? H.unit(x, u) : H.num(x)) : String(x));

// ---------------------------------------------------------------- drawing state
// Labels and line segments drawn so far in the current figure (cleared when svg() closes a figure).
let LAB = [];
let SEG = [];
let EXT = [];
const reset = () => { LAB = []; SEG = []; EXT = []; };

// Text width estimate (mm) for Caladea/Cambria, used for placing labels and sizing the frame.
const plain = (s) => String(s).replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&[a-z]+;/g, 'x');
const cw = (c) => (/[0-9]/.test(c) ? 0.51 : /[A-Z]/.test(c) ? 0.63 : /[mw]/.test(c) ? 0.78 : /[il]/.test(c) ? 0.27 : /[a-z]/.test(c) ? 0.48
  : /[   ]/.test(c) ? 0.24 : /[²³]/.test(c) ? 0.34 : /[.,:;'′]/.test(c) ? 0.25 : /[()[\]]/.test(c) ? 0.33 : /[°]/.test(c) ? 0.4 : 0.55);
const tw = (s, size = FS) => [...plain(s)].reduce((t, c) => t + cw(c), 0) * size;
const HH = 0.41; // half height of a label box, as a fraction of the font size

const markup = (s) => String(s)
  .replace(/<i>(.*?)<\/i>/g, '<tspan font-style="italic">$1</tspan>')
  .replace(/<b>(.*?)<\/b>/g, '<tspan font-weight="700">$1</tspan>');

const boxOf = (cx, cy, s, size = FS, anchor = 'middle') => {
  const w = tw(s, size), hh = size * HH;
  const x0 = anchor === 'start' ? cx : anchor === 'end' ? cx - w : cx - w / 2;
  return [x0, cy - hh, x0 + w, cy + hh];
};

// A label centred on (x, y) (or starting/ending there with anchor 'start'/'end').
// o: { size, anchor, weight, italic, fill, rotate (degrees, about x, y) }
const T = (x, y, s, o = {}) => {
  if (s === '' || s === null || s === undefined) return '';
  const size = o.size || FS, anchor = o.anchor || 'middle';
  let box = boxOf(x, y, s, size, anchor);
  if (o.rotate) { const w = box[2] - box[0]; box = [x - size * HH, y - w / 2, x + size * HH, y + w / 2]; }
  LAB.push(box);
  const by = y + size * 0.34; // baseline: caps are centred on y
  const rot = o.rotate ? ` transform="rotate(${o.rotate} ${f(x)} ${f(y)})"` : '';
  const tx = o.rotate ? x : x, ty = o.rotate ? by : by;
  return `<text class="lbl" x="${f(tx)}" y="${f(ty)}" font-size="${size}" text-anchor="${anchor}"${o.weight ? ` font-weight="${o.weight}"` : ''}${o.italic ? ' font-style="italic"' : ''} fill="${o.fill || INK}"${rot}>${markup(s)}</text>`;
};

// ---------------------------------------------------------------- collision helpers
const inter = (a, b) => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];
const grow = (b, d) => [b[0] - d, b[1] - d, b[2] + d, b[3] + d];
// Does segment p-q cross the box? (Liang-Barsky clip)
const segHits = (p, q, b) => {
  let t0 = 0, t1 = 1;
  const dx = q[0] - p[0], dy = q[1] - p[1];
  const tests = [[-dx, p[0] - b[0]], [dx, b[2] - p[0]], [-dy, p[1] - b[1]], [dy, b[3] - p[1]]];
  for (const [pp, qq] of tests) {
    if (Math.abs(pp) < 1e-12) { if (qq < 0) return false; } else {
      const r = qq / pp;
      if (pp < 0) { if (r > t1) return false; if (r > t0) t0 = r; } else { if (r < t0) return false; if (r < t1) t1 = r; }
    }
  }
  return true;
};
const hits = (box, pad = 0.35) => {
  const b = grow(box, pad);
  let n = 0;
  SEG.forEach(([p, q]) => { if (segHits(p, q, b)) n++; });
  LAB.forEach((l) => { if (inter(b, l)) n += 2; });
  return n;
};
// Place a label at the first candidate that touches nothing (else the one touching least).
// cands: [[x, y]] label centres, or [[p, n, gap]] = beside point p, pushed out along unit vector n.
const centreFor = (p, n, s, size, gap = 1.2) => {
  const hw = tw(s, size) / 2, hh = size * HH;
  const d = gap + Math.abs(n[0]) * hw + Math.abs(n[1]) * hh;
  return [p[0] + n[0] * d, p[1] + n[1] * d];
};
const best = (cands, s, o = {}) => {
  if (s === '' || s === null || s === undefined) return '';
  const size = o.size || FS;
  let pick = null, low = Infinity;
  for (const c of cands) {
    const xy = c.length === 2 && typeof c[0] === 'number' ? c : centreFor(c[0], c[1], s, size, c[2]);
    const sc = hits(boxOf(xy[0], xy[1], s, size));
    if (sc < low) { low = sc; pick = xy; }
    if (sc === 0) break;
  }
  return T(pick[0], pick[1], s, o);
};

// ---------------------------------------------------------------- primitives (they record their segments)
const seg = (a, b, o = {}) => {
  if (!o.nl) SEG.push([a, b]);
  return `<line${o.nl ? ' class="nl"' : ''} x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${o.stroke || INK}" stroke-width="${o.w || 0.4}"${o.dash ? ` stroke-dasharray="${o.dash === true ? '1.3 0.9' : o.dash}"` : ''} stroke-linecap="round"/>`;
};
const dashed = (a, b, o = {}) => seg(a, b, { stroke: GREY, w: 0.32, dash: true, ...o });
const poly = (pts, fill = FILL, o = {}) => {
  pts.forEach((p, i) => SEG.push([p, pts[(i + 1) % pts.length]]));
  return `<polygon points="${pts.map(P).join(' ')}" fill="${fill}" stroke="${o.stroke || INK}" stroke-width="${o.w || 0.45}" stroke-linejoin="round"${o.dash ? ' stroke-dasharray="1.3 0.9"' : ''}/>`;
};
const pline = (pts, o = {}) => {
  if (!o.nl) pts.slice(1).forEach((p, i) => SEG.push([pts[i], p]));
  return `<polyline${o.nl ? ' class="nl"' : ''} points="${pts.map(P).join(' ')}" fill="none" stroke="${o.stroke || INK}" stroke-width="${o.w || 0.4}" stroke-linejoin="round"${o.dash ? ' stroke-dasharray="1.3 0.9"' : ''}/>`;
};
const dot = (p, r = 0.6, fill = INK) => { EXT.push([p[0] - r, p[1] - r, p[0] + r, p[1] + r]); return `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${r}" fill="${fill}"/>`; };
// Points along an arc (for collision records): centre c, radii rx, ry, from a0 to a1 degrees (y up, anticlockwise).
const arcPts = (c, rx, ry, a0, a1, n = 24) => Array.from({ length: n + 1 }, (_, i) => { const a = rad(a0 + ((a1 - a0) * i) / n); return [c[0] + rx * Math.cos(a), c[1] - ry * Math.sin(a)]; });
const recordPts = (pts) => pts.slice(1).forEach((p, i) => SEG.push([pts[i], p]));
const arrowHead = (tip, dir, s = 1.8) => {
  const L = Math.hypot(dir[0], dir[1]), u = [dir[0] / L, dir[1] / L], n = [-u[1], u[0]];
  const a = [tip[0] - u[0] * s + n[0] * s * 0.42, tip[1] - u[1] * s + n[1] * s * 0.42];
  const b = [tip[0] - u[0] * s - n[0] * s * 0.42, tip[1] - u[1] * s - n[1] * s * 0.42];
  return `<polygon points="${P(tip)} ${P(a)} ${P(b)}" fill="${INK}" stroke="none"/>`;
};
// Right-angle mark at corner p between the directions to a and c.
const rightMark = (p, a, c, s = 2) => {
  const u = (q) => { const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy); return [(dx / L) * s, (dy / L) * s]; };
  const [ax, ay] = u(a), [cx, cy] = u(c);
  const pts = [[p[0] + ax, p[1] + ay], [p[0] + ax + cx, p[1] + ay + cy], [p[0] + cx, p[1] + cy]];
  return `<polyline class="nl" points="${pts.map(P).join(' ')}" fill="none" stroke="${INK}" stroke-width="0.3"/>`;
};

// Close a figure: the frame is the box 0..w by 0..h, grown to hold every label and dot. Returns the <svg>.
const svg = (w, h, body, o = {}) => {
  const all = [...LAB, ...EXT];
  const xs = [-0.4, w + 0.4, ...all.flatMap((e) => [e[0] - 0.7, e[2] + 0.7])];
  const ys = [-0.4, h + 0.4, ...all.flatMap((e) => [e[1] - 0.6, e[3] + 0.6])];
  reset();
  const x0 = Math.min(...xs), y0 = Math.min(...ys), W = f(Math.max(...xs) - x0), Hh = f(Math.max(...ys) - y0);
  return `<svg class="fig${o.cls ? ` ${o.cls}` : ''}" xmlns="http://www.w3.org/2000/svg" viewBox="${f(x0)} ${f(y0)} ${W} ${Hh}" width="${W}mm" height="${Hh}mm" font-family="${FONT}">${body}</svg>`;
};

// Fit points (question units, y up) into a box size x maxH mm with margin m. Returns { k, map, w, h }.
const fitter = (pts, size, maxH, m = 1) => {
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const minX = Math.min(...xs), maxY = Math.max(...ys);
  const W = Math.max(...xs) - minX || 1, Hh = maxY - Math.min(...ys) || 1;
  const k = Math.min(size / W, (maxH || size) / Hh);
  return { k, map: (p) => [m + (p[0] - minX) * k, m + (maxY - p[1]) * k], w: W * k + 2 * m, h: Hh * k + 2 * m };
};
const orient = (Q) => Q.reduce((s, p, i) => { const q = Q[(i + 1) % Q.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0);
const unitV = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1; return [dx / L, dy / L]; };
const mid = (a, b, t = 0.5) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

// ================================================================ statistics figures

// Dot plot. dotPlot({ data: [2, 3, 3, 5], min: 0, max: 8, step: 1, xTitle: 'Goals scored' })
//   data: the values (or counts: { 2: 1, 3: 2 }); min/max: ends of the scale; step: gap between ticks;
//   labelEvery: number every nth tick; unitW: mm per step (default fits about 80 mm); title: above the plot.
const dotPlot = ({ data = [], counts, min, max, step = 1, labelEvery = 1, unitW, xTitle = '', title = '', dot: dd = 2.3 }) => {
  reset();
  const c = new Map();
  if (counts) Object.entries(counts).forEach(([k, n]) => c.set(+k, n)); else data.forEach((x) => c.set(x, (c.get(x) || 0) + 1));
  const lo = min ?? Math.min(...c.keys()), hi = max ?? Math.max(...c.keys());
  const n = Math.round((hi - lo) / step);
  const u = unitW || Math.max(4.6, Math.min(9, 80 / n));
  const maxC = Math.max(1, ...c.values()), pitch = dd + 0.6;
  const x0 = 4, top = title ? 7 : 1.5, y0 = top + maxC * pitch + 1.2;
  let b = '';
  if (title) b += T(x0 + (n * u) / 2, 2.5, title, { weight: 700 });
  b += seg([x0 - 3, y0], [x0 + n * u + 3, y0], { w: 0.4 }) + arrowHead([x0 - 3.6, y0], [-1, 0]) + arrowHead([x0 + n * u + 3.6, y0], [1, 0]);
  for (let i = 0; i <= n; i++) {
    const x = x0 + i * u;
    b += seg([x, y0], [x, y0 + 1.3], { w: 0.3 });
    if (i % labelEvery === 0) b += T(x, y0 + 3.9, fmt(+(lo + i * step).toFixed(6)), { size: 3.2 });
  }
  [...c.entries()].forEach(([val, k]) => {
    const i = Math.round((val - lo) / step);
    for (let j = 0; j < k; j++) b += dot([x0 + i * u, y0 - 0.9 - dd / 2 - j * pitch], dd / 2);
  });
  if (xTitle) b += T(x0 + (n * u) / 2, y0 + 8.6, xTitle);
  return svg(x0 + n * u + 4, y0 + 2, b);
};

// Frequency histogram or column graph with gridlines.
// histogram({ labels: [0, 1, 2, 3], freq: [5, 9, 7, 4], xTitle: 'Number of pets', yTitle: 'Frequency' })
//   kind: 'histogram' (columns touch, half a column gap at the start, as in the textbook) or 'column' (gaps);
//   edges: true puts the labels on the column edges (class boundaries; then labels has one more entry than freq);
//   yMax, yStep: the frequency axis; colW: column width mm (default fits about 75 mm); plotH: plot height mm;
//   polygon: true also draws the frequency polygon; title: above the graph; vgrid: vertical gridlines too.
const histogram = ({ labels, freq, kind = 'histogram', edges = false, yMax, yStep = 1, colW, plotH = 46, xTitle = '', yTitle = 'Frequency', title = '', polygon = false, vgrid = false, labelEvery = 1 }) => {
  reset();
  const nb = freq.length;
  const top = Math.max(...freq);
  const ym = yMax ?? Math.ceil((top + (top % yStep === 0 ? yStep : 0)) / yStep) * yStep;
  const gapF = kind === 'column' ? 0.5 : 0;
  const cw0 = colW || Math.max(5, Math.min(11, 75 / (nb + (nb + 1) * gapF + 1)));
  const lead = kind === 'column' ? cw0 * gapF : cw0 / 2;
  const ylabW = Math.max(...Array.from({ length: Math.floor(ym / yStep) + 1 }, (_, i) => tw(fmt(+(i * yStep).toFixed(6)), 3.2)));
  const left = (yTitle ? 7.5 : 1.5) + ylabW + 1.6;
  const plotW = lead * 2 + nb * cw0 + (nb - 1) * cw0 * gapF;
  const tY = title ? 7 : 3, y0 = tY + plotH;
  const k = plotH / ym;
  let b = '';
  if (title) b += T(left + plotW / 2, 2.5, title, { weight: 700 });
  for (let v = 0; v <= ym + 1e-9; v += yStep) {
    const y = y0 - v * k;
    if (v > 0) b += seg([left, y], [left + plotW, y], { stroke: GRID, w: 0.2, nl: true });
    b += seg([left - 1.2, y], [left, y], { w: 0.3 }) + T(left - 2.2, y, fmt(+v.toFixed(6)), { size: 3.2, anchor: 'end' });
  }
  const xAt = (i) => left + lead + i * cw0 * (1 + gapF);
  if (vgrid) for (let i = 0; i <= nb; i++) b += seg([xAt(i) - (i === nb ? cw0 * gapF : 0), tY], [xAt(i) - (i === nb ? cw0 * gapF : 0), y0], { stroke: GRID, w: 0.2, nl: true });
  freq.forEach((v, i) => {
    const x = xAt(i);
    if (v > 0) { b += `<rect x="${f(x)}" y="${f(y0 - v * k)}" width="${f(cw0)}" height="${f(v * k)}" fill="${BAR}" stroke="${INK}" stroke-width="0.35"/>`; recordPts([[x, y0], [x, y0 - v * k], [x + cw0, y0 - v * k], [x + cw0, y0]]); }
    if (!edges && i % labelEvery === 0) b += T(x + cw0 / 2, y0 + 3.9, fmt(labels[i]), { size: 3.2 });
  });
  if (edges) labels.forEach((l, i) => { if (i % labelEvery === 0) b += T(xAt(i), y0 + 3.9, fmt(l), { size: 3.2 }); });
  if (polygon) {
    const pts = [[xAt(0) - cw0 / 2, y0], ...freq.map((v, i) => [xAt(i) + cw0 / 2, y0 - v * k]), [xAt(nb - 1) + cw0 * 1.5, y0]];
    b += pline(pts, { w: 0.5, nl: true }) + pts.slice(1, -1).map((p) => dot(p, 0.7)).join('');
  }
  b += seg([left, y0], [left + plotW + 2.5, y0], { w: 0.45 }) + arrowHead([left + plotW + 3.2, y0], [1, 0]);
  b += seg([left, y0], [left, tY - 2.5], { w: 0.45 }) + arrowHead([left, tY - 3.2], [0, -1]);
  if (xTitle) b += T(left + plotW / 2, y0 + 8.6, xTitle);
  if (yTitle) b += T(2.6, tY + plotH / 2, yTitle, { rotate: -90 });
  return svg(left + plotW + 4, y0 + 2, b);
};

// Ordered stem-and-leaf plot as a neat table.
// stemLeaf({ data: [45, 67, 52, 58], key: '4 | 5 = 45' })
//   data: whole numbers (stem = tens, leaf = units; use stemUnit: 100 for hundreds, decimals: 1 for 3.4 = 3 | 4);
//   rows: [[stem, [leaves]]] to give the rows yourself (a leaf of '□' draws an empty box for a missing value);
//   stems: [first, last] to show empty stems at the ends; unordered: true keeps the data order; heads: column titles.
const slRows = (data, stemUnit, decimals, stems, unordered) => {
  const scale = 10 ** decimals;
  const items = data.map((x) => { const v = Math.round(x * scale); return [Math.floor(v / (stemUnit * scale / 10) / 10), Math.abs(v) % 10]; });
  const s0 = stems ? stems[0] : Math.min(...items.map((i) => i[0])), s1 = stems ? stems[1] : Math.max(...items.map((i) => i[0]));
  const rows = [];
  for (let s = s0; s <= s1; s++) {
    const leaves = items.filter((i) => i[0] === s).map((i) => i[1]);
    rows.push([s, unordered ? leaves : leaves.sort((a, c) => a - c)]);
  }
  return rows;
};
const leafCell = (x, y, l, size) => {
  if (l === '□' || l === null) { EXT.push([x - 1.3, y - 1.4, x + 1.3, y + 1.4]); return `<rect x="${f(x - 1.25)}" y="${f(y - 1.35)}" width="2.5" height="2.7" fill="#fff" stroke="${INK}" stroke-width="0.3"/>`; }
  return T(x, y, String(l), { size });
};
const stemLeaf = ({ data = [], rows, stemUnit = 10, decimals = 0, stems, unordered = false, key = '', heads = ['Stem', 'Leaf'], title = '', pitch = 3.5, rowH = 4.9, size = 3.4 }) => {
  reset();
  const R = rows || slRows(data, stemUnit, decimals, stems, unordered);
  const stemW = Math.max(tw(heads[0], size), ...R.map((r) => tw(String(r[0]), size))) + 2.4;
  const maxL = Math.max(1, ...R.map((r) => r[1].length));
  const leafW = Math.max(tw(heads[1], size) + 2, maxL * pitch + 2.4);
  const x0 = 1, tY = title ? 6.5 : 1, hY = tY + 2.4, lineY = tY + 4.9, xs = x0 + stemW;
  let b = '';
  if (title) b += T(x0 + (stemW + leafW) / 2, 2.4, title, { weight: 700 });
  b += T(xs - 1.3, hY, heads[0], { size, anchor: 'end' }) + T(xs + 1.5, hY, heads[1], { size, anchor: 'start' });
  b += seg([x0, lineY], [xs + leafW, lineY], { w: 0.35 });
  const bottom = lineY + R.length * rowH + 0.6;
  b += seg([xs, tY], [xs, bottom], { w: 0.35 });
  R.forEach(([s, leaves], i) => {
    const y = lineY + rowH * (i + 0.55);
    b += T(xs - 1.6, y, String(s), { size, anchor: 'end' });
    leaves.forEach((l, j) => { b += leafCell(xs + 2.6 + j * pitch, y, l, size); });
  });
  if (key) b += T(x0, bottom + 3.4, `Key: ${key}`, { size: 3.1, anchor: 'start' });
  return svg(xs + leafW + 1, bottom + (key ? 5.5 : 1), b);
};

// Back-to-back stem-and-leaf plot. backToBack({ left: [...], right: [...], heads: ['Boys', 'Girls'], key: '3 | 4 = 34' })
//   left leaves are written right to left, smallest next to the stem. rows: [[leftLeaves, stem, rightLeaves]] to give rows yourself.
const backToBack = ({ left = [], right = [], rows, stemUnit = 10, decimals = 0, stems, heads = ['', ''], stemHead = 'Stem', key = '', title = '', pitch = 3.5, rowH = 4.9, size = 3.4 }) => {
  reset();
  let R = rows;
  if (!R) {
    const all = [...left, ...right];
    const lo = stems || [Math.min(...slRows(all, stemUnit, decimals).map((r) => r[0])), Math.max(...slRows(all, stemUnit, decimals).map((r) => r[0]))];
    const L = slRows(left.length ? left : [], stemUnit, decimals, lo), Rr = slRows(right.length ? right : [], stemUnit, decimals, lo);
    R = L.map((r, i) => [r[1], r[0], Rr[i][1]]);
  }
  const maxL = Math.max(1, ...R.map((r) => r[0].length)), maxR = Math.max(1, ...R.map((r) => r[2].length));
  const lw = Math.max(tw(heads[0], size) + 2, maxL * pitch + 2.4), rw = Math.max(tw(heads[1], size) + 2, maxR * pitch + 2.4);
  const sw = Math.max(tw(stemHead, size), ...R.map((r) => tw(String(r[1]), size))) + 3.2;
  const x0 = 1, tY = title ? 6.5 : 1, hY = tY + 2.4, lineY = tY + 4.9, xa = x0 + lw, xb = xa + sw;
  let b = '';
  if (title) b += T(x0 + (lw + sw + rw) / 2, 2.4, title, { weight: 700 });
  b += T(xa - 1.4, hY, heads[0], { size, anchor: 'end' }) + T((xa + xb) / 2, hY, stemHead, { size }) + T(xb + 1.4, hY, heads[1], { size, anchor: 'start' });
  b += seg([x0, lineY], [xb + rw, lineY], { w: 0.35 });
  const bottom = lineY + R.length * rowH + 0.6;
  b += seg([xa, tY], [xa, bottom], { w: 0.35 }) + seg([xb, tY], [xb, bottom], { w: 0.35 });
  R.forEach(([ll, s, rl], i) => {
    const y = lineY + rowH * (i + 0.55);
    b += T((xa + xb) / 2, y, String(s), { size });
    ll.forEach((l, j) => { b += leafCell(xa - 2.6 - j * pitch, y, l, size); });
    rl.forEach((l, j) => { b += leafCell(xb + 2.6 + j * pitch, y, l, size); });
  });
  if (key) b += T(x0, bottom + 3.4, `Key: ${key}`, { size: 3.1, anchor: 'start' });
  return svg(xb + rw + 1, bottom + (key ? 5.5 : 1), b);
};

// ================================================================ tables (real tables, editable in Word)

// table({ head: ['Score', 'Frequency'], rows: [[1, 4], [2, 6]], foot: ['Total', 10] })
//   A cell is a string or number, or { key: '24' } for a box the student fills in (blank in the exam, the answer in
//   red in the marking guide), or { text, b: true } for bold. transpose: true lays the table out sideways (the head
//   becomes the first column). colW: column widths in mm. align: 'center' (default) or 'left'.
const table = ({ head = [], rows = [], foot, transpose = false, colW, align = 'center', size } = {}) => {
  let all = [head, ...rows, ...(foot ? [foot] : [])];
  if (transpose) all = all[0].map((_, c) => all.map((r) => r[c]));
  return { kind: 'table', rows: all, headRow: !transpose && head.length > 0, headCol: transpose, footRow: !!foot && !transpose, colW, align, size };
};
// Frequency table from values and frequencies.
// freqTable({ values: [0, 1, 2], freqs: [4, 7, 3], head: ['Number of pets (x)', 'Frequency (f)'], fx: true, total: true })
//   fx: true adds an f × x column (fx: 'key' makes it for the student to fill in); total: true adds a Total row
//   ('key' to fill in). freqs may contain { key: n } cells for missing frequencies.
const freqTable = ({ values, freqs, head = ['Score (<i>x</i>)', 'Frequency (<i>f</i>)'], fx = false, total = false, transpose = false, colW }) => {
  const fv = (c) => (typeof c === 'object' && c !== null ? +c.key : +c);
  const h = [...head]; if (fx) h.push('<i>f</i> × <i>x</i>');
  const rows = values.map((x, i) => {
    const r = [fmt(x), typeof freqs[i] === 'object' ? freqs[i] : fmt(freqs[i])];
    if (fx) { const p = fv(freqs[i]) * (typeof x === 'number' ? x : NaN); r.push(fx === 'key' ? { key: fmt(p) } : fmt(p)); }
    return r;
  });
  let foot;
  if (total) {
    const n = H.sum(freqs.map(fv)), s = H.sum(values.map((x, i) => x * fv(freqs[i])));
    foot = [{ text: 'Total', b: true }, total === 'key' ? { key: fmt(n) } : fmt(n)];
    if (fx) foot.push(total === 'key' || fx === 'key' ? { key: fmt(s) } : fmt(s));
  }
  return table({ head: h, rows, foot, transpose, colW });
};

// ================================================================ flat shapes

// A polygon from its corners (question units, x right, y up), drawn to scale.
// shape({ pts: [[0,0],[12,0],[12,5],[7,5],[7,9],[0,9]], sides: ['12 m', '5 m', '', '4 m', '', '9 m'], right: 'auto' })
//   sides: a label for each side (side i joins corner i to corner i+1); or 'auto' with unit to label every side with
//     its length (hide: [side numbers] leaves some blank);
//   right: 'auto' marks every 90° corner of the shape (not the inside corners of a notch), 'all' marks those too,
//     or give a list of corner numbers, or [] for none;
//   dash: [[p, q, label]] dashed lines (heights, diagonals) in question units; marks: [[p, q, r]] extra right-angle
//     marks at p; labels: [[text, x, y]] free labels; size: mm for the widest side; maxH: mm for the height.
const shape = ({ pts, sides = [], unit = '', hide = [], right = 'auto', dash = [], marks = [], labels = [], size = 50, maxH = 40, fill = FILL, dims = [] }) => {
  reset();
  const { k, map, w, h } = fitter([...pts, ...dash.flatMap((d) => [d[0], d[1]])], size, maxH, 1);
  const Q = pts.map(map);
  const sg = orient(Q) > 0 ? 1 : -1;
  const out = (a, c) => { const [ux, uy] = unitV(a, c); return sg > 0 ? [uy, -ux] : [-uy, ux]; };
  let b = poly(Q, fill);
  const nQ = Q.length;
  const rightList = right === 'auto' || right === 'all' ? Q.map((p, i) => i).filter((i) => {
    const a = Q[(i + nQ - 1) % nQ], c = Q[(i + 1) % nQ], u = unitV(Q[i], a), v = unitV(Q[i], c);
    const cross = u[0] * v[1] - u[1] * v[0];
    return Math.abs(u[0] * v[0] + u[1] * v[1]) < 0.02 && (right === 'all' || cross * sg < 0);
  }) : right;
  rightList.forEach((i) => { b += rightMark(Q[i], Q[(i + nQ - 1) % nQ], Q[(i + 1) % nQ]); });
  marks.forEach(([p, q, r]) => { b += rightMark(map(p), map(q), map(r)); });
  dash.forEach(([p, q]) => { b += dashed(map(p), map(q)); });
  const sideLabels = sides === 'auto' ? pts.map((p, i) => (hide.includes(i) ? '' : withUnit(+Math.hypot(pts[(i + 1) % nQ][0] - p[0], pts[(i + 1) % nQ][1] - p[1]).toFixed(6), unit))) : sides;
  dims.forEach(([p, q, lab, side = 1]) => {
    const a = map(p), c = map(q), u = unitV(a, c), n = [u[1] * side, -u[0] * side];
    const A2 = [a[0] + n[0] * 3, a[1] + n[1] * 3], C2 = [c[0] + n[0] * 3, c[1] + n[1] * 3];
    b += seg(A2, C2, { stroke: GREY, w: 0.28 }) + seg([A2[0] - n[0], A2[1] - n[1]], [A2[0] + n[0], A2[1] + n[1]], { stroke: GREY, w: 0.28 }) + seg([C2[0] - n[0], C2[1] - n[1]], [C2[0] + n[0], C2[1] + n[1]], { stroke: GREY, w: 0.28 });
    b += best([[mid(A2, C2), n, 0.9], [mid(A2, C2), [-n[0], -n[1]], 0.9]], lab);
  });
  (sideLabels || []).forEach((s, i) => {
    if (!s) return;
    const a = Q[i], c = Q[(i + 1) % nQ], n = out(a, c), m2 = mid(a, c);
    b += best([[m2, n], [mid(a, c, 0.3), n], [mid(a, c, 0.7), n], [m2, [-n[0], -n[1]]]], s);
  });
  dash.forEach(([p, q, lab, side]) => {
    if (!lab) return;
    const a = map(p), c = map(q), u = unitV(a, c), n = [u[1], -u[0]], m2 = mid(a, c);
    const c1 = [[m2, n, 1], [m2, [-n[0], -n[1]], 1], [mid(a, c, 0.3), n, 1], [mid(a, c, 0.3), [-n[0], -n[1]], 1], [mid(a, c, 0.7), n, 1], [mid(a, c, 0.7), [-n[0], -n[1]], 1]];
    b += best(side === -1 ? [c1[1], c1[0], c1[3], c1[2], c1[5], c1[4]] : c1, lab);
  });
  labels.forEach(([s, x, y, o = {}]) => { const p = map([x, y]); b += T(p[0], p[1], s, o); });
  void k;
  return svg(w, h, b);
};

// Composite (rectilinear) shape from its corner points: the same as shape() with right angles marked.
// composite({ pts: [[0,0],[13,0],[13,7],[7,7],[7,13],[0,13]], sides: 'auto', unit: 'm', hide: [2, 3] })
const composite = (o) => shape({ right: 'auto', ...o });

// Rectangle l x w. rectangle({ l: 12, w: 5, unit: 'cm' }) (labels: { l, w } to change the words).
const rectangle = ({ l, w, unit = '', labels = {}, size = 40, maxH = 30 }) =>
  shape({ pts: [[0, 0], [l, 0], [l, w], [0, w]], sides: [labels.l ?? withUnit(l, unit), labels.w ?? withUnit(w, unit), '', ''], right: [0, 1, 2, 3], size, maxH });

// Triangle with base b, height h (dashed), apex above the point a along the base.
// triangle({ b: 10, h: 6, a: 3.5, unit: 'cm' })
const triangle = ({ b, h, a = b * 0.35, unit = '', labels = {}, size = 40, maxH = 30 }) => {
  const dash = Math.abs(a) < 1e-9 || Math.abs(a - b) < 1e-9 ? [] : [[[a, h], [a, 0], labels.h ?? withUnit(h, unit)]];
  return shape({ pts: [[0, 0], [b, 0], [a, h]], sides: [labels.b ?? withUnit(b, unit), labels.s1 || '', dash.length ? labels.s2 || '' : (labels.h ?? withUnit(h, unit))],
    right: dash.length ? [] : [a < b / 2 ? 0 : 1], dash, marks: dash.length ? [[[a, 0], [a, 1], [a + (a > b / 2 ? -1 : 1), 0]]] : [], size, maxH });
};

// Trapezium: parallel sides a (top) and b (bottom), height h; the top side starts s units in from the left.
// trapezium({ a: 6, b: 10, h: 4, s: 2, unit: 'cm' }); s: 0 gives a right trapezium (height on the left side).
const trapezium = ({ a, b, h, s = (b - a) / 2, unit = '', labels = {}, size = 46, maxH = 30 }) => {
  const right = Math.abs(s) < 1e-9;
  const hx = right ? 0 : Math.max(s, 0) > 0 ? s : s + a;
  return shape({ pts: [[0, 0], [b, 0], [s + a, h], [s, h]],
    sides: [labels.b ?? withUnit(b, unit), labels.r || '', labels.a ?? withUnit(a, unit), right ? (labels.h ?? withUnit(h, unit)) : (labels.l || '')],
    right: right ? [0, 3] : [], dash: right ? [] : [[[hx, h], [hx, 0], labels.h ?? withUnit(h, unit)]],
    marks: right ? [] : [[[hx, 0], [hx, 1], [hx + 1, 0]]], size, maxH });
};

// Parallelogram: base b, height h (dashed), the top side shifted s units right.
// parallelogram({ b: 10, h: 5, s: 3, unit: 'm' }); labels.side labels a sloping side.
const parallelogram = ({ b, h, s = b * 0.3, unit = '', labels = {}, size = 46, maxH = 30 }) =>
  shape({ pts: [[0, 0], [b, 0], [b + s, h], [s, h]], sides: [labels.b ?? withUnit(b, unit), labels.side || '', '', ''], right: [],
    dash: [[[s, h], [s, 0], labels.h ?? withUnit(h, unit)]], marks: [[[s, 0], [s, 1], [s + 1, 0]]], size, maxH });

// Rhombus from its diagonals x (across) and y (up), dashed. rhombus({ x: 16, y: 10, unit: 'cm' })
// Kite: the across diagonal crosses the up diagonal c units above the bottom. kite({ x: 10, y: 16, c: 11, unit: 'cm' })
//   labels: { x, y } words for the diagonals; the lengths go on measurement lines outside the shape (the across one
//   below, the up one on the right); dims: false writes them beside the diagonals instead; sides: [4 labels].
const kite = ({ x, y, c = y / 2, unit = '', labels = {}, size = 40, maxH = 34, dims = true, sides = [] }) => {
  const lx = labels.x ?? withUnit(x, unit), ly = labels.y ?? withUnit(y, unit);
  const pts = [[0, 0], [x / 2, c], [0, y], [-x / 2, c]];
  const mark = [[[0, c], [1, c], [0, c + 1]]];
  if (dims) return shape({ pts, sides, right: [], dash: [[[-x / 2, c], [x / 2, c]], [[0, 0], [0, y]]], marks: mark, dims: [[[-x / 2, 0], [x / 2, 0], lx, -1], [[x / 2, 0], [x / 2, y], ly, -1]], size, maxH });
  // labels beside the diagonals, away from the centre: the across one on its right half, the up one on its top half
  return shape({ pts, sides, right: [], dash: [[[x / 2, c], [0, c], lx], [[0, y], [0, c], ly], [[-x / 2, c], [0, c]], [[0, 0], [0, c]]], marks: mark, size, maxH });
};
const rhombus = (o) => kite({ ...o, c: o.y / 2 });

// ================================================================ circles

// Circle, semicircle, quadrant or sector, drawn to scale.
// sector({ r: 8, angle: 120, unit: 'cm', show: 'r', angleLabel: '120°' })
//   angle: degrees (360 = circle); rot: where the first radius points (degrees, 0 = right, anticlockwise);
//   show: 'r' draws and labels a radius, 'd' a diameter; lab: the words (default from r and unit); size: mm across.
const sector = ({ r, angle = 360, rot = 0, unit = '', show = 'r', lab, angleLabel = '', size = 34, fill = FILL }) => {
  reset();
  const full = angle >= 360, R = size / 2, m = 1;
  const angs = [rot, rot + angle, ...[0, 90, 180, 270, 360, 450, 540, 630].filter((a) => a > rot && a < rot + angle)];
  const ext = full ? [[-R, -R], [R, R]] : [[0, 0], ...angs.map((a) => [R * Math.cos(rad(a)), R * Math.sin(rad(a))])];
  const xs = ext.map((p) => p[0]), ys = ext.map((p) => p[1]);
  const c = [m - Math.min(...xs), m + Math.max(...ys)];
  const W = Math.max(...xs) - Math.min(...xs) + 2 * m, Hh = Math.max(...ys) - Math.min(...ys) + 2 * m;
  const at = (a, rr = R) => [c[0] + rr * Math.cos(rad(a)), c[1] - rr * Math.sin(rad(a))];
  let b = '';
  if (full) { b += `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(R)}" fill="${fill}" stroke="${INK}" stroke-width="0.45"/>`; recordPts(arcPts(c, R, R, 0, 360, 48)); } else {
    const p0 = at(rot), p1 = at(rot + angle);
    b += `<path d="M${P(c)} L${P(p0)} A${f(R)},${f(R)} 0 ${angle > 180 ? 1 : 0} 0 ${P(p1)} Z" fill="${fill}" stroke="${INK}" stroke-width="0.45" stroke-linejoin="round"/>`;
    SEG.push([c, p0], [c, p1]); recordPts(arcPts(c, R, R, rot, rot + angle, 32));
  }
  b += dot(c, 0.55);
  if (!full && Math.abs(angle - 90) < 0.01) b += rightMark(c, at(rot), at(rot + 90), 2.2);
  const text = lab ?? withUnit(show === 'd' ? 2 * r : r, unit);
  // a part circle: the label goes outside its flat edge (away from the arc); a circle: beside the drawn line
  const away = (a) => { const t = rad(rot + angle / 2); const n = [Math.sin(rad(a)), Math.cos(rad(a))]; return n[0] * Math.cos(t) - n[1] * Math.sin(t) > 0 ? [-n[0], -n[1]] : n; };
  if (show === 'd') {
    const e1 = at(rot), e2 = at(rot + 180);
    if (full) b += seg(e2, e1, { w: 0.45 });
    const u = unitV(e2, e1), n = full ? [u[1], -u[0]] : away(rot);
    b += best([[c, n, 1.2], [mid(c, e1, 0.5), n, 1.2], [mid(c, e2, 0.5), n, 1.2], [c, [-n[0], -n[1]], 1.2]], text);
  } else if (show === 'r') {
    const a = full ? rot + 30 : rot; const e = at(a);
    if (full) b += seg(c, e, { w: 0.45 });
    const u = unitV(c, e), n = full ? [u[1], -u[0]] : away(a);
    b += best([[mid(c, e), n, 1.2], [mid(c, e, 0.6), n, 1.2], [mid(c, e), [-n[0], -n[1]], 1.2]], text);
  }
  if (angleLabel && !full) {
    const midA = rot + angle / 2, ar = Math.min(4.2, R * 0.3), a = arcPts(c, ar, ar, rot, rot + angle, 16);
    if (Math.abs(angle - 90) > 0.01) b += `<path class="nl" d="M${P(a[0])} A${ar},${ar} 0 ${angle > 180 ? 1 : 0} 0 ${P(a[a.length - 1])}" fill="none" stroke="${INK}" stroke-width="0.3"/>`;
    const d = ar + 1 + tw(angleLabel) / 2;
    b += best([at(midA, d), at(midA, d + 2)], angleLabel);
  }
  return svg(W, Hh, b);
};
const circle = (o) => sector({ ...o, angle: 360 });
const semicircle = (o) => sector({ show: 'd', ...o, angle: 180 });
const quadrant = (o) => sector({ ...o, angle: 90 });

// ================================================================ right-angled triangle (Pythagoras, trigonometry)

// rightTriangle({ base: 8, height: 6, labels: { base: '8 cm', height: '6 cm', hyp: '<i>x</i>' } })
//   base: horizontal side, height: vertical side (question units, drawn to scale); corner: where the right angle is
//   ('BR' bottom right, 'BL', 'TR', 'TL'); labels: { base, height, hyp } (default: the lengths with unit; '' hides);
//   angle: { at: 'base' | 'vert', label: 'θ' or '35°' } marks the acute angle at the far end of the horizontal side
//   ('base') or of the vertical side ('vert'); size: mm for the longer leg; minSide: shortest leg in mm.
const rightTriangle = ({ base, height, unit = '', labels = {}, corner = 'BR', angle, size = 42, minSide = 12 }) => {
  reset();
  let k = size / Math.max(base, height);
  let bw = base * k, hh = height * k;
  if (bw < minSide) bw = minSide; if (hh < minSide) hh = minSide;
  const m = 1, right = corner.includes('R'), bottom = corner.includes('B');
  const C = [m + (right ? bw : 0), m + (bottom ? hh : 0)];
  const A = [m + (right ? 0 : bw), C[1]];          // end of the base
  const Bv = [C[0], m + (bottom ? 0 : hh)];       // end of the vertical side
  let b = poly([A, C, Bv], FILL) + rightMark(C, A, Bv, 2.4);
  const cen = [(A[0] + C[0] + Bv[0]) / 3, (A[1] + C[1] + Bv[1]) / 3];
  const outN = (p, q) => { const u = unitV(p, q); let n = [u[1], -u[0]]; const mm = mid(p, q); if ((cen[0] - mm[0]) * n[0] + (cen[1] - mm[1]) * n[1] > 0) n = [-n[0], -n[1]]; return n; };
  // angle marker first, so the side labels keep clear of it
  if (angle && angle.label !== undefined) {
    const atV = angle.at === 'top' || angle.at === 'vert';
    const V = atV ? Bv : A, O1 = C, O2 = atV ? A : Bv;
    const u1 = unitV(V, O1), u2 = unitV(V, O2);
    const th = Math.acos(u1[0] * u2[0] + u1[1] * u2[1]);
    const ar = Math.max(4, Math.min(7, 2.2 / Math.tan(th / 2)));
    const p1 = [V[0] + u1[0] * ar, V[1] + u1[1] * ar], p2 = [V[0] + u2[0] * ar, V[1] + u2[1] * ar];
    const sweep = (u1[0] * u2[1] - u1[1] * u2[0]) > 0 ? 1 : 0;
    b += `<path class="nl" d="M${P(p1)} A${ar},${ar} 0 0 ${sweep} ${P(p2)}" fill="none" stroke="${INK}" stroke-width="0.32"/>`;
    const bis = unitV([0, 0], [u1[0] + u2[0], u1[1] + u2[1]]);
    const s = angle.label, hw = tw(s) / 2, hh2 = FS * HH;
    const nrm = (u) => [-u[1], u[0]];
    const sup = (n) => Math.abs(n[0]) * hw + Math.abs(n[1]) * hh2;
    const need = Math.max(sup(nrm(u1)), sup(nrm(u2))) + 0.6;
    const d = Math.max(ar + 1.2 + Math.max(hw, hh2), need / Math.sin(th / 2));
    b += best([[V[0] + bis[0] * d, V[1] + bis[1] * d], [V[0] + bis[0] * (d + 2), V[1] + bis[1] * (d + 2)]], s);
  }
  const lb = labels.base ?? withUnit(base, unit), lh = labels.height ?? withUnit(height, unit), lc = labels.hyp ?? '';
  const sideAt = (p, q, s) => { if (!s) return ''; const n = outN(p, q); return best([[mid(p, q), n], [mid(p, q, 0.35), n], [mid(p, q, 0.65), n]], s); };
  b += sideAt(A, C, lb) + sideAt(C, Bv, lh) + sideAt(A, Bv, lc);
  return svg(bw + 2 * m, hh + 2 * m, b);
};

// ================================================================ solids (oblique view: depth drawn 35° up-right at 0.55 scale)
const DEPTH = [Math.cos(rad(35)) * 0.55, -Math.sin(rad(35)) * 0.55];

// Any prism from its front face (question units, x right, y up) pushed back by len.
// prism({ face: [[0,0],[6,0],[0,4]], len: 10, sides: ['6 cm', '', '4 cm'], lenLabel: '10 cm' })
//   sides: labels for the front-face edges (edge i joins corner i to i+1); lenLabel: on the receding edge from corner
//   lenAt (default: the bottom-right corner); right: right-angle marks on the front face (corner numbers);
//   dash: [[p, q, label]] dashed lines on the front face; size: mm across; maxH: mm high.
const prism = ({ face, len, sides = [], lenLabel = '', lenAt, size = 44, maxH = 34, right = [], dash = [], fill = FILL }) => {
  reset();
  const xs = face.map((p) => p[0]), ys = face.map((p) => p[1]);
  const W = Math.max(...xs) - Math.min(...xs) + len * DEPTH[0], Hh = Math.max(...ys) - Math.min(...ys) - len * DEPTH[1];
  const k = Math.min(size / W, maxH / Hh), m = 1;
  const X0 = m - Math.min(...xs) * k, Y0 = m - len * DEPTH[1] * k + Math.max(...ys) * k;
  const F = (p) => [X0 + p[0] * k, Y0 - p[1] * k];
  const B = (p) => [X0 + p[0] * k + len * DEPTH[0] * k, Y0 - p[1] * k + len * DEPTH[1] * k];
  const front = face.map(F), back = face.map(B), n = face.length;
  const sg = orient(front) > 0 ? 1 : -1;
  const outN = (i) => { const u = unitV(front[i], front[(i + 1) % n]); return sg > 0 ? [u[1], -u[0]] : [-u[1], u[0]]; };
  const vis = (i) => { const [nx, ny] = outN(i); return nx * DEPTH[0] + ny * DEPTH[1] > 1e-6; };
  let b = '';
  // hidden edges (dashed) first; the visible faces are drawn over them
  const hidden = [];
  for (let i = 0; i < n; i++) hidden.push([back[i], back[(i + 1) % n]], [front[i], back[i]]);
  b += hidden.map(([p, q]) => `<line class="nl" x1="${f(p[0])}" y1="${f(p[1])}" x2="${f(q[0])}" y2="${f(q[1])}" stroke="${GREY}" stroke-width="0.3" stroke-dasharray="1.3 0.9"/>`).join('');
  for (let i = 0; i < n; i++) if (vis(i)) { const j = (i + 1) % n; const [, ny] = outN(i); b += poly([front[i], front[j], back[j], back[i]], ny < -0.5 ? TOP : SIDE); }
  b += poly(front, fill);
  right.forEach((i) => { b += rightMark(front[i], front[(i + n - 1) % n], front[(i + 1) % n]); });
  dash.forEach(([p, q]) => { b += dashed(F(p), F(q)); });
  // the receding edge label first (it has the least room)
  if (lenLabel) {
    let i = lenAt;
    if (i === undefined) { i = 0; front.forEach((p, j) => { if (p[1] > front[i][1] + 1e-6 || (Math.abs(p[1] - front[i][1]) < 1e-6 && p[0] > front[i][0])) i = j; }); }
    const a = front[i], c = back[i], u = unitV(a, c);
    const nn = [-u[1], u[0]].map((v) => v);
    const nOut = nn[0] > 0 ? nn : [-nn[0], -nn[1]];
    b += best([[mid(a, c), nOut], [mid(a, c, 0.35), nOut], [mid(a, c, 0.65), nOut]], lenLabel);
  }
  sides.forEach((s, i) => {
    if (!s) return;
    const j = (i + 1) % n;
    if (vis(i)) { const q = [front[i], front[j], back[j], back[i]]; b += best([[q.reduce((t, p) => t + p[0], 0) / 4, q.reduce((t, p) => t + p[1], 0) / 4], [mid(back[i], back[j]), outN(i)]], s); } else b += best([[mid(front[i], front[j]), outN(i)], [mid(front[i], front[j], 0.35), outN(i)]], s);
  });
  dash.forEach(([p, q, lab]) => {
    if (!lab) return;
    const a = F(p), c = F(q), u = unitV(a, c), nn = [u[1], -u[0]], mn = [-nn[0], -nn[1]];
    b += best([0.5, 0.65, 0.78, 0.35].flatMap((t) => [[mid(a, c, t), nn, 0.9], [mid(a, c, t), mn, 0.9]]), lab);
  });
  return svg(W * k + 2 * m, Hh * k + 2 * m, b);
};

// Rectangular prism l (across) x w (back) x h (up). rectPrism({ l: 12, w: 5, h: 4, unit: 'cm' })
//   labels: { l, w, h } to change the words ('' hides one).
const rectPrism = ({ l, w, h, unit = '', labels = {}, size = 46, maxH = 34 }) =>
  prism({ face: [[0, 0], [l, 0], [l, h], [0, h]], len: w, sides: [labels.l ?? withUnit(l, unit), '', '', labels.h ?? withUnit(h, unit)], lenLabel: labels.w ?? withUnit(w, unit), lenAt: 1, size, maxH });

// Triangular prism: the front face is a triangle with base b and height h; the prism is len long.
// triPrism({ b: 6, h: 4, len: 10, unit: 'cm' }) — right angle at the bottom left by default.
//   apex: where the top corner is above the base, in units from the left (0 = right-angled, b/2 = isosceles, with a
//   dashed height); labels: { b, h, s (sloping side), s2 (other sloping side), len }.
const triPrism = ({ b, h, len, apex = 0, unit = '', labels = {}, size = 46, maxH = 34 }) => {
  const ra = Math.abs(apex) < 1e-9;
  const face = [[0, 0], [b, 0], [apex, h]];
  return prism({ face, len, size, maxH, right: ra ? [0] : [],
    sides: [labels.b ?? withUnit(b, unit), labels.s || '', ra ? (labels.h ?? withUnit(h, unit)) : (labels.s2 || '')],
    dash: ra ? [] : [[[apex, h], [apex, 0], labels.h ?? withUnit(h, unit)]], lenLabel: labels.len ?? withUnit(len, unit), lenAt: 1 });
};

// Cylinder standing up. cylinder({ r: 4, h: 10, unit: 'cm' }); show: 'd' marks the diameter instead (label from 2r);
//   labels: { r, h } (r is the words for the radius or diameter); open: true draws an open top; size: mm across.
const cylinder = ({ r, h, unit = '', show = 'r', labels = {}, open = false, size = 30, maxH = 40 }) => {
  reset();
  const k = Math.min(size / (2 * r), maxH / (h + 0.7 * r)), R = r * k, E = Math.max(1.6, R * 0.33), Hh = h * k, m = 1;
  const cx = m + R, top = m + E, bot = top + Hh;
  let b = `<path d="M${f(cx - R)},${f(top)} L${f(cx - R)},${f(bot)} A${f(R)},${f(E)} 0 0 0 ${f(cx + R)},${f(bot)} L${f(cx + R)},${f(top)}" fill="${SIDE}" stroke="${INK}" stroke-width="0.45"/>`;
  SEG.push([[cx - R, top], [cx - R, bot]], [[cx + R, top], [cx + R, bot]]); recordPts(arcPts([cx, bot], R, E, 180, 360, 24));
  b += `<path class="nl" d="M${f(cx - R)},${f(bot)} A${f(R)},${f(E)} 0 0 1 ${f(cx + R)},${f(bot)}" fill="none" stroke="${GREY}" stroke-width="0.3" stroke-dasharray="1.3 0.9"/>`;
  b += `<ellipse cx="${f(cx)}" cy="${f(top)}" rx="${f(R)}" ry="${f(E)}" fill="${open ? '#fff' : TOP}" stroke="${INK}" stroke-width="0.45"/>`;
  recordPts(arcPts([cx, top], R, E, 0, 360, 36));
  b += dot([cx, top], 0.5);
  const lr = labels.r ?? withUnit(show === 'd' ? 2 * r : r, unit), lh = labels.h ?? withUnit(h, unit);
  if (show === 'd') { b += seg([cx - R, top], [cx + R, top], { w: 0.45 }); b += best([[[cx, top - E], [0, -1], 1], [[cx, top + E], [0, 1], 1]], lr); }
  else { b += seg([cx, top], [cx + R, top], { w: 0.45 }); b += best([[[cx + R / 2, top - E], [0, -1], 1], [[cx + R / 2, top], [0, -1], 0.6], [[cx + R + 0.5, top], [1, 0], 1]], lr); }
  b += best([[[cx + R, (top + bot) / 2], [1, 0], 1.4]], lh);
  return svg(2 * R + 2 * m, Hh + 2 * E + 2 * m, b);
};

// ================================================================ networks (Chapter 6)

// network({ nodes: { A: [0, 0], B: [4, 1], C: [2, 3] }, edges: [['A', 'B', 5], ['B', 'C', 3], ['A', 'C']] })
//   nodes: positions in any units (x right, y up); edges: [from, to, weight?, bend?]; size: mm across; maxH: mm high;
//   labelAt: { A: 'n' | 'ne' | 'e' | ... } to force where a vertex name goes; bend (mm, + bulges to the left of
//   from→to) curves an edge, e.g. for two edges between the same vertices: ['P', 'R', 4, 5], ['P', 'R', 6, -5]
//   (curve: { 'P-R': 5 } does the same for every P-R edge); loops are not drawn.
const network = ({ nodes, edges = [], size = 60, maxH = 40, labelAt = {}, curve = {}, r = 1.1, weightSize = 3.2 }) => {
  reset();
  const names = Object.keys(nodes);
  const { map, w, h } = fitter(names.map((k) => nodes[k]), size, maxH, 1);
  const Pn = Object.fromEntries(names.map((k) => [k, map(nodes[k])]));
  let b = '';
  const drawn = [];
  edges.forEach(([a, c, wgt, bend0]) => {
    const p = Pn[a], q = Pn[c], key = `${a}-${c}`, bend = bend0 ?? curve[key] ?? (curve[`${c}-${a}`] !== undefined ? -curve[`${c}-${a}`] : 0);
    const u = unitV(p, q), n = [u[1], -u[0]];
    let mpt = mid(p, q), lineN = n;
    if (bend) {
      const ctl = [mpt[0] + n[0] * bend * 2, mpt[1] + n[1] * bend * 2];
      b += `<path d="M${P(p)} Q${P(ctl)} ${P(q)}" fill="none" stroke="${INK}" stroke-width="0.4"/>`;
      const pts = Array.from({ length: 17 }, (_, i) => { const t = i / 16; return [(1 - t) ** 2 * p[0] + 2 * (1 - t) * t * ctl[0] + t * t * q[0], (1 - t) ** 2 * p[1] + 2 * (1 - t) * t * ctl[1] + t * t * q[1]]; });
      recordPts(pts); mpt = pts[8]; lineN = bend > 0 ? n : [-n[0], -n[1]];
    } else b += seg(p, q, { w: 0.4 });
    drawn.push([mpt, lineN, wgt, u, p, q]);
  });
  names.forEach((k) => { b += dot(Pn[k], r); });
  // vertex names: the compass direction furthest from the edges at that vertex
  const dirs = { e: [1, 0], ne: [0.71, -0.71], n: [0, -1], nw: [-0.71, -0.71], w: [-1, 0], sw: [-0.71, 0.71], s: [0, 1], se: [0.71, 0.71] };
  names.forEach((k) => {
    const p = Pn[k];
    const inc = edges.filter((e) => e[0] === k || e[1] === k).map((e) => unitV(p, Pn[e[0] === k ? e[1] : e[0]]));
    const order = Object.entries(dirs).map(([nm, d]) => [nm, d, Math.min(4, ...inc.map((u) => Math.acos(Math.max(-1, Math.min(1, u[0] * d[0] + u[1] * d[1])))))]).sort((x, y) => y[2] - x[2]);
    const list = labelAt[k] ? [[labelAt[k], dirs[labelAt[k]]]] : order;
    b += best(list.map(([, d]) => [p, d, r + 0.6]), k, { weight: 700 });
  });
  drawn.forEach(([mpt, n, wgt, u]) => {
    if (wgt === undefined || wgt === null || wgt === '') return;
    const s = fmt(wgt);
    b += best([[mpt, n, 0.8], [mpt, [-n[0], -n[1]], 0.8], [[mpt[0] + u[0] * 3, mpt[1] + u[1] * 3], n, 0.8], [[mpt[0] - u[0] * 3, mpt[1] - u[1] * 3], n, 0.8]], s, { size: weightSize });
  });
  return svg(w, h, b);
};

module.exports = {
  dotPlot, histogram, stemLeaf, backToBack, table, freqTable,
  shape, composite, rectangle, triangle, trapezium, parallelogram, kite, rhombus,
  sector, circle, semicircle, quadrant, rightTriangle, prism, rectPrism, triPrism, cylinder, network,
  // building blocks for a one-off figure: draw with seg/poly/pline/dot, place labels with T or best, finish with svg(w, h, body)
  parts: { reset, T, best, seg, dashed, poly, pline, dot, arrowHead, rightMark, svg, fitter, tw, mid, unitV, FS, INK, GREY, FILL, SIDE, TOP, BAR, GRID, KEY },
};
