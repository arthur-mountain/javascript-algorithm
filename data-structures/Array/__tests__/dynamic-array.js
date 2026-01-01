const { DynamicArray } = require("../dynamic-array");
const assert = require("node:assert/strict");

/* ========== 建構子測試 ========== */

// 預設建構（使用預設初始容量）
const defaultInstance = new DynamicArray();
assert.strictEqual(
  defaultInstance.size(),
  0,
  "Default constructor should create empty array",
);
assert.strictEqual(
  defaultInstance.capacity(),
  4,
  "Default initial capacity should be 4",
);
assert.strictEqual(
  defaultInstance.initialCapacity(),
  4,
  "Default initial capacity should be 4",
);
assert.strictEqual(
  defaultInstance.growthFactor(),
  2,
  "Default growth factor should be 2",
);

// 指定初始容量
const customInstance = new DynamicArray(8);
assert.strictEqual(
  customInstance.capacity(),
  8,
  "Should accept custom initial capacity",
);
assert.strictEqual(
  customInstance.initialCapacity(),
  8,
  "Initial capacity should match constructor argument",
);

// 指定初始容量和擴容因子
const customFactorInstance = new DynamicArray(4, 3);
assert.strictEqual(
  customFactorInstance.growthFactor(),
  3,
  "Should accept custom growth factor",
);

// 無效參數測試
assert.throws(
  () => new DynamicArray(0),
  RangeError,
  "Should throw when initial capacity is 0",
);
assert.throws(
  () => new DynamicArray(-1),
  RangeError,
  "Should throw when initial capacity is negative",
);
assert.throws(
  () => new DynamicArray(4, 0),
  RangeError,
  "Should throw when growth factor is 0",
);
assert.throws(
  () => new DynamicArray(4, 1),
  RangeError,
  "Should throw when growth factor is 1 (no growth)",
);

/* ========== 基本狀態測試 ========== */

const instance = new DynamicArray(4); // 使用小容量便於測試擴容

assert.strictEqual(instance.size(), 0, "Initial size should be 0");
assert.strictEqual(instance.capacity(), 4, "Initial capacity should be 4");
assert.strictEqual(instance.isEmpty(), true, "Should be empty on init");
// 注意：DynamicArray 沒有 isFull() 方法，因為容量是動態的

/* ========== push 測試（含自動擴容） ========== */

instance.push(10);
assert.strictEqual(instance.size(), 1, "Size should be 1 after push");
assert.strictEqual(instance.get(0), 10, "Should get pushed element");
assert.strictEqual(instance.isEmpty(), false, "Should not be empty after push");
assert.strictEqual(
  instance.capacity(),
  4,
  "Capacity should remain 4 (not full yet)",
);

instance.push(20);
instance.push(30);
instance.push(40);
assert.strictEqual(instance.size(), 4, "Size should be 4");
assert.strictEqual(instance.capacity(), 4, "Capacity should still be 4");

// 觸發自動擴容
instance.push(50);
assert.strictEqual(instance.size(), 5, "Size should be 5 after expansion");
assert.strictEqual(
  instance.capacity(),
  8,
  "Capacity should double to 8 after exceeding initial capacity",
);
assert.strictEqual(
  instance.get(4),
  50,
  "New element should be accessible after expansion",
);

// 驗證擴容前的元素仍然可存取
assert.strictEqual(
  instance.get(0),
  10,
  "Old elements should still be accessible",
);
assert.strictEqual(
  instance.get(3),
  40,
  "Old elements should still be accessible",
);

// 繼續 push 直到觸發第二次擴容
instance.push(60);
instance.push(70);
instance.push(80);
assert.strictEqual(instance.capacity(), 8, "Capacity should still be 8");

instance.push(90); // 第 9 個元素，觸發擴容
assert.strictEqual(instance.size(), 9, "Size should be 9");
assert.strictEqual(instance.capacity(), 16, "Capacity should double to 16");

/* ========== pop 測試（含自動縮容） ========== */

// 清空並重新填充以測試縮容
instance.clear();
assert.strictEqual(instance.size(), 0, "Size should be 0 after clear");
assert.strictEqual(
  instance.capacity(),
  4,
  "Capacity should reset to initial capacity after clear",
);

// 填充到容量 16（觸發兩次擴容）
for (let i = 0; i < 9; i++) {
  instance.push(i);
}
assert.strictEqual(instance.capacity(), 16, "Capacity should be 16");

// pop 到觸發縮容閾值（length <= capacity/4）
// capacity = 16, threshold = 4
// 目前 length = 9，需要 pop 到 length <= 4
const popped1 = instance.pop();
assert.strictEqual(popped1, 8, "Pop should return last element");
assert.strictEqual(instance.size(), 8, "Size should be 8 after first pop");
assert.strictEqual(instance.capacity(), 16, "Capacity should not shrink yet");

instance.pop(); // length = 7
instance.pop(); // length = 6
instance.pop(); // length = 5
assert.strictEqual(instance.capacity(), 16, "Capacity should not shrink yet");

instance.pop(); // length = 4, 觸發縮容條件（4 <= 16/4）
assert.strictEqual(instance.size(), 4, "Size should be 4");
assert.strictEqual(
  instance.capacity(),
  8,
  "Capacity should shrink to half (16/2 = 8)",
);

// 繼續 pop 到觸發第二次縮容
instance.pop(); // length = 3
instance.pop(); // length = 2, 觸發縮容條件（2 <= 8/4）
assert.strictEqual(instance.size(), 2, "Size should be 2");
assert.strictEqual(
  instance.capacity(),
  4,
  "Capacity should shrink to 4 (cannot go below initial capacity)",
);

// 繼續 pop 應該不會再縮容（已經是初始容量）
instance.pop(); // length = 1
instance.pop(); // length = 0
assert.strictEqual(instance.size(), 0, "Should be empty");
assert.strictEqual(
  instance.capacity(),
  4,
  "Capacity should not shrink below initial capacity",
);

// pop 空陣列應該拋錯
assert.throws(() => instance.pop(), "Pop on empty array should throw");

/* ========== insert 測試（含自動擴容） ========== */

instance.clear();
instance.insert(0, "a"); // length: 0 -> 1
assert.strictEqual(instance.get(0), "a", "Insert at 0");
assert.strictEqual(instance.size(), 1);
assert.strictEqual(instance.capacity(), 4);

instance.insert(1, "c"); // length: 1 -> 2
instance.insert(1, "b"); // length: 2 -> 3
assert.strictEqual(instance.get(1), "b", "Insert should shift elements");
assert.strictEqual(instance.size(), 3);

// 填滿並觸發擴容
instance.insert(3, "d"); // length: 3 -> 4
assert.strictEqual(instance.capacity(), 4, "Capacity should still be 4");

instance.insert(4, "e"); // length: 4 -> 5, 觸發擴容
assert.strictEqual(instance.size(), 5, "Size should be 5");
assert.strictEqual(instance.capacity(), 8, "Capacity should double to 8");
assert.strictEqual(
  instance.get(4),
  "e",
  "Inserted element should be accessible",
);

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

/* ========== delete 測試（含自動縮容） ========== */

// 準備測試資料：擴容到 capacity = 8
instance.clear();
for (let i = 0; i < 5; i++) {
  instance.push(i); // [0, 1, 2, 3, 4], capacity = 8
}
assert.strictEqual(instance.capacity(), 8);

const deleted = instance.delete(2); // 刪除索引 2（值為 2）
assert.strictEqual(deleted, 2, "Delete should return removed element");
assert.strictEqual(instance.size(), 4, "Size should decrease to 4");
assert.strictEqual(instance.get(2), 3, "Elements should shift after delete");
assert.strictEqual(instance.capacity(), 8, "Capacity should not shrink yet");

instance.delete(0); // length = 3
instance.delete(0); // length = 2, 觸發縮容條件（2 <= 8/4）
assert.strictEqual(instance.size(), 2, "Size should be 2");
assert.strictEqual(
  instance.capacity(),
  4,
  "Capacity should shrink to 4 (cannot go below initial capacity)",
);

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

/* ========== get / set 測試 ========== */

instance.clear();
instance.push("x");
instance.push("y");
instance.push("z");

assert.strictEqual(instance.get(1), "y", "Get should return element");

instance.set(1, "Y");
assert.strictEqual(instance.get(1), "Y", "Set should update element");

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

/* ========== findIndex / contains 測試 ========== */

assert.strictEqual(instance.findIndex("x"), 0, "Find existing element");
assert.strictEqual(instance.findIndex("Y"), 1, "Find existing element");
assert.strictEqual(instance.findIndex("z"), 2, "Find existing element");
assert.strictEqual(instance.findIndex("w"), -1, "Not found returns -1");

assert.strictEqual(instance.contains("x"), true, "Contains existing");
assert.strictEqual(instance.contains("w"), false, "Not contains");

/* ========== clear 測試 ========== */

// 先擴容到大容量
for (let i = 0; i < 20; i++) {
  instance.push(i);
}
const expandedCapacity = instance.capacity();
assert.ok(expandedCapacity > 4, "Should have expanded");

instance.clear();
assert.strictEqual(instance.size(), 0, "Size should be 0 after clear");
assert.strictEqual(
  instance.capacity(),
  4,
  "Capacity should reset to initial capacity",
);
assert.strictEqual(instance.isEmpty(), true, "Should be empty after clear");
assert.strictEqual(
  instance.findIndex("x"),
  -1,
  "Elements should be gone after clear",
);

/* ========== 迭代器測試 ========== */

instance.clear();
instance.push(1);
instance.push(2);
instance.push(3);

// 測試 for...of
const collected = [];
for (const item of instance) {
  collected.push(item);
}
assert.deepStrictEqual(
  collected,
  [1, 2, 3],
  "for...of should iterate correctly",
);

// 測試 spread operator
const spread = [...instance];
assert.deepStrictEqual(spread, [1, 2, 3], "Spread operator should work");

// 測試空陣列迭代
instance.clear();
const emptyCollected = [];
for (const item of instance) {
  emptyCollected.push(item);
}
assert.deepStrictEqual(
  emptyCollected,
  [],
  "Iterating empty array should yield nothing",
);

/* ========== toString 測試 ========== */

instance.clear();
instance.push(10);
instance.push(20);
instance.push(30);
assert.strictEqual(instance.toString(), "[10, 20, 30]", "toString format");

instance.clear();
assert.strictEqual(instance.toString(), "[]", "Empty array toString");

/* ========== 複雜場景：擴容與縮容交替 ========== */

instance.clear();

// 擴容階段
for (let i = 0; i < 10; i++) {
  instance.push(i);
}
assert.strictEqual(instance.capacity(), 16, "Should expand to 16");

// 縮容階段
while (instance.size() > 2) {
  instance.pop();
}
assert.strictEqual(instance.capacity(), 4, "Should shrink back to initial");

// 再次擴容
for (let i = 0; i < 10; i++) {
  instance.push(i);
}
assert.strictEqual(instance.capacity(), 16, "Should expand again");

/* ========== 縮容邊界測試 ========== */

// 測試縮容不會低於初始容量
const smallInstance = new DynamicArray(2);
smallInstance.push(1);
smallInstance.push(2);
smallInstance.push(3); // 觸發擴容，capacity = 4
assert.strictEqual(smallInstance.capacity(), 4);

smallInstance.pop(); // length = 2
smallInstance.pop(); // length = 1, 觸發縮容條件（1 <= 4/4）
assert.strictEqual(
  smallInstance.capacity(),
  2,
  "Should shrink to initial capacity 2",
);

smallInstance.pop(); // length = 0
assert.strictEqual(
  smallInstance.capacity(),
  2,
  "Should not shrink below initial capacity",
);

console.log("All tests passed! ✅");
