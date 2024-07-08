/*
 * - [] Done
 * - [] Refer to what others are doing
 */
/**
 * @param {number} n
 * @param {number} k
 * @return {number}
 */
let findTheWinner = (n, k) => {
  const circular = new CircularLinkedList(n);

  let count = 0;
  let current = circular.head;
  while (circular.size !== 1) {
    while (count < k) {
      current = current.next;
      count++;
    }
    circular.delete(current);
    count = 0;
  }

  circular.inspect();
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
    let tail = head;
    let num = 2;
    while (num <= size) {
      const newNode = new Node(num);
      tail.next = newNode;
      tail = newNode;
      num++;
    }

    this.head = head;
    tail.next = this.head;
    this.size = size;
  }

  delete(current) {
    current.next = current.next.next;
    this.size--;
  }

  inspect() {
    console.log(require("node:util").inspect(this, { depth: null }));
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

// findTheWinner(6, 5);
