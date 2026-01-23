# String Operations

## What This File Covers

- GET, SET, SETEX, SETNX operations with auto-serialization
- INCR, DECR, INCRBY, DECRBY for counters (with actual numbers)
- APPEND, GETRANGE, SETRANGE for string manipulation
- MGET, MSET for batch operations
- TTL and expiration with SETEX, EXPIRE
- Common patterns: counters, flags, simple caching
- Type preservation examples (storing numbers vs strings)

## Key Topics

1. **Basic Operations**: GET/SET with different data types
2. **Numeric Operations**: Counters using actual numbers, not string parsing
3. **Expiration**: TTL strategies
4. **Batch Operations**: MGET/MSET for efficiency
5. **String Manipulation**: APPEND, substring operations
6. **Use Cases**: View counts, feature flags, simple caching
