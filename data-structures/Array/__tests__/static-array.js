const { StaticArray } = require("../static-array");
const assert = require("node:assert/strict");

// Default size and capacity
assert.strictEqual(new StaticArray().size(), 0, "Default size should be 0");
assert.strictEqual(
  new StaticArray().capacity(),
  100,
  "Default minimum capacity should be 100",
);

/* Create Instance */
const capacity = 1000;
const instance = new StaticArray(capacity);

//  Default values
assert.strictEqual(instance.size(), 0, "Default size should be 0");
assert.strictEqual(
  instance.capacity(),
  capacity,
  "Default capacity should be 1000",
);
assert.strictEqual(
  instance.isFull(),
  false,
  "Array should not be full when init",
);
assert.strictEqual(instance.isEmpty(), true, "Array should be empty when init");

// Insert element at start
instance.insert(0, 1);
assert.strictEqual(
  instance.isEmpty(),
  false,
  "Array should not be empty after insert element",
);
assert.strictEqual(instance.size(), 1, "Increase size after insert element");
assert.strictEqual(instance.get(0), 1, "Get element by index ");

// update element at start
instance.set(0, 100);
assert.strictEqual(instance.get(0), 100, "Get element by index after updated");

// Insert element at middle
instance.insert(500, 5);
assert.strictEqual(instance.size(), 2, "Increase size after insert element");
assert.strictEqual(instance.get(500), 5, "Get element by index ");

// update element at middle
instance.set(500, 50);
assert.strictEqual(instance.get(500), 50, "Get element by index after updated");

// Insert element at end
instance.insert(999, 9);
assert.strictEqual(instance.size(), 3, "Increase size after insert element");
assert.strictEqual(instance.get(999), 9, "Get element by index ");

// update element at end
instance.set(999, 99);
assert.strictEqual(instance.get(999), 99, "Get element by index after updated");

// find the element
assert.strictEqual(
  instance.find(1),
  undefined,
  "Element not found return undefined",
);
assert.strictEqual(instance.findIndex(1), -1, "Element not found return -1");
assert.strictEqual(instance.find(100), 100, "Found the element");
assert.strictEqual(instance.findIndex(100), 0, "Found the element index");

// is contains element
assert.strictEqual(
  instance.contains(1),
  false,
  "Element not contains return false",
);
assert.strictEqual(
  instance.contains(100),
  true,
  "Element is contains return true",
);

// clear the array
instance.clear();
assert.strictEqual(instance.size(), 0, "Default size should be 0");
assert.strictEqual(
  instance.capacity(),
  capacity,
  "Default capacity should be 1000",
);
assert.strictEqual(
  instance.isFull(),
  false,
  "Array should not be full when init",
);
assert.strictEqual(instance.isEmpty(), true, "Array should be empty when init");

// Insert at the full array
for (let i = 0; i < capacity; i++) {
  instance.insert(i, i + 1);
}
assert.throws(
  () => instance.insert(0, 0),
  "Insert at full array should throw error",
);

// Delete element at start
let snapshotSize = instance.size();
let newValueAtZeroIndex = instance.get(1);
instance.delete(0);
assert.strictEqual(
  instance.get(0),
  newValueAtZeroIndex,
  "Get element by index after delete",
);
assert.strictEqual(
  instance.size(),
  snapshotSize - 1,
  "Decrease size after delete element",
);

// Delete element at middle
for (let i = 0; i < capacity; i++) {
  instance.set(i, i + 1);
}
snapshotSize = instance.size();
newValueAtZeroIndex = instance.get(501);
instance.delete(500);
assert.strictEqual(
  instance.get(500),
  newValueAtZeroIndex,
  "Get element by index after delete",
);
assert.strictEqual(
  instance.size(),
  snapshotSize - 1,
  "Decrease size after delete element",
);

// Delete element at end
for (let i = 0; i < capacity; i++) {
  instance.set(i, i + 1);
}
snapshotSize = instance.size();
newValueAtZeroIndex = undefined;
instance.delete(999);
assert.strictEqual(
  instance.get(999),
  newValueAtZeroIndex,
  "Get element by index after delete",
);
assert.strictEqual(
  instance.size(),
  snapshotSize - 1,
  "Decrease size after delete element",
);
