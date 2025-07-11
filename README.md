# Crossword Solver

This repository provides a small crossword solver written in plain JavaScript. The core logic lives in `solver.js` and can be used as a library or via the simple command line interface in `cli.js`.

## Usage

### As a Module

```javascript
const { crosswordSolver } = require('./solver');
const result = crosswordSolver('1..\n...', ['HI']);
console.log(result); // prints either the filled grid or 'Error'
```

### CLI

```
node cli.js "<puzzle string>" "[\"WORD1\",\"WORD2\"]"
```

The puzzle string is a grid where digits mark word starting points and `.` marks blocked cells. Words are provided as a JSON array.

## Tests

A very small test script resides in `test/test.js` and can be run with Node:

```
node test/test.js
```

## Architecture Notes

- `solver.js` exports the `crosswordSolver` function and contains no CLI logic.
- `cli.js` handles command line parsing and prints the solver result.
- The solver expects a unique solution; otherwise it returns `'Error'`.


