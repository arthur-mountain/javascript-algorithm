/*
 * - [x] Done
 * - [x] Refer to what others are doing
 *   - The solutions seems same our approach
 */
/**
 * @param {string[]} logs
 * @return {number}
 */
let minOperations = (logs) => {
  let stack = [];

  for (let i = 0; i < logs.length; i++) {
    if (logs[i] === "../") {
      stack.pop();
    } else if (logs[i] === "./") {
    } else {
      stack.push(logs[i]);
    }
  }

  return stack.length;
};

minOperations = (logs) => {
  let depth = 0;

  for (let i = 0; i < logs.length; i++) {
    if (logs[i] === "./") continue;

    if (logs[i] === "../") {
      if (depth > 0) depth--;
    } else {
      depth++;
    }
  }

  return depth < 0 ? 0 : depth;
};

minOperations(["d1/", "d2/", "../", "d21/", "./"]);
minOperations(["d1/", "d2/", "./", "d3/", "../", "d31/"]);
minOperations(["d1/", "../", "../", "../"]);
minOperations(["./", "../", "./"]);
minOperations(["./", "wz4/", "../", "mj2/", "../", "../", "ik0/", "il7/"]);
