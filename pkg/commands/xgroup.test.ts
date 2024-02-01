import { keygen, newHttpClient } from "../test-utils";

import { afterAll, describe, expect, test } from "bun:test";
import { XAddCommand } from "./xadd";
import { XGroupCommand } from "./xgroup";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("XGROUP CREATE", () => {
  test("should create a group successfully", async () => {
    const key = newKey();
    const group = newKey();
    const res = await new XGroupCommand([
      key,
      {
        type: "CREATE",
        group,
        id: "$",
        options: {
          MKSTREAM: true,
        },
      },
    ]).exec(client);
    expect(res).toEqual("OK");
  });
  test("should return error if stream and mkstream don't exist ", async () => {
    const throwable = async () => {
      const key = newKey();
      const group = newKey();
      await new XGroupCommand([key, { type: "CREATE", group, id: "$" }]).exec(client);
    };

    expect(throwable).toThrow();
  });
});

describe("XGROUP CREATECONSUMER", () => {
  test("should create a group successfully with CREATECONSUMER", async () => {
    const key = newKey();
    const group = newKey();
    const consumer = newKey();
    await new XGroupCommand([
      key,
      {
        type: "CREATE",
        group,
        id: "$",
        options: {
          MKSTREAM: true,
        },
      },
    ]).exec(client);
    const res = await new XGroupCommand([
      key,
      {
        type: "CREATECONSUMER",
        group,
        consumer,
      },
    ]).exec(client);
    expect(res).toEqual(1);
  });
});

describe("XGROUP CREATECONSUMER", () => {
  test("should return 0 since nothing to delete", async () => {
    const key = newKey();
    const group = newKey();
    const consumer = newKey();
    await new XGroupCommand([
      key,
      {
        type: "CREATE",
        group,
        id: "$",
        options: {
          MKSTREAM: true,
        },
      },
    ]).exec(client);

    const res = await new XGroupCommand([
      key,
      {
        type: "DELCONSUMER",
        group,
        consumer,
      },
    ]).exec(client);
    expect(res).toEqual(0);
  });
});

describe("XGROUP DESTROY", () => {
  test("should DESTROY the consumer group", async () => {
    const key = newKey();
    const group = newKey();
    await new XGroupCommand([
      key,
      {
        type: "CREATE",
        group,
        id: "$",
        options: {
          MKSTREAM: true,
        },
      },
    ]).exec(client);

    const res = await new XGroupCommand([
      key,
      {
        type: "DESTROY",
        group,
      },
    ]).exec(client);
    expect(res).toEqual(1);
  });

  test("should throw if stream doesn't exist", async () => {
    const throwable = async () => {
      const key = newKey();
      const group = newKey();

      await new XGroupCommand([
        key,
        {
          type: "DESTROY",
          group,
        },
      ]).exec(client);
    };
    expect(throwable).toThrow();
  });

  test("should try to destroy empty group, then destroy filled group successfully", async () => {
    const key = newKey();
    const group = newKey();
    await new XAddCommand([key, "*", { hello: "world" }]).exec(client);

    const numOfDeletedGroups = await new XGroupCommand([
      key,
      {
        type: "DESTROY",
        group,
      },
    ]).exec(client);
    expect(numOfDeletedGroups).toEqual(0);

    await new XGroupCommand([
      key,
      {
        type: "CREATE",
        group,
        id: "$",
      },
    ]).exec(client);

    const numOfDeletedGroupsAfterCreate = await new XGroupCommand([
      key,
      {
        type: "DESTROY",
        group,
      },
    ]).exec(client);

    expect(numOfDeletedGroupsAfterCreate).toEqual(1);
  });
});

describe("XGROUP SETID", () => {
  test("should DESTROY the consumer group", async () => {
    const key = newKey();
    const group = newKey();
    await new XGroupCommand([
      key,
      {
        type: "CREATE",
        group,
        id: "$",
        options: {
          MKSTREAM: true,
        },
      },
    ]).exec(client);

    const res = await new XGroupCommand([
      key,
      {
        type: "SETID",
        group,
        id: "$",
      },
    ]).exec(client);

    expect(res).toEqual("OK");
  });
});
