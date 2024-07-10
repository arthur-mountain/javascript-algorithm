/*
 * - [x] Done
 * - [] Refer to what others are doing
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

minOperations(["d1/", "d2/", "../", "d21/", "./"]);
minOperations(["d1/", "d2/", "./", "d3/", "../", "d31/"]);
minOperations(["d1/", "../", "../", "../"]);
minOperations(["./", "../", "./"]);
minOperations(["./", "wz4/", "../", "mj2/", "../", "../", "ik0/", "il7/"]);
