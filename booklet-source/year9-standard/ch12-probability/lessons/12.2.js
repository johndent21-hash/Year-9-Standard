// Lesson 12.2 Experimental probability (three pages: Notes, Example 1 and Question 1; the Easy drill; Example 2, the
// Medium set and three worded problems). Every drill question is a table of results from a spinner, die or coin: add
// the frequencies for the total, then find the observed (experimental) and the theoretical probability. See ../chapter.js.
// Textbook 12.02 (Test Yourself 12, Question 3).
const { num, fs, pw, pe, parts, mq, set } = require('../helpers');
const { results, side, spinner, die, jar } = require('../shapes');

const sum = (a) => a.reduce((x, y) => x + y, 0);
// A decimal: exact when it ends within three places, otherwise to two decimal places (1/3 ≈ 0.33)
const dc = (k, n) => (Number.isInteger(+((k / n) * 1000).toFixed(6)) ? `= ${num(k / n)}` : `≈ ${num(k / n, 2)}`);
const obs = (ev, k, total, asDec) => `observed P(${ev}) = ${asDec ? `${k}/${total} ${dc(k, total)}` : pw(k, total)}`;
const theo = (ev, k, n, asDec) => `theoretical P(${ev}) = ${asDec ? `${pw(k, n)} ${dc(k, n)}` : pw(k, n)}`;
const L = (ev) => ['Total =', `Observed P(${ev}) =`, `Theoretical P(${ev}) =`];
// One part: [picture, answer, lines] from the outcomes, their frequencies, the event's name, the outcomes in it, and the
// equally likely parts of the spinner or die in it (k of n)
const part = (fig, outs, freqs, ev, inEv, [k, n], { asDec, t } = {}) => {
  const total = sum(freqs), hits = outs.map((x, i) => (inEv.includes(x) ? freqs[i] : null)).filter((x) => x !== null), fk = sum(hits);
  return [fig, `Total = ${total}; ${hits.length > 1 ? `${hits.join(' + ')} = ${fk}, so ` : ''}${obs(ev, fk, total, asDec)}; ${theo(ev, k, n, asDec)}`, L(ev), t];
};
const spun = (sectors, outs, freqs, o = {}) => side([spinner(sectors, { r: o.r || 11, size: 3 }), results(outs, freqs, { size: 2.8, ...o })]);
const rolled = (v, freqs) => side([die(v, 12), results([1, 2, 3, 4, 5, 6], freqs, { w: 5.4, size: 2.8 })]);
// The last drill question: the results as a list, tallied into a blank table by the students
const listed = (word, outs, list, ev, inEv, kn) => {
  const r = list.split(' '), freqs = outs.map((x) => r.filter((y) => y === x).length);
  return part(results(outs, outs.map(() => ''), { tally: true, w: 8, size: 2.8 }), outs, freqs, ev, inEv, kn, { t: `${word}: ${list}` });
};
const TY = [['R', 2], 'B', 'G', 'Y', 'P'], TYF = [72, 29, 35, 30, 34]; // Test Yourself 12, Question 3: red twice each other sector, 200 spins

module.exports = {
  code: '12.2', title: 'Experimental probability',
  li: 'find observed probabilities and compare them with theoretical ones.',
  sc: ['add the frequencies to find the number of trials', 'find the observed and the theoretical probability', 'find the expected number of times an outcome happens'],
  notes: {
    terms: [['trial', 'one go, e.g. one spin'], ['frequency', 'how many times it happened'], ['observed P', 'from the results (experimental)'],
      ['theoretical P', 'from the equally likely outcomes'], ['expected frequency', 'how many times we expect it'], ['fair', 'all outcomes equally likely']],
    formulas: ['Observed P(A) = frequency ÷ trials', 'Theoretical P(A) = outcomes in A ÷ all outcomes', 'Expected frequency = P(A) × trials', 'More trials: closer to theoretical'],
    steps: ['add the frequencies', 'observed = frequency ÷ total', 'theoretical from the spinner', 'compare'],
    fig: spinner(['R', 'B', 'G', 'Y'], { r: 9 }),
  },
  easy: {
    ex: { stem: 'Find each probability as a fraction in simplest form.', parts: [
      { t: 'Coin: observed and theoretical P(head)', fig: results(['H', 'T'], [28, 22], { w: 7 }) },
      { t: '40 spins: 3 came up 12 times. P(3)?', fig: spinner([1, 2, 3, 4], { r: 8 }) },
      { t: 'Equal spinner R, B, G: P(red)', fig: results(['R', 'B', 'G'], [12, 9, 9], { w: 5.4 }) },
      'Expected frequency: the spinner in part b is spun 200 times. How many 3s do you expect?'] },
    exAns: [`Total = 50; ${obs('head', 28, 50)}; ${theo('head', 1, 2)}`, `${obs('3', 12, 40)}; ${theo('3', 1, 4)}`,
      `Total = 30; ${obs('red', 12, 30)}; ${theo('red', 1, 3)}`, `1/4 × 200 = ${200 / 4} times`],
    hint: 'Observed P = frequency ÷ total number of trials · theoretical P = outcomes in the event ÷ equally likely outcomes',
    work: true,
    rounds: [parts('Add the frequencies. Observed P = frequency ÷ total; theoretical P from the spinner.', [
      part(spun(['R', 'B', 'G', 'Y'], ['R', 'B', 'G', 'Y'], [13, 9, 8, 10]), ['R', 'B', 'G', 'Y'], [13, 9, 8, 10], 'red', ['R'], [1, 4]),
      part(spun(['R', 'B', 'Y'], ['R', 'B', 'Y'], [18, 24, 18]), ['R', 'B', 'Y'], [18, 24, 18], 'blue', ['B'], [1, 3])])],
  },
  drill: {
    hint: 'The total is all the frequencies added · a die has 6 equally likely outcomes · a sector twice as big counts as 2 equal parts',
    rounds: [
      parts('Add the frequencies. Observed P = frequency ÷ total; theoretical P from the die.', [
        part(rolled(4, [8, 11, 9, 12, 10, 10]), [1, 2, 3, 4, 5, 6], [8, 11, 9, 12, 10, 10], '4', [4], [1, 6]),
        part(rolled(6, [18, 22, 19, 21, 16, 24]), [1, 2, 3, 4, 5, 6], [18, 22, 19, 21, 16, 24], 'even', [2, 4, 6], [3, 6])]),
      parts('As decimals: observed P = frequency ÷ total; theoretical P from the sector sizes.', [
        part(spun([['R', 2], 'B', 'Y'], ['R', 'B', 'Y'], [46, 27, 27]), ['R', 'B', 'Y'], [46, 27, 27], 'red', ['R'], [2, 4], { asDec: true }),
        part(spun(['R', 'B', 'G', 'R', 'B'], ['R', 'B', 'G'], [18, 22, 10]), ['R', 'B', 'G'], [18, 22, 10], 'blue', ['B'], [2, 5], { asDec: true })]),
      parts('Tally the results to complete the table. Then find the observed and theoretical P.', [
        listed('A coin was tossed 20 times', ['H', 'T'], 'H T T H H T H H H T T H T H H T H H T H', 'head', ['H'], [1, 2]),
        listed('An equal R, B, G spinner gave', ['R', 'B', 'G'], 'R B B G R B R G B B R B G B R', 'blue', ['B'], [1, 3])]),
    ],
  },
  medium: {
    ex: { stem: 'The red sector is twice the size of each other sector. 200 spins gave these results. Answer as decimals.', parts: [
      { t: 'Observed P(red)', fig: results(['R', 'B', 'G', 'Y', 'P'], TYF, { down: true, size: 2.4, h: 3.3 }) }, 'Observed P(blue or green)',
      { t: 'Theoretical P(red), P(not purple)', fig: spinner(TY, { r: 9 }) }, 'Expected number of reds in 500 spins'] },
    exAns: [`${obs('red', 72, 200, true)}`, `29 + 35 = 64, so ${obs('blue or green', 64, 200, true)}`,
      `6 equal parts: ${theo('red', 2, 6, true)}; ${theo('not purple', 5, 6, true)}`, `1/3 × 500 ≈ ${num(500 / 3, 1)}, about ${Math.round(500 / 3)} reds`],
    hint: 'Count a double sector as two equal parts · expected frequency = theoretical P × number of trials · decimal = top ÷ bottom',
    work: true, set: true,
    rounds: [set([
      mq('Find the observed P(2) from 50 spins.', `Total = 50; ${obs('2', 14, 50)}`, { fig: results([1, 2, 3, 4], [7, 14, 12, 17], { size: 2.4, w: 4.5 }), lines: ['Total =', 'Observed P(2) ='] }),
      mq('Find P(blue) and P(not blue).', `${pe('blue', 2, 10)}; P(not blue) = 1 − ${fs(2, 10)} = ${fs(8, 10)}`, { fig: jar({ red: 3, blue: 2, yellow: 5 }, { cols: 5, r: 1.6 }), from: '12.1', lines: ['P(blue) =', 'P(not blue) ='] }),
      mq('P(red) = 0.35. Reds expected in 400 spins?', `0.35 × 400 = ${num(0.35 * 400)} reds`, { lines: ['Working', 'Expected reds ='] }),
      mq('A die gave 180 sixes in 600 rolls.', `1/6 × 600 = ${600 / 6} sixes expected; 180 is far more than ${600 / 6}, so the die may not be fair`, { lines: ['Expected 6s =', 'Fair? Why?'] }),
      mq('Write 7/20 as a decimal and a percentage.', `7 ÷ 20 = ${num(7 / 20)} = ${num((7 / 20) * 100)}%`, { form: false, from: 'Year 8' }),
      mq('Find the observed P(red) as a percentage.', `Total = 40; observed P(red) = 18/40 = ${num(18 / 40)} = ${num((18 / 40) * 100)}%`, { fig: results(['R', 'B', 'G'], [18, 12, 10], { size: 2.4, w: 5 }), lines: ['Total =', 'Observed P(red) ='] }),
    ])],
  },
  worded: [
    { q: 'A basketballer made 36 of her last 48 free throws. Find the experimental probability that she makes her next throw. How many of her next 200 throws would you expect her to make?',
      a: `${obs('makes it', 36, 48)}; ${fs(36, 48)} × 200 = ${(36 / 48) * 200} throws` },
    { q: 'A die is rolled 300 times and lands on 6 a total of 71 times. Find the observed and the theoretical probability of a 6, as decimals to two decimal places. Do you think the die is fair?',
      a: `observed P(6) = 71/300 ≈ ${num(71 / 300, 2)}; theoretical P(6) = 1/6 ≈ ${num(1 / 6, 2)}; expected 1/6 × 300 = ${300 / 6} sixes, but 71 came up, so it may not be fair` },
    { q: 'Of 120 cars that passed the school gate, 18 were red. Estimate the probability that the next car is red. How many of the next 400 cars would you expect to be red?',
      a: `${obs('red', 18, 120)}; ${fs(18, 120)} × 400 = ${(18 / 120) * 400} red cars` },
  ],
};
