/*
 * Status:
 *  - [x] Done
 *  - [x] Follow-up solutions
 *    - Same as the approaches or ideas in the solutions.
 *
 * Title:
 *  3163. String Compression III
 *
 * Topics:
 *  String
 *
 * Statements:
 *  Implement a string compression algorithm.
 *
 *  Given a string, compress it by:
 *   1. Counting consecutive identical characters, with a maximum count of 9.
 *
 *   2.1 If the count reaches 9 or the current character differs from the previous one,
 *
 *   2.2 Append the count and the character to the compressed string.
 *
 * Constraints:
 *  1. word consists only of lowercase English letters.
 **/
/**
 * @param {string} word
 * @return {string}
 */
let compressedString = (word) => {
  /**
   * Thoughts:
   *
   * Create an array to store the current count and current character -> `curr = [count, current iterated character]`.
   * Initialize it with 1 and the first character of the word.
   *
   * Create a variable to store the compressed string -> `comp = ""`.
   *
   * Iterate through each character in the word:
   *
   * If the current character is the same as the previous character:
   *    - If the current count is less than 9:
   *         - Increment the count.
   *    - Otherwise:
   *         - Append the count and character to the compressed string.
   *         - Reset the count to 1 and update the current character to the current character being iterated.
   * Else:
   *    - Append the count and character to the compressed string.
   *    - Reset the count to 1 and update the current character to the current character being iterated.
   *
   * Return the compressed string.
   *
   * Time complexity: O(n)
   * Space complexity: O(n)
   **/

  let curr = [1, word[0]];
  let comp = "";

  for (let i = 1, len = word.length; i <= len; i++) {
    if (curr[1] === word[i] && curr[0] < 9) {
      curr[0]++;
    } else {
      comp += `${curr[0]}${curr[1]}`;
      curr[0] = 1;
      curr[1] = word[i];
    }
  }

  return comp;
};

/** another approach */
compressedString = (word) => {
  /*
   * Thoughts:
   *  Similar to the approach above using a `while` loop,
   *  but this time counting consecutive characters directly within the inner `while` loop.
   *
   *  Using an array to store the compressed string improves performance compared to string concatenation.
   *
   *  Time complexity: O(n)
   *  Space complexity: O(n)
   */
  let result = []; // 最終壓縮結果
  let i = 0; // 指向當前處理的位置

  while (i < word.length) {
    // 當前字符
    let c = word[i];
    // 計數這個字符最多可以重複9次
    let count = 0;

    // 計算連續相同字符的長度，最多取9個
    while (i < word.length && word[i] === c && count < 9) {
      count++;
      i++;
    }

    // 將計數和字符添加到結果中
    result.push(count, c);
  }

  return result.join("");
};
