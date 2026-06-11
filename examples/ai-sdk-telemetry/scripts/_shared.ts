// The weather tool lives in src/agent.ts so the dashboard and the CLI scripts
// share one definition. Re-exported here for the scripts that import it.
export { weatherTool } from "../src/agent";
