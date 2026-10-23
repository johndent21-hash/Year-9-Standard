# Year 10 Yearly Test 2026 revision booklet

Revision booklet for the Year 10 Transition Yearly Test 2026 (`Year10-Transition-Yearly-Test.pdf` in the
Year-10-Transition repo). One practice question per test question type, in the same sections (A Financial
mathematics, B Measurement, C Statistics and probability, D Other Year 10 topics).

    node build.js [--shots <dir>]

Writes to `../Year 10 yearly test revision/`:
- `Year10-Yearly-Test-2026-Revision-Booklet.pdf`: Part 1 questions, Part 2 help sheet, Part 3 answers with working
- `Year10-Yearly-Test-2026-Help-Sheet.pdf`: the help sheet on its own

All questions, the help sheet and the answers are in `build.js`; answers are calculated from each question's numbers.
Each question carries a "Help sheet A4" style tag that matches a box in the help sheet. Uses the global Playwright.
