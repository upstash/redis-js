# List Operations

## What This File Covers

- LPUSH, RPUSH, LPOP, RPOP with auto-serialization
- LRANGE, LINDEX, LLEN for retrieval
- LREM, LTRIM for list manipulation
- BLPOP, BRPOP for blocking operations
- Storing mixed types in lists (numbers, strings, objects)
- Queue and stack implementations
- Common patterns: job queues, activity feeds, recent items

## Key Topics

1. **Push/Pop Operations**: Adding and removing items with type preservation
2. **Range Operations**: LRANGE returns properly typed arrays
3. **Blocking Operations**: Building queues with BLPOP
4. **Use Cases**: Job queues, message queues, recent activity
5. **Type Preservation**: Lists of numbers, objects, mixed types
6. **Performance**: Best practices for large lists
