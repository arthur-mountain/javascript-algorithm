---
title: "208. Implement Trie (Prefix Tree)"
tags:
  - Hash Table
  - String
  - Design
  - Trie
difficulty: "Medium"
date_solved: "2025-10-05"
---

## 問題描述

建立一個 trie，並實現 insert, search, startsWith 三種 methods

## Constraints

- 1 <= word.length, prefix.length <= 2000
- word and prefix consist only of lowercase English letters.
- At most 3 \* 10\*\*4 calls <strong>in total</strong> will be made to insert, search, and startsWith.

## 解法總覽

### Solution1：Map 實作 Trie（前綴樹）

- 思路說明：

  使用 JavaScript Map 實作。每個節點的 children 都是一個 Map，以字元為 key，指向下一層的 Map。透過逐字元遍歷的方式建立樹狀結構，並使用 `__isEnd` 屬性標記完整單字的結尾節點。

- 時間複雜度：

  - `insert(word)`: O(len(word))
  - `search(word)`: O(len(word))
  - `startsWith(prefix)`: O(len(prefix))

- 空間複雜度：

  - `insert(word)`: O(len(word))，最壞情況下需要建立 len(word) 個新節點
  - `search(word)`: O(1)，僅使用常數額外空間進行查詢
  - `startsWith(prefix)`: O(1)，僅使用常數額外空間進行查詢

- 程式碼說明：

  1. **建構函式**：初始化根節點的 children 為空 Map，作為 Trie 的起點
  2. **insert 方法**：
     - 從根節點開始，逐字元檢查。若該字元已存在則往下移動；若不存在則建立新的 Map 節點。
     - 遍歷完成後在最後節點設置 `__isEnd = true` 標記單字結尾
  3. **search 方法**：從根節點開始逐字元查找，若任一字元不存在則返回 false。遍歷完成後檢查 `__isEnd` 屬性，確保是完整單字而非僅有前綴
  4. **startsWith 方法**：類似 search，但只需確認前綴路徑存在即可，無需檢查 `__isEnd`

- 其他備註：

  - 實作優化建議：目前使用 `__isEnd` 屬性直接標記在 Map 上，雖然可行但不符合資料結構設計原則。
    建議建立獨立的 TrieNode 類別，將 children 和 isEnd 封裝為節點屬性，讓結構更清晰且易於維護。

### Solution1-2：Map 實作 Trie（前綴樹）

同 solution1，修正直接在 Map 標記 \_\_isEnd 屬性的問題

### Solution2：Array 實作 Trie（前綴樹）

- 思路說明：

  使用 JavaScript Array 實作。
  每個節點的 children 都是一個 Array，每一個 index 透過 char code，value 指向下一個 TrieNode。透過逐字元遍歷的方式建立樹狀結構

- 時間複雜度：

  - `insert(word)`: O(len(word))
  - `search(word)`: O(len(word))
  - `startsWith(prefix)`: O(len(prefix))

- 空間複雜度：

  - `insert(word)`: O(len(word))，最壞情況下需要建立 len(word) 個新節點
  - `search(word)`: O(1)，僅使用常數額外空間進行查詢
  - `startsWith(prefix)`: O(1)，僅使用常數額外空間進行查詢

- 程式碼說明：

  1. **建構函式**：初始化根節點的 children 為長度 26 的 array（初始值為 undefined），作為 Trie 的起點
  2. **insert 方法**：
     - 從根節點開始，逐字元檢查。若該字元已存在則往下移動；若不存在則建立新的 TrieNode 節點。
     - 遍歷完成後在最後節點設置 `isEnd = 1` 標記單字結尾
  3. **search 方法**：從根節點開始逐字元查找，若任一字元不存在則返回 false。遍歷完成後檢查 `isEnd` 屬性，確保是完整單字而非僅有前綴
  4. **startsWith 方法**：類似 search，但只需確認前綴路徑存在即可，無需檢查 `isEnd`

- 其他備註：

  - Array 實作的優點：

    - 索引訪問時間為 O(1)，不需要像 Map/Object 進行 hash 計算
    - 對於字符集固定且較小的情況（如僅小寫字母、二進制等）效率很高

  - Array vs Map/Object 的具體比較：

    - Array：每個節點固定占用 26 個指針空間（即使只使用其中幾個）
    - Map/Object：只存儲實際使用的字符，空間利用率更高
    - 建議根據實際字符集大小和稀疏程度選擇

  - 適用場景更明確：

    - 字符集小（≤10 個字符）：Array 實作更優
    - 字符集大且稀疏（如完整 Unicode）：Map/Object 實作更優
    - 字符串數量多且有大量共享前綴：兩種實作都適合
