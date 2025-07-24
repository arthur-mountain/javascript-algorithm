/**
 * Status:
 *    - [x] Done
 *    - [x] Follow-up solutions
 *
 * Title:
 *    700. Search in a Binary Search Tree
 *
 * Topics:
 *    1. Tree
 *    2. Binary Search Tree
 *    3. Binary Tree
 *
 * Statements:
 *   從一顆 Binary Search Tree 找到 val
 *
 * Constraints:
 *    1. The number of nodes in the tree is in the range [1, 5000].
 *    2. 1 <= Node.val <= 10**7
 *    3. root is a binary search tree.
 *    4. 1 <= val <= 10**7
 **/

/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} val
 * @return {TreeNode}
 */
var searchBST = function (root, val) {
  /* Iteration */
  while (root != null) {
    if (root.val === val) {
      return root;
    }

    if (root.val > val) {
      root = root.left;
    } else {
      root = root.right;
    }
  }
  return null;
  // Time : O(logn)
  // Space: O(1)
};

{
  var searchBST = function (root, val) {
    /* Recursion */
    // root == null -> 葉子節點
    if (root == null || root.val === val) {
      return root;
    }
    return root.val > val
      ? searchBST(root.left, val)
      : searchBST(root.right, val);
    // Time : O(logn)
    // Space: O(logn)
  };
}
