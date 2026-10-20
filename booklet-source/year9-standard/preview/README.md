# Lesson previews

Build one lesson on its own while you write it (no cover, no inside cover):

```
mkdir -p year9-standard/preview/10.6
echo "module.exports = require('../../ch10-surface-area-volume/chapter.js').only('10.6');" > year9-standard/preview/10.6/chapter.js
node build.js year9-standard/preview/10.6
```

The preview folders are not committed (see `.gitignore`).
