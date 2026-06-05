/**
 * Radix Sort (LSD) - 從最低有效位到最高位，逐位用穩定排序處理
 *
 * @param {number[]} arr - 待排序陣列（非負整數）
 * @return {number[]} 排序後的新陣列
 *
 * 適用場景：非負整數、位數有限、需要線性時間排序
 * 觸發條件：整數值域大但位數少（如排序手機號碼、身分證號、IP 位址）
 *
 * 前提條件：元素為非負整數；底層排序必須是穩定的（此處用 Counting Sort）
 * ⚠️ 違反「非負整數」時：負數的位數計算錯誤，會靜默產生含 null 的錯誤結果（不會報錯）；
 *    需排序負數請改用 countingSort（已內建 min 偏移）或先自行偏移
 * 違反穩定性時：前幾位的排序結果會被後續位數的不穩定排序破壞
 *
 * 時間複雜度：O(d × (n + k))，d = 最大位數，k = 基數（此處 k = 10）
 * 空間複雜度：O(n + k)
 * 穩定性：穩定
 */
function radixSort(arr) {
  if (arr.length <= 1) return [...arr];

  const max = Math.max(...arr);
  let result = [...arr];

  // 從個位開始，逐位排序
  // exp = 1 → 個位, exp = 10 → 十位, exp = 100 → 百位, ...
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    result = countingSortByDigit(result, exp);
  }

  return result;
}

/**
 * 對特定位數做 Counting Sort（Radix Sort 的內部子程式）
 *
 * @param {number[]} arr - 待排序陣列
 * @param {number} exp - 位數權重（1, 10, 100, ...）
 * @return {number[]} 按該位數排序後的新陣列
 *
 * 基數 k = 10（十進位數字 0-9）
 * 此函式必須是穩定的 — 這是 Radix Sort 正確性的基礎
 */
function countingSortByDigit(arr, exp) {
  const n = arr.length;
  const output = new Array(n);
  const count = new Array(10).fill(0); // 基數為 10

  // Step 1: 統計當前位數的出現次數
  for (let i = 0; i < n; i++) {
    const digit = Math.floor(arr[i] / exp) % 10;
    count[digit]++;
  }

  // Step 2: 前綴和
  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }

  // Step 3: 反向遍歷保證穩定性
  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(arr[i] / exp) % 10;
    output[count[digit] - 1] = arr[i];
    count[digit]--;
  }

  return output;
}

module.exports = { radixSort, countingSortByDigit };
