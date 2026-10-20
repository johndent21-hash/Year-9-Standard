// Lesson 12.4 Tree diagrams (three pages: Notes, Example 1 and Question 1; the Easy drill; Example 2, the Medium set and
// three worded problems). Every drill question is a two-step tree diagram: write each outcome at the end of its branch,
// count them, then find two probabilities. The last drill question gives the steps in words: students draw the tree.
// Textbook 12.05 (Test Yourself 12, Question 6); textbook 12.04 (two-way tables, PATH) is left out. See ../chapter.js.
const { pw, pe, parts, mq, set } = require('../helpers');
const { tree, treeFrame, venn } = require('../shapes');

// Every outcome of two steps as [first, second]; second is a list, or a function of the first (without replacement)
const pairs = (first, second) => first.flatMap((a) => (typeof second === 'function' ? second(a) : second).map((s) => [a, s]));
const without = (list) => (a) => list.filter((x) => x !== a);
const HT = ['H', 'T'];
// The outcomes listed, then each event's probability with its outcomes: evs [[name, test(a, s)]]
const answer = (first, second, evs, name = (a, s) => `${a}${s}`) => {
  const all = pairs(first, second);
  return `${all.length} outcomes: ${all.map(([a, s]) => name(a, s)).join(', ')}; ${evs.map(([ev, test]) => { const hit = all.filter(([a, s]) => test(a, s));
    return `${pe(ev, hit.length, all.length)} (${hit.map(([a, s]) => name(a, s)).join(', ')})`; }).join('; ')}`;
};
// One part: the tree with its branch ends left for students (or o.frame: an empty frame to draw the tree in)
const part = (t, first, second, evs, o = {}) => [o.frame ? treeFrame(o.heads) : tree(first, second, { size: 2.8, dy: 5, gap: 13, ...o }),
  answer(first, second, evs, o.pair), ['Number of outcomes =', ...evs.map(([ev]) => `P(${ev}) =`)], t];
const DO = 'Write each outcome at the end of its branch. Count them, then find each probability.';
const comma = (a, s) => `${a},${s}`;
const ABCD = ['A', 'B', 'C', 'D'], TY = pairs(ABCD, without(ABCD)); // Test Yourself 12, Question 6

module.exports = {
  code: '12.4', title: 'Tree diagrams',
  li: 'list the outcomes of two-step experiments with tree diagrams.',
  sc: ['draw a tree diagram for two steps', 'list every outcome and count them', 'find probabilities, with or without replacement'],
  notes: {
    terms: [['two-step experiment', 'two actions, one after the other'], ['tree diagram', 'a branch for every outcome of each step'], ['outcome', 'one path along the branches, e.g. HT'],
      ['with replacement', 'put back: the 2nd step is the same'], ['without replacement', 'not put back: one less to choose']],
    formulas: ['Number of outcomes = 1st step × 2nd step', 'P(event) = outcomes in the event ÷ all outcomes', 'Without replacement: 4 cards, then 3: 4 × 3 = 12'],
    steps: ['draw the 1st step', 'add the 2nd step to each branch', 'list every outcome', 'count, then divide'],
    fig: tree(HT, HT, { ends: true, gap: 9, dy: 4.2 }),
  },
  easy: {
    ex: { stem: 'Use the tree diagram. Write probabilities in simplest form.', parts: [
      { t: 'Two coins: list the outcomes', fig: tree(HT, HT, { gap: 9, dy: 3.4, size: 2.5 }) }, { t: 'Two coins: P(two tails)', fig: tree(HT, HT, { gap: 9, dy: 3.4, size: 2.5, ends: true }) },
      { t: 'Coin, then spinner 1–3: list them', fig: tree(HT, [1, 2, 3], { gap: 9, dy: 2.6, size: 2.5, gg: 0.6 }) }, { t: 'P(tail and an odd number)', fig: tree(HT, [1, 2, 3], { gap: 9, dy: 2.6, size: 2.5, gg: 0.6, ends: true }) }] },
    exAns: [answer(HT, HT, []).replace(/; $/, ''), answer(HT, HT, [['two tails', (a, s) => a === 'T' && s === 'T']]),
      answer(HT, [1, 2, 3], []).replace(/; $/, ''), answer(HT, [1, 2, 3], [['tail and odd', (a, s) => a === 'T' && s % 2 === 1]])],
    hint: 'Follow each path from the start to a branch end: that is one outcome · P(event) = outcomes in the event ÷ all outcomes',
    work: true,
    rounds: [parts(DO, [
      part('Two coins are tossed.', HT, HT, [['two heads', (a, s) => a === 'H' && s === 'H'], ['at least one head', (a, s) => a === 'H' || s === 'H']], { heads: ['1st coin', '2nd coin'], dy: 7 }),
      part('A spinner (R, B, Y) is spun, then a coin is tossed.', ['R', 'B', 'Y'], HT, [['red and head', (a, s) => a === 'R' && s === 'H'], ['a head', (a, s) => s === 'H']], { heads: ['Spinner', 'Coin'], dy: 5.2 })])],
  },
  drill: {
    hint: 'Outcomes = 1st step × 2nd step · without replacement, the 2nd step has one less · “at least one” means one or more',
    rounds: [
      parts(DO, [
        part('Drink: milk (M) or juice (J). Fruit: apple (A), banana (B) or pear (P).', ['M', 'J'], ['A', 'B', 'P'], [['juice and pear', (a, s) => a === 'J' && s === 'P'], ['banana', (a, s) => s === 'B']], { heads: ['Drink', 'Fruit'] }),
        part('A spinner numbered 1, 2, 3 is spun twice.', [1, 2, 3], [1, 2, 3], [['a double', (a, s) => a === s], ['a total of 5', (a, s) => a + s === 5]], { heads: ['1st spin', '2nd spin'], dy: 3.4, gg: 0.6, pair: comma })]),
      parts('Not put back: the 2nd step has one less. Write each outcome, then each probability.', [
        part('Two cards are drawn from A, B and C without replacement.', ['A', 'B', 'C'], without(['A', 'B', 'C']), [['A then B', (a, s) => a === 'A' && s === 'B'], ['no C', (a, s) => a !== 'C' && s !== 'C']], { heads: ['1st card', '2nd card'] }),
        part('Two of the cards 1, 2, 3 are drawn, not replaced, to make a 2-digit number.', [1, 2, 3], without([1, 2, 3]), [['an even number', (a, s) => s % 2 === 0], ['more than 20', (a, s) => 10 * a + s > 20]], { heads: ['Tens', 'Units'] })]),
      parts('Draw the tree diagram and list the outcomes. Then find each probability.', [
        part('A coin is tossed, then a spinner with 1, 2, 3, 4 is spun.', HT, [1, 2, 3, 4], [['head and 4', (a, s) => a === 'H' && s === 4], ['an even number', (a, s) => s % 2 === 0]], { frame: true, heads: ['Coin', 'Spinner'] }),
        part('Choose pasta (P) or salad (S), then water (W), juice (J) or milk (M).', ['P', 'S'], ['W', 'J', 'M'], [['salad and milk', (a, s) => a === 'S' && s === 'M'], ['not water', (a, s) => s !== 'W']], { frame: true, heads: ['Main', 'Drink'] })]),
    ],
  },
  medium: {
    ex: { stem: 'Cards A, B, C and D are in a bag. Two are drawn at random without replacement.', parts: [
      'How many outcomes are there? List them.', 'P(the letters A and B)', 'P(A or B or both)', 'P(no letter D)'] },
    exAns: [`4 × 3 = ${TY.length}: ${TY.map((x) => x.join('')).join(', ')}`, `AB, BA: ${pe('A and B', 2, TY.length)}`,
      `all but CD, DC: ${pe('A or B', TY.filter(([a, s]) => [a, s].some((x) => x === 'A' || x === 'B')).length, TY.length)}`, pe('no D', TY.filter(([a, s]) => a !== 'D' && s !== 'D').length, TY.length)],
    hint: 'Without replacement: 4 cards, then 3, so 4 × 3 = 12 outcomes · AB and BA are different outcomes',
    work: true, set: true,
    rounds: [set([
      mq('Two coins: find P(one of each).', `4 outcomes: HH, HT, TH, TT; ${pe('HT or TH', 2, 4)}`, { fig: tree(HT, HT, { gap: 8, dy: 2.4, gg: 0.4, size: 2.4, top: 4.6 }), lines: ['Outcomes =', 'P(HT or TH) ='] }),
      mq('Find P(A and B).', `Total = 20; ${pe('A and B', 3, 20)}`, { fig: venn(['A', 'B'], [5, 3, 8, 4], { w: 24, size: 2.6 }), from: '12.3', lines: ['Total =', 'P(A and B) ='] }),
      mq('How many outcomes: a die, then a coin?', `6 × 2 = ${6 * 2} outcomes`, { lines: ['Working', 'Outcomes ='] }),
      mq('A 1–4 spinner is spun twice: P(double)?', `4 × 4 = 16 outcomes; 11, 22, 33, 44: ${pe('double', 4, 16)}`, { lines: ['Outcomes =', 'P(double) ='] }),
      mq('P(red) = 0.3. Reds expected in 250 spins?', `0.3 × 250 = ${0.3 * 250} reds`, { form: false, from: '12.2' }),
      mq('Two of X, Y, Z, not replaced: P(X first)?', `3 × 2 = 6 outcomes; XY, XZ: ${pe('X first', 2, 6)}`, { lines: ['Outcomes =', 'P(X first) ='] }),
    ])],
  },
  worded: [
    { q: 'A family has two children. Draw a tree diagram for boy (B) or girl (G), with each equally likely. Find the probability that the family has one boy and one girl.',
      a: answer(['B', 'G'], ['B', 'G'], [['one of each', (a, s) => a !== s]]) },
    { q: 'Sam chooses a T-shirt (red R, blue B or green G) and a cap (black K or white W) at random. Draw a tree diagram. Find the probability of a blue T-shirt with a white cap, and of no red.',
      a: answer(['R', 'B', 'G'], ['K', 'W'], [['blue and white', (a, s) => a === 'B' && s === 'W'], ['no red', (a) => a !== 'R']]) },
    { q: 'Ali (A), Ben (B) and Cara (C) put their names in a hat. Two names are drawn without replacement: captain, then vice-captain. List the outcomes and find the probability that Cara is chosen.',
      a: answer(['A', 'B', 'C'], without(['A', 'B', 'C']), [['Cara chosen', (a, s) => a === 'C' || s === 'C']]) },
  ],
};
