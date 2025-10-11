var TrieNode = function () {
  this.children = new Map();
  this.isEndOfWord = false;
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
  current.isEndOfWord = true;
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
  return node.isEndOfWord;
  // Time : O(26^m × w)，m 是 '.' 的數量(題目保證 ≤ 2)
  // Space: O(w)
};

/**
 * 輔助函數2：同 _seacrh 的另一種實作方式，從指定節點開始搜尋
 * @param {TrieNode} node - 當前 Trie 節點
 * @param {string} word - 要搜尋的單詞
 * @param {number} index - 當前檢查到 word 的第幾個字母
 * @return {boolean}
 */
WordDictionary.prototype._searchFromNodeDFS = function (node, word, index) {
  // 終止條件：已經檢查完所有字母
  if (index === word.length) {
    return node.isEndOfWord; // 檢查是否為完整單詞
  }

  const char = word[index];

  // 情況 1：遇到萬用字元 '.'
  if (char === ".") {
    // 嘗試所有可能的子節點
    for (const childNode of node.children.values()) {
      // 遞迴檢查下一個字母，只要有一個成功就返回 true
      if (this._searchFromNodeDFS(childNode, word, index + 1)) {
        return true;
      }
    }
    // 所有子節點都不匹配
    return false;
  }

  // 情況 2：遇到一般字母
  // 如果當前節點沒有這個字母的子節點，代表不存在
  if (!node.children.has(char)) {
    return false;
  }

  // 繼續往下搜尋
  return this._searchFromNodeDFS(node.children.get(char), word, index + 1);
};

/**
 * 輔助函數2-1：迭代版本的 _searchFromNodeDFS
 * @param {TrieNode} node - 當前 Trie 節點
 * @param {string} word - 要搜尋的單詞
 * @param {number} index - 當前檢查到 word 的第幾個字母
 * @return {boolean}
 */
WordDictionary.prototype._searchFromNodeIter = function (node, word, index) {
  // 使用堆疊模擬遞迴
  // 每個元素是 [節點, 當前檢查的索引]
  const stack = [[node, index]];

  while (stack.length > 0) {
    const [node, index] = stack.pop();

    // 檢查完所有字母
    if (index === word.length) {
      if (node.isEndOfWord) {
        return true;
      }
      continue; // 繼續嘗試其他路徑
    }

    const char = word[index];

    // 遇到萬用字元
    if (char === ".") {
      // 將所有子節點加入堆疊
      for (let childNode of node.children.values()) {
        stack.push([childNode, index + 1]);
      }
    }
    // 一般字母
    else {
      if (node.children.has(char)) {
        stack.push([node.children.get(char), index + 1]);
      }
    }
  }

  return false; // 所有路徑都檢查完，沒找到
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
