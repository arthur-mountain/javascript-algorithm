/**
 * @param {string[]} dictionary
 * @param {string} sentence
 * @return {string}
 */
var replaceWords = function (dictionary, sentence) {
  const trie = new Trie(dictionary); // O(d * w)
  sentence = sentence.split(" "); // O(n)
  // O(n * w) -> n is the length of word in sentence, w is the length of word in sentence
  for (let i = 0; i < sentence.length; i++) {
    sentence[i] = trie.derivativeWord(sentence[i]);
  }
  return sentence.join(" "); // O(n)
  // Time : O(d*w + n*w) -> 建立 Trie + 查詢 sentence word
  // Space: O(d*w) -> 建立 Trie
};

class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEOF = 0;
  }
}

class Trie {
  constructor(dictionary) {
    this.root = new TrieNode();
    // Time : O(d * w) -> d is the length of dictionary, w is the length of word
    // Space: O(d * w) -> d is the length of dictionary, w is the length of word
    for (let i = 0; i < dictionary.length; i++) this.insert(dictionary[i]);
  }

  // Time : O(w) -> w is the length of word
  // Space: O(w) -> w is the length of word
  insert(word) {
    let current = this.root;
    for (let i = 0; i < word.length; i++) {
      if (!current.children.has(word[i])) {
        current.children.set(word[i], new TrieNode());
      }
      current = current.children.get(word[i]);
    }
    current.isEOF = 1;
  }

  // Time : O(w) -> w is the length of word
  // Space: O(1)
  derivativeWord(word) {
    let current = this.root;
    let i = 0;
    for (; i < word.length; ) {
      if (!current.children.has(word[i])) {
        break;
      }
      current = current.children.get(word[i++]);
      // 一旦找到第一個 isEOF = 1 的 TrieNode 就是 derivative word(the shortest length).
      if (current.isEOF === 1) break;
    }
    // i === 0 代表開頭就沒找到、isEOF === 0 代表找到最後也沒找到，則回傳原字串
    // 否則回傳 derivative word(即從 index 0 到 index i 的字串)
    return i === 0 || current.isEOF === 0 ? word : word.substring(0, i);
  }
}
