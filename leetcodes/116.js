/**
 * Status:
 *    - [x] Done
 *    - [x] Follow-up solutions
 *
 * Title:
 *    116. Populating Next Right Pointers in Each Node
 *
 * Topics:
 *    1. Linked List
 *    2. Tree
 *    3. Depth-First Search
 *    4. Breadth-First Search
 *    5. Binary Tree
 *
 * Statements:
 *    (Add problem statements here)
 *
 * Constraints:
 *    1. The number of nodes in the tree is in the range [0, 2**12 - 1].
 *    2. -1000 <= Node.val <= 1000
 **/

/**
 * // Definition for a _Node.
 * function _Node(val, left, right, next) {
 *    this.val = val === undefined ? null : val;
 *    this.left = left === undefined ? null : left;
 *    this.right = right === undefined ? null : right;
 *    this.next = next === undefined ? null : next;
 * };
 */

/**
 * @param {_Node} root
 * @return {_Node}
 */
var connect = function (root) {
  // BFS
  const queue = new Queue(root === null ? [] : [root]);
  while (queue.size() > 0) {
    let size = queue.size();
    let prev = null;
    while (size-- > 0) {
      const node = queue.dequeue();
      if (prev !== null) prev.next = node;
      prev = node;
      node.left && queue.enqueue(node.left);
      node.right && queue.enqueue(node.right);
    }
  }
  return root;
  // Time : O(n)
  // Space: O(w), where w is the max number of nodes at any level
  //              (O(n) in worst case, e.g., complete tree)
};

connect = function (root) {
  // 待複習，沒自己解出來
  // constant space 透過指針，預期會需要幾個指標:
  // - 父節點，這樣才能 access left and right
  // - 如果以中間分隔，左子樹最右節點 -> 右子樹最左節點，那麼要能 access 到右子樹最左節點的父節點
  //   - 可以透過左子樹最右節點的 next 節點
  //
  // P.S. 要從最左邊的節點開始處理，沒辦法從右邊找到左邊的節點

  // base case
  if (root === null) {
    return null;
  }

  let leftMost = root; // 每層的最左邊得節點
  let current; // 當前處理的節點

  // 有下一層節點需要處理
  while (leftMost.left !== null) {
    current = leftMost;

    // 處理當前節點的下一層節點連接，只需要專注於兩件事
    //   - 任務1: 連接當前節點的左、右節點
    //   - 任務2: 如果當前節點有 next，那就要處理跨子樹的連接，把當前節點的右節點 next 指向當前節點 next 的左節點
    //      - 當前節點 next 的左節點，就是跨子樹的最左邊的節點
    //      - 因為是「perfect binary tree」，所以可以先不用擔心左、右節點不存在的問題
    while (current !== null) {
      // 任務1
      current.left.next = current.right;

      // 任務2
      if (current.next !== null) {
        current.right.next = current.next.left;
      }

      // 繼續處理這一層剩餘的節點，也就是當前節點右邊的節點
      current = current.next;
    }

    // 移動到下一層最左邊的節點
    leftMost = leftMost.left;
  }

  return root;
  // Time : O(n)
  // Space: O(1)
};
