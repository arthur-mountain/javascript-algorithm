//@ts-check
/**
 * Insert：O(1)
 * Lookup: O(1)：若有 collision 發生，lookup 的時間複雜度就可能會變成 O(n)
 * Delete: O(1)
 * Search: O(1)：透過 hash function 直接找出該 key 對應的 value
 * Hash Table 常用在儲存使用者的 Email、使用者資料。
 * 缺點：除非在同一個 bucket 內，否則資料（Node）之間不會彼此參照。
 */

// A simple hash table
class HashTable {
  /** @param {number} size */
  constructor(size) {
    this.data = new Array(size);
    this.length = this.data.length;
  }

  /**
   * @param {string} key
   * @description hash func
   **/
  #hash(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash + key.charCodeAt(i) * i) % this.length;
    }
    return hash;
  }

  /**
   * @param {string} key
   * @description get bucket by key
   **/
  #getBucket(key) {
    const idx = this.#hash(key); // 算出要資料保存的位址(idx)
    const bucket = this.data[idx]; // 取出 bucket
    return bucket;
  }

  /**
   * @param {string} key
   * @param {array} bucket
   * @description find index
   **/
  #findIndex(key, bucket) {
    // // 如果沒有 collision 則是 O(1)，否則會是 O(n)
    const endIdx = bucket.length;
    let currentIdx = -1;
    while (currentIdx++ < endIdx) {
      const [_key] = bucket[currentIdx];
      if (_key === key) return currentIdx;
    }
    return -1;
    // return bucket.findIndex(([_key])=> _key === key);
  }

  /**
   * @param {string} key
   * @param {any} value
   * @description set key, value
   **/
  set(key, value) {
    const idx = this.#hash(key); // 算出要儲存的位址(idx)
    const bucket = this.data[idx]; // 取出要保存的 bucket

    // 如果 bucket 不存在，初始化陣列並存入第一筆資料
    if (!bucket) {
      this.data[idx] = [[key, value]];
      return this;
    }

    this.data[idx].push([key, value]);
    return this;
  }

  /**
   * @param {string} key
   * @description get value by key
   **/
  get(key) {
    const bucket = this.#getBucket(key);
    if (!bucket) return;
    const index = this.#findIndex(key, bucket);
    if (index === -1) return;
    return bucket[index][1]; // return value
  }

  /**
   * @param {string} key
   * @param {any} newValue
   * @description update value by key
   **/
  update(key, newValue) {
    const bucket = this.#getBucket(key);
    if (!bucket) return;
    const index = this.#findIndex(key, bucket);
    if (index === -1) return;
    bucket[index][1] = newValue;
    return bucket[index];
  }

  /**
   * @param {string} key
   * @description delete key
   **/
  delete(key) {
    const bucket = this.#getBucket(key);
    if (!bucket) return;
    const index = this.#findIndex(key, bucket);
    if (index === -1) return;
    bucket.splice(index, 1);
  }

  /**
   * @description get all keys
   **/
  // 取得所有 key，O(n)
  keys() {
    return this.data.flatMap((v) =>
      v ? v.map(/** @param {array} v*/ (v) => v[0]) : [],
    );

    // let keys = [];
    // for (let i = 0; i < this.length; i++) {
    //   const bucket = this.data[i];
    //   if (bucket) {
    //     for (let j = 0; j < bucket.length; j++) {
    //       const [key] = bucket[j];
    //       keys.push(key);
    //     }
    //   }
    // }
    // return keys;
  }

  /**
   * @description get all values
   **/
  // 取得所有 value，O(n)
  values() {
    return this.data.flatMap((v) =>
      v ? v.map(/** @param {array} v*/ (v) => v[1]) : [],
    );
  }

  /**
   * @description get all [key,value][]
   **/
  // 取得所有 key, value，O(n)
  entries() {
    return this.data.flatMap((v) => (v ? v : []));
  }
}

// const IHashTable = new HashTable(3);

export default HashTable;
