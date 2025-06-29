/**
 * Status:
 *    - [x] Done
 *    - [x] Follow-up solutions
 *
 * Title:
 *    144. Binary Tree Preorder Traversal
 *
 * Topics:
 *    1. Stack
 *    2. Tree
 *    3. Depth-First Search
 *    4. Binary Tree
 *
 * Statements:
 *    Given the root of a binary tree, return the preorder traversal of its nodes' values.
 *
 * Constraints:
 *    1. The number of nodes in the tree is in the range [0, 100].
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
// preorder: root -> left -> right
let preorderTraversal = (root) => {
  // recursively
  const outputs = [];
  (function preorder(node) {
    // base case
    if (node == null) {
      return;
    }
    // visit root node first
    outputs.push(node.val);
    // traverse left subtree
    preorder(node.left);
    // traverse right subtree
    preorder(node.right);
  })(root);
  return outputs;
  // Time : O(n)
  // Space: O(log n) for balanced tree, O(n) for skewed tree
};

preorderTraversal = (root) => {
  // iteratively
  const outputs = [];
  const stack = [root];
  while (stack.length > 0) {
    const node = stack.pop();
    if (node == null) continue;
    // visit root node first
    outputs.push(node.val);
    // 因為是要模擬 call stack，
    // 所以要先推 right node 再推 left node
    // 這樣下一次 stack.pop 的時候才會先拿出 left node
    stack.push(node.right);
    stack.push(node.left);
  }

  return outputs;
  // Time : O(n)
  // Space: O(log n) for balanced tree, O(n) for skewed tree
};
