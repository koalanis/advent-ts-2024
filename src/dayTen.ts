import { getAdventContext } from "./utils.ts";
import { Coor, CoorKey, toCoor, toCoorKey } from "./daySix.ts";

type Grid = number[][];

function toGrid(data: string): Grid {
  return data.trim().split("\n").map((line) =>
    line.trim().split("").map((str) => Number(str))
  );
}

function findTrailheads(grid: Grid): Set<CoorKey> {
  const collect: Set<CoorKey> = new Set();
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === 0) collect.add(toCoorKey([r, c]));
    }
  }
  return collect;
}

function inGrid(grid: Grid, coor: Coor): boolean {
  const rows = grid.length;
  const cols = grid[0].length;
  const [r, c] = coor;
  return 0 <= r && r < rows && 0 <= c && c < cols;
}

function atGrid(grid: Grid, coor: Coor): number {
  return grid[coor[0]][coor[1]];
}

function left(coor: Coor): Coor {
  return [coor[0], coor[1] - 1];
}
function right(coor: Coor): Coor {
  return [coor[0], coor[1] + 1];
}
function up(coor: Coor): Coor {
  return [coor[0] - 1, coor[1]];
}
function down(coor: Coor): Coor {
  return [coor[0] + 1, coor[1]];
}

function searchTrail(grid: Grid, coor: Coor, peakSet: Set<CoorKey>) {
  if (atGrid(grid, coor) === 9) {
    peakSet.add(toCoorKey(coor));
  } else {
    let next = left(coor);
    const canMoveTo = (c: Coor): boolean =>
      inGrid(grid, c) && (atGrid(grid, c) - atGrid(grid, coor) === 1);
    if (canMoveTo(next)) searchTrail(grid, next, peakSet);

    next = right(coor);
    if (canMoveTo(next)) searchTrail(grid, next, peakSet);

    next = up(coor);
    if (canMoveTo(next)) searchTrail(grid, next, peakSet);

    next = down(coor);
    if (canMoveTo(next)) searchTrail(grid, next, peakSet);
  }
}

function searchTrailForPaths(
  grid: Grid,
  coor: Coor,
  path: string,
  pathSet: Set<string>,
) {
  if (atGrid(grid, coor) === 9) {
    pathSet.add(path + toCoorKey(coor));
  } else {
    let next = left(coor);
    const canMoveTo = (c: Coor): boolean =>
      inGrid(grid, c) && (atGrid(grid, c) - atGrid(grid, coor) === 1);
    if (canMoveTo(next)) {
      searchTrailForPaths(grid, next, path + toCoorKey(next), pathSet);
    }

    next = right(coor);
    if (canMoveTo(next)) {
      searchTrailForPaths(grid, next, path + toCoorKey(next), pathSet);
    }

    next = up(coor);
    if (canMoveTo(next)) {
      searchTrailForPaths(grid, next, path + toCoorKey(next), pathSet);
    }

    next = down(coor);
    if (canMoveTo(next)) {
      searchTrailForPaths(grid, next, path + toCoorKey(next), pathSet);
    }
  }
}

function getTrailheadScore(grid: Grid, key: CoorKey): number {
  const foundPeaks: Set<CoorKey> = new Set();
  searchTrail(grid, toCoor(key), foundPeaks);
  return foundPeaks.size;
}

function getTrailheadRating(grid: Grid, key: CoorKey): number {
  const foundPeaks: Set<string> = new Set();
  searchTrailForPaths(grid, toCoor(key), "", foundPeaks);
  return foundPeaks.size;
}

export async function dayTen() {
  const ADVENT = getAdventContext({ day: 10, year: 2024, debug: true });
  const data = await ADVENT.getDataFile();
  const grid = toGrid(data);
  const trailheads = findTrailheads(grid);

  const score = trailheads.values().map((key) => getTrailheadScore(grid, key))
    .reduce((acc, cur) => acc + cur, 0);
  ADVENT.reportPartOne(score);

  const rating = trailheads.values().map((key) => getTrailheadRating(grid, key))
    .reduce((acc, cur) => acc + cur, 0);
  ADVENT.reportPartTwo(rating);
}
