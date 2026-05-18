# Cache service
import os
import json
import redis

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
REDIS_DB = int(os.getenv("REDIS_DB", "0"))

redis_client = redis.Redis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    db=REDIS_DB,
    decode_responses=True,
)

def cache_result(run_id: str, result: dict, ttl: int = 3600):
    redis_client.setex(f"run:{run_id}", ttl, json.dumps(result))

def get_cached_result(run_id: str):
    value = redis_client.get(f"run:{run_id}")
    if not value:
        return None
    return json.loads(value)