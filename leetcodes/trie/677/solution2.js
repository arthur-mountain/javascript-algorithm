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
 * Your MapSum object will be instantiated and called as such:
 * var obj = new MapSum()
 * obj.insert(key,val)
 * var param_2 = obj.sum(prefix)
 */
