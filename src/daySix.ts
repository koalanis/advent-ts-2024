import { getAdventContext } from "./utils.ts";

export type Coor = [number, number];
export type CoorKey = `(${number},${number})`;
type Dir = "N" | "E" | "S" | "W";
type CoorDirKey = `(${number},${number},${Dir})`;

export function toCoorKey(coor: Coor): CoorKey {
  return `(${coor[0]},${coor[1]})`;
}

export function toCoor(coorKey: CoorKey): Coor {
  const data = coorKey.slice(1, coorKey.length - 1).split(",").map((n) => {
    return Number.parseInt(n);
  });
  return [data[0], data[1]];
}

function toCoorDirKey(coor: Coor, dir: Dir): CoorDirKey {
  return `(${coor[0]},${coor[1]},${dir})`;
}

type SimState = {
  height: number;
  width: number;
  obstacles: Set<CoorKey>;
  path: Set<CoorKey>;
  direction: Dir;
  moves: number;
  startingLocation: Coor;
  currentLocation: Coor;
};

type SimStateWithLoops = SimState & {
  moments: Set<CoorDirKey>;
  count: number;
};

export async function daySix() {
  const ADVENT = getAdventContext({ day: 6, year: 2024, debug: true });
  const text = await ADVENT.getDataFile();
  // console.log(text);

  const state = parseSimState(text);
  simulate(state);
  ADVENT.reportPartOne(state.path.size);

  const stateWithLoops: SimStateWithLoops = {
    ...state,
    moments: new Set<CoorDirKey>(),
    count: 0,
  };

  simulateLoopCheck(stateWithLoops);
  ADVENT.reportPartTwo(stateWithLoops.count);
}

function parseSimState(text: string): SimState {
  const rows = text.split("\n");
  let height = rows.length;
  let width = rows[0].length;
  const obstacles = new Set<CoorKey>();
  let startingLocation: Coor = [0, 0];
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[i].length; j++) {
      const cell = rows[i][j];
      if (cell === "#") obstacles.add(toCoorKey([i, j]));
      else if (cell === "^") startingLocation = [i, j];
    }
  }
  return {
    width,
    height,
    obstacles,
    startingLocation,
    currentLocation: startingLocation,
    moves: 0,
    direction: "N",
    path: new Set<CoorKey>(),
  };
}

function validateState(state: SimState): boolean {
  return 0 <= state.currentLocation[0] &&
    state.currentLocation[0] < state.height &&
    0 <= state.currentLocation[1] && state.currentLocation[1] < state.width;
}

function add(a: Coor, b: Coor): Coor {
  return [a[0] + b[0], a[1] + b[1]];
}

function turnRight90Degrees(state: SimState): void {
  switch (state.direction) {
    case "N":
      state.direction = "E";
      break;
    case "E":
      state.direction = "S";
      break;
    case "S":
      state.direction = "W";
      break;
    case "W":
      state.direction = "N";
      break;
  }
}

function dirVector(dir: Dir): Coor {
  switch (dir) {
    case "N":
      return [-1, 0];
    case "E":
      return [0, 1];
    case "S":
      return [1, 0];
    case "W":
      return [0, -1];
  }
}

function forwardCoor(state: SimState): Coor {
  return add(state.currentLocation, dirVector(state.direction));
}

function simulate(state: SimState): void {
  state.currentLocation = state.startingLocation;
  while (validateState(state)) {
    const next = forwardCoor(state);
    if (state.obstacles.has(toCoorKey(next))) {
      turnRight90Degrees(state);
    } else {
      state.path.add(toCoorKey(state.currentLocation));
      state.currentLocation = next;
    }
  }
}

function isInLoop(state: SimStateWithLoops): boolean {
  const currentMoment = toCoorDirKey(state.currentLocation, state.direction);
  return state.moments.has(currentMoment);
}

function simulateLoopCheck(state: SimStateWithLoops): void {
  const placesToAddNewObstacle = new Set(state.path.values());
  state.count = 0;
  placesToAddNewObstacle.forEach((newObstacle) => {
    state.currentLocation = state.startingLocation;
    state.direction = "N";
    state.moments.clear();

    state.obstacles.add(newObstacle);
    let run = true;
    while (validateState(state) && run) {
      const next = forwardCoor(state);
      if (state.obstacles.has(toCoorKey(next))) {
        turnRight90Degrees(state);
      } else {
        const nextCoorDirKey = toCoorDirKey(
          state.currentLocation,
          state.direction,
        );
        if (state.moments.has(nextCoorDirKey)) {
          state.count += 1;
          run = false;
        } else {
          state.moments.add(
            toCoorDirKey(state.currentLocation, state.direction),
          );
          state.currentLocation = next;
        }
      }
    }
    state.obstacles.delete(newObstacle);
  });
}
