/**
 * Priority Queue - 基於 Binary Heap 的標準實作
 *
 * 核心思想：
 * Priority Queue 是一個抽象資料型別 (ADT)，定義「永遠能取出最高優先級元素」的行為。
 * 本實作使用 Binary Heap 作為底層資料結構，提供 O(log n) 的 enqueue/dequeue。
 *
 * ADT vs 資料結構：
 * - Priority Queue 是 ADT：定義「什麼操作要做什麼」(行為契約)
 * - Binary Heap 是資料結構：定義「如何實作這些操作」(具體實現)
 *
 * 時間複雜度：
 * - enqueue: O(log n) - bubble up
 * - dequeue: O(log n) - bubble down
 * - peek: O(1) - 直接存取 root
 *
 * 空間複雜度：O(n)
 */

const { MinHeap, MaxHeap } = require("../../Heap");

/**
 * 通用 Priority Queue 類別
 * 支援自訂比較函數，可作為 Min PQ 或 Max PQ 使用
 */
class PriorityQueue {
  /**
   * 建構 Priority Queue
   *
   * @param {Object} options - 配置選項
   * @param {Function} options.comparator - 比較函數 (a, b) => number
   *   - 回傳負數：a 優先級較高（應該先被取出）
   *   - 回傳正數：b 優先級較高
   *   - 回傳 0：優先級相同
   * @param {'min'|'max'} options.type - 佇列類型
   *   - 'min': 最小值優先（預設）
   *   - 'max': 最大值優先
   *
   * @example
   * // Min PQ：數字越小優先
   * const minPQ = new PriorityQueue({ type: 'min' });
   *
   * @example
   * // Max PQ：數字越大優先
   * const maxPQ = new PriorityQueue({ type: 'max' });
   *
   * @example
   * // 自訂 comparator：依物件的 priority 欄位
   * const customPQ = new PriorityQueue({
   *   comparator: (a, b) => a.priority - b.priority
   * });
   */
  constructor({ comparator = (a, b) => a - b, type = "min" } = {}) {
    // 儲存 comparator 供後續使用（如 clear 時重建）
    this._comparator = comparator;
    this._type = type;

    // 根據類型選擇底層 Heap
    // 關鍵：Heap 的 comparator 決定了「誰會在 root」
    // Min Heap: 最小值在 root → 適合 Min Priority Queue
    // Max Heap: 最大值在 root → 適合 Max Priority Queue
    this._heap =
      type === "max" ? new MaxHeap(comparator) : new MinHeap(comparator);
  }

  /**
   * 將元素加入佇列
   *
   * @param {*} element - 要加入的元素
   * @return {PriorityQueue} 回傳 this，支援鏈式呼叫
   *
   * 演算法流程：
   * 1. 將元素放到陣列末端（Complete Binary Tree 的下一個位置）
   * 2. 執行 bubble up：與父節點比較，若優先級較高則交換
   * 3. 重複直到滿足 Heap Property
   *
   * 時間複雜度：O(log n)
   * - 最壞情況：新元素優先級最高，需要 bubble up 到 root
   * - 樹高為 log n，所以最多 log n 次比較和交換
   *
   * 空間複雜度：O(1)
   * - 只需要常數額外空間
   */
  enqueue(element) {
    // 委託給 Heap 的 insert 方法
    // Heap 內部會自動執行 bubble up 維持 Heap Property
    this._heap.insert(element);
    return this;
  }

  /**
   * 移除並回傳優先級最高的元素
   *
   * @return {*} 優先級最高的元素，若佇列為空則回傳 undefined
   *
   *
   * 時間複雜度：O(log n)
   * - 最壞情況：填補的元素優先級最低，需要 bubble down 到葉節點
   *
   * 空間複雜度：O(1)
   */
  dequeue() {
    // 委託給 Heap 的 extract 方法
    // Heap 內部會自動執行 bubble down 維持 Heap Property
    return this._heap.extract();
  }

  /**
   * 查看（但不移除）優先級最高的元素
   *
   * @return {*} 優先級最高的元素，若佇列為空則回傳 undefined
   *
   * 時間複雜度：O(1)
   * - Heap Property 保證極值永遠在 root（index 0）
   *
   * 空間複雜度：O(1)
   */
  peek() {
    return this._heap.peek();
  }

  /**
   * 回傳佇列中的元素數量
   *
   * @return {number} 元素數量
   *
   * 時間複雜度：O(1)
   */
  size() {
    return this._heap.size();
  }

  /**
   * 檢查佇列是否為空
   *
   * @return {boolean} 若為空則回傳 true
   *
   * 時間複雜度：O(1)
   */
  isEmpty() {
    return this._heap.size() === 0;
  }

  /**
   * 清空佇列
   *
   * @return {PriorityQueue} 回傳 this，支援鏈式呼叫
   *
   * 時間複雜度：O(1) 或 O(n)，取決於 Heap 的實作
   */
  clear() {
    if (typeof this._heap.clear === "function") {
      this._heap.clear();
    } else {
      // Fallback：重新建立空 heap
      this._heap =
        this._type === "max"
          ? new MaxHeap(this._comparator)
          : new MinHeap(this._comparator);
    }
    return this;
  }

  /**
   * 將佇列轉換為陣列
   *
   * ⚠️ 注意：回傳的陣列順序是 Heap 的內部順序，不是優先級順序！
   * 若需要依優先級排序的結果，必須重複呼叫 dequeue。
   *
   * @return {Array} 包含所有元素的陣列（淺拷貝）
   *
   * 時間複雜度：O(n)
   */
  toArray() {
    // 優先使用 Heap 的 toArray 方法（若有實作）
    if (typeof this._heap.toArray === "function") {
      return this._heap.toArray();
    }
    // Fallback：直接複製內部陣列
    return [...this._heap.data];
  }

  /**
   * 依優先級順序取出所有元素
   *
   * ⚠️ 注意：此操作會清空佇列！
   *
   * @return {Array} 依優先級排序的陣列
   *
   * 時間複雜度：O(n log n)
   * - 每次 dequeue 是 O(log n)，共 n 次
   */
  toSortedArray() {
    const result = [];
    while (!this.isEmpty()) {
      result.push(this.dequeue());
    }
    return result;
  }

  /**
   * 從陣列批量建構 Priority Queue
   *
   * @param {Array} array - 要加入的元素陣列
   * @return {PriorityQueue} 回傳 this，支援鏈式呼叫
   *
   * 時間複雜度：O(n)
   * - 使用 Floyd's heapify 演算法，而非 O(n log n) 逐一插入
   * - 關鍵洞察：大部分節點在底層，但底層幾乎不用動
   */
  fromArray(array) {
    if (typeof this._heap.heapify === "function") {
      this._heap.heapify(array);
    } else {
      // Fallback：逐一插入（O(n log n)）
      for (const element of array) {
        this.enqueue(element);
      }
    }
    return this;
  }

  /**
   * 實作 iterable protocol，允許 for...of 遍歷
   *
   * ⚠️ 注意：遍歷順序是 Heap 內部順序，不是優先級順序
   *
   * @example
   * for (const item of pq) {
   *   console.log(item); // 順序不保證
   * }
   */
  [Symbol.iterator]() {
    return this.toArray()[Symbol.iterator]();
  }

  /**
   * 便於 debugging 的字串表示
   *
   * @return {string} 佇列的字串表示
   */
  toString() {
    const type = this._type === "max" ? "Max" : "Min";
    return `${type}PriorityQueue(${this.size()}) [${this.toArray().join(", ")}]`;
  }
}

/**
 * Min Priority Queue
 *
 * 數字越小優先（或 comparator 回傳負數的元素優先）
 *
 * @example
 * const pq = new MinPriorityQueue();
 * pq.enqueue(5).enqueue(3).enqueue(7);
 * pq.dequeue(); // 3（最小的先出來）
 *
 * @example
 * // 物件比較
 * const pq = new MinPriorityQueue((a, b) => a.priority - b.priority);
 * pq.enqueue({ task: 'A', priority: 5 });
 * pq.enqueue({ task: 'B', priority: 1 });
 * pq.dequeue(); // { task: 'B', priority: 1 }
 */
class MinPriorityQueue extends PriorityQueue {
  constructor(comparator = (a, b) => a - b) {
    super({ comparator, type: "min" });
  }
}

/**
 * Max Priority Queue
 *
 * 數字越大優先（或 comparator 回傳正數的元素優先）
 *
 * @example
 * const pq = new MaxPriorityQueue();
 * pq.enqueue(5).enqueue(3).enqueue(7);
 * pq.dequeue(); // 7（最大的先出來）
 *
 * @example
 * // 物件比較
 * const pq = new MaxPriorityQueue((a, b) => a.score - b.score);
 * pq.enqueue({ player: 'A', score: 100 });
 * pq.enqueue({ player: 'B', score: 250 });
 * pq.dequeue(); // { player: 'B', score: 250 }
 */
class MaxPriorityQueue extends PriorityQueue {
  constructor(comparator = (a, b) => a - b) {
    super({ comparator, type: "max" });
  }
}

export { PriorityQueue, MinPriorityQueue, MaxPriorityQueue };
