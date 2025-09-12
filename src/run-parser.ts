import { parseCSV } from "./basic-parser";
import * as path from "path";
import { z } from "zod";

export const PeopleSchema = z.tuple([z.string(),z.coerce.number(),z.string()])
.transform(tup => ({name: tup[0], number: tup[1], fruit: tup[2]}))
.refine(obj => !isNaN(obj.number), { message: "must be a valid number"})

/*
  Example of how to run the parser outside of a test suite.
*/

const DATA_FILE = "./data/people.csv"; // update with your actual file name

async function main() {
  // Because the parseCSV function needs to "await" data, we need to do the same here.
  const results = await parseCSV(DATA_FILE, PeopleSchema);

  // Notice the difference between "of" and "in". One iterates over the entries, 
  // another iterates over the indexes only.
  for(const record of results)
    console.log(record)
  for(const record in results)
    console.log(record)
}

main();