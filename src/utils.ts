export type AdventContextInput = {
  day: number;
  year: number;
  debug?: boolean;
};

export type AdventContext = AdventContextInput & {
  getDataFile: (isTest?: boolean) => Promise<string>;
  log: typeof console.log;
  reportPartOne: typeof console.log;
  reportPartTwo: typeof console.log;
};

function getDayName(day: number): string {
  if (day == null || day <= 0 || day > 25) {
    throw new Error(`Cannot handle ${day} advent of code day `);
  }
  return `day${day}`;
}

export function getAdventContext({
  day,
  year,
  debug = false,
}: AdventContextInput): AdventContext {
  return {
    day,
    year,
    debug,
    log: (data) => {
      if (debug) {
        console.log("=====");
        console.log(data);
        console.log("=====\n\n");
      }
    },
    getDataFile: async (isTest: boolean = false) => {
      const path = Deno.env.get("ADVENT_HOME");
      const fileName = isTest ? "test" : "data";
      return await Deno.readTextFile(
        `${path}\\${year}\\${getDayName(day)}\\${fileName}.txt`,
      );
    },

    reportPartOne: (data) => {
      console.log(`== Advent ${year} day${day} part 1 ==`);
      console.log(data);
      console.log("=====\n\n");
    },
    reportPartTwo: (data) => {
      console.log(`== Advent ${year} day${day} part 2 ==`);
      console.log(data);
      console.log("=====\n\n");
    },
  };
}
