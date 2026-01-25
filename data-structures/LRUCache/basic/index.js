/**
 * LRU Cache - 標準實作
 *
 * 核心思想：Hash Map（O(1) 查找）+ Doubly Linked List（O(1) 順序調整）
 *
 * 時間複雜度：get/put 均為 O(1)
 * 空間複雜度：O(capacity)
 */

/**
 * 雙向鏈結串列節點
 * 為什麼要存 key？當從 tail 淘汰時，需要知道 key 才能從 map 中刪除
 */
class Node {
  constructor(key = 0, value = 0) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  /**
   * 初始化 LRU Cache
   * @param {number} capacity - 快取最大容量
   */
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map(); // key → Node

    // 哨兵節點：簡化邊界處理
    // 為什麼用哨兵？避免處理「第一個節點」或「最後一個節點」的特殊情況
    this.head = new Node(); // dummy head（最新）
    this.tail = new Node(); // dummy tail（最舊）
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  /**
   * 取得 key 對應的 value
   * @param {number} key
   * @return {number} 存在則返回 value，否則返回 -1
   *
   * 關鍵：存取即「使用」，必須更新節點位置
   */
  get(key) {
    if (!this.map.has(key)) {
      return -1;
    }

    const node = this.map.get(key);
    // 關鍵步驟：標記為「最近使用」
    this._moveToHead(node);
    return node.value;
  }

  /**
   * 插入或更新鍵值對
   * @param {number} key
   * @param {number} value
   *
   * 邏輯分支：
   * 1. key 已存在 → 更新 value + 移到頭部
   * 2. key 不存在 → 創建節點 + 加到頭部 + 可能觸發淘汰
   */
  put(key, value) {
    if (this.map.has(key)) {
      // Case 1: 更新現有節點
      const node = this.map.get(key);
      node.value = value;
      this._moveToHead(node);
    } else {
      // Case 2: 創建新節點
      const newNode = new Node(key, value);
      this.map.set(key, newNode);
      this._addToHead(newNode);

      // 檢查容量，必要時淘汰
      if (this.map.size > this.capacity) {
        // 淘汰最久未使用的節點（tail 側）
        const removed = this._removeTail();
        // 關鍵：同步從 map 中刪除，否則會有孤兒指標
        this.map.delete(removed.key);
      }
    }
  }

  /**
   * 將節點加到頭部（dummy_head 之後）
   * 為什麼是頭部？我們定義頭部 = 最新使用
   */
  _addToHead(node) {
    // 順序很重要：先設置新節點的指標
    node.prev = this.head;
    node.next = this.head.next;
    // 再修改周圍節點的指標
    this.head.next.prev = node;
    this.head.next = node;
  }

  /**
   * 從鏈結串列中移除節點
   * 為什麼是 O(1)？因為有 prev 指標，不需遍歷尋找前驅
   */
  _removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  /**
   * 將節點移到頭部
   * 語意：標記為「最近使用」
   */
  _moveToHead(node) {
    this._removeNode(node);
    this._addToHead(node);
  }

  /**
   * 移除並返回尾部節點（dummy_tail 之前）
   * 語意：淘汰「最久未使用」的節點
   * 為什麼要返回？需要知道 key 才能從 map 中刪除
   */
  _removeTail() {
    const node = this.tail.prev;
    this._removeNode(node);
    return node;
  }
}
