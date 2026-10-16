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
    total: 70, green: 49, blue: 21,
    sections: {
      s1: { marks: 25, mc: 5, sa: 12, worded: [4, 4], green: 17, blue: 8 },
      s2: { marks: 24, mc: 5, sa: 11, worded: [4, 4], green: 17, blue: 7 },
      s3: { marks: 21, mc: 5, sa: 10, worded: [3, 3], green: 15, blue: 6 },
    },
  },

  sections: [
    require('./sections/s1-data'),
    require('./sections/s2-sav'),
    require('./sections/s3-mixed'),
  ],
};
