// Year 9 standard, Chapter 10 Surface area and volume: the extension booklet for fast finishers. One page of harder
// questions for each of lessons 10.6 to 10.10 (the lessons of the Chapter 10 booklet), in a silver version of the
// Chapter 10 style: a silver cover over the Chapter 10 Mandelbrot spiral drawn in silver (tools/mandelbrot.py region
// 'platinum-spiral'), silver page bands, and question cards tagged Understanding, Reasoning or Problem solving, with
// earlier lessons mixed in (Review tags; never 10.2 or 10.3, precision and error). Some questions have a diagram;
// the ones tagged "Draw a diagram" are worded and have a dotted space to draw in.
//   node build.js year9-standard/ch10-extension     the booklet and its worked answers
// Each page is lessons/<code>.js: rows of question cards (see card below); every answer is calculated there.
const fs = require('fs');
const path = require('path');

const plan = [['10.6', 'Circumference and arc length'], ['10.7', 'Areas of circles and sectors'], ['10.8', 'Surface area of a prism'],
  ['10.9', 'Surface area of a cylinder'], ['10.10', 'Volumes of prisms and cylinders']].map(([code, title]) => ({ code, title }));

// Text keeps a number with its unit, and the parts of a spaced number, on one line.
const NB = ' ';
const nb = (s) => String(s).replace(/(\d) (?=\d{3}(?!\d))/g, `$1${NB}`).replace(/(\d|cm|mm|m) × (?=\d)/g, `$1${NB}×${NB}`).replace(/(\d) (?=(?:mm|cm|m|km|mL|L|kL|min|h|°|cm²|m²|cm³|m³)(?![A-Za-z]))/g, `$1${NB}`).replace(/ = /g, `${NB}=${NB}`);

const TYPE = { U: ['u', 'Understanding'], R: ['r', 'Reasoning'], PS: ['ps', 'Problem solving'] };
const star = (on) => `<svg viewBox="0 0 10 10"><polygon points="5,0.4 6.4,3.6 9.8,3.9 7.2,6.2 8,9.6 5,7.8 2,9.6 2.8,6.2 0.2,3.9 3.6,3.6" fill="${on ? '#3a1d5e' : 'none'}" stroke="#3a1d5e" stroke-width="0.8"/></svg>`;
const pencil = '<svg viewBox="0 0 10 10"><path d="M1.2 8.8 L2 6.2 L7 1.2 L8.8 3 L3.8 8 Z M6.2 2 L8 3.8" fill="none" stroke="currentColor" stroke-width="1"/></svg>';

// The answer lines: one row of short lines (['a', 'b']) or ruled lines for an explanation ([letter, how many]), in the
// order of the parts.
const answers = (x) => (!x ? '' : typeof x[1] === 'number'
  ? `<div class="xq-lines">${Array.from({ length: x[1] }, (_, i) => `<div><b>${i ? '' : x[0]}</b><i></i></div>`).join('')}</div>`
  : `<div class="xq-ans">${x.map((a) => `<span><b>${a}</b><i></i></span>`).join('')}</div>`);

// One question card.
//   type 'U' | 'R' | 'PS', stars 1 to 3, from: '10.5' (a review question), draw: true (worded; a dotted space to draw in)
//   t: the question, parts: ['…'] (lettered a, b, c), fig: a diagram (on the right; the text wraps round it), ans: answer lines ['a', 'b'] or
//   ['h ='], lines: [['b', 2]] ruled lines for an explanation, key: the worked answer (for the answer booklet)
const card = (q, n) => {
  const [cls, name] = TYPE[q.type];
  const letters = 'abcdef';
  return `
    <div class="xq ${cls}${q.draw ? ' drawq' : ''}">
      <div class="xq-head"><span class="xq-num">${n}</span><span class="xq-tag">${name}</span>${q.from ? `<span class="xq-tag rev">Review ${q.from}</span>` : ''}${q.draw ? `<span class="xq-tag draw">${pencil}Draw a diagram</span>` : ''}<span class="xq-stars">${[1, 2, 3].map((i) => star(i <= q.stars)).join('')}</span></div>
      <div class="xq-text">${q.fig ? `<div class="xq-fig">${q.fig}</div>` : ''}<p>${nb(q.t)}</p>${q.parts ? `<ol class="xq-parts">${q.parts.map((p, i) => `<li><b>${letters[i]}</b><span>${nb(p)}</span></li>`).join('')}</ol>` : ''}</div>
      <div class="xq-work"></div>
      ${[...(q.lines || []).filter(([l]) => q.ans && l < q.ans[0]), q.ans, ...(q.lines || []).filter(([l]) => !q.ans || l > q.ans[0])].map(answers).join('')}
    </div>`;
};

const footer = (chapter) => `<footer class="page-foot"><span>Kingscliff High School · Year ${chapter.year} Mathematics</span><span class="pn">{{PN}}</span><span>Chapter ${chapter.number} · Surface area and volume · Extension</span></footer>`;

// One page: the silver band, the fast-finisher strip, then the rows of cards ({ cols, g, qs }: g shares out the height).
const page = (chapter, spec) => {
  let n = 0;
  const rows = spec.rows.map((r) => `
  <div class="xt-row" style="--g:${r.g || 1}; grid-template-columns:${r.cols || '1fr 1fr'}">${r.qs.map((q) => card(q, ++n)).join('')}</div>`).join('');
  return `
<section class="page xt">
  <header class="xt-band">
    <img class="mb-logo" src="{{ASSETSREL}}/kingscliff-logo.png" alt="Kingscliff High School">
    <div class="xt-code"><span>Lesson</span><b>${spec.code}</b></div>
    <div class="xt-titles"><span class="xt-kicker">Mathematics · Year ${chapter.year} · Chapter ${chapter.number} · Extension</span><span class="xt-title">${spec.title}</span></div>
    <span class="xt-sec">Fast finishers</span>
  </header>
  <div class="content">
    <div class="xt-intro"><span class="xt-pill">Extension</span><span>Finished lesson ${spec.code}? Try these. Show your working in each box. Answers with π to <b>one decimal place</b>.</span>
      <span class="xt-key"><i class="u">Understanding</i><i class="r">Reasoning</i><i class="ps">Problem solving</i></span></div>
    ${rows}
  </div>
  ${footer(chapter)}
</section>`;
};

// A worked answer 'a … b … c …' is shown one part to a line.
const keyParts = (k) => (k.startsWith('a ') ? k.split(/ (?=[bc] )/) : [`  ${k}`]).map((x) => `<div class="kp"><i>${x[0].trim()}</i><span>${nb(x.slice(2))}</span></div>`).join('');
const lesson = (p) => (chapter) => {
  const spec = { ...p, ...require(path.join(__dirname, 'lessons', `${p.code}.js`)) };
  const qs = spec.rows.flatMap((r) => r.qs);
  return { code: spec.code, title: spec.title, pages: [page(chapter, spec)],
    answers: [['', Object.assign(qs.map((q, i) => `<b>${i + 1}</b><div>${q.from ? `<span class="ans-from">Review ${q.from}</span>` : ''}${keyParts(q.key)}</div>`), { plain: true })]] };
};

// The cover: the silver spiral over the whole page, a silver Extension plate, the contents on a pale panel, the key to
// the tags, and the name lines.
const cover = (chapter, lessons) => `
<section class="page xt-cover" style="background-image:url({{ASSETSREL}}/mandelbrot/${chapter.art}-page.jpg)">
  <div class="xtc-top">
    <img class="xtc-logo" src="{{ASSETSREL}}/kingscliff-logo.png" alt="Kingscliff High School">
    <span class="xtc-series">${chapter.series}</span>
  </div>
  <div class="xtc-plate">
    <div class="xtc-bolt"><svg viewBox="0 0 20 20"><path d="M11.5 1.5 L4 11 H9.5 L8 18.5 L16 8.5 H10.5 Z" fill="#fff"/></svg></div>
    <div><b>Extension booklet</b><span>For fast finishers · challenge questions</span></div>
  </div>
  <div class="xtc-panel">
    <div class="xtc-badge"><span>Chapter</span><b>${chapter.number}</b></div>
    <p class="xtc-kicker">Year ${chapter.year} Mathematics · Extension</p>
    <h1>Surface area and volume</h1>
    <p class="xtc-sub">One page of harder questions for each lesson from 10.6 on. Finish the lesson in your Chapter 10 booklet first, then come here.</p>
    <table class="xtc-contents">
      <tr><th>Lesson</th><th>Extension topic</th><th>Page</th><th>Done</th></tr>
      ${lessons.map((l) => `<tr><td><b>${l.code}</b></td><td>${l.title}</td><td>${l.startPage}</td><td><i></i></td></tr>`).join('')}
    </table>
  </div>
  <div class="xtc-how">
    <div><b>Every card has a type</b><span class="xtc-tags"><i class="u">Understanding</i><i class="r">Reasoning</i><i class="ps">Problem solving</i></span></div>
    <div><b>Mixed in</b><span><i class="rev">Review 10.4</i> questions from earlier lessons</span></div>
    <div><b>No diagram?</b><span><i class="draw">${pencil}Draw a diagram</i> first, in the dotted space</span></div>
    <div><b>Challenge</b><span class="xtc-stars">${star(1)}${star(0)}${star(0)}<em>to</em>${star(1)}${star(1)}${star(1)}</span></div>
  </div>
  <div class="xtc-name"><div><span>Name</span><i></i></div><div><span>Class</span><i></i></div><div><span>Teacher</span><i></i></div></div>
  <p class="xtc-credit"><span>Artwork: the Chapter 10 spiral from Seahorse Valley, part of the Mandelbrot set, coloured silver.</span></p>
</section>`;

const chapter = {
  year: 9, number: 10, title: 'Surface area and volume extension', series: 'Year 9 standard',
  fileName: 'Year9-Standard-Ch10-Extension-Fast-Finishers', art: 'platinum-spiral', accent: '#3a1d5e', bodyClass: 'theme-mb theme-xt',
  homework: false,
  pagesPerLesson: 1,
  plan,
  goals: [],
  front: [cover],
  css: fs.readFileSync(path.join(__dirname, 'extension.css'), 'utf8'),
};
let built;
Object.defineProperty(chapter, 'lessons', { enumerable: false, get: () => (built ??= plan.filter((p) => fs.existsSync(path.join(__dirname, 'lessons', `${p.code}.js`))).map(lesson)) });

module.exports = chapter;
