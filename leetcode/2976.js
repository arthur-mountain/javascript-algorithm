/*
 * - [] Done
 * - [] Follow up solutions
 */
/**
 * @param {string} source
 * @param {string} target
 * @param {character[]} original
 * @param {character[]} changed
 * @param {number[]} cost
 * @return {number}
 */
let minimumCost = (source, target, original, changed, cost) => {
  /*
   * using minimum cost to convert source to target,
   * depends on original and changed and cost,
   * the original[i] can be changed[i] with cost[i].
   *
   * 1. convert the original and changed and cost to a hashmap
   *    { original[i]: [[changed[i], cost[i]]] }
   *
   * 2. iterate the source string, and compare with target,
   *    if source[i] is equal to target[i], then continue
   *
   *    if source[i] can not be founded at the hashmap then return -1
   *       cause they can not possible to be converted
   *
   *    min default is Infinity,
   *    iterate the converted map from haspmap.get(source[i]),
   *     if changed cost greater than min then continue
   *       cause they can not be the minimum cost
   *     else if changed key is equal to target[i] then redefine the minimum cost
   *
   *     iterate nested convert path, and founded the minimum cost
   *     e.g. c-> b,
   *       we have c -> b with 5 cost,
   *       but we also have c -> e -> b with 3 cost.
   * */

  let map = new Map();
  for (let i = 0; i < original.length; i++) {
    if (original[i] !== changed[i]) {
      const value = map.get(original[i]) || [];
      value.push([changed[i], cost[i]]);
      map.set(original[i], value);
    }
  }

  console.log(map);

  const foundMinCost = (
    currentCost,
    targetStr,
    subArr,
    visitedSet,
    accCost,
  ) => {
    if (!subArr) return Infinity;

    for (const [changedKey, changedCost] of subArr) {
      if (visitedSet.has(changedKey)) continue;

      if (changedCost > currentCost) continue;

      if (changedCost > currentCost) return Infinity;

      if ((accCost += changedCost) > currentCost) return Infinity;

      if (changedKey === targetStr) {
        return accCost;
      }
      visitedSet.add(changedKey);
      return foundMinCost(
        currentCost,
        targetStr,
        map.get(changedKey),
        visitedSet,
        accCost,
      );
    }
  };

  let totalCost = 0;
  for (let i = 0; i < source.length; i++) {
    if (source[i] === target[i]) continue;

    const changedArr = map.get(source[i]);
    if (!changedArr) return -1;

    let min = Infinity;
    for (let j = 0; j < changedArr.length; j++) {
      const [changedKey, changedCost] = changedArr[j];

      if (changedCost > min) continue;

      if (changedKey === target[i]) {
        min = Math.min(min, changedCost);
        continue;
      }

      console.log(
        i,
        source[i],
        target[i],
        changedKey,
        map.get(changedKey),
        changedCost,
      );

      min = Math.min(
        min,
        foundMinCost(
          min,
          target[i],
          map.get(changedKey),
          new Set(source[i], changedKey),
          changedCost,
        ),
      );
    }

    totalCost += min;
  }

  console.log(totalCost);
  return totalCost;
};

// minimumCost(
//   "abcd",
//   "acbe",
//   ["a", "b", "c", "c", "e", "d"],
//   ["b", "c", "b", "e", "b", "e"],
//   [2, 5, 5, 1, 2, 20],
// );

// minimumCost("aaaa", "bbbb", ["a", "c"], ["c", "b"], [1, 2]);
//
// minimumCost("abcd", "abce", ["a"], ["e"], [10000]);
//
minimumCost(
  "aaaabadaaa",
  "dbdadddbad",
  ["c", "a", "c", "a", "a", "b", "b", "b", "d", "d", "c"],
  ["a", "c", "b", "d", "b", "c", "a", "d", "c", "b", "d"],
  [7, 8, 11, 9, 7, 6, 4, 6, 9, 5, 9],
);
