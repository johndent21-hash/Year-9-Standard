// Section 1: Data (Chapter 9 Analysing data). 25 marks: 5 multiple choice (1 mark each), short answer (12 marks),
// 2 worded problems (4 marks each). Levels: 17 green, 8 blue.
//
// Every question is a NEW question in the style of a GREEN or BLUE Test yourself 9 question (src says which).
// Not used: TY9 Q8 (sample or census) and Q10, Q11 (bias, 9.06): these are PATH.
//   Green (17): MC 1-5 (5), Q6-9 (4), Q10 (4), Q12 (4).
//   Blue (8):   Q11 (4), Q13 (4).
'use strict';
const { num, dp, money, unit, list, nw, sum, sorted, mean, median, modes, range, freqStats, expand, q } = require('../lib/helpers');
const F = require('../lib/figs');

const NB = '\u00a0';                 // no-break space
const GAP = `,${NB}${NB} `;          // a wider gap between listed values
const MEAN_F = 'Mean = sum of the scores ÷ number of scores';
const RANGE_F = 'Range = highest score − lowest score';
const check = (cond, msg) => { if (!cond) throw new Error(`s1-data: ${msg}`); };

// Back-to-back stem-and-leaf rows as text lines for the marking guide: "9 7 6 | 2 | 1 2 3".
const b2bLines = (left, right, stems) => stems.map((s) => {
  const L = sorted(left.filter((x) => Math.floor(x / 10) === s)).map((x) => x % 10).reverse();
  const R = sorted(right.filter((x) => Math.floor(x / 10) === s)).map((x) => x % 10);
  return `${L.length ? L.join(NB + NB) : '–'}${NB}${NB}|${NB}${NB}<b>${s}</b>${NB}${NB}|${NB}${NB}${R.length ? R.join(NB + NB) : '–'}`;
});

module.exports = {
  id: 's1',
  title: 'Data',
  short: 'Data',
  questions: [
    // ================================================================ multiple choice (5 x 1 mark, green)

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

    // 3. Median from a stem-and-leaf plot (TY9 Q3b)
    q(() => {
      const ages = [18, 19, 23, 25, 25, 27, 30, 32, 34, 36, 36, 36, 41, 45, 58];
      const s = sorted(ages), n = s.length, md = median(ages);
      check(n % 2 === 1, 'MC3 needs an odd number of ages');
      const k = (n + 1) / 2;                              // position of the median
      const opts = [s[k - 2], (s[k - 2] + s[k - 1]) / 2, md, modes(ages)[0]];
      check(new Set(opts).size === 4 && md === s[k - 1], 'MC3 options must differ');
      return {
        type: 'mc', level: 'green', src: 'TY9 Q3b (9.02, green)', topic: 'Median from a stem-and-leaf plot',
        text: `The stem-and-leaf plot shows the ages of the ${n} people in a yoga class. What is the median age?`,
        fig: F.stemLeaf({ data: ages, key: '1 | 8 = 18 years' }), figPos: 'right',
        options: opts.map((x) => num(x)), answer: 2, optLayout: 'row',
        why: `There are ${n} ages, so the median is the ${k}th age: ${md}. (${num(opts[0])} is the ${k - 1}th age, ${num(opts[1])} averages the ${k - 1}th and ${k}th ages, ${num(opts[3])} is the mode.)`,
      };
    }),

    // 4. Mode from a histogram (TY9 Q4b)
    q(() => {
      const labels = [1, 2, 3, 4, 5, 6], freq = [5, 9, 4, 3, 2, 1];
      const all = expand(labels, freq);
      const mo = modes(all);
      check(mo.length === 1, 'MC4 needs one mode');
      const opts = [mo[0], (labels[0] + labels[labels.length - 1]) / 2, Math.max(...labels), Math.max(...freq)];
      check(new Set(opts).size === 4, 'MC4 options must differ');
      return {
        type: 'mc', level: 'green', src: 'TY9 Q4b (9.02, green)', topic: 'Mode from a histogram',
        text: `The histogram shows the number of people in each of ${all.length} cars that arrived at a beach car park. What is the mode?`,
        fig: F.histogram({ labels, freq, colW: 6.5, plotH: 34, yMax: 10, xTitle: 'Number of people in the car' }), figPos: 'right',
        options: opts.map((x) => num(x)), answer: 0, optLayout: 'row',
        why: `The tallest column is at ${mo[0]} (frequency ${Math.max(...freq)}), so the mode is ${mo[0]} people. ${Math.max(...freq)} is the frequency, not the score.`,
      };
    }),

    // 5. Effect of an outlier on the measures of centre (TY9 Q2c, Q3c-d)
    q(() => {
      const goals = [5, 7, 6, 8, 6, 21, 7, 5, 6, 8];
      const out = Math.max(...goals);
      const rest = goals.filter((x) => x !== out);
      const dMean = Math.abs(mean(goals) - mean(rest)), dMed = Math.abs(median(goals) - median(rest));
      const dMode = Math.abs(modes(goals)[0] - modes(rest)[0]);
      check(dMean > dMed && dMed > dMode, 'MC5: the mean must change the most');
      return {
        type: 'mc', level: 'green', src: 'TY9 Q2c and Q3c-d (9.01, 9.02, green)', topic: 'Effect of an outlier',
        text: [`A water polo team scored these numbers of goals in ${goals.length} games:`, list(goals, GAP),
          `Which measure of centre changes the most if the outlier, ${out}, is removed?`],
        options: ['The mode', 'The median', 'The mean', 'All three change by the same amount'],
        answer: 2, optLayout: 'grid',
        why: `Mean ${dp(mean(goals), 1)} → ${dp(mean(rest), 2)} (changes by ${dp(dMean, 2)}); median ${num(median(goals))} → ${num(median(rest))}; mode ${modes(goals)[0]} → ${modes(rest)[0]} (no change).`,
      };
    }),

    // ================================================================ short answer (12 marks: 8 green, 4 blue)

    // 6-9. Mean, median, mode and range of a list (TY9 Q1)
    ...q(() => {
      const laps = [9, 15, 11, 12, 18, 12, 14, 10, 16, 13];
      const s = sorted(laps), n = laps.length, tot = sum(laps);
      const mn = mean(laps), md = median(laps), mo = modes(laps), rg = range(laps);
      check(mo.length === 1 && new Set([mn, md, mo[0], rg]).size === 4, 'Q6-9: mean, median, mode and range should all differ');
      const src = 'TY9 Q1 (9.01, green)';
      return [
        { type: 'info', text: [`Use this set of data for questions 6 to 9.`, `The numbers of laps swum by ${n} students at swimming training were:`, `<b>${list(laps, GAP)}</b>`] },
        {
          type: 'sa', marks: 1, level: 'green', src, topic: 'Mean of a data set',
          text: 'Find the mean.', formula: MEAN_F,
          answer: `${num(mn)} laps`,
          working: [`Sum = ${laps.join(' + ')} = ${tot}`, `Mean = ${tot} ÷ ${n}`],
          marking: [`${num(mn)}`],
        },
        {
          type: 'sa', marks: 1, level: 'green', src, topic: 'Median of a data set',
          text: 'Find the median.',
          answer: `${num(md)} laps`,
          working: [`In order: ${list(s)}`, `${n} scores: median = (${s[n / 2 - 1]} + ${s[n / 2]}) ÷ 2`],
          marking: [`${num(md)}`],
          notes: `Common error: ${s[n / 2 - 1]} or ${s[n / 2]} (one middle score only): 0 marks.`,
        },
        {
          type: 'sa', marks: 1, level: 'green', src, topic: 'Mode of a data set',
          text: 'Find the mode.',
          answer: `${num(mo[0])} laps`,
          working: [`${mo[0]} occurs ${laps.filter((x) => x === mo[0]).length} times; every other score occurs once.`],
          marking: [`${num(mo[0])}`],
        },
        {
          type: 'sa', marks: 1, level: 'green', src, topic: 'Range of a data set',
          text: 'Find the range.', formula: RANGE_F,
          answer: `${num(rg)} laps`,
          working: [`Range = ${s[n - 1]} − ${s[0]}`],
          marking: [`${num(rg)}`],
        },
      ];
    }),

    // 10. Frequency table: f x x, mean, median, range (TY9 Q4)
    q(() => {
      const values = [0, 1, 2, 3, 4, 5], freqs = [2, 6, 8, 5, 3, 2];
      const st = freqStats(values, freqs), all = expand(values, freqs);
      const md = median(all), rg = range(all), n = st.n;
      check(n % 2 === 0 && all[n / 2 - 1] === all[n / 2], 'Q10: the two middle scores should be equal');
      const cum = []; freqs.reduce((c, f) => { cum.push(c + f); return c + f; }, 0);
      return {
        type: 'sa', src: 'TY9 Q4 (9.02, green)', topic: 'Frequency table: mean, median and range',
        text: 'Students were asked how many times they went to the beach last week.', // 2 lines: room for the range note
        fig: F.freqTable({ values, freqs, head: ['Visits (<i>x</i>)', 'Frequency (<i>f</i>)'], fx: 'key', total: 'key' }),
        // one Note with a line break (two separate Notes push Q10 onto a page of its own)
        formula: `Mean = total of <i>f</i> × <i>x</i> ÷ total frequency<br>${RANGE_F}`,
        parts: [
          { text: 'Complete the table.', marks: 1, level: 'green',
            answer: `<i>f</i> × <i>x</i>: ${list(st.fx)}; totals ${n} and ${st.sumFx}`,
            marking: [`all f × x values and both totals (${n} and ${st.sumFx}) correct`] },
          { text: 'Find the mean number of visits, correct to 2 decimal places.', marks: 1, level: 'green',
            answer: `${dp(st.mean, 2)} visits`, working: [`Mean = ${st.sumFx} ÷ ${n} = ${dp(st.mean, 4)}…`],
            marking: [`${dp(st.mean, 2)}`], notes: `Follow-through from part a. ${dp(st.mean, 1)} (wrong rounding): 0 marks.` },
          { text: 'Find the median number of visits.', marks: 1, level: 'green',
            answer: `${num(md)} visits`,
            working: [`${n} scores: average of the ${n / 2}th and ${n / 2 + 1}th scores`, `Running totals ${list(cum)}: both are ${md}`],
            marking: [`${num(md)}`], notes: `Common error: ${num((values[0] + values[values.length - 1]) / 2)} (the middle of the scores 0 to 5): 0 marks.` },
          { text: 'Find the range.', marks: 1, level: 'green',
            answer: `${num(rg)} visits`, working: [`Range = ${Math.max(...all)} − ${Math.min(...all)}`],
            marking: [`${num(rg)}`], notes: `Common error: ${Math.max(...freqs)} − ${Math.min(...freqs)} = ${Math.max(...freqs) - Math.min(...freqs)} (uses the frequencies): 0 marks.` },
        ],
      };
    }),

    // 11. Two data sets: back-to-back stem-and-leaf plot and compare (TY9 Q5)
    q(() => {
      const names = ['Pete’s Pizza', 'Pizza Point'];
      const A = [18, 25, 32, 21, 27, 35, 29, 24, 41, 26];
      const B = [15, 22, 19, 28, 17, 23, 16, 30, 21, 18];
      const mA = median(A), mB = median(B);
      check(mB < mA, 'Q11: Pizza Point should be faster');
      const stems = [1, 2, 3, 4];
      return {
        type: 'sa', layout: 'rows', keepTogether: true, src: 'TY9 Q5 (9.02, blue)', topic: 'Back-to-back stem-and-leaf plot; comparing two data sets',
        text: `The delivery times (in minutes) of ${A.length} orders from each of two pizza shops are shown below.`,
        fig: F.table({ head: names, rows: A.map((a, i) => [a, B[i]]), transpose: true }), figPos: 'below',
        parts: [
          { text: 'Draw an ordered back-to-back stem-and-leaf plot of the data. Include a key.', marks: 2, level: 'blue', space: 66,
            answer: `Stems 1 to 4, ${names[0]} leaves on one side and ${names[1]} leaves on the other, all in order. Key: 2 | 1 = 21 minutes.`,
            working: [`${names[0]}${NB}${NB}|${NB}${NB}Stem${NB}${NB}|${NB}${NB}${names[1]}`, ...b2bLines(A, B, stems)],
            marking: [`stems 1 to 4 with all ${A.length} leaves on one side correct and in order`, `all ${B.length} leaves on the other side correct and in order, and a key`],
            notes: `Either shop may be on the left. Leaves on the left may increase outwards from the stem (as shown) or be written smallest first; accept either if consistent. All leaves correct but not in order: 1 mark.` },
          { text: 'Find the median delivery time for each shop.', marks: 1, level: 'blue', space: 34,
            answer: `${names[0]}: ${unit(mA, 'min')}; ${names[1]}: ${unit(mB, 'min')}`,
            working: [`${names[0]}: (${sorted(A)[4]} + ${sorted(A)[5]}) ÷ 2`, `${names[1]}: (${sorted(B)[4]} + ${sorted(B)[5]}) ÷ 2`],
            marking: ['both medians correct'], notes: 'Follow-through from the plot in part a.' },
          { text: 'Which shop delivers faster? Give a reason.', marks: 1, level: 'blue', space: 34,
            answer: `${names[1]}: its median time (${unit(mB, 'min')}) is less than the median for ${names[0]} (${unit(mA, 'min')}).`,
            marking: [`${names[1]} with a reason that compares the medians (or the means, or where the times cluster)`],
            notes: `Accept a comparison of means (${names[1]} ${unit(mean(B), 'min')}, ${names[0]} ${unit(mean(A), 'min')}). Follow-through from part b.` },
        ],
      };
    }),

    // ================================================================ worded problems (2 x 4 marks)

    // 12. Wages with an outlier: mean, median, best measure of centre (TY9 Q2)
    q(() => {
      const wages = [860, 920, 780, 1050, 840, 3600, 900, 880, 760, 950];
      const n = wages.length, tot = sum(wages), s = sorted(wages);
      const mn = mean(wages), md = median(wages);
      const boss = Math.max(...wages), others = wages.filter((x) => x !== boss), mo = mean(others);
      check(mn > s[n - 2] && Math.abs(mo - md) < Math.abs(mn - md), 'Q12: the outlier should pull the mean above the other wages');
      return {
        type: 'worded', keepTogether: true, src: 'TY9 Q2 (9.01, green)', topic: 'Mean and median with an outlier; best measure of centre',
        text: [`A surf shop has ${n} employees, including the manager. Their weekly wages are:`,
          `${wages.slice(0, 5).map((x) => money(x)).join(GAP)},<br>${wages.slice(5).map((x) => money(x)).join(GAP)}`],
        formula: MEAN_F,
        parts: [
          { text: 'Find the mean weekly wage.', marks: 1, level: 'green', space: 34,
            answer: money(mn, Number.isInteger(mn) ? 0 : 2), working: [`Sum = ${money(tot)}`, `Mean = ${money(tot)} ÷ ${n}`],
            marking: [money(mn, Number.isInteger(mn) ? 0 : 2)] },
          { text: 'Find the median weekly wage.', marks: 1, level: 'green', space: 34,
            answer: money(md), working: [`In order: ${s.map((x) => money(x)).join(', ')}`, `Median = (${money(s[n / 2 - 1])} + ${money(s[n / 2])}) ÷ 2`],
            marking: [money(md)] },
          { text: `The manager earns ${money(boss)}. Find the mean weekly wage of the other ${others.length} employees, correct to the nearest cent.`, marks: 1, level: 'green', space: 34,
            answer: money(mo, 2), working: [`Sum = ${money(tot)} − ${money(boss)} = ${money(tot - boss)}`, `Mean = ${money(tot - boss)} ÷ ${others.length} = $${num(mo, 4)}…`],
            marking: [`${money(mo, 2)} (correct to the nearest cent)`] },
          { text: 'Which measure, the mean or the median, better describes the typical weekly wage at this shop? Give a reason.', marks: 1, level: 'green', space: 34,
            answer: `The median (${money(md)}): the manager’s wage of ${money(boss)} is an outlier that pulls the mean up to ${money(mn)}, which is more than ${n - 1} of the ${n} wages.`,
            marking: ['median, with a reason about the outlier (the manager’s wage) making the mean too high'],
            notes: `Part c supports this: without the manager the mean is ${money(mo, 2)}, close to the median.` },
        ],
      };
    }),

    // 13. Comparing two data sets from a back-to-back stem-and-leaf plot (TY9 Q7)
    q(() => {
      const names = ['Kestrels', 'Tigers'];
      const K = [31, 34, 35, 37, 38, 38, 40, 41, 42, 43, 44, 46];
      const T = [22, 27, 33, 36, 39, 41, 44, 45, 47, 50, 53, 57];
      const mK = mean(K), mT = mean(T), dK = median(K), dT = median(T), rK = range(K), rT = range(T);
      const sK = sorted(K), sT = sorted(T), n = K.length;
      check(mT > mK && dT > dK && rK < rT, 'Q13: Tigers score more, Kestrels are more consistent');
      check(Math.abs(mK * 100 % 10 - 5) > 0.01 && Math.abs(mT * 100 % 10 - 5) > 0.01, 'Q13: means should not end in 5 at the 2nd decimal place');
      return {
        type: 'worded', keepTogether: true, src: 'TY9 Q7 (9.04, blue)', topic: 'Comparing two data sets (back-to-back stem-and-leaf plot)',
        text: [`The ${names[0]} and the ${names[1]} are two netball teams. The back-to-back stem-and-leaf plot shows the number of goals each team scored in its ${n} games this season.`],
        fig: F.backToBack({ left: K, right: T, heads: names, stems: [2, 5], key: '4 | 1 = 41 goals' }),
        formula: [MEAN_F, RANGE_F],
        parts: [
          { text: 'Find the mean number of goals for each team, correct to 1 decimal place.', marks: 1, level: 'blue', space: 34,
            answer: `${names[0]}: ${dp(mK, 1)}; ${names[1]}: ${dp(mT, 1)}`,
            working: [`${names[0]}: ${sum(K)} ÷ ${n} = ${dp(mK, 3)}…`, `${names[1]}: ${sum(T)} ÷ ${n} = ${dp(mT, 3)}…`],
            marking: ['both means correct to 1 decimal place'] },
          { text: 'Find the median number of goals for each team.', marks: 1, level: 'blue', space: 34,
            answer: `${names[0]}: ${num(dK)}; ${names[1]}: ${num(dT)}`,
            working: [`${names[0]}: (${sK[n / 2 - 1]} + ${sK[n / 2]}) ÷ 2`, `${names[1]}: (${sT[n / 2 - 1]} + ${sT[n / 2]}) ÷ 2`],
            marking: ['both medians correct'] },
          { text: 'Which team usually scores more goals? Give a reason.', marks: 1, level: 'blue', space: 34,
            answer: `The ${names[1]}: their mean (${dp(mT, 1)}) and median (${num(dT)}) are both higher than the ${names[0]}’ (${dp(mK, 1)} and ${num(dK)}).`,
            marking: [`${names[1]}, with a reason that compares the means or the medians`], notes: 'Follow-through from parts a and b.' },
          { text: 'Which team is more consistent? Use the range of each team to explain.', marks: 1, level: 'blue', space: 34,
            answer: `The ${names[0]}: their range is ${rK} goals ${nw(`(${sK[n - 1]} − ${sK[0]})`)}, much smaller than the ${names[1]}’ ${rT} goals ${nw(`(${sT[n - 1]} − ${sT[0]})`)}.`,
            marking: [`${names[0]}, with both ranges (${rK} and ${rT}) used to explain`] },
        ],
      };
    }),
  ],
};
