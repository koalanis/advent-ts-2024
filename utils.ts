
export const ADVENT = {

    //FIXME: finish impl
    getDataFile: async (day: number, test: boolean = false): Promise<string> => {
        const path = Deno.env.get("ADVENT_HOME");
        return await Deno.readTextFile(`${path}\\2024\\dayOne\\data.txt`);
    },

    //TODO: add more logging to indicate day, part of problem, etc
    // deno-lint-ignore no-explicit-any
    LOG: (...all: any[]) => {
        console.log("ADVENT ====")
        console.log(all);
        console.log("====\n\n")
    },
};
