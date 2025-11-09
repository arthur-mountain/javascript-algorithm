/**
 * // Definition for a _Node.
 * function _Node(val, neighbors) {
 *    this.val = val === undefined ? 0 : val;
 *    this.neighbors = neighbors === undefined ? [] : neighbors;
 * };
 */

/**
 * @param {_Node} node
 * @return {_Node}
 */
var cloneGraph = function (node) {
  if (node == null) return null;

  const clonedNodeMap = new Map();
  const queue = [node];

  // 先創建根節點的 clone
  clonedNodeMap.set(node, new _Node(node.val));

  // BFS 遍歷：一層一層處理
  while (queue.length > 0) {
    const originNode = queue.shift();

    // 處理當前原始節點的所有 neighbors
    for (const neighbor of originNode.neighbors) {
      // 如果 neighbor 還沒被複製過
      if (!clonedNodeMap.has(neighbor)) {
        clonedNodeMap.set(neighbor, new _Node(neighbor.val));
        // 加入隊列等待處理，因為雖然該 neighbor 已經被複製過了，但他的 neighbors 未被複製過
        queue.push(neighbor);
      }
      // 建立複製節點之間的連接
      clonedNodeMap.get(originNode).neighbors.push(clonedNodeMap.get(neighbor));
    }
  }

  return clonedNodeMap.get(node);
};
