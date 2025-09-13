/**
 * Status:
 *    - [x] Done
 *    - [ ] Follow-up solutions
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
 * 2. Priority queue -> time: O((M*logk + N*logk) -> O((M+N)*logk), space: O(k)
 *    - Using min-heap, matain kth elements, if size > k, dequeue element
 *    - case only the bigger val effect kth elements position
 *    - so we could ignore the smaller element
 *    - M is the initial size of nums in constructor
 *    - N is the time of add calls
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
