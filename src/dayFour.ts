import { AdventContext, getAdventContext } from "./utils.ts";

export async function dayFour() {
  const ADVENT = getAdventContext({ day: 4, year: 2024 });
  let text = await ADVENT.getDataFile();
  const matrix = toCharMatrix(text);
  solvePartOne(matrix, ADVENT);
  solvePartTwo(matrix, ADVENT);
}

function toCharMatrix(text: string): string[][] {
  return text.split("\n").map((line) => line.split(""));
}

function solvePartOne(matrix: string[][], ADVENT: AdventContext) {
  const inBounds = (i: number, j: number): boolean =>
    0 <= i && i < matrix.length && 0 <= j && j < matrix[i].length;
  type Coor = [number, number];
  const seq = "XMAS";
  const dist = seq.length - 1;
  type Direction = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";
  const DirectionVector: Record<Direction, Coor> = {
    "N": [-1, 0],
    "NE": [-1, 1],
    "E": [0, 1],
    "SE": [1, 1],
    "S": [1, 0],
    "SW": [1, -1],
    "W": [0, -1],
    "NW": [-1, -1],
  };
  type RangeOptions = [boolean, Coor[] | null];
  const getRangeForDirection = (
    d: Direction,
    r: number,
    c: number,
  ): RangeOptions => {
    const vec = DirectionVector[d];
    const rangeValid = inBounds(r + (dist * vec[0]), c + (dist * vec[1]));
    if (!rangeValid) return [false, null];
    const coors: Coor[] = [];
    for (let i = 0; i <= dist; i++) {
      coors.push([r + (i * vec[0]), c + (i * vec[1])]);
    }
    return [true, coors as Coor[]];
  };

  const checkSeqInMatrix = (coords: Coor[]): boolean => {
    for (let i = 0; i < seq.length; i++) {
      const ele = coords[i];
      if (seq[i] !== matrix[ele[0]][ele[1]]) {
        return false;
      }
    }
    return true;
  };

  let count = 0;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === "X") {
        count += Object.keys(DirectionVector).map((key) =>
          getRangeForDirection(key as Direction, i, j)
        )
          .filter((i) =>
            i[0]
          )
          .filter((i) => i[1] != null && checkSeqInMatrix(i[1]))
          .length;
      }
    }
  }

  ADVENT.reportPartOne(count);
}

function solvePartTwo(matrix: string[][], ADVENT: AdventContext) {
  const inBounds = (i: number, j: number): boolean =>
    0 <= i && i < matrix.length && 0 <= j && j < matrix[i].length;
  type Coor = [number, number];

  const checkForXMasX = (i: number, j: number) => {
    const charOptional = (ii: number, jj: number): string | null =>
      inBounds(ii, jj) ? matrix[ii][jj] : null;

    const upLeft = charOptional(i - 1, j - 1);
    if (upLeft == null) return false;

    const upRight = charOptional(i - 1, j + 1);
    if (upRight == null) return false;

    const downLeft = charOptional(i + 1, j - 1);
    if (downLeft == null) return false;

    const downRight = charOptional(i + 1, j + 1);
    if (downRight == null) return false;

    return (
      ((upLeft === "M" && downRight === "S") ||
        (upLeft === "S" && downRight === "M")) &&
      ((upRight === "M" && downLeft === "S") ||
        (upRight === "S" && downLeft === "M"))
    );
  };
  let count = 0;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === "A" && checkForXMasX(i, j)) count++;
    }
  }
  ADVENT.reportPartTwo(count);
}
