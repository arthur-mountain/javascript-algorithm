/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
let reverseList = function (head) {
  if (!head) return head;

  let current = head;
  let prev = null,
    next;
  while (current) {
    next = current.next;
    current.next = prev;
    if (!next) break;
    prev = current;
    current = next;
  }
  return current;
};

reverseList = function (head) {
  if (!head) return head;

  let prev = null,
    next;
  while (head) {
    next = head.next;
    head.next = prev;
    prev = head;
    head = next;
  }

  return prev;
};
