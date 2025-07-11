const assert = require('assert');
const { crosswordSolver } = require('../solver');

// Example puzzle 1
const puzzle1 = '2001\n0..0\n1000\n0..0';
const words1 = ['casa', 'alan', 'ciao', 'anta'];
const expect1 = 'casa\ni..l\nanta\no..n';
assert.strictEqual(crosswordSolver(puzzle1, words1), expect1);

// Example puzzle 2
const puzzle2 = `...1...........
..1000001000...
...0....0......
.1......0...1..
.0....100000000
100000..0...0..
.0.....1001000.
.0.1....0.0....
.10000000.0....
.0.0......0....
.0.0.....100...
...0......0....
..........0....`;
const words2 = [
  'sun',
  'sunglasses',
  'suncream',
  'swimming',
  'bikini',
  'beach',
  'icecream',
  'tan',
  'deckchair',
  'sand',
  'seaside',
  'sandals',
];
const expect2 = `...s...........\n..sunglasses...\n...n....u......\n.s......n...s..\n.w....deckchair\nbikini..r...n..\n.m.....seaside.\n.m.b....a.a....\n.icecream.n....\n.n.a......d....\n.g.c.....tan...\n...h......l....\n..........s....`;
assert.strictEqual(crosswordSolver(puzzle2, words2), expect2);

// Example puzzle 3
const puzzle3 = `..1.1..1...\n10000..1000\n..0.0..0...\n..1000000..\n..0.0..0...\n1000..10000\n..0.1..0...\n....0..0...\n..100000...\n....0..0...\n....0......`;
const words3 = ['popcorn','fruit','flour','chicken','eggs','vegetables','pasta','pork','steak','cheese'];
const expect3 = `..p.f..v...\nflour..eggs\n..p.u..g...\n..chicken..\n..o.t..t...\npork..pasta\n..n.s..b...\n....t..l...\n..cheese...\n....a..s...\n....k......`;
assert.strictEqual(crosswordSolver(puzzle3, words3), expect3);

// Invalid puzzle
assert.ok(crosswordSolver('', ['a']).startsWith('Error'));
assert.ok(crosswordSolver('0001\n0..0\n3000\n0..0', ['a']).startsWith('Error'));
// Invalid characters
assert.ok(crosswordSolver("😀", ["hi"]).startsWith("Error"));
assert.ok(crosswordSolver("1000", ["hí"]).startsWith("Error"));


console.log('All tests passed.');
