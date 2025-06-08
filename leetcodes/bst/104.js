/**
 * Status:
 *  - [x] Done
 *  - [x] Follow-up solutions
 *
 * Title:
 *  Maximum Depth of Binary Tree
 *
 * Topics:
 *  - Binary Tree
 *  - DFS
 *  - BFS
 *
 * Statements:
 *  Given the root of a binary tree, return its maximum depth.
 *
 *  A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.
 *
 * Constraints:
 *  - The number of nodes in the tree is in the range [0, 104].
 *  -100 <= Node.val <= 100
 **/

/* DFS */
// Time : O(n)
// Space: O(n)
var maxDepth = function (root) {
  // base case(leaf node) return 1 as leaf node depth
  // otherwise found the maximum depth between left or right and plus one(current node depth)
  return root == null
    ? 0
    : Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
};

/* BFS */
// Time : O(n)
// Space: O(n)
var maxDepth = function (root) {
  const queue = root ? [root] : [];
  let depth = 0;
  while (queue.length > 0) {
    depth++;
    for (let i = queue.length; i > 0; i--) {
      const node = queue.unshift();
      node.left && queue.push(node.left);
      node.right && queue.push(node.right);
    }
  }
  return depth;
};
