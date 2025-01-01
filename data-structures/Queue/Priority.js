//@ts-check
class PriorityNode {
  constructor(value, priority) {
    this.value = value;
    this.priority = priority;
  }
}

class PriorityQueue {
  #queue;
  #length;

  constructor() {
    this.#queue = [];
    this.#length = 0;
  }

  #insertRecursive(newNode, currentIdx = 0) {
    if (!this.#queue[currentIdx]) return false;
    if (newNode.priority < this.#queue[currentIdx].priority) {
      this.#queue.splice(currentIdx, 0, newNode);
      this.#length++;
      return true;
    };
    return this.#insertRecursive(newNode, currentIdx + 1);
  }

  enqueue({ value, priority = Infinity }) {
    if (priority < 0) {
      console.warn("was not priority provide");
      return this;
    };

    const queue = this.#queue;
    const newNode = new PriorityNode(value, priority);
    if (!this.#length) {
      queue.push(newNode);
      this.#length++;
      return this;
    }

    const wasInserted = this.#insertRecursive(newNode);
    if (wasInserted) return this;

    queue.push(newNode);
    this.#length++;
    return this;
  }

  dequeue() {
    if (!this.#length) return null;

    this.#length--;
    return this.#queue.shift();
  }

  size() {
    return this.#length;
  }

  clear() {
    this.#queue.length = this.#length = 0;
    return true;
  }

  printAll() {
    const print = (startIdx = 0) => {
      if (!this.#queue[startIdx]) return;
      console.log("🚀 ~ printAll at: ", startIdx);
      console.log("🚀 ~ printAll item: ", this.#queue[startIdx], '\n');
      return print(startIdx + 1);
    };
    return print();
  }
};

export default PriorityQueue;