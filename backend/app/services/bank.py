import io
from typing import List
import pandas as pd
import csv
import os

from ..repositories.bank import insert_bank_records

from ..constants.bank import (
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
    merged_dataframe = merge_bank_statements(cleaned_statements)

    insert_bank_records(merged_dataframe)

    return {"imported": len(merged_dataframe)}


def merge_bank_statements(statements):
    merged_dfs = []

    for df in statements.values():
        merged_dfs.append(df)

    merged_df = pd.concat(merged_dfs, ignore_index=True, sort=False)

    merged_df["Date"] = pd.to_datetime(merged_df["Date"], errors="coerce")

    merged_df = merged_df.sort_values(by="Date").reset_index(drop=True)

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
                df["Date"] = pd.to_datetime(df["Date"], errors="coerce").dt.date.astype(
                    str
                )

        elif bank == Bank.ING_RO:
            rename_map = {
                "Data": "Date",
                "Detalii tranzactie": "Description",
                "Balanta": "Balance",
            }
            df = df.rename(columns=rename_map)

            if "Date" in df.columns:
                df["Date"] = pd.to_datetime(df["Date"], errors="coerce").dt.date.astype(
                    str
                )

            debit_col, credit_col = "Debit", "Credit"
            if debit_col in df.columns and credit_col in df.columns:
                df["Amount"] = df[debit_col].fillna(0) - df[credit_col].fillna(0)
                df = df.drop(columns=[debit_col, credit_col])

        elif bank == Bank.ING_NL:
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

            df["Date"] = df["Date"].dt.strftime("%Y-%m-%d")

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

        df = normalize_numeric_columns(df, bank)
        df["SourceBank"] = bank.name

        cleaned[bank] = df

    return cleaned


def normalize_numeric_columns(df: pd.DataFrame, bank):
    for col in ["Amount", "Balance"]:
        if col in df.columns:
            df[col] = (
                df[col]
                .astype(str)
                .str.replace(",", ".", regex=False)
                .str.replace(r"[^\d\.-]", "", regex=True)
            )
            df[col] = pd.to_numeric(df[col], errors="coerce")

            if "ro" in bank.name.lower():
                df[col] = df[col] / EUR_RON_RATE

    return df


def group_bank_statements(dataframes: List[pd.DataFrame]):
    statements = {}
    for df in dataframes:
        length_columns = len(df.columns.values)
        if length_columns == NUMBER_INGRO_COLUMNS:
            statements[Bank.ING_RO] = df
        elif length_columns == NUMBER_INGNL_COLUMNS:
            statements[Bank.ING_NL] = df
        elif length_columns == NUMBER_REVOLUT_COLUMNS:
            if df["Currency"].str.upper().eq("EUR").any():
                statements[Bank.REV_EUR] = df
            elif df["Currency"].str.upper().eq("RON").any():
                statements[Bank.REV_RON] = df

    return statements
