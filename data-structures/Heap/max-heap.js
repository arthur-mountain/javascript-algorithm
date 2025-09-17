const Heap = require("./heap");

/**
 * MaxHeap 實作 - 基本上同 MinHeap，只需要改變 heapifyUp 和 heapifyDown 的比較邏輯
 */
class MaxHeap extends Heap {
  heapifyUp(index = this.heap.length - 1) {
    if (index === 0) return;

    const parentIndex = this.getParentIndex(index);

    // 注意：這裡改為大於比較
    if (this.heap[index] > this.heap[parentIndex]) {
      this.swap(index, parentIndex);
      this.heapifyUp(parentIndex);
    }
  }

  heapifyDown(index = 0) {
    const leftChildIndex = this.getLeftChildIndex(index);
    const rightChildIndex = this.getRightChildIndex(index);
    let largestIndex = index;

    // 找出最大值
    if (
      leftChildIndex < this.heap.length &&
      this.heap[leftChildIndex] > this.heap[largestIndex]
    ) {
      largestIndex = leftChildIndex;
    }

    if (
      rightChildIndex < this.heap.length &&
      this.heap[rightChildIndex] > this.heap[largestIndex]
    ) {
      largestIndex = rightChildIndex;
    }

    if (largestIndex !== index) {
      this.swap(index, largestIndex);
      this.heapifyDown(largestIndex);
    }
  }

  extractMax() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    // 1. 保存要返回的最大值（根節點）
    const max = this.heap[0];

    // 2. 將最後一個元素移到根節點
    this.heap[0] = this.heap.pop();

    // 3. 向下調整維護heap性質
    this.heapifyDown();

    console.log(`提取最大值 ${max} 後: [${this.heap.join(", ")}]`);
    return max;
  }
}

module.exports = MaxHeap;
