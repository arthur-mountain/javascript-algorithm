//@ts-check
// First In First Out
class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class Queue {
  #first;
  #last;
  #size;

  constructor() {
    this.#first = null;
    this.#last = null;
    this.#size = 0;
  }

  enqueue(value) {
    const node = new ListNode(value);

    if (!this.#first) {
      this.#first = node;
      this.#last = node;
      this.#size++;
      return this;
    }

    this.#last.next = node;
    this.#last = node;
    this.#size++;
    return this;
  }

  dequeue() {
    if (!this.#first) return null;

    let current = this.#first;
    this.#first = current.next;
    this.#size--;
    return current;
  }

  size() {
    return this.#size;
  }

  clear() {
    this.#first = null;
    this.#size = 0;
    return true;
  }

  printAll() {
    const tmp = []
    let current = this.#first;
    while (current) {
      tmp.push(current)
      current = current.next;
    }

    console.log("🚀 ~ file: LinkList-queue.js ~ line 58 ~ Queue ~ print ~ tmp\n", tmp)
  }
}

export default Queue;