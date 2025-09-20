/**
 * Status:
 *    - [x] Done
 *    - [ ] Follow-up solutions
 *
 * Title:
 *    235. Lowest Common Ancestor of a Binary Search Tree
 *
 * Topics:
 *    1. Tree
 *    2. Depth-First Search
 *    3. Binary Search Tree
 *    4. Binary Tree
 *
 * Statements:
 *    (Add problem statements here)
 *
 * Constraints:
 *    1. The number of nodes in the tree is in the range [2, 10**5].
 *    2. -10**9 <= Node.val <= 10**9
 *    3. All Node.val are <strong>unique</strong>.
 *    4. p != q
 *    5. p and q will exist in the BST.
 **/

/*
 * Solution1:
 *
 * 從根節點開始判斷，比較當前節點值與 p, q 的大小關係：
 * - 如果 p 和 q 都小於當前節點 → LCA 在左子樹
 * - 如果 p 和 q 都大於當前節點 → LCA 在右子樹
 * - 否則（p 和 q 分別在兩側，或其中一個就是當前節點）→ 當前節點就是 LCA
 **/
{
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
  var lowestCommonAncestor = function (root, p, q) {
    // Base Case：空節點
    if (root == null) {
      return null;
    }

    // 利用 BST 特性，判斷 p and q 的位置
    // 1. 當前節點的值大於 p and q，因此 p and q 在左子樹
    if (root.val > p.val && root.val > q.val) {
      return lowestCommonAncestor(root.left, p, q);
    }
    // 2. 當前節點的值小於 p and q，因此 p and q 在右子樹
    if (root.val < p.val && root.val < q.val) {
      return lowestCommonAncestor(root.right, p, q);
    }

    // 情況 3：當前節點就是 LCA
    // 這包含三種情況：
    // 1. p 在左，q 在右
    // 2. q 在左，p 在右
    // 3. 當前節點是 p 或 q 之一
    return root;
  };

  // Time : O(h) -> 最好情況（平衡樹）：O(log n); 最壞情況（退化成鏈表）：O(n)
  //                造成此成本的原因：每次遞迴只走一條路徑（左或右），不會訪問所有節點
  // Space: O(h) -> 遞迴的深度等於樹的高度
}
