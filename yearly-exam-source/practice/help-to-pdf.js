const { chromium } = (() => { try { return require('playwright'); } catch { return require(require.resolve('playwright', { paths: [require('child_process').execSync('npm root -g').toString().trim()] })); } })();
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + process.argv[2]); await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: process.argv[3], format: 'A4', printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: '<div style="font-size:8pt;color:#555;width:100%;padding:0 12mm;display:flex;justify-content:space-between;font-family:Carlito,Calibri,sans-serif"><span>Year 9 5.2 Yearly Exam · Help sheet</span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>' });
  await b.close();
})();
