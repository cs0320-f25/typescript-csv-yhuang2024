import { parseCSV } from "./basic-parser";
import * as path from "path";
import { z } from "zod";

export const PeopleSchema = z.tuple([z.string(),
  z.string().refine(val => !isNaN(Number(val)), {message: "Must be a valid number."})
  .transform(val => Number(val)),z.string()])
  .transform(([name, number, fruit]) => ({name, number, fruit}))

/*
  Example of how to run the parser outside of a test suite.
*/

const DATA_FILE = "./data/people.csv"; // update with your actual file name

async function main() {
  // Because the parseCSV function needs to "await" data, we need to do the same here.
  const results = await parseCSV(DATA_FILE, PeopleSchema);

  // Notice the difference between "of" and "in". One iterates over the entries, 
  // another iterates over the indexes only.
  for(const record of results.data)
    console.log(record)
  for(const record in results.data)
    console.log(record)
}

main();