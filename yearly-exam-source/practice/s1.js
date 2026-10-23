// Practice exams, Section 1: Data. Every Section 1 skill of the yearly exam, once each, in a shorter form:
// MC 1 classifying data, MC 2 shape of a dot plot, MC 3 mode from a histogram, MC 4 effect of an outlier,
// MC 5 reading a column graph (total and percentage); Q6 mean and median from a stem-and-leaf plot;
// Q7 comparing two data sets in a back-to-back stem-and-leaf plot (medians, which is higher, ranges and consistency).
// 14 marks. The numbers and contexts for each practice exam are in params.js.
'use strict';
const { num, dp, list, nw, sum, sorted, mean, median, modes, range, expand, q } = require('../lib/helpers');
const F = require('../lib/figs');

const NB = ' ';
const GAP = `,${NB}${NB} `;
const check = (cond, msg) => { if (!cond) throw new Error(`practice s1: ${msg}`); };

module.exports = (P) => ({
  id: 's1',
  title: 'Data',
  short: 'Data',
  questions: [
    // MC 1. Classifying data
    q(() => {
      const c = P.classify;
      return {
        type: 'mc', level: 'green', src: 'TY9 Q9 (9.05, green)', topic: 'Classifying data',
        text: `Which of the following is <b>${c.ask}</b> data?`,
        options: c.options, answer: c.answer, optLayout: 'grid', why: c.why,
      };
    }),

    // MC 2. Shape of a distribution from a dot plot
    q(() => {
      const d = P.dot;
      const data = Object.entries(d.counts).flatMap(([k, n]) => Array(n).fill(+k));
      const mn = mean(data), md = median(data);
      if (d.shape === 'pos') check(mn > md, 'MC2 should be positively skewed');
      if (d.shape === 'neg') check(mn < md, 'MC2 should be negatively skewed');
      if (d.shape === 'sym') check(Math.abs(mn - md) < 0.2, 'MC2 should be symmetrical');
      return {
        type: 'mc', level: 'green', src: 'TY9 Q6a (9.03, green)', topic: 'Shape of a distribution (dot plot)',
        text: `${d.text ? d.text.replace('{n}', data.length) : `The dot plot shows ${d.what} of ${data.length} ${d.who}.`} Which statement best describes the data?`,
        fig: F.dotPlot({ data, min: d.min, max: d.max, unitW: d.unitW || 4.6, xTitle: d.xTitle }), figPos: 'right',
        options: d.options, answer: d.answer, optLayout: 'stack',
        why: `${d.why} (Mean ${dp(mn, 1)}, median ${num(md)}.)`,
      };
    }),

    // MC 3. Mode from a histogram
    q(() => {
      const h = P.hist;
      const all = expand(h.labels, h.freq);
      const mo = modes(all);
      check(mo.length === 1, 'MC3 needs one mode');
      const opts = [mo[0], (h.labels[0] + h.labels[h.labels.length - 1]) / 2, Math.max(...h.labels), Math.max(...h.freq)];
      check(new Set(opts).size === 4, 'MC3 options must differ');
      const order = h.order || [0, 1, 2, 3];
      const options = order.map((i) => num(opts[i]));
      return {
        type: 'mc', level: 'green', src: 'TY9 Q4b (9.02, green)', topic: 'Mode from a histogram',
        text: `The histogram shows ${h.text} What is the mode?`.replace('{n}', all.length),
        fig: F.histogram({ labels: h.labels, freq: h.freq, colW: 6.5, plotH: 34, yMax: h.yMax, yStep: h.yStep || 1, xTitle: h.xTitle }), figPos: 'right',
        options, answer: order.indexOf(0), optLayout: 'row',
        why: `The tallest column is at ${mo[0]} (frequency ${Math.max(...h.freq)}), so the mode is ${mo[0]}. ${Math.max(...h.freq)} is the frequency, not the score.`,
      };
    }),

    // MC 4. Effect of an outlier on the measures of centre
    q(() => {
      const o = P.outlier;
      const out = o.out;
      const rest = o.data.filter((x) => x !== out);
      check(rest.length === o.data.length - 1, 'MC4: the outlier must appear once');
      const dMean = Math.abs(mean(o.data) - mean(rest)), dMed = Math.abs(median(o.data) - median(rest));
      const dMode = Math.abs(modes(o.data)[0] - modes(rest)[0]);
      check(dMean > dMed && dMean > dMode, 'MC4: the mean must change the most');
      return {
        type: 'mc', level: 'green', src: 'TY9 Q2c and Q3c-d (9.01, 9.02, green)', topic: 'Effect of an outlier',
        text: [o.text, list(o.data, GAP), `Which measure of centre changes the most if the outlier, ${num(out)}, is removed?`],
        options: o.options, answer: o.answer, optLayout: 'grid',
        why: `Mean ${dp(mean(o.data), 2)} → ${dp(mean(rest), 2)}; median ${num(median(o.data))} → ${num(median(rest))}; mode ${modes(o.data)[0]} → ${modes(rest)[0]}. The mean changes the most.`,
      };
    }),

    // MC 5. Reading a column graph: total and percentage
    q(() => {
      const c = P.column;
      const tot = sum(c.freq);
      const part = c.pick.reduce((s, i) => s + c.freq[i], 0);
      const pct = (part / tot) * 100;
      check(Number.isInteger(pct), 'MC5: a whole-number percentage');
      const names = c.pick.map((i) => c.labels[i].toLowerCase()).join(' or ');
      const wrong = c.wrong.map((x) => x);
      check(!wrong.includes(pct) && new Set(wrong).size === 3, 'MC5 options must differ');
      const vals = [...wrong];
      vals.splice(c.answer, 0, pct);
      return {
        type: 'mc', level: 'green', src: 'TY9 Q4 (9.02, green)', topic: 'Reading a column graph',
        text: `${c.text} What percentage of the students chose ${names}?`,
        fig: F.histogram({ labels: c.labels, freq: c.freq, kind: 'column', colW: 10, plotH: 30, yMax: c.yMax, yStep: c.yStep, xTitle: c.xTitle, yTitle: 'Number of students' }),
        options: vals.map((x) => `${num(x)}%`), answer: c.answer, optLayout: 'row',
        why: `Total = ${c.freq.join(' + ')} = ${tot}; ${names}: ${c.pick.map((i) => c.freq[i]).join(' + ')} = ${part}; ${part} ÷ ${tot} × 100% = ${num(pct)}%.`,
      };
    }),

    // Q6. Mean and median from a stem-and-leaf plot
    q(() => {
      const s = P.stem;
      const n = s.data.length, tot = sum(s.data), mn = mean(s.data), md = median(s.data), k = (n + 1) / 2;
      check(n % 2 === 1 && Number.isInteger(mn) && mn !== md, 'Q6: odd number of scores, a whole-number mean that differs from the median');
      return {
        type: 'sa', src: 'TY9 Q3b (9.02, green)', topic: 'Mean and median from a stem-and-leaf plot',
        text: s.text.replace('{n}', n),
        fig: F.stemLeaf({ data: s.data, key: s.key }),
        formula: 'Mean = sum of the scores ÷ number of scores',
        parts: [
          { text: 'Find the mean.', marks: 2, level: 'green',
            answer: `${num(mn)}${s.unit ? ` ${s.unit}` : ''}`, working: [`Sum = ${s.data.join(' + ')} = ${tot}`, `Mean = ${tot} ÷ ${n}`],
            marking: [`sum of the scores: ${tot}`, `mean ${num(mn)}`] },
          { text: 'Find the median.', marks: 1, level: 'green',
            answer: `${num(md)}${s.unit ? ` ${s.unit}` : ''}`, working: [`${n} scores: the median is the ${k}th score`],
            marking: [`${num(md)}`] },
        ],
      };
    }),

    // Q7. Comparing two data sets from a back-to-back stem-and-leaf plot
    q(() => {
      const b = P.b2b;
      const [nA, nB] = b.names;
      const A = b.A, B = b.B;
      const dA = median(A), dB = median(B), rA = range(A), rB = range(B);
      const sA = sorted(A), sB = sorted(B);
      check(dB > dA && rA < rB, 'Q7: B is higher, A is more consistent');
      const medWork = (s) => (s.length % 2 === 0 ? `(${s[s.length / 2 - 1]} + ${s[s.length / 2]}) ÷ 2` : `the ${(s.length + 1) / 2}th score`);
      return {
        type: 'worded', keepTogether: true, src: 'TY9 Q7 (9.04, blue)', topic: 'Comparing two data sets (back-to-back stem-and-leaf plot)',
        text: [b.text],
        fig: F.backToBack({ left: A, right: B, heads: b.names, stems: b.stems, key: b.key }),
        formula: 'Range = highest score − lowest score',
        parts: [
          { text: `Find the median ${b.measure} for each ${b.group}.`, marks: 2, level: 'blue', space: 36,
            answer: `${nA}: ${num(dA)}; ${nB}: ${num(dB)}`,
            working: [`${nA}: ${medWork(sA)}`, `${nB}: ${medWork(sB)}`],
            marking: [`${nA} median ${num(dA)}`, `${nB} median ${num(dB)}`] },
          { text: `Which ${b.group} ${b.moreQ}? Give a reason.`, marks: 1, level: 'blue', space: 28,
            answer: `${nB}: the median for ${nB} (${num(dB)}) is higher than the median for ${nA} (${num(dA)}).`,
            marking: [`${nB}, with a reason that compares the medians`] },
          { text: `Which ${b.group} is more consistent? Find the range of each ${b.group} to explain.`, marks: 3, level: 'blue', space: 50,
            answer: `${nA}: the range is ${rA} ${nw(`(${sA[sA.length - 1]} − ${sA[0]})`)}, much smaller than the range for ${nB}, ${rB} ${nw(`(${sB[sB.length - 1]} − ${sB[0]})`)}.`,
            working: [`${nA}: ${sA[sA.length - 1]} − ${sA[0]} = ${rA}`, `${nB}: ${sB[sB.length - 1]} − ${sB[0]} = ${rB}`],
            marking: [`${nA} range ${rA}`, `${nB} range ${rB}`, `${nA}, because the range is smaller`] },
        ],
      };
    }),
  ],
});
