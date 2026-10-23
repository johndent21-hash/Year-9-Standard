// Two 4-page revision booklets (A and B) for the Year 9 5.2 Yearly Exam 2026. Textbook-style questions with no
// answer spaces: students answer in their maths workbooks. Every question type in the exam appears in each booklet;
// A and B use different numbers and contexts, and neither repeats an exam question.
//   node revision.js            -> ../Yearly exam 2026/Year9-5.2-Yearly-Exam-2026-Revision-Booklet-A.pdf (and B)
// Questions are kept whole on a page; the build fails if a booklet is not exactly 4 pages.
'use strict';
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { num, money, nw, v } = require('./lib/helpers');
const F = require('./lib/figs');

const OUT = path.resolve(__dirname, '../Yearly exam 2026');
const BUILD = path.join(__dirname, 'build', 'revision');
const sup = (e) => `<sup>${e}</sup>`;
const pick = (b, A, B) => (b === 'A' ? A : B);

// ---------------------------------------------------------------- blocks
// q(text, { parts, cols, fig, note }): one numbered question. Parts are listed a, b, c… in `cols` columns.
const q = (text, o = {}) => ({ text, ...o });
const sec = (title, formulas) => ({ sec: title, formulas });

const questions = (b) => [
  sec('Section 1: Data'),
  q('Classify each type of data as <b>categorical</b> or <b>numerical</b>. If it is numerical, state whether it is <b>discrete</b> or <b>continuous</b>.', {
    cols: 2, parts: pick(b,
      ['the number of pets in a household', 'the colours of students’ school bags', 'the mass of a newborn baby', 'the number of text messages sent in a day', 'the time taken to walk to school', 'clothing sizes (S, M, L)'],
      ['the number of brothers and sisters', 'the type of car a family owns', 'the temperature at noon', 'the number of goals scored in a game', 'the length of a snake', 'a rating of a movie (poor, good, excellent)']),
  }),
  q(pick(b, 'The dot plot shows the number of pets owned by each student in a class.', 'The dot plot shows the scores (out of 10) of students in a quiz.'), {
    fig: pick(b,
      F.dotPlot({ counts: { 0: 4, 1: 8, 2: 6, 3: 3, 4: 2, 5: 1, 9: 1 }, min: 0, max: 10, unitW: 5, xTitle: 'Number of pets' }),
      F.dotPlot({ counts: { 2: 1, 3: 2, 4: 4, 5: 6, 6: 7, 7: 4, 8: 2, 9: 1 }, min: 0, max: 10, unitW: 5, xTitle: 'Score' })),
    parts: ['How many students are in the class?', 'Describe the shape of the distribution (symmetrical, positively skewed or negatively skewed).', 'Where do the scores cluster?', 'Is there an outlier? If so, what is it?', 'Find the mode.'],
  }),
  q(pick(b, 'The histogram shows the number of people living in each house in a street.', 'The histogram shows the number of books each student in a group read last month.'), {
    fig: pick(b,
      F.histogram({ labels: [1, 2, 3, 4, 5, 6], freq: [3, 7, 5, 6, 2, 1], colW: 7, plotH: 30, yMax: 8, yStep: 1, xTitle: 'Number of people' }),
      F.histogram({ labels: [0, 1, 2, 3, 4, 5], freq: [2, 5, 8, 6, 3, 1], colW: 7, plotH: 30, yMax: 9, yStep: 1, xTitle: 'Number of books' })),
    parts: pick(b,
      ['How many houses are in the street?', 'What is the mode?', 'What is the range?', 'How many houses have more than 3 people?'],
      ['How many students are in the group?', 'What is the mode?', 'What is the range?', 'How many students read fewer than 2 books?']),
  }),
  q(pick(b,
    `A basketball player scored these points in 8 games:<br>${nw('12, 15, 9, 14, 41, 13, 11, 13')}`,
    `Lucy recorded how many minutes late her bus was on 8 days:<br>${nw('4, 6, 3, 5, 2, 30, 4, 5')}`), {
    parts: ['Which score is an outlier?', 'Find the mean and the median of all 8 scores.', 'Find the mean and the median without the outlier.', 'Which measure of centre is changed more by the outlier? Which one better describes the data?'],
  }),
  q(pick(b, 'The stem-and-leaf plot shows the marks (out of 50) of 12 students in a test.', 'The stem-and-leaf plot shows how many push-ups 11 students did in one minute.'), {
    fig: pick(b,
      F.stemLeaf({ data: [23, 27, 31, 32, 35, 35, 38, 40, 42, 44, 46, 47], key: '3 | 5 = 35 marks' }),
      F.stemLeaf({ data: [8, 12, 15, 17, 19, 21, 21, 24, 28, 30, 33], key: '2 | 4 = 24 push-ups' })),
    parts: ['Find the mean, correct to 1 decimal place.', 'Find the median.', 'Find the mode.', 'Find the range.'],
  }),
  q(pick(b, 'Students in Year 9 were asked to name their favourite fruit. The results are shown in the column graph.', 'Students were asked how they travel to school. The results are shown in the column graph.'), {
    fig: pick(b,
      F.histogram({ labels: ['Apple', 'Banana', 'Mango', 'Grapes', 'Orange'], freq: [12, 9, 15, 6, 3], kind: 'column', colW: 10, plotH: 30, yMax: 18, yStep: 3, xTitle: 'Fruit', yTitle: 'Number of students' }),
      F.histogram({ labels: ['Bus', 'Car', 'Walk', 'Bike', 'Train'], freq: [18, 14, 10, 6, 12], kind: 'column', colW: 10, plotH: 32, yMax: 20, yStep: 2, xTitle: 'Transport', yTitle: 'Number of students' })),
    parts: pick(b,
      ['Which fruit was the most popular?', 'How many more students chose mango than grapes?', 'How many students were surveyed?', 'What percentage of the students chose apple or banana? Answer correct to 1 decimal place.'],
      ['Which type of transport was the least popular?', 'How many more students travel by bus than by car?', 'How many students were surveyed?', 'What percentage of the students walk or ride a bike? Answer correct to 1 decimal place.']),
  }),
  q(pick(b, 'The back-to-back stem-and-leaf plot shows the test marks (out of 50) of two Year 9 classes.', 'The back-to-back stem-and-leaf plot shows the points scored by two basketball players in their last 11 games.'), {
    fig: pick(b,
      F.backToBack({ left: [21, 25, 28, 30, 32, 33, 35, 36, 38, 41], right: [14, 18, 26, 29, 37, 40, 42, 45, 47, 49], heads: ['9X', '9Y'], stems: [1, 4], key: '3 | 2 = 32 marks' }),
      F.backToBack({ left: [12, 15, 18, 19, 21, 22, 22, 24, 25, 27, 29], right: [5, 9, 14, 17, 20, 26, 28, 31, 33, 36, 38], heads: ['Jai', 'Ben'], stems: [0, 3], key: '2 | 4 = 24 points' })),
    parts: pick(b,
      ['Find the median mark for each class.', 'Find the range for each class.', 'Which class did better in the test? Give a reason.', 'Which class has the more consistent marks? Explain.'],
      ['Find the median for each player.', 'Find the range for each player.', 'Which player usually scores more points? Give a reason.', 'Which player is more consistent? Explain.']),
  }),

  sec('Section 2: Surface area and volume', [
    `1 kL = 1000 L, 1 L = 1000 mL, 1 L = 1000 cm³, 1 m³ = 1000 L`,
    `Parallelogram ${nw(`${v('A')} = ${v('bh')}`)}; kite and rhombus ${nw(`${v('A')} = ½${v('xy')}`)}; trapezium ${nw(`${v('A')} = ½${v('h')}(${v('a')} + ${v('b')})`)}`,
    `Circle ${nw(`${v('C')} = 2π${v('r')}`)}, ${nw(`${v('A')} = π${v('r')}²`)}; cylinder ${nw(`${v('V')} = π${v('r')}²${v('h')}`)}, ${nw(`${v('SA')} = 2π${v('r')}² + 2π${v('rh')}`)}; rectangular prism ${nw(`${v('V')} = ${v('lwh')}`)}`,
  ]),
  q('Convert:', {
    cols: 3, parts: pick(b,
      ['2.4 kL to L', '3750 mL to L', '0.6 L to mL', '8200 L to kL', '4000 cm³ to L', '2.5 m³ to L'],
      ['5.3 kL to L', '1250 mL to L', '3.75 L to mL', '640 L to kL', '7500 cm³ to L', '0.8 m³ to L']),
  }),
  // the exam asks students to choose the triangle formula (its formula is left out of the box above)
  q(`Which formula gives the area of a triangle: ${pick(b, [`bh`, `½bh`, `2bh`, `½(b + h)`], [`2bh`, `½(b + h)`, `½bh`, `bh`]).map((x) => nw(`${v('A')} = ${x.replace(/[bh]/g, (c) => v(c))}`)).join(', ').replace(/, ([^,]*)$/, ' or $1')}? Use it to find the area of each triangle.`, {
    figs: pick(b,
      [F.triangle({ b: 12, h: 7, a: 4, unit: 'cm', size: 30, maxH: 20 }), F.triangle({ b: 9, h: 10, a: 2, unit: 'm', size: 30, maxH: 27 }), F.triangle({ b: 15, h: 6.4, a: 4.5, unit: 'mm', size: 32, maxH: 18 })],
      [F.triangle({ b: 14, h: 9, a: 5, unit: 'm', size: 30, maxH: 20 }), F.triangle({ b: 8, h: 11, a: 1.8, unit: 'cm', size: 30, maxH: 28 }), F.triangle({ b: 20, h: 7.5, a: 6, unit: 'mm', size: 32, maxH: 18 })]),
  }),
  q('Find the area of each shape.', {
    figs: pick(b,
      [F.parallelogram({ b: 14, h: 8, s: 4, unit: 'm', labels: { side: '9 m' }, size: 34, maxH: 20 }), F.kite({ x: 12, y: 18, c: 6, unit: 'cm', size: 22, maxH: 26 }), F.trapezium({ a: 9, b: 15, h: 7, unit: 'cm', size: 32, maxH: 20 }), F.rhombus({ x: 10, y: 16, unit: 'mm', size: 20, maxH: 26 })],
      [F.parallelogram({ b: 18, h: 9.5, s: 5, unit: 'cm', labels: { side: '11 cm' }, size: 34, maxH: 20 }), F.kite({ x: 14, y: 20, c: 7, unit: 'm', size: 22, maxH: 26 }), F.trapezium({ a: 6, b: 13, h: 8, unit: 'm', size: 32, maxH: 20 }), F.rhombus({ x: 9, y: 15, unit: 'cm', size: 20, maxH: 26 })]),
  }),
  q('For each right-angled triangle, find (i) the perimeter and (ii) the area.', {
    figs: pick(b,
      [F.rightTriangle({ base: 15, height: 8, corner: 'BL', unit: 'cm', labels: { base: '15 cm', height: '8 cm', hyp: '17 cm' }, size: 36 }), F.rightTriangle({ base: 7, height: 24, corner: 'BR', unit: 'mm', labels: { base: '7 mm', height: '24 mm', hyp: '25 mm' }, size: 26 })],
      [F.rightTriangle({ base: 21, height: 20, corner: 'BL', unit: 'm', labels: { base: '21 m', height: '20 m', hyp: '29 m' }, size: 30 }), F.rightTriangle({ base: 16, height: 12, corner: 'BR', unit: 'cm', labels: { base: '16 cm', height: '12 cm', hyp: '20 cm' }, size: 32 })]),
  }),
  q('For each circle, find (i) the circumference and (ii) the area, correct to 1 decimal place.', {
    figs: pick(b,
      [F.circle({ r: 4.2, unit: 'cm', size: 24 }), F.circle({ r: 7.5, unit: 'm', show: 'd', size: 24 })],
      [F.circle({ r: 8.5, unit: 'mm', size: 24 }), F.circle({ r: 4.5, unit: 'cm', show: 'd', size: 24 })]),
  }),
  q(pick(b,
    'The plan shows a paved courtyard. All of the corners are right angles.',
    'The plan shows the floor of a room. All of the corners are right angles.'), {
    fig: pick(b,
      F.composite({ pts: [[0, 0], [16, 0], [16, 6], [10, 6], [10, 11], [0, 11]], sides: 'auto', unit: 'm', size: 44, maxH: 30 }),
      F.composite({ pts: [[0, 0], [12, 0], [12, 4], [5, 4], [5, 10], [0, 10]], sides: 'auto', unit: 'm', size: 40, maxH: 32 })),
    parts: pick(b,
      ['Find the perimeter of the courtyard.', 'Find the area of the courtyard.', 'Pavers cost $38.50 per square metre. Find the cost of paving the whole courtyard.'],
      ['Skirting board is fitted around the edge of the room. How many metres are needed?', 'Find the area of the floor.', 'Carpet costs $45.90 per square metre. Find the cost of carpeting the whole floor.']),
  }),
  q(pick(b, 'A closed can of soup is a cylinder with a radius of 4 cm and a height of 11 cm.', 'A closed rainwater tank is a cylinder with a radius of 1.5 m and a height of 2 m.'), {
    fig: pick(b, F.cylinder({ r: 4, h: 11, unit: 'cm', size: 18, maxH: 26 }), F.cylinder({ r: 1.5, h: 2, unit: 'm', size: 26, maxH: 22 })),
    parts: pick(b,
      ['Find the volume of the can, correct to 1 decimal place.', 'How many millilitres does the can hold? (1 cm³ = 1 mL)', 'Find the surface area of the can, correct to 1 decimal place.'],
      ['Find the volume of the tank, correct to 2 decimal places.', 'How many litres does the tank hold? Answer to the nearest litre.', 'The outside of the tank is to be painted. Find its surface area, correct to 1 decimal place.']),
  }),
  q(pick(b, 'A closed shoe box is a rectangular prism 32 cm long, 20 cm wide and 12 cm high.', 'A closed toy box is a rectangular prism 45 cm long, 25 cm wide and 16 cm high.'), {
    fig: pick(b, F.rectPrism({ l: 32, w: 20, h: 12, unit: 'cm', size: 34, maxH: 22 }), F.rectPrism({ l: 45, w: 25, h: 16, unit: 'cm', size: 36, maxH: 22 })),
    parts: ['Find the volume of the box.', 'How many litres does the box hold?', 'Find the surface area of the box.'],
  }),

  sec('Section 3: Mixed topics', [
    `Simple interest ${nw(`${v('I')} = ${v('Prn')}`)}; percentage profit = profit ÷ cost price × 100%; 1 year = 52 weeks = 26 fortnights = 12 months`,
    `Pythagoras’ theorem ${nw(`${v('c')}² = ${v('a')}² + ${v('b')}²`)}; ${nw(`sin ${v('θ')} = opp ÷ hyp`)}, ${nw(`cos ${v('θ')} = adj ÷ hyp`)}, ${nw(`tan ${v('θ')} = opp ÷ adj`)}`,
  ]),
  q(`If ${pick(b, `${v('p')} = 6 and ${v('q')} = 3`, `${v('m')} = 5 and ${v('n')} = 2`)}, evaluate:`, {
    cols: 4, parts: pick(b,
      [`2${v('p')} + ${v('q')}`, `${v('p')}² − ${v('q')}`, `3${v('q')}²`, `(${v('p')} − ${v('q')})²`],
      [`4${v('m')} − ${v('n')}`, `${v('m')}² + 3${v('n')}`, `2${v('n')}²`, `(${v('m')} + ${v('n')})²`]),
  }),
  q('Find the value of each pronumeral, correct to 1 decimal place.', {
    figs: pick(b,
      [F.rightTriangle({ base: 8.2, height: 6.5, corner: 'BL', labels: { base: '8.2 cm', height: '6.5 cm', hyp: v('x') }, size: 30 }), F.rightTriangle({ base: 9, height: Math.sqrt(14 * 14 - 81), corner: 'BR', labels: { base: '9 m', height: v('y'), hyp: '14 m' }, size: 26 })],
      [F.rightTriangle({ base: 11.5, height: 4.8, corner: 'BL', labels: { base: '11.5 m', height: '4.8 m', hyp: v('x') }, size: 34 }), F.rightTriangle({ base: 10.3, height: Math.sqrt(17.6 ** 2 - 10.3 ** 2), corner: 'BR', labels: { base: '10.3 cm', height: v('y'), hyp: '17.6 cm' }, size: 26 })]),
  }),
  q('Solve each problem.', {
    parts: pick(b,
      ['A jacket marked at $85 is discounted by 20%. Find the sale price.', 'A $240 bike is discounted by 15%. How much is saved, and what is the sale price?', 'A shop buys a TV for $650 and sells it for $799. Find the profit, and the profit as a percentage of the cost price (to 1 decimal place).'],
      ['A pair of shoes marked at $120 is discounted by 25%. Find the sale price.', 'A $360 phone is discounted by 12%. How much is saved, and what is the sale price?', 'A shop buys a guitar for $280 and sells it for $378. Find the profit, and the profit as a percentage of the cost price.']),
  }),
  q('Simplify, writing each answer in index notation.', {
    cols: 4, parts: pick(b,
      [`3${v('x')}${sup(4)} × 5${v('x')}${sup(3)}`, `12${v('y')}${sup(9)} ÷ 4${v('y')}${sup(3)}`, `(${v('m')}${sup(2)})${sup(5)}`, `2${v('a')}${sup(3)}${v('b')} × 6${v('a')}${v('b')}${sup(2)}`],
      [`4${v('k')}${sup(5)} × 7${v('k')}${sup(2)}`, `18${v('w')}${sup(8)} ÷ 3${v('w')}${sup(2)}`, `(${v('p')}${sup(3)})${sup(4)}`, `5${v('m')}${sup(2)}${v('n')}${sup(3)} × 3${v('m')}${sup(4)}${v('n')}`]),
  }),
  q(pick(b, `Harper is an engineer. She earns an annual salary of ${money(78260)}. How much is she paid:`, `Noah is a teacher. He earns an annual salary of ${money(92040)}. How much is he paid:`), {
    cols: 3, parts: ['per week?', 'per fortnight?', 'per month?'],
  }),
  q('Simplify:', {
    cols: 4, parts: pick(b,
      [`7${v('x')} + 2${v('y')} − 3${v('x')} + 5${v('y')}`, `6${v('m')} × 4${v('n')}`, `20${v('a')}${v('b')} ÷ 5${v('a')}`, `9${v('k')} − 4 + 2${v('k')} + 10`],
      [`8${v('p')} − 3${v('q')} + 2${v('p')} + 7${v('q')}`, `5${v('a')} × 3${v('c')}`, `24${v('x')}${v('y')} ÷ 8${v('y')}`, `4${v('t')} + 9 − ${v('t')} − 3`]),
  }),
  q('Expand and simplify:', {
    cols: 2, parts: pick(b,
      [`4(3${v('x')} − 2)`, `−5(2${v('a')} + 3)`, `2(${v('x')} + 7) + 3(${v('x')} − 4)`, `5(2${v('y')} − 1) − 3(${v('y')} − 6)`],
      [`6(2${v('m')} + 5)`, `−3(4${v('k')} − 7)`, `3(${v('a')} + 4) + 2(${v('a')} − 5)`, `4(3${v('p')} − 2) − 2(${v('p')} + 3)`]),
  }),
  q('Factorise:', {
    cols: 4, parts: pick(b,
      [`8${v('x')} + 20`, `15${v('m')} − 10`, `${v('a')}² + 6${v('a')}`, `12${v('y')}² − 18${v('y')}`],
      [`6${v('k')} + 21`, `14${v('n')} − 35`, `${v('p')}² − 9${v('p')}`, `10${v('x')}² + 15${v('x')}`]),
  }),
  q('Find the simple interest earned on each investment.', {
    cols: 2, parts: pick(b,
      [`${money(5400)} at 3.5% p.a. for 4 years`, `${money(12000)} at 5.2% p.a. for 30 months`],
      [`${money(8600)} at 4.5% p.a. for 3 years`, `${money(15000)} at 3.8% p.a. for 18 months`]),
  }),
  q('Solve each equation.', {
    cols: 3, parts: pick(b,
      [`4${v('x')} + 9 = 37`, `${v('x')} ÷ 3 − 5 = 2`, `6${v('m')} − 7 = 2${v('m')} + 25`, `3(2${v('y')} − 1) = 4${v('y')} + 15`, `5${v('k')} − 3(${v('k')} + 2) = ${v('k')} + 4`],
      [`7${v('x')} − 6 = 43`, `${v('x')} ÷ 4 + 3 = 8`, `9${v('a')} + 4 = 5${v('a')} + 36`, `2(3${v('p')} + 4) = 4${v('p')} + 20`, `8${v('n')} − 2(${v('n')} + 5) = 3${v('n')} + 11`]),
  }),
  q(pick(b,
    `Priya sells houses. She is paid a retainer of ${money(650)} per week plus 1.8% commission on her sales.`,
    `Sam sells furniture. He is paid ${money(480)} per week plus 3.5% commission on his sales.`), {
    parts: pick(b,
      [`Last week Priya sold a house for ${money(85000)}. Find her total pay for the week.`, `Tom earns 6% commission only (no retainer). Find his pay for a week in which he sells ${money(23400)} of goods.`],
      [`Last week Sam sold ${money(36200)} of furniture. Find his total pay for the week.`, `Mel earns 5% commission only (no retainer). Find her pay for a week in which she sells ${money(18900)} of goods.`]),
  }),
  q(pick(b,
    `Leo works in a café. He is paid ${money(28.4, 2)} per hour for the first 38 hours each week and time-and-a-half for each hour after that. Last week he worked 45 hours.`,
    `Ava works at a supermarket. She is paid ${money(24.6, 2)} per hour for the first 38 hours each week and time-and-a-half for each hour after that. Last week she worked 41 hours.`), {
    parts: ['Find the pay for the first 38 hours.', 'Find the pay for the overtime hours.', 'Find the total pay for the week.'],
  }),
  q(pick(b,
    `A plumber charges a call-out fee of ${money(90)} plus ${money(65)} per hour. The cost, ${v('C')} dollars, for ${v('h')} hours is ${nw(`${v('C')} = 90 + 65${v('h')}`)}.`,
    `A taxi charges ${money(4.5, 2)} plus ${money(2.3, 2)} per kilometre. The cost, ${v('C')} dollars, for ${v('d')} km is ${nw(`${v('C')} = 4.5 + 2.3${v('d')}`)}.`), {
    parts: pick(b,
      ['Find the cost of a 3-hour job.', 'Another job cost $415. Write an equation and solve it to find how many hours the job took.'],
      ['Find the cost of a 12 km trip.', 'Another trip cost $50.50. Write an equation and solve it to find how far the taxi travelled.']),
  }),
  q(pick(b,
    'A ladder 4.8 m long leans against a vertical wall. The foot of the ladder is 1.3 m from the wall.',
    'A kite is flying on a string 25 m long. The kite is 18 m above the ground, directly above a point on level ground.'), {
    fig: pick(b,
      F.rightTriangle({ base: 1.3, height: Math.sqrt(4.8 ** 2 - 1.3 ** 2), corner: 'BR', labels: { base: '1.3 m', height: v('h'), hyp: '4.8 m' }, angle: { at: 'base', label: v('θ') }, size: 30 }),
      F.rightTriangle({ base: Math.sqrt(25 ** 2 - 18 ** 2), height: 18, corner: 'BR', labels: { base: v('d'), height: '18 m', hyp: '25 m' }, angle: { at: 'base', label: v('θ') }, size: 34 })),
    parts: pick(b,
      ['How high up the wall does the ladder reach? Answer correct to 2 decimal places.', 'Find the angle θ the ladder makes with the ground, correct to the nearest degree.'],
      ['Find the distance d along the ground, correct to 2 decimal places.', 'Find the angle θ the string makes with the ground, correct to the nearest degree.']),
  }),
];

// ---------------------------------------------------------------- HTML
const L = 'abcdefghij';
const render = (b) => {
  let n = 0, pending = '';
  const blocks = [];
  for (const it of questions(b)) {
    if (it.sec) {
      pending = `<h2>${it.sec}</h2>${it.formulas ? `<div class="formulas"><b>Formulas</b><br>${it.formulas.join('<br>')}</div>` : ''}`;
      continue;
    }
    n += 1;
    const parts = it.parts ? `<ol class="parts" style="grid-template-columns:repeat(${it.cols || 1},1fr)">${it.parts.map((p, i) => `<li><b>${L[i]}</b>&ensp;${p}</li>`).join('')}</ol>` : '';
    const figs = it.figs ? `<div class="figrow">${it.figs.map((f, i) => `<div class="fig"><b>${L[i]}</b>${f}</div>`).join('')}</div>` : '';
    const body = it.fig
      ? `<div class="withfig"><div class="txt"><p>${it.text}</p>${parts}</div><div class="side">${it.fig}</div></div>`
      : `<p>${it.text}</p>${parts}${figs}`;
    blocks.push(`<div class="blk">${pending}<div class="q"><span class="n">${n}</span><div class="qb">${body}</div></div></div>`);
    pending = '';
  }
  const head = `<div class="blk"><div class="title"><div><div class="t1">Year 9 5.2 Yearly Exam Revision</div><div class="t2">Booklet ${b}</div></div>
    <div class="howto">Answer every question in your <b>maths workbook</b>.<br>Show all working. A calculator is allowed.</div></div></div>`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@page { size: A4; margin: 0 }
* { box-sizing: border-box }
body { margin: 0; font: 9.6pt/1.32 'Noto Serif', 'DejaVu Serif', Georgia, serif; color: #1a1a1a }
.page { width: 210mm; height: 297mm; padding: 11mm 13mm 12mm; position: relative; break-after: page; overflow: hidden }
.content { height: 268mm; overflow: hidden }
.foot { position: absolute; bottom: 6mm; left: 13mm; right: 13mm; font-size: 8pt; color: #555; display: flex; justify-content: space-between; border-top: 0.3mm solid #1f3864; padding-top: 1mm }
.title { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 0.8mm solid #1f3864; padding-bottom: 2mm; margin-bottom: 2mm }
.t1 { font-size: 16pt; font-weight: 700; color: #1f3864 } .t2 { font-size: 12pt; color: #2e75b6; font-weight: 700 }
.howto { text-align: right; font-size: 9pt }
h2 { background: #1f3864; color: #fff; font-size: 11pt; margin: 2.5mm 0 1.5mm; padding: 1mm 2.5mm }
.formulas { border: 0.3mm solid #2e75b6; background: #eef4fb; font-size: 8.4pt; padding: 1mm 2.5mm; margin-bottom: 1.5mm }
.q { display: flex; gap: 2.5mm; padding: 1.4mm 0; border-bottom: 0.2mm solid #d5dde8 }
.n { flex: 0 0 6mm; height: 6mm; border-radius: 1mm; background: #2e75b6; color: #fff; font-weight: 700; text-align: center; line-height: 6mm }
.qb { flex: 1; min-width: 0 } .qb p { margin: 0.4mm 0 0.8mm }
.parts { list-style: none; margin: 0; padding: 0 0 0 1mm; display: grid; column-gap: 5mm; row-gap: 0.6mm }
.parts b, .fig > b { color: #1f3864 }
.withfig { display: flex; gap: 4mm; align-items: flex-start } .txt { flex: 1; min-width: 0 } .side { flex: 0 0 auto }
.figrow { display: flex; flex-wrap: wrap; gap: 3mm 7mm; align-items: flex-end; margin-top: 0.8mm }
.fig { display: flex; gap: 1.5mm; align-items: flex-start }
svg { display: block }
</style></head><body><div id="flow">${head}${blocks.join('')}</div></body></html>`;
};

// Moves the blocks onto 4mm-checked A4 pages, keeping each question whole; returns the page count and any overflow.
function paginate(label) {
  const flow = document.getElementById('flow');
  const blocks = [...flow.children];
  const pages = [];
  const newPage = () => {
    const p = document.createElement('div'); p.className = 'page';
    p.innerHTML = '<div class="content"></div><div class="foot"><span></span><span></span></div>';
    document.body.appendChild(p); pages.push(p); return p.firstChild;
  };
  let c = newPage();
  const notes = [];
  for (const b of blocks) {
    c.appendChild(b);
    if (c.scrollHeight > c.clientHeight + 1) {
      if (c.children.length === 1) { notes.push(`a block is taller than a page: ${b.textContent.slice(0, 60)}`); continue; }
      c = newPage(); c.appendChild(b);
    }
  }
  flow.remove();
  pages.forEach((p, i) => { const s = p.querySelectorAll('.foot span'); s[0].textContent = label; s[1].textContent = `Page ${i + 1} of ${pages.length}`; });
  const free = pages.map((p) => { const c2 = p.firstChild, last = c2.lastElementChild; return Math.round((c2.getBoundingClientRect().bottom - last.getBoundingClientRect().bottom) / 3.78); });
  return { pages: pages.length, notes, freeMm: free };
}

(async () => {
  let pw;
  try { pw = require('playwright'); } catch { pw = require(require.resolve('playwright', { paths: [execSync('npm root -g').toString().trim()] })); }
  const browser = await pw.chromium.launch();
  fs.mkdirSync(BUILD, { recursive: true });
  const shots = process.argv.includes('--shots') ? process.argv[process.argv.indexOf('--shots') + 1] : null;
  let ok = true;
  for (const b of ['A', 'B']) {
    const name = `Year9-5.2-Yearly-Exam-2026-Revision-Booklet-${b}`;
    const html = path.join(BUILD, `${name}.html`);
    fs.writeFileSync(html, render(b));
    const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: shots ? 1.4 : 1 });
    await page.goto(`file://${html}`);
    await page.evaluate(() => document.fonts.ready);
    const r = await page.evaluate(`(${paginate.toString()})(${JSON.stringify(`Year 9 5.2 Yearly Exam Revision · Booklet ${b}`)})`);
    console.log(`Booklet ${b}: ${r.pages} pages; free space at the bottom of each page (mm): ${r.freeMm.join(', ')}`);
    r.notes.forEach((x) => console.log(`  ! ${x}`));
    if (r.pages !== 4 || r.notes.length) ok = false;
    await page.pdf({ path: path.join(OUT, `${name}.pdf`), format: 'A4', printBackground: true, preferCSSPageSize: true });
    if (shots) {
      fs.mkdirSync(shots, { recursive: true });
      const els = await page.$$('.page');
      for (let i = 0; i < els.length; i++) await els[i].screenshot({ path: path.join(shots, `${b}-p${i + 1}.png`) });
    }
  }
  await browser.close();
  console.log(ok ? 'Both booklets are 4 pages.' : 'Check the warnings above.');
  if (!ok) process.exitCode = 1;
})();
