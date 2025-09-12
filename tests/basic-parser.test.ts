import { parseCSV } from "../src/basic-parser";
import * as path from "path";
import { z } from "zod";

const PEOPLE_CSV_PATH = path.join(__dirname, "../data/people.csv")
export const PeopleSchema = z.object({name: z.string(),number: z.string(),fruit: z.string()})
.transform(({name, number, fruit}) => ({name, number: Number(number), fruit}))
.refine(obj => !isNaN(obj.number), { message: "Must be a valid number"})

test("parseCSV yields arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, PeopleSchema)
  expect(results).toHaveLength(10)
  expect(results[0]).toEqual(["name", "number", "fruit"])
  expect(results[1]).toEqual(["Alice", "23", "fig"])
  expect(results[3]).toEqual(["Charlie", "25", "jackfruit"])
  expect(results[4]).toEqual(["Nim", "22", "kiwi"])
});

test("parseCSV yields only arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, PeopleSchema)
  for(const row of results) {
    expect(Array.isArray(row)).toBe(true)
  }
});

test("parseCSV parses names correctly", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, PeopleSchema)
  expect(results[1].name).toBe("Alice")
});

test("parseCSV parses numbers correctly", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, PeopleSchema)
  expect(results[1].number).toBe("23")
});

test("parseCSV does not parse numbers of different types", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, PeopleSchema)
  const safeResult = PeopleSchema.safeParse(results[2]);
  expect(safeResult.success).toBe(false)
});

test("parseCSV handles empty fields", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, PeopleSchema)
  expect(results[6]).toEqual(["Eleanor", "19",""])
});

// currently fails with basic broken implementation
test("parseCSV handles commas within quoted fields", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, PeopleSchema)
  expect(results[5]).toEqual(["Dakota", "24", "'lime, orange'"])
});

test("parseCSV handles extra whitespace", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, PeopleSchema)
  expect(results[3]).toEqual(["Charlie", "25", "jackfruit"])
  expect(results[4]).toEqual(["Nim", "22", "kiwi"])
});

test("parseCSV handles invalid names", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, PeopleSchema)
  const safeResult = PeopleSchema.safeParse(results[7].name);
  expect(safeResult.success).toBe(false)
});

test("parseCSV handles invalid fruits", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, PeopleSchema)
  const safeResult = PeopleSchema.safeParse(results[8].fruit);
  expect(safeResult.success).toBe(false)
});

test("parseCSV handles quotes inside quotes", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, PeopleSchema)
  expect(results[9]).toEqual(["Hannah", "26", "she said 'pineapple'"])
})