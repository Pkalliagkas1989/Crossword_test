const assert = require('assert');
const { crosswordSolver } = require('../solver');

// Basic invalid puzzle should return an error string
const result = crosswordSolver('1..\n...', ['hi']);
assert.ok(typeof result === 'string' && result.startsWith('Error'));

console.log('All tests passed.');
