import { parseCSV } from "../src/basic-parser";
import * as path from "path";
import { z } from "zod";

const PEOPLE_CSV_PATH = path.join(__dirname, "../data/people.csv")
export const PeopleSchema = z.tuple([z.string(),
  z.string().refine(val => !isNaN(Number(val)), {message: "must be a valid number"})
  .transform(val => Number(val)),z.string()])
  .transform(([name, number, fruit]) => ({name, number, fruit}))

export type Person = z.infer<typeof PeopleSchema>

test("parseCSV yields objects", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, PeopleSchema)
  expect(results).toHaveLength(10)
  expect(results[1]).toEqual({name: "Alice", number: 23, fruit: "fig"})
  expect(results[3]).toEqual({name: "Charlie", number: 25, fruit: "jackfruit"})
  expect(results[4]).toEqual({name: "Nim", number: 22, fruit: "kiwi"})
});

test("parseCSV yields only objects", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, PeopleSchema)
  for(const row of results) {
    expect(typeof row).toBe("object")
    expect(row).toHaveProperty("name")
    expect(row).toHaveProperty("number")
    expect(row).toHaveProperty("fruit")
  }
});

test("parseCSV parses names correctly", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, PeopleSchema)
  expect(results[1].name).toBe("Alice")
});

test("parseCSV parses numbers correctly", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, PeopleSchema)
  expect(results[1].number).toBe(23)
});

test("parseCSV does not parse numbers of different types when no schema is provided", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  const safeResult = PeopleSchema.safeParse(results[2]);
  expect(safeResult.success).toBe(false)
});

test("parseCSV handles empty fields", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, PeopleSchema)
  expect(results[6]).toEqual({name: "Eleanor", number: 19, fruit: ""})
});

// currently fails with basic broken implementation
test("parseCSV handles commas within quoted fields", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, PeopleSchema)
  expect(results[5]).toEqual({name: "Dakota", number: 24, fruit: "lime,orange"})
});

test("parseCSV handles extra whitespace", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, PeopleSchema)
  expect(results[3]).toEqual({name: "Charlie", number: 25, fruit: "jackfruit"})
  expect(results[4]).toEqual({name: "Nim", number: 22, fruit: "kiwi"})
});

//currently fails with basic broken implementation
test("parseCSV handles invalid names when no schema is provided", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  const safeResult = PeopleSchema.safeParse(results[7]);
  expect(safeResult.success).toBe(false)
});

//currently fails with basic broken implementation
test("parseCSV handles invalid fruits when no schema is provided", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  const safeResult = PeopleSchema.safeParse(results[8]);
  expect(safeResult.success).toBe(false)
});

//currently fails with basic broken implementation
test("parseCSV handles quotes inside quotes", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, PeopleSchema)
  expect(results[9]).toEqual({name: "Hannah", number: 26, fruit: "she said 'pineapple'"})
})

//currently fails with basic broken implementation
//current strategy for future sprint is to skip the header; current header is a stand-in
test("parseCSV handles headers", async() => {
  const results = await parseCSV(PEOPLE_CSV_PATH, PeopleSchema)
  expect(results[0]).toEqual(["Alice", "23", "fig"])
})