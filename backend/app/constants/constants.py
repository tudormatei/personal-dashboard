# Apple Health
RELEVANT_RECORD_TYPES = {
    "HKQuantityTypeIdentifierBodyMass",

    "HKQuantityTypeIdentifierDietaryEnergyConsumed",
    "HKQuantityTypeIdentifierDietaryProtein",
    "HKQuantityTypeIdentifierDietaryCarbohydrates",
    "HKQuantityTypeIdentifierDietaryFatTotal",
    "HKQuantityTypeIdentifierDietaryFiber",
}

RELEVANT_WORKOUT_TYPES = {
    "HKWorkoutActivityTypeTraditionalStrengthTraining",
}

MACRO_TYPES = {
    "calories": "HKQuantityTypeIdentifierDietaryEnergyConsumed",
    "protein": "HKQuantityTypeIdentifierDietaryProtein",
    "carbs": "HKQuantityTypeIdentifierDietaryCarbohydrates",
    "fat": "HKQuantityTypeIdentifierDietaryFatTotal",
    "fiber": "HKQuantityTypeIdentifierDietaryFiber"
}

AVERAGE_LIFTING_CALORIES = 400
LIFTING_SESSIONS_PER_WEEK = 5
AVERAGE_DAYS_PER_MONTH = 30.436875


# IBKR Flex Queries
BASE_URL = "https://ndcdyn.interactivebrokers.com/AccountManagement/FlexWebService"
FLEX_VERSION = 3
ACCOUNT_INCEPTION = "2024-09-01"
DATE_FMT = "%Y-%m-%d"
