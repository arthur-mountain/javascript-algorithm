/**
 * @param {character[][]} grid
 * @return {number}
 */
var numIslands = function (grid) {
  if (!grid || grid.length === 0) {
    return 0;
  }

  const m = grid.length;
  const n = grid[0].length;

  // 初始化 Union Find
  const uf = new UnionFind(grid);

  // 遍歷每個格子
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // 只處理陸地
      if (grid[i][j] === "1") {
        // 檢查右方和下方的鄰居（避免重複檢查）
        // 為什麼只檢查右和下？因為左和上在之前的迭代中已經處理過了

        // 將二維坐標轉成一維座標id: row * n + col
        // 檢查右方
        if (j + 1 < n && grid[i][j + 1] === "1") {
          uf.union(i * n + j, i * n + (j + 1));
        }

        // 檢查下方
        if (i + 1 < m && grid[i + 1][j] === "1") {
          uf.union(i * n + j, (i + 1) * n + j);
        }
      }
    }
  }

  return uf.getCount();
};

class UnionFind {
  constructor(grid) {
    const m = grid.length;
    const n = grid[0].length;

    // parent[i] 記錄節點 i 的父節點
    // 初始化時每個節點的父節點是自己
    this.parent = new Array(m * n);

    // rank[i] 記錄以 i 為根的樹的高度（用於按秩合併優化）
    this.rank = new Array(m * n).fill(0);

    // count 記錄當前有多少個獨立的集合（島嶼數量）
    this.count = 0;

    // 初始化：只有陸地才建立集合
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        if (grid[i][j] === "1") {
          const id = i * n + j;
          this.parent[id] = id; // 每個陸地一開始根都是自己
          this.count++; // 初始時每個陸地都是獨立的島嶼
        }
      }
    }
  }

  /**
   * 查找操作：找到 x 所在集合的根節點
   * 同時進行路徑壓縮優化
   */
  find(x) {
    // 如果 x 不是根節點，遞迴找到根節點
    if (this.parent[x] !== x) {
      // 路徑壓縮：將 x 直接連接到根節點
      // 這樣下次查找時就是 O(1)
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  /**
   * 合併操作：將 x 和 y 所在的集合合併
   * 使用按秩合併優化
   */
  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);

    // 如果已經在同一個集合中，不需要合併
    if (rootX === rootY) return;

    // 按秩合併：將較矮的樹接到較高的樹下面
    // 這樣可以保持樹的平衡，避免退化成鏈表
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      // 高度相同時，隨意選一個作為根，並將其高度加一
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }

    // 兩個集合合併，島嶼數量減一
    this.count--;
  }

  /**
   * 返回當前島嶼數量
   */
  getCount() {
    return this.count;
  }
}
