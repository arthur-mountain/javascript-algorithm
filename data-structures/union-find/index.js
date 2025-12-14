class UnionFind {
  /**
   * 初始化 Union-Find 資料結構
   * @param {number} size - 節點總數(從 0 到 size-1)
   *
   * 核心思想：管理 size 個節點的連通關係
   * 初始狀態：每個節點都是獨立的集合
   */
  constructor(size) {
    // parent[i] 記錄節點 i 的父節點
    // 根節點的特徵：parent[i] === i (自己指向自己)
    this.parent = new Array(size);

    // height[i] 記錄以節點 i 為根的樹的高度
    // 用途：在 union 時決定誰接到誰下面，保持樹的平衡
    this.height = new Array(size).fill(1);

    // 初始化：讓每個節點的集合都只包含自己
    for (let i = 0; i < size; i++) {
      this.parent[i] = i;
    }
  }

  /**
   * 找到節點 x 所屬集合的代表元素(根節點)
   * @param {number} x - 要查找的節點
   * @return {number} 該節點所屬集合的根節點
   *
   * 優化技巧：路徑壓縮(Path Compression)
   * 在查找過程中，把路徑上所有節點直接連到根，讓樹變扁平，後續查找更快
   *
   * 時間複雜度：O(α(n)) - 反阿克曼函數,實務上視為常數
   * 空間複雜度：O(1)    - 不考慮遞迴呼叫堆疊
   */
  findRoot(x) {
    // Base case：如果 x 自己就是根，直接返回
    if (this.parent[x] === x) {
      return x;
    }

    // Recursive case：
    // 1. 遞迴往上找到真正的根
    // 2. 在回溯時，把 x 直接指向根(路徑壓縮)
    // 這一步很關鍵：this.parent[x] = ... 是賦值操作，會改變樹的結構
    return (this.parent[x] = this.findRoot(this.parent[x]));
  }

  /**
   * 合併節點 x 和節點 y 所屬的兩個集合
   * @param {number} x - 第一個節點
   * @param {number} y - 第二個節點
   *
   * 優化技巧：按秩合併(Union by Rank)
   * 總是把矮的樹接到高的樹下面，避免樹退化成鏈表
   *
   * 時間複雜度：O(α(n)) - 主要是兩次 find 操作
   * 空間複雜度：O(1)
   */
  union(x, y) {
    // 第一步：找到兩個節點各自的根
    // 注意這裡會觸發路徑壓縮，改變樹的結構
    const rootX = this.findRoot(x);
    const rootY = this.findRoot(y);

    // 如果已經在同一個集合裡，什麼都不做
    if (rootX === rootY) {
      return;
    }

    // 按高度決定誰接到誰下面
    // 核心原則：矮樹接高樹，保持整體樹高度盡可能小
    if (this.height[rootX] > this.height[rootY]) {
      // rootX 比較高，把 rootY 接到 rootX 下
      this.parent[rootY] = rootX;
      // 注意：高度不變，因為 rootY 這棵矮樹接上去不會改變最長路徑
    } else if (this.height[rootX] < this.height[rootY]) {
      // rootY 比較高，把 rootX 接到 rootY 下
      this.parent[rootX] = rootY;
      // 同樣，高度不變
    } else {
      // 兩棵樹一樣高，隨便選一個當根(這裡選 rootY)
      this.parent[rootX] = rootY;
      // 關鍵：高度要加 1，因為增加了一層
      this.height[rootY]++;
    }
  }

  /**
   * 檢查兩個節點是否在同一個集合中(是否連通)
   * @param {number} x - 第一個節點
   * @param {number} y - 第二個節點
   * @return {boolean} 是否連通
   *
   * 這是一個輔助方法，讓程式碼更具可讀性
   *
   * 時間複雜度：O(α(n))
   * 空間複雜度：O(1)
   */
  isConnected(x, y) {
    // 只需比較兩個元素的根是否相同
    return this.findRoot(x) === this.findRoot(y);
  }
}
