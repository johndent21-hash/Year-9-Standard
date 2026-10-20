// Front pages of the Year 10 transition series (gold-and-green Mandelbrot theme, two-page lessons).
// Cover: the booklet's Mandelbrot region fills the whole page (<art>-page.jpg, see tools/mandelbrot.py), with the
// title on a deep green panel over it. The inside cover reuses the blended series' page with its own how-to.
// chapter.plan lists every lesson ({ code, title }), so the cover and contents are complete while lessons are still
// being written; every lesson is two pages, so lesson i starts on page 3 + 2i.
const { insideCover, ART } = require('./blend-front');

const planned = (chapter, lessons) => (chapter.plan || lessons).map((p, i) => ({ ...p, startPage: (lessons.find((l) => l.code === p.code) || {}).startPage || 3 + (chapter.pagesPerLesson || 2) * i }));

const cover = (chapter, built) => { const lessons = planned(chapter, built); return `
<section class="page gd-cover" style="background-image:url({{ASSETSREL}}/mandelbrot/${chapter.art}-page.jpg)">
  <div class="gdc-top">
    <img class="gdc-logo" src="{{ASSETSREL}}/kingscliff-logo.png" alt="Kingscliff High School">
    <span class="gdc-series">${chapter.series}</span>
  </div>
  <div class="gdc-panel">
    <div class="gdc-badge"><span>Chapter</span><b>${chapter.number}</b></div>
    <p class="gdc-kicker">Year ${chapter.year} Mathematics</p>
    <h1>${chapter.title}</h1>
    <p class="gdc-sub">${lessons.length} lessons · ${['two', 'two', 'two', 'three', 'four'][chapter.pagesPerLesson || 2]} pages each · ${chapter.coverSub || 'Easy, then Medium'}</p>
    <div class="gdc-lessons">${lessons.map((l) => `<div><b>${l.code}</b>${l.title}</div>`).join('')}</div>
  </div>
  <div class="gdc-name"><div><span>Name</span><i></i></div><div><span>Class</span><i></i></div><div><span>Teacher</span><i></i></div></div>
  <p class="gdc-credit"><span>Artwork: ${ART[chapter.art]}, part of the Mandelbrot set.</span></p>
</section>`; };

const HOWTO = `
    <div class="howto">
      <div><span class="step">1</span><span>Each lesson is <b>two pages</b>. Read the <b>learning intention</b> and tick each <b>success criterion</b> when you can do it.</span></div>
      <div><span class="step">2</span><span>Page 1 is <b class="lvl-word l1">Easy</b> and page 2 is <b class="lvl-word l2">Medium</b>. Each page starts with an example, then questions for you.</span></div>
      <div class="we"><span class="zone-pill">WE DO</span><span><b>Grey boxes.</b> Your teacher works each example on the board. <b>Copy every step</b> into the space.</span></div>
      <div class="you"><span class="zone-pill">YOU DO</span><span><b>Blue boxes.</b> Your turn. Work down the box one round at a time. Answers go on the line; show working in the boxes.</span></div>
      <div style="grid-column: 1 / -1"><span class="step">3</span><span>Stuck? Read the <b>Remember</b> line at the top of the blue box, then look back at the example you copied.</span></div>
    </div>`;

// The Year 9 standard series adds a Mixed practice box at the end of each Medium page (lib/lesson-two.js spec.mixed).
const HOWTO_MIXED = `
    <div class="howto">
      <div><span class="step">1</span><span>Each lesson is <b>two pages</b>. Read the <b>learning intention</b>, copy your teacher's notes into the <b>Notes</b> box, and tick each <b>success criterion</b> when you can do it.</span></div>
      <div><span class="step">2</span><span>Page 1 is <b class="lvl-word l1">Easy</b> and page 2 is <b class="lvl-word l2">Medium</b>. Each page starts with an example, then questions for you.</span></div>
      <div class="we"><span class="zone-pill">WE DO</span><span><b>Grey boxes.</b> Your teacher works each example on the board. <b>Copy every step</b> into the space.</span></div>
      <div class="you"><span class="zone-pill">YOU DO</span><span><b>Blue boxes.</b> Your turn. Work down the box one round at a time. Answers go on the line; show working in the boxes.</span></div>
      <div><span class="step">3</span><span><b>Mixed practice</b> ends page 2: today's skill mixed with earlier lessons. The tag on each question (like <b>10.2</b> or <b>Year 8</b>) says where it comes from.</span></div>
      <div><span class="step">4</span><span>Stuck? Read the <b>Remember</b> line in the blue box, then look back at the example or the lesson in the tag. Answers with π: <b>one decimal place</b> unless the question says otherwise.</span></div>
    </div>`;

// Three-page lessons (lib/lesson-two.js spec.drill): Notes, two Easy pages of drill, a Medium page with earlier lessons
// mixed in, then worded problems.
const HOWTO_THREE = `
    <div class="howto">
      <div><span class="step">1</span><span>Each lesson is <b>three pages</b>. Read the <b>learning intention</b>, copy your teacher's notes into the <b>Notes</b> box, and tick each <b>success criterion</b> when you can do it.</span></div>
      <div><span class="step">2</span><span>Pages 1 and 2 are <b class="lvl-word l1">Easy</b>: small steps, one round at a time. Page 3 is <b class="lvl-word l2">Medium</b>, then three <b>worded problems</b>.</span></div>
      <div class="we"><span class="zone-pill">WE DO</span><span><b>Grey boxes.</b> Your teacher works each example on the board. <b>Copy every step</b> into the space.</span></div>
      <div class="you"><span class="zone-pill">YOU DO</span><span><b>Blue boxes.</b> Your turn. The <b>?</b> on each diagram shows what to find. Write the <b>formula</b>, <b>substitute</b> the numbers, then the <b>answer</b> with its unit.</span></div>
      <div><span class="step">3</span><span>Some Medium questions come from earlier lessons. The tag (like <b>10.2</b> or <b>Year 8</b>) says which one.</span></div>
      <div><span class="step">4</span><span>Stuck? Read the <b>Remember</b> line in the blue box, then look back at your notes and the example. Answers with π: <b>one decimal place</b> unless the question says otherwise.</span></div>
    </div>`;

module.exports = {
  HOWTO_MIXED,
  HOWTO_THREE,
  cover,
  // The artwork panel uses the full-page picture, which has no white fade at the top.
  insideCover: (chapter, lessons) => insideCover({ ...chapter, howto: chapter.howto || HOWTO }, planned(chapter, lessons)).replace(`${chapter.art}-cover.jpg`, `${chapter.art}-page.jpg`),
};
