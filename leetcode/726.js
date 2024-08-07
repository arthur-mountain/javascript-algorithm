/*
 * - [x] Done
 * - [] Follow up solutions
 */
/**
 * @param {string} formula
 * @return {string}
 */
let countOfAtoms = (formula) => {
  // save atom string to stack,
  // until find the number after atom, then pop from stack,
  // if two uppercase character concatenated together, the count is 1
  //
  // if find open bracket, save the open bracket to stack,
  // save atom string to stack until,
  // find the number after atom, then pop from stack,
  // if pop atom is character not bracket, then add count to atom
  // until find the open bracket
  //
  // ideal follow up:
  //  reverse the split formula as stack self without additional O(n) stack

  formula = formula.split("");
  let stack = [];
  let char, code;
  let isUpper = (code) => code >= 65 && code <= 90;
  let isLower = (code) => code >= 97 && code <= 122;
  let isNumber = (code) => code >= 48 && code <= 57;

  for (let i = 0; i < formula.length; i++) {
    char = formula[i];
    code = char.charCodeAt(0);

    if (isUpper(code)) {
      stack.push([char, 1]);
    } else if (isLower(code)) {
      stack[stack.length - 1][0] += char;
    } else if (isNumber(code)) {
      stack[stack.length - 1][1] = char;
      while (formula[i + 1] && isNumber(formula[i + 1].charCodeAt(0))) {
        stack[stack.length - 1][1] += formula[++i];
      }
      stack[stack.length - 1][1] = +stack[stack.length - 1][1];
    } else if (char === "(") {
      stack.push([char, -1]);
    } else if (char === ")") {
      let temp = {};

      while ((char = stack.pop())) {
        if (!char) break;
        if (char[0] === "(") {
          stack.push(char);
          break;
        }
        temp[char[0]] = (temp[char[0]] || 0) + char[1];
      }

      Object.entries(temp).forEach(([key, value]) => {
        stack.push([key, value]);
      });

      let l = stack.length;
      let nextCount = 1;
      if (formula[i + 1] && isNumber(formula[i + 1].charCodeAt(0))) {
        nextCount = formula[++i];
        while (formula[i + 1] && isNumber(formula[i + 1].charCodeAt(0))) {
          nextCount += formula[++i];
        }
        nextCount = +nextCount;
      }

      while (stack[--l][0] !== "(") {
        stack[l][1] *= nextCount;
      }

      // remove open bracket
      stack.splice(l, 1);
    }
  }

  let result = {};

  stack.forEach(([key, value]) => {
    result[key] = (result[key] || 0) + value;
  });

  return Object.entries(result)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map((a) => (a[1] === 1 ? a[0] : a.join("")))
    .join("");
};

/* follow up:
 *  1. Use regex check char type, memory usage is better
 *  2. Reduce string combine operation
 *  3. Reduce close bracket operation that added each item using while+entries
 * */
countOfAtoms = (formula) => {
  let charReg = /[A-Za-z]/;
  let upperReg = /^[A-Z]/;
  let lowerReg = /^[a-z]/;
  let numberReg = /^\d/;
  let i = 0,
    j = 0,
    n = formula.length,
    str = "",
    stack = [],
    result = {},
    pstack = [];

  while (i < n) {
    j = i;
    str = formula[i];

    if (str === "(") {
      pstack.push({});
      i++;
      continue;
    }

    if (str === ")") {
      let counterStr = "";
      let target = pstack.pop();

      while (formula[j + 1] && numberReg.test(formula[j + 1])) {
        ++j;
      }

      counterStr = +formula.substring(i, j + 0);
      for (const key of Object.keys(target)) {
        result[key] += target[key] *= counterStr;
      }
      i = j + 1;
      continue;
    }

    let tempStr = "";
    let counterStr = "";
    let target = pstack.length ? pstack[pstack.length - 1] : result;

    while (formula[j + 1] && charReg.test(formula[j + 1])) {
      if (lowerReg.test(formula[j + 1])) {
        ++j;
      } else {
        tempStr = formula.substring(i, j + 1);
        break;
      }
    }

    while (formula[j + 1] && numberReg.test(formula[j + 1])) {
      ++j;
    }

    counterStr = +formula.substring(i + tempStr.length, j + 1);

    target[tempStr] = (target[tempStr] || 0) + counterStr;
    i = j + 1;
  }

  console.log(result);

  // console.log(
  //   Object.keys(result)
  //     .toSorted()
  //     .map((key) => key + (result[key] || ""))
  //     .join(""),
  // );

  return Object.keys(result)
    .sort()
    .map((key) => key + (result[key] || ""))
    .join("");

  // stack.forEach(([key, value]) => {
  //   result[key] = (result[key] || 0) + value;
  // });
  //
  // return Object.entries(result)
  //   .sort((a, b) => a[0].localeCompare(b[0]))
  //   .map((a) => (a[1] === 1 ? a[0] : a.join("")))
  //   .join("");
  //
  // while (i < n) {
  //   j = i;
  //   str = formula[i];
  //
  //   if (upperReg.test(str)) {
  //     while (formula[j + 1] && lowerReg.test(formula[j + 1])) {
  //       ++j;
  //     }
  //     stack.push([formula.substring(i, j + 1), 1]);
  //   } else if (numberReg.test(str)) {
  //     while (formula[j + 1] && numberReg.test(formula[j + 1])) {
  //       ++j;
  //     }
  //     stack[stack.length - 1][1] = +formula.substring(i, j + 1);
  //   } else if (str === "(") {
  //     stack.push([str, -1]);
  //   } else if (str === ")") {
  //     let temp = {};
  //
  //     while ((str = stack.pop())) {
  //       if (!str) break;
  //       if (str[0] === "(") {
  //         stack.push(str);
  //         break;
  //       }
  //       temp[str[0]] = (temp[str[0]] || 0) + str[1];
  //     }
  //
  //     Object.entries(temp).forEach(([key, value]) => {
  //       stack.push([key, value]);
  //     });
  //
  //     while (formula[j + 1] && numberReg.test(formula[j + 1])) {
  //       ++j;
  //     }
  //
  //     let l = stack.length;
  //     let nextCount = j > i ? +formula.substring(i + 1, j + 1) : 1;
  //
  //     while (stack[--l][0] !== "(") {
  //       stack[l][1] *= nextCount;
  //     }
  //
  //     // remove open bracket
  //     stack.splice(l, 1);
  //   }
  //
  //   i = j + 1;
  // }
  //
  // result = {};
  //
  // stack.forEach(([key, value]) => {
  //   result[key] = (result[key] || 0) + value;
  // });
  //
  // return Object.entries(result)
  //   .sort((a, b) => a[0].localeCompare(b[0]))
  //   .map((a) => (a[1] === 1 ? a[0] : a.join("")))
  //   .join("");
};

const assert = require("node:assert");
assert.deepStrictEqual(countOfAtoms("H2O"), "H2O");
assert.deepStrictEqual(countOfAtoms("Mg(OH)2"), "H2MgO2");
assert.deepStrictEqual(countOfAtoms("Mg5(OH)2"), "H2Mg5O2");
assert.deepStrictEqual(countOfAtoms("K4(ON(SO3)2)2"), "K4N2O14S4");
assert.deepStrictEqual(countOfAtoms("Mg5(OH)(AC)5"), "A5C5HMg5O");
assert.deepStrictEqual(countOfAtoms("Be32"), "Be32");
assert.deepStrictEqual(countOfAtoms("Be3255"), "Be3255");
assert.deepStrictEqual(countOfAtoms("Be32(AC)55"), "A55Be32C55");
assert.deepStrictEqual(countOfAtoms("Be32(AC)5"), "A5Be32C5");
assert.deepStrictEqual(
  countOfAtoms("H11He49NO35B7N46Li20"),
  "B7H11He49Li20N47O35",
);
assert.deepStrictEqual(
  countOfAtoms("(B2O39He17BeBe49)39"),
  "B78Be1950He663O1521",
);
assert.deepStrictEqual(countOfAtoms("Mg(H2O)"), "H2MgO");
