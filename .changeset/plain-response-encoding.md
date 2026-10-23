---
"@upstash/redis": minor
---

Default `responseEncoding` to `false`. The server now returns string values as plain JSON instead of base64, which cuts response sizes by up to 25%. Set `responseEncoding: "base64"` to keep the previous behavior.

Behavior changes with the new default:

- String values that start with a UTF-8 BOM keep it. Automatic deserialization still ignores the BOM, so a BOM-prefixed JSON value is parsed as before; other BOM-prefixed strings, and all strings with `automaticDeserialization: false`, are returned exactly, BOM included.
- Invalid UTF-8 (binary data) is still replaced with `U+FFFD`, but the server now replaces each invalid byte, so the number of replacement characters can differ. Binary values were not preserved before either.
- A nested `OK` status reply (e.g. a Lua script returning `{redis.call("SET", ...)}`) no longer sometimes decodes to `8`.
- Error replies nested in arrays (e.g. Lua `pcall` results) are no longer garbled.

Static aborted `signal` (all encodings):

- `abort()` with no reason or with an `Error` returns `null`. With `responseEncoding: false` it used to return a serialized error object.
- `abort(null)` returns `null` instead of `"Aborted"`.
- With the new default, other reasons are returned as is: strings that look like base64 (e.g. `"abcd"`) are no longer garbled, and booleans and objects are no longer dropped.
- Non-Latin-1 string reasons no longer throw a `TypeError` on Node.
