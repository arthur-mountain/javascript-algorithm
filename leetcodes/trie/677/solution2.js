var CharNode = function (val = null) {
  this.children = new Map();
  this.sum = 0; // 以該節點為根的子樹中，所有 value 的總和
};

var MapSum = function () {
  // 建立 trie，只在 isEndOfWord 的 CharNode 紀錄 value(甚至不用兩個節點紀錄，只要有 value 就代表 isEndOfWord)
  this.root = new CharNode();
  this.map = new Map(); // 額外用 Map 記錄每個 key 的當前值（用於處理更新）
};

/**
 * @param {string} key
 * @param {number} val
 * @return {void}
 */
MapSum.prototype.insert = function (key, val) {
  // 雖然題目保證不會出現，但還是以防 key 為空得情境
  if (!key || key.length === 0) {
    return;
  }

  // 計算 delta（增量）
  // 如果是更新：delta = 新值 - 舊值
  // 如果是新增：delta = 新值 - 0
  const oldVal = this.map.get(key) || 0;
  const delta = val - oldVal;

  // 更新 map
  this.map.set(key, val);

  // 遍歷 key 的路徑，更新路徑上所有節點的 sum
  let current = this.root;
  current.sum += delta; // 根節點也要更新

  for (let i = 0; i < key.length; i++) {
    // 如果節點不存在，建立新節點
    if (!current.children.get(key[i])) {
      current.children.set(key[i], new CharNode());
    }

    current = current.children.get(key[i]);
    current.sum += delta; // 更新該節點的總和
  }
};

/**
 * @param {string} prefix
 * @return {number}
 */
MapSum.prototype.sum = function (prefix) {
  // 雖然題目保證不會出現，但還是以防 prefix 為空得情境
  if (!prefix || prefix.length === 0) {
    return 0; // 或回傳所有 key 的總和，取決於題目定義
  }

  // 先找到 prefix
  let current = this.root;
  for (let i = 0; i < prefix.length; i++) {
    if (!current.children.get(prefix[i])) {
      return 0; // 如果沒有 prefix 回傳 0
    }
    current = current.children.get(prefix[i]);
  }

  // 直接返回該節點的 sum（已經預先計算好了）
  return current.sum;
};

/**
 * 刪除 key(Lazy Deletion)
 * @param {string} key
 * @return {boolean} 是否成功刪除（key 是否存在）
 */
MapSum.prototype.deleteLazy = function (key) {
  // 步驟 1：檢查 key 是否存在
  if (!this.map.has(key)) {
    return false; // key 不存在
  }

  // 步驟 2：計算 delta（刪除 = 減去舊值）
  const oldVal = this.map.get(key);
  const delta = -oldVal; // delta 即原本 key 的值，取負值進行累加，即代表刪除

  // 步驟 3：從 map 中移除
  this.map.delete(key);

  // 步驟 4：更新路徑上所有節點的 sum
  let current = this.root;
  current.sum += delta; // root 也要更新

  for (let i = 0; i < key.length; i++) {
    const char = key[i];
    // 這裡假設路徑一定存在（因為我們前面已經確認 key 存在）
    current = current.children.get(char);
    current.sum += delta;
  }

  return true;
};

/**
 * 刪除 key，帶記憶體回收(Eager Deletion)
 * @param {string} key
 * @return {boolean}
 */
MapSum.prototype.deleteImmediate = function (key) {
  // 步驟 1：檢查 key 是否存在
  if (!this.map.has(key)) {
    return false; // key 不存在
  }

  // 步驟 2：使用 delta 更新所有路徑節點
  const oldVal = this.map.get(key);
  const delta = -oldVal;

  this.map.delete(key);

  let current = this.root;
  current.sum += delta;

  for (let i = 0; i < key.length; i++) {
    const char = key[i];
    current = current.children.get(char);
    current.sum += delta;
  }

  // 步驟 3：遞迴刪除不需要的節點
  const deleteRecur = (node, key, depth) => {
    // Base Case
    if (depth === key.length) {
      // 判斷當前節點是否可以刪除
      return node.sum === 0 && node.children.size === 0;
    }

    // 取出當前的遞迴遍歷得 char 和 CharNode
    const char = key[depth];
    const childNode = node.children.get(char);

    // 如果路徑不存在則不存在刪除，返回 false
    if (!childNode) {
      return false;
    }

    // DFS 遞迴處理子節點，確保子節點處理完畢後
    // 才知道子節點有無 children(是否可以刪除子節點)
    // 並且回傳當前節點是否可以被刪除
    const shouldDeleteChild = deleteRecur(childNode, key, depth + 1);

    if (shouldDeleteChild) {
      node.children.delete(char);

      // 當前節點可刪除的條件：
      // 1. sum === 0（沒有任何 key 經過）
      // 2. 沒有子節點
      return node.sum === 0 && node.children.size === 0;
    }

    // 如果子節點沒被刪除，代表當前節點也不應該被刪除
    // 因為當前節點有子節點，因此不屬於要被刪除的範疇
    return false;
  };

  // 因為前面已經檢查過 key 存在，因此遞迴後直接回傳 true 即可
  deleteRecur(this.root, key, 0);
  return true;
};

/**
 * Your MapSum object will be instantiated and called as such:
 * var obj = new MapSum()
 * obj.insert(key,val)
 * var param_2 = obj.sum(prefix)
 */
