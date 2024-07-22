/*
 * - [x] Done
 * - [x] Refer to what others are doing
 */
/**
 * @param {string[]} names
 * @param {number[]} heights
 * @return {string[]}
 */
let sortPeople = (names, heights) => {
  return [...new Map(heights.map((h, i) => [h, names[i]])).entries()]
    .sort((a, b) => b[0] - a[0])
    .map((entry) => entry[1]);
};

sortPeople = (names, heights) => {
  let map = {};

  for (let i = 0, len = heights.length; i < len; i++) {
    map[heights[i]] = names[i];
  }

  return Object.keys(map)
    .sort((a, b) => b - a)
    .map((key) => map[key]);
};

/* refer answer*/
sortPeople = (names, heights) => {
  return names
    .map((name, i) => ({ name, height: heights[i] }))
    .sort((a, b) => b.height - a.height)
    .map(({ name }) => name);
};

sortPeople(["Mary", "John", "Emma"], [180, 165, 170]);
