// Lesson 10.1 Metric units (two pages: Easy, then Medium, then Mixed practice). See lib/lesson-two.js for the fields.
const { num, u, UNIT, conv, cq, ca, round, problems, mix } = require('../helpers');
// A hint as a list of facts: a line can wrap only between facts, never inside one ('1 s =' / '1000 ms').
const facts = (...list) => list.map((f) => f.replace(/ /g, '\u00a0')).join(' · ');
// The Easy example: each conversion, and its working (8 × 1000 = 8 000 m; 4 500 ÷ 1000 = 4.5 L)
const EX1 = [[8, 'km', 'm'], [250, 'cm', 'm'], [3.5, 'kg', 'g'], [4500, 'mL', 'L']];
const exWork = ([v, a, b]) => { const f = UNIT[a] / UNIT[b]; return f > 1 ? `${num(v)} × ${f} = ${ca([v, a, b])}` : `${num(v)} ÷ ${+(1 / f).toPrecision(12)} = ${ca([v, a, b])}`; };

module.exports = {
  code: '10.1', title: 'Metric units',
  li: 'convert between metric units, and between units of time and digital storage.',
  sc: ['convert units of length, mass and capacity', 'convert units of time', 'use the prefixes mega-, giga- and micro-'],
  easy: {
    ex: { stem: 'Convert each one. To a smaller unit, multiply. To a bigger unit, divide.', parts: EX1.map(cq) },
    exAns: EX1.map(exWork),
    hint: facts('1 km = 1000 m', '1 m = 100 cm', '1 cm = 10 mm', '1 t = 1000 kg', '1 kg = 1000 g', '1 g = 1000 mg', '1 kL = 1000 L', '1 L = 1000 mL'),
    rounds: [
      round('convert each length.', [[6, 'km', 'm'], [3000, 'm', 'km'], [4, 'm', 'cm'], [700, 'cm', 'm'], [9, 'cm', 'mm'], [120, 'mm', 'cm'], [2.5, 'km', 'm'], [45, 'cm', 'm']], cq, ca),
      round('convert each mass.', [[5, 'kg', 'g'], [2000, 'g', 'kg'], [3, 't', 'kg'], [6500, 'kg', 't'], [0.8, 'kg', 'g'], [750, 'g', 'kg'], [4000, 'mg', 'g'], [1.2, 't', 'kg']], cq, ca),
      round('convert each capacity.', [[7, 'L', 'mL'], [3000, 'mL', 'L'], [2, 'kL', 'L'], [4500, 'L', 'kL'], [1.5, 'L', 'mL'], [250, 'mL', 'L'], [0.6, 'kL', 'L'], [80, 'mL', 'L']], cq, ca),
    ],
  },
  medium: {
    ex: { stem: 'Convert each one. Hours and minutes are not metric: 1 h = 60 min and 1 min = 60 s.', parts: ['3.5 h to min', '150 s to min', '4.2 GB to MB', '2 500 000 μm to m'] },
    exAns: [`3.5 × 60 = ${u(210, 'min')}`, `150 ÷ 60 = ${u(2.5, 'min')}`, `4.2 × 1000 = ${u(4200, 'MB')}`, `2 500 000 ÷ 1 000 000 = ${u(2.5, 'm')}`],
    hint: facts('mega- (M) = 1 000 000', 'giga- (G) = 1 000 000 000', 'tera- (T) = 1000 giga-', 'micro- (μ) = one-millionth', '1 s = 1000 ms'),
    rounds: [
      round('convert each time.', [[5, 'min', 's'], [4, 'h', 'min'], [180, 's', 'min'], [2.5, 'h', 'min'], [90, 'min', 'h'], [3, 'day', 'h'], [4000, 'ms', 's'], [1.5, 'min', 's']], cq, ca),
      round('convert using the prefixes.', [[3, 'GB', 'MB'], [4500, 'MB', 'GB'], [2.4, 'TB', 'GB'], [34000, 'B', 'kB'], [2.6, 'Mm', 'm'], [0.7, 's', 'ms'], [3000000, 'μm', 'm'], [5, 'ms', 'μs']], cq, ca),
      problems('solve each problem. Show your working.', [
        ['A phone has 64 GB of free space. Each video is 800 MB. How many videos fit?', `${num(conv(64, 'GB', 'MB') / 800)} videos`],
        ['A movie runs for 135 minutes. Write this in hours and minutes.', `${Math.floor(135 / 60)} h ${135 % 60} min`],
      ]),
    ],
  },
  mixed: mix(
    ['Convert 0.75 km to m.', u(conv(0.75, 'km', 'm'), 'm'), '10.1'],
    ['Find the area of a rectangle 8 cm long and 5 cm wide.', u(8 * 5, 'cm²'), 'Year 8'],
    ['Which is longer: 1.2 m or 115 cm?', `1.2 m (= ${u(conv(1.2, 'm', 'cm'), 'cm')})`, '10.1'],
    ['Round 3.476 to one decimal place.', num(3.476, 1), 'Year 8'],
    ['How many seconds are in 2 hours?', u(conv(2, 'h', 's'), 's'), '10.1'],
    ['Find the perimeter of a square with sides of 7 m.', u(4 * 7, 'm'), 'Year 8'],
    ['A 2 L jug is filled with 400 mL cups of water. How many cups does it take?', `${num(conv(2, 'L', 'mL') / 400)} cups`, '10.1'],
    ['Convert 2.5 GB to MB.', u(conv(2.5, 'GB', 'MB'), 'MB'), '10.1'],
  ),
};
