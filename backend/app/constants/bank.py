from enum import Enum

NUMBER_REVOLUT_COLUMNS = 10
NUMBER_INGRO_COLUMNS = 5
NUMBER_INGNL_COLUMNS = 11

EUR_RON_RATE = 5.06


class Bank(Enum):
    ING_RO = "ing_ro"
    ING_NL = "ing_nl"
    REV_RON = "rev_ron"
    REV_EUR = "rev_eur"
