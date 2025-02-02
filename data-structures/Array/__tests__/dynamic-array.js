const { DynamicArray } = require("../dynamic-array");
const assert = require("node:assert/strict");

const instance = new DynamicArray();
const capacity = instance.capacity();
// Insert at the full array
for (let i = 0; i < capacity; i++) {
  instance.insert(i, i + 1);
}
assert.doesNotThrow(
  () => instance.insert(0, 0),
  "Insert at full array should not throw error in dynamic array",
);
