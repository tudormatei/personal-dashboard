from collections import defaultdict
from datetime import date, datetime, timedelta
import io
from typing import List
import pandas as pd
import csv
import os

from ..repositories.bank import get_all_banks, get_bank_records, insert_bank_records

from ..constants.bank import (
    DEFAULT_SUMMARY_AGGREGATION_DAYS,
    DESC_IGNORE_KEYWORDS,
    EUR_RON_RATE,
    NUMBER_INGNL_COLUMNS,
    NUMBER_INGRO_COLUMNS,
    NUMBER_REVOLUT_COLUMNS,
    TRANSACTION_CATEGORIES,
    Bank,
)


async def process_bank_files(files: List[dict]):
    dataframes = []

    for f in files:
        filename = f.get("filename", "unknown")
        content = f["contents"]

        ext = os.path.splitext(filename)[1].lower()

        if ext == ".xls":
            df = pd.read_excel(io.BytesIO(content), engine="xlrd", header=3)
        else:
            try:
                df = pd.read_csv(io.BytesIO(content), sep=None, engine="python")
            except pd.errors.ParserError:
                sample = content[:2048].decode("utf-8", errors="ignore")
                try:
                    dialect = csv.Sniffer().sniff(sample)
                    sep = dialect.delimiter
                except Exception:
                    sep = ";"
                df = pd.read_csv(io.BytesIO(content), sep=sep, engine="python")

        dataframes.append(df)

    statements = group_bank_statements(dataframes)
    cleaned_statements = clean_bank_statements(statements)
    merged_dataframe = merge_bank_statements(cleaned_statements)
    filtered_dataframe = filter_bank_records(merged_dataframe)
    normalized_dataframe = normalize_bank_dataframe(filtered_dataframe)

    inserted_rows = insert_bank_records(normalized_dataframe)

    return {"imported": inserted_rows}


def filter_bank_records(df):
    ignore_phrases = DESC_IGNORE_KEYWORDS

    condition = df["Type"].str.lower() != "exchange"

    for phrase in ignore_phrases:
        words = phrase.lower().split()
        condition &= (
            ~df["Description"]
            .str.lower()
            .apply(lambda desc: all(word in desc for word in words))
        )

    return df[condition]


def merge_bank_statements(statements):
    merged_dfs = [df for df in statements.values()]

    merged_df = pd.concat(merged_dfs, ignore_index=True, sort=False)

    if "Type" not in merged_df.columns:
        merged_df["Type"] = ""

    return merged_df


def clean_bank_statements(statements):
    # revolut:
    # remove columns "Product", "Completed Date", "Currency", "State", "Fee"
    # remove rows where balance is not there
    # rename "Started Date" column to "Date"
    # conver the date column to be just date format iso so YYYY-MM-DD, original its like this format "5/28/2023  11:52:54 AM"

    # ing ro:
    # rename column "Data" to "Date"
    # parse the datatime into just date iso format YYYY-MM-DD, original its like this format "2025-10-10 00:00:00"
    # rename column "Detalii tranzactie" to "Description"
    # combine the column "Debit" and "Credit" into a single column "Amount" debit is positive amount and credit is negative - one row will never have both set
    # rename column "Balanta" to "Balance"

    # ing nl:
    # rename column "Name / Description" to "Description"
    # remove columns "Account", "Counterparty", "Code", "Tag"
    # rename column "Amount (EUR)" to "Amount" - if on that specific row the column "Debit/credit" says "Debit" or "Credit" you do - for the amout or + respectively
    # delete column "Debit/credit"
    # rename column "Transaction type" to "Type"
    # rename column "Resulting balance" to "Balance"
    # take whatever is in column "Notifications" and append it to the "Description"
    # delete column "Notifications"
    # convert date yyyymmdd to yyyy-mm-dd

    # for ing ro and revolut ron we normalize to eur, so base currency is eur

    cleaned = {}

    for bank, df in statements.items():
        if bank in {Bank.REV_EUR, Bank.REV_RON}:
            cols_to_drop = ["Product", "Completed Date", "Currency", "State", "Fee"]
            df = df.drop(
                columns=[c for c in cols_to_drop if c in df.columns], errors="ignore"
            )

            if "Balance" in df.columns:
                df = df[df["Balance"].notna()]

            if "Started Date" in df.columns:
                df = df.rename(columns={"Started Date": "Date"})

            if "Date" in df.columns:
                df["Date"] = pd.to_datetime(df["Date"], errors="coerce")

        elif bank == Bank.ING_RON:
            rename_map = {
                "Data": "Date",
                "Detalii tranzactie": "Description",
                "Balanta": "Balance",
            }
            df = df.rename(columns=rename_map)

            if "Date" in df.columns:
                df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
                df = df.dropna(subset=["Date"])

            debit_col, credit_col = "Debit", "Credit"
            df["Amount"] = df.apply(
                lambda row: (
                    -row[debit_col] if pd.notna(row[debit_col]) else row[credit_col]
                ),
                axis=1,
            )

        elif bank == Bank.ING_EUR:
            cols_to_drop = ["Account", "Counterparty", "Code", "Tag"]
            df = df.drop(
                columns=[c for c in cols_to_drop if c in df.columns], errors="ignore"
            )

            rename_map = {
                "Name / Description": "Description",
                "Amount (EUR)": "Amount",
                "Transaction type": "Type",
                "Resulting balance": "Balance",
            }
            df = df.rename(columns=rename_map)

            df["Date"] = pd.to_datetime(df["Date"], format="%Y%m%d", errors="coerce")

            if "Debit/credit" in df.columns and "Amount" in df.columns:

                def adjust_amount(row):
                    amt = str(row["Amount"]).replace(",", ".").strip()
                    try:
                        amt = float(amt)
                    except ValueError:
                        amt = 0.0

                    if pd.isna(row["Debit/credit"]):
                        return amt
                    dc = str(row["Debit/credit"]).strip().lower()
                    if dc == "debit":
                        return -abs(amt)
                    elif dc == "credit":
                        return abs(amt)
                    else:
                        return amt

                df["Amount"] = df.apply(adjust_amount, axis=1)
                df = df.drop(columns=["Debit/credit"])

            if "Notifications" in df.columns:
                df["Description"] = df.apply(
                    lambda row: (
                        f"{row['Description']} | {row['Notifications']}"
                        if pd.notna(row["Notifications"])
                        else row["Description"]
                    ),
                    axis=1,
                )
                df = df.drop(columns=["Notifications"])

        df["SourceBank"] = bank.name

        # this is used just to preserve csv order in case the csv doesnt contain a time component
        # its annoying cause some csv have earliest date first or most recent one first so we have to flip
        if len(df) > 1:
            if df["Date"].iloc[0] <= df["Date"].iloc[-1]:
                df["orig_index"] = range(len(df))  # earliest first
            else:
                df = df.iloc[::-1].reset_index(
                    drop=True
                )  # most recent first so we flip
                df["orig_index"] = range(len(df))
        else:
            df["orig_index"] = [0]

        cleaned[bank] = df

    return cleaned


def normalize_bank_dataframe(df: pd.DataFrame):
    df = df.copy()

    # make sure transactions are in the cronological order, we also store the index in db so we can "save" the order
    df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
    df = df.dropna(subset=["Date"])
    df = df.sort_values(by=["Date", "orig_index"]).reset_index(drop=True)
    df["Date"] = df["Date"].dt.strftime("%Y-%m-%d %H:%M:%S")

    for col in ["Amount", "Balance"]:
        if col in df.columns:
            df[col] = (
                df[col]
                .astype(str)
                .str.replace(",", ".", regex=False)
                .str.replace(r"[^\d\.-]", "", regex=True)
            )
            df[col] = pd.to_numeric(df[col], errors="coerce")

    mask = df["SourceBank"].str.lower().str.contains("ro")
    df.loc[mask, ["Amount", "Balance"]] = (
        df.loc[mask, ["Amount", "Balance"]] / EUR_RON_RATE
    )

    first_balances = df.groupby("SourceBank")["Balance"].first().to_dict()
    first_amounts = df.groupby("SourceBank")["Amount"].first().to_dict()

    initial_bank_balances = {
        bank: first_balances[bank] - first_amounts[bank]
        for bank in first_balances.keys()
    }

    latest_balance = initial_bank_balances.copy()
    unified_balances = []

    for _, row in df.iterrows():
        bank = row["SourceBank"]
        latest_balance[bank] = row["Balance"]
        unified_balances.append(sum(latest_balance.values()))

    df["UnifiedBalance"] = unified_balances

    df = df.fillna("")
    df["Description"] = df["Description"].astype(str).str.strip()
    df["Type"] = df["Type"].astype(str).str.strip()
    df["SourceBank"] = df["SourceBank"].astype(str).str.strip()
    df["Amount"] = pd.to_numeric(df["Amount"], errors="coerce").round(2)
    df["Balance"] = pd.to_numeric(df["Balance"], errors="coerce").round(2)
    df["UnifiedBalance"] = pd.to_numeric(df["UnifiedBalance"], errors="coerce").round(2)

    return df


def group_bank_statements(dataframes: List[pd.DataFrame]):
    statements = {}
    for df in dataframes:
        length_columns = len(df.columns.values)
        if length_columns == NUMBER_INGRO_COLUMNS:
            statements[Bank.ING_RON] = df
        elif length_columns == NUMBER_INGNL_COLUMNS:
            statements[Bank.ING_EUR] = df
        elif length_columns == NUMBER_REVOLUT_COLUMNS:
            if df["Currency"].str.upper().eq("EUR").any():
                statements[Bank.REV_EUR] = df
            elif df["Currency"].str.upper().eq("RON").any():
                statements[Bank.REV_RON] = df

    return statements


def get_bank_transactions(
    start_date=None,
    end_date=None,
    bank=None,
    description=None,
    order=None,
    category=None,
    subcategory=None,
    page=1,
    page_size=50,
):
    use_sql_pagination = not category and not subcategory

    records, total_count = get_bank_records(
        start_date=start_date,
        end_date=end_date,
        source_bank=bank,
        description=description,
        order=order,
        page=page if use_sql_pagination else None,
        page_size=page_size if use_sql_pagination else None,
    )

    if not records:
        return None

    df = categorize_transactions(records)

    if category:
        df = df[df["category"].str.lower() == category.lower()]
    if subcategory:
        df = df[df["subcategory"].str.lower() == subcategory.lower()]

    if not use_sql_pagination:
        total_count = len(df)
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        df = df.iloc[start_idx:end_idx]

    total_pages = (total_count + page_size - 1) // page_size

    return {
        "transactions": df.to_dict(orient="records"),
        "pagination": {
            "page": page,
            "page_size": page_size,
            "total_count": total_count,
            "total_pages": total_pages,
        },
        "meta": {
            "start_date": start_date,
            "end_date": end_date,
        },
    }


def get_transaction_categories():
    categories = {}
    for key, val in TRANSACTION_CATEGORIES.items():
        categories[key] = val.keys()

    return {"categories": categories}


def categorize_transactions(transactions):
    transactions = pd.DataFrame(transactions)

    transactions["category"] = "Other"
    transactions["subcategory"] = ""

    for category, subcats in TRANSACTION_CATEGORIES.items():
        for subcat, keywords in subcats.items():
            mask = transactions["description"].str.contains(
                "|".join(keywords), case=False, na=False
            )
            transactions.loc[mask, ["category", "subcategory"]] = [category, subcat]

    return transactions


def get_distinct_banks():
    return {"banks": get_all_banks()}


def get_distinct_categories():
    categories = []
    for category in TRANSACTION_CATEGORIES.keys():
        categories.append(category)

    subcategories = []
    for category, subcats in TRANSACTION_CATEGORIES.items():
        for subcat, _ in subcats.items():
            subcategories.append(subcat)

    return {"categories": categories, "subcategories": subcategories}


def compute_summary(transactions):
    total_income = 0
    total_spent = 0

    for tx in transactions:
        amount = tx.get("amount") or 0
        if amount >= 0:
            total_income += amount
        else:
            total_spent += abs(amount)

    return {
        "total_income": total_income,
        "total_spent": total_spent,
        "net_savings": total_income - total_spent,
    }


def compute_daily_flows(transactions_df: pd.DataFrame, aggregate_days):
    transactions_df["date"] = pd.to_datetime(transactions_df["date"])

    transactions_df["inflow"] = transactions_df["amount"].apply(
        lambda x: x if x > 0 else 0
    )
    transactions_df["outflow"] = transactions_df["amount"].apply(
        lambda x: abs(x) if x < 0 else 0
    )

    if aggregate_days == 7:
        transactions_df["period"] = (
            transactions_df["date"]
            .dt.to_period("W")
            .apply(lambda p: p.start_time.date())
        )
    elif aggregate_days == 30:
        transactions_df["period"] = (
            transactions_df["date"]
            .dt.to_period("M")
            .apply(lambda p: p.start_time.date())
        )
    else:
        transactions_df["period"] = transactions_df["date"].dt.date

    summary = (
        transactions_df.sort_values("date")
        .groupby("period", as_index=False)
        .agg(
            inflow=("inflow", "sum"),
            outflow=("outflow", "sum"),
            unified_balance=("unified_balance", "last"),
        )
        .rename(columns={"period": "date"})
        .sort_values("date")
    )

    return [
        {
            "date": row["date"],
            "inflow": float(row["inflow"]),
            "outflow": float(row["outflow"]),
            "unified_balance": (
                float(row["unified_balance"])
                if row["unified_balance"] is not None
                else None
            ),
        }
        for _, row in summary.iterrows()
    ]


def get_full_summary(aggregate_days):
    records, _ = get_bank_records(page=None, page_size=None)
    if not records:
        return None

    transactions_df = categorize_transactions(records)
    summary = compute_summary(records)
    chart_data = compute_daily_flows(
        transactions_df,
        aggregate_days if aggregate_days else DEFAULT_SUMMARY_AGGREGATION_DAYS,
    )

    return {
        "summary": summary,
        "chart_data": chart_data,
    }
