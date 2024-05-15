
import { Redis } from '@upstash/redis'

export const LATENCY_LOGGING = true
export const ENABLE_AUTO_PIPELINING = true

const client = Redis.fromEnv({
  latencyLogging: LATENCY_LOGGING,
  enableAutoPipelining: ENABLE_AUTO_PIPELINING
});

export default client;
