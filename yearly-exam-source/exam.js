// The Year 9 5.2 Yearly Exam 2026: front page text, the brief (used to check the section files) and the sections.
// Questions live in sections/*.js. Marks, levels and totals are counted from the questions; nothing here is typed twice.
'use strict';

module.exports = {
  meta: {
    school: 'Kingscliff High School',
    subject: 'Mathematics',
    course: 'Year 9 5.2',
    examName: 'Yearly Exam',
    year: 2026,
    // the four centred lines on the front page (as in the 2024 exam)
    titleLines: ['MATHEMATICS', 'Year 9 5.2', 'Yearly Exam', '2026'],
    fileBase: 'Year9-5.2-Yearly-Exam-2026',
  },

  // Front page "Instructions" box (numbered).
  instructions: [
    'Reading time: 5 minutes',
    'Working time: 90 minutes',
    'Attempt all questions',
    'Show ALL working where needed',
    'A calculator is permitted',
  ],

  // Marking guide cover "Notes for markers" box.
  markingNotes: [
    'Full marks for a correct answer unless the question asks for working.',
    'Follow-through: a later part that uses an earlier wrong answer correctly earns its marks.',
    'Units: do not deduct for missing units; note it for feedback.',
    'Rounding: deduct only where the criteria say so.',
    'Green = Foundation, Blue = Standard (Test yourself levels).',
  ],

  // Question numbers restart at 1 in each section, as in the 2024 exam ('continuous' numbers them 1 to the end).
  numbering: 'section',

  // The teacher's brief. build.js compares the questions with these numbers and prints any difference.
  brief: {
    total: 72, green: 49, blue: 23,
    sections: {
      s1: { marks: 17, mc: 4, sa: 3, worded: [4, 6], green: 11, blue: 6 },
      s2: { marks: 22, mc: 4, sa: 8, worded: [5, 5], green: 12, blue: 10 },
      s3: { marks: 33, mc: 5, sa: 18, worded: [3, 3, 4], green: 26, blue: 7 },
    },
  },

  sections: [
    require('./sections/s1-data'),
    require('./sections/s2-sav'),
    require('./sections/s3-mixed'),
  ],
};
