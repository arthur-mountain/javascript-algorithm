/**
 * @param {character[][]} board
 * @param {string[]} words
 * @return {string[]}
 */
var findWords = function (board, words) {
  const m = board.length;
  const n = board[0].length;

  // 初始化變數 - O(m * n)
  const nodes = Array.from({ length: m }, () => new Array(n).fill(null)); // 存放已經建立過得 TrieNode
  const roots = new Map(); // 存放所有作為開頭的 TrieNode

  // 建立 TrieNodes - O(m * n)
  const checkIsInBound = (i, j) => i >= 0 && i < m && j >= 0 && j < n;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const startNode = (nodes[i][j] ||= new TrieNode(board[i][j]));
      if (startNode.top === null && checkIsInBound(i - 1, j)) {
        startNode.top = nodes[i - 0][j] ||= new TrieNode(board[i - 1][j]);
      }
      if (startNode.right === null && checkIsInBound(i, j + 1)) {
        startNode.right = nodes[i][j + 1] ||= new TrieNode(board[i][j + 1]);
      }
      if (startNode.bottom === null && checkIsInBound(i + 1, j)) {
        startNode.bottom = nodes[i + 1][j] ||= new TrieNode(board[i + 1][j]);
      }
      if (startNode.left === null && checkIsInBound(i, j - 1)) {
        startNode.left = nodes[i][j - 1] ||= new TrieNode(board[i][j - 1]);
      }
      if (roots.has(startNode.char)) {
        roots.get(startNode.char).push(startNode);
      } else {
        roots.set(startNode.char, [startNode]);
      }
    }
  }

  // 遍歷 words 查找 - O(w * m * n)
  const answers = [];
  for (let i = 0; i < words.length; i++) {
    const current = roots.get(words[i][0]) ? [[roots.get(words[i][0]), 1]] : [];
    while (current.length > 0) {
      const [neighbors, nextIndex] = current.pop();
      if (nextIndex < words[i].length) {
        const nextNeighbors = [];
        for (let j = 0; j < neighbors.length; j++) {
          if (
            neighbors[j].top &&
            neighbors[j].top.char === words[i][nextIndex]
          ) {
            nextNeighbors.push(neighbors[j].top);
          }
          if (
            neighbors[j].right &&
            neighbors[j].right.char === words[i][nextIndex]
          ) {
            nextNeighbors.push(neighbors[j].right);
          }
          if (
            neighbors[j].bottom &&
            neighbors[j].bottom.char === words[i][nextIndex]
          ) {
            nextNeighbors.push(neighbors[j].bottom);
          }
          if (
            neighbors[j].left &&
            neighbors[j].left.char === words[i][nextIndex]
          ) {
            nextNeighbors.push(neighbors[j].left);
          }
          if (nextNeighbors.length > 0) {
            current.push([nextNeighbors, nextIndex + 1]);
          }
        }
      } else {
        answers.push(words[i]);
      }
    }
  }
  return answers;
  // Time : O(w * m * n)
  // Space: O(m * n)
};

class TrieNode {
  constructor(char, neighbor = {}) {
    this.char = char;
    this.top = neighbor.top || null;
    this.right = neighbor.right || null;
    this.bottom = neighbor.bottom || null;
    this.left = neighbor.left || null;
  }
}
