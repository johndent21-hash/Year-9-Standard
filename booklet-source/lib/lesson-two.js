// Two-page lesson (Year 10 transition series): a slim header, then an Easy page and a Medium page, each a
// WE DO example (parts the teacher works on the board) followed by YOU DO rounds of short questions.
// No key terms, notes, extension, exit ticket or summary: the lesson is the WE DO and YOU DO boxes.
//
//  page 1: lesson title and date, learning intention and success criteria, Easy WE DO, Easy YOU DO rounds
//  page 2: Medium WE DO, Medium YOU DO rounds
//
// spec:
//   code, title
//   li: 'one learning intention'          sc: ['success criterion', ..]   (2 or 3)
//   easy, medium: {
//     ex: { stem, parts: [..] }  exAns: [..]   the WE DO example (a part is text, { t, fig } or { t, draw })
//     hint: 'the method, in one line'          shown at the top of the YOU DO box
//     rounds: [{ text, items, ans, cols?, work? }]   as in lib/drill.js: work gives each question a working box
//     exTall: true   taller WE DO boxes, for examples with long working
//     a round question may be { t, from }: a question from an earlier lesson, printed with its lesson tag
//   }
//   notes: { terms, formulas, steps, fig }   the Notes box in the teacher's copy (see notesBox)
//   easy/medium .work: true   each question gets a working box (practiceWork); medium .set: true: one numbered set
//   worded: [{ q, a }]   worded problems at the end of the Medium page, each with room to draw a diagram and solve
//   mixed: [{ q, a, from, work? }]   optional (Year 9 standard series): a Mixed practice box at the end of the Medium
//          page, as in the Year 7 booklets. Today's skill mixed with earlier lessons; from tags each question with
//          its lesson code or 'Year 8'. q is text or { t, fig }; work gives the question a working box.
const { mbPage, banner, youDo } = require('./layout');
const { exBlock, roundHtml, hint, withFig } = require('./lesson-blend').parts;

const LEVEL_WORD = ['', 'Easy', 'Medium'];

// Text is printed with a no-break space between a number and its unit ('4 m'), inside a spaced number ('2 500 000')
// and around ' = ', so a line never breaks between them. Pictures ({ fig }) are left alone.
const UNITS = 'mm|cm|m|km|μm|Mm|mg|g|kg|t|mL|L|kL|ML|ms|μs|s|min|h|B|kB|MB|GB|TB|°C|cm²|m²|mm²|km²|cm³|m³|mm³';
const NB = '\u00a0';
const unitGap = new RegExp(`(\\d) (?=(?:${UNITS})(?![A-Za-z²³]))`, 'g');
const keep = (x) => (typeof x === 'string' ? x.replace(/(\d) (?=\d{3}(?!\d))/g, `$1${NB}`).replace(unitGap, `$1${NB}`).replace(/ = /g, `${NB}=${NB}`)
  : x && typeof x === 'object' && typeof x.t === 'string' ? { ...x, t: keep(x.t) } : x);
// A round question from an earlier lesson is { t, from }: it is printed with its lesson tag, and its answer is tagged too.
const tagged = (it) => it && typeof it === 'object' && it.from;
const keepLevel = (L) => ({ ...L, hint: keep(L.hint), exAns: (L.exAns || []).map(keep), ex: { ...L.ex, stem: keep(L.ex.stem), parts: L.ex.parts.map(keep) },
  rounds: L.rounds.map((x) => ({ ...x, text: keep(x.text),
    items: x.items.map((it) => (tagged(it) ? { ...keep(it), t: `<span class="q-tag">${it.from}</span>${keep(it.t)}` } : keep(it))),
    ans: x.ans.map((a, i) => (tagged(x.items[i]) ? `${keep(a)} <span class="ans-from">(${x.items[i].from})</span>` : keep(a))) })) });
const qn = (n) => `${n} question${n === 1 ? '' : 's'}`;
const total = (rounds) => rounds.reduce((t, x) => t + x.items.length, 0);

// The lesson header. With a Notes box (chapter.notesBox) it is compact: no title row (the page band already names the
// lesson; the Date line moves into the Notes box), and the learning intention and success criteria in small type.
const header = (spec, compact) => `${compact ? '' : `
  <div class="lesson-title two">
    <div class="lesson-badge"><span>Lesson</span><b>${spec.code}</b></div>
    <h1>${spec.title}</h1>
    <div class="date-line"><span>Date</span><i></i></div>
  </div>`}
  <div class="li-sc two${compact ? ' compact' : ''}">
    ${compact ? `<div class="card li"><b>Learning intention</b><p>We are learning to ${spec.li}</p></div>
    <div class="card sc"><b>Success criteria</b><ul class="ticks">${spec.sc.map((x) => `<li>I can ${x}</li>`).join('')}</ul></div>`
    : `<div class="card"><h3>Learning intention</h3><p>We are learning to ${spec.li}</p></div>
    <div class="card"><h3>Success criteria</h3><ul class="ticks">${spec.sc.map((x) => `<li>I can ${x}</li>`).join('')}</ul></div>`}
  </div>`;

// The Notes box (chapter.notesBox: its height in mm), at the start of the lesson. In the students' booklet it is blank:
// students copy what the teacher shows. In the teacher's copy (chapter.teacher) it holds the lesson's notes (spec.notes:
// { terms: [[term, meaning]], formulas: [..], steps: [..], fig }), shown on the screen at the front of the room.
const notesHtml = (n) => `<div class="notes-grid${n.fig ? ' with-fig' : ''}">
    <div class="nb-col"><h4>Key terms</h4><dl>${n.terms.map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join('')}</dl></div>
    <div class="nb-col"><h4>Formulas</h4><ul class="nb-formulas">${n.formulas.map((x) => `<li>${x}</li>`).join('')}</ul>${n.steps ? `<p class="nb-steps"><span class="nb-label">Steps</span> ${n.steps.map((x, i) => `<b>${i + 1}</b> ${x}`).join(' ')}</p>` : ''}</div>
    ${n.fig ? `<div class="nb-fig">${n.fig}</div>` : ''}
  </div>`;
const notesBox = (h, notes, teacher) => `
  <div class="notes-box${teacher ? ' teacher' : ''}" style="height:${h}mm"><div class="notes-head"><span class="zone-pill">NOTES</span><span class="notes-text">${teacher ? 'Key ideas for this lesson' : 'Copy what your teacher writes on the board.'}</span>${teacher ? '<span class="notes-copy">Teacher copy</span>' : '<span class="date-line"><span>Date</span><i></i></span>'}</div>${teacher && notes ? notesHtml(notes) : ''}</div>`;

// The YOU DO box of one level: the method hint, then the rounds, numbered on through the level.
const practice = (lvl, L) => {
  let from = 1;
  const body = L.rounds.map((x, i) => { const h = roundHtml(x, i, from); from += x.items.length; return h; }).join('');
  const work = L.rounds.some((x) => x.work);
  return youDo(`<b class="lvl-word l${lvl}">${LEVEL_WORD[lvl]}</b> work down the box, one round at a time. Write each answer on its line${work ? ' (show working in the boxes)' : ''}.<span class="count">${qn(total(L.rounds))}</span>`,
    `${hint(L.hint)}${body}`, 'grow skill-zone');
};

// Mixed practice: numbered from 1 in its own box, two to a row, each question tagged with the lesson it comes from.
const mixedBox = (list) => {
  const cell = (m, i) => `<div class="mq${m.work ? ' work' : ''}"><span class="q-num">${i + 1}</span><span class="q-text">${withFig(m.q)}</span><span class="mq-tag">${m.from}</span>${m.work ? '<span class="box"></span>' : '<span class="ans-line"></span>'}</div>`;
  return `<div class="zone you mixed"><div class="zone-head"><span class="zone-pill">MIXED PRACTICE</span><span class="zone-text">Today's skill mixed with earlier ones. Read each question carefully: they are not all the same kind.<span class="count">${qn(list.length)}</span></span></div>
    <div class="mix-grid">${list.map(cell).join('')}</div></div>`;
};

// Questions with working space (L.work: true): each question is a box, three to a row, with its number and question at
// the top, its picture (if any) on the left, blank space to work in, and an answer line at the bottom. L.set: true makes
// the level's questions one numbered set with no round headings (the Medium page: today's skill with earlier lessons
// mixed all through it, each earlier question tagged).
const isFig = (it) => typeof it === 'object' && it.fig;
const wq = (it, n) => `<div class="wq${isFig(it) ? ' fig' : ''}"><div class="wq-head"><span class="q-num">${n}</span><span class="q-text">${typeof it === 'string' ? it : it.t}</span></div>
    <div class="wq-body">${isFig(it) ? `<div class="wq-fig">${it.fig}</div>` : ''}<div class="wq-space"></div></div><div class="wq-ans"><i></i></div></div>`;
const workRound = (x, i, from, head) => {
  let n = from - 1;
  const cells = x.items.map((it) => wq(it, ++n)).join('');
  return `<div class="round wround" style="flex-grow:${Math.ceil(x.items.length / 3) * (x.items.some(isFig) ? 1.35 : 1)}">${head ? `<p class="round-h"><b>Round ${i + 1}</b><span>Questions ${from}–${n}: ${x.text}</span></p>` : ''}<div class="wgrid">${cells}</div></div>`;
};
const practiceWork = (lvl, L) => {
  let from = 1;
  const body = L.rounds.map((x, i) => { const h = workRound(x, i, from, !L.set); from += x.items.length; return h; }).join('');
  const what = L.set ? 'work in order. A tag shows an earlier lesson.' : 'work down the box, one round at a time.';
  return youDo(`<b class="lvl-word l${lvl}">${LEVEL_WORD[lvl]}</b> ${what} Show your working.<span class="count">${qn(total(L.rounds))}</span>`,
    `${hint(L.hint)}${body}`, 'grow skill-zone work-zone');
};
// The worded problems that finish the lesson (spec.worded: [{ q, a }]): side by side, each with room to draw and solve.
const wordedBox = (list) => `<div class="zone you worded"><div class="zone-head"><span class="zone-pill">WORDED PROBLEMS</span><span class="zone-text">Draw a diagram if it helps, then solve. Show your working.<span class="count">${list.length} problems</span></span></div>
    <div class="wpgrid">${list.map((w, i) => `<div class="wp"><div class="wq-head"><span class="q-num">${i + 1}</span><span class="q-text">${w.q}</span></div><div class="wq-space"></div><div class="wq-ans"><span>Answer</span><i></i></div></div>`).join('')}</div></div>`;

const level = (lvl, L) => `
  ${banner(lvl, `${LEVEL_WORD[lvl]} · ${qn(total(L.rounds))}`)}
  ${exBlock(lvl, L.ex, `parts-${L.ex.parts.length}${L.exTall ? ' tall-boxes' : ''}`)}
  ${L.work ? practiceWork(lvl, L) : practice(lvl, L)}`;

module.exports = (raw) => (chapter) => {
  const notes = raw.notes && { ...raw.notes, terms: raw.notes.terms.map(([t, d]) => [keep(t), keep(d)]), formulas: raw.notes.formulas.map(keep), steps: raw.notes.steps && raw.notes.steps.map(keep) };
  const spec = { ...raw, notes, li: keep(raw.li), sc: raw.sc.map(keep), easy: keepLevel(raw.easy), medium: keepLevel(raw.medium),
    mixed: raw.mixed && raw.mixed.map((m) => ({ ...m, q: keep(m.q), a: keep(m.a) })), worded: raw.worded && raw.worded.map((w) => ({ q: keep(w.q), a: keep(w.a) })) };
  ['easy', 'medium'].forEach((k) => {
    const L = spec[k];
    if (!L.exAns || L.exAns.length !== L.ex.parts.length) throw new Error(`${spec.code} ${k}: the example has ${L.ex.parts.length} parts but ${L.exAns ? L.exAns.length : 0} answers`);
    L.rounds.forEach((x) => { if (x.items.length !== x.ans.length) throw new Error(`${spec.code} ${k}: round "${x.text}" has ${x.items.length} questions but ${x.ans.length} answers`); });
  });
  (spec.mixed || []).forEach((m, i) => { if (!m.q || m.a === undefined || !m.from) throw new Error(`${spec.code} mixed practice ${i + 1} needs q, a and from`); });
  const page = (section, body, first) => mbPage(chapter, { code: spec.code, title: spec.title, section, body, first, cls: 'two-page' });
  const pages = [
    page('Easy', `${header(spec, !!chapter.notesBox)}${chapter.notesBox ? notesBox(chapter.notesBox, spec.notes, chapter.teacher) : ''}${level(1, spec.easy)}`, true),
    page('Medium', `${level(2, spec.medium)}${spec.mixed ? mixedBox(spec.mixed) : ''}${spec.worded ? wordedBox(spec.worded) : ''}`),
  ];
  const L = 'abcdefgh';
  const answers = [
    ['WE DO examples (teacher)', [...spec.easy.exAns.map((a, i) => `Ex 1${L[i]}: ${a}`), ...spec.medium.exAns.map((a, i) => `Ex 2${L[i]}: ${a}`)]],
    ['Easy', spec.easy.rounds.flatMap((x) => x.ans)],
    ['Medium', spec.medium.rounds.flatMap((x) => x.ans)],
    ...(spec.mixed ? [['Mixed practice', spec.mixed.map((m) => `${m.a} <span class="ans-from">(${m.from})</span>`)]] : []),
    ...(spec.worded ? [['Worded problems', spec.worded.map((w) => w.a)]] : []),
  ];
  return { code: spec.code, title: spec.title, pages, answers, spec };
};
