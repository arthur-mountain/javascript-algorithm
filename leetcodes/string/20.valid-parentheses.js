/**
 * @param {string} s
 * @return {boolean}
 */
const isValid = (s) => {
  const stack = [];
  const array = s.split("");
  const map = {
    "{": "}",
    "[": "]",
    "(": ")",
  };

  for (let index = 0; index < array.length; index++) {
    const brackets = array[index];
    const closeBrackets = map[brackets];

    if (closeBrackets) {
      stack.push(closeBrackets);
    } else {
      // Brackets is not closed return false
      if (stack.pop() !== brackets) return false;
    }
  }

  return stack.length === 0;
};

console.log("expect recevied true, recevied: ", isValid("()"));
console.log("expect recevied true, recevied: ", isValid("()[]{}"));
console.log("expect recevied false, recevied: ", isValid("(]"));
