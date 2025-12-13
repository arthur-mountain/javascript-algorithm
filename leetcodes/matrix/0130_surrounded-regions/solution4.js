/**
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var solve = function (board) {
  const ROW = board.length;
  const COL = board[0].length;
  const uf = new UnionFind(board);

  // 建立 union relation
  for (let row = 0; row < ROW; row++) {
    for (let col = 0; col < COL; col++) {
      if (board[row][col] === "O") {
        // 主需要處理當前格子和「右、下」格子的連通關係即可
        // 因為左、上在遍歷到當前格子時，已經被處理過了

        // 右
        if (row + 1 < ROW && board[row + 1][col] === "O") {
          uf.union(row * COL + col, (row + 1) * COL + col);
        }

        // 下
        if (col + 1 < COL && board[row][col + 1] === "O") {
          uf.union(row * COL + col, row * COL + col + 1);
        }
      }
    }
  }

  // 若當前格子的 'O' 不與邊界聯通則把 'O' 翻轉成 'X'
  for (let row = 0; row < ROW; row++) {
    for (let col = 0; col < COL; col++) {
      if (board[row][col] === "O" && !uf.isConnectedToEdgeO(row * COL + col)) {
        board[row][col] = "X";
      }
    }
  }

  return board;
};

class UnionFind {
  constructor(board) {
    const ROW = board.length;
    const COL = board[0].length;
    // 作為虛擬節點表示邊界上的 'O'
    // 為何是虛擬節點？ 因為索引範圍 [0, ROW * COL - 1]
    this.edgeIdOfO = ROW * COL;

    // 紀錄每一個格子連通的 root
    this.parent = new Array(ROW * COL + 1);
    // 設置 edgeIdOfO 的父節點為自己
    this.parent[this.edgeIdOfO] = this.edgeIdOfO;

    // 紀錄每一個 root 的高度，用於矮樹接高樹
    this.height = new Array(ROW * COL + 1).fill(1);

    // 初始化將每個格子的 root 標記成自己，
    // 並且邊界的 'O' root 則標記成特殊符號(這邊是二維陣列轉成一維陣列後的 length，因為沒人會用到)
    for (let row = 0; row < ROW; row++) {
      for (let col = 0; col < COL; col++) {
        const id = row * COL + col;
        // 如果是邊界上的 'O'
        if (
          (row === 0 || col === 0 || row === ROW - 1 || col === COL - 1) &&
          board[row][col] === "O"
        ) {
          this.parent[id] = this.edgeIdOfO;
        } else {
          this.parent[id] = id;
        }
      }
    }
  }

  findRoot(id) {
    // 如果自己就是 root 就直接回傳
    if (this.parent[id] === id) {
      return this.parent[id];
    }
    // 否則就繼續遞迴往上找，直到找到 root
    // 並且把過程中會經過的節點也都指向 root，這樣後續就不用一直遞迴往上找(路徑壓縮)
    return (this.parent[id] = this.findRoot(this.parent[id]));
  }

  union(currentCellId, neighborCellId) {
    const currentCellRoot = this.findRoot(currentCellId);
    const neighborCellRoot = this.findRoot(neighborCellId);

    // 相同的 root 已經連通則不需要再處理
    if (currentCellRoot === neighborCellRoot) {
      return;
    }

    // 若其中一個是 edgeIdOfO 就要連通到 edgeIdOfO
    if (
      currentCellRoot === this.edgeIdOfO ||
      neighborCellRoot === this.edgeIdOfO
    ) {
      this.parent[
        currentCellRoot === this.edgeIdOfO ? neighborCellRoot : currentCellRoot
      ] = this.edgeIdOfO;
      return;
    }

    // 矮樹接到高樹(只在兩個都不是 edgeIdOfO 時執行)
    if (this.height[currentCellRoot] > this.height[neighborCellRoot]) {
      this.parent[neighborCellRoot] = currentCellRoot;
    } else if (this.height[currentCellRoot] < this.height[neighborCellRoot]) {
      this.parent[currentCellRoot] = neighborCellRoot;
    } else {
      // 兩棵樹一樣高就則一接到另一棵樹下，並且高度 + 1
      this.parent[currentCellRoot] = neighborCellRoot;
      this.height[neighborCellRoot]++;
    }
  }

  isConnectedToEdgeO(id) {
    return this.findRoot(id) === this.edgeIdOfO;
  }
}
