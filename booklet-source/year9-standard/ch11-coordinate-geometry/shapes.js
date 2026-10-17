// Diagrams for Chapter 11 Coordinate geometry and graphs (SVG, units in mm), in a classic textbook style: a light grey
// 1-unit grid, thin black axes with every whole number labelled, small black dots, thin dark lines, and labels with a
// white halo so grid lines never cut through them. Every picture is drawn to scale from the question's own numbers,
// with the Chapter 10 drawing parts (labels grow the picture's frame; see ../ch10…/shapes.js).
const { C, f, T: T0, svg, seg, dot } = require('../ch10-surface-area-volume/shapes').parts;

const INK = '#1b1b1f', GRID = '#cdd2dc', LINE = '#26346f', NUM = '#3a3a44', BLUE = C.blue;
const halo = (s) => s.replace('<text ', '<text paint-order="stroke" stroke="#ffffff" stroke-width="0.9" stroke-linejoin="round" ');
const T = (x, y, s, o = {}) => halo(T0(x, y, s, o));
// A short picture (a flat interval, a two-row table) gets invisible space above and below, so it is at least 12 mm tall
// (the builder's layout check treats a shorter graph as squashed).
const tall = (x, H) => (H < 14 ? T0(x, H / 2 - 5.6, ' ', { size: 2.8 }) + T0(x, H / 2 + 6.2, ' ', { size: 2.8 }) : '');
const n = (v) => (v < 0 ? `−${+(-v).toFixed(6)}` : `${+(+v).toFixed(6)}`);
const arrow = ([x, y], dir) => (dir === 'r' ? `<path d="M${f(x)},${f(y)} l-1.3,-0.55 v1.1 z" fill="${INK}"/>` : `<path d="M${f(x)},${f(y)} l-0.55,1.3 h1.1 z" fill="${INK}"/>`);
// Label positions round a dot: [dx, dy, anchor]
const POS = { ne: [0.9, -0.9, 'start'], nw: [-0.9, -0.9, 'end'], se: [0.9, 2.7, 'start'], sw: [-0.9, 2.7, 'end'], n: [0, -1.2, 'middle'], s: [0, 3.2, 'middle'], e: [1.2, 0.9, 'start'], w: [-1.2, 0.9, 'end'] };
// The label position pointing away from q (so a point's label sits on the far side from the rest of the interval)
const away = (p, q) => {
  const dx = p[0] - q[0], dy = p[1] - q[1];
  if (Math.abs(dx) < 1e-9) return dy >= 0 ? 'n' : 's';
  if (Math.abs(dy) < 1e-9) return dx >= 0 ? 'e' : 'w';
  return `${dy > 0 ? 'n' : 's'}${dx > 0 ? 'e' : 'w'}`;
};

// plane(o): a number plane from x0 to x1 and y0 to y1 (o.x, o.y), k mm per unit across (ky up, default k).
//   grid: grid lines (gx, gy apart); nums: number the axes every `every` (and everyY) units; xl, yl: the axis names
//   pts: [[x, y, label, pos]] dots with labels; segs: [[a, b, o]] intervals (o.dash, o.grey)
//   lines: [[line, label, at, pos]] a line across the window: { m, c } (y = mx + c), { x } or { y }
//   curves: [[fn, label, at, pos]] a curve y = fn(x); poly: [[x, y], ..] a shaded shape
//   steps: [[a, b, runLabel, riseLabel]] the run then the rise from a to b, dashed, labelled
//   notes: [[x, y, text, o]] text at a point of the plane (o.anchor, o.size, o.dx, o.dy, o.blue)
//   tags: [[[x, y], ..], text] a line's label (no dot): beside whichever of the given points on the line leaves it clearest
const plane = (o) => {
  const [x0, x1] = o.x, [y0, y1] = o.y, k = o.k || 2.5, ky = o.ky || k, m = 1, gx = o.gx || 1, gy = o.gy || 1;
  const X = (x) => m + (x - x0) * k, Y = (y) => m + (y1 - y) * ky, at = ([x, y]) => [X(x), Y(y)];
  const W = (x1 - x0) * k + 2 * m, H = (y1 - y0) * ky + 2 * m;
  let b = '';
  const samples = [], boxes = []; // drawn lines (points along them) and number boxes, in mm: point labels avoid both
  const sampleSeg = (p, q) => { const L = Math.hypot(q[0] - p[0], q[1] - p[1]), N = Math.max(2, Math.ceil(L / 0.5)); for (let i = 0; i <= N; i++) samples.push([p[0] + ((q[0] - p[0]) * i) / N, p[1] + ((q[1] - p[1]) * i) / N]); };
  if (o.grid) {
    for (let x = Math.ceil(x0 / gx) * gx; x <= x1 + 1e-9; x += gx) b += seg([X(x), Y(y0)], [X(x), Y(y1)], { stroke: GRID, w: 0.14 });
    for (let y = Math.ceil(y0 / gy) * gy; y <= y1 + 1e-9; y += gy) b += seg([X(x0), Y(y)], [X(x1), Y(y)], { stroke: GRID, w: 0.14 });
  }
  if (o.poly) b += `<polygon points="${o.poly.map((p) => at(p).map(f).join(',')).join(' ')}" fill="#eceef4" stroke="${INK}" stroke-width="0.3"/>`;
  const ax = o.axes !== false && x0 <= 0 && x1 >= 0, ay = o.axes !== false && y0 <= 0 && y1 >= 0;
  if (ay) sampleSeg([X(x0), Y(0)], [X(x1), Y(0)]);
  if (ax) sampleSeg([X(0), Y(y0)], [X(0), Y(y1)]);
  if (ay) b += seg([X(x0), Y(0)], [X(x1) + 1.2, Y(0)], { stroke: INK, w: 0.28 }) + arrow([X(x1) + 2.3, Y(0)], 'r') + T(X(x1) + 2.6, Y(0) + 0.9, o.xl || '<tspan font-style="italic">x</tspan>', { size: 2.7, anchor: 'start', fill: INK });
  if (ax) b += seg([X(0), Y(y0)], [X(0), Y(y1) - 1.2], { stroke: INK, w: 0.28 }) + arrow([X(0), Y(y1) - 2.3], 'u') + T(X(0) + 1.1, Y(y1) - 1.8, o.yl || '<tspan font-style="italic">y</tspan>', { size: 2.7, anchor: 'start', fill: INK });
  // the axis numbers are drawn last (below), on top of any line, so a line never hides one; no 0 at the origin (it
  // would run into the −1 beside it)
  let nums = '';
  if (o.nums) {
    const e = o.every || 1, ey = o.everyY || e, g = { size: o.numSize || 2.2, fill: NUM };
    for (let x = Math.ceil(x0 / e) * e; x <= x1 + 1e-9; x += e) if (Math.abs(x) > 1e-9 && ay) { b += seg([X(x), Y(0) - 0.45], [X(x), Y(0) + 0.45], { stroke: INK, w: 0.22 }); nums += T(X(x), Y(0) + 2.55, n(x), g); const w = n(x).length * g.size * 0.58; boxes.push([X(x) - w / 2, Y(0) + 0.8, X(x) + w / 2, Y(0) + 2.8]); }
    for (let y = Math.ceil(y0 / ey) * ey; y <= y1 + 1e-9; y += ey) if (Math.abs(y) > 1e-9 && ax) { b += seg([X(0) - 0.45, Y(y)], [X(0) + 0.45, Y(y)], { stroke: INK, w: 0.22 }); nums += T(X(0) - 0.9, Y(y) + 0.75, n(y), { ...g, anchor: 'end' }); const w = n(y).length * g.size * 0.58; boxes.push([X(0) - 0.9 - w, Y(y) - 1, X(0) - 0.7, Y(y) + 1]); }
  }
  // a curve or line, sampled and clipped to the window
  const trace = (fn) => {
    const runs = []; let cur = [];
    for (let i = 0; i <= 300; i++) {
      const x = x0 + ((x1 - x0) * i) / 300, y = fn(x);
      if (y >= y0 - 1e-9 && y <= y1 + 1e-9) { cur.push(at([x, y])); samples.push(at([x, y])); } else if (cur.length) { runs.push(cur); cur = []; }
    }
    if (cur.length) runs.push(cur);
    return runs.filter((r) => r.length > 1).map((r) => `<polyline points="${r.map((p) => p.map(f).join(',')).join(' ')}" fill="none" stroke="${LINE}" stroke-width="0.42"/>`).join('');
  };
  const labelAt = (p, s, pos = 'ne') => { const [dx, dy, anchor] = POS[pos]; return T(p[0] + dx, p[1] + dy, s, { size: 2.6, anchor, fill: LINE, weight: 600 }); };
  (o.lines || []).forEach(([L, lab, atX, pos]) => {
    if (L.x !== undefined) { sampleSeg(at([L.x, y0]), at([L.x, y1])); b += seg(at([L.x, y0]), at([L.x, y1]), { stroke: LINE, w: 0.42 }); if (lab) b += labelAt(at([L.x, atX ?? y1 - 1]), lab, pos || 'e'); return; }
    if (L.y !== undefined) { sampleSeg(at([x0, L.y]), at([x1, L.y])); b += seg(at([x0, L.y]), at([x1, L.y]), { stroke: LINE, w: 0.42, dash: L.dash }); if (lab) b += labelAt(at([atX ?? x1 - 1, L.y]), lab, pos || 'n'); return; }
    b += trace((x) => L.m * x + L.c);
    if (lab) b += labelAt(at([atX, L.m * atX + L.c]), lab, pos);
  });
  (o.curves || []).forEach(([fn, lab, atX, pos]) => { b += trace(fn); if (lab) b += labelAt(at([atX, fn(atX)]), lab, pos); });
  (o.steps || []).forEach(([a, c, run, rise]) => {
    const corner = at([c[0], a[1]]), g = { stroke: '#6b6b78', w: 0.3, dash: true };
    b += seg(at(a), corner, g) + seg(corner, at(c), g);
    if (run) b += T((at(a)[0] + corner[0]) / 2, corner[1] + (c[1] > a[1] ? 3 : -1.1), run, { size: 2.6, fill: INK });
    if (rise) b += T(corner[0] + (c[0] > a[0] ? 1.1 : -1.1), (corner[1] + at(c)[1]) / 2 + 0.9, rise, { size: 2.6, anchor: c[0] > a[0] ? 'start' : 'end', fill: INK });
  });
  (o.segs || []).forEach(([a, c, s = {}]) => { sampleSeg(at(a), at(c)); b += seg(at(a), at(c), { stroke: s.grey ? '#6b6b78' : LINE, w: s.w || 0.45, dash: s.dash }); });
  b += nums;
  // each point's label: its preferred position first, then the others, taking the first whose box touches no line,
  // axis, number or earlier label (else the one that touches least)
  const placed = [];
  const boxAt = (p, w, key) => { const [dx, dy, an] = POS[key], x = p[0] + dx, x0b = an === 'start' ? x : an === 'end' ? x - w : x - w / 2; return [x0b - 0.25, p[1] + dy - 2.1, x0b + w + 0.25, p[1] + dy + 0.45]; };
  const hits = (B) => samples.filter(([sx, sy]) => sx > B[0] && sx < B[2] && sy > B[1] && sy < B[3]).length
    + [...boxes, ...placed].filter((q) => q[0] < B[2] && B[0] < q[2] && q[1] < B[3] && B[1] < q[3]).length * 3
    + (B[0] < -2.5 || B[2] > W + 3.5 || B[1] < -1.5 || B[3] > H + 1.5 ? 4 : 0); // keep inside the plane, so the picture does not grow
  [...(o.pts || []).map(([x, y, lab, pos]) => [[[x, y]], lab, pos, false]), ...(o.tags || []).map(([cands, lab]) => [cands, lab, 'ne', true])].forEach(([cands, lab, pos, tag]) => {
    if (!tag) b += dot(at(cands[0]), 0.55);
    if (!lab) return;
    const w = String(lab).replace(/<[^>]+>/g, '').length * 2.6 * 0.58, order = [pos || 'ne', 'ne', 'nw', 'se', 'sw', 'e', 'w', 'n', 's'];
    let best = null, bestHits = Infinity;
    for (const c of cands) { const p = at(c); for (const key of order) { const h = hits(boxAt(p, w, key)); if (h < bestHits) { best = [p, key]; bestHits = h; } if (h === 0) break; } if (bestHits === 0) break; }
    const [p, key] = best;
    placed.push(boxAt(p, w, key));
    b += T(p[0] + POS[key][0], p[1] + POS[key][1], lab, { size: 2.6, anchor: POS[key][2], fill: tag ? LINE : INK, weight: tag ? 700 : 600 });
  });
  (o.notes || []).forEach(([x, y, s, q = {}]) => { b += T(X(x) + (q.dx || 0), Y(y) + (q.dy || 0) + 1, s, { size: q.size || 2.8, anchor: q.anchor || 'middle', fill: q.blue ? LINE : INK, weight: q.bold === false ? 400 : 700 }); });
  return svg(f(W + 3.5), f(H + 1), b + tall(W / 2, H));
};
// A numbered grid (every whole number labelled) with lines, curves and points on it
const graph = (o) => plane({ grid: true, nums: true, every: 1, ...o });

// Standard number planes, the same in every question of a kind: 'big' (−6 to 6, about 46 mm: drill and page 1),
// 'mid' (−5 to 5, about 31 mm: WE DO examples) and 'small' (−5 to 5, about 30 mm: the Medium set)
const SIZE = { big: { R: 6, k: 3.4 }, mid: { R: 5, k: 2.55 }, small: { R: 5, k: 2.45 } };
const std = (size, o = {}) => { const { R, k } = SIZE[size]; return graph({ x: [-R, R], y: [-R, R], k, numSize: size === 'big' ? 2.3 : 2.1, ...o }); };
// A free corner of the plane for the ? (a corner with no point or line near it), as a note for plane()
const freeCorner = (size, pts, text, fns = []) => {
  const { R } = SIZE[size], w = 3.6, h = 1.6;
  const corners = [[-R + 0.2, R - 0.6, 'start', [-R, -R + w, R - h, R]], [R - 0.2, R - 0.6, 'end', [R - w, R, R - h, R]], [-R + 0.2, -R + 0.5, 'start', [-R, -R + w, -R, -R + h]], [R - 0.2, -R + 0.5, 'end', [R - w, R, -R, -R + h]]];
  const clear = ([, , , [xa, xb, ya, yb]]) => pts.every(([x, y]) => x < xa - 0.6 || x > xb + 0.6 || y < ya - 0.8 || y > yb + 0.8)
    && fns.every((fn) => { for (let x = xa; x <= xb; x += 0.25) { const y = fn(x); if (y >= ya - 0.3 && y <= yb + 0.3) return false; } return true; });
  const c = corners.find(clear) || corners[0];
  return [c[0], c[1], text, { anchor: c[2] }];
};
// Points with labels: coords true writes A(2, 3), false writes A only (students read the coordinates off the grid)
const ptLab = (name, p, coords) => (coords ? `${name}(${n(p[0])}, ${n(p[1])})` : name);

// An interval AB on a standard plane: both points labelled on their far sides, the unknown (ask) in a free corner.
// extra: more points [[x, y, name]] (e.g. a midpoint), drawn and labelled the same way
const interval = (a, b, { size = 'big', coords = true, ask = '', names = ['A', 'B'], extra = [], k } = {}) => {
  const segs = [[a, b]], fns = a[0] === b[0] ? [] : [(x) => (x < Math.min(a[0], b[0]) || x > Math.max(a[0], b[0]) ? 1e9 : a[1] + ((b[1] - a[1]) * (x - a[0])) / (b[0] - a[0]))];
  // a long label (with coordinates) near the left or right edge goes straight above or below its point, so the
  // picture does not grow sideways
  const { R } = SIZE[size], pos = (p, q) => { const d = away(p, q); return coords && Math.abs(p[0]) >= R - 2.5 ? (d.length === 2 ? d[0] : d === 'e' || d === 'w' ? 'n' : d) : d; };
  const pts = [[...a, ptLab(names[0], a, coords), pos(a, b)], [...b, ptLab(names[1], b, coords), pos(b, a)],
    ...extra.map(([x, y, nm]) => [x, y, nm, a[0] === b[0] ? 'e' : (b[1] - a[1]) * (b[0] - a[0]) > 0 ? 'se' : 'ne'])];
  return std(size, { segs, pts, notes: ask ? [freeCorner(size, [a, b, ...extra], ask, fns)] : [], ...(k ? { k } : {}) });
};

// A table of values as a picture: rows of [heading, ...cells]; a cell of '' is left blank for students
const table = (rows, { w = 6.5, head = 13, h = 5, title = '' } = {}) => {
  const cols = rows[0].length - 1, t0 = title ? h : 0;
  let b = title ? T((head + cols * w) / 2, h / 2 + 1.2, title, { size: 2.8, weight: 700, fill: LINE }) : '';
  rows.forEach((r, i) => {
    const y = t0 + i * h;
    b += `<rect x="0" y="${f(y)}" width="${f(head)}" height="${h}" fill="#eceef4" stroke="${INK}" stroke-width="0.25"/>` + T(head / 2, y + h / 2 + 1, r[0], { size: 2.6, weight: 600, fill: INK });
    for (let j = 0; j < cols; j++) b += `<rect x="${f(head + j * w)}" y="${f(y)}" width="${f(w)}" height="${h}" fill="#fff" stroke="${INK}" stroke-width="0.25"/>` + T(head + j * w + w / 2, y + h / 2 + 1, r[j + 1] === '' ? '' : String(r[j + 1]), { size: 2.6, fill: INK });
  });
  return svg(f(head + cols * w), f(t0 + rows.length * h), b + tall((head + cols * w) / 2, t0 + rows.length * h));
};
// Two pictures side by side (a table and a plane) as one picture
const side = (a, gap = 3) => {
  const box = (s) => { const v = s.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number); return { v, inner: s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '') }; };
  const A = box(a[0]), B = box(a[1]), H = Math.max(A.v[3], B.v[3]), W = A.v[2] + gap + B.v[2];
  const g = (P, dx) => `<g transform="translate(${f(dx - P.v[0])},${f((H - P.v[3]) / 2 - P.v[1])})">${P.inner}</g>`;
  return `<svg class="graph" viewBox="0 0 ${f(W)} ${f(H)}" xmlns="http://www.w3.org/2000/svg" style="aspect-ratio:${f(W)}/${f(H)}; --w:${f(W)}mm; --ar:${f(W)}/${f(H)}">${g(A, 0)}${g(B, A.v[2] + gap)}</svg>`;
};

// A line y = mx + c on a standard plane through two marked points A and B (with coordinates, or letters only), the
// labels on the open side of the line, the unknown (ask) in a free corner
const lineAB = (m, c, p, q, { size = 'big', coords = true, ask = 'y = ?', names = ['A', 'B'] } = {}) => {
  const { R } = SIZE[size], fn = (x) => m * x + c;
  const pos = (pt) => (m >= 0 ? (pt[0] < -R / 3 ? 'se' : 'nw') : (pt[0] > R / 3 ? 'sw' : 'ne'));
  return std(size, { lines: [[{ m, c }]], pts: [[...p, ptLab(names[0], p, coords), pos(p)], [...q, ptLab(names[1], q, coords), pos(q)]],
    notes: ask ? [freeCorner(size, [p, q], ask, [fn])] : [] });
};
// A table of values (x = xs, the second row blank, the rule as its title) beside a blank standard plane
const tableGraph = (rule, xs, { size = 'big', name = 'y' } = {}) => side([table([['x', ...xs.map(n)], [name, ...xs.map(() => '')]], { w: 4.4, head: 4.6, title: rule }), std(size)], 2);
// A real-life graph: y = fn(x) for x from 0 to x1, scaled to about w mm square. readX: a dashed line up from x = readX to
// the graph and a ? at the point; readY: a dashed line across from y = readY to the graph and a ? there.
// rule: the model's rule, written in the free top corner (top left when the graph rises, top right when it falls)
const model = (fn, { x1, y1, gx = 1, gy, every = 1, everyY, xl = 'x', yl = 'y', readX, readY, w = 42, rule = '' }) => {
  const k = w / x1, ky = w / y1, segs = [], pts = [], g = { dash: true, grey: true, w: 0.32 };
  if (readX !== undefined) { const y = fn(readX); segs.push([[readX, 0], [readX, y], g]); pts.push([readX, y, '?', 'ne']); }
  if (readY !== undefined) {
    let lo = 0, hi = x1; const up = fn(hi) > fn(lo);
    for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if ((fn(mid) < readY) === up) lo = mid; else hi = mid; }
    segs.push([[0, readY], [lo, readY], g]); pts.push([lo, readY, '?', 'ne']);
  }
  const up = fn(x1) > fn(0), notes = rule ? [[up ? x1 * 0.03 : x1 * 0.97, y1 - 2.6 / ky, rule, { anchor: up ? 'start' : 'end', size: 2.7 }]] : [];
  return plane({ x: [0, x1], y: [0, y1], k, ky, grid: true, nums: true, gx, gy, every, everyY, xl, yl, curves: [[fn]], segs, pts, notes });
};

// Points on y = mx + c inside the window [−R, R] for the line's label (tags), from the right edge inward (side 1) or
// from the left edge inward (side −1)
const lineTagAt = (m, c, R, side = 1) => { const out = []; for (let x = side * (R - 1); Math.abs(x) <= R; x -= side * 0.5) { const y = m * x + c; if (Math.abs(y) <= R - 1.2) out.push([x, y]); } return out.length ? out : [[0, c]]; };

module.exports = { plane, graph, std, interval, lineAB, tableGraph, model, freeCorner, lineTagAt, ptLab, table, side, away, n, SIZE, parts: { C, f, T, svg, seg, dot, GRID, BLUE, INK, LINE } };
