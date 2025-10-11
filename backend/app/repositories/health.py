import sqlite3

from ..constants.config import DB_PATH
from ..models.health import HealthRecord, WorkoutSession


def init_health_tables():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS health_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT,
            date TEXT,
            value REAL
        )
    """
    )

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS workouts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            start TEXT NOT NULL,
            end TEXT NOT NULL,
            duration_min REAL NOT NULL
        )
    """
    )
    conn.commit()
    conn.close()


def insert_health_records(records: list[HealthRecord]):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute("DELETE FROM health_records")
    cur.execute("DELETE FROM sqlite_sequence WHERE name='health_records'")

    cur.executemany(
        "INSERT INTO health_records (type, date, value) VALUES (?, ?, ?)",
        [(r.type, r.date.isoformat(), r.value) for r in records],
    )
    conn.commit()
    conn.close()


def insert_workouts(workouts: list[WorkoutSession]):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("DELETE FROM workouts")
    cur.execute("DELETE FROM sqlite_sequence WHERE name='workouts'")
    cur.executemany(
        "INSERT INTO workouts (type, start, end, duration_min) VALUES (?, ?, ?, ?)",
        [
            (w.type, w.start.isoformat(), w.end.isoformat(), w.duration_min)
            for w in workouts
        ],
    )
    conn.commit()
    conn.close()


def fetch_records(
    record_type: str = None, start_date: str = None, end_date: str = None
):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    query = "SELECT type, date, value FROM health_records WHERE 1=1"
    params = []

    if record_type:
        query += " AND type = ?"
        params.append(record_type)
    if start_date:
        query += " AND date >= ?"
        params.append(start_date)
    if end_date:
        query += " AND date <= ?"
        params.append(end_date)

    cur.execute(query, params)
    rows = cur.fetchall()
    conn.close()
    return [{"type": r[0], "date": r[1], "value": r[2]} for r in rows]


def fetch_workouts(
    record_type: str = None, start_date: str = None, end_date: str = None
):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    query = "SELECT type, start, end, duration_min FROM workouts WHERE 1=1"
    params = []

    if record_type:
        query += " AND type = ?"
        params.append(record_type)
    if start_date:
        query += " AND start >= ?"
        params.append(start_date)
    if end_date:
        query += " AND end <= ?"
        params.append(end_date)

    cur.execute(query, params)
    rows = cur.fetchall()
    conn.close()

    return [
        {"type": r[0], "start": r[1], "end": r[2], "duration_min": r[3]} for r in rows
    ]
