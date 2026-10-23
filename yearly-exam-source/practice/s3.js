// Practice exams, Section 3: Mixed Topics (Chapters 1–8). Every Section 3 skill of the yearly exam, once each:
// MC 1 substitution, MC 2 Pythagoras (hypotenuse), MC 3 discount, MC 4 index laws, MC 5 salary per fortnight;
// Q6 simplifying (like terms, dividing terms), Q7 expanding and simplifying, Q8 factorising, Q9 simple interest,
// Q10 profit and percentage profit, Q11 equation with brackets, Q12 retainer plus commission;
// Q13 wages with overtime, Q14 using a formula and solving an equation, Q15 ladder (Pythagoras and an angle).
// 29 marks. The numbers and contexts for each practice exam are in params.js.
'use strict';
const { num, dp, money, unit, frac, v, nw, round, hyp, leg, acosD, q } = require('../lib/helpers');
const F = require('../lib/figs');

const check = (cond, msg) => { if (!cond) throw new Error(`practice s3: ${msg}`); };
const PYTH = `Pythagoras’ theorem: ${nw(`${v('c')}² = ${v('a')}² + ${v('b')}²`)}`;
const SIN = nw(`sin ${v('θ')} = ${frac('opp', 'hyp')}`), COS = nw(`cos ${v('θ')} = ${frac('adj', 'hyp')}`), TAN = nw(`tan ${v('θ')} = ${frac('opp', 'adj')}`);
const TRIG = `${SIN}, ${COS}, ${TAN}`;
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

module.exports = (P) => ({
  id: 's3',
  title: 'Mixed Topics (Chapters 1–8)',
  short: 'Mixed Topics',
  questions: [
    // MC 1. Substitution with a squared term (the k·a² trap)
    q(() => {
      const { k, a, b, sign, va, vb } = P.subst;
      const s = sign === '+' ? 1 : -1, op = sign === '+' ? '+' : '−';
      const right = k * a * a + s * b, sqFirst = (k * a) ** 2 + s * b, asDouble = k * 2 * a + s * b, noSq = k * a + s * b;
      const opts = [noSq, asDouble, right, sqFirst];
      check(new Set(opts).size === 4 && opts.every((x, i) => i === 0 || x > opts[i - 1]), 'MC1 options must differ and be in order');
      return {
        type: 'mc', level: 'green', src: 'TY1 Q2 (1.02, green)', topic: 'Substitution',
        text: `If ${v(va)} = ${a} and ${v(vb)} = ${b}, evaluate ${nw(`${k}${v(va)}² ${op} ${v(vb)}`)}.`,
        options: opts.map((x) => num(x)), answer: 2, optLayout: 'row',
        why: `${k} × ${a}² ${op} ${b} = ${k} × ${a * a} ${op} ${b} = ${right}. Square ${v(va)} first, then multiply by ${k}.`,
      };
    }),

    // MC 2. Hypotenuse, closest answer
    q(() => {
      const { a, b } = P.pyth;
      const c = hyp(a, b);
      const vals = [a + b, c, leg(Math.max(a, b), Math.min(a, b)), Math.abs(b - a)].map((x) => round(x, 1));
      check(new Set(vals).size === 4, 'MC2 options must differ');
      return {
        type: 'mc', level: 'green', src: 'TY2 Q5 (2.03, green)', topic: 'Pythagoras’ theorem: hypotenuse',
        text: `Find the value of ${v('x')}. Select the closest answer.`,
        formula: PYTH,
        fig: F.rightTriangle({ base: b, height: a, corner: P.pyth.corner || 'TL', labels: { base: unit(b, 'cm'), height: unit(a, 'cm'), hyp: `${v('x')} cm` }, size: 40 }),
        figPos: 'right',
        options: vals.map((x) => num(x, 1)), answer: 1, optLayout: 'row',
        why: `${v('x')}² = ${num(a)}² + ${num(b)}² = ${num(a * a + b * b, 2)}, so ${v('x')} = ${dp(c, 3)}… ≈ ${dp(c, 1)}.`,
      };
    }),

    // MC 3. Discount and selling price
    q(() => {
      const { price, pct, item } = P.discount;
      const disc = price * pct / 100, sell = price - disc;
      const vals = [price + disc, price - pct, sell, disc];
      check(new Set(vals).size === 4 && vals.every((x, i) => i === 0 || x < vals[i - 1]), 'MC3 options must differ and be in order');
      return {
        type: 'mc', level: 'green', src: 'TY3 Q16 (3.06, green)', topic: 'Discount and selling price',
        text: `${item} is marked at ${money(price)}. In a sale it is discounted by ${pct}%. What is the selling price?`,
        options: vals.map((x) => money(x, 2)), answer: 2, optLayout: 'row',
        why: `Discount = ${pct}% × ${money(price)} = ${money(disc, 2)}; selling price = ${money(price)} − ${money(disc, 2)} = ${money(sell, 2)}.`,
      };
    }),

    // MC 4. Index laws: multiplying terms with coefficients
    q(() => {
      const { c1, e1, c2, e2, x } = P.index;
      const m = v(x);
      const t = (c, e) => `${c}${m}${sup(e)}`;
      const raw = [[c1 * c2, e1 + e2], [c1 + c2, e1 + e2], [c1 * c2, e1 * e2], [c1 * c2, e1 - e2]];
      check(new Set(raw.map(String)).size === 4 && e1 > e2, 'MC4 options must differ');
      const order = P.index.order;
      const opts = order.map((i) => t(...raw[i]));
      return {
        type: 'mc', level: 'green', src: 'TY5 Q1 (5.01, green)', topic: 'Index laws: multiplying terms',
        text: `Simplify ${nw(`${t(c1, e1)} × ${t(c2, e2)}`)}.`,
        options: opts, answer: order.indexOf(0), optLayout: 'row',
        why: `Multiply the numbers and add the indices: ${c1} × ${c2} = ${c1 * c2} and ${m}${sup(e1)} × ${m}${sup(e2)} = ${m}${sup(e1 + e2)}.`,
      };
    }),

    // MC 5. Annual salary to pay per fortnight
    q(() => {
      const { salary, who } = P.salary;
      const week = salary / 52, fortnight = salary / 26, half = salary / 24, month = salary / 12;
      const opts = [week, fortnight, half, month];
      check(Number.isInteger(fortnight * 100) && new Set(opts.map((x) => round(x, 2))).size === 4, 'MC5 options must differ');
      return {
        type: 'mc', level: 'green', src: 'TY8 Q1 (8.01, green)', topic: 'Salary: pay per fortnight',
        text: `${who} earns an annual salary of ${money(salary)}. How much is this per fortnight?`,
        formula: '1 year = 52 weeks = 26 fortnights = 12 months',
        options: opts.map((x) => money(x, 2)), answer: 1, optLayout: 'row',
        why: `Pay per fortnight = ${money(salary)} ÷ 26 = ${money(fortnight, 2)}.`,
      };
    }),

    // Q6. Simplifying: like terms and dividing terms
    q(() => ({
      type: 'sa', src: 'TY1 Q3 and Q4 (1.03, 1.04, green)', topic: 'Simplifying algebraic expressions',
      text: 'Simplify:',
      parts: P.simplify.map(([text, ans]) => ({ text: nw(text), marks: 1, level: 'green', answer: ans, marking: [ans] })),
    })),

    // Q7. Expand and simplify with a negative multiplier
    q(() => {
      const { p, b1, c1, r, b2, c2, x: xs } = P.expand;
      const x = v(xs);
      const A = p * b1 + r * b2, B = p * c1 + r * c2;
      const bracket = (bb, cc) => `(${lin(bb, cc, x)})`;
      const expr = `${p}${bracket(b1, c1)} − ${-r}${bracket(b2, c2)}`;
      const expanded = `${term(p * b1, x, true)}${term(p * c1)}${term(r * b2, x)}${term(r * c2)}`;
      return {
        type: 'sa', marks: 2, level: 'blue', src: 'TY1 Q7 (1.07, blue)', topic: 'Expanding and simplifying',
        text: ['Expand and simplify:', nw(expr)],
        answer: lin(A, B, x), working: [`= ${expanded}`],
        marking: [`correct expansion of both brackets: ${expanded}`, `${lin(A, B, x)}`],
      };
    }),

    // Q8. Factorising: a number HCF and a pronumeral HCF
    q(() => ({
      type: 'sa', src: 'TY1 Q8 (1.08, blue)', topic: 'Factorising',
      text: 'Factorise:',
      parts: P.factorise.map(([text, ans]) => ({ text: nw(text), marks: 1, level: 'blue', answer: ans, marking: [ans] })),
    })),

    // Q9. Simple interest
    q(() => {
      const { P: Pr, rate, n, who } = P.interest;
      const I = Pr * (rate / 100) * n;
      return {
        type: 'sa', marks: 2, level: 'green', src: 'TY3 Q19 (3.07, green)', topic: 'Simple interest',
        text: `${who} invests ${money(Pr)} for ${n} years at ${rate}% p.a. simple interest. Calculate the interest earned.`,
        formula: `Simple interest: ${nw(`${v('I')} = ${v('Prn')}`)}`,
        answer: money(I, 2), working: [`${v('I')} = ${money(Pr)} × ${num(rate / 100)} × ${n}`],
        marking: [`correct substitution: ${money(Pr)} × ${num(rate / 100)} × ${n}`, money(I, 2)],
      };
    }),

    // Q10. Profit and percentage profit
    q(() => {
      const { cost, sell, text } = P.profit;
      const profit = sell - cost, pct = (profit / cost) * 100;
      check(Number.isInteger(pct), 'Q10: a whole-number percentage');
      return {
        type: 'sa', src: 'TY3 Q17 (3.06, green)', topic: 'Profit as a percentage of the cost price',
        text: text.replace('{cost}', money(cost)).replace('{sell}', money(sell)),
        formula: 'Percentage profit = profit ÷ cost price × 100%',
        parts: [
          { text: 'Find the profit.', marks: 1, level: 'green', answer: money(profit), working: [`${money(sell)} − ${money(cost)}`], marking: [money(profit)] },
          { text: 'Find the profit as a percentage of the cost price.', marks: 1, level: 'green',
            answer: `${num(pct)}%`, working: [`${money(profit)} ÷ ${money(cost)} × 100%`], marking: [`${num(pct)}%`] },
        ],
      };
    }),

    // Q11. Equation with brackets (a negative multiplier) and the pronumeral on both sides
    q(() => {
      const { A, B, C, D, E, x: xs } = P.equation;
      const m = v(xs);
      const sol = (E + B * C) / (A - B - D);
      check(Number.isInteger(sol), 'Q11: a whole-number solution');
      return {
        type: 'sa', marks: 3, level: 'blue', space: 44, src: 'TY7 Q5 (7.03, blue)', topic: 'Solving equations',
        text: ['Solve:', nw(`${coefX(A, m)} − ${B}(${m} + ${C}) = ${lin(D, E, m)}`)],
        answer: `${m} = ${num(sol)}`,
        working: [`${coefX(A, m)} − ${coefX(B, m)} − ${B * C} = ${lin(D, E, m)}`, `${lin(A - B, -B * C, m)} = ${lin(D, E, m)}`, `${coefX(A - B - D, m)} = ${E + B * C}`],
        marking: [`expands the bracket: ${coefX(A, m)} − ${coefX(B, m)} − ${B * C}`, `collects the terms: ${coefX(A - B - D, m)} = ${E + B * C}`, `${m} = ${num(sol)}`],
      };
    }),

    // Q12. Retainer plus commission
    q(() => {
      const { retainer, rate, sales, who, what } = P.commission;
      const comm = sales * rate / 100, total = retainer + comm;
      check(Number.isInteger(comm), 'Q12: whole-dollar commission');
      return {
        type: 'sa', marks: 2, level: 'green', src: 'TY8 Q5 (8.03, green)', topic: 'Commission',
        text: `${who} sells ${what}. ${who} is paid ${money(retainer)} per week plus ${rate}% commission on sales. Last week ${who} sold ${money(sales)} worth of ${what}. Calculate ${who}’s total pay for the week.`,
        answer: money(total),
        working: [`Commission: ${rate}% × ${money(sales)} = ${money(comm)}`, `Total: ${money(retainer)} + ${money(comm)}`],
        marking: [`commission ${money(comm)}`, `total pay ${money(total)}`],
      };
    }),

    // Q13. Wages with overtime at time-and-a-half
    q(() => {
      const { rate, worked, who, job } = P.wages;
      const normalH = 38, otH = worked - normalH;
      const normal = normalH * rate, ot = otH * 1.5 * rate, total = normal + ot;
      return {
        type: 'worded', keepTogether: true, src: 'TY8 Q2 and Q3 (8.01, 8.02, green)', topic: 'Wages and overtime',
        text: [`${who} works ${job}. The normal rate of pay is ${money(rate, 2)} per hour for the first ${normalH} hours each week, and time-and-a-half for each hour after that.`,
          `Last week ${who} worked ${worked} hours.`],
        parts: [
          { text: `Calculate the pay for the first ${normalH} hours.`, marks: 1, level: 'green', space: 22,
            answer: money(normal, 2), working: [`${normalH} × ${money(rate, 2)}`], marking: [money(normal, 2)] },
          { text: `Calculate the total pay for the ${worked} hours.`, marks: 2, level: 'green', space: 36,
            answer: money(total, 2),
            working: [`Overtime: ${otH} × 1.5 × ${money(rate, 2)} = ${money(ot, 2)}`, `Total: ${money(normal, 2)} + ${money(ot, 2)}`],
            marking: [`overtime pay ${money(ot, 2)}`, `total ${money(total, 2)}`] },
        ],
      };
    }),

    // Q14. Using a formula, then writing and solving an equation
    q(() => {
      const f = P.formula;
      const C1 = f.fee + f.per * f.n1, n2 = (f.paid - f.fee) / f.per;
      check(Number.isInteger(n2), 'Q14: a whole-number answer');
      const C = v('C'), w = v(f.x);
      return {
        type: 'worded', keepTogether: true, src: 'TY7 Q11 (7.06, green)', topic: 'Using a formula; solving an equation',
        text: [f.text.replace('{fee}', money(f.fee)).replace('{per}', money(f.per)).replace('{x}', w).replace('{C}', C),
          `<b>${nw(`${C} = ${f.fee} + ${f.per}${w}`)}</b>`],
        parts: [
          { text: `Find the total cost for ${f.n1} ${f.unitWord}.`, marks: 1, level: 'green', space: 22,
            answer: money(C1), working: [`${C} = ${f.fee} + ${f.per} × ${f.n1}`], marking: [money(C1)] },
          { text: f.solveQ.replace('{paid}', money(f.paid)), marks: 2, level: 'green', space: 36,
            answer: `${num(n2)} ${f.unitWord}`,
            working: [`${f.fee} + ${f.per}${w} = ${f.paid}`, `${f.per}${w} = ${f.paid - f.fee}`, `${w} = ${f.paid - f.fee} ÷ ${f.per}`],
            marking: [`equation ${nw(`${f.fee} + ${f.per}${w} = ${f.paid}`)}`, `${num(n2)} ${f.unitWord}`] },
        ],
      };
    }),

    // Q15. A ladder against a wall: Pythagoras (a shorter side), then an angle
    q(() => {
      const { L, d } = P.ladder;
      const h = leg(L, d), th = acosD(d / L);
      const hr = round(h, 2);
      check(Math.round((Math.asin(hr / L) * 180) / Math.PI) === Math.round(th) && Math.round((Math.atan(hr / d) * 180) / Math.PI) === Math.round(th),
        'Q15b: sin and tan with the rounded answer to part a should give the same angle');
      return {
        type: 'worded', keepTogether: true, src: 'TY2 Q8 (2.04, green) and TY4 Q13 (4.07, green)', topic: 'Ladder: Pythagoras and trigonometry',
        text: [`${P.ladder.text.replace('{L}', unit(L, 'm')).replace('{d}', unit(d, 'm'))}`],
        fig: ladderFig({ L, d, size: 46 }),
        formula: [PYTH, TRIG],
        parts: [
          { text: `Find ${v('h')}, the height the ladder reaches up the wall, correct to 2 decimal places.`, marks: 2, level: 'green', space: 36,
            answer: unit(h, 'm', 2), working: [`${v('h')}² = ${num(L)}² − ${num(d)}² = ${num(L * L - d * d, 2)}`, `${v('h')} = √${num(L * L - d * d, 2)} = ${dp(h, 4)}…`],
            marking: [`${v('h')}² = ${num(L)}² − ${num(d)}²`, `${dp(h, 2)} m`] },
          { text: `Find the angle ${v('θ')} that the ladder makes with the ground, correct to the nearest degree.`, marks: 2, level: 'green', space: 36,
            answer: `${Math.round(th)}°`, working: [`cos ${v('θ')} = ${frac(num(d), num(L))}`, `${v('θ')} = cos<sup>−1</sup>(${num(d)} ÷ ${num(L)}) = ${dp(th, 2)}…°`],
            marking: [`cos ${v('θ')} = ${num(d)} ÷ ${num(L)}`, `${Math.round(th)}°`] },
        ],
      };
    }),
  ],
});
