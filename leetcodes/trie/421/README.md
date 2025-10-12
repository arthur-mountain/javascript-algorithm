---
title: "421. Maximum XOR of Two Numbers in an Array"
tags:
  - Array
  - Hash Table
  - Bit Manipulation
  - Trie
difficulty: "Medium"
date_solved: ""
link: "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/description/"
---

## 問題描述

給予一個正數的 array，回傳任意兩數 XOR 出來的最大值(即 nums[i] XOR nums[j])，且必須符合 0 <= i <= j < n.

## Constraints

- 1 <= nums.length <= 2 \* 10\*\*5
- 0 <= nums[i] <= 2\*\*31 - 1

## 解題思路

### 初步分析

- 關鍵觀察：

  - 兩層迴圈暴力解 O(n\*\*2) 會超時
  - 排序？ 可能還是會需要根暴力解一樣，要找遍所有可能，即使已經排序過
  - set? 知道順序性和重不重複無關，可能幫助不大
  - map? 知道順序性以及 mapping 關係，可能幫助也不大
  - trie? 建立二進制 trie，因為只有 0/1，所以可以使用陣列效率比較高。
    - 前面如果數字一樣 xor 結果會是0，如果數字不一樣xor 出來的結果會是1，因此越前面的數字(高位bit)如果數字不一樣那麼xor出來的值越大
    - 找最大值時，優先相反的值。如果當前數字是 0 就要找 1，反之如果是 1 就要找 0。
      - 如果找到相反的值繼續往下，如果沒能找到，則退一步找當前數字，反正只有 0 和 1 兩種選擇
    - 轉後成後二進制不一樣長度的話高位補 0。但二進制不一樣長怎麼辦？ 怎麼知道高位要補幾個0？
      - 每個數字統一都以 32bits 為二進制，高位補 0

- 適用 Pattern：

  - 建立 binary trie，每個數字都以 32bits 做為二進制表示，高位補 0
  - 找最大值時，優先相反的值。如果當前數字是 0 就要找 1，反之如果是 1 就要找 0。
    - 如果找到相反的值繼續往下，如果沒能找到，則退一步找當前數字，反正只有 0 和 1 兩種選擇

- 可能的陷阱：

  - 數字可以重複嗎？ 如果重複應該不影響，對於 trie 來說不會重複建立，同樣可以找到最大值。且重複的數字 xor 出來會是 0

  - 只有一個數字的話？ xor 自己，可以直接提前返回 0，不用額外建立 trie

## 解法總覽

### Solution1

- **思路說明**：

  1. 建立 binary trie，每個數字都以 32bits 做為二進制表示，高位補 0。

  2. 找數字最大值時，優先找相反的數字來 xor，如果沒有相反的數字，則選擇當前的數字

     - 如果當前數字是 0 就要找 1，反之如果是 1 就要找 0。如果沒能找到，則退一步找當前數字進行 xor。

     - 不用擔心數字沒初始化，因為統一都是 32bits，高位都會補 0

     - 找到最後的bit時，isEndOfBit 一定是 true，因為統一 32bits

- **複雜度分析**：

  - 時間複雜度：O(n) -> 建立 trie + 每個數字 32bits 要走 nums 次，複雜度為 O(n \+ n \* 32)

  - 空間複雜度：O(n) -> 每個數字 32bits，每一個 bit 會建立長度為 2 的陣列，總共 n 次，複雜度為 O(n \* 32 \* 2)

  - 通過狀態：❌ TLE

- **其他備註\(優化方向、特殊限制、問題延伸討論\)**：

  - 目前的 binary 都是透過字串進行計算，如：to32BitsBinary, xors.join("")，導致 TLE。是否有其他方式更高效？

    - A: 使用 BitwWise 操作。參考 solution2

- **測試案例**：

  - 案例 A: sample case

    Input: [3,10,5,25,2,8]

    Ouput: 28

    Expected: 28

  - 案例 B: sample case

    Input: [14,70,53,83,49,91,36,80,92,51,66,70]

    Ouput: 127

    Expected: 127

  - 案例 C: 數字中包含重複數字

    Input: [3,10,5,25,2,8, 25]

    Ouput: 28

    Expected: 28

  - 案例 D: 數字中包含 0

    Input: [3,10,5,25,2,8, 25, 0]

    Ouput: 28

    Expected: 28

  - 案例 E: 只有一個數字

    Input: [0]

    Ouput: 0

    Expected: 0

  ***

## 學習記錄

- 首次解題：2025-10-12 | 耗時：40分鐘 | 獨立完成：否，實作會 TLE，優化方式 Bitwise 有參考解答
- 複習 1：\_\_\_\_ | 順暢度：□ 流暢 □ 卡頓 □ 忘記
