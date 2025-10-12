import sqlite3

from ..constants.config import DB_PATH


def init_bank_table():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS bank_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            description TEXT,
            amount REAL,
            balance REAL,
            type TEXT,
            source_bank TEXT,
            UNIQUE(date, description, amount, balance, type, source_bank)
        )
        """
    )
    conn.commit()
    conn.close()


def insert_bank_records(df):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    inserted_count = 0

    for _, row in df.iterrows():
        try:
            cur.execute(
                """
                INSERT INTO bank_records
                (date, description, amount, balance, type, source_bank)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    row.get("Date"),
                    row.get("Description"),
                    row.get("Amount"),
                    row.get("Balance"),
                    row.get("Type"),
                    row.get("SourceBank"),
                ),
            )
            inserted_count += 1
        except sqlite3.IntegrityError:
            pass

    conn.commit()
    conn.close()

    return inserted_count


def get_bank_records(source_bank=None, start_date=None, end_date=None):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    query = "SELECT id, date, description, amount, balance, type, source_bank FROM bank_records WHERE 1=1"
    params = []

    if source_bank:
        query += " AND source_bank = ?"
        params.append(source_bank)

    if start_date:
        query += " AND date >= ?"
        params.append(start_date)

    if end_date:
        query += " AND date <= ?"
        params.append(end_date)

    cur.execute(query, params)
    rows = cur.fetchall()
    conn.close()

    columns = ["id", "date", "description", "amount", "balance", "type", "source_bank"]
    return [dict(zip(columns, row)) for row in rows]
