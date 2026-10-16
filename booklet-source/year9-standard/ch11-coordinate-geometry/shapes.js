// Diagrams for Chapter 11 Coordinate geometry and graphs (SVG, units in mm): number planes drawn to scale from each
// question's own numbers, with the Chapter 10 drawing parts (labels grow the picture's frame; see ../ch10…/shapes.js).
// Given values are drawn in blue; the unknown is marked with a ?.
const { C, f, T, svg, seg, dot } = require('../ch10-surface-area-volume/shapes').parts;

const GRID = '#d6dbe8', INK = C.charcoal, BLUE = C.blue;
// A short picture (a flat interval, a two-row table) gets invisible space above and below, so it is at least 12 mm tall
// (the builder's layout check treats a shorter graph as squashed).
const tall = (x, H) => (H < 14 ? T(x, H / 2 - 5.6, ' ', { size: 2.8 }) + T(x, H / 2 + 6.2, ' ', { size: 2.8 }) : '');
const n = (v) => (v < 0 ? `−${+(-v).toFixed(6)}` : `${+(+v).toFixed(6)}`);
const arrow = ([x, y], dir) => (dir === 'r' ? `<path d="M${f(x)},${f(y)} l-1.5,-0.7 v1.4 z" fill="${INK}"/>` : `<path d="M${f(x)},${f(y)} l-0.7,1.5 h1.4 z" fill="${INK}"/>`);
// Label positions round a dot: [dx, dy, anchor]
const POS = { ne: [1, -1.1, 'start'], nw: [-1, -1.1, 'end'], se: [1, 3, 'start'], sw: [-1, 3, 'end'], n: [0, -1.4, 'middle'], s: [0, 3.6, 'middle'], e: [1.4, 1, 'start'], w: [-1.4, 1, 'end'] };

// plane(o): a number plane from x0 to x1 and y0 to y1 (o.x, o.y), k mm per unit.
//   grid: grid lines every unit; nums: number the axes every `every` units (0 at the origin)
//   pts: [[x, y, label, pos]] dots with labels; segs: [[a, b, o]] intervals (o.blue, o.dash, o.w)
//   lines: [[line, label, at, pos]] a line across the window: { m, c } (y = mx + c), { x } or { y }; label beside x = at
//   curves: [[fn, label, at, pos]] a curve y = fn(x); poly: [[x, y], ..] a shaded triangle or shape
//   steps: [[a, b, runLabel, riseLabel]] the run (along) then the rise (up or down) from a to b, dashed, labelled
//   notes: [[x, y, text, o]] text at a point of the plane (o.anchor, o.blue, o.size, o.dx, o.dy)
//   ky: mm per unit up (default k), gx and gy: grid steps, everyY: the y-axis numbering step, xl and yl: the axis names
const plane = (o) => {
  const [x0, x1] = o.x, [y0, y1] = o.y, k = o.k || 2.5, ky = o.ky || k, m = 1, gx = o.gx || 1, gy = o.gy || 1;
  const X = (x) => m + (x - x0) * k, Y = (y) => m + (y1 - y) * ky, at = ([x, y]) => [X(x), Y(y)];
  const W = (x1 - x0) * k + 2 * m, H = (y1 - y0) * ky + 2 * m;
  let b = '';
  if (o.grid) {
    for (let x = Math.ceil(x0 / gx) * gx; x <= x1 + 1e-9; x += gx) b += seg([X(x), Y(y0)], [X(x), Y(y1)], { stroke: GRID, w: 0.18 });
    for (let y = Math.ceil(y0 / gy) * gy; y <= y1 + 1e-9; y += gy) b += seg([X(x0), Y(y)], [X(x1), Y(y)], { stroke: GRID, w: 0.18 });
  }
  if (o.poly) b += `<polygon points="${o.poly.map((p) => at(p).map(f).join(',')).join(' ')}" fill="#e7e2f3" stroke="${INK}" stroke-width="0.4"/>`;
  // the axes, with arrows on the positive ends
  const ax = o.axes !== false && x0 <= 0 && x1 >= 0, ay = o.axes !== false && y0 <= 0 && y1 >= 0;
  if (ay) b += seg([X(x0), Y(0)], [X(x1) + 1.2, Y(0)], { w: 0.35 }) + arrow([X(x1) + 2.4, Y(0)], 'r') + T(X(x1) + 2.6, Y(0) + 1, o.xl || 'x', { size: 2.8, anchor: 'start', fill: INK });
  if (ax) b += seg([X(0), Y(y0)], [X(0), Y(y1) - 1.2], { w: 0.35 }) + arrow([X(0), Y(y1) - 2.4], 'u') + T(X(0) + 1.2, Y(y1) - 1.6, o.yl || 'y', { size: 2.8, anchor: 'start', fill: INK });
  if (o.nums) {
    const e = o.every || 1, sz = 2.3, g = { size: sz, fill: '#5a5866' };
    for (let x = Math.ceil(x0 / e) * e; x <= x1; x += e) if (x !== 0 && ay) b += seg([X(x), Y(0) - 0.5], [X(x), Y(0) + 0.5], { w: 0.25 }) + T(X(x), Y(0) + 2.8, n(x), g);
    const ey = o.everyY || e;
    for (let y = Math.ceil(y0 / ey) * ey; y <= y1; y += ey) if (y !== 0 && ax) b += seg([X(0) - 0.5, Y(y)], [X(0) + 0.5, Y(y)], { w: 0.25 }) + T(X(0) - 1, Y(y) + 0.8, n(y), { ...g, anchor: 'end' });
    if (ax && ay) b += T(X(0) - 1, Y(0) + 2.8, '0', { ...g, anchor: 'end' });
  }
  // a curve or line, sampled and clipped to the window
  const trace = (fn, xa = x0, xb = x1) => {
    const runs = []; let cur = [];
    for (let i = 0; i <= 240; i++) {
      const x = xa + ((xb - xa) * i) / 240, y = fn(x);
      if (y >= y0 - 1e-9 && y <= y1 + 1e-9) cur.push(at([x, y])); else if (cur.length) { runs.push(cur); cur = []; }
    }
    if (cur.length) runs.push(cur);
    return runs.filter((r) => r.length > 1).map((r) => `<polyline points="${r.map((p) => p.map(f).join(',')).join(' ')}" fill="none" stroke="${BLUE}" stroke-width="0.55"/>`).join('');
  };
  const labelAt = (p, s, pos = 'ne', blue = true) => { const [dx, dy, anchor] = POS[pos]; return T(p[0] + dx, p[1] + dy, s, { size: 2.8, anchor, fill: blue ? BLUE : INK, weight: 600 }); };
  (o.lines || []).forEach(([L, lab, atX, pos]) => {
    if (L.x !== undefined) { b += seg(at([L.x, y0]), at([L.x, y1]), { stroke: BLUE, w: 0.55 }); if (lab) b += labelAt(at([L.x, atX ?? y1 - 1]), lab, pos || 'e'); return; }
    if (L.y !== undefined) { b += seg(at([x0, L.y]), at([x1, L.y]), { stroke: BLUE, w: 0.55 }); if (lab) b += labelAt(at([atX ?? x1 - 1, L.y]), lab, pos || 'n'); return; }
    b += trace((x) => L.m * x + L.c);
    if (lab) b += labelAt(at([atX, L.m * atX + L.c]), lab, pos);
  });
  (o.curves || []).forEach(([fn, lab, atX, pos]) => { b += trace(fn); if (lab) b += labelAt(at([atX, fn(atX)]), lab, pos); });
  (o.steps || []).forEach(([a, c, run, rise]) => {
    const corner = at([c[0], a[1]]), g = { stroke: C.grey, w: 0.35, dash: true };
    b += seg(at(a), corner, g) + seg(corner, at(c), g);
    if (run) b += T((at(a)[0] + corner[0]) / 2, corner[1] + (c[1] > a[1] ? 3.2 : -1.2), run, { size: 2.8 });
    if (rise) b += T(corner[0] + (c[0] > a[0] ? 1.2 : -1.2), (corner[1] + at(c)[1]) / 2 + 1, rise, { size: 2.8, anchor: c[0] > a[0] ? 'start' : 'end' });
  });
  (o.segs || []).forEach(([a, c, s = {}]) => { b += seg(at(a), at(c), { stroke: s.blue === false ? INK : BLUE, w: s.w || 0.6, dash: s.dash }); });
  (o.pts || []).forEach(([x, y, lab, pos]) => { b += dot(at([x, y]), 0.65); if (lab) b += labelAt(at([x, y]), lab, pos, false); });
  (o.notes || []).forEach(([x, y, s, q = {}]) => { b += T(X(x) + (q.dx || 0), Y(y) + (q.dy || 0) + 1, s, { size: q.size || 3, anchor: q.anchor || 'middle', fill: q.blue ? BLUE : INK, weight: q.bold === false ? 400 : 700 }); });
  return svg(f(W + 3.5), f(H + 1), b + tall(W / 2, H));
};

// Two points joined by an interval, drawn to scale. axes: the window holds the origin too and the axes are drawn;
// without axes it is just the interval. ask: the unknown written by the interval ('d = ?', 'M = ?'); names: ['A', 'B']
// (or ['', ''] for none); size and maxH: the window's width and height in mm (the labels sit above and below).
const pair = (a, c, { ask = '', names = ['', ''], size = 20, pos, mid = false, grid = false, maxH, axes = true } = {}) => {
  const xs = [a[0], c[0], ...(axes ? [0] : [])], ys = [a[1], c[1], ...(axes ? [0] : [])], g = axes ? 1 : 0.4;
  const x = [Math.min(...xs) - g, Math.max(...xs) + g], y = [Math.min(...ys) - g, Math.max(...ys) + g];
  const k = Math.min(size / (x[1] - x[0]), (maxH || size) / (y[1] - y[0]));
  // the higher point's label above it, the lower point's below (side by side when the interval is level)
  const side = (p, q) => (pos ? pos[p === a ? 0 : 1] : p[1] === q[1] ? 'n' : p[1] > q[1] ? 'n' : 's');
  const lab = (p, s) => `${s}(${n(p[0])}, ${n(p[1])})`;
  const M = [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2];
  // the ? beside the middle of the interval, on the side away from the origin
  const dir = [-(c[1] - a[1]), c[0] - a[0]], away = (M[0] * dir[0] + M[1] * dir[1]) >= 0 ? 1 : -1;
  return plane({ x, y, k, grid, axes,
    segs: [[a, c]], pts: [[...a, lab(a, names[0]), side(a, c)], [...c, lab(c, names[1]), side(c, a)], ...(mid ? [[...M, '', 'n']] : [])],
    notes: ask ? [askNote(a, c, k, ask, away)] : [] });
};
// A note (for plane's notes) beside the middle of the interval a→c, side +1 on its left (going from a to c), -1 on its
// right, d mm from the line, anchored so the text grows away from it.
const askNote = (a, c, k, text, side = 1, d = 1.6) => {
  const v = [-(c[1] - a[1]) * side, (c[0] - a[0]) * side], L = Math.hypot(...v), o = [v[0] / L, v[1] / L];
  return [(a[0] + c[0]) / 2 + (o[0] * d) / k, (a[1] + c[1]) / 2 + (o[1] * d) / k, text,
    { anchor: o[0] > 0.35 ? 'start' : o[0] < -0.35 ? 'end' : 'middle', dy: o[1] < -0.35 ? 1.6 : o[1] > 0.35 ? -0.4 : 0 }];
};

// A table of values as a picture: rows of [heading, ...cells]; a cell of '' is left blank for students.
const table = (rows, { w = 6.5, head = 13, h = 5, title = '' } = {}) => {
  const cols = rows[0].length - 1, t0 = title ? h : 0;
  let b = title ? T((head + cols * w) / 2, h / 2 + 1.2, title, { size: 2.9, weight: 700, fill: BLUE }) : '';
  rows.forEach((r, i) => {
    const y = t0 + i * h;
    b += `<rect x="0" y="${f(y)}" width="${f(head)}" height="${h}" fill="#ece8f5" stroke="${INK}" stroke-width="0.3"/>` + T(head / 2, y + h / 2 + 1, r[0], { size: 2.7, weight: 600 });
    for (let j = 0; j < cols; j++) b += `<rect x="${f(head + j * w)}" y="${f(y)}" width="${f(w)}" height="${h}" fill="#fff" stroke="${INK}" stroke-width="0.3"/>` + T(head + j * w + w / 2, y + h / 2 + 1, r[j + 1] === '' ? '' : String(r[j + 1]), { size: 2.7 });
  });
  return svg(f(head + cols * w), f(t0 + rows.length * h), b + tall((head + cols * w) / 2, t0 + rows.length * h));
};
// A numbered grid (axes numbered every 2 by default) with lines, curves and points on it
const graph = (o) => plane({ grid: true, nums: true, every: 2, ...o });

// A note in a free top corner of the window [x, y] (top left when a→c rises, top right when it falls)
const cornerNote = (a, c, [x0, x1], [, y1], text) => ((c[1] - a[1]) * (c[0] - a[0]) >= 0 ? [x0 + 0.15, y1 - 0.5, text, { anchor: 'start' }] : [x1 - 0.15, y1 - 0.5, text, { anchor: 'end' }]);

// The line y = mx + c on axes (no grid) through the window that holds pts and the origin, with each point marked and
// labelled with its coordinates on the side of the line that is free
const linePts = (m, c, pts, { size = 24, maxH = 10, ask = '', axes = true } = {}) => {
  const xs = [...(axes ? [0] : []), ...pts.map((p) => p[0])], ys = [...(axes ? [0] : []), ...pts.map((p) => p[1])], g = axes ? 1 : 0.6;
  const x = [Math.min(...xs) - g, Math.max(...xs) + g], y = [Math.min(...ys) - g, Math.max(...ys) + g];
  const k = Math.min(size / (x[1] - x[0]), maxH / (y[1] - y[0])), pos = m >= 0 ? 'nw' : 'ne';
  return plane({ x, y, k, axes, lines: [[{ m, c }]], pts: pts.map((p) => [...p, `(${n(p[0])}, ${n(p[1])})`, p[0] === 0 ? (m >= 0 ? 'nw' : 'sw') : pos === 'nw' ? 'se' : 'ne']),
    notes: ask ? [cornerNote([x[0], m * x[0] + c], [x[1], m * x[1] + c], x, y, ask)] : [] });
};

module.exports = { plane, graph, pair, askNote, cornerNote, linePts, table, n, parts: { C, f, T, svg, seg, dot, GRID, BLUE, INK } };
