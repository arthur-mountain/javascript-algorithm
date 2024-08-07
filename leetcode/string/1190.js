/* Need more practice */

/* my approach this will using O(n^2) need to improve*/

/*
 * - [x] Done
 *   - the inside string of parentheses will be reversed first
 *   - and then the outside string of parentheses will be reversed
 *   - finally, return the reversed string
 * - [] Follow up solutions
 */
/**
 * @param {string} s
 * @return {string}
 */
let reverseParentheses = (s) => {
  const helper = (s) => {
    let str = "";
    let char = "";

    while (s.length) {
      char = s.shift();

      if (char === "(") {
        str += helper(s);
      } else if (char === ")") {
        return str.split("").reverse().join("");
      } else {
        str += char;
      }
    }

    return str;
  };

  return helper(s.split(""));
};

// TODO: using stack
reverseParentheses = (s) => {
  // let stack = [];
};

reverseParentheses("(abcd)");
reverseParentheses("(u(love)i)");
reverseParentheses("(ed(et(oc))el)");
