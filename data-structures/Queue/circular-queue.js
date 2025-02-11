class CircularQueue {
  #queue;
  #capacity;
  #front;
  #rear;

  constructor(capacity) {
    this.#queue = Array((this.#capacity = capacity));
    this.#front = this.#rear = -1;
  }

  enqueue(item) {
    if (this.isFull()) {
      return false;
    }
    if (this.isEmpty()) {
      this.#front = this.#rear = 0;
    } else {
      this.#rear = (this.#rear + 1) % this.#capacity; // circular increment
    }
    this.#queue[this.#rear] = item;
    return true;
  }

  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    const item = this.#queue[this.#front];
    this.#front = (this.#front + 1) % this.#capacity; // circular increment
    return item;
  }

  isEmpty() {
    return this.#front === -1;
  }

  isFull() {
    return this.#front === (this.#rear + 1) % this.#capacity;
  }
}

module.exports = { CircularQueue };
