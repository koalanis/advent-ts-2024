import { ADVENT } from "./utils.ts";

type ReportOutcome = "safe" | "unsafe";
function checkReport(line: string): ReportOutcome {
    const parsed = line.split(" ");
    let increasing: boolean | null = null;

    for (let i = 1; i < parsed.length; i++) {
        let num = Number.parseInt(parsed[i]);
        // deno-lint-ignore prefer-const
        let prev = Number.parseInt(parsed[i - 1]);
        let delta = num - prev;

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

function checkReportTwo(line: string): ReportOutcome {
    const parsed = line.split(" ");

    for(let i = 0; i < parsed.length; i++) {
        const newString = parsed.slice(0, i).concat(parsed.slice(i+1, parsed.length));
        if(checkReport(newString.join(" ")) === 'safe') {
            return 'safe'
        }
    }
    return "unsafe";
}

export async function dayTwo() {
    //TODO: Refactor to use utils
    const path = Deno.env.get("ADVENT_HOME");
    const text = await Deno.readTextFile(`${path}\\2024\\dayTwo\\data.txt`);
    const out = text.split("\n").map((line: string) => checkReport(line))
        .filter((status) => status == "safe")
        .length

    ADVENT.LOG(out);

    const out2 = text.split("\n")
        .map((line: string) => {
            if(checkReport(line) === "safe") {
                return "safe";
            }
            return checkReportTwo(line);
        })
        .filter((status) => status == "safe")
        .length

    ADVENT.LOG(out2);
}
