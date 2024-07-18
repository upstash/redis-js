from fastapi import FastAPI

from upstash_redis import Redis

app = FastAPI()

redis = Redis.from_env()

@app.get("/")
def read_root():
    count = redis.incr('counter')
    return {"count": count}
