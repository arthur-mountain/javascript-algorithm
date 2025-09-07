/**
 * Status:
 *    - [x] Done
 *    - [x] Follow-up solutions
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
      } else {
        // 有一個 children 就回傳有值的那個子節點
        // 如果都沒有 children，就會回傳 null
        return node.left || node.right;
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

/* solution 2: 整體概念 solution1，但改成不額外建立 _deleteNode function */
{
  /**
   * Definition for a binary tree root.
   * function TreeNode(val, left, right) {
   *     this.val = (val===undefined ? 0 : val)
   *     this.left = (left===undefined ? null : left)
   *     this.right = (right===undefined ? null : right)
   * }
   */
  /**
   * @param {TreeNode} root
   * @param {number} key
   * @return {TreeNode}
   */
  var deleteNode = function (root, key) {
    // Base case: 若節點為空，直接返回 null
    if (root == null) {
      return root;
    }

    if (root.val > key) {
      // 如果當前節點的值大於 key，代表要往左邊找
      // 接收到更新後的左子樹，重新賦值給父節點的 left
      root.left = deleteNode(root.left, key);
      return root;
    } else if (root.val < key) {
      // 反之，如果當前節點的值小於 key，代表要往右邊找
      // 接收到更新後的右子樹，重新賦值給父節點的 right
      root.right = deleteNode(root.right, key);
      return root;
    }

    // 找到 key 節點，要判斷三種情境
    if (root.left && root.right) {
      // 有兩個 children
      // 1. 在右子樹中找到 successor (最左邊的節點)
      let successor = root.right;
      while (successor.left) {
        successor = successor.left;
      }

      // 2. 將 node 的值替換為 successor 的值
      root.val = successor.val;

      // 3. 遞迴地從右子樹中刪除 successor
      root.right = deleteNode(root.right, successor.val); // 回傳更新後的節點

      return root; // 歸的時候，回傳更新後的節點，給父節點賦值
    } else {
      // 有一個 children 就回傳有值的那個子節點
      // 如果都沒有 children，就會回傳 null
      return root.left || root.right;
    }
  };
  // Time : O(h) -> O(log n) for balanced BST, O(n) for skewed tree
  // Space: O(h) -> O(log n) for balanced BST, O(n) for skewed tree (due to recursion stack)
}

/*
 * solution 3: 整體概念 solution1，同樣不額外建立 _deleteNode function，
 *
 * 且前面解法在找到 successor 之後，是直接替換 successor 的值，並刪除 successor，
 *
 * 這個解法是透過找到 successor 後直接取代「欲刪除節點」的位置，因此要更新指針：
 * -「欲刪除節點」指向子樹的指針，要讓 successor 也能指到「欲刪除節點」的子樹，避免在節點刪除後，子樹的連接不見
 * - 父節點原本指向「欲刪除節點」的指針，要改成指向 successor。 因此一旦父節點改指向 successor 後，就沒有指針指向「欲刪除節點」（等同於刪除)
 *
 * */
{
  /**
   * Definition for a binary tree root.
   * function TreeNode(val, left, right) {
   *     this.val = (val===undefined ? 0 : val)
   *     this.left = (left===undefined ? null : left)
   *     this.right = (right===undefined ? null : right)
   * }
   */
  /**
   * @param {TreeNode} root
   * @param {number} key
   * @return {TreeNode}
   */
  var deleteNode = function (root, key) {
    // 注意: 這邊是直接透過指針調整的方式更新，而非透過值替換
    // - 值替換：透過用 successor 的值覆蓋目標節點，再刪除 successor，操作簡單且普遍； P.S. 可參考前面解法
    // - 節點指針搬移：
    //   直接轉接父節點指標替代刪除節點(將 successor 取代掉原本刪除節點的位子，
    //   要更新 successor 的指針和父節點要指向 successor) ，保持樹結構一致，更貼近節點真實搬移但實作較複雜。
    //
    // - 尋找要刪除的節點，沒找到就跳過刪除流程；找到後有三種情況：
    //   1. 沒有子節點，直接刪除（回傳 null 給父節點）
    //   2. 有一個子節點，直接用該子節點替代被刪除節點的位置
    //   3. 有兩個子節點，找到右子樹中最左邊的節點（successor，無左子節點）
    //      用 successor 節點替換掉被刪除節點的位子
    //
    // - 每次遞迴「歸」的階段，會回傳更新後的節點給父節點，
    //   父節點據此重新賦值 left 或 right 指標，確保整棵樹連結正確不斷裂

    // base case: 若節點為空，直接返回 null
    if (root == null) {
      return root;
    }

    if (root.val > key) {
      // 如果當前節點的值大於 key，代表要往左邊找
      // 接收到更新後的左子樹，重新賦值給父節點的 left
      root.left = deleteNode(root.left, key);
      return root;
    } else if (root.val < key) {
      // 反之，如果當前節點的值小於 key，代表要往右邊找
      // 接收到更新後的右子樹，重新賦值給父節點的 right
      root.right = deleteNode(root.right, key);
      return root;
    }

    // 找到 key 節點，要判斷三種情境
    if (root.left && root.right) {
      // 有兩個 children

      // 1. 在右子樹中找到 successor (最左邊的節點)
      let successor = root.right;
      while (successor.left) successor = successor.left;

      // 2. 若 successor 不是「欲刪除節點」的直接右子節點，表示 successor 位於右子樹更深層的左支路，要先刪除右子樹中 successor 原位置
      //
      // 情境一：successor 等於「欲刪除節點」右子節點
      //   - successor 直接是「欲刪除節點」右子節點，表示 successor 沒有左子節點（中序後繼的定義）
      //   - 此時不需刪除 successor 在右子樹的原位置（因為它本身就在那裡）
      //   - 直接將 successor 接替「欲刪除節點」的位置，並把「欲刪除節點」的左子樹接給 successor 左節點
      //
      // 情境二：successor 不是 root 右子節點
      //   - successor 位於右子樹更深層的左側（非直接右子節點）
      //   - 需先從右子樹中遞迴刪除 successor 節點（原位置）
      //   - 再將刪除後的右子樹指派給 successor.right，確保右子樹結構正確
      //   - 總結一句話： 如果要把 successor 直接取代「欲刪除節點」，要先刪除右子樹中的 successor，
      //     再用 succeesor 取代到「欲刪除節點」的位子，包括兩件事：
      //     - 把「欲刪除節點」的左右子樹交給 successor
      //     - 把(父節點) 指向「欲刪除節點」的指針指向 successor
      if (successor !== root.right) {
        // 情境二：successor 不是 root 的直接右子節點
        // 從右子樹中刪除 successor 節點（因為 successor 會被搬移到「欲刪除節點」的位置上）
        root.right = deleteNode(root.right, successor.val);

        // 將更新後的右子樹(即刪除 successor 後的右子樹)指派給 successor.right，保持 successor 右子樹連結正確
        successor.right = root.right;
      }

      // 情境一與情境二共用，將「欲刪除節點」的左子樹指派給 successor.left，讓 successor 接手「欲刪除節點」的左子樹
      successor.left = root.left;

      // 3. 歸的時候，回傳 successor 給父節點賦值(因為 successor 要取代掉當前「欲刪除節點」後即刪除當前節點)
      return successor;
    } else {
      // 有一個 children 就回傳有值的那個子節點
      // 如果都沒有 children，就會回傳 null
      return root.left || root.right;
    }
  };

  // Dry Run:
  // - Input: root = [5,3,8,2,4,6,9], key = 5
  //   Steps:
  //     deleteNode(5, 5)    // root.val=5 == 5, 找到目標節點 val=5，有兩個子節點 (3,8)
  //        找到 successor = 6 (右子樹中最左節點，無左子節點)
  //        since successor !== root.right (6 != 8)，trigger 情境二
  //        deleteNode(8, 6) // 刪除 successor 在右子樹的原位置
  //          -> deleteNode(8, 6)  // root.val=8 > 6, 遞迴往左子樹
  //            -> deleteNode(6, 6)  // 找到目標節點 val=6，沒有子節點
  //               返回 null (刪除葉節點)
  //          回傳更新後的左子樹 (null) 給 root.left (即 8.left = null)
  //        返回更新後的右子樹 (node val=8, left=null, right=9)
  //        更新 successor.right = 8 (更新後的右子樹)
  //        將 successor.left 指向原 5 的左子樹 3
  //        最終用 successor 節點 (6) 取代原根節點 5 的位子
  //     返回更新後的 root 節點 (6)
  //   結果樹為 [6,3,8,2,4,null,9]
  //
  // - Input: root = [5,3,6,2,4,null,7], key = 3
  //   Steps:
  //     deleteNode(5, 3)    // root.val=5 > 3, 遞迴往左子樹
  //       -> deleteNode(3, 3)  // 找到目標節點 val=3，有兩個子節點 (2,4)
  //          找到 successor = 4 (右子樹中最左節點，無左子節點)
  //          since successor === root.right，trigger 情境一
  //          不需刪除右子樹中 successor 原位置
  //          將 successor.left 指向原 3 的左子樹 2
  //          最終用 successor 節點取代原 root.left 指向的 3 節點
  //       回傳更新後的左子樹 (new node val=4) 給 root.left
  //     返回更新後的 root 節點 (5)
  //   結果樹為 [5,4,6,2,null,null,7]
  //
  // - Input: root = [5,3,6,2,4,null,7], key = 6
  //   Steps:
  //     deleteNode(5, 6)   // root.val=5 < 6, 遞迴往右子樹
  //       -> deleteNode(6, 6)  // 找到目標節點 val=6，只有一個右子節點 (7)
  //          無兩個子節點，直接返回其右子節點 7 取代原位置
  //       回傳更新後的右子樹 (new node val=7) 給 root.right
  //     返回更新後 root 節點 (5)
  //   結果樹為 [5,3,7,2,4]
  //
  // - Input: root = [5,3,6,2,4,null,7], key = 0 (目標節點不存在)
  //   Steps:
  //     deleteNode(5, 0)   // root.val=5 > 0, 遞迴往左子樹
  //       -> deleteNode(3, 0) // 3 > 0, 遞迴左
  //         -> deleteNode(2, 0) // 2 > 0, 遞迴左
  //           -> deleteNode(null, 0) // 返回 null
  //         返回 2 (無變更)
  //       返回 3 (無變更)
  //     返回 5 (無變更，整棵樹維持不變)
  //
  // - Input: root = [], key = 0 (空樹)
  //   Steps:
  //     deleteNode(null, 0) // 直接返回 null
  //   結果樹為 []
  //
  // Time : O(h) -> O(log n) for balanced BST, O(n) for skewed tree
  // Space: O(h) -> O(log n) for balanced BST, O(n) for skewed tree (due to recursion stack)
}
