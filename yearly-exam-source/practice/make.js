// Builds the exam definition for practice exam N (1-4): the front page, the brief and the three sections.
// Use: node build.js --exam practice/exam-1.js --out "../Practice exams 2026" --no-docx
'use strict';
const params = require('./params');

module.exports = (N) => {
  const P = params[N - 1];
  return {
    meta: {
      school: 'Kingscliff High School', subject: 'Mathematics', course: 'Year 9 5.2', examName: `Practice Exam ${N}`, year: 2026,
      titleLines: ['MATHEMATICS', 'Year 9 5.2', 'Yearly Exam Practice', `Practice Exam ${N}`],
      fileBase: `Year9-5.2-Yearly-Exam-Practice-${N}`,
    },
    instructions: [
      'Working time: 60 minutes',
      'Attempt all questions',
      'Show ALL working where needed',
      'A calculator is permitted',
      'Answers are at the back of this booklet',
    ],
    markingNotes: [
      'Full marks for a correct answer unless the question asks for working.',
      'Follow-through: a later part that uses an earlier wrong answer correctly earns its marks.',
      'Green = Foundation, Blue = Standard (Test yourself levels).',
    ],
    numbering: 'section',
    brief: {
      total: 64, green: 41, blue: 23,
      sections: {
        s1: { marks: 14, mc: 5, sa: 3, worded: [6] },
        s2: { marks: 20, mc: 4, sa: 6, worded: [5, 5] },
        s3: { marks: 30, mc: 5, sa: 15, worded: [3, 3, 4] },
      },
    },
    sections: [require('./s1')(P), require('./s2')(P), require('./s3')(P)],
  };
};
