/*
 * - [] Done
 * - [x] Follow up solutions
 *   - the positions of robots are unique but not sorted,
 *     needs sorting by positions, cause the robot fighting by nearest neighbor first
 *
 *   - the neighbor robot with difference direction fighting first,
 *     so one of robot will be removed, one of robot should be decreased by 1,
 *     and survived robot should be added to stack, or keep fighting with other robots,
 *     so using stack
 *
 *   - returns the healths of survived robots,
 *     but need sorting back to original order after we sorting by positions in first step
 */
/**
 * @param {number[]} positions
 * @param {number[]} healths
 * @param {string} directions
 * @return {number[]}
 */

// WIP: Not working Not completed
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

/* Follow up */
/* this approach will using more memory,
 * cause that using stack + extra two dimensions array robots([positions, healths, directions, index][])
 *
 * improvement will using only stack and one dimension array(indices[]) robots in below approach
 */
survivedRobotsHealths = (positions, healths, directions) => {
  // step1: sorting robots by positions
  let robots = [];

  for (let i = 0; i < positions.length; ++i) {
    robots.push([positions[i], healths[i], directions[i], i]);
  }

  robots.sort((a, b) => a[0] - b[0]);

  // step2: using stack
  //
  //   if robot is moving to the right, add it to the stack directly
  //
  //   if robot is moving to the left and last robot in stack moving to right, then fight,
  //      - if current robot's health is greater than last robot's health,
  //
  //        else if last robot's health is greater than current robot's health,
  //
  //        else the both of robot's health is same,
  //
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
          //
          // current robot is survived, but the health should be decreased by 1,
          //
          // remove last robot from stack
          //
          // start iteration next while loop,
          // keep fighting with right direction of robot from stack,
          // until not more robot in stack,
          // then break while loop then current robot will be added to stack
          robot[1] -= 1;
          stack.pop();
        } else if (robot[1] < lastRobotHealth) {
          // if last robot's health is greater than current robot's health,
          // last robot's health should be decreased by 1,
          //
          // current robot is not survived, so do not add current robot to stack,
          // break while loop, start next iteration
          //
          stack[stack.length - 1][1] -= 1;
          add = false;
        } else {
          // if current and last robot's health is same,
          //
          // both of robot should is not survived,
          // 1. remove last robot from
          // 2. do not add current robot to stack
          //
          // break while loop, start next iteration
          stack.pop();
          add = false;
        }
      }

      if (add) {
        stack.push(robot);
      }
    }
  }

  // step3: sorting back by original order and return healths
  stack.sort((a, b) => a[3] - b[3]);

  let result = [];
  for (let robot of stack) {
    result.push(robot[1]);
  }

  // console.log(result);

  return result;
};

/* Follow up */
/* T: O(n logn), S: O(n)*/
survivedRobotsHealths = (positions, healths, directions) => {
  const n = positions.length;

  // Create an array of indices from 0 to n-1
  const indices = Array.from({ length: n }, (_, i) => i);

  // Sort indices based on the positions
  indices.sort((a, b) => positions[a] - positions[b]);

  // Stack to keep track of robots moving to the right
  const stack = [];

  for (const i of indices) {
    // If the robot is moving to the right, add it to the stack
    if (directions[i] === "R") {
      stack.push(i);
      continue;
    }

    // If the robot is moving to the left, handle collisions
    while (stack.length > 0 && healths[i] > 0) {
      const top = stack[stack.length - 1];

      // If the health of the top robot in the stack is less than the current robot's health
      if (healths[top] < healths[i]) {
        // Remove the robot from the stack and decrease the current robot's health by 1
        healths[top] = 0;
        stack.pop();
        healths[i] -= 1;
      } else if (healths[top] > healths[i]) {
        // Decrease the health of the top robot in the stack by 1 and set the current robot's health to 0
        healths[top] -= 1;
        healths[i] = 0;
      } else {
        // If both robots have the same health, remove both from the line
        healths[top] = 0;
        stack.pop();
        healths[i] = 0;
      }
    }
  }

  // Collect the healths of the surviving robots
  return healths.filter((h) => h > 0);
};

survivedRobotsHealths([5, 4, 3, 2, 1], [2, 17, 9, 15, 10], "RRRRR");
survivedRobotsHealths([3, 5, 2, 6], [10, 10, 15, 12], "RLRL");
// survivedRobotsHealths([1, 2, 5, 6], [10, 10, 11, 11], "RLRL");
// survivedRobotsHealths([1, 40], [10, 11], "RL");
// survivedRobotsHealths([3, 47], [46, 26], "LR");
