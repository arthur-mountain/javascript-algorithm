/**
 * @param {number[][]} image
 * @param {number} sr
 * @param {number} sc
 * @param {number} color
 * @return {number[][]}
 */
var floodFill = function (image, sr, sc, color) {
  const row = image.length;
  const col = image[0].length;
  const start = image[sr][sc];
  const queue = [sr, sc];
  const visited = new Set();

  while (queue.length > 0) {
    const cr = queue.shift();
    const cl = queue.shift();
    const key = `${cr}-${cl}`;

    if (
      visited.has(key) ||
      cr < 0 ||
      cr >= row ||
      cl < 0 ||
      cl >= col ||
      image[cr][cl] !== start
    ) {
      continue;
    }

    visited.add(key);
    image[cr][cl] = color;
    queue.push(cr - 1, cl); // 上
    queue.push(cr, cl + 1); // 右
    queue.push(cr + 1, cl); // 下
    queue.push(cr, cl - 1); // 左
  }

  return image;
};
