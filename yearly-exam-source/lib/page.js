// Code that runs inside the browser page (Playwright page.evaluate): lines up the marks with the parts, cuts the
// flows into A4 pages (rows never split), numbers the pages, and checks the layout.
'use strict';

// Line each part's mark up with its working block (inline parts: "a." and "b." in one row).
function prepare() {
  document.querySelectorAll('tr.q').forEach((tr) => {
    const wk = tr.querySelectorAll('td.wkc > .wk');
    const mk = tr.querySelectorAll('td.mkc > .mkp');
    mk.forEach((m, i) => { if (wk[i]) m.style.height = `${wk[i].getBoundingClientRect().height}px`; });
  });
}

// Cut every .flow into pages. A flow holds tables (class "split": cut between rows) and blocks (kept whole).
// Returns the page count, notes, and breaks: for each section table, the row indexes (data-ri) that start a new page.
// Rows or blocks with class "kn" stay with the next one. On a continuation page a table starts again with its title
// row (text from data-cont) and the last header row (class "rep") seen before the cut.
function paginate() {
  const notes = [];
  const breaks = {}; // section id -> indexes of the rows that start a continuation page (build-docx.py splits the Word tables there)
  const flows = [...document.querySelectorAll('.flow')];
  for (const flow of flows) {
    let content = null;
    let onPage = 0;
    const newPage = () => {
      const page = document.createElement('div');
      page.className = 'page';
      if (flow.dataset.chrome) page.insertAdjacentHTML('beforeend', flow.dataset.chrome);
      content = document.createElement('div');
      content.className = 'content';
      page.appendChild(content);
      flow.parentNode.insertBefore(page, flow);
      onPage = 0;
    };
    const fits = () => {
      const last = content.lastElementChild;
      if (!last) return true;
      return last.getBoundingClientRect().bottom <= content.getBoundingClientRect().bottom + 0.5;
    };
    newPage();
    const kids = [...flow.children];
    // group blocks that keep with the next one
    const units = [];
    let cur = [];
    kids.forEach((k) => { cur.push(k); if (!(k.classList.contains('kn') && !k.matches('table'))) { units.push(cur); cur = []; } });
    if (cur.length) units.push(cur);
    for (const unit of units) {
      if (unit.length === 1 && unit[0].matches('table.split')) {
        const src = unit[0];
        const rows = [...src.tBodies[0].rows];
        const title = rows.find((r) => r.classList.contains('ttl'));
        let lastRep = null;
        const groups = [];
        let g = [];
        rows.forEach((r) => { g.push(r); if (!r.classList.contains('kn')) { groups.push(g); g = []; } });
        if (g.length) groups.push(g);
        const shell = () => {
          const t = src.cloneNode(false);
          const cg = src.querySelector('colgroup');
          if (cg) t.appendChild(cg.cloneNode(true));
          const tb = document.createElement('tbody');
          t.appendChild(tb);
          content.appendChild(t);
          return tb;
        };
        let tb = shell();
        for (const grp of groups) {
          grp.forEach((r) => tb.appendChild(r));
          if (!fits() && onPage > 0) {
            grp.forEach((r) => r.remove());
            if (!tb.rows.length) tb.parentNode.remove();
            newPage();
            tb = shell();
            if (grp[0].dataset.ri !== undefined) (breaks[flow.dataset.flow] = breaks[flow.dataset.flow] || []).push(+grp[0].dataset.ri);
            const startsOwn = grp[0].classList.contains('ttl');
            if (title && !startsOwn) {
              const t = title.cloneNode(true);
              t.classList.add('cont');
              t.cells[t.cells.length - 1].textContent = title.dataset.cont || title.textContent;
              tb.appendChild(t);
              if (lastRep && !grp[0].classList.contains('rep') && !grp[0].classList.contains('sub')) tb.appendChild(lastRep.cloneNode(true));
            }
            grp.forEach((r) => tb.appendChild(r));
            if (!fits()) notes.push(`row ${grp.map((r) => r.dataset.ref).filter(Boolean).join(', ') || '(heading)'} is taller than a whole page`);
          }
          grp.forEach((r) => { if (r.classList.contains('rep')) lastRep = r; });
          onPage += 1;
        }
      } else {
        unit.forEach((k) => content.appendChild(k));
        if (!fits() && onPage > 0) {
          unit.forEach((k) => k.remove());
          newPage();
          if (flow.dataset.cont && !unit[0].classList.contains('crh')) content.insertAdjacentHTML('beforeend', `<div class="contlabel">${flow.dataset.cont}</div>`);
          unit.forEach((k) => content.appendChild(k));
          if (!fits()) notes.push(`a block in "${flow.dataset.flow}" is taller than a whole page`);
        }
        onPage += 1;
      }
    }
    flow.remove();
  }
  const pages = [...document.querySelectorAll('.page')];
  pages.forEach((p, i) => p.insertAdjacentHTML('beforeend', `<div class="pn">${i + 1}</div>`));
  return { pages: pages.length, notes, breaks };
}

// Layout checks. Returns a list of warnings (strings).
function checks() {
  const MM = 96 / 25.4;
  const out = [];
  const R = (el) => el.getBoundingClientRect();
  const refOf = (el) => { const r = el.closest('[data-ref]'); return r ? r.dataset.ref : (el.closest('tr') ? 'a heading row' : 'the page'); };
  const hit = (a, b, pad = 0) => a.left + pad < b.right && b.left + pad < a.right && a.top + pad < b.bottom && b.top + pad < a.bottom;
  const guide = document.body.classList.contains('guide');
  document.querySelectorAll('.page').forEach((pg, pi) => {
    const P = `page ${pi + 1}`;
    // front page: the boxes must hold their text, and nothing may reach the page number
    pg.querySelectorAll('.ib-l, .ib-r, .idbox').forEach((bx) => { if (bx.scrollHeight > bx.clientHeight + 1) out.push(`${P}: overflow: text runs out of the front-page box "${bx.textContent.trim().slice(0, 30)}"`); });
    const pgb = R(pg);
    pg.querySelectorAll('.front > *:not(.pn)').forEach((x) => { if (R(x).bottom > pgb.top + 272.5 * MM) out.push(`${P}: overflow: front-page item runs into the bottom margin`); });
    const c = pg.querySelector('.content');
    if (!c) return;
    const cb = R(c);
    [...c.children].forEach((ch) => { const b = R(ch); if (b.bottom > cb.bottom + 1) out.push(`${P}: overflow: content runs ${((b.bottom - cb.bottom) / MM).toFixed(1)} mm past the bottom margin`); });
    c.querySelectorAll('tr').forEach((tr) => { const b = R(tr); if (b.bottom > cb.bottom + 1 && b.top < cb.bottom) out.push(`${P}: row split: ${tr.dataset.ref || 'a heading row'} crosses the page end`); });
    // text wider than its box
    c.querySelectorAll('td, th, p, .opt, .partline').forEach((el) => {
      if (el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 1) out.push(`${P}: overflow: text too wide in ${refOf(el)}: "${el.textContent.trim().slice(0, 40)}"`);
    });
    // figures
    c.querySelectorAll('svg.fig').forEach((svg) => {
      const id = svg.closest('[data-fig]')?.dataset.fig || '?';
      const b = R(svg);
      const natural = parseFloat(svg.getAttribute('width')) * MM;
      if (b.width < natural - 1) out.push(`${P}: figure ${id} (${refOf(svg)}) is ${((natural - b.width) / MM).toFixed(1)} mm too wide for its column and was shrunk`);
      const cell = svg.closest('td, th') || c;
      const cr = R(cell);
      if (b.right > cr.right + 0.5 || b.left < cr.left - 0.5 || b.bottom > cr.bottom + 0.5 || b.top < cr.top - 0.5) out.push(`${P}: figure ${id} spills out of its cell (${refOf(svg)})`);
      // text in the same cell must not overlap the figure
      const walker = document.createTreeWalker(cell, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        if (!node.textContent.trim() || svg.contains(node) || node.parentElement.closest('svg')) continue;
        if (getComputedStyle(node.parentElement).display === 'none' || node.parentElement.closest('.key') && !guide) continue;
        const rg = document.createRange(); rg.selectNodeContents(node);
        for (const tr of rg.getClientRects()) if (hit(tr, b, 1)) { out.push(`${P}: figure ${id} overlaps the text "${node.textContent.trim().slice(0, 30)}" (${refOf(svg)})`); break; }
      }
      // labels inside the figure: not outside the frame, not on each other, not on a line
      const labels = [...svg.querySelectorAll('text')];
      const boxes = labels.map((t) => { const r = R(t); const sh = r.height * 0.17; return { left: r.left + 0.4, right: r.right - 0.4, top: r.top + sh, bottom: r.bottom - sh, t }; });
      boxes.forEach((x) => { if (x.left < b.left - 0.5 || x.right > b.right + 0.5 || x.top < b.top - 0.5 || x.bottom > b.bottom + 0.5) out.push(`${P}: figure ${id}: label "${x.t.textContent}" is cut off at the edge`); });
      for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) if (hit(boxes[i], boxes[j])) out.push(`${P}: figure ${id}: labels "${boxes[i].t.textContent}" and "${boxes[j].t.textContent}" overlap`);
      const segs = [];
      const ctmPt = (el, x, y) => { const m = el.getScreenCTM(); const p = new DOMPoint(x, y).matrixTransform(m); return [p.x, p.y]; };
      svg.querySelectorAll('line:not(.nl), polyline:not(.nl), polygon:not(.nl), rect:not(.nl)').forEach((el) => {
        let pts = [];
        if (el.tagName === 'line') pts = [[+el.getAttribute('x1'), +el.getAttribute('y1')], [+el.getAttribute('x2'), +el.getAttribute('y2')]];
        else if (el.tagName === 'rect') { const x = +el.getAttribute('x'), y = +el.getAttribute('y'), w = +el.getAttribute('width'), h = +el.getAttribute('height'); pts = [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]]; }
        else { pts = el.getAttribute('points').trim().split(/\s+/).map((s) => s.split(',').map(Number)); if (el.tagName === 'polygon') pts.push(pts[0]); }
        if (el.getAttribute('stroke') === 'none') return;
        const sp = pts.map((p) => ctmPt(el, p[0], p[1]));
        for (let i = 1; i < sp.length; i++) segs.push([sp[i - 1], sp[i]]);
      });
      const crosses = (p, q, bx) => { // Liang-Barsky
        let t0 = 0, t1 = 1; const dx = q[0] - p[0], dy = q[1] - p[1];
        for (const [pp, qq] of [[-dx, p[0] - bx.left], [dx, bx.right - p[0]], [-dy, p[1] - bx.top], [dy, bx.bottom - p[1]]]) {
          if (Math.abs(pp) < 1e-9) { if (qq < 0) return false; } else { const r = qq / pp; if (pp < 0) { if (r > t1) return false; if (r > t0) t0 = r; } else { if (r < t0) return false; if (r < t1) t1 = r; } }
        }
        return true;
      };
      boxes.forEach((x) => { if (segs.some(([p, q]) => crosses(p, q, x))) out.push(`${P}: figure ${id}: label "${x.t.textContent}" touches a line`); });
    });
    // working space
    c.querySelectorAll('.wk').forEach((w) => {
      const h = R(w).height / MM, min = +w.dataset.min;
      if (h < min - 0.5) out.push(`${P}: working space under the minimum: ${w.dataset.ref} has ${h.toFixed(0)} mm, needs ${min} mm`);
      if (guide && h > min + 0.6) out.push(`${P}: note: the worked answer for ${w.dataset.ref} is taller than its working space (${min} mm): the row grows by ${(h - min).toFixed(0)} mm in the marking guide`);
    });
  });
  return out;
}

module.exports = { prepare, paginate, checks };
