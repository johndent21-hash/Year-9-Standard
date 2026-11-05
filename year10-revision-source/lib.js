// Shared number formatting and SVG figure helpers for the Year 10 revision booklet and worksheet.

// ---------- number formatting ----------
const space = (s) => { const [i, d] = s.split('.'); const j = i.length >= 5 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : i; return d ? j + '.' + d : j; };
const num = (x, dp) => space(dp === undefined ? String(+x.toFixed(6)) : x.toFixed(dp));
const money = (x) => { const r = Math.round(x * 100) / 100; return '$' + (Number.isInteger(r) ? num(r) : num(r, 2)); };
const d1 = (x) => num(x, 1);
const fr = (a, b) => `<span class="fr"><span>${a}</span><span>${b}</span></span>`;
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const frac = (a, b) => { const g = gcd(a, b); return b / g === 1 ? String(a / g) : fr(a / g, b / g); };
const fracW = (a, b) => (gcd(a, b) === 1 ? fr(a, b) : `${fr(a, b)} = ${frac(a, b)}`);
const v = (s) => `<i class="v">${s}</i>`;
const sup = (s) => `<sup>${s}</sup>`;

// ---------- figures (inline SVG) ----------
const S = (w, h, body) => `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" font-size="12">${body}</svg>`;
const T = (x, y, t, a = 'middle', extra = '') => `<text x="${x}" y="${y}" text-anchor="${a}" ${extra}>${t}</text>`;
const STROKE = 'stroke="#1f3864" stroke-width="1.6" fill="#eaf2fb"';
const fig = {
  rect(top, side) {
    return S(170, 96, `<rect x="10" y="10" width="120" height="66" ${STROKE}/>` + T(70, 92, top) + T(136, 47, side, 'start'));
  },
  circle(label, diameter = false) {
    const line = diameter
      ? `<line x1="15" y1="50" x2="95" y2="50" stroke="#c00000" stroke-width="1.6"/>` + T(55, 44, label)
      : `<line x1="55" y1="50" x2="95" y2="50" stroke="#c00000" stroke-width="1.6"/>` + T(75, 44, label);
    return S(112, 100, `<circle cx="55" cy="50" r="40" ${STROKE}/><circle cx="55" cy="50" r="2" fill="#1f3864"/>` + line);
  },
  triangle(b, h) {
    return S(150, 100, `<path d="M10 80 L130 80 L45 15 Z" ${STROKE}/><line x1="45" y1="15" x2="45" y2="80" stroke="#c00000" stroke-dasharray="4 3"/>` +
      `<path d="M45 72 L53 72 L53 80" fill="none" stroke="#1f3864"/>` + T(70, 95, b) + T(40, 52, h, 'end'));
  },
  trap(a, b, h) {
    return S(160, 104, `<path d="M15 80 L135 80 L105 20 L45 20 Z" ${STROKE}/><line x1="75" y1="20" x2="75" y2="80" stroke="#c00000" stroke-dasharray="4 3"/>` +
      `<path d="M75 72 L83 72 L83 80" fill="none" stroke="#1f3864"/>` + T(75, 14, a) + T(75, 96, b) + T(88, 54, h, 'start'));
  },
  box(l, w, h) {
    return S(210, 110, `<g transform="translate(30 0)"><path d="M15 45 L125 45 L125 95 L15 95 Z" ${STROKE}/><path d="M15 45 L50 15 L160 15 L125 45 Z" stroke="#1f3864" stroke-width="1.6" fill="#d7e6f6"/>` +
      `<path d="M125 45 L160 15 L160 65 L125 95 Z" stroke="#1f3864" stroke-width="1.6" fill="#c3d7ee"/>` +
      T(70, 108, l) + T(148, 88, w, 'start') + T(10, 74, h, 'end') + '</g>');
  },
  cube(s) {
    return S(120, 112, `<path d="M15 35 L75 35 L75 95 L15 95 Z" ${STROKE}/><path d="M15 35 L40 12 L100 12 L75 35 Z" stroke="#1f3864" stroke-width="1.6" fill="#d7e6f6"/>` +
      `<path d="M75 35 L100 12 L100 72 L75 95 Z" stroke="#1f3864" stroke-width="1.6" fill="#c3d7ee"/>` + T(45, 110, s));
  },
  cyl(r, h) {
    return S(150, 136, `<path d="M20 28 L20 114 A40 10 0 0 0 100 114 L100 28" ${STROKE}/><ellipse cx="60" cy="28" rx="40" ry="10" stroke="#1f3864" stroke-width="1.6" fill="#d7e6f6"/>` +
      `<line x1="60" y1="28" x2="100" y2="28" stroke="#c00000" stroke-width="1.6"/>` + T(80, 12, r) + T(106, 76, h, 'start'));
  },
  pyth(a, b, c = 'c') {
    // right angle bottom-right, a = vertical, b = horizontal
    return S(170, 110, `<path d="M15 90 L135 90 L135 20 Z" ${STROKE}/><path d="M125 90 L125 80 L135 80" fill="none" stroke="#1f3864"/>` +
      T(75, 105, b) + T(141, 58, a, 'start') + T(66, 50, c, 'end', 'font-style="italic" font-weight="bold"'));
  },
  trig(angle, adj) {
    return S(215, 110, `<path d="M15 90 L145 90 L145 20 Z" ${STROKE}/><path d="M135 90 L135 80 L145 80" fill="none" stroke="#1f3864"/>` +
      `<path d="M43 90 A28 28 0 0 0 40 77" fill="none" stroke="#c00000" stroke-width="1.4"/>` + T(50, 84, angle + '°', 'start') +
      T(80, 105, adj + ' (adjacent)') + T(151, 52, '<tspan font-style="italic" font-weight="bold">x</tspan>', 'start') + T(151, 66, '(opposite)', 'start', 'font-size="10"'));
  },
  line(title, labels, values, ymax, step, ylab) {
    const W = 250, H = 150, x0 = 40, y0 = 118, pw = 195, ph = 95;
    let g = '';
    for (let y = 0; y <= ymax; y += step) { const yy = y0 - (y / ymax) * ph; g += `<line x1="${x0}" y1="${yy}" x2="${x0 + pw}" y2="${yy}" stroke="#d9e2ee"/>` + T(x0 - 4, yy + 4, y, 'end', 'font-size="10"'); }
    const dx = pw / labels.length;
    const pts = values.map((val, i) => [x0 + dx * (i + 0.5), y0 - (val / ymax) * ph]);
    labels.forEach((l, i) => { g += T(x0 + dx * (i + 0.5), y0 + 13, l, 'middle', 'font-size="10"'); });
    g += `<polyline points="${pts.map((p) => p.join(',')).join(' ')}" fill="none" stroke="#2e75b6" stroke-width="2"/>` + pts.map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="#1f3864"/>`).join('');
    g += `<line x1="${x0}" y1="${y0}" x2="${x0 + pw}" y2="${y0}" stroke="#1f3864"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0 - ph - 4}" stroke="#1f3864"/>`;
    g += T(x0 + pw / 2, 12, title, 'middle', 'font-weight="bold" font-size="11"') + T(x0 + pw / 2, H - 2, 'Month', 'middle', 'font-size="10"') + `<text x="10" y="${y0 - ph / 2}" font-size="10" text-anchor="middle" transform="rotate(-90 10 ${y0 - ph / 2})">${ylab}</text>`;
    return S(W, H, g);
  },
  columns(labels, values, ymax, xlab) {
    const W = 260, H = 150, x0 = 34, y0 = 118, pw = 215, ph = 95;
    let g = '';
    for (let y = 0; y <= ymax; y += 1) { const yy = y0 - (y / ymax) * ph; g += `<line x1="${x0}" y1="${yy}" x2="${x0 + pw}" y2="${yy}" stroke="#e3e9f1"/>` + (y % 2 === 0 ? T(x0 - 4, yy + 4, y, 'end', 'font-size="10"') : ''); }
    const dx = pw / labels.length;
    values.forEach((val, i) => { const hh = (val / ymax) * ph; g += `<rect x="${x0 + dx * i}" y="${y0 - hh}" width="${dx}" height="${hh}" fill="#9dc3e6" stroke="#1f3864"/>`; });
    labels.forEach((l, i) => { g += T(x0 + dx * (i + 0.5), y0 + 13, l, 'middle', 'font-size="10"'); });
    g += `<line x1="${x0}" y1="${y0}" x2="${x0 + pw}" y2="${y0}" stroke="#1f3864"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0 - ph - 4}" stroke="#1f3864"/>`;
    g += T(x0 + pw / 2, H - 2, xlab, 'middle', 'font-size="10"') + `<text x="10" y="${y0 - ph / 2}" font-size="10" text-anchor="middle" transform="rotate(-90 10 ${y0 - ph / 2})">Frequency</text>`;
    return S(W, H, g);
  },
  spinner(n, red) {
    let g = '';
    for (let i = 0; i < n; i++) {
      const a1 = (i / n) * 2 * Math.PI - Math.PI / 2, a2 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2;
      const p = (a) => [50 + 40 * Math.cos(a), 50 + 40 * Math.sin(a)].map((z) => z.toFixed(1)).join(' ');
      const isRed = i < red;
      g += `<path d="M50 50 L${p(a1)} A40 40 0 0 1 ${p(a2)} Z" fill="${isRed ? '#e06666' : '#ffffff'}" stroke="#1f3864" stroke-width="1.2"/>`;
      const m = (a1 + a2) / 2;
      g += T((50 + 26 * Math.cos(m)).toFixed(1), (54 + 26 * Math.sin(m)).toFixed(1), isRed ? 'R' : 'W', 'middle', 'font-size="10"');
    }
    return S(100, 100, g);
  },
};
const stemLeaf = (rows, key) => `<table class="sl"><tr><th>Stem</th><th>Leaf</th></tr>${rows.map(([s, l]) => `<tr><td>${s}</td><td>${l.join(' ')}</td></tr>`).join('')}</table><div class="key">${key}</div>`;

module.exports = { space, num, money, d1, fr, gcd, frac, fracW, v, sup, S, T, STROKE, fig, stemLeaf };
