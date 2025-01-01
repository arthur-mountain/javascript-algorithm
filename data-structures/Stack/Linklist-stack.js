//@ts-check
// First In Last Out
class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class Stack {
  #first;
  #last;
  #size

  constructor() {
    this.#first = null;
    this.#last = null;
    this.#size = 0;
  }

  push(value) {
    const node = new ListNode(value);

    if (!this.#first) {
      this.#first = node;
      this.#last = node;

      this.#size++;
      return this;
    }

    const preFirst = this.#first;
    this.#first = node;
    this.#first.next = preFirst;
    this.#size++;
    return this;
  }

  pop() {
    if (!this.#first) return null;

    const tmpFirst = this.#first;
    if (this.#first === this.#last) {
      this.#first = null;
      this.#size--;
      return tmpFirst;
    }

    this.#first = this.#first.next;
    this.#size--;
    return tmpFirst;
  }

  peek() {
    return this.#first;
  }

  clear() {
    this.#first = null;
    this.#size = 0;
    return true;
  }

  size() {
    return this.#size;
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

export default Stack;