// Lesson 10.10 Volumes of prisms and cylinders (three pages: Easy with the Notes box, Easy drill, then Medium with
// earlier lessons mixed in and three worded problems).
// See lib/lesson-two.js. Textbook 10.09. Every cylinder answer is correct to one decimal place, using the calculator's π.
// The solids are drawn here (with shapes.js parts), not with shapes.js prism(), cuboid() and cylinder(): those keep a
// 6 mm margin, so in a question box they shrink and their labels get too small to read. These are drawn at print size:
// each is scaled so that the picture, labels and all, just fills the room it has (maxW by maxH, in mm). Every solid is
// drawn to scale from the same numbers that give its volume, and its cross-section (the end of a prism, the top of a
// cylinder) is shaded. No hidden edges are drawn, so nothing crosses the shaded end or its labels.
const { PI, num, u, area } = require('../helpers');
const { C, f, T, svg, seg, poly, dot, rightMark, rad, SHADE, SIDE, TOP, FILL } = require('../shapes').parts;

const INK = C.charcoal, BLUE = { stroke: C.blue, w: 0.45 }, GREY = { stroke: C.grey, w: 0.3 };
const Q = { size: 3, weight: 700 }; // the unknown: 'V = ?', 'h = ?'
const DEP = [Math.cos(rad(35)) * 0.55, Math.sin(rad(35)) * 0.55]; // the depth, drawn 35° up to the right at 0.55 scale (y up)
const textW = (s, size = 2.8) => String(s).length * size * 0.58; // as shapes.js T measures a label
const unit = (v) => { const L = Math.hypot(v[0], v[1]); return [v[0] / L, v[1] / L]; };
const lerp = (a, c, t) => [a[0] + (c[0] - a[0]) * t, a[1] + (c[1] - a[1]) * t];
// The gap (mm) between the segment a-c and the box [x0, y0, x1, y1] (checked at points 0.1 mm apart), and between two boxes
const segGap = (a, c, bx) => { const n = Math.max(1, Math.ceil(Math.hypot(c[0] - a[0], c[1] - a[1]) / 0.1)); let m = 1e9;
  for (let i = 0; i <= n; i++) { const p = lerp(a, c, i / n); m = Math.min(m, Math.hypot(Math.max(bx[0] - p[0], 0, p[0] - bx[2]), Math.max(bx[1] - p[1], 0, p[1] - bx[3]))); }
  return m; };
const boxGap = (p, q) => Math.hypot(Math.max(0, p[0] - q[2], q[0] - p[2]), Math.max(0, p[1] - q[3], q[1] - p[3]));
// Round corner joins: a sharp (mitred) join where a slanted face meets the front pokes out past its corner
const roundJoins = (body) => `<g stroke-linejoin="round">${body}</g>`;
// The room a picture may take (mm): page 1 (three to a row), page 2 (the drill), WE DO examples, the Medium set
const P1 = { maxW: 34, maxH: 20 }, P2 = { maxW: 44, maxH: 25 }, EX1 = { maxW: 35, maxH: 18 }, EX2 = { maxW: 35, maxH: 16 }, MED = { maxW: 33, maxH: 15 };

// Labels are placed through a recorder that keeps each label's box, so a later label (V = ?) can keep clear of them.
const labels = () => {
  const boxes = [];
  const boxAt = (x, y, s, o = {}) => { const size = o.size || 2.8, w = textW(s, size), a = o.anchor || 'middle', x0 = a === 'start' ? x : a === 'end' ? x - w : x - w / 2;
    return [x0, y - 1.1, x0 + w, y + 1.1]; };
  const put = (x, y, s, o = {}) => { // centred on (x, y) unless anchored
    boxes.push(boxAt(x, y, s, o));
    return T(x, y + 1, s, o);
  };
  // a label centred on the first of the places [x, y] whose box clears every line in segs by lg mm, every label placed
  // so far by bg mm, and the labels in far (boxes) by farG mm (if no place does, the place with the most room)
  const first = (places, s, segs, lg, bg, far = [], farG = bg, o = {}) => {
    const room = ([x, y]) => { const bx = boxAt(x, y, s, o);
      return Math.min(...segs.map(([a, c]) => segGap(a, c, bx) / lg), ...boxes.map((q) => boxGap(bx, q) / (far.includes(q) ? farG : bg))); };
    const p = places.find((q) => room(q) >= 1) || places.reduce((m, q) => (room(q) > room(m) ? q : m));
    return put(p[0], p[1], s, o);
  };
  // a label beside point p, pushed out along the unit normal n so its box clears p by gap, and further out if it would
  // touch a label already placed
  const beside = (p, n, s, gap = 0.9, o = {}) => {
    const w = textW(s, o.size || 2.8); let d = gap + (w / 2) * Math.abs(n[0]) + 1.1 * Math.abs(n[1]);
    const hits = (x, y) => boxes.some(([x0, y0, x1, y1]) => x - w / 2 < x1 + 1 && x + w / 2 > x0 - 1 && y - 1.1 < y1 + 0.4 && y + 1.1 > y0 - 0.4);
    for (let t = 0; t < 40 && hits(p[0] + n[0] * d, p[1] + n[1] * d); t++) d += 0.25;
    return put(p[0] + n[0] * d, p[1] + n[1] * d, s, o);
  };
  return { boxes, put, beside, first };
};
// A measurement line beside the segment a→b (screen points), offset along the unit normal n, with end ticks and its label
const dimLine = (L, a, b, n, s, o = {}) => {
  const g = o.off ?? 2, A = [a[0] + n[0] * g, a[1] + n[1] * g], B = [b[0] + n[0] * g, b[1] + n[1] * g];
  const tick = (p) => seg([p[0] - n[0] * 0.8, p[1] - n[1] * 0.8], [p[0] + n[0] * 0.8, p[1] + n[1] * 0.8], GREY);
  return seg(A, B, GREY) + tick(A) + tick(B) + L.beside([(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], n, s, 1.1, o.q ? Q : {});
};
// The largest scale at which draw(k) (an svg) fits maxW by maxH
const fitSvg = (draw, maxW, maxH) => {
  const size = (s) => s.match(/viewBox="[^ ]+ [^ ]+ ([^ ]+) ([^"]+)"/).slice(1).map(Number);
  let lo = 0.1, hi = 12;
  for (let t = 0; t < 32; t++) { const mid = (lo + hi) / 2, [W, H] = size(draw(mid)); if (W <= maxW && H <= maxH) lo = mid; else hi = mid; }
  return draw(lo);
};
// The unknown (V = ?) or a given value (V = 140 cm³) to the right of a picture, halfway up it: just clear of every line
// in its band, and of every label within 4.5 mm above or below it (a label's whole line of type, not just its letters,
// so the two never touch). If a label (the length, beside the edge going back) would push it further right, it moves up
// or down instead, by the least that clears the label (at most dy mm). segs: the picture's edges [[a, b]].
const rightOf = (L, segs, y, s, o, dy = 0) => {
  const edgeX = (yy) => { let x = -1e9;
    segs.forEach(([a, b]) => { for (let i = 0; i <= 40; i++) { const p = lerp(a, b, i / 40); if (p[1] > yy - 2.2 && p[1] < yy + 2.2) x = Math.max(x, p[0]); } });
    return x; };
  const xAt = (yy) => Math.max(edgeX(yy), ...L.boxes.filter(([, y0, , y1]) => y1 > yy - 3.4 && y0 < yy + 3.4).map((bx) => bx[2]));
  const x0 = edgeX(y);
  let yy = y;
  for (let d = 0.25; xAt(y) > x0 + 1e-9 && d <= dy + 1e-9; d += 0.25) {
    const ok = [y - d, y + d].find((t) => xAt(t) <= x0 + 1e-9);
    if (ok !== undefined) { yy = ok; break; }
  }
  return L.put(xAt(yy) + 1.6, yy, s, { ...o, anchor: 'start' });
};

// A prism: its cross-section face (corners x right, y up, in the question's units) pushed back by len.
//   labs: [[i, text, at, style, t]] a label for face edge i (corner i to corner i + 1): outside the face ('out', the
//         default), or beyond the back edge ('back', for an edge whose side face shows); beside the point t of the way
//         along the edge (default 0.5: its middle)
//   lenLab: [corner, text] the length, beside the edge going back from that corner (below it, to the right)
//   right: corners of the face with a right-angle mark; faceLab: [text, x, y] on the shaded face at (x, y) (units)
//   dash: [[p, q, text]] a dashed height on the face (p at the top), its label beside it on the face, to the right
//   dims: [[p, q, text, side]] a measurement line beside the face (side 1: to the left going p → q)
//   ask: 'V' writes V = ? to the right; given: a value written above the solid ('V = 108 cm³')
const solid = ({ face, len, labs = [], lenLab, right = [], faceLab, dash = [], dims = [], ask = '', given = '', maxW, maxH }) => {
  const n = face.length, signed = face.reduce((s, p, i) => { const q = face[(i + 1) % n]; return s + p[0] * q[1] - q[0] * p[1]; }, 0);
  const outN = (i) => { const a = face[i], b = face[(i + 1) % n], v = unit([b[0] - a[0], b[1] - a[1]]); return signed > 0 ? [v[1], -v[0]] : [-v[1], v[0]]; }; // y up
  const vis = (i) => { const o = outN(i); return o[0] * DEP[0] + o[1] * DEP[1] > 1e-6; };
  const xs = face.flatMap((p) => [p[0], p[0] + len * DEP[0]]), ys = face.flatMap((p) => [p[1], p[1] + len * DEP[1]]);
  return fitSvg((k) => {
    const L = labels();
    const F = (p) => [(p[0] - Math.min(...xs)) * k, (Math.max(...ys) - p[1]) * k];
    const B = (p) => { const q = F(p); return [q[0] + len * DEP[0] * k, q[1] - len * DEP[1] * k]; };
    const fr = face.map(F), bk = face.map(B);
    let b = '';
    // the side faces that show, the ones further back first (a nearer one may cover part of them), then the shaded end
    const sides = face.map((p, i) => i).filter(vis).sort((i, j) => {
      const m = (t) => { const a = face[t], c = face[(t + 1) % n]; return (a[0] + c[0]) * DEP[0] + (a[1] + c[1]) * DEP[1]; };
      return m(i) - m(j);
    });
    // every line drawn (the shaded end, the side faces that show, measurement and dashed lines), for placing the length
    const drawn = fr.map((p, i) => [p, fr[(i + 1) % n]]);
    sides.forEach((i) => { const j = (i + 1) % n; b += poly([fr[i], fr[j], bk[j], bk[i]], outN(i)[1] > 0.5 ? TOP : SIDE); drawn.push([fr[i], bk[i]], [fr[j], bk[j]], [bk[i], bk[j]]); });
    b += poly(fr, SHADE);
    right.forEach((i) => { b += rightMark(fr[i], fr[(i + n - 1) % n], fr[(i + 1) % n], 1.5); });
    dash.forEach(([p, q, s]) => { const a = F(p), c = F(q); b += seg(a, c, { stroke: INK, w: 0.3, dash: true }) + rightMark(c, a, [c[0] + 1, c[1]], 1.2); drawn.push([a, c]);
      if (s) b += L.put(a[0] + 0.9, (a[1] + c[1]) / 2, s, { anchor: 'start' }); });
    const under = []; // the labels under the solid's bottom edge (the length must not run on from them)
    labs.forEach(([i, s, at = 'out', o2 = {}, t = 0.5]) => {
      const j = (i + 1) % n, o = outN(i), sn = [o[0], -o[1]]; // the outward normal on the page (y down)
      const mid = at === 'back' ? lerp(bk[i], bk[j], t) : lerp(fr[i], fr[j], t);
      b += L.beside(mid, sn, s, 1.1, o2);
      if (sn[1] > 0.5) under.push(L.boxes[L.boxes.length - 1]);
    });
    dims.forEach(([p, q, s, side = 1]) => { const a = F(p), c = F(q), v = unit([c[0] - a[0], c[1] - a[1]]), nv = [v[1] * side, -v[0] * side];
      b += dimLine(L, a, c, nv, s); drawn.push([[a[0] + nv[0] * 2, a[1] + nv[1] * 2], [c[0] + nv[0] * 2, c[1] + nv[1] * 2]]); });
    if (lenLab) {
      // the length: beside the far part of the edge going back, out to its right, so it sits higher than the bottom edge's
      // label and well to its right (the two are not read as one measurement). Its box (the letters) clears every line by
      // 1 mm, the bottom edge's label by 2.5 mm and any other label (a step's height beside it) by 2.3 mm, so that their
      // lines of type stay 0.8 mm apart.
      const [c, s] = lenLab, nv = unit([0.9, 0.4]), places = [];
      [0.65, 0.7, 0.6, 0.75, 0.55, 0.8, 0.5, 0.85, 0.9].forEach((t) => { const p = lerp(fr[c], bk[c], t); for (let d = 0; d <= 12; d += 0.1) places.push([p[0] + nv[0] * d, p[1] + nv[1] * d]); });
      b += L.first(places, s, drawn, 1, 2.3, under, 2.5);
    }
    if (faceLab) { const p = F([faceLab[1], faceLab[2]]); b += L.put(p[0], p[1], faceLab[0], { weight: 600 }); }
    const all = [...fr, ...bk], top = Math.min(...all.map((p) => p[1])), bot = Math.max(...all.map((p) => p[1]));
    if (ask) b += rightOf(L, [...fr.map((p, i) => [p, fr[(i + 1) % n]]), ...bk.map((p, i) => [p, bk[(i + 1) % n]]), ...fr.map((p, i) => [p, bk[i]])], (top + bot) / 2, `${ask} = ?`, Q, Math.max(0, (bot - top) / 2 - 1.2));
    // a given value above the solid, starting over its front face, clear of any label already above it
    if (given) b += L.put(fr[0][0], Math.min(top, ...L.boxes.map((x) => x[1])) - 2, given, { anchor: 'start' });
    return svg(f((Math.max(...xs) - Math.min(...xs)) * k), f((Math.max(...ys) - Math.min(...ys)) * k), roundJoins(b));
  }, maxW, maxH);
};

// A cylinder standing up (r, h in the question's units). Its top, the cross-section, is shaded, with the radius (a blue
// line from the centre) or the diameter (show 'd': a blue line across it) labelled above the rim. The height is on a
// measurement line to the left. ask 'V': V = ? to the right.
const cyl = ({ r, h, lab = '', show = 'r', hLab = '', ask = '', maxW, maxH }) => fitSvg((k) => {
  const L = labels(), R = r * k, E = R * 0.32, H = h * k, left = hLab ? 2.6 + textW(hLab) + 1 : 0, cx = left + R, top = (lab ? 4 : 0) + E, bot = top + H;
  let b = `<path d="M${f(cx - R)},${f(top)} L${f(cx - R)},${f(bot)} A${f(R)},${f(E)} 0 0 0 ${f(cx + R)},${f(bot)} L${f(cx + R)},${f(top)}" fill="${SIDE}" stroke="${INK}" stroke-width="0.45"/>`;
  b += `<ellipse cx="${f(cx)}" cy="${f(top)}" rx="${f(R)}" ry="${f(E)}" fill="${SHADE}" stroke="${INK}" stroke-width="0.45"/>`;
  if (lab) {
    b += show === 'd' ? seg([cx - R, top], [cx + R, top], BLUE) + dot([cx, top], 0.45) : seg([cx, top], [cx + R, top], BLUE) + dot([cx, top], 0.45);
    b += L.put(show === 'd' ? cx : cx + R / 2, top - E - 1.6, lab, { size: 2.8 });
  }
  if (hLab) b += dimLine(L, [cx - R, top], [cx - R, bot], [-1, 0], hLab, { off: 1.6 });
  if (ask) b += L.put(cx + R + 1.6, (top + bot) / 2, `${ask} = ?`, { ...Q, anchor: 'start' });
  return svg(f(cx + R), f(bot + E), b);
}, maxW, maxH);

// A half cylinder lying on its flat face: the semicircle end (diameter d, shaded) at the front, pushed back by len.
// The diameter is a blue line along the bottom of the end, labelled below it; the length beside the bottom edge going back.
const halfCyl = ({ d, len, labD, labL, maxW, maxH }) => fitSvg((k) => {
  const L = labels(), R = (d / 2) * k, dx = len * DEP[0] * k, dy = len * DEP[1] * k, c = [R, R + dy], cb = [R + dx, R];
  const at = (o, a) => [o[0] + R * Math.cos(rad(a)), o[1] - R * Math.sin(rad(a))];
  const t = 125; // where the curved surface's outline leaves the end (its tangent runs the way the depth goes)
  let b = `<path d="M${f(at(c, 0)[0])},${f(at(c, 0)[1])} A${f(R)},${f(R)} 0 0 0 ${f(at(c, t)[0])},${f(at(c, t)[1])} L${f(at(cb, t)[0])},${f(at(cb, t)[1])} A${f(R)},${f(R)} 0 0 1 ${f(at(cb, 0)[0])},${f(at(cb, 0)[1])} Z" fill="${SIDE}" stroke="${INK}" stroke-width="0.45"/>`;
  b += `<path d="M${f(at(c, 180)[0])},${f(at(c, 180)[1])} A${f(R)},${f(R)} 0 0 1 ${f(at(c, 0)[0])},${f(at(c, 0)[1])} Z" fill="${SHADE}" stroke="${INK}" stroke-width="0.45"/>`;
  b += seg(at(c, 180), at(c, 0), BLUE) + dot(c, 0.45) + L.put(c[0], c[1] + 2.4, labD);
  const mid = [(at(c, 0)[0] + at(cb, 0)[0]) / 2, (at(c, 0)[1] + at(cb, 0)[1]) / 2], dd = unit([DEP[0], -DEP[1]]);
  b += L.beside(mid, [-dd[1], dd[0]], labL, 0.7);
  return svg(f(2 * R + dx), f(R + dy), roundJoins(b));
}, maxW, maxH);

// A circle with its diameter (blue) labelled above it, as lessons 10.6 and 10.7 draw it (lesson 10.7), R in mm
const circleD = (lab, R) => { const L = labels(), c = [R + 0.5, R + 0.5]; return svg(f(2 * R + 1), f(2 * R + 1),
  `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(R)}" fill="${FILL}" stroke="${INK}" stroke-width="0.45"/>` + seg([c[0] - R, c[1]], [c[0] + R, c[1]], BLUE) + dot(c) + L.put(c[0], c[1] - 2.2, lab)); };

// Area of a polygon from its corners (shoelace)
const areaOf = (pts) => Math.abs(pts.reduce((t, p, i) => { const q = pts[(i + 1) % pts.length]; return t + p[0] * q[1] - q[0] * p[1]; }, 0)) / 2;
const L1 = (v, x) => `${num(v)} ${x}`;
const V = (v, x, dp) => u(v, `${x}³`, dp); // a volume: V(120, 'cm') → '120 cm³'
const cylV = (r, h) => area(r) * h;

// The pictures. box: the room it has (P1, P2, EX1, EX2 or MED); o: more options for solid() (ask, given, dims, ..)
// A cuboid l across, w going back, h up: l under the front, h on its left, w beside the edge going back.
// hAsk: the height is the unknown (h = ? on its left edge, in bold).
const cuboid = (l, w, h, x, box, o = {}) => solid({ face: [[0, 0], [l, 0], [l, h], [0, h]], len: w, labs: [[0, L1(l, x)], o.hAsk ? [3, 'h = ?', 'out', Q] : [3, L1(h, x)]], lenLab: [1, L1(w, x)], ...box, ...o });
// A prism whose end (face) has its area A written on it at the point at, and its length len.
const endPrism = (face, at, len, x, box, o = {}) => solid({ face, len, faceLab: [`A = ${num(areaOf(face))} ${x}²`, ...at], lenLab: [1, L1(len, x)], ...box, ...o });
// A triangular prism with a right-angled end: base b (across), height h (up), length len.
const triPrism = (b, h, len, x, box, o = {}) => solid({ face: [[0, 0], [b, 0], [0, h]], len, right: [0], labs: [[0, L1(b, x)], [2, L1(h, x)]], lenLab: [1, L1(len, x)], ...box, ...o });
const cylinder = (r, h, x, box, o = {}) => cyl({ r, h, lab: L1(o.d ? 2 * r : r, x), show: o.d ? 'd' : 'r', hLab: L1(h, x), ...box, ...o });

// Formula questions (Formula / Substitute / Answer lines) from [picture, answer, text?, formula?], with the round's formula
// printed (a string) or left for students to write (true) (as in 10.6)
const formFig = (list, form) => ({ items: list.map(([fig, , t = '', own]) => ({ t, fig, form: own || form })), ans: list.map((x) => x[1]) });

// Drill questions: [picture, answer]. V = ? on every picture.
const endQ = (face, at, len, x, box) => [endPrism(face, at, len, x, box, { ask: 'V' }), V(areaOf(face) * len, x)];
const cubQ = (l, w, h, x, box) => [cuboid(l, w, h, x, box, { ask: 'V' }), V(l * w * h, x)];
const triQ = (b, h, len, x, box) => [triPrism(b, h, len, x, box, { ask: 'V' }), V(0.5 * b * h * len, x)];
const cylQ = (r, h, x, box, d) => [cylinder(r, h, x, box, { ask: 'V', d }), V(cylV(r, h), x, 1)];

// Cross-sections (corners, in the question's units)
const TRAP1 = [[0, 0], [8, 0], [7, 4], [1, 4]]; // Example 1a: (8 + 6) ÷ 2 × 4 = 28 cm² (wide enough for its A = label)
const LFACE = [[0, 0], [7, 0], [7, 2], [3, 2], [3, 4], [0, 4]]; // Example 2a: 7 × 2 + 3 × 2 = 20 cm²
const R1 = [ // Round 1: the area of the end is given (written at the point after the corners)
  [[[0, 0], [8, 0], [7, 3], [1, 3]], [4, 1.3], 3, 'cm'], // (8 + 6) ÷ 2 × 3 = 21 cm²
  [[[0, 0], [7, 0], [7, 2.5], [3, 2.5], [3, 5], [0, 5]], [3.5, 1.25], 3, 'm'], // 7 × 2.5 + 3 × 2.5 = 25 m²
  // 8 × 2 + ½ × 8 × 3.5 = 30 cm². The roof is steeper than the depth's 35°, so its left face is hidden (a roof just
  // under 35° would show that face as a thin dark sliver).
  [[[0, 0], [8, 0], [8, 2], [4, 5.5], [0, 2]], [4, 1], 3, 'cm'],
];
const TRAP = [[0, 0], [10, 0], [7.5, 4], [2.5, 4]]; // Medium 1: (10 + 5) ÷ 2 × 4 = 30 cm²
const LQ = [[0, 0], [8, 0], [8, 2], [3, 2], [3, 4], [0, 4]]; // Medium 3: 8 × 2 + 3 × 2 = 22 m²
const TANK = { d: 2, h: 1.5 }, tankV = cylV(TANK.d / 2, TANK.h); // Example 2d
const RAIN = { d: 3, h: 2 }, rainV = cylV(RAIN.d / 2, RAIN.h); // worded problem 2

// The Notes diagram: a prism with its cross-section A shaded and its height h (the length between the ends) marked,
// V = Ah beside it; under it a cylinder with r and h, V = πr²h beside it.
const notesFig = () => {
  const L = labels(), k = 2.3, face = [[0, 0], [5, 0], [5, 3], [2.5, 5], [0, 3]], len = 5;
  const F = (p) => [p[0] * k, (5 + len * DEP[1] - p[1]) * k], Bk = (p) => { const q = F(p); return [q[0] + len * DEP[0] * k, q[1] - len * DEP[1] * k]; };
  const fr = face.map(F), bk = face.map(Bk);
  let b = poly([fr[1], fr[2], bk[2], bk[1]], SIDE) + poly([fr[2], fr[3], bk[3], bk[2]], TOP) + poly(fr, SHADE);
  const a = F([2.5, 1.6]);
  b += L.put(a[0], a[1], 'A', { size: 3, weight: 700 });
  // h: a measurement line below the bottom edge going back (every letter on the figure bold, at size 3)
  const d = unit([DEP[0], -DEP[1]]);
  b += dimLine(L, fr[1], bk[1], [-d[1], d[0]], 'h', { off: 1.4, q: true });
  b += L.put(bk[2][0] + 2, (bk[2][1] + bk[1][1]) / 2, 'V = Ah', { size: 3, weight: 700, anchor: 'start' });
  // the cylinder, below: its top (the cross-section) shaded, r on the top, h on the left (the figure at most 34 mm tall)
  const R = 5.5, E = 1.8, cx = 4.4 + R, top = 23.5, bot = top + 7.5;
  b += `<path d="M${f(cx - R)},${f(top)} L${f(cx - R)},${f(bot)} A${R},${E} 0 0 0 ${f(cx + R)},${f(bot)} L${f(cx + R)},${f(top)}" fill="${SIDE}" stroke="${INK}" stroke-width="0.45"/>`;
  b += `<ellipse cx="${f(cx)}" cy="${f(top)}" rx="${R}" ry="${E}" fill="${SHADE}" stroke="${INK}" stroke-width="0.45"/>`;
  b += seg([cx, top], [cx + R, top], BLUE) + dot([cx, top], 0.45) + L.put(cx + R / 2, top - E - 1.4, 'r', { size: 3, weight: 700 });
  b += dimLine(L, [cx - R, top], [cx - R, bot], [-1, 0], 'h', { off: 1.4, q: true });
  b += L.put(cx + R + 2, (top + bot) / 2, 'V = πr²h', { size: 3, weight: 700, anchor: 'start' });
  return svg(34, f(bot + E), roundJoins(b));
};

module.exports = {
  code: '10.10', title: 'Volumes of prisms and cylinders',
  li: 'find the volume of a prism or a cylinder (V = Ah), and its capacity.',
  sc: ['use V = Ah to find the volume of any prism', 'use V = πr²h to find the volume of a cylinder', 'change between cm³, mL, L and m³'],
  notes: {
    terms: [['volume (V)', 'the space inside a solid, in cubic units'], ['prism', 'the same cross-section all along'],
      ['cross-section (A)', 'the end of the prism (shaded)'], ['height of the prism (h)', 'the distance between the two ends'],
      ['cylinder', 'a solid whose cross-section is a circle'], ['capacity', 'how much a container holds (mL, L)']],
    // h in V = Ah is the prism's height; in the triangular prism's formula b and h belong to the triangle, so say so
    formulas: ['V = Ah', 'Cuboid: V = lwh', 'Triangular prism: V = ½bh × l <span style="font-weight:400">(b, h: the triangle; l: the length)</span>', 'Cylinder: V = πr²h', '1 cm³ = 1 mL · 1 m³ = 1000 L'],
    steps: ['find A, the end', 'write the formula', 'substitute (π key)', 'answer in cm³ or m³'],
    fig: notesFig(),
  },
  easy: {
    ex: { stem: 'Find the volume of each solid. Give the cylinder correct to one decimal place.', parts: [
      { t: 'Prism', fig: endPrism(TRAP1, [4, 1.5], 4, 'cm', EX1) }, { t: 'Cuboid', fig: cuboid(8, 5, 4, 'cm', EX1) },
      { t: 'Triangular prism', fig: triPrism(6, 4, 7, 'm', EX1) }, { t: 'Cylinder', fig: cylinder(3, 8, 'cm', EX1) }] },
    exAns: [`V = Ah = ${num(areaOf(TRAP1))} × 4 = ${V(areaOf(TRAP1) * 4, 'cm')}`, `V = lwh = 8 × 5 × 4 = ${V(8 * 5 * 4, 'cm')}`,
      `V = ½bh × l = ½ × 6 × 4 × 7 = ${V(0.5 * 6 * 4 * 7, 'm')}`, `V = πr²h = π × 3² × 8 = ${V(cylV(3, 8), 'cm', 1)}`],
    hint: 'V = Ah: A is the area of the shaded end, h the distance between the ends · Cuboid: V = lwh · Units: cm³, m³',
    work: true,
    // Small steps: V = Ah with A given, then cuboids (the formula printed on the Formula line). Each question is its
    // diagram: the given lengths on it, V = ? beside it. The round heading says what to find.
    rounds: [
      { text: 'find the volume. The area of the shaded end is given.', cols: 3, ...formFig(R1.map(([face, at, len, x]) => endQ(face, at, len, x, P1)), 'V = Ah') },
      { text: 'find the volume of each cuboid.', cols: 3, ...formFig([cubQ(5, 3, 4, 'cm', P1), cubQ(4, 2, 6, 'm', P1), cubQ(4, 2.5, 3, 'm', P1)], 'V = lwh') },
    ],
  },
  // Page 2: more drill. Triangular prisms, then choose the formula, then cylinders (the radius given, then the diameter).
  drill: {
    hint: 'Triangular prism: V = ½bh × l (b, h: the triangle; l: the length) · Cylinder: V = πr²h · r = d ÷ 2 · Use the π key, then round to one decimal place.',
    rounds: [
      { text: 'find the volume of each triangular prism.', ...formFig([triQ(6, 4, 5, 'cm', P2), triQ(8, 3, 10, 'm', P2), triQ(5, 4, 9, 'cm', P2)], 'V = ½bh × l') },
      { text: 'which solid is it? Write its formula, then find the volume.', ...formFig([cubQ(7, 3, 2, 'cm', P2), triQ(10, 6, 4, 'm', P2),
        endQ([[0, 0], [6, 0], [4.5, 4], [1.5, 4]], [3, 1.6], 3, 'cm', P2)], true) },
      { text: 'find the volume of each cylinder. The radius is given.', ...formFig([cylQ(2, 5, 'cm', P2), cylQ(5, 3, 'm', P2), cylQ(1.5, 4, 'cm', P2)], 'V = πr²h') },
      { text: 'find the volume. The diameter is given: halve it first.', ...formFig([cylQ(3, 10, 'cm', P2, true), cylQ(5, 4, 'm', P2, true), cylQ(2, 7, 'cm', P2, true)], 'V = πr²h') },
    ],
  },
  medium: {
    // The rounding for the whole page: every π answer (and only those) is correct to one decimal place, as in the key
    ex: { stem: 'Round π answers to one decimal place. 1 cm³ = 1 mL, 1000 cm³ = 1 L, 1 m³ = 1000 L.', parts: [
      { t: 'Volume', fig: solid({ face: LFACE, len: 4, labs: [[0, '7 cm'], [1, '2 cm', 'back', {}, 0.8], [4, '3 cm', 'back'], [5, '4 cm']], lenLab: [1, '4 cm'], ...EX2 }) },
      { t: 'Capacity in L', fig: cuboid(50, 30, 40, 'cm', EX2) },
      { t: 'Height', fig: cuboid(8, 3, 4, 'cm', EX2, { hAsk: true, given: `V = ${V(96, 'cm')}` }) },
      { t: 'Capacity in L', fig: cylinder(TANK.d / 2, TANK.h, 'm', EX2, { d: true }) }] },
    exAns: [`A = 7 × 2 + 3 × 2 = ${num(areaOf(LFACE))} cm²; V = Ah = ${num(areaOf(LFACE))} × 4 = ${V(areaOf(LFACE) * 4, 'cm')}`,
      `V = lwh = 50 × 30 × 40 = ${V(50 * 30 * 40, 'cm')} = ${u(50 * 30 * 40 / 1000, 'L')}`,
      `V = lwh: 96 = 8 × 3 × h = 24h, so h = 96 ÷ 24 = ${u(96 / 24, 'cm')}`,
      `r = 1 m; V = πr²h = π × 1² × 1.5 = ${num(tankV, 3)}… m³ = ${u(tankV * 1000, 'L', 1)}`],
    // (a cuboid's height: l × w, not the shaded front face, which has h in it)
    hint: 'Find A, the end, first · L-shape: two rectangles · Trapezium: A = ½(a + b)h · Height: h = V ÷ (l × w)',
    work: true, set: true,
    // One set: today's skill, building from composite prisms to capacity and a missing height, with a question from an
    // earlier lesson (tagged) in each row. Every question is its diagram, with a word or two saying what to find.
    rounds: [(() => {
      const ff = (fig, a, t, from) => [{ t, fig, form: true, ...(from ? { from } : {}) }, a];
      const Q = [
        ff(solid({ face: TRAP, len: 4, labs: [[0, '10 cm'], [2, '5 cm', 'back']], dash: [[[2.5, 4], [2.5, 0]]], dims: [[[0, 0], [0, 4], '4 cm', 1]], lenLab: [1, '4 cm'], ...MED }),
          `A = ½ × (10 + 5) × 4 = ${num(areaOf(TRAP))} cm²; V = ${num(areaOf(TRAP))} × 4 = ${V(areaOf(TRAP) * 4, 'cm')}`, 'Volume'),
        ff(circleD('10 m', 6.5), `r = 5 m; A = π × 5² = ${u(area(5), 'm²', 1)}`, 'Area', '10.7'),
        ff(solid({ face: LQ, len: 3, labs: [[0, '8 m'], [1, '2 m', 'back', {}, 0.8], [4, '3 m', 'back'], [5, '4 m']], lenLab: [1, '3 m'], ...MED }),
          `A = 8 × 2 + 3 × 2 = ${num(areaOf(LQ))} m²; V = ${num(areaOf(LQ))} × 3 = ${V(areaOf(LQ) * 3, 'm')}`, 'Volume'),
        ff(cuboid(40, 25, 30, 'cm', { ...MED, maxW: 31.5 }), `V = 40 × 25 × 30 = ${V(40 * 25 * 30, 'cm')} = ${u(40 * 25 * 30 / 1000, 'L')}`, 'Capacity<br>in L'),
        ff(cuboid(5, 4, 3, 'm', MED), `SA = 2 × (5 × 4 + 5 × 3 + 4 × 3) = ${u(2 * (5 * 4 + 5 * 3 + 4 * 3), 'm²')}`, 'Surface<br>area', '10.8'),
        ff(cuboid(9, 4, 3, 'cm', MED, { hAsk: true, given: `V = ${V(108, 'cm')}` }), `108 = 9 × 4 × h = 36h, so h = 108 ÷ 36 = ${u(108 / 36, 'cm')}`, 'Height'),
        ff(cylinder(5, 8, 'cm', MED, { d: true }), `r = 5 cm; V = π × 5² × 8 = ${V(cylV(5, 8), 'cm', 1)} = ${u(cylV(5, 8), 'mL', 1)}`, 'Capacity<br>in mL'),
        ff(cylinder(3, 4, 'm', MED), `SA = 2 × π × 3² + 2 × π × 3 × 4 = ${u(2 * area(3) + 2 * PI * 3 * 4, 'm²', 1)}`, 'Surface<br>area', '10.9'),
        ff(halfCyl({ d: 6, len: 10, labD: '6 m', labL: '10 m', ...MED }), `V = ½ × π × 3² × 10 = ${V(0.5 * cylV(3, 10), 'm', 1)}`, 'Volume'),
      ];
      return { text: '', items: Q.map((x) => x[0]), ans: Q.map((x) => x[1]) };
    })()],
  },
  worded: [
    { q: 'A tent is a triangular prism. Its triangular end has a base of 2.4 m and a height of 1.5 m, and the tent is 3 m long. Find the volume of air inside the tent.',
      a: `V = ½bh × l = ½ × 2.4 × 1.5 × 3 = ${V(0.5 * 2.4 * 1.5 * 3, 'm')}` },
    { q: `A cylindrical rainwater tank has a diameter of ${RAIN.d} m and a height of ${RAIN.h} m. How many litres does it hold, to the nearest litre?`,
      a: `r = 1.5 m; V = πr²h = π × 1.5² × 2 = ${num(rainV, 3)}… m³ = ${u(Math.round(rainV * 1000), 'L')}` },
    { q: 'A pool is 25 m long and 10 m wide. It holds 375 000 L of water. How deep is the water?',
      a: `375 000 L = ${V(375000 / 1000, 'm')}; h = 375 ÷ (25 × 10) = ${u(375 / (25 * 10), 'm')}` },
  ],
};
