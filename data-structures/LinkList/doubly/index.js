/**
 * Doubly Linked List - 標準實作
 *
 * 核心思想：用額外的 prev 指標換取「雙向導航能力」
 * - 任何節點都能 O(1) 取得前後節點
 * - 已知節點引用時，可 O(1) 刪除
 *
 * 時間複雜度：見上方複雜度總結表
 * 空間複雜度：O(n)，每節點額外一個 prev 指標
 */
class ListNode {
  constructor(value) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  /**
   * 尾部插入
   * 時間：O(1) | 空間：O(1)
   */
  append(value) {
    const node = new ListNode(value);

    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      // 關鍵：雙向連接
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;
    }

    this.length++;
    return this;
  }

  /**
   * 頭部插入
   * 時間：O(1) | 空間：O(1)
   */
  prepend(value) {
    const node = new ListNode(value);

    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      node.next = this.head;
      this.head.prev = node; // Doubly 特有
      this.head = node;
    }

    this.length++;
    return this;
  }

  /**
   * 取得指定索引的節點
   * @param {number} index - 目標索引(0-based)
   * @return {ListNode|null} - 目標節點或 null
   *
   * 優化技巧：雙向搜尋(Bidirectional Search)
   * 核心思想：利用 Doubly 的雙向特性，從較近的端點開始搜尋
   *
   * 時間複雜度：O(n/2) = O(n)，但常數因子減半
   * 空間複雜度：O(1)
   */
  getNode(index) {
    // 邊界檢查：使用 length 不變量
    if (index < 0 || index >= this.length) return null;

    // 快速路徑：直接返回頭尾
    if (index === 0) return this.head;
    if (index === this.length - 1) return this.tail;

    // 優化：從較近的端點開始
    if (index < this.length / 2) {
      let current = this.head;
      for (let i = 0; i < index; i++) {
        current = current.next;
      }
      return current;
    } else {
      // 從 tail 往前找，這是 Doubly 才能做到的優化
      let current = this.tail;
      for (let i = this.length - 1; i > index; i--) {
        current = current.prev;
      }
      return current;
    }
  }

  /**
   * 直接刪除已知節點(不需要 index)
   * @param {ListNode} node - 要刪除的節點
   * @return {*} - 被刪除節點的值
   *
   * 前提：node 必須是此串列的成員
   *
   * 時間複雜度：O(1) ← 這是 Doubly 最強大的地方
   * 空間複雜度：O(1)
   */
  removeNode(node) {
    if (!node) return undefined;

    if (node.prev) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }

    this.length--;
    return node.value;
  }

  /**
   * 刪除指定索引的節點
   * @param {number} index - 要刪除的索引
   * @return {*} - 被刪除節點的值，或 undefined
   *
   * 時間複雜度：O(n/2) 找節點 + O(1) 刪除 = O(n)
   * 空間複雜度：O(1)
   *
   * 注意：若已持有節點引用，可直接 O(1) 刪除(見 removeNode 方法)
   */
  removeAt(index) {
    const node = this.getNode(index);
    return this.removeNode(node);
  }

  /**
   * 尾部彈出（Doubly 優勢：O(1)）
   * 時間：O(1) | 空間：O(1)
   */
  pop() {
    return this.removeNode(this.tail);
  }

  /**
   * 頭部彈出
   * 時間：O(1) | 空間：O(1)
   */
  shift() {
    return this.removeNode(this.head);
  }
}
