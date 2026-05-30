/**
 * MonotonicQueue - 單調佇列標準實作
 *
 * 核心思想：維護一個存放索引的 deque，透過「尾端淘汰」保持值的單調性，
 * 透過「前端指標 + 定期壓縮」保持索引在有效窗口範圍內且物理空間可控。
 * 佇列前端永遠是當前窗口的極值候選。
 *
 * 時間複雜度：所有操作 O(1) 攤銷（每個元素最多進出佇列各一次）
 * 空間複雜度：O(k)，k 為窗口大小（head 搭配壓縮使物理陣列長度 ≤ 2k）
 */
class MonotonicQueue {
  /**
   * @param {number[]} nums - 原始輸入陣列（佇列透過索引參照此陣列取值）
   * @param {(backVal: number, newVal: number) => boolean} shouldEvict - 淘汰判定函式
   *   回傳 true 表示尾端元素應被淘汰。
   *   - 求最大值（遞減佇列）：(backVal, newVal) => backVal <= newVal
   *   - 求最小值（遞增佇列）：(backVal, newVal) => backVal >= newVal
   */
  constructor(nums, shouldEvict) {
    this.nums = nums;
    this.shouldEvict = shouldEvict;
    this.deque = [];
    // 前端指標：避免 Array.shift() 的 O(n) 搬移成本
    this.head = 0;
  }

  /**
   * push - 將新索引加入佇列尾端，維持單調性
   *
   * @param {number} index - 新元素在 nums 中的索引
   * @return {void}
   *
   * 優化技巧：尾端淘汰（Back Elimination）
   * 新元素加入前，從尾端移除所有被「支配」的舊元素。
   * 被支配 = 值不如新元素，且會更早過期（索引更小）→ 未來任何窗口都不可能是答案。
   *
   * 時間複雜度：O(1) 攤銷 / O(n) 最壞
   * 空間複雜度：O(1)
   */
  push(index) {
    // 尾端淘汰：移除所有被新元素支配的候選
    // 優化關鍵：丟掉「比新元素差又更早過期」的舊元素，查詢極值才能維持 O(1)
    while (
      this.head < this.deque.length &&
      this.shouldEvict(
        this.nums[this.deque[this.deque.length - 1]],
        this.nums[index],
      )
    ) {
      this.deque.pop();
    }
    this.deque.push(index);
  }

  /**
   * popExpired - 移除前端所有過期元素
   *
   * @param {number} leftBound - 窗口左邊界（inclusive），索引 < leftBound 視為過期
   * @return {void}
   *
   * 優化技巧：前端指標（Head Pointer）+ 定期壓縮（Compaction）
   * - 時間：移動 head 取代 Array.shift()（O(n)），單次過期 O(1)。
   * - 空間：只移動指標會讓被跳過的前端元素永遠留在物理陣列（最壞 O(n)）；
   *         故在「垃圾數 ≥ 有效數」時 slice 掉前段回收，物理長度壓回 ≤ 2k。
   *
   * 時間複雜度：O(1) 攤銷 / O(n) 最壞
   * 空間複雜度：O(1) 攤銷
   */
  popExpired(leftBound) {
    // 移動 head 跳過過期索引（不搬移陣列）
    while (this.head < this.deque.length && this.deque[this.head] < leftBound) {
      this.head++;
    }
    // 空間回收：head*2 >= length 等價於「垃圾(head) >= 有效(length - head)」
    // 此時壓縮：搬移量 ≤ 垃圾量，攤銷到先前的 head++ 上，整體仍 O(1) 攤銷
    if (this.head > 0 && this.head * 2 >= this.deque.length) {
      // 注意：slice 只切掉「索引位置」上的垃圾格，deque 內存的原始索引值不變
      this.deque = this.deque.slice(this.head);
      this.head = 0;
    }
  }

  /**
   * front - 取得佇列前端索引（當前窗口極值的索引）
   *
   * @return {number | undefined} 前端元素的索引；空佇列回傳 undefined
   *
   * 無優化空間：單調性保證前端即極值，一次直接索引存取即得，已是最優。
   *
   * 時間複雜度：O(1)
   * 空間複雜度：O(1)
   */
  front() {
    // Edge case: 空佇列回傳 undefined，由呼叫端處理
    if (this.isEmpty()) return undefined;
    return this.deque[this.head];
  }

  /**
   * frontValue - 取得佇列前端索引對應的「值」（當前窗口極值本身）
   *
   * @return {number | undefined} nums[front()]；空佇列回傳 undefined
   *
   * 無優化空間：僅在 front() 之上做一次取值，已是最優。
   * 提供此方法是為了避免呼叫端誤把 front() 回傳的「索引」當成「值」。
   *
   * 時間複雜度：O(1)
   * 空間複雜度：O(1)
   */
  frontValue() {
    const idx = this.front();
    return idx !== undefined ? this.nums[idx] : undefined;
  }

  /**
   * isEmpty - 判斷佇列是否為空
   *
   * @return {boolean}
   *
   * 無優化空間：純指標比較，一步得出，已是最優。
   *
   * 時間複雜度：O(1)
   * 空間複雜度：O(1)
   */
  isEmpty() {
    return this.head >= this.deque.length;
  }

  /**
   * size - 回傳有效元素數量
   *
   * @return {number}
   *
   * 無優化空間：純指標運算，一步得出，已是最優。
   *
   * 時間複雜度：O(1)
   * 空間複雜度：O(1)
   */
  size() {
    return this.deque.length - this.head;
  }
}

/**
 * 工廠函式：建立 Monotonic Decreasing Queue（求窗口最大值）
 * 佇列中的值由前到後遞減，front() 永遠是最大值的索引
 *
 * @param {number[]} nums - 原始輸入陣列
 * @return {MonotonicQueue}
 */
function createMaxQueue(nums) {
  // 尾端值 <= 新值時淘汰（非嚴格：相同值保留較新的，存活更久，避免過早無候選）
  return new MonotonicQueue(nums, (backVal, newVal) => backVal <= newVal);
}

/**
 * 工廠函式：建立 Monotonic Increasing Queue（求窗口最小值）
 * 佇列中的值由前到後遞增，front() 永遠是最小值的索引
 *
 * @param {number[]} nums - 原始輸入陣列
 * @return {MonotonicQueue}
 */
function createMinQueue(nums) {
  // 尾端值 >= 新值時淘汰（非嚴格：相同值保留較新的）
  return new MonotonicQueue(nums, (backVal, newVal) => backVal >= newVal);
}

module.exports = { MonotonicQueue, createMaxQueue, createMinQueue };
