import logging
import os
from datetime import datetime, timedelta, timezone
from typing import Dict, List, Optional, Tuple

from psycopg_pool import ConnectionPool

logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("SUPABASE_DB_URL") or os.getenv("DATABASE_URL")
_pool: Optional[ConnectionPool] = None
_initialized = False


def is_enabled() -> bool:
    return bool(DATABASE_URL)


def initialize_session_store() -> bool:
    global _pool, _initialized

    if _initialized:
        return _pool is not None

    _initialized = True

    if not DATABASE_URL:
        logger.info("Supabase Postgres URL not configured; using in-memory session store.")
        return False

    _pool = ConnectionPool(DATABASE_URL, min_size=1, max_size=5)
    _ensure_schema()
    logger.info("Supabase Postgres session store initialized.")
    return True


def _require_pool() -> ConnectionPool:
    if _pool is None:
        raise RuntimeError("Session store is not initialized.")
    return _pool


def _ensure_schema() -> None:
    pool = _require_pool()
    with pool.connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS chatbot_sessions (
                    session_id TEXT PRIMARY KEY,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    last_activity TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    confidence_tier SMALLINT NOT NULL DEFAULT 3
                )
                """
            )
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS chatbot_messages (
                    id BIGSERIAL PRIMARY KEY,
                    session_id TEXT NOT NULL REFERENCES chatbot_sessions(session_id) ON DELETE CASCADE,
                    role TEXT NOT NULL,
                    content TEXT NOT NULL,
                    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
                )
                """
            )
            cur.execute(
                """
                CREATE INDEX IF NOT EXISTS idx_chatbot_messages_session_timestamp
                ON chatbot_messages (session_id, timestamp)
                """
            )
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS chatbot_rate_limits (
                    session_id TEXT PRIMARY KEY REFERENCES chatbot_sessions(session_id) ON DELETE CASCADE,
                    message_count INTEGER NOT NULL DEFAULT 0,
                    window_start TIMESTAMPTZ NOT NULL DEFAULT NOW()
                )
                """
            )


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _ensure_session(conn, session_id: str, confidence_tier: int = 3) -> None:
    with conn.cursor() as cur:
        cur.execute(
            """
            INSERT INTO chatbot_sessions (session_id, created_at, last_activity, confidence_tier)
            VALUES (%s, NOW(), NOW(), %s)
            ON CONFLICT (session_id)
            DO UPDATE SET
                last_activity = NOW()
            """,
            (session_id, confidence_tier),
        )


def store_conversation(session_id: str, role: str, content: str, timestamp: str = None) -> None:
    pool = _require_pool()
    ts = timestamp or _utcnow().isoformat()

    with pool.connection() as conn:
        _ensure_session(conn, session_id)
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO chatbot_messages (session_id, role, content, timestamp)
                VALUES (%s, %s, %s, %s)
                """,
                (session_id, role, content, ts),
            )
            cur.execute(
                "UPDATE chatbot_sessions SET last_activity = NOW() WHERE session_id = %s",
                (session_id,),
            )


def get_session_history(session_id: str, max_messages: int = 8) -> List[Dict]:
    pool = _require_pool()

    with pool.connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT role, content, timestamp
                FROM chatbot_messages
                WHERE session_id = %s
                ORDER BY timestamp DESC
                LIMIT %s
                """,
                (session_id, max_messages),
            )
            rows = cur.fetchall()

    messages = [
        {"role": role, "content": content, "timestamp": timestamp.isoformat() if hasattr(timestamp, "isoformat") else str(timestamp)}
        for role, content, timestamp in reversed(rows)
    ]
    return messages


def cleanup_expired_sessions(session_timeout_hours: int = 24) -> None:
    pool = _require_pool()
    cutoff = _utcnow() - timedelta(hours=session_timeout_hours)

    with pool.connection() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM chatbot_sessions WHERE last_activity < %s", (cutoff,))


def check_rate_limit(session_id: str, limit_per_hour: int = 10) -> Tuple[bool, int]:
    pool = _require_pool()
    now = _utcnow()
    window_cutoff = now - timedelta(hours=1)

    with pool.connection() as conn:
        _ensure_session(conn, session_id)
        with conn.cursor() as cur:
            cur.execute(
                "SELECT message_count, window_start FROM chatbot_rate_limits WHERE session_id = %s",
                (session_id,),
            )
            row = cur.fetchone()

            if row is None:
                cur.execute(
                    """
                    INSERT INTO chatbot_rate_limits (session_id, message_count, window_start)
                    VALUES (%s, 1, NOW())
                    """,
                    (session_id,),
                )
                return True, limit_per_hour - 1

            message_count, window_start = row
            if window_start < window_cutoff:
                cur.execute(
                    """
                    UPDATE chatbot_rate_limits
                    SET message_count = 1, window_start = NOW()
                    WHERE session_id = %s
                    """,
                    (session_id,),
                )
                return True, limit_per_hour - 1

            if message_count >= limit_per_hour:
                return False, 0

            cur.execute(
                """
                UPDATE chatbot_rate_limits
                SET message_count = message_count + 1
                WHERE session_id = %s
                RETURNING message_count
                """,
                (session_id,),
            )
            updated_count = cur.fetchone()[0]
            return True, max(0, limit_per_hour - updated_count)


def get_remaining_rate_limit(session_id: str, limit_per_hour: int = 10) -> int:
    pool = _require_pool()
    now = _utcnow()
    window_cutoff = now - timedelta(hours=1)

    with pool.connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT message_count, window_start FROM chatbot_rate_limits WHERE session_id = %s",
                (session_id,),
            )
            row = cur.fetchone()

            if row is None:
                return limit_per_hour

            message_count, window_start = row
            if window_start < window_cutoff:
                return limit_per_hour

            return max(0, limit_per_hour - message_count)