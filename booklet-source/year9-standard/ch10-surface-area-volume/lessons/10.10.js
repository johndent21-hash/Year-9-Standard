// Lesson 10.10 Volumes of prisms and cylinders (two pages: Easy, then Medium, then Mixed practice). See lib/lesson-two.js.
// Textbook 10.09. Every solid is drawn to scale from the same numbers that give its volume, and every cylinder answer is
// correct to one decimal place (unless the question says otherwise), using the calculator's π.
// The solids are drawn here (with shapes.js parts) as in 10.8 and 10.9, not with shapes.js prism(), cuboid() and
// cylinder(): those keep a 6 mm margin, so in a quarter-width cell they shrink and their labels get too small to read.
// These fill the cell (maxW, maxH: the most room a picture may take, in mm). A prism's end can carry its area
// ('A = 20 cm²', drawn from the same corners that give the area) and a dashed height; those prisms are drawn with
// no hidden edges, so nothing crosses the label and the dashed height is the only dashed line on the end.
// Labels on the sloping side of a triangle and on the right-hand side of an L go beyond the back edge (as in 10.8).
const { PI, num, u, conv, area, round, problems, mix } = require('../helpers');
const { C, f, T, svg, seg, poly, dot, rightMark, rad, FILL, SIDE, TOP } = require('../shapes').parts;

const INK = C.charcoal, BLUE = { stroke: C.blue, w: 0.45 }, GREY = { stroke: C.grey, w: 0.3 }, LID = '#d5ddf2';
const DEP = [Math.cos(rad(35)) * 0.55, Math.sin(rad(35)) * 0.55]; // the depth, drawn 35° up to the right at 0.55 scale (y up)
const textW = (s, size = 2.8) => String(s).length * size * 0.58; // as shapes.js T measures a label
const BOX = { maxW: 33, maxH: 24 }; // a picture in a YOU DO round
const EXBOX = { maxW: 34, maxH: 21 }; // a picture in a WE DO example

// A label centred at (x, y + 1) (as T places it). bg: a patch of that colour behind the text, so a dashed hidden edge
// that runs behind the label stops at it instead of striking through the text.
const tag = (x, y, s, bg, o = {}) => {
  const w = textW(s, o.size || 2.8);
  return (bg ? `<rect x="${f(x - w / 2 - 0.3)}" y="${f(y - 1.2)}" width="${f(w + 0.6)}" height="${f(2.7)}" fill="${bg}"/>` : '') + T(x, y + 1, s, o);
};
// A label of width w (the text) centred at c = p + n × (gap + half the label's reach along n): clear of the line at p.
const labelAt = (p, n, s, gap = 0.9, bg) => {
  const w = textW(s), h = 2.1, d = gap + (w / 2) * Math.abs(n[0]) + (h / 2) * Math.abs(n[1]);
  return tag(p[0] + n[0] * d, p[1] + n[1] * d, s, bg);
};
const unit = (v) => { const L = Math.hypot(v[0], v[1]); return [v[0] / L, v[1] / L]; };

// A prism: its front face (corners x right, y up, in the question's units) pushed back by len.
//   labs: [[i, text, at]] a label for front edge i (corner i to corner i + 1): outside the front face (at 'out', the
//         default: on the side face when that face shows), inside the front face ('in'), or beyond the back edge ('back')
//   lenLab: [corner, text, side] the length, beside the edge going back from that corner (side 1 below right, −1 above left)
//   right: corners of the front face with a right-angle mark; hidden: dashed hidden edges (default true)
//   faceLab: [text, x, y] the area of the end, in blue on the front face at (x, y) (the question's units)
//   dash: [[p, q, text, side]] a dashed line on the front face (a height) with its label beside it (side 1: to the right)
const solid = ({ face, len, labs = [], lenLab, right = [], hidden = true, faceLab, dash = [], maxW, maxH }) => {
  const n = face.length, signed = face.reduce((s, p, i) => { const q = face[(i + 1) % n]; return s + p[0] * q[1] - q[0] * p[1]; }, 0);
  const outN = (i) => { const a = face[i], b = face[(i + 1) % n], v = unit([b[0] - a[0], b[1] - a[1]]); return signed > 0 ? [v[1], -v[0]] : [-v[1], v[0]]; }; // y up
  const vis = (i) => { const o = outN(i); return o[0] * DEP[0] + o[1] * DEP[1] > 1e-6; };
  const xs = face.flatMap((p) => [p[0], p[0] + len * DEP[0]]), ys = face.flatMap((p) => [p[1], p[1] + len * DEP[1]]);
  const draw = (k) => {
    const F = (p) => [(p[0] - Math.min(...xs)) * k, (Math.max(...ys) - p[1]) * k];
    const B = (p) => { const q = F(p); return [q[0] + len * DEP[0] * k, q[1] - len * DEP[1] * k]; };
    const fr = face.map(F), bk = face.map(B);
    let b = '';
    // the side faces that show, the ones further back first (a nearer one may cover part of them), then the front face
    const sides = face.map((p, i) => i).filter(vis).sort((i, j) => {
      const m = (t) => { const a = face[t], c = face[(t + 1) % n]; return (a[0] + c[0]) * DEP[0] + (a[1] + c[1]) * DEP[1]; };
      return m(i) - m(j);
    });
    sides.forEach((i) => { const j = (i + 1) % n; b += poly([fr[i], fr[j], bk[j], bk[i]], outN(i)[1] > 0.5 ? TOP : SIDE); });
    b += poly(fr, FILL);
    if (hidden) {
      // the back edges and the edges going back that no face in front shows
      const hid = (i) => !vis(i) && !vis((i + n - 1) % n);
      face.forEach((p, i) => { const j = (i + 1) % n; if (!vis(i)) b += seg(bk[i], bk[j], { stroke: C.grey, w: 0.3, dash: true }); if (hid(i)) b += seg(fr[i], bk[i], { stroke: C.grey, w: 0.3, dash: true }); });
    }
    right.forEach((i) => { b += rightMark(fr[i], fr[(i + n - 1) % n], fr[(i + 1) % n], 1.5); });
    dash.forEach(([p, q, s, side = 1]) => {
      const a = F(p), c = F(q);
      b += seg(a, c, { stroke: C.grey, w: 0.32, dash: true }) + rightMark(c, a, [c[0] + side, c[1]], 1.3);
      if (s) b += labelAt([(a[0] + c[0]) / 2, (a[1] + c[1]) / 2], [side, 0], s, 0.9, hidden ? FILL : '');
    });
    labs.forEach(([i, s, at = 'out']) => {
      const j = (i + 1) % n, o = outN(i), sn = [o[0], -o[1]]; // the outward normal on the page (y down)
      const mid = at === 'back' ? [(bk[i][0] + bk[j][0]) / 2, (bk[i][1] + bk[j][1]) / 2] : [(fr[i][0] + fr[j][0]) / 2, (fr[i][1] + fr[j][1]) / 2];
      // the patch behind it: the front face (inside), the side face it sits on (out, when that face shows), or none
      const bg = at === 'in' ? FILL : at === 'out' && vis(i) ? (o[1] > 0.5 ? TOP : SIDE) : '';
      b += labelAt(mid, at === 'in' ? [-sn[0], -sn[1]] : sn, s, 0.9, bg);
    });
    if (lenLab) {
      const [c, s, side = 1] = lenLab, mid = [(fr[c][0] + bk[c][0]) / 2, (fr[c][1] + bk[c][1]) / 2], d = unit([DEP[0], -DEP[1]]);
      b += labelAt(mid, side > 0 ? [-d[1], d[0]] : [d[1], -d[0]], s);
    }
    if (faceLab) { const p = F([faceLab[1], faceLab[2]]); b += tag(p[0], p[1], faceLab[0], hidden ? FILL : '', { size: 2.8, fill: C.blue, weight: 600 }); }
    return svg(f((Math.max(...xs) - Math.min(...xs)) * k), f((Math.max(...ys) - Math.min(...ys)) * k), b);
  };
  // the largest scale at which the picture, labels and all, fits the box
  const size = (s) => s.match(/viewBox="[^ ]+ [^ ]+ ([^ ]+) ([^"]+)"/).slice(1).map(Number);
  let lo = 0.1, hi = 8;
  for (let t = 0; t < 30; t++) { const mid = (lo + hi) / 2, [W, H] = size(draw(mid)); if (W <= maxW && H <= maxH) lo = mid; else hi = mid; }
  return draw(lo);
};

// A measurement line beside a vertical edge from y0 to y1 at x, with its label to the right.
const hDim = (x, y0, y1, lab) => seg([x, y0], [x, y1], GREY) + seg([x - 0.7, y0], [x + 0.7, y0], GREY) + seg([x - 0.7, y1], [x + 0.7, y1], GREY)
  + T(x + 1.2, (y0 + y1) / 2 + 1, lab, { anchor: 'start' });
// A cylinder standing up, r and h in the question's units (as in 10.9). lab is the radius (a blue radius on the top)
// or, with show 'd', the diameter (a blue line across the top), above the top rim; hLab is the height, on a
// measurement line to the right.
const cyl = ({ r, h, lab = '', show = 'r', hLab = '', maxW, maxH }) => {
  const m = 1, up = lab ? 4.2 : 0, right = hLab ? 2.6 + textW(hLab) : 0, e = 0.32;
  const k = Math.min((maxW - 2 * m - right) / (2 * r), (maxH - 2 * m - up) / (h + 2 * e * r));
  const R = r * k, E = e * R, cx = m + R, top = m + up + E, bot = top + h * k;
  let b = `<path d="M${f(cx - R)},${f(top)} L${f(cx - R)},${f(bot)} A${f(R)},${f(E)} 0 0 0 ${f(cx + R)},${f(bot)} L${f(cx + R)},${f(top)}" fill="${SIDE}" stroke="${INK}" stroke-width="0.45"/>`;
  b += `<path d="M${f(cx - R)},${f(bot)} A${f(R)},${f(E)} 0 0 1 ${f(cx + R)},${f(bot)}" fill="none" stroke="${C.grey}" stroke-width="0.3" stroke-dasharray="1.2 0.9"/>`;
  b += `<ellipse cx="${f(cx)}" cy="${f(top)}" rx="${f(R)}" ry="${f(E)}" fill="${LID}" stroke="${INK}" stroke-width="0.45"/>`;
  if (lab) {
    b += show === 'd' ? seg([cx - R, top], [cx + R, top], BLUE) : seg([cx, top], [cx + R, top], BLUE) + dot([cx, top], 0.45);
    b += T(show === 'd' ? cx : cx + R / 2, top - E - 0.9, lab, { size: 3 });
  }
  if (hLab) b += hDim(cx + R + 1.4, top, bot, hLab);
  return svg(f(2 * R + 2 * m + right), f(bot + E + m), b);
};

// Area of a polygon from its corners (shoelace)
const areaOf = (pts) => Math.abs(pts.reduce((t, p, i) => { const q = pts[(i + 1) % pts.length]; return t + p[0] * q[1] - q[0] * p[1]; }, 0)) / 2;
const L = (v, x) => `${num(v)} ${x}`;
// A volume (cubic units); a cylinder's correct to one decimal place. A no-break space after the thousands, so
// 1 005.3 never splits across two lines.
const keepN = (s) => s.replace(/(\d) (?=\d{3}\b)/g, '$1\u00a0');
const V = (v, x, dp) => keepN(u(v, `${x}³`, dp));
const cylV = (r, h) => area(r) * h;

// A rectangular prism l across, w going back, h up (in the question's unit), labelled on the front and the length.
const box = (l, w, h, x, o = {}) => solid({ face: [[0, 0], [l, 0], [l, h], [0, h]], len: w, labs: [[0, L(l, x)], [3, L(h, x)]], lenLab: [1, L(w, x)], ...o });
// A prism whose end is the polygon face, with its area A on the end (at the point at) and its length.
const endQ = (face, at, len, x, box0 = BOX) => {
  const A = areaOf(face);
  return [{ t: '', fig: solid({ face, len, faceLab: [`A = ${num(A)} ${x}²`, ...at], lenLab: [1, L(len, x)], hidden: false, ...box0 }) }, V(A * len, x)];
};
// A triangular prism with a right-angled end: legs b (across) and h (up), slope s (or no label), length len
const tri = (b, h, s, len, x, o = {}) => solid({ face: [[0, 0], [b, 0], [0, h]], len, right: [0],
  labs: [[0, L(b, x)], [2, L(h, x)], ...(s ? [[1, L(s, x), 'back']] : [])], lenLab: [1, L(len, x)], ...o });
const cylQ = (r, h, x, { d = false, box: box0 = BOX } = {}) => [{ t: '', fig: cyl({ r, h, lab: L(d ? 2 * r : r, x), show: d ? 'd' : 'r', hLab: L(h, x), ...box0 }) }, V(cylV(r, h), x, 1)];
const figRound = (text, list) => ({ text, items: list.map((q) => q[0]), ans: list.map((q) => q[1]), cols: 4 });
// Text questions: keep each measurement on one line ('r = 2 cm', '1.5 m')
const keep = (s) => s.replace(/ = /g, '\u00a0=\u00a0').replace(/(\d) (?=(mm|cm|m|L|mL)\b)/g, '$1\u00a0');

// The teacher's examples
const TRAP20 = [[0, 0], [6, 0], [5, 4], [1, 4]]; // a trapezium end: (6 + 4) ÷ 2 × 4 = 20 cm²
const LFACE = [[0, 0], [6, 0], [6, 2], [2, 2], [2, 5], [0, 5]]; // 6 × 2 + 2 × 3 = 18 cm²
const TANK = { d: 3, h: 2 }, POOL = { l: 25, w: 10, h: 1.5 };
const tankV = cylV(TANK.d / 2, TANK.h), poolV = POOL.l * POOL.w * POOL.h;
const TRAP = [[0, 0], [10, 0], [7.5, 4], [2.5, 4]]; // Medium question 4: (10 + 5) ÷ 2 × 4 = 30 cm²
const LQ = [[0, 0], [7, 0], [7, 2], [3, 2], [3, 6], [0, 6]]; // Medium question 2: 7 × 2 + 3 × 4 = 26 cm²

module.exports = {
  code: '10.10', title: 'Volumes of prisms and cylinders',
  li: 'find the volume of a prism or a cylinder (V = Ah), and its capacity.',
  sc: ['use V = Ah to find the volume of any prism', 'use V = πr²h to find the volume of a cylinder', 'change between cm³, mL, L and m³'],
  easy: {
    ex: { stem: 'Find each volume: V = Ah. The cylinder: correct to one decimal place.', parts: [
      { t: 'Rectangular prism', fig: box(8, 5, 4, 'cm', EXBOX) }, { t: 'Cube', fig: box(5, 5, 5, 'm', EXBOX) },
      { t: 'A = area of the end', fig: endQ(TRAP20, [3, 1], 6, 'cm', EXBOX)[0].fig },
      { t: 'Cylinder', fig: cylQ(3, 8, 'cm', { box: EXBOX })[0].fig }] },
    exAns: [`V = l × w × h = 8 × 5 × 4 = ${V(8 * 5 * 4, 'cm')}`, `V = 5 × 5 × 5 = 5³ = ${V(125, 'm')}`, `V = Ah = ${num(areaOf(TRAP20))} × 6 = ${V(areaOf(TRAP20) * 6, 'cm')}`,
      `V = πr²h = π × 3² × 8 = ${V(cylV(3, 8), 'cm', 1)}`],
    hint: 'Any prism: V = Ah (A = area of the end) · Box: V = l × w × h · Cube: V = s³ · Cylinder: V = πr²h',
    rounds: [
      round('find the volume of each rectangular prism or cube.', [[6, 4, 3, 'cm'], [10, 5, 2, 'm'], [3, 'cm'], [8, 5, 5, 'mm'], [12, 10, 4, 'cm'], [6, 'm'], [2.5, 4, 3, 'm'], [10, 'cm']],
        (q) => keep(q.length === 2 ? `cube, side ${L(q[0], q[1])}` : `${L(q[0], q[3])} × ${L(q[1], q[3])} × ${L(q[2], q[3])}`),
        (q) => (q.length === 2 ? V(q[0] ** 3, q[1]) : V(q[0] * q[1] * q[2], q[3]))),
      figRound('A is the area of the end. Find the volume of each prism.', [
        endQ([[0, 0], [6, 0], [5, 3], [1, 3]], [3, 1.2], 7, 'cm'), endQ([[0, 0], [6, 0], [6, 2], [3, 2], [3, 5], [0, 5]], [3, 1], 3, 'm'),
        endQ([[0, 0], [6, 0], [6, 3], [3, 5], [0, 3]], [3, 1.6], 4, 'cm'), endQ([[1, 0], [7, 0], [8, 2], [7, 4], [1, 4], [0, 2]], [4, 2], 5, 'm')]),
      figRound('find the volume of each cylinder, correct to one decimal place.', [cylQ(2, 5, 'cm'), cylQ(5, 3, 'm'), cylQ(4, 7, 'cm'), cylQ(1.5, 6, 'm')]),
    ],
  },
  medium: {
    ex: { stem: 'Find the area of the end first. 1 cm³ = 1 mL and 1000 cm³ = 1 L.', parts: [
      { t: 'Triangular prism', fig: tri(8, 6, 10, 12, 'cm', EXBOX) },
      { t: 'L-shaped prism', fig: solid({ face: LFACE, len: 8, labs: [[0, '6 cm'], [1, '2 cm', 'back'], [4, '2 cm', 'back'], [5, '5 cm']], lenLab: [1, '8 cm'], ...EXBOX }) },
      { t: 'Cylinder (one decimal place)', fig: cylQ(5, 4, 'm', { d: true, box: EXBOX })[0].fig },
      'A fish tank is 50 cm long, 30 cm wide and 40 cm high. Find its capacity in litres.'] },
    exAns: [`A = ½ × 8 × 6 = ${num(0.5 * 8 * 6)} cm²; V = ${num(0.5 * 8 * 6)} × 12 = ${V(0.5 * 8 * 6 * 12, 'cm')} (the 10\u00a0cm side is not needed)`,
      `A = 6 × 2 + 2 × 3 = ${num(areaOf(LFACE))} cm²; V = ${num(areaOf(LFACE))} × 8 = ${V(areaOf(LFACE) * 8, 'cm')}`,
      `r = 10 ÷ 2 = 5 m; V = π × 5² × 4 = ${V(cylV(5, 4), 'm', 1)}`,
      `V = 50 × 30 × 40 = ${V(50 * 30 * 40, 'cm')} = ${keepN(u(50 * 30 * 40, 'mL'))} = ${u(conv(50 * 30 * 40, 'mL', 'L'), 'L')}`],
    hint: 'Triangle: A = ½bh · L-shape: split it into rectangles · r = d ÷ 2 · 1 cm³ = 1 mL · 1 m³ = 1000 L',
    rounds: [
      figRound('find the volume of each prism or cylinder. Cylinders: correct to one decimal place.', [
        [{ t: '', fig: tri(12, 5, 13, 10, 'm', BOX) }, V(0.5 * 12 * 5 * 10, 'm')],
        [{ t: '', fig: solid({ face: LQ, len: 5, labs: [[0, '7 cm'], [1, '2 cm', 'back'], [4, '3 cm', 'back'], [5, '6 cm']], lenLab: [1, '5 cm'], ...BOX }) }, V(areaOf(LQ) * 5, 'cm')],
        cylQ(4, 5, 'm', { d: true }),
        [{ t: '', fig: solid({ face: TRAP, len: 6, labs: [[0, '10 cm'], [2, '5 cm', 'back']], dash: [[[2.5, 4], [2.5, 0], '4 cm', 1]], lenLab: [1, '6 cm'], hidden: false, ...BOX }) }, V(areaOf(TRAP) * 6, 'cm')],
      ]),
      problems('solve each problem. Show your working.', [
        [keep(`A cylindrical water tank has diameter ${L(TANK.d, 'm')} and height ${L(TANK.h, 'm')}. Find its capacity, to the nearest litre.`),
          `r = 1.5 m; V = π × 1.5² × 2 = ${num(tankV, 3)}… m³ = ${keepN(u(Math.round(tankV * 1000), 'L'))}`],
        [keep(`A pool is ${L(POOL.l, 'm')} long, ${L(POOL.w, 'm')} wide and ${L(POOL.h, 'm')} deep. How many litres of water does it hold?`),
          `V = 25 × 10 × 1.5 = ${V(poolV, 'm')} = ${keepN(u(poolV * 1000, 'L'))}`],
      ]),
    ],
  },
  mixed: mix(...[
    ['Volume of a 10 cm × 6 cm × 5 cm box?', V(10 * 6 * 5, 'cm'), '10.10'],
    ['Find the area of a circle with radius 4 cm.', keepN(u(area(4), 'cm²', 1)), '10.7'],
    ['Prism: end area 16 m², length 5 m. Volume?', V(16 * 5, 'm'), '10.10'],
    ['Closed tank, r = 2 m, h = 5 m. Surface area?', keepN(u(2 * area(2) + 2 * PI * 2 * 5, 'm²', 1)), '10.9'],
    ['A can: d = 6 cm, h = 10 cm. Capacity in mL?', `${keepN(u(cylV(3, 10), 'mL', 1))} (r = 3 cm; 1 cm³ = 1 mL)`, '10.10'],
    ['Convert 3.5 L to mL.', keepN(u(conv(3.5, 'L', 'mL'), 'mL')), '10.1'],
    ['A box: 120 cm³, base 6 cm × 4 cm. Height?', `${u(120 / (6 * 4), 'cm')} (120 ÷ 24)`, '10.10'],
    ['Carton 8 cm × 5 cm × 25 cm. Capacity in L?', `${u(conv(8 * 5 * 25, 'mL', 'L'), 'L')} (${keepN(u(8 * 5 * 25, 'cm³'))})`, '10.10'],
  ].map(([q, ...rest]) => [keep(q), ...rest])),
};
