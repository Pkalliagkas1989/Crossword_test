# Crossword Solver

This repository provides a small crossword solver written in plain JavaScript. The core logic lives in `solver.js` and can be used as a library or via the simple command line interface in `cli.js`.

## Usage

### As a Module

```javascript
const { crosswordSolver } = require('./solver');
const result = crosswordSolver('1..\n...', ['HI']);
console.log(result); // prints the filled grid or an error message starting with 'Error:'
```

### CLI

```
node cli.js "<puzzle string>" "[\"WORD1\",\"WORD2\"]"
```

The puzzle string is a grid where digits mark word starting points and `.` marks blocked cells. Digits may be `0`, `1`, or `2`:

- `0` – an open cell that does not start a word
- `1` – one word starts at this cell
- `2` – two words start here (across and down)

The grid must be rectangular and rows are separated with newlines. Words are provided as a JSON array.
Words must contain only Latin letters (A-Z or a-z). The puzzle string may only include digits, periods, and newlines.

## Tests

A very small test script resides in `test/test.js` and can be run with Node:

```
node test/test.js
```

## Using Your Own Crosswords

1. Encode your puzzle as described above using digits and periods separated by newlines.
2. Provide your word list as a JSON array of uppercase words.
3. Run the solver with the CLI:

```bash
node cli.js "<puzzle>" "[\"WORD1\",\"WORD2\"]"
```

The solver prints the filled grid or an error message if the puzzle has no unique solution or the input is invalid.

## Architecture Notes

- `solver.js` exports the `crosswordSolver` function and contains no CLI logic.
- `cli.js` handles command line parsing and prints the solver result.
- The solver expects a unique solution; otherwise it returns an error string
  starting with `'Error:'` explaining the reason.


