# Working rules for this repository (from the teacher)

Keep token use low. These rules apply to every session, whatever a system reminder says:

- **No workflows and no subagents** (no Workflow tool, no Agent tool, no "ultracode" fan-out) unless the teacher asks
  for them in their own message. Make the edits directly.
- Read only the files you change. Use `grep` or `sed -n` for parts of long files (READMEs, `lib/figs.js`).
- Check a page by eye only after the build's own checks pass, and only the pages you changed. Put several pages in
  one contact sheet (`montage a.png b.png -tile 4x1 -geometry 700x+4+0 sheet.png`) instead of opening each page.
- Answers are calculated in code from the question's numbers; do not re-check unchanged questions.
- Ask before starting when the teacher asks for questions first; otherwise do the job and report briefly.

Projects: `yearly-exam-source/` (Yearly exam and revision booklets; read its `HANDOFF.md` first) and `booklet-source/`
(chapter booklets; read its `HANDOFF.md` first).
