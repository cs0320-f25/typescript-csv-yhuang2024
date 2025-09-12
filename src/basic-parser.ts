import * as fs from "fs";
import * as readline from "readline";
import { z, ZodType } from "zod";

/**
 * This is a JSDoc comment. Similar to JavaDoc, it documents a public-facing
 * function for others to use. Most modern editors will show the comment when 
 * mousing over this function name. Try it in run-parser.ts!
 * 
 * File I/O in TypeScript is "asynchronous", meaning that we can't just
 * read the file and return its contents. You'll learn more about this 
 * in class. For now, just leave the "async" and "await" where they are. 
 * You shouldn't need to alter them.
 * 
 * @param path The path to the file being loaded.
 * @returns a "promise" to produce a 2-d array of cell values
 */

//overloading if no schema is provided
export async function parseCSV(path: string): Promise<string[][]>
//overloading if schema is provided
export async function parseCSV<T>(path: string, schema: ZodType<T>): Promise<T[]>;
//handles both cases
export async function parseCSV<T>(path: string, schema?: ZodType<T>): Promise<string[][] | T[]> {
  // This initial block of code reads from a file in Node.js. The "rl"
  // value can be iterated over in a "for" loop. 
  const fileStream = fs.createReadStream(path);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity, // handle different line endings
  })

  // We add the "await" here because file I/O is asynchronous. 
  // We need to force TypeScript to _wait_ for a row before moving on. 
  // More on this in class soon!

  //if no schema is passed in, return string[][]
    if (!schema) {
      const rows: string[][] = []
      for await (const line of rl) {
        const values = line.split(",").map((v) => v.trim());
        if (values.length != 3) {
          throw new Error("Each line must have exactly 3 values. Erroneous line: " + line)
        }
        rows.push(values)
      } 
      return rows

      //if schema is provided, return schema type (generic T[])
    } else {
      const rows: T[] = []
      for await (const line of rl) {
        const values = line.split(",").map((v) => v.trim());
        if (values.length != 3) {
          throw new Error("Each line must have exactly 3 values. Erroneous line: " + line)
        }
        const parsed = schema.safeParse(values)
        if(!parsed.success) {
          throw new Error("Failed to parse line: " + line + parsed.error.message)
      }
      rows.push(parsed.data)
      }
      return rows
    }
}