# Hand-off: Year 9 Standard, Chapter 10 Surface area and volume booklet

Written 15 October 2026, to continue in a new chat. Branch: `claude/affectionate-gates-exjv9d` in `johndent21-hash/Year-9-Standard`. Everything below is committed and pushed.

## What the teacher wants (agreed over several rounds)

A 10-lesson booklet from New Century Maths 9, Chapter 10 (10.01–10.09). Textbook 10.06 is split into two lessons: 10.6 (circumference and arc length) and 10.7 (areas of circles and sectors). Style:

- The Year 10 transition booklets' style: Kingscliff branding and Mandelbrot art, with a violet/silver theme.
- WE DO examples and YOU DO practice.

Every lesson is **three pages**. The approved model is **lesson 10.6**.

**Page 1 (Easy):**
- Learning intention and success criteria.
- A **Notes box**: blank in the students' copy (students copy the board); filled in the teacher's copy (key terms, formulas, steps, a diagram).
- WE DO Example 1.
- Two small-step drill rounds.

**Page 2 (Easy):** four more drill rounds.

**Page 3 (Medium):**
- WE DO Example 2.
- ONE numbered set of 9 Medium questions. About 3 of them are tagged earlier-lesson or Year 8 review questions, spread through the set.
- 3 worded problems.

**Rules:**
- Every question that can be drawn is a diagram.
- Drill boxes have no words: the given values are on the diagram, the unknown is marked with `?`, and the round heading says what to find.
- Every question needing a formula has labelled **Formula / Substitute / Answer** lines, with the formula printed on the early rounds.
- No Easy/Medium strips: the page band names the level.
- Two documents: a **students' copy** and a **teacher's copy**, identical except for the filled Notes boxes. A separate **answer key**.

The full spec, with the teacher's own words and the diagram rules learned along the way, is [`THREE-PAGE-FORMAT.md`](THREE-PAGE-FORMAT.md). Read it before changing any lesson.

## Where things are

- Builder: `booklet-source/` (Node + Playwright with the global Chromium). The template is `lib/lesson-two.js`.
- Lessons: `year9-standard/ch10-surface-area-volume/lessons/10.1.js` … `10.10.js`.
- Answer helpers: `helpers.js`. Diagrams: `shapes.js` (shared), plus lesson-only helpers in each lesson file.
- Students' build: `node build.js year9-standard/ch10-surface-area-volume`
- Teacher's build: `node build.js year9-standard/ch10-surface-area-volume-teacher`
- Deliverables, copied by hand after building: `Chapter 10 Surface area and volume booklet/`
  - `…-Student-copy.pdf`
  - `…-Teacher-copy.pdf`
  - `…-Answers.pdf`

## Check tools (run from `booklet-source/`)

- `tools/check-lesson.sh <code>` builds one lesson's two copies.
  - It runs `tools/fit.js`, which checks for boxes running over, lines touching borders, diagrams printing under 93% and things poking out of their zone.
  - It renders PNGs and crops to `/tmp/booklet-render/<code>/` to look at.
  - Both copies must print PASS, and the builder's own "Layout check" must say "no problems found".
- `node tools/booklet-check.js` checks the structure of every lesson: 3 pages, notes, 2 + 4 drill rounds, 9 Medium with tags only from earlier lessons or Year 8, 3 worded problems, and no `undefined`/`NaN`.
- `tools/build-full.sh` builds the whole booklet (32 pages each copy, 5-page answer key), checks every page and renders to `/tmp/booklet-render/full/`.

## Status

**All ten lessons are written in the three-page format.** Each was checked by an independent checker that recomputed every answer from the printed diagrams and inspected the layout, then fixed. No checker found a wrong answer in the final versions.

The full booklet builds cleanly: both copies pass every check, and the contents page numbers are right (lessons start on pages 3, 6, …, 30). The current PDFs are committed in the deliverables folder.

A final recheck was started on the last-fixed lessons. It found two small things, and the rest of it was cut off by a usage limit.

### Still to do

1. **Fix 10.2, worded problem 1 (nurse's thermometer).**
   - In `lessons/10.2.js` (search `FEVER`), the reading 37.4 °C marked every 0.2 °C gives limits of 37.3–37.5 °C. The fever threshold is exactly 37.5 °C, so the "yes" answer rests on a boundary case.
   - Change the numbers so the threshold is clearly inside or outside the limits. Example: fever "above 37.4 °C", or marked every 0.4 °C showing 37.2 °C so the answer is a clear no.
   - Update the question text, `FEVER` and the answer string together.
2. **Fix 10.3, Medium Q7 ('More accurate?', planks A 6 m and B 12 m).**
   - Every other whole-metre measurement in the lesson has a "nearest m" note under its picture. Q7 doesn't, but the key assumes p = 1 m.
   - Add the note, e.g. via `card(..., { note: 'nearest m' })`, as on line ~260 for Q1, keeping inside the box.
3. **Final recheck of 10.4 and 10.10, and one look across the whole booklet** for inconsistencies between lessons. This was cut off; both lessons already passed their own checks and fixes.
   - For each lesson: recompute every answer from the rendered pages and compare with the answer key.
   - For the booklet: open `/tmp/booklet-render/full/s-01.png … s-32.png` and look for styling that differs from lesson to lesson.
4. **Rebuild and deliver:**
   - Run `tools/build-full.sh` and `node tools/booklet-check.js`.
   - Copy the three PDFs into `Chapter 10 Surface area and volume booklet/`, commit and push.
   - Send the teacher the students' copy, the teacher's copy and the answer key.

### Judgement calls already made (keep them)

- **Year 8 tags** are allowed in any lesson (the teacher asked for mixed practice "from earlier lessons plus Year 8").
- **10.3 two-step % error boxes** use the lines Formula / E = p ÷ 2 / Answer. The comparison questions use % error A / % error B / Answer. Mention this to the teacher as a choice they can change.
- **10.1 conversions** have no formula, so they use Rule / Working / Answer lines (the `lines` option in `lib/lesson-two.js`).
- **10.8** gives the general triangular prism rule in its notes (SA = bh + perimeter × l). The right-angle-only shortcut appears only on the drill round that is all right-angled prisms.
- **10.10** shades the cuboid's front face as the cross-section, with h described as the distance between the prism's ends.

## Conventions

- Every answer is calculated in code (helpers `num`, `u`, `circ`, `prec`, `aerr`, `limits`, `pctErr`, …); never type a computed number.
- π answers are to one decimal place, with units on every answer.
- Labels are SVG text at size 2.8–3 mm (about 8 pt). Draw shapes smaller rather than shrinking labels.
- Commit messages end with:

  ```
  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
  ```

  followed by the session line.
- Push with `git push -u origin claude/affectionate-gates-exjv9d`. No pull request unless the teacher asks.
- The `year9-standard/preview/*/` folders are build scratch and not committed. The teacher-copy build's duplicate answer files are ignored.
