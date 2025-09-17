const Heap = require("./heap");
/**
 * MinHeap 實作 - 父節點永遠小於子節點
 */
class MinHeap extends Heap {
  /**
   * 向上調整（用於插入後維護heap性質）
   * 時間複雜度：O(log n)
   */
  heapifyUp(index = this.heap.length - 1) {
    // 如果是根節點，停止
    if (index === 0) return;

    const parentIndex = this.getParentIndex(index);

    // 如果當前節點小於父節點，需要交換並繼續向上
    if (this.heap[index] < this.heap[parentIndex]) {
      this.swap(index, parentIndex);
      this.heapifyUp(parentIndex);
    }
  }

  /**
   * 向下調整（用於刪除後維護heap性質）
   * 時間複雜度：O(log n)
   */
  heapifyDown(index = 0) {
    const leftChildIndex = this.getLeftChildIndex(index);
    const rightChildIndex = this.getRightChildIndex(index);
    let smallestIndex = index;

    // 找出當前節點和其子節點中最小的
    if (
      leftChildIndex < this.heap.length &&
      this.heap[leftChildIndex] < this.heap[smallestIndex]
    ) {
      smallestIndex = leftChildIndex;
    }

    if (
      rightChildIndex < this.heap.length &&
      this.heap[rightChildIndex] < this.heap[smallestIndex]
    ) {
      smallestIndex = rightChildIndex;
    }

    // 如果最小值不是當前節點，交換並繼續向下調整
    if (smallestIndex !== index) {
      this.swap(index, smallestIndex);
      this.heapifyDown(smallestIndex);
    }
  }

  /**
   * 移除並返回最小元素 - O(log n)
   */
  extractMin() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    // 1. 保存要返回的最小值（根節點）
    const min = this.heap[0];

    // 2. 將最後一個元素移到根節點
    this.heap[0] = this.heap.pop();

    // 3. 向下調整維護heap性質
    this.heapifyDown();

    console.log(`提取最小值 ${min} 後: [${this.heap.join(", ")}]`);
    return min;
  }
}

module.exports = MinHeap;
