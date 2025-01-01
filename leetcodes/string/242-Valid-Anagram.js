const main = (s, t) => {
  if (s.length !== t.length) return false;
  
  const orderStr = s => s.split("").sort().join("");

  return orderStr(s) === orderStr(t);
};

console.log("1. Valid Anagram: ", main("anagram", "nagaram"));
console.log("2. Valid Anagram: ", main("rat", "car"));