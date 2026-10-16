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

- Year 9 5.2 Yearly Exam 2026: 90 minutes, plus 5 minutes reading time. 70 marks, calculator allowed.
- Questions are modelled on the **green** (Foundation) and **blue** (Standard) questions in the Test yourself pages of New Century Maths 9. They are new questions with new numbers.
- Nothing from PATH sections, nothing from Chapters 11–13, no geometry and no surds.
- The layout copies the teacher's 2024 Yearly Exam (`2024 Yr 9 5.2 Yearly Final Exam.docx.pdf` on `main`) in Kingscliff navy and blue.
- Formulas are printed in each question as "Note: …". There is no formula sheet.

| Section | File | Marks | MC | Short answer | Worded | Green / Blue |
|---|---|---|---|---|---|---|
| 1 Data (Ch 9) | `sections/s1-data.js` | 25 | 5 × 1 | 12 | 4 + 4 | 17 / 8 |
| 2 Surface area and volume (Ch 10) | `sections/s2-sav.js` | 24 | 5 × 1 | 11 | 4 + 4 | 17 / 7 |
| 3 Mixed Topics (Chapters 1–8) | `sections/s3-mixed.js` | 21 | 5 × 1 | 10 | 3 + 3 | 15 / 6 |

Overall: Chapters 9–10 give 49 marks (70%) and Chapters 1–8 give 21 (30%). Green is 49 marks (70%) and blue is 21 (30%).
The build prints these totals and warns if any of them break. Keep them unless the teacher changes the brief.

## Where each question is

Numbering restarts in each section: MC is 1–5, then short answer, then worded.

- **S1:**
  - MC 1 classifying data; MC 2 dot-plot shape; MC 3 median from a stem-and-leaf plot; MC 4 mode from a histogram; MC 5 effect of an outlier.
  - Q6–9 mean, median, mode and range of one data set.
  - Q10 frequency table (4 marks, green); Q11 back-to-back stem-and-leaf (3 parts, blue).
  - Worded: Q12 surf shop wages, outlier (green); Q13 netball teams, back-to-back plot (blue).
- **S2:**
  - MC 1 kL to L; MC 2 absolute error; MC 3 parallelogram; MC 4 kite; MC 5 frame (shaded area).
  - Q6 perimeter with Pythagoras; Q7 area of a house shape; Q8 open rectangular prism SA (blue); Q9 cylinder V and SA (blue).
  - Worded: Q10 L-shaped lawn (green); Q11 water trough (a green, b blue, c green).
- **S3:**
  - MC 1 substitution; MC 2 Pythagoras; MC 3 discount; MC 4 index laws; MC 5 salary per fortnight.
  - Q6 expand (blue); Q7 simple interest; Q8 trig side; Q9 scientific notation; Q10 equations (b is blue).
  - Worded: Q11 wages and overtime (b blue); Q12 ladder, Pythagoras and trig (c blue).

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
- **S3 Q10b**, `7m − 2(m + 3) = 3m + 10` (blue), is worth 1 mark. To make it 2, take a blue mark from somewhere else in S3, so S3 stays at 21 marks with 15 green and 6 blue.
- **S2 Q11b** is tagged blue and **Q11c** green. They can be swapped.
- The exam is 14 pages, against 9 in 2024, because questions are kept whole on a page. The marking guide is 26 pages.
