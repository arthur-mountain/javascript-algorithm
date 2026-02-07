/**
 * Linked List Node - 單向鏈結串列節點
 */
class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

/**
 * Linked List Queue - 標準實作
 *
 * 核心思想：使用單向鏈結串列，head 指向隊首（dequeue 端），tail 指向隊尾（enqueue 端）。
 * 所有操作都是 O(1)，不需要處理容量或 wrap-around。
 *
 * 時間複雜度：所有操作 O(1)
 * 空間複雜度：O(n)，每個元素額外需要一個 pointer
 */
class LinkedListQueue {
  constructor() {
    this.head = null; // 指向隊首（dequeue 從這取）
    this.tail = null; // 指向隊尾（enqueue 接在這後面）
    this.size = 0;
  }

  /**
   * 將元素加入佇列尾端
   * @param {*} value - 要加入的元素
   *
   * 邏輯：建立新節點，接在 tail 後面，更新 tail 指標。
   * 特殊情況：空佇列時，head 和 tail 都指向新節點。
   *
   * 時間複雜度：O(1)
   * 空間複雜度：O(1)（新節點的空間）
   */
  enqueue(value) {
    const newNode = new ListNode(value);

    if (this.tail === null) {
      // 空佇列：head 和 tail 都指向新節點
      // 關鍵：這是唯一需要更新 head 的情況
      this.head = newNode;
      this.tail = newNode;
    } else {
      // 非空佇列：接在 tail 後面，更新 tail
      this.tail.next = newNode;
      this.tail = newNode;
    }

    this.size++;
  }

  /**
   * 移除並返回佇列前端元素
   * @return {*} - 被移除的元素，空時回傳 null
   *
   * 邏輯：保存 head 的值，將 head 移到下一個節點。
   * 特殊情況：移除最後一個元素時，tail 也要設為 null。
   *
   * 時間複雜度：O(1)
   * 空間複雜度：O(1)
   */
  dequeue() {
    if (this.head === null) {
      return null;
    }

    // 步驟 1：保存要返回的值
    const value = this.head.value;

    // 步驟 2：移動 head 指標
    this.head = this.head.next;

    // 步驟 3：關鍵 — 如果佇列變空，tail 也要更新
    // 否則 tail 會指向已經被移除的節點
    if (this.head === null) {
      this.tail = null;
    }

    this.size--;
    return value;
  }

  /**
   * 查看佇列前端元素但不移除
   * @return {*} - 佇列前端元素，空時回傳 null
   *
   * 時間複雜度：O(1)
   * 空間複雜度：O(1)
   */
  peek() {
    return this.head === null ? null : this.head.value;
  }

  /**
   * 檢查佇列是否為空
   * @return {boolean}
   *
   * 時間複雜度：O(1)
   * 空間複雜度：O(1)
   */
  isEmpty() {
    return this.head === null;
  }

  /**
   * 取得佇列當前元素數量
   * @return {number}
   *
   * 時間複雜度：O(1)
   * 空間複雜度：O(1)
   */
  getSize() {
    return this.size;
  }
}

module.exports = { ListNode, LinkedListQueue };
