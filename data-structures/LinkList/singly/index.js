/**
 * Singly Linked List - 標準實作
 *
 * 核心思想：
 * 用「指標連接」換取「位置自由」的線性資料結構
 * 優勢：O(1) 頭部插入刪除
 * 劣勢：O(n) 隨機存取
 *
 * 時間複雜度：見各方法說明
 * 空間複雜度：O(n) 整體，每個節點額外 1 個指標
 */
class ListNode {
  /**
   * @param {any} value - 節點存儲的值
   */
  constructor(value) {
    this.value = value ?? null;
    this.next = null;
  }
}

class SinglyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  /**
   * 在頭部插入新節點
   * @param {any} value - 要插入的值
   * @return {SinglyLinkedList} - 返回自身以支持鏈式調用
   *
   * 時間複雜度：O(1)
   * 空間複雜度：O(1)
   */
  prepend(value) {
    const node = new ListNode(value);

    if (!this.head) {
      // 空串列：head 和 tail 都指向新節點
      this.head = this.tail = node;
    } else {
      // 非空：新節點指向原 head，更新 head
      node.next = this.head;
      this.head = node;
    }

    this.length++;
    return this;
  }

  /**
   * 在尾部插入新節點
   * @param {any} value - 要插入的值
   * @return {SinglyLinkedList} - 返回自身以支持鏈式調用
   *
   * 優化技巧：維護 tail 指標
   * 將原本需要 O(n) 遍歷找尾巴的操作優化為 O(1)
   *
   * 時間複雜度：O(1)
   * 空間複雜度：O(1)
   */
  append(value) {
    const node = new ListNode(value);

    if (!this.head) {
      this.head = this.tail = node;
    } else {
      // 關鍵：直接通過 tail 存取尾部，無需遍歷
      this.tail.next = node;
      this.tail = node;
    }

    this.length++;
    return this;
  }

  /**
   * 取得指定位置的節點
   * @param {number} index - 目標位置（0-indexed）
   * @return {ListNode|null} - 目標節點或 null
   *
   * 注意：這是 Linked List 的核心劣勢操作
   * 必須從頭遍歷，無法像 Array 一樣直接計算地址
   *
   * 時間複雜度：O(n)
   * 空間複雜度：O(1)
   */
  get(index) {
    // 邊界檢查：避免無效 index
    if (index < 0 || index >= this.length) return null;

    // 優化：直接返回已知的 head 和 tail
    if (index === 0) return this.head;
    if (index === this.length - 1) return this.tail;

    // 必須從頭遍歷到目標位置
    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current.next;
    }
    return current;
  }

  /**
   * 在指定位置插入節點
   * @param {number} index - 插入位置
   * @param {any} value - 要插入的值
   * @return {SinglyLinkedList|null} - 返回自身或 null（無效 index）
   *
   * 關鍵洞察：
   * 插入本身是 O(1)，但「找到插入位置」需要 O(n)
   * 需要找到 index - 1 位置的節點（前驅節點）
   *
   * 時間複雜度：O(n)
   * 空間複雜度：O(1)
   */
  insertAt(index, value) {
    if (index < 0 || index > this.length) return null;

    // 特殊位置：使用優化過的方法
    if (index === 0) return this.prepend(value);
    if (index === this.length) return this.append(value);

    const node = new ListNode(value);
    const prev = this.get(index - 1); // O(n) 定位

    // O(1) 執行插入
    node.next = prev.next;
    prev.next = node;

    this.length++;
    return this;
  }

  /**
   * 移除指定位置的節點
   * @param {number} index - 要移除的位置
   * @return {ListNode|null} - 被移除的節點或 null
   *
   * 關鍵：需要找到「前驅節點」才能修改其 next 指標
   * head 沒有前驅，需要特殊處理
   *
   * 時間複雜度：O(n)
   * 空間複雜度：O(1)
   */
  removeAt(index) {
    if (index < 0 || index >= this.length) return null;

    let removed;

    if (index === 0) {
      // 移除頭部：特殊處理（無前驅節點）
      removed = this.head;
      this.head = this.head.next;

      // 關鍵：如果移除後變成空串列，tail 也要更新
      if (this.length === 1) this.tail = null;
    } else {
      const prev = this.get(index - 1);
      removed = prev.next;
      prev.next = removed.next;

      // 關鍵：如果移除的是 tail，更新 tail
      if (index === this.length - 1) {
        this.tail = prev;
      }
    }

    this.length--;
    return removed;
  }

  /**
   * 原地反轉串列
   * @return {SinglyLinkedList} - 返回自身
   *
   * 核心思想：
   * 使用三指標（prev, current, next）逐一反轉每個節點的 next 指標
   *
   * 記憶口訣：「保存下一個 → 反轉當前 → 整體前進」
   *
   * 時間複雜度：O(n)
   * 空間複雜度：O(1)
   */
  reverse() {
    // 邊界處理：空串列或單節點無需反轉
    if (!this.head || !this.head.next) return this;

    let prev = null;
    let current = this.head;

    // 反轉後原 head 變成 tail
    this.tail = this.head;

    while (current) {
      const next = current.next; // Step 1: 保存下一個（避免丟失）
      current.next = prev; // Step 2: 反轉當前節點的指標
      prev = current; // Step 3: prev 前進
      current = next; // Step 4: current 前進
    }

    // 反轉後 prev 指向最後一個節點，即新的 head
    this.head = prev;
    return this;
  }
}
