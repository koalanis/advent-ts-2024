import { getAdventContext } from "./utils.ts";

type BinaryFn = (a: number, b: number) => number;
const add: BinaryFn = (a, b) => a + b;
const mult: BinaryFn = (a: number, b: number) => a * b;
const concat: BinaryFn = (a: number, b: number) => Number(`${a}${b}`);

const opMap = {
  "+": add,
  "*": mult,
  "||": concat,
} as const;

type Ops = keyof typeof opMap;

const opListSolve = (elements: number[], ops: Ops[]): number =>
  elements.reduce(
    (prev, curr, index) =>
      index === 0 ? add(prev, curr) : opMap[ops[index - 1]](prev, curr),
    0,
  );

function* opPermutations(size: number, allowedOps: Ops[]) {
  const list: Ops[] = new Array<Ops>(size).fill("+");
  function* gen(list: Ops[], at: number): Generator<Ops[]> {
    if (at == list.length) {
      yield list;
      return;
    }
    for (const key of allowedOps) {
      yield* gen(list.with(at, key), at + 1);
    }
  }

  for (const perm of gen(list, 0)) {
    yield perm;
  }
}

type Equation = {
  total: number;
  elements: number[];
};

type EquationValidator = (eq: Equation) => boolean;

const filterValidAndSum = (eq: Equation[], fn: EquationValidator): number =>
  eq.filter(fn).reduce((p, c) => p + c.total, 0);

const solvableWithOps = (ops: Ops[]): EquationValidator => (eq) => {
  for (const perm of opPermutations(eq.elements.length - 1, ops)) {
    if (opListSolve(eq.elements, perm) == eq.total) return true;
  }
  return false;
};

export async function daySeven() {
  const ADVENT = getAdventContext({ day: 7, year: 2024, debug: true });
  const data = await ADVENT.getDataFile();
  const equations = parseData(data);

  const solveOne = filterValidAndSum(equations, solvableWithOps(["+", "*"]));
  ADVENT.reportPartOne(solveOne);

  const solveTwo = filterValidAndSum(
    equations,
    solvableWithOps(["+", "*", "||"]),
  );
  ADVENT.reportPartOne(solveTwo);
}

function parseData(data: string): Equation[] {
  function parseLine(line: string): Equation {
    const [totalStr, ...rest] = line.trim().split(": ");
    return {
      total: Number.parseInt(totalStr),
      elements: rest[0].split(" ").map(Number),
    };
  }
  return data.split("\n").map(parseLine);
}
