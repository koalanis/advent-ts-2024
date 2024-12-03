import { getAdventContext } from "./utils.ts";

type ReportOutcome = "safe" | "unsafe";

function checkReport(line: string): ReportOutcome {
  const parsed = line.split(" ");
  let increasing: boolean | null = null;

  for (let i = 1; i < parsed.length; i++) {
    const num = Number.parseInt(parsed[i]);
    // deno-lint-ignore prefer-const
    let prev = Number.parseInt(parsed[i - 1]);
    const delta = num - prev;

    const oldIncreasing: boolean | null = increasing;
    if (delta > 0) increasing = true;
    else if (delta < 0) increasing = false;
    else return "unsafe";

    if (oldIncreasing != null && oldIncreasing !== increasing) {
      return "unsafe";
    }

    if (!(1 <= Math.abs(delta) && Math.abs(delta) <= 3)) return "unsafe";
  }

  return "safe";
}

function checkReportWithSingleReplacement(line: string): ReportOutcome {
  const parsed = line.split(" ");

  for (let i = 0; i < parsed.length; i++) {
    const newString = parsed.slice(0, i).concat(
      parsed.slice(i + 1, parsed.length),
    );
    if (checkReport(newString.join(" ")) === "safe") {
      return "safe";
    }
  }
  return "unsafe";
}

export async function dayTwo() {
  const ADVENT = getAdventContext({ day: 2, year: 2024, debug: true });
  const text = await ADVENT.getDataFile();

  const reportLists = text.split("\n");
  const isSafe = (status: ReportOutcome): boolean => status === "safe";
  // part one
  const out = reportLists
    .map(checkReport)
    .filter(isSafe)
    .length;
  ADVENT.reportPartOne(out);

  // part two
  const checkReportTwo = (line: string): ReportOutcome =>
    isSafe(checkReport(line)) ? "safe" : checkReportWithSingleReplacement(line);
  const out2 = reportLists
    .map(checkReportTwo)
    .filter(isSafe)
    .length;
  ADVENT.reportPartTwo(out2);
}
