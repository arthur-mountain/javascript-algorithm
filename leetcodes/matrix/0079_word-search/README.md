---
title: "79. Word Search"
tags:
  - Array
  - String
  - Backtracking
  - Depth-First Search
  - Matrix
difficulty: "Medium"
date_solved: "2025-11-29"
link: "https://leetcode.com/problems/word-search/description/"
---

## 問題描述

給予一個 m x n characters board 和一個 word string，

如果 word 存在在 board 中返回 true，否則返回 false

## Constraints

- m == board.length
- n = board[i].length
- 1 <= m, n <= 6
- 1 <= word.length <= 15
- board and word consists of only lowercase and uppercase English letters.

## 解題思路

### 初步分析(觀察與發想)

- 可以使用 DFS，起始點可以遇到 word\[0\] 才開始 DFS，當 DFS 連接起來的字串長度等於 word 時作為 base case。

  初步複雜度分析：

  - 時間 O(m \* n \* 4^L)：每個格子都可能作為起點，從每個起點出發最壞情況下探索 4^L 個節點（L 為 word 長度，每層最多 4 個方向）

  - 空間 O(L)：遞迴深度最多為 word 長度

- 適合使用 **Backtracking**（基於 DFS）：

  - 從符合 word\[0\] 的格子開始嘗試

  - 遞迴搜尋四個方向，匹配下一個字元

  - 若當前路徑失敗，撤銷選擇（回溯取消標記）後嘗試其他方向

  - 當匹配完整個 word 時返回 true

## 解法總覽

### Solution1 - DFS+backtracking

- **思路說明**：

  遍歷 board，若當前格子符合第一個 character 則嘗試開始 DFS。

  **DFS 流程（以寫法三為例）：**

  1. 進入函數後，先檢查當前位置是否已訪問過（透過 `used` Set 記錄）
  2. 檢查當前位置的字元是否等於 `word[wordIndex]`
  3. 若 `wordIndex === word.length - 1`，代表已匹配完整個 word，返回 true
  4. 標記當前位置為已訪問（`used.add(key)`）
  5. 向四個方向（上、右、下、左）遞迴搜尋下一個字元
  6. 若任一方向找到完整路徑則返回 true
  7. 若四個方向都失敗，移除當前位置標記（backtracking），返回 false

  **關鍵設計：**

  - 使用 `row * COL + col` 作為位置的唯一 key 來標記訪問狀態
  - 透過傳遞 `wordIndex` 避免需要累積字串，節省空間
  - 在函數開頭集中所有檢查條件（guard clauses），邏輯清晰

- **複雜度分析**：

  - 時間複雜度：O(m \* n \* 4^L)，其中 L 是 word 長度

    - 最壞情況下，每個起點都要嘗試，每次搜尋最多擴展 4^L 個節點

  - 空間複雜度：O(L)

    - 遞迴深度最多為 L（word 長度）

    - `used` Set 在單次 DFS 中最多存 L 個位置

  - 通過狀態：✅ AC

- **其他備註(優化方向、特殊限制、問題延伸討論)**：

  - **三種實作寫法比較：** 三種寫法時間空間複雜度相同，實務上效能差異可忽略，選擇寫法三主要考量程式碼可維護性

    - **寫法一（外層預檢查）**：每次進入 DFS 前先檢查 `board[newRow][newCol] === word[newWordIndex]`

      - 優點：提早過濾不匹配的位置，減少函數呼叫次數

      - 缺點：檢查邏輯分散在外層和內層，可讀性稍差

    - **寫法二（內層首行檢查）**：進入 DFS 後立即檢查 `board[row][col] !== word[wordIndex]`

      - 優點：所有邏輯統一在 DFS 內部，整體寫法一致
      - 缺點：相比寫法一多了一次函數呼叫開銷

    - **寫法三（guard clauses 模式，當前採用）**：在函數開頭依序檢查 `used.has(key)` 和字元匹配

      - 優點：所有前置條件集中在開頭，符合 early return 模式，最易讀

      - 缺點：與寫法二相同，需進入函數才能檢查

- **測試案例**：

  - 案例 A - 基本成功案例:

    Input:

    ```plaintext
        board = [["A","B","C","E"],
                ["S","F","C","S"],
                ["A","D","E","E"]]
        word = "ABCCED"
    ```

    Output: `true`

    Expected: `true`

    Explain: 路徑為 (0,0)→(0,1)→(0,2)→(1,2)→(2,2)→(2,1)

  ***

- 案例 B - 需要 backtracking:

  Input:

  ```plaintext
      board = [["A","B","C","E"],
              ["S","F","C","S"],
              ["A","D","E","E"]]
      word = "SEE"
  ```

  Output: `true`

  Expected: `true`

  Explain: 路徑為 (1,3)→(2,3)→(2,2)

  ***

- 案例 C - 失敗案例:

  Input:

  ```plaintext
      board = [["A","B","C","E"],
              ["S","F","C","S"],
              ["A","D","E","E"]]
      word = "ABCB"
  ```

  Output: `false`

  Expected: `false`

  Explain: 無法找到路徑，因為 B 只能使用一次

  ***

- 案例 D - 單一格子:

  Input: `board = [["A"]]`, `word = "A"`

  Output: `true`

  Expected: `true`

  Explain: 邊界條件測試

## 學習記錄

- 首次解題(DFS+Backtracking)：2025-11-29 | 耗時：不紀錄(重理解思路) | 獨立完成：否

- 複習1(DFS+Backtracking)：2025-11-29 | 耗時：20分鐘 | 獨立完成：否 | 順暢度：流暢。

  - 整體流暢，中間因為一個 typo 沒注意到，所以有研究答案，但整體邏輯都有寫出來

- 複習2(DFS,Backtracking)：2025-12-03 | 耗時：10分鐘 | 獨立完成：是 | 順暢度：流暢。

  - 整體流暢，沒有錯誤和卡頓。實作不同於 Solution1 中有的方式，但邏輯清晰可通過

- 複習3(DFS,Backtracking)：2025-12-10 | 耗時：8分鐘 | 獨立完成：是 | 順暢度：流暢。整體流暢，沒有錯誤和卡頓。

  - 同樣實作不同於 Solution1 中有的方式，但邏輯清晰可通過。(直接對 board 做標記表示訪問過)

- 複習4(DFS,Backtracking)：2026-01-09 | 耗時：8分鐘 | 獨立完成：是 | 順暢度：小卡。

  - 一開始試圖使用 iteration 的方式實作 backtracking，導致狀態的標記與返回一直卡住

  - 後來改用遞迴實作 backtarcking，並且是每次都進到 backtracking 判斷(包含邊界、值是否合法等)，而非判斷合法才進到 backtracking
