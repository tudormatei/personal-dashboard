import io
from typing import List
import pandas as pd
import csv
import os

from ..repositories.bank import get_bank_records, insert_bank_records

from ..constants.bank import (
    DESC_IGNORE_KEYWORDS,
    EUR_RON_RATE,
    NUMBER_INGNL_COLUMNS,
    NUMBER_INGRO_COLUMNS,
    NUMBER_REVOLUT_COLUMNS,
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
    for bank, df in cleaned_statements.items():
        print(f"Bank statement: {bank} extracted {len(cleaned_statements[bank])} rows")

    pd.set_option("display.max_columns", None)
    for bank, df in cleaned_statements.items():
        if bank in {Bank.ING_RON}:
            print(f"\nTail of {bank.name} before merge:")
            print(df.tail(3))

    merged_dataframe = merge_bank_statements(cleaned_statements)
    for bank in [Bank.ING_RON]:
        print(f"\nTail of {bank.name} after merge:")
        print(merged_dataframe[merged_dataframe["SourceBank"] == bank.name].tail(3))
    print(f"Total merged df length {len(merged_dataframe)}")

    filtered_dataframe = filter_bank_records(merged_dataframe)
    for bank in [Bank.ING_RON]:
        print(f"\nTail of {bank.name} after filter:")
        print(filtered_dataframe[filtered_dataframe["SourceBank"] == bank.name].tail(3))
    print(f"Total filtered df length {len(filtered_dataframe)}")

    normalized_dataframe = normalize_bank_dataframe(filtered_dataframe)
    for bank in [Bank.ING_RON]:
        print(f"\nTail of {bank.name} after normalizing:")
        print(
            normalized_dataframe[normalized_dataframe["SourceBank"] == bank.name].head(
                3
            )
        )
    print(f"Total normalized df length {len(normalized_dataframe)}")

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

            if df["SourceBank"].str.lower().str.contains("ro").any():
                df[col] = df[col] / EUR_RON_RATE

    # first_balance = df.groupby("SourceBank")["Balance"].first().to_dict()
    # print(f"First balances {first_balance}")
    # bank_latest_balance = first_balance.copy()
    # unified_balances = []

    # for _, row in df.iterrows():
    #     bank = row["SourceBank"]
    #     if pd.notna(row["Balance"]):
    #         bank_latest_balance[bank] = row["Balance"]
    #     unified_balances.append(sum(bank_latest_balance.values()))

    df["UnifiedBalance"] = 0

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


def compute_summary(records):
    df = pd.DataFrame(records)
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0)

    total_in = df.loc[df["amount"] > 0, "amount"].sum()
    total_out = df.loc[df["amount"] < 0, "amount"].sum()

    return {
        "total_in": round(total_in, 2),
        "total_out": round(total_out, 2),
        "net_balance": round(total_in + total_out, 2),
    }


def get_bank_transactions(start_date, end_date, bank):
    records = get_bank_records(
        start_date=start_date, end_date=end_date, source_bank=bank
    )

    if not records:
        return None

    summary = compute_summary(records)

    return {
        "transactions": records,
        "summary": summary,
        "meta": {
            "count": len(records),
            "start_date": start_date,
            "end_date": end_date,
        },
    }
