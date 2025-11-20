/**
 * @param {number[][]} grid
 * @return {number}
 */
var maxAreaOfIsland = function (grid) {
  const row = grid.length;
  const col = grid[0].length;
  const uf = new UnionFind(grid);

  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      if (grid[i][j] === 1) {
        // 往右
        if (j + 1 < col && grid[i][j + 1] === 1) {
          uf.union(i * col + j, i * col + (j + 1));
        }
        // 往下
        if (i + 1 < row && grid[i + 1][j] === 1) {
          uf.union(i * col + j, (i + 1) * col + j);
        }
      }
    }
  }

  return uf.getMaxLandCount();
};

class UnionFind {
  constructor(grid) {
    const row = grid.length;
    const col = grid[0].length;

    this.parent = Array(row * col);
    this.size = Array(row * col).fill(0);
    this.maxLandCount = 0;

    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col; j++) {
        if (grid[i][j] === 1) {
          const id = i * col + j;
          this.parent[id] = id;
          this.size[id] = 1;
          this.maxLandCount = 1;
        }
      }
    }
  }

  find(id) {
    if (this.parent[id] === id) {
      return id;
    }
    return (this.parent[id] = this.find(this.parent[id]));
  }

  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) {
      return;
    }

    if (this.size[rootX] > this.size[rootY]) {
      this.parent[rootY] = rootX;
      this.maxLandCount = Math.max(
        this.maxLandCount,
        (this.size[rootX] += this.size[rootY]),
      );
    } else {
      this.parent[rootX] = rootY;
      this.maxLandCount = Math.max(
        this.maxLandCount,
        (this.size[rootY] += this.size[rootX]),
      );
    }
  }

  getMaxLandCount() {
    return this.maxLandCount;
  }
}
