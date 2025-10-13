from enum import Enum

NUMBER_REVOLUT_COLUMNS = 10
NUMBER_INGRO_COLUMNS = 5
NUMBER_INGNL_COLUMNS = 11

EUR_RON_RATE = 5.06

DESC_IGNORE_KEYWORDS = set(
    [
        "wise",
        "tudor matei",
        "exchanged",
        "exchange",
        "tudor alexandru",
        "balance migration",
        "J.P. MORGAN"
    ]
)


class Bank(Enum):
    ING_RON = "ing_ron"
    ING_EUR = "ing_eur"
    REV_RON = "rev_ron"
    REV_EUR = "rev_eur"
