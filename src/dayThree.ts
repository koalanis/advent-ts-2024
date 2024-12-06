import { AdventContext, getAdventContext } from "./utils.ts";

export async function dayThree() {
  const ADVENT = getAdventContext({ day: 3, year: 2024 });
  let text = await ADVENT.getDataFile();
  text = text.replace("\n", "");
  solvePartOne(text, ADVENT);
  solvePartTwo(text, ADVENT);
}

/**
 * Given a text string, return the sum of the products of matching substrings "mult(xx,yy)" where xx and yy are valid
 * integers
 * @param text
 */
function parseInstrunctionString(text: string): number {
  const regexp = /mul\((\d+),(\d+)\)/g;

  const array = [...text.matchAll(regexp)];

  return array.map((v) => (Number.parseInt(v[1]) * Number.parseInt(v[2])))
    .reduce((a, b) => a + b);
}

function solvePartOne(text: string, ADVENT: AdventContext) {
  const sum = parseInstrunctionString(text);
  ADVENT.reportPartOne(sum);
}

/**
 * Given a text string, return a parsed text string in which invalid substrings are removed. A substring is invalid
 * iff it exists after a substring of "dont'()" and it is not re-enabled by being after a substring of "do()"
 * @param text
 */
function getActiveInstructions(text: string): string {
  let splitOnDonts = text.split(`don't()`);
  const collect = [splitOnDonts[0]];
  for (let i = 1; i < splitOnDonts.length; i++) {
    let splitOnDos = splitOnDonts[i].split("do()");
    for (let j = 1; j < splitOnDos.length; j++) {
      collect.push(splitOnDos[j]);
    }
  }
  return collect.join("");
}

function solvePartTwo(text: string, ADVENT: AdventContext) {
  const metaText = getActiveInstructions(text);
  const sum = parseInstrunctionString(metaText);

  ADVENT.reportPartTwo(sum);
}
