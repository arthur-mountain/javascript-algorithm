/**
 * Stack（堆疊）- 使用 Dynamic Array 實作
 * 核心思想：強制 LIFO (後進先出) 訪問順序，只允許從頂端進行插入與移除操作
 *
 * 底層使用 Dynamic Array，支援自動擴容與縮容
 *
 * 時間複雜度：Push/Pop 攤銷 O(1)
 * 空間複雜度：O(n)，其中 n 為元素數量
 */
class Stack {
  constructor() {
    this.data = []; // 底層陣列
    this.top = -1; // 堆疊頂端索引，-1 表示空堆疊
  }

  /**
   * Push - 在堆疊頂端加入新元素
   * @param {*} value - 要插入的值
   *
   * 優化技巧：Dynamic Array 自動擴容
   * JavaScript 的 Array 已內建動態擴容機制，
   * 我們只需要管理 top 指標即可
   *
   * 時間複雜度：O(1) 攤銷
   * 空間複雜度：O(1) 攤銷
   */
  push(value) {
    // JavaScript Array 會自動處理擴容
    this.top++;
    this.data[this.top] = value;
  }

  /**
   * Pop - 移除並回傳堆疊頂端的元素
   * @return {*} 堆疊頂端的值
   *
   * 關鍵：清空引用幫助 GC
   *
   * 時間複雜度：O(1)
   * 空間複雜度：O(1)
   */
  pop() {
    // 邊界檢查：空堆疊無法 Pop
    if (this.isEmpty()) {
      throw new Error("Stack underflow: cannot pop from empty stack");
    }

    const value = this.data[this.top];
    this.data[this.top] = null; // 清空引用，幫助 GC 回收記憶體
    this.top--;

    return value;
  }

  /**
   * Peek - 查看但不移除堆疊頂端的元素
   * @return {*} 堆疊頂端的值
   *
   * 關鍵：不改變堆疊狀態
   *
   * 時間複雜度：O(1)
   * 空間複雜度：O(1)
   */
  peek() {
    if (this.isEmpty()) {
      throw new Error("Stack is empty: cannot peek");
    }
    return this.data[this.top];
  }

  /**
   * isEmpty - 檢查堆疊是否為空
   * @return {boolean} 是否為空
   *
   * 時間複雜度：O(1)
   * 空間複雜度：O(1)
   */
  isEmpty() {
    return this.top === -1;
  }

  /**
   * size - 回傳堆疊中的元素數量
   * @return {number} 元素數量
   *
   * 時間複雜度：O(1)
   * 空間複雜度：O(1)
   */
  size() {
    return this.top + 1;
  }

  /**
   * clear - 清空堆疊
   *
   * 時間複雜度：O(1)（JavaScript 的 GC 會處理舊陣列）
   * 空間複雜度：O(1)
   */
  clear() {
    this.data = [];
    this.top = -1;
  }
}

module.exports = { Stack };
