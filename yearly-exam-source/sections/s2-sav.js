// Section 2: Surface area and volume (Chapter 10). 24 marks: 5 multiple choice (1 mark each), short answer
// (11 marks), 2 worded problems (4 marks each). Levels: 17 green, 7 blue.
//
// PLACEHOLDERS: the three questions below only prove the pipeline. Replace them all with the real questions
// (new numbers and contexts in the style of the GREEN and BLUE Test yourself 10 questions). See README.md.
'use strict';
const { num, dp, unit, pi, PI, q } = require('../lib/helpers');
const F = require('../lib/figs');

module.exports = {
  id: 's2',
  title: 'Surface area and volume',
  short: 'Surface area and volume',
  questions: [
    // ---------------------------------------------------------------- multiple choice
    q(() => {
      const s = 5;
      return {
        type: 'mc', level: 'green', src: 'PLACEHOLDER (TY10 style)', topic: 'Volume of a cube',
        text: `[PLACEHOLDER] What is the volume of a cube with sides of ${s} cm?`,
        options: [unit(s * 3, 'cm³'), unit(s * s, 'cm³'), unit(s ** 3, 'cm³'), unit(6 * s * s, 'cm³')], answer: 2,
      };
    }),

    // ---------------------------------------------------------------- short answer
    q(() => {
      const r = 4, h = 11;
      const V = pi * r * r * h;
      return {
        type: 'sa', marks: 2, level: 'green', src: 'PLACEHOLDER (TY10 style)', topic: 'Volume of a cylinder',
        text: '[PLACEHOLDER] Find the volume of this cylinder, correct to 1 decimal place.',
        fig: F.cylinder({ r, h, unit: 'cm', size: 26 }),
        formula: `Volume of a cylinder: <i>V</i> = ${PI}<i>r</i>²<i>h</i>`,
        answer: unit(V, 'cm³', 1),
        working: [`<i>V</i> = ${PI} × ${r}² × ${h}`],
        marking: ['correct substitution into V = πr²h', `${dp(V, 1)} cm³`],
      };
    }),

    // ---------------------------------------------------------------- worded problems
    q(() => {
      const l = 1.2, w = 0.8, h = 0.5;
      const V = l * w * h, L = V * 1000;
      const SA = l * w + 2 * l * h + 2 * w * h; // open top
      return {
        type: 'worded', src: 'PLACEHOLDER (TY10 style)', topic: 'Volume, capacity and surface area of a prism',
        text: '[PLACEHOLDER] A fish tank is a rectangular prism with an open top.',
        fig: F.rectPrism({ l, w, h, unit: 'm' }),
        parts: [
          { text: 'Find the volume of the tank in m³.', marks: 1, level: 'green', answer: unit(V, 'm³'), working: [`${l} × ${w} × ${h}`], marking: [`${num(V)} m³`] },
          { text: 'How many litres of water does the tank hold? (1 m³ = 1000 L)', marks: 1, level: 'green', answer: unit(L, 'L'), working: [`${num(V)} × 1000`], marking: [`${num(L)} L (follow-through from a)`] },
          { text: 'Glass for the tank costs $45 per m². Find the area of glass needed (no lid) and its cost.', marks: 2, level: 'blue',
            answer: `${unit(SA, 'm²')}; $${dp(SA * 45, 2)}`, working: [`Base ${l} × ${w} = ${num(l * w)}`, `Sides 2 × ${l} × ${h} + 2 × ${w} × ${h} = ${num(2 * l * h + 2 * w * h)}`],
            marking: ['area of glass 2.96 m²', 'cost $133.20 (follow-through)'] },
        ],
      };
    }),
  ],
};
