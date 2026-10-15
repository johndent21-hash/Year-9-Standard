# Three-page lesson format (Year 9 standard, Chapter 10 Surface area and volume)

The teacher has approved lesson 10.6 as the model. Every lesson in the booklet is being reworked to match it exactly.
The model is `lessons/10.6.js`. Read it in full before you start, and copy its structure, helpers and conventions.
To see it rendered, run `tools/check-lesson.sh 10.6` and look at `/tmp/booklet-render/10.6/` (student-1/2/3.png, teacher-1.png, answers-1.png).

Paths:
- Booklet source: `/home/user/Year-9-Standard/booklet-source/`
- Lessons: `year9-standard/ch10-surface-area-volume/lessons/<code>.js`
- Template: `lib/lesson-two.js` (read the comment at the top, plus `practiceWork`, `wq`, `formLines`, `notesBox`)
- Answer helpers: `year9-standard/ch10-surface-area-volume/helpers.js`
- Diagrams: `year9-standard/ch10-surface-area-volume/shapes.js` (`S.parts` exposes T, svg, seg, dashed, poly, dot, rightMark, sideLabel, arcD, fitter, C, f, FILL, SHADE)
- Textbook: New Century Maths 9 Chapter 10. The lesson's current file already covers the right section. 10.7 is the second half of textbook 10.06, so from 10.7 on, lesson codes run one ahead of the textbook (10.8 = textbook 10.07).

## What the teacher asked for (their words, in order)

- "Make each lesson 3 pages because I need more space for working out."
- "Each question that requires a formula needs a line to write the formula, substitute the values and then work out the answer."
- "The majority of the extra space ... taken up by easier, drill type questions at the start of the lesson. Slowly building up to the medium questions with the mixed practice included there and then the final 3 worded questions."
- "Drill over 2 pages, but the drill questions need to be the simple version of the skill, still with the full formula layout."
- Formula lines: "Labelled, formula given at first". Drill order: "Small steps first". The Easy/Medium strips are removed.
- "The easier drill style questions still need a diagram to go with them. Use up the space with a diagram instead of explaining that the radius or diameter is however many cm."
- Which questions get a diagram: "Everything drawable", including tagged earlier-lesson questions.
- Words in a drill box: none. The given length is labelled on the diagram, the unknown is marked with a `?`, and the round heading says what to find.
- Diagram placement: above the lines, beside the question number.
- Earlier: one Medium box with the mixed practice spread through it (about 1/3 of the questions tagged from earlier lessons). No separate Mixed practice box. Finish with 3 worded problems on today's skill, with room to draw a diagram and solve.
- Two copies: the students' copy has a blank Notes box. The teacher's copy has the Notes box filled with key terms, formulas, steps and a diagram, shown on the board.

## The lesson spec (fields; see 10.6.js)

```
code, title, li (one line, completes "We are learning to …"), sc: [3 short criteria, each completes "I can …"]
notes: { terms: [[term, meaning]] (≤ 7, short), formulas: [..] (≤ 5, inline text, NO stacked fractions F()), steps: [≤ 4 short steps], fig: a notes diagram }
easy:   { ex, exAns, hint, work: true, rounds: [2 rounds] }        → page 1 (below the Notes box and WE DO Example 1)
drill:  { hint, rounds: [4 rounds] }                               → page 2 (numbering continues from page 1)
medium: { ex, exAns, hint, work: true, set: true, rounds: [one round of 9] } → page 3, then:
worded: [3 × { q, a }]
```

The lesson is three pages because it has `drill` (lib/lesson-two.js). Do not add `mixed`.

### Page 1 (Easy)
- Compact LI/SC row, then the Notes box (49.5 mm, fixed), then WE DO Example 1.
- Example 1 has 4 parts. Each part is a diagram with a 1–2 word heading where it can be drawn (`{ t: 'Circumference', fig }`). `exAns` gives the full worked line: formula, substitution, answer with unit.
- Then YOU DO: 2 rounds of small steps, usually 4 per row (`cols: 4`, 8 questions). Use `cols: 3` (6 questions) if the diagrams are wide, e.g. 3D solids.
- The first rounds print the formula on the Formula line (`form: 'C = πd'`).
- On page 1 the figure box is at most 20 mm tall and about 31 mm wide (4 per row) or 46 mm wide (3 per row).

### Page 2 (Easy drill)
- 4 rounds of 3 (12 questions). Diagrams can be up to 26 mm tall and 46 mm wide.
- Build slowly:
  - formula printed (string `form`) for the simple versions;
  - then a round where students choose or write the formula (`form: true`);
  - then the next shape or variation, formula printed again;
  - and so on.

### Page 3 (Medium)
- WE DO Example 2: 4 parts, all drawn where drawable.
- Then ONE numbered set of 9 questions (`set: true`, `text: ''`). They build in difficulty.
- About 3 of the 9 are tagged earlier-lesson questions (`from: '10.x'`; lesson 10.1 has no earlier lessons, so it uses 'Year 8'). Spread them through the set (about one per row) and draw them too when drawable.
- Each drawable Medium question is `{ t: 'Area', fig, form: true }`: one or two words saying what to find, then the diagram.
- Non-formula Medium questions (e.g. limits of accuracy) are plain working boxes (no `form`) and keep their words.
- Then the 3 worded problems (no diagrams: students draw their own). Each answer `a` shows the working.
- Medium figure box: at most 15 mm tall and about 30 mm wide.

## Question boxes (lib/lesson-two.js)

- A work question: `{ t, fig, form, lines?, from? }`.
  - `fig` + `form` → the diagram sits beside the number, with Formula / Substitute / Answer lines below it.
  - `form: 'A = l × w'` prints the formula on the Formula line; `form: true` leaves it blank.
  - `lines: ['Rule', 'Working', 'Answer']` relabels the three lines for a skill with no formula (unit conversions: Rule "× 1000"; or ['Precision', 'Working', 'Answer'] etc.). Use the default labels whenever there is a formula.
  - `from: '10.4'` tags an earlier-lesson question; its answer is tagged automatically.
- Drill boxes: `t: ''` (no words). Everything is on the diagram. The given values are labelled on it, and the unknown is marked with `?`.
  - An unknown length: a measurement line labelled `x = ?` (see `dim()` and `ask` in 10.6's `part()`).
  - An unknown total: written beside the shape (`C = ?`, `P = ?`, `A = ?`, `SA = ?`, `V = ?`).
  - The round heading (`text`) says what to find, e.g. 'find the area of each rectangle.'
- `formFig(list, form)` in 10.6.js builds a round from `[picture, answer, text?, own formula?]`. Copy it.

## Diagrams: rules learned the hard way (an independent checker flagged each of these on 10.6)

1. **Draw at print size.**
   - Labels are SVG text in mm: size 2.8–3, about 8 pt. A diagram scaled down to fit its box shrinks its labels.
   - Size every diagram (`size`, `maxH`, `R`, …) so it prints at ≥ 93% of its drawn size. `fit.js` reports each one.
   - If a diagram is too big for its box, draw the shape smaller, never the labels.
2. **No label may touch or cross a line, an outline, an arc or another label.** Check the 160 dpi crops.
   - Labels inside small shapes are the usual culprit: move them outside, shorten them, or use whole numbers.
3. **The given lengths are drawn in blue** (the radius or diameter line, the measured edge) where that helps. Follow 10.6's `part()`.
4. **A measurement must label exactly the length it means.**
   - Use a measurement line with end ticks (`dims` in `S.shape`, or 10.6's `dim()`) when a side label could be misread, e.g. a straight part between dashed joins, or a height outside a shape.
5. **Keep a visual convention within a lesson.**
   - Same label size, same blue for givens, same `?` style.
   - A tag sits inline after a short heading.
6. **Numbers are drawn to scale from the question's own values**, so the picture matches the numbers.
7. **Notes diagram** (teacher's copy): one labelled diagram of the lesson's key idea, at most about 34 mm tall, with labels clear of lines.

## Answers

- Calculate every answer with code (helpers.js `num`, `u`, `circ`, `area`, `conv`, `prec`, `aerr`, `limits`, `pctErr`, …). Never type a computed number by hand.
- Units on every answer. π answers are correct to one decimal place (`u(v, unit, 1)`), using the calculator's π.
- `exAns` and worded answers show working: formula → substitution → answer.
  - If working shows a rounded intermediate value, the next step must use that rounded value (e.g. `100 000 ÷ 207.3 = 482.4`).
- Friendly numbers. The level is Year 9 Standard with a calculator.

## Fit and checks: run after every change

```
booklet-source/tools/check-lesson.sh <code>
```

- It builds `year9-standard/preview/<code>` (students') and `<code>-teacher` (teacher's).
- It runs `fit.js` on both: OVER, GAP, SCALE, EDGE, PAGE. It must print PASS for both.
- It renders `/tmp/booklet-render/<code>/student-N.png` (160 dpi) with crops `student-N-part1/2/3.png`, plus `teacher-1*.png` and `answers-1.png`. Look at the crops with the Read tool, zoomed, and fix every overlap or crowding.
- The builder's own "Layout check" must say "no problems found".
- Each page's spare room goes to the boxes as blank working space above the lines (fit.js lists it). Some is good: on page 1, 2–15 mm per box.
  - If a page has lots of spare room, make the diagrams bigger.
  - If it overflows, shrink the shapes or the example figures. Do not delete the Notes box or the worded problems.
- Each page's layout fills the page by itself: rows stretch to fill.

## Do not

- Do not edit shared files: `lib/*`, `build.js`, `lib/theme.css`, `shapes.js`, `helpers.js`, `chapter.js`, or any other lesson.
  - Put lesson-only drawing helpers in your lesson file (as 10.6 does with `part()`, `rectEnds`, `notesFig`).
  - If a shared change seems essential, do not make it. Describe it in your final report.
- Do not commit or push. Do not touch git.
- Do not use `F()` stacked fractions in any text: they print tiny. Write `θ ÷ 360` or `½` instead.
