/**
 * Status:
 *  - [x] Done
 *  - [ ] Follow-up solutions
 *
 * Title:
 *    876. Middle of the Linked List
 *
 * Topics:
 *    1. Linked List
 *
 *    2. Two Pointers
 *
 * Statements:
 *   Given a non-empty, singly linked list with head node, return a middle node of linked list.
 *
 *   If there are two middle nodes, return the second middle node.
 *
 * Constraints:
 *   1. The number of nodes in the given list will be between 1 and 100.
 *
 *   2. 1 <= Node.val <= 100
 **/
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
let middleNode = (head) => {
  /*
   *  Brute force solution:
   *    first iterate the list to get size of the list,
   *    then iterate the list again to get the middle node.
   *
   *    Space: O(1)
   *    Time: O(n)
   **/

  // Space: O(1)
  let middle = 0;

  // Time: O(n)
  let current = head;
  while (current) {
    middle++;
    current = current.next;
  }

  current = head;
  middle = Math.floor(middle / 2);
  let count = 0;
  // Time: O(n)
  while (current) {
    if (count === middle) {
      return current;
    }
    count++;
    current = current.next;
  }
};

middleNode = (head) => {
  /*
   * Thoughts:
   *  using fast/slow pointer,
   *  the slow pointer go 1 step each time,
   *  the fast pointer go 2 steps each time,
   *  when the fast pointer reach the end of the list, the slow pointer will be at the middle of the list.
   *
   *  Space: O(1)
   *  Time: O(log(n))
   **/
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
};
