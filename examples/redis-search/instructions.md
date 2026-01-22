write the nextjs app to highlight features of redis search

# Rough structure

here is a rough requirement list:
- a function that creates an index (using existsOk: true) and upserts data. it should be deterministic (no random id for data) and should run everytime without error. should include logs like index already exists, index created, data upserted, script completed etc
  - this function should be callable via an endpoint, this endpoint should be disabled when deployed to production
  - this function should also be callable with npm run ...
- on the app, we shall highlight features of search step by step
  - In each step, there can be a title and a description, description shouldn't be too long, somthing simple. description can be React.Node, not only string
  - there can be a code snippet in the step, examplifying the step. should be possible to copy with a button
  - finally, in each step, there could be a result. This result is shown after a user action (use server actions to keep things simple). result component is responsible with rendering the action (button, button with search input etc)

these steps should be easy to write/replace/remove. There shall also be a Steps component which renders a series of steps, receiving StepConfig[]. Steps should render Step, which receives StepConfig and index

type StepConfig = {
  title: string,
  description: React.Node,
  code?: string,
  result?: React.Node
}

There shall be a common component for result too if possible.

# Features I want to highlight

I want to highlight a lot of stuff, so possibly we need to break them into multiple pages. Here is a rough list of features I want to highlight:

- create index (show examples for how hash/string/json schemas can be defined. in the actions/results, use string index)
  - schema, `s` syntax
  - creating an index on redis with createIndex
  - creating an index client without calling redis
  - adding data using regular redis commands
  - wait indexing
- query
  - $eq
  - $regex
  - boolean query
  - number query
  - example with count, all filters work with count too
- query advanced
  - filter without $, which uses complex filter in the backend
  - highlighting (in the result, show the highlighted text). let the user input the term to search/highlight
  - select field
  - boost by field
  - and/or
- other things
  - describe
  - drop

# tech stack

- tailwind
- shadcn

# folder structure

- components: component files (each complex component in a file, structured with subfolders)
- app: app
- server: server actions
- steps: step configs, with subfolders for each page if needed