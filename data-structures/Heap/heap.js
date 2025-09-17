/**
 * Heap 實作 - 基礎實作
 */
class Heap {
  constructor() {
    this.heap = [];
  }

  // 輔助方法：取得父節點索引
  getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }

  // 輔助方法：取得左子節點索引
  getLeftChildIndex(index) {
    return 2 * index + 1;
  }

  // 輔助方法：取得右子節點索引
  getRightChildIndex(index) {
    return 2 * index + 2;
  }

  // 輔助方法：交換兩個元素
  swap(index1, index2) {
    [this.heap[index1], this.heap[index2]] = [
      this.heap[index2],
      this.heap[index1],
    ];
  }

  /**
   * 向上調整（用於插入後維護heap性質）
   * 時間複雜度：O(log n)
   */
  heapifyUp(index = this.heap.length - 1) {
    throw new Error("Not implemented");
  }

  /**
   * 向下調整（用於刪除後維護heap性質）
   * 時間複雜度：O(log n)
   */
  heapifyDown(index = 0) {
    throw new Error("Not implemented");
  }

  /**
   * 插入元素 - O(log n)
   */
  insert(value) {
    // 檢查是否為抽象類別直接調用
    if (this.constructor === Heap) {
      throw new Error(
        "Cannot use abstract class Heap directly. Please use MinHeap or MaxHeap.",
      );
    }

    // 1. 在陣列末尾添加新元素
    this.heap.push(value);

    // 2. 向上調整維護heap性質
    this.heapifyUp();

    console.log(`插入 ${value} 後: [${this.heap.join(", ")}]`);
  }

  /**
   * 查看頂部元素但不移除 - O(1)
   */
  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  /**
   * 取得heap大小 - O(1)
   */
  size() {
    return this.heap.length;
  }

  /**
   * 檢查是否為空 - O(1)
   */
  isEmpty() {
    return this.heap.length === 0;
  }

  /**
   * 視覺化heap結構（除錯用）
   */
  visualize() {
    if (this.isEmpty()) {
      console.log("Heap is empty");
      return;
    }

    console.log("Heap visualization:");
    console.log(this.heap);

    // 顯示樹狀結構（簡化版）
    let level = 0;
    let levelStart = 0;
    while (levelStart < this.heap.length) {
      const levelEnd = Math.min(
        levelStart + Math.pow(2, level),
        this.heap.length,
      );
      const levelElements = this.heap.slice(levelStart, levelEnd);
      console.log(`Level ${level}: [${levelElements.join(", ")}]`);

      levelStart = levelEnd;
      level++;
    }
  }
}

module.exports = Heap;
