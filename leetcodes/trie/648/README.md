---
title: "648. Replace Words"
tags:
  - Array
  - Hash Table
  - String
  - Trie
difficulty: "Medium"
date_solved: "2025-10-10"
link: "https://leetcode.com/problems/replace-words/description/"
---

## 問題描述

給予一個 dictionary 和 sentence，每個 sentence 一定被一個空格分開，
把 sentence 中的每個 word 替換成 dictionary 中的 word，
如果有多個匹配的話，則只替換成字典中出現最短得 word。(在 dictionary 查詢到匹配的字稱作 derivative)
如果沒有匹配到任何值的話，則該 word 不進行替換

## Constraints

- 1 <= dictionary.length <= 1000
- 1 <= dictionary\[i\].length <= 100
- dictionary\[i\] consists of only lower-case letters.
- 1 <= sentence.length <= 10\*\*6
- sentence consists of only lower-case letters and spaces.
- The number of words in sentence is in the range \[1, 1000\]
- The length of each word in sentence is in the range \[1, 1000\]
- Every two consecutive words in sentence will be separated by exactly one space.
- sentence does not have leading or trailing spaces.

## 解題思路

### 初步分析

- 關鍵觀察：如果有多個匹配值的話，要以最短得那個 word 進行替換
- 適用 Pattern：使用 dictionary Trie，遍歷每個 word in sentence，找到最短的 prefix in trie 後替換
- 可能的陷阱：
  - 可能沒有匹配到任何 dictionary word，則不進行替換

## 解法總覽

### Solution1

- **思路說明**：先建立 dictionary trie，把 sentence 以空格進行分割後遍歷，針對每一個 word 作為 key 到 trie 找到最短的 word of dictionary，如果有找到則替換，沒找到則不替換

- **複雜度分析**：

  - 時間複雜度：O(d*w + n*w) -> 建立 Trie + 查詢 sentence word

    - d 是 dictionary 長度乘以每個 dictionary word 的長度

    - n 是 sentence 長度乘以每個 sentence word 的長度

  - 空間複雜度：O(d\*w) -> 建立 Trie

  - 通過狀態：AC

- **其他備註\(優化方向、特殊限制、問題延伸討論\)**：

  - 問題延伸討論：

    - 如果要找最長 root 怎麼辦？

      A：不要 early return，遍歷完整個單字，記錄最後一個 iseof 的位置

    - 如果字典會頻繁更新（增刪）？

      A：Trie 支持動態操作，增加刪除方法即可

    - 如何處理大小寫？

      A：統一轉小寫，或修改 Trie 支持大小寫不敏感

    - 空間優化：如果字典非常大？

      A：可以用壓縮 Trie（Radix Tree）減少節點數

    - 如果要返回所有可能的 root？

      A：在遍歷時收集所有 isEOF 的位置

- **測試案例**：

  - 案例 A:

    Input: dictionary = \["cat","bat","rat"\], sentence = "the cattle was rattled by the battery"

    Output: "the cat was rat by the bat"

    Expected: "the cat was rat by the bat"

    ***

  - 案例 B:

    Input: dictionary = \["a","b","c"\], sentence = "aadsfasf absbs bbab cadsfafs"

    Output: "a a b c"

    Expected: "a a b c"

    ***

  - 案例 C: 多個匹配，選擇最短的那個

    Input: dictionary = \["a","aa","aaa"\], sentence = "aaaa"

    Output: "a"

    Expected: "a"

    ***

  - 案例 D: 沒有匹配，則不替換

    Input: dictionary = \["a","aa","aaa"\], sentence = "aaaa ccc"

    Output: "a ccc"

    Expected: "a ccc"

## 學習記錄

- 首次解題：2025-10-10 | 耗時：30分鐘 | 獨立完成：是
- 複習 1：\_\_\_\_ | 順暢度：□ 流暢 □ 卡頓 □ 忘記
