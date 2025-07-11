#!/usr/bin/env node
const { crosswordSolver } = require('./solver');

const [,, puzzleArg, wordsArg] = process.argv;

try {
  if (!puzzleArg || !wordsArg) {
    console.error('Usage: node cli.js "<puzzle>" "[\"WORD1\",\"WORD2\"]"');
    process.exit(1);
  }
  const puzzle = puzzleArg;
  const words = JSON.parse(wordsArg);
  const result = crosswordSolver(puzzle, words);
  console.log(result);
} catch (err) {
  console.error('Error');
}
