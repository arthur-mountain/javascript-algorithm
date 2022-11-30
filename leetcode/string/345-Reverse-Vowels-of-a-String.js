const main = (s) => {
  const sAry = s.split("");
  const isVowel = v => /^[aeiou]$/i.test(v);

  const vowels = sAry.filter(isVowel);
  let vowelIdx = vowels.length - 1;

  return sAry.map(s => isVowel(s) ? vowels[vowelIdx--] : s).join("");
};

console.log("1. Reverse Vowels of a string: ", main("hello"));
console.log("2. Reverse Vowels of a string: ", main("leetcode"));
console.log("3. Reverse Vowels of a string: ", main("nice"));