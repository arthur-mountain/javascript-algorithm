---
title: "130. Surrounded Regions"
tags:
  - Array
  - Depth-First Search
  - Breadth-First Search
  - Union Find
  - Matrix
difficulty: "Medium"
date_solved: "2025-12-07"
link: "https://leetcode.com/problems/surrounded-regions/description/"
---

## 問題描述

給予一個 m x n board 只會有 'X' and 'O' 兩種 letters，

將 surrouned region in-place 將 'O' 替換成 'X'，

Region 定義:所有被 X 包圍起來的 O(包含水平、垂直方向連起來的範圍)，且 region 內的任一個 0 不能在邊

## Constraints

- m == board.length
- n == board[i].length
- 1 <= m, n <= 200
- board[i][j] is &#39;X&#39; or &#39;O&#39;.

## 解題思路

### 初步分析(觀察與發想)

- 使用 DFS， 當遇到 'O' 的時候才進入 DFS 流程，

  收集 region cells，再判斷是否包含在邊上的 'O'，如果沒有則可以把該 region 範圍內的值都替換成 'X'。

  - matrix，水平垂直連接, BFS / DFS

  - capture region、連通性、區域性, Union Find(?)

  - 邊界是特殊的, 如果 region 包含邊界上的 cell(s) 則不合法

  - in-place, 不能建立新陣列

  - 邊界上的 cell 都不考慮且一但連通到邊界上的 "O" 整個 region 不合法

    - 收集最外層的 "O" 的keys

    - 收集完當前 region 判斷要不要 replace 後這些 region cell 都是聯通得，所以不需要回朔，因此不需要 visited.delete

    - 從最外層往內一層開始遍歷

  初步複雜度分析：

  - 時間： O(m x n) -> 每個元素被訪問常數次，因為被訪問過一次就不再訪問，不論是 'X' or 'O'

  - 空間： O(m x n) -> callstack + visited + region cells 都可能存 m x n 個元素

## 解法總覽

### Solution1 - DFS(正向思考)

- **思路說明**：

  遍歷 board 只需遍歷在 1 ~ ROW - 1 and 1 ~ COL - 1 就好，

  因為在邊界的值不論是 'X' or 'O' 都不用處理，

  當遇到 'O' 時，建立一個 regionCells 陣列用來收集每一個 cells，進入 DFS 流程，

  **DFS 流程：**

  1. 判斷是否 visited，如果訪問過就不重複訪問

  2. 將當前格子加入到 regionCells 跟 visited 中，接著遍歷當前格子的四個鄰居遞迴 DFS

     - 只有鄰居格子在合法邊界內且 cell 為 'O' 才遞迴 DFS

  當 DFS 結束後，代表這輪聯通的 regionCells 收集完畢後，

  先檢查是否有邊上的 cell，如果沒有才進行標記，將 'O' 改成 'X'，

  接著繼續上述流程進行遍歷，直到遍歷結束

- **複雜度分析**：

  - 時間複雜度：O(m \* n) -> 每個 cell 被訪問常數次，不論是 'O' or 'X' 一旦被訪問就會被加進 visited 中，後續不再訪問

  - 空間複雜度：O(m \* n) -> callstack + visited + region cell 可能存 m x n 個元素

  - 通過狀態： ✅ AC

- **其他備註\(優化方向、特殊限制、問題延伸討論\)**：

  - 目前使用的空間複雜度比較多，涉及到三個資料結構去收集。優化在 Solution2

- **測試案例**：

  - 案例 A: 中間的 region 要替換，但邊上的 "O" 不處理

    Input: board = [["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]

    Ouput: [["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]

    Expected: [["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]

  ***

  - 案例 B: 只有一個 "X"，不用處理

    Input: board = [["X"],]

    Ouput: [["X"],]

    Expected: [["X"],]

  ***

  - 案例 C: 只有一個 "O"，也不用處理，因為在邊上

    Input: board = [["O"],]

    Ouput: [["O"],]

    Expected: [["O"],]

  ***

  - 案例 D: 因為 region 連到邊上了，所以整塊 region 不處理

    Input: board = [["X","X","X","X"],["X","O","O","X"],["X","O","O","X"],["X","O","X","X"]]

    Ouput: [["X","X","X","X"],["X","O","O","X"],["X","O","O","X"],["X","O","X","X"]]

    Expected: [["X","X","X","X"],["X","O","O","X"],["X","O","O","X"],["X","O","X","X"]]

  ***

  - 案例 E: 整個 board 都是 "O"，不但沒有被 "X" 包圍，整塊 region 包含邊上的 "O"，所以不處理

    Input: board = [["O","O","O","O"],["O","O","O","O"],["O","O","O","O"],["O","O","O","O"]]

    Ouput: [["O","O","O","O"],["O","O","O","O"],["O","O","O","O"],["O","O","O","O"]]

    Expected: [["O","O","O","O"],["O","O","O","O"],["O","O","O","O"],["O","O","O","O"]]

  ***

  - 案例 F: 整個 board 都是 "X"，不用處理

    Input: board = [["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","X","X","X"]]

    Ouput: [["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","X","X","X"]]

    Expected: [["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","X","X","X"]]

## 學習記錄

- 首次解題(DFS正向思考)：2025-12-07 | 耗時：不紀錄(重理解思路) | 獨立完成：是
- 複習1：<!-- 日期 --> | 耗時：分鐘 | 獨立完成：□ 是 □ 否 | 順暢度：□ 流暢 □ 卡頓 □ 忘記
