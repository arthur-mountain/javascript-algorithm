const main = (str) => {
  // method 1:
  // return str.split("").reverse().join("");

  // method 2:
  const strAry = str.split("");

  for (let i = 0, max = (strAry.length - 1) / 2; i < max; i++) {
    const idxFromEnd = strAry.length - 1 - i;

    let temp = strAry[i];

    strAry[i] = strAry[idxFromEnd];
    strAry[idxFromEnd] = temp;
  }

  return strAry.join("");
};

console.log("Reverse string: ", main("hello"));