/**
 * Status:
 *    - [ ] Done
 *    - [ ] Follow-up solutions
 *
 * Title:
 *    450. Delete Node in a BST
 *
 * Topics:
 *    1. Tree
 *    2. Binary Search Tree
 *    3. Binary Tree
 *
 * Statements:
 *    Given a root node of a bst and a key, delete the node in the bst that has the value of key.
 *    Return the root node reference of the bst.
 *
 * Constraints:
 *    1. The number of nodes in the tree is in the range [0, 10**4].
 *    2. -10**5 <= Node.val <= 10**5
 *    3. Each node has a <strong>unique</strong> value.
 *    4. root is a valid binary search tree.
 *    5. -10**5 <= key <= 10**5
 **/

/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/** @param {TreeNode} root
 * @param {number} key
 * @return {TreeNode}
 */
var deleteNode = function (root, key) {
  // recursion
  //
  // - 尋找要刪除的節點，沒找到，就跳過刪除的流程; 找到，有三種情境
  //   - 沒有 children，移除掉父節點指向該節點的指針
  //   - 有一個 children，將 children 跟要刪除的節點交換，更新父節點指針要指向 children。
  //   - 有兩個 children，要找到右子樹最左邊的節點(succeessor)，將 succeessor 跟要刪除的節點交換，更新父節點指針要指向 succeessor。 因為只有 succeessor 是大於刪除節點的左節點和小於刪除節點的右節點

  (function _deleteNode(node) {
    if (node == null) {
      return node;
    }

    if (node.val > key) {
      // 如果當前節點的值大於 key，代表要往左邊找
      node.left = _deleteNode(node.left);
      return node;
    } else if (node.val < key) {
      // 反之，如果當前節點的值小於 key，代表要往右邊找
      node.right = _deleteNode(node.right);
      return node;
    } else {
      // 找到 key 節點，要判斷三種情境
      if (node.left && node.right) {
        // 有兩個 children
        // 要找到左子樹最左邊的節點
        let successor = node.right;
        while (successor.left && successor.left.left) {
          successor = successor.left;
        }
        // TODO: [5,3,6,2,4,null,7] 這樣的樹的話，successor 應該是 4，但卻又要找 4.left 會 null pointer error
        successor.left.left = node.left;
        successor.left.right = node.right;
        successor.left = null;
        return successor;
      } else if (node.left || node.right) {
        // 有一個 children
        return node.left || node.right;
      } else {
        // 沒有 children
        return null;
      }
    }
  })(root);

  return root;
};

// Dry Run:
//  - Input: root = [5,3,6,2,4,null,7], key = 3; Output: [5,4,6,2,null,null,7]
//    _deleteNode(5) -> _deleteNode(3) ->
//
//  - Input: root = [5,3,6,2,4,null,7], key = 0; Output: [5,3,6,2,4,null,7]
//    _deleteNode(5) -> _deleteNode(3) -> _deleteNode(2) -> _deleteNode(null)
//    5.left = 3; return 5  <-  3.left = 2; return 3  <-  2.left = null; return 2;
//
//  - Input: root = [], key = 0; Output: []
//    _deleteNode(null), return: null

// Time : O()
// Space: O()
