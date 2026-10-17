# Chapter booklets: handoff

Read this, then follow `/CLAUDE.md`: no workflows or subagents, read only the files you change, and grep long files.
Work on branch `claude/affectionate-gates-exjv9d` and push there. `$S` below means your scratchpad folder.

## Next job: Chapter 12 Probability booklet, three pages per lesson

Make the Year 9 Standard Chapter 12 booklet in the same style, layout and colours as Chapters 10 and 11:
student copy, teacher copy and answers. The cover uses a different part of the Mandelbrot set, in the same violet
colours.

### The teacher's decisions (17 Oct 2026)

- **Three pages per lesson, like Chapter 10:**
  - Page 1: notes, the WE DO example and Question 1.
  - Page 2: the Easy drill.
  - Page 3: the Medium example, a set of six (two of them review questions) and three worded problems.
- **Five lessons, one per Test Yourself section.** Leave out 12.04 (two-way tables, a PATH section), just as
  Chapter 11 left out 11.09. From 12.4 on, the lesson numbers are one behind the textbook's:

  | Lesson | Textbook | Test Yourself | Every drill question has the same shape |
  |---|---|---|---|
  | 12.1 | 12.01 | Q1, Q2 | coloured counters in a bag or jar, or a set of cards: find P(colour) and P(not colour) |
  | 12.2 | 12.02 | Q3 | a table of results: observed (experimental) and theoretical probability |
  | 12.3 | 12.03 | Q4 | a Venn diagram with counts: P(A), P(A and B), P(A or B), P(neither) |
  | 12.4 | 12.05 | Q6 | a two-step tree diagram: list the outcomes, then find probabilities |
  | 12.5 | 12.06 | Q7 | a table of outcomes for two dice or spinners: complete it, then find probabilities |

- **Answers are fractions in simplest form.** Use decimals or percentages only when a question asks for them (Test
  Yourself Q3 asks for decimals). Work out and simplify every answer in code from the question's numbers.
- **Support is the same as Chapter 11:**
  - Each question has a one-line, step-by-step instruction.
  - Each answer line names what is being found, e.g. `P(red) =`.
  - Every question in a lesson has the same shape.
  - The last drill question gives less help: the students draw the tree or complete the table themselves.
- **Number the questions Question 1, 2, 3 … with parts a, b, c.** Do not use "Round 1 / Questions 1–2" (see step 6).
- **Real situations use their own letters, not x and y** (the Chapter 11 rule).

### Test Yourself 12 (the source)

To see the exact wording, extract pages 25 and 26:

```
git show "origin/main:Year 9 Test Yourself Chapter 1-13.pdf" > $S/ty.pdf && pdftotext -f 25 -l 26 -layout $S/ty.pdf -
```

To see the diagrams, run `pdftoppm -f 25 -l 26 -r 50 -png`. The questions in short:

1. (12.01) A jar holds only red and yellow marbles, and P(red) is given. Part b: with 40 marbles, how many are red?
2. (12.01) A card is drawn from a standard deck: find the probability of simple events.
3. (12.02) A spinner's red sector is twice the size of each other sector, and a table gives the results of many
   spins. Find the observed and theoretical probabilities as decimals.
4. (12.03) Of 30 teenagers, 21 like music, 18 like TV and 4 like neither. How many like both (13)? Complete the
   Venn diagram, then find probabilities.
5. (12.04, PATH, left out) A two-way table of men and women working full-time or part-time.
6. (12.05) Cards A, B, C and D; two are drawn without replacement. List the outcomes, complete the tree diagram, then
   find probabilities.
7. (12.06) Two dice are rolled and the difference of the numbers is found. Complete the 6 × 6 table, then find P(0),
   P(at least 2) and P(4 or 5).

### How to build it (copy Chapter 11 and leave out its page 4)

All paths below are under `booklet-source/`.

1. **Folders.**
   - `year9-standard/ch12-probability/` holds `chapter.js`, `helpers.js`, `shapes.js` and
     `lessons/12.1.js` to `12.5.js`.
   - `year9-standard/ch12-probability-teacher/chapter.js` is
     `module.exports = require('../ch12-probability/chapter.js').teacherCopy();`.
2. **chapter.js.** Copy Chapter 11's file, then change it:
   - Set `pagesPerLesson: 3`, the five-lesson plan and a new `art`.
   - Set `howto` to HOWTO_THREE from `lib/gold-front.js`, changing "round" to "question". Lines 32, 42 and 52 there
     say "one round at a time".
3. **Lessons.** Use Chapter 11's lesson shape without `drill2`:
   - `easy`: Example 1 with 4 parts, then Question 1 with 2 parts.
   - `drill`: Questions 2 to 4, with 2 parts each.
   - `medium`: Example 2, then a set of 6 with review questions in positions 2 and 5.
   - `worded`: 3 problems.

   Chapter 10's `lessons/10.1.js` is the three-page reference.
4. **Helpers.**
   - Keep `num, n, formFig, mq, set` from Chapter 11's `helpers.js`.
   - Add a fraction type that simplifies with the gcd, and a display for fractions such as 5/36. Chapter 11's
     `frac` was only for halves, so check how it renders first.
   - Chapter 11's `P` formats points, so give the probability helper a different name.
5. **Diagrams (`shapes.js`).** Draw SVG in mm, as Chapters 10 and 11 do.
   - Reuse the building blocks in `require('../ch10-surface-area-volume/shapes.js').parts`
     (`C, f, T, svg, seg, dashed, poly, dot, arcD, …`).
   - From Chapter 11's `shapes.js`, reuse `table` and the colours in its `parts` (`GRID, BLUE, INK, LINE`).
   - New diagrams to write:
     - a spinner, with sectors that can be unequal
     - counters in a jar or bag, or a row of coloured circles
     - a row of playing cards
     - a Venn diagram: two circles in a rectangle with the total, and a count in each region
     - a two-stage tree diagram with labels at the branch ends
     - a 6 × 6 table of outcomes, partly filled in
   - Draw in a classic textbook style: thin lines, nothing bubbly. Give labels a white halo and don't let anything
     overlap.
   - The figure size limits for three-page lessons are the `.three-page` rules in `lib/theme.css`. The
     `.four-page` block is Chapter 11's.
6. **Question and part labels.** Change `lib/lesson-two.js`, but only behind a chapter option (e.g.
   `chapter.parts: true`), so Chapters 10 and 11 stay the same:
   - The `workRound` heading becomes `<b>Question ${k}</b><span>${x.text}</span>`. It no longer says
     `Round ${k}` or `Questions ${from}–${n}:`.
   - The item numbers become a, b, c …. These are the `q-num` in `wqHead`.
   - Each Medium set question gets its own number (Question 5, 6 …), because each has its own instruction.
   - The answers are labelled 1a, 1b ….
   - The YOU DO line "one round at a time" becomes "one question at a time".
7. **Cover.**
   - Add a region to `tools/mandelbrot.py`: copy the `'silver-seahorse'` line, keep palette 'violet' and
     `page=True`, and change the c and span.
   - Run it to make `<name>-band.jpg` and `<name>-page.jpg`, then look at the band image once.
   - Add an ART entry in `lib/blend-front.js`.
8. **README.md.** Add a Chapter 12 row, copying the Chapter 11 row.

### Checks (in this order; stop at the first failure)

- **Check one lesson first:**
  - Run `PAGES=3 CH=ch12-probability RENDER_DIR=$S/r1 bash tools/check-lesson.sh 12.1` and expect PASS.
  - That script hides build errors, so also run
    `node build.js year9-standard/ch12-probability 2>&1 | grep -i "error\|problem"`.
  - `fit.js` checks for:
    - no OVER, EDGE or PAGE problems
    - GAP of at least 0.9 mm
    - SCALE of at least 93% in YOU DO and 90% in WE DO
  - The builder also flags any picture under 12 mm tall. Pad such pictures, as Chapter 11's `tall()` does.
- **Look at pages only after a PASS,** using one contact sheet per lesson (the `montage` line in CLAUDE.md).
- **Then check the whole book:**
  - Build `ch12-probability` and `ch12-probability-teacher`, and expect "Layout check: no problems found".
  - Run `node tools/fit.js <html> 17` and expect PASS. The book is 2 front pages + 5 lessons × 3 pages.
- **If `git status` shows Chapter 10 or 11 outputs as changed,** restore them with `git checkout -- <path>`.

### Finish

- Copy the PDFs into `Chapter 12 Probability booklet/` at the repo root:
  - `Year9-Standard-Ch12-Probability-Student-copy.pdf`
  - `Year9-Standard-Ch12-Probability-Teacher-copy.pdf`
  - `Year9-Standard-Ch12-Probability-Answers.pdf`
- Commit, ending the message with the attribution lines your session gives you. Push to
  `claude/affectionate-gates-exjv9d`.
- Send the teacher the three PDFs and a report of a few lines.

### Pitfalls from Chapters 10 and 11

- The rm safety check blocks `rm -f $S/*.png`. Use a fresh folder or `"${S:?}"`.
- Start long jobs with the Bash tool's `run_in_background`, not `&`.
- Keep Medium instructions to one line and question headings to about 85 characters, or the page overflows.
- When SCALE fails, shrink the diagram (its k or w) before cutting text.
