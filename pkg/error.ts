/**
 * Result of a bad request to upstash
 */
export class UpstashError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UpstashError";
  }
}
