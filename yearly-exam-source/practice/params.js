// Numbers and contexts for the four practice exams. Every value is new: none repeats a number or question from the
// Yearly Exam 2026 (sections/*.js) or the two revision booklets. Answers are calculated in s1.js, s2.js and s3.js,
// which also check that each set works (whole-number means, a single mode, the right skew, and so on).
'use strict';

// Italicise the pronumerals in a short algebra string: 'k² − 5k' -> '<i>k</i>² − 5<i>k</i>'.
const al = (s) => s.replace(/[a-z]/g, (c) => `<i>${c}</i>`);
const NB = ' ';

module.exports = [
  // ============================================================ Practice Exam 1
  {
    // Section 1
    classify: {
      ask: 'numerical continuous',
      options: ['The number of brothers and sisters', 'Eye colour', 'The height of a student', 'A rating of a film (poor, fair, good)'],
      answer: 2, why: 'Height is measured, so it is numerical continuous. A is discrete (counted); B and D are categorical.',
    },
    dot: {
      what: 'the number of books read last month', who: 'students', min: 0, max: 10, xTitle: 'Number of books',
      counts: { 0: 3, 1: 7, 2: 6, 3: 3, 4: 2, 5: 1, 7: 1, 9: 1 }, shape: 'pos',
      options: ['Positively skewed, clustered at 1 and 2', 'Negatively skewed, clustered at 1 and 2', 'Symmetrical, clustered at 1 and 2', 'Positively skewed, clustered at 7 and 9'],
      answer: 0, why: 'Most scores are low (clustered at 1 and 2) with a tail to the right, so the data is positively skewed.',
    },
    hist: { text: 'the number of pets owned by each of {n} students.', labels: [0, 1, 2, 3, 4, 5], freq: [6, 10, 7, 4, 2, 1], yMax: 10, xTitle: 'Number of pets', order: [2, 0, 3, 1] },
    outlier: {
      text: 'A café counted the number of customers it served in each hour of one day:',
      data: [14, 12, 15, 13, 14, 48, 13, 14], out: 48,
      options: ['The mode', 'The median', 'The mean', 'All three change by the same amount'], answer: 2,
    },
    column: {
      text: 'Students in Year 9 were asked which pet they would most like to own. The column graph shows the results.',
      labels: ['Dog', 'Cat', 'Bird', 'Fish', 'None'], freq: [18, 12, 6, 9, 15], pick: [1, 2], wrong: [18, 20, 36], answer: 1,
      yMax: 20, yStep: 4, xTitle: 'Pet',
    },
    stem: { text: 'The stem-and-leaf plot shows the marks (out of 70) of {n} students in a science test.', data: [28, 33, 35, 38, 41, 43, 46, 49, 52, 55, 64], key: '4 | 3 = 43 marks', unit: 'marks' },
    b2b: {
      names: ['9A', '9B'], group: 'class', measure: 'mark', moreQ: 'usually scored higher',
      text: 'The back-to-back stem-and-leaf plot shows the test marks (out of 100) of 10 students from each of two classes, 9A and 9B.',
      A: [52, 55, 58, 61, 63, 64, 66, 67, 70, 72], B: [38, 45, 51, 57, 62, 68, 71, 77, 83, 88], stems: [3, 8], key: '6 | 3 = 63 marks',
    },
    // Section 2
    capacity: {
      text: 'A water tank holds 7.5 kL. How many litres is this?',
      options: ['750 L', '7500 L', `75${NB}000 L`, '0.0075 L'], answer: 1, why: '1 kL = 1000 L, so 7.5 × 1000 = 7500 L.',
    },
    tri: { b: 14, h: 9, a: 4, answer: 1 },
    para: { b: 15, h: 8, s: 6, unit: 'cm', answer: 2 },
    kite: { shape: 'kite', x: 15, y: 24, c: 16, answer: 0 },
    circle: { r: 5.5, unit: 'cm', show: 'r' },
    cyl: { text: 'A closed paint tin is a cylinder.', r: 8, h: 18, u: 'cm' },
    lshape: {
      text: 'The plan shows an L-shaped lawn in a park.', thing: 'lawn', W: 20, H: 15, a: 9, t: 11, rate: 11.6,
      perimQ: 'A border is laid around the outside of the lawn. How many metres of border are needed?',
      costQ: 'Turf costs {rate} per square metre. Find the cost of turfing the whole lawn.',
    },
    box: { text: 'A closed toolbox is shaped like a box.', l: 50, w: 30, h: 20, saQ: 'The outside of the toolbox is to be painted.' },
    // Section 3
    subst: { k: 3, a: 4, b: 7, sign: '−', va: 'a', vb: 'b' },
    pyth: { a: 6.4, b: 8.7, corner: 'TL' },
    discount: { item: 'A jacket', price: 180, pct: 25 },
    index: { c1: 5, e1: 4, c2: 2, e2: 3, x: 'k', order: [1, 0, 3, 2] },
    salary: { salary: 76440, who: 'Priya, a pharmacist,' },
    simplify: [[al('6p + 4q − 2p + 3q'), al('4p + 7q')], [al('24xy ÷ 8x'), al('3y')]],
    expand: { p: 4, b1: 2, c1: -3, r: -3, b2: 1, c2: -5, x: 'x' },
    factorise: [[al('12x + 18'), al('6(2x + 3)')], [al('k² − 5k'), al('k(k − 5)')]],
    interest: { P: 6400, rate: 3.5, n: 4, who: 'Noah' },
    profit: { cost: 360, sell: 450, text: 'A bike shop buys a bike for {cost} and sells it for {sell}.' },
    equation: { A: 6, B: 3, C: 2, D: 1, E: 14, x: 'x' },
    commission: { retainer: 480, rate: 3, sales: 38600, who: 'Zara', what: 'solar panels' },
    wages: { rate: 27.6, worked: 43, who: 'Kai', job: 'at a supermarket' },
    formula: {
      fee: 25, per: 40, x: 'm', unitWord: 'months', n1: 9, paid: 505,
      text: 'A phone plan costs a {fee} connection fee plus {per} per month. The total cost, {C} dollars, for {x} months is given by the formula',
      solveQ: 'Sam paid {paid} altogether. Write an equation and solve it to find how many months Sam was on the plan.',
    },
    ladder: { L: 6.5, d: 1.8, text: 'A ladder {L} long leans against a vertical wall. The foot of the ladder is {d} from the wall, on level ground.' },
  },

  // ============================================================ Practice Exam 2
  {
    classify: {
      ask: 'numerical discrete',
      options: ['The mass of a parcel', 'The number of text messages sent in a day', 'Hair colour', 'The time taken to run 100 m'],
      answer: 1, why: 'Text messages are counted, so it is numerical discrete. A and D are continuous (measured); C is categorical.',
    },
    dot: {
      what: 'the scores (out of 10) in a times-tables quiz', who: 'students', min: 0, max: 10, xTitle: 'Score',
      counts: { 2: 1, 3: 3, 4: 5, 5: 7, 6: 5, 7: 3, 8: 1 }, shape: 'sym',
      options: ['Positively skewed, clustered at 4 to 6', 'Negatively skewed, clustered at 4 to 6', 'Symmetrical, clustered at 4 to 6', 'Symmetrical, clustered at 2 and 8'],
      answer: 2, why: 'The two sides of the dot plot match, with most scores in the middle (4 to 6), so the data is symmetrical.',
    },
    hist: { text: 'the number of people living in each of {n} houses in a street.', labels: [1, 2, 3, 4, 5, 6], freq: [4, 7, 11, 6, 3, 1], yMax: 12, yStep: 2, xTitle: 'Number of people', order: [1, 2, 0, 3] },
    outlier: {
      text: 'These are the marks (out of 70) of 7 students in a maths test:',
      data: [62, 65, 8, 64, 63, 66, 65], out: 8,
      options: ['The mean', 'The mode', 'The median', 'None of them change'], answer: 0,
    },
    column: {
      text: 'Students were asked what they most often eat for lunch. The column graph shows the results.',
      labels: ['Sandwich', 'Sushi', 'Wrap', 'Salad', 'Pie'], freq: [14, 10, 8, 4, 4], pick: [0], wrong: [14, 28, 40], answer: 2,
      yMax: 16, yStep: 2, xTitle: 'Lunch',
    },
    stem: { text: 'The stem-and-leaf plot shows the number of minutes that {n} students spent reading on Sunday.', data: [14, 19, 22, 25, 27, 27, 31, 34, 38, 40, 42], key: '2 | 7 = 27 minutes', unit: 'minutes' },
    b2b: {
      names: ['Jordan', 'Casey'], group: 'student', measure: 'number of minutes', moreQ: 'usually spends more time on homework',
      text: 'Jordan and Casey recorded how many minutes they spent on homework each night for 10 nights. The results are shown in the back-to-back stem-and-leaf plot.',
      A: [23, 26, 27, 29, 30, 31, 31, 33, 35, 37], B: [12, 18, 21, 27, 32, 34, 38, 41, 44, 49], stems: [1, 4], key: '3 | 2 = 32 minutes',
    },
    capacity: {
      text: 'A tanker carries 2350 L of milk. How many kilolitres is this?',
      options: ['23.5 kL', '235 kL', '2.35 kL', `2${NB}350${NB}000 kL`], answer: 2, why: '1 kL = 1000 L, so 2350 ÷ 1000 = 2.35 kL.',
    },
    tri: { b: 16, h: 7, a: 10, answer: 2 },
    para: { b: 20, h: 9, s: 12, unit: 'm', answer: 0 },
    kite: { shape: 'rhombus', x: 13, y: 24, answer: 3 },
    circle: { r: 9.5, unit: 'm', show: 'd' },
    cyl: { text: 'A closed poster tube is a cylinder.', r: 4.5, h: 20, u: 'cm' },
    lshape: {
      text: 'The plan shows an L-shaped timber deck.', thing: 'deck', W: 24, H: 14, a: 8, t: 10, rate: 64.5,
      perimQ: 'A safety rail is fitted around the outside edge of the deck. How many metres of rail are needed?',
      costQ: 'Decking costs {rate} per square metre. Find the cost of the decking for the whole deck.',
    },
    box: { text: 'A closed storage crate is shaped like a box.', l: 45, w: 35, h: 24, saQ: 'The outside of the crate is to be covered in plastic film.' },
    subst: { k: 2, a: 6, b: 2, sign: '+', va: 'p', vb: 'q' },
    pyth: { a: 7.2, b: 10.5, corner: 'BR' },
    discount: { item: 'A pair of headphones', price: 260, pct: 20 },
    index: { c1: 3, e1: 5, c2: 6, e2: 2, x: 'p', order: [2, 3, 0, 1] },
    salary: { salary: 68120, who: 'Tom, an electrician,' },
    simplify: [[al('9m − 2n + m + 5n'), al('10m + 3n')], [al('30ab ÷ 5b'), al('6a')]],
    expand: { p: 5, b1: 1, c1: 2, r: -2, b2: 3, c2: -4, x: 'y' },
    factorise: [[al('14m − 21'), al('7(2m − 3)')], [al('p² + 9p'), al('p(p + 9)')]],
    interest: { P: 9200, rate: 4.8, n: 2, who: 'Grace' },
    profit: { cost: 250, sell: 340, text: 'A jeweller buys a watch for {cost} and sells it for {sell}.' },
    equation: { A: 9, B: 4, C: 1, D: 2, E: 11, x: 'y' },
    commission: { retainer: 600, rate: 1.5, sales: 92400, who: 'Ethan', what: 'cars' },
    wages: { rate: 31.2, worked: 46, who: 'Chloe', job: 'in a warehouse' },
    formula: {
      fee: 12, per: 8, x: 'h', unitWord: 'hours', n1: 5, paid: 100,
      text: 'Bike hire costs a {fee} booking fee plus {per} per hour. The total cost, {C} dollars, for {x} hours is given by the formula',
      solveQ: 'Mia paid {paid} altogether. Write an equation and solve it to find how many hours Mia hired the bike.',
    },
    ladder: { L: 4.6, d: 1.4, text: 'A painter leans a ladder {L} long against a vertical wall. The foot of the ladder is {d} from the wall, on level ground.' },
  },

  // ============================================================ Practice Exam 3
  {
    classify: {
      ask: 'categorical',
      options: ['The length of a snake', 'The number of goals in a soccer game', 'Favourite sport', 'The temperature at noon'],
      answer: 2, why: 'Favourite sport is a category (a word), so it is categorical. A and D are continuous; B is discrete.',
    },
    dot: {
      what: 'the scores (out of 10) in a vocabulary quiz', who: 'students', min: 0, max: 10, xTitle: 'Score',
      counts: { 1: 1, 3: 1, 4: 2, 5: 2, 6: 3, 7: 6, 8: 7, 9: 3 }, shape: 'neg',
      options: ['Symmetrical, clustered at 7 and 8', 'Negatively skewed, clustered at 1 and 3', 'Positively skewed, clustered at 7 and 8', 'Negatively skewed, clustered at 7 and 8'],
      answer: 3, why: 'Most scores are high (clustered at 7 and 8) with a tail to the left, so the data is negatively skewed.',
    },
    hist: { text: 'the number of goals scored by a hockey team in each of {n} games.', labels: [0, 1, 2, 3, 4, 5], freq: [5, 8, 6, 9, 3, 1], yMax: 10, xTitle: 'Number of goals', order: [3, 1, 0, 2] },
    outlier: {
      text: 'A family recorded the number of loads of washing they did each week for 9 weeks:',
      data: [3, 4, 4, 5, 3, 4, 19, 5, 4], out: 19,
      options: ['The median', 'The mean', 'The mode', 'All three change by the same amount'], answer: 1,
    },
    column: {
      text: 'Year 9 students were asked to name their favourite subject. The column graph shows the results.',
      labels: ['Maths', 'English', 'Science', 'PE', 'Art'], freq: [9, 6, 12, 15, 8], pick: [0, 2], wrong: [21, 24, 58], answer: 3,
      yMax: 16, yStep: 2, xTitle: 'Subject',
    },
    stem: { text: 'The stem-and-leaf plot shows the heights, in centimetres, of {n} tomato plants.', data: [41, 45, 48, 52, 53, 56, 58, 58, 61, 64, 69], key: '5 | 3 = 53 cm', unit: 'cm' },
    b2b: {
      names: ['Hawks', 'Eagles'], group: 'team', measure: 'score', moreQ: 'usually scores higher',
      text: 'The Hawks and the Eagles are two archery teams. The back-to-back stem-and-leaf plot shows each team’s score in 11 rounds.',
      A: [45, 48, 52, 53, 55, 56, 57, 59, 61, 62, 64], B: [30, 36, 44, 51, 58, 60, 63, 67, 70, 75, 79], stems: [3, 7], key: '5 | 6 = 56 points',
    },
    capacity: {
      text: 'A jug holds 4500 mL of juice. How many litres is this?',
      options: ['45 L', '0.45 L', '4.5 L', '450 L'], answer: 2, why: '1 L = 1000 mL, so 4500 ÷ 1000 = 4.5 L.',
    },
    tri: { b: 11, h: 8, a: 3, answer: 0 },
    para: { b: 16, h: 12, s: 5, unit: 'cm', answer: 3 },
    kite: { shape: 'kite', x: 18, y: 26, c: 18, answer: 2 },
    circle: { r: 7.4, unit: 'cm', show: 'r' },
    cyl: { text: 'A closed rubbish bin is a cylinder.', r: 12, h: 25, u: 'cm' },
    lshape: {
      text: 'The plan shows the floor of an L-shaped hall.', thing: 'floor', W: 17, H: 16, a: 10, t: 7, rate: 38.9,
      perimQ: 'Skirting board is fitted around the edge of the floor. How many metres of skirting board are needed?',
      costQ: 'Carpet costs {rate} per square metre. Find the cost of carpeting the whole floor.',
    },
    box: { text: 'A closed planter box is shaped like a box.', l: 80, w: 25, h: 20, saQ: 'The outside of the planter box is to be stained.' },
    subst: { k: 4, a: 3, b: 5, sign: '−', va: 'm', vb: 'n' },
    pyth: { a: 4.9, b: 11.3, corner: 'BL' },
    discount: { item: 'A scooter', price: 150, pct: 30 },
    index: { c1: 2, e1: 6, c2: 7, e2: 3, x: 'a', order: [3, 0, 1, 2] },
    salary: { salary: 91260, who: 'Ana, an engineer,' },
    simplify: [[al('3x + 8y − x − 3y'), al('2x + 5y')], [al('21pq ÷ 7p'), al('3q')]],
    expand: { p: 2, b1: 5, c1: -1, r: -4, b2: 1, c2: -3, x: 'a' },
    factorise: [[al('10y + 25'), al('5(2y + 5)')], [al('x² − 4x'), al('x(x − 4)')]],
    interest: { P: 5600, rate: 2.75, n: 3, who: 'Leo' },
    profit: { cost: 520, sell: 702, text: 'A dealer buys a laptop for {cost} and sells it for {sell}.' },
    equation: { A: 8, B: 2, C: 5, D: 3, E: 8, x: 'k' },
    commission: { retainer: 350, rate: 4, sales: 27250, who: 'Ruby', what: 'phones' },
    wages: { rate: 25.4, worked: 42, who: 'Josh', job: 'at a cinema' },
    formula: {
      fee: 50, per: 35, x: 'n', unitWord: 'lessons', n1: 8, paid: 610,
      text: 'Guitar lessons cost a {fee} enrolment fee plus {per} per lesson. The total cost, {C} dollars, for {x} lessons is given by the formula',
      solveQ: 'Ava paid {paid} altogether. Write an equation and solve it to find how many lessons Ava had.',
    },
    ladder: { L: 7.2, d: 2.1, text: 'A ladder {L} long leans against the vertical wall of a house. The foot of the ladder is {d} from the wall, on level ground.' },
  },

  // ============================================================ Practice Exam 4
  {
    classify: {
      ask: 'numerical continuous',
      options: ['The number of cars in a car park', 'The type of phone a student owns', 'The number of people on a bus', 'The volume of water in a bottle'],
      answer: 3, why: 'Volume is measured, so it is numerical continuous. A and C are discrete (counted); B is categorical.',
    },
    dot: {
      text: 'The dot plot shows how many minutes late a train was on each of {n} school days.', who: 'days', min: 0, max: 10, xTitle: 'Minutes late',
      counts: { 0: 6, 1: 8, 2: 5, 3: 3, 4: 2, 6: 1, 8: 1 }, shape: 'pos',
      options: ['Negatively skewed, clustered at 0 and 1', 'Positively skewed, clustered at 0 and 1', 'Symmetrical, clustered at 0 and 1', 'Positively skewed, clustered at 6 and 8'],
      answer: 1, why: 'Most values are low (clustered at 0 and 1) with a tail to the right, so the data is positively skewed.',
    },
    hist: { text: 'the number of rides each of {n} students went on at a show.', labels: [2, 3, 4, 5, 6, 7], freq: [3, 5, 8, 12, 4, 2], yMax: 12, yStep: 2, xTitle: 'Number of rides', order: [0, 2, 1, 3] },
    outlier: {
      text: 'A shop recorded the number of customers each day for 8 days:',
      data: [120, 125, 118, 122, 410, 121, 124, 122], out: 410,
      options: ['The mode', 'The mean', 'The median', 'None of them change'], answer: 1,
    },
    column: {
      text: 'Students were asked about their favourite type of music. The column graph shows the results.',
      labels: ['Pop', 'Rock', 'Hip hop', 'Country', 'Jazz'], freq: [24, 16, 20, 8, 12], pick: [1, 3], wrong: [24, 20, 48], answer: 0,
      yMax: 24, yStep: 4, xTitle: 'Type of music',
    },
    stem: { text: 'The stem-and-leaf plot shows the number of text messages that {n} students sent in one day.', data: [9, 13, 16, 18, 21, 22, 23, 26, 30, 33, 42], key: '2 | 1 = 21 messages', unit: 'messages' },
    b2b: {
      names: ['Shop A', 'Shop B'], group: 'shop', measure: 'number of coffees sold', moreQ: 'usually sells more coffees',
      text: 'The back-to-back stem-and-leaf plot shows the number of coffees sold each hour for 10 hours at two coffee shops.',
      A: [14, 17, 18, 20, 21, 22, 22, 24, 25, 27], B: [8, 13, 16, 19, 24, 27, 29, 31, 35, 38], stems: [0, 3], key: '2 | 4 = 24 coffees',
    },
    capacity: {
      text: 'A container has a volume of 6000 cm³. How many litres does it hold? (1 L = 1000 cm³)',
      options: ['60 L', '600 L', '0.6 L', '6 L'], answer: 3, why: '1 L = 1000 cm³, so 6000 ÷ 1000 = 6 L.',
    },
    tri: { b: 13, h: 10, a: 8, answer: 3 },
    para: { b: 14, h: 4.8, s: 3.6, unit: 'm', answer: 1 },
    kite: { shape: 'rhombus', x: 9, y: 22, answer: 1 },
    circle: { r: 10.5, unit: 'mm', show: 'd' },
    cyl: { text: 'A closed biscuit tin is a cylinder.', r: 10, h: 14, u: 'cm' },
    lshape: {
      text: 'The plan shows an L-shaped concrete driveway and parking area.', thing: 'driveway and parking area', W: 25, H: 12, a: 5, t: 12, rate: 55.2,
      perimQ: 'An edging strip goes around the outside of the concrete. How many metres of edging are needed?',
      costQ: 'Concrete costs {rate} per square metre. Find the cost of the concrete for the whole area.',
    },
    box: { text: 'A closed shoebox is shaped like a box.', l: 36, w: 28, h: 15, saQ: 'The outside of the shoebox is to be covered in wrapping paper.' },
    subst: { k: 3, a: 5, b: 8, sign: '+', va: 'x', vb: 'y' },
    pyth: { a: 8.1, b: 12.6, corner: 'TR' },
    discount: { item: 'A tent', price: 420, pct: 35 },
    index: { c1: 8, e1: 5, c2: 4, e2: 4, x: 'w', order: [0, 2, 1, 3] },
    salary: { salary: 85280, who: 'Ben, a police officer,' },
    simplify: [[al('7a + 2b + 4a − 6b'), al('11a − 4b')], [al('36mn ÷ 9n'), al('4m')]],
    expand: { p: 3, b1: 2, c1: 5, r: -5, b2: 1, c2: -4, x: 'm' },
    factorise: [[al('9n − 24'), al('3(3n − 8)')], [al('w² + 11w'), al('w(w + 11)')]],
    interest: { P: 12500, rate: 3.9, n: 5, who: 'Mei' },
    profit: { cost: 1250, sell: 1450, text: 'A furniture shop buys a couch for {cost} and sells it for {sell}.' },
    equation: { A: 10, B: 3, C: 4, D: 5, E: 6, x: 'n' },
    commission: { retainer: 550, rate: 2, sales: 64300, who: 'Omar', what: 'boats' },
    wages: { rate: 29.8, worked: 47, who: 'Isla', job: 'at a garden centre' },
    formula: {
      fee: 30, per: 18, x: 'w', unitWord: 'walks', n1: 6, paid: 300,
      text: 'A dog-walking business charges a {fee} sign-up fee plus {per} per walk. The total cost, {C} dollars, for {x} walks is given by the formula',
      solveQ: 'Ella paid {paid} altogether. Write an equation and solve it to find how many walks Ella’s dog had.',
    },
    ladder: { L: 3.8, d: 1.1, text: 'A ladder {L} long leans against the vertical wall of a shed. The foot of the ladder is {d} from the wall, on level ground.' },
  },
];
