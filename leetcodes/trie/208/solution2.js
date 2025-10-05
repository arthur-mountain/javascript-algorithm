var TrieNode = function () {
  this.children = new Array(26);
  this.isEnd = 0;
  this.get = (char) => this.children[char.charCodeAt(0) - "a".charCodeAt(0)];
  this.has = (char) => !!this.get(char);
  this.set = (char, next) => {
    this.children[char.charCodeAt(0) - "a".charCodeAt(0)] = next;
  };
};

var Trie = function () {
  this.root = new TrieNode();
};

/**
 * @param {string} word
 * @description Time: O(len(word)); Space: O(len(word))
 * @return {void}
 */
Trie.prototype.insert = function (word) {
  let current = this.root;
  for (let i = 0; i < word.length; i++) {
    if (current.has(word[i])) {
      // 如果有 prefix 就往下繼續找
      current = current.get(word[i]);
    } else {
      // 如果沒有 prefix 就新增一個，並繼續往下走
      current.set(word[i], new TrieNode());
      current = current.get(word[i]);
    }
  }
  // 在 TireNode 上更新 isEnd，紀錄當前 Map 是一個 word
  current.isEnd = 1;
};

/**
 * @param {string} word
 * @description Time: O(len(word)); Space: O(1)
 * @return {boolean}
 */
Trie.prototype.search = function (word) {
  let current = this.root;
  for (let i = 0; i < word.length; i++) {
    if (current.has(word[i])) current = current.get(word[i]);
    else return false;
  }
  return current.isEnd === 1;
};

/**
 * @param {string} prefix
 * @description Time: O(len(word)); Space: O(1)
 * @return {boolean}
 */
Trie.prototype.startsWith = function (prefix) {
  let current = this.root;
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
