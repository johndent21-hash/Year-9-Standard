// Lesson 12.5 Tables of outcomes (three pages: Notes, Example 1 and Question 1; the Easy drill; Example 2, the Medium set
// and three worded problems). Every drill question is a table of outcomes for two dice, spinners or a coin and a die:
// complete the table, count the cells, then find three probabilities. The first row and column are filled in; the last
// drill question leaves every cell for the students. See ../chapter.js.
// Textbook 12.06 (Test Yourself 12, Question 7).
const { pw, pe, parts, mq, set } = require('../helpers');
const { outcomes, venn } = require('../shapes');

const D6 = [1, 2, 3, 4, 5, 6], HT = ['H', 'T'];
const add = (a, d) => a + d, times = (a, d) => a * d, diff = (a, d) => Math.abs(a - d), both = (a, d) => `${d}${a}`;
const even = (v) => v % 2 === 0, odd = (v) => v % 2 === 1;
// Every cell of the table: across the top a, down the side d
const cells = (across, down, op) => down.flatMap((d) => across.map((a) => op(a, d)));
// The total, then each event's probability: evs [[name, test(cell)]]
const answer = (across, down, op, evs) => { const v = cells(across, down, op), n = v.length;
  return `Total = ${down.length} × ${across.length} = ${n}; ${evs.map(([ev, test]) => pe(ev, v.filter(test).length, n)).join('; ')}`; };
const L = (evs) => ['Total =', ...evs.map(([ev]) => `P(${ev}) =`)];
const edge = (i, j) => i === 0 || j === 0; // the first row and column filled in
// One part: the table (the first row and column filled in; o.show to change), the operation and three events
const part = (across, down, op, evs, o = {}) => [outcomes(across, down, op, { size: 2.8, w: 6.4, h: down.length > 4 ? 4.3 : 4.8, show: edge, ...o }), answer(across, down, op, evs), L(evs), o.t];
const DO = 'Complete the table. Then count the cells for each event, out of the total.';
const ex = { names: ['1st', '2nd'], op: '+', w: 5, h: 3.9, size: 2.5 };

module.exports = {
  code: '12.5', title: 'Tables of outcomes',
  li: 'use tables of outcomes to find probabilities for two dice or spinners.',
  sc: ['complete a table of outcomes', 'count the cells for an event', 'find probabilities with “or” and “at least”'],
  notes: {
    terms: [['table of outcomes', 'a grid of every result of two steps'], ['sample space', 'all the cells of the table'], ['sum', 'the two numbers added'],
      ['difference', 'the larger minus the smaller'], ['at least 2', '2 or more']],
    formulas: ['Two dice: 6 × 6 = 36 outcomes', 'P(event) = cells in the event ÷ all the cells', 'P(4 or 5): add the cells with 4 and with 5'],
    steps: ['complete the table', 'count all the cells', 'count the cells in the event', 'divide, then simplify'],
    fig: outcomes(D6, D6, add, { names: ['Die 1', 'Die 2'], op: '+', w: 4.4, h: 3.6, size: 2.2 }),
  },
  easy: {
    ex: { stem: 'Use each table of outcomes. Write probabilities in simplest form.', parts: [
      { t: 'Two 1–3 spinners, added: complete it', fig: outcomes([1, 2, 3], [1, 2, 3], add, { ...ex, show: edge }) }, { t: 'P(sum of 4)', fig: outcomes([1, 2, 3], [1, 2, 3], add, ex) },
      { t: 'P(odd sum)', fig: outcomes([1, 2, 3], [1, 2, 3], add, ex) }, { t: 'Coin and die: P(head and 3)', fig: outcomes(D6, HT, both, { w: 4.2, h: 3.9, size: 2.4 }) }] },
    exAns: [`Sums: ${cells([1, 2, 3], [1, 2, 3], add).join(', ')}`, answer([1, 2, 3], [1, 2, 3], add, [['sum of 4', (v) => v === 4]]),
      answer([1, 2, 3], [1, 2, 3], add, [['odd sum', odd]]), answer(D6, HT, both, [['head and 3', (v) => v === 'H3']])],
    hint: 'Each cell is one outcome · total cells = rows × columns · P(event) = cells in the event ÷ total cells',
    work: true,
    rounds: [parts(DO, [
      part([1, 2, 3], [1, 2, 3, 4], add, [['sum of 5', (v) => v === 5], ['even sum', even], ['sum more than 5', (v) => v > 5]], { names: ['Spinner 1', 'Spinner 2'], op: '+' }),
      part(D6, HT, both, [['head and even', (v) => v[0] === 'H' && even(+v[1])], ['a 6', (v) => v[1] === '6'], ['tail or 1', (v) => v[0] === 'T' || v[1] === '1']], { names: ['Die', 'Coin'], w: 5.8 })])],
  },
  drill: {
    hint: 'Fill in each cell from the top number and the side number · “at least 2” means 2 or more · “or”: count the cells of both',
    rounds: [
      parts(DO, [
        part(D6, D6, add, [['sum of 8', (v) => v === 8], ['sum of 10 or more', (v) => v >= 10], ['even sum', even]], { names: ['Die 1', 'Die 2'], op: '+' }),
        part(D6, D6, times, [['product of 12', (v) => v === 12], ['odd product', odd], ['product more than 20', (v) => v > 20]], { names: ['Die 1', 'Die 2'], op: '×' })]),
      parts(DO, [
        part(['R', 'B', 'G'], ['R', 'B'], (a, d) => `${a}${d}`, [['same colour', (v) => v[0] === v[1]], ['at least one blue', (v) => v.includes('B')], ['no red', (v) => !v.includes('R')]], { names: ['Spinner 1', 'Spinner 2'] }),
        part([1, 2, 3, 4], [1, 2, 3, 4], times, [['product of 4', (v) => v === 4], ['odd product', odd], ['product more than 6', (v) => v > 6]], { names: ['Spinner 1', 'Spinner 2'], op: '×' })]),
      parts('Fill in every cell of the table yourself. Then find each probability.', [
        part([1, 2, 3], [1, 2, 3], add, [['sum of 4', (v) => v === 4], ['sum more than 4', (v) => v > 4], ['odd sum', odd]], { names: ['Spinner 1', 'Spinner 2'], op: '+', show: () => false, t: 'Two spinners, each numbered 1, 2, 3, are spun and the numbers added.' }),
        part([1, 2, 3, 4], [1, 2, 3], diff, [['difference of 0', (v) => v === 0], ['difference of at least 2', (v) => v >= 2], ['odd difference', odd]], { names: ['Spinner 1', 'Spinner 2'], op: '−', show: () => false, t: 'Spinners 1–4 and 1–3 are spun. Find the difference of the numbers.' })]),
    ],
  },
  medium: {
    ex: { stem: 'Two dice are rolled and the difference between the numbers is found.', parts: [
      { t: 'Complete the table of outcomes.', fig: outcomes(D6, D6, diff, { op: '−', show: () => false, w: 4.2, h: 2.7, size: 2.2 }) }, 'P(difference of 0)', 'P(difference of at least 2)', 'P(difference of 4 or 5)'] },
    exAns: [`36 cells: ${D6.map((d) => D6.map((a) => diff(a, d)).join(' ')).join(' / ')}`, answer(D6, D6, diff, [['0', (v) => v === 0]]).replace(/^Total = 6 × 6 = 36; /, ''),
      answer(D6, D6, diff, [['at least 2', (v) => v >= 2]]).replace(/^Total = 6 × 6 = 36; /, ''), answer(D6, D6, diff, [['4 or 5', (v) => v === 4 || v === 5]]).replace(/^Total = 6 × 6 = 36; /, '')],
    hint: 'Difference = larger − smaller · two dice give 6 × 6 = 36 outcomes · count the cells, then simplify',
    work: true, set: true,
    rounds: [set([
      mq('Two coins: complete, then P(one of each).', answer(HT, HT, both, [['HT or TH', (v) => v[0] !== v[1]]]), { fig: outcomes(HT, HT, both, { show: () => false, size: 2.4, w: 5.5, h: 3.8 }), lines: ['Total =', 'P(HT or TH) ='] }),
      mq('How many outcomes: 3 shirts, then 4 hats?', `3 × 4 = ${3 * 4} outcomes`, { form: false, from: '12.4' }),
      mq('Two dice are rolled: find P(sum of 9).', answer(D6, D6, add, [['sum of 9', (v) => v === 9]]), { lines: ['Total =', 'P(sum of 9) ='] }),
      mq('Two dice are rolled: find P(both even).', answer(D6, D6, (a, d) => even(a) && even(d), [['both even', (v) => v]]), { lines: ['Total =', 'P(both even) ='] }),
      mq('Find P(A or B).', `Total = 20; P(A or B) = (4 + 2 + 5)/20 = ${pw(11, 20)}`, { fig: venn(['A', 'B'], [4, 2, 5, 9], { w: 24, size: 2.6 }), from: '12.3', lines: ['Total =', 'P(A or B) ='] }),
      mq('Two 1–3 spinners: P(product is even)?', answer([1, 2, 3], [1, 2, 3], times, [['even product', even]]), { lines: ['Total =', 'P(even product) ='] }),
    ])],
  },
  worded: [
    { q: 'In a game, two dice are rolled and the numbers are added. You win if the sum is 7 or 11. Find the probability of winning.',
      a: answer(D6, D6, add, [['7 or 11', (v) => v === 7 || v === 11]]) },
    { q: 'Two spinners, one numbered 1 to 4 and one numbered 1 to 5, are spun and the numbers multiplied. Draw a table of outcomes and find the probability that the product is more than 10.',
      a: answer([1, 2, 3, 4, 5], [1, 2, 3, 4], times, [['more than 10', (v) => v > 10]]) },
    { q: 'Mia rolls two dice and records the larger number (or the number, if both are the same). Find the probability that the larger number is 6, and the probability that it is 1.',
      a: answer(D6, D6, Math.max, [['6', (v) => v === 6], ['1', (v) => v === 1]]) },
  ],
};
