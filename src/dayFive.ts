import { getAdventContext } from "./utils.ts";

/**
 * Given the text data, return the parsed problem data
 * @param lines
 */
function parseData(lines: string[]) {
  const numBeforeMap = new Map<number, Set<number>>();
  const numAfterMap = new Map<number, Set<number>>();
  const updates: number[][] = [];

  let i = 0;
  while (i < lines.length && lines[i] !== "") {
    const ruleOrdering = lines[i].split("|");
    const l = Number.parseInt(ruleOrdering[0]);
    const r = Number.parseInt(ruleOrdering[1]);
    if (!numBeforeMap.has(l)) {
      numBeforeMap.set(l, new Set());
    }
    if (!numAfterMap.has(r)) {
      numAfterMap.set(r, new Set());
    }
    numBeforeMap.get(l)?.add(r);
    numAfterMap.get(r)?.add(l);
    i++;
  }
  i++;
  while (i < lines.length) {
    updates.push(
      lines[i].split(",").map((line) => Number.parseInt(line.trim())),
    );
    i++;
  }
  return { numBeforeMap, numAfterMap, updates };
}

/**
 * Given an update order, return true if the update order is "valid" as in it satifies the ordering
 * hierarchy expressed with the numBeforeMap.
 * @param update
 * @param numBeforeMap
 */
const isCorrectlyOrdered = (
  update: number[],
  numBeforeMap: Map<number, Set<number>>,
): boolean => {
  const seen = new Set<number>();
  for (let i = 0; i < update.length; i++) {
    const at = update[i];
    const shouldBeBefore = numBeforeMap.get(at);
    if (shouldBeBefore !== undefined) {
      if (
        shouldBeBefore.values().map((i) => seen.has(i)).reduce(
          (a, b) => a || b,
          false,
        )
      ) {
        return false;
      }
    }
    seen.add(at);
  }
  return true;
};

/**
 * Given an invalid number sequence, and the expected ordering maps, sort the invalid number sequence into its expected
 * valid order
 * @param invalid
 * @param numAfterMap
 * @param numBeforeMap
 */
const correctUpgradeOrder = (
  invalid: number[],
  numAfterMap: Map<number, Set<number>>,
  numBeforeMap: Map<number, Set<number>>,
): number[] => {
  // find indices of elements that break the ordering rules
  const invalidIdxs: number[] = [];
  for (let i = 0; i < invalid.length; i++) {
    const at = invalid[i];
    if (i == 0) {
      const shouldBeAfter = new Set(numAfterMap.get(at)) || new Set();
      if (shouldBeAfter.intersection(new Set(invalid.slice(1))).size > 0) {
        invalidIdxs.push(i);
      }
    } else if (i == invalid.length - 1) {
      const shouldBeBefore = new Set(numBeforeMap.get(at)) || new Set();
      if (
        shouldBeBefore.intersection(new Set(invalid.slice(0, i))).size > 0
      ) {
        invalidIdxs.push(i);
      }
    } else {
      const shouldBeBefore = new Set(numBeforeMap.get(at)) || new Set();
      if (
        shouldBeBefore.intersection(new Set(invalid.slice(0, i))).size > 0
      ) {
        invalidIdxs.push(i);
        continue;
      }

      const shouldBeAfter = new Set(numAfterMap.get(at)) || new Set();
      if (
        shouldBeAfter.intersection(new Set(invalid.slice(i + 1))).size > 0
      ) {
        invalidIdxs.push(i);
      }
    }
  }

  // sort problematic elements amongst themselves
  const toSort = invalidIdxs.map((i) => invalid[i]);
  let n = toSort.length;
  let swapped = false;
  do {
    swapped = false;
    for (let i = 1; i < n; i++) {
      let a = toSort[i - 1];
      let b = toSort[i];
      if (numAfterMap.get(a)?.has(b)) {
        toSort[i - 1] = b;
        toSort[i] = a;
        swapped = true;
      }
    }
    n--;
  } while (swapped);

  // repopulate upgrade list, putting problematic elements in correct order
  const correctOrder: number[] = [];
  for (let i = 0; i < invalid.length; i++) {
    if (invalidIdxs.includes(i)) {
      const item = toSort.shift();
      if (item) {
        correctOrder.push(item);
      }
    } else {
      correctOrder.push(invalid[i]);
    }
  }
  return correctOrder;
};

/**
 * Given a number sequence _update_, return the middle number
 * @param update
 */
const getMiddlePageNumber = (update: number[]): number => {
  return update[Math.floor(update.length / 2)];
};

/**
 * Given two numbers, return the sum of them
 * Used in reducers
 * @param a
 * @param b
 */
const sum = (a: number, b: number) => a + b;

export async function dayFive() {
  const ADVENT = getAdventContext({ day: 5, year: 2024, debug: true });
  const text = await ADVENT.getDataFile();
  const lines = text.split("\n").map((line) => line.trim());

  const { numBeforeMap, numAfterMap, updates } = parseData(lines);

  const partOne = updates
    .filter((line) => isCorrectlyOrdered(line, numBeforeMap))
    .map(getMiddlePageNumber)
    .reduce(sum);

  ADVENT.reportPartOne(partOne);

  const partTwo = updates
    .filter((i) => !isCorrectlyOrdered(i, numBeforeMap))
    .map((line) => correctUpgradeOrder(line, numAfterMap, numBeforeMap))
    .map(getMiddlePageNumber)
    .reduce(sum);
  ADVENT.reportPartTwo(partTwo);
}
