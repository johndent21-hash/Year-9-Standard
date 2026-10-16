# Year 9 5.2 Yearly Exam 2026: builder

Builds the Kingscliff High School **Year 9 5.2 (NSW Stage 5.2, New Century Maths 9) Yearly Exam 2026** and its
**marking guide**, as PDF and Word, from question files written in JavaScript. Every answer is calculated from the
numbers in its question, so the exam, the answer summary, the marking criteria and the red answers in the marking
guide always agree.

```
node build.js                      # everything, into ../Yearly exam 2026
node build.js --only s2 --no-docx  # just Section 2, PDF only, into build/only (quick check while writing)
node gallery.js                    # build/figure-gallery.pdf: every figure helper with its example
```

The look copies the teacher's *2024 Yr 9 5.2 Yearly Final Exam* (a Google Docs export), in Kingscliff blue:

* **Front page**: logo top left, NAME and TEACHER boxes top right, the centred lines MATHEMATICS / Year 9 5.2 /
  Yearly Exam / 2026 (Arial 25 pt), then an *Instructions* box and a *Sections and Marks* box joined by a heavy bar
  (Kingscliff blue instead of black). The section marks and the total are counted from the questions.
* **Section pages**: one bordered table per section (Cambria-style serif, 11 pt) with the template's columns
  (number 6.7 mm | Question 66 mm | Working Out 99.3 mm | Mark 12 mm): a navy title row ("Section 1: Data"), a
  light-blue *Multiple Choice:* row with the small *Mark* heading, the MC rows (question centred, options A. B. C. D.
  beneath), a *Short Answer:* row, the *Question | Working Out | Mark* heading row, the short-answer rows, then
  *Worded Problems:* and a final *Total /25* row. Each section starts on a new page. Rows never split across pages:
  a table that runs over continues on the next page under "Section 1: Data (continued)" and the column headings.
* Page number bottom left (Calibri 11 pt), as in the template.

## Files

| Path | What it is |
|---|---|
| `exam.js` | Front-page text, instructions, marking notes, the **brief** (marks per section and level, used for checks) and the list of sections |
| `sections/s1-data.js` | Section 1: Data (Chapter 9) |
| `sections/s2-sav.js` | Section 2: Surface area and volume (Chapter 10) |
| `sections/s3-mixed.js` | Section 3: Mixed: Chapters 1-8 |
| `lib/helpers.js` | Number formatting (`num`, `money`, `dp`, `unit`, `frac` ...) and maths helpers (`mean`, `median`, `hyp` ...) |
| `lib/figs.js` | SVG figures drawn to scale, and table helpers |
| `lib/model.js` | Numbers the questions, totals marks and levels, makes the table rows, checks the data against the brief |
| `lib/html.js`, `lib/exam.css` | The PDF pages (front page, section tables, marking guide) |
| `lib/page.js` | Runs in the browser: cuts pages between rows and checks the layout |
| `build.js` | Builds the PDFs, the figure PNGs and `build/exam.json`, then runs `build-docx.py` |
| `build-docx.py` | Builds the two Word files from `build/exam.json` (python-docx) |
| `gallery.js` | Draws every figure helper (with the examples below) into `build/figure-gallery.pdf` |
| `assets/kingscliff-logo.png` | The school logo (cropped to its edges) |
| `build/` | Made by the build: `exam.json`, `figs/*.png` (300 dpi), the HTML pages |

**Outputs** (in `--out`, default `../Yearly exam 2026`): `Year9-5.2-Yearly-Exam-2026.pdf`,
`Year9-5.2-Yearly-Exam-2026-Marking-Guide.pdf`, `Year9-5.2-Yearly-Exam-2026.docx`,
`Year9-5.2-Yearly-Exam-2026-Marking-Guide.docx`.

The **marking guide** has a cover (teacher copy, notes for markers, sections with green/blue marks, a mark
distribution table), an **answer summary** per section (Q, answer, marks, level, topic and source), the **marking
criteria** for every question and part (answer, working, where each mark is awarded, follow-through notes), then a copy
of the exam with the **answers in red** in the working space and the right MC option ringed in red.

## The brief (what the checks compare against)

70 marks: Section 1 Data 25 (17 green, 8 blue), Section 2 Surface area and volume 24 (17 green, 7 blue), Section 3
Mixed 21 (15 green, 6 blue); 49 green and 21 blue overall. Every section: 5 multiple choice (1 mark each) first, then
short answer (12, 11 and 10 marks), then 2 worded problems (4 + 4, 4 + 4, 3 + 3 marks). These numbers are in
`exam.js` (`brief`); the build prints every difference.

Questions are NEW questions in the style of the GREEN (Foundation) and BLUE (Standard) *Test yourself* questions of
New Century Maths 9: same question types, new numbers and contexts. Never RED (Complex), nothing from PATH or
extension. Section 3: from Chapter 6 only networks (no geometry); no surds and no exact (surd) answers; Pythagoras
answers as rounded decimals. Give the formula in each question that needs one (`formula`); there is no formula
sheet. NSW conventions: `$`, metric units, a space between thousands for 5 or more digits (`12 500`, `$420 000`,
but `2500`), "correct to 1 decimal place".

## Writing a section file

A section file exports `{ id, title, short, questions }`:

```js
'use strict';
const { num, dp, money, unit, frac, v, pi, PI, mean, median, q } = require('../lib/helpers');
const F = require('../lib/figs');

module.exports = {
  id: 's2',                          // must match exam.js brief.sections
  title: 'Surface area and volume',  // table title: "Section 2: Surface area and volume"
  short: 'Surface area and volume',  // front page: "Section 2 - Surface area and volume  /24"
  questions: [ /* in order: 5 'mc', then 'sa' (and 'info'), then 2 'worded' */ ],
};
```

Questions are numbered from 1 in each section (as in the 2024 exam; `numbering: 'continuous'` in `exam.js` numbers
1 to the end). Put each question in `q(() => { ... return {...}; })` so its numbers are local and every answer is
calculated from them:

```js
q(() => {
  const r = 4, h = 11;
  const V = pi * r * r * h;
  return {
    type: 'sa', marks: 2, level: 'green', src: 'TY10 Q12a', topic: 'Volume of a cylinder',
    text: 'Find the volume of this cylinder, correct to 1 decimal place.',
    fig: F.cylinder({ r, h, unit: 'cm' }),
    formula: `Volume of a cylinder: <i>V</i> = ${PI}<i>r</i>²<i>h</i>`,
    answer: unit(V, 'cm³', 1),                       // 552.9 cm³
    working: [`<i>V</i> = ${PI} × ${r}² × ${h}`],
    marking: ['correct substitution into V = πr²h', `${dp(V, 1)} cm³`],
  };
}),
```

### Question types and fields

**Common fields** (every question):

| Field | Meaning |
|---|---|
| `type` | `'mc'`, `'sa'` (short answer), `'worded'`, or `'info'` (an instruction or data row, no marks) |
| `level` | `'green'` (Foundation) or `'blue'` (Standard). Parts can set their own `level`; otherwise they take the question's |
| `src` | The Test yourself question it is modelled on, e.g. `'TY9 Q4b'` (shown in the marking guide) |
| `topic` | Short topic name, e.g. `'Mean from a frequency table'` (shown in the marking guide) |
| `text` | The question (HTML string, or an array of strings = several paragraphs) |
| `fig` | A figure: an SVG from `lib/figs.js`, a table from `F.table`/`F.freqTable`, or an array of them (placed side by side) |
| `formula` | Formula note printed under the question as "Note: ..." (string or array). Give the formula whenever one is needed |
| `notes` | Marking notes: follow-through, accepted alternatives (string or array), shown in the marking criteria |

**`type: 'mc'`** (1 mark):

| Field | Meaning |
|---|---|
| `options` | Exactly 4 options, HTML strings or small SVG figures (`F.rectangle({...})`) |
| `answer` | Index of the right option: 0 = A, 1 = B, 2 = C, 3 = D |
| `figPos` | `'below'` (default: figure centred under the question) or `'right'` (figure beside the question and options, like the 2024 dot-plot question) |
| `optLayout` | `'row'` (A B C D on one line), `'grid'` (2 x 2) or `'stack'` (one under the other). Default: chosen from the option length |
| `why` | Why the answer is right (shown in the marking criteria) |

**`type: 'sa'` and `type: 'worded'`**, either one answer:

| Field | Meaning |
|---|---|
| `marks` | Marks for the question |
| `answer` | Final answer (HTML string), calculated from the numbers, e.g. `unit(V, 'cm³', 1)` |
| `working` | Lines of the worked solution (array of HTML strings), not including the final answer; shown in red in the guide, followed by the answer in bold |
| `marking` | Where each mark is awarded. One string per mark: `['correct substitution', '552.9 cm³']`; or `[2, 'text']` pairs for a criterion worth 2. Must add up to `marks` |
| `space` | Height of the working space in mm (optional, see below) |

or parts:

| Field | Meaning |
|---|---|
| `parts` | `[{ label?, text, marks, answer, working?, marking?, notes?, level?, space?, fig?, formula? }]`. Labels default to a, b, c. The question's marks are the sum of the parts |
| `layout` | `'inline'`: one row; the question cell lists the parts (a. b.), the working cell has a. and b. spaces and the mark cell shows each part's mark (as the 2024 exam Part 2 Q4). `'rows'`: the question text in a row across Question and Working Out, then one row per part with its own working space and mark (as the 2024 exam Part 6 Q7). Default: `'inline'` for `sa`, `'rows'` for `worded` with more than one part |
| `partsFirst` | `inline` only: list the parts before the figure (default: text, figure, parts, formula) |
| `figPos` | `rows` only: `'right'` (figure beside the text; default when the figure is at most 85 mm wide) or `'below'` |
| `keepTogether` | `rows` only: keep all part rows on one page (default: the text row stays with part a only) |

**`type: 'info'`**: `{ type: 'info', text, fig? }` is a row across the Question and Working Out columns (centred), for
an instruction or a data set shared by the next questions ("Use this data for questions 6 and 7: ..."). It always
stays on the same page as the next question.

### Marks, levels and totals

Nothing is typed twice. The build counts marks per part, question and section; green and blue marks per section and
overall; the number of MC, short-answer and worded questions; and writes them on the front page, in the Total rows,
on the marking guide cover and in the build report. It prints a warning when a section differs from the brief, when
marking criteria do not add up to the marks, when an answer, `src` or level is missing, when an MC question does not
have 4 different options, or when the order is not MC, short answer, worded.

### Working space

The Working Out cell of each part is at least **22 mm for 1 mark, plus 14 mm for each extra mark** (36 mm for 2
marks, 50 mm for 3); worded problems get 6 mm more. Set `space` (mm) on a question or a part to change it; the build
warns when a space is under 16 mm + 10 mm per extra mark. A row is as tall as its working space or its question,
whichever is taller.

### Text, numbers and maths

Text is HTML: `<b>`, `<i>`, `<sup>`, `<sub>`, `<br>`. Write pronumerals in italics (`v('x')` gives `<i>x</i>`). Use
Unicode for ½ ² ³ π × ÷ − ° (they stay editable in Word). Helpers in `lib/helpers.js`:

| Helper | Example | Result |
|---|---|---|
| `num(x, dp?)` | `num(12500)`, `num(3.14159, 2)`, `num(2500)` | `12 500`, `3.14`, `2500` (thin no-break space for 5+ digits; `num(x, n, { force: true })` groups 4 digits too) |
| `dp(x, n)` | `dp(41.5698, 1)`, `dp(2, 2)` | `41.6`, `2.00` |
| `round(x, n)` | `round(1.005, 2)` | `1.01` (a number) |
| `money(x, n?)` | `money(1640)`, `money(577.5)`, `money(420000)`, `money(12, 2)` | `$1640`, `$577.50`, `$420 000`, `$12.00` |
| `unit(x, u, n?)` | `unit(41.57, 'cm²', 1)` | `41.6 cm²` (no-break space) |
| `U` | `U.cm2`, `U.m3`, `U.mL` | `cm²`, `m³`, `mL` |
| `pi`, `PI` | `pi * r * r` ; `` `${PI}r²` `` | 3.14159..., `π` |
| `frac(a, b)` | `` `Mean = ${frac(29, 20)}` `` | a stacked fraction (an equation in Word) |
| `v(s)`, `b(s)`, `nw(s)` | `v('x')` | italic, bold, keep on one line |
| `pow(base, e)`, `deg(x, n?)` | `pow(v('a'), 5)`, `deg(35)` | a⁵, `35°` |
| `list(arr, sep?)` | `list([8, 6, 9])` | `8, 6, 9` |
| `TIMES`, `DIV`, `MINUS`, `HALF`, `DEG` | | × ÷ − ½ ° |
| `sum`, `mean`, `median`, `mode`, `modes`, `range`, `sorted`, `counts` | `median([3, 1, 2])` | `2` |
| `quartiles(a)` | | `{ q1, q2, q3, iqr }` (median of each half, middle value left out when n is odd) |
| `expand(values, freqs)`, `freqStats(values, freqs)` | `freqStats([0, 1], [4, 6])` | the data list; `{ n, fx, sumFx, mean }` |
| `hyp(a, b)`, `leg(c, a)` | `hyp(7, 11)` | Pythagoras: hypotenuse; shorter side |
| `sinD`, `cosD`, `tanD`, `asinD`, `acosD`, `atanD`, `dms` | `tanD(35)`, `dms(35.27)` | trig in degrees; `35°16′` |
| `q(fn)` | `q(() => ({ ... }))` | runs `fn` (keeps a question's numbers local) |

## Figures (`lib/figs.js`)

`const F = require('../lib/figs');` Every figure is an SVG drawn **to scale** from the values given, in millimetres
(labels about 9.6 pt). Lengths are labelled with the value and `unit` unless you give `labels` (use `''` to hide a
label, or `'<i>x</i>'` for an unknown). Labels are placed clear of lines and of each other; the build checks this
again. The Question column is 66 mm wide (62.8 mm inside): keep figures in short-answer rows under about 60 mm
(`size`), or use `layout: 'rows'` / worded problems, where the text row is 165 mm wide. Run `node gallery.js` to see
all of them.

| Helper | Signature | Example |
|---|---|---|
| Dot plot | `dotPlot({ data \| counts, min?, max?, step = 1, labelEvery = 1, unitW?, xTitle?, title? })` | `F.dotPlot({ data: [2, 3, 3, 4, 4, 4, 5, 5, 6, 8], min: 0, max: 8, xTitle: 'Goals scored' })` |
| Stem-and-leaf | `stemLeaf({ data \| rows, stemUnit = 10, decimals = 0, stems?, unordered?, key?, heads = ['Stem', 'Leaf'], title? })` | `F.stemLeaf({ data: marks, key: '4 \| 5 = 45' })`; missing leaf: `rows: [[5, [2, 4, '□', 6]]]` |
| Back-to-back stem-and-leaf | `backToBack({ left, right \| rows, heads: [leftTitle, rightTitle], stemHead = 'Stem', key? })` | `F.backToBack({ left: girls, right: boys, heads: ['Girls', 'Boys'], key: '15 \| 3 = 153' })` |
| Histogram / column graph | `histogram({ labels, freq, kind = 'histogram' \| 'column', edges?, yMax?, yStep = 1, colW?, plotH = 46, xTitle?, yTitle = 'Frequency', title?, polygon?, vgrid? })` | `F.histogram({ labels: [0, 1, 2, 3, 4, 5, 6], freq: [5, 9, 7, 4, 3, 1, 1], xTitle: 'Number of brothers and sisters' })` |
| Table | `table({ head, rows, foot?, transpose?, colW?, align? })`; a cell `{ key: '24' }` is blank in the exam and red in the guide; `{ text, b: true }` is bold | `F.table({ head: ['Score', 1, 2, 3], rows: [['Frequency', 3, { key: '5' }, 8]] })` |
| Frequency table | `freqTable({ values, freqs, head?, fx = false \| true \| 'key', total = false \| true \| 'key', transpose?, colW? })` | `F.freqTable({ values: [0, 1, 2, 3], freqs: [4, 7, 6, 3], fx: 'key', total: true })` |
| Rectangular prism | `rectPrism({ l, w, h, unit?, labels?: { l, w, h }, size = 46, maxH = 34 })` | `F.rectPrism({ l: 12, w: 5, h: 4, unit: 'cm' })` |
| Triangular prism | `triPrism({ b, h, len, apex = 0, unit?, labels?: { b, h, s, s2, len }, size, maxH })` (apex 0: right angle at bottom left; `b / 2`: isosceles with a dashed height) | `F.triPrism({ b: 6, h: 8, len: 15, unit: 'cm', labels: { s: '10 cm' } })` |
| Any prism | `prism({ face: [[x, y], ...], len, sides: [labels], lenLabel?, lenAt?, right?: [corners], dash?: [[p, q, label]], size, maxH })` | `F.prism({ face: [[0,0],[8,0],[8,3],[4,6],[0,3]], len: 10, sides: ['8 m'], lenLabel: '10 m' })` |
| Cylinder | `cylinder({ r, h, unit?, show = 'r' \| 'd', labels?: { r, h }, open?, size = 30, maxH = 40 })` | `F.cylinder({ r: 3.5, h: 10, unit: 'cm' })`; `show: 'd'` labels the diameter 2r |
| Composite shape | `composite({ pts: [[x, y], ...], sides: [labels] \| 'auto', unit?, hide?: [sides], right = 'auto' \| 'all' \| [corners], size = 50, maxH = 40 })` (side i joins corner i to i+1; y up) | `F.composite({ pts: [[0,0],[7,0],[7,6],[13,6],[13,13],[0,13]], sides: 'auto', unit: 'm' })` |
| Any polygon | `shape({ pts, sides, unit, hide, right = 'auto', dash: [[p, q, label]], marks: [[p, q, r]], labels: [[text, x, y]], dims: [[p, q, label, side]], size, maxH })` | `F.shape({ pts: [[0,0],[10,0],[6,5]], sides: ['10 cm', '', ''], right: [] })` |
| Rectangle, triangle | `rectangle({ l, w, unit, labels })`; `triangle({ b, h, a, unit, labels })` (apex above `a`, dashed height) | `F.triangle({ b: 10, h: 6, a: 3.5, unit: 'cm' })` |
| Trapezium | `trapezium({ a (top), b (bottom), h, s = (b - a) / 2, unit, labels?: { a, b, h }, size, maxH })`; `s: 0` is a right trapezium | `F.trapezium({ a: 6, b: 10, h: 4, unit: 'cm' })` |
| Parallelogram | `parallelogram({ b, h, s, unit, labels?: { b, h, side } })` (dashed height) | `F.parallelogram({ b: 10, h: 5, s: 3, unit: 'm' })` |
| Rhombus, kite | `rhombus({ x, y, unit, labels?: { x, y }, dims = true })`; `kite({ x, y, c, unit, labels, dims })` (diagonals dashed; lengths on measurement lines outside; `dims: false` writes them beside the diagonals) | `F.rhombus({ x: 16, y: 10, unit: 'cm' })` |
| Circle, semicircle, quadrant, sector | `sector({ r, angle = 360, rot = 0, unit, show = 'r' \| 'd' \| '', lab?, angleLabel?, size = 34 })`; `circle(o)`, `semicircle(o)` (labels the diameter), `quadrant(o)` | `F.sector({ r: 6, angle: 120, unit: 'cm', angleLabel: '120°' })` |
| Right-angled triangle | `rightTriangle({ base, height, unit, labels?: { base, height, hyp }, corner = 'BR' \| 'BL' \| 'TR' \| 'TL', angle?: { at: 'base' \| 'vert', label }, size = 42, minSide = 12 })` | `F.rightTriangle({ base: 12, height: 5, corner: 'BL', labels: { base: '12 m', height: '<i>h</i>' }, angle: { at: 'base', label: '23°' } })` |
| Network | `network({ nodes: { A: [x, y], ... }, edges: [[from, to, weight?, bend?]], size = 60, maxH = 40, labelAt?: { A: 'n' \| 'ne' \| ... }, curve? })` | `F.network({ nodes: { A: [0,0], B: [4,1], C: [2,3] }, edges: [['A','B',5], ['B','C',3], ['A','C',4]] })` |

For a one-off picture, `F.parts` has the building blocks (`reset`, `seg`, `poly`, `pline`, `dot`, `T`, `best`,
`rightMark`, `arrowHead`, `svg`): call `reset()`, draw, place labels with `T(x, y, text)` or
`best(candidates, text)`, and finish with `svg(w, h, body)`.

## Build

```
node build.js [--only s1,s2,s3] [--out <dir>] [--shots <dir>] [--no-docx] [--verbose] [--exam <file>]
```

| Flag | Effect |
|---|---|
| `--only s1,s3` | Build only these sections (section numbers kept). Without `--out` this goes to `build/only`, so it never replaces the full exam |
| `--out <dir>` | Where the PDFs and Word files go (default `../Yearly exam 2026`) |
| `--shots <dir>` | Also save a PNG of every PDF page (`<name>-p01.png` ...) |
| `--no-docx` | Skip the Word files (faster) |
| `--verbose` | Also list the marking-guide notes (worked answers taller than their working space) |
| `--exam <file>` | Use another exam definition instead of `exam.js` (e.g. a practice test or a trial copy) |

Needs Node.js with Playwright (Chromium) and Python 3 with python-docx. Do not run `npm install` here: the build
uses the global Playwright (`require('playwright')`, else the copy under `npm root -g`). The Word step runs
`python3 build-docx.py --json build/exam.json --out <dir>`; you can run it on its own after a build.

The build writes `build/exam.json` (every question with its computed answers, marks and levels; the table rows used by
the PDF and Word; the summary and criteria; totals and the brief) and `build/figs/<id>.png` (every figure at 300 dpi,
named `s1-q3`, `s1-q3-2`, `s2-q1-optB` ...). It then prints the warnings and the marks:

```
Marks           total  green  blue   MC  short  worded
  Section 1       25     17     8    5     12    4+4
  ...
  Overall         70     49    21   (brief: 70 = 49 green + 21 blue)
```

### Checks

* **Question data**: answer, `src` and level present; levels are green or blue; marking criteria add up to the marks;
  4 different MC options and a valid `answer`; order MC, short answer, worded; working space not under the minimum.
* **Brief**: section marks, MC count and marks, short-answer marks, worded problems and their marks, green and blue
  marks per section and overall.
* **Layout** (in the browser, on every page): overflow (content past the bottom margin, text wider than its cell,
  front-page boxes); a row split across pages (a row taller than a page); a figure overlapping text, spilling out of
  its cell or shrunk to fit its column; labels inside a figure cut off, overlapping each other or touching a line;
  working space under the minimum.
* `gallery.js` runs the figure checks on every helper.

## Word files

`build-docx.py` mirrors the PDF: A4, the same margins (13 mm sides, 25.4 mm top), the same front page (logo, NAME and
TEACHER boxes, title lines, Instructions and Sections-and-Marks boxes as tables), the same section tables (navy title
row, light-blue sub-header rows, Question | Working Out | Mark, row heights for the working space, rows that cannot
split across pages, rows kept with the next where the PDF keeps them), and the figures as the 300 dpi PNGs at the
same size. Text stays editable: Unicode symbols, real Word tables for frequency tables, and equation objects for
stacked fractions. Fonts are those of the 2024 exam (Cambria, Arial, Times New Roman, Calibri). Word paginates the
file itself: the section title row repeats at the top of each continuation page (Word cannot add "(continued)" or
repeat a heading row from the middle of a table, so those two PDF details are not in Word).

To check a Word file: `soffice --headless --convert-to pdf --outdir /tmp/check "../Yearly exam 2026/Year9-5.2-Yearly-Exam-2026.docx"`
and compare the pages with the PDF (LibreOffice needs its Math module to show the fractions).
