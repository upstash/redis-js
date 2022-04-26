import { keygen, newHttpClient } from "../test-utils";
import { afterAll, expect, it } from "@jest/globals";
import { SetCommand } from "./set";
import { SetRangeCommand } from "./setrange";
import { GetCommand } from "./get";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it(
  "sets value",
  async () => {
    const key = newKey();
    const value = "originalValue";

    const res = await new SetCommand(key, value).exec(client);

    expect(res).toEqual("OK");
    const res2 = await new SetRangeCommand(key, 4, "helloWorld").exec(client);

    expect(res2).toEqual(14);
    const res3 = await new GetCommand(key).exec(client);

    expect(res3).toEqual("orighelloWorld");
  },
);
