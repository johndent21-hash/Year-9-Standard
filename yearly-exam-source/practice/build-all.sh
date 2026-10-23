#!/usr/bin/env bash
# Builds the four practice exams (with answers at the back) and the help sheet into "../Practice exams 2026".
# Run from yearly-exam-source:  bash practice/build-all.sh
set -euo pipefail
cd "$(dirname "$0")/.."
OUT="../Practice exams 2026"
mkdir -p "$OUT"
for n in 1 2 3 4; do
  B="build/practice-$n"
  node build.js --exam "practice/exam-$n.js" --out "$B" --build "$B" --no-docx | grep -E "pages\)|!|passed|warning"
  node practice/answers.js "$B" "$B/Year9-5.2-Yearly-Exam-Practice-$n.pdf" "$OUT/Year9-5.2-Yearly-Exam-Practice-$n.pdf"
done
node practice/help-to-pdf.js "$PWD/practice/help-sheet.html" "$OUT/Year9-5.2-Yearly-Exam-Help-Sheet.pdf"
echo "Help sheet: $OUT/Year9-5.2-Yearly-Exam-Help-Sheet.pdf"
