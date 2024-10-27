/*
 * - [x] Done
 * - [x] Follow up solutions
 */
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
let mergeTwoLists = (list1, list2) => {
  let dummy = new ListNode(0);
  let tail = dummy;

  while (list1 && list2) {
    if (list1.val > list2.val) {
      tail.next = list2;
      list2 = list2.next;
      tail = tail.next;
    } else if (list1.val < list2.val) {
      tail.next = list1;
      list1 = list1.next;
      tail = tail.next;
    } else {
      tail.next = list1;
      list1 = list1.next;
      tail.next.next = list2;
      list2 = list2.next;
      tail = tail.next.next;
    }
  }

  while (list1) {
    tail.next = list1;
    tail = list1;
    list1 = list1.next;
  }

  while (list2) {
    tail.next = list2;
    tail = list2;
    list2 = list2.next;
  }

  return dummy.next;
};

/**
 * follow up:
 * at the end, we just connect the rest of the list to the tail.
 * we not need to use while loop to connect the rest of the list to the tail like first solution.
 */
mergeTwoLists = (list1, list2) => {
  let dummy = new ListNode(0);
  let tail = dummy;

  while (list1 && list2) {
    if (list1.val > list2.val) {
      tail.next = list2;
      list2 = list2.next;
      tail = tail.next;
    } else if (list1.val < list2.val) {
      tail.next = list1;
      list1 = list1.next;
      tail = tail.next;
    } else {
      tail.next = list1;
      list1 = list1.next;
      tail.next.next = list2;
      list2 = list2.next;
      tail = tail.next.next;
    }
  }

  if (list1) {
    tail.next = list1;
  } else if (list2) {
    tail.next = list2;
  }

  return dummy.next;
};

/**
 * follow up:
 * simplify the code by removing the else if condition when both of list exists. cause
 * if the val is equal, we just one of node in the both list to dummy.next,
 * we no needs to check else if condition, like previous solutions.
 */
mergeTwoLists = (list1, list2) => {
  let dummy = new ListNode(0);
  let tail = dummy;

  while (list1 && list2) {
    if (list1.val > list2.val) {
      tail.next = list2;
      list2 = list2.next;
    } else {
      tail.next = list1;
      list1 = list1.next;
    }
    tail = tail.next;
  }

  if (list1) {
    tail.next = list1;
  } else if (list2) {
    tail.next = list2;
  }

  return dummy.next;
};

/*
 * follow to -> recursive solution.
 *
 * not familiar with recursive solution, need to practice more.
 **/
mergeTwoLists = (l1, l2) => {
  if (!l1) {
    return l2;
  } else if (!l2) {
    return l1;
  } else if (l1.val < l2.val) {
    l1.next = mergeTwoLists(l1.next, l2);
    return l1;
  } else {
    l2.next = mergeTwoLists(l1, l2.next);
    return l2;
  }
};

/*
 * follow to:
 * access pointer directly without extra dummy node
 **/
mergeTwoLists = (l1, l2) => {
  if (!l1) return l2;
  if (!l2) return l1;

  let head;

  if (l1.val < l2.val) {
    head = l1;
    l1 = l1.next;
  } else {
    head = l2;
    l2 = l2.next;
  }

  curr = head;

  while (l1 && l2) {
    if (l1.val < l2.val) {
      curr.next = l1;
      l1 = l1.next;
    } else {
      curr.next = l2;
      l2 = l2.next;
    }
    curr = curr.next;
  }

  curr.next = l1 || l2;

  return head;
};
