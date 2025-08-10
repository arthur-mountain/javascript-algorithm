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

  // 當前節點不為空時
  while (root != null) {
    // 要找的值等於當前的值，代表找到了
    if (root.val === val) {
      return root;
    }

    if (root.val > val) {
      // 當前的值 > 要找的值，代表要找的值**比較小**，所以往左邊找
      root = root.left;
    } else {
      // 當前的值 <= 要找的值，代表要找的值**比較大**，所以往右邊找
      root = root.right;
    }
  }
  // 上面迴圈結束，函式沒跳出，代表沒有找到(根節點為空 or 抵達葉子節點)
  return null;

  // Time : O(logn)
  // Space: O(1)
};

{
  var searchBST = function (root, val) {
    /* Recursion */

    // 前者判斷根節點是否為空又或者如果已經抵達葉子節點時，代表沒找到，回傳 null(當前於回傳當前節點)
    // 後者判斷當前節點的值等於要找的值，代表找到了，回傳當前節點
    if (root == null || root.val === val) {
      return root;
    }
    return root.val > val
      ? searchBST(root.left, val) // 當前的值 > 要找的值，代表要找的值**比較小**，所以往左邊找
      : searchBST(root.right, val); // 當前的值 <= 要找的值，代表要找的值**比較大**，所以往右邊找
    // Time : O(logn)
    // Space: O(logn)
  };
}
