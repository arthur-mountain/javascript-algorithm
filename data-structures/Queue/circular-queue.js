class CircularQueue {
  #queue;
  #capacity;

  constructor(capacity) {
    this.#queue = Array((this.#capacity = capacity));
    console.log(this.#queue);
    console.log(this.#capacity);
  }

  enqueue(item) {
    throw new Error("Not implemented");
  }

  dequeue() {
    throw new Error("Not implemented");
  }

  isEmpty() {
    throw new Error("Not implemented");
  }
  isFull() {
    throw new Error("Not implemented");
  }
}

module.exports = { CircularQueue };
