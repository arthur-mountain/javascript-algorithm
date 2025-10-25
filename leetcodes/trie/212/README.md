---
title: "212. Word Search II"
tags:
  - Array
  - String
  - Backtracking
  - Trie
  - Matrix
difficulty: "Hard"
date_solved: ""
link: "https://leetcode.com/problems/word-search-ii/description/"
---

## 問題描述

給予一個 m x n 的 matrix board of characters ，同時給予一個 list of string 的陣列 words，

從 board 組出 words 內包含得單字，但只有相鄰的格子之間(水平、垂直)才允許組成連接給來，

返回能從 borad 中組出的 words

## Constraints

- m == board.length
- n == board[i].length
- 1 <= m, n <= 12
- board[i][j] is a lowercase English letter.
- 1 <= words.length <= 3 \* 10\*\*4
- 1 <= words[i].length <= 10
- words[i] consists of lowercase English letters.
- All the strings of words are unique.

## 解題思路

### 初步分析(觀察與發想)

- 暴力解行不通，太多方向和可能性，也沒辦法直接查找，需要預處理資料

- 可能需要 DFS?

- 因為要查找每個單字，可以建立 trie 利於快速查找?

  - 單字連接時，可以從上->下、下->上、左->右、右 -> 左，四個方向連接，如果從左上角開始建立 trie ，只能符合兩個方向
  - 如果不理會方向，只要確保它是相鄰得，透過 freqency 判斷出現的字母數量是否符合就好？

- 每個 trieNode 可以儲存四個方向的 chars? 避免重複建立，透過 index 作為 identifier 判斷是否建立過，則直接連接起來？

- 把每一個 character 建立 trienode 後放到 key-value { [character] : TrieNode[]}，遍歷 words 時只需要找到對應得字母直接查找相鄰得 char 既可

## 解法總覽

### Solution1

- **思路說明**：

  - 針對每一個 character 建立 TrieNode，該 TrieNode 要包含相鄰得 char TrieNode

  - 每個 TrieNode 以 index 作為 key，存在 map 中(用 m x n 的陣列儲存，這樣可以復用 index 作為 key)，每次建立 TrieNode 時，先檢查是否已經建立

  - 每一個 character TrieNode 以當前 character 作為 root，存在 map 中，在遍歷 words 時，快速查找從當前 char 作為 root 可以連接的可能性

    - 可以解決不同方向連接 word 的問題

- **複雜度分析**：

  - 時間複雜度：O(m \* n \* w)

  - 空間複雜度：O(m \* n)

  - 通過狀態：❌ WA

    - 案例D，如果相鄰得兩個 character 都是 a，相鄰得兩個 node circular 重複尋找，會找到答案，但實際上一個 node 只能用一次。即使加上 set 紀錄是否重複會遇到其他問題，目前整個方向應該不太對

- **其他備註\(優化方向、特殊限制、問題延伸討論\)**：

  - 觀察 hints 後得思路: 應該要反過來針對 words 做 trie，結合 backtracking 遍歷 board，如果發現路不通就直接 early return

- **測試案例**：

  - 案例 A: 不同方向的連接

    Input:
    board = \[["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]\],
    words = \["oath","pea","eat","rain"\]

    Output: ["eat","oath"]

    Expected:

  - 案例 B: 只有一個 character

    Input:
    board = \[["a"]\]
    words = \["a"\]

    Ouput: \["a"\]

    Expected: \["a"\]

  - 案例 C: oa 和 oaa 很像，可能會重複找

    Input:
    board = \[["o","a","b","n"],["o","t","a","e"],["a","h","k","r"],["a","f","l","v"]\]
    words = \["oa","oaa"\]

    Ouput: \["oa","oaa"\]

    Expected: \["oa","oaa"\]

  - 案例 D: 雖然都是 a，但 board 只有兩個 a，words 有三個

    Input:

    board = \[["a","a"]\]
    words = \["aaa"\]

    Ouput: \["aaa"\]

    Expected: \[\]

  ***

## 學習記錄

首次開始：2025-10-25 02:20:26 PM

- 首次解題：2025-10-25 | 耗時：120分鐘 | 獨立完成：是，但是 wrong answer
- 複習 1：\_\_\_\_ | 順暢度：□ 流暢 □ 卡頓 □ 忘記
