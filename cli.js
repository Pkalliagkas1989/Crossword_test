#!/usr/bin/env node
const { crosswordSolver } = require('./solver');

const [,, puzzleArg, wordsArg] = process.argv;

if (!puzzleArg || !wordsArg) {
  console.error('Error: usage node cli.js "<puzzle>" "[\\"WORD1\\",\\"WORD2\\"]"');
  process.exit(1);
}

let words;
try {
  words = JSON.parse(wordsArg);
} catch {
  console.error('Error: invalid words JSON');
  process.exit(1);
}

const result = crosswordSolver(puzzleArg, words);
if (typeof result === 'string' && result.startsWith('Error')) {
  console.error(result);
  process.exit(1);
}

console.log(result);
