# Set Operations

## What This File Covers

- SADD, SREM, SMEMBERS operations
- SISMEMBER, SCARD for checking membership and size
- SINTER, SUNION, SDIFF for set operations
- SPOP, SRANDMEMBER for random selection
- Storing unique values with type preservation
- Common patterns: tags, unique visitors, permissions

## Key Topics

1. **Basic Set Operations**: SADD/SMEMBERS with auto-serialization
2. **Membership Testing**: Fast lookups with SISMEMBER
3. **Set Algebra**: Intersection, union, difference operations
4. **Random Selection**: SPOP for random items
5. **Use Cases**: Tags, unique tracking, permission sets
6. **Type Preservation**: Sets of numbers, strings, or serialized objects
