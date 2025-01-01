/*
 * - [x] Done
 * - [] Follow up solutions
 */
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
const postorderTraversal = (root) => {
  let values = [];
  const dfs = (node) => {
    if (!node) return;

    dfs(node.left);

    dfs(node.right);

    values.push(node.val);
  };

  dfs(root, []);
  return values;
};
