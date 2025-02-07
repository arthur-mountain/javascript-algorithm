const { Deque } = require("..");
const assert = require("node:assert/strict");

// Default size and capacity
assert.strictEqual(new Deque().size(), 0, "Default size should be 0");
assert.strictEqual(
  new Deque().capacity(),
  100,
  "Default minimum capacity should be 100",
);
