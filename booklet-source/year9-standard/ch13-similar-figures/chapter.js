// Year 9 standard, Chapter 13 Similar figures (New Century Maths 9, Chapter 13): four three-page lessons (lib/lesson-two.js
// with drill) in the style of the Chapter 12 booklet. The teacher's brief for this chapter (17 Oct 2026):
//   page 1 Notes, WE DO Example 1 and Question 1; page 2 the Easy drill (Questions 2 to 4); page 3 WE DO Example 2, a
//   Medium set of six (two review questions, in places 2 and 5) and three worded problems. Every drill question in a
//   lesson has the same shape, in two parts (a, b), with a one-line instruction and answer lines that name what they
//   find (Scale factor =, x =); the last drill question gives less help. Scale factors are whole numbers or fractions
//   in simplest form; lengths carry their units, to one decimal place where needed. Similar is written ||| as in the
//   textbook (ABC ||| PQR). Enlargements are drawn on a printed grid with room for the image.
// Lessons 13.1 and 13.2 are textbook 13.01, 13.3 is 13.02 and 13.4 is 13.03 (Test Yourself 13).
//   node build.js year9-standard/ch13-similar-figures          the students' booklet and the answers
//   node build.js year9-standard/ch13-similar-figures-teacher  the teacher's copy (Notes boxes filled in)
const fs = require('fs');
const path = require('path');
const two = require('../../lib/lesson-two');
const front = require('../../lib/gold-front');

const plan = [['13.1', 'Similar figures'], ['13.2', 'Enlargements'], ['13.3', 'Finding unknown sides'], ['13.4', 'Shadows and scale drawings']]
  .map(([code, title]) => ({ code, title }));
const file = (code) => path.join(__dirname, 'lessons', `${code}.js`);
const lesson = (code) => two(require(file(code)));

const chapter = {
  year: 9, number: 13, title: 'Similar figures', series: 'Year 9 standard',
  fileName: 'Year9-Standard-Ch13-Similar-Figures', art: 'silver-minibrot', accent: '#3a1d5e', bodyClass: 'theme-mb theme-gold theme-violet q-parts',
  homework: false,
  coverSub: 'Easy drill with diagrams, then Medium and worded problems',
  pagesPerLesson: 3,
  parts: true,
  notesBox: 49.5,
  howto: front.HOWTO_THREE.replaceAll('one round at a time', 'one question at a time').replace('<b>10.2</b>', '<b>12.2</b>')
    .replace('The <b>?</b> on each diagram shows what to find. Write the <b>formula</b>, <b>substitute</b> the numbers, then the <b>answer</b> with its unit.',
      'Each question says what to do, step by step. Write each answer on the line that names it, like <b>Scale factor =</b>.')
    .replace(' Answers with π: <b>one decimal place</b> unless the question says otherwise.', ' Write scale factors as <b>whole numbers or fractions in simplest form</b>, and lengths with their <b>units</b>.'),
  plan,
  goals: ['name the matching sides and angles of similar figures and write a similarity statement (ABC ||| PQR)', 'find the scale factor of a pair of similar figures',
    'draw enlargements and reductions on a grid', 'test whether two figures are similar', 'find unknown sides of similar figures',
    'use shadows, scale drawings and maps to find real heights and lengths'],
  front: [front.cover, front.insideCover],
};
const only = (code, o = {}) => ({ ...chapter, ...o, front: [], fileName: `Preview-${code}${o.teacher ? '-Teacher' : ''}`, lessons: [lesson(code)] });
let built;
Object.defineProperty(chapter, 'lessons', { enumerable: false, get: () => (built ??= plan.filter((p) => fs.existsSync(file(p.code))).map((p) => lesson(p.code))) });
chapter.only = only;
chapter.teacherCopy = () => { const t = { ...chapter, teacher: true, fileName: `${chapter.fileName}-Teacher-copy` };
  Object.defineProperty(t, 'lessons', { enumerable: false, get: () => chapter.lessons }); return t; };

module.exports = chapter;
