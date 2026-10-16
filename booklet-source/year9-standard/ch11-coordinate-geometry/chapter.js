// Year 9 standard, Chapter 11 Coordinate geometry and graphs (New Century Maths 9, Chapter 11): ten three-page lessons
// (lib/lesson-two.js) in the format of the Chapter 10 booklet (see ../ch10-surface-area-volume/chapter.js and
// docs/THREE-PAGE-FORMAT.md). The teacher asked for slightly less scaffolding than Chapter 10: only the first YOU DO
// round of a new skill prints its formula (later rounds leave the Formula line blank), the Medium page has no Remember
// hint, and more Medium questions are in words for students to set out themselves.
// Textbook 11.09 (direct variation) is PATH and is left out, so lessons 11.9 and 11.10 are textbook 11.10 and 11.11.
//   node build.js year9-standard/ch11-coordinate-geometry          the students' booklet and the answers
//   node build.js year9-standard/ch11-coordinate-geometry-teacher  the teacher's copy (Notes boxes filled in)
const fs = require('fs');
const path = require('path');
const two = require('../../lib/lesson-two');
const front = require('../../lib/gold-front');

const plan = [['11.1', 'The length of an interval'], ['11.2', 'The midpoint of an interval'], ['11.3', 'The gradient of an interval'],
  ['11.4', 'Graphing linear equations'], ['11.5', 'The gradient–intercept equation'], ['11.6', 'Finding the equation of a line'],
  ['11.7', 'Solving linear equations graphically'], ['11.8', 'Linear modelling'], ['11.9', 'Graphing parabolas'],
  ['11.10', 'Parabolas in real life']].map(([code, title]) => ({ code, title }));
const file = (code) => path.join(__dirname, 'lessons', `${code}.js`);
const lesson = (code) => two(require(file(code)));

const chapter = {
  year: 9, number: 11, title: 'Coordinate geometry and graphs', series: 'Year 9 standard',
  fileName: 'Year9-Standard-Ch11-Coordinate-Geometry-and-Graphs', art: 'silver-seahorse', accent: '#3a1d5e', bodyClass: 'theme-mb theme-gold theme-violet',
  homework: false,
  coverSub: 'Easy drill, then Medium and worded problems',
  pagesPerLesson: 3,
  notesBox: 49.5,
  howto: front.HOWTO_THREE,
  plan,
  goals: ['find the length, midpoint and gradient of an interval on the number plane', 'graph straight lines from a table of values, from intercepts and from y = mx + c',
    'find the equation of a straight line from its graph or from two points', 'solve linear equations by reading a graph',
    'use straight-line graphs and equations to model real situations', 'graph parabolas and use them in real situations'],
  front: [front.cover, front.insideCover],
};
const only = (code, o = {}) => ({ ...chapter, ...o, front: [], fileName: `Preview-${code}${o.teacher ? '-Teacher' : ''}`, lessons: [lesson(code)] });
let built;
Object.defineProperty(chapter, 'lessons', { enumerable: false, get: () => (built ??= plan.filter((p) => fs.existsSync(file(p.code))).map((p) => lesson(p.code))) });
chapter.only = only;
chapter.teacherCopy = () => { const t = { ...chapter, teacher: true, fileName: `${chapter.fileName}-Teacher-copy` };
  Object.defineProperty(t, 'lessons', { enumerable: false, get: () => chapter.lessons }); return t; };

module.exports = chapter;
