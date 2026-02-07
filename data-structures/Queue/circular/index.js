/**
 * Circular Queue - 固定容量標準實作
 *
 * 核心思想：使用環狀陣列實現 O(1) 的 enqueue/dequeue，
 * 透過 % capacity 讓索引自動環繞，避免元素搬移。
 * 固定容量適用於記憶體受限或需要可預測行為的場景。
 *
 * 狀態設計：
 * - front = rear = -1 表示空佇列
 * - front 指向第一個元素（dequeue 位置）
 * - rear 指向最後一個元素（最近 enqueue 的位置）
 * - 滿的判斷：(rear + 1) % capacity === front
 *
 * 時間複雜度：所有操作 O(1)
 * 空間複雜度：O(capacity)
 */
class CircularQueue {
  #queue;
  #capacity;
  #front;
  #rear;

  /**
   * 初始化固定容量的環狀佇列
   * @param {number} capacity - 佇列最大容量
   */
  constructor(capacity) {
    this.#queue = new Array((this.#capacity = capacity));
    this.#front = this.#rear = -1; // -1 表示空狀態
  }

  /**
   * 將元素加入佇列尾端
   * @param {*} item - 要加入的元素
   * @return {boolean} - 是否成功加入（滿時回傳 false）
   *
   * 邏輯分支：
   * 1. 已滿 → 回傳 false
   * 2. 空佇列 → front 和 rear 都設為 0
   * 3. 非空 → rear 環狀遞增
   *
   * 關鍵：用 % capacity 處理環繞，讓 rear 從尾端回到開頭
   *
   * 時間複雜度：O(1)
   * 空間複雜度：O(1)
   */
  enqueue(item) {
    // 步驟 1：檢查是否已滿
    if (this.isFull()) {
      return false;
    }

    // 步驟 2：處理空佇列的特殊情況
    if (this.isEmpty()) {
      // 空佇列：front 和 rear 都指向 index 0
      this.#front = this.#rear = 0;
    } else {
      // 非空：rear 環狀遞增
      // 關鍵：% capacity 讓 index 從 capacity-1 繞回 0
      this.#rear = (this.#rear + 1) % this.#capacity;
    }

    // 步驟 3：放入元素
    this.#queue[this.#rear] = item;

    return true;
  }

  /**
   * 移除並回傳佇列前端元素
   * @return {*} - 隊首元素，空時回傳 null
   *
   * 邏輯分支：
   * 1. 空佇列 → 回傳 null
   * 2. 最後一個元素（front === rear）→ 重置為空狀態
   * 3. 非最後一個 → front 環狀遞增
   *
   * 關鍵：移除最後一個元素時必須重置為 -1，否則狀態錯亂
   *
   * 時間複雜度：O(1)
   * 空間複雜度：O(1)
   */
  dequeue() {
    // 步驟 1：檢查是否為空
    if (this.isEmpty()) {
      return null;
    }

    // 步驟 2：取出元素
    const item = this.#queue[this.#front];

    // 步驟 3：更新 front 指標
    if (this.#front === this.#rear) {
      // 關鍵：這是最後一個元素，重置為空狀態
      // 若不重置，isEmpty() 和 isFull() 的判斷會出錯
      this.#front = this.#rear = -1;
    } else {
      // 環狀遞增 front
      this.#front = (this.#front + 1) % this.#capacity;
    }

    return item;
  }

  /**
   * 查看佇列前端元素但不移除
   * @return {*} - 隊首元素，空時回傳 null
   *
   * 時間複雜度：O(1)
   * 空間複雜度：O(1)
   */
  peek() {
    return this.isEmpty() ? null : this.#queue[this.#front];
  }

  /**
   * 檢查佇列是否為空
   * @return {boolean}
   *
   * 空的定義：front === -1
   * 這發生在：初始狀態，或 dequeue 完最後一個元素後
   *
   * 時間複雜度：O(1)
   * 空間複雜度：O(1)
   */
  isEmpty() {
    return this.#front === -1;
  }

  /**
   * 檢查佇列是否已滿
   * @return {boolean}
   *
   * 滿的定義：rear 的下一格就是 front（環狀思考）
   *
   * 視覺化：
   *      front              rear
   *        ↓                 ↓
   *   [A]  [B]  [C]  [D]  [E]  [ ]
   *    0    1    2    3    4    5
   *
   *   (rear + 1) % capacity = (4 + 1) % 6 = 5 ≠ 0 (front) → 未滿
   *
   *      front                   rear
   *        ↓                      ↓
   *   [A]  [B]  [C]  [D]  [E]  [F]
   *    0    1    2    3    4    5
   *
   *   (rear + 1) % capacity = (5 + 1) % 6 = 0 = front → 已滿
   *
   * 時間複雜度：O(1)
   * 空間複雜度：O(1)
   */
  isFull() {
    return this.#front === (this.#rear + 1) % this.#capacity;
  }

  /**
   * 回傳目前元素數量
   * @return {number}
   *
   * 環狀計算公式：((rear - front + capacity) % capacity) + 1
   *
   * 為什麼這樣算：
   * - 正常情況（rear >= front）：rear - front + 1 = 元素數
   * - 環繞情況（rear < front）：需要 + capacity 修正負數
   * - 統一公式：加 capacity 再 mod，處理兩種情況
   * - 最後 + 1：因為 front 和 rear 都是 inclusive
   *
   * 範例：
   * capacity = 6, front = 4, rear = 1（環繞）
   * 元素：index 4, 5, 0, 1 → 共 4 個
   * 計算：((1 - 4 + 6) % 6) + 1 = (3 % 6) + 1 = 4 ✓
   *
   * 時間複雜度：O(1)
   * 空間複雜度：O(1)
   */
  size() {
    if (this.isEmpty()) return 0;
    return ((this.#rear - this.#front + this.#capacity) % this.#capacity) + 1;
  }
}

module.exports = { CircularQueue };
