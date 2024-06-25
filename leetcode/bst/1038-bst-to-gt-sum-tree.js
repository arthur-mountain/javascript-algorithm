const INPUTS = [
  [4, 1, 6, 0, 2, 5, 7, null, null, null, 3, null, null, null, 8],
  [0, null, 1],
];

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
 * @return {TreeNode}
 */
const bstToGst = (root) => {
  if (!root) return root;

  // calculate the sum of the right subtree
  let current = root.right;
  let stack = [];
  while (current) {
    if (current.right) stack.push(current.right);
    current = current.right;
  }

  let sum = 0;
  while (stack.length) {
    const node = stack.pop();
    if (node.right) sum += node.right.val;
    node.val += sum;
    sum = 0;
  }

  root.val += root.right.val;

  // calculate the sum of the left subtree and always added new root val(sum of subtree include original root val)

  console.log(root);
};

INPUTS.forEach((INPUT) => {
  bstToGst(INPUT);
});
