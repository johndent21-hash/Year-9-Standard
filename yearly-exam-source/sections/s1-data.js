// Section 1: Data (Chapter 9 Analysing data). 17 marks: 4 multiple choice (1 mark each), short answer (3 marks),
// 2 worded problems (4 and 6 marks). Levels: 11 green, 6 blue.
// A question part that takes 2 steps is worth 2 marks, 3 steps 3 marks (the teacher's rule, 2026 edit). The mean, the
// median and the range are each found once or twice only; the rest is reading graphs and describing or comparing data.
//
// Every question is a NEW question in the style of a GREEN or BLUE Test yourself 9 question (src says which).
// Not used: TY9 Q8 (sample or census) and Q10, Q11 (bias, 9.06): these are PATH.
//   Green (11): MC 1-4 (4), Q5 (3), Q6 (4).
//   Blue (6):   Q7 (6).
'use strict';
const { num, dp, list, nw, sum, sorted, mean, median, modes, range, expand, q } = require('../lib/helpers');
const F = require('../lib/figs');

const NB = '\u00a0';                 // no-break space
const GAP = `,${NB}${NB} `;          // a wider gap between listed values
const MEAN_F = 'Mean = sum of the scores ÷ number of scores';
const check = (cond, msg) => { if (!cond) throw new Error(`s1-data: ${msg}`); };

module.exports = {
  id: 's1',
  title: 'Data',
  short: 'Data',
  questions: [
    // ================================================================ multiple choice (4 x 1 mark, green)

    // 1. Classifying data (TY9 Q9)
    q(() => ({
      type: 'mc', level: 'green', src: 'TY9 Q9 (9.05, green)', topic: 'Classifying data',
      text: 'Which of the following is <b>numerical continuous</b> data?',
      options: [
        'The number of goals in a hockey match',
        'The colours of cars in a car park',
        'Shirt sizes (S, M, L, XL)',
        'The time taken to swim 50 m',
      ],
      answer: 3, optLayout: 'grid',
      why: 'Time is measured, so it is numerical continuous. A is numerical discrete (counted), B is categorical nominal, C is categorical ordinal.',
    })),

    // 2. Shape of a distribution from a dot plot (TY9 Q6a)
    q(() => {
      const counts = { 2: 1, 3: 1, 4: 1, 5: 2, 6: 2, 7: 3, 8: 5, 9: 6, 10: 3 };
      const data = Object.entries(counts).flatMap(([k, n]) => Array(n).fill(+k));
      const mn = mean(data), md = median(data);
      check(mn < md, 'MC2 data should be negatively skewed (mean below the median)');
      return {
        type: 'mc', level: 'green', src: 'TY9 Q6a (9.03, green)', topic: 'Shape of a distribution (dot plot)',
        text: `The dot plot shows the scores (out of 10) of ${data.length} students in a spelling quiz. Which statement best describes the data?`,
        fig: F.dotPlot({ data, min: 0, max: 10, unitW: 4.6, xTitle: 'Score' }), figPos: 'right',
        options: [
          'Positively skewed, clustered at 8 and 9',
          'Negatively skewed, clustered at 8 and 9',
          'Negatively skewed, clustered at 2 and 3',
          'Symmetrical, clustered at 8 and 9',
        ],
        answer: 1, optLayout: 'stack',
        why: `Most scores are high (a cluster at 8 and 9) with a long tail to the left (low scores), so the data is negatively skewed. (Mean ${dp(mn, 1)} is below the median ${num(md)}.)`,
      };
    }),

    // 3. Mode from a histogram (TY9 Q4b)
    q(() => {
      const labels = [1, 2, 3, 4, 5, 6], freq = [5, 9, 4, 3, 2, 1];
      const all = expand(labels, freq);
      const mo = modes(all);
      check(mo.length === 1, 'MC3 needs one mode');
      const opts = [mo[0], (labels[0] + labels[labels.length - 1]) / 2, Math.max(...labels), Math.max(...freq)];
      check(new Set(opts).size === 4, 'MC3 options must differ');
      return {
        type: 'mc', level: 'green', src: 'TY9 Q4b (9.02, green)', topic: 'Mode from a histogram',
        text: `The histogram shows the number of people in each of ${all.length} cars that arrived at a beach car park. What is the mode?`,
        fig: F.histogram({ labels, freq, colW: 6.5, plotH: 34, yMax: 10, xTitle: 'Number of people in the car' }), figPos: 'right',
        options: opts.map((x) => num(x)), answer: 0, optLayout: 'row',
        why: `The tallest column is at ${mo[0]} (frequency ${Math.max(...freq)}), so the mode is ${mo[0]} people. ${Math.max(...freq)} is the frequency, not the score.`,
      };
    }),

    // 4. Effect of an outlier on the measures of centre (TY9 Q2c, Q3c-d)
    q(() => {
      const goals = [5, 7, 6, 8, 6, 21, 7, 5, 6, 8];
      const out = Math.max(...goals);
      const rest = goals.filter((x) => x !== out);
      const dMean = Math.abs(mean(goals) - mean(rest)), dMed = Math.abs(median(goals) - median(rest));
      const dMode = Math.abs(modes(goals)[0] - modes(rest)[0]);
      check(dMean > dMed && dMed > dMode, 'MC4: the mean must change the most');
      return {
        type: 'mc', level: 'green', src: 'TY9 Q2c and Q3c-d (9.01, 9.02, green)', topic: 'Effect of an outlier',
        text: [`A water polo team scored these numbers of goals in ${goals.length} games:`, list(goals, GAP),
          `Which measure of centre changes the most if the outlier, ${out}, is removed?`],
        options: ['The mode', 'The median', 'The mean', 'All three change by the same amount'],
        answer: 2, optLayout: 'grid',
        why: `Mean ${dp(mean(goals), 1)} → ${dp(mean(rest), 2)} (changes by ${dp(dMean, 2)}); median ${num(median(goals))} → ${num(median(rest))}; mode ${modes(goals)[0]} → ${modes(rest)[0]} (no change).`,
      };
    }),

    // ================================================================ short answer (3 marks, green)

    // 5. Mean and median from a stem-and-leaf plot (TY9 Q3b)
    q(() => {
      const mins = [12, 15, 18, 21, 24, 24, 27, 30, 33, 35, 36];
      const n = mins.length, tot = sum(mins), mn = mean(mins), md = median(mins), k = (n + 1) / 2;
      check(n % 2 === 1 && Number.isInteger(mn) && mn !== md, 'Q5: odd number of scores, a whole-number mean that differs from the median');
      return {
        type: 'sa', src: 'TY9 Q3b (9.02, green)', topic: 'Mean and median from a stem-and-leaf plot',
        text: `The stem-and-leaf plot shows the number of minutes that ${n} students spent on homework last night.`,
        fig: F.stemLeaf({ data: mins, key: '2 | 4 = 24 minutes' }),
        formula: MEAN_F,
        parts: [
          { text: 'Find the mean.', marks: 2, level: 'green',
            answer: `${num(mn)} minutes`, working: [`Sum = ${mins.join(' + ')} = ${tot}`, `Mean = ${tot} ÷ ${n}`],
            marking: [`sum of the scores: ${tot}`, `mean ${num(mn)}`],
            notes: `Follow-through: a wrong sum divided correctly by ${n} earns the second mark.` },
          { text: 'Find the median.', marks: 1, level: 'green',
            answer: `${num(md)} minutes`, working: [`${n} scores: the median is the ${k}th score`],
            marking: [`${num(md)}`] },
        ],
      };
    }),

    // ================================================================ worded problems (4 + 6 marks)

    // 6. Reading a column graph: difference, total, percentage (TY9 Q4: reading a graph)
    q(() => {
      const sports = ['Soccer', 'Netball', 'Surfing', 'Tennis', 'Touch'], freq = [16, 8, 20, 4, 12];
      const iA = 2, iB = 3;                              // surfing and tennis
      const tot = sum(freq), both = freq[iA] + freq[iB], pct = (both / tot) * 100;
      check(Number.isInteger(pct) && freq.indexOf(Math.max(...freq)) === iA, 'Q6: a whole-number percentage; surfing the most popular');
      return {
        type: 'worded', keepTogether: true, src: 'TY9 Q4 (9.02, green)', topic: 'Reading a column graph',
        text: 'Year 9 students each chose one sport for Friday afternoon. The column graph shows how many students chose each sport.',
        fig: F.histogram({ labels: sports, freq, kind: 'column', colW: 10, plotH: 30, yMax: 24, yStep: 4, xTitle: 'Sport', yTitle: 'Number of students' }),
        parts: [
          { text: `How many more students chose ${sports[iA].toLowerCase()} than ${sports[iB].toLowerCase()}?`, marks: 1, level: 'green', space: 20,
            answer: `${freq[iA] - freq[iB]} students`, working: [`${freq[iA]} − ${freq[iB]}`],
            marking: [`${freq[iA] - freq[iB]}`] },
          { text: 'How many students were surveyed altogether?', marks: 1, level: 'green', space: 20,
            answer: `${tot} students`, working: [`${freq.join(' + ')}`],
            marking: [`${tot}`] },
          { text: `What percentage of the students chose ${sports[iA].toLowerCase()} or ${sports[iB].toLowerCase()}?`, marks: 2, level: 'green', space: 30,
            answer: `${num(pct)}%`, working: [`${freq[iA]} + ${freq[iB]} = ${both} students`, `${both} ÷ ${tot} × 100%`],
            marking: [`${both} students chose ${sports[iA].toLowerCase()} or ${sports[iB].toLowerCase()}`, `${num(pct)}%`],
            notes: 'Follow-through from part b.' },
        ],
      };
    }),

    // 7. Comparing two data sets from a back-to-back stem-and-leaf plot (TY9 Q7)
    q(() => {
      const names = ['Kestrels', 'Tigers'];
      const K = [31, 34, 35, 37, 38, 38, 40, 41, 42, 43, 44, 46];
      const T = [22, 27, 33, 36, 39, 41, 44, 45, 47, 50, 53, 57];
      const dK = median(K), dT = median(T), rK = range(K), rT = range(T);
      const sK = sorted(K), sT = sorted(T), n = K.length;
      check(dT > dK && rK < rT, 'Q7: Tigers score more, Kestrels are more consistent');
      return {
        type: 'worded', keepTogether: true, src: 'TY9 Q7 (9.04, blue)', topic: 'Comparing two data sets (back-to-back stem-and-leaf plot)',
        text: [`The ${names[0]} and the ${names[1]} are two netball teams. The back-to-back stem-and-leaf plot shows the number of goals each team scored in its ${n} games this season.`],
        fig: F.backToBack({ left: K, right: T, heads: names, stems: [2, 5], key: '4 | 1 = 41 goals' }),
        formula: 'Range = highest score − lowest score',
        parts: [
          { text: 'Find the median number of goals for each team.', marks: 2, level: 'blue', space: 36,
            answer: `${names[0]}: ${num(dK)}; ${names[1]}: ${num(dT)}`,
            working: [`${names[0]}: (${sK[n / 2 - 1]} + ${sK[n / 2]}) ÷ 2`, `${names[1]}: (${sT[n / 2 - 1]} + ${sT[n / 2]}) ÷ 2`],
            marking: [`${names[0]} median ${num(dK)}`, `${names[1]} median ${num(dT)}`],
            notes: `Common error: one middle score only (${sK[n / 2 - 1]} or ${sK[n / 2]}; ${sT[n / 2 - 1]} or ${sT[n / 2]}): 0 marks for that team.` },
          { text: 'Which team usually scores more goals? Give a reason.', marks: 1, level: 'blue', space: 28,
            answer: `The ${names[1]}: their median (${num(dT)}) is higher than the ${names[0]}’ (${num(dK)}).`,
            marking: [`${names[1]}, with a reason that compares the medians`], notes: 'Follow-through from part a. Accept a comparison of where the scores cluster.' },
          { text: 'Which team is more consistent? Find the range of each team to explain.', marks: 3, level: 'blue', space: 50,
            answer: `The ${names[0]}: their range is ${rK} goals ${nw(`(${sK[n - 1]} − ${sK[0]})`)}, much smaller than the ${names[1]}’ ${rT} goals ${nw(`(${sT[n - 1]} − ${sT[0]})`)}.`,
            working: [`${names[0]}: ${sK[n - 1]} − ${sK[0]} = ${rK}`, `${names[1]}: ${sT[n - 1]} − ${sT[0]} = ${rT}`],
            marking: [`${names[0]} range ${rK}`, `${names[1]} range ${rT}`, `${names[0]}, because their range is smaller`],
            notes: 'Follow-through: the third mark for choosing the team with the smaller of the student’s two ranges.' },
        ],
      };
    }),
  ],
};
