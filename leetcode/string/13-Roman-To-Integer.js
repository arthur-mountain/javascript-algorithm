const main = (str) => {
  const romanMap = {
    "I": 1,
    "V": 5,
    "X": 10,
    "L": 50,
    "C": 100,
    "D": 500,
    "M": 1000,
  };

  return str.split("").reduce((acc, curr, aryIdx, ary) => {
    const v1 = romanMap[curr];
    const v2 = romanMap[ary[aryIdx + 1]];

    if (!v2) return acc > v1 ? acc + v1 : acc;

    if (v2 > v1) return acc + v2 - v1;

    return acc + v1;
  }, 0);
};

console.log("1. Roman To Integer: %s === 9", main("IX"));
console.log("2. Roman To Integer: %s === 3", main("III"));
console.log("3. Roman To Integer: %s === 30", main("XXX"));
console.log("3. Roman To Integer: %s === 33", main("XXXIII"));
console.log("3. Roman To Integer: %s === 88", main("LXXXVIII"));