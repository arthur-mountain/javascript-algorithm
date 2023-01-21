const main = (pattern, str) => {
  const pAry = pattern.split("");
  const sAry = str.split(/\s/);

  if (pAry.length !== sAry.length) return false;

  const map = new Map();

  for (const idx in pAry) {
    const p = pAry[idx];
    const s = sAry[idx];
    const v = map.get(p);

    if (!v) {
      map.set(p, s);
    } else if (v !== s) {
      return false;
    }
  }

  return true;
};

console.log("1. Word Pattern: ", main("abba", "dog cat cat dog"));
console.log("2. Word Pattern: ", main("abba", "dog cat cat fish"));
console.log("3. Word Pattern: ", main("aaaa", "dog cat cat dog"));
console.log("4. Word Pattern: ", main("aaaa", "dog dog dog dog"));