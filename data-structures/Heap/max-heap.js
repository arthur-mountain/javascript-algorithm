class MaxHeap {
  constructor() {
    this.heap = [];
  }

  insert(val) {
    this.heap.push(val);
    this.bubbleUp();
  }

  extractMax() {
    if (this.heap.length === 1) return this.heap.pop();
    const max = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.bubbleDown();
    return max;
  }

  bubbleUp() {
    let idx = this.heap.length - 1;
    while (idx > 0) {
      let parentIdx = Math.floor((idx - 1) / 2);
      if (this.heap[idx] <= this.heap[parentIdx]) break;
      [this.heap[idx], this.heap[parentIdx]] = [
        this.heap[parentIdx],
        this.heap[idx],
      ];
      idx = parentIdx;
    }
  }

  bubbleDown() {
    let idx = 0;
    while (true) {
      let leftIdx = 2 * idx + 1;
      let rightIdx = 2 * idx + 2;
      let largest = idx;

      if (
        leftIdx < this.heap.length &&
        this.heap[leftIdx] > this.heap[largest]
      ) {
        largest = leftIdx;
      }
      if (
        rightIdx < this.heap.length &&
        this.heap[rightIdx] > this.heap[largest]
      ) {
        largest = rightIdx;
      }
      if (largest === idx) break;

      [this.heap[idx], this.heap[largest]] = [
        this.heap[largest],
        this.heap[idx],
      ];
      idx = largest;
    }
  }
}
