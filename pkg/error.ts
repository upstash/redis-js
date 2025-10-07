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
    super(
      `Upstash Redis client was passed an invalid URL. You should pass a URL starting with https. Received: "${url}". `
    );
    this.name = "UrlError";
  }
}

export class JSONParseError extends Error {
  constructor(contentType: string) {
    super(
      `Unexpected non-JSON error response (content-type: ${contentType}). This usually means the URL is incorrect or content-type is not supported.`
    );
    this.name = "JSONParseError";
  }
}
