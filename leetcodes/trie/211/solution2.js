/**
 * Trie 節點（使用陣列）
 */
var TrieNode = function () {
  // 固定 26 個子節點（對應 a-z）
  this.children = new Array(26).fill(null);
  this.isEndOfWord = false;
};

var WordDictionary = function () {
  this.root = new TrieNode();
};

/**
 * 將字母轉換為陣列索引（'a' → 0, 'b' → 1, ...）
 */
function charToIndex(char) {
  return char.charCodeAt(0) - "a".charCodeAt(0);
}

/**
 * 新增單詞
 */
WordDictionary.prototype.addWord = function (word) {
  let current = this.root;

  for (let char of word) {
    const index = charToIndex(char);

    // 如果子節點不存在，創建新節點
    if (current.children[index] === null) {
      current.children[index] = new TrieNode();
    }

    current = current.children[index];
  }

  current.isEndOfWord = true;
};

/**
 * 搜尋輔助函數
 */
WordDictionary.prototype._searchFromNode = function (node, word, index) {
  if (index === word.length) {
    return node.isEndOfWord;
  }

  const char = word[index];

  // 遇到萬用字元
  if (char === ".") {
    // 遍歷所有 26 個可能的子節點(即 children.length)
    for (let i = 0; i < node.children.length; i++) {
      if (node.children[i] !== null) {
        if (this._searchFromNode(node.children[i], word, index + 1)) {
          return true;
        }
      }
    }
    return false;
  }

  // 一般字母
  const index_ = charToIndex(char);
  if (node.children[index_] === null) {
    return false;
  }

  return this._searchFromNode(node.children[index_], word, index + 1);
};

/**
 * 搜尋
 */
WordDictionary.prototype.search = function (word) {
  return this._searchFromNode(this.root, word, 0);
};
