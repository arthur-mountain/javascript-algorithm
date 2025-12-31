/**
 * Static Array - 標準實作
 *
 * 核心思想：一塊固定大小的連續記憶體，支援 O(1) 隨機存取。
 * 這是最基礎的資料結構，是許多進階資料結構的底層實作。
 *
 * 關鍵不變量：
 * 1. 0 ≤ length ≤ capacity
 * 2. data[0..length-1] 為有效資料
 * 3. capacity 一旦設定就不再改變（這是 Static Array 的定義）
 *
 * 時間複雜度：
 * - get/set: O(1)
 * - insert/delete: O(n)
 * - search: O(n)
 *
 * 空間複雜度：O(capacity)
 */
class StaticArray {
  #data;
  #length;
  #capacity;

  /**
   * 建構子：初始化固定容量的陣列
   * @param {number} capacity - 陣列的最大容量
   */
  constructor(capacity) {
    if (capacity <= 0) {
      throw new RangeError("Capacity must be positive");
    }
    this.#capacity = capacity;
    this.#data = new Array(capacity);
    this.#length = 0;
  }

  /**
   * 隨機存取讀取
   * @param {number} index - 要讀取的位置
   * @returns {*} 該位置的元素
   *
   * 時間複雜度：O(1) - 這是 Array 存在的核心價值
   */
  get(index) {
    // 關鍵：檢查 length 而非 capacity
    if (index < 0 || index >= this.#length) {
      throw new RangeError(`Index ${index} out of bounds [0, ${this.#length})`);
    }
    return this.#data[index];
  }

  /**
   * 隨機存取寫入（覆蓋現有元素）
   * @param {number} index - 要寫入的位置
   * @param {*} element - 要寫入的元素
   *
   * 時間複雜度：O(1)
   */
  set(index, element) {
    // 只能覆蓋已存在的有效元素
    if (index < 0 || index >= this.#length) {
      throw new RangeError(`Index ${index} out of bounds [0, ${this.#length})`);
    }
    this.#data[index] = element;
  }

  /**
   * 在指定位置插入元素
   * @param {number} index - 插入位置 [0, length]
   * @param {*} element - 要插入的元素
   *
   * 關鍵技巧：從後往前移動元素，避免覆蓋尚未移動的資料
   *
   * 時間複雜度：O(n) - 最壞情況需移動所有元素
   */
  insert(index, element) {
    // 檢查是否還有空間
    if (this.#length >= this.#capacity) {
      throw new Error("Array is full");
    }
    // 注意：允許 index === length（等同 append）
    if (index < 0 || index > this.#length) {
      throw new RangeError(`Index ${index} out of bounds [0, ${this.#length}]`);
    }

    // 關鍵：從後往前移動，避免覆蓋
    for (let i = this.#length; i > index; i--) {
      this.#data[i] = this.#data[i - 1];
    }

    this.#data[index] = element;
    this.#length++;
  }

  /**
   * 刪除指定位置的元素
   * @param {number} index - 要刪除的位置
   * @returns {*} 被刪除的元素
   *
   * 時間複雜度：O(n) - 最壞情況需移動所有元素
   */
  delete(index) {
    if (index < 0 || index >= this.#length) {
      throw new RangeError(`Index ${index} out of bounds [0, ${this.#length})`);
    }

    const deleted = this.#data[index];

    // 從前往後移動（與 insert 相反）
    for (let i = index; i < this.#length - 1; i++) {
      this.#data[i] = this.#data[i + 1];
    }

    // 清理最後位置，避免 memory leak
    this.#data[this.#length - 1] = undefined;
    this.#length--;

    return deleted;
  }

  /**
   * 在尾端新增元素（特化的 insert）
   * @param {*} element - 要新增的元素
   *
   * 時間複雜度：O(1) - 不需要移動任何元素
   */
  push(element) {
    if (this.#length >= this.#capacity) {
      throw new Error("Array is full");
    }
    this.#data[this.#length] = element;
    this.#length++;
  }

  /**
   * 移除並回傳尾端元素（特化的 delete）
   * @returns {*} 被移除的元素
   *
   * 時間複雜度：O(1) - 不需要移動任何元素
   */
  pop() {
    if (this.#length === 0) {
      throw new Error("Array is empty");
    }
    const element = this.#data[this.#length - 1];
    this.#data[this.#length - 1] = undefined;
    this.#length--;
    return element;
  }

  /**
   * 線性搜尋元素的位置
   * @param {*} element - 要搜尋的元素
   * @returns {number} 元素的 index，找不到回傳 -1
   *
   * 時間複雜度：O(n) - 必須逐一檢查
   */
  findIndex(element) {
    // 關鍵：只搜尋有效資料區域
    for (let i = 0; i < this.#length; i++) {
      if (this.#data[i] === element) {
        return i;
      }
    }
    return -1;
  }

  /**
   * 檢查元素是否存在
   * @param {*} element - 要檢查的元素
   * @returns {boolean}
   */
  contains(element) {
    return this.findIndex(element) !== -1;
  }

  /** @returns {number} 目前元素數量 */
  size() {
    return this.#length;
  }

  /** @returns {number} 最大容量 */
  capacity() {
    return this.#capacity;
  }

  /** @returns {boolean} 是否已滿 */
  isFull() {
    return this.#length === this.#capacity;
  }

  /** @returns {boolean} 是否為空 */
  isEmpty() {
    return this.#length === 0;
  }

  /**
   * 清空陣列
   * 注意：只重設 length，不實際清理記憶體（效能考量）
   * 如果元素持有大量記憶體引用，應該逐一設為 undefined
   */
  clear() {
    // 清理所有引用，避免 memory leak
    for (let i = 0; i < this.#length; i++) {
      this.#data[i] = undefined;
    }
    this.#length = 0;
  }

  /**
   * 轉換為字串表示（只顯示有效資料）
   * @returns {string}
   */
  toString() {
    const elements = [];
    for (let i = 0; i < this.#length; i++) {
      elements.push(this.#data[i]);
    }
    return "[" + elements.join(", ") + "]";
  }
}

module.exports = { StaticArray };
