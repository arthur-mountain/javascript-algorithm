/*
 * - [x] Done
 *   - the inside string of parentheses will be reversed first
 *   - and then the outside string of parentheses will be reversed
 *   - finally, return the reversed string
 * - [] Refer to what others are doing
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
