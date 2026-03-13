import sqlite3
from typing import Optional

from ..constants.config import DB_PATH


def init_mastery_tables():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS mastery_activities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            max_hours REAL NOT NULL,
            total_hours REAL NOT NULL DEFAULT 0
        )
        """
    )

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS mastery_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            activity_id INTEGER NOT NULL,
            entry_date TEXT NOT NULL,
            hours REAL NOT NULL,
            FOREIGN KEY (activity_id) REFERENCES mastery_activities(id) ON DELETE CASCADE,
            UNIQUE(activity_id, entry_date)
        )
        """
    )

    conn.commit()
    conn.close()


def insert_activity(name: str, max_hours: float, total_hours: float) -> int:
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute(
        """
        INSERT INTO mastery_activities (name, max_hours, total_hours)
        VALUES (?, ?, ?)
        """,
        (name, max_hours, total_hours),
    )

    activity_id = cur.lastrowid
    conn.commit()
    conn.close()
    return activity_id


def fetch_activities():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute(
        """
        SELECT id, name, max_hours, total_hours
        FROM mastery_activities
        ORDER BY id DESC
        """
    )
    rows = cur.fetchall()
    conn.close()

    return [
        {
            "id": r[0],
            "name": r[1],
            "max_hours": r[2],
            "total_hours": r[3],
        }
        for r in rows
    ]


def fetch_activity(activity_id: int) -> Optional[dict]:
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute(
        """
        SELECT id, name, max_hours, total_hours
        FROM mastery_activities
        WHERE id = ?
        """,
        (activity_id,),
    )
    row = cur.fetchone()
    conn.close()

    if not row:
        return None

    return {
        "id": row[0],
        "name": row[1],
        "max_hours": row[2],
        "total_hours": row[3],
    }


def fetch_activity_history(activity_id: int):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute(
        """
        SELECT entry_date, hours
        FROM mastery_history
        WHERE activity_id = ?
        ORDER BY entry_date ASC
        """,
        (activity_id,),
    )
    rows = cur.fetchall()
    conn.close()

    return [{"date": r[0], "hours": r[1]} for r in rows]


def upsert_history_entry(activity_id: int, entry_date: str, hours: float):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute(
        """
        INSERT INTO mastery_history (activity_id, entry_date, hours)
        VALUES (?, ?, ?)
        ON CONFLICT(activity_id, entry_date)
        DO UPDATE SET hours = hours + excluded.hours
        """,
        (activity_id, entry_date, hours),
    )

    conn.commit()
    conn.close()


def update_activity_total_hours(activity_id: int, total_hours: float):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute(
        """
        UPDATE mastery_activities
        SET total_hours = ?
        WHERE id = ?
        """,
        (total_hours, activity_id),
    )

    conn.commit()
    conn.close()
