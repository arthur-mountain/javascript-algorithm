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
  /** @protected 允許子類別存取 */
  _data;
  _length;
  _capacity;

  /**
   * 建構子：初始化固定容量的陣列
   * @param {number} capacity - 陣列的最大容量
   */
  constructor(capacity) {
    if (capacity <= 0) {
      throw new RangeError("Capacity must be positive");
    }
    this._capacity = capacity;
    this._data = new Array(capacity);
    this._length = 0;
  }

  // ==================== 基礎存取操作 ====================

  /**
   * 隨機存取讀取
   * @param {number} index - 要讀取的位置
   * @returns {*} 該位置的元素
   *
   * 時間複雜度：O(1) - 這是 Array 存在的核心價值
   */
  get(index) {
    // 關鍵：檢查 length 而非 capacity
    if (index < 0 || index >= this._length) {
      throw new RangeError(`Index ${index} out of bounds [0, ${this._length})`);
    }
    return this._data[index];
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
    if (index < 0 || index >= this._length) {
      throw new RangeError(`Index ${index} out of bounds [0, ${this._length})`);
    }
    this._data[index] = element;
  }

  // ==================== 修改操作 ====================

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
    // Static Array 滿了就無法插入
    if (this._length >= this._capacity) {
      throw new Error("Array is full, cannot insert");
    }
    // 允許 index === length，相當於 append
    if (index < 0 || index > this._length) {
      throw new RangeError(`Index ${index} out of bounds [0, ${this._length}]`);
    }

    // 關鍵：從 length 開始往前移動（不是從 capacity！）
    // 這樣才能避免覆蓋尚未移動的元素
    for (let i = this._length; i > index; i--) {
      this._data[i] = this._data[i - 1];
    }

    this._data[index] = element;
    this._length++;
  }

  /**
   * 刪除指定位置的元素
   * @param {number} index - 要刪除的位置
   * @returns {*} 被刪除的元素
   *
   * 關鍵技巧：從前往後移動，將後面的元素依序前移覆蓋被刪除的位置
   *
   * 時間複雜度：O(n) - 最壞情況需移動所有元素
   */
  delete(index) {
    if (index < 0 || index >= this._length) {
      throw new RangeError(`Index ${index} out of bounds [0, ${this._length})`);
    }

    const element = this._data[index];

    // 關鍵：移動範圍是 [index, length-1)，將後面的元素往前移
    for (let i = index; i < this._length - 1; i++) {
      this._data[i] = this._data[i + 1];
    }

    // 清理最後一個位置，幫助垃圾回收
    this._data[--this._length] = undefined;

    return element;
  }

  // ==================== 查詢操作 ====================

  /**
   * 線性搜尋元素的索引
   * @param {*} element - 要搜尋的元素
   * @returns {number} 索引位置，找不到回傳 -1
   *
   * 時間複雜度：O(n)
   */
  findIndex(element) {
    // 關鍵：遍歷 length，不是 capacity！
    for (let i = 0; i < this._length; i++) {
      if (this._data[i] === element) {
        return i;
      }
    }
    return -1;
  }

  /**
   * 搜尋並回傳元素
   * @param {*} element - 要搜尋的元素
   * @returns {*} 找到的元素，找不到回傳 undefined
   */
  find(element) {
    const index = this.findIndex(element);
    return index === -1 ? undefined : this._data[index];
  }

  /**
   * 檢查是否包含某元素
   * @param {*} element - 要檢查的元素
   * @returns {boolean}
   */
  contains(element) {
    return this.findIndex(element) !== -1;
  }

  // ==================== 狀態查詢 ====================

  size() {
    return this._length;
  }

  capacity() {
    return this._capacity;
  }

  isEmpty() {
    return this._length === 0;
  }

  isFull() {
    return this._length === this._capacity;
  }

  // ==================== 工具方法 ====================

  /**
   * 清空陣列（重置 length，不重新分配記憶體）
   */
  clear() {
    // 清理所有有效元素的引用，幫助 GC
    for (let i = 0; i < this._length; i++) {
      this._data[i] = undefined;
    }
    this._length = 0;
  }

  /**
   * 轉換為字串表示（只顯示有效元素）
   */
  toString() {
    const elements = [];
    for (let i = 0; i < this._length; i++) {
      elements.push(this._data[i]);
    }
    return `[${elements.join(", ")}]`;
  }

  /**
   * 支援 for...of 迭代
   *
   * JavaScript 的 for...of 語法會尋找物件的 Symbol.iterator 方法。
   * 這是 JavaScript 的「迭代器協議（Iterator Protocol）」：
   * - 當執行 for (const item of array) 時，JS 引擎會呼叫 array[Symbol.iterator]()
   * - 該方法必須回傳一個「迭代器物件」，具有 next() 方法
   * - 使用 function* 語法（Generator Function）可以自動產生符合協議的迭代器
   * - yield 關鍵字會暫停執行並回傳值，下次呼叫 next() 時從暫停處繼續
   *
   * 為什麼需要自訂？
   * 因為我們的 _data 陣列可能有未使用的空間（capacity > length），
   * 直接迭代 _data 會包含 undefined 的空槽位。
   * 自訂迭代器確保只遍歷 [0, length) 範圍內的有效元素。
   */
  *[Symbol.iterator]() {
    for (let i = 0; i < this._length; i++) {
      yield this._data[i];
    }
  }
}

module.exports = { StaticArray };
