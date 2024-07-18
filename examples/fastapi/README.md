# FastAPI Example

### Project Setup

Clone the example and install dependencies

```shell
git clone https://github.com/upstash/redis-js.git
cd redis-js/examples/fastapi
pip install -r requirements.txt
```

### Database Setup

Create a Redis database using [Upstash Console](https://console.upstash.com) or [Upstash CLI](https://github.com/upstash/cli) and export the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to your environment.

```shell
export UPSTASH_REDIS_REST_URL=<YOUR_URL>
export UPSTASH_REDIS_REST_TOKEN=<YOUR_TOKEN>
```

### Run
Run the app locally with `fastapi dev main.py`, check `http://127.0.0.1:8000/`
