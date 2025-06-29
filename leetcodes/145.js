/**
 * Status:
 *    - [x] Done
 *    - [] Follow-up solutions
 *
 * Title:
 *    145. Binary Tree Postorder Traversal
 *
 * Topics:
 *    1. Stack
 *    2. Tree
 *    3. Depth-First Search
 *    4. Binary Tree
 *
 * Statements:
 *    Given the root of a binary tree, return the postorder traversal of its nodes' values.
 *
 * Constraints:
 *    1. The number of the nodes in the tree is in the range [0, 100].
 *    2. -100 <= Node.val <= 100
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
 * @return {number[]}
 */

// postorder: left -> right -> root
let postorderTraversal = (root) => {
  // recursively
  const outputs = [];
  (function postorder(node) {
    if (node == null) {
      return;
    }
    // traverse left subtree and right subtree
    postorder(node.left);
    postorder(node.right);
    // visit node val
    outputs.push(node.val);
  })(root);
  return outputs;
  // Time : O(n)
  // Space: O(log n) for balanced tree, O(n) for skewed tree
};

postorderTraversal = (root) => {
  // iteratively 通用模板
  const outputs = [];
  const stack = root == null ? [] : [root];
  while (stack.length > 0) {
    const node = stack.pop();
    if (node == null) {
      // visit node val
      outputs.push(stack.pop().val);
      continue;
    }
    // push node and marker
    stack.push(node);
    stack.push(null);
    // traverse left subtree and right subtree
    node.right && stack.push(node.right);
    node.left && stack.push(node.left);
  }
  return outputs;
  // Time : O(n)
  // Space: O(log n) for balanced tree, O(n) for skewed tree
};
