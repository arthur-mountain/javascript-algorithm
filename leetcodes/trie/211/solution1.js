var TrieNode = function () {
  this.children = new Map();
  this.isEndOfWord = 0;
};

var WordDictionary = function () {
  this.root = new TrieNode();
  // Space: O(N × W)，N 是加入的單詞數量，W 是平均單詞長度
};

/**
 * @param {string} word
 * @return {void}
 */
WordDictionary.prototype.addWord = function (word) {
  let current = this.root;
  for (let i = 0; i < word.length; i++) {
    if (!current.children.has(word[i])) {
      current.children.set(word[i], new TrieNode());
    }
    current = current.children.get(word[i]);
  }
  current.isEndOfWord = 1;
  // Time : O(w)
  // Space: O(w)
};

/**
 * 輔助 search
 * 遇到「.」時，往下遍歷 children 時，要以此當前的 trieNode 作為 root 檢查，並且 i+1 跳過當前的 '.'
 * @param {TrieNode} root
 * @param {string} word
 * @param {number} start
 * @return {boolean}
 */
WordDictionary.prototype._search = function (node, word, start = 0) {
  for (let i = start; i < word.length; i++) {
    if (word[i] === ".") {
      return node.children
        .values()
        .some((trieNode) => this._search(trieNode, word, i + 1));
    } else if (!node.children.has(word[i])) {
      return false;
    }
    node = node.children.get(word[i]);
  }
  return node.isEndOfWord === 1;
  // Time : O(26^m × w)，m 是 '.' 的數量(題目保證 ≤ 2)
  // Space: O(w)
};

/**
 * @param {string} word
 * @return {boolean}
 */
WordDictionary.prototype.search = function (word) {
  return this._search(this.root, word, 0);
};

/**
 * Your WordDictionary object will be instantiated and called as such:
 * var obj = new WordDictionary()
 * obj.addWord(word)
 * var param_2 = obj.search(word)
 */
