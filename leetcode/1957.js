/*
 * Status:
 *  - [x] Done
 *  - [x] Follow up solutions
 *
 * Title: 957. Delete Characters to Make Fancy String
 *
 * Topics:
 *  String
 *
 * Statements:
 *   Remove minimum number of characters from s,
 *   to make no three or more consecutive characters in s.
 *
 * Thoughts:
 *   create the current char, current count var,
 *
 *   Iterate the string as str,
 *   if no current char, set it to str and count to 1
 *   if the current char is diff than str, set the current char to str and count to 1
 *   if the current char is the same as str and the count is less than 2, increase the count
 *   else remove the char from string
 **/
/**
 * @param {string} s
 * @return {string}
 */
let makeFancyString = (s) => {
  let currentChar = "";
  let currentCount = 0;
  s = s.split("");

  // This will reach TLE
  // for (let i = 0, len = s.length; i < len; i++) {
  //   if (currentChar !== s[i]) {
  //     currentChar = s[i];
  //     currentCount = 1;
  //   } else if (currentCount < 2) {
  //     currentCount++;
  //   } else {
  //     s.splice(i, 1);
  //     i--;
  //   }
  // }
  // return s.join("");

  // Same idea but using built-in filter
  // Time: O(n + n + n) = O(n) -> split + filter + join
  // Space: O(n) -> filter will create a new array
  return s
    .filter((str) => {
      if (currentChar !== str) {
        currentChar = str;
        currentCount = 1;
        return 1;
      } else if (currentCount < 2) {
        currentCount++;
        return 1;
      } else {
        return 0;
      }
    })
    .join("");
};

/**
 * follow up solution
 * Time: O(n) -> iterate string s
 * Space: O(n) -> create new string res
 **/
makeFancyString = (s) => {
  let res = "";
  let cur = "";
  let count = 0;

  for (const str of s) {
    if (cur === str) {
      count++;
    } else {
      cur = str;
      count = 1;
    }

    if (count < 3) {
      res += str;
    }
  }

  return res;
};
