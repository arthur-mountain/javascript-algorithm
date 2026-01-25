/**
 * Hash Table - Separate Chaining 實作
 *
 * 核心思想：
 * 1. 使用 hash function 將 key 映射到 bucket array 的索引
 * 2. 用 linked list (或 array) 處理碰撞
 * 3. 當 load factor 超過閾值時自動擴容
 *
 * 時間複雜度：平均 O(1) 查詢/插入/刪除
 * 空間複雜度：O(n + capacity)
 */
class HashTable {
  static HASH_PRIME = 31;

  constructor(initialCapacity = 16, loadFactorThreshold = 0.75) {
    this.capacity = initialCapacity;
    this.loadFactorThreshold = loadFactorThreshold;
    this.size = 0;
    // 每個 bucket 是一個 array，用於 chaining
    this.buckets = Array.from({ length: this.capacity }, () => []);
  }

  /**
   * Hash Function - 將 key 轉換為 bucket index
   * @param {string} key - 要 hash 的 key
   * @return {number} bucket index ∈ [0, capacity-1]
   *
   * 使用多項式 rolling hash，讓字元位置影響結果
   * 時間複雜度：O(key.length)
   */
  _hash(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      // 關鍵：乘以 HASH_PRIME 讓位置資訊影響 hash value
      hash = (hash * HashTable.HASH_PRIME + key.charCodeAt(i)) % this.capacity;
    }
    return hash;
  }

  /**
   * 插入或更新 key-value pair
   * @param {string} key
   * @param {any} value
   *
   * 時間複雜度：O(1) 攤銷，O(n) 最壞（resize 時）
   */
  put(key, value) {
    const index = this._hash(key);
    const chain = this.buckets[index];

    // 檢查是否已存在（更新）
    for (const entry of chain) {
      if (entry.key === key) {
        entry.value = value;
        return;
      }
    }

    // 新增
    chain.push({ key, value });
    this.size++;

    // 檢查是否需要擴容
    if (this.size / this.capacity > this.loadFactorThreshold) {
      this._resize();
    }
  }

  /**
   * 根據 key 查找 value
   * @param {string} key
   * @return {any} value 或 undefined
   *
   * 時間複雜度：O(1) 平均，O(n) 最壞
   */
  get(key) {
    const index = this._hash(key);
    const chain = this.buckets[index];

    for (const entry of chain) {
      if (entry.key === key) {
        return entry.value;
      }
    }
    return undefined;
  }

  /**
   * 檢查 key 是否存在
   * @param {string} key
   * @return {boolean}
   */
  has(key) {
    return this.get(key) !== undefined;
  }

  /**
   * 刪除指定 key
   * @param {string} key
   * @return {boolean} 是否成功刪除
   */
  delete(key) {
    const index = this._hash(key);
    const chain = this.buckets[index];

    for (let i = 0; i < chain.length; i++) {
      if (chain[i].key === key) {
        chain.splice(i, 1);
        this.size--;
        return true;
      }
    }
    return false;
  }

  /**
   * 擴容並 rehash 所有 entry
   * 時間複雜度：O(n)
   * 空間複雜度：O(n)
   */
  _resize() {
    const oldBuckets = this.buckets;
    this.buckets = Array.from({ length: (this.capacity *= 2) }, () => []);
    this.size = 0;

    // 關鍵：必須 rehash，因為 capacity 變了
    for (const chain of oldBuckets) {
      for (const entry of chain) {
        this.put(entry.key, entry.value);
      }
    }
  }
}
