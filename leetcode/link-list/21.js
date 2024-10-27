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
