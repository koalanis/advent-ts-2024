import { dayOne } from "./src/dayOne.ts";
import { dayTwo } from "./src/dayTwo.ts";
import {dayThree} from "./src/dayThree.ts";
import {dayFour} from "./src/dayFour.ts";
import {dayFive} from "./src/dayFive.ts";

async function main() {
  // await dayOne();
  // await dayTwo();
  // await dayThree();
  // await dayFour();
  await dayFive();

}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  main().then(() => console.log("done.."));
}
