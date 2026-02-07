/**
 * HashSet - 標準實作
 *
 * 核心思想：使用 hash function 將元素映射到 bucket array，
 * 透過 chaining（鏈結法）處理碰撞，達到 O(1) 平均時間複雜度。
 *
 * 時間複雜度（平均）：add O(1), has O(1), delete O(1)
 * 空間複雜度：O(n)，其中 n 為元素數量
 */
class HashSet {
  /**
   * 初始化 HashSet
   * @param {number} initialCapacity - 初始容量（預設 16）
   * @param {number} loadFactorThreshold - 擴容閾值（預設 0.75）
   */
  constructor(initialCapacity = 16, loadFactorThreshold = 0.75) {
    this.capacity = initialCapacity;
    this.loadFactorThreshold = loadFactorThreshold;
    this.buckets = new Array(this.capacity).fill(null);
    this.size = 0;
  }

  /**
   * Hash function：將任意 key 轉換為 bucket index
   * @param {*} key - 要 hash 的元素
   * @return {number} - bucket index（0 到 capacity-1）
   *
   * 實作說明：
   * - 使用 polynomial rolling hash（多項式滾動雜湊）
   * - 乘數 31 是質數，能讓分布更均勻
   * - 31 = 2^5 - 1，乘法可優化為位移
   */
  _hash(key) {
    // 將 key 轉為字串以統一處理
    const str = String(key);
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
      // hash = hash * 31 + charCode
      // 使用位移優化：(hash << 5) - hash = hash * 31
      hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
    }

    // 確保結果為非負整數，並映射到有效 index
    return Math.abs(hash) % this.capacity;
  }

  /**
   * 新增元素到集合
   * @param {*} element - 要新增的元素
   * @return {boolean} - 是否成功新增（已存在則返回 false）
   *
   * 時間複雜度：O(1) 平均，O(n) 最壞（碰撞或 resize）
   */
  add(element) {
    const index = this._hash(element);

    // Case 1: bucket 為空，直接建立並放入
    if (this.buckets[index] === null) {
      this.buckets[index] = [element];
      this.size++;
      this._checkResize();
      return true;
    }

    // Case 2: bucket 非空，檢查是否已存在
    const bucket = this.buckets[index];
    for (const item of bucket) {
      if (item === element) {
        return false; // 已存在，不重複加入
      }
    }

    // Case 3: 不存在，加入 bucket 尾端
    bucket.push(element);
    this.size++;
    this._checkResize();
    return true;
  }

  /**
   * 檢查元素是否存在
   * @param {*} element - 要檢查的元素
   * @return {boolean} - 元素是否存在於集合中
   *
   * 時間複雜度：O(1) 平均，O(n) 最壞（所有元素碰撞到同一 bucket）
   */
  has(element) {
    const index = this._hash(element);
    const bucket = this.buckets[index];

    if (bucket === null) return false;

    // 線性搜尋 bucket（平均長度很短）
    for (const item of bucket) {
      if (item === element) return true;
    }

    return false;
  }

  /**
   * 從集合刪除元素
   * @param {*} element - 要刪除的元素
   * @return {boolean} - 是否成功刪除（不存在則返回 false）
   *
   * 時間複雜度：O(1) 平均
   */
  delete(element) {
    const index = this._hash(element);
    const bucket = this.buckets[index];

    if (bucket === null) return false;

    const itemIndex = bucket.indexOf(element);
    if (itemIndex === -1) return false;

    // 從 bucket 中移除
    bucket.splice(itemIndex, 1);
    this.size--;

    // 可選：bucket 清空時設為 null，節省記憶體
    if (bucket.length === 0) {
      this.buckets[index] = null;
    }

    return true;
  }

  /**
   * 聯集：返回包含 this 和 otherSet 所有元素的新集合
   * @param {HashSet} otherSet - 另一個集合
   * @return {HashSet} - 新的聯集集合
   *
   * 時間複雜度：O(m) 平均，O(n×m) 最壞（m = otherSet.size）
   * 空間複雜度：O(n + m)
   *
   * 實作策略：
   * 1. 複製 this 的所有元素到新集合
   * 2. 遍歷 otherSet 並加入新集合（add 會自動去重）
   */
  union(otherSet) {
    const result = new HashSet(
      Math.max(this.capacity, otherSet.capacity),
      this.loadFactorThreshold,
    );

    // 加入 this 的所有元素
    for (const element of this) {
      result.add(element);
    }

    // 加入 otherSet 的所有元素（自動去重）
    for (const element of otherSet) {
      result.add(element);
    }

    return result;
  }

  /**
   * 交集：返回同時存在於 this 和 otherSet 的元素集合
   * @param {HashSet} otherSet - 另一個集合
   * @return {HashSet} - 新的交集集合
   *
   * 時間複雜度：O(min(n,m)) 平均，O(n×m) 最壞
   * 空間複雜度：O(min(n,m))
   *
   * 優化策略：遍歷較小的集合，減少 has() 呼叫次數
   */
  intersection(otherSet) {
    const result = new HashSet();

    // 優化：遍歷較小的集合
    let smallerSet, largerSet;
    if (this.size <= otherSet.size) {
      smallerSet = this;
      largerSet = otherSet;
    } else {
      smallerSet = otherSet;
      largerSet = this;
    }

    // 只加入同時存在於兩個集合的元素
    for (const element of smallerSet) {
      if (largerSet.has(element)) {
        result.add(element);
      }
    }

    return result;
  }

  /**
   * 差集：返回存在於 this 但不存在於 otherSet 的元素集合
   * @param {HashSet} otherSet - 另一個集合
   * @return {HashSet} - 新的差集集合（this - otherSet）
   *
   * 時間複雜度：O(n) 平均，O(n×m) 最壞（n = this.size）
   * 空間複雜度：O(n)
   *
   * 實作說明：
   * - 遍歷 this 的所有元素
   * - 只加入不存在於 otherSet 的元素
   */
  difference(otherSet) {
    const result = new HashSet();

    // 遍歷 this，排除存在於 otherSet 的元素
    for (const element of this) {
      if (!otherSet.has(element)) {
        result.add(element);
      }
    }

    return result;
  }

  /**
   * 對稱差集：返回只存在於其中一個集合的元素
   * @param {HashSet} otherSet - 另一個集合
   * @return {HashSet} - 新的對稱差集集合（(A-B) ∪ (B-A)）
   *
   * 時間複雜度：O(n + m) 平均
   * 空間複雜度：O(n + m)
   *
   * 數學定義：A △ B = (A ∪ B) - (A ∩ B)
   */
  symmetricDifference(otherSet) {
    const result = new HashSet();

    // 加入只存在於 this 的元素
    for (const element of this) {
      if (!otherSet.has(element)) {
        result.add(element);
      }
    }

    // 加入只存在於 otherSet 的元素
    for (const element of otherSet) {
      if (!this.has(element)) {
        result.add(element);
      }
    }

    return result;
  }

  /**
   * 子集判斷：檢查 this 是否為 otherSet 的子集
   * @param {HashSet} otherSet - 另一個集合
   * @return {boolean} - this 的所有元素是否都在 otherSet 中
   *
   * 時間複雜度：O(n) 平均，n = this.size
   *
   * 數學定義：A ⊆ B，當且僅當 ∀x ∈ A, x ∈ B
   */
  isSubsetOf(otherSet) {
    // 優化：子集的 size 不能大於父集
    if (this.size > otherSet.size) return false;

    // 檢查 this 的每個元素是否都在 otherSet 中
    for (const element of this) {
      if (!otherSet.has(element)) {
        return false;
      }
    }

    return true;
  }

  /**
   * 超集判斷：檢查 this 是否為 otherSet 的超集
   * @param {HashSet} otherSet - 另一個集合
   * @return {boolean} - otherSet 的所有元素是否都在 this 中
   *
   * 時間複雜度：O(m) 平均，m = otherSet.size
   *
   * 數學定義：A ⊇ B ⇔ B ⊆ A
   */
  isSupersetOf(otherSet) {
    return otherSet.isSubsetOf(this);
  }

  /**
   * 不相交判斷：檢查兩個集合是否無交集
   * @param {HashSet} otherSet - 另一個集合
   * @return {boolean} - 兩個集合是否沒有共同元素
   *
   * 時間複雜度：O(min(n,m)) 平均
   *
   * 優化：遍歷較小的集合
   */
  isDisjointFrom(otherSet) {
    // 優化：遍歷較小的集合
    let smallerSet, largerSet;
    if (this.size <= otherSet.size) {
      smallerSet = this;
      largerSet = otherSet;
    } else {
      smallerSet = otherSet;
      largerSet = this;
    }

    // 只要找到一個共同元素就返回 false
    for (const element of smallerSet) {
      if (largerSet.has(element)) {
        return false;
      }
    }

    return true;
  }

  /**
   * 檢查是否需要擴容，若需要則執行 resize
   *
   * 觸發條件：loadFactor > loadFactorThreshold
   * 策略：容量翻倍 + 重新 hash 所有元素
   */
  _checkResize() {
    const loadFactor = this.size / this.capacity;
    if (loadFactor > this.loadFactorThreshold) {
      this._resize();
    }
  }

  /**
   * 擴容並 rehash 所有元素
   *
   * 時間複雜度：O(n)，但攤銷到每次 add 是 O(1)
   * 空間複雜度：O(n)（暫時需要新舊兩個陣列）
   */
  _resize() {
    const oldBuckets = this.buckets;

    // 容量翻倍
    this.capacity *= 2;
    this.buckets = new Array(this.capacity).fill(null);
    this.size = 0;

    // Rehash 所有元素
    // 關鍵：新的 capacity 會改變 hash(element) % capacity 的結果
    for (const bucket of oldBuckets) {
      if (bucket !== null) {
        for (const element of bucket) {
          this.add(element);
        }
      }
    }
  }

  /**
   * 清空集合
   */
  clear() {
    this.buckets = new Array(this.capacity).fill(null);
    this.size = 0;
  }

  /**
   * 迭代器支援
   * @yields {*} 集合中的每個元素
   */
  *[Symbol.iterator]() {
    for (const bucket of this.buckets) {
      if (bucket !== null) {
        for (const element of bucket) {
          yield element;
        }
      }
    }
  }

  /**
   * 轉換為陣列
   * @return {Array} 包含所有元素的陣列
   */
  toArray() {
    return [...this];
  }

  /**
   * 取得集合大小
   * @return {number} 元素數量
   */
  get size() {
    return this.size;
  }

  /**
   * 檢查集合是否為空
   * @return {boolean} 集合是否不含任何元素
   */
  get isEmpty() {
    return this.size === 0;
  }
}
