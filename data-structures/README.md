# Data structures

Implement data structures using javascript.

## Summary

1. **實作重點**:

   在 JavaScript 中實作該資料結構時，通常要注意哪些事情。

2. **底層練習方法**:

因為 JavaScript 中只有 Array(以及物件 / Map / Set 等)可以用，

但無法直接體驗到「靜態陣列大小」「手動擴容」「記憶體配置」等概念，

會安排一些「模擬底層」的做法來訓練理解。

在最後，會列一些「nice to have」的較進階或冷門資料結構，做為延伸練習或加強。

## 建議的每日實作順序

順序大致是由「比較基礎」→「稍微進階」→「更複雜/應用性」的資料結構。

### Day 1: 靜態 Array (模擬底層行為)

- **實作重點**

  - 雖然在 JS 中可以直接使用 `Array`，但這邊建議「用物件(Object)去模擬一個 array」的行為。

  - 設計一個 `class MyArray`(或函式構造)來保存:

    - 一個「固定大小」的緩衝(用一般 JS 物件 + 長度限制來假裝「已配置」的記憶空間)。

    - `length` 屬性。

  - 實現存取(`get(index)`, `set(index, value)`)等操作，
    並且若超過配置範圍就丟出錯誤或自動擴充失敗等。

- **底層練習方法**

  - 手動管理「已分配空間大小」: 假裝只能有 10 個空位，使用時要判斷是否超過範圍。

  - 若要動態擴容:

    可以寫個 `resize(newCapacity)` 函式來「新開一塊空間」然後搬移。

    這就能體驗底層「重新配置」的概念。

  - JS Array 其實可以隨時 push/pop，而不會有手動擴容的過程；

    所以建議不要直接用 JS Array 來自動擴容，而是用物件索引。

    或使用 typed array 也可以，但 typed array 還是要固定容量，能更接近底層概念。

### Day 2: 動態 Array (ArrayList)

- **實作重點**

  - 延續前一天的 MyArray，這次要讓它具有「自動擴容」的功能。

  - 每次資料量超過容量時，就執行一次 `resize(capacity * 2)`。

    當然，也可以加入縮容邏輯(例如低於某個閾值就把容量縮小 1/2)。

  - 加入常見方法: `push`, `pop`, `insert`, `removeAt(index)` 等。

- **底層練習方法**

  - 記錄並印出每次擴容時所發生的「搬移」動作，可以觀察到在最壞情況下會有 O(n) 的重新複製成本。

  - 用一個原生 JS 物件(或 typed array)來當作「已配置的底層空間」。

### Day 3: Linked List (Singly Linked List)

- **實作重點**

  - 實作節點 (Node) 結構，包含 `value` 和指向 `next` 的參考。

  - 建立 `class SinglyLinkedList`，提供 `head`、`tail`。

  - 常見操作:

    `push(value)`(尾部插入)、`pop()`(尾部刪除)、`unshift(value)`(頭部插入)、`shift()`(頭部刪除)、`get(index)`, `set(index, value)`, `insert(index, value)`, `remove(index)`。

- **底層練習方法**

  - 雖然在 JS 中，可以直接 new 一個物件代表節點，但可想像在底層，是用記憶體位址來連結下一個節點。

  - 可以在節點內自訂一個「模擬指標」來學習如何「指向」下一塊記憶空間，了解傳統語言(C/C++)用指標的概念。

### Day 4: Doubly Linked List

- **實作重點**

  - 在單向鏈結串列基礎上，加入 `prev`，可以支援從尾部往前走，方便實作某些操作。

  - 實作過程與 Singly 差不多，但要注意同時維護 `prev` 和 `next`。

- **底層練習方法**

  - 同樣可以在節點結構中，加入類似「前一個節點在記憶體中的編號(或指標)」的概念。

  - 測試各種在頭尾/中間刪除和新增時，`prev` 和 `next` 互相更新是否正確。

### Day 5: Stack

- **實作重點**

  - 可用前面實作好的「動態 array」或「linked list」去實作。

  - 實現 `push(value)` / `pop()` / `peek()` 等功能。

- **底層練習方法**

  - 若用動態 array 實作，可以觀察 push/pop 的 time complexity。

  - 若想模擬靜態陣列的方式，就指定一個最大長度，push 時超過就報錯或拒絕。

### Day 6: Queue

- **實作重點**

  - 同樣可用「動態 array」或「linked list」去實作。

  - 實現 `enqueue(value)` / `dequeue()` / `front()` 等功能。

  - 如果是用陣列實作，要避免 dequeue 的時候 O(n) shift，就可以維護兩個指標(head 與 tail)來達到 O(1) dequeue。

- **底層練習方法**

  - 模擬環狀陣列(circular array)，用大小固定的 array + head/tail 索引做 FIFO，可以體會底層「不用 shift、直接移動索引」的概念。

  - 練習在固定容量用完後如何進行「環狀繞回」或「動態擴容」。

### Day 7: Hash Table

- **實作重點**

  - JS 原生提供了 `Object` / `Map`，但可以寫一個「鍵值對」的結構 + hashing function + bucket array 來模擬。

  - 實作簡單的雜湊函式(如把字串轉數值並對 `capacity` 取餘數)。

  - 雜湊衝突處理: 鏈結串列(chaining)或開放位址法(open addressing)。

  - 提供 `set(key, value)`, `get(key)`, `delete(key)` 等操作。

- **底層練習方法**

  - 用前面練習的「動態 array」當作底層的「bucket array」，當 load factor 超過某值(例如 0.75)就擴容並重新哈希。

  - 體驗 rehash 所產生的成本，並記錄每次 rehash 時如何把舊 bucket 的資料搬去新 bucket。

### Day 8: Binary Tree / Binary Search Tree (BST)

- **實作重點**

  - 實作樹的節點 (Node)，包含 `value`, `left`, `right`。

  - 常見操作: 插入、搜尋、刪除(BST 的插入、搜尋和刪除)，以及樹的遍歷(先序、中序、後序、層序)。

  - 刪除操作要特別注意三種情況: 刪除的節點是葉子、有一個子樹、有兩個子樹。

- **底層練習方法**

  - 與前面的鏈結串列類似，可想像 left/right 是兩個「指標」。

  - 手動模擬插入/刪除時，每一步驟要更新「父節點」對應的子節點位置。

### Day 9: AVL Tree / Red-Black Tree(平衡二元搜尋樹)

- **實作重點**

  - 選一種平衡樹(AVL 或 RBT)去實作，初學建議 AVL 較直觀，因為只要做「樹高」維護和「旋轉」。

  - 透過插入/刪除後，進行旋轉(rotation)來保持樹的高度平衡。

- **底層練習方法**

  - 每次插入/刪除都要重新計算高度 / 檢查平衡因子(AVL)或顏色 / 規則(RBT)。

  - 手動列印樹的結構，觀察是否對應到畫的示意圖。

### Day 10: Heap / Priority Queue

- **實作重點**

  - 通常用 array 實作二元堆 (binary heap)；可分為最小堆 (min-heap) 或最大堆 (max-heap)。

  - 需要定義 `insert(value)` 和 `extractMin()`(或 `extractMax()`)，實作 heapify-up, heapify-down。

- **底層練習方法**

  - 用前面動態 array 的概念做底層儲存，模擬「capacity 不足時擴容」。

  - 記住在 index i 上的節點，左子節點 index 是 `2*i + 1`，右子節點是 `2*i + 2`；父節點是 `floor((i-1)/2)`。

### Day 11: Trie (Prefix Tree)

- **實作重點**

  - 主要用於字串搜尋及自動補全。
  - 實作一個 TrieNode，包含一個字母 -> TrieNode 的映射 (children)，以及表示「是否為一個單字結尾」的旗標 (isEnd)。

  - 提供 `insert(word)`, `search(word)`, `startsWith(prefix)`。

- **底層練習方法**

  - 雖然在 JS 中可以用物件 `{}` 直接當 children，但可想像在底層是一個固定大小(例如 26 個字母)的陣列，或者使用雜湊。

  - 手動計算在插入大量字串時，Trie 的節點配置狀況。

### Day 12: Graph (圖) + BFS/DFS

- **實作重點**

  - 通常用鄰接串列 (adjacency list) 或鄰接矩陣 (adjacency matrix) 表示。

  - 練習 BFS / DFS 遍歷、拓撲排序 (DAG)、最短路徑(如果有興趣可以做 Dijkstra、Bellman-Ford 等)。

- **底層練習方法**

  - 如果要模擬低層，可用固定大小的鄰接矩陣；若要擴容就得重新配置更大的矩陣。

  - 若用鄰接串列，可以運用前面「動態 array」或「linked list」來存放鄰接節點。

### Day 13: Disjoint Set (Union-Find)

- **實作重點**

  - 常見於圖論演算法(例如 Kruskal’s MST)。

  - 實作 `find(x)`, `union(a, b)`，並支援「路徑壓縮」與「按秩合併/按大小合併」。

- **底層練習方法**

  - 儲存方式通常是用一個 array `parent[]`，可搭配 `rank[]` 或 `size[]`。

  - 練習在各種不同測試用例下看能否正確合併集合。

### Day 14: B-Tree / B+ Tree

- **實作重點**

  - 資料庫系統常用的多叉平衡樹，常用於儲存大量有序資料並能有效進行磁碟 I/O。

  - 需要特別處理「節點分裂(split)」與「合併(merge)」的邏輯，保證樹的高度維持在相對固定的範圍。

  - 若挑戰 B+ Tree，要注意葉節點的鏈結以及非葉節點只存索引，不存真實資料等細節。

- **底層練習方法**

  - 用前面練習「動態 array」或物件來模擬 B-Tree 節點，包含多個 key 和 child。

  - 練習在插入 / 刪除時，如何判斷是否需要分裂或合併，並更新父節點的關聯。

  - 手動記錄每次 I/O (在真實系統中指的是磁碟讀寫)，可以想像你在 “read node” / “write node” 的流程，幫助理解 B-Tree 在磁碟存取上的優勢。

---

### Day 15: LRU Cache

- **實作重點**

  - 常見於系統設計或快取機制，核心架構可用「Hash Map + 雙向鏈結串列」實作。

  - Hash Map 用來在 O(1) 時間內定位快取中的項目；

    雙向鏈結串列用來在 O(1) 時間內把最近被存取的項目移動到表頭，並在空間不足時刪除最不常使用的項目。

  - 需提供 `get(key)`, `put(key, value)` 方法，並能在超出容量時及時淘汰最舊未使用的節點。

- **底層練習方法**

  - 鏈結串列部分可直接拿之前 Day 4(Doubly Linked List)的程式碼重用，藉此熟悉整合資料結構的概念。

  - 手動模擬清除節點或移動節點時在記憶體(或模擬指標 / ID)中的操作過程，
    可以加深指標操作及雜湊表維護的熟練度。

### Day 16: Splay Tree

- **實作重點**

  - 屬於自我調整 (self-adjusting) 的平衡二元搜尋樹。

  - 每次搜尋、插入或刪除某個節點後，都會將該節點「伸展 (splay)」到根節點位置，讓最近使用的節點存取更快。

  - 實現過程中，你需要熟悉三種伸展操作: `zig`(單旋轉)、`zig-zig`、`zig-zag`(雙旋轉)。

- **底層練習方法**

  - 先練習如何在 BST 中進行旋轉(rotate)操作，再把伸展的邏輯插入到插入 / 刪除 / 搜尋的流程裡。

  - 可用 Node + 指標 (left, right, parent) 來模擬底層記憶體連結，每次旋轉都要手動更新父子關係。

  - 在調試階段，多印出旋轉前後樹的結構，檢查是否符合預期。

---

### Day 17: Suffix Array

- **實作重點**

  - 用於字串處理: 能在 O(nlogn)(或更快的演算法)時間內建構，之後可在 O(log n) 時間內執行子字串搜尋。

  - 建構方式有多種: 例如先對字串所有後綴進行排序(初學可先用簡單排序實作，再優化)，也可了解更高效的 SA 演算法(如 K-prefix doubling)。

  - 常搭配 LCP(Longest Common Prefix)陣列，用於解決最長重複子字串等進階問題。

- **底層練習方法**

  - 先手刻一個「所有後綴」的產生，將它們和原字串的索引一起存起來。

  - 自行使用「比較函式」對這些後綴進行排序，可以感受「排序複雜度」在這邊的影響。

  - 若想更貼近底層，可在排序過程中記錄「比較次數」、嘗試用自定義的比較函式來優化。

---

### Day 18: Suffix Tree

- **實作重點**

  - 提供比 Suffix Array 更直接的字串查詢結構，但實作相對複雜。

  - 常見建構演算法有 Ukkonen’s Algorithm，可在 O(n) 時間內建樹(不過實作難度高)。

  - 關鍵概念: 壓縮 (compression) 多個連續邊上相同的字母成「字串邊」(edge label)，減少節點數量。

- **底層練習方法**

  - 可先用「天真 (naive)」方法: 把所有後綴一個個插入 Trie，再進行壓縮，就能練到字串節點的分裂與合併。

  - 確保你瞭解「內部節點 / 葉節點」如何記錄在字串中的起迄位置，並使用指標或索引去追蹤。

  - 在記憶體結構上，你可以用物件 + 陣列來模擬儲存子節點(children)，並觀察節點分裂時如何重新配置。

## 其他 Nice to have(延伸或較冷門的資料結構)

1. **Segment Tree(區間樹)**

   - 用於在區間上進行快速的查詢與更新(例如區間和、區間最大值等)。

   - 實作難度略高，需要遞迴建樹、區間合併。

   - 底層練習: 同樣可用 array 去模擬樹結構索引。

2. **Fenwick Tree (Binary Indexed Tree)**

   - 區間和 / 單點更新常用，比 Segment Tree 實作簡單、記憶體較省。

   - 需要理解樹狀結構與二進位操作(LSB)。

3. **Bloom Filter**

   - 空間效率非常好的近似結構，用來測試「是否可能存在某元素」。

   - 理解雜湊和誤陽性 (false positive) 概念。

---

## 總結: 如何在 JavaScript 中練到「底層概念」

1. **盡量不要直接依賴 JS Array 的自動擴充**:

   - 改用物件 `{}` 來模擬索引與容量控制；

     或是使用 typed array(`Uint8Array`, `Int32Array`…等)，不過 typed array 也有固定長度的特性，可以更貼近底層。

   - 遇到需要擴容時，真的去「new 一個更大的容器」然後把舊資料一一拷貝過去。

   這就是 C/C++ 的 `realloc` / `memcpy` 類似概念。

2. **維護手動的 `size`、`capacity`**:

   - 在每個結構裡都留意「目前儲存了多少元素」、「最多可容納多少元素」。

   - 超過容量就要執行 `resize()` 或拋錯，逼真正感受到「容量不足」時該怎麼做。

3. **節點 (Node) 結構要明確**:

   - 雖然在 JS 用物件很方便，但仍然可以在每個 node 中寫出:

     `this.id = somePointerLikeId; this.value = value; this.next = nextId;` 等，

     模擬傳統指標 / 記憶體位址的概念。

   - 或者維護一個全域的「記憶體表」(array of Node objects)，用 index 當作「指標」；

     在插入/刪除時就調整這個記憶體表。

4. **印出 / Log 「配置、擴容、釋放」的過程**:

   - 例如，在 `resize` 時，把「舊容量、新容量、複製動作」都 log 出來。

   - 在刪除節點時，把「釋放節點」或「把節點 id 歸還給 free list」都模擬一下。

     這些步驟在高階語言中看不到，但可以用 log 的方式記錄做了哪些動作。
