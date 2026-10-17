// Lesson 12.1 Probability (three pages: Notes, Example 1 and Question 1; the Easy drill; Example 2, the Medium set and
// three worded problems). Every drill question is a jar or bag of coloured counters, or a row of letter cards: count
// the total, find P(colour) in simplest form, then P(not colour) = 1 − P(colour). See ../chapter.js.
// Textbook 12.01 (Test Yourself 12, Questions 1 and 2).
const { fs, pw, pe, pnot, parts, mq, set } = require('../helpers');
const { jar, bag, cards, deck, probScale } = require('../shapes');

// One part: a picture of counters (or cards), the event asked; the answer and the lines calculated from the counts
const tot = (c) => Object.values(c).reduce((a, b) => a + b, 0);
const ans = (ev, k, total) => `Total = ${total}; ${pe(ev, k, total)}; ${pnot(ev, k, total)}`;
const L = (ev) => ['Total =', `P(${ev}) =`, `P(not ${ev}) =`];
const pc = (draw, counts, ev, o) => [draw(counts, o), ans(ev, counts[ev], tot(counts)), L(ev)];
const word = (w, ch, o = {}) => [cards([...w], { w: 7, ...o }), ans(ch, [...w].filter((x) => x === ch).length, w.length), L(ch)];
// The last drill question: the bag in words, drawn by the students in an empty bag
const said = (counts, ev, draw, o) => { const list = Object.entries(counts).map(([c, k]) => `${k} ${c}`);
  return [draw({}, o), ans(ev, counts[ev], tot(counts)), L(ev), `${draw === jar ? 'A jar' : 'A bag'} holds ${list.slice(0, -1).join(', ')} and ${list.at(-1)} counters.`]; };
const DO = 'Count the total, find P(colour) in simplest form, then P(not colour) = 1 − P(colour).';

module.exports = {
  code: '12.1', title: 'Probability',
  li: 'find the probability of an event and of its complement.',
  sc: ['list the outcomes and count the total', 'write a probability as a fraction in simplest form', 'find P(not A) = 1 − P(A)'],
  notes: {
    terms: [['outcome', 'one possible result'], ['sample space', 'the list of all the outcomes'], ['event', 'one or more outcomes, e.g. red'],
      ['equally likely', 'every outcome has the same chance'], ['complement', '“not A”: every outcome not in A'], ['random', 'chosen without looking']],
    formulas: ['P(A) = number of outcomes in A ÷ total number of outcomes', 'P(not A) = 1 − P(A)', '0 ≤ P(A) ≤ 1', 'A standard deck: 52 cards, 4 suits of 13'],
    steps: ['count the total', 'count the outcomes in A', 'write the fraction, simplify', 'P(not A) = 1 − P(A)'],
    fig: probScale(),
  },
  easy: {
    ex: { stem: 'Find each probability as a fraction in simplest form.', parts: [
      { t: 'P(red), P(not red)', fig: jar({ red: 2, blue: 3, yellow: 5 }, { cols: 5, r: 1.8 }) }, { t: 'P(blue), P(not blue)', fig: bag({ blue: 6, green: 4, red: 2 }, { cols: 6, r: 1.8 }) },
      { t: 'P(A), P(not A)', fig: cards([...'BANANAS'], { w: 4.2, gap: 0.9 }) }, { t: 'P(more than 6)', fig: cards([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], { w: 5, perRow: 5 }) }] },
    exAns: [ans('red', 2, 10), ans('blue', 6, 12), ans('A', 3, 7), `Total = 10; 7, 8, 9, 10: ${pe('more than 6', 4, 10)}; ${pnot('more than 6', 4, 10)}`],
    hint: 'P(event) = number in the event ÷ total · simplify: divide the top and bottom by the same number · P(not event) = 1 − P(event)',
    work: true,
    rounds: [parts(DO, [pc(jar, { red: 3, blue: 5 }, 'red', { r: 3.2 }), pc(bag, { green: 4, yellow: 6 }, 'green', { r: 3.2 })])],
  },
  drill: {
    hint: 'Count every counter or card for the total · simplify the fraction · P(colour) + P(not colour) = 1',
    rounds: [
      parts(DO, [pc(jar, { red: 2, blue: 4, yellow: 6 }, 'blue'), pc(bag, { green: 5, red: 3, white: 7 }, 'white')]),
      parts('Count the cards, find P(letter) in simplest form, then P(not letter) = 1 − P(letter).', [word('PEPPER', 'E'), word('LOLLIPOP', 'L')]),
      parts('Draw the counters in the bag or jar. Then find P(colour) and P(not colour).', [said({ red: 3, blue: 5, green: 4 }, 'green', bag, { cols: 4, rows: 3 }),
        said({ yellow: 6, red: 2, blue: 8 }, 'red', jar, { cols: 4, rows: 4 })]),
    ],
  },
  medium: {
    ex: { stem: 'Find each probability as a fraction in simplest form.', parts: [
      'A jar holds only red and yellow marbles. P(red) = 40%. Find P(yellow).', 'The jar in part a holds 40 marbles. How many are red?',
      { t: 'A card is drawn from a standard deck. Find P(red card).', fig: deck() }, { t: 'Find P(King or Queen).', fig: deck() }] },
    exAns: [`P(yellow) = 100% − 40% = 60% = ${pw(60, 100)}`, `40% × 40 = ${fs(40, 100)} × 40 = ${(40 * 40) / 100} red marbles`,
      `26 red cards (hearts and diamonds): ${pe('red card', 26, 52)}`, `4 Kings + 4 Queens = 8: ${pe('King or Queen', 8, 52)}`],
    hint: 'A standard deck: 52 cards · hearts and diamonds are red · each suit has A, 2 to 10, J, Q, K · P(not A) = 1 − P(A)',
    work: true, set: true,
    rounds: [set([
      mq('Find P(heart) and P(not heart).', `${pe('heart', 13, 52)}; ${pnot('heart', 13, 52)}`, { fig: deck({ w: 5.2 }), lines: ['P(heart) =', 'P(not heart) ='] }),
      mq('Write 18/24 in simplest form.', `18/24 = ${fs(18, 24)}`, { form: false, from: 'Year 8' }),
      mq('Only red and yellow. P(red) = 3/8.', `P(yellow) = 1 − 3/8 = ${fs(5, 8)}`, { lines: ['Working', 'P(yellow) ='] }),
      mq('24 counters. P(red) = 1/4. How many red?', `1/4 × 24 = ${24 / 4} red`, { lines: ['Working', 'Red counters ='] }),
      mq('Find the gradient through (1, 2) and (3, 8).', `m = (8 − 2) ÷ (3 − 1) = ${(8 - 2) / (3 - 1)}`, { form: false, from: '11.3' }),
      mq('A letter of MATHEMATICS is picked.', `Total = 11; ${pe('M', 2, 11)}; ${pnot('M', 2, 11)}`, { lines: ['Total =', 'P(M) =', 'P(not M) ='] }),
    ])],
  },
  worded: [
    { q: 'A class has 12 boys and 18 girls. One student is chosen at random to read. Find the probability that the student is a girl, and that the student is not a girl.',
      a: `Total = 12 + 18 = 30; ${pe('girl', 18, 30)}; ${pnot('girl', 18, 30)}` },
    { q: 'A bag holds only red, blue and green counters. P(red) = 3/10 and P(blue) = 9/20. Find P(green). The bag holds 40 counters: how many are green?',
      a: `P(green) = 1 − 6/20 − 9/20 = ${pw(5, 20)}; ${fs(5, 20)} × 40 = ${(5 / 20) * 40} green` },
    { q: 'A raffle sells 500 tickets and Mia buys 8 of them. Find the probability that Mia wins first prize, and that she does not.',
      a: `${pe('Mia wins', 8, 500)}; ${pnot('Mia wins', 8, 500)}` },
  ],
};
