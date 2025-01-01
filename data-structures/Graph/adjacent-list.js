//@ts-check
/**
 * Adjacent list
 *
 * Insert Node: O(1)
 * Insert Edge: O(1)
 * Delete Node: O(V + E)：需要刪除所有與該節點相關聯的邊，V 是節點數量，E 是邊的數量。
 * Delete Edge: O(1)
 * Search Node: O(V)：需要遍歷所有節點。
 * Search Edge: O(1)：若知道要查找的兩個節點，則能直接查找它們之間是否有邊存在。
 *
 * 缺點:
 *  若是密集圖（dense graph），其空間複雜度較高；
 *  若是稀疏圖（sparse graph），則可能會有許多不必要的空間浪費。
 *
 * 應用:
 *  Graph 常用在社交網絡、路徑尋找演算法、網路路徑分析等應用。
 */

// Adjacent list
class Graph {
  constructor() {
    this.adjacencyList = {};
  }

  /** @param {number} vertex */
  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) this.adjacencyList[vertex] = [];
  }

  /**
   * @param {number} source
   * @param {number} destination
   */
  addEdge(source, destination) {
    if (!this.adjacencyList[source]) this.addVertex(source);
    if (!this.adjacencyList[destination]) this.addVertex(destination);
    this.adjacencyList[source].push(destination);
    this.adjacencyList[destination].push(source);
  }

  /**
   * @param {number} vertex1
   * @param {number} vertex2
   * **/
  hasEdge(vertex1, vertex2) {
    return this.adjacencyList[vertex1].some(
      /** @param {number} v*/
      (v) => v === vertex2,
    );
  }

  /**
   * @param {number} source
   * @param {number} destination
   **/
  removeEdge(source, destination) {
    if (this.adjacencyList[source]) {
      this.adjacencyList[source] = this.adjacencyList[source].filter(
        /** @param {number} adjacentVertex */
        (adjacentVertex) => adjacentVertex !== destination,
      );
    }
    if (this.adjacencyList[destination]) {
      this.adjacencyList[destination] = this.adjacencyList[destination].filter(
        /** @param {number} adjacentVertex */
        (adjacentVertex) => adjacentVertex !== source,
      );
    }
  }

  /** @param {number} vertex */
  removeVertex(vertex) {
    // Remove all of edge of vertex that store in other vertices
    while (this.adjacencyList[vertex]) {
      const adjacentVertex = this.adjacencyList[vertex].pop();
      this.removeEdge(vertex, adjacentVertex);
    }
    // Remove the vertex itself
    delete this.adjacencyList[vertex];
  }

  // printGraph()

  /** @param {number} start */
  bfs(start) {
    const queue = [start];
    const result = [];
    const visited = {};
    visited[start] = true;
    let currentVertex;

    while (queue.length) {
      currentVertex = queue.shift();
      result.push(currentVertex);

      this.adjacencyList[currentVertex].forEach(
        /** @param {number} neighbor */
        (neighbor) => {
          if (!visited[neighbor]) {
            visited[neighbor] = true;
            queue.push(neighbor);
          }
        },
      );
    }
    return result;
  }

  /** @param {number} start */
  dfs(start) {
    const stack = [start];
    const result = [];
    const visited = {};
    visited[start] = true;
    let currentVertex;

    while (stack.length) {
      currentVertex = stack.pop();
      result.push(currentVertex);

      this.adjacencyList[currentVertex].forEach(
        /** @param {number} neighbor */
        (neighbor) => {
          if (!visited[neighbor]) {
            visited[neighbor] = true;
            stack.push(neighbor);
          }
        },
      );
    }

    return result;
  }

  /**
   * @param {number} start
   * @description
   *   The recursive version of DFS,
   *   but this as same as iterative version,
   *   cause this using function stack of system.
   * */
  dfsRecursive(start) {
    const result = [];
    const visited = {};
    const adjacencyList = this.adjacencyList;

    (function dfsHelper(vertex) {
      if (!vertex) return null;
      visited[vertex] = true;
      result.push(vertex);

      adjacencyList[vertex].forEach(
        /** @param {number} neighbor */
        (neighbor) => {
          if (!visited[neighbor]) {
            return dfsHelper(neighbor);
          }
        },
      );
    })(start);

    return result;
  }
}

// const IGraph = new Graph(3);

export default Graph;
