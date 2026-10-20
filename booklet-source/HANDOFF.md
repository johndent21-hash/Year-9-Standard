# Chapter booklets: handoff

Read this, then follow `/CLAUDE.md`: no workflows or subagents, read only the files you change, and grep long files.
Work on branch `claude/affectionate-gates-exjv9d` and push there. `$S` below means your scratchpad folder.

Done: Chapter 12 Probability (17 Oct 2026): `year9-standard/ch12-probability`, PDFs in `Chapter 12 Probability booklet/`.
Done: Chapter 13 Similar figures (17 Oct 2026): `year9-standard/ch13-similar-figures`, PDFs in `Chapter 13 Similar figures booklet/`.
Done: Chapter 10 extension booklet for fast finishers (20 Oct 2026): `year9-standard/ch10-extension`, PDFs in
`Chapter 10 Surface area and volume booklet/`. Six cards a page (more left too little working space); no 10.2 or 10.3
questions (precision and error), as the teacher asked. Build it, then run its `check.js` (OVER, ROOM, SCALE).
The Chapter 13 brief below is kept as a record of the teacher's decisions; the next job is not set yet.

## Next job: Chapter 13 Similar figures booklet, three pages per lesson

Make the Year 9 Standard Chapter 13 booklet in the same style, layout and colours as Chapter 12: student copy,
teacher copy and answers. **Chapter 12 is the model:** copy its files and change them. The cover uses a different part
of the Mandelbrot set, in the same violet colours.

### The teacher's decisions (17 Oct 2026)

- **Four lessons, three pages each, exactly like Chapter 12:**
  - Page 1: notes, the WE DO example and Question 1.
  - Page 2: the Easy drill (Questions 2 to 4).
  - Page 3: the Medium example, a set of six (two of them review questions, in places 2 and 5) and three worded
    problems.
- **The same question style as Chapter 12** (`chapter.parts: true`, already in `lib/lesson-two.js`):
  - Questions are numbered Question 1, 2, 3 … with parts a, b.
  - Each question has a one-line, step-by-step instruction.
  - Each answer line names what is being found, e.g. `Scale factor =`, `x =`.
  - Every drill question in a lesson has the same shape.
  - The last drill question gives less help.
- **Enlargements are drawn on a printed grid** in the question box, with room on the same grid for the image.
  Scale factors 2, 3 and 1/2.

| Lesson | Textbook | Test Yourself | Every drill question has the same shape |
|---|---|---|---|
| 13.1 Similar figures | 13.01 | Q1, Q2 | two similar figures, vertices lettered (the second may be turned or flipped), one pair of matching sides with lengths: name the matching side, then scale factor = image side ÷ original side |
| 13.2 Enlargements | 13.01 | Q3 | a shape on a grid and a scale factor: write the image's lengths (in squares), then draw the image on the same grid |
| 13.3 Finding unknown sides | 13.02 | Q4, Q5 | two similar figures with one unknown side x: the scale factor from a known pair of matching sides, then x |
| 13.4 Shadows and scale drawings | 13.03 | Q6, Q7 | a small known object and a large one (a stick and a flagpole; a plan and the real house): the scale factor, then the real length, with units |

A suggested shape for each lesson's drill (change it if a page will not fit):

- **13.1:**
  - Questions 1 and 2: matching sides marked with ticks and matching angles with arcs, lengths given.
  - Question 3: both figures on a light grid, so students count squares instead of measuring (Test Yourself Q2 says
    "by measurement").
  - Question 4 (less help): no marks. Students write the similarity statement (`ABC ||| PQR`) first.
  - Example 1 and the Medium set cover Test Yourself Q1: list the matching sides and angles, then write the
    statement.
- **13.2:**
  - Questions 1 to 3: rectangles, then right-angled triangles, then L-shapes. Lines: `Original lengths`,
    `Image lengths`.
  - Question 4 (less help): an irregular shape like Test Yourself Q3 at scale factor 1/2, with only `Image lengths`.
  - The answers list the image's side lengths in squares.
- **13.3:**
  - Every drill part: lines `Scale factor =`, `x =`.
  - Question 4 (less help): the matching sides are not marked.
  - Testing for similarity (Test Yourself Q4: are the ratios of all the matching sides equal?) goes in Example 2 and
    the Medium set.
- **13.4:**
  - Questions 1 and 2: shadows (stick and pole, person and tree).
  - Question 3: plans and maps at a scale like 1 : 200, with the plan lengths printed (a printed plan cannot be
    measured reliably).
  - Question 4 (less help): the shadow problem in words. Students draw the diagram.

**Answers:**
- Scale factors are whole numbers or fractions in simplest form (Chapter 12's `fs`).
- Lengths carry their units, to one decimal place where needed.
- Convert cm to m in 13.4.
- Work out every answer in code from the question's numbers.

**Similar** is written `|||` as in the textbook (`FECD ||| TRMP`). Test Yourself Q1c says "congruency statement" but
means the similarity statement.

**Real situations** use their own letters, not x and y (h for a height, d for a distance).

**Review questions** (Medium places 2 and 5) come from Chapter 12 or Year 8. Year 8 ratio skills fit well:
simplifying ratios and dividing in a ratio.

### Test Yourself 13 (the source)

To see the exact wording, extract pages 27 and 28:

```
git show "origin/main:Year 9 Test Yourself Chapter 1-13.pdf" > $S/ty.pdf && pdftotext -f 27 -l 28 -layout $S/ty.pdf -
```

To see the diagrams, run `pdftoppm -f 27 -l 28 -r 50 -png`. The questions in short:

1. (13.01) FECD and TRMP are similar quadrilaterals. List the matching sides and the matching angles, then write the
   statement.
2. (13.01) By measurement, find the scale factor for three pairs of similar figures (rectangles, triangles, quadrilaterals).
3. (13.01) Copy an L-shaped figure onto graph paper and draw its image for scale factor 3 and for scale factor 1/2.
4. (13.02) Test whether each pair is similar: rectangles 20 × 12 mm and 29 × 18 mm; triangles 8, 7, 10 cm and 6, 7.5,
   5.25 cm.
5. (13.02) Find the unknown sides in two pairs of similar figures (triangles 15, 12, y and 8, 7, p cm; quadrilaterals in mm).
6. (13.03) A flagpole's shadow is 20 m long. A stick 60 cm tall casts a shadow 150 cm long. Find the height h (8 m).
7. (13.03) A floor plan drawn to a scale of 1 : 200: find the actual lengths AB and CD.

### How to build it (copy Chapter 12)

All paths below are under `booklet-source/`.

1. **Folders.**
   - `year9-standard/ch13-similar-figures/` holds `chapter.js`, `helpers.js`, `shapes.js` and `lessons/13.1.js` to
     `13.4.js`.
   - `year9-standard/ch13-similar-figures-teacher/chapter.js` is
     `module.exports = require('../ch13-similar-figures/chapter.js').teacherCopy();`.
2. **chapter.js.** Copy Chapter 12's file, then change it:
   - Set number 13, the title, `fileName: 'Year9-Standard-Ch13-Similar-Figures'`, the four-lesson plan, the goals
     and a new `art`.
   - Keep `pagesPerLesson: 3`, `parts: true`, `notesBox: 49.5` and the `q-parts` body class. Every Chapter 12 rule
     in `lib/theme.css` hangs on that class: wider pictures on pages 1 and 2, the answer-line label column, the
     Medium set's heading above its picture, and the labelled answers.
   - In `howto`, change the last sentence (fractions in simplest form) to the Chapter 13 rule for scale factors and
     lengths. Change the example tag `11.2` to `12.2`.
3. **Lessons.** Use Chapter 12's lesson shape:
   - `easy`: Example 1 with 4 parts, then Question 1 with 2 parts.
   - `drill`: Questions 2 to 4, with 2 parts each.
   - `medium`: Example 2, then a set of 6 with review questions in places 2 and 5.
   - `worded`: 3 problems.

   `ch12-probability/lessons/12.3.js` is a compact model:
   - a `part()` builder that returns [picture, answer, lines, words]
   - the `parts()` helper for each question
   - a `said()` builder for the less-help question
4. **Helpers.** `require('../ch12-probability/helpers')` gives `num, n, fs, fr, pw, parts, mq, set`. Add only what
   Chapter 13 needs, such as a scale factor shown as a whole number or fraction, or a length with its unit.
5. **Diagrams (`shapes.js`).** Draw SVG in mm, as Chapters 10 to 12 do.
   - Reuse the building blocks in `require('../ch10-surface-area-volume/shapes.js').parts`
     (`C, f, T, svg, seg, poly, dot, rightMark, sideLabel, arcD, …`).
   - Chapter 11's `plane({ x, y, k, grid: true, axes: false, poly })` draws a squared grid with a shaded shape. Use it
     for the grid questions.
   - Chapter 12's `side()` puts two pictures side by side, and its `parts` has `halo` and `tall`.
   - New diagrams to write:
     - a pair of similar figures drawn to scale from vertex coordinates and a scale factor, the image turned or flipped
       on request, with vertex letters, side lengths (an unknown as `x`), tick marks on matching sides and arcs on
       matching angles
     - a shape on a grid sized to hold its image (for scale factor 3, three times as wide), with blank grid to draw in
     - shadows: a stick and its shadow beside a pole or tree and its shadow, dashed sun rays, right angles, h marked
     - a floor plan with lettered corners, the plan lengths printed and the scale written under it
   - Draw in a classic textbook style: thin lines, nothing bubbly. Give labels a white halo and don't let anything
     overlap.
6. **Cover.**
   - Add a region to `tools/mandelbrot.py`: copy the `'silver-jellyfish'` line, keep palette 'violet' and `page=True`.
   - A suggestion: `'silver-minibrot'` with `c=(-1.7549, 0.0), span=0.04`, a small copy of the whole set on its
     antenna. The set is self-similar, which suits this chapter.
   - Run it (about 30 s, in the background). Keep only `<name>-band.jpg` and `<name>-page.jpg`; delete the `-cover`
     and `-hw` images. Look at the band image once.
   - Add an ART entry in `lib/blend-front.js`.
7. **README.md.** Add a Chapter 13 row, copying the Chapter 12 row.

### Figure size limits (learned on Chapter 12)

- Pages 1 and 2 pictures: up to 70 mm wide × 36 mm tall. If the part has words (`t`), they take 45% of the box and
  the picture gets about 44 mm.
- WE DO example parts: about 33 mm wide × 21 mm tall. A picture too big for that, like a 12-branch tree, is left out
  and the part is text only. Don't use `ex.fig`: its layout is untested in these lessons.
- Medium set: 34 mm wide × 15 mm tall, the one-line instruction above the picture.
- Notes picture (teacher copy): a column about 37 mm wide × 34 mm tall.
- If an enlargement grid needs more room than 70 × 36 mm, try `cols: 1` on that question (one part per row) before
  adding a `.q-parts` CSS rule.

### Checks (in this order; stop at the first failure)

- **Check one lesson first:**
  - Run `PAGES=3 CH=ch13-similar-figures RENDER_DIR=$S/r1 bash tools/check-lesson.sh 13.1` and expect PASS on both
    copies.
  - That script hides build errors, so also run
    `node build.js year9-standard/preview/13.1 2>&1 | grep -i "error\|problem"`.
  - `fit.js` checks for:
    - no OVER, EDGE or PAGE problems
    - GAP of at least 0.9 mm
    - SCALE of at least 93% in YOU DO and 90% in WE DO
  - Its "blank working space" figures are wrong for `q-parts` answer lines (they use `display: contents`). Ignore
    them.
- **Look at pages only after a PASS,** using one contact sheet per lesson (the `montage` line in CLAUDE.md).
- **Then check the whole book:**
  - Build `ch13-similar-figures` and `ch13-similar-figures-teacher`, and expect "Layout check: no problems found".
  - Run `node tools/fit.js <html> 14` on both and expect PASS. The book is 2 front pages + 4 lessons × 3 pages.
- **If `git status` shows Chapter 10, 11 or 12 outputs as changed,** restore them with `git checkout -- <path>`.

### Finish

- Copy the PDFs into `Chapter 13 Similar figures booklet/` at the repo root:
  - `Year9-Standard-Ch13-Similar-Figures-Student-copy.pdf`
  - `Year9-Standard-Ch13-Similar-Figures-Teacher-copy.pdf`
  - `Year9-Standard-Ch13-Similar-Figures-Answers.pdf`
- Commit, ending the message with the attribution lines your session gives you. Push to
  `claude/affectionate-gates-exjv9d`.
- Send the teacher the three PDFs and a report of a few lines.

### Pitfalls from Chapters 10 to 12

- The rm safety check blocks `rm -f $S/*.png`. Use a fresh folder or `"${S:?}"`.
- Start long jobs with the Bash tool's `run_in_background`, not `&`.
- Keep Medium instructions to one line (about 40 characters) and question headings to about 85 characters, or the
  page overflows.
- When SCALE fails, shrink the diagram (its k, w or r) before cutting text.
- The teacher's Notes box overflows easily. Keep it to 6 short key terms, 4 short formulas and 4 short steps.
- Text drawn rotated (an upright label) does not grow the picture's frame. Add invisible placeholders at its ends, as
  Chapter 12's `outcomes()` does.
- Show the teacher the first lesson before making the rest if they ask for it.
