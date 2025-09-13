import * as fs from "fs";
import * as readline from "readline";
import { z, ZodType } from "zod";

//an error type to define errors
export type ParseError = {
  line: number
  errors: string[]
}

//parseCSV's return value, which includes generic data and errors
export type ParseResult<T> = {
  data: T[] | string[][]
  errors: ParseError[]
}

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

export async function parseCSV<T>(path: string, schema?: ZodType<T>): Promise<ParseResult<T>> {
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

    const rows: string[][] = []
    const parsedRows: T[] = []
    const errors: ParseError[] = []

    //keep track of line number for errors
    let lineNumber = 0;
    for await (const line of rl) {
      lineNumber++
      const values = line.split(",").map((v) => v.trim());
      if (values.length != 3) {
        errors.push({line: lineNumber, errors: ["Each line must have exactly 3 values."]})
        continue
      }
      
      if (!schema) {
        rows.push(values)
      } else {
        const parsed = schema.safeParse(values)
        if(!parsed.success) {
          errors.push({line: lineNumber, errors: ["Parse Error"]})
        } else {
          parsedRows.push(parsed.data)
        }
      }
    }
    return {
      data: schema ? parsedRows : rows,
      errors,
    }
}