/*
 * - [x] Done
 * - [] Follow up solutions
 */
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {number[]} nums
 * @param {ListNode} head
 * @return {ListNode}
 */
let modifiedList = (nums, head) => {
  nums = new Set(nums);

  let prev = null;
  let current = head;
  while (current) {
    if (nums.has(current.val)) {
      if (prev) {
        prev.next = current.next;
        current = current.next;
      } else {
        current = current.next;
        head = current;
      }
    } else {
      prev = current;
      current = current.next;
    }
  }
  return head;
};

/** same approach with first implementation */
modifiedList = (nums, head) => {
  nums = new Set(nums);

  let prev = null;
  let current = head;
  while (current) {
    if (nums.has(current.val)) {
      if (current === head) {
        current = head = current.next;
      } else {
        prev.next = current.next;
        current = current.next;
      }
    } else {
      prev = current;
      current = current.next;
    }
  }
  return head;
};

