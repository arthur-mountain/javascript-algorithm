/*
 * - [x] Done
 *   - circular single linked list, that start at 1th so the count start at 1
 *   - when count to k, remove current, make prev.next to  current.next
 *   - until the size of the linked list is 1
 * - [] Follow up solutions
 */
/**
 * @param {number} n
 * @param {number} k
 * @return {number}
 */
let findTheWinner = (n, k) => {
  const circular = new CircularLinkedList(n);

  // circular.inspect();

  let count = 1;
  let prev = circular.tail;
  let current = circular.head;
  while (circular.size !== 1) {
    while (count !== k) {
      prev = current;
      current = current.next;
      if (++count === k) break;
    }

    // console.log(current.value);
    circular.delete(prev, current);
    current = current.next;
    count = 1;
  }

  circular.inspect(current.next.value);

  return current.next.value;
};

class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class CircularLinkedList {
  constructor(size) {
    let head = new Node(1);
    let num = 2;
    let current = head;
    while (num <= size) {
      const newNode = new Node(num);
      current.next = newNode;
      current = newNode;
      num++;
    }

    this.head = head;
    this.tail = current;
    this.tail.next = head;
    this.size = size;
  }

  delete(prev, current) {
    prev.next = current.next;
    this.size--;
  }

  inspect(node) {
    console.log(
      require("node:util").inspect(node || this, { depth: null, colors: true }),
    );
  }

  print() {
    let current = this.head;
    do {
      console.log(current.value);
      current = current.next;
    } while (current !== this.head);
  }
}

findTheWinner(5, 2);

findTheWinner(6, 5);

findTheWinner(3, 1);
// 1 -> 2 -> 3
