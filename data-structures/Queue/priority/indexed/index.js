/**
 * Indexed Priority Queue (IPQ) - 標準實作（自包含，預設 Min IPQ）
 *
 * 核心思想與功能：
 *   一般 Priority Queue 只能「取極值」，無法在 O(log n) 內「改某個既存元素的 key」，
 *   因為它不知道某個元素現在躺在 heap 的哪個位置（找位置要 O(n) 線性掃描）。
 *   IPQ 給每個元素一個固定 index，並額外維護「index → heap 位置」的反向映射 qp[]，
 *   讓 decreaseKey/changeKey/delete(i) 都能先 O(1) 定位、再 O(log n) 修復堆性質。
 *   這正是 Dijkstra / Prim 需要的「降鍵」能力。
 *
 * 三個核心陣列（恆等式：pq[qp[i]] === i 且 qp[pq[k]] === k）：
 *   - keys[i] : index i 對應的優先級（key 本身），未在隊列中為 undefined
 *   - pq[k]   : heap 第 k 個位置存放的「index」（heap 排序的是 index，不是 key）
 *   - qp[i]   : index i 目前的 heap 位置；不在隊列中為 -1（反向映射，O(1) 定位的關鍵）
 *
 * 時間複雜度：insert / decreaseKey / increaseKey / changeKey / delMin / delete = O(log n)
 *             contains / keyOf / minIndex / minKey / size / isEmpty = O(1)
 * 空間複雜度：O(maxN)（三個長度為 maxN 的陣列）
 */
class IndexedPriorityQueue {
  /**
   * 建構 Indexed Priority Queue
   *
   * @param {number} maxN - index 的容量上限，合法 index 範圍為 [0, maxN)
   * @param {Function} [comparator] - 比較兩個 key：comparator(a, b) < 0 代表 a 優先級較高（較早出列）
   *   - 預設 (a, b) => a - b → Min IPQ（key 越小越優先）
   *   - 傳入 (a, b) => b - a → Max IPQ（key 越大越優先）
   * @throws {RangeError} maxN 非非負整數時拋出
   * @complexity Time: O(maxN), Space: O(maxN)
   */
  constructor(maxN, comparator = (a, b) => a - b) {
    // Edge case: 容量必須為非負整數，否則後續陣列配置與 index 驗證會失去意義
    if (!Number.isInteger(maxN) || maxN < 0) {
      throw new RangeError(`maxN must be a non-negative integer, got: ${maxN}`);
    }
    this._maxN = maxN;
    this._n = 0; // 目前元素數量
    this._comparator = comparator;

    // keys 以 index 為下標；用 undefined 表示「該 index 尚未持有 key」
    this._keys = new Array(maxN).fill(undefined);
    // pq 以 heap 位置為下標（0..n-1 有效）；-1 表示未使用
    this._pq = new Array(maxN).fill(-1);
    // qp 以 index 為下標；-1 表示「該 index 不在隊列中」，是 contains / 定位的依據
    this._qp = new Array(maxN).fill(-1);
  }

  /* ───────────────────────── 內部輔助 ───────────────────────── */

  /** 取得父節點 heap 位置（0-based） */
  _parent(k) {
    return (k - 1) >> 1;
  }
  /** 取得左子節點 heap 位置（0-based） */
  _left(k) {
    return 2 * k + 1;
  }
  /** 取得右子節點 heap 位置（0-based） */
  _right(k) {
    return 2 * k + 2;
  }

  /**
   * 比較 heap 位置 i、j 上元素的優先級
   * @return {boolean} true 代表「位置 i 的優先級低於位置 j」（i 應該被往下沉）
   * 關鍵：比較的是 keys[pq[i]] 與 keys[pq[j]]（先經 pq 把位置翻成 index，再查 key）
   */
  _lower(i, j) {
    return (
      this._comparator(this._keys[this._pq[i]], this._keys[this._pq[j]]) > 0
    );
  }

  /**
   * 交換 heap 位置 i、j 的兩個元素
   * 易錯點：這是 IPQ 與普通 heap 最大的差異——交換 pq 後，
   *         必須同步回寫 qp，否則 qp[i] 會指向錯誤位置，恆等式 pq[qp[i]]===i 被破壞。
   */
  _exch(i, j) {
    const swap = this._pq[i];
    this._pq[i] = this._pq[j];
    this._pq[j] = swap;
    // 同步維護反向映射：兩個 index 的「目前位置」互換
    this._qp[this._pq[i]] = i;
    this._qp[this._pq[j]] = j;
  }

  /**
   * 上浮：位置 k 的元素若優先級高於父節點，往上交換直到滿足 heap 性質
   * @complexity Time: O(log n), Space: O(1)
   */
  _swim(k) {
    // 只要還有父節點，且「父節點優先級低於 k」就上浮
    while (k > 0 && this._lower(this._parent(k), k)) {
      this._exch(this._parent(k), k);
      k = this._parent(k); // 注意：交換後 k 的新位置是原父節點位置
    }
  }

  /**
   * 下沉：位置 k 的元素若優先級低於子節點，往下交換直到滿足 heap 性質
   * @complexity Time: O(log n), Space: O(1)
   */
  _sink(k) {
    while (this._left(k) <= this._n - 1) {
      let j = this._left(k);
      // 在左右子節點中選出「優先級較高」者作為交換對象
      // O(1): 只比較兩個子節點
      if (this._right(k) <= this._n - 1 && this._lower(j, this._right(k))) {
        j = this._right(k);
      }
      // 若 k 已不低於較優子節點，heap 性質已滿足，停止
      if (!this._lower(k, j)) break;
      this._exch(k, j);
      k = j;
    }
  }

  /** Edge case 守衛：index 越界即拋錯，避免靜默寫壞陣列 */
  _validateIndex(i) {
    if (!Number.isInteger(i) || i < 0 || i >= this._maxN) {
      throw new RangeError(`index out of range [0, ${this._maxN}): ${i}`);
    }
  }

  /* ───────────────────────── 查詢 ───────────────────────── */

  /**
   * 隊列是否為空
   * @return {boolean}
   * @complexity Time: O(1), Space: O(1)
   */
  isEmpty() {
    return this._n === 0;
  }

  /**
   * 隊列元素數量
   * @return {number}
   * @complexity Time: O(1), Space: O(1)
   */
  size() {
    return this._n;
  }

  /**
   * 判斷 index i 是否在隊列中
   * @param {number} i
   * @return {boolean}
   * @throws {RangeError} i 越界時拋出
   * @complexity Time: O(1), Space: O(1)
   * 優化技巧：靠 qp[i] !== -1 直接判斷，免去 O(n) 掃描——這是反向映射的價值所在
   */
  contains(i) {
    this._validateIndex(i);
    return this._qp[i] !== -1;
  }

  /**
   * 取得目前優先級最高（極值）元素的 index
   * @return {number}
   * @throws {Error} 隊列為空時拋出 "Priority queue underflow"
   * @complexity Time: O(1), Space: O(1)
   */
  minIndex() {
    // Edge case: 空隊列無極值可回傳
    if (this._n === 0) throw new Error("Priority queue underflow");
    return this._pq[0];
  }

  /**
   * 取得目前優先級最高（極值）元素的 key
   * @return {*}
   * @throws {Error} 隊列為空時拋出 "Priority queue underflow"
   * @complexity Time: O(1), Space: O(1)
   */
  minKey() {
    if (this._n === 0) throw new Error("Priority queue underflow");
    return this._keys[this._pq[0]];
  }

  /**
   * 取得 index i 對應的 key
   * @param {number} i
   * @return {*}
   * @throws {RangeError} i 越界時拋出
   * @throws {Error} i 不在隊列中時拋出
   * @complexity Time: O(1), Space: O(1)
   */
  keyOf(i) {
    this._validateIndex(i);
    // Edge case: 不在隊列中則無 key 可回傳，明確拋錯而非回傳 undefined（避免與「key 真為 undefined」混淆）
    if (!this.contains(i))
      throw new Error(`index is not in the priority queue: ${i}`);
    return this._keys[i];
  }

  /* ───────────────────────── 修改 ───────────────────────── */

  /**
   * 插入：將 index i 與其 key 加入隊列
   * @param {number} i
   * @param {*} key
   * @throws {RangeError} i 越界時拋出
   * @throws {Error} i 已存在於隊列時拋出
   * @complexity Time: O(log n), Space: O(1)
   * 不變量：插入後 pq[qp[i]]===i 成立，且全堆滿足 heap 性質
   */
  insert(i, key) {
    this._validateIndex(i);
    // Edge case: 同一 index 不可重複插入（會破壞 qp 的一對一映射）
    if (this.contains(i))
      throw new Error(`index is already in the priority queue: ${i}`);

    // 放到 heap 末端位置 n，建立三向映射，再上浮修復
    this._qp[i] = this._n;
    this._pq[this._n] = i;
    this._keys[i] = key;
    this._swim(this._n); // 從末端位置上浮
    this._n++; // 注意：先 swim 再 ++，因為 swim 的目標位置是「尚未計入」的 n
  }

  /**
   * 變更 key（任意方向）：先 swim 再 sink，兩者只會發生其一
   * @param {number} i
   * @param {*} key
   * @throws {RangeError} i 越界時拋出
   * @throws {Error} i 不在隊列中時拋出
   * @complexity Time: O(log n), Space: O(1)
   */
  changeKey(i, key) {
    this._validateIndex(i);
    if (!this.contains(i))
      throw new Error(`index is not in the priority queue: ${i}`);
    this._keys[i] = key;
    // 不知道新 key 是變高還變低，兩個方向都嘗試；錯誤方向會立即 break，故仍是 O(log n)
    this._swim(this._qp[i]);
    this._sink(this._qp[i]);
  }

  /**
   * 降鍵：把 index i 的 key 改成「優先級更高」的新值（Dijkstra/Prim 的核心操作）
   * @param {number} i
   * @param {*} key - 必須比現值優先級更高，否則拋錯
   * @throws {RangeError} i 越界時拋出
   * @throws {Error} i 不在隊列中、或新 key 未嚴格更優先時拋出
   * @complexity Time: O(log n), Space: O(1)
   * 優化技巧：方向已知（只會更優先），故只需 swim，省去 sink 的常數
   */
  decreaseKey(i, key) {
    this._validateIndex(i);
    if (!this.contains(i))
      throw new Error(`index is not in the priority queue: ${i}`);
    // Edge case: 方向錯誤（新 key 不比舊 key 更優先）視為呼叫端邏輯錯誤，明確拒絕
    if (this._comparator(this._keys[i], key) <= 0) {
      throw new Error("decreaseKey: new key is not strictly higher priority");
    }
    this._keys[i] = key;
    this._swim(this._qp[i]); // 變得更優先 → 只可能往上
  }

  /**
   * 升鍵：把 index i 的 key 改成「優先級更低」的新值（與 decreaseKey 對稱）
   * @param {number} i
   * @param {*} key - 必須比現值優先級更低，否則拋錯
   * @throws {RangeError} i 越界時拋出
   * @throws {Error} i 不在隊列中、或新 key 未嚴格更不優先時拋出
   * @complexity Time: O(log n), Space: O(1)
   * 優化技巧：方向已知（只會更不優先），故只需 sink
   */
  increaseKey(i, key) {
    this._validateIndex(i);
    if (!this.contains(i))
      throw new Error(`index is not in the priority queue: ${i}`);
    if (this._comparator(this._keys[i], key) >= 0) {
      throw new Error("increaseKey: new key is not strictly lower priority");
    }
    this._keys[i] = key;
    this._sink(this._qp[i]); // 變得更不優先 → 只可能往下
  }

  /**
   * 取出並移除優先級最高（極值）的元素，回傳其 index
   * @return {number}
   * @throws {Error} 隊列為空時拋出 "Priority queue underflow"
   * @complexity Time: O(log n), Space: O(1)
   */
  delMin() {
    // Edge case: 空隊列
    if (this._n === 0) throw new Error("Priority queue underflow");
    const min = this._pq[0];
    // 標準刪根：把末端換到根、縮小規模、再下沉修復
    this._exch(0, this._n - 1);
    this._n--;
    this._sink(0);
    // 清理被移除 index 的所有映射，維持恆等式與 contains 正確性
    this._qp[min] = -1;
    this._keys[min] = undefined;
    this._pq[this._n] = -1; // 釋放原末端位置
    return min;
  }

  /**
   * 刪除指定 index i 的元素
   * @param {number} i
   * @throws {RangeError} i 越界時拋出
   * @throws {Error} i 不在隊列中時拋出
   * @complexity Time: O(log n), Space: O(1)
   * 易錯點：被刪位置可能需要上浮也可能需要下沉（取決於換上來的末端元素），故 swim+sink 都做
   */
  delete(i) {
    this._validateIndex(i);
    if (!this.contains(i))
      throw new Error(`index is not in the priority queue: ${i}`);
    const k = this._qp[i]; // O(1) 定位待刪位置
    this._exch(k, this._n - 1); // 與末端交換
    this._n--;
    // 換上來的元素相對原 heap 可能太大或太小，雙向修復
    this._swim(k);
    this._sink(k);
    this._keys[i] = undefined;
    this._qp[i] = -1;
    this._pq[this._n] = -1;
  }
}

module.exports = { IndexedPriorityQueue };
