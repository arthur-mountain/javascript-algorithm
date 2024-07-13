/*
 * - [] Done
 * - [] Refer to what others are doing
 */
/**
 * @param {number[]} positions
 * @param {number[]} healths
 * @param {string} directions
 * @return {number[]}
 */

let survivedRobotsHealths = (positions, healths, directions) => {
  // if size is one, all of robot has same directions, just returns healths
  if (new Set(directions).size === 1) {
    return healths;
  }

  // if size is two, only two robots with difference directions,
  // they're not facing each other, just return healths,
  if (positions.length === 2) {
    if (
      positions[0] > positions[1] &&
      directions[0] === "L" &&
      directions[1] === "R"
    ) {
      return healths;
    } else if (
      positions[1] > positions[0] &&
      directions[1] === "R" &&
      directions[0] === "L"
    ) {
      return healths;
    }
  }

  // store robot's health and direction by position using key-value pair
  let robot = new Map();

  for (let i = 0; i < positions.length; i++) {
    robot.set(positions[i], { health: healths[i], direction: directions[i] });
  }

  // find nearest neighbor and compare their healths
  for (const [position, { health, direction }] of robot.entries()) {
    let nearestNeighbor,
      nearestNeighborPosition = position;

    while (!nearestNeighbor) {
      if (direction === "R" && robot.has(++nearestNeighborPosition)) {
        nearestNeighbor = robot.get(nearestNeighborPosition);
        break;
      } else if (direction === "L" && robot.has(--nearestNeighborPosition)) {
        nearestNeighbor = robot.get(nearestNeighborPosition);
        break;
      }
    }

    if (!nearestNeighbor) {
      continue;
    }

    if (nearestNeighbor.direction === direction) {
      continue;
    }

    if (health === nearestNeighbor.health) {
      robot.delete(position);
      robot.delete(nearestNeighborPosition);
      continue;
    }

    if (health > nearestNeighbor.health) {
      robot.delete(nearestNeighborPosition);
      robot.set(position, { health: health - 1, direction });
    } else {
      robot.delete(position);
      robot.set(nearestNeighborPosition, {
        health: nearestNeighbor.health - 1,
        direction,
      });
    }
  }

  return [...robot.values()].map(({ health }) => health);
};

// survivedRobotsHealths([5, 4, 3, 2, 1], [2, 17, 9, 15, 10], "RRRRR");
// survivedRobotsHealths([3, 5, 2, 6], [10, 10, 15, 12], "RLRL");
// survivedRobotsHealths([1, 2, 5, 6], [10, 10, 11, 11], "RLRL");
survivedRobotsHealths([1, 40], [10, 11], "RL");
// survivedRobotsHealths([3, 47], [46, 26], "LR");
