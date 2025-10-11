---
title: "211. Design Add and Search Words Data Structure"
tags:
  - String
  - Depth-First Search
  - Design
  - Trie
difficulty: "Medium"
date_solved: "2025-10-11"
link: "https://leetcode.com/problems/design-add-and-search-words-data-structure/description/"
---

## 問題描述

設計一個資料結構，可以「新增字串」「查詢前面加入過的字串」

實作 **WordDictionary** Class

- addWord：新增字串，用於後續查詢
- search：查詢前面加入過的字串。字串中可以包含「.」代表任何單一字符

## Constraints

- 1 <= word.length <= 25
- word in addWord consists of lowercase English letters.
- word in search consist of &#39;.&#39; or lowercase English letters.
- There will be at most 2 dots in word for search queries.
- At most 10\*\*4 calls will be made to addWord and search.

## 解題思路

### 初步分析

- 關鍵觀察：
  - 查詢時遇到「.」時，只要當前節點下的子節點存在 end of word flag 則代表符合(可以提前返回)
  - 這不是簡單的字串查找（HashSet 不適用）
  - 需要支援部分匹配（萬用字元）
  - 需要高效的前綴搜尋結構 → Trie（字典樹）
- 適用 Pattern：建立 WordDictionary trie，在查詢時遇到「.」要遍歷底下全部 children，而不是只找單一路徑
- 可能的陷阱：
  - 如果「.」在第一個字符，會不會直接導致底下子節點全部都要遍歷？
  - 如果全部字串都是「.」，會不會要直接走訪整顆 trie？ 題目說最多兩個 dots

## 解法總覽

### Solution1

- **思路說明**：建立 word dictionary trie 實作 addWord 和 search 邏輯，search 遇到「.」的時候要直接遍歷底下 children，一旦遇到一個 end of word 可以 early return true

- **複雜度分析**：

  - addWord(word)

    - 時間：O(w)，w 是 word 長度
    - 空間：O(w)，最多創建 w 個新節點

  - search(word)

    - 時間（最好）：O(w)，無 '.' 時
    - 時間（最壞）：O(26^m × w)，m 是 '.' 的數量(題目保證 ≤ 2)

      - 為什麼是指數級？
        - 假設搜尋 "....."（5 個點）且 trie 每層都有 26 個分支：
        - 第 1 個 '.' → 檢查 26 個分支
        - 第 2 個 '.' → 每個分支再檢查 26 個子分支 → 26²
        - 第 3 個 '.' → 26³
        - 第 4 個 '.' → 26⁴
        - 第 5 個 '.' → 26⁵

    - 空間：O(w)，遞迴呼叫堆疊深度

  - 整體空間複雜度

    - O(N × W)，N 是加入的單詞數量，W 是平均單詞長度

  - 通過狀態：AC

- **其他備註\(優化方向、特殊限制、問題延伸討論\)**：

  - 三種不同的 search 的實作

    1. \_search: 遞迴 + some()
    2. \_searchFromNodeDFS: DFS 遞迴（標準）
    3. \_searchFromNodeIter: DFS 迭代（堆疊）

  - 問題延伸討論：如果 . 可以匹配 0 到多個字母呢？

    方向：需要更複雜的狀態機或動態規劃

  - 問題延伸討論：如何支援刪除單詞？

    方向：引用計數或標記刪除

  - 問題延伸討論：如果記憶體有限，如何優化？

    方向：壓縮 Trie、共用節點

  - 問題延伸討論：如何實作 wildcard 的優先級匹配？

    方向：BFS + 優先隊列

- **測試案例**：

  - 案例 A: 簡單得測試案例

    Input:

    ["WordDictionary","addWord","addWord","addWord","search","search","search","search"]
    [[],["bad"],["dad"],["mad"],["pad"],["bad"],[".ad"],["b.."]]

    Output:

    [null,null,null,null,false,true,true,true]

    Expected:

    [null,null,null,null,false,true,true,true]

  ***

  - 案例 B: 頭、尾是 dots

    Input:

    ["WordDictionary","addWord","addWord","addWord","search","search","search","search","search"]
    [[],["bad"],["dad"],["mad"],["pad"],["bad"],[".ad"],["..a"],["ma."]]

    Output:

    [null,null,null,null,false,true,true,false,true]

    Expected:

    [null,null,null,null,false,true,true,false,true]

  ***

  - 案例 C: 只有一個字且是「.」

    Input:

    ["WordDictionary","addWord","search"]
    [[],["a"],["."]]

    Output:

    [null,null,true]

    Expected:

    [null,null,true]

### Solution2

- **思路說明**：改用固定長度陣列（Array）實作 Trie，每個節點的 children 使用長度為 26 的陣列，透過 `charToIndex` 將字母映射到索引位置（'a' → 0, 'b' → 1, ...）

- **與 Solution1 的差異**：

  - **資料結構**：Map/Object → Array[26]
  - **存取方式**：`node.children.has(char)` → `node.children[index] !== null`
  - **空間特性**：動態分配 → 固定分配
  - **時間特性**：需 hash 計算 → 直接索引，理論上更快

- **複雜度分析**：

  - addWord(word)

    - 時間：O(w)，w 是 word 長度
    - 空間：O(w × 26)，每個新節點固定分配 26 個空間

  - search(word)

    - 時間（最好）：O(w)，無 '.' 時，且直接索引訪問比 Map 快
    - 時間（最壞）：O(26^m × w)，m 是 '.' 的數量

      - 遍歷 26 個固定位置時需檢查 `null`，但無需 hash 計算

    - 空間：O(w)，遞迴呼叫堆疊深度

  - 整體空間複雜度

    - O(N × W × 26)，理論上比 Solution1 大，但實務上對於密集的 Trie（每個節點有多個子節點）差異不大

  - 通過狀態：AC

- **優缺點分析**：

  - **優點**：

    - 直接索引訪問，無需 hash 計算，實務上可能更快
    - 程式碼更簡潔（固定大小，無需動態管理）
    - CPU cache 友好（連續記憶體分配）

  - **缺點**：

    - 空間使用較不靈活，每個節點都佔用 26 個位置
    - 若字元集很大或動態變化，會浪費大量空間
    - 只適用於固定小字元集（如 26 個英文字母）

- **適用場景**：

  - 字元集固定且較小（如僅英文小寫字母）
  - Trie 較密集（大部分節點都有多個子節點）
  - 對效能要求高，可接受較大記憶體消耗

- **測試案例**：（同 Solution1）

## 學習記錄

- 首次解題：2025-10-11 | 耗時：28分鐘 | 獨立完成：是
- 複習 1：\_\_\_\_ | 順暢度：□ 流暢 □ 卡頓 □ 忘記
