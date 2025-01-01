//@ts-check
/**
 * Adjacent matrix
 *
 * Insert Node: O(V^2)：需要重建整個矩陣來加入新節點。
 * Insert Edge: O(1)：直接在矩陣中對應位置設置邊。
 * Delete Node: O(V^2)：需要重建整個矩陣來刪除節點。
 * Delete Edge: O(1)：直接在矩陣中對應位置移除邊。
 * Search Node: O(V)：需要遍歷整個矩陣的一行或一列來找到節點。
 * Search Edge: O(1)：直接查詢矩陣中的對應位置是否有邊。
 *
 * 缺點:
 *  若是密集圖（dense graph），其空間複雜度較高；若是稀疏圖（sparse graph），則可能會有許多不必要的空間浪費。
 *
 * 應用:
 *  Graph 常用在社交網絡、路徑尋找演算法、網路路徑分析等應用。
 */

// Adjacent matrix
class Graph {
  constructor() {
    this.adjacencyMatrix = [];
  }

  /** @param {number} vertex */
  addVertex(vertex) {}

  /**
   * @param {number} source
   * @param {number} destination
   */
  addEdge(source, destination) {}

  /**
   * @param {number} vertex1
   * @param {number} vertex2
   * **/
  hasEdge(vertex1, vertex2) {}

  /**
   * @param {number} source
   * @param {number} destination
   **/
  removeEdge(source, destination) {}

  /** @param {number} vertex */
  removeVertex(vertex) {}

  // printGraph()

  /** @param {number} start */
  bfs(start) {}

  /** @param {number} start */
  dfs(start) {}

  /**
   * @param {number} start
   * @description
   *   The recursive version of DFS,
   *   but this as same as iterative version,
   *   cause this using function stack of system.
   * */
  dfsRecursive(start) {}
}

// const IGraph = new Graph(3);

export default Graph;
