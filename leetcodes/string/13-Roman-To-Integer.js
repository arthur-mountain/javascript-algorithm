const main = (str) => {
  const romanMap = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };

  let i = 0;
  let result = 0;
  while (true) {
    if (!str[i]) break;

    const v1 = romanMap[str[i]];
    const v2 = romanMap[str[i + 1]];

    if (v2 > v1) {
      result += v2 - v1;
      i++; // subtraction should add additional ++
    } else {
      result += v1;
    }

    i++;
  }

  return result;
};

console.log("2. Roman To Integer: %s === 3", main("III"));
console.log("3. Roman To Integer: %s === 58", main("LVIII"));
console.log("4. Roman To Integer: %s === 1994", main("MCMXCIV"));
