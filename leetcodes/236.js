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

/* (待複習，AI 提供) 路徑記錄法，Implemented in「Binary Tree」explore card */
{
  lowestCommonAncestor = function (root, p, q) {
    // soving again at https://leetcode.com/explore/learn/card/data-structure-tree/133/conclusion/932
    //
    // postorder -> 左右中

    // 儲存從根節點到 p 的路徑
    const pathToP = [];
    // 儲存從根節點到 q 的路徑
    const pathToQ = [];

    // 找到兩條路徑
    findPath(root, p, pathToP);
    findPath(root, q, pathToQ);

    // 比較兩條路徑，找出最後的共同節點
    let lca = null;
    const minLength = Math.min(pathToP.length, pathToQ.length);

    for (let i = 0; i < minLength; i++) {
      // 如果兩條路徑在第 i 個位置的節點相同，更新 LCA
      if (pathToP[i] === pathToQ[i]) {
        lca = pathToP[i];
      } else {
        // 一旦不同，就停止比較
        break;
      }
    }

    return lca;

    // Time: O(n)
    // Space:O(h) -> 需要額外空間儲存路徑
  };

  /**
   * 找到從根節點到目標節點的路徑
   * @param {TreeNode} root - 當前節點
   * @param {TreeNode} target - 目標節點
   * @param {TreeNode[]} path - 當前路徑
   * @return {boolean} - 是否找到目標節點
   */
  function findPath(root, target, path) {
    // 如果當前節點是 null，返回 false
    if (root === null) {
      return false;
    }

    // 將當前節點加入路徑
    path.push(root);

    // 如果找到目標節點，返回 true
    if (root === target) {
      return true;
    }

    // 遞迴搜尋左子樹或右子樹
    if (
      findPath(root.left, target, path) ||
      findPath(root.right, target, path)
    ) {
      return true;
    }

    // 如果在當前路徑沒找到，就把當前節點從路徑中移除
    path.pop();
    return false;
  }
}

/* (待複習，AI 提供) 父節點mapping法，Implemented in「Binary Tree」explore card */
{
  lowestCommonAncestor = function (root, p, q) {
    // soving again at https://leetcode.com/explore/learn/card/data-structure-tree/133/conclusion/932
    //

    // 建立父節點映射表
    const parentMap = new Map([[root, null] /* 初始化，根節點沒有父節點 */]);
    buildParentMap(root, parentMap);

    // 記錄從 p 到根節點的所有祖先
    const ancestorsOfP = new Set();
    let current = p;

    // 從 p 開始，一直往上找到根節點，記錄所有祖先
    while (current !== null) {
      ancestorsOfP.add(current);
      current = parentMap.get(current);
    }

    // 從 q 開始往上找，第一個在 ancestorsOfP 中的節點就是 LCA
    current = q;
    while (current !== null) {
      if (ancestorsOfP.has(current)) {
        return current; // 找到第一個共同祖先
      }
      current = parentMap.get(current);
    }

    return null; // 理論上不會到達這裡
  };

  /**
   * 建立父節點映射
   * @param {TreeNode} root - 當前節點
   * @param {Map} parentMap - 父節點映射表
   */
  function buildParentMap(root, parentMap) {
    if (root === null) {
      return;
    }

    // 為左、右子節點設定父節點
    if (root.left !== null) {
      parentMap.set(root.left, root);
      buildParentMap(root.left, parentMap);
    }

    if (root.right !== null) {
      parentMap.set(root.right, root);
      buildParentMap(root.right, parentMap);
    }
  }

  // Time: O(n)
  // Space:O(n) -> 需要額外空間儲存映射和祖先集合
}
