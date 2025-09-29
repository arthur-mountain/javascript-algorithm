/**
 * Status:
 *    - [x] Done
 *    - [x] Follow-up solutions
 *
 * Title:
 *    110. Balanced Binary Tree
 *
 * Topics:
 *    1. Tree
 *    2. Depth-First Search
 *    3. Binary Tree
 *
 * Statements:
 *  判斷當前的 binary tree 是否 height-balanced。
 *  height-balanced 的定義為：當前節點其左、右子樹 height 差值不得超過 1，則該子樹為 height-balanced
 *
 * Constraints:
 *    1. The number of nodes in the tree is in the range [0, 5000].
 *    2. -10**4 <= Node.val <= 10**4
 **/

{
  /**
   * Definition for a binary tree node.
   * function TreeNode(val, left, right) {
   *     this.val = (val===undefined ? 0 : val)
   *     this.left = (left===undefined ? null : left)
   *     this.right = (right===undefined ? null : right)
   * }
   */

  /**
   * 計算高度並同時檢查平衡性
   * @param {TreeNode} node
   * @return {number} 回傳高度，如果不平衡則回傳 -1
   */
  const getHeightAndCheck = (node) => {
    // 基本情況：空節點高度為 0
    if (!node) return 0;

    // 遞歸計算左子樹高度，如果左子樹不平衡，直接回傳 -1
    const leftHeight = getHeightAndCheck(node.left);
    if (leftHeight === -1) return -1;

    // 遞歸計算右子樹高度，如果右子樹不平衡，直接回傳 -1
    const rightHeight = getHeightAndCheck(node.right);
    if (rightHeight === -1) return -1;

    // 檢查當前節點是否平衡
    if (Math.abs(leftHeight - rightHeight) > 1) {
      return -1; // 不平衡，回傳特殊值 -1
    }

    // 當前節點平衡，回傳當前節點的高度
    return 1 + Math.max(leftHeight, rightHeight);
  };

  /**
   * @param {TreeNode} root
   * @return {boolean}
   */
  var isBalanced = function (root) {
    // Context:
    //  1. the tree is binary tree
    //
    // Requirements:
    //  判斷當前的 binary tree 是否 height-balanced。
    //  height-balanced 的定義為：當前節點其左、右子樹 height 差值不得超過 1，則該子樹為 height-balanced
    //
    // Solutions:
    //  1. 遞：走到最底，葉子節點為 balanced，迴：根據左、右子樹是否為 balanced 計算出當前節點是否 balanced
    return getHeightAndCheck(root) !== -1;
  };

  // Time : O(n) -> 每個節點訪問一次
  // Space: O(n) -> 遞迴 callstack
}
