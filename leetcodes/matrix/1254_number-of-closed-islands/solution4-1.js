/**
 * @param {number[][]} grid
 * @return {number}
 */
var closedIsland = function (grid) {
  const m = grid.length;
  const n = grid[0].length;

  // === 初始化 Union-Find ===

  // 總節點數 = 矩陣格子數 + 1 個虛擬邊界節點
  const totalNodes = m * n + 1;
  const VIRTUAL_IDX = m * n; // 虛擬邊界節點的索引
  const uf = new UnionFind(totalNodes);

  /**
   * 將二維坐標轉換為一維索引
   */
  const getIndex = (i, j) => i * n + j;

  // === 建立連通關係 ===
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // 只處理陸地
      if (grid[i][j] === 0) {
        const currentIndex = getIndex(i, j);

        // 如果在邊界，與虛擬邊界節點合併
        if (i === 0 || i === m - 1 || j === 0 || j === n - 1) {
          uf.union(currentIndex, VIRTUAL_IDX);
        }

        // 與右邊的陸地合併
        if (j + 1 < n && grid[i][j + 1] === 0) {
          uf.union(currentIndex, getIndex(i, j + 1));
        }

        // 與下邊的陸地合併
        if (i + 1 < m && grid[i + 1][j] === 0) {
          uf.union(currentIndex, getIndex(i + 1, j));
        }
      }
    }
  }

  // === 統計封閉島嶼數量 ===
  const islands = new Set(); // 用 Set 去重
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 0) {
        const currentIndex = getIndex(i, j);
        const root = uf.findRoot(currentIndex);

        // 如果不與邊界連通，就是封閉島嶼
        if (root !== uf.findRoot(VIRTUAL_IDX)) {
          islands.add(root); // 用根節點代表一個島嶼
        }
      }
    }
  }
  return islands.size;
};

class UnionFind {
  constructor(size) {
    this.parent = new Array(size);
    this.height = new Array(size).fill(0);

    // 初始化：每個節點的父節點是自己
    for (let i = 0; i < size; i++) {
      this.parent[i] = i;
    }
  }

  /**
   * 查找根節點（帶路徑壓縮）
   */
  findRoot(id) {
    if (this.parent[id] === id) {
      return id;
    }
    return (this.parent[id] = this.findRoot(this.parent[id])); // 路徑壓縮
  }

  /**
   * 合併兩個集合（按秩合併）
   */
  union(x, y) {
    const rootX = this.findRoot(x);
    const rootY = this.findRoot(y);

    // 已經在同一集合
    if (rootX === rootY) return;

    // 按秩合併：將較小的樹連接到較大的樹
    if (this.height[rootX] < this.height[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.height[rootX] > this.height[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.height[rootX]++;
    }
  }
}
