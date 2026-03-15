from typing import Dict, List, Optional
from pydantic import BaseModel
from datetime import date


class UploadResponse(BaseModel):
    imported: int


class WeightResponse(BaseModel):
    date: date
    value: float
    ma7: Optional[float] = None
    ma30: Optional[float] = None
    ma90: Optional[float] = None


class WeightTrendMetrics(BaseModel):
    pred_start_weight: float
    pred_end_weight: float
    total_weight_change: float
    kg_per_day: float
    kg_per_week: float
    kg_per_month: float
    days_used: int
    goal_weight: int
    progress_pct: Optional[float]
    estimated_days_to_goal: Optional[int]


class CalorieMetrics(BaseModel):
    estimated_maintenance_calories: Optional[int]
    avg_daily_calories: Optional[int]


class MaintenanceEstimate(BaseModel):
    weight_metrics: Optional[WeightTrendMetrics]
    calorie_metrics: Optional[CalorieMetrics]


class DailyNutrient(BaseModel):
    date: date
    value: int
    ma7: Optional[int] = None
    ma30: Optional[int] = None
    ma90: Optional[int] = None


class NutrientStats(BaseModel):
    daily: List[DailyNutrient]
    summary: Dict[str, int]


class WorkoutDaily(BaseModel):
    date: date
    duration: int


class WorkoutStats(BaseModel):
    daily_stats: List[WorkoutDaily]
    total_sessions: int
    total_duration_min: int
    avg_session_duration_min: int
    longest_session_min: int
    sessions_per_weekday: Dict[str, int]
    sessions_per_week: Dict[str, int]
    sessions_per_month: Dict[str, int]
    longest_streak_days: int
