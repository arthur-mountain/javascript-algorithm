const main = (s, t) => {
  if (s.length !== t.length) return false;

  const mapS = new Map();
  const mapT = new Map();

  for (const idx in s) {
    const valueS = s[idx];
    const valueT = t[idx];

    if (!mapS.get(valueS)) mapS.set(valueS, valueT);
    if (!mapT.get(valueT)) mapT.set(valueT, valueS);

    if (mapS.get(valueS) !== valueT || mapT.get(valueT) !== valueS) {
      return false;
    }
  };

  return true;
};

console.log("1. Isomorphic string: ", main("egg", "add"));
console.log("2. Isomorphic string: ", main("foo", "bar"));
console.log("3. Isomorphic string: ", main("paper", "title"));