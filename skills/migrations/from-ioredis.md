# Migrating from ioredis

## What This File Covers

- Key API differences between ioredis and @upstash/redis
- Automatic serialization vs manual JSON.stringify/parse
- Command mapping and syntax changes
- Connection initialization differences
- Pipeline and transaction changes
- Common migration patterns
- Code transformation examples

## Key Topics

1. **API Differences**: Command syntax and method names
2. **Serialization**: Removing JSON.stringify/parse calls
3. **Connection**: Initialization pattern changes
4. **Type Handling**: Numbers, objects, arrays without conversion
5. **Pipelines**: Pipeline API differences
6. **Migration Steps**: Step-by-step migration guide
7. **Examples**: Before/after code comparisons
