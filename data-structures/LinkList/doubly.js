//@ts-check
class ListNode {
  constructor(value) {
    this.value = value ?? value;
    this.next = null;
    this.prev = null;
  }
}

class LinkList {
  #head;
  #tail;
  #length;

  constructor() {
    this.#head = null;
    this.#tail = null;
    this.#length = 0;
  }

  #createNode(value) {
    return value instanceof ListNode ? value : new ListNode(value);
  }
  #searchFromHead(index) {
    let target = this.#head;
    let idx = 0;
    while (idx < index) {
      target = target.next;
      idx++;
    }
    return target;
  }
  #searchFromTail(index) {
    let target = this.#tail;
    let idx = 0;
    while (idx < index) {
      target = target.prev;
      idx++;
    }
    return target;
  }

  getNode(index) {
    if (index < 0 || index > this.#length) {
      return console.error("\n out of range \n");
    }
    if (index === 0) return this.#head;
    if (index === this.#length) return this.#tail;
    const isCloseFromHead = this.#length / 2 <= index;
    return isCloseFromHead ? this.#searchFromHead(index) : this.#searchFromTail(index);
  }
  append(valueOrNode) {
    const node = this.#createNode(valueOrNode);

    if (!this.#head) {
      this.#head = node;
      this.#tail = this.#head;
      this.#length++;
      return this;
    }

    this.#tail.next = node;
    node.prev = this.#tail;
    this.#tail = node;
    this.#length++;
    return this;
  }
  prepend(valueOrNode) {
    const node = this.#createNode(valueOrNode);

    if (!this.#head) {
      this.#head = node;
      this.#tail = this.#head;
      this.#length++;
      return this;
    }

    this.#head.prev = node;
    node.next = this.#head;
    this.#head = node;
    this.#length++;
    return this;
  }
  insertTo(valueOrNode, index) {
    if (index === this.#length) return this.append(valueOrNode);
    const target = this.getNode(index);
    if (!target) return;
    const node = this.#createNode(valueOrNode);
    node.next = target.next;
    node.prev = target;
    target.next = target.next.prev = node;
    this.#length++;
  }
  remove(index) {
    if (index === 0) {
      this.#head = this.#head.next;
      this.#head.prev = null;
      return;
    }
    if (index === this.#length) {
      this.#tail = this.#tail.prev;
      this.#tail.next = null;
      return;
    }
    const target = this.getNode(index);
    if (!target) return;
    target.prev.next = target.next;
    target.next.prev = target.prev;
    this.#length--;
  }
  update(value, index) {
    const target = this.getNode(index);
    if (!target) return;
    target.value = value;
  };
  size() {
    return this.#length;
  }
  clear() {
    this.#head = this.#tail = null;
    this.#length = 0;
  }
  printAll() {
    let current = this.#head;
    while (current) {
      console.log('current node: ', current, '\n');
      current = current.next;
    }
  }
}

// const ILinkListDouble = new LinkList();

export default LinkList;