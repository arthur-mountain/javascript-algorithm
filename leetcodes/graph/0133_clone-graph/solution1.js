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

  const clone = (originNode) => {
    let clonedNode = clonedNodeMap.get(originNode);
    if (clonedNode) return clonedNode;

    clonedNode = new _Node(originNode.val);
    clonedNodeMap.set(originNode, clonedNode);
    clonedNode.neighbors = originNode.neighbors.map(clone);
    return clonedNode;
  };

  return clone(node);
};
