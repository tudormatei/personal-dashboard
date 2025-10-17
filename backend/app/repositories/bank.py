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
            unified_balance REAL,
            type TEXT,
            source_bank TEXT,
            orig_index INTEGER,
            UNIQUE(date, description, amount, balance, source_bank)
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
                (date, description, amount, balance, unified_balance, type, source_bank, orig_index)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    row.get("Date"),
                    row.get("Description"),
                    row.get("Amount"),
                    row.get("Balance"),
                    row.get("UnifiedBalance"),
                    row.get("Type"),
                    row.get("SourceBank"),
                    row.get("orig_index"),
                ),
            )
            inserted_count += 1
        except sqlite3.IntegrityError:
            pass

    conn.commit()
    conn.close()

    return inserted_count


def get_bank_records(
    source_bank=None,
    start_date=None,
    end_date=None,
    description=None,
    order: str = "asc",
    page: int | None = 1,
    page_size: int | None = 50,
):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    query = """
        SELECT id, date, description, amount, balance, unified_balance, type, source_bank, orig_index
        FROM bank_records
        WHERE 1=1
    """
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

    if description:
        query += " AND description LIKE ?"
        params.append(f"%{description}%")

    order = order.lower()
    if order not in ("asc", "desc"):
        order = "asc"

    count_query = f"SELECT COUNT(*) FROM ({query})"
    cur.execute(count_query, params)
    total_count = cur.fetchone()[0]

    if page is not None and page_size is not None:
        offset = (page - 1) * page_size
        query += f" ORDER BY date {order}, orig_index {order} LIMIT ? OFFSET ?"
        cur.execute(query, params + [page_size, offset])
    else:
        query += f" ORDER BY date {order}, orig_index {order}"
        cur.execute(query, params)

    rows = cur.fetchall()
    columns = [
        "id",
        "date",
        "description",
        "amount",
        "balance",
        "unified_balance",
        "type",
        "source_bank",
        "orig_index",
    ]
    records = [dict(zip(columns, row)) for row in rows]

    conn.close()
    return records, total_count


def get_all_banks():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        "SELECT DISTINCT source_bank FROM bank_records WHERE source_bank IS NOT NULL"
    )
    banks = [row[0] for row in cur.fetchall()]
    conn.close()
    return sorted(banks)
