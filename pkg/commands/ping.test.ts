import { newHttpClient, randomID } from "../test-utils";
import { PingCommand } from "./ping";

const client = newHttpClient();

test("with message", () => {
  test("returns the message", async () => {
    const message = randomID();
    const res = await new PingCommand([message]).exec(client);
    expect(res).toEqual(message);
  });
});
test("without message", () => {
  test("returns pong", async () => {
    const res = await new PingCommand([]).exec(client);
    expect(res).toEqual("PONG");
  });
});
