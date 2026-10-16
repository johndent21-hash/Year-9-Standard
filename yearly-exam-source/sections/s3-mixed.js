// Section 3: Mixed Topics (Chapters 1–8): 1 Algebra, 2 Pythagoras’ theorem, 3 Numeracy and calculation,
// 4 Trigonometry, 5 Indices, 7 Equations, 8 Earning money. 33 marks: 5 multiple choice (1 mark each), short answer
// (18 marks), 3 worded problems (3, 3 and 4 marks). Levels: 26 green, 7 blue.
// 2026 edit: 10 marks moved here from Data (more algebra, equations, percentages and money); the trig-side and
// scientific-notation questions cut; the wages and ladder questions made easier. A question part that takes 2 steps
// is worth 2 marks, 3 steps 3 marks.
// No geometry, no surds and no exact-value answers: Pythagoras answers are rounded decimals. Nothing from PATH or
// extension. Chapter 6 has no eligible questions: the brief excludes its geometry, and the rest of Test yourself 6 is
// PATH (6.03, 6.04), so no question comes from Chapter 6.
//
// Every question is a NEW question in the style of a GREEN or BLUE Test yourself question (src names it).
//   Green (26): MC 1-5 (5), Q6 (3), Q9 (2), Q10 (2), Q11a (2), Q12 (2), Q13 (3), Q14 (3), Q15 (4).
//   Blue (7):   Q7 (2), Q8 (2), Q11b (3).
// Marks by chapter: Ch1 8 (MC1, Q6, Q7, Q8), Ch2 3 (MC2, Q15a), Ch3 5 (MC3, Q9, Q10), Ch4 2 (Q15b), Ch5 1 (MC4),
//   Ch7 8 (Q11, Q14), Ch8 6 (MC5, Q12, Q13).
'use strict';
const { num, dp, money, unit, frac, v, nw, round, hyp, leg, acosD, q } = require('../lib/helpers');
const F = require('../lib/figs');

const check = (cond, msg) => { if (!cond) throw new Error(`s3-mixed: ${msg}`); };

// ---------------------------------------------------------------- text helpers
const PYTH = `Pythagoras’ theorem: ${nw(`${v('c')}² = ${v('a')}² + ${v('b')}²`)}`;
const SIN = nw(`sin ${v('θ')} = ${frac('opp', 'hyp')}`), COS = nw(`cos ${v('θ')} = ${frac('adj', 'hyp')}`), TAN = nw(`tan ${v('θ')} = ${frac('opp', 'adj')}`);
const TRIG = `${SIN}, ${COS}, ${TAN}`;
// A signed term for a worked line: term(-15) -> ' − 15', term(12) -> ' + 12', term(4, x, true) -> '4x' (first term).
const coefX = (a, x) => (a === 1 ? x : a === -1 ? `−${x}` : `${num(a)}${x}`);
const term = (a, x = '', first = false) => {
  const body = x ? (Math.abs(a) === 1 ? x : `${num(Math.abs(a))}${x}`) : num(Math.abs(a));
  if (first) return a < 0 ? `−${body}` : body;
  return a < 0 ? ` − ${body}` : ` + ${body}`;
};
const lin = (a, b, x) => `${coefX(a, x)}${b === 0 ? '' : term(b)}`;
const sup = (e) => `<sup>${e < 0 ? `−${-e}` : e}</sup>`;

// ---------------------------------------------------------------- one-off figure: a ladder against a wall
// The ladder (length L) leans on a wall with its foot d from the wall. Drawn to scale: the wall height reached is
// `size` mm. Labels: the ladder length, the distance d, θ at the foot, and h on a dimension line to the right of the
// wall that runs from the ground to the top of the ladder (so h cannot be read as the height of the whole wall).
const ladderFig = ({ L, d, u = 'm', size = 40 }) => {
  const { reset, seg, poly, pline, rightMark, best, svg, SIDE, GREY, unitV, mid } = F.parts;
  reset();
  const h = leg(L, d), k = size / h, m = 1, ext = 7, wallW = 4;
  const xw = m + ext + d * k, yg = m + 3 + h * k;
  const foot = [xw - d * k, yg], base = [xw, yg], top = [xw, yg - h * k];
  const xd = xw + wallW + 3.2, xe = xd + 1.6;                                                   // dimension line for h
  let b = '';
  b += poly([[xw, m], [xw + wallW, m], [xw + wallW, yg], [xw, yg]], SIDE, { w: 0.4 });       // wall
  b += seg([m, yg], [xe, yg], { w: 0.5 });                                                      // ground
  b += seg(foot, top, { w: 0.75 });                                                             // ladder
  b += rightMark(base, foot, top, 2.2);
  // angle θ at the foot of the ladder
  const ua = unitV(foot, top), ar = 4.6, a0 = 0, a1 = Math.atan2(-ua[1], ua[0]);
  const arc = Array.from({ length: 13 }, (_, i) => { const t = a0 + ((a1 - a0) * i) / 12; return [foot[0] + ar * Math.cos(t), foot[1] - ar * Math.sin(t)]; });
  b += pline(arc, { w: 0.32 });
  const bis = [Math.cos(a1 / 2), -Math.sin(a1 / 2)];
  b += best([[foot[0] + bis[0] * (ar + 2.4), foot[1] + bis[1] * (ar + 2.4)], [foot[0] + bis[0] * (ar + 3.4), foot[1] + bis[1] * (ar + 3.4)]], v('θ'));
  // h: a dashed level line from the top of the ladder across the wall, and a dimension line with end ticks
  const dim = { stroke: GREY, w: 0.3 };
  b += seg(top, [xd + 1.1, top[1]], { ...dim, dash: true });
  b += seg([xd, yg], [xd, top[1]], dim) + seg([xd - 1.1, top[1]], [xd + 1.1, top[1]], dim) + seg([xd - 1.1, yg - 0.01], [xd + 1.1, yg - 0.01], dim);
  b += best([0.5, 0.42, 0.58].map((t) => [mid([xd, yg], [xd, top[1]], t), [1, 0], 0.9]), v('h'));
  // labels: ladder (outside, up-left), distance d (under the ground)
  const nOut = [ua[1], -ua[0]];
  b += best([[mid(foot, top), nOut, 1.2], [mid(foot, top, 0.6), nOut, 1.2], [mid(foot, top, 0.4), nOut, 1.2]], unit(L, u));
  b += best([[mid(foot, base), [0, 1], 1.2]], unit(d, u));
  return svg(xe + m, yg + m, b);
};

module.exports = {
  id: 's3',
  title: 'Mixed Topics (Chapters 1–8)',
  short: 'Mixed Topics',
  questions: [
    // ================================================================ multiple choice (5 x 1 mark, all green)

    // 1. Substitution, with the 2a² trap (TY1 Q2)
    q(() => {
      const a = 5, b = 3;
      const right = 2 * a * a - b;              // 2 × 25 − 3
      const sqFirst = (2 * a) ** 2 - b;         // squares 2a
      const asDouble = 2 * (2 * a) - b;         // reads a² as 2a
      const noSq = 2 * a - b;                   // leaves out the square
      const opts = [noSq, asDouble, right, sqFirst];
      check(new Set(opts).size === 4 && opts.every((x, i) => i === 0 || x > opts[i - 1]), 'MC1 options must differ and be in order');
      return {
        type: 'mc', level: 'green', src: 'TY1 Q2 (1.02, green)', topic: 'Substitution',
        text: `If ${v('a')} = ${a} and ${v('b')} = ${b}, evaluate ${nw(`2${v('a')}² − ${v('b')}`)}.`,
        options: opts.map((x) => num(x)), answer: opts.indexOf(right), optLayout: 'row',
        why: `2${v('a')}² − ${v('b')} = 2 × ${a}² − ${b} = 2 × ${a * a} − ${b} = ${right}. (${sqFirst} squares 2${v('a')}: (2 × ${a})² − ${b}; ${asDouble} treats ${v('a')}² as 2${v('a')}; ${noSq} leaves out the square.)`,
      };
    }),

    // 2. Hypotenuse, closest answer (TY2 Q5)
    q(() => {
      const a = 5.6, b = 9.3;
      const c = hyp(a, b);
      const vals = [a + b, c, leg(b, a), b - a].map((x) => round(x, 1));   // sum, right, subtracts the squares, difference
      check(new Set(vals).size === 4, 'MC2 options must differ');
      return {
        type: 'mc', level: 'green', src: 'TY2 Q5 (2.03, green)', topic: 'Pythagoras’ theorem: hypotenuse',
        text: `Find the value of ${v('x')}. Select the closest answer.`,
        formula: PYTH,
        fig: F.rightTriangle({ base: b, height: a, corner: 'TL', labels: { base: unit(b, 'cm'), height: unit(a, 'cm'), hyp: `${v('x')} cm` }, size: 40 }),
        figPos: 'right',
        options: vals.map((x) => num(x, 1)), answer: 1, optLayout: 'row',
        why: `${v('x')}² = ${num(a)}² + ${num(b)}² = ${num(a * a, 2)} + ${num(b * b, 2)} = ${num(a * a + b * b, 2)}, so ${v('x')} = √${num(a * a + b * b, 2)} = ${dp(c, 3)}… ≈ ${dp(c, 1)}. (${dp(vals[0], 1)} adds the sides, ${dp(vals[2], 1)} subtracts the squares, ${dp(vals[3], 1)} subtracts the sides.)`,
      };
    }),

    // 3. Discount and selling price (TY3 Q16)
    q(() => {
      const price = 145, pct = 15;
      const disc = price * pct / 100, sell = price - disc;
      const vals = [price + disc, price - pct, sell, disc];                // marked up, takes off $15, right, the discount only
      check(new Set(vals).size === 4 && vals.every((x, i) => i === 0 || x < vals[i - 1]), 'MC3 options must differ and be in order');
      return {
        type: 'mc', level: 'green', src: 'TY3 Q16 (3.06, green)', topic: 'Discount and selling price',
        text: `A skateboard is marked at ${money(price)}. In a sale it is discounted by ${pct}%. What is the selling price?`,
        options: vals.map((x) => money(x, 2)), answer: vals.indexOf(sell), optLayout: 'row',
        why: `Discount = ${pct}% × ${money(price)} = ${money(disc, 2)}; selling price = ${money(price)} − ${money(disc, 2)} = ${money(sell, 2)}. (${money(disc, 2)} is the discount only, ${money(price - pct, 2)} takes off $${pct}, ${money(price + disc, 2)} increases the price.)`,
      };
    }),

    // 4. Index laws: multiplying terms with coefficients (TY5 Q1)
    q(() => {
      const c1 = 4, e1 = 6, c2 = 3, e2 = 2, m = v('m');
      const t = (c, e) => `${c}${m}${sup(e)}`;
      const opts = [t(c1 * c2, e1 + e2), t(c1 + c2, e1 + e2), t(c1 * c2, e1 * e2), t(c1 * c2, e1 - e2)];
      return {
        type: 'mc', level: 'green', src: 'TY5 Q1 (5.01, green)', topic: 'Index laws: multiplying terms',
        text: `Simplify ${nw(`${t(c1, e1)} × ${t(c2, e2)}`)}.`,
        options: opts, answer: 0, optLayout: 'row',
        why: `Multiply the numbers and add the indices: ${c1} × ${c2} = ${c1 * c2} and ${m}${sup(e1)} × ${m}${sup(e2)} = ${m}${sup(e1 + e2)}. (${opts[1]} adds the numbers, ${opts[2]} multiplies the indices, ${opts[3]} subtracts the indices.)`,
      };
    }),

    // 5. Annual salary to pay per fortnight (TY8 Q1)
    q(() => {
      const salary = 81640;
      const week = salary / 52, fortnight = salary / 26, half = salary / 24, month = salary / 12;
      const opts = [week, fortnight, half, month];                         // ÷ 52, right (÷ 26), ÷ 24, ÷ 12
      check(new Set(opts.map((x) => round(x, 2))).size === 4 && opts.every((x, i) => i === 0 || x > opts[i - 1]), 'MC5 options must differ and be in order');
      return {
        type: 'mc', level: 'green', src: 'TY8 Q1 (8.01, green)', topic: 'Salary: pay per fortnight',
        text: `Ella is a nurse. She earns an annual salary of ${money(salary)}. How much is she paid per fortnight?`,
        formula: '1 year = 52 weeks = 26 fortnights = 12 months',
        options: opts.map((x) => money(x, 2)), answer: 1, optLayout: 'row',
        why: `Pay per fortnight = ${money(salary)} ÷ 26 = ${money(fortnight, 2)}. (${money(week, 2)} is the pay per week (÷ 52), ${money(month, 2)} the pay per month (÷ 12), and ${money(half, 2)} divides by 24 instead of 26.)`,
      };
    }),

    // ================================================================ short answer (18 marks: 11 green, 7 blue)

    // 6. Simplifying: like terms, multiplying and dividing terms (TY1 Q3 and Q4)
    q(() => {
      const a = v('a'), b = v('b'), x = v('x'), y = v('y'), m = v('m'), n = v('n');
      return {
        type: 'sa', src: 'TY1 Q3 and Q4 (1.03, 1.04, green)', topic: 'Simplifying algebraic expressions',
        text: 'Simplify:',
        parts: [
          { text: nw(`5${a} + 3${b} − 2${a} + ${b}`), marks: 1, level: 'green',
            answer: `3${a} + 4${b}`, marking: [`3${a} + 4${b}`] },
          { text: nw(`4${x} × 3${y}`), marks: 1, level: 'green',
            answer: `12${x}${y}`, marking: [`12${x}${y}`] },
          { text: nw(`18${m}${n} ÷ 6${m}`), marks: 1, level: 'green',
            answer: `3${n}`, marking: [`3${n}`] },
        ],
      };
    }),

    // 7. Expand and simplify with a negative multiplier (TY1 Q7)
    q(() => {
      const p = 3, b1 = 4, c1 = -5, r = -2, b2 = 1, c2 = -6, x = v('x');
      const A = p * b1 + r * b2, B = p * c1 + r * c2;
      const bracket = (bb, cc) => `(${lin(bb, cc, x)})`;
      const expr = `${p}${bracket(b1, c1)} − ${-r}${bracket(b2, c2)}`;
      const expanded = `${term(p * b1, x, true)}${term(p * c1)}${term(r * b2, x)}${term(r * c2)}`;
      const wrong = p * c1 - r * c2;   // −2 × −6 taken as −12
      return {
        type: 'sa', marks: 2, level: 'blue', src: 'TY1 Q7 (1.07, blue)', topic: 'Expanding and simplifying',
        text: ['Expand and simplify:', nw(expr)],
        answer: lin(A, B, x),
        working: [`= ${expanded}`],
        marking: [`correct expansion of both brackets: ${expanded}`, `${lin(A, B, x)}`],
        notes: `Common error: ${lin(A, wrong, x)} (−${-r} × ${c2 < 0 ? `(−${-c2})` : c2} taken as ${num(r * -c2)}): 1 mark.`,
      };
    }),

    // 8. Factorising: highest common factor (TY1 Q8)
    q(() => {
      const x = v('x'), y = v('y');
      return {
        type: 'sa', src: 'TY1 Q8 (1.08, blue)', topic: 'Factorising',
        text: 'Factorise:',
        parts: [
          { text: nw(`6${x} + 15`), marks: 1, level: 'blue',
            answer: `3(2${x} + 5)`, marking: [`3(2${x} + 5)`] },
          { text: nw(`${y}² − 8${y}`), marks: 1, level: 'blue',
            answer: `${y}(${y} − 8)`, marking: [`${y}(${y} − 8)`] },
        ],
      };
    }),

    // 9. Simple interest I = Prn (TY3 Q19)
    q(() => {
      const P = 7250, rate = 4.2, n = 3;
      const I = P * (rate / 100) * n;
      return {
        type: 'sa', marks: 2, level: 'green', src: 'TY3 Q19 (3.07, green)', topic: 'Simple interest',
        text: `Liam invests ${money(P)} for ${n} years at ${rate}% p.a. simple interest. Calculate the interest he earns.`,
        formula: `Simple interest: ${nw(`${v('I')} = ${v('Prn')}`)}`,
        answer: money(I, 2),
        working: [`${v('I')} = ${money(P)} × ${num(rate / 100)} × ${n}`],
        marking: [`correct substitution: ${money(P)} × ${num(rate / 100)} × ${n}`, money(I, 2)],
        notes: `Common error: ${v('r')} = ${rate} instead of ${num(rate / 100)} (${money(P * rate * n, 2)}): 1 mark.`,
      };
    }),

    // 10. Profit and percentage profit (TY3 Q17)
    q(() => {
      const cost = 480, sell = 612, profit = sell - cost, pct = (profit / cost) * 100;
      return {
        type: 'sa', src: 'TY3 Q17 (3.06, green)', topic: 'Profit as a percentage of the cost price',
        text: `A surf shop buys a surfboard for ${money(cost)} and sells it for ${money(sell)}.`,
        formula: 'Percentage profit = profit ÷ cost price × 100%',
        parts: [
          { text: 'Find the profit.', marks: 1, level: 'green',
            answer: money(profit), working: [`${money(sell)} − ${money(cost)}`],
            marking: [money(profit)] },
          { text: 'Find the profit as a percentage of the cost price.', marks: 1, level: 'green',
            answer: `${num(pct)}%`, working: [`${money(profit)} ÷ ${money(cost)} × 100%`],
            marking: [`${num(pct)}%`],
            notes: `Follow-through from part a. Common error: dividing by the selling price (${num((profit / sell) * 100, 1)}%): 0 marks.` },
        ],
      };
    }),

    // 11. Solving equations: two-step (TY7 Q1), then brackets with a negative and the variable on both sides (TY7 Q5)
    q(() => {
      const a1 = 5, b1 = -8, r1 = 27, x = v('x');
      const xa = (r1 - b1) / a1;
      const A = 7, B = 2, C = 3, D = 3, E = 10, m = v('m');      // 7m − 2(m + 3) = 3m + 10
      const mb = (E + B * C) / (A - B - D);
      const mWrong = (E - B * C) / (A - B - D);                   // −2 × 3 taken as +6
      check(Number.isInteger(xa) && Number.isInteger(mb), 'Q11: the solutions should be whole numbers');
      return {
        type: 'sa', src: 'TY7 Q1 (7.01, green) and Q5 (7.03, blue)', topic: 'Solving equations',
        text: 'Solve each equation.',
        parts: [
          { text: nw(`${lin(a1, b1, x)} = ${r1}`), marks: 2, level: 'green',
            answer: `${x} = ${num(xa)}`, working: [`${coefX(a1, x)} = ${r1 - b1}`],
            marking: [`${coefX(a1, x)} = ${r1 - b1}`, `${x} = ${num(xa)}`] },
          { text: nw(`${coefX(A, m)} − ${B}(${m} + ${C}) = ${lin(D, E, m)}`), marks: 3, level: 'blue', space: 40,
            answer: `${m} = ${num(mb)}`,
            working: [`${coefX(A, m)} − ${coefX(B, m)} − ${B * C} = ${lin(D, E, m)}`, `${lin(A - B, -B * C, m)} = ${lin(D, E, m)}`, `${coefX(A - B - D, m)} = ${E + B * C}`],
            marking: [`expands the bracket: ${coefX(A, m)} − ${coefX(B, m)} − ${B * C}`, `collects the terms: ${coefX(A - B - D, m)} = ${E + B * C}`, `${m} = ${num(mb)}`],
            notes: `Common error: −${B} × ${C} taken as +${B * C}, giving ${m} = ${num(mWrong)}: 2 marks (follow-through).` },
        ],
      };
    }),

    // 12. Retainer plus commission (TY8 Q5)
    q(() => {
      const retainer = 520, rate = 2.5, sales = 46800;
      const comm = sales * rate / 100, total = retainer + comm;
      return {
        type: 'sa', marks: 2, level: 'green', src: 'TY8 Q5 (8.03, green)', topic: 'Commission',
        text: `Jake sells cars. He is paid ${money(retainer)} per week plus ${rate}% commission on his sales. Last week he sold ${money(sales)} worth of cars. Calculate Jake’s total pay for the week.`,
        answer: money(total),
        working: [`Commission: ${rate}% × ${money(sales)} = ${money(comm)}`, `Total: ${money(retainer)} + ${money(comm)}`],
        marking: [`commission ${money(comm)}`, `total pay ${money(total)}`],
        notes: `Commission only (${money(comm)}) earns the first mark.`,
      };
    }),

    // ================================================================ worded problems (3 + 3 + 4 marks)

    // 13. Wages with overtime at time-and-a-half (TY8 Q2 and Q3)
    q(() => {
      const rate = 26.8, worked = 44, normalH = 38, otH = worked - normalH;
      const normal = normalH * rate, ot = otH * 1.5 * rate, total = normal + ot;
      return {
        type: 'worded', keepTogether: true, src: 'TY8 Q2 and Q3 (8.01, 8.02, green)', topic: 'Wages and overtime',
        text: [`Mia works in a bakery. Her normal rate of pay is ${money(rate, 2)} per hour for the first ${normalH} hours each week. She is paid time-and-a-half for each hour after that.`,
          `Last week Mia worked ${worked} hours.`],
        parts: [
          { text: `Calculate Mia’s pay for the first ${normalH} hours.`, marks: 1, level: 'green', space: 22,
            answer: money(normal, 2), working: [`${normalH} × ${money(rate, 2)}`],
            marking: [money(normal, 2)] },
          { text: `Calculate Mia’s total pay for the ${worked} hours.`, marks: 2, level: 'green', space: 36,
            answer: money(total, 2),
            working: [`Overtime: ${otH} × 1.5 × ${money(rate, 2)} = ${money(ot, 2)}`, `Total: ${money(normal, 2)} + ${money(ot, 2)}`],
            marking: [`overtime pay ${money(ot, 2)} (${otH} hours at time-and-a-half)`, `total ${money(total, 2)}`],
            notes: [`Follow-through from part a.`, `Common error: overtime at the normal rate (${money(worked * rate, 2)} in total): 1 mark.`] },
        ],
      };
    }),

    // 14. Using a formula: gym membership (TY7 Q11)
    q(() => {
      const fee = 60, perW = 15, w1 = 12, paid = 300;
      const C1 = fee + perW * w1, w2 = (paid - fee) / perW;
      const C = v('C'), w = v('w');
      check(Number.isInteger(w2), 'Q14: the number of weeks should be a whole number');
      return {
        type: 'worded', keepTogether: true, src: 'TY7 Q11 (7.06, green)', topic: 'Using a formula; solving an equation',
        text: [`A gym charges a joining fee of ${money(fee)} plus ${money(perW)} per week. The total cost, ${C} dollars, for ${w} weeks is given by the formula`,
          `<b>${nw(`${C} = ${fee} + ${perW}${w}`)}</b>`],
        parts: [
          { text: `Find the total cost for ${w1} weeks.`, marks: 1, level: 'green', space: 22,
            answer: money(C1), working: [`${C} = ${fee} + ${perW} × ${w1}`],
            marking: [money(C1)] },
          { text: `Jo paid ${money(paid)} altogether. Write an equation and solve it to find how many weeks Jo went to the gym.`, marks: 2, level: 'green', space: 36,
            answer: `${num(w2)} weeks`,
            working: [`${fee} + ${perW}${w} = ${paid}`, `${perW}${w} = ${paid - fee}`, `${w} = ${paid - fee} ÷ ${perW}`],
            marking: [`equation ${nw(`${fee} + ${perW}${w} = ${paid}`)} (or ${perW}${w} = ${paid - fee})`, `${num(w2)} weeks`],
            notes: `Accept a correct answer by guess and check with working shown: 2 marks.` },
        ],
      };
    }),

    // 15. A ladder against a wall: Pythagoras (TY2 Q8), then an angle (TY4 Q13)
    q(() => {
      const L = 5.2, d = 1.6;
      const h = leg(L, d), th = acosD(d / L);
      const hr = round(h, 2);
      check(Math.round((Math.asin(hr / L) * 180) / Math.PI) === Math.round(th) && Math.round((Math.atan(hr / d) * 180) / Math.PI) === Math.round(th),
        'Q15b: sin and tan with the rounded answer to part a should give the same angle');
      return {
        type: 'worded', keepTogether: true, src: 'TY2 Q8 (2.04, green) and TY4 Q13 (4.07, green)', topic: 'Ladder: Pythagoras and trigonometry',
        text: [`A ladder ${unit(L, 'm')} long leans against a vertical wall. The foot of the ladder is ${unit(d, 'm')} from the wall, on level ground.`],
        fig: ladderFig({ L, d, size: 46 }),
        formula: [PYTH, TRIG],
        parts: [
          { text: `Find ${v('h')}, the height the ladder reaches up the wall, correct to 2 decimal places.`, marks: 2, level: 'green', space: 36,
            answer: unit(h, 'm', 2), working: [`${v('h')}² = ${num(L)}² − ${num(d)}² = ${num(L * L, 2)} − ${num(d * d, 2)} = ${num(L * L - d * d, 2)}`, `${v('h')} = √${num(L * L - d * d, 2)} = ${dp(h, 4)}…`],
            marking: [`${v('h')}² = ${num(L)}² − ${num(d)}² (= ${num(L * L - d * d, 2)})`, `${dp(h, 2)} m`],
            notes: `Common error: adding the squares, √(${num(L)}² + ${num(d)}²) = ${dp(hyp(L, d), 2)}: 0 marks.` },
          { text: `Find the angle ${v('θ')} that the ladder makes with the ground, correct to the nearest degree.`, marks: 2, level: 'green', space: 36,
            answer: `${Math.round(th)}°`, working: [`cos ${v('θ')} = ${frac(num(d), num(L))}`, `${v('θ')} = cos<sup>−1</sup>(${num(d)} ÷ ${num(L)}) = ${dp(th, 2)}…°`],
            marking: [`cos ${v('θ')} = ${num(d)} ÷ ${num(L)} (or sin or tan with the answer to part a)`, `${Math.round(th)}°`],
            notes: 'Accept sin or tan with the answer to part a (follow-through): both give the same angle to the nearest degree.' },
        ],
      };
    }),
  ],
};
