from datetime import datetime

from django.http import HttpResponse

from upstash_redis import Redis

redis = Redis.from_env()

def index(request):
    count = redis.incr('counter')
    html = f'''
    <html>
        <body>
            <h1>Counter: { count }</h1p>
        </body>
    </html>
    '''
    return HttpResponse(html)