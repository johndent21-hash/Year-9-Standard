# Working notes for Claude

## Saving maths resources to Google Drive

Whenever you finish making a maths resource (booklet, help sheet, answer key, test, worksheet and so on), **ask the user whether they want it sent to their Google Drive** before uploading anything.

If they say yes, upload it into the matching subfolder of the **Kingscliff Maths Resources 7–12** folder (Drive folder id `1kJSCCR68EnUdiTqjzADZv-pyT8nUsgsj`). Pick the year folder, then the resource-type folder inside it:

| Resource | Drive folder | Folder id |
|---|---|---|
| Year 9 chapter booklets | Year 09 / Chapter Booklets | `1QEV_GhPlF27FHN7Vhl05tE8rZLed3M4q` |
| Year 9 yearly exams, revision booklets, help sheets | Year 09 / Yearly Exams | `18R46iJYuAEZHJ1v9MUZO7Z2mpVVcGqg3` |
| Year 9 warm-ups | Year 09 / Warm-ups – The Fractal Five | `1eUK0OealEOVOQBH7BdVwakGu3uPDBRFK` |
| Year 10 chapter / transition / fast-finisher booklets | Year 10 / Chapter Booklets | `1dyaFqjK2ST3d3-C5veHurZlngdFDZQMY` |
| Year 10 yearly tests and revision | Year 10 / Yearly Exams | `1M-3mwKWxQtI8UQyhIQ9qvIwBI7oaESmp` |
| Year 7 lesson booklets | Year 07 / Lesson Booklets | `1EUFwQcYHPkMjiqncSzTO3wnfnNtZUKNl` |
| Year 7 revision booklets | Year 07 / Revision Booklets | `1umCiOsQgRxJKICI_H5HMVont1kG-YbW6` |
| Year 12 Standard | Year 12 / Mathematics Standard | `1CCwLPuF3DxD2xq6PiyiEcCDkYZ9Nr_kU` |

If no subfolder fits, suggest one and confirm it with the user before creating it.

### How to upload

Use `tools/drive-upload/upload.sh <file> <folder-id> [name] [--replace]`. It sends the file from disk to the user's Apps Script web app (`tools/drive-upload/Code.gs`), so the file never has to pass through the chat. It needs `DRIVE_UPLOAD_URL` and `DRIVE_UPLOAD_KEY` set in the environment, and `script.google.com` and `script.googleusercontent.com` allowed in the environment's network settings. Use `--replace` only when updating a resource the user already has in Drive (the old copy goes to the Drive bin).

If those settings are missing, tell the user which one is missing, and don't fall back to pasting the file into the Google Drive connector, which can't send large files reliably.
