const { StaticArray } = require("../static-array");

/**
 * Dynamic Array - 標準實作（繼承自 StaticArray）
 *
 * 核心思想：在 Static Array 基礎上增加自動擴縮容，
 * 透過「容量倍增策略」實現 push 操作的 O(1) 攤銷時間複雜度。
 *
 * 繼承架構的優點：
 * 1. 複用 StaticArray 的基礎操作（get, set, findIndex 等）
 * 2. 只需 override 涉及容量管理的操作（insert, delete）
 * 3. 新增 Dynamic Array 特有的操作（push, pop, resize）
 *
 * 關鍵不變量：
 * 1. 0 ≤ length ≤ capacity（繼承自 StaticArray）
 * 2. data[0..length-1] 為有效資料（繼承自 StaticArray）
 * 3. capacity ≥ initialCapacity（不會縮到比初始更小）
 * 4. 擴容時 capacity *= growthFactor
 * 5. 縮容時 capacity /= growthFactor（當 length ≤ capacity/4）
 *
 * 時間複雜度：
 * - get/set: O(1)（繼承）
 * - push/pop: O(1) 攤銷
 * - insert/delete (中間): O(n)
 * - search: O(n)（繼承）
 *
 * 空間複雜度：O(capacity)，最壞情況 capacity ≈ 4 × length
 */
class DynamicArray extends StaticArray {
  /** @private 初始容量，作為縮容的下限 */
  #initialCapacity;

  /** @private 擴縮容因子，預設為 2（翻倍/減半） */
  #growthFactor;

  /**
   * 建構子：初始化動態陣列
   * @param {number} [initialCapacity=8] - 初始容量
   * @param {number} [growthFactor=2] - 擴縮容因子
   *
   * 關於 growthFactor 的選擇：
   * - 2（翻倍）：最常見，攤銷分析簡單，但可能浪費較多空間
   * - 1.5：Java ArrayList 使用，空間效率較好但擴容更頻繁
   * - 黃金比例 φ ≈ 1.618：某些實作的選擇，平衡空間與時間
   */
  constructor(initialCapacity = 8, growthFactor = 2) {
    // 呼叫父類別建構子，初始化底層 Static Array
    super(initialCapacity);

    if (growthFactor <= 1) {
      throw new RangeError("Growth factor must be greater than 1");
    }

    this.#initialCapacity = initialCapacity;
    this.#growthFactor = growthFactor;
  }

  // ==================== 私有方法 ====================

  /**
   * 內部擴縮容操作
   * @param {number} newCapacity - 新容量
   *
   * 時間複雜度：O(n)，其中 n = length
   * 空間複雜度：O(n)，需要臨時陣列
   */
  #resize(newCapacity) {
    // 前置條件：新容量必須能容納所有現有元素
    if (newCapacity < this._length) {
      throw new Error(
        `New capacity ${newCapacity} cannot hold ${this._length} elements`,
      );
    }

    // Step 1: 建立新的記憶體區塊
    const newData = new Array(newCapacity);

    // Step 2: 複製所有有效元素
    // 關鍵：只複製 length 個元素，不是 capacity 個！
    // 這避免了不必要的複製操作
    for (let i = 0; i < this._length; i++) {
      newData[i] = this._data[i];
    }

    // Step 3: 替換引用並更新 capacity
    this._data = newData;
    this._capacity = newCapacity;
  }

  /**
   * 檢查是否需要擴容，如需要則執行
   *
   * 觸發條件：length === capacity（陣列已滿）
   * 擴容策略：capacity *= growthFactor
   */
  #ensureCapacity() {
    if (this.isFull()) {
      this.#resize(Math.floor(this._capacity * this.#growthFactor));
    }
  }

  /**
   * 檢查是否需要縮容，如需要則執行
   *
   * 縮容策略詳解：
   *
   * 觸發條件：length ≤ capacity / 4
   * 縮容目標：capacity / 2
   * 額外限制：縮容後不小於 initialCapacity
   *
   * 為什麼是 capacity/4 觸發、縮到 capacity/2？
   *
   * 這是為了避免「抖動（Thrashing）」現象：
   *
   * 【錯誤策略】如果用 capacity/2 觸發、縮到 capacity/2：
   *   狀態：length=4, capacity=8
   *   → pop() → length=3, 觸發縮容 → capacity=4
   *   → push() → length=4, 觸發擴容 → capacity=8
   *   → pop() → length=3, 觸發縮容 → capacity=4
   *   ... 每次操作都是 O(n)！
   *
   * 【正確策略】用 capacity/4 觸發、縮到 capacity/2：
   *   狀態：length=4, capacity=8
   *   → pop() → length=3, 不觸發（3 > 8/4=2）
   *   → pop() → length=2, 觸發縮容 → capacity=4
   *   狀態：length=2, capacity=4（使用率 50%）
   *   → push() → length=3, 不觸發
   *   → push() → length=4, 觸發擴容 → capacity=8
   *
   * 關鍵洞察：
   * - 縮容後，使用率 = (capacity/4) / (capacity/2) = 50%
   * - 這意味著縮容後還有 50% 的緩衝空間
   * - 要再次縮容，需要再 pop 掉一半的元素
   * - 要擴容，需要 push 到滿
   * - 兩個方向都有足夠緩衝，避免邊界震盪
   */
  #tryShrink() {
    const newCapacity = Math.floor(this._capacity / this.#growthFactor);

    // 三個條件都滿足才縮容：
    // 1. 陣列非空（空陣列不需要縮容）
    // 2. length ≤ capacity/4（使用率過低）
    // 3. 縮容後不小於初始容量（維持最小空間）
    if (
      this._length > 0 &&
      this._length <= this._capacity / 4 &&
      newCapacity >= this.#initialCapacity
    ) {
      this.#resize(newCapacity);
    }
  }

  // ==================== 動態操作（Dynamic Array 的核心） ====================

  /**
   * 尾部新增元素
   * @param {*} element - 要新增的元素
   *
   * 優化技巧：容量倍增策略（Capacity Doubling）
   *
   * 透過每次擴容時容量乘以 growthFactor，將擴容成本攤銷到後續的 push 操作中。
   *
   * 攤銷分析（以 growthFactor=2 為例）：
   * - 對於 n 個 push 操作，擴容發生在第 1, 2, 4, 8, 16, ... 個元素時
   * - 總複製成本 = 1 + 2 + 4 + ... + n/2 = n - 1 < n
   * - 總放入成本 = n
   * - 總成本 < 2n
   * - 攤銷成本 = O(2n/n) = O(1)
   *
   * 時間複雜度：O(1) 攤銷，最壞 O(n)（觸發擴容時）
   * 空間複雜度：O(1) 攤銷，最壞 O(n)（擴容需要新陣列）
   */
  push(element) {
    // Step 1: 確保有足夠空間（必要時自動擴容）
    this.#ensureCapacity();

    // Step 2: 放入元素並更新 length
    // 直接操作父類別的 protected 成員，避免不必要的邊界檢查
    this._data[this._length++] = element;
  }

  /**
   * 尾部移除並回傳元素
   * @returns {*} 被移除的元素
   *
   * 優化技巧：容量縮減策略（Capacity Shrinking）
   *
   * 當使用率過低時（length ≤ capacity/4），自動縮容為 capacity/2。
   * 使用 1/4 作為觸發閾值而非 1/2，是為了避免在邊界反覆 push/pop 時
   * 造成頻繁的擴縮容（抖動現象）。
   *
   * 縮容後的使用率 = (capacity/4) / (capacity/2) = 50%
   * 這確保縮容後還有足夠的緩衝空間，不會立即因為 push 而再次擴容。
   *
   * 時間複雜度：O(1) 攤銷，最壞 O(n)（觸發縮容時）
   * 空間複雜度：O(1) 攤銷
   */
  pop() {
    if (this.isEmpty()) {
      throw new Error("Cannot pop from empty array");
    }

    // Step 1: 取出最後一個元素
    const element = this._data[this._length - 1];

    // Step 2: 清理引用並更新 length
    // 設為 undefined 幫助 JavaScript 的垃圾回收器回收該物件
    this._data[--this._length] = undefined;

    // Step 3: 檢查是否需要縮容
    this.#tryShrink();

    return element;
  }

  /**
   * 在指定位置插入元素（Override 父類別方法）
   * @param {number} index - 插入位置 [0, length]
   * @param {*} element - 要插入的元素
   *
   * 與 StaticArray.insert 的差異：
   * - StaticArray：滿了就拋出錯誤
   * - DynamicArray：滿了會自動擴容
   *
   * 優化技巧：容量倍增策略
   * 在插入前先確保有足夠空間，必要時自動擴容。
   *
   * 時間複雜度：O(n)（元素移動） + O(1) 攤銷（擴容）
   */
  insert(index, element) {
    // 允許 index === length，相當於 push
    if (index < 0 || index > this._length) {
      throw new RangeError(`Index ${index} out of bounds [0, ${this._length}]`);
    }

    // Step 1: 確保有足夠空間（與 StaticArray 的關鍵差異！）
    this.#ensureCapacity();

    // Step 2: 此時已確保有空間，不會觸發 StaticArray 的 "Array is full" 錯誤
    // 避免父類別 insert 重複的邊界檢查，這裡直接操作 protected 成員的實作移動邏輯
    for (let i = this._length; i > index; i--) {
      this._data[i] = this._data[i - 1];
    }
    this._data[index] = element;
    this._length++;
  }

  /**
   * 刪除指定位置的元素（Override 父類別方法）
   * @param {number} index - 要刪除的位置
   * @returns {*} 被刪除的元素
   *
   * 與 StaticArray.delete 的差異：
   * - StaticArray：只刪除，不管理容量
   * - DynamicArray：刪除後檢查是否需要縮容
   *
   * 優化技巧：容量縮減策略
   * 刪除後檢查使用率，過低時自動縮容以釋放記憶體。
   *
   * 時間複雜度：O(n)（元素移動） + O(1) 攤銷（縮容）
   */
  delete(index) {
    // Step 1: 呼叫父類別的 delete 邏輯
    const element = super.delete(index);

    // Step 2: 檢查是否需要縮容（與 StaticArray 的關鍵差異！）
    this.#tryShrink();

    return element;
  }

  // ==================== 狀態查詢（擴展） ====================

  /**
   * 取得初始容量
   * @returns {number}
   */
  initialCapacity() {
    return this.#initialCapacity;
  }

  /**
   * 取得擴縮容因子
   * @returns {number}
   */
  growthFactor() {
    return this.#growthFactor;
  }

  // ==================== 工具方法（Override） ====================

  /**
   * 清空陣列並重置容量為初始值
   */
  clear() {
    // 重新初始化為初始狀態，而非只清空元素
    this._data = new Array(this.#initialCapacity);
    this._length = 0;
    this._capacity = this.#initialCapacity;
  }
}

module.exports = { DynamicArray };
