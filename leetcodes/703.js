/**
 * Status:
 *    - [x] Done
 *    - [x] Follow-up solutions
 *
 * Title:
 *    703. Kth Largest Element in a Stream
 *
 * Topics:
 *    1. Tree
 *    2. Design
 *    3. Binary Search Tree
 *    4. Heap (Priority Queue)
 *    5. Binary Tree
 *    6. Data Stream
 *
 * Statements:
 * - k, representing the kth largest element
 * - nums, representing the stream of nums
 * - return the kth largest element after the num added
 *
 * Solution by myself:
 * 1. Sorting after insertion. time: O(n * nlogn) -> O(n**2), space: O(n)
 *    - Might be TLE
 * 2. MinHeap -> time: O((M*logk + N*logk) -> O((M+N)*logk), space: O(k)
 *    - Using min-heap, maintain kth elements, if size > k, dequeue element
 *    - case only the bigger val affect kth elements position
 *    - so we could ignore the smaller element
 *    - M is the initial size of nums in constructor
 *    - N is the time of add calls
 * 3. BST -> time: O((M*logM + N*logN)), space: O(M + N)
 *    - 使用 Binary Search Tree(BST) 來儲存所有元素，並在每個節點記錄該節點為根的子樹大小
 *    - 插入新元素時更新該大小，因而能快速定位第 k 大元素
 *    - 查找第 k 大時，利用右子樹大小決定往哪個子樹走，時間複雜度平均為 O(logn)
 *    - 不過因為非平衡樹結構，最壞情況可能退化到 O(n)
 *    - 相較於 min-heap，BST 儲存所有元素，空間需求較大且指針構造使空間效率較低
 *    - min-heap 實作在陣列中，空間連續，插入/刪除穩定 O(logk)，空間使用更省
 *
 * Constraints:
 *    1. 0 <= nums.length <= 10**4
 *    2. 1 <= k <= nums.length + 1
 *    3. -10**4 <= nums[i] <= 10**4
 *    4. -10**4 <= val <= 10**4
 *    5. At most 10**4 calls will be made to add.
 **/

/* solution2 using MinHeap*/
{
  /**
   * @param {number} k
   * @param {number[]} nums
   */
  var KthLargest = function (k, nums) {
    this.k = k;
    this.minHeap = MinPriorityQueue.fromArray(nums);
  };

  /**
   * @param {number} val
   * @return {number}
   */
  KthLargest.prototype.add = function (val) {
    this.minHeap.enqueue(val);
    while (this.minHeap.size() > this.k) {
      this.minHeap.dequeue();
    }
    return this.minHeap.front();
  };

  /**
   * Your KthLargest object will be instantiated and called as such:
   * var obj = new KthLargest(k, nums)
   * var param_1 = obj.add(val)
   */

  // Time : O((M*logk + N*logk) -> O((M+N)*logk)
  // Space: O(k)
}

/* solution2 using MinHeap 版本二，差別在 add method, 不像 Solution1 先 enqueue 再來維護 min heap size*/
{
  /**
   * @param {number} k
   * @param {number[]} nums
   */
  var KthLargest = function (k, nums) {
    this.k = k;
    this.minHeap = MinPriorityQueue.fromArray(nums);
  };

  /**
   * @param {number} val
   * @return {number}
   */
  KthLargest.prototype.add = function (val) {
    this.minHeap.enqueue(val);
    while (this.minHeap.size() > this.k) {
      this.minHeap.dequeue();
    }
    return this.minHeap.front();
  };

  /**
   * Your KthLargest object will be instantiated and called as such:
   * var obj = new KthLargest(k, nums)
   * var param_1 = obj.add(val)
   */

  // Time : O((M*logk + N*logk) -> O((M+N)*logk)
  // Space: O(k)
}

/* Solution3 using BST */
{
  // 次佳解，時間和空間複雜度與 min-heap 相近，但因為 BST 使用指針連結，非完全樹結構下空間效率不及 min-heap
  //
  // BST 利用左子樹小於節點、右子樹大於節點的特性，並在節點中記錄子樹大小(包含自己)。
  //
  // 查找時，透過節點中記錄的個數，先找右子樹(較大，因為要找第K大的元素)，沒找到再往左找(記得減去右子樹、當前節點進而得到往左子樹走時的 K 值)。
  //
  // 詳情參考註解
  class TreeNode {
    constructor(val) {
      this.val = val;
      this.left = null;
      this.right = null;
      this.size = 1; // 該節點為根的子樹節點數量（包含自己）
    }
  }

  // 節點類別：存放值、左右子節點及子樹大小，輔助維護BST結構與快速排名查找
  class KthLargest {
    /**
     * 初始化 KthLargest
     * @param {number} k - 代表第 k 大元素
     * @param {number[]} nums - 初始數字串流
     * 將初始nums插入自訂BST並維護子樹大小，用以快速尋找第 k 大元素
     */
    constructor(k, nums) {
      this.k = k;
      this.root = null;
      for (let n of nums) {
        this.root = this.insert(this.root, n);
      }
    }

    /**
     * 在BST中插入節點，並更新路徑上所有節點的子樹大小
     * @param {TreeNode|null} node - 當前節點
     * @param {number} val - 要插入的值
     * @return {TreeNode} 回傳更新後的節點（可能是新加入的節點或原節點）
     */
    insert(node, val) {
      if (!node) return new TreeNode(val);

      if (val > node.val) {
        node.right = this.insert(node.right, val);
      } else {
        node.left = this.insert(node.left, val);
      }

      // 更新當前節點的子樹大小 = 自己 + 左子樹大小 + 右子樹大小
      node.size = 1 + this.getSize(node.left) + this.getSize(node.right);

      return node;
    }

    /**
     * 取得節點的子樹大小
     * @param {TreeNode|null} node
     * @return {number} 子樹大小，null節點回傳0
     */
    getSize(node) {
      return node ? node.size : 0;
    }

    /**
     * 利用子樹大小資訊找出BST中第 k 大元素
     * 透過右子樹大小判斷第k大元素是否在右子樹、當前節點或左子樹
     * @param {TreeNode|null} node - 當前節點
     * @param {number} k - 第 k 大的排名
     * @return {number|null} 第 k 大元素的值
     */
    findKthLargest(node, k) {
      if (!node) return null;

      const rightSize = this.getSize(node.right);

      if (rightSize + 1 === k) {
        return node.val; // 當右子樹大小 + 1 等於 k，表示當前節點即為第k大元素
      } else if (rightSize >= k) {
        // 第 k 大在右子樹中，往右子樹查找
        return this.findKthLargest(node.right, k);
      } else {
        // 第 k 大在左子樹，扣除右子樹和當前節點的排名後往左子樹查找
        return this.findKthLargest(node.left, k - rightSize - 1);
      }
    }

    /**
     * 新增新的數字至BST，並返回更新後的第 k 大元素
     * @param {number} val - 新插入的數字
     * @return {number} 更新後的第 k 大元素
     */
    add(val) {
      this.root = this.insert(this.root, val);
      return this.findKthLargest(this.root, this.k);
    }
  }

  /**
   * 使用示例：
   * var obj = new KthLargest(k, nums)
   * var param_1 = obj.add(val)
   */
  // 範例測試
  // const kthLargest = new KthLargest(3, [4, 5, 8, 2]);
  // console.log(kthLargest.add(3));  // 輸出4
  // console.log(kthLargest.add(5));  // 輸出5
  // console.log(kthLargest.add(10)); // 輸出5
  // console.log(kthLargest.add(9));  // 輸出8
  // console.log(kthLargest.add(4));  // 輸出8
}
