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
  // Time : O(n * 32 + n * 32)
  //    - 建立 Trie：插入 n 個數字，每個數字需要處理 32 位元 → O(n * 32)
  //    - 查找最大 OR：對 n 個數字進行查找，每次查找遍歷 32 位元 → O(n * 32)
  //
  // Space: O(n * 32) -> O(n)
  //    - Trie 結構：最壞情況下（所有數字完全不同），需要建立 n * 32 個節點
  //    - 每個節點包含 zero 和 one 兩個指標(常數)
  //    - 實際情況通常小於 O(n * 32)，因為 Trie 會共享相同的前綴路徑
};

class BinaryTrieNode {
  constructor() {
    // 直接屬性比陣列快
    this.zero = null;
    this.one = null;
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

      if (bit === 0) {
        if (!current.zero) current.zero = new BinaryTrieNode();
        current = current.zero;
      } else {
        if (!current.one) current.one = new BinaryTrieNode();
        current = current.one;
      }
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

      if (bit === 0) {
        if (current.one) {
          result = (result << 1) | 1;
          current = current.one;
        } else {
          result = result << 1;
          current = current.zero;
        }
      } else {
        if (current.zero) {
          result = (result << 1) | 1;
          current = current.zero;
        } else {
          result = result << 1;
          current = current.one;
        }
      }
    }

    return result;
  }
}
