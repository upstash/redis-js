# Pipelines and Transactions

## What This File Covers

- Manual pipeline construction with pipeline()
- MULTI/EXEC for atomic transactions
- WATCH for optimistic locking
- Difference between pipelines and transactions
- Error handling in pipelines
- Atomic operations and race conditions
- Common patterns: atomic counters, conditional updates

## Key Topics

1. **Manual Pipelines**: Building pipelines for batch operations
2. **Transactions**: MULTI/EXEC for atomicity
3. **Optimistic Locking**: WATCH for conditional execution
4. **Pipelines vs Transactions**: When to use each
5. **Error Handling**: Dealing with failures in pipelines
6. **Atomic Operations**: Preventing race conditions
7. **Use Cases**: Inventory updates, account transfers, conditional logic
