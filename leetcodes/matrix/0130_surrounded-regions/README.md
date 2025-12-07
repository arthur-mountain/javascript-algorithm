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

    - 收集完當前 region 判斷要不要 replace 後這些 region cell 都是連通得，所以不需要回朔，因此不需要 visited.delete

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

  當 DFS 結束後，代表這輪連通的 regionCells 收集完畢後，

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

### Solution2 - DFS(反向思考)

- **思路說明**：

  Solution1 為正向思考，從每一個 'O' 出發找到連通區域，相較得使用得空間比較多。

  此解法為反向思考(空間使用率降低外整體寫起來也比較乾淨)

  1. 先從邊界出發，進入 DFS 流程直接 in-place 對 board 進行標記，

     目的是: 從邊界上的 'O' 出發，將任何與邊界 'O' 連通的 'O' 標記成 '#'

     **DFS 流程：**

     1. 若當前 indcies 越界內或者格子等於 'X' or '#' 則不用訪問

        - 透過標記為 '#' 一方面代表該格子與邊界上的 'O' 連通，一方面也代表這個格子拜訪過，相當於 visisted 的效果

        - 若格子是 'X' 也不用訪問，因為目的是找與邊界 'O' 連通的 'O'

     2. 將當前格子標記為 '#' 作為與邊界上的 'O' 連通的標記，再後續遍歷處理標記時會翻轉回 'O'

     3. 接著遍歷當前格子的四個鄰居遞迴 DFS

     當 DFS 結束代表整個 board 標記結束

  2. 再遍歷 board 處理標記和 region

     - 把標記成 '#' 的格子都還原成 'O'

     - 把仍然為 'O' 的格子翻轉成 'X'，因為他不與邊上的 'O' 連通

  即可回傳 board

- **複雜度分析**：

  - 時間複雜度：O(m \* n) -> 每個 cell 常數次訪問

  - 空間複雜度：O(m \* n) -> callstack

  - 通過狀態： ✅ AC

- **其他備註\(優化方向、特殊限制、問題延伸討論\)**：

  - Pattern: 正向 vs 反向

    **何時考慮反向？**

    - 「例外」比「常規」少時
    - 邊界有特殊性質時
    - 空間複雜度可優化時

- **測試案例**： 同 Solution1 測試案例

## 學習記錄

- 首次解題(DFS正向思考)：2025-12-07 | 耗時：不紀錄(重理解思路) | 獨立完成：是
- 首次解題(DFS反向思考)：2025-12-07 | 耗時：不紀錄(重理解思路) | 獨立完成：否
- 複習1：<!-- 日期 --> | 耗時：分鐘 | 獨立完成：□ 是 □ 否 | 順暢度：□ 流暢 □ 卡頓 □ 忘記
