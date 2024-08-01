import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN
});

export async function CounterFunction(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const count = await redis.incr("counter");

    return { status: 200, body: `Counter: ${count}` };
};

app.http('CounterFunction', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: CounterFunction
});