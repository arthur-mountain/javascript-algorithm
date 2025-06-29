/**
 * Status:
 *    - [x] Done
 *    - [x] Follow-up solutions
 *
 * Title:
 *    94. Binary Tree Inorder Traversal
 *
 * Topics:
 *    1. Stack
 *    2. Tree
 *    3. Depth-First Search
 *    4. Binary Tree
 *
 * Statements:
 *    Given the root of a binary tree, return the inorder traversal of its nodes' values.
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

// inorder: left -> root -> right
let inorderTraversal = (root) => {
  // recursively
  const outputs = [];
  (function inorder(node) {
    if (node == null) {
      return;
    }
    // traverse left subtree first
    inorder(node.left);
    // visit node val
    outputs.push(node.val);
    // traverse right subtree first
    inorder(node.right);
  })(root);
  return outputs;
  // Time : O(n)
  // Space: O(log n) for balanced tree, O(n) for skewed tree
};

inorderTraversal = (root) => {
  // iteratively，通用模板
  const outputs = [];
  const stack = root == null ? [] : [root];
  while (stack.length > 0) {
    const node = stack.pop();
    if (node == null) {
      // 遇到 null，代表該 visit（拜訪）前一個推進來的節點
      outputs.push(stack.pop().val);
      continue;
    }
    // 為了模擬遞迴的 call stack，需要先推入 right，再推 left
    // 這樣下一次 pop 的時候會先處理 left subtree

    // 1. 推入右子節點，因為要最後拜訪
    node.right && stack.push(node.right);

    // 2. 推入目前的節點，再推入 null 作為標記
    //    後續遇到這個 null marker，代表可以拜訪前一個節點
    stack.push(node);
    stack.push(null);

    // 3. 推入左子節點，會最先被處理
    node.left && stack.push(node.left);
  }
  return outputs;
  // Time : O(n)
  // Space: O(log n) for balanced tree, O(n) for skewed tree
};

inorderTraversal = (root) => {
  // iteratively，標準做法，業界常見
  const outputs = [];
  const stack = [];
  let current = root;
  while (current != null || stack.length > 0) {
    // 1. 若當前節點存在，從該節點往左走到底，沿路把節點 push 進 stack
    while (current != null) {
      stack.push(current);
      current = current.left;
    }

    // 2. 走到底後，彈出節點並訪問(該節點會是最左側的節點)
    current = stack.pop();
    outputs.push(current.val);

    // 3. 當最左邊的節點訪問完，移動到該節點的右節點
    current = current.right;
  }
  return outputs;
  // Time : O(n)
  // Space: O(log n) for balanced tree, O(n) for skewed tree
};
