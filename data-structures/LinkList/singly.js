//@ts-check
class ListNode {
  constructor(value) {
    this.value = value ?? value;
    this.next = null;
  }
}

class LinkList {
  static behind = 'behind';
  static front = 'front';
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

  append(valueOrNode) {
    const node = this.#createNode(valueOrNode);
    this.#length++;

    if (!this.#head) {
      this.#head = node;
      this.#tail = this.#head;
      return this;
    }

    this.#tail.next = node;
    this.#tail = node;
    return this;
  }

  getNode(index) {
    if (index < 0 || index > this.#length) return null;
    if (index === 0) return this.#head;
    if (index === this.#length) return this.#tail;

    // recursive get
    // const getNodeRecursive = (startIdx = 1, current = this.#head.next) => {
    //   return startIdx === index ? current : getNodeRecursive(startIdx + 1, current.next);
    // }

    // return getNodeRecursive();

    // while get
    let current = this.#head;
    let startIdx = 0;
    while (startIdx++) {
      current = current.next;
      if (startIdx === index) return current;
    }
  }

  insertTo(valueOrNode, index) {
    if (index < 0 || index > this.#length) return null;

    const node = this.#createNode(valueOrNode);
    if (index === 0) {
      node.next = this.#head.next;
      this.#head.next = node;
      this.#length++;
      return this;
    }

    if (index === this.#length) {
      return this.append(node);
    }

    const currentNode = this.getNode(index);
    node.next = currentNode.next;
    currentNode.next = node;
    this.#length++;
    return this;
  }

  update(value, index) {
    const currentNode = this.getNode(index);
    if (!currentNode) return currentNode;
    currentNode.value = value;
  }

  removeAt(index) {
    if (index < 0 || index > this.#length) return null;

    if (index === 0) {
      this.#head = this.#head.next;
      this.#length--;
      return this;
    }

    if (index === this.#length) {
      this.#tail = this.getNode(this.#length - 1);
      this.#tail.next = null;
      this.#length--;
      return this;
    }

    const nextNode = this.getNode(index + 1);
    const prevNode = this.getNode(index - 1);
    prevNode.next = nextNode;
    this.#length--;
  }

  reverse() {
    // only one node
    if (!this.#head || !this.#head.next) return this.#head;

    // recursive reverse 1
    // const reverseRecursive = (current = this.#head, prev = null) => {
    //   // 反轉到最後，最後一個必定為 null, 並把前一個node當作新的 head
    //   if (!current) return (this.#head = prev);
    //   reverseRecursive((() => {
    //     const next = current.next;
    //     current.next = prev;
    //     return next;
    //   })(), current);
    // }
    // reverseRecursive();

    // recursive reverse 2
    // 這個會直衝到最後一個元素，call frame 會疊到底 O(n)
    // const getNewHeadRecursive = (head = this.#head) => {
    //   if (!head.next) return head;
    //   const newHead = getNewHeadRecursive(head.next);
    //   // 直衝到最後一個，因此 head 會從最後一個的前一個開始，
    //   // 將 head 後面一個的next往前轉到當前 head, 並將當前 head 的下一個清空
    //   head.next.next = head;
    //   head.next = null;
    //   return newHead;
    // }
    // this.#head = getNewHeadRecursive();

    // while reverse
    let prev = null;
    let current = this.#head;
    let next = null;

    while (current) {
      next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }

    this.#head = this.#tail;
  }
  size() {
    return this.#length;
  }
  clear() {
    this.#head = this.#tail = null;
    this.#length = 0;
  }

  printAll() {
    // recursive print
    // const print = (head = this.#head) => {
    //   if (!head) return;
    //   console.log('current node: ', head, '\n');
    //   return print(head.next);
    // }
    // print();

    // while print
    let current = this.#head;
    while (current) {
      console.log('current node: ', current, '\n');
      current = current.next;
    }
  }
}
// const ILinkListSingly = new LinkList();

export default LinkList;