#!/bin/bash
# build-full.sh: build the whole Chapter 10 booklet (students' copy + answers, then the teacher's copy), run fit.js on
# both (32 pages: cover, inside cover, 10 lessons × 3) and render every page at 110 dpi into $RENDER_DIR/full/.
T=$(cd "$(dirname "$0")" && pwd); B=$(cd "$T/.." && pwd); R=${RENDER_DIR:-/tmp/booklet-render}/full
cd "$B" || exit 1
mkdir -p "$R" && rm -f "$R"/*.png
for d in ch10-surface-area-volume ch10-surface-area-volume-teacher; do echo "== build $d"; node build.js year9-standard/$d 2>&1 | grep -v "written$" | tail -8; done
F=year9-standard/ch10-surface-area-volume/Year9-Standard-Ch10-Surface-Area-and-Volume
TF=year9-standard/ch10-surface-area-volume-teacher/Year9-Standard-Ch10-Surface-Area-and-Volume-Teacher-copy
echo "== students' copy"; node "$T/fit.js" $F.html 32 | grep -v "diagram scales\|blank working"
echo "== teacher's copy"; node "$T/fit.js" $TF.html 32 | grep -v "diagram scales\|blank working"
for f in $F.pdf $TF.pdf $F-Answers.pdf; do echo "$(basename $f): $(pdfinfo $f | grep Pages)"; done
pdftoppm -r 110 -png $F.pdf "$R/s"; pdftoppm -r 110 -png $TF.pdf "$R/t"; pdftoppm -r 90 -png $F-Answers.pdf "$R/a"
echo "== renders in $R: $(ls "$R" | wc -l) files"
