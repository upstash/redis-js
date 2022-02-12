import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { describe, it, expect, afterAll } from "@jest/globals"
import { BLPopCommand } from "./blpop"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

describe("with single key", () => {})
