/**
 * crosswordSolver.js
 *
 * A production-ready, framework-free JavaScript module that solves an empty crossword puzzle.
 * It reads a string representation of the puzzle, fills in words from a provided list,
 * ensures a unique solution, and prints the filled puzzle or 'Error' otherwise.
 *
 * Usage:
 *   node crosswordSolver.js
 *   // The module exports crosswordSolver for integration or testing.
 *
 * @module crosswordSolver
 */
'use strict';

/**
 * Solve an empty crossword puzzle given a grid and a word list.
 * The grid is described as a string, where:
 *   - Digits indicate the number of words that start at that cell (across/down).
 *   - Periods ('.') represent blocked or unused cells.
 *   - Newlines separate rows.
 *
 * Words can start horizontally (rightwards) or vertically (downwards). Each starting
 * number tells how many words start at that cell (1 for one direction, 2 for both).
 * The solver must find a unique way to place every word exactly once.
 *
 * If the inputs don't guarantee a unique solution, or violate constraints,
 * it prints 'Error'. On success, it prints the filled puzzle string.
 *
 * @param {string} puzzleStr - The empty puzzle layout.
 * @param {string[]} words - List of words to fit (no duplicates).
 */
function crosswordSolver(puzzleStr, words) {
  // Parse input
  const rows = puzzleStr.split('\n').map(line => line.split(''));
  const height = rows.length;
  if (height === 0) return console.log('Error');
  const width = rows[0].length;

  // Validate grid consistency
  for (const row of rows) {
    if (row.length !== width) return console.log('Error');
  }

  // Utility to clone a 2D array
  const cloneGrid = grid => grid.map(row => row.slice());

  // Identify slots to fill: {r, c, dir, length}
  const slots = [];

  const isLetterCell = (r, c) => rows[r][c] !== '.';

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      const cell = rows[r][c];
      if (/\d/.test(cell)) {
        const count = parseInt(cell, 10);
        // Check horizontal slot
        if (count === 1 || count === 2) {
          // rightwards
          if (c + 1 < width && rows[r][c + 1] !== '.') {
            let len = 0;
            while (c + 1 + len < width && rows[r][c + 1 + len] !== '.') len++;
            if (len > 1) slots.push({ r, c, dir: 'across', length: len });
          }
        }
        // Check vertical slot
        if (count === 2) {
          if (r + 1 < height && rows[r + 1][c] !== '.') {
            let len = 0;
            while (r + 1 + len < height && rows[r + 1 + len][c] !== '.') len++;
            if (len > 1) slots.push({ r, c, dir: 'down', length: len });
          }
        } else if (count === 1) {
          // If single start, detect if it's vertical-only: if horizontal is invalid
          const horizOk = c + 1 < width && rows[r][c + 1] !== '.';
          if (!horizOk) {
            if (r + 1 < height && rows[r + 1][c] !== '.') {
              let len = 0;
              while (r + 1 + len < height && rows[r + 1 + len][c] !== '.') len++;
              if (len > 1) slots.push({ r, c, dir: 'down', length: len });
            }
          }
        }
      }
    }
  }

  // Quick validation: word counts must match slot counts
  if (words.length !== slots.length) return console.log('Error');

  // Prepare state
  const assignments = Array(slots.length).fill(null);
  const used = new Set();
  let solutionCount = 0;
  let finalGrid = null;

  // Backtracking search
  function backtrack(idx, grid) {
    if (solutionCount > 1) return; // stop if more than one solution
    if (idx === slots.length) {
      solutionCount++;
      finalGrid = cloneGrid(grid);
      return;
    }
    const { r, c, dir, length } = slots[idx];
    for (const word of words) {
      if (used.has(word) || word.length !== length) continue;
      // Check fit
      let fits = true;
      for (let k = 0; k < length; k++) {
        const rr = dir === 'across' ? r : r + k;
        const cc = dir === 'across' ? c + k : c;
        const ch = grid[rr][cc];
        if (/\d/.test(ch) || ch === '.') {
          // empty cell: will place letter
        } else if (ch !== word[k]) {
          fits = false;
          break;
        }
      }
      if (!fits) continue;

      // Place word
      const snapshot = [];
      for (let k = 0; k < length; k++) {
        const rr = dir === 'across' ? r : r + k;
        const cc = dir === 'across' ? c + k : c;
        snapshot.push({ r: rr, c: cc, prev: grid[rr][cc] });
        grid[rr][cc] = word[k];
      }
      used.add(word);

      backtrack(idx + 1, grid);

      // Undo
      used.delete(word);
      for (const { r: rr, c: cc, prev } of snapshot) {
        grid[rr][cc] = prev;
      }
      if (solutionCount > 1) return;
    }
  }

  // Initialize fill grid with digits and blocks
  const workingGrid = rows.map(row => row.map(ch => (ch === '.' ? '.' : ch)));
  backtrack(0, workingGrid);

  // Output result
  if (solutionCount === 1 && finalGrid) {
    // Convert to string, replace digits with letters as filled
    const result = finalGrid.map(r => r.join('')).join('\n');
    console.log(result);
  } else {
    console.log('Error');
  }
}

// If run as CLI, read from process args or stdin
if (require.main === module) {
  const [,, puzzleArg, wordsArg] = process.argv;
  try {
    const puzzle = puzzleArg;
    const words = JSON.parse(wordsArg);
    crosswordSolver(puzzle, words);
  } catch (err) {
    console.error('Error');
  }
}

module.exports = { crosswordSolver };