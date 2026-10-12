// Lesson 10.3 Percentage error (two pages: Easy, then Medium, then Mixed practice). See lib/lesson-two.js for the fields.
const { num, u, conv, meas, limits, pctErr, round, problems, mix } = require('../helpers');

// Percentage error of a measurement such as '24 m' (e: an absolute error other than half the last place), as text
const pe = (s, dp, e) => { const m = meas(s); return `${num(pctErr(e ?? m.e, m.v), dp)}%`; };
// The working: 0.5 ÷ 24 × 100 = 2.08%
const work = (s, dp, e) => { const m = meas(s); return `${num(e ?? m.e)} ÷ ${num(m.v)} × 100 = ${pe(s, dp, e)}`; };

module.exports = {
  code: '10.3', title: 'Percentage error',
  li: 'calculate the percentage error of a measurement, and use it to compare accuracy.',
  sc: ['find the absolute error of a measurement', 'calculate percentage error = absolute error ÷ measurement × 100%', 'decide which measurement is more accurate'],
  easy: {
    ex: { stem: 'Find the percentage error of each measurement.', parts: ['20 m, to the nearest metre', '4 kg, to the nearest kilogram', '2.5 L', '50 cm, to the nearest centimetre'] },
    exAns: [work('20 m'), work('4 kg'), work('2.5 L'), work('50 cm')],
    hint: 'Step 1: absolute error = precision ÷ 2. Step 2: percentage error = absolute error ÷ measurement × 100%.',
    rounds: [
      round('find the percentage error. Each is to the nearest whole unit.', ['10 m', '25 cm', '50 kg', '4 m', '20 s', '100 g', '5 L', '40 mm'], (m) => m, (m) => pe(m)),
      round('find the percentage error of each measurement.', ['2.5 m', '0.5 kg', '1.6 L', '12.5 cm', '0.2 km', '0.4 t', '6.25 s', '0.8 m'], (m) => m, (m) => pe(m)),
      round('find the percentage error, correct to one decimal place.', ['7 m', '15 cm', '9 kg', '30 s', '3.7 L', '0.6 m', '45 g', '2.3 km'], (m) => m, (m) => pe(m, 1)),
    ],
  },
  medium: {
    ex: { stem: 'Use a calculator. Give each answer correct to 2 decimal places.', parts: [
      'A yacht is 24 m long. Find its absolute error and percentage error.', 'A parcel has a mass of 3.25 kg. Find its percentage error.',
      'A jug marked every 25 mL shows 375 mL. Find the percentage error.', 'Which of a, b and c is the most accurate? Why?'] },
    exAns: [`0.5 m; ${work('24 m', 2)}`, work('3.25 kg', 2), `12.5 ÷ 375 × 100 = ${pe('375 mL', 2, 12.5)}`, `b: it has the smallest percentage error (${pe('3.25 kg', 2)})`],
    hint: 'The smaller the percentage error, the more accurate the measurement. Use the instrument’s precision when it is given.',
    rounds: [
      round('find the percentage error, correct to 2 decimal places.', ['24 m', '3.6 cm', '12.45 kg', '175 cm', '0.8 L', '2.35 m', '48 s', '9.5 kg'], (m) => m, (m) => pe(m, 2)),
      round('find the percentage error, correct to 2 decimal places.', [['350 g', 'on scales marked every 10 g', 5], ['75 mL', 'in a jug marked every 25 mL', 12.5], ['38°C', 'on a thermometer marked every 2°', 1], ['1.2 m', 'on a tape marked every 5 cm', 0.025]],
        ([m, d]) => `${m} ${d}`, ([m, , e]) => pe(m.replace('°C', ' °C'), 2, e)),
      problems('solve each problem. Show your working.', [
        ['Mia’s pencil is 15 cm long and she is 168 cm tall, both to the nearest cm. Which is more accurate?', `height: ${pe('168 cm', 2)} is smaller than ${pe('15 cm', 2)}`],
        ['A 100 m sprint is timed as 12.4 s. Find the percentage error of the time.', pe('12.4 s', 2)],
      ]),
    ],
  },
  mixed: mix(
    ['Find the percentage error of 8 m, to the nearest metre.', pe('8 m'), '10.3'],
    ['Write the limits of 5.3 kg.', limits('5.3 kg'), '10.2'],
    ['A scale marked every 20 g shows 400 g. Find the percentage error.', pe('400 g', undefined, 10), '10.3'],
    ['Convert 4500 g to kg.', u(conv(4500, 'g', 'kg'), 'kg'), '10.1'],
    ['Find the percentage error of 0.5 L.', pe('0.5 L'), '10.3'],
    ['Which is more accurate: 10 m or 100 m, each to the nearest metre?', `100 m (${pe('100 m')}, not ${pe('10 m')})`, '10.3'],
    ['Find the area of a triangle with base 10 cm and height 6 cm.', u(0.5 * 10 * 6, 'cm²'), 'Year 8'],
    ['Find the percentage error of 2.5 cm.', pe('2.5 cm'), '10.3'],
  ),
};
