/**
 * @param {number[]} nums
 * @return {number}
 */
var findMaximumXOR = function (nums) {
  // 如果只有一個數字，XOR 自己(題目有說 i 可以等於 j)一定會是 0
  if (nums.length === 1) {
    return 0;
  }

  const binaryTrie = new BinaryTrie(nums);

  let max = -Infinity;
  for (let i = 0; i < nums.length; i++) {
    max = Math.max(max, binaryTrie.findMaxXOR(nums[i]));
  }

  return max;
  // Time : O(n + n * 32) -> 建立 trie + 每個數字 32bits 要走 nums 次，扣掉常數為 O(n)
  // Space: O(n * 32 * 2) -> 每個數字 32bits，每一個 bit 會建立長度為 2 的陣列，總共 n 次，扣掉常數為 O(n)
};

class BinaryTrieNode {
  constructor() {
    this.children = Array(2).fill(null);
    this.isEndOfBit = false;
  }
}

class BinaryTrie {
  constructor(nums) {
    this.root = new BinaryTrieNode();
    // Time : O(n)
    // Space: O(n)
    for (let i = 0; i < nums.length; i++) this.insert(nums[i]);
  }

  // 使用 staic 建立 helper，避免每次建立 instance 都需要重新建立 method
  // 當然也可以拆成 util function import，沒有標準答案
  static to32BitsBinary(num) {
    return num.toString(2).padStart(32, "0");
  }

  /**
   * Time : O(32)
   * Space: O(32)
   */
  insert(num) {
    const bits = BinaryTrie.to32BitsBinary(num);
    let current = this.root;
    for (let i = 0; i < bits.length; i++) {
      if (current.children[bits[i]] === null) {
        current.children[bits[i]] = new BinaryTrieNode();
      }
      current = current.children[bits[i]];
    }
    current.isEndOfBit = true;
  }

  /**
   * Time : O(32)
   * Space: O(32)
   */
  findMaxXOR(num) {
    let current = this.root;
    const bits = BinaryTrie.to32BitsBinary(num);
    const xors = Array(32).fill(0); // 直接建立 32bits 陣列，避免底層需要複製
    for (let i = 0; i < bits.length; i++) {
      const opposite = bits[i] === "0" ? 1 : 0;
      // 如果相反的 bit 不存在，則選原本的 bit，則 xor 出來的值會是 0
      if (current.children[opposite] === null) {
        xors[i] = 0;
        current = current.children[bits[i]];
      } else {
        // 如果相反的 bit 存在，則選相反的 bit，則 xor 出來的值會是 1
        xors[i] = 1;
        current = current.children[opposite];
      }
    }
    // 最後 current isEndOfBit 一定是 true，因為統一儲存長度為 32bits 的二進制數字，
    // 所以不用特別判斷 isEndOfBit
    return parseInt(xors.join(""), 2);
  }
}
