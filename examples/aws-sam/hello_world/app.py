from upstash_redis import Redis

redis = Redis.from_env()

def lambda_handler(event, context):
    count = redis.incr('counter')
    return {
        'statusCode': 200,
        'body': f'Counter: {count}'
    }