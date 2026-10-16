// Section 3: Mixed Topics (Chapters 1–8): 1 Algebra, 2 Pythagoras’ theorem, 3 Numeracy and calculation,
// 4 Trigonometry, 5 Indices, 7 Equations, 8 Earning money. 21 marks: 5 multiple choice (1 mark each), short answer
// (10 marks), 2 worded problems (3 marks each). Levels: 15 green, 6 blue.
// No geometry, no surds and no exact-value answers: Pythagoras answers are rounded decimals. Nothing from PATH or
// extension. Chapter 6 has no eligible questions: the brief excludes its geometry, and the rest of Test yourself 6 is
// PATH (6.03, 6.04), so no question comes from Chapter 6.
//
// Every question is a NEW question in the style of a GREEN or BLUE Test yourself question (src names it).
//   Green (15): MC 1-5 (5), Q7 (2), Q8 (2), Q9 (2), Q10a (1), Q11a (1), Q12a (1), Q12b (1).
//   Blue (6):   Q6 (2), Q10b (1), Q11b (2), Q12c (1).
// Marks by chapter: Ch1 3 (MC1, Q6), Ch2 2 (MC2, Q12a), Ch3 3 (MC3, Q7), Ch4 4 (Q8, Q12b, Q12c), Ch5 3 (MC4, Q9),
//   Ch7 2 (Q10), Ch8 4 (MC5, Q11).
'use strict';
const { groupDec, num, dp, money, unit, frac, v, nw, round, hyp, leg, sinD, cosD, acosD, q } = require('../lib/helpers');
const F = require('../lib/figs');

const check = (cond, msg) => { if (!cond) throw new Error(`s3-mixed: ${msg}`); };

// ---------------------------------------------------------------- text helpers
const PYTH = `Pythagoras’ theorem: ${nw(`${v('c')}² = ${v('a')}² + ${v('b')}²`)}`;
const SIN = nw(`sin ${v('θ')} = ${frac('opp', 'hyp')}`), COS = nw(`cos ${v('θ')} = ${frac('adj', 'hyp')}`), TAN = nw(`tan ${v('θ')} = ${frac('opp', 'adj')}`);
const TRIG = `${SIN}, ${COS}, ${TAN}`;
const TRIG2 = `${SIN}, ${COS},<br>${TAN}`;      // for the narrow Question column: breaks before tan
// A signed term for a worked line: term(-15) -> ' − 15', term(12) -> ' + 12', term(4, x, true) -> '4x' (first term).
const coefX = (a, x) => (a === 1 ? x : a === -1 ? `−${x}` : `${num(a)}${x}`);
const term = (a, x = '', first = false) => {
  const body = x ? (Math.abs(a) === 1 ? x : `${num(Math.abs(a))}${x}`) : num(Math.abs(a));
  if (first) return a < 0 ? `−${body}` : body;
  return a < 0 ? ` − ${body}` : ` + ${body}`;
};
const lin = (a, b, x) => `${coefX(a, x)}${b === 0 ? '' : term(b)}`;
// Scientific notation: sci(168000) -> { m: 1.68, e: 5 }; sciStr(1.68, 5) -> '1.68 × 10⁵' (with <sup>).
const sci = (x) => {
  let e = Math.floor(Math.log10(Math.abs(x)) + 1e-9);
  let m = round(x / 10 ** e, 6);
  if (Math.abs(m) >= 10) { m = round(m / 10, 6); e += 1; }
  return { m, e };
};
const sup = (e) => `<sup>${e < 0 ? `−${-e}` : e}</sup>`;
const sciStr = (m, e) => `${num(m)} × 10${sup(e)}`;
// Decimal places grouped in threes (NSW style): groupDec('0.000724') -> '0.000 724' (lib/helpers.js).

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

    // ================================================================ short answer (10 marks: 7 green, 3 blue)

    // 6. Expand and simplify with a negative multiplier (TY1 Q7)
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

    // 7. Simple interest I = Prn (TY3 Q19)
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

    // 8. Unknown side in the numerator (TY4 Q10)
    q(() => {
      const H = 14.5, ang = 38;
      const x = H * sinD(ang), adj = H * cosD(ang);
      return {
        type: 'sa', marks: 2, level: 'green', src: 'TY4 Q10 (4.05, green)', topic: 'Trigonometry: finding a side',
        text: `Find the value of ${v('x')}, correct to 2 decimal places.`,
        fig: F.rightTriangle({ base: adj, height: x, corner: 'BR', labels: { base: '', height: `${v('x')} cm`, hyp: unit(H, 'cm') }, angle: { at: 'base', label: `${ang}°` }, size: 40 }),
        formula: TRIG2,
        answer: unit(x, 'cm', 2),
        working: [`sin ${ang}° = ${frac(v('x'), num(H))}`, `${v('x')} = ${num(H)} × sin ${ang}° = ${dp(x, 4)}…`],
        marking: [`sin ${ang}° = ${v('x')} ÷ ${num(H)} (or ${v('x')} = ${num(H)} sin ${ang}°)`, `${dp(x, 2)} cm`],
        notes: `Common errors: ${num(H)} × cos ${ang}° = ${dp(adj, 2)} or ${num(H)} ÷ sin ${ang}° = ${dp(H / sinD(ang), 2)}: 0 marks.`,
      };
    }),

    // 9. Scientific notation: write a small number; multiply in scientific notation (TY5 Q10, Q13)
    q(() => {
      const small = '0.000724', val = +small, s = sci(val);
      const m1 = 4.8, e1 = 6, m2 = 3.5, e2 = -2;
      const prod = m1 * 10 ** e1 * m2 * 10 ** e2, P = sci(prod), mm = round(m1 * m2, 6);
      check(mm >= 10 && P.e === e1 + e2 + 1, 'Q9b: the product of the numbers should be over 10 (so it must be adjusted)');
      return {
        type: 'sa', src: 'TY5 Q10 and Q13 (5.08, 5.09, green)', topic: 'Scientific notation',
        text: '',
        parts: [
          { text: `Write ${nw(groupDec(small))} in scientific notation.`, marks: 1, level: 'green',
            answer: sciStr(s.m, s.e), working: [`Move the decimal point ${-s.e} places to the right.`],
            marking: [sciStr(s.m, s.e)] },
          { text: `Evaluate ${nw(`(${sciStr(m1, e1)})`)} × ${nw(`(${sciStr(m2, e2)})`)}, giving your answer in scientific notation.`, marks: 1, level: 'green',
            answer: sciStr(P.m, P.e),
            working: [`= ${num(m1)} × ${num(m2)} × 10${sup(e1)} × 10${sup(e2)}`, `= ${num(mm)} × 10${sup(e1 + e2)}`],
            marking: [sciStr(P.m, P.e)],
            notes: `${num(mm)} × 10${sup(e1 + e2)} is not in scientific notation: 0 marks. Accept ${num(prod)} only if also written as ${sciStr(P.m, P.e)}.` },
        ],
      };
    }),

    // 10. Solving equations: two-step (TY7 Q1), then brackets with a negative and the variable on both sides (TY7 Q5)
    q(() => {
      const a1 = 5, b1 = -8, r1 = 27, x = v('x');
      const xa = (r1 - b1) / a1;
      const A = 7, B = 2, C = 3, D = 3, E = 10, m = v('m');      // 7m − 2(m + 3) = 3m + 10
      const mb = (E + B * C) / (A - B - D);
      const mWrong = (E - B * C) / (A - B - D);                   // −2 × 3 taken as +6
      check(Number.isInteger(xa) && Number.isInteger(mb), 'Q10: the solutions should be whole numbers');
      return {
        type: 'sa', src: 'TY7 Q1 (7.01, green) and Q5 (7.03, blue)', topic: 'Solving equations',
        text: 'Solve each equation.',
        parts: [
          { text: nw(`${lin(a1, b1, x)} = ${r1}`), marks: 1, level: 'green',
            answer: `${x} = ${num(xa)}`, working: [`${coefX(a1, x)} = ${r1 - b1}`],
            marking: [`${x} = ${num(xa)}`] },
          { text: nw(`${coefX(A, m)} − ${B}(${m} + ${C}) = ${lin(D, E, m)}`), marks: 1, level: 'blue', space: 30,
            answer: `${m} = ${num(mb)}`,
            working: [`${coefX(A, m)} − ${coefX(B, m)} − ${B * C} = ${lin(D, E, m)}`, `${lin(A - B, -B * C, m)} = ${lin(D, E, m)}`, `${coefX(A - B - D, m)} = ${E + B * C}`],
            marking: [`${m} = ${num(mb)}`],
            notes: `Common error: −${B} × ${C} taken as +${B * C}, giving ${m} = ${num(mWrong)}: 0 marks.` },
        ],
      };
    }),

    // ================================================================ worded problems (2 x 3 marks)

    // 11. Wages from an award with time-and-a-half and double time (TY8 Q2 and Q4)
    q(() => {
      const rate = 26.8, worked = 44, normalH = 38, t1H = 3, t2H = worked - normalH - t1H;
      const normal = normalH * rate, ot1 = t1H * 1.5 * rate, ot2 = t2H * 2 * rate, total = normal + ot1 + ot2;
      const allOneHalf = normal + (worked - normalH) * 1.5 * rate;
      check(t2H > 0, 'Q11: some hours must be at double time');
      return {
        type: 'worded', keepTogether: true, src: 'TY8 Q2 (8.01, green) and Q4 (8.02, blue)', topic: 'Wages and overtime (award rates)',
        text: [`Mia works in a bakery. Her normal rate of pay is ${money(rate, 2)} per hour, and she is paid according to the award shown below.`,
          `Last week Mia worked ${worked} hours.`],
        fig: F.table({ head: ['Pay rate', 'Hours worked'], rows: [['Normal rate', `For 0 to ${normalH} hours`], ['Time-and-a-half', `For the next ${t1H} hours`], ['Double time', 'For each hour after that']], align: 'left' }),
        parts: [
          { text: `Calculate Mia’s pay for the first ${normalH} hours.`, marks: 1, level: 'green', space: 34,
            answer: money(normal, 2), working: [`${normalH} × ${money(rate, 2)}`],
            marking: [money(normal, 2)] },
          { text: `Calculate Mia’s total pay for the ${worked} hours.`, marks: 2, level: 'blue', space: 58,
            answer: money(total, 2),
            working: [`Time-and-a-half: ${t1H} × 1.5 × ${money(rate, 2)} = ${money(ot1, 2)}`, `Double time: ${t2H} × 2 × ${money(rate, 2)} = ${money(ot2, 2)}`, `Total: ${money(normal, 2)} + ${money(ot1, 2)} + ${money(ot2, 2)}`],
            marking: [`overtime pay at both rates: ${money(ot1, 2)} and ${money(ot2, 2)} (or ${money(ot1 + ot2, 2)} in total)`, `total ${money(total, 2)}`],
            notes: [`Follow-through from part a.`, `Common error: all ${worked - normalH} extra hours at time-and-a-half (${money(allOneHalf, 2)}): 1 mark.`] },
        ],
      };
    }),

    // 12. A ladder against a wall: Pythagoras (TY2 Q8), an angle (TY4 Q13), unknown in the denominator (TY4 Q11)
    q(() => {
      const L = 5.2, d = 1.6;
      const h = leg(L, d), th = acosD(d / L);
      const ang2 = 75, up2 = 6.5, L2 = up2 / sinD(ang2);
      const hr = round(h, 2);
      check(Math.round((Math.asin(hr / L) * 180) / Math.PI) === Math.round(th) && Math.round((Math.atan(hr / d) * 180) / Math.PI) === Math.round(th),
        'Q12b: sin and tan with the rounded answer to part a should give the same angle');
      return {
        type: 'worded', keepTogether: true, src: 'TY2 Q8 (2.04, green), TY4 Q13 (4.07, green) and Q11 (4.06, blue)', topic: 'Ladder: Pythagoras and trigonometry',
        text: [`A ladder ${unit(L, 'm')} long leans against a vertical wall. The foot of the ladder is ${unit(d, 'm')} from the wall, on level ground.`],
        fig: ladderFig({ L, d, size: 46 }),
        formula: [PYTH, TRIG],
        parts: [
          { text: `Find ${v('h')}, the height the ladder reaches up the wall, correct to 2 decimal places.`, marks: 1, level: 'green', space: 34,
            answer: unit(h, 'm', 2), working: [`${v('h')}² = ${num(L)}² − ${num(d)}² = ${num(L * L, 2)} − ${num(d * d, 2)} = ${num(L * L - d * d, 2)}`, `${v('h')} = √${num(L * L - d * d, 2)} = ${dp(h, 4)}…`],
            marking: [`${dp(h, 2)} m`],
            notes: `Common error: adding the squares, √(${num(L)}² + ${num(d)}²) = ${dp(hyp(L, d), 2)}: 0 marks.` },
          { text: `Find the angle ${v('θ')} that the ladder makes with the ground, correct to the nearest degree.`, marks: 1, level: 'green', space: 32,
            answer: `${Math.round(th)}°`, working: [`cos ${v('θ')} = ${frac(num(d), num(L))}`, `${v('θ')} = cos<sup>−1</sup>(${num(d)} ÷ ${num(L)}) = ${dp(th, 2)}…°`],
            marking: [`${Math.round(th)}°`],
            notes: 'Accept sin or tan with the answer to part a (follow-through): both give the same angle to the nearest degree.' },
          { text: `For safety, a ladder should make an angle of ${ang2}° with the ground. A longer ladder is placed at ${ang2}° so that its top reaches ${unit(up2, 'm')} up the wall. How long is this ladder? Answer correct to 2 decimal places.`, marks: 1, level: 'blue', space: 46,
            answer: unit(L2, 'm', 2), working: [`sin ${ang2}° = ${frac(num(up2), v('L'))}`, `${v('L')} = ${num(up2)} ÷ sin ${ang2}° = ${dp(L2, 4)}…`],
            marking: [`${dp(L2, 2)} m`],
            notes: `Common error: ${num(up2)} × sin ${ang2}° = ${dp(up2 * sinD(ang2), 2)} m (unknown treated as in the numerator): 0 marks.` },
        ],
      };
    }),
  ],
};
