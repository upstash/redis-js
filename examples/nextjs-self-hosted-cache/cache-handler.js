const { Redis } = require("@upstash/redis");

const redis = Redis.fromEnv();
const TAGS_KEY = "next:tags";

// Tag invalidation times in ms, synced from Redis once per request by refreshTags().
// Fields are "stale:<tag>" and "expired:<tag>".
let tagTimes = {};
// True when the last refreshTags() could not reach Redis
let tagsUnavailable = false;
// Sets still running in this process, so a get() for the same key waits for them.
const pendingSets = new Map();

const isExpired = (entry) =>
  entry.tags.some((tag) => {
    const expired = tagTimes[`expired:${tag}`] ?? 0;
    return expired > entry.timestamp && expired <= Date.now();
  });

const isStale = (entry) =>
  entry.tags.some((tag) => (tagTimes[`stale:${tag}`] ?? 0) > entry.timestamp);

module.exports = {
  async get(cacheKey) {
    if (tagsUnavailable) return undefined;
    await pendingSets.get(cacheKey);
    try {
      const entry = await redis.get(`next:cache:${cacheKey}`);
      if (!entry || isExpired(entry)) return undefined;

      return {
        ...entry,
        // A stale tag serves the entry once more and refreshes it in the background
        revalidate: isStale(entry) ? -1 : entry.revalidate,
        value: new ReadableStream({
          start(controller) {
            controller.enqueue(new Uint8Array(Buffer.from(entry.value, "base64")));
            controller.close();
          },
        }),
      };
    } catch (error) {
      console.error("cache get failed", error);
      return undefined;
    }
  },

  async set(cacheKey, pendingEntry) {
    let done;
    pendingSets.set(cacheKey, new Promise((resolve) => (done = resolve)));
    try {
      const entry = await pendingEntry;
      const bytes = Buffer.from(await new Response(entry.value).arrayBuffer());

      await redis.set(
        `next:cache:${cacheKey}`,
        { ...entry, value: bytes.toString("base64") },
        // Let Redis evict the entry once Next.js would stop serving it
        Number.isFinite(entry.expire)
          ? { ex: Math.max(1, Math.ceil(entry.expire)) }
          : undefined
      );
    } catch (error) {
      console.error("cache set failed", error);
    } finally {
      done();
      pendingSets.delete(cacheKey);
    }
  },

  async refreshTags() {
    try {
      tagTimes = (await redis.hgetall(TAGS_KEY)) ?? {};
      tagsUnavailable = false;
    } catch (error) {
      // Without fresh tag times we can't tell if an entry was invalidated,
      // so skip the remote cache for this request instead of failing it
      console.error("cache refreshTags failed", error);
      tagsUnavailable = true;
    }
  },

  async getExpiration(tags) {
    // Unknown tag state: report the entries as expired so Next.js recomputes
    if (tagsUnavailable) return Infinity;
    return Math.max(0, ...tags.map((tag) => tagTimes[`expired:${tag}`] ?? 0));
  },

  async updateTags(tags, durations) {
    const now = Date.now();
    const updates = {};
    for (const tag of tags) {
      if (durations) {
        // revalidateTag(tag, profile): serve stale while refreshing, expire later
        updates[`stale:${tag}`] = now;
        if (durations.expire !== undefined) {
          updates[`expired:${tag}`] = now + durations.expire * 1000;
        }
      } else {
        // updateTag(tag): expire immediately
        updates[`expired:${tag}`] = now;
      }
    }
    Object.assign(tagTimes, updates);
    await redis.hset(TAGS_KEY, updates);
  },
};
