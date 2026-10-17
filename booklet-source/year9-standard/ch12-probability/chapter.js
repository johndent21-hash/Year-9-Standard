// Year 9 standard, Chapter 12 Probability (New Century Maths 9, Chapter 12): five three-page lessons (lib/lesson-two.js
// with drill) in the style of the Chapters 10 and 11 booklets. The teacher's brief for this chapter (17 Oct 2026):
//   page 1 Notes, WE DO Example 1 and Question 1; page 2 the Easy drill (Questions 2 to 4); page 3 WE DO Example 2, a
//   Medium set of six (two review questions, in places 2 and 5) and three worded problems. Every drill question in a
//   lesson has the same shape, in two parts (a, b), with a one-line instruction and answer lines that name what they
//   find (P(red) =); the last drill question gives less help. Answers are fractions in simplest form unless a question
//   asks for a decimal or a percentage. chapter.parts numbers the questions Question 1, 2, 3 … with parts a, b.
// Textbook 12.04 (two-way tables) is PATH and is left out, so lessons 12.4 and 12.5 are textbook 12.05 and 12.06.
//   node build.js year9-standard/ch12-probability          the students' booklet and the answers
//   node build.js year9-standard/ch12-probability-teacher  the teacher's copy (Notes boxes filled in)
const fs = require('fs');
const path = require('path');
const two = require('../../lib/lesson-two');
const front = require('../../lib/gold-front');

const plan = [['12.1', 'Probability'], ['12.2', 'Experimental probability'], ['12.3', 'Venn diagrams'], ['12.4', 'Tree diagrams'],
  ['12.5', 'Tables of outcomes']].map(([code, title]) => ({ code, title }));
const file = (code) => path.join(__dirname, 'lessons', `${code}.js`);
const lesson = (code) => two(require(file(code)));

const chapter = {
  year: 9, number: 12, title: 'Probability', series: 'Year 9 standard',
  fileName: 'Year9-Standard-Ch12-Probability', art: 'silver-jellyfish', accent: '#3a1d5e', bodyClass: 'theme-mb theme-gold theme-violet q-parts',
  homework: false,
  coverSub: 'Easy drill with diagrams, then Medium and worded problems',
  pagesPerLesson: 3,
  parts: true,
  notesBox: 49.5,
  howto: front.HOWTO_THREE.replaceAll('one round at a time', 'one question at a time').replace('<b>10.2</b>', '<b>11.2</b>')
    .replace('The <b>?</b> on each diagram shows what to find. Write the <b>formula</b>, <b>substitute</b> the numbers, then the <b>answer</b> with its unit.',
      'Each question says what to do, step by step. Write each answer on the line that names it, like <b>P(red) =</b>.')
    .replace(' Answers with π: <b>one decimal place</b> unless the question says otherwise.', ' Write probabilities as <b>fractions in simplest form</b> unless the question asks for a decimal or a percentage.'),
  plan,
  goals: ['find the probability of an event and of its complement', 'find observed (experimental) probabilities and compare them with theoretical probabilities',
    'use Venn diagrams to find probabilities with "and", "or" and "neither"', 'list the outcomes of two-step experiments with tree diagrams',
    'use tables of outcomes for two dice or spinners', 'write probabilities as fractions in simplest form, decimals or percentages'],
  front: [front.cover, front.insideCover],
};
const only = (code, o = {}) => ({ ...chapter, ...o, front: [], fileName: `Preview-${code}${o.teacher ? '-Teacher' : ''}`, lessons: [lesson(code)] });
let built;
Object.defineProperty(chapter, 'lessons', { enumerable: false, get: () => (built ??= plan.filter((p) => fs.existsSync(file(p.code))).map((p) => lesson(p.code))) });
chapter.only = only;
chapter.teacherCopy = () => { const t = { ...chapter, teacher: true, fileName: `${chapter.fileName}-Teacher-copy` };
  Object.defineProperty(t, 'lessons', { enumerable: false, get: () => chapter.lessons }); return t; };

module.exports = chapter;
