/**
 * Result of a bad request to upstash
 */
export class UpstashError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UpstashError";
  }
}

export class UrlError extends Error {
  constructor(url: string) {
    super(`Received an invalid URL: "${url}"`);
    this.name = "UrlError";
  }
}