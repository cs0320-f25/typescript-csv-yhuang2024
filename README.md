# Sprint 1: TypeScript CSV

### Task B: Proposing Enhancement

- #### Step 1: Brainstorm on your own.

- type blindness (currently "age" and even "name" field can take in any type (ex: "thirty" and 23 are both valid inputs)).
- possibility of having empty fields/values
- user may input more/fewer fields than given number of categories
- acceptable range of numerical values for age (unlikely to occur)

- #### Step 2: Use an LLM to help expand your perspective.

- maintains previously mentioned pitfalls of commas inside quotes and quotes inside quoted strings, empty fields/values (stronger error handling)
- includes new considerations like trailing commas, whitespace trimming, line endings, boolean detection, config objects like delimiters, type inference, cell- and row-level transformations, asynchronous input support, performance considerations/interoperability and integration, and options to output several different output types

- #### Step 3: use an LLM to help expand your perspective.

1. I’m working on a CSV parser in TypeScript that currently accepts a filename as input and converts rows into strings or objects. What are some missing features or edge cases that I should consider? What improvements would make it easier for **users to use**?

- stronger focus on user flexibility (more options for input)
- more emphasis on documentation and usability
- similar error handling

2. I’m working on a CSV parser in TypeScript that currently accepts a filename as input and converts rows into strings or objects. What are some missing features or edge cases that I should consider? What improvements would make it easier for other developers to use in different kinds of apps? **In what circumstances would I use this**?

- includes more detail about exporting to CSV and outside API support
- includes information about use cases (ex: data science preprocessing pipelines, server log analytics, etc.)
- similar error handling

    Include a list of the top 4 enhancements or edge cases you think are most valuable to explore in the next week’s sprint. Label them clearly by category (extensibility vs. functionality), and include whether they came from you, the LLM, or both. Describe these using the User Story format—see below for a definition. 

    Include your notes from above: what were your initial ideas, what did the LLM suggest, and how did the results differ by prompt? What resonated with you, and what didn’t? (3-5 sentences.) 

    1. As a user of the application, I am able to validate input types against a user-provided schema so I can catch type mismatches early and avoid errors. This user story addresses functionality and was a human-generated suggestion.

    2. As a user of the application, I am able to keep empty fields/missing values as empty strings so that missing information does not break the parser. This user story addresses functionality and was a human-generated suggestion.

    3. As a user of the application, I am able to handle circumstances in which I input more or fewer fields than the given number of categories (as sometimes provided in a header) to account for user error. This user story addresses functionality and was a human-generated suggestion.

    4. As a user of the application, I am able to keep my parsed results free of whitespace so my data is clean, consistent, and easy to read for future applications. This user story addresses functionality and was an AI-generated suggestion.

    My initial ideas mainly considered basic edge cases and user error, but the LLM additionally suggested more complex performance enhancement and flexibility with types, integration with other systems, etc. When I later asked about ways to improve user experience, the LLM provided more information about documentation and emphasized user flexibility with inputs. I was also interested in other use cases for the parser, which the LLM provided good information about. I liked that it was able to provide me with examples for when this CSV parser would be used, as well as what specific aspects of development were useful for users and developers, but I thought some information in the performance enhancement section was overkill for such a simple task.

### Design Choices

I chose to make a custom type called a ParseResult that can take in both generic/string[][] types for type safety as well as an array of custom ParseErrors, which can return error messages for unsuccessfully parsed lines. With this design, I was able to return errors and test for them effectively while maintaining validation and type safety with generics. 

### 1340 Supplement

N/A

- #### 1. Correctness

A CSV parser should yield ordered objects, handle empty fields, only parse when types match provided schema, handle commas within quoted fields and quotes within quotes, handle whitespace, split fields of each record correctly, and be able to be used without knowledge of the CSV format.

- #### 2. Random, On-Demand Generation

With randomly generated content, we could test whether our current test cases are robust to different types, errors/edge cases, and consistently changing fields, which could expose new edge cases and considerations for our program that will make it more resilient to change and error.

- #### 3. Overall experience, Bugs encountered and resolved

There was a lot more writing involved in this sprint than in previous coding assignments I've received, which I liked because it allowed me to think about the process more in-depth and consider user needs. I was surprised that were were not asked to immediately fix the parser, but rather investigate intricacies of Typescript like types, Zod schema, etc. 

#### Errors/Bugs:

I struggled with the concept of type unions, which made it difficult for me to identify how to return the right generic type when users gave a schema rather than string[][]. I looked through the Typescript documentation, asked on Ed, and asked Copilot to come up with better solutions and debug unknown errors.

I also struggled with editing my tests to reflect the fact that I changed my design to return an error type. By looking through documentation and Stack Overflow, I was able to find the right syntax for checking for errors, and even got help with design by putting errors in a ParseError array, which would make it easier to test for them according to the guidelines we covered in class.

#### Team members and contributions (include cs logins):

#### Collaborators (cslogins of anyone you worked with on this project and/or generative AI): 
Copilot (see chat logs here: https://docs.google.com/document/d/1SfeeKcifq6YRGA34BW_1GnFvItLFfULP7j06gvW2VzY/edit?usp=sharing)
#### Total estimated time it took to complete project: 
8 hours
#### Link to GitHub Repo: 
https://github.com/cs0320-f25/typescript-csv-yhuang2024
