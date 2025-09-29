/**
 * Status:
 *    - [x] Done
 *    - [ ] Follow-up solutions
 *
 * Title:
 *    108. Convert Sorted Array to Binary Search Tree
 *
 * Topics:
 *    1. Array
 *    2. Divide and Conquer
 *    3. Tree
 *    4. Binary Search Tree
 *    5. Binary Tree
 *
 * Statements:
 * Convert the array into height-balanced binary search tree.
 *
 * - The height-balanced means -> 當前節點其左右子樹的高度差不得大於1
 * - The binary search tree means -> 左子樹一定小於根節點、右子樹一定大於根節點
 *
 * Constraints:
 *    1. 1 <= nums.length <= 10**4
 *    2. -10**4 <= nums[i] <= 10**4
 *    3. nums is sorted in a <strong>strictly increasing</strong> order.
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
   * @param {number[]} nums
   * @return {TreeNode}
   */
  var sortedArrayToBST = function (nums) {
    // ## Context:
    // 1. A sorted in ascending order array
    //
    // ## Requirements:
    // Convert the array into height-balanced binary search tree.
    //
    // The height-balanced means，當前節點其左右子樹的高度差不得大於1
    // The binary search tree means，左子樹一定小於根節點、右子樹一定大於根節點
    //
    // ## Solutions:
    // 從中間切半，切分出左右子樹，分而治之處理，先建立小子樹後，再合併成大子樹
    //
    // 遞：不斷從中間切分，直到只有一個陣列長度小於等於 3 時，以中間節點為根節點建立子樹後，回傳根節點
    // 歸：將當前節點接上左、右子樹
    //
    // ## Dry Run:
    // - [-10,-3,0,5,9] -> [-10, -3], [0], [5, 9]
    //   - [-10, -3] -> 陣列長度小於等於 3，以 -3 為根節點建立子樹，-3 前一個數字為左節點，後一個數字為右節眼
    //   - [5, 9]    -> 陣列長度小於等於 3，以 9  為根節點建立子樹，9  前一個數字為左節點，後一個數字為右節眼
    // - 以 0 為根節點，接上左子樹、右子樹後回傳
    //
    // ## Complexity:
    // Time : O(nlogn) -> slice 複製陣列 * 每次遞迴半顆樹(樹的高度)
    // Space: O(nlogn) -> slice 複製陣列 * 每次遞迴半顆樹(樹的高度)

    // Base case: 當陣列長度小於等於 3 時，以中間數字為根節點組成子樹
    if (nums.length <= 3) {
      const midIndex = Math.floor(nums.length / 2);
      return new TreeNode(
        nums[midIndex],
        nums[midIndex - 1] == null ? null : new TreeNode(nums[midIndex - 1]),
        nums[midIndex + 1] == null ? null : new TreeNode(nums[midIndex + 1]),
      );
    }

    // 陣列長度大於 3 時，分而治之，從中間切分子樹
    // TODO: 目前透過 slice 複製陣列，後續可以透過左右指針得方式避免空間上的消耗
    const midIndex = Math.floor(nums.length / 2);
    const left = nums.slice(0, midIndex);
    const right = nums.slice(midIndex + 1);
    return new TreeNode(
      nums[midIndex],
      sortedArrayToBST(left),
      sortedArrayToBST(right),
    );
  };
}
