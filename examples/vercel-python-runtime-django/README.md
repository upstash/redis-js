# Vercel Python Runtime - Django Example

### Project Setup

Let's create a new django application from Vercel's template.

```shell
git clone https://github.com/upstash/redis-js.git
cd redis-js/examples/vercel-python-runtime-django
```

We will create a Conda environment with python version `3.12` to match Vercel Python Runtime and avoid conflicts on deployment, you can use any other environment management system.

```shell
conda create --name vercel-django python=3.12
conda activate vercel-django
pip install -r requirements.txt
```

### Database Setup

Create a Redis database using [Upstash Console](https://console.upstash.com) or [Upstash CLI](https://github.com/upstash/cli) and export `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to your environment.

```shell
export UPSTASH_REDIS_REST_URL=<YOUR_URL>
export UPSTASH_REDIS_REST_TOKEN=<YOUR_TOKEN>
```

### Run & Deploy
Run the app locally with `python manage.py runserver`, check `http://localhost:8000/`

Deploy your app with `vercel`

Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in your project's Settings -> Environment Variables. Redeploy from Deployments tab.
