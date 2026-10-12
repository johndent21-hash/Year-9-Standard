// Lesson 10.2 Precision and absolute error (two pages: Easy, then Medium, then Mixed practice). See lib/lesson-two.js.
const { F, num, u, conv, absErr, prec, aerr, limits, round, problems, mix } = require('../helpers');
const S = require('../shapes');

// The measuring scales: [picture, precision, unit]. EX are the teacher's examples.
// The upright scales are capped at 21-24 mm tall on the page, so they are kept short (len) with at most 16 marks: then
// the numbers print at about 5 pt and the marks about 1 mm apart.
const EX = [
  [S.scale({ max: 3, major: 1, minor: 0.1, unit: 'cm' }), 1, 'mm'],
  [S.scale({ max: 800, major: 200, minor: 50, unit: 'mL', kind: 'jug', level: 650, len: 18 }), 50, 'mL'],
];
const SCALES = [
  [S.scale({ max: 2, major: 0.5, minor: 0.1, unit: 'kg' }), 0.1, 'kg'],
  [S.scale({ max: 300, major: 100, minor: 20, unit: 'mL', kind: 'jug', level: 240, len: 22 }), 20, 'mL'],
  [S.scale({ max: 30, major: 10, minor: 2, unit: '°C', kind: 'thermo', level: 24, len: 18 }), 2, '°C'],
  [S.scale({ max: 5, major: 1, minor: 0.5, unit: 'm' }), 0.5, 'm'],
];
const both = ([, p, unit]) => `precision ${u(p, unit)}, absolute error ${u(p / 2, unit)}`;
const NAMES = ['Kitchen scales', 'Jug', 'Thermometer', 'Tape measure'];
// A Mixed practice question on an instrument marked every step units, and its absolute error (step ÷ 2)
const every = (what, step, unit) => [`${what} marked every ${u(step, unit)}. Absolute error?`, u(absErr(step), unit), '10.2'];

module.exports = {
  code: '10.2', title: 'Precision and absolute error',
  li: 'find the precision and absolute error of a measuring instrument or a measurement.',
  sc: ['find the precision: the smallest unit on the scale', `find the absolute error: ${F(1, 2)} of the precision`, 'find the smallest and largest possible true value'],
  easy: {
    ex: { stem: 'Find the precision and the absolute error of each.', parts: [
      { t: 'This ruler', fig: EX[0][0] }, { t: 'This jug', fig: EX[1][0] }, 'A path 24 m long, to the nearest metre', 'A bag of flour with a mass of 3.6 kg'] },
    exAns: [both(EX[0]), both(EX[1]), `precision ${prec('24 m')}, absolute error ${aerr('24 m')}`, `precision ${prec('3.6 kg')}, absolute error ${aerr('3.6 kg')}`],
    hint: 'The precision of a measurement is the place value of its last digit: 3.6 kg is to the nearest 0.1 kg. Absolute error = precision ÷ 2.',
    rounds: [
      round('write the precision of each measurement.', ['7 m', '3.6 cm', '12.45 kg', '58 mm', '2.8 L', '0.75 t', '104 g', '9.3 s'], (m) => m, prec),
      round('write the absolute error of each measurement.', ['15 m', '6.2 kg', '43 mL', '8.25 m', '125 cm', '0.4 L', '19.75 s', '312 g'], (m) => m, aerr),
      round('write the precision and the absolute error of each scale.', SCALES.map((x, i) => [...x, NAMES[i]]), ([fig, , , t]) => ({ t, fig }), both),
    ],
  },
  medium: {
    ex: { stem: 'Limits of accuracy: measurement − absolute error to measurement + absolute error.', parts: [
      'A plank is 2.45 m long. Find its precision and absolute error.', 'Write the limits of the plank’s length in part a.',
      'Jo is 162 cm tall, to the nearest cm. Write the limits.', 'A jug marked every 50 mL shows 650 mL. Write the limits.'] },
    exAns: [`precision ${prec('2.45 m')}, absolute error ${aerr('2.45 m')}`, limits('2.45 m'), limits('162 cm'), limits('650 mL', 25)],
    hint: 'Smallest = measurement − absolute error · Largest = measurement + absolute error',
    rounds: [
      round('write the absolute error of each measurement.', ['3.25 kg', '0.8 m', '14.6 L', '7.125 km', '0.04 g', '2.05 m', '120.5 cm', '6.375 t'], (m) => m, aerr),
      round('write the smallest and largest possible true value.', ['24 m', '6.4 cm', '153 g', '5.75 kg', '9.8 s', '72 kg', '1.6 L', '0.45 m'], (m) => m, (m) => limits(m)),
      problems('solve each problem. Show your working.', [
        ['Kai weighs 250 g of flour on scales marked every 10 g. Write the limits of the mass.', limits('250 g', 5)],
        ['A rope is 12.5 m long, to the nearest 0.1 m. Could it really be 12.56 m? Explain.', `No: the limits are ${limits('12.5 m')}, and 12.56 m is longer than 12.55 m`],
      ]),
    ],
  },
  mixed: mix(
    ['What is the precision of 4.75 m?', prec('4.75 m'), '10.2'],
    ['Convert 3.2 km to m.', u(conv(3.2, 'km', 'm'), 'm'), '10.1'],
    every('A jug is', 10, 'mL'),
    ['Find 5% of 60.', num(0.05 * 60), 'Year 8'],
    ['Write the limits of 18 cm.', limits('18 cm'), '10.2'],
    ['Convert 750 mL to L.', u(conv(750, 'mL', 'L'), 'L'), '10.1'],
    every('Scales are', 20, 'g'),
    ['What is the absolute error of 6.3 L?', aerr('6.3 L'), '10.2'],
  ),
};
