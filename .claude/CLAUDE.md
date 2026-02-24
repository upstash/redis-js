# redis-js SDK

## Adding a New Redis Command

You need to touch **6 files** (2 new, 4 existing):

### 1. Create the command file: `pkg/commands/<command_name>.ts`

```typescript
import type { CommandOptions } from "./command";
import { Command } from "./command";
/**
 * @see https://redis.io/commands/<command-name>
 */
export class MyCommand extends Command<TResult, TData> {
  constructor(cmd: [...args], opts?: CommandOptions<TResult, TData>) {
    super(["mycommand", ...builtArgs], opts);
  }
}
```

Key patterns:
- `Command<number, number>` for commands returning a count (SCARD, SINTERCARD, SINTERSTORE)
- `Command<unknown[], TData[]>` for commands returning arrays (SINTER, SMEMBERS)
- Constructor first param is a tuple of the command's Redis arguments
- Constructor second param is always `CommandOptions`
- Call `super(["commandname", ...args], opts)` to build the Redis command array
- For optional params (like LIMIT), conditionally push to the command array:
  ```typescript
  if (opts?.limit !== undefined) {
    command.push("LIMIT", opts.limit);
  }
  ```
- For commands taking a variable number of keys with a numkeys param, accept `keys: string[]` and spread: `["cmd", keys.length, ...keys]`

### 2. Create the test file: `pkg/commands/<command_name>.test.ts`

```typescript
import { keygen, newHttpClient, randomID } from "../test-utils";
import { afterAll, expect, test } from "bun:test";
import { SAddCommand } from "./sadd";  // or whatever setup commands needed
import { MyCommand } from "./my_command";

const client = newHttpClient();
const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("description", async () => {
  const key = newKey();
  // setup
  const res = await new MyCommand([...args]).exec(client);
  expect(res).toEqual(expected);
});
```

Run tests with: `npx bun test pkg/commands/<command_name>.test.ts`

### 3. Add export to `pkg/commands/mod.ts`

Insert `export * from "./<command_name>";` in alphabetical order among existing exports.

### 4. Add type export to `pkg/commands/types.ts`

Insert `export { type MyCommand } from "./<command_name>";` in alphabetical order.

### 5. Add method to `pkg/redis.ts`

- Add `MyCommand` to the import block from `"./commands/mod"` (alphabetical within the S/Z/etc group)
- Add method to the class (alphabetical among similar commands):

```typescript
  /**
   * @see https://redis.io/commands/<command-name>
   */
  mycommand = (...args: CommandArgs<typeof MyCommand>) =>
    new MyCommand(args, this.opts).exec(this.client);
```

### 6. Add method to `pkg/pipeline.ts`

- Same import addition as redis.ts
- Add method using `this.chain()` instead of `.exec()`:

```typescript
  /**
   * @see https://redis.io/commands/<command-name>
   */
  mycommand = (...args: CommandArgs<typeof MyCommand>) =>
    this.chain(new MyCommand(args, this.commandOptions));
```

### Checklist

- [ ] `pkg/commands/<name>.ts` - Command class
- [ ] `pkg/commands/<name>.test.ts` - Tests
- [ ] `pkg/commands/mod.ts` - Add `export *` line
- [ ] `pkg/commands/types.ts` - Add `export { type }` line
- [ ] `pkg/redis.ts` - Add import + method
- [ ] `pkg/pipeline.ts` - Add import + method
- [ ] Run `npx bun test pkg/commands/<name>.test.ts` to verify
