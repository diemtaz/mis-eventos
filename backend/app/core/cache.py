import redis
from app.core.config import settings

redis_client = redis.Redis(
    host="redis",
    port=6379,
    decode_responses=True
)

def invalidate_events_cache():
    for key in redis_client.scan_iter("events:*"):
        redis_client.delete(key)
