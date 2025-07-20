/**
 * Status:
 *    - [x] Done
 *    - [ ] Follow-up solutions
 *
 * Title:
 *    116. Populating Next Right Pointers in Each Node
 *
 * Topics:
 *    1. Linked List
 *    2. Tree
 *    3. Depth-First Search
 *    4. Breadth-First Search
 *    5. Binary Tree
 *
 * Statements:
 *    (Add problem statements here)
 *
 * Constraints:
 *    1. The number of nodes in the tree is in the range [0, 2**12 - 1].
 *    2. -1000 <= Node.val <= 1000
 **/

/**
 * // Definition for a _Node.
 * function _Node(val, left, right, next) {
 *    this.val = val === undefined ? null : val;
 *    this.left = left === undefined ? null : left;
 *    this.right = right === undefined ? null : right;
 *    this.next = next === undefined ? null : next;
 * };
 */

/**
 * @param {_Node} root
 * @return {_Node}
 */
var connect = function (root) {
  // BFS
  const queue = new Queue(root === null ? [] : [root]);
  while (queue.size() > 0) {
    let size = queue.size();
    let prev = null;
    while (size-- > 0) {
      const node = queue.dequeue();
      if (prev !== null) prev.next = node;
      prev = node;
      node.left && queue.enqueue(node.left);
      node.right && queue.enqueue(node.right);
    }
  }
  return root;
  // Time : O(n)
  // Space: O(w), where w is the max number of nodes at any level
  //              (O(n) in worst case, e.g., complete tree)
};
