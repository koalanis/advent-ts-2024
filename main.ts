import { dayOne } from "./src/dayOne.ts";
import { dayTwo } from "./src/dayTwo.ts";
import {dayThree} from "./src/dayThree.ts";

async function main() {
  await dayOne();
  await dayTwo();
  await dayThree();
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  main().then(() => console.log("done.."));
}
