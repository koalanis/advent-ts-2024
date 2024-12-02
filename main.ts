import {dayOne} from './dayOne.ts';
import {dayTwo} from "./dayTwo.ts";

async function main() {
  await dayOne();
  await dayTwo();
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  main().then(() => console.log("done.."));
}
