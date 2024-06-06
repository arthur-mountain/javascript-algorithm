// Recursive approach
let swapPairs = (head) => {
  if (!head || !head.next) return head;

  let newHead = head.next;

  // Process the next pairs recursively.
  head.next = swapPairs(newHead.next);

  // Swap the next of the next node to the current node.
  newHead.next = head;

  return newHead;
};

// Iterative approach
swapPairs = (head) => {
  if (!head || !head.next) return head;

  // 1 -> 2 -> 3 -> 4
  // 2 -> 1 -> 4 -> 3

  let newHead = head.next;
  let current = head;
  let prev, next, nextPair;

  while (current && current.next) {
    next = current.next;
    nextPair = next.next;

    next.next = current;
    current.next = nextPair;

    if (prev) prev.next = next;

    prev = current;
    current = nextPair;
  }

  return newHead;
};
