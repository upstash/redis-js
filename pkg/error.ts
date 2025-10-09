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

export class UpstashJSONParseError extends UpstashError {
  constructor(body: string, options?: { cause: { response: Response } }) {
    const truncatedBody = body.length > 200 ? body.substring(0, 200) + "..." : body;
    super(`Unable to parse response body: ${truncatedBody}`);
    this.name = "UpstashJSONParseError";
    this.cause = options?.cause?.response;
  }
}
