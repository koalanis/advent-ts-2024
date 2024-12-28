import {
  dayEight,
  dayEighteen,
  dayEleven,
  dayFifteen,
  dayFive,
  dayFour,
  dayFourteen,
  dayNine,
  dayNineteen,
  dayOne,
  daySeven,
  daySeventeen,
  daySix,
  daySixteen,
  dayTen,
  dayThirteen,
  dayThree,
  dayTwelve,
  dayTwenty,
  dayTwentyFive,
  dayTwentyFour,
  dayTwentyOne,
  dayTwentyThree,
  dayTwentyTwo,
  dayTwo,
} from "./src/solutions.ts";

async function main() {
  const day = Number.parseInt(prompt(" Enter day: ") || "-1");
  switch (day) {
    case 1:
      await dayOne();
      break;
    case 2:
      await dayTwo();
      break;
    case 3:
      await dayThree();
      break;
    case 4:
      await dayFour();
      break;
    case 5:
      await dayFive();
      break;
    case 6:
      await daySix();
      break;
    case 7:
      await daySeven();
      break;
    case 8:
      await dayEight();
      break;
    case 9:
      await dayNine();
      break;
    case 10:
      await dayTen();
      break;
    case 11:
      await dayEleven();
      break;
    case 12:
      await dayTwelve();
      break;
    case 13:
      await dayThirteen();
      break;
    case 14:
      await dayFourteen();
      break;
    case 15:
      await dayFifteen();
      break;
    case 16:
      await daySixteen();
      break;
    case 17:
      await daySeventeen();
      break;
    case 18:
      await dayEighteen();
      break;
    case 19:
      await dayNineteen();
      break;
    case 20:
      await dayTwenty();
      break;
    case 21:
      await dayTwentyOne();
      break;
    case 22:
      await dayTwentyTwo();
      break;
    case 23:
      await dayTwentyThree();
      break;
    case 24:
      await dayTwentyFour();
      break;
    case 25:
      await dayTwentyFive();
      break;
  }
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  main().then(() => console.log("done.."));
}
