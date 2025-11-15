---
title: "100. Same Tree"
tags:
  - Tree
  - Depth-First Search
  - Breadth-First Search
  - Binary Tree
difficulty: "Easy"
date_solved: "2025-11-03"
link: "https://leetcode.com/problems/same-tree/description/"
---

## 問題描述

給予兩個 Binary tree root 節點，檢查它們是否是「同一棵樹」。

「同一棵樹」的定義：兩個樹的結構是完全一致的且節點的值都要一樣

## Constraints

- The number of nodes in both trees is in the range [0, 100].
- -10**4 <= Node.val <= 10**4

## 解題思路

### 初步分析(觀察與發想)

- 使用 DFS 遍歷，每次要檢查兩棵樹同一位子的節點一致

## 解法總覽

### Solution1

- **思路說明**：

  直接透過遞迴 isSameTree 主函式，傳入兩個節點的值進行比較，

  - 如果兩個節點直接為 null，代表抵達葉子節點，返回 true
  - 如果其中一個節點為 null 或者節點值不一樣，表示不一致，返回 false
  - 遞迴往下繼續比較兩個樹的子樹，傳入的子樹兩節點參數的位子要一致
    - 若 q 傳入左子樹，p 也要傳入左子樹，以此類推

- **複雜度分析**：

  - 時間複雜度：O(n)

  - 空間複雜度：O(logn)

  - 通過狀態： ✅ AC

- **其他備註\(優化方向、特殊限制、問題延伸討論\)**：

  - 遞迴改用 iterative 寫？ See isSameTreeIteration

  - 改用 BFS 解？ See Solution2

- **測試案例**：

  - 案例 A: 皆為空節點

    Input: p = [], q = []

    Output: false

    Expected: false

  ***

  - 案例 B: 其中一個為空節點

    Input: p = [], q = []

    Output: false

    Expected: false

  ***

  - 案例 C: 兩棵樹節點不一致

    Input: p = [1,2], q = [1,null,2]

    Output: false

    Expected: false

  ***

  - 案例 D: 兩棵樹節點一致但節點值不一致

    Input: p = [1,2,1], q = [1,1,2]

    Output: false

    Expected: false

### Solution2(BFS)

- **思路說明**：

  初始化 queue，透過一維陣列的連續每兩個節點代表 p and q。初始化時注意 p and q 可能為空

  - 如果兩個節點直接為 null，代表抵達葉子節點，繼續下一輪迴圈
  - 如果其中一個節點為 null 或者節點值不一樣，表示不一致，返回 false
  - 繼續比較兩個樹的子樹，將當前節點子樹對應得兩節點進 queue，兩節點參數的位子要一致
    - 若 q 傳入左子樹，p 也要傳入左子樹，以此類推

  最後返回 true，代表通過上述檢查，沒有被 earyly return false

- **複雜度分析**：

  - 時間複雜度：O(n)

  - 空間複雜度：O(w)

  - 通過狀態： ✅ AC

- **測試案例**： 同 Solution1 測試範例

## 學習記錄

- 首次解題：2025-11-03 | 耗時：11分鐘 | 獨立完成：是
- 複習1：2025-11-04 | 耗時：4分鐘 | 獨立完成：是 | 順暢度：流暢
- 複習3：2025-11-07 | 耗時：5分鐘 | 獨立完成：是 | 順暢度：流暢
- 複習4：2025-11-14 | 耗時：3分鐘 | 獨立完成：是 | 順暢度：流暢。刻意練習 BFS，不然前幾次都寫 DFS
