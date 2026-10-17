// Diagrams for Chapter 13 Similar figures (SVG, units in mm), in the classic textbook style of Chapter 12: thin dark
// outlines, light fills, labels with a white halo, nothing overlapping. Built from the Chapter 10 drawing parts (labels
// grow the picture's frame; see ../ch10…/shapes.js) and Chapter 12's halo. Every picture is drawn from the question's
// own numbers: similar figures to scale, shapes on a grid square by square, plans in proportion. Shadows are not to
// scale (a stick a tenth of a pole's height would be too small to label), but both triangles have the same slope.
const { f, svg, seg, poly, rightMark, rad } = require('../ch10-surface-area-volume/shapes').parts;
const { side, parts: { T, path, circ, tall, GRID, INK } } = require('../ch12-probability/shapes');

const FILL = '#eef1f9', FILL2 = '#ede7f6', SHADOW = '#8d93a3';
const dir = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1; return [dx / L, dy / L]; };
const area = (P) => P.reduce((s, p, i) => { const q = P[(i + 1) % P.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0) / 2;
const plain = (s) => String(s).replace(/<[^>]+>/g, '');
// A pronumeral in italics: 'x', 'x cm', 'h', and vertex letters
const it = (s) => String(s).replace(/^([a-zA-Z])(?= |$)/, '<tspan font-style="italic">$1</tspan>');

// Where a figure's labels go: [x, y (middle), text, width] for each side label (outside the figure, clear of its tick
// marks) and each vertex letter (outside the angle). o: as shape()
const labels = (P, o) => {
  const N = P.length, sg = Math.sign(area(P)) || 1, z = o.size || 2.6, ticked = new Set((o.ticks || []).map((x) => x[0])), out = [];
  (o.sides || []).forEach(([i, s]) => {
    if (s === '' || s === undefined) return;
    const a = P[i], e = P[(i + 1) % N], [ux, uy] = dir(a, e), nx = sg * uy, ny = -sg * ux, w = plain(s).length * z * 0.58;
    const d = 1.1 + (w / 2) * Math.abs(nx) + z * 0.42 * Math.abs(ny) + (ticked.has(i) ? 0.5 : 0);
    out.push([(a[0] + e[0]) / 2 + nx * d, (a[1] + e[1]) / 2 + ny * d, s, w]);
  });
  (typeof o.L === 'string' ? [...o.L] : o.L || []).forEach((s, i) => {
    if (!s) return;
    const v = P[i], p = P[(i + N - 1) % N], q = P[(i + 1) % N], u1 = dir(v, p), u2 = dir(v, q);
    // away from both sides: outside a corner, inside an inner (reflex) corner such as a plan's, clear of its walls' labels
    let e = [-(u1[0] + u2[0]), -(u1[1] + u2[1])];
    const len = Math.hypot(...e);
    e = len < 0.15 ? [sg * u2[1], -sg * u2[0]] : [e[0] / len, e[1] / len];
    out.push([v[0] + e[0] * 1.9, v[1] + e[1] * 1.9, s, z * 0.7]);
  });
  return out;
};
// How far a figure reaches left and right, labels included
const span = (P, o) => { const xs = [...P.map((p) => p[0]), ...labels(P, o).flatMap(([x, , , w]) => [x - w / 2, x + w / 2])]; return [Math.min(...xs), Math.max(...xs)]; };

// One figure: the polygon P (mm, y down). o.L: its vertex letters (a string, or a list with '' for an unlettered
// vertex); o.sides: [[i, text]] beside side i (from vertex i to i + 1), outside the figure; o.ticks: [[i, count]]
// tick marks across side i; o.arcs: [[i, count]] arcs in the angle at vertex i; o.right: [i] right-angle marks;
// o.fill, o.lw (outline width), o.size (label size)
const shape = (P, o = {}) => {
  const N = P.length, z = o.size || 2.6, nb = (i) => [P[(i + N - 1) % N], P[(i + 1) % N]];
  let b = poly(P, o.fill || FILL, { w: o.lw || 0.4 });
  (o.right || []).forEach((i) => { b += rightMark(P[i], ...nb(i), 1.3); });
  (o.ticks || []).forEach(([i, c]) => {
    const a = P[i], e = P[(i + 1) % N], [ux, uy] = dir(a, e), m = [(a[0] + e[0]) / 2, (a[1] + e[1]) / 2];
    for (let j = 0; j < c; j++) {
      const d = (j - (c - 1) / 2) * 0.75, p = [m[0] + ux * d, m[1] + uy * d];
      b += seg([p[0] + uy * 0.9, p[1] - ux * 0.9], [p[0] - uy * 0.9, p[1] + ux * 0.9], { w: 0.3 });
    }
  });
  (o.arcs || []).forEach(([i, c]) => {
    const v = P[i], [p, q] = nb(i), u1 = dir(v, p), u2 = dir(v, q), cw = u1[0] * u2[1] - u1[1] * u2[0] > 0 ? 1 : 0;
    for (let j = 0; j < c; j++) {
      const r = (o.arcR || 2) + j * 0.6;
      b += `<path d="M${f(v[0] + u1[0] * r)},${f(v[1] + u1[1] * r)} A${f(r)},${f(r)} 0 0 ${cw} ${f(v[0] + u2[0] * r)},${f(v[1] + u2[1] * r)}" fill="none" stroke="${INK}" stroke-width="0.3"/>`;
    }
  });
  labels(P, o).forEach(([x, y, t]) => { b += T(x, y + z * 0.36, it(t), { size: z }); });
  return b;
};

// A triangle from its sides AB, BC and CA: the vertices A, B, C (A at the origin, AB along the x-axis)
const tri = (ab, bc, ca) => { const x = (ca * ca + ab * ab - bc * bc) / (2 * ab); return [[0, 0], [ab, 0], [x, Math.sqrt(ca * ca - x * x)]]; };

// Two similar figures side by side: the original A (vertices in the question's units, y up) and its image, k times
// as big, turned o.turn degrees anticlockwise and flipped (o.flip) on request. Drawn to scale in a box o.w by o.h mm
// (the shapes only; labels add a little round them). o.L: [original's letters, image's letters], the image's letter i
// at the vertex matching the original's vertex i. o.sides: [[i, original's label, image's label]] beside side i ('' for
// none). o.ticks, o.arcs, o.right: as shape(), on both figures.
const pair = (A, k, o = {}) => {
  const t = rad(o.turn || 0), c = Math.cos(t), s = Math.sin(t);
  const B = A.map(([x, y]) => [k * (x * c - y * s) * (o.flip ? -1 : 1), k * (x * s + y * c)]);
  const box = (P) => [Math.min(...P.map((p) => p[0])), Math.min(...P.map((p) => p[1])), Math.max(...P.map((p) => p[0])), Math.max(...P.map((p) => p[1]))];
  const a = box(A), b = box(B), Hu = Math.max(a[3] - a[1], b[3] - b[1]), wu = a[2] - a[0] + b[2] - b[0];
  const [L0, L1] = o.L || ['', ''], sides = (j) => (o.sides || []).map((x) => [x[0], x[1 + j]]), o0 = { ...o, L: L0, sides: sides(0) }, o1 = { ...o, L: L1, sides: sides(1), fill: FILL2 };
  // the gap grows until the labels on the facing sides are 4 mm apart (a few rounds: the scale shrinks as it grows)
  let gap = o.gap ?? 8, u, H, at;
  for (let r = 0; r < 4; r++) {
    u = Math.min(((o.w || 46) - gap) / wu, (o.h || 24) / Hu); H = Hu * u;
    at = (P, q, x0) => P.map(([x, y]) => [x0 + (x - q[0]) * u, H / 2 - (y - (q[1] + q[3]) / 2) * u]);
    gap = Math.max(o.gap ?? 8, span(at(A, a, 0), o0)[1] - (a[2] - a[0]) * u + 4 - span(at(B, b, 0), o1)[0]);
  }
  const x1 = (a[2] - a[0]) * u + gap, P0 = at(A, a, 0), P1 = at(B, b, x1), W = x1 + (b[2] - b[0]) * u;
  const body = shape(P0, o0) + shape(P1, o1);
  return svg(f(W), f(H), body + tall(W / 2, H));
};

// A squared grid cols by rows, g mm a square, with shapes on it: o.shapes [{ pts (in squares from the bottom left),
// L, fill, … as shape() }]. o.cap: a caption above the grid ('Scale factor 2').
const onGrid = (o) => {
  const g = o.g || 4.5, W = o.cols * g, H = o.rows * g, at = ([x, y]) => [x * g, H - y * g];
  let b = '';
  for (let i = 0; i <= o.cols; i++) b += seg([i * g, 0], [i * g, H], { stroke: GRID, w: 0.18 });
  for (let j = 0; j <= o.rows; j++) b += seg([0, j * g], [W, j * g], { stroke: GRID, w: 0.18 });
  (o.shapes || []).forEach((s) => { b += shape(s.pts.map(at), { size: 2.4, ...s }); });
  if (o.cap) b += T(0, -1.3, o.cap, { size: 2.6, anchor: 'start', weight: 600 });
  return svg(f(W), f(H), b + tall(W / 2, H));
};
// An enlargement to draw: the shape (in squares) in the grid's bottom-left corner, one square in; the grid wide and
// tall enough for its image, k times as big, beside it (or for the original when k < 1). o.g: the square size.
const toDraw = (pts, k, o = {}) => {
  const w = Math.max(...pts.map((p) => p[0])), h = Math.max(...pts.map((p) => p[1]));
  return onGrid({ g: o.g, cols: Math.ceil(w + w * k + 3), rows: Math.ceil(Math.max(h, h * k) + 2), cap: o.cap, shapes: [{ pts: pts.map(([x, y]) => [x + 1, y + 1]), ...o }] });
};

// Shadows at the same time of day: the large object (o.big: 'pole', 'tree' or 'person') and the small one (o.small:
// 'stick' or 'person'), each upright on the ground with its shadow and a dashed sun ray from its top to the shadow's
// end. o.h: [large height, small height], o.s: [large shadow, small shadow] (labels; '' for none); o.H: the large
// object's height in mm; o.slope: shadow ÷ height.
const thing = (kind, x, yg, H) => {
  const top = yg - H;
  if (kind === 'tree') return seg([x, yg], [x, top + H * 0.4], { w: 0.9 }) + circ([x, top + H * 0.24], H * 0.24, '#e4eedf', { w: 0.35 });
  if (kind === 'person') {
    const r = H * 0.09, neck = top + 2 * r, hip = top + H * 0.58;
    return circ([x, top + r], r, '#ffffff', { w: 0.35 }) + seg([x, neck], [x, hip], { w: 0.5 }) + seg([x, hip], [x - H * 0.12, yg], { w: 0.5 }) + seg([x, hip], [x + H * 0.12, yg], { w: 0.5 })
      + seg([x - H * 0.15, neck + H * 0.24], [x, neck + H * 0.06], { w: 0.45 }) + seg([x + H * 0.15, neck + H * 0.24], [x, neck + H * 0.06], { w: 0.45 });
  }
  const flag = kind === 'pole' ? path(`M${f(x)},${f(top + 0.3)} L${f(x - 3.6)},${f(top + 1.6)} L${f(x)},${f(top + 2.9)} Z`, '#c9bfe0', { w: 0.3 }) : '';
  return seg([x, yg], [x, top], { w: kind === 'pole' ? 0.6 : 0.7 }) + flag;
};
// How far left of the object's centre line its height label goes (past a tree's crown or a person's arms)
const reach = (kind, H) => (kind === 'tree' ? H * 0.24 : kind === 'person' ? H * 0.15 : 0) + 1.3;
const shadow = (o) => {
  const H = o.H || 22, sl = o.slope || 1.4, h = o.ratio || 0.45, [hb, hs] = o.h, [sb, ss] = o.s;
  const z = 2.6, yg = H + 1, big = { kind: o.big || 'pole', H }, small = { kind: o.small || 'stick', H: H * h };
  const lw = (s) => plain(s).length * z * 0.58;
  big.x = reach(big.kind, H) + lw(hb) + 0.6; big.S = H * sl;
  small.x = big.x + big.S + 3 + reach(small.kind, small.H) + lw(hs); small.S = small.H * sl;
  const W = small.x + Math.max(small.S, lw(ss) / 2 + small.S / 2) + 1;
  let b = seg([0, yg], [W, yg], { w: 0.35 });
  [[big, hb, sb], [small, hs, ss]].forEach(([g, hl, sl2]) => {
    b += seg([g.x, yg], [g.x + g.S, yg], { stroke: SHADOW, w: 1.1 }) + seg([g.x, yg - g.H], [g.x + g.S, yg], { w: 0.3, dash: true });
    b += thing(g.kind, g.x, yg, g.H) + rightMark([g.x, yg], [g.x, yg - 5], [g.x + 5, yg], 1.3);
    if (g.kind !== 'pole' && g.kind !== 'stick') { const dx = g.x - reach(g.kind, g.H) + 0.4; b += seg([dx, yg], [dx, yg - g.H], { w: 0.22 }) + seg([dx - 0.7, yg - g.H], [dx + 0.7, yg - g.H], { w: 0.22 }) + seg([dx - 0.7, yg], [dx + 0.7, yg], { w: 0.22 }); }
    b += T(g.x - reach(g.kind, g.H) - (g.kind === 'pole' || g.kind === 'stick' ? 0 : 0.5), yg - g.H / 2 + 0.9, it(hl), { size: z, anchor: 'end' });
    b += T(g.x + g.S / 2, yg + 3.4, it(sl2), { size: z });
  });
  return svg(f(W), f(yg + 0.5), b);
};
// A small sun, for a picture to draw in
const sun = (c, r = 1.8) => circ(c, r, '#f6e7a8', { w: 0.3 }) + [...Array(8)].map((_, i) => { const a = (i * Math.PI) / 4, x = Math.cos(a), y = Math.sin(a);
  return seg([c[0] + x * (r + 0.6), c[1] + y * (r + 0.6)], [c[0] + x * (r + 1.6), c[1] + y * (r + 1.6)], { w: 0.25 }); }).join('');
// The ground and the sun, for students to draw the shadows on (w by h mm)
const ground = (w = 40, h = 22) => svg(f(w), f(h), sun([w - 3.5, 3.5]) + seg([0, h - 1], [w, h - 1], { w: 0.35 }));

// A floor plan: the walls P (in the plan's cm, y up), drawn in proportion in a box o.w by o.h mm, corners lettered
// (o.L), the plan lengths beside their walls (o.sides [[i, '3 cm']]) and the scale written under it (o.scale: 200)
const plan = (P, o = {}) => {
  const xs = P.map((p) => p[0]), ys = P.map((p) => p[1]), x0 = Math.min(...xs), y1 = Math.max(...ys);
  const u = Math.min((o.w || 36) / (Math.max(...xs) - x0), (o.h || 22) / (y1 - Math.min(...ys))), Q = P.map(([x, y]) => [(x - x0) * u, (y1 - y) * u]);
  const W = Math.max(...Q.map((p) => p[0])), H = Math.max(...Q.map((p) => p[1])), bottom = (o.sides || []).some(([i]) => Q[i][1] > H - 0.01 && Q[(i + 1) % Q.length][1] > H - 0.01);
  return svg(f(W), f(H), shape(Q, { ...o, fill: '#ffffff', lw: 0.8 }) + (o.scale ? T(W / 2, H + (bottom ? 7.4 : 4.2), `Scale 1 : ${o.scale.toLocaleString('en-AU').replace(/,/g, ' ')}`, { size: 2.5, weight: 600 }) : ''));
};
// A map: two places as dots (o.names), the straight distance between them dashed with its map length (o.label) and
// the scale under it; o.w the map distance in mm, o.rise how far the second place sits above the first
const map = (o) => {
  const w = o.w || 34, r = o.rise || 8, a = [1.5, r + 1.5], b = [w + 1.5, 1.5], [na, nb] = o.names;
  let s = seg(a, b, { w: 0.35, dash: true }) + circ(a, 0.8, INK, { w: 0.1 }) + circ(b, 0.8, INK, { w: 0.1 });
  s += T(a[0], a[1] + 3.6, na, { size: 2.5, anchor: 'start' }) + T(b[0], b[1] - 1.6, nb, { size: 2.5, anchor: 'end' });
  const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], [ux, uy] = dir(a, b);
  s += T(m[0] + uy * 2.4, m[1] - ux * 2.4 + 0.8, o.label, { size: 2.5, anchor: 'end' });
  return svg(f(w + 3), f(r + 3), s + (o.scale ? T((w + 3) / 2, r + 3 + 7.2, `Scale 1 : ${o.scale.toLocaleString('en-AU').replace(/,/g, ' ')}`, { size: 2.5, weight: 600 }) : ''));
};

module.exports = { tri, shape, pair, onGrid, toDraw, shadow, ground, plan, map, side, parts: { f, svg, seg, T, it, FILL, FILL2 } };
