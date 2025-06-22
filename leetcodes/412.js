/**
 * Status:
 *  - [x] Done
 *  - [x] Follow-up solutions
 *
 * Title:
 *    412. Fizz Buzz
 *
 * Topics:
 *    1. Math
 *
 *    2. String
 *
 *    3. Simulation
 *
 * Constraints:
 *    1. 1 <= n <= 10**4
 *
 * Statements:
 *    Given an integer n, return a string array answer (1-indexed) where:
 *
 *    answer[i] == "FizzBuzz" if i is divisible by 3 and 5.
 *
 *    answer[i] == "Fizz" if i is divisible by 3.
 *
 *    answer[i] == "Buzz" if i is divisible by 5.
 *
 *    answer[i] == i (as a string) if none of the above conditions are true.
 *
 *    note: the answer must be 1-indexed.
 **/

/**
 * @param {number} n
 * @return {string[]}
 */
let fizzBuzz = (n) => {
  // Space: O(n)
  let answer = Array({ length: n });

  // Time: O(n)
  for (let i = 1, idx = 0; i <= n; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
      answer[idx++] = "FizzBuzz";
    } else if (i % 3 === 0) {
      answer[idx++] = "Fizz";
    } else if (i % 5 === 0) {
      answer[idx++] = "Buzz";
    } else {
      answer[idx++] = `${i}`;
    }
  }

  return answer;
};

// Not better than the previous one,
// create empty array, and push elements to the array,
// cause the array might recalculate the memory address behind the scene
// depends on language implementation
//
// but more readable, cause we don't need to calculate the index
fizzBuzz = (n) => {
  // Space: O(n)
  let answer = [];

  // Time: O(n)
  for (let i = 1; i <= n; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
      answer.push("FizzBuzz");
    } else if (i % 3 === 0) {
      answer.push("Fizz");
    } else if (i % 5 === 0) {
      answer.push("Buzz");
    } else {
      answer.push(`${i}`);
    }
  }

  return answer;
};

// Follow up -> String concatenation
fizzBuzz = (n) => {
  // Space: O(n)
  let answer = Array({ length: n });

  // Time: O(n)
  for (let i = 1, idx = 0; i <= n; i++) {
    let cur = "";

    if (i % 3 === 0) {
      cur += "Fizz";
    }
    if (i % 5 === 0) {
      cur += "Buzz";
    }

    answer[idx++] = cur ? cur : `${i}`;
  }

  return answer;
};
