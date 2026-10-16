# Hand-off: Year 9 5.2 Yearly Exam 2026 (edits in a new session)

Repo `johndent21-hash/Year-9-Standard`, branch **`claude/affectionate-gates-exjv9d`** (everything is committed and pushed).
Work in `yearly-exam-source/`. The finished files are in `Yearly exam 2026/`.

## Keep it cheap (the teacher's request)

- Make the edits yourself, directly. **Do not use workflows or subagents.**
- Do not re-check the whole exam. Every answer has already been checked twice.
- Read only the section file you are changing. Do not read the whole of `README.md` (378 lines): use `grep` for the part you need.
- To check a change, look at **only the changed page**. Find it with `--shots` and open one PNG, or crop it. Do not view every page.
- Open the Word file (`soffice`) only if you change layout code.

## What the exam is

- Year 9 5.2 Yearly Exam 2026: 90 minutes, plus 5 minutes reading time. **72 marks** (the teacher allowed more than 70), calculator allowed.
- Questions are modelled on the **green** (Foundation) and **blue** (Standard) questions in the Test yourself pages of New Century Maths 9. They are new questions with new numbers.
- Nothing from PATH sections, nothing from Chapters 11–13, no geometry and no surds.
- The layout copies the teacher's 2024 Yearly Exam (`2024 Yr 9 5.2 Yearly Final Exam.docx.pdf` on `main`) in Kingscliff navy and blue.
- Formulas are printed in each question as "Note: …". There is no formula sheet.
- **Marks follow steps (teacher's rule):** a part that takes 2 steps is worth 2 marks, 3 steps 3 marks. No part was lowered.

| Section | File | Marks | MC | Short answer | Worded | Green / Blue |
|---|---|---|---|---|---|---|
| 1 Data (Ch 9) | `sections/s1-data.js` | 17 | 4 × 1 | 3 | 4 + 6 | 11 / 6 |
| 2 Surface area and volume (Ch 10) | `sections/s2-sav.js` | 22 | 4 × 1 | 8 | 5 + 5 | 12 / 10 |
| 3 Mixed Topics (Chapters 1–8) | `sections/s3-mixed.js` | 33 | 5 × 1 | 18 | 3 + 3 + 4 | 26 / 7 |

Overall: 72 marks, 49 green and 23 blue. The brief in `exam.js` holds these numbers; the build warns if they break.

## Status (October 2026 edit)

The teacher asked for these changes:
- Move 10 marks from Data to Mixed, then cut 2 questions from each section.
- Make Data less repetitive with the mean, median and range, and use reading graphs and comparing/describing instead.
- Make the last Mixed questions and the measurement questions easier.
- Add simple shapes (circles included) for perimeter and area, and remove the open 3D objects.
- Give marks by steps.

**Only the exam PDF has been sent for approval.** `Yearly exam 2026/` still holds the previous version (all four files). Once the teacher approves, run `node build.js` (the full build, which makes all 4 files) and commit `Yearly exam 2026`. The teacher wants the Word file and the marking guide only after approving the PDF.

## Where each question is

Numbering restarts in each section: MC first, then short answer, then worded.

- **S1:**
  - MC 1 classifying data; MC 2 dot-plot shape; MC 3 mode from a histogram; MC 4 effect of an outlier.
  - Q5 mean (2) and median (1) from a stem-and-leaf plot.
  - Worded: Q6 sport column graph: difference, total, percentage (green); Q7 netball back-to-back: medians (2), which scores more (1), ranges and consistency (3) (blue).
- **S2:**
  - MC 1 kL to L; MC 2 absolute error; MC 3 parallelogram; MC 4 kite.
  - Q5 right-angled triangle, perimeter and area (green); Q6 circle, circumference and area (blue, TY10 Q7); Q7 closed cylinder V and SA, radius given (blue).
  - Worded: Q8 L-shaped lawn, every side labelled: perimeter 1, area 3, cost 1 (green); Q9 closed storage box: volume (blue), litres (green), SA 3 (blue).
- **S3:**
  - MC 1 substitution; MC 2 Pythagoras; MC 3 discount; MC 4 index laws; MC 5 salary per fortnight.
  - Q6 simplify (3 × 1); Q7 expand (blue); Q8 factorise (blue, TY1 Q8); Q9 simple interest; Q10 profit and percentage profit; Q11 equations (a 2, b blue 3); Q12 retainer plus commission.
  - Worded: Q13 wages with time-and-a-half only; Q14 gym formula and equation; Q15 ladder, Pythagoras and angle (no blue part).

## How a question is written

Each question is a JS object in its section file.
- `type`: `'mc'`, `'sa'` or `'worded'`.
- `text`, `formula` (prints as "Note: …"), `fig`, `level`, `src`, `topic`, `marks`, `answer`, `marking`, `space` (mm of working room).
- Multi-part questions use `parts: [{ text, marks, level, answer, working, marking, notes }]`.
- MC questions have `options[4]` and `answer` (the index of the correct option).

Answers are calculated in JS from the question's numbers. If you change a number, the answer, working and marking change with it.
Figures come from `lib/figs.js` (`grep -n "^  [a-zA-Z]*(" lib/figs.js`, or the README section "Figures").
For the full field list: `grep -n "" README.md | sed -n '149,276p'`.

## Build and check

```
cd yearly-exam-source
node build.js --only s2 --no-docx --shots /tmp/s2   # quick: one section, PDF only, into build/only-s2 (does not replace the final files)
node build.js                                       # final: all 4 files into ../Yearly exam 2026 (PDF + Word, exam + guide)
```

- The build must end with "Layout and data checks passed".
- Shots are named `Year9-5.2-Yearly-Exam-2026-pNN.png`; open only the page you changed.
- To check Word layout, only if you changed layout code: `soffice --headless --convert-to pdf --outdir /tmp/w "../Yearly exam 2026/"*.docx`.
- **Never run `npm install`** here. The build uses the global Playwright and Chromium; a local install breaks it.
- `build/` is git-ignored.

## Then

1. Commit `yearly-exam-source` and `Yearly exam 2026`.
2. Push with `git push -u origin claude/affectionate-gates-exjv9d`.
3. Send the teacher the changed PDFs and Word files.

Commit messages end with:
```
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
```

## Choices still open with the teacher

- **Chapter 6 has no question.** Its networks questions are all PATH, and the teacher excluded its geometry.
- The exam is 12 pages (14 before the October edit), because questions are kept whole on a page. The marking guide is 22 pages.
