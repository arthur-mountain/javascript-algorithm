var CharNode = function (val = null) {
  this.children = new Map();
  this.value = val;
};

var MapSum = function () {
  this.root = new CharNode();
  // 建立 trie，只在 isEndOfWord 的 CharNode 紀錄 value(甚至不用兩個節點紀錄，只要有 value 就代表 isEndOfWord)
  // 在 sum 的時候，先找到 prefix 的路徑，一路走到 leaf node 進行 sum
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

  let current = this.root;
  for (let i = 0; i < key.length; i++) {
    if (!current.children.get(key[i])) {
      current.children.set(key[i], new CharNode());
    }
    current = current.children.get(key[i]);
  }
  current.value = val;
  // Time : O(len(key))
  // Space: O(len(key))
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

  // 先找到 prefix 節點
  let current = this.root;
  for (let i = 0; i < prefix.length; i++) {
    // O(p)，p = prefix.length
    if (!current.children.get(prefix[i])) {
      return 0; // 如果沒有 prefix 回傳 0
    }
    current = current.children.get(prefix[i]);
  }

  // 找到 prefix，從 prefix 節點往下累加所有有 value 的 CharNode
  let sum = 0;
  const sumRecur = (current) => {
    // O(n)，n = 以 prefix 為根的子樹節點總數
    if (current.children.size > 0) {
      for (const value of current.children.values()) {
        sumRecur(value);
      }
    }
    if (current.value == null) return; // 如果值為 null 代表節點被刪除，就跳過累加
    sum += current.value;
  };
  sumRecur(current);
  return sum;
  // Time Complexity: O(p + n)
  //   - p: length of prefix
  //   - n: number of nodes in the subtree rooted at prefix
  // Space Complexity: O(h)
  //   - h: height of the subtree (recursion call stack)
};

/**
 * 刪除 key(Lazy Deletion)
 * @param {string} key
 * @return {boolean} 是否成功刪除（key 是否存在）
 */
MapSum.prototype.deleteLazy = function (key) {
  let current = this.root;

  // 步驟 1：找到 key 的結尾節點
  for (let i = 0; i < key.length; i++) {
    if (!current.children.get(key[i])) {
      return false;
    }
    current = current.children.get(key[i]);
  }

  // 步驟 2：檢查該節點是否真的是一個 key 的結尾
  if (current.value === null) {
    return false; // 該路徑存在，但不是一個有效的 key
  }

  // 步驟 3：標記為刪除(設為 null)
  current.value = null;

  return true;
};

/**
 * Your MapSum object will be instantiated and called as such:
 * var obj = new MapSum()
 * obj.insert(key,val)
 * var param_2 = obj.sum(prefix)
 */
