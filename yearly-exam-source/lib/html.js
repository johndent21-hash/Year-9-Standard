// Renders the exam model (lib/model.js) to HTML: the front page, the section tables, the marking guide pages and a
// sheet of figures (rendered to PNG for Word). Pages are cut in the browser by lib/page.js (paginate), so a row is
// never split across pages and a long table continues on the next page under "Section 1: Data (continued)" and the
// column headings.
'use strict';
const fs = require('fs');
const path = require('path');
const { LETTERS } = require('./model');

const esc = (s) => String(s).replace(/&(?!(#\d+|[a-z]+);)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const LEVEL = { green: '<span class="lv g" title="Green (Foundation)"></span>Green', blue: '<span class="lv b" title="Blue (Standard)"></span>Blue' };
const lvl = (l) => LEVEL[l] || esc(l || '');

function renderAll(model, { assets }) {
  const F = model.figures;
  const css = fs.readFileSync(path.join(__dirname, 'exam.css'), 'utf8');

  // ---------- blocks ----------
  const figHtml = (b) => `<span class="fig" data-fig="${b.id}">${F[b.id].svg}</span>`;
  const cellHtml = (c, tag, cls = '') => {
    if (c && c.key !== undefined) return `<${tag} class="kc ${cls}"><span class="key">${c.key}</span></${tag}>`;
    const t = c && c.text !== undefined ? c.text : '';
    return `<${tag} class="${cls}">${c && c.b ? `<b>${t}</b>` : t}</${tag}>`;
  };
  const tableHtml = (b) => {
    const cols = b.colW ? `<colgroup>${b.colW.map((w) => `<col style="width:${w}mm">`).join('')}</colgroup>` : '';
    const rows = b.rows.map((r, i) => {
      const head = b.headRow && i === 0;
      const foot = b.footRow && i === b.rows.length - 1;
      return `<tr${foot ? ' class="ft-foot"' : ''}>${r.map((c, j) => cellHtml(c, head || (b.headCol && j === 0) ? 'th' : 'td')).join('')}</tr>`;
    }).join('');
    return `<table class="ft${b.align === 'left' ? ' left' : ''}">${cols}${rows}</table>`;
  };
  const block = (b) => {
    if (b.t === 'p') {
      if (b.cls === 'part') return `<div class="partline"><span class="pl">${b.label}.</span><span class="pt">${b.html}</span></div>`;
      return `<p${b.cls ? ` class="${b.cls}"` : ''}>${b.html}</p>`;
    }
    if (b.t === 'fig') return `<div class="figp">${figHtml(b)}</div>`;
    if (b.t === 'table') return `<div class="tblp">${tableHtml(b)}</div>`;
    if (b.t === 'figs') return `<div class="figrow">${b.items.map((i) => (i.t === 'fig' ? figHtml(i) : i.t === 'table' ? tableHtml(i) : `<p>${i.html}</p>`)).join('')}</div>`;
    return '';
  };
  const blocks = (list) => (list || []).map(block).join('');
  const keyHtml = (list) => (list && list.length ? `<div class="key">${list.map((b) => `<p class="${b.cls}">${b.html}</p>`).join('')}</div>` : '');

  // ---------- section table rows ----------
  const COLS = '<colgroup><col class="c-num"><col class="c-q"><col class="c-wk"><col class="c-mk"></colgroup>';
  const row = (r, ri) => {
    const kn = r.kn ? ' kn' : '';
    const ref = `${r.ref ? ` data-ref="${r.ref}"` : ''} data-ri="${ri}"`;
    switch (r.k) {
      case 'title': return `<tr class="ttl${kn}"${ref} data-cont="${esc(r.cont)}"><td class="num"></td><td colspan="3">${esc(r.text)}</td></tr>`;
      case 'sub': return r.markHead
        ? `<tr class="sub rep${kn}"${ref}><td class="num"></td><td colspan="2">${r.text}</td><td class="mhd">${r.markHead}</td></tr>`
        : `<tr class="sub${kn}"${ref}><td class="num"></td><td colspan="3">${r.text}</td></tr>`;
      case 'colhdr': return `<tr class="colhdr rep${kn}"${ref}><td class="num"></td><td>Question</td><td>Working Out</td><td>Mark</td></tr>`;
      case 'info': return `<tr class="info${kn}"${ref}><td class="num"></td><td colspan="2" class="infoc">${blocks(r.q)}</td><td class="mk"></td></tr>`;
      case 'total': return `<tr class="total"${ref}><td class="num"></td><td colspan="2">Total</td><td class="mk">/${r.marks}</td></tr>`;
      case 'mc': {
        const opts = `<div class="opts ${r.optLayout}">${r.options.map((o, i) => `<div class="opt${i === r.answer ? ' right' : ''}"><span class="ol">${LETTERS[i]}.</span><span class="ot">${o.fig ? figHtml(o.fig) : o.html}</span></div>`).join('')}</div>`;
        const stem = blocks(r.stem);
        const body = r.figPos === 'right' && r.fig.length
          ? `<div class="mcright"><div class="mcl">${stem}${opts}</div><div class="mcf">${blocks(r.fig)}</div></div>`
          : `${stem}${blocks(r.fig)}${opts}`;
        return `<tr class="mc${kn}"${ref}><td class="num">${r.n}</td><td colspan="2" class="mcq">${body}</td><td class="mk">${r.marks}</td></tr>`;
      }
      case 'q': {
        const multi = r.parts.length > 1;
        const wk = r.parts.map((p) => `<div class="wk" style="min-height:${p.space}mm" data-min="${p.space}" data-ref="${p.ref}">${p.label ? `<span class="wl">${p.label}.</span>` : ''}${keyHtml(p.key)}</div>`).join('');
        const mk = multi ? `<td class="mkc">${r.parts.map((p) => `<div class="mkp">${p.marks}</div>`).join('')}</td>` : `<td class="mk">${r.parts[0].marks}</td>`;
        return `<tr class="q${kn}"${ref}><td class="num">${r.n}</td><td class="qc">${blocks(r.q)}</td><td class="wkc">${wk}</td>${mk}</tr>`;
      }
      case 'stem': {
        const text = blocks(r.q);
        const figs = blocks(r.fig);
        const body = r.figPos === 'right' && r.fig.length ? `<div class="stemright"><div class="stl">${text}${blocks(r.formula)}</div><div class="stf">${figs}</div></div>` : `${text}${figs}${blocks(r.formula)}`;
        return `<tr class="stem${kn}"${ref}><td class="num">${r.n}</td><td colspan="2" class="stemc">${body}</td><td class="mk"></td></tr>`;
      }
      case 'part': return `<tr class="prow${kn}"${ref}><td class="num plab">${r.label}</td><td class="qc">${blocks(r.q)}</td><td class="wkc"><div class="wk" style="min-height:${r.space}mm" data-min="${r.space}" data-ref="${r.ref}">${keyHtml(r.key)}</div></td><td class="mk">${r.marks}</td></tr>`;
      default: return '';
    }
  };
  const sectionFlow = (S, chrome = '') => `
<div class="flow" data-flow="${S.id}"${chrome ? ` data-chrome="${esc(chrome)}"` : ''}>
  <table class="sec split">${COLS}<tbody>${S.rows.map((r, i) => row(r, i)).join('\n')}</tbody></table>
</div>`;

  // ---------- front page ----------
  const M = model.meta;
  const front = (guide) => `
<div class="page front">
  <img class="logo" src="${assets}/kingscliff-logo.png" alt="Kingscliff High School">
  ${guide ? '<div class="idbox name tc">TEACHER COPY<span>Not for students</span></div>' : '<div class="idbox name">NAME:</div>\n  <div class="idbox teacher">TEACHER:</div>'}
  <div class="titles${guide ? ' g' : ''}">${M.titleLines.map((t) => `<div>${esc(t)}</div>`).join('')}${guide ? '<div class="mg">Marking Guide</div>' : ''}</div>
  <div class="infobox${guide ? ' g' : ''}">
    <div class="ib-l"><h3>${guide ? 'Notes for markers' : 'Instructions'}</h3>
      <ol>${(guide ? model.markingNotes : model.instructions).map((t) => `<li>${t}</li>`).join('')}</ol></div>
    <div class="ib-bar"></div>
    <div class="ib-r"><h3>Sections and Marks</h3>
      <table class="sm">${model.sections.map((S) => `<tr><td>${esc(S.frontLabel)}${guide ? `<div class="lvl-line">${S.green} green · ${S.blue} blue</div>` : ''}</td><td class="m">/${S.marks}</td></tr>`).join('')}
        <tr class="tot"><td>Total marks</td><td class="m">/${model.total}</td></tr></table></div>
  </div>
  ${guide ? distribution() : ''}
</div>`;

  // ---------- marking guide ----------
  const distribution = () => {
    const pct = (x) => `${Math.round((x / model.total) * 1000) / 10}%`;
    return `<div class="dist"><table class="dt">
      <tr class="dh"><td>Section</td><td>Marks</td><td>Share</td><td><span class="lv g"></span>Green</td><td><span class="lv b"></span>Blue</td><td>Questions</td></tr>
      ${model.sections.map((S) => `<tr><td>${esc(S.frontLabel)}</td><td>${S.marks}</td><td>${pct(S.marks)}</td><td>${S.green}</td><td>${S.blue}</td><td>${S.groups.mc.n} MC · ${S.groups.sa.n} SA · ${S.groups.worded.n} WP</td></tr>`).join('')}
      <tr class="dtot"><td>Total</td><td>${model.total}</td><td>100%</td><td>${model.green} (${pct(model.green)})</td><td>${model.blue} (${pct(model.blue)})</td><td></td></tr>
    </table></div>`;
  };
  const SUMCOLS = '<colgroup><col style="width:13mm"><col style="width:71mm"><col style="width:14mm"><col style="width:20mm"><col style="width:66mm"></colgroup>';
  const summaryFlow = () => `
<div class="flow" data-flow="summary">
${model.summary.map((s) => `<table class="sum split">${SUMCOLS}<tbody>
  <tr class="ttl kn" data-cont="${esc(s.heading)} – answer summary (continued)"><td colspan="5">${esc(s.heading)} – answer summary</td></tr>
  <tr class="colhdr rep kn"><td>Q</td><td>Answer</td><td>Marks</td><td>Level</td><td>Topic and source</td></tr>
  ${s.rows.map((r, i) => `<tr class="${r.first ? 'qfirst' : ''}${i === s.rows.length - 1 ? ' kn' : ''}"><td class="c"><b>${r.q}</b></td><td>${r.answer}</td><td class="c">${r.marks}</td><td class="lvc">${lvl(r.level)}</td><td>${r.topic ? `${r.topic}<br>` : ''}<span class="src">${r.src}</span></td></tr>`).join('')}
  <tr class="total"><td></td><td>Total</td><td class="c">${s.marks}</td><td colspan="2" class="lvsum">${s.green} green · ${s.blue} blue</td></tr>
</tbody></table><div class="gap"></div>`).join('')}
</div>`;
  const critFlow = () => `
<div class="flow" data-flow="criteria" data-cont="Marking criteria (continued)">
${model.criteria.map((s) => `<div class="blk crh kn">${esc(s.heading)} – marking criteria</div>
${s.questions.map((q) => `<div class="blk crit">
  <div class="ch"><b>Question ${q.n}</b><span>${q.marks} mark${q.marks === 1 ? '' : 's'}</span><span>${q.levels.map(lvl).join(' + ')}</span><span class="tp">${q.topic}</span><span class="src">${q.src}</span></div>
  ${q.parts.map((p) => `<div class="cp">
    ${p.label ? `<div class="cpl">${p.label})</div>` : ''}
    <div class="cpb">
      <div class="cans"><span class="lab">Answer</span><span class="red">${p.answer}</span>${q.parts.length > 1 ? `<span class="pm">${p.marks} mark${p.marks === 1 ? '' : 's'} · ${lvl(p.level)}</span>` : ''}</div>
      ${p.working.length ? `<div class="cwk"><span class="lab">Working</span><div>${p.working.map((w) => `<div>${w}</div>`).join('')}</div></div>` : ''}
      <div class="cmk"><span class="lab">Marks</span><div>${p.marking.map(([m, t]) => `<div><b>${m} mark${m === 1 ? '' : 's'}:</b> ${t}</div>`).join('')}</div></div>
      ${p.notes.length ? `<div class="cnote"><span class="lab">Notes</span><div>${p.notes.map((n) => `<div>${n}</div>`).join('')}</div></div>` : ''}
    </div></div>`).join('')}
</div>`).join('\n')}`).join('\n')}
</div>`;

  const doc = (title, body, cls) => `<!doctype html>
<html lang="en-AU"><head><meta charset="utf-8"><title>${esc(title)}</title><style>${css}</style></head>
<body class="${cls}">${body}</body></html>`;

  const examTitle = `${M.subject} ${M.course} ${M.examName} ${M.year}`;
  const examHtml = doc(examTitle, front(false) + model.sections.map((S) => sectionFlow(S)).join(''), 'exam');
  const tag = '<div class="guidetag">Marking guide: answers in red</div>';
  const guideHtml = doc(`${examTitle} Marking Guide`, front(true) + summaryFlow() + critFlow() + model.sections.map((S) => sectionFlow(S, tag)).join(''), 'guide');
  const figsHtml = doc('Figures', `<div class="figsheet">${Object.values(F).map((f) => `<div class="fs" data-fig="${f.id}">${f.svg}</div>`).join('')}</div>`, 'figs');
  return { examHtml, guideHtml, figsHtml };
}

module.exports = { renderAll };
