// Lesson 10.8 Surface area of a prism (three pages: Easy with the Notes box, Easy drill, then Medium with earlier
// lessons mixed in and three worded problems). See lib/lesson-two.js.
// Textbook 10.07. Every solid is drawn to scale from the same numbers that give its surface area.
// The solids are drawn here (with shapes.js parts), not with shapes.js prism(), cuboid() and triPrism(): those keep a
// 6 mm margin (so in a question box they shrink and their labels get too small) and put an edge's label in the middle
// of its side face. These are drawn at print size (the largest that fits the box, labels and all), put each label beside
// its own edge, clear of every line and every other label, and can shade one face or show a box with no lid.
const { PI, num, u, area } = require('../helpers');
const S = require('../shapes');
const { C, f, T, svg, seg, poly, dot, rightMark, rad, FILL, SHADE, SIDE, TOP } = S.parts;

const DEP = [Math.cos(rad(35)) * 0.55, Math.sin(rad(35)) * 0.55]; // the depth, drawn 35° up to the right at 0.55 scale (y up)
// A label's width in mm: Lexend's own letter widths (em), regular and bold, so a '4 cm' beside an edge clears it
const W400 = { 0: 0.607, 1: 0.5, 2: 0.548, 3: 0.529, 4: 0.62, 5: 0.568, 6: 0.557, 7: 0.542, 8: 0.579, 9: 0.551, ' ': 0.28, '.': 0.228, c: 0.535, m: 0.92, S: 0.624, A: 0.7, '=': 0.566, '?': 0.511, s: 0.479, '²': 0.346 };
const W700 = { 0: 0.675, 1: 0.561, 2: 0.548, 3: 0.591, 4: 0.662, 5: 0.596, 6: 0.579, 7: 0.553, 8: 0.599, 9: 0.577, ' ': 0.28, '.': 0.257, c: 0.545, m: 0.961, S: 0.634, A: 0.694, '=': 0.623, '?': 0.536, s: 0.495, '²': 0.364 };
const LAB = { size: 2.8 }, Q = { size: 3, weight: 700 }; // a given length; the unknown (?)
const textW = (s, o = LAB) => [...String(s)].reduce((t, ch) => t + ((o.weight >= 600 ? W700 : W400)[ch] ?? 0.62), 0) * (o.size || 2.8);
const INSIDE = '#c2cbe6', INSIDE_L = '#a9b5d8'; // the inside of a box with no lid: back wall, left wall

const unit = (v) => { const L = Math.hypot(v[0], v[1]); return [v[0] / L, v[1] / L]; };
const lerp = (a, c, t) => [a[0] + (c[0] - a[0]) * t, a[1] + (c[1] - a[1]) * t];
// Does the segment a-c pass through the box [x0, y0, x1, y1] (grown by pad mm)? Checked at points 0.2 mm apart.
const hits = (bx, a, c, pad = 0.4) => {
  const n = Math.ceil(Math.hypot(c[0] - a[0], c[1] - a[1]) / 0.2);
  for (let i = 0; i <= n; i++) { const p = lerp(a, c, i / n); if (p[0] > bx[0] - pad && p[0] < bx[2] + pad && p[1] > bx[1] - pad && p[1] < bx[3] + pad) return true; }
  return false;
};
const overlap = (b1, b2, pad = 1.1) => b1[0] < b2[2] + pad && b2[0] < b1[2] + pad && b1[1] < b2[3] + pad && b2[1] < b1[3] + pad;
let CROWDED = []; // labels that found no clear place (reported by the build, so they can be fixed)

// A prism: its front face (corners x right, y up, in the question's units) pushed back by len.
//   labs: [[i, text, at, ts, style]] a label for front edge i (corner i to corner i + 1). It goes outside the front face,
//         beside the edge; if every place there touches a line or another label, beyond the back edge of that side
//         face, then inside the front face. at: 'in' tries inside the front face first, 'back' beyond the back edge
//         first. ts: the places along the front edge to try (0 at corner i, 1 at corner i + 1), the middle first.
//   lenLab: [corner, text, side] the length, beside the edge going back from that corner (side 1 below right, −1 above left)
//   right: corners of the front face with a right-angle mark; hidden: dashed hidden edges (default true)
//   dash: [[p, q, text]] a dashed height on the front face from p to q (a right-angle mark at q), labelled beside it
//   vdim: [y0, y1, text] a measurement line up the left of the front face, from height y0 to y1, labelled on its left
//         (a triangle's height, when there is no room for its label inside the triangle)
//   ticks: front edges with an equal-length mark across their middle (the equal sides of an isosceles triangle)
//   shade: 'front', 'top' or 'side' shades that face (the face whose area is asked for)
//   open: the face behind the top edge of a rectangular front face is left off (a box with no lid)
//   ask: the unknown, written beside the solid on its right ('SA = ?'); given: a value written above it ('SA = 54 m²')
//   maxW, maxH: the most room the picture may take, labels and all, in mm; it is drawn as large as fits
const solid = ({ face, len, labs = [], lenLab, right = [], hidden = true, dash = [], vdim, ticks = [], shade = '', open = false, ask = '', given = '', maxW, maxH }) => {
  const n = face.length, signed = face.reduce((s, p, i) => { const q = face[(i + 1) % n]; return s + p[0] * q[1] - q[0] * p[1]; }, 0);
  const outN = (i) => { const a = face[i], b = face[(i + 1) % n], v = unit([b[0] - a[0], b[1] - a[1]]); return signed > 0 ? [v[1], -v[0]] : [-v[1], v[0]]; }; // y up
  const vis = (i) => { const o = outN(i); return o[0] * DEP[0] + o[1] * DEP[1] > 1e-6; };
  const xs = face.flatMap((p) => [p[0], p[0] + len * DEP[0]]), ys = face.flatMap((p) => [p[1], p[1] + len * DEP[1]]);
  const draw = (k, report) => {
    const F = (p) => [(p[0] - Math.min(...xs)) * k, (Math.max(...ys) - p[1]) * k];
    const B = (p) => { const q = F(p); return [q[0] + len * DEP[0] * k, q[1] - len * DEP[1] * k]; };
    const fr = face.map(F), bk = face.map(B);
    const lines = [], boxes = []; // every line drawn and every label placed, to keep the labels clear of them
    const outline = (pts) => pts.forEach((p, i) => lines.push([p, pts[(i + 1) % pts.length]]));
    const line = (a, c, o) => { lines.push([a, c]); return seg(a, c, o); };
    let b = '', seen = null; // seen: with no lid, the back corner whose inside edge shows, and where the edge goes out of sight
    // the side faces that show, the ones further back first (a nearer one may cover part of them), then the front face
    const sides = face.map((p, i) => i).filter(vis).sort((i, j) => {
      const m = (t) => { const a = face[t], c = face[(t + 1) % n]; return (a[0] + c[0]) * DEP[0] + (a[1] + c[1]) * DEP[1]; };
      return m(i) - m(j);
    });
    sides.forEach((i) => {
      const j = (i + 1) % n, up = outN(i)[1] > 0.5, quad = [fr[i], fr[j], bk[j], bk[i]];
      outline(quad);
      if (open && up) {
        // no lid: the opening shows the inside of the back wall and, on the left, the inside of the left wall
        const inner = [bk[j][0], bk[j][1] + len * DEP[1] * k];
        b += poly(quad, INSIDE, { w: 0.01, stroke: INSIDE }) + poly([fr[j], bk[j], inner], INSIDE_L, { w: 0.01, stroke: INSIDE_L });
        b += line(bk[j], inner, { w: 0.3 }) + poly(quad, 'none');
        seen = [j, inner];
      } else b += poly(quad, (shade === 'top' && up) || (shade === 'side' && !up) ? SHADE : up ? TOP : SIDE);
    });
    b += poly(fr, shade === 'front' ? SHADE : FILL);
    outline(fr);
    if (hidden) {
      // the back edges, and the edges going back, that no face in front shows
      const hid = (i) => !vis(i) && !vis((i + n - 1) % n);
      face.forEach((p, i) => {
        const j = (i + 1) % n;
        // with no lid, the inside corner edge shows down to the front's top edge: only the rest of it is hidden
        const from = seen && seen[0] === i ? seen[1] : bk[i], to = seen && seen[0] === j ? seen[1] : bk[j];
        if (!vis(i)) b += line(from, to, { stroke: C.grey, w: 0.3, dash: true });
        if (hid(i)) b += line(fr[i], bk[i], { stroke: C.grey, w: 0.3, dash: true });
      });
    }
    const mark = (p, a, c, s = 1.5) => {
      const ua = unit([a[0] - p[0], a[1] - p[1]]), uc = unit([c[0] - p[0], c[1] - p[1]]), q = [p[0] + (ua[0] + uc[0]) * s, p[1] + (ua[1] + uc[1]) * s];
      lines.push([[p[0] + ua[0] * s, p[1] + ua[1] * s], q], [[p[0] + uc[0] * s, p[1] + uc[1] * s], q]);
      return rightMark(p, a, c, s);
    };
    right.forEach((i) => { b += mark(fr[i], fr[(i + n - 1) % n], fr[(i + 1) % n]); });
    dash.forEach(([p, q]) => { const a = F(p), c = F(q), e = fr.find((r) => Math.abs(r[1] - c[1]) < 1e-6 && Math.abs(r[0] - c[0]) > 0.5) || [c[0] + 1, c[1]];
      b += line(a, c, { stroke: C.grey, w: 0.32, dash: true }) + mark(c, a, e, 1.3); });
    ticks.forEach((i) => { const a = fr[i], c = fr[(i + 1) % n], m = lerp(a, c, 0.5), v = unit([c[0] - a[0], c[1] - a[1]]), nv = [-v[1] * 1, v[0] * 1];
      b += line([m[0] - nv[0], m[1] - nv[1]], [m[0] + nv[0], m[1] + nv[1]], { w: 0.35 }); });
    // a label: the first of the places (a point and the way to push the label off it) that is clear of every line
    // and every label so far (else the first place, and the label is reported)
    const place = (s, places, o = LAB, pad) => {
      const w = textW(s, o), h = (o.size || 2.8) * 0.75;
      const boxOf = ([p, nv]) => {
        const d = 0.9 + (w / 2) * Math.abs(nv[0]) + (h / 2) * Math.abs(nv[1]), cx = p[0] + nv[0] * d, cy = p[1] + nv[1] * d;
        return [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2];
      };
      const clear = (bx) => !lines.some(([a, c]) => hits(bx, a, c)) && !boxes.some((x) => overlap(bx, x, pad));
      const ok = places.find((x) => clear(boxOf(x)));
      if (!ok && report) CROWDED.push(s);
      const bx = boxOf(ok || places[0]);
      boxes.push(bx);
      return T((bx[0] + bx[2]) / 2, (bx[1] + bx[3]) / 2 + h * 0.48, s, o);
    };
    const TS = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8];
    if (vdim) {
      const [y0, y1, s] = vdim, x = Math.min(...fr.map((p) => p[0])) - 2.2, a = [x, F([0, y0])[1]], c = [x, F([0, y1])[1]], g = { stroke: C.grey, w: 0.3 };
      b += line(a, c, g) + line([x - 0.8, a[1]], [x + 0.8, a[1]], g) + line([x - 0.8, c[1]], [x + 0.8, c[1]], g);
      b += place(s, [[[x - 0.3, (a[1] + c[1]) / 2], [-1, 0]]]);
    }
    labs.forEach(([i, s, at, ts = TS, o = LAB]) => {
      const j = (i + 1) % n, nv = outN(i), sn = [nv[0], -nv[1]], inv = [-sn[0], -sn[1]]; // the outward normal on the page (y down)
      const out = [...ts, ...TS].map((t) => [lerp(fr[i], fr[j], t), sn]), back = vis(i) ? TS.map((t) => [lerp(bk[i], bk[j], t), sn]) : [], inside = TS.map((t) => [lerp(fr[i], fr[j], t), inv]);
      b += place(s, at === 'in' ? [...inside, ...out, ...back] : at === 'back' ? [...back, ...out, ...inside] : [...out, ...back, ...inside], o);
    });
    if (lenLab) {
      const [c, s, side = 1] = lenLab, d = unit([DEP[0], -DEP[1]]), dn = [-d[1], d[0]], up = [d[1], -d[0]];
      const at = (nv) => TS.map((t) => [lerp(fr[c], bk[c], t), nv]);
      // (kept well clear of the other labels, so it is not read with the bottom edge's label as one)
      b += place(s, side > 0 ? [...at(dn), ...at(up)] : [...at(up), ...at(dn)], LAB, 2);
    }
    // a dashed height's label: beside the dashed line, inside the front face
    dash.forEach(([p, q, s]) => { if (!s) return; const a = F(p), c = F(q), v = unit([c[0] - a[0], c[1] - a[1]]), nr = [-v[1], v[0]], nl = [v[1], -v[0]];
      b += place(s, [...TS.map((t) => [lerp(a, c, t), nl]), ...TS.map((t) => [lerp(a, c, t), nr])]); });
    // the given value and the unknown: on the right of the solid, from halfway up its right-hand side
    const pts = [...fr, ...bk], xR = Math.max(...pts.map((p) => p[0])), yT = Math.min(...pts.map((p) => p[1])), yB = Math.max(...pts.map((p) => p[1]));
    const rightOf = (gap) => { const mid = (yT + yB) / 2, list = [];
      for (let d = 0; d <= (yB - yT) / 2 + 0.01; d += 0.5) list.push([[xR + gap, mid - d], [1, 0]], [[xR + gap, mid + d], [1, 0]]);
      return list; };
    [[given, LAB], [ask, Q]].forEach(([s, o]) => { if (s) b += place(s, [...rightOf(0.6), ...rightOf(2), ...rightOf(4)], o); });
    return svg(f((Math.max(...xs) - Math.min(...xs)) * k), f((Math.max(...ys) - Math.min(...ys)) * k), b);
  };
  // the largest scale at which the picture, labels and all, fits the box
  const size = (s) => s.match(/viewBox="[^ ]+ [^ ]+ ([^ ]+) ([^"]+)"/).slice(1).map(Number);
  let lo = 0.1, hi = 8;
  for (let t = 0; t < 30; t++) { const mid = (lo + hi) / 2, [W, H] = size(draw(mid)); if (W <= maxW && H <= maxH) lo = mid; else hi = mid; }
  return draw(lo, true);
};

const lab = (v, x) => `${num(v)} ${x}`;
// A rectangular prism l across, w going back, h up (in the question's unit): l under the front, h on its left, w beside
// the bottom edge going back. A cube (cube: true) has its one edge labelled.
const box = (l, w, h, x, o = {}) => solid({ face: [[0, 0], [l, 0], [l, h], [0, h]], len: w, labs: o.cube ? [[0, lab(l, x)]] : [[0, lab(l, x)], [3, lab(h, x)]], lenLab: o.cube ? undefined : [1, lab(w, x)], ...o });
// A triangular prism whose end is a right-angled triangle: legs b (across) and h (up), slope s, length len
const tri = (b, h, s, len, x, o = {}) => solid({ face: [[0, 0], [b, 0], [0, h]], len, labs: [[0, lab(b, x)], [1, lab(s, x)], [2, lab(h, x)]], lenLab: [1, lab(len, x)], right: [0], ...o });
// A triangular prism lying on the long side c of its right-angled end: legs a (on the left) and b (on the right)
const hypTri = (a, b, c, len, x, o = {}) => solid({ face: [[0, 0], [c, 0], [(a * a) / c, (a * b) / c]], len, labs: [[0, lab(c, x)], [1, lab(b, x)], [2, lab(a, x)]], lenLab: [1, lab(len, x)], right: [2], ...o });
// A tent: an isosceles triangle end (base b, height h dashed, two equal sloping sides s, marked equal), length len. The
// height is on a measurement line up the left (no room for its label inside the triangle); the sloping side's label goes
// beyond the back edge of the right-hand sloping face. No hidden edges: they would cross the marks on the small triangle.
const tent = (b, h, len, x, o = {}) => solid({ face: [[0, 0], [b, 0], [b / 2, h]], len, labs: [[0, lab(b, x)], [1, lab(Math.hypot(b / 2, h), x), 'back']], lenLab: [1, lab(len, x)],
  dash: [[[b / 2, h], [b / 2, 0]]], vdim: [0, h, lab(h, x)], ticks: [1, 2], hidden: false, ...o });

// One face: a rectangle l by w (in the question's unit) drawn k mm per unit, l under it, w on its left, 'A = ?' on its right
const vb = (pic) => { const x = /viewBox="[-\d.]+ [-\d.]+ ([\d.]+) ([\d.]+)"/.exec(pic); return [+x[1], +x[2]]; };
const fit = (draw, maxW, maxH) => { let lo = 0.05, hi = 20;
  for (let i = 0; i < 40; i++) { const k = (lo + hi) / 2, [w, h] = vb(draw(k)); if (w <= maxW && h <= maxH) lo = k; else hi = k; }
  return draw(lo); };
const rectFace = (l, w, x, k) => {
  const L = l * k, H = w * k, m = 0.5, x0 = m + textW(lab(w, x)) + 1.2, y0 = m;
  return svg(f(x0 + L + 1.4 + textW('A = ?', Q) + m), f(y0 + H + 4.2), poly([[x0, y0], [x0 + L, y0], [x0 + L, y0 + H], [x0, y0 + H]], FILL)
    + T(x0 + L / 2, y0 + H + 3.6, lab(l, x), LAB) + T(x0 - 1.2, y0 + H / 2 + 1, lab(w, x), { ...LAB, anchor: 'end' })
    + T(x0 + L + 1.4, y0 + H / 2 + 1.1, 'A = ?', { ...Q, anchor: 'start' }));
};
// A circle (Lesson 10.7) of radius R mm with its diameter in blue, labelled above the line (as 10.6's part())
const disc = (R, s) => {
  const c = [R + 1, R + 1];
  return svg(f(2 * R + 2), f(2 * R + 2), `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(R)}" fill="${FILL}" stroke="${C.charcoal}" stroke-width="0.45"/>`
    + seg([c[0] - R, c[1]], [c[0] + R, c[1]], { stroke: C.blue, w: 0.45 }) + dot(c) + T(c[0], c[1] - 1.4, s, LAB));
};

const boxSA = (l, w, h) => 2 * (l * w + l * h + w * h);
const openSA = (l, w, h) => l * w + 2 * l * h + 2 * w * h;
const triSA = (b, h, s, len) => 2 * ((b * h) / 2) + (b + h + s) * len;
const tentSA = (b, h, len) => 2 * ((b * h) / 2) + (b + 2 * Math.hypot(b / 2, h)) * len;
// Working for a cuboid: '2 × (6 × 4 + 6 × 3 + 4 × 3) = 2 × 54 = 108 cm²'
const boxWork = (l, w, h, x) => `2 × (${num(l)} × ${num(w)} + ${num(l)} × ${num(h)} + ${num(w)} × ${num(h)}) = 2 × ${num(l * w + l * h + w * h)} = ${u(boxSA(l, w, h), `${x}²`)}`;

// The room a picture may take, in mm: page 1 (four or three to a row), page 2, the Medium set, the WE DO examples
// (a Medium heading is set on two lines, 'Surface<br>area', or 'Area<br>' with its lesson tag below, so the picture
// beside it can be wider)
const P1 = [29, 19.6], P1W = [33.5, 19.6], P2 = [44, 25.6], MED = [31, 14.6], EX = [34, 20.5], EX2B = [34, 17];
// Formula questions (Formula / Substitute / Answer lines) from [picture, answer, text?, own formula?], with the round's
// formula printed (a string) or left for students to write (true). (As 10.6's formFig.)
const formFig = (list, form) => ({ items: list.map(([fig, , t = '', own]) => ({ t, fig, form: own || form })), ans: list.map((x) => x[1]) });

// Drill questions: [picture, answer, text, own formula]. The given lengths are on the picture; the unknown is marked with a ?.
const faceQ = (l, w, x) => [fit((k) => rectFace(l, w, x, k), ...P1), u(l * w, `${x}²`)];
// the shaded face of a cuboid: front (l × h), top (l × w) or side (w × h)
const FACE = { front: ['A = l × h', (l, w, h) => l * h], top: ['A = l × w', (l, w, h) => l * w], side: ['A = w × h', (l, w, h) => w * h] };
const shadeQ = (l, w, h, x, face) => [box(l, w, h, x, { shade: face, ask: 'A = ?', maxW: P1W[0], maxH: P1W[1] }), u(FACE[face][1](l, w, h), `${x}²`), '', FACE[face][0]];
const cubeQ = (s, x) => [box(s, s, s, x, { cube: true, ask: 'SA = ?', maxW: P2[0], maxH: P2[1] }), u(6 * s * s, `${x}²`)];
const boxQ = (l, w, h, x) => [box(l, w, h, x, { ask: 'SA = ?', maxW: P2[0], maxH: P2[1] }), u(boxSA(l, w, h), `${x}²`)];
const triQ = (b, h, s, len, x) => [tri(b, h, s, len, x, { ask: 'SA = ?', maxW: P2[0], maxH: P2[1] }), u(triSA(b, h, s, len), `${x}²`)];

// The teacher's examples. Example 2's L-shaped end (cm) is 8 cm long. Its outside lengths are labelled outside the solid
// (6 cm across, 5 cm up) and its two 2 cm thicknesses beside the back edges of their faces; students find the inside edges.
const L = [[0, 0], [6, 0], [6, 2], [2, 2], [2, 5], [0, 5]], LLEN = 8;
const edge = (pts, i) => { const p = pts[i], q = pts[(i + 1) % pts.length]; return Math.hypot(q[0] - p[0], q[1] - p[1]); };
const perim = (pts) => pts.reduce((t, p, i) => t + edge(pts, i), 0);
const areaOf = (pts) => Math.abs(pts.reduce((t, p, i) => { const q = pts[(i + 1) % pts.length]; return t + p[0] * q[1] - q[0] * p[1]; }, 0)) / 2;
const lPrism = (pts, len, x, o) => solid({ face: pts, len, labs: [[0, lab(edge(pts, 0), x)], [5, lab(edge(pts, 5), x)], [1, lab(edge(pts, 1), x), 'back'], [4, lab(edge(pts, 4), x), 'back']], lenLab: [1, lab(len, x)], hidden: false, ...o });
// Medium question 9: a smaller L (5 m across, 4 m up, both arms 2 m thick), 6 m long
const L9 = [[0, 0], [5, 0], [5, 2], [2, 2], [2, 4], [0, 4]], L9LEN = 6;
// Medium question 8 (Lesson 10.4): an L-shaped area, 9 m by 7 m with arms 3 m wide. The step (6 m) is labelled, not the
// top edge, so no label sits above the shape and it can be drawn taller.
const COMP = [[0, 0], [9, 0], [9, 3], [3, 3], [3, 7], [0, 7]];
const EX2 = { open: [8, 5, 4], tent: [6, 4, 9], cubeSA: 96 };

// The Notes diagram: a cuboid with its edges l, w and h and its faces named, each face's area in it, and the formula
const notesFig = () => {
  const l = 10, w = 8.5, h = 6, k = 2.05, o = { size: 2.8, weight: 600 }, s = { size: 2.4 }, a = { size: 2.5, weight: 700, fill: C.blue };
  const D = [w * DEP[0] * k, -w * DEP[1] * k], x0 = 3.4, y0 = 1 - D[1];
  const fr = [[x0, y0 + h * k], [x0 + l * k, y0 + h * k], [x0 + l * k, y0], [x0, y0]], bk = fr.map((p) => [p[0] + D[0], p[1] + D[1]]);
  // (the faces are solid, so no hidden edges: they would run through the face names)
  let b = poly([fr[3], fr[2], bk[2], bk[3]], TOP) + poly([fr[1], bk[1], bk[2], fr[2]], SIDE) + poly(fr, FILL);
  const cx = x0 + (l * k) / 2, cy = y0 + (h * k) / 2;
  b += T(cx, cy - 0.9, 'front', s) + T(cx, cy + 3.1, 'lh', a);
  // the top face's name and area side by side in its middle, clear of its slanted ends
  b += T(cx + D[0] / 2 - 0.8, y0 + D[1] / 2 + 0.9, 'top', { ...s, anchor: 'end' }) + T(cx + D[0] / 2 + 0.8, y0 + D[1] / 2 + 0.9, 'lw', { ...a, anchor: 'start' });
  const sx = x0 + l * k + D[0] / 2, sy = cy + D[1] / 2;
  b += T(sx, sy - 0.9, 'side', s) + T(sx, sy + 3.1, 'wh', a);
  b += T(cx, fr[0][1] + 3.6, 'l', o) + T(x0 - 1.2, cy + 1, 'h', { ...o, anchor: 'end' });
  b += T(fr[1][0] + D[0] / 2 + 1.3, fr[1][1] + D[1] / 2 + 2.2, 'w', { ...o, anchor: 'start' });
  b += T(x0 + (l * k + D[0]) / 2, fr[0][1] + 8.6, 'SA = 2(lw + lh + wh)', { size: 2.7, weight: 700, fill: C.blue });
  return svg(f(x0 + l * k + D[0] + 3), f(fr[0][1] + 9.6), b);
};

const lesson = {
  code: '10.8', title: 'Surface area of a prism',
  li: 'find the surface area of a prism by adding the areas of its faces.',
  sc: ['find the area of each face of a prism', 'use SA = 6s² and SA = 2(lw + lh + wh)', 'find the surface area of triangular prisms and open boxes'],
  notes: {
    terms: [['prism', 'the same cross-section all the way along'], ['face', 'a flat surface of a solid'], ['surface area (SA)', 'the total area of all the faces'],
      ['cube', '6 equal square faces'], ['rectangular prism', '3 pairs of equal rectangles'], ['triangular prism', '2 triangles and 3 rectangles'],
      ['no lid', 'an open box: leave out the top']],
    formulas: ['Cube: SA = 6s²', 'Rectangular prism: SA = 2(lw + lh + wh)', 'Triangular prism: SA = bh + (b + h + s)l', 'No lid: SA = lw + 2lh + 2wh', 'Any prism: 2 × end + perimeter × length'],
    steps: ['name the faces', 'area of each face', 'add them up', 'unit² (cm²)'],
    fig: notesFig(),
  },
  easy: {
    ex: { stem: 'Find each area. Surface area (SA) is the total area of all the faces.', parts: [
      { t: 'Shaded face', fig: box(7, 3, 4, 'cm', { shade: 'top', maxW: EX[0], maxH: EX[1] }) }, { t: 'Surface area', fig: box(5, 5, 5, 'm', { cube: true, maxW: EX[0], maxH: EX[1] }) },
      { t: 'Surface area', fig: box(8, 5, 4, 'cm', { maxW: EX[0], maxH: EX[1] }) }, { t: 'Surface area', fig: tri(8, 6, 10, 12, 'cm', { maxW: EX[0], maxH: EX[1] }) }] },
    exAns: [`the top is l by w: A = l × w = 7 × 3 = ${u(7 * 3, 'cm²')}`, `a cube has 6 equal squares: SA = 6s² = 6 × 5² = 6 × 25 = ${u(6 * 5 * 5, 'm²')}`,
      `SA = 2(lw + lh + wh) = ${boxWork(8, 5, 4, 'cm')}`,
      `2 triangles + 3 rectangles: SA = 8 × 6 + (8 + 6 + 10) × 12 = ${num(8 * 6)} + ${num(24 * 12)} = ${u(triSA(8, 6, 10, 12), 'cm²')}`],
    hint: 'Each face is a rectangle: A = l × w · Front: l × h · Top: l × w · Side: w × h · Areas are in square units (cm²).',
    work: true,
    // Small steps: the area of one face (a rectangle), then the face of a cuboid that is shaded (its formula printed on
    // the Formula line). Each question is its diagram: the given lengths on it, the unknown marked with a ?.
    rounds: [
      { text: 'find the area of each face.', cols: 4, ...formFig([faceQ(6, 4, 'cm'), faceQ(4.5, 3, 'm'), faceQ(5, 5, 'cm'), faceQ(7, 5, 'm')], 'A = l × w') },
      { text: 'find the area of the shaded face of each rectangular prism.', cols: 3, ...formFig([shadeQ(6, 3, 4, 'cm', 'front'), shadeQ(8, 5, 3, 'm', 'top'), shadeQ(5, 4, 6, 'cm', 'side')]) },
    ],
  },
  // Page 2: more drill. Cubes, then rectangular prisms (formula printed), then a round choosing the formula, then
  // triangular prisms (formula printed).
  drill: {
    hint: 'Cube: SA = 6s² · Rectangular prism: SA = 2(lw + lh + wh) · Triangular prism: 2 triangles + 3 rectangles',
    rounds: [
      { text: 'find the surface area of each cube.', ...formFig([cubeQ(3, 'cm'), cubeQ(10, 'm'), cubeQ(2.5, 'cm')], 'SA = 6s²') },
      { text: 'find the surface area of each rectangular prism.', ...formFig([boxQ(6, 4, 3, 'cm'), boxQ(10, 5, 2, 'm'), boxQ(7, 3, 5, 'cm')], 'SA = 2(lw + lh + wh)') },
      { text: 'cube or rectangular prism? Write the formula, then find the surface area.', ...formFig([boxQ(12, 5, 4, 'cm'), cubeQ(6, 'm'), boxQ(2.5, 2, 4, 'm')], true) },
      { text: 'find the surface area of each triangular prism: 2 triangles + 3 rectangles.', ...formFig([triQ(4, 3, 5, 10, 'cm'), triQ(12, 5, 13, 8, 'm'), triQ(8, 15, 17, 10, 'cm')], 'SA = bh + (b + h + s)l') },
    ],
  },
  medium: {
    ex: { stem: 'Find each surface area. List the faces first.', parts: [
      { t: 'SA (no lid)', fig: box(...EX2.open, 'cm', { open: true, maxW: EX2B[0], maxH: EX2B[1] }) }, { t: 'Surface area', fig: tent(...EX2.tent, 'cm', { maxW: EX2B[0], maxH: EX2B[1] }) },
      { t: 'Surface area', fig: lPrism(L, LLEN, 'cm', { maxW: EX2B[0], maxH: EX2B[1] }) },
      { t: 'Side length', fig: box(4, 4, 4, 'cm', { cube: true, labs: [[0, 's = ?', undefined, undefined, Q]], given: `SA = ${num(EX2.cubeSA)} cm²`, maxW: EX2B[0], maxH: EX2B[1] }) }] },
    exAns: [`no top: SA = lw + 2lh + 2wh = 8 × 5 + 2 × 8 × 4 + 2 × 5 × 4 = 40 + 64 + 40 = ${u(openSA(...EX2.open), 'cm²')}`,
      `2 triangles + 3 rectangles: SA = 2 × ½ × 6 × 4 + (6 + 5 + 5) × 9 = 24 + 144 = ${u(tentSA(...EX2.tent), 'cm²')}`,
      `inside edges 6 − 2 = 4 and 5 − 2 = 3; end: area 6 × 2 + 2 × 3 = ${num(areaOf(L))}, perimeter 6 + 2 + 4 + 3 + 2 + 5 = ${num(perim(L))}; SA = 2 × ${num(areaOf(L))} + ${num(perim(L))} × ${num(LLEN)} = ${num(2 * areaOf(L))} + ${num(perim(L) * LLEN)} = ${u(2 * areaOf(L) + perim(L) * LLEN, 'cm²')}`,
      `${num(EX2.cubeSA)} = 6s², so s² = ${num(EX2.cubeSA)} ÷ 6 = ${num(EX2.cubeSA / 6)} and s = √${num(EX2.cubeSA / 6)} = ${u(Math.sqrt(EX2.cubeSA / 6), 'cm')}`],
    hint: 'No lid: SA = lw + 2lh + 2wh · Any prism: SA = 2 × end + perimeter of end × length · Cube: s² = SA ÷ 6',
    work: true, set: true,
    // One set: today's skill, building from rectangular prisms to open boxes, other prisms and finding a cube's side,
    // with a question from an earlier lesson (tagged) in each row. Every question is its diagram, with a word or two
    // saying what to find, and Formula / Substitute / Answer lines (form: true).
    rounds: [(() => {
      const ff = ([fig, a], t = 'Surface<br>area', from) => [{ t, fig, form: true, ...(from ? { from } : {}) }, a];
      const M = { maxW: MED[0], maxH: MED[1] };
      const Q9 = [
        ff([box(8, 5, 3.5, 'm', M), u(boxSA(8, 5, 3.5), 'm²')]),
        // the trapezium's height on a measurement line beside it (the dashed height inside is too short for its label)
        ff([S.trap(10, 6, 4, 2, { sides: ['10 cm', '', '6 cm', ''], dims: [[[10, 0], [10, 4], '4 cm', -1]], size: 15, maxH: 5.2 }), u(((10 + 6) / 2) * 4, 'cm²')], 'Area<br>', '10.5'),
        ff([box(6, 4, 3, 'cm', { open: true, ...M }), u(openSA(6, 4, 3), 'cm²')], 'SA<br>(no lid)'),
        ff([tent(12, 8, 6, 'm', M), u(tentSA(12, 8, 6), 'm²')]),
        ff([disc(5.8, '12 cm'), u(area(6), 'cm²', 1)], 'Area<br>', '10.7'),
        ff([hypTri(6, 8, 10, 7, 'm', M), u(triSA(6, 8, 10, 7), 'm²')]),
        ff([box(3, 3, 3, 'm', { cube: true, labs: [[0, 's = ?', undefined, undefined, Q]], given: 'SA = 54 m²', ...M }), u(Math.sqrt(54 / 6), 'm')], 'Side<br>length'),
        ff([S.shape({ pts: COMP, sides: ['9 m', '3 m', '6 m', '', '', '7 m'], right: [0, 1, 4, 5], size: 14, maxH: 8, m: 1 }), u(areaOf(COMP), 'm²')], 'Area<br>', '10.4'),
        ff([lPrism(L9, L9LEN, 'm', M), u(2 * areaOf(L9) + perim(L9) * L9LEN, 'm²')]),
      ];
      return { text: '', items: Q9.map((x) => x[0]), ans: Q9.map((x) => x[1]) };
    })()],
  },
  worded: [
    { q: 'A gift box is 30 cm long, 20 cm wide and 10 cm high. Find the area of paper needed to cover it exactly.',
      a: `SA = ${boxWork(30, 20, 10, 'cm')}` },
    { q: 'A room is 5 m long, 4 m wide and 2.5 m high. 1 L of paint covers 10 m². How many litres paint the four walls and the ceiling?',
      a: `walls 2 × (5 × 2.5 + 4 × 2.5) = ${num(2 * (5 * 2.5 + 4 * 2.5))} m², ceiling 5 × 4 = ${num(5 * 4)} m²; ${num(2 * (5 * 2.5 + 4 * 2.5))} + ${num(20)} = ${num(2 * (5 * 2.5 + 4 * 2.5) + 20)} m²; ${num(2 * (5 * 2.5 + 4 * 2.5) + 20)} ÷ 10 = ${u((2 * (5 * 2.5 + 4 * 2.5) + 20) / 10, 'L')}` },
    { q: 'A tent is a triangular prism 4 m long. Each end is a triangle: base 3 m, height 2 m, sloping sides 2.5 m. Find the area of canvas, including the floor.',
      a: `SA = 2 × ½ × 3 × 2 + (3 + 2.5 + 2.5) × 4 = 6 + 32 = ${u(tentSA(3, 2, 4), 'm²')}` },
  ],
};
if (CROWDED.length) console.warn(`10.8: no clear place for the labels ${CROWDED.map((s) => `'${s}'`).join(', ')}`);
CROWDED = [];
module.exports = lesson;
