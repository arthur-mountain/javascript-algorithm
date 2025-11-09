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
  if (node == null) {
    return null;
  }

  const clonedNodeMap = new Map();
  const stack = [node];

  // 首次遇到起點，建立 clone 並存入 map
  clonedNodeMap.set(node, new _Node(node.val));

  while (stack.length > 0) {
    const originNode = stack.pop();
    const clonedNode = clonedNodeMap.get(originNode);

    // 遍歷原節點 neighbor
    for (const neighbor of originNode.neighbors) {
      // 如果 neighbor 沒被 clone 過，先建立 clone 並存入 map，並推入 stack 等待處理
      if (!clonedNodeMap.has(neighbor)) {
        clonedNodeMap.set(neighbor, new _Node(neighbor.val));
        stack.push(neighbor);
      }
      // neighbors 陣列連結 map 中對應的 clone 節點
      clonedNode.neighbors.push(clonedNodeMap.get(neighbor));
    }
  }

  return clonedNodeMap.get(node);
};
