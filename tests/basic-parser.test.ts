import { parseCSV } from "../src/basic-parser";
import * as path from "path";

const PEOPLE_CSV_PATH = path.join(__dirname, "../data/people.csv");

test("parseCSV yields arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  
  expect(results).toHaveLength(9);
  expect(results[0]).toEqual(["name", "number", "fruit"]);
  expect(results[1]).toEqual(["Alice", "23", "fig"]);
  expect(results[2]).toEqual(["Bob", "thirty", "grape"]); // why does this work? :(
  expect(results[3]).toEqual(["Charlie", "25", "jackfruit"]);
  expect(results[4]).toEqual(["Nim", "22", "kiwi"]);
  expect(results[6]).toEqual(["Eleanor", "", "lemon"]);
  expect(results[7]).toEqual(["Fat1ma", "18", "mango"]);
  expect(results[8]).toEqual(["Gloria", "21", "22"]);
});

test("parseCSV yields only arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  for(const row of results) {
    expect(Array.isArray(row)).toBe(true);
  }
});

test("parseCSV parses names correctly", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  expect(results[1][0]).toBe("Alice");
});

test("parseCSV parses numerical ages correctly", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH);
  expect(results[1][1]).toBe("23");
});

// type check for this later! can transform to a number
test("parseCSV parses ages of different types", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH);
  // currently wrong, should be "30"
  expect(results[2][1]).toBe("thirty");
});

test("parseCSV handles empty fields", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH);
  expect(results[6]).toEqual(["Eleanor", "", "lemon"]);
});

// currently fails with basic broken implementation
test("parseCSV handles commas within quoted fields", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH);
  expect(results[5]).toEqual(["Dakota", "twenty, three", "lime"]);
});

test("parseCSV handles extra whitespace", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH);
  expect(results[3]).toEqual(["Charlie", "25", "jackfruit"]);
  expect(results[4]).toEqual(["Nim", "22", "kiwi"]);
});

/*
test("parseCSV handles invalid names", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH);
  //name is not string error
});

test("parseCSV handles invalid fruits", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH);
  //fruit is not string error
});
*/