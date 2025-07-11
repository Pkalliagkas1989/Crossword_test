const assert = require('assert');
const { crosswordSolver } = require('../solver');

// Basic invalid puzzle should return 'Error'
const result = crosswordSolver('1..\n...', ['hi']);
assert.strictEqual(result, 'Error');

console.log('All tests passed.');
