export interface MaintenanceData {
  estimated_maintenance_calories: number;
  kg_per_day: number;
  kg_per_week: number;
  kg_per_month: number;
  avg_daily_calories: number;
  pred_start_weight: number;
  pred_end_weight: number;
  total_weight_change: number;
  days_used: number;
}

export interface WeightRecord {
  date: string;
  value: number;
  ma7?: number | null;
  ma30?: number | null;
  ma90?: number | null;
}

export interface NutrientRecord {
  date: string;
  value: number;
  ma7?: number | null;
  ma30?: number | null;
  ma90?: number | null;
}

export interface NutrientData {
  daily: NutrientRecord[];
  summary: {
    total: number;
    average_per_day: number;
    min_per_day: number;
    max_per_day: number;
    std_dev: number;
  };
}

export interface MacrosData {
  calories: NutrientData;
  protein: NutrientData;
  carbs: NutrientData;
  fat: NutrientData;
  fiber: NutrientData;
}

export interface DailyWorkout {
  date: string;
  duration: number;
}

export interface WorkoutStat {
  daily_stats: DailyWorkout[];
  total_sessions: number;
  total_duration_min: number;
  avg_session_duration_min: number;
  longest_session_min: number;
  sessions_per_weekday: Record<string, number>;
  sessions_per_week: Record<string, number>;
  sessions_per_month: Record<string, number>;
  longest_streak_days: number;
}

export interface AccountInfo {
  currency: string | null;
  type: string | null;
  id: string | null;
}

export interface CashReportItem {
  starting: number;
  deposits: number;
  withdrawals: number;
  ending: number;
}

export interface StatementFund {
  amount: number;
  date: string;
}

export interface OpenPosition {
  currency: string;
  symbol: string;
  description: string;
  position: number;
  markPrice: number;
  positionValue: number;
  costBasisPrice: number;
  costBasisMoney: number;
  percentOfNAV: number;
  fxRateToBase: number;
}

export interface Trade {
  date: string;
  quantity: number;
  tradePrice: number;
  ibCommission: number;
  buySell: string;
  netCash: number;
  symbol: string;
}

export interface CashTransaction {
  date: string;
  amount: number;
  type: string;
  fxRateToBase: number;
}

export interface ValueOverTime {
  date: string;
  cash: number;
  total: number;
}

export interface InvestmentsData {
  reports: number;
  fromDate?: string;
  toDate?: string;
  account: AccountInfo;
  cashReport: CashReportItem[];
  statementFunds: StatementFund[];
  openPositions: OpenPosition[];
  valueOverTime: ValueOverTime[];
  trades: Trade[];
  cashTransactions: CashTransaction[];
}
