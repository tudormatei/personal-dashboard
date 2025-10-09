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
    "fiber": "HKQuantityTypeIdentifierDietaryFiber",
}
KCALPERKG = 7700

AVERAGE_LIFTING_CALORIES = 400
LIFTING_SESSIONS_PER_WEEK = 5
AVERAGE_DAYS_PER_MONTH = 30.436875
