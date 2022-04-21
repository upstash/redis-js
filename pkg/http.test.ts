import { HttpClient } from "./http";

import { describe, expect, it } from "@jest/globals";
import { newHttpClient } from "./test-utils";
it(
	"remove trailing slash from urls",
	() => {
		const client = new HttpClient({ baseUrl: "https://example.com/" });

		expect(client.baseUrl).toBe("https://example.com");
	},
);

describe(
	"when the request is invalid",
	() => {
		it(
			"throws",
			async () => {
				const client = newHttpClient();
				expect(() => client.request({ body: ["get", "1", "2"] })).rejects.toThrowErrorMatchingInlineSnapshot();
			},
		);
	},
);

describe(
	"whithout authorization",
	() => {
		it(
			"throws",
			async () => {
				const client = newHttpClient();
				client.headers = {};
				expect(() => client.request({ body: ["get", "1", "2"] })).rejects.toThrowErrorMatchingInlineSnapshot();
			},
		);
	},
);
