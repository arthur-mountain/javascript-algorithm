const { StaticArray } = require("../static-array");
const assert = require("node:assert/strict");

/* ========== 建構子測試 ========== */

// 必須提供 capacity
assert.throws(
  () => new StaticArray(),
  "Should throw when capacity is not provided",
);
assert.throws(
  () => new StaticArray(0),
  RangeError,
  "Should throw when capacity is 0",
);
assert.throws(
  () => new StaticArray(-1),
  RangeError,
  "Should throw when capacity is negative",
);

/* ========== 基本狀態測試 ========== */

const capacity = 10; // 使用小容量便於測試
const instance = new StaticArray(capacity);

assert.strictEqual(instance.size(), 0, "Initial size should be 0");
assert.strictEqual(
  instance.capacity(),
  capacity,
  "Capacity should match input",
);
assert.strictEqual(instance.isFull(), false, "Should not be full when empty");
assert.strictEqual(instance.isEmpty(), true, "Should be empty on init");

/* ========== push / pop 測試 ========== */

instance.push(10);
assert.strictEqual(instance.size(), 1, "Size should be 1 after push");
assert.strictEqual(instance.get(0), 10, "Should get pushed element");
assert.strictEqual(instance.isEmpty(), false, "Should not be empty after push");

instance.push(20);
instance.push(30);
assert.strictEqual(instance.size(), 3, "Size should be 3 after 3 pushes");
assert.strictEqual(instance.get(2), 30, "Should get last pushed element");

const popped = instance.pop();
assert.strictEqual(popped, 30, "Pop should return last element");
assert.strictEqual(instance.size(), 2, "Size should decrease after pop");

// pop 到空
instance.pop();
instance.pop();
assert.strictEqual(
  instance.isEmpty(),
  true,
  "Should be empty after popping all",
);
assert.throws(() => instance.pop(), "Pop on empty array should throw");

/* ========== insert 測試 ========== */

// insert 是基於 length，不是 capacity
instance.insert(0, "a"); // length: 0 -> 1, data: [a]
assert.strictEqual(instance.get(0), "a", "Insert at 0");
assert.strictEqual(instance.size(), 1);

instance.insert(1, "c"); // length: 1 -> 2, data: [a, c]
assert.strictEqual(instance.get(1), "c", "Insert at end (index = length)");

instance.insert(1, "b"); // length: 2 -> 3, data: [a, b, c]
assert.strictEqual(instance.get(0), "a", "Element at 0 unchanged");
assert.strictEqual(instance.get(1), "b", "New element at 1");
assert.strictEqual(instance.get(2), "c", "Original element shifted to 2");
assert.strictEqual(instance.size(), 3);

// 邊界錯誤測試
assert.throws(
  () => instance.insert(-1, "x"),
  RangeError,
  "Insert at negative index should throw",
);
assert.throws(
  () => instance.insert(100, "x"),
  RangeError,
  "Insert beyond length should throw",
);

/* ========== get / set 測試 ========== */

instance.set(1, "B");
assert.strictEqual(instance.get(1), "B", "Set should update element");

// 邊界錯誤測試
assert.throws(
  () => instance.get(-1),
  RangeError,
  "Get negative index should throw",
);
assert.throws(
  () => instance.get(100),
  RangeError,
  "Get beyond length should throw",
);
assert.throws(
  () => instance.set(100, "x"),
  RangeError,
  "Set beyond length should throw",
);

/* ========== delete 測試 ========== */

// 目前: [a, B, c], length: 3
const deleted = instance.delete(1); // 刪除 "B"
assert.strictEqual(deleted, "B", "Delete should return removed element");
assert.strictEqual(instance.size(), 2, "Size should decrease");
assert.strictEqual(instance.get(0), "a", "First element unchanged");
assert.strictEqual(instance.get(1), "c", "Element shifted after delete");

// 邊界錯誤測試
assert.throws(
  () => instance.delete(-1),
  RangeError,
  "Delete negative index should throw",
);
assert.throws(
  () => instance.delete(100),
  RangeError,
  "Delete beyond length should throw",
);

/* ========== findIndex / contains 測試 ========== */

// 目前: [a, c], length: 2
assert.strictEqual(instance.findIndex("a"), 0, "Find existing element");
assert.strictEqual(instance.findIndex("c"), 1, "Find existing element");
assert.strictEqual(instance.findIndex("z"), -1, "Not found returns -1");

assert.strictEqual(instance.contains("a"), true, "Contains existing");
assert.strictEqual(instance.contains("z"), false, "Not contains");

/* ========== clear 測試 ========== */

instance.clear();
assert.strictEqual(instance.size(), 0, "Size should be 0 after clear");
assert.strictEqual(
  instance.capacity(),
  capacity,
  "Capacity unchanged after clear",
);
assert.strictEqual(instance.isEmpty(), true, "Should be empty after clear");
assert.strictEqual(instance.findIndex("a"), -1, "Elements should be gone");

/* ========== 容量上限測試 ========== */

for (let i = 0; i < capacity; i++) {
  instance.push(i);
}
assert.strictEqual(instance.isFull(), true, "Should be full");
assert.throws(() => instance.push(999), "Push on full array should throw");
assert.throws(
  () => instance.insert(0, 999),
  "Insert on full array should throw",
);

/* ========== toString 測試 ========== */

instance.clear();
instance.push(1);
instance.push(2);
instance.push(3);
assert.strictEqual(instance.toString(), "[1, 2, 3]", "toString format");

console.log("All tests passed!");
