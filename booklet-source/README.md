# Year 9 standard booklet builder

Builds the printable A4 lesson booklets for Year 9 standard as PDFs, plus a teacher answer key. It is a copy of the
Year 10 transition booklet builder (two-page lessons: an **Easy** page and a **Medium** page, each a WE DO example and
YOU DO rounds), with one addition from the Year 7 booklets: a **Mixed practice** box at the end of every Medium page,
with each question tagged by the lesson it comes from.

| Booklet | Folder |
|---|---|
| Chapter 10 Surface area and volume (New Century Maths 9) | `year9-standard/ch10-surface-area-volume` |

## Build

You need Node.js (LTS). Once: `npm run setup` (downloads the PDF tools, about 150 MB). Then:

```
node build.js year9-standard/ch10-surface-area-volume
```

This writes the booklet and its `-Answers.pdf` into that folder, and checks the layout: it prints a warning if anything
overflows a page, is cut off, or spills out of its box. Fix any warning before printing.

To check one lesson on its own while you write it, see `year9-standard/preview/README.md`.

## How a chapter is made

- `chapter.js` lists the lessons (codes and titles), the cover colours and artwork, and the "In this chapter you will" goals.
- `lessons/<code>.js` is one lesson: learning intention, success criteria, then `easy` and `medium` (an example with four
  parts, a one-line Remember hint, and rounds of questions) and `mixed` (8 Mixed practice questions, each tagged with the
  lesson it comes from). The fields are explained at the top of `lib/lesson-two.js`.
- `helpers.js` calculates every answer (nothing in the answer key is typed by hand); `shapes.js` draws the diagrams to
  scale from the same numbers.
- The cover art is part of the Mandelbrot set, drawn by `tools/mandelbrot.py` (region `silver-spiral`, purple and silver).
  The theme is purple, not blue, because blue means YOU DO in these booklets.

Lesson codes run 10.1 to 10.10. The textbook's 10.06 (circles) is split into two lessons, so from 10.7 on the lesson
codes run one ahead of the textbook sections (lesson 10.8 is textbook 10.07, and so on).
