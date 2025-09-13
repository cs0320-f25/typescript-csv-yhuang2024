import { parseCSV } from "../src/basic-parser";
import * as path from "path";
import { z } from "zod";

const PEOPLE_CSV_PATH = path.join(__dirname, "../data/people.csv")
export const PeopleSchema = z.tuple([z.string(),
  z.string().refine(val => !isNaN(Number(val)), {message: "Must be a valid number."})
  .transform(val => Number(val)),z.string()])
  .transform(([name, number, fruit]) => ({name, number, fruit}))

export type Person = z.infer<typeof PeopleSchema>

test("parseCSV yields objects", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, PeopleSchema)
  expect(results.data).toHaveLength(7)
  //handles headers
  expect(results.data[0]).toEqual({name: "Alice", number: 23, fruit: "fig"})
  expect(results.data[1]).toEqual({name: "Charlie", number: 25, fruit: "jackfruit"})
  expect(results.data[2]).toEqual({name: "Nim", number: 22, fruit: "kiwi"})
});

test("parseCSV yields correct number of errors", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, PeopleSchema)
  expect(results.errors).toHaveLength(3); //3 errors with Bob, Dakota, and header
})

test("parseCSV yields only objects", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, PeopleSchema)
  for(const row of results.data as Person[]) {
    expect(typeof row).toBe("object")
    expect(row).toHaveProperty("name")
    expect(row).toHaveProperty("number")
    expect(row).toHaveProperty("fruit")
  }
});

test("parseCSV parses names correctly", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, PeopleSchema)
  expect((results.data as Person[])[0].name).toBe("Alice")
});

test("parseCSV parses numbers correctly", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, PeopleSchema)
  expect((results.data as Person[])[0].number).toBe(23)
});

test("parseCSV does not parse numbers of different types when no schema is provided", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  const safeResult = PeopleSchema.safeParse(results.data[2]); //Bob's row with "thirty"
  expect(safeResult.success).toBe(false)
});

test("parseCSV handles empty fields", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, PeopleSchema)
  expect(results.data[3]).toEqual({name: "Eleanor", number: 19, fruit: ""})
});

test("parseCSV handles commas within quoted fields", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, PeopleSchema)
  const names = (results.data as Person[]).map(person => person.name)
  expect(names).not.toContain("Dakota")
  expect(results.errors[2]).toEqual(
    expect.objectContaining({
      line: 6,
      errors: expect.arrayContaining([
        //currently splits into 4
        expect.stringContaining("Each line must have exactly 3 values.")
      ])
    })
  )
});

test("parseCSV handles extra whitespace", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, PeopleSchema)
  expect(results.data[1]).toEqual({name: "Charlie", number: 25, fruit: "jackfruit"})
  expect(results.data[2]).toEqual({name: "Nim", number: 22, fruit: "kiwi"})
});

//TS interprets the outer quotes as part of the string, will address in next sprint
test("parseCSV handles quotes inside quotes", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, PeopleSchema)
  expect(results.data[6]).toEqual({name: "Hannah", number: 26, fruit: "\"she said 'pineapple'\""})
})