/**
 * 搜尋與插入方法的時間複雜度為 O(log n)，
 * 空間複雜度為 O(1)；
 *
 * 而廣度優先及深度優先的時間/空間複雜度為 O(n)( 取決於實作的方式)。
 */
class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BSTree {
  constructor() {
    this.root = null;
  }

  // 插入
  insert(value) {
    const newNode = new Node(value);

    if (!this.root) {
      this.root = newNode;

      return this;
    }

    let current = this.root;
    while (true) {
      if (current.value > value) {
        // 往左走
        if (!current.left) {
          current.left = newNode;
          return this;
        }

        current = current.left;
      } else if (current.value < value) {
        // 往右走
        if (!current.right) {
          current.right = newNode;
          return this;
        }

        current = current.right;
      } else {
        // 插入重複節點(current.value === value)
        console.log("插入重複節點");
        return null;
      }
    }
  }

  // 搜尋
  find(value) {
    if (!this.root) return null;

    let current = this.root;
    let founded = 0;

    while (current && !founded) {
      if (current.value > value) {
        // 要找的值比當前的值小，往左找
        current = current.left;
      } else if (current.value < value) {
        // 要找的值比當前的值大，往右找
        current = current.right;
      } else {
        // 要找得值剛好等於當前的值，founded
        founded = 1;
      }
    }

    // 沒找到
    if (!founded) return null;

    return current;
  }

  // 廣度優先(同階層平行來回尋找)
  BFS() {
    if (!this.root) return [];

    let node = this.root;
    const visited = []; // 已訪問過的節點
    const unvisitedQueue = []; // 尚未訪問過的節點

    unvisitedQueue.push(node); // 初始化，放入 root

    while (unvisitedQueue.length) {
      // 取出未訪問過的節點
      node = unvisitedQueue.shift();

      visited.push(node);

      // 左邊有節點，則放入左邊節點(左邊先放)
      if (node.left) unvisitedQueue.push(node.left);
      // 右邊有節點，則放入右邊節點(再放右邊)
      if (node.right) unvisitedQueue.push(node.right);
    }

    return visited;
  }

  // 深度優先
  // 三種類型，PreOrder、PostOrder，InOrder
  // 根節點 -> 左節點 -> 右節點
  DFSPreOrder() {
    const visited = [];
    if (!this.root) return visited;

    function traverse(node) {
      /*
       * 左邊遞迴到底 並放入節點，
       * 才繼續右邊遞迴到底 並放入節點
       */
      visited.push(node);
      // 左邊有節點，則遞迴尋找左邊節點，直到底
      if (node.left) traverse(node.left);
      // 右邊有節點，則遞迴尋找右邊節點，直到底
      if (node.right) traverse(node.right);
    }

    traverse(this.root);

    return visited;
  }

  // 左節點 -> 根節點 -> 右節點
  DFSInOrder() {
    const visited = [];
    if (!this.root) return visited;

    function traverse(node) {
      /*
       * 左邊遞迴到底後，
       * 才開始把節點放入 queue，
       * call stack 往返時如果有右邊節點，則遞迴右邊節點
       */
      if (node.left) traverse(node.left);
      visited.push(node);
      if (node.right) traverse(node.right);
    }

    traverse(this.root);

    return visited;
  }

  // 左節點 -> 右節點 -> 根節點
  DFSPostOrder() {
    const visited = [];
    if (!this.root) return visited;

    function traverse(node) {
      if (node.left) traverse(node.left);
      if (node.right) traverse(node.right);
      visited.push(node);
    }

    traverse(this.root);

    return visited;
  }
}

export default BSTree;
