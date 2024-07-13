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

/* refer answer */
survivedRobotsHealths = (positions, healths, directions) => {
  let robots = [];

  for (let i = 0; i < positions.length; ++i) {
    robots.push([positions[i], healths[i], directions[i], i]);
  }

  robots.sort((a, b) => a[0] - b[0]);

  // console.log(robots, "\n");

  let stack = [];

  for (let robot of robots) {
    if (
      robot[2] === "R" ||
      stack.length === 0 ||
      stack[stack.length - 1][2] === "L"
    ) {
      stack.push(robot);
      continue;
    }

    if (robot[2] === "L") {
      let add = true;
      while (stack.length > 0 && stack[stack.length - 1][2] === "R" && add) {
        let lastRobotHealth = stack[stack.length - 1][1];

        if (robot[1] > lastRobotHealth) {
          // if current robot's health is greater than last robot's health
          // current robot's health should be decreased by 1, remove last robot from stack
          stack.pop();
          robot[1] -= 1;
        } else if (robot[1] < lastRobotHealth) {
          // if last robot's health is greater than current robot's health,
          // last  robot's health should be decreased by 1, do not add current robot to stack
          stack[stack.length - 1][1] -= 1;
          add = false;
        } else {
          // if current and last robot's health is same,
          // remove last robot, and do not add current robot to stack
          stack.pop();
          add = false;
        }
      }

      if (add) {
        stack.push(robot);
      }
    }
  }

  stack.sort((a, b) => a[3] - b[3]);

  let result = [];
  for (let robot of stack) {
    result.push(robot[1]);
  }

  // console.log(result);

  return result;
};

survivedRobotsHealths([5, 4, 3, 2, 1], [2, 17, 9, 15, 10], "RRRRR");
survivedRobotsHealths([3, 5, 2, 6], [10, 10, 15, 12], "RLRL");
survivedRobotsHealths([1, 2, 5, 6], [10, 10, 11, 11], "RLRL");
survivedRobotsHealths([1, 40], [10, 11], "RL");
survivedRobotsHealths([3, 47], [46, 26], "LR");
