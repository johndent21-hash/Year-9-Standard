// Diagrams for Chapter 10 (SVG, units in mm), drawn to scale from the measurements in each question so the pictures
// match the numbers. Plain lines and light fills so they photocopy well; dashed lines are heights, diagonals and
// hidden edges. Every function returns an <svg class="graph"> sized in mm (it shrinks to fit its cell if needed).
const { C, text } = require('../../lib/graphs');

const f = (n) => +(+n).toFixed(2);
const INK = C.charcoal, FILL = '#eef1f9', SHADE = '#bccaee', SIDE = '#e1e6f3', TOP = '#f6f7fb';
const P = (p) => `${f(p[0])},${f(p[1])}`;
// Labels are recorded as they are placed, so the picture's frame can grow to hold every one (svg below).
let EXT = [];
const T = (x, y, s, o = {}) => {
  if (s === '' || s === undefined) return '';
  const size = o.size || 2.8, anchor = o.anchor || 'middle', w = String(s).replace(/<[^>]+>/g, '').length * size * 0.58;
  const x0 = anchor === 'start' ? x : anchor === 'end' ? x - w : x - w / 2;
  EXT.push([x0, y - size * 0.8, x0 + w, y + size * 0.25]);
  return text(f(x), f(y), s, { size: 2.8, anchor: 'middle', ...o });
};
// The picture: the box 0..w by 0..h, grown to hold the labels placed since the last picture (plus a little air).
const svg = (w, h, body) => {
  const xs = [0, w, ...EXT.flatMap((e) => [e[0] - 0.8, e[2] + 0.8])], ys = [0, h, ...EXT.flatMap((e) => [e[1] - 0.6, e[3] + 0.6])];
  EXT = [];
  const x0 = Math.min(...xs), y0 = Math.min(...ys), W = f(Math.max(...xs) - x0), H = f(Math.max(...ys) - y0);
  return `<svg class="graph" viewBox="${f(x0)} ${f(y0)} ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="aspect-ratio:${W}/${H}; --w:${W}mm; --ar:${W}/${H}">${body}</svg>`;
};
const seg = (a, b, o = {}) => `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${o.stroke || INK}" stroke-width="${o.w || 0.4}"${o.dash ? ' stroke-dasharray="1.2 0.9"' : ''}/>`;
const dashed = (a, b) => seg(a, b, { stroke: C.grey, w: 0.32, dash: true });
const poly = (pts, fill = FILL, o = {}) => `<polygon points="${pts.map(P).join(' ')}" fill="${fill}" stroke="${o.stroke || INK}" stroke-width="${o.w || 0.45}"${o.dash ? ' stroke-dasharray="1.2 0.9"' : ''}/>`;
const dot = (p, r = 0.55) => `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${r}" fill="${INK}"/>`;
const rad = (d) => (d * Math.PI) / 180;

// A right-angle mark at corner p between the directions to a and c.
const rightMark = (p, a, c, s = 1.8) => {
  const u = (q) => { const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy); return [(dx / L) * s, (dy / L) * s]; };
  const [ax, ay] = u(a), [cx, cy] = u(c);
  return `<polyline points="${P([p[0] + ax, p[1] + ay])} ${P([p[0] + ax + cx, p[1] + ay + cy])} ${P([p[0] + cx, p[1] + cy])}" fill="none" stroke="${INK}" stroke-width="0.3"/>`;
};

// A label beside the segment a→b, pushed out along the normal n (unit vector) by d mm.
const sideLabel = (a, b, s, n, d = 1.8) => {
  if (!s) return '';
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
  if (Math.abs(n[0]) > 0.75) return T(mx + n[0] * d, my + 1.1, s, { anchor: n[0] > 0 ? 'start' : 'end' });
  return T(mx + n[0] * d * 1.5, my + (n[1] > 0 ? 3.6 : -1.3) + n[1] * (d - 1.6), s);
};

// Fit a list of points (in the question's units) into the box: scale k mm per unit, margin m mm. Returns the mapper.
const fitter = (pts, size, m = 7, maxH) => {
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const W = Math.max(...xs) - Math.min(...xs) || 1, H = Math.max(...ys) - Math.min(...ys) || 1;
  const k = Math.min(size / W, (maxH || size) / H);
  const map = (p) => [m + (p[0] - Math.min(...xs)) * k, m + (Math.max(...ys) - p[1]) * k]; // y up in the question
  return { k, map, w: W * k + 2 * m, h: H * k + 2 * m };
};

// ---------------------------------------------------------------- flat shapes
// A polygon from its corners (x right, y up, in the question's units).
//   sides: a label for each side (side i joins corner i to corner i + 1), right: corners with a right-angle mark,
//   dash: [[p, q, label?]] dashed lines (heights, diagonals), holes: [[corners]] cut out (white), shade: fill darker,
//   circles: [[cx, cy, r]] holes that are circles, angles: [[corner, label]], labels: [[text, x, y]] anywhere,
//   dims: [[p, q, label, side]] a measurement line beside the shape (for a height that has no room inside).
const shape = ({ pts, sides = [], right = [], dash = [], holes = [], circles = [], shade = false, size = 22, maxH = 15, m = 1.5, angles = [], marks = [], labels = [], dims = [] }) => {
  const { k, map, w, h } = fitter([...pts, ...dash.flatMap((d) => [d[0], d[1]])], size, m, maxH);
  const Q = pts.map(map);
  const signed = Q.reduce((s, p, i) => { const q = Q[(i + 1) % Q.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0);
  const out = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy); return signed > 0 ? [dy / L, -dx / L] : [-dy / L, dx / L]; };
  let b = poly(Q, shade ? SHADE : FILL);
  holes.forEach((hp) => { b += poly(hp.map(map), '#fff'); });
  circles.forEach(([cx, cy, r, lab]) => { const c = map([cx, cy]); b += `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(r * k)}" fill="#fff" stroke="${INK}" stroke-width="0.4"/>`; if (lab) b += dot(c) + seg(c, [c[0] + r * k, c[1]], { stroke: C.blue, w: 0.4 }) + T(c[0] + (r * k) / 2, c[1] - 1.2, lab, { size: 2.8 }); });
  right.forEach((i) => { b += rightMark(Q[i], Q[(i + Q.length - 1) % Q.length], Q[(i + 1) % Q.length]); });
  dash.forEach(([p, q, lab, side = 1, t = 0.5]) => { const a = map(p), c = map(q); b += dashed(a, c); if (lab) { const dx = c[0] - a[0], dy = c[1] - a[1], L = Math.hypot(dx, dy), e = [a[0] + dx * t * 2, a[1] + dy * t * 2]; b += sideLabel(a, e, lab, [(dy / L) * side, (-dx / L) * side]); } });
  marks.forEach(([p, q, r]) => { b += rightMark(map(p), map(q), map(r)); });
  sides.forEach((s, i) => { b += sideLabel(Q[i], Q[(i + 1) % Q.length], s, out(Q[i], Q[(i + 1) % Q.length])); });
  labels.forEach(([s, x, y, o = {}]) => { const p = map([x, y]); b += T(p[0], p[1] + 1.1, s, o); });
  // dimension lines outside the shape: [p, q, label, side] drawn 2.5 mm to the side (side 1: to the left going p → q)
  dims.forEach(([p, q, lab, side = 1]) => {
    const a = map(p), c = map(q), dx = c[0] - a[0], dy = c[1] - a[1], L = Math.hypot(dx, dy), n = [(dy / L) * side, (-dx / L) * side];
    const A2 = [a[0] + n[0] * 2.5, a[1] + n[1] * 2.5], C2 = [c[0] + n[0] * 2.5, c[1] + n[1] * 2.5];
    b += seg(A2, C2, { stroke: C.grey, w: 0.3 }) + seg([A2[0] - n[0], A2[1] - n[1]], [A2[0] + n[0], A2[1] + n[1]], { stroke: C.grey, w: 0.3 }) + seg([C2[0] - n[0], C2[1] - n[1]], [C2[0] + n[0], C2[1] + n[1]], { stroke: C.grey, w: 0.3 });
    b += sideLabel(A2, C2, lab, n, 1.2);
  });
  angles.forEach(([i, s]) => { const p = Q[i], cx = Q.reduce((t, q) => t + q[0], 0) / Q.length, cy = Q.reduce((t, q) => t + q[1], 0) / Q.length, L = Math.hypot(cx - p[0], cy - p[1]); b += T(p[0] + ((cx - p[0]) / L) * 5, p[1] + ((cy - p[1]) / L) * 5 + 1, s, { size: 2.8, fill: C.blue, weight: 600 }); });
  return svg(f(w), f(h), b);
};

const rect = (l, wd, o = {}) => shape({ pts: [[0, 0], [l, 0], [l, wd], [0, wd]], ...o });
// Right-angled triangle: base b along the bottom, height h up the left side.
const rightTri = (bs, ht, o = {}) => shape({ pts: [[0, 0], [bs, 0], [0, ht]], right: [0], ...o });
// Triangle with base b and apex above the point a along the base, height h shown dashed.
const tri = (bs, ht, a, o = {}) => shape({ pts: [[0, 0], [bs, 0], [a, ht]], dash: [[[a, ht], [a, 0], o.hLabel || '', a > bs / 2 ? -1 : 1]], marks: [[[a, 0], [a, 1], [a + (a > bs / 2 ? -1 : 1), 0]]], ...o });
// Parallelogram: base b, slant offset s, height h (dashed, from the top-left corner).
const para = (bs, ht, s, o = {}) => shape({ pts: [[0, 0], [bs, 0], [bs + s, ht], [s, ht]], dash: [[[s, ht], [s, 0], o.hLabel || '', 1]], marks: [[[s, 0], [s, ht], [s + 1, 0]]], ...o });
// Trapezium: parallel sides a (bottom) and b (top), height h, the top starting at x = s.
const trap = (a, bt, ht, s, o = {}) => shape({ pts: [[0, 0], [a, 0], [s + bt, ht], [s, ht]], dash: s > 0.01 ? [[[s, ht], [s, 0], o.hLabel || '', 1]] : [], marks: s > 0.01 ? [[[s, 0], [s, ht], [s + 1, 0]]] : [], right: s > 0.01 ? [] : [0, 3], ...o });
// Rhombus or kite from its diagonals: x across, y up; the across diagonal crosses the up one at height c (kite).
// The diagonals are dashed; their lengths are shown on measurement lines outside the shape (across below it, up on
// its right), so the labels never crowd a small kite.
const kite = (x, y, c = y / 2, o = {}) => shape({ pts: [[0, 0], [x / 2, c], [0, y], [-x / 2, c]], dash: [[[-x / 2, c], [x / 2, c]], [[0, 0], [0, y]]],
  dims: [[[-x / 2, 0], [x / 2, 0], o.xLabel || '', -1], [[x / 2, 0], [x / 2, y], o.yLabel || '', -1]], ...o });

// ---------------------------------------------------------------- circles
const arcD = (c, r, a0, a1) => { // anticlockwise from a0 to a1 (degrees, y up)
  const p0 = [c[0] + r * Math.cos(rad(a0)), c[1] - r * Math.sin(rad(a0))], p1 = [c[0] + r * Math.cos(rad(a1)), c[1] - r * Math.sin(rad(a1))];
  return { p0, p1, d: `A${f(r)},${f(r)} 0 ${a1 - a0 > 180 ? 1 : 0} 0 ${P(p1)}` };
};
// Circle, semicircle, quadrant or any sector: angle (degrees), rot (start angle), show 'r' or 'd' with label,
// angleLabel shows the angle at the centre.
const sector = ({ angle = 360, rot = 0, lab = '', show = 'r', angleLabel = '', size = 26, shade = false, labAt }) => {
  const R = size / 2, m = 5;
  const full = angle >= 360;
  // bounding box of the sector
  const ang = [rot, rot + angle, ...[0, 90, 180, 270, 360, 450, 540, 630].filter((a) => a > rot && a < rot + angle)];
  const pts = full ? [[-R, -R], [R, R]] : [[0, 0], ...ang.map((a) => [R * Math.cos(rad(a)), R * Math.sin(rad(a))])];
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const c = [m - Math.min(...xs), m + Math.max(...ys)];
  const W = Math.max(...xs) - Math.min(...xs) + 2 * m, H = Math.max(...ys) - Math.min(...ys) + 2 * m;
  let b = '';
  const fill = shade ? SHADE : FILL;
  if (full) b += `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(R)}" fill="${fill}" stroke="${INK}" stroke-width="0.45"/>`;
  else { const a = arcD(c, R, rot, rot + angle); b += `<path d="M${P(c)} L${P(a.p0)} ${a.d} Z" fill="${fill}" stroke="${INK}" stroke-width="0.45"/>`; }
  b += dot(c);
  if (!full && Math.abs(angle - 90) < 0.01) b += rightMark(c, [c[0] + Math.cos(rad(rot)), c[1] - Math.sin(rad(rot))], [c[0] + Math.cos(rad(rot + 90)), c[1] - Math.sin(rad(rot + 90))], 2.2);
  if (angleLabel) { const mid = rot + angle / 2, a = arcD(c, 3.4, rot, rot + angle); b += `<path d="M${P(a.p0)} ${a.d}" fill="none" stroke="${C.blue}" stroke-width="0.35"/>`; b += T(c[0] + 6.6 * Math.cos(rad(mid)), c[1] - 6.6 * Math.sin(rad(mid)) + 1, angleLabel, { size: 2.8, fill: C.blue, weight: 600 }); }
  if (lab) {
    const at = labAt ?? (full ? 0 : angle >= 180 && show === 'd' ? rot : rot);
    const e = [c[0] + R * Math.cos(rad(at)), c[1] - R * Math.sin(rad(at))];
    if (show === 'd') { const e2 = [c[0] - R * Math.cos(rad(at)), c[1] + R * Math.sin(rad(at))]; if (full) b += seg(e2, e, { stroke: C.blue, w: 0.45 }); }
    else if (full) b += seg(c, e, { stroke: C.blue, w: 0.45 });
    const lx = show === 'd' ? (full ? c[0] : c[0]) : (c[0] + e[0]) / 2, ly = show === 'd' ? c[1] : (c[1] + e[1]) / 2;
    // a full circle: above its radius or diameter; a sector: outside it, beside its first radius (or flat edge)
    const n = full ? [-Math.sin(rad(at)), -Math.cos(rad(at))] : [Math.sin(rad(at)), Math.cos(rad(at))];
    b += T(lx + n[0] * 2.4, ly + n[1] * 2.4 + 1.1, lab, { size: 3 });
  }
  return svg(f(W), f(H), b);
};
const circle = (lab, show = 'r', o = {}) => sector({ lab, show, ...o });
const semi = (lab, show = 'd', o = {}) => sector({ angle: 180, lab, show, ...o });
const quadrant = (lab, o = {}) => sector({ angle: 90, lab, ...o });

// A rectangle (l by w) with a semicircle on its right end (ends: 1) or on both ends (ends: 2). The semicircles have
// diameter w. hole: true makes the shape a white rectangle with the semicircle cut out (not used by default).
const rectSemi = ({ l, w, ends = 1, labL = '', labW = '', size = 34, cut = false }) => {
  const r = w / 2, total = l + r * ends, k = size / total, m = 6;
  const x0 = m + (ends === 2 ? r * k : 0), y0 = m, X = (x) => x0 + x * k, H = w * k;
  const right = `L${P([X(l), y0])} A${f(r * k)},${f(r * k)} 0 0 1 ${P([X(l), y0 + H])}`;
  const left = ends === 2 ? `L${P([X(0), y0 + H])} A${f(r * k)},${f(r * k)} 0 0 1 ${P([X(0), y0])}` : `L${P([X(0), y0 + H])} Z`;
  let b = `<path d="M${P([X(0), y0])} ${right} ${left}" fill="${FILL}" stroke="${INK}" stroke-width="0.45"/>`;
  b += seg([X(l), y0], [X(l), y0 + H], { stroke: C.grey, w: 0.3, dash: true });
  if (ends === 2) b += seg([X(0), y0], [X(0), y0 + H], { stroke: C.grey, w: 0.3, dash: true });
  b += T((X(0) + X(l)) / 2, y0 + H + 4, labL) + T(X(l) - 1.5, y0 + H / 2 + 1, labW, { anchor: 'end' });
  const W = total * k + 2 * m, Hh = H + 2 * m;
  return svg(f(W), f(Hh), b);
};
// A square or rectangle (l by w) with a quarter circle of radius w on top of... kept simple: an annulus (ring).
const ring = ({ R, r, labR = '', labr = '', size = 28 }) => {
  const k = size / (2 * R), m = 5, c = [m + R * k, m + R * k];
  let b = `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(R * k)}" fill="${SHADE}" stroke="${INK}" stroke-width="0.45"/>`
    + `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(r * k)}" fill="#fff" stroke="${INK}" stroke-width="0.45"/>` + dot(c);
  const a = rad(35), e = [c[0] + R * k * Math.cos(a), c[1] - R * k * Math.sin(a)], e2 = [c[0] + r * k * Math.cos(-a), c[1] - r * k * Math.sin(-a)];
  b += seg(c, e, { stroke: C.blue, w: 0.4 }) + seg(c, e2, { stroke: C.blue, w: 0.4 });
  b += T(e[0] + 1, e[1] - 0.8, labR, { size: 2.9, anchor: 'start' }) + T(c[0] - 1, c[1] + 4.2, labr, { size: 2.9 });
  return svg(f(2 * R * k + 2 * m), f(2 * R * k + 2 * m), b);
};

// ---------------------------------------------------------------- solids (oblique view: depth drawn at 35° up-right, half size)
const DEPTH = [Math.cos(rad(35)) * 0.55, -Math.sin(rad(35)) * 0.55];
// A prism from its front face (x right, y up, in units) pushed back by len. labels: [[text, x, y]] on the front face
// (units, y up), side labels sides: [label per front edge], lenLabel on the receding edge from corner lenAt.
const prism = ({ face, len, sides = [], lenLabel = '', lenAt, size = 30, maxH, right = [], dash = [], open = false, m = 6, faceLabel = '' }) => {
  const xs = face.map((p) => p[0]), ys = face.map((p) => p[1]);
  const W = Math.max(...xs) - Math.min(...xs) + len * DEPTH[0], H = Math.max(...ys) - Math.min(...ys) - len * DEPTH[1];
  const k = Math.min(size / W, (maxH || size * 0.8) / H);
  const X0 = m - Math.min(...xs) * k, Y0 = m - len * DEPTH[1] * k + Math.max(...ys) * k;
  const F = (p) => [X0 + p[0] * k, Y0 - p[1] * k];
  const B = (p) => [X0 + p[0] * k + len * DEPTH[0] * k, Y0 - p[1] * k + len * DEPTH[1] * k];
  const front = face.map(F), back = face.map(B);
  const n = face.length;
  const signed = front.reduce((s, p, i) => { const q = front[(i + 1) % n]; return s + p[0] * q[1] - q[0] * p[1]; }, 0);
  // the outward normal of front edge i (screen coordinates); the side face behind that edge is visible when the
  // normal points the way the depth goes (up or right)
  const outN = (i) => { const a = front[i], c = front[(i + 1) % n], dx = c[0] - a[0], dy = c[1] - a[1], L = Math.hypot(dx, dy); return signed > 0 ? [dy / L, -dx / L] : [-dy / L, dx / L]; };
  const vis = (i) => { const [nx, ny] = outN(i); return nx * DEPTH[0] + ny * DEPTH[1] > 1e-6; };
  let b = '';
  // hidden back edges first (dashed)
  for (let i = 0; i < n; i++) { const j = (i + 1) % n; b += seg(back[i], back[j], { stroke: C.grey, w: 0.3, dash: true }); }
  for (let i = 0; i < n; i++) b += seg(front[i], back[i], { stroke: C.grey, w: 0.3, dash: true });
  // visible side faces, then the front face on top
  for (let i = 0; i < n; i++) if (vis(i)) { const j = (i + 1) % n; const [nx, ny] = outN(i); b += poly([front[i], front[j], back[j], back[i]], ny < -0.5 ? (open ? '#fff' : TOP) : SIDE); }
  b += poly(front, FILL);
  right.forEach((i) => { b += rightMark(front[i], front[(i + n - 1) % n], front[(i + 1) % n]); });
  dash.forEach(([p, q, lab, side = 1]) => { const a = F(p), c = F(q); b += dashed(a, c); if (lab) { const dx = c[0] - a[0], dy = c[1] - a[1], L = Math.hypot(dx, dy); b += sideLabel(a, c, lab, [(dy / L) * side, (-dx / L) * side]); } });
  // a label on an edge whose side face shows goes in the middle of that face; otherwise outside the edge
  sides.forEach((s, i) => { if (!s) return; const j = (i + 1) % n; if (vis(i)) { const c = [front[i], front[j], back[j], back[i]]; b += T(c.reduce((t, p) => t + p[0], 0) / 4, c.reduce((t, p) => t + p[1], 0) / 4 + 1.1, s); } else b += sideLabel(front[i], front[j], s, outN(i)); });
  if (lenLabel) { const i = lenAt ?? 1; const a = front[i], c = back[i]; b += T((a[0] + c[0]) / 2 + 1.6, (a[1] + c[1]) / 2 + 2.8, lenLabel, { anchor: 'start' }); }
  if (faceLabel) { const cx = front.reduce((t, p) => t + p[0], 0) / n, cy = front.reduce((t, p) => t + p[1], 0) / n; b += T(cx, cy + 1, faceLabel, { size: 2.9, fill: C.blue, weight: 600 }); }
  return svg(f(W * k + 2 * m + 6), f(H * k + 2 * m), b);
};
// Rectangular prism l (across) × w (back) × h (up). labels: [l, w, h].
const cuboid = (l, w, h, [ll, lw, lh] = [], o = {}) => prism({ face: [[0, 0], [l, 0], [l, h], [0, h]], len: w, sides: [ll, '', '', lh], lenLabel: lw, lenAt: 1, ...o });
// Triangular prism with a right-angled triangle face: base b, height h, slope s; length len.
const triPrism = (bs, ht, len, [lb, lh, ls, ll] = [], o = {}) => prism({ face: [[0, 0], [bs, 0], [0, ht]], len, sides: [lb, ls, lh], lenLabel: ll, lenAt: 1, right: [0], ...o });

// Cylinder standing up: radius r, height h. lab on the top radius (or diameter with show 'd'), hLab on the right.
const cylinder = ({ r, h, lab = '', hLab = '', show = 'r', size = 26, maxH = 30, open = false, lying = false }) => {
  const k = Math.min(size / (2 * r), maxH / (h + 0.7 * r)), R = r * k, E = R * 0.35, Hh = h * k, m = 6;
  const cx = m + R, top = m + E, bot = top + Hh;
  let b = `<path d="M${f(cx - R)},${f(top)} L${f(cx - R)},${f(bot)} A${f(R)},${f(E)} 0 0 0 ${f(cx + R)},${f(bot)} L${f(cx + R)},${f(top)}" fill="${SIDE}" stroke="${INK}" stroke-width="0.45"/>`;
  b += `<path d="M${f(cx - R)},${f(bot)} A${f(R)},${f(E)} 0 0 1 ${f(cx + R)},${f(bot)}" fill="none" stroke="${C.grey}" stroke-width="0.3" stroke-dasharray="1.2 0.9"/>`;
  b += `<ellipse cx="${f(cx)}" cy="${f(top)}" rx="${f(R)}" ry="${f(E)}" fill="${open ? '#fff' : TOP}" stroke="${INK}" stroke-width="0.45"/>`;
  b += dot([cx, top]);
  if (show === 'd') b += seg([cx - R, top], [cx + R, top], { stroke: C.blue, w: 0.45 }) + T(cx, top - E - 0.9, lab, { size: 3 });
  else b += seg([cx, top], [cx + R, top], { stroke: C.blue, w: 0.45 }) + T(cx + R / 2, top - E - 0.9, lab, { size: 3 });
  b += T(cx + R + 1.6, (top + bot) / 2 + 1, hLab, { anchor: 'start' });
  return svg(f(2 * R + 2 * m + 12), f(Hh + 2 * E + 2 * m), b);
};

// ---------------------------------------------------------------- measuring scales (Lesson 10.2)
// A straight scale from min to max: a tick every minor, a longer numbered tick every major. kind 'ruler' (horizontal,
// in a ruler), 'jug' (vertical, in a measuring cylinder with liquid up to level), 'thermo' (vertical thermometer).
const scale = ({ min = 0, max, major, minor, unit = '', kind = 'ruler', level, len = 34, fmt = (v) => String(v) }) => {
  const n = Math.round((max - min) / minor), step = len / n;
  const isMajor = (v) => Math.abs((v - min) / major - Math.round((v - min) / major)) < 1e-6;
  const mid = (v) => major / minor % 2 === 0 && Math.abs(((v - min) / (major / 2)) - Math.round((v - min) / (major / 2))) < 1e-6;
  let b = '';
  if (kind === 'ruler') {
    const x0 = 4, y0 = 3, H = 9;
    b += `<rect x="${x0 - 2}" y="${y0}" width="${f(len + 4)}" height="${H}" rx="0.8" fill="#fbf6e6" stroke="${INK}" stroke-width="0.4"/>`;
    for (let i = 0; i <= n; i++) { const v = min + i * minor, x = x0 + i * step, t = isMajor(v) ? 3.4 : mid(v) ? 2.4 : 1.5; b += seg([x, y0], [x, y0 + t], { w: 0.25 }); if (isMajor(v)) b += T(x, y0 + 7.2, fmt(+v.toFixed(6)), { size: 2.4 }); }
    b += T(x0 + len + 1, y0 + H + 3.6, unit, { size: 2.6, anchor: 'end' });
    return svg(f(len + 8), 17, b);
  }
  const x0 = kind === 'jug' ? 4 : 7, top = 4, bot = top + len;
  const Y = (v) => bot - ((v - min) / (max - min)) * len;
  if (kind === 'jug') {
    b += `<rect x="${x0}" y="${top - 2}" width="12" height="${f(len + 2)}" fill="#fff" stroke="${INK}" stroke-width="0.4"/>`;
    if (level !== undefined) b += `<rect x="${x0}" y="${f(Y(level))}" width="12" height="${f(bot - Y(level))}" fill="#c9d6f2" stroke="none"/>`;
    b += seg([x0, bot], [x0 + 12, bot], { w: 0.4 });
  } else {
    b += `<rect x="${x0}" y="${top - 2}" width="3.4" height="${f(len + 3)}" rx="1.7" fill="#fff" stroke="${INK}" stroke-width="0.4"/>`;
    b += `<circle cx="${x0 + 1.7}" cy="${f(bot + 3)}" r="2.6" fill="#d9534f" stroke="${INK}" stroke-width="0.4"/>`;
    if (level !== undefined) b += `<rect x="${x0 + 1}" y="${f(Y(level))}" width="1.4" height="${f(bot + 1 - Y(level))}" fill="#d9534f"/>`;
  }
  const tx = kind === 'jug' ? x0 + 12 : x0 + 3.4;
  for (let i = 0; i <= n; i++) { const v = min + i * minor, y = Y(v), t = isMajor(v) ? 3 : mid(v) ? 2.1 : 1.3; b += seg([tx - t, y], [tx, y], { w: 0.25 }); if (isMajor(v)) b += T(tx + 1.2, y + 1, fmt(+v.toFixed(6)), { size: 2.4, anchor: 'start' }); }
  b += T(tx + 1.2, top - 3, unit, { size: 2.5, anchor: 'start', weight: 600 });
  return svg(kind === 'jug' ? 30 : 24, f(len + (kind === 'jug' ? 8 : 12)), b);
};

module.exports = { shape, rect, rightTri, tri, para, trap, kite, sector, circle, semi, quadrant, rectSemi, ring, prism, cuboid, triPrism, cylinder, scale };
// The building blocks, for a one-off picture drawn inside a lesson file. Place labels with T and finish with svg(w, h,
// body): svg grows the frame to hold every label placed with T since the last picture.
module.exports.parts = { C, f, T, svg, seg, dashed, poly, dot, rightMark, sideLabel, arcD, fitter, rad, FILL, SHADE, SIDE, TOP };
