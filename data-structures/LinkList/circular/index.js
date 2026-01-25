/**
 * Circular Linked List - 標準實作
 * 核心思想：透過 tail 指標實現 O(1) 頭尾存取，尾部的 next 指回頭部形成環
 *
 * 時間複雜度：
 *   - 頭尾插入/存取：O(1)
 *   - 搜尋/刪除：O(n)
 * 空間複雜度：O(n)
 */
class Node {
  /**
   * @param {*} value - 節點儲存的值
   */
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class CircularLinkedList {
  constructor() {
    // 為什麼存 tail 而不是 head？
    // 因為 tail.next 就是 head，存 tail 可以 O(1) 存取兩端
    this.tail = null;
    this.length = 0;
  }

  /**
   * 取得頭部節點
   * @return {Node|null}
   */
  get head() {
    return this.tail ? this.tail.next : null;
  }

  /**
   * 尾部插入
   * @param {*} value - 要插入的值
   * @return {CircularLinkedList} - 支援鏈式呼叫
   *
   * 時間複雜度：O(1)
   * 空間複雜度：O(1)
   */
  append(value) {
    const newNode = new Node(value);

    if (!this.tail) {
      // 空 List：新節點指向自己，形成單元素的環
      newNode.next = newNode;
    } else {
      // 非空：新節點接在 tail 後面，指向 head
      newNode.next = this.tail.next;
      this.tail.next = newNode;
    }

    // 關鍵：更新 tail 指向新節點
    this.tail = newNode;
    this.length++;

    return this;
  }

  /**
   * 頭部插入
   * @param {*} value - 要插入的值
   * @return {CircularLinkedList}
   *
   * 時間複雜度：O(1)
   * 空間複雜度：O(1)
   */
  prepend(value) {
    const newNode = new Node(value);

    if (!this.tail) {
      newNode.next = newNode;
      this.tail = newNode;
    } else {
      // 與 append 的差異：tail 不變
      newNode.next = this.tail.next;
      this.tail.next = newNode;
    }

    this.length++;
    return this;
  }

  /**
   * 遍歷所有節點
   * @return {Array} - 所有節點值的陣列
   *
   * 關鍵：使用計數法避免無限迴圈
   *
   * 時間複雜度：O(n)
   * 空間複雜度：O(n) - 收集結果
   */
  traverse() {
    if (!this.tail) return [];

    const result = [];
    let current = this.head;

    // 用計數法確保只遍歷一圈
    for (let i = 0; i < this.length; i++) {
      result.push(current.value);
      current = current.next;
    }

    return result;
  }

  /**
   * 刪除指定值的節點
   * @param {*} value - 要刪除的值
   * @return {boolean} - 是否成功刪除
   *
   * 需要處理四種情況：
   * 1. 只有一個節點
   * 2. 刪除頭部
   * 3. 刪除尾部
   * 4. 刪除中間
   *
   * 時間複雜度：O(n) - 需要找到目標及其前驅
   * 空間複雜度：O(1)
   */
  delete(value) {
    if (!this.tail) return false;

    let current = this.head;
    let prev = this.tail; // 頭部的前驅是尾部

    for (let i = 0; i < this.length; i++) {
      if (current.value === value) {
        if (this.length === 1) {
          // Case 1: 唯一節點，直接清空
          this.tail = null;
        } else if (current === this.head) {
          // Case 2: 刪除頭部，tail.next 指向新頭
          this.tail.next = current.next;
        } else if (current === this.tail) {
          // Case 3: 刪除尾部，更新 tail
          prev.next = this.head;
          this.tail = prev;
        } else {
          // Case 4: 刪除中間
          prev.next = current.next;
        }

        this.length--;
        return true;
      }

      prev = current;
      current = current.next;
    }

    return false;
  }

  /**
   * 搜尋值是否存在
   * @param {*} value - 要搜尋的值
   * @return {boolean}
   *
   * 時間複雜度：O(n)
   * 空間複雜度：O(1)
   */
  contains(value) {
    if (!this.tail) return false;

    let current = this.head;

    for (let i = 0; i < this.length; i++) {
      if (current.value === value) return true;
      current = current.next;
    }

    return false;
  }
}
