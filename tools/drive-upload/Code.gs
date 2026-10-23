// Drive uploader for Claude. Paste this whole file into a new Apps Script
// project (script.google.com), set SECRET, then deploy it as a web app.
//
// SECRET: make up a long random phrase. Put the same phrase in the
// DRIVE_UPLOAD_KEY environment variable of your Claude cloud environment.
// Never paste it into a chat.
const SECRET = 'CHANGE-ME-to-a-long-random-phrase';

// Only folders inside "Kingscliff Maths Resources 7–12" may receive files.
const ROOT_FOLDER_ID = '1kJSCCR68EnUdiTqjzADZv-pyT8nUsgsj';

function doPost(e) {
  const p = e.parameter;
  if (SECRET.indexOf('CHANGE-ME') === 0 || p.key !== SECRET) {
    return reply({ ok: false, error: 'bad key' });
  }
  const folder = DriveApp.getFolderById(p.folder);
  if (!insideRoot(folder)) {
    return reply({ ok: false, error: 'folder is not inside Kingscliff Maths Resources 7–12' });
  }

  const bytes = Utilities.base64Decode(e.postData.contents);
  const blob = Utilities.newBlob(bytes, p.mime || 'application/pdf', p.name);

  // replace=1 moves any older file with the same name to the Drive bin first.
  if (p.replace === '1') {
    const old = folder.getFilesByName(p.name);
    while (old.hasNext()) old.next().setTrashed(true);
  }

  const file = folder.createFile(blob);
  return reply({ ok: true, id: file.getId(), url: file.getUrl(), name: file.getName() });
}

function insideRoot(folder) {
  if (folder.getId() === ROOT_FOLDER_ID) return true;
  const parents = folder.getParents();
  while (parents.hasNext()) {
    if (insideRoot(parents.next())) return true;
  }
  return false;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
