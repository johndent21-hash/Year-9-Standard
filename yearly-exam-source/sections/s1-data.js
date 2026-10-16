// Section 1: Data (Chapter 9 Analysing data). 25 marks: 5 multiple choice (1 mark each), short answer (12 marks),
// 2 worded problems (4 marks each). Levels: 17 green, 8 blue.
//
// PLACEHOLDERS: the three questions below only prove the pipeline. Replace them all with the real questions
// (new numbers and contexts in the style of the GREEN and BLUE Test yourself 9 questions). See README.md.
'use strict';
const { num, dp, list, mean, median, modes, range, sum, freqStats, expand, frac, v, q } = require('../lib/helpers');
const F = require('../lib/figs');

module.exports = {
  id: 's1',
  title: 'Data',
  short: 'Data',
  questions: [
    // ---------------------------------------------------------------- multiple choice
    q(() => {
      const data = [1, 2, 3, 3, 4, 4, 4, 4, 5, 6, 8];
      const m = modes(data)[0];
      return {
        type: 'mc', level: 'green', src: 'PLACEHOLDER (TY9 Q1 style)', topic: 'Mode from a dot plot',
        text: '[PLACEHOLDER] The dot plot shows the number of goals scored by a netball team in each game. What is the mode?',
        fig: F.dotPlot({ data, min: 0, max: 8, xTitle: 'Goals scored' }), figPos: 'right',
        options: [num(range(data)), num(m), num(m + 1), num(data.length)], answer: 1,
        why: `${m} occurs most often (${data.filter((x) => x === m).length} times).`,
      };
    }),

    // ---------------------------------------------------------------- short answer
    q(() => {
      const data = [23, 25, 31, 34, 34, 38, 42, 45, 47, 51, 56];
      const med = median(data), rng = range(data);
      return {
        type: 'sa', src: 'PLACEHOLDER (TY9 Q3 style)', topic: 'Stem-and-leaf plot: median and range',
        text: '[PLACEHOLDER] The stem-and-leaf plot shows the ages of the people at a family lunch.',
        fig: F.stemLeaf({ data, key: '2 | 3 = 23' }),
        parts: [
          { text: 'Find the median age.', marks: 1, level: 'green', answer: `${num(med)}`, working: [`11 values: the median is the 6th value`], marking: ['median 38'] },
          { text: 'Find the range.', marks: 1, level: 'green', answer: `${num(rng)}`, working: [`${Math.max(...data)} − ${Math.min(...data)}`], marking: ['range 33'] },
        ],
      };
    }),

    // ---------------------------------------------------------------- worded problems
    q(() => {
      const values = [0, 1, 2, 3, 4], freqs = [4, 7, 6, 2, 1];
      const st = freqStats(values, freqs);
      const all = expand(values, freqs);
      return {
        type: 'worded', src: 'PLACEHOLDER (TY9 Q4 style)', topic: 'Frequency table and histogram',
        text: '[PLACEHOLDER] A group of Year 9 students were asked how many pets they have. The results are shown in the frequency table and the histogram.',
        fig: [F.freqTable({ values, freqs, head: ['Pets (<i>x</i>)', 'Frequency (<i>f</i>)'] }), F.histogram({ labels: values, freq: freqs, xTitle: 'Number of pets', yMax: 8 })],
        parts: [
          { text: 'How many students were surveyed?', marks: 1, level: 'green', answer: num(st.n), working: [`${freqs.join(' + ')}`], marking: [`${st.n}`] },
          { text: 'What is the mode?', marks: 1, level: 'green', answer: `${num(modes(all)[0])} pet`, marking: ['1 pet (the highest column)'] },
          { text: 'Find the mean number of pets, correct to 1 decimal place.', marks: 2, level: 'blue',
            answer: `${dp(st.mean, 1)} pets`, working: [`Sum of <i>f</i> × <i>x</i> = ${st.fx.join(' + ')} = ${st.sumFx}`, `Mean = ${frac(st.sumFx, st.n)}`],
            marking: ['correct sum of f × x (follow-through from the table)', `${dp(st.mean, 1)}`], notes: `Accept ${dp(st.mean, 2)}. Follow-through from part a.` },
        ],
      };
    }),
  ],
};
