/**
 * Trie（字典樹 / 前綴樹）- 標準實作
 *
 * 核心思想：將一組字串組織為前綴共享的樹狀結構，
 * 每條邊代表一個字元，每個節點代表一個前綴位置，
 * isEnd 標記將前綴升格為完整字串。
 * 所有操作的本質都是「從 root 沿字元邊遍歷」。
 *
 * 時間複雜度：insert/search/startsWith 均為 O(L)，L = 字串長度
 * 空間複雜度：O(N × L_avg)，N = 字串數量，L_avg = 平均長度
 */
class TrieNode {
  constructor() {
    /**
     * children: 字元 → 子節點的映射
     * - 使用 Map 實作，適用於字元集不確定或稀疏的場景
     * - 若字元集固定且小（如 26 個英文字母），可改用 Array(26)
     */
    this.children = new Map();

    /**
     * isEnd: 標記此節點是否為某個完整字串的結尾
     * 用於區分「前綴存在」和「完整字串存在」
     * 例如：插入 "app" 後，"ap" 路徑存在但 isEnd=false
     */
    this.isEnd = false;
  }
}

class Trie {
  constructor() {
    // root 代表空字串 ""，所有操作的起點
    this.root = new TrieNode();
  }

  /**
   * insert - 將字串插入 Trie
   *
   * @param {string} word - 要插入的字串
   * @return {void}
   *
   * 時間複雜度：O(L)，L = word.length，每個字元恰好訪問一次
   * 空間複雜度：O(L)，最壞情況建立 L 個新節點（無前綴共享時）
   */
  insert(word) {
    let current = this.root;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      // 如果該字元的路徑不存在，建立新節點
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
      }
      // 沿路徑往下移動
      current = current.children.get(char);
    }
    // 標記結尾：此節點代表一個完整字串的結束
    current.isEnd = true;
  }

  /**
   * search - 檢查字串是否完整存在於 Trie 中
   *
   * @param {string} word - 要搜尋的字串
   * @return {boolean} - true 表示此字串曾被 insert
   *
   * 關鍵：與 startsWith 的唯一差異在最後的 isEnd 檢查
   *
   * 時間複雜度：O(L)
   * 空間複雜度：O(1)
   */
  search(word) {
    const node = this._traverse(word);
    // 注意：必須檢查 isEnd，否則前綴也會被錯誤回傳為 true
    return node !== null && node.isEnd === true;
  }

  /**
   * startsWith - 檢查是否有任何字串以此前綴開頭
   *
   * @param {string} prefix - 要檢查的前綴
   * @return {boolean}
   *
   * 時間複雜度：O(L)
   * 空間複雜度：O(1)
   */
  startsWith(prefix) {
    // 不需要檢查 isEnd：只要路徑存在，就代表至少有一個字串以此為前綴
    return this._traverse(prefix) !== null;
  }

  /**
   * delete - 從 Trie 中移除字串（真刪除，遞迴回溯清理無用節點）
   *
   * @param {string} word - 要刪除的字串
   * @return {boolean} - true 表示成功刪除
   *
   * 優化技巧：遞迴回溯
   * 從葉節點向上判斷每個節點是否仍被需要（有其他子節點或自身是 isEnd），
   * 只刪除不再被任何字串使用的節點，避免破壞共享前綴。
   *
   * 時間複雜度：O(L)
   * 空間複雜度：O(L)，遞迴堆疊深度
   */
  delete(word) {
    return this._deleteRecur(this.root, word, 0);
  }

  /**
   * collectWordsWithPrefix - 列舉所有以指定前綴開頭的完整字串
   *
   * @param {string} prefix - 目標前綴
   * @return {string[]} - 所有匹配的完整字串
   *
   * 時間複雜度：O(P + K × L_avg)，P=前綴長度，K=匹配數量
   * 空間複雜度：O(L_max)，遞迴深度 + 路徑陣列（不計輸出）
   */
  collectWordsWithPrefix(prefix) {
    const node = this._traverse(prefix);
    if (!node) return [];

    const results = [];
    const path = [...prefix];
    this._dfsCollect(node, path, results);
    return results;
  }

  // --- 內部方法 ---

  /**
   * _traverse - 共用遍歷邏輯（search 和 startsWith 的公共部分）
   * 沿字元路徑從 root 走到目標位置
   *
   * @param {string} word - 要遍歷的字串
   * @return {TrieNode|null} - 到達的節點，或 null（路徑不存在）
   */
  _traverse(word) {
    let current = this.root;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (!current.children.has(char)) return null;
      current = current.children.get(char);
    }
    return current;
  }

  /**
   * _deleteRecur - 遞迴刪除的內部實作
   *
   * @return {boolean} - true 表示呼叫者可以安全刪除此子節點
   */
  _deleteRecur(node, word, depth) {
    // Base case: 到達字串結尾
    if (depth === word.length) {
      if (!node.isEnd) return false; // 字串不存在於 Trie 中
      node.isEnd = false;
      // 如果此節點已無子節點，通知上層可以刪除
      return node.children.size === 0;
    }

    const char = word[depth];
    const child = node.children.get(char);
    // Edge case: 路徑中斷，字串不存在
    if (!child) return false;

    // Recursive case: 先深入到底
    const shouldDeleteChild = this._deleteRecur(child, word, depth + 1);

    if (shouldDeleteChild) {
      node.children.delete(char);
      // 向上傳遞：如果自己也非結尾且無其他子節點，可被刪除
      return !node.isEnd && node.children.size === 0;
    }

    return false;
  }

  /**
   * _dfsCollect - DFS 蒐集子樹中所有完整字串
   */
  _dfsCollect(node, path, results) {
    if (node.isEnd) results.push(path.join(""));

    for (const [char, child] of node.children) {
      path.push(char);
      this._dfsCollect(child, path, results);
      path.pop(); // 回溯
    }
  }
}
