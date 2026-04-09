# Trie（字典樹 / 前綴樹）

## 🎯 設計理念

### 存在意義

**這個工具被發明出來，是為了解決什麼類型的問題？**

**在它出現之前的痛點**：

- 在一組字串集合中判斷「某個前綴是否存在」，使用 HashSet 需要預先儲存所有可能的前綴子字串，空間浪費嚴重且插入時間為 O(L²)（L 為字串長度）
- 使用 Sorted Array + Binary Search 做前綴查詢需要 O(L × log n) 時間，且每次插入需要 O(n) 移動元素
- 自動補全（autocomplete）在 Hash-based 結構中無法高效列舉所有匹配前綴的字串，需要遍歷整個集合 O(n × L)

**核心價值主張**：

1. **前綴共享**：相同前綴的字串共用路徑，同時節省空間與查詢時間
2. **與集合大小無關的查詢**：查詢時間僅取決於目標字串長度 O(L)，與已儲存的字串總數 n 無關
3. **天然支援前綴操作**：`startsWith`、autocomplete、prefix count 等操作內建於結構中，無需額外邏輯

**一句話本質**：專門管理「一組字串的前綴共享關係」的樹狀資料結構

### 心智模型

**生活化類比：電話簿的索引標籤系統**

想像一本按字母排列的電話簿：

```plaintext
翻到 "A" 標籤
  └── 翻到 "An" 區
       ├── "And" 區 → Anderson, Andrews
       └── "Ant" 區 → Anthony, Anton
```

- **根節點 (Root)**：電話簿的封面——本身不代表任何字母
- **邊 (Edge)**：每翻一頁所選的字母
- **節點 (Node)**：翻到某一頁後的當前位置（代表一個前綴）
- **isEnd 標記**：某頁上有星號標記「這個前綴本身就是一個完整的名字」
- **children**：從當前頁面可以翻到的下一層字母頁
- **insert**：在正確的位置插入新名字，沿途建立不存在的標籤頁
- **search**：順著標籤逐層翻頁，最後確認有星號
- **startsWith**：順著標籤逐層翻頁，只要每頁都存在就行

**類比的局限性**：

1. 真實電話簿的「翻頁」是線性掃描（O(n)），Trie 的子節點查找是 O(1)（透過 Map 或固定大小陣列）
2. 真實電話簿不會在中間位置做「標記」，但 Trie 的每個節點都可以標記為一個完整字串的結尾

---

## 🏗️ 抽象結構

### 核心組件

| 組件         | 功能                                              | 為什麼需要                                                                    |
| ------------ | ------------------------------------------------- | ----------------------------------------------------------------------------- |
| **TrieNode** | 代表前綴路徑上的一個位置                          | 每個節點對應字串中的一個字元位置，是所有操作的基本單位                        |
| **children** | 儲存當前節點到下一層節點的映射（字元 → TrieNode） | 決定從當前前綴可以擴展哪些字元；Map 實作提供 O(1) 查找                        |
| **isEnd**    | 布林旗標，標記此節點是否為某個完整字串的結尾      | 區分「前綴存在」與「完整字串存在」——"app" 是 "apple" 的前綴但不一定是獨立字串 |
| **root**     | Trie 的起始節點，代表空字串 ""                    | 所有字串的共同起點；本身不儲存任何字元                                        |

### 狀態表示

**底層資料結構**：樹狀結構，每個節點包含一個 children 映射和一個 isEnd 旗標。

兩種常見實作方式：

| 實作方式        | children 類型            | 存取方式                      | 適用場景                               |
| --------------- | ------------------------ | ----------------------------- | -------------------------------------- |
| **Map-based**   | `Map<string, TrieNode>`  | `children.get(char)`          | 字元集大或不確定、稀疏 Trie            |
| **Array-based** | `TrieNode[CHARSET_SIZE]` | `children[charCode - offset]` | 字元集小且固定（如 26 個小寫英文字母） |

**初始狀態**：

```plaintext
root: TrieNode { children: empty, isEnd: false }
```

根節點代表空字串 ""，所有操作從 root 開始。

**關鍵狀態定義規則**：

- 一條從 root 到某節點的路徑代表一個**前綴**
- 若該節點 `isEnd === true`，則此前綴同時也是一個**完整字串**
- 每條邊代表一個字元，邊的標籤由 children 映射的 key 決定

**視覺化範例**：插入 "app", "apple", "apt", "bat" 後的 Trie

```plaintext
        (root)
       /      \
      a        b
      |        |
      p        a
     / \       |
    p   t*     t*
    |
    l
    |
    e*

* 標記 isEnd = true
路徑 root→a→p→p = "app"*（完整字串）
路徑 root→a→p→p→l→e = "apple"*（完整字串）
路徑 root→a→p→t = "apt"*（完整字串）
路徑 root→a→p = "ap"（前綴，但非完整字串，isEnd = false）
```

### 核心操作

**1. insert(word)**

**目的**：將一個字串插入 Trie，建立從 root 到最後一個字元的完整路徑，並標記結尾。

**輸入/輸出**：

- 輸入：字串 `word`
- 輸出：無（修改 Trie 結構）

**不變量**：

- 插入後，`word` 的每個前綴都存在於 Trie 中（但不一定標記為 isEnd）
- 已存在的路徑不會被重複建立
- 其他已插入的字串不受影響

**基礎實作**：

```javascript
insert(word) {
  let current = this.root;
  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    if (!current.children.has(char)) {
      current.children.set(char, new TrieNode());
    }
    current = current.children.get(char);
  }
  current.isEnd = true;
}
```

**基礎版本的問題**：

- 此操作本身已是最佳——每個字元恰好訪問一次，O(L) 時間
- 真正的效能瓶頸在於 children 的實作選擇：Map 的 hash 計算 vs. Array 的直接索引
- 空間方面：Map-based 每個節點只建立實際需要的子節點；Array-based 每個節點固定分配 26（或更多）個位置

**優化策略**：Array-based children（適用於固定小字元集）

- 核心思想：用字元的 charCode 作為陣列索引，省去 hash 計算
- 適用條件：字元集固定且小（如 26 個英文小寫字母）

```javascript
// Array-based insert
insert(word) {
  let current = this.root;
  for (let i = 0; i < word.length; i++) {
    const index = word.charCodeAt(i) - 97; // 'a' = 97
    if (!current.children[index]) {
      current.children[index] = new TrieNode();
    }
    current = current.children[index];
  }
  current.isEnd = true;
}
```

**優化後的複雜度**：時間不變（仍為 O(L)），但常數因子更小——直接索引 vs. hash 計算。

---

**2. search(word)**

**目的**：檢查某個字串是否**完整存在**於 Trie 中（必須是插入過的完整字串，而非僅前綴）。

**輸入/輸出**：

- 輸入：字串 `word`
- 輸出：`boolean`——`true` 表示此字串曾被插入

**不變量**：

- 不修改 Trie 結構（唯讀操作）
- 若 word 的某個前綴不存在於 Trie 中，提前返回 false

**基礎實作**：

```javascript
search(word) {
  let current = this.root;
  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    if (!current.children.has(char)) return false;
    current = current.children.get(char);
  }
  return current.isEnd === true;
}
```

**基礎版本的問題**：

- 操作本身已是最佳 O(L)
- 常見錯誤：忘記最後檢查 `isEnd`，導致 search("ap") 在插入 "app" 後錯誤回傳 true
- 與 `startsWith` 的唯一差別就在最後一步的 `isEnd` 檢查

**優化策略**：提取共用 `_traverse(word)` 方法

- 核心思想：`search` 和 `startsWith` 的遍歷邏輯完全相同，只差回傳條件
- 提取共用邏輯避免重複程式碼

```javascript
// 共用遍歷邏輯
_traverse(word) {
  let current = this.root;
  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    if (!current.children.has(char)) return null;
    current = current.children.get(char);
  }
  return current;
}

search(word) {
  const node = this._traverse(word);
  return node !== null && node.isEnd === true;
}
```

**視覺化說明**：

```plaintext
Trie 中已插入: "app", "apple"

search("app")  → 遍歷 root→a→p→p → isEnd=true  → return true
search("ap")   → 遍歷 root→a→p   → isEnd=false → return false
search("apex") → 遍歷 root→a→p   → 找不到 'e'  → return false
```

**優化後的複雜度**：相同，但程式碼更乾淨，減少 bug 風險。

---

**3. startsWith(prefix)**

**目的**：檢查 Trie 中是否存在任何字串以給定前綴開頭。

**輸入/輸出**：

- 輸入：字串 `prefix`
- 輸出：`boolean`——`true` 表示至少有一個已插入的字串以此前綴開頭

**不變量**：

- 不修改 Trie 結構
- 若 `search(word)` 為 true，則 `startsWith(word)` 必為 true（但反之不成立）

**基礎實作**：

```javascript
startsWith(prefix) {
  let current = this.root;
  for (let i = 0; i < prefix.length; i++) {
    const char = prefix[i];
    if (!current.children.has(char)) return false;
    current = current.children.get(char);
  }
  return true; // 不需要檢查 isEnd
}
```

**基礎版本的問題**：

- 已是最佳 O(L)，無進一步優化空間
- 唯一重點：與 `search` 相比，不檢查 `isEnd`——這是概念上的關鍵差異

**優化策略**：復用 `_traverse`

```javascript
startsWith(prefix) {
  return this._traverse(prefix) !== null;
}
```

---

**4. delete(word)**

**目的**：從 Trie 中移除一個字串。需要判斷是否能安全刪除節點（不影響其他字串的路徑）。

**輸入/輸出**：

- 輸入：字串 `word`
- 輸出：`boolean`——是否成功刪除

**不變量**：

- 刪除後，`search(word)` 回傳 false
- 共享前綴的其他字串不受影響
- 只有當節點不再被任何字串需要時，才能實際移除節點

**基礎實作**：

```javascript
// 方法一：僅清除 isEnd 旗標（懶刪除）
delete(word) {
  const node = this._traverse(word);
  if (node === null || !node.isEnd) return false;
  node.isEnd = false;
  return true;
}
```

**基礎版本的問題**：

- 懶刪除不回收空間——刪除 "apple" 後，路徑 root→a→p→p→l→e 的節點仍存在
- 如果大量插入後大量刪除，會產生大量「死路徑」，浪費空間
- 對於需要計算 children 數量的操作（如自動補全），死路徑會影響正確性

**優化策略**：遞迴真刪除

- 核心思想：從葉節點向上回溯，如果某節點（1）不是其他字串的結尾，且（2）沒有其他子節點，就可以安全刪除
- 遞迴天然支持「先深入到底，再向上清理」的模式

```javascript
delete(word) {
  return this._deleteRecur(this.root, word, 0);
}

_deleteRecur(node, word, depth) {
  // Base case: 到達字串結尾
  if (depth === word.length) {
    if (!node.isEnd) return false; // 字串不存在
    node.isEnd = false;
    // 如果沒有子節點，可以安全刪除此節點
    return node.children.size === 0;
  }

  const char = word[depth];
  const child = node.children.get(char);
  if (!child) return false; // 路徑不存在

  // Recursive case: 先深入刪除
  const shouldDeleteChild = this._deleteRecur(child, word, depth + 1);

  if (shouldDeleteChild) {
    node.children.delete(char);
    // 向上傳遞：如果自己也可以被刪除
    return !node.isEnd && node.children.size === 0;
  }

  return false;
}
```

**視覺化說明**：

```plaintext
插入 "app", "apple" 後：

        (root)              delete("apple")           結果
       /                   ─────────────→
      a                                               (root)
      |                                              /
      p                                             a
      |                                             |
      p*                                            p
      |                                             |
      l    ← 可刪除（無子節點，isEnd=false）           p*
      |
      e*   ← 清除 isEnd，無子節點 → 可刪除

"app" 不受影響，因為 p* 節點的 isEnd 仍為 true
```

**優化後的複雜度**：時間 O(L)，空間 O(L)（遞迴堆疊）。

---

**5. collectWordsWithPrefix(prefix)（自動補全）**

**目的**：給定前綴，列舉 Trie 中所有以此前綴開頭的完整字串。

**輸入/輸出**：

- 輸入：字串 `prefix`
- 輸出：字串陣列（所有匹配的完整字串）

**不變量**：

- 回傳的每個字串 s 都滿足 `search(s) === true`
- 回傳的每個字串 s 都滿足 `s.startsWith(prefix) === true`

**基礎實作**：

```javascript
collectWordsWithPrefix(prefix) {
  const node = this._traverse(prefix);
  if (!node) return [];

  const results = [];
  this._dfs(node, prefix, results);
  return results;
}

_dfs(node, currentWord, results) {
  if (node.isEnd) results.push(currentWord);

  for (const [char, child] of node.children) {
    this._dfs(child, currentWord + char, results);
  }
}
```

**基礎版本的問題**：

- 字串拼接 `currentWord + char` 每次都建立新字串，O(L) 的拼接成本
- 如果匹配的字串非常多，可能需要全部放入記憶體

**優化策略**：使用陣列收集字元 + Generator 惰性產出

- 核心思想：用 `char[]` 累積路徑避免重複建立字串；用 generator 按需產出結果

```javascript
*collectWordsWithPrefix(prefix) {
  const node = this._traverse(prefix);
  if (!node) return;

  const path = [...prefix]; // 可變陣列
  yield* this._dfsGen(node, path);
}

*_dfsGen(node, path) {
  if (node.isEnd) yield path.join('');

  for (const [char, child] of node.children) {
    path.push(char);
    yield* this._dfsGen(child, path);
    path.pop(); // 回溯
  }
}
```

**優化後的複雜度**：

- 時間：O(P + K × L_avg)，P = 前綴長度，K = 匹配數量，L_avg = 匹配字串的平均長度
- 空間：O(L_max)（遞迴深度 + path 陣列），不計算輸出

---

### 核心操作複雜度總結

| 操作                           | 時間複雜度       | 空間複雜度 | 備註                            |
| ------------------------------ | ---------------- | ---------- | ------------------------------- |
| **基礎操作**                   |                  |            |                                 |
| insert(word)                   | O(L)             | O(L)       | 最壞情況建立 L 個新節點         |
| search(word)                   | **O(L)**         | O(1)       | 核心優勢：與字串集合大小 n 無關 |
| startsWith(prefix)             | **O(L)**         | O(1)       | 與 search 僅差 isEnd 檢查       |
| **刪除**                       |                  |            |                                 |
| delete(word) — 懶刪除          | O(L)             | O(1)       | 僅清除 isEnd，不回收空間        |
| delete(word) — 真刪除          | O(L)             | O(L)       | 遞迴回溯清理無用節點            |
| **前綴枚舉**                   |                  |            |                                 |
| collectWordsWithPrefix(prefix) | O(P + K × L_avg) | O(L_max)   | P=前綴長度，K=匹配數            |

**符號定義**：

- `L`：目標字串（word 或 prefix）的長度
- `n`：已插入的字串總數
- `P`：前綴長度
- `K`：匹配前綴的字串數量
- `L_avg` / `L_max`：匹配字串的平均/最大長度

**結構本身的空間複雜度**：O(N × L_avg)（最壞情況，無前綴共享）；最佳情況遠小於此（大量前綴共享）

---

## ⭐ 抽象化翻譯器

### 識別核心抽象

> 這個工具的核心對象是：**字串的前綴路徑**
>
> 它管理的是這些對象之間的：**共享前綴關係（相同前綴的字串共用路徑）**

Trie 將「字串集合」重新組織為「前綴共享樹」。每條從 root 到某節點的路徑代表一個前綴，而 isEnd 標記將前綴升格為完整字串。所有操作的本質都是在這棵前綴共享樹上進行路徑遍歷。

### 建立映射維度

| 維度                     | 要回答的問題                                             | 這個答案決定了什麼                                     |
| ------------------------ | -------------------------------------------------------- | ------------------------------------------------------ |
| **維度 1：字元集定義**   | 問題中的「字母表」是什麼？每個節點有多少種可能的子節點？ | children 的實作方式（Map vs. Array[26] vs. Array[2]）  |
| **維度 2：節點附加資訊** | 除了 isEnd 之外，每個節點需要記錄什麼額外資訊？          | TrieNode 的欄位設計（如：count、value、children list） |
| **維度 3：遍歷模式**     | 操作是「精確路徑追蹤」還是「子樹探索」？                 | 用迴圈走單一路徑 vs. 用 DFS/BFS 遍歷子樹               |

### 實戰檢查表

```plaintext
題目：_______________

維度 1 - 字元集：_______________
  → 決定 children 結構（Map / Array[26] / Array[2] / ...）

維度 2 - 節點資訊：_______________
  → 除了 isEnd，還需要存什麼？（count? value? word reference?）

維度 3 - 遍歷模式：_______________
  → 精確匹配 / 前綴匹配 / 萬用字元匹配 / 子樹蒐集？

填完後，核心邏輯應該能直接寫出。
```

### 映射範例

**題目 A**：[208. Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree/)

| 維度   | 具體問題                                        | 抽象映射                         |
| ------ | ----------------------------------------------- | -------------------------------- |
| 維度 1 | 小寫英文字母 a-z                                | Array[26] 或 Map，字元集固定且小 |
| 維度 2 | 只需區分「完整字串」和「前綴」                  | isEnd 旗標即可，無需額外欄位     |
| 維度 3 | insert/search 走精確路徑；startsWith 走精確路徑 | 純迴圈遍歷，無需 DFS             |

**從映射到實作的關鍵步驟**：三個操作共享相同的「逐字元走路徑」邏輯，差異僅在終止條件。

**題目 B**：[211. Design Add and Search Words Data Structure](https://leetcode.com/problems/design-add-and-search-words-data-structure/)

| 維度   | 具體問題                                                      | 抽象映射                                                               |
| ------ | ------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 維度 1 | 小寫英文字母 a-z + 萬用字元 '.'                               | children 結構同 208，但 '.' 不是存入 Trie 的字元，而是查詢時的分支信號 |
| 維度 2 | 只需 isEnd                                                    | 無額外欄位                                                             |
| 維度 3 | addWord = 精確路徑；search 遇 '.' 需**分支遍歷所有 children** | 遇 '.' 時從迴圈切換到 DFS/遞迴，遍歷當前節點的所有子節點               |

**從映射到實作的關鍵步驟**：search 的核心判斷——`word[i] === '.'` 時，對 `node.children` 的每個子節點遞迴呼叫 `search(word, i+1, child)`，任一回傳 true 即可。

---

## 🔍 觸發器（模式識別）

### 正向觸發器

| 層級         | 特徵                                                    | 為什麼這個特徵指向 Trie                               |
| ------------ | ------------------------------------------------------- | ----------------------------------------------------- |
| **關鍵字**   | "prefix"、"前綴"、"autocomplete"、"字典"、"word search" | Trie 的核心價值就是前綴操作                           |
| **關鍵字**   | "starts with"、"common prefix"、"longest prefix"        | 前綴查詢是 Trie 的 O(L) 操作，其他結構做不到          |
| **結構**     | 輸入是一組字串 + 需要對前綴做查詢/計數                  | 字串集合 + 前綴操作 = Trie 的典型場景                 |
| **結構**     | 需要逐字元做決策（每個字元有分支邏輯）                  | Trie 的每條邊就是一個字元決策點                       |
| **目標**     | 找所有以某前綴開頭的字串                                | collectWordsWithPrefix 是 Trie 的天然操作             |
| **目標**     | 用一組字串「引導」另一個搜尋過程（如 Word Search II）   | Trie 作為搜尋方向的剪枝器                             |
| **操作模式** | 大量字串的插入 + 大量前綴查詢（操作次數 >> 字串數）     | 建樹 O(n×L) 一次，每次查詢 O(L)，攤銷下來優於排序方案 |
| **操作模式** | 需要對二進位數字做前綴級別的比較（如 XOR 最大值）       | 二進位 Trie：字元集 = {0, 1}，Array[2] 實作           |

**一句話觸發規則**：看到「一組字串 + 前綴相關操作」→ 想到 Trie

### 反向觸發器

| 陷阱情境                                 | 為什麼不適用                                     | 更好的選擇                       |
| ---------------------------------------- | ------------------------------------------------ | -------------------------------- |
| 只需判斷「完整字串是否存在」，無前綴操作 | HashSet 的 O(1) 查找比 Trie 的 O(L) 更快且更簡單 | HashSet                          |
| 需要按字典序排列字串，但不需要前綴查詢   | 排序 O(n log n) 比建 Trie O(n×L) 更直接          | Sorted Array                     |
| 字串模式匹配（如正則表達式、子字串搜尋） | Trie 只處理前綴，不處理子字串或正則              | KMP、Rabin-Karp、Suffix Array    |
| 最長公共子字串（substring，非 prefix）   | 子字串問題需要 Suffix Tree / Suffix Array        | Suffix Array + LCP               |
| 只有少量字串且查詢次數很少               | 建 Trie 的開銷不划算                             | 直接遍歷 + `String.startsWith()` |

### 與類似工具的決策點

```plaintext
字串集合操作
├── 只需「存在性」查詢（exact match）
│   └── HashSet（O(1) 查找，最簡單）
├── 需要「前綴」操作
│   ├── 前綴查詢 + 前綴枚舉 → Trie（核心場景）
│   ├── 最長前綴匹配 → Trie（逐字元走到無法繼續為止）
│   └── 只需 startsWith 且字串量小 → Sorted Array + Binary Search
├── 需要「子字串」操作
│   └── Suffix Trie / Suffix Array（不是普通 Trie）
├── 需要「排序」或「範圍查詢」
│   └── Balanced BST / Sorted Array
└── 二進位數字的前綴級比較（XOR 問題）
    └── Binary Trie（字元集 = {0, 1}）
```

---

## ⚠️ 注意事項

### 常見陷阱

| 陷阱                      | 錯誤寫法                               | 正確寫法                              | 為什麼                                                     |
| ------------------------- | -------------------------------------- | ------------------------------------- | ---------------------------------------------------------- |
| search 忘記檢查 isEnd     | `return true` （遍歷結束直接回傳）     | `return current.isEnd === true`       | "ap" 不應該在只插入 "app" 時被找到                         |
| 根節點存字元              | `root.val = ''` 或根節點代表第一個字元 | root 是空節點，邊代表字元             | root 是所有字串的共同起點，本身不代表任何字元              |
| 刪除時破壞共享前綴        | 直接刪除路徑上的所有節點               | 遞迴回溯，只刪除無其他用途的節點      | "app" 和 "apple" 共享 root→a→p→p 路徑                      |
| '.' 萬用字元插入 Trie     | 把 '.' 當普通字元存入 children         | '.' 只在查詢邏輯中處理，不存入 Trie   | '.' 是查詢時的控制字元，不是資料                           |
| Array-based 忘記 offset   | `children[char]`                       | `children[char.charCodeAt(0) - 97]`   | 直接用 charCode 會超出陣列範圍                             |
| JS 效能：Map 上直接加屬性 | `map.__isEnd = true`                   | 獨立的 TrieNode class 包含 isEnd 欄位 | 在 Map 上加非 Map 屬性違反資料結構設計原則，且影響 V8 優化 |

### 常見變體

| 變體                        | 修改內容                                     | 適用場景                                             |
| --------------------------- | -------------------------------------------- | ---------------------------------------------------- |
| **計數 Trie**               | 節點增加 `count` 欄位，insert 時沿途 +1      | 統計有多少字串經過某前綴（前綴計數）                 |
| **值映射 Trie**             | 節點增加 `value` 欄位（取代 isEnd）          | MapSum（LeetCode 677）：前綴的值加總                 |
| **Binary Trie**             | 字元集 = {0, 1}，children 大小 = 2           | XOR 最大值問題（LeetCode 421）                       |
| **壓縮 Trie（Radix Tree）** | 合併只有單一子節點的連續路徑                 | 節省空間，用於路由表、IP 查詢                        |
| **Trie + DFS Backtracking** | Trie 作為 DFS 搜尋的方向引導器               | Word Search II（LeetCode 212）：在棋盤上用 Trie 剪枝 |
| **刪除標記 Trie**           | insert 時沿途遞增 `passCount`，delete 時遞減 | 支援高效刪除 + 前綴計數                              |
