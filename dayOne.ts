import {ADVENT} from "./utils.ts";


export async function dayOne() {
    const path = Deno.env.get("ADVENT_HOME");
    const text = await Deno.readTextFile(`${path}\\2024\\dayOne\\data.txt`);
    // console.log(text);

    let left: number[] = [];
    let right: number[] = [];

    text.split("\n").forEach((line) => {
        const split  = line.split("  ");
        left.push(Number.parseInt(split[0].trim()));
        right.push(Number.parseInt(split[1].trim()));
    })

    left = left.sort();
    right = right.sort();

    const delta = left.map((l,idx) => Math.abs(l - right[idx])).reduce((a, b) => a + b);
    ADVENT.LOG(delta);

    const freqMap = new Map<number, number>();
    right.forEach((l) => {
        freqMap.set(l, (freqMap.get(l) || 0) + 1);
    });

    const simScore = left.map((l) => l * (freqMap.get(l) || 0)).reduce((a, b) => a + b);
    ADVENT.LOG(simScore);
}
