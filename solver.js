/**
 * solver.js
 *
 * Provides crosswordSolver, a framework-free function that fills an empty crossword puzzle from a list of words.
 *
 * Usage:
 *   const { crosswordSolver } = require("./solver");
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
 * it returns a string starting with 'Error:' explaining the reason. On success,
 * it returns the filled puzzle string.
 *
 * @param {string} puzzleStr - The empty puzzle layout.
 * @param {string[]} words - List of words to fit (no duplicates).
 */
function crosswordSolver(puzzleStr, words) {
  // Basic input validation
  if (typeof puzzleStr !== 'string') return 'Error: invalid puzzle format';
  if (!Array.isArray(words)) return 'Error: invalid words list';
  if (puzzleStr.trim() === '') return 'Error: empty puzzle';
  if (words.some(w => typeof w !== 'string')) return 'Error: invalid words list';
  if (new Set(words).size !== words.length) return 'Error: duplicate words';
  if (/[^0-9.\n]/.test(puzzleStr)) return 'Error: invalid puzzle characters';
  const latinRegex = /^[A-Za-z]+$/;
  if (words.some(w => !latinRegex.test(w))) return 'Error: invalid word characters';

  const rows = puzzleStr.split('\n').map(line => line.split(''));
  const height = rows.length;
  if (height === 0 || rows[0].length === 0) return 'Error: empty puzzle';
  const width = rows[0].length;

  // Validate grid consistency
  for (const row of rows) {
    if (row.length !== width) return 'Error: inconsistent row lengths';
  }

  // Utility to clone a 2D array
  const cloneGrid = grid => grid.map(row => row.slice());

  // Identify slots to fill: {r, c, dir, length}
  const slots = [];

  const isLetterCell = (r, c) => rows[r][c] !== '.';

  function scanLength(r, c, dr, dc) {
    let len = 0;
    while (r + len * dr < height && c + len * dc < width &&
           rows[r + len * dr][c + len * dc] !== '.') {
      len++;
    }
    return len;
  }

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      const cell = rows[r][c];
      if (/\d/.test(cell)) {
        const val = parseInt(cell, 10);
        if (val > 2) return 'Error: invalid start count';
        if (val === 0) continue;
        // val is 1 or 2
        const canAcross = (c === 0 || rows[r][c - 1] === '.') &&
                          c + 1 < width && rows[r][c + 1] !== '.';
        const canDown = (r === 0 || rows[r - 1][c] === '.') &&
                        r + 1 < height && rows[r + 1][c] !== '.';

        if (canAcross) {
          const len = scanLength(r, c, 0, 1);
          if (len > 1) slots.push({ r, c, dir: 'across', length: len });
        }
        if (canDown) {
          const len = scanLength(r, c, 1, 0);
          if (len > 1) slots.push({ r, c, dir: 'down', length: len });
        }
      }
    }
  }

  // Quick validation: word counts must match slot counts
  if (words.length !== slots.length) {
    return 'Error: word/slot count mismatch';
  }

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

  if (solutionCount === 1 && finalGrid) {
    const result = finalGrid.map(r => r.join('')).join('\n');
    return result;
  }
  return 'Error: puzzle has no unique solution';
}

module.exports = { crosswordSolver };
