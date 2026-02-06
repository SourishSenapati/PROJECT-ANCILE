"""
Inventory Defense Engine
------------------------
Implements the 'Atomic Lock' mechanism to prevent double-booking using Redis
for optimistic concurrency control.
"""

import logging
import uuid
import fnmatch
from typing import Dict

import redis

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Redis Connection with Fallback
# In a real app, use environment variables for host/port
# utilizing decode_responses=True to get strings back instead of bytes


class MockRedis:
    """In-memory mock for Redis to allow localhost development without a server."""

    def __init__(self):
        """Initialize the mock store."""
        self.store = {}
        logging.warning(
            "⚠️ REDIS NOT CONNECTED: Using In-Memory Mock. Do not use in production.")

    def set(self, key, value, ex=None, nx=False):
        """Simulate REDIS SET command with NX (Not Exists) support."""
        # _ex (expiry) is ignored in this mock implementation
        _ = ex
        if nx and key in self.store:
            return False
        self.store[key] = value
        return True

    def get(self, key):
        """Simulate REDIS GET command."""
        return self.store.get(key)

    def delete(self, key):
        """Simulate REDIS DEL command."""
        if key in self.store:
            del self.store[key]
            return 1
        return 0

    def scan_iter(self, match="*"):
        """Simulate REDIS SCAN command using glob matching."""
        for key in self.store:
            if fnmatch.fnmatch(key, match):
                yield key

    def ping(self):
        """Simulate REDIS PING command."""
        return True


try:
    redis_client = redis.Redis(
        host='localhost', port=6379, db=0, decode_responses=True)
    redis_client.ping()
    logger.info("✅ Redis Connected Successfully.")
except redis.ConnectionError:
    redis_client = MockRedis()


class InventoryException(Exception):
    """Base exception for inventory related errors."""


class InventoryFullException(InventoryException):
    """Exception raised when inventory is fully allocated or held."""


# Mock Database Helper (Replace with actual SQL query later)


def _get_db_inventory_counts(group_id: str, room_type: str) -> Dict[str, int]:
    """
    Simulates fetching 'total_allocated' and 'total_booked' from SQL.
    """
    # Mock Implementation: Connect to PostgreSQL and query the 'inventory_blocks' table
    # SELECT total_allocated, total_booked ...
    logger.debug("Fetching DB counts for Group: %s, Room: %s",
                 group_id, room_type)
    return {
        "total_allocated": 50,  # Example hard limit
        "total_booked": 45      # Example current confirmed bookings
    }


def acquire_inventory_lock(group_id: str, room_type: str) -> str:
    """
    Implements the Atomic Inventory Lock (Optimistic Concurrency Control).

    Logic:
    1. Check SQL: Is booked_count < total_allocated?
    2. Check Redis: count(active_locks) + booked_count < total_allocated?
    3. Lock: SETNX key lock:group_id:room_type:{uuid} with 600s TTL.

    Returns:
        lock_token (str): Unique token if successful.

    Raises:
        409 Conflict (InventoryFullException) if room is taken.
    """

    # Generate a lock key prefix
    lock_prefix = f"lock:{group_id}:{room_type}"

    # 1. Fetch persistent state from SQL
    db_counts = _get_db_inventory_counts(group_id, room_type)
    allocated = db_counts["total_allocated"]
    booked = db_counts["total_booked"]

    # 2. Count active locks in Redis (Pending bookings)
    # We use SCAN to count keys matching the prefix to know how many are currently held
    # Note: In high concurrency, a Lua script would be safer to check-and-set atomically.
    # For Phase 1 prototype, we count then set.

    # Find all active locks for this room block
    active_locks = 0
    pattern = f"{lock_prefix}:*"
    for _ in redis_client.scan_iter(match=pattern):
        active_locks += 1

    available_inventory = allocated - (booked + active_locks)

    if available_inventory <= 0:
        logger.warning(
            "Inventory Full: Allocated=%d, Booked=%d, ActiveLocks=%d",
            allocated, booked, active_locks
        )
        raise InventoryFullException(
            "409 Conflict: Inventory Fully Allocated or Held.")

    # 3. Attempt to Acquire Lock
    lock_token = str(uuid.uuid4())
    lock_key = f"{lock_prefix}:{lock_token}"

    # SETNX is implied by set(..., nx=True)
    # TTL = 600 seconds (10 minutes)
    is_locked = redis_client.set(lock_key, "HELD", ex=600, nx=True)

    if is_locked:
        logger.info("Lock Acquired: %s", lock_key)
        return lock_token
    else:
        # Should rarely happen given we use a UUID in the key, unless uuid collision
        raise InventoryFullException("409 Conflict: Contentious lock failure.")


def release_inventory_lock(group_id: str, room_type: str, lock_token: str):
    """
    Releases the lock manually (e.g. if payment fails or user cancels).
    """
    key = f"lock:{group_id}:{room_type}:{lock_token}"
    redis_client.delete(key)
    logger.info("Lock Released: %s", key)
