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

  // - Go to rightmost node
  //  - leaf node have same value
  //  - go up to parent node
  //    - parnet node value = parent node value + first right child value
  //
  //    - parent node left child value = parent node left child value + parent node value
  //
  //  - until go up to root node
  //    - Go to rightmost node of left child node of root node
  //      - leaf node = left child node value + root node value
  //
  //    - go up to parent node
  //      - parnet node value = parent node value + first right child value
  //      - parent node left child value = parent node left child value + parent node value

  // const _bstToGst = (root) => {
  //   // find the rightmost node
  //   let current = root.right;
  //   let stack = [root];
  //   /* O(log n) */
  //   while (current) {
  //     if (current.right) stack.push(current.right);
  //     current = current.right;
  //   }
  //
  //   /* O((log n) ^ 2) */
  //   while (stack.length) {
  //     let node = stack.pop();
  //
  //     // node.val = node.val + node.right.val
  //     if (node.right) node.val += node.right.val;
  //
  //     // node.left.val = node.left.val + node.val + sum of  node.left.right.val
  //     if (node.left) {
  //       current = node.left;
  //       while (current) {
  //         _bstToGst(current);
  //         current.val += current.val + (current.right ? current.right.val : 0);
  //         current = current.left;
  //       }
  //     }
  //   }
  // };
  //
  // _bstToGst(root);
  // return root;
};
