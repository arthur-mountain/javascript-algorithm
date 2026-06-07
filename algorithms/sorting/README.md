# 排序演算法 Sorting Algorithms

> 本檔是**總覽（地圖）**：放共用的設計理念、運作機制、複雜度比較與選擇策略。
> 每種排序的完整講解與程式碼（Single Source of Truth）拆在各自的子目錄：
>
> | 演算法         | 說明                                 | 實作                                  |
> | -------------- | ------------------------------------ | ------------------------------------- |
> | Bubble Sort    | [README](./bubble-sort/README.md)    | [index.js](./bubble-sort/index.js)    |
> | Selection Sort | [README](./selection-sort/README.md) | [index.js](./selection-sort/index.js) |
> | Insertion Sort | [README](./insertion-sort/README.md) | [index.js](./insertion-sort/index.js) |
> | Merge Sort     | [README](./merge-sort/README.md)     | [index.js](./merge-sort/index.js)     |
> | Quick Sort     | [README](./quick-sort/README.md)     | [index.js](./quick-sort/index.js)     |
> | Heap Sort      | [README](./heap-sort/README.md)      | [index.js](./heap-sort/index.js)      |
> | Shell Sort     | [README](./shell-sort/README.md)     | [index.js](./shell-sort/index.js)     |
> | Counting Sort  | [README](./counting-sort/README.md)  | [index.js](./counting-sort/index.js)  |
> | Radix Sort     | [README](./radix-sort/README.md)     | [index.js](./radix-sort/index.js)     |
> | Bucket Sort    | [README](./bucket-sort/README.md)    | [index.js](./bucket-sort/index.js)    |
>
> 統一入口：[`index.js`](./index.js)（barrel，re-export 全部 13 個函式）。

## 🎯 設計理念

### 存在意義

**排序演算法被發明出來，是為了解決「將無序序列轉換為有序序列」這個基本問題。**

- **暴力法（Brute Force）**：列舉所有 n! 個排列，逐一檢查是否已排序 → O(n! × n)。瓶頸在於搜尋空間是 n! 級別的排列組合。
- **可利用的結構特性**：元素之間的「大小關係」具有傳遞性（a < b 且 b < c → a < c），因此每次比較都能消除多個不可能的排列。
- **核心加速原理**：
  - **Comparison-based**：利用比較的傳遞性，每次比較至少排除一半的可能性。資訊理論下界為 Ω(n log n)（因為需要 log₂(n!) ≈ n log n 次比較才能區分 n! 種排列）[`高`]。
  - **Non-comparison-based**：利用元素值域的有限性（如整數範圍），繞過比較下界，用空間換取 O(n) 時間。

### 心智模型

**類比：整理一副打散的撲克牌**

- **Bubble Sort**：反覆掃過整副牌，遇到相鄰兩張順序不對就交換，直到沒有交換為止。
- **Selection Sort**：每次從未排序的牌中找出最小的一張，放到已排序區的末尾。
- **Insertion Sort**：像玩牌一樣，每抽到一張新牌就插入手牌中正確的位置。
- **Merge Sort**：把牌分成兩半，各自排好後再合併成一副有序的牌。
- **Quick Sort**：隨便挑一張牌當基準，比它小的放左邊、大的放右邊，再對兩邊重複。
- **Heap Sort**：建一個「最大堆」，反覆取出堆頂（最大值）放到末尾。
- **Shell Sort**：先用大間距做粗略排序（讓遠距離的錯位元素快速歸位），再逐步縮小間距做精細排序。
- **Counting Sort**：準備一排標有號碼的桶子，每張牌直接丟進對應號碼的桶，再按桶序收集。
- **Radix Sort**：先按個位數排序，再按十位數排序…，像郵局按區號分信。
- **Bucket Sort**：按數值範圍分成若干桶，桶內各自排序後串接。

**局限**：撲克牌類比假設元素可直接比較且比較成本為 O(1)；實際應用中比較成本可能很高（如長字串比較為 O(L)），且 Non-comparison-based 排序需要元素可映射到有限整數範圍。

---

## 🏗️ 運作機制

### 核心組件

| 組件               | 功能                   | 為什麼需要                                                   |
| ------------------ | ---------------------- | ------------------------------------------------------------ |
| 輸入陣列 `arr`     | 儲存待排序的元素       | 排序操作的對象                                               |
| 比較函式 `compare` | 定義元素之間的大小關係 | 讓排序具有泛用性（不限於數字）                               |
| 交換操作 `swap`    | 調整兩個元素的位置     | Comparison-based 排序的基本操作                              |
| 輔助空間           | 暫存中間結果           | Non-in-place 排序需要額外記憶體（如 Merge Sort 的暫存陣列）  |
| 分割策略           | 決定如何分解問題       | Divide-and-Conquer 類排序的核心（如 pivot 選擇、分割點計算） |

### 狀態表示

- **變數與初始狀態**：需要維護「已排序區與未排序區的邊界」（或遞迴的 `lo`/`hi` 範圍）；初始時整個陣列都是未排序區。
- **Invariant（不變量／合法條件）**：
  - Simple sorts（Bubble/Selection/Insertion）：每完成一輪，已排序區內的元素都處於最終正確位置（或彼此相對有序）。
  - Divide-and-Conquer sorts（Merge/Quick）：遞迴返回時，該子陣列已完全有序。
  - Heap Sort：每次 extractMax 後，剩餘範圍仍維持 heap 性質（父節點 ≥ 子節點）。
- **Maintenance（狀態維護）**：排序分兩種維護型態——
  - **修復型（Bubble/Selection/Insertion）**：每一步「就地修復」一個被破壞的順序關係（相鄰交換、選最小、插入），逐步把已排序區的邊界往前推。
  - **建構型（Merge/Quick/Heap/Counting/Radix/Bucket）**：新的合法狀態必然「由已合法的子狀態組裝而來」——Merge 的合併輸入是兩個已排序子陣列；Quick 的 partition 把元素放到相對於 pivot 的正確側；Counting 的前綴和由左到右逐格累積。
- **Extract（結果提取）**：排序的「答案」就是陣列本身，沒有獨立的提取動作——當 Termination 成立的瞬間，整個陣列即已就位。（對比 Sliding Window 需在每次合法時刻提取極值，排序只在終點一次性成立。）
- **Termination（終止條件）**：未排序區為空（simple sorts）／子陣列長度 ≤ 1（recursive sorts）／所有桶已收集（distribution sorts）。

### 適用前提條件

**使用排序策略之前，必須確認以下前提條件成立：**

| 前提條件                                   | 為什麼需要                                     | 違反時的後果           | 替代方案                   |
| ------------------------------------------ | ---------------------------------------------- | ---------------------- | -------------------------- |
| 元素之間可比較（全序關係）                 | Comparison-based 排序依賴 `<` `>` `=` 的傳遞性 | 排序結果無意義或不一致 | 定義自訂比較函式           |
| 元素可映射到有限整數範圍（Non-comparison） | Counting/Radix/Bucket Sort 需要用值當索引      | 無法建立計數陣列或桶   | 改用 Comparison-based 排序 |
| 資料量可放入記憶體                         | 大部分排序假設隨機存取                         | 需要外部排序           | External Merge Sort        |

### 與資料結構的關聯

底層所依賴的資料結構來儲存資料與維護狀態：

| 資料結構         | 角色     | 在本演算法中的用途                                                                              | 典型場景            |
| ---------------- | -------- | ----------------------------------------------------------------------------------------------- | ------------------- |
| Array            | 輸入載體 | 儲存待排序元素，支援隨機存取                                                                    | 幾乎所有排序        |
| Array（輔助）    | 狀態維護 | Merge Sort 合併時的暫存空間                                                                     | Merge Sort          |
| Array（計數）    | 狀態維護 | Counting Sort 的頻率陣列                                                                        | Counting/Radix Sort |
| Heap（Max-Heap） | 效能加速 | 加速 Selection Sort 的「選最值」步驟（O(1) 取堆頂）；不用它則退化為線性掃描，O(n log n) → O(n²) | Heap Sort           |
| Array of Buckets | 狀態維護 | Bucket Sort 的分桶容器                                                                          | Bucket Sort         |

**關鍵洞察**：排序演算法定義「元素如何比較與移動」的策略，資料結構負責「高效地儲存與存取元素」。選擇哪種排序，取決於資料的規模、值域、分佈、以及是否需要穩定性或 in-place。

### 流程步驟

**本演算法的流程類型**：執行期（家族型策略——所有變體都在迴圈／遞迴中依序執行，沒有設計期步驟）

由於排序是一個演算法家族而非單一策略，每個變體的流程步驟在各自的 README 中描述（皆為執行期流程）。這裡提取所有 Comparison-based 排序共享的高層執行期流程：

---

1. **Compare（比較）**

**目的**：判斷兩個元素的相對順序

**關鍵決策點**：使用 `<` 還是 `<=`？（影響穩定性——穩定排序在相等時不交換，保留原始相對順序）

---

2. **Move（移動）**

**目的**：將元素放到正確（或更接近正確）的位置

**關鍵決策點**：用 swap（交換）還是 shift（平移）？swap 適合 Selection Sort，shift 適合 Insertion Sort（減少賦值次數）

---

3. **Reduce（縮小問題）**

**目的**：每一步後，未排序的部分變小

**關鍵決策點**：線性縮小（每次減少 1 個元素，如 Bubble/Selection/Insertion）vs 對半縮小（遞迴分治，如 Merge/Quick）

---

### 模式分類

**變體總覽**：

```plaintext
排序演算法
├── Comparison-based（受 Ω(n log n) 下界約束）
│   ├── Simple O(n²) Sorts
│   │   ├── Bubble Sort（相鄰交換，逐輪冒泡最大值）
│   │   ├── Selection Sort（每輪選最小值放到前面）
│   │   └── Insertion Sort（每個元素插入已排序區正確位置）
│   ├── Efficient O(n log n) Sorts
│   │   ├── Merge Sort（分治 + 合併，穩定）
│   │   │   └── In-place 變體（共用 temp，省去遞迴 slice 的額外分配）
│   │   ├── Quick Sort（分治 + partition，期望 O(n log n)）
│   │   │   ├── Lomuto partition（單向掃描，隨機化 pivot）
│   │   │   └── 三路分割（Dutch Flag，大量重複元素接近 O(n)）
│   │   └── Heap Sort（建堆 + 逐一取最大值，in-place）
│   └── Gap-based
│       └── Shell Sort（帶間距的 Insertion Sort，逐步縮小間距）
└── Non-comparison-based（可突破 Ω(n log n) 下界）
    ├── Counting Sort（計數 + 前綴和定位，需有限整數值域）
    ├── Radix Sort（按位數逐位排序，底層用 Counting Sort）
    └── Bucket Sort（分桶 + 桶內排序，適合均勻分佈）
```

每個變體的觸發條件、流程、關鍵洞察與完整程式碼，見各自的 README（點下方標題）：

---

**[變體 1：Bubble Sort（冒泡排序）](./bubble-sort/README.md)**

- **觸發**：教學用途，或資料幾乎已排序（best case O(n)）。
- **核心**：相鄰兩兩比較交換，逐輪把最大值冒泡到末端。
- **記住**：唯一可「無交換則提前終止」優化到 O(n) 的簡單排序，但實務最慢。

**[變體 2：Selection Sort（選擇排序）](./selection-sort/README.md)**

- **觸發**：交換成本高（每輪只交換一次，總共 n-1 次）。
- **核心**：每輪在未排序區選最小值，交換到已排序區末端。
- **記住**：交換次數最少，但無法提前終止；不穩定。

**[變體 3：Insertion Sort（插入排序）](./insertion-sort/README.md)**

- **觸發**：幾乎已排序（adaptive）、小資料量、作為其他排序的子程式。
- **核心**：每個元素插入已排序區正確位置（shift 而非 swap）。
- **記住**：Timsort 的基礎組件；接受 `lo`/`hi` 範圍參數供子區間排序。

**[變體 4：Merge Sort（合併排序）](./merge-sort/README.md)**（含 In-place 變體）

- **觸發**：需要穩定的 O(n log n)、Linked List、外部排序。
- **核心**：分治——對半切、各自排序、雙指標合併（相等取左半→穩定）。
- **記住**：唯一穩定的 O(n log n) comparison sort；「重活」在 merge。

**[變體 5：Quick Sort（快速排序）](./quick-sort/README.md)**（含三路分割變體）

- **觸發**：通用排序首選（常數因子最小）、in-place、不需穩定。
- **核心**：選 pivot 做 partition、遞迴兩側，無需 merge。
- **記住**：「重活」在 partition；隨機化 pivot 避免 O(n²)；三路分割處理大量重複。

**[變體 6：Heap Sort（堆積排序）](./heap-sort/README.md)**

- **觸發**：需要 O(n log n) 最差保證 + in-place + 不需穩定。
- **核心**：原地建 Max-Heap，反覆 extractMax 放到末端。
- **記住**：build heap 是 O(n)；最差 O(n log n) + in-place 的唯一選擇。

**[變體 7：Shell Sort（希爾排序）](./shell-sort/README.md)**

- **觸發**：中等資料量、嵌入式（簡單 + in-place + 比 O(n²) 快）。
- **核心**：帶間距的 Insertion Sort，逐步縮小 gap 到 1。
- **記住**：大間距讓遠距離錯位元素快速歸位；複雜度取決於 gap sequence。

**[變體 8：Counting Sort（計數排序）](./counting-sort/README.md)**

- **觸發**：整數（負數經 min 偏移）且值域 k = O(n)。
- **核心**：計數 → 前綴和 → 反向遍歷定位。
- **記住**：前綴和 + 反向遍歷是穩定性的關鍵；k >> n 時不划算。

**[變體 9：Radix Sort（基數排序）](./radix-sort/README.md)**

- **觸發**：整數、位數 d 小（如電話號碼、身分證號）。
- **核心**：LSD 逐位用穩定排序（Counting Sort）處理。
- **記住**：每一位必須穩定排序；本實作僅支援非負整數。

**[變體 10：Bucket Sort（桶排序）](./bucket-sort/README.md)**

- **觸發**：資料均勻分佈（如 [0,1) 浮點數）。
- **核心**：分桶 → 桶內 Insertion Sort → 串接。
- **記住**：均勻時 O(n)，極度不均退化 O(n²)；桶內排序復用 Insertion Sort（SSOT）。

---

### 複雜度總結

> 跨變體的並排比較視圖；單一演算法的複雜度說明見各自 README，以其 JSDoc 為準。

| 變體                  | 時間（Best） | 時間（Average） | 時間（Worst） | 空間          | 穩定 | In-place | 備註                                                            |
| --------------------- | ------------ | --------------- | ------------- | ------------- | ---- | -------- | --------------------------------------------------------------- |
| Bubble Sort           | O(n)         | O(n²)           | O(n²)         | O(1)          | ✅   | ✅       | Best case 需 early termination 優化                             |
| Selection Sort        | O(n²)        | O(n²)           | O(n²)         | O(1)          | ❌   | ✅       | 交換次數最少：O(n)                                              |
| Insertion Sort        | O(n)         | O(n²)           | O(n²)         | O(1)          | ✅   | ✅       | 幾乎有序時極快，Timsort 的基礎                                  |
| Merge Sort            | O(n log n)   | O(n log n)      | O(n log n)    | O(n)          | ✅   | ❌       | 唯一穩定的 O(n log n) comparison sort                           |
| Merge Sort (In-place) | O(n log n)   | O(n log n)      | O(n log n)    | O(n)          | ✅   | ❌       | 複雜度同 Merge Sort，但共用 temp 省去遞迴 slice 的額外分配      |
| Quick Sort (Lomuto)   | O(n log n)   | O(n log n)      | O(n²)         | O(log n)~O(n) | ❌   | ✅       | 實務常數因子最小；隨機化 pivot 避免最差；空間最差 O(n) 遞迴堆疊 |
| Quick Sort (3-way)    | O(n)         | O(n log n)      | O(n²)         | O(log n)~O(n) | ❌   | ✅       | 大量重複元素接近 O(n)；用 arr[lo] 為 pivot，已排序資料仍 O(n²)  |
| Heap Sort             | O(n log n)   | O(n log n)      | O(n log n)    | O(1)          | ❌   | ✅       | 最差情況 O(n log n) + in-place 的唯一選擇                       |
| Shell Sort            | O(n log n)   | 取決於 gap      | O(n^(3/2))    | O(1)          | ❌   | ✅       | Knuth 序列下約 O(n^(3/2))；gap 選擇影響效能                     |
| Counting Sort         | O(n + k)     | O(n + k)        | O(n + k)      | O(n + k)      | ✅   | ❌       | k = 值域大小（max - min + 1）；k >> n 時不划算                  |
| Radix Sort            | O(d(n + k))  | O(d(n + k))     | O(d(n + k))   | O(n + k)      | ✅   | ❌       | d = 位數, k = 基數；d 小時趨近 O(n)                             |
| Bucket Sort           | O(n + k)     | O(n + k)        | O(n²)         | O(n + k)      | ✅   | ❌       | 需均勻分佈；worst case 所有元素同一桶                           |

**符號定義**：

- `n`：陣列元素數量
- `k`：值域大小（Counting Sort）或桶數（Bucket Sort）或基數（Radix Sort，通常 k = 10）
- `d`：最大位數（Radix Sort）

---

## ⭐ 抽象化翻譯器

**這是最關鍵的部分——建立「問題情境 → 選擇哪種排序」的映射能力**

### 識別核心抽象

> 排序的核心對象是：**可比較元素的序列**
>
> 它管理的是這些對象之間的**全序關係**（total ordering），目標是將序列重排為滿足此關係的排列

### 建立映射維度

| 維度            | 要回答的問題                                 | 這個答案決定了什麼                                                     |
| --------------- | -------------------------------------------- | ---------------------------------------------------------------------- |
| 資料規模 n      | 有多少元素？                                 | n ≤ 50 → Insertion Sort 即可；n 大 → 需要 O(n log n)                   |
| 值域 / 資料類型 | 元素是整數？浮點數？字串？值域多大？         | 非負整數 + 值域小 → Counting/Radix；否則 → Comparison-based            |
| 分佈特性        | 資料是否幾乎有序？是否均勻分佈？重複率高嗎？ | 幾乎有序 → Insertion/Timsort；均勻 → Bucket；重複多 → 3-way Quick Sort |
| 穩定性需求      | 相等元素是否需要保持原始相對順序？           | 需穩定 → Merge Sort / Counting Sort；不需要 → Quick Sort / Heap Sort   |
| 空間限制        | 是否需要 in-place（O(1) 額外空間）？         | 需 in-place → Quick Sort / Heap Sort；可用 O(n) 空間 → Merge Sort      |
| 最差情況保證    | 能否接受偶爾的 O(n²)？                       | 不能 → Heap Sort / Merge Sort；可以 → Quick Sort（期望 O(n log n)）    |

### 實戰檢查表

```plaintext
題目:_______________

資料規模 n:_______________
值域 / 資料類型:_______________
分佈特性:_______________
穩定性需求:_______________
空間限制:_______________
最差情況保證:_______________

→ 根據上述答案，選擇對應的排序演算法。
```

### 映射範例

**題目 A**：Sort Colors（LeetCode 75）

| 維度     | 具體問題            | 抽象映射                              |
| -------- | ------------------- | ------------------------------------- |
| 資料規模 | n ≤ 300             | 任何排序都行                          |
| 值域     | 只有 0, 1, 2 三種值 | 極小值域 → Counting Sort 或特化演算法 |
| 分佈     | 不確定              | —                                     |
| 穩定性   | 不需要              | —                                     |
| 空間     | 題目要求 in-place   | 排除 Counting Sort 的標準實作         |
| 最差保證 | 不重要              | —                                     |

**從映射到實作**：值域只有 3 → 這就是 Dutch National Flag（三路分割），本質上是特化版的 Counting Sort + in-place：一次遍歷用三個指標把 0/1/2 分到正確位置。

**題目 B**：Sort an Array（LeetCode 912）

| 維度     | 具體問題                 | 抽象映射                                   |
| -------- | ------------------------ | ------------------------------------------ |
| 資料規模 | n ≤ 5 × 10⁴              | 需要 O(n log n)                            |
| 值域     | -5 × 10⁴ ≤ val ≤ 5 × 10⁴ | 整數，可用 Counting Sort（需偏移處理負數） |
| 穩定性   | 不需要                   | —                                          |
| 空間     | 無限制                   | —                                          |

**從映射到實作**：Quick Sort（隨機 pivot）或 Merge Sort 都是標準解。若想要 O(n)，值域 10⁵ 級別的 Counting Sort 也可行。

---

## 🔍 觸發器(模式識別)

### 正向觸發器

| 層級     | 特徵                                             | 為什麼這個特徵指向排序      |
| -------- | ------------------------------------------------ | --------------------------- |
| 關鍵字   | 「排序」「排列」「有序」「第 k 大/小」「中位數」 | 直接需要排序或部分排序      |
| 結構     | 輸入是無序陣列，輸出要求有序或依序處理           | 排序是前置步驟              |
| 目標     | 消除逆序對、找排名、分組後處理                   | 排序後問題簡化              |
| 操作模式 | 需要 Binary Search → 前提是已排序                | 排序是 Binary Search 的前提 |
| 約束     | n ≤ 10⁵ 且需要 O(n log n)、或值域小且需要 O(n)   | 約束直接指向排序演算法選擇  |

**一句話觸發規則**：當問題需要「元素的順序資訊」或「排名資訊」時，排序（或部分排序）幾乎是必要步驟。

### 反向觸發器

| 陷阱情境                                 | 為什麼不適用             | 更好的選擇                       |
| ---------------------------------------- | ------------------------ | -------------------------------- |
| 只需要第 k 大/小的元素（不需要完全排序） | 完全排序 O(n log n) 過度 | Quick Select O(n) average        |
| 動態插入 + 查詢中位數                    | 每次插入後重新排序太慢   | Two Heaps（Max-Heap + Min-Heap） |
| 需要頻繁插入/刪除且保持有序              | 陣列排序後插入是 O(n)    | BST / AVL Tree / Skip List       |
| Top-K 問題                               | 不需要完全排序           | Min-Heap of size K：O(n log k)   |

### 與類似工具的決策點

```plaintext
需要「順序資訊」
├── 只需第 k 個 → Quick Select（O(n) average）
├── 需要完全排序
│   ├── 值域小 + 整數 → Counting / Radix Sort（O(n)）
│   ├── 均勻分佈 → Bucket Sort（O(n) expected）
│   ├── 需要穩定 → Merge Sort（O(n log n)）
│   ├── 需要 in-place + 最差保證 → Heap Sort（O(n log n)）
│   ├── 通用 + 最快實務表現 → Quick Sort（O(n log n) expected）
│   └── 資料小或幾乎有序 → Insertion Sort（O(n) best）
├── 動態維護有序 → BST / Heap
└── 只需要排名/相對順序 → 排序 + 索引映射
```

---

## ⚠️ 注意事項

### 常見陷阱

> 各演算法專屬的陷阱詳見各自 README 的「常見陷阱」一節；此處彙整成跨演算法的速查表。

| 陷阱                          | 錯誤寫法                             | 正確寫法                           | 為什麼                                 |
| ----------------------------- | ------------------------------------ | ---------------------------------- | -------------------------------------- |
| Quick Sort 未隨機化 pivot     | `pivot = arr[hi]` 固定選末端         | 隨機選取再交換到末端               | 已排序資料退化為 O(n²)                 |
| Merge Sort 合併時破壞穩定性   | `left[i] < right[j]`                 | `left[i] <= right[j]`              | `<` 會讓相等元素從右半先進，破壞穩定性 |
| Counting Sort 未處理負數      | `count[arr[i]]++` 直接用值當索引     | 偏移：`count[arr[i] - min]++`      | 負數索引會越界                         |
| Radix Sort 底層用不穩定排序   | 底層用 Quick Sort 排每一位           | 必須用穩定排序（如 Counting Sort） | 不穩定會破壞前幾位的排序結果           |
| Heap Sort 的 heapify 範圍錯誤 | `heapify(arr, arr.length, 0)` 固定   | `heapify(arr, i, 0)` 用遞減的 i    | 已放到末端的最大值不應參與 heapify     |
| Bucket Sort 桶索引越界        | `bucketIdx = floor(val / range * k)` | 需處理 `val === max` 的邊界情況    | 最大值可能算出 `bucketIdx = k`（越界） |

### 常見變體（跨演算法）

| 變體                                   | 修改內容                                                      | 適用場景                                  |
| -------------------------------------- | ------------------------------------------------------------- | ----------------------------------------- |
| Insertion Sort + 哨兵                  | 在 arr[0] 放 -∞ 省去 `j >= 0` 的邊界檢查                      | 微優化                                    |
| Quick Sort + 小區間改用 Insertion Sort | `if (hi - lo < CUTOFF) insertionSort(arr, lo, hi)`            | 實務中減少遞迴開銷（如 Java Arrays.sort） |
| Merge Sort Bottom-Up                   | 用迭代取代遞迴，從大小 1 開始逐步合併                         | 避免遞迴堆疊溢位                          |
| Intro Sort                             | Quick Sort + Heap Sort fallback（遞迴深度超過 2log n 時切換） | C++ std::sort 的實作策略                  |
| Timsort                                | Merge Sort + Insertion Sort + 利用 natural runs               | Python/Java 內建排序                      |
