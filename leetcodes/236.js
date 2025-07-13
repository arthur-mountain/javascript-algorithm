/**
 * Status:
 *    - [x] Done
 *    - [ ] Follow-up solutions
 *
 * Title:
 *    236. Lowest Common Ancestor of a Binary Tree
 *
 * Topics:
 *    1. Tree
 *    2. Depth-First Search
 *    3. Binary Tree
 *
 * Statements:
 *    (Add problem statements here)
 *
 * Constraints:
 *    1. The number of nodes in the tree is in the range [2, 10**5].
 *    2. -10**9 <= Node.val <= 10**9
 *    3. All Node.val are <strong>unique</strong>.
 *    4. p != q
 *    5. p and q will exist in the tree.
 **/

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
let lowestCommonAncestor = function (root, p, q) {
  // soving again at https://leetcode.com/explore/learn/card/data-structure-tree/133/conclusion/932
  //
  // postorder -> 左右中

  // 基礎案例：如果當前節點是 null，返回 null
  if (root === null) {
    return null;
  }

  // 基礎案例：如果當前節點就是 p 或 q，返回當前節點
  if (root === p || root === q) {
    return root;
  }

  // 遞迴搜尋左子樹，看能否找到 p 或 q
  const leftResult = lowestCommonAncestor(root.left, p, q);

  // 遞迴搜尋右子樹，看能否找到 p 或 q
  const rightResult = lowestCommonAncestor(root.right, p, q);

  // 判斷結果：
  // 情況1：如果左右子樹都找到了節點，說明當前節點就是 LCA
  if (leftResult !== null && rightResult !== null) {
    return root;
  }

  // 情況2：如果只有左子樹找到了，返回左子樹的結果
  if (leftResult !== null) {
    return leftResult;
  }

  // 情況3：如果只有右子樹找到了，返回右子樹的結果
  if (rightResult !== null) {
    return rightResult;
  }

  // 情況4：如果都沒找到，返回 null
  return null;

  // Time: O(n)
  // Space:O(h) -> 最壞情況為單邊樹O(n)；平衡樹則為 O(log n)
};
