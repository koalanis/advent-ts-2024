import {AdventContext, getAdventContext} from "./utils.ts";
import { Coor, CoorKey, toCoor, toCoorKey } from "./daySix.ts";

type State = {
  rows: number;
  columns: number;
  antennas: Map<string, Set<CoorKey>>;
};

function addCoorToMap(map: Map<string, Set<CoorKey>>, ch: string, coor: Coor) {
  if (!map.has(ch)) {
    map.set(ch, new Set());
  }
  map.get(ch)?.add(toCoorKey(coor));
}

function parseDataForState(data: string): State {
  let rowsSize = 0;
  let columnsSize = 0;
  let map: Map<string, Set<CoorKey>> = new Map();

  const rowList = data.trim().split("\n");
  rowsSize = rowList.length;
  columnsSize = rowList[0].trim().length;

  rowList
    .forEach((line, rowIdx) => {
      line.trim()
        .split("")
        .forEach((ch, cellIdx) => {
          if (ch !== ".") addCoorToMap(map, ch, [rowIdx, cellIdx]);
        });
    });

  return {
    rows: rowsSize,
    columns: columnsSize,
    antennas: map,
  };
}

function difference(a: Coor, b: Coor): Coor {
  return [a[0] - b[0], a[1] - b[1]];
}

function scale(v: Coor, s: number): Coor {
  return [s * v[0], s * v[1]];
}

function add(a: Coor, b: Coor): Coor {
  return [a[0] + b[0], a[1] + b[1]];
}

function inBounds(c: Coor, rows: number, cols: number): boolean {
  return 0 <= c[0] && c[0] < rows && 0 <= c[1] && c[1] < cols;
}

function findAntinodes(state: State, wave?: boolean): Set<CoorKey> {
  let antinodes: Set<CoorKey> = new Set();

  state.antennas.forEach((value, key) => {
    const l = Array.from(value);
    for (let i = 0; i < l.length; ++i) {
      for (let j = i + 1; j < l.length; ++j) {
        const a = toCoor(l[i]);
        const b = toCoor(l[j]);
        const diff = difference(b, a);

        if (wave === undefined || wave === false) {
          let nodeA = difference(a, diff);
          let nodeB = add(b, diff);
          if (inBounds(nodeA, state.rows, state.columns)) {
            antinodes.add(toCoorKey(nodeA));
          }
          if (inBounds(nodeB, state.rows, state.columns)) {
            antinodes.add(toCoorKey(nodeB));
          }
        } else {
          let nodeA = a;
          let nodeB = b;
          while (inBounds(nodeA, state.rows, state.columns)) {
            antinodes.add(toCoorKey(nodeA));
            nodeA = difference(nodeA, diff);
          }
          while (inBounds(nodeB, state.rows, state.columns)) {
            antinodes.add(toCoorKey(nodeB));
            nodeB = add(nodeB, diff);
          }
        }
      }
    }
  });
  return antinodes;
}

function printState(advent: AdventContext, state: State, antinodes?: Set<CoorKey>) {
  let data = "";
  for (let i = 0; i < state.rows; ++i) {
    let line = "";
    for (let j = 0; j < state.columns; ++j) {
      const coor: Coor = [i, j];
      let found = false;
      for (const [key, v] of state.antennas.entries()) {
        if (v.has(toCoorKey(coor))) {
          line += key;
          found = true;
          continue;
        }
      }
      if (found) continue;
      if (antinodes?.has(toCoorKey(coor))) {
        line += "#";
        continue;
      }
      line += ".";
    }
    data += line + "\n";
  }
  advent.log(data);
}

export async function dayEight() {
  const ADVENT = getAdventContext({ day: 8, year: 2024, debug: true });
  const data = await ADVENT.getDataFile();
  const stuff = parseDataForState(data);
  const first = findAntinodes(stuff);
  ADVENT.reportPartOne(first.size);

  const second = findAntinodes(stuff, true);
  ADVENT.reportPartTwo(second.size);
}
