// Lesson 12.3 Venn diagrams (three pages: Notes, Example 1 and Question 1; the Easy drill; Example 2, the Medium set and
// three worded problems). Every drill question is a Venn diagram with a count in each region: add them for the total,
// then find P(A), P(A and B), P(A or B) and P(neither). See ../chapter.js.
// Textbook 12.03 (Test Yourself 12, Question 4).
const { fs, pw, pe, parts, mq, set } = require('../helpers');
const { venn, results } = require('../shapes');

const sum = (a) => a.reduce((x, y) => x + y, 0);
// Regions added over the total: ps([7, 5], 25) → '(7 + 5)/25 = 12/25'
const ps = (xs, t) => (xs.length > 1 ? `(${xs.join(' + ')})/${t} = ${pw(sum(xs), t)}` : pw(xs[0], t));
// The four events from the counts n = [A only, both, B only, neither]
const events = ([A, B], [a, ab, b, nn], t) => `P(${A}) = ${ps([a, ab], t)}; P(${A} and ${B}) = ${pw(ab, t)}; P(${A} or ${B}) = ${ps([a, ab, b], t)}; P(neither) = ${pw(nn, t)}`;
const L = ([A, B], first = 'Total =') => [first, `P(${A}) =`, `P(${A} and ${B}) =`, `P(${A} or ${B}) =`, 'P(neither) ='];
// One part: the Venn diagram with its counts and what its letters stand for
const part = (names, n, t) => [venn(names, n, { w: 42, size: 3.2 }), `Total = ${sum(n)}; ${events(names, n, sum(n))}`, L(names), t];
// The last drill question: the group in words; students find both, fill in the Venn diagram, then the probabilities
const said = (names, total, nA, nB, nn, t) => {
  const both = nA + nB + nn - total, n = [nA - both, both, nB - both, nn];
  return [venn(names, ['', '', '', ''], { w: 40, size: 3.2 }), `Both = ${nA} + ${nB} + ${nn} − ${total} = ${both}; ${names[0]} only ${n[0]}, ${names[1]} only ${n[2]}; ${events(names, n, total)}`, L(names, 'Both ='), t];
};
const EX = [8, 4, 6, 2]; // Example 1: basketball (B) and swimming (S)
const DO = 'Add all four numbers for the total. Then add the regions for each event.';

module.exports = {
  code: '12.3', title: 'Venn diagrams',
  li: 'use Venn diagrams to find probabilities.',
  sc: ['read the number in each region of a Venn diagram', 'find P(A and B), P(A or B) and P(neither)', 'complete a Venn diagram from given information'],
  notes: {
    terms: [['Venn diagram', 'circles in a rectangle that sort a group'], ['A and B', 'in both circles: the overlap'], ['A or B', 'in A or B or both'],
      ['neither', 'outside both circles'], ['A only', 'in A but not in B'], ['total', 'all the numbers in the rectangle']],
    formulas: ['P(event) = numbers in its regions ÷ total', 'A or B = A only + both + B only', 'Both = A + B + neither − total', 'P(neither) = 1 − P(A or B)'],
    steps: ['add every region', 'find the regions of the event', 'add their numbers', 'divide by the total, simplify'],
    fig: venn(['M', 'T'], [8, 13, 5, 4], { w: 34 }),
  },
  easy: {
    ex: { stem: 'B = plays basketball, S = swims. Find each probability in simplest form.', parts: [
      { t: 'P(B)', fig: venn(['B', 'S'], EX, { w: 31, shade: 'a' }) }, { t: 'P(B and S)', fig: venn(['B', 'S'], EX, { w: 31, shade: 'and' }) },
      { t: 'P(B or S)', fig: venn(['B', 'S'], EX, { w: 31, shade: 'or' }) }, { t: 'P(neither)', fig: venn(['B', 'S'], EX, { w: 31, shade: 'neither' }) }] },
    exAns: [`Total = ${sum(EX)}; P(B) = ${ps([EX[0], EX[1]], 20)}`, `P(B and S) = ${pw(EX[1], 20)}`, `P(B or S) = ${ps([EX[0], EX[1], EX[2]], 20)}`, `P(neither) = ${pw(EX[3], 20)}`],
    hint: 'Total = all four numbers · A = A only + both · A or B = the three numbers in the circles · neither = the number outside',
    work: true,
    rounds: [parts(DO, [part(['S', 'M'], [7, 5, 9, 4], 'Sport (S), music (M)'), part(['C', 'D'], [6, 4, 8, 2], 'Has a cat (C), has a dog (D)')])],
  },
  drill: {
    hint: '“and” is the overlap only · “or” is everything inside the circles · both = A + B + neither − total',
    rounds: [
      parts(DO, [part(['T', 'C'], [9, 6, 12, 3], 'Drinks tea (T), drinks coffee (C)'), part(['B', 'R'], [11, 3, 7, 3], 'Catches a bus (B), a train (R)')]),
      parts(DO, [part(['N', 'S'], [14, 6, 10, 10], 'Plays netball (N), soccer (S)'), part(['L', 'P'], [5, 27, 12, 6], 'Owns a laptop (L), a phone (P)')]),
      parts('Both = A + B + neither − total. Fill in the Venn diagram, then each probability.', [
        said(['S', 'M'], 32, 20, 15, 5, '32 students: 20 play sport (S), 15 play music (M), 5 do neither.'),
        said(['C', 'D'], 40, 25, 18, 6, '40 people: 25 have a cat (C), 18 have a dog (D), 6 have neither.')]),
    ],
  },
  medium: {
    ex: { stem: '30 teenagers were surveyed: 21 like music (M), 18 like TV (T) and 4 like neither.', parts: [
      'How many like both music and TV?', { t: 'Complete the Venn diagram.', fig: venn(['M', 'T'], ['', '', '', ''], { w: 31 }) },
      'P(music but not TV)', 'P(music or TV, but not both)'] },
    exAns: [`Both = 21 + 18 + 4 − 30 = ${21 + 18 + 4 - 30}`, `M only = 21 − 13 = ${21 - 13}, both 13, T only = 18 − 13 = ${18 - 13}, neither 4`,
      `P(M only) = ${pw(8, 30)}`, `P(only one) = ${ps([8, 5], 30)}`],
    hint: 'Both = A + B + neither − total · A only = A − both · “not B” is everything outside circle B',
    work: true, set: true,
    rounds: [set([
      mq('Find P(A only) and P(not B).', `Total = 20; P(A only) = ${pw(6, 20)}; P(not B) = ${ps([6, 4], 20)}`, { fig: venn(['A', 'B'], [6, 3, 7, 4], { w: 24, size: 2.6 }), lines: ['P(A only) =', 'P(not B) ='] }),
      mq('Find the observed P(tail).', `Total = 40; observed P(T) = ${pw(26, 40)}`, { fig: results(['H', 'T'], [14, 26], { size: 2.4, w: 6 }), from: '12.2', lines: ['Total =', 'Observed P(T) ='] }),
      mq('Find P(only one of R and S).', `Total = 20; P(only one) = ${ps([9, 4], 20)}`, { fig: venn(['R', 'S'], [9, 5, 4, 2], { w: 24, size: 2.6 }), lines: ['Regions', 'P(only one) ='] }),
      mq('24 students: 15 band, 12 choir, 5 neither.', `Both = 15 + 12 + 5 − 24 = ${15 + 12 + 5 - 24}; P(both) = ${pw(8, 24)}`, { lines: ['Both =', 'P(both) ='] }),
      mq('Find P(not a club) for a standard deck.', `P(not club) = 1 − ${pw(13, 52)} = ${fs(39, 52)}`, { form: false, from: '12.1' }),
      mq('Find P(neither) and P(T or W).', `Total = 40; P(neither) = ${pw(5, 40)}; P(T or W) = ${ps([12, 8, 15], 40)}`, { fig: venn(['T', 'W'], [12, 8, 15, 5], { w: 24, size: 2.6 }), lines: ['P(neither) =', 'P(T or W) ='] }),
    ])],
  },
  worded: (() => {
    const e = [...Array(20)].map((_, i) => i + 1), E = e.filter((x) => x % 2 === 0), T3 = e.filter((x) => x % 3 === 0), both = E.filter((x) => x % 3 === 0);
    return [
      { q: 'In a class of 28 students, 15 play netball, 10 play soccer and 6 play both. Draw a Venn diagram. Find the probability that a student chosen at random plays neither sport.',
        a: `N only 15 − 6 = 9, S only 10 − 6 = 4, both 6, neither 28 − 19 = 9: ${pe('neither', 9, 28)}` },
      { q: 'Of 50 shoppers, 32 bought bread, 20 bought milk and 8 bought neither. How many bought both? Find the probability that a shopper chosen at random bought bread or milk.',
        a: `Both = 32 + 20 + 8 − 50 = ${32 + 20 + 8 - 50}; P(bread or milk) = (50 − 8)/50 = ${pw(42, 50)}` },
      { q: 'A whole number from 1 to 20 is chosen at random. E = even numbers and T = multiples of 3. Draw the Venn diagram, then find P(E and T) and P(E or T).',
        a: `E has ${E.length}, T has ${T3.length}, both: ${both.join(', ')}; ${pe('E and T', both.length, 20)}; P(E or T) = (${E.length} + ${T3.length} − ${both.length})/20 = ${pw(E.length + T3.length - both.length, 20)}` },
    ];
  })(),
};
