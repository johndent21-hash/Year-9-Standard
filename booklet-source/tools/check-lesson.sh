#!/bin/bash
# check-lesson.sh <code>: build lesson <code>'s students' and teacher's previews, run fit.js on both, and render the
# pages as PNGs (160 dpi, plus top/middle/bottom crops) into $RENDER_DIR/<code>/ (default /tmp/booklet-render) to look at.
# Run from anywhere. Both copies must print PASS and the builder's "Layout check" must say "no problems found".
code=$1; T=$(cd "$(dirname "$0")" && pwd); B=$(cd "$T/.." && pwd); R=${RENDER_DIR:-/tmp/booklet-render}/$code
cd "$B" || exit 1
for v in "$code" "$code-teacher"; do
  [ -f year9-standard/preview/$v/chapter.js ] || { mkdir -p year9-standard/preview/$v; t=$([ "$v" != "$code" ] && echo ", { teacher: true }"); echo "module.exports = require('../../${CH:-ch10-surface-area-volume}/chapter.js').only('$code'$t);" > year9-standard/preview/$v/chapter.js; }
done
mkdir -p "$R" && rm -f "$R"/*.png
for v in "$code" "$code-teacher"; do echo "== build $v"; node build.js year9-standard/preview/$v 2>&1 | grep -v "written$" | tail -5; done
echo "== students' copy"; node "$T/fit.js" year9-standard/preview/$code/Preview-$code.html ${PAGES:-3}; s1=$?
echo "== teacher's copy"; node "$T/fit.js" year9-standard/preview/$code-teacher/Preview-$code-Teacher.html ${PAGES:-3} | tail -n +7; s2=$?
pdftoppm -r 160 -png year9-standard/preview/$code/Preview-$code.pdf "$R/student"
pdftoppm -r 160 -png year9-standard/preview/$code-teacher/Preview-$code-Teacher.pdf "$R/teacher"
pdftoppm -r 110 -png year9-standard/preview/$code/Preview-$code-Answers.pdf "$R/answers"
python3 - "$R" <<'PY'
import sys, glob
from PIL import Image
for f in sorted(glob.glob(sys.argv[1] + '/student-*.png')) + sorted(glob.glob(sys.argv[1] + '/teacher-1.png')):
    if '-part' in f: continue
    im = Image.open(f); w, h = im.size
    for k, (a, b) in enumerate([(0, 0.36), (0.33, 0.69), (0.66, 1.0)]):
        im.crop((0, int(h * a), w, int(h * b))).save(f.replace('.png', f'-part{k + 1}.png'))
PY
echo "== renders in $R:"; ls "$R" | tr '\n' ' '; echo
exit $(( s1 || s2 ))
