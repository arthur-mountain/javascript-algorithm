/**
 * @param {number[][]} grid
 * @return {number}
 */
var closedIsland = function (grid) {
  // 2D grid, 0 land and 1 water
  // A island is 4-directionally connected group of 0
  // A closed island is the island totally surrounded by 1
  // return number of closed islands
  //
  // union find:
  // 將邊界上的 0 標示成特殊的 id
  // 初始化，每一個 cell 的根節點是自己 且如果是非邊界上的 0 時自己就是一個 island

  const ROW = grid.length;
  const COL = grid[0].length;
  const uf = new UnionFind(grid);

  for (let row = 0; row < ROW; row++) {
    for (let col = 0; col < COL; col++) {
      if (grid[row][col] === 0) {
        const currentId = row * COL + col;

        if (col + 1 < COL && grid[row][col + 1] === 0) {
          uf.union(currentId, row * COL + (col + 1));
        }

        if (row + 1 < ROW && grid[row + 1][col] === 0) {
          uf.union(currentId, (row + 1) * COL + col);
        }
      }
    }
  }

  return uf.getClosedIslandCount();
};

class UnionFind {
  constructor(grid) {
    const ROW = grid.length;
    const COL = grid[0].length;

    this.count = 0;
    this.parent = new Array(ROW * COL + 1);
    this.height = new Array(ROW * COL + 1).fill(1);
    this.parent[(this.virtualId = ROW * COL)] = this.virtualId;

    for (let row = 0; row < ROW; row++) {
      for (let col = 0; col < COL; col++) {
        const id = row * COL + col;
        if (
          (row === 0 || col === 0 || row === ROW - 1 || col === COL - 1) &&
          grid[row][col] === 0
        ) {
          this.parent[id] = this.virtualId;
        } else {
          this.parent[id] = id;
          if (grid[row][col] === 0) this.count++;
        }
      }
    }
  }

  findRoot(id) {
    if (this.parent[id] === id) {
      return id;
    }
    return (this.parent[id] = this.findRoot(this.parent[id]));
  }

  union(x, y) {
    const rootX = this.findRoot(x);
    const rootY = this.findRoot(y);

    if (rootX === rootY) return;

    if (rootX === this.virtualId) {
      this.parent[rootY] = this.virtualId;
      this.count--;
      return;
    }
    if (rootY === this.virtualId) {
      this.parent[rootX] = this.virtualId;
      this.count--;
      return;
    }

    if (this.height[rootX] > this.height[rootY]) {
      this.parent[rootY] = rootX;
    } else if (this.height[rootX] < this.height[rootY]) {
      this.parent[rootX] = rootY;
    } else {
      this.parent[rootX] = rootY;
      this.height[rootY]++;
    }

    this.count--;
  }

  getClosedIslandCount() {
    return this.count;
  }
}
