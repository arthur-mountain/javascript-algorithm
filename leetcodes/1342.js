/**
 * Status:
 *  - [x] Done
 *  - [x] Follow-up solutions
 *
 * Title:
 *    1342. Number of Steps to Reduce a Number to Zero
 *
 * Topics:
 *    1. Math
 *
 *    2. Bit Manipulation
 *
 * Statements:
 *    Given a non-negative integer num, return the number of steps to reduce it to zero.
 *
 *    If the current number is even, you have to divide it by 2, otherwise, you have to subtract 1 from it.
 *
 * Constraints:
 *    1. 0 <= num <= 10^6
 **/
/**
 * @param {number} num
 * @return {number}
 */
let numberOfSteps = (num) => {
  /*
   * Thoughts:
   *    while is num is not 0,
   *    check if num is even or odd, and do the operation
   * */
  // Space: O(1)
  let steps = 0;

  // Time: O(log(n)), must be one step will divide by 2
  while (num > 0) {
    steps++;

    if (num % 2 === 0) {
      num /= 2;
    } else {
      num--;
    }
  }

  return steps;
};

// Follow up:
// num % 2 === 0 is the same as num & 1 === 0
// num /=2 is the same as num >>= 1
numberOfSteps = (num) => {
  // Space: O(1)
  let steps = 0;

  // Time: O(log(n))
  while (num > 0) {
    steps++;

    // Note1:
    //  The rightmost bit (2^0) of a binary number is 0 for even numbers and 1 for odd numbers.
    // Note1.1:
    //  The bits represent powers of 2, as seen in the first example.
    //
    // Even Binary Examples:
    //  2 -> 0010 -> 0 * 2^3 + 0 * 2^2 + 1 * 2^1 + 0 * 2^0
    //  6 -> 0110
    //  10 -> 1010
    //  16 -> 10000
    //
    // Odd Binary Examples:
    //  3 -> 0011
    //  7 -> 0111
    //  11 -> 1011
    //  17 -> 10001
    //
    // Note2:
    //  The & operator performs a bitwise AND operation.
    //  If both bits in the corresponding positions of two binary numbers are 1, the result is 1; otherwise, it's 0.
    // Note2.1:
    //  The & operator is used to compare two binary numbers of the same length.
    // Note2.2:
    //  For positive numbers, the most significant bit (leftmost) is filled with 0s to ensure equal binary length.
    //  For negative numbers, it's filled with 1s.
    //
    // Examples:
    //    2 & 1 -> 0010 & 0001 -> 0000
    //    6 & 1 -> 0110 & 0001 -> 0000
    //    10 & 1 -> 1010 & 0001 -> 0000
    //    16 & 1 -> 10000 & 00001 -> 0000 (the most significant bit is 0, ensuring equal length)
    //
    // Note3: Combining Note1 and Note2
    //   - The rightmost bit of a binary number is 0 for even numbers.
    //
    //   - The binary representation of 1 has a 1 in the 2^0 position (e.g., 0001).
    //
    //   - Therefore, an even number ANDed with 1 will always result in 0.
    //
    // Even Examples:
    //  2 & 1 -> 0010 & 0001 -> 0000
    //  6 & 1 -> 0110 & 0001 -> 0000
    //  10 & 1 -> 1010 & 0001 -> 0000
    //  16 & 1 -> 10000 & 00001 -> 0000
    //
    // Odd Examples:
    //  3 & 1 -> 0011 & 0001 -> 0001
    //  7 & 1 -> 0111 & 0001 -> 0001
    //  11 & 1 -> 1011 & 0001 -> 0001
    //  17 & 1 -> 10001 & 00001 -> 00001
    if ((num & 1) === 0) {
      // Note4: the >>= operator shifts all bits to the right by $num of positions.
      //
      // For example, >>= 1 shifts all bits one position to the right, filling the leftmost bit with 0.
      //
      // As mentionedd in Note1.1: shifting all bits to the right by 1 is eq to dividing the number by 2 for powers of 2.
      //
      // Examples:
      //  2 -> 0010, 2 >>= 1 -> 0001 -> 1
      //  6 -> 0110, 6 >>= 1 -> 0011 -> 3
      //  10 -> 1010, 10 >>= 1 -> 0101 -> 5
      //  16 -> 10000, 16 >>= 1 -> 01000 -> 8
      num >>= 1;
    } else {
      num--;
    }
  }

  return steps;
};
