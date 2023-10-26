import { newHttpClient, randomID } from "../test-utils";
import { ScriptExistsCommand } from "./script_exists";
import { ScriptLoadCommand } from "./script_load";

const client = newHttpClient();

test("with a single script", () => {
  test("when the script exists", () => {
    test("returns 1", async () => {
      const script = `return "${randomID()}"`;
      const hash = await new ScriptLoadCommand([script]).exec(client);
      const res = await new ScriptExistsCommand([hash]).exec(client);
      expect(res).toEqual([1]);
    });
  });
  test("when the script does not exist", () => {
    test("returns 0", async () => {
      const res = await new ScriptExistsCommand(["21"]).exec(client);
      expect(res).toEqual([0]);
    });
  });
});
test("with multiple scripts", () => {
  test("returns the found scripts", async () => {
    const script1 = `return "${randomID()}"`;
    const script2 = `return "${randomID()}"`;
    const hash1 = await new ScriptLoadCommand([script1]).exec(client);
    const hash2 = await new ScriptLoadCommand([script2]).exec(client);
    const res = await new ScriptExistsCommand([hash1, hash2]).exec(client);
    expect(res).toEqual([1, 1]);
  });
});
