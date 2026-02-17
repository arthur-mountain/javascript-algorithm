/**
 * Graph - Adjacency List 實作
 *
 * 核心思想：使用 Object/Map 儲存每個節點的鄰居列表
 * 適用於：稀疏圖（E << V²）
 *
 * 缺點:
 *  若是密集圖(dense  graph)，其空間複雜度較高；
 *  若是稀疏圖(sparse graph)，則可能會有許多不必要的空間浪費。
 *
 * 時間複雜度：見上方複雜度總結表
 * 空間複雜度：O(V + E)
 */
class Graph {
  constructor() {
    // 使用 Object 作為 adjacency list
    // key: 節點標識符, value: 鄰居陣列
    this.adjacencyList = {};
  }

  /**
   * 新增節點
   * @param {string|number} vertex - 節點標識符
   *
   * 時間複雜度：O(1)
   */
  addVertex(vertex) {
    // 只有節點不存在時才新增，避免覆蓋已存在的鄰居列表
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }

  /**
   * 新增邊（無向圖版本）
   * @param {string|number} source - 起點
   * @param {string|number} destination - 終點
   *
   * 時間複雜度：O(1)
   */
  addEdge(source, destination) {
    // 確保兩個節點都存在
    if (!this.adjacencyList[source]) this.addVertex(source);
    if (!this.adjacencyList[destination]) this.addVertex(destination);

    // 無向圖：雙向都要加入
    this.adjacencyList[source].push(destination);
    this.adjacencyList[destination].push(source);
  }

  /**
   * BFS - 廣度優先搜尋
   * @param {string|number} start - 起始節點
   * @returns {Array} 訪問順序
   *
   * 核心思想：使用 Queue (FIFO) 確保「層級順序」遍歷
   * - 先發現的先處理
   * - 距離起點近的先訪問
   *
   * 時間複雜度：O(V + E)
   * 空間複雜度：O(V)
   */
  bfs(start) {
    const queue = [start];
    const visited = { [start]: true }; // 關鍵：加入 queue 時就標記
    const result = [];

    while (queue.length > 0) {
      // FIFO：取出最早加入的節點
      const current = queue.shift();
      result.push(current);

      // 遍歷所有鄰居
      for (const neighbor of this.adjacencyList[current]) {
        if (!visited[neighbor]) {
          visited[neighbor] = true; // 加入前就標記，避免重複加入
          queue.push(neighbor);
        }
      }
    }

    return result;
  }

  /**
   * DFS - 深度優先搜尋（迭代版本）
   * @param {string|number} start - 起始節點
   * @returns {Array} 訪問順序
   *
   * 核心思想：使用 Stack (LIFO) 確保「深度優先」遍歷
   * - 後發現的先處理
   * - 沿著一條路徑盡可能深入
   *
   * 時間複雜度：O(V + E)
   * 空間複雜度：O(V)
   */
  dfs(start) {
    const stack = [start];
    const visited = { [start]: true };
    const result = [];

    while (stack.length > 0) {
      // LIFO：取出最後加入的節點
      const current = stack.pop();
      result.push(current);

      // 遍歷所有鄰居
      for (const neighbor of this.adjacencyList[current]) {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          stack.push(neighbor);
        }
      }
    }

    return result;
  }

  /**
   * DFS - 深度優先搜尋（遞迴版本）
   * @param {string|number} start - 起始節點
   * @returns {Array} 訪問順序
   *
   * 核心思想：利用 Call Stack 自動管理「待處理節點」
   *
   * 時間複雜度：O(V + E)
   * 空間複雜度：O(V) - Call Stack 深度
   */
  dfsRecursive(start) {
    const result = [];
    const visited = {};
    const adjacencyList = this.adjacencyList;

    function dfsHelper(vertex) {
      if (!vertex) return;

      visited[vertex] = true;
      result.push(vertex);

      // 遞迴探索所有未訪問的鄰居
      for (const neighbor of adjacencyList[vertex]) {
        if (!visited[neighbor]) {
          dfsHelper(neighbor);
        }
      }
    }

    dfsHelper(start);
    return result;
  }

  /**
   * 檢查兩節點間是否有邊
   * @param {string|number} vertex1
   * @param {string|number} vertex2
   * @returns {boolean}
   *
   * 時間複雜度：O(degree)
   */
  hasEdge(vertex1, vertex2) {
    return this.adjacencyList[vertex1]?.includes(vertex2) ?? false;
  }

  /**
   * 移除邊
   * @param {string|number} source
   * @param {string|number} destination
   *
   * 時間複雜度：O(degree)
   */
  removeEdge(source, destination) {
    if (this.adjacencyList[source]) {
      this.adjacencyList[source] = this.adjacencyList[source].filter(
        (v) => v !== destination,
      );
    }
    if (this.adjacencyList[destination]) {
      this.adjacencyList[destination] = this.adjacencyList[destination].filter(
        (v) => v !== source,
      );
    }
  }

  /**
   * 移除節點（及其所有相關邊）
   * @param {string|number} vertex
   *
   * 時間複雜度：O(V + E)
   */
  removeVertex(vertex) {
    // 移除所有與該節點相連的邊
    while (this.adjacencyList[vertex]?.length) {
      const neighbor = this.adjacencyList[vertex].pop();
      this.removeEdge(vertex, neighbor);
    }
    // 移除節點本身
    delete this.adjacencyList[vertex];
  }
}

exports.module = { Graph };
