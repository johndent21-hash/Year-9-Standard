// Year 9 standard, Chapter 10 Surface area and volume (New Century Maths 9, Chapter 10): ten two-page lessons
// (lib/lesson-two.js) in the style of the Year 10 transition booklets, each an Easy page and a Medium page of WE DO
// examples and YOU DO rounds, with a Mixed practice box at the end of the Medium page (as in the Year 7 booklets).
// The textbook's 10.06 is split in two (10.6 circumference and arc length, 10.7 areas of circles and sectors), so from
// 10.7 on the lesson codes run one ahead of the textbook sections. Calculators allowed, friendly numbers. Each lesson
// is in lessons/<code>.js, every answer is calculated (helpers.js) and every diagram is drawn by shapes.js.
//   node build.js year9-standard/ch10-surface-area-volume      the booklet and its answers
const fs = require('fs');
const path = require('path');
const two = require('../../lib/lesson-two');
const front = require('../../lib/gold-front');

const plan = [['10.1', 'Metric units'], ['10.2', 'Precision and absolute error'], ['10.3', 'Percentage error'],
  ['10.4', 'Perimeter and area of composite shapes'], ['10.5', 'Areas of quadrilaterals'], ['10.6', 'Circumference and arc length'],
  ['10.7', 'Areas of circles and sectors'], ['10.8', 'Surface area of a prism'], ['10.9', 'Surface area of a cylinder'],
  ['10.10', 'Volumes of prisms and cylinders']].map(([code, title]) => ({ code, title }));
const file = (code) => path.join(__dirname, 'lessons', `${code}.js`);
const lesson = (code) => two(require(file(code)));

const chapter = {
  year: 9, number: 10, title: 'Surface area and volume', series: 'Year 9 standard',
  fileName: 'Year9-Standard-Ch10-Surface-Area-and-Volume', art: 'silver-spiral', accent: '#3a1d5e', bodyClass: 'theme-mb theme-gold theme-violet',
  homework: false,
  coverSub: 'Easy, Medium, then Mixed practice',
  pagesPerLesson: 3, // Easy (with the Notes box), Easy drill, Medium
  notesBox: 49.5, // the Notes box at the start of each lesson: 1.5 × 33 mm (itself 1.5 × a 22 mm WE DO copy box)
  howto: front.HOWTO_MIXED,
  plan, // every lesson, for the cover and contents
  goals: ['convert between metric units, including very large and very small units', 'find the precision, absolute error and percentage error of a measurement',
    'find the perimeter and area of composite shapes and quadrilaterals', 'find the circumference, arc length and area of circles, sectors and composite shapes',
    'find the surface area of prisms and cylinders', 'find the volume and capacity of prisms and cylinders'],
  front: [front.cover, front.insideCover],
};
// One lesson on its own, with no front pages, for checking a lesson while it is written (see ../preview/README.md).
// It loads only that lesson, so a lesson being written cannot break another lesson's preview.
// only(code, { teacher: true }) previews the teacher's copy, with the notes filled in.
const only = (code, o = {}) => ({ ...chapter, ...o, front: [], fileName: `Preview-${code}${o.teacher ? '-Teacher' : ''}`, lessons: [lesson(code)] });
// Every written lesson, loaded the first time the build asks for them.
let built;
Object.defineProperty(chapter, 'lessons', { enumerable: false, get: () => (built ??= plan.filter((p) => fs.existsSync(file(p.code))).map((p) => lesson(p.code))) });
chapter.only = only;

module.exports = chapter;
