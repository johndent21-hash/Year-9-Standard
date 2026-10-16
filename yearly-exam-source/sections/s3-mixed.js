// Section 3: Mixed: Chapters 1-8 (1 Algebra, 2 Pythagoras' theorem, 3 Numeracy and calculation, 4 Trigonometry,
// 5 Indices, 6 networks only (no geometry), 7 Equations, 8 Earning money). 21 marks: 5 multiple choice (1 mark each),
// short answer (10 marks), 2 worded problems (3 marks each). Levels: 15 green, 6 blue.
// No surds and no exact-value answers: Pythagoras answers are rounded decimals. Nothing from PATH or extension.
//
// PLACEHOLDERS: the three questions below only prove the pipeline. Replace them all. See README.md.
'use strict';
const { num, dp, money, unit, hyp, v, q } = require('../lib/helpers');
const F = require('../lib/figs');

module.exports = {
  id: 's3',
  title: 'Mixed: Chapters 1-8',
  short: 'Mixed: Chapters 1-8',
  questions: [
    // ---------------------------------------------------------------- multiple choice
    q(() => ({
      type: 'mc', level: 'green', src: 'PLACEHOLDER (TY5 style)', topic: 'Index laws',
      text: `[PLACEHOLDER] Simplify ${v('a')}<sup>5</sup> × ${v('a')}<sup>3</sup>.`,
      options: [`${v('a')}<sup>2</sup>`, `${v('a')}<sup>8</sup>`, `${v('a')}<sup>15</sup>`, `2${v('a')}<sup>8</sup>`], answer: 1,
    })),

    // ---------------------------------------------------------------- short answer
    q(() => {
      const a = 7, b = 11;
      const c = hyp(a, b);
      return {
        type: 'sa', marks: 2, level: 'green', src: 'PLACEHOLDER (TY2 style)', topic: "Pythagoras' theorem: hypotenuse",
        text: `[PLACEHOLDER] Find the value of ${v('x')}, correct to 1 decimal place.`,
        fig: F.rightTriangle({ base: b, height: a, unit: 'cm', labels: { hyp: `${v('x')} cm` } }),
        formula: `Pythagoras' theorem: <i>c</i>² = <i>a</i>² + <i>b</i>²`,
        answer: unit(c, 'cm', 1), working: [`${v('x')}² = ${a}² + ${b}² = ${a * a + b * b}`, `${v('x')} = √${a * a + b * b}`],
        marking: [`${v('x')}² = ${a * a + b * b}`, `${dp(c, 1)} cm`],
      };
    }),

    // ---------------------------------------------------------------- worded problems
    q(() => {
      const rate = 24.6, hours = 38, ot = 4;
      const normal = rate * hours, over = ot * 1.5 * rate;
      return {
        type: 'worded', src: 'PLACEHOLDER (TY8 style)', topic: 'Wages and overtime',
        text: `[PLACEHOLDER] Mia works at a garden centre for ${money(rate)} per hour. Last week she worked ${hours} hours at the normal rate and ${ot} hours of overtime at time-and-a-half.`,
        parts: [
          { text: 'Find her pay for the normal hours.', marks: 1, level: 'green', answer: money(normal, 2), working: [`${hours} × ${money(rate)}`], marking: [money(normal, 2)] },
          { text: 'Find her total pay for the week.', marks: 2, level: 'blue', answer: money(normal + over, 2),
            working: [`Overtime: ${ot} × 1.5 × ${money(rate)} = ${money(over, 2)}`, `${money(normal, 2)} + ${money(over, 2)}`],
            marking: [`overtime pay ${money(over, 2)}`, `total ${money(normal + over, 2)} (follow-through from a)`] },
        ],
      };
    }),
  ],
};
