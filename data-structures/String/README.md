# String 字串

## 🎯 設計理念

### 存在意義

**這個工具被發明出來，是為了解決什麼類型的問題？**

| 面向           | 說明                                                                                                 |
| -------------- | ---------------------------------------------------------------------------------------------------- |
| **痛點**       | 在字元陣列時代，開發者需要手動管理記憶體分配、追蹤長度、處理 null terminator、面對編碼轉換等低階細節 |
| **價值主張**   | 提供高階抽象，讓開發者專注於「文字語意操作」而非「記憶體管理」                                       |
| **一句話本質** | **字串是「有序字元序列」的不可變抽象，專門處理文字的儲存、比對與變換**                               |

### 心智模型

**類比：珠串項鍊**

```plaintext
String "hello" 的心智圖像：

    ┌───┬───┬───┬───┬───┐
    │ h │ e │ l │ l │ o │  ← 每顆珠子是一個字元
    └───┴───┴───┴───┴───┘
      0   1   2   3   4     ← 每顆珠子有固定位置（索引）

操作類比：
- charAt(i)：看第 i 顆珠子是什麼顏色
- substring(1,4)：從項鍊上「複製」第 1~3 顆珠子，串成新項鍊
- concat：把兩條項鍊接起來，做成一條新的
- 修改字元：不能換珠子，只能重新串一條新項鍊
```

**局限**：真實項鍊可以換珠子，但 JavaScript 的 String 是 **immutable（不可變）**——任何「修改」都會產生新字串

---

## 🏗️ 抽象結構

### 核心組件

| 組件         | 功能                                     | 為什麼需要                          |
| ------------ | ---------------------------------------- | ----------------------------------- |
| **字元序列** | 儲存實際的字元資料                       | 字串的本質就是有序字元集合          |
| **長度屬性** | 記錄字串包含多少字元                     | O(1) 取得長度，避免每次都要遍歷計算 |
| **編碼規則** | 定義字元如何映射到數值（JS 使用 UTF-16） | 讓電腦能正確儲存和比對各國文字      |

### 狀態表示

| 面向         | JavaScript 的實現                                     |
| ------------ | ----------------------------------------------------- |
| **底層結構** | 原始型別（primitive），內部以 UTF-16 編碼儲存         |
| **初始狀態** | 空字串 `""` 或字面值 `"hello"`                        |
| **關鍵特性** | **Immutable（不可變）**：任何「修改」操作都返回新字串 |

```javascript
// 不可變性的展示
let s = "hello";
s[0] = "H"; // 靜默失敗，s 仍然是 "hello"
s = "H" + s.slice(1); // 正確做法：建立新字串 "Hello"
```

### 核心操作

#### 1. **存取 Access：`charAt(i)` / `s[i]`**

**目的**：取得指定位置的字元

**輸入/輸出**：索引 `i` → 該位置的字元（若越界返回 `""` 或 `undefined`）

**複雜度**：O(1)

```javascript
const s = "hello";
s[0]; // "h"
s.charAt(1); // "e"
s[10]; // undefined（使用 [] 語法）
s.charAt(10); // ""（使用 charAt）
```

#### 2. **搜尋 Search：`indexOf` / `includes`**

**目的**：在字串中尋找子字串的位置或判斷是否存在

**複雜度**：O(n × m)，n = 主字串長度，m = 模式長度

```javascript
const s = "hello world";
s.indexOf("world"); // 6（找到的起始位置）
s.indexOf("xyz"); // -1（找不到）
s.includes("llo"); // true
```

**進階優化**：KMP 演算法可將搜尋優化至 O(n + m)

#### 3. **截取 Substring：`slice` / `substring`**

**目的**：取出字串的一部分

**複雜度**：O(k)，k = 截取長度（需要複製字元建立新字串）

```javascript
const s = "hello world";
s.slice(0, 5); // "hello"
s.slice(6); // "world"
s.slice(-5); // "world"（支援負數索引）
s.substring(0, 5); // "hello"（不支援負數）
```

#### 4. **串接 Concatenation：`+` / `concat`**

**目的**：將多個字串合併

**複雜度**：O(n + m)，需要建立新字串並複製所有字元

```javascript
const a = "hello";
const b = "world";
a + " " + b; // "hello world"
a.concat(" ", b); // "hello world"
```

**⚠️ 效能陷阱**：迴圈中重複串接會導致 O(n²)

```javascript
// ❌ 不好的做法：O(n²)
let result = "";
for (let i = 0; i < n; i++) {
  result += arr[i]; // 每次都建立新字串
}

// ✅ 好的做法：O(n)
const result = arr.join("");
```

#### 5. **分割 Split：`split`**

**目的**：按分隔符將字串拆成陣列

**複雜度**：O(n)

```javascript
"a,b,c".split(","); // ["a", "b", "c"]
"hello".split(""); // ["h", "e", "l", "l", "o"]
```

#### 6. **比較 Comparison：`===` / `localeCompare`**

**目的**：判斷兩字串是否相等或比較大小

**複雜度**：O(min(n, m))

```javascript
"abc" === "abc"; // true
"abc" < "abd"; // true（字典序比較）
"a".localeCompare("b"); // -1（a 在 b 前面）
```

### 核心操作複雜度總結

| 操作                   | 時間複雜度   | 空間複雜度 | 備註                        |
| ---------------------- | ------------ | ---------- | --------------------------- |
| **存取**               |              |            |                             |
| `s[i]` / `charAt(i)`   | O(1)         | O(1)       | 直接索引                    |
| `length`               | O(1)         | O(1)       | 屬性存取                    |
| **搜尋**               |              |            |                             |
| `indexOf(pattern)`     | O(n × m)     | O(1)       | 樸素搜尋；KMP 可達 O(n+m)   |
| `includes(pattern)`    | O(n × m)     | O(1)       | 內部呼叫 indexOf            |
| **截取**               |              |            |                             |
| `slice(i, j)`          | O(k)         | O(k)       | k = j - i，需複製建立新字串 |
| `substring(i, j)`      | O(k)         | O(k)       | 同上                        |
| **修改（產生新字串）** |              |            |                             |
| `+` / `concat`         | O(n + m)     | O(n + m)   | 合併兩字串                  |
| `replace(old, new)`    | O(n)         | O(n)       | 建立新字串                  |
| `split(delimiter)`     | O(n)         | O(n)       | 分割成陣列                  |
| **比較**               |              |            |                             |
| `===` / `<` / `>`      | O(min(n, m)) | O(1)       | 逐字元比較                  |

**符號定義**：

- `n`：主字串長度
- `m`：模式/子字串長度
- `k`：截取的長度

**結構本身的空間複雜度**：O(n)，n 為字串長度

---

## 🔍 觸發器（模式識別）

### 正向觸發器

| 層級         | 特徵                                      | 為什麼指向字串處理 |
| ------------ | ----------------------------------------- | ------------------ |
| **關鍵字**   | "字元"、"字串"、"文字"、"單詞"、"子字串"  | 直接指明操作對象   |
| **結構**     | 輸入是 `s: string` 或 `words: string[]`   | 資料型別決定工具   |
| **目標**     | 找最長/最短子字串、判斷回文、計算編輯距離 | 典型字串問題       |
| **操作模式** | 字元計數、前綴/後綴匹配、模式搜尋         | 字串專屬操作       |

**一句話觸發規則**：**看到「有序字元序列」的處理需求 → 想到 String 及其常見演算法模式**

### LeetCode 常見字串問題分類

```plaintext
String 問題類型
├── 字元計數類
│   ├── 關鍵詞：anagram, frequency, permutation
│   ├── 工具：Hash Map 計數
│   └── 例題：242, 49, 438
│
├── 子字串類
│   ├── 關鍵詞：substring, subarray, window
│   ├── 工具：Sliding Window
│   └── 例題：3, 76, 567
│
├── 回文類
│   ├── 關鍵詞：palindrome, reverse
│   ├── 工具：Two Pointers / DP
│   └── 例題：5, 125, 647
│
├── 前綴/字典類
│   ├── 關鍵詞：prefix, dictionary, word search
│   ├── 工具：Trie
│   └── 例題：208, 211, 212
│
├── 模式匹配類
│   ├── 關鍵詞：pattern, match, wildcard
│   ├── 工具：DP / KMP / Regex
│   └── 例題：10, 44, 28
│
└── 字串變換類
    ├── 關鍵詞：edit distance, transform, convert
    ├── 工具：DP
    └── 例題：72, 583, 712
```

### 反向觸發器

| 陷阱情境             | 為什麼不適用純字串操作          | 更好的選擇                    |
| -------------------- | ------------------------------- | ----------------------------- |
| 需要頻繁修改單一字元 | String immutable，每次修改 O(n) | 轉成 `char[]` 操作後再 `join` |
| 需要快速前綴查詢     | `indexOf` 是 O(n×m)             | 建立 Trie                     |
| 需要找所有匹配位置   | `indexOf` 只找第一個            | KMP / Rabin-Karp              |
| 字串極長且頻繁串接   | 重複 `+` 會 O(n²)               | 用陣列收集後 `join`           |

### 與類似工具的決策點

```plaintext
「序列處理」問題
├── 需要隨機存取 + 頻繁修改 → Array
├── 需要處理文字 + 不可變性可接受 → String
├── 需要前綴搜尋 → Trie
└── 需要模式匹配 → KMP / Regex / DP
```

---

## ⚠️ 注意事項

### 常見陷阱

| 陷阱               | 錯誤寫法             | 正確寫法                       | 為什麼                         |
| ------------------ | -------------------- | ------------------------------ | ------------------------------ |
| **迴圈串接**       | `s += char` 在迴圈中 | `arr.push(char); arr.join("")` | 避免 O(n²)                     |
| **忘記 immutable** | `s[0] = 'X'`         | `s = 'X' + s.slice(1)`         | 字串不可變                     |
| **越界存取**       | 假設 `s[i]` 一定存在 | 先檢查 `i < s.length`          | 避免 undefined                 |
| **編碼問題**       | `"😀".length === 1`  | `[..."😀"].length === 1`       | UTF-16 代理對佔 2 個 code unit |
| **空字串邊界**     | 忘記處理 `s === ""`  | 明確檢查空字串                 | 避免邏輯錯誤                   |

### JavaScript 字串特有注意事項

```javascript
// 1. Emoji 和特殊字元的長度陷阱
"😀".length; // 2（不是 1！UTF-16 surrogate pair）
[..."😀"].length; // 1（正確計算）

// 2. 比較陷阱
"10" > "9"; // false（字典序比較，"1" < "9"）
+"10" > +"9"; // true（轉數字後比較）

// 3. 模板字串的效能
`${a}${b}${c}`; // 現代 JS 引擎已優化，效能接近 join
```

### 常見變體與技巧

| 技巧           | 適用場景          | 實現方式                   |
| -------------- | ----------------- | -------------------------- |
| **字串轉陣列** | 需要修改、排序    | `s.split("")` 或 `[...s]`  |
| **陣列轉字串** | 收集結果          | `arr.join("")`             |
| **字元計數**   | anagram、頻率問題 | `Map` 或長度 26/128 的陣列 |
| **雙指針**     | 回文、反轉、去重  | `left`, `right` 索引       |
| **滑動視窗**   | 子字串問題        | `left`, `right` + `Map`    |

---

## ⭐ 抽象化翻譯器

### 識別核心抽象

> **String 操作的核心對象是**：有序的字元序列
>
> **它管理的關係是**：字元之間的「位置關係」與「模式匹配關係」

### 建立映射維度

當你拿到一道字串題目時，依序回答這四個問題：

| 維度                 | 要回答的問題                                  | 這個答案決定了什麼 |
| -------------------- | --------------------------------------------- | ------------------ |
| **維度 1：核心操作** | 題目要我對字串做什麼？（搜尋/比對/變換/計數） | 選擇演算法模式     |
| **維度 2：約束條件** | 字串長度 n 是多少？允許的複雜度是？           | 篩選可行解法       |
| **維度 3：子結構**   | 處理的是單一字元、子字串、還是整體？          | 決定資料結構       |
| **維度 4：狀態追蹤** | 需要記錄什麼資訊？（位置/頻率/前一狀態）      | 選擇輔助結構       |

### 實戰檢查表

```plaintext
題目：_______________

維度 1 - 核心操作：_______________（搜尋/比對/變換/計數）
維度 2 - 約束條件：n ≤ _____，需要 O(_____)
維度 3 - 子結構：_______________（字元/子字串/整體）
維度 4 - 狀態追蹤：_______________（位置/頻率/前一狀態）

→ 演算法模式：_______________
→ 輔助資料結構：_______________
```

### 映射範例

**題目 A**：[3. Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/)

| 維度     | 具體問題                 | 抽象映射                       |
| -------- | ------------------------ | ------------------------------ |
| 核心操作 | 找最長不重複子字串       | **搜尋**（找符合條件的子字串） |
| 約束條件 | n ≤ 5×10⁴，需要 O(n)     | 線性掃描，不能 O(n²)           |
| 子結構   | 處理「連續子字串」       | **滑動視窗**                   |
| 狀態追蹤 | 記錄視窗內每個字元的位置 | **Hash Map** 或 **Set**        |

**從映射到實作**：

```javascript
// 滑動視窗 + Set 追蹤視窗內字元
function lengthOfLongestSubstring(s) {
  let left = 0,
    maxLen = 0;
  const seen = new Set();

  for (let right = 0; right < s.length; right++) {
    // 收縮視窗直到無重複
    while (seen.has(s[right])) {
      seen.delete(s[left]);
      left++;
    }
    seen.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}
```

---

**題目 B**：[242. Valid Anagram](https://leetcode.com/problems/valid-anagram/)

| 維度     | 具體問題                 | 抽象映射                         |
| -------- | ------------------------ | -------------------------------- |
| 核心操作 | 判斷兩字串是否為 anagram | **比對**（字元頻率相同）         |
| 約束條件 | n ≤ 5×10⁴，需要 O(n)     | 線性計數                         |
| 子結構   | 處理「單一字元」的頻率   | 字元計數                         |
| 狀態追蹤 | 記錄每個字元出現次數     | **Hash Map** 或 **長度 26 陣列** |

**從映射到實作**：

```javascript
// 字元計數比對
function isAnagram(s, t) {
  if (s.length !== t.length) return false;

  const count = new Array(26).fill(0);
  const base = "a".charCodeAt(0);

  for (let i = 0; i < s.length; i++) {
    count[s.charCodeAt(i) - base]++;
    count[t.charCodeAt(i) - base]--;
  }

  return count.every((c) => c === 0);
}
```

---

## 📝 標準模式實作模板

### 模式一：滑動視窗（Sliding Window）

```javascript
/**
 * 滑動視窗模板 - 用於子字串問題
 *
 * 適用場景：
 * - 找滿足條件的最長/最短子字串
 * - 子字串內的字元需滿足某種約束
 *
 * 核心思想：
 * - 用 [left, right] 區間表示當前視窗
 * - right 擴展探索新元素
 * - left 收縮維護約束條件
 *
 * 時間複雜度：O(n)，每個元素最多被訪問兩次（進窗口、出窗口）
 * 空間複雜度：O(k)，k 為字元種類數
 */
function slidingWindowTemplate(s) {
  let left = 0;
  let result = 0; // 或其他初始值
  const window = new Map(); // 追蹤視窗狀態

  for (let right = 0; right < s.length; right++) {
    const charIn = s[right];
    // 1. 擴展視窗：將 charIn 加入視窗狀態
    window.set(charIn, (window.get(charIn) || 0) + 1);

    // 2. 收縮視窗：當違反約束條件時
    while (/* 視窗不滿足條件 */) {
      const charOut = s[left];
      // 將 charOut 移出視窗狀態
      window.set(charOut, window.get(charOut) - 1);
      if (window.get(charOut) === 0) window.delete(charOut);
      left++;
    }

    // 3. 更新答案
    result = Math.max(result, right - left + 1);
  }

  return result;
}
```

### 模式二：雙指針（Two Pointers）

```javascript
/**
 * 雙指針模板 - 用於回文、反轉、對撞問題
 *
 * 適用場景：
 * - 判斷回文
 * - 原地反轉
 * - 兩端向中間收縮
 *
 * 時間複雜度：O(n)
 * 空間複雜度：O(1)
 */
function twoPointerTemplate(s) {
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    // 根據題目需求進行比較或操作
    if (s[left] !== s[right]) {
      return false; // 回文檢查失敗
    }
    left++;
    right--;
  }

  return true;
}

// 回文檢查實例
function isPalindrome(s) {
  // 預處理：只保留字母數字，轉小寫
  s = s.toLowerCase().replace(/[^a-z0-9]/g, "");

  let left = 0,
    right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  return true;
}
```

### 模式三：字元計數（Character Counting）

```javascript
/**
 * 字元計數模板 - 用於 anagram、頻率問題
 *
 * 適用場景：
 * - 判斷 anagram
 * - 找字元頻率差異
 * - 統計字元分布
 *
 * 選擇資料結構：
 * - 只有小寫字母：長度 26 的陣列（更快）
 * - 任意字元：Map（更通用）
 *
 * 時間複雜度：O(n)
 * 空間複雜度：O(1) 如果字元集固定，O(k) 如果字元集可變
 */

// 方法一：陣列計數（限定字元集）
function charCountArray(s) {
  const count = new Array(26).fill(0);
  const base = "a".charCodeAt(0);

  for (const char of s) {
    count[char.charCodeAt(0) - base]++;
  }

  return count;
}

// 方法二：Map 計數（通用）
function charCountMap(s) {
  const count = new Map();

  for (const char of s) {
    count.set(char, (count.get(char) || 0) + 1);
  }

  return count;
}
```

---

## 🎯 學習建議

### 第一階段：核心模式掌握（1-2 週）

| 模式     | 代表題目     | 核心技巧           |
| -------- | ------------ | ------------------ |
| 滑動視窗 | 3, 76, 567   | 視窗擴展/收縮邏輯  |
| 雙指針   | 125, 344, 5  | 對撞指針、中心擴展 |
| 字元計數 | 242, 49, 438 | Map/Array 計數     |

### 第二階段：進階結構（2-3 週）

| 結構 | 代表題目      | 適用場景           |
| ---- | ------------- | ------------------ |
| Trie | 208, 211, 212 | 前綴匹配、字典搜尋 |
| KMP  | 28, 214       | 高效模式匹配       |
| DP   | 72, 5, 516    | 編輯距離、子序列   |

### 觸發器速查卡

```plaintext
看到「最長/最短子字串 + 條件」→ 滑動視窗
看到「回文」→ 雙指針（對撞或中心擴展）
看到「anagram / permutation」→ 字元計數
看到「前綴匹配 / 字典」→ Trie
看到「編輯距離 / 變換」→ DP
看到「多模式匹配」→ KMP / Rabin-Karp
```
