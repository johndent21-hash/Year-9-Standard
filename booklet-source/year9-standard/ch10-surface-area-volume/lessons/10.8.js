// Lesson 10.8 Surface area of a prism (two pages: Easy, then Medium, then Mixed practice). See lib/lesson-two.js.
// Textbook 10.07. Every solid is drawn to scale from the same numbers that give its surface area.
// The solids are drawn here (with shapes.js parts), not with shapes.js prism(), cuboid() and triPrism(): those keep a
// 6 mm margin (so in a quarter-width cell they shrink and their labels get too small) and put an edge's label in the
// middle of its side face. These fill the cell (maxW, maxH: the most room a picture may take, in mm), put each label
// beside its own edge, clear of every line and every other label, and can show a box with no lid. A triangular prism's
// slope label goes beyond the back edge of the sloping face, as the hidden edges cross that face near the front.
const { u, num, conv, area, round, problems, mix } = require('../helpers');
const { C, f, T, svg, seg, poly, rightMark, rad, FILL, SIDE, TOP } = require('../shapes').parts;

const DEP = [Math.cos(rad(35)) * 0.55, Math.sin(rad(35)) * 0.55]; // the depth, drawn 35° up to the right at 0.55 scale (y up)
const SIZE = 2.8, textW = (s) => String(s).length * SIZE * 0.58; // as shapes.js T measures a label
const INSIDE = '#c2cbe6', INSIDE_L = '#a9b5d8'; // the inside of a box with no lid: back wall, left wall
const BOX = { maxW: 33, maxH: 24 }; // a picture in a YOU DO round; the WE DO pictures are 21 mm high
const EXBOX = { maxW: 36, maxH: 21 };

const unit = (v) => { const L = Math.hypot(v[0], v[1]); return [v[0] / L, v[1] / L]; };
const lerp = (a, c, t) => [a[0] + (c[0] - a[0]) * t, a[1] + (c[1] - a[1]) * t];
// Does the segment a-c pass through the box [x0, y0, x1, y1] (grown by pad mm)? Checked at points 0.2 mm apart.
const hits = (bx, a, c, pad = 0.35) => {
  const n = Math.ceil(Math.hypot(c[0] - a[0], c[1] - a[1]) / 0.2);
  for (let i = 0; i <= n; i++) { const p = lerp(a, c, i / n); if (p[0] > bx[0] - pad && p[0] < bx[2] + pad && p[1] > bx[1] - pad && p[1] < bx[3] + pad) return true; }
  return false;
};
const overlap = (b1, b2, pad = 0.8) => b1[0] < b2[2] + pad && b2[0] < b1[2] + pad && b1[1] < b2[3] + pad && b2[1] < b1[3] + pad;

// A prism: its front face (corners x right, y up, in the question's units) pushed back by len.
//   labs: [[i, text, at, ts]] a label for front edge i (corner i to corner i + 1). It goes outside the front face,
//         beside the edge; if every place there touches a line or another label, beyond the back edge of that side face,
//         then inside the front face. at: 'in' tries inside the front face first. ts: the places along the front edge
//         to try (0 at corner i, 1 at corner i + 1), the middle first unless given.
//   lenLab: [corner, text, side] the length, beside the edge going back from that corner (side 1 below right, −1 above left)
//   right: corners of the front face with a right-angle mark; hidden: dashed hidden edges (default true)
//   open: the face behind the top edge of a rectangular front face is left off (a box with no lid)
const solid = ({ face, len, labs = [], lenLab, right = [], hidden = true, open = false, maxW, maxH }) => {
  const n = face.length, signed = face.reduce((s, p, i) => { const q = face[(i + 1) % n]; return s + p[0] * q[1] - q[0] * p[1]; }, 0);
  const outN = (i) => { const a = face[i], b = face[(i + 1) % n], v = unit([b[0] - a[0], b[1] - a[1]]); return signed > 0 ? [v[1], -v[0]] : [-v[1], v[0]]; }; // y up
  const vis = (i) => { const o = outN(i); return o[0] * DEP[0] + o[1] * DEP[1] > 1e-6; };
  const xs = face.flatMap((p) => [p[0], p[0] + len * DEP[0]]), ys = face.flatMap((p) => [p[1], p[1] + len * DEP[1]]);
  const draw = (k) => {
    const F = (p) => [(p[0] - Math.min(...xs)) * k, (Math.max(...ys) - p[1]) * k];
    const B = (p) => { const q = F(p); return [q[0] + len * DEP[0] * k, q[1] - len * DEP[1] * k]; };
    const fr = face.map(F), bk = face.map(B);
    const lines = [], boxes = []; // every line drawn and every label placed, to keep the labels clear of them
    const outline = (pts) => pts.forEach((p, i) => lines.push([p, pts[(i + 1) % pts.length]]));
    const line = (a, c, o) => { lines.push([a, c]); return seg(a, c, o); };
    let b = '';
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
      } else b += poly(quad, up ? TOP : SIDE);
    });
    b += poly(fr, FILL);
    outline(fr);
    if (hidden) {
      // the back edges, and the edges going back, that no face in front shows
      const hid = (i) => !vis(i) && !vis((i + n - 1) % n);
      face.forEach((p, i) => {
        const j = (i + 1) % n;
        if (!vis(i)) b += line(bk[i], bk[j], { stroke: C.grey, w: 0.3, dash: true });
        if (hid(i)) b += line(fr[i], bk[i], { stroke: C.grey, w: 0.3, dash: true });
      });
    }
    right.forEach((i) => {
      const p = fr[i], a = unit([fr[(i + n - 1) % n][0] - p[0], fr[(i + n - 1) % n][1] - p[1]]), c = unit([fr[(i + 1) % n][0] - p[0], fr[(i + 1) % n][1] - p[1]]), s = 1.5;
      lines.push([[p[0] + a[0] * s, p[1] + a[1] * s], [p[0] + (a[0] + c[0]) * s, p[1] + (a[1] + c[1]) * s]], [[p[0] + c[0] * s, p[1] + c[1] * s], [p[0] + (a[0] + c[0]) * s, p[1] + (a[1] + c[1]) * s]]);
      b += rightMark(p, fr[(i + n - 1) % n], fr[(i + 1) % n], s);
    });
    // a label: the first of the places (a point and the way to push the label off it) that is clear of every line
    // and every label so far (else the first place)
    const place = (s, places) => {
      const w = textW(s), h = 2.1;
      const boxOf = ([p, nv]) => {
        const d = 0.9 + (w / 2) * Math.abs(nv[0]) + (h / 2) * Math.abs(nv[1]), cx = p[0] + nv[0] * d, cy = p[1] + nv[1] * d;
        return [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2];
      };
      const clear = (bx) => !lines.some(([a, c]) => hits(bx, a, c)) && !boxes.some((o) => overlap(bx, o));
      const bx = boxOf(places.find((x) => clear(boxOf(x))) || places[0]);
      boxes.push(bx);
      return T((bx[0] + bx[2]) / 2, (bx[1] + bx[3]) / 2 + 1, s);
    };
    const TS = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8];
    labs.forEach(([i, s, at, ts = TS]) => {
      const j = (i + 1) % n, o = outN(i), sn = [o[0], -o[1]], inv = [-sn[0], -sn[1]]; // the outward normal on the page (y down)
      const out = [...ts, ...TS].map((t) => [lerp(fr[i], fr[j], t), sn]), back = vis(i) ? TS.map((t) => [lerp(bk[i], bk[j], t), sn]) : [], inside = TS.map((t) => [lerp(fr[i], fr[j], t), inv]);
      b += place(s, at === 'in' ? [...inside, ...out, ...back] : [...out, ...back, ...inside]);
    });
    if (lenLab) {
      const [c, s, side = 1] = lenLab, d = unit([DEP[0], -DEP[1]]), dn = [-d[1], d[0]], up = [d[1], -d[0]];
      const at = (nv) => TS.map((t) => [lerp(fr[c], bk[c], t), nv]);
      b += place(s, side > 0 ? [...at(dn), ...at(up)] : [...at(up), ...at(dn)]);
    }
    return svg(f((Math.max(...xs) - Math.min(...xs)) * k), f((Math.max(...ys) - Math.min(...ys)) * k), b);
  };
  // the largest scale at which the picture, labels and all, fits the box
  const size = (s) => s.match(/viewBox="[^ ]+ [^ ]+ ([^ ]+) ([^"]+)"/).slice(1).map(Number);
  let lo = 0.1, hi = 8;
  for (let t = 0; t < 30; t++) { const mid = (lo + hi) / 2, [W, H] = size(draw(mid)); if (W <= maxW && H <= maxH) lo = mid; else hi = mid; }
  return draw(lo);
};

const lab = (v, unit) => `${num(v)} ${unit}`;
// A rectangular prism l across, w going back, h up (in the question's unit), labelled on the front and the length.
const box = (l, w, h, unit, o = {}) => solid({ face: [[0, 0], [l, 0], [l, h], [0, h]], len: w, labs: [[0, lab(l, unit)], [3, lab(h, unit)]], lenLab: [1, lab(w, unit)], ...o });
// A triangular prism whose end is a right-angled triangle: legs b (across) and h (up), slope s, length len
const tri = (b, h, s, len, unit, o = {}) => solid({ face: [[0, 0], [b, 0], [0, h]], len, labs: [[0, lab(b, unit)], [1, lab(s, unit)], [2, lab(h, unit)]], lenLab: [1, lab(len, unit)], right: [0], ...o });
// A triangular prism lying on the long side c of its right-angled end: legs a (on the left) and b (on the right)
const hypTri = (a, b, c, len, unit, o = {}) => solid({ face: [[0, 0], [c, 0], [(a * a) / c, (a * b) / c]], len, labs: [[0, lab(c, unit)], [1, lab(b, unit)], [2, lab(a, unit)]], lenLab: [1, lab(len, unit)], right: [2], ...o });

const boxSA = (l, w, h) => 2 * (l * w + l * h + w * h);
const openSA = (l, w, h) => boxSA(l, w, h) - l * w;
const triSA = (b, h, s, len) => 2 * (b * h) / 2 + (b + h + s) * len;
// Each picture question: [{ t, fig }, answer]
const boxQ = (l, w, h, unit, box0 = BOX) => [{ t: '', fig: box(l, w, h, unit, box0) }, u(boxSA(l, w, h), `${unit}²`)];
const openQ = (l, w, h, unit, box0 = BOX) => [{ t: '', fig: box(l, w, h, unit, { open: true, ...box0 }) }, u(openSA(l, w, h), `${unit}²`)];
const triQ = (b, h, s, len, unit) => [{ t: '', fig: tri(b, h, s, len, unit, BOX) }, u(triSA(b, h, s, len), `${unit}²`)];
const hypQ = (a, b, c, len, unit) => [{ t: '', fig: hypTri(a, b, c, len, unit, BOX) }, u(triSA(a, b, c, len), `${unit}²`)];
const figRound = (text, list) => ({ text, items: list.map((x) => x[0]), ans: list.map((x) => x[1]), cols: 4 });

// The teacher's examples. The L-shaped end is the L [[0,0],[6,0],[6,2],[2,2],[2,5],[0,5]] cm turned upside down (so the
// four labelled sides face the open corner, clear of the side faces), 8 cm long.
const L = [[4, 0], [6, 0], [6, 5], [0, 5], [0, 3], [4, 3]];
const perim = (pts) => pts.reduce((t, p, i) => { const q = pts[(i + 1) % pts.length]; return t + Math.hypot(q[0] - p[0], q[1] - p[1]); }, 0);
const areaOf = (pts) => Math.abs(pts.reduce((t, p, i) => { const q = pts[(i + 1) % pts.length]; return t + p[0] * q[1] - q[0] * p[1]; }, 0)) / 2;
const ROOM = { l: 5, w: 4, h: 2.5 };
const walls = 2 * (ROOM.l * ROOM.h + ROOM.w * ROOM.h), ceiling = ROOM.l * ROOM.w;

module.exports = {
  code: '10.8', title: 'Surface area of a prism',
  li: 'find the surface area of a prism by adding the areas of its faces.',
  sc: ['find the surface area of a cube and a rectangular prism', 'find the surface area of a triangular prism', 'find the surface area of an open prism'],
  easy: {
    ex: { stem: 'Surface area (SA) = the total area of all the faces of a solid.', parts: [
      { t: 'Cube: find the SA', fig: box(5, 5, 5, 'm', EXBOX) }, { t: 'Find the SA', fig: box(8, 5, 4, 'cm', EXBOX) },
      { t: 'How many faces?', fig: solid({ face: [[0, 0], [6, 0], [3, 4]], len: 9, ...EXBOX }) }, { t: 'No lid: find the SA', fig: box(8, 5, 4, 'cm', { open: true, ...EXBOX }) }] },
    exAns: [`SA = 6 × 5² = 6 × 25 = ${u(6 * 5 * 5, 'm²')}`, `SA = 2 × (8 × 5 + 8 × 4 + 5 × 4) = 2 × 92 = ${u(boxSA(8, 5, 4), 'cm²')}`,
      '5 faces: 2 triangles (the ends) and 3 rectangles', `no top: ${num(boxSA(8, 5, 4))} − 8 × 5 = ${num(boxSA(8, 5, 4))} − 40 = ${u(openSA(8, 5, 4), 'cm²')}`],
    hint: 'Cube: SA = 6 × side² · Rectangular prism: SA = 2 × (lw + lh + wh) · No lid: take away the top, l × w',
    rounds: [
      round('find the surface area of each cube with side s.', [[2, 'cm'], [4, 'm'], [10, 'mm'], [7, 'cm'], [1.5, 'm'], [9, 'cm'], [3, 'm'], [20, 'mm']],
        ([s, x]) => `s = ${num(s)} ${x}`, ([s, x]) => u(6 * s * s, `${x}²`)),
      figRound('find the surface area of each rectangular prism.', [boxQ(6, 4, 3, 'cm'), boxQ(10, 5, 2, 'm'), boxQ(7, 3, 5, 'cm'), boxQ(9, 6, 4, 'mm')]),
      figRound('each box has no lid. Find its surface area.', [openQ(6, 5, 3, 'cm'), openQ(10, 4, 5, 'cm'), openQ(8, 6, 3, 'm'), openQ(12, 5, 4, 'cm')]),
    ],
  },
  medium: {
    ex: { stem: 'Find each surface area. In d, paint a room’s 4 walls and ceiling.', parts: [
      { t: 'Triangular prism', fig: tri(8, 6, 10, 12, 'cm', EXBOX) }, { t: 'Triangular prism', fig: hypTri(5, 12, 13, 10, 'cm', EXBOX) },
      { t: 'L-shaped prism', fig: solid({ face: L, len: 8, labs: [[0, '2 cm'], [3, '2 cm'], [4, '4 cm', 'out', [0.3, 0.4]], [5, '3 cm', 'out', [0.75, 0.65]]], lenLab: [1, '8 cm'], hidden: false, ...EXBOX }) },
      { t: 'Walls and ceiling', fig: box(ROOM.l, ROOM.w, ROOM.h, 'm', EXBOX) }] },
    exAns: [`2 × (½ × 8 × 6) + (8 + 6 + 10) × 12 = 48 + 288 = ${u(triSA(8, 6, 10, 12), 'cm²')}`, `the right angle is between 5 and 12: 2 × (½ × 5 × 12) + (5 + 12 + 13) × 10 = 60 + 300 = ${u(triSA(5, 12, 13, 10), 'cm²')}`,
      `top 4 + 2 = 6, side 2 + 3 = 5; end: area 6 × 2 + 2 × 3 = ${num(areaOf(L))}, perimeter ${num(perim(L))}; SA = 2 × ${num(areaOf(L))} + ${num(perim(L))} × 8 = ${u(2 * areaOf(L) + perim(L) * 8, 'cm²')}`,
      `walls 2 × (5 × 2.5 + 4 × 2.5) = ${num(walls)}, ceiling 5 × 4 = ${num(ceiling)}: ${num(walls)} + ${num(ceiling)} = ${u(walls + ceiling, 'm²')}`],
    hint: 'Any prism: SA = 2 × area of the end + perimeter of the end × length · Open: leave out the missing faces.',
    rounds: [
      figRound('find the surface area of each triangular prism.', [triQ(4, 3, 5, 10, 'cm'), triQ(12, 5, 13, 8, 'm'), triQ(8, 15, 17, 10, 'cm'), hypQ(9, 12, 15, 8, 'm')]),
      problems('solve each problem. Show your working.', [
        ['A gift box is 30 cm long, 20 cm wide and 10 cm high. How much paper covers it exactly?', u(boxSA(30, 20, 10), 'cm²')],
        ['A fish tank has no lid. It is 60 cm long, 30 cm wide and 40 cm high. What area of glass is used?', u(openSA(60, 30, 40), 'cm²')],
      ]),
    ],
  },
  mixed: mix(
    ['Find the SA of a cube with sides of 8 cm.', u(6 * 8 * 8, 'cm²'), '10.8'],
    ['Find the area of a circle with radius 3 m.', u(area(3), 'm²', 1), '10.7'],
    ['Find the SA of a box 10 cm × 6 cm × 4 cm.', u(boxSA(10, 6, 4), 'cm²'), '10.8'],
    ['Trapezium: a = 5 m, b = 9 m, h = 4 m. Area?', u(((5 + 9) / 2) * 4, 'm²'), '10.5'],
    ['A cube’s SA is 54 m². How long is each side?', `${u(Math.sqrt(54 / 6), 'm')} (54 ÷ 6 = 9 = 3²)`, '10.8'],
    ['Convert 1.8 m to cm.', u(conv(1.8, 'm', 'cm'), 'cm'), '10.1'],
    ['A prism is 10 cm long. Its end has area 18 cm² and perimeter 22 cm. Find its SA.', u(2 * 18 + 22 * 10, 'cm²'), '10.8'],
    ['A tank 3 m × 2 m × 1 m high has no lid. SA?', u(openSA(3, 2, 1), 'm²'), '10.8'],
  ),
};
