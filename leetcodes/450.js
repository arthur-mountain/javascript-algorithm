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

{
  /*** Solution 1  ***/
  /**
   * @param {TreeNode} root
   * @param {number} key
   * @return {TreeNode}
   */
  var deleteNode = function (root, key) {
    // - 尋找要刪除的節點，沒找到就跳過刪除流程；找到後有三種情況
    //   - 沒有子節點 (children)，直接刪除該節點 (回傳 null 給父節點)
    //   - 有一個子節點時，讓父節點指向該子節點，取代被刪除節點的位置
    //   - 有兩個子節點時，找到右子樹中最左邊的節點（successor）
    //     用「successor」的值替換「被刪除節點」的值，再遞迴刪除 successor 節點（因為 successor 一定沒有左子節點）
    //     確保 BST 性質不被破壞
    //
    // - 在遞迴「歸」的過程中，父節點會接收「更新後子節點」作為返回值，
    //   重新賦值父節點的 left 或 right，確保整棵樹的連結正確更新。
    return _deleteNode(root, key);
  };

  function _deleteNode(node, currentKey) {
    if (node == null) {
      return node;
    }

    if (node.val > currentKey) {
      // 如果當前節點的值大於 key，代表要往左邊找
      // 接收到更新後的左子樹，重新賦值給父節點的 left
      node.left = _deleteNode(node.left, currentKey);
      return node;
    } else if (node.val < currentKey) {
      // 反之，如果當前節點的值小於 key，代表要往右邊找
      // 接收到更新後的右子樹，重新賦值給父節點的 right
      node.right = _deleteNode(node.right, currentKey);
      return node;
    } else {
      // 找到 key 節點，要判斷三種情境
      if (node.left && node.right) {
        // 有兩個 children
        // 1. 在右子樹中找到 successor (最左邊的節點)
        let successor = node.right;
        while (successor.left) {
          successor = successor.left;
        }

        // 2. 將 node 的值替換為 successor 的值
        node.val = successor.val;

        // 3. 遞迴地從右子樹中刪除 successor
        node.right = _deleteNode(node.right, successor.val); // 回傳更新後的節點

        return node;
      } else if (node.left || node.right) {
        // 有一個 children
        return node.left || node.right;
      } else {
        // 沒有 children
        return null;
      }
    }
  }

  // Dry Run:
  //  - Input: root = [5,3,6,2,4,null,7], key = 3
  //    Steps:
  //      _deleteNode(5, 3)  // 5 > 3, go left
  //        -> _deleteNode(3, 3)  // found node with val=3
  //          node has two children (2,4)
  //          find successor in right subtree: successor = 4 (leftmost of right subtree)
  //          replace node.val = 4
  //          delete successor node with val=4 from right subtree:
  //            _deleteNode(4, 4) -> leaf node, no children -> return null to parent's right
  //          updated tree after deletion:
  //            [5,4,6,2,null,null,7]
  //          return updated node (4) to parent (5)
  //      return updated root (5)
  //
  //  - Input: root = [5,3,6,2,4,null,7], key = 0 (not found)
  //    Steps:
  //      _deleteNode(5, 0)  // 5 > 0, go left
  //        -> _deleteNode(3, 0)  // 3 > 0, go left
  //          -> _deleteNode(2, 0)  // 2 > 0, go left
  //            -> _deleteNode(null, 0)  // reached leaf, return null
  //          update: 2.left = null, return 2
  //        update: 3.left = 2, return 3
  //      update: 5.left = 3, return 5
  //    No deletion performed, tree remains same:
  //
  //  - Input: root = [], key = 0
  //    Steps:
  //      _deleteNode(null, 0)  // empty tree, return null
  //    Return null as tree is empty
  //
  // Time : O(h) -> O(log n) for balanced BST, O(n) for skewed tree
  // Space: O(h) -> O(log n) for balanced BST, O(n) for skewed tree (due to recursion stack)
}
