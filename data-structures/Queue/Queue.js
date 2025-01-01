//@ts-check
// First In First Out
class Queue {
  #queue;
  #length;

  constructor() {
    this.#queue = [];
    this.#length = 0;
  }

  enqueue(item) {
    this.#queue.push(item);
    this.#length++;
    return this;
  }

  dequeue() {
    if (this.#length === 0) {
      return null;
    }

    this.#length--;
    return this.#queue.shift();
  }

  size() {
    return this.#length;
  }

  clear() {
    this.#queue.length = this.#length = 0;
  }

  printAll() {
    const print = (startIdx = 0) => {
      if (!this.#queue[startIdx]) return;
      console.log("🚀 ~ printAll ~ at: ", startIdx);
      console.log("🚀 ~ printAll ~ item: ", this.#queue[startIdx], '\n');
      return print(startIdx + 1);
    }

    return print();
  }
}

export default Queue;