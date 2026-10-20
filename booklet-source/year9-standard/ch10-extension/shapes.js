// Diagrams for the Chapter 10 extension booklet (SVG, units in mm), drawn to scale from each question's numbers with
// the Chapter 10 building blocks. Labels that sit on a shape get a white halo (H) so lines never run through them.
const ch10 = require('../ch10-surface-area-volume/shapes.js');
const { C, f, T, svg, seg, dashed, poly, dot, rightMark, sideLabel, arcD, rad, FILL, SHADE, SIDE, TOP } = ch10.parts;

const INK = C.charcoal;
const P = (p) => `${f(p[0])},${f(p[1])}`;
const H = (x, y, s, o) => T(x, y, s, o).replace('<text ', '<text stroke="#fff" stroke-width="0.8" stroke-linejoin="round" paint-order="stroke" ');
// A measurement line from a to b, pushed d mm to the side n, with end ticks.
const dim = (a, b, n, d = 2.5) => {
  const A = [a[0] + n[0] * d, a[1] + n[1] * d], B = [b[0] + n[0] * d, b[1] + n[1] * d], o = { stroke: C.grey, w: 0.3 };
  return { A, B, svg: seg(A, B, o) + seg([A[0] - n[0], A[1] - n[1]], [A[0] + n[0], A[1] + n[1]], o) + seg([B[0] - n[0], B[1] - n[1]], [B[0] + n[0], B[1] + n[1]], o) };
};

// A sector of radius R mm and angle (degrees, anticlockwise from rot): the radius label beside its first radius, the
// arc label outside the middle of its arc, the angle label inside at the centre.
const sectorArc = ({ angle, rot = 0, R = 16, rLab = '', arcLab = '', angLab = '' }) => {
  const m = 1;
  const ang = [rot, rot + angle, ...[0, 90, 180, 270, 360, 450].filter((a) => a > rot && a < rot + angle)];
  const pts = [[0, 0], ...ang.map((a) => [R * Math.cos(rad(a)), R * Math.sin(rad(a))])];
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const c = [m - Math.min(...xs), m + Math.max(...ys)];
  const at = (a, d) => [c[0] + d * Math.cos(rad(a)), c[1] - d * Math.sin(rad(a))];
  const a = arcD(c, R, rot, rot + angle), mid = rot + angle / 2;
  let b = `<path d="M${P(c)} L${P(a.p0)} ${a.d} Z" fill="${FILL}" stroke="${INK}" stroke-width="0.45"/>` + dot(c);
  if (rLab) { const p = at(rot, R / 2), n = [Math.sin(rad(rot)), Math.cos(rad(rot))]; b += T(p[0] + n[0] * 2.4, p[1] + n[1] * 2.4 + 1.1, rLab); }
  if (arcLab) { const p = at(mid, R + 2), cm = Math.cos(rad(mid)); b += T(p[0], p[1] + 1 - Math.sin(rad(mid)) * 1.2, arcLab, { anchor: cm > 0.3 ? 'start' : cm < -0.3 ? 'end' : 'middle', weight: 600, fill: C.blue }); }
  if (angLab) { const g = arcD(c, 3.4, rot, rot + angle), p = at(mid, 6.6); b += `<path d="M${P(g.p0)} ${g.d}" fill="none" stroke="${C.blue}" stroke-width="0.35"/>` + T(p[0], p[1] + 1, angLab, { weight: 600, fill: C.blue }); }
  return svg(f(Math.max(...xs) - Math.min(...xs) + 2 * m), f(Math.max(...ys) - Math.min(...ys) + 2 * m), b);
};

// A semicircle of diameter D on top, with two semicircles of diameter D/2 on its diameter: the left one hangs below,
// the right one bites into the big one. k mm per unit; the full diameter is shown on a measurement line below.
const sCurve = ({ D, k = 2, lab = '' }) => {
  const R = (D / 2) * k, r = R / 2, m = 1, A = [m, m + R], B = [m + 2 * R, m + R], M = [m + R, m + R];
  let b = `<path d="M${P(A)} A${f(R)},${f(R)} 0 0 1 ${P(B)} A${f(r)},${f(r)} 0 0 0 ${P(M)} A${f(r)},${f(r)} 0 0 1 ${P(A)} Z" fill="${FILL}" stroke="${INK}" stroke-width="0.45"/>`;
  b += seg(A, B, { stroke: C.grey, w: 0.25, dash: true });
  const d = dim([A[0], A[1] + r], [B[0], B[1] + r], [0, 1], 2.5);
  b += d.svg + T(M[0] + R / 2, d.A[1] + 3.6, lab);
  return svg(f(2 * R + 2 * m), f(R + r + 2 * m), b);
};

// A square of side s with a quarter circle of radius s/2 cut from each corner; the part left over is shaded.
const squareQuads = ({ s, k = 2.6, lab = '' }) => {
  const L = s * k, r = L / 2, m = 1, x0 = m, y0 = m;
  let b = `<rect x="${x0}" y="${y0}" width="${f(L)}" height="${f(L)}" fill="${SHADE}" stroke="${INK}" stroke-width="0.45"/>`;
  [[x0, y0, 1, 1], [x0 + L, y0, -1, 1], [x0 + L, y0 + L, -1, -1], [x0, y0 + L, 1, -1]].forEach(([cx, cy, sx, sy]) => {
    const p = [cx + sx * r, cy], q = [cx, cy + sy * r], cross = (p[0] - cx) * (q[1] - cy) - (p[1] - cy) * (q[0] - cx);
    b += `<path d="M${P([cx, cy])} L${P(p)} A${f(r)},${f(r)} 0 0 ${cross > 0 ? 1 : 0} ${P(q)} Z" fill="#fff" stroke="${INK}" stroke-width="0.4"/>`;
  });
  b += T(x0 + L / 2, y0 + L + 4, lab);
  return svg(f(L + 2 * m), f(L + 2 * m), b);
};

// A circular pond (radius r) with a path of width w around it (shaded), k mm per unit.
const ringPath = ({ r, w, k = 2.6, rLab = '', wLab = '' }) => {
  const R = (r + w) * k, ri = r * k, m = 1, c = [m + R, m + R];
  let b = `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(R)}" fill="${SHADE}" stroke="${INK}" stroke-width="0.45"/>`
    + `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(ri)}" fill="#fff" stroke="${INK}" stroke-width="0.45"/>` + dot(c);
  const at = (a, d) => [c[0] + d * Math.cos(rad(a)), c[1] - d * Math.sin(rad(a))];
  b += seg(c, at(180, ri), { stroke: C.blue, w: 0.4 }) + H(c[0] - ri / 2, c[1] - 1.2, rLab);
  b += seg(at(40, ri), at(40, R), { stroke: C.blue, w: 0.5 }) + H(at(40, R)[0] + 0.8, at(40, R)[1] - 0.8, wLab, { anchor: 'start' });
  b += T(c[0], c[1] - ri * 0.45, 'pond', { size: 2.5, fill: C.grey });
  return svg(f(2 * R + 2 * m), f(2 * R + 2 * m), b);
};

// A quarter circle of radius r with the chord joining the ends of its arc: the segment is shaded.
const segment = ({ r, k = 3.4, lab = '' }) => {
  const R = r * k, m = 1, O = [m, m + R], A = [m + R, m + R], B = [m, m];
  let b = poly([O, A, B], FILL) + `<path d="M${P(A)} A${f(R)},${f(R)} 0 0 0 ${P(B)} Z" fill="${SHADE}" stroke="${INK}" stroke-width="0.45"/>`;
  b += rightMark(O, A, B, 2) + T(m + R / 2, m + R + 3.8, lab) + T(m - 1.4, m + R / 2 + 1, lab, { anchor: 'end' });
  return svg(f(R + 2 * m), f(R + 2 * m), b);
};

// A rectangular card L by W with an s by s square cut from each corner; the fold lines are dashed.
const cardNet = ({ L, W, s, k = 1.25, labL = '', labW = '', labS = '' }) => {
  const m = 1, X = (x) => m + x * k, Y = (y) => m + y * k;
  const out = [[s, 0], [L - s, 0], [L - s, s], [L, s], [L, W - s], [L - s, W - s], [L - s, W], [s, W], [s, W - s], [0, W - s], [0, s], [s, s]];
  let b = '';
  [[0, 0], [L - s, 0], [L - s, W - s], [0, W - s]].forEach(([x, y]) => { b += `<rect x="${f(X(x))}" y="${f(Y(y))}" width="${f(s * k)}" height="${f(s * k)}" fill="none" stroke="${C.grey}" stroke-width="0.25" stroke-dasharray="0.6 0.6"/>`; });
  b += poly(out.map(([x, y]) => [X(x), Y(y)]), FILL);
  b += dashed([X(s), Y(s)], [X(L - s), Y(s)]) + dashed([X(L - s), Y(s)], [X(L - s), Y(W - s)]) + dashed([X(L - s), Y(W - s)], [X(s), Y(W - s)]) + dashed([X(s), Y(W - s)], [X(s), Y(s)]);
  const top = dim([X(0), Y(0)], [X(L), Y(0)], [0, -1], 2.2), right = dim([X(L), Y(0)], [X(L), Y(W)], [1, 0], 2.2);
  b += top.svg + T(X(L / 2), top.A[1] - 1, labL) + right.svg + T(right.A[0] + 1.2, Y(W / 2) + 1, labW, { anchor: 'start' });
  b += T(X(0) - 1, Y(s / 2) + 1, labS, { anchor: 'end' });
  return svg(f(L * k + 2 * m), f(W * k + 2 * m), b);
};

// The net of a cylinder: the curved surface as a rectangle (length L, height h) and a circle of radius r on each long
// side, k mm per unit.
const cylNet = ({ L, h, r, k = 0.95, labL = '', labH = '', labR = '' }) => {
  const m = 1, R = r * k, x0 = m, y0 = m + 2 * R, cx = x0 + 0.27 * L * k;
  let b = `<rect x="${f(x0)}" y="${f(y0)}" width="${f(L * k)}" height="${f(h * k)}" fill="${SIDE}" stroke="${INK}" stroke-width="0.45"/>`;
  [[cx, y0 - R], [cx, y0 + h * k + R]].forEach(([x, y]) => { b += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(R)}" fill="${TOP}" stroke="${INK}" stroke-width="0.45"/>` + dot([x, y]); });
  b += seg([cx, y0 - R], [cx + R, y0 - R], { stroke: C.blue, w: 0.4 }) + T(cx + R / 2, y0 - R - 1.2, labR, { weight: 600, fill: C.blue });
  b += T(x0 + 0.68 * L * k, y0 - 1.4, labL) + T(x0 + L * k + 1.4, y0 + (h * k) / 2 + 1, labH, { anchor: 'start' });
  return svg(f(L * k + 2 * m), f(h * k + 4 * R + 2 * m), b);
};

// A pipe lying down (oblique view): outside radius R, inside radius r, length len; k mm per unit.
const pipe = ({ R, r, len, k = 1.5, labD = '', labL = '' }) => {
  const D = [Math.cos(rad(35)) * 0.55 * len * k, -Math.sin(rad(35)) * 0.55 * len * k], Rk = R * k, rk = r * k, m = 1;
  const c = [m + Rk + 6, m + Rk - D[1]], e = [c[0] + D[0], c[1] + D[1]], L = Math.hypot(...D), n = [-D[1] / L, D[0] / L];
  const off = (p, s) => [p[0] + n[0] * Rk * s, p[1] + n[1] * Rk * s];
  let b = `<circle cx="${f(e[0])}" cy="${f(e[1])}" r="${f(Rk)}" fill="${SIDE}" stroke="${INK}" stroke-width="0.45"/>`;
  b += poly([off(c, 1), off(e, 1), off(e, -1), off(c, -1)], SIDE, { w: 0 }).replace('stroke-width="0"', 'stroke="none"');
  b += seg(off(c, 1), off(e, 1), { w: 0.45 }) + seg(off(c, -1), off(e, -1), { w: 0.45 });
  b += `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(Rk)}" fill="${FILL}" stroke="${INK}" stroke-width="0.45"/>`
    + `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(rk)}" fill="${TOP}" stroke="${INK}" stroke-width="0.4"/>`;
  const v = dim([c[0] - Rk, c[1] - Rk], [c[0] - Rk, c[1] + Rk], [-1, 0], 2.5);
  b += v.svg + T(v.A[0] - 1.2, c[1] + 1, labD, { anchor: 'end' });
  const lo = off(c, n[1] > 0 ? 1 : -1), le = off(e, n[1] > 0 ? 1 : -1);
  b += T((lo[0] + le[0]) / 2 + 2.4, (lo[1] + le[1]) / 2 + 3.4, labL, { anchor: 'start' });
  return svg(f(c[0] + D[0] + Rk + m), f(c[1] + Rk + m), b);
};

// A prism (oblique view, as Chapter 10's prism) whose edge labels always sit just outside the front face, with
// extra front-face labels and right-angle marks: labels [[text, x, y, opts]], marks [[corner, towards, towards]] (both
// in face units).
const DEPTH = [Math.cos(rad(35)) * 0.55, -Math.sin(rad(35)) * 0.55];
const prism2 = ({ face, len, sides = [], lenLabel = '', lenAt = 1, size = 30, maxH, right = [], dash = [], labels = [], marks = [], m = 1 }) => {
  const xs = face.map((p) => p[0]), ys = face.map((p) => p[1]);
  const W = Math.max(...xs) - Math.min(...xs) + len * DEPTH[0], Ht = Math.max(...ys) - Math.min(...ys) - len * DEPTH[1];
  const k = Math.min(size / W, (maxH || size * 0.8) / Ht);
  const X0 = m - Math.min(...xs) * k, Y0 = m - len * DEPTH[1] * k + Math.max(...ys) * k;
  const F = ([x, y]) => [X0 + x * k, Y0 - y * k];
  const front = face.map(F), back = front.map((p) => [p[0] + len * DEPTH[0] * k, p[1] + len * DEPTH[1] * k]);
  const n = face.length;
  const signed = front.reduce((s, p, i) => { const q = front[(i + 1) % n]; return s + p[0] * q[1] - q[0] * p[1]; }, 0);
  const outN = (i) => { const a = front[i], c = front[(i + 1) % n], dx = c[0] - a[0], dy = c[1] - a[1], L = Math.hypot(dx, dy); return signed > 0 ? [dy / L, -dx / L] : [-dy / L, dx / L]; };
  const vis = (i) => { const [nx, ny] = outN(i); return nx * DEPTH[0] + ny * DEPTH[1] > 1e-6; };
  let b = '';
  for (let i = 0; i < n; i++) b += seg(back[i], back[(i + 1) % n], { stroke: C.grey, w: 0.3, dash: true }) + seg(front[i], back[i], { stroke: C.grey, w: 0.3, dash: true });
  for (let i = 0; i < n; i++) if (vis(i)) { const j = (i + 1) % n; b += poly([front[i], front[j], back[j], back[i]], outN(i)[1] < -0.5 ? TOP : SIDE); }
  b += poly(front, FILL);
  right.forEach((i) => { b += rightMark(front[i], front[(i + n - 1) % n], front[(i + 1) % n]); });
  marks.forEach(([p, q, r]) => { b += rightMark(F(p), F(q), F(r)); });
  dash.forEach(([p, q, lab, side = 1]) => { const a = F(p), c = F(q); b += dashed(a, c); if (lab) { const dx = c[0] - a[0], dy = c[1] - a[1], L = Math.hypot(dx, dy); b += sideLabel(a, c, lab, [(dy / L) * side, (-dx / L) * side]); } });
  sides.forEach((s, i) => { if (s) b += sideLabel(front[i], front[(i + 1) % n], s, outN(i)); });
  labels.forEach(([s, x, y, o = {}]) => { const p = F([x, y]); b += H(p[0], p[1] + 1, s, o); });
  if (lenLabel) { const a = front[lenAt], c = back[lenAt]; b += T((a[0] + c[0]) / 2 + 1.6, (a[1] + c[1]) / 2 + 2.8, lenLabel, { anchor: 'start' }); }
  return svg(f(W * k + 2 * m), f(Ht * k + 2 * m), b);
};

module.exports = { ...ch10, sectorArc, sCurve, squareQuads, ringPath, segment, cardNet, cylNet, pipe, prism2 };
