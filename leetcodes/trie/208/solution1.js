var Trie = function () {
  this.children = new Map();
};

/**
 * @param {string} word
 * @description Time: O(len(word)); Space: O(len(word))
 * @return {void}
 */
Trie.prototype.insert = function (word) {
  let current = this.children;

  for (let i = 0; i < word.length; i++) {
    if (current.has(word[i])) {
      // 如果有 prefix 就往下繼續找
      current = current.get(word[i]);
    } else {
      // 如果沒有 prefix 就新增一個，並繼續往下走
      current.set(word[i], new Map());
      current = current.get(word[i]);
    }
  }

  // 在 Map 上直接添加屬性，紀錄當前 Map 是一個 word
  // TODO: 不建議直接這樣做，可以透過其他方式記錄 is ending. (e.g. 建立一個 TrieNode class)
  current.__isEnd = true;
};

/**
 * @param {string} word
 * @description Time: O(len(word)); Space: O(1)
 * @return {boolean}
 */
Trie.prototype.search = function (word) {
  let current = this.children;
  for (let i = 0; i < word.length; i++) {
    if (current.has(word[i])) current = current.get(word[i]);
    else return false;
  }
  return !!current.__isEnd;
};

/**
 * @param {string} prefix
 * @description Time: O(len(word)); Space: O(1)
 * @return {boolean}
 */
Trie.prototype.startsWith = function (prefix) {
  let current = this.children;
  for (let i = 0; i < prefix.length; i++) {
    if (current.has(prefix[i])) current = current.get(prefix[i]);
    else return false;
  }
  return true;
};

/**
 * Your Trie object will be instantiated and called as such:
 * var obj = new Trie()
 * obj.insert(word)
 * var param_2 = obj.search(word)
 * var param_3 = obj.startsWith(prefix)
 */
