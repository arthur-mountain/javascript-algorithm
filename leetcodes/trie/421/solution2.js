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
    this.children = [null, null];
  }
}

class BinaryTrie {
  constructor(nums) {
    this.root = new BinaryTrieNode();
    // Time : O(n)
    // Space: O(n)
    for (let i = 0; i < nums.length; i++) this.insert(nums[i]);
  }

  /**
   * Time : O(32)
   * Space: O(32)
   */
  insert(num) {
    let current = this.root;
    for (let i = 31; i >= 0; i--) {
      // ✅  取得 num 的第 i 位(從左數)，從後往前遍歷，避免取 bit 時的 31-i 計算
      const bit = (num >> i) & 1;

      if (current.children[bit] === null) {
        current.children[bit] = new BinaryTrieNode();
      }

      current = current.children[bit];
    }
  }

  /**
   * Time : O(32)
   * Space: O(1)
   */
  findMaxXOR(num) {
    // 用於計算 MaxXOR 的值，核心概念：
    // << 1 ：將現有數字左移一位(相當於「騰出右邊一個位置」)
    // | bit：將新的 bit 填入最右邊
    let result = 0;
    let current = this.root;

    for (let i = 31; i >= 0; i--) {
      const bit = (num >> i) & 1; // 取得 num 的第 i 位(從左數)
      const opposite = 1 - bit; // 另一種反向取值的方式，因為「1 - 0 = 1」「1 - 1 = 0」

      // 如果相反的 bit 不存在，則選原本的 bit，則 xor 出來的值會是 0
      if (current.children[opposite] === null) {
        result = (result << 1) | 0;
        current = current.children[bit];
      } else {
        // 如果相反的 bit 存在，則選相反的 bit，則 xor 出來的值會是 1
        result = (result << 1) | 1;
        current = current.children[opposite];
      }
    }

    return result;
  }
}
