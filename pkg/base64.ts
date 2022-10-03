/**
 * Decodes a given RFC4648 base64 encoded string
 * from https://deno.land/std@0.158.0/encoding/base64.ts
 */
export function base64Decode(b64: string): string {
  let binString = "";
  try {
    binString = atob(b64);
  } catch (e) {
    const err = e as Error;
    throw new Error(`${err.message}: "${64}"`);
  }

  const size = binString.length;
  const bytes = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    bytes[i] = binString.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}
