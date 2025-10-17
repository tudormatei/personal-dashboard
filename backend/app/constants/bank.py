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
        "J.P. MORGAN",
    ]
)

DEFAULT_SUMMARY_AGGREGATION_DAYS = 7

TRANSACTION_CATEGORIES = {
    "Food": {
        "Supermarkets": {
            "mega image",
            "coop",
            "Albert Heijn",
            "lidl",
            "jumbo",
            "CARREFOUR",
            "aldi",
        },
        "Convenience Stores": {"1 minute", "relay"},
        "Restaurants": {"DONCAFE", "restaurant", "sushi"},
        "Cafe": {"Bubble Tea", "cafea", "coffee", "FIVE TO GO", "starbucks"},
        "Online Ordering": {"glovo"},
    },
    "Health & Fitness": {
        "Supplements": {"myprotein", "bulk", "Medikamente"},
        "Personal Care": {"BARBERSHOP", "TOPVORM"},
        "GYM": {"world class", "1WVJ7W", "SPORTCENTRUM", "BigGym", "Gym"},
    },
    "Travel": {
        "Flights": {"klm", "1WVJ7W"},
        "Vacation": {
            "Kazarma",
            "Kouka Marina",
            "Manos",
            "Crepaland Mykonos",
            "Cavo Psarou Mykonos",
            "Boho Parnikg",
            "maria pricop",
            "amsterdam",
            "brasov",
            "COURMAYEUR",
            "groningen",
            "BIARRITZ",
            "anglet",
            "new york" "newyork",
            "Stone Street Tavern",
            "Junior's",
            "sinaia",
            "las vegas",
            "ibiza",
            "los angeles",
            "universal city",
            "hollywood",
        },
    },
    "Transport": {
        "Taxi": {"uber", "bolt"},
        "Public Transport": {
            "metrorex",
            "NS.NL",
            "ovpay",
            "gvb",
            "ns schiphol",
            "Buckaroo",
            "MTA",
        },
    },
    "Shopping": {
        "Online Retail": {
            "amazon",
            "amzn",
            "shein",
            "emag",
            "etsy",
            "bol.com",
            "TRENDHIM",
            "buzz",
        },
        "Clothes": {"pull and bear", "h&m", "BERSHKA", "gymshark", "PULL&BEAR"},
        "General Store": {"action"},
    },
    "Entertainment": {
        "Streaming": {"netflix", "spotify", "AMZNPRIME", "amazon prime", "prime video"},
        "Gaming": {"steam", "riot", "kinguin", "g2a", "Gamivo"},
    },
    "Career": {"Courses": {"coursera", "LEETCODE"}},
    "Bills": {
        "Tech": {"Hostico", "AWESOME PROJECTS", "Sitebunker"},
        "Insurence": {"AON"},
        "Municipality": {
            "GBLT",
            "Gemeente",
            "International People Mobility",
            "GBTWENTE",
        },
        "Bank": {"Kosten OranjePakket"},
        "Rent": {" rent ", "harveer"},
        "Utilities": {
            " gas ",
            "electric",
            "internet",
            "water",
            "Utilities",
            "ziggo",
            "Vattenfall",
            "VITENS",
        },
    },
}


class Bank(Enum):
    ING_RON = "ing_ron"
    ING_EUR = "ing_eur"
    REV_RON = "rev_ron"
    REV_EUR = "rev_eur"
