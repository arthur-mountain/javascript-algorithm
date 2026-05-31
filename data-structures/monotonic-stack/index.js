/**
 * MonotonicStack - 標準實作
 *
 * 核心思想：在 Stack 之上，加一道「入棧前先清理」的關卡。
 * 新元素進來時，先把棧頂所有「未來不可能勝過它」的舊候選者彈出，
 * 再把自己放進去。每個元素一生最多入棧一次、出棧一次，
 * 因此處理 n 個元素的總成本是 O(n)。
 *
 * 此類別只負責「維護單調性」這件事；要找 Next/Previous、Greater/Smaller，
 * 由建構子注入的 shouldPop 比較函式決定，並由呼叫端讀取 push 回傳的
 * popped（Next 類）或 prevTop（Previous 類）。需要逐次掌握彈出當下棧頂的
 * 題型（如直方圖、環形），則直接使用底層的 push/pop/peek 手動操作。
 *
 * 時間複雜度：處理 n 個元素總計 O(n) total（單次 push 攤銷 O(1)）
 * 空間複雜度：O(n)（最壞所有元素同時在棧內，如嚴格遞減輸入）
 */
const { Stack } = require("../Stack");

class MonotonicStack {
  /**
   * @param {(incoming: *, top: *) => boolean} [shouldPop] - 清理條件。
   *   收到「即將入棧的元素」與「目前棧頂」（實務上多為索引），
   *   回傳 true 表示棧頂該被淘汰。呼叫端通常透過外部 arr 比較其值，例如：
   *   - 找 Greater（遞減棧）：(i, t) => arr[i] >  arr[t]
   *   - 找 Smaller（遞增棧）：(i, t) => arr[i] <  arr[t]
   *   用 > / < （嚴格）或 >= / <=（非嚴格）決定相等元素是否並存，
   *   進而決定棧是嚴格單調還是非嚴格單調。
   *   省略時預設「永不清理」，push 退化為普通堆疊的入棧（供手動操作題型使用）。
   */
  constructor(shouldPop = () => false) {
    // 復用既有 Stack，不自行實作堆疊
    this._stack = new Stack();
    this._shouldPop = shouldPop;
  }

  /**
   * 單調入棧：先清理違反單調性的棧頂，再放入新元素。
   *
   * @param {*} item - 新元素（實務上多為索引）
   * @return {{ popped: *[], prevTop: (*|undefined) }}
   *   - popped：本次被淘汰的元素（依淘汰順序，先彈出的在前）。
   *             對「Next」類問題，這些元素的答案就是 item。
   *   - prevTop：清理完、放入 item 之前的棧頂。
   *             對「Previous」類問題，這就是 item 的答案；棧空則為 undefined。
   *
   * @complexity Time: O(1) 攤銷 / O(n) 最壞；Space: O(1)
   *
   * 優化技巧：單調清理（monotonic eviction）
   *   把「永遠不可能成為答案的候選者」一次性丟掉，使每個元素一生只進出各一次。
   */
  push(item) {
    const popped = [];
    // 清理階段：把所有「該被淘汰」的棧頂彈出
    // 複雜度來源：單次最多彈出 O(n) 個；但每個元素一生只會被彈出一次，
    //            故 n 次 push 的彈出總數 <= n，攤銷後單次 O(1)
    while (
      !this._stack.isEmpty() &&
      this._shouldPop(item, this._stack.peek())
    ) {
      popped.push(this._stack.pop());
    }
    // Previous 類問題的答案：清理後、入棧前的棧頂
    // 易錯點：必須在 push(item) 之前讀取，否則棧頂會變成 item 自己
    const prevTop = this._stack.isEmpty() ? undefined : this._stack.peek();
    this._stack.push(item);
    return { popped, prevTop };
  }

  /**
   * 查看棧頂（不移除）。繼承底層 Stack 行為：空棧會 throw，
   * 故呼叫端務必先以 isEmpty() 守衛。
   * @complexity Time: O(1); Space: O(1) — 無優化空間，直接讀棧頂
   */
  peek() {
    return this._stack.peek();
  }

  /**
   * 移除並回傳棧頂。
   * @return {*} 被移除的棧頂元素
   * @complexity Time: O(1); Space: O(1) — 無優化空間，直接移除棧頂
   */
  pop() {
    return this._stack.pop();
  }

  /**
   * 棧是否為空。
   * @return {boolean}
   * @complexity Time: O(1); Space: O(1) — 無優化空間
   */
  isEmpty() {
    return this._stack.isEmpty();
  }

  /**
   * 棧內元素數量。
   * @return {number}
   * @complexity Time: O(1); Space: O(1) — 無優化空間
   */
  size() {
    return this._stack.size();
  }
}

module.exports = MonotonicStack;
