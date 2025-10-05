class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEnd = 0;
  }
}
class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  /**
   * @param {string} word
   * @description Time: O(len(word)); Space: O(len(word))
   * @return {void}
   */
  insert() {
    let current = this.root;
    for (let i = 0; i < word.length; i++) {
      if (current.children.has(word[i])) {
        // 如果有 prefix 就往下繼續找
        current = current.children.get(word[i]);
      } else {
        // 如果沒有 prefix 就新增一個，並繼續往下走
        current.children.set(word[i], new TrieNode());
        current = current.children.get(word[i]);
      }
    }
    // 在 TrieNode 上更新 isEnd，紀錄當前 TrieNode 是一個 word
    current.isEnd = 1;
  }

  /**
   * @param {string} word
   * @description Time: O(len(word)); Space: O(1)
   * @return {boolean}
   */
  search(word) {
    let current = this.root;
    for (let i = 0; i < word.length; i++) {
      if (current.children.has(word[i]))
        current = current.children.get(word[i]);
      else return false;
    }
    return current.isEnd === 1;
  }

  /**
   * @param {string} prefix
   * @description Time: O(len(word)); Space: O(1)
   * @return {boolean}
   */
  startsWith(prefix) {
    let current = this.root;
    for (let i = 0; i < prefix.length; i++) {
      if (current.children.has(prefix[i]))
        current = current.children.get(prefix[i]);
      else return false;
    }
    return true;
  }
}

/**
 * Your Trie object will be instantiated and called as such:
 * var obj = new Trie()
 * obj.insert(word)
 * var param_2 = obj.search(word)
 * var param_3 = obj.startsWith(prefix)
 */
