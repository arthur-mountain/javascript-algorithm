/*
 * - [] Done
 * - [] Follow up solutions
 */
/**
 * @param {string} s1
 * @param {string} s2
 * @return {string[]}
 */
let uncommonFromSentences = (s1, s2) => {
  // Space complexity: O(n + m)
  const map = new Map();

  // Time complexity: O(n) for split s1
  // Time complexity: O(1) for map get and set
  for (const word of s1.split(" ")) {
    map.set(word, map.get(word) + 1 || 1);
  }

  // Time complexity: O(m) for split s2
  // Time complexity: O(1) for map get and set
  for (const word of s2.split(" ")) {
    map.set(word, map.get(word) + 1 || 1);
  }

  // Time complexity: O(n + m) for map transform to entries
  // Time complexity: O(n + m) for filter
  // Time complexity: O(n + m) for map
  // End time complexity: O(n + m)
  return [...map.entries()]
    .filter(([_, count]) => count === 1)
    .map(([word, _]) => word); // this create multiple time new arrays

  // Final Time complexity: O(n + m)
  // Final Space complexity: O(n + m)
};

/** follwup: this is better than first implementation (less memory usage)*/
uncommonFromSentences = (s1, s2) => {
  // Space complexity: O(n + m)
  const map = new Map();

  // Time complexity: O(n) for split s1
  // Time complexity: O(1) for map get and set
  for (const word of s1.split(" ")) {
    map.set(word, map.get(word) + 1 || 1);
  }

  // Time complexity: O(m) for split s2
  // Time complexity: O(1) for map get and set
  for (const word of s2.split(" ")) {
    map.set(word, map.get(word) + 1 || 1);
  }

  // Space complexity: O(n + m)
  const result = [];

  // Time complexity: O(n + m) for map transform to entries
  for (const [word, count] of map.entries()) {
    if (count === 1) {
      // Time complexity: O(1) for push to last position does not shift front elements
      result.push(word);
    }
  }

  return result;
  // Final time complexity: O(n + m)
  // Final space complexity: O(n + m)
};
