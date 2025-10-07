from datetime import datetime
from datetime import datetime, timedelta
import os
from typing import Any, Dict, List, Optional
import aiohttp
import xmltodict
import asyncio

from ..constants.constants import ACCOUNT_INCEPTION, BASE_URL, DATE_FMT, FLEX_VERSION


async def request_full_period(start_date: str, end_date: str):
    start = max(
        datetime.strptime(start_date, DATE_FMT),
        datetime.strptime(ACCOUNT_INCEPTION, DATE_FMT)
    )
    end = datetime.strptime(end_date, DATE_FMT)

    today = datetime.today().date()
    if end.date() >= today:
        end = datetime.combine(today - timedelta(days=1), datetime.min.time())

    all_reports = []
    chunk_start = start

    while chunk_start <= end:
        chunk_end = min(chunk_start + timedelta(days=364), end)

        report = await request_financial_data(
            start_date=chunk_start.strftime(DATE_FMT),
            end_date=chunk_end.strftime(DATE_FMT),
        )
        if (report):
            all_reports.append(report)

        chunk_start = chunk_end + timedelta(days=1)

    if len(all_reports) == 0:
        return None

    merged_report = merge_reports(all_reports)

    return merged_report


async def request_financial_data(start_date:  Optional[str] = None, end_date:  Optional[str] = None):
    token = os.getenv("FLEX_TOKEN")
    query_id = os.getenv("QUERY_ID")
    if not token or not query_id:
        raise ValueError(
            "Set FLEX_TOKEN and QUERY_ID environment variables first")

    send_params = {"t": token, "q": query_id, "v": FLEX_VERSION}
    if start_date:
        send_params["fd"] = start_date.replace("-", "")
    if end_date:
        send_params["td"] = end_date.replace("-", "")

    headers = {"User-Agent": "Python/3.10"}

    async with aiohttp.ClientSession(headers=headers) as session:
        async with session.get(f"{BASE_URL}/SendRequest", params=send_params) as resp:
            send_text = await resp.text()
            send_data = xmltodict.parse(send_text)

        status = send_data["FlexStatementResponse"]["Status"]
        if status != "Success":
            error_code = send_data["FlexStatementResponse"].get("ErrorCode")
            if error_code == "1003":
                print(f"No statement available for {start_date} → {end_date}")
                return None
            raise RuntimeError(f"SendRequest failed: {send_data}")

        ref_code = send_data["FlexStatementResponse"]["ReferenceCode"]
        await asyncio.sleep(2)
        get_statement_params = send_params.copy()
        get_statement_params["q"] = ref_code
        for _ in range(10):
            async with session.get(f"{BASE_URL}/GetStatement",
                                   params=get_statement_params) as resp:
                text = await resp.text()
            if "<Status>Warn</Status>" in text or "<Status>Fail</Status>" in text:
                await asyncio.sleep(3)
                continue
            report_dict = xmltodict.parse(text, postprocessor=type_converter)
            return report_dict

        raise TimeoutError("Report not ready after waiting")


def type_converter(path, key, value):
    if "date" in key.lower():
        return key, value

    if isinstance(value, str):
        if value.isdigit():
            return key, int(value)
        try:
            num = float(value)
            return key, round(num, 2)
        except ValueError:
            return key, value
    return key, value


def merge_reports(all_reports: List[Dict[str, Any]]) -> Dict[str, Any]:
    response = {
        "reports": len(all_reports),
        "fromDate": all_reports[0]['FlexQueryResponse']['FlexStatements']['FlexStatement']['@fromDate'],
        "toDate":  all_reports[-1]['FlexQueryResponse']['FlexStatements']['FlexStatement']['@toDate'],
        "account": {
            "currency": None,
            "type": None,
            "id": None
        },
        "valueOverTime": [],
        "cashReport": {
            "starting": None,
            "ending": None,
            "deposits": None,
            "withdrawals": None
        },
        "statementFunds": [],
        "openPositions": [],
        "trades": [],
        "cashTransactions": []
    }

    # one time account info
    response['account']['currency'] = all_reports[0]['FlexQueryResponse']['FlexStatements']['FlexStatement']['AccountInformation']['@currency']
    response['account']['type'] = all_reports[0]['FlexQueryResponse']['FlexStatements']['FlexStatement']['AccountInformation']['@accountType']
    response['account']['id'] = all_reports[0]['FlexQueryResponse']['FlexStatements']['FlexStatement']['AccountInformation']['@accountId']

    # one time open positions from last date
    open_positions = all_reports[-1]['FlexQueryResponse']['FlexStatements']['FlexStatement']['OpenPositions']['OpenPosition']
    for position in open_positions:
        response['openPositions'].append({
            "currency": position['@currency'],
            "symbol": position['@symbol'],
            "description": position['@description'],
            "position": position['@position'],
            "markPrice": position['@markPrice'],
            "positionValue": position['@positionValue'],
            "costBasisPrice": position['@costBasisPrice'],
            "costBasisMoney": position['@costBasisMoney'],
            "percentOfNAV": position['@percentOfNAV'],
            "fxRateToBase": position['@fxRateToBase'],
        })

    response['cashReport']['starting'] = all_reports[0]['FlexQueryResponse'][
        'FlexStatements']['FlexStatement']['CashReport']['CashReportCurrency']['@startingCash']
    response['cashReport']['ending'] = all_reports[0]['FlexQueryResponse'][
        'FlexStatements']['FlexStatement']['CashReport']['CashReportCurrency']['@endingCash']
    response['cashReport']['deposits'] = 0
    response['cashReport']['withdrawals'] = 0

    for report in all_reports:
        statement = report['FlexQueryResponse']['FlexStatements']['FlexStatement']

        cash_report = statement['CashReport']['CashReportCurrency']
        response['cashReport']['deposits'] += cash_report['@deposits']
        response['cashReport']['withdrawals'] += cash_report['@withdrawals']

        statement_funds = statement['StmtFunds']['StatementOfFundsLine']
        for s in statement_funds:
            response['statementFunds'].append({
                "amount": s['@amount'],
                "symbol": s["@symbol"],
                "date": s['@date'],
                "activityCode": s["@activityCode"],
                "activityDescription": s["@activityDescription"]
            })

        statement_trades = statement['Trades']['Trade']
        for t in statement_trades:
            response['trades'].append({
                "date": t["@tradeDate"],
                "quantity": t["@quantity"],
                "tradePrice": t["@tradePrice"],
                "ibCommission": t["@ibCommission"],
                "buySell": t["@buySell"],
                "netCash": t["@netCash"],
                "symbol": t["@symbol"]
            })

        statement_cash_transaction = statement['CashTransactions']['CashTransaction']
        for c in statement_cash_transaction:
            response['cashTransactions'].append({
                "date": c["@dateTime"],
                "amount": c["@amount"],
                "type": c["@type"],
                "fxRateToBase": c["@fxRateToBase"],
            })

        statement_equity = statement['EquitySummaryInBase']['EquitySummaryByReportDateInBase']
        for e in statement_equity:
            response['valueOverTime'].append({
                "date": e["@reportDate"],
                "cash": e["@cash"],
                "total": e["@total"]
            })

    response["valueOverTime"].sort(
        key=lambda x: datetime.strptime(x["date"], "%Y%m%d")
    )
    response["statementFunds"].sort(
        key=lambda x: datetime.strptime(x["date"], "%Y%m%d")
    )

    response["timeWeightedReturn"] = compute_time_weighted_return(
        response["valueOverTime"],
        response["statementFunds"]
    )

    return response


def compute_time_weighted_return(value_over_time, statement_funds):
    value_over_time = sorted(value_over_time, key=lambda x: x["date"])
    cash_flows = sorted(
        [
            {"date": s["date"], "amount": float(s["amount"])}
            for s in statement_funds
            if s.get("activityCode") in ("DEP", "WITH")
        ],
        key=lambda x: x["date"],
    )

    twr = 1.0
    prev_value = float(value_over_time[0]["total"])
    cf_index = 0
    cf_len = len(cash_flows)

    twr_timeseries = [
        {"date": value_over_time[0]["date"], "twr": 0.0}
    ]

    for i in range(1, len(value_over_time)):
        date = value_over_time[i]["date"]
        curr_value = float(value_over_time[i]["total"])

        net_cf = 0.0
        while cf_index < cf_len and cash_flows[cf_index]["date"] <= date:
            net_cf += cash_flows[cf_index]["amount"]
            cf_index += 1

        denominator = prev_value + net_cf
        if denominator <= 0:
            continue

        sub_return = (curr_value - denominator) / denominator
        twr *= (1 + sub_return)

        twr_timeseries.append({
            "date": date,
            "twr": round((twr - 1) * 100, 2)
        })

        prev_value = curr_value

    total_twr = (twr - 1) * 100
    return {
        "total": round(total_twr, 2),
        "series": twr_timeseries
    }
