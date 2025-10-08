import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import Loader from "../../components/Loader/Loader";
import Alert from "../../components/Alert/Alert";
import type { TWRPoint } from "../../types/types";

type MonteCarloProjection = {
  date: string;
  p5: number;
  p25: number;
  p50: number;
  p75: number;
  p95: number;
  baseline: number;
};

type MonteCarloSimulationProps = {
  startValue: number;
  twrSeries: TWRPoint[];
};

const MonteCarloSimulation = ({
  startValue,
  twrSeries,
}: MonteCarloSimulationProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projection, setProjection] = useState<MonteCarloProjection[]>([]);

  const [monthlyDeposit, setMonthlyDeposit] = useState(200);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(0);
  const [daysAhead, setDaysAhead] = useState(100);
  const [sims, setSims] = useState(5000);

  const startSimulation = async () => {
    setLoading(true);
    setError(null);
    try {
      const body = {
        start_value: startValue,
        twr_series: twrSeries,
        monthly_deposit: monthlyDeposit,
        monthly_withdrawal: monthlyWithdrawal,
        days_ahead: daysAhead,
        sims: sims,
      };
      const res = await fetch("/api/monte-carlo-simulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      const poll = async () => {
        const resultRes = await fetch(
          `/api/monte-carlo-simulations/${data.job_id}`
        );
        const resultData = await resultRes.json();
        if (resultData.status === "finished") {
          setProjection(resultData.result.portfolioProjection);
          setLoading(false);
        } else {
          setTimeout(poll, 1000);
        }
      };
      poll();
    } catch {
      setError("Failed to run simulation");
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Monte Carlo Portfolio Projection</h2>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        <div>
          <label>Monthly Deposit ($)</label>
          <input
            type="number"
            value={monthlyDeposit}
            onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Monthly Withdrawal ($)</label>
          <input
            type="number"
            value={monthlyWithdrawal}
            onChange={(e) => setMonthlyWithdrawal(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Days Ahead</label>
          <input
            type="number"
            value={daysAhead}
            onChange={(e) => setDaysAhead(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Number of Simulations</label>
          <input
            type="number"
            value={sims}
            onChange={(e) => setSims(Number(e.target.value))}
          />
        </div>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <button onClick={startSimulation} disabled={loading}>
            {loading ? "Running..." : "Start Simulation"}
          </button>
        </div>
      </div>

      {error && <Alert text={error} type="error" />}
      {loading && <Loader text="Simulating future portfolio..." />}

      {projection.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={projection}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="p5"
              stroke="#d32f2f"
              dot={false}
              name="5th percentile"
            />
            <Line
              type="monotone"
              dataKey="p25"
              stroke="#f57c00"
              dot={false}
              name="25th percentile"
            />
            <Line
              type="monotone"
              dataKey="p50"
              stroke="#1976d2"
              dot={false}
              name="Median"
            />
            <Line
              type="monotone"
              dataKey="p75"
              stroke="#388e3c"
              dot={false}
              name="75th percentile"
            />
            <Line
              type="monotone"
              dataKey="p95"
              stroke="#7b1fa2"
              dot={false}
              name="95th percentile"
            />
            <Line
              type="monotone"
              dataKey="baseline"
              stroke="#eeff00"
              dot={false}
              name="Baseline"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MonteCarloSimulation;
