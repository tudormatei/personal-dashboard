import { FaAppleAlt } from "react-icons/fa";
import { GiWeight } from "react-icons/gi";
import { LuDumbbell } from "react-icons/lu";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import {
  Grid,
  SectionCard,
  IconWrapper,
  SectionTitle,
  SectionDesc,
} from "./Home.styled";
import { H1, SubHeader } from "../../components/Typography/Headings";

const Home = () => (
  <>
    <H1 center>Welcome to Your Personal Dashboard</H1>
    <SubHeader center>
      Explore all features: health, nutrition, fitness, and
      investments—beautifully visualized and easy to use.
    </SubHeader>
    <Grid>
      <SectionCard>
        <IconWrapper>
          <GiWeight />
        </IconWrapper>
        <SectionTitle>Weight Tracking</SectionTitle>
        <SectionDesc>
          <ul>
            <li>📈 Interactive weight charts with moving averages</li>
            <li>🔎 Maintenance calorie estimation</li>
            <li>🎯 Progress insights and trends</li>
            <li>🌙 Dark mode optimized visuals</li>
          </ul>
        </SectionDesc>
      </SectionCard>
      <SectionCard>
        <IconWrapper>
          <FaAppleAlt />
        </IconWrapper>
        <SectionTitle>Macros Dashboard</SectionTitle>
        <SectionDesc>
          <ul>
            <li>
              🍽️ Daily nutrition breakdown: calories, protein, carbs, fat, fiber
            </li>
            <li>📊 Trend lines and moving averages</li>
            <li>🧮 Summary stats: totals, averages, min/max, std dev</li>
            <li>🌙 Consistent, elegant chart styling</li>
          </ul>
        </SectionDesc>
      </SectionCard>
      <SectionCard>
        <IconWrapper>
          <LuDumbbell />
        </IconWrapper>
        <SectionTitle>Workouts Overview</SectionTitle>
        <SectionDesc>
          <ul>
            <li>📅 Calendar heatmap of workout days</li>
            <li>🏆 Streaks, longest sessions, and activity stats</li>
            <li>📈 Charts for sessions by weekday, week, and month</li>
            <li>🌙 Modern, readable layouts</li>
          </ul>
        </SectionDesc>
      </SectionCard>
      <SectionCard>
        <IconWrapper>
          <FaMoneyBillTrendUp />
        </IconWrapper>
        <SectionTitle>Investments Monitor</SectionTitle>
        <SectionDesc>
          <ul>
            <li>💼 Portfolio allocation and open positions</li>
            <li>📊 Value over time, cash flows, and trades</li>
            <li>🧾 Detailed tables and interactive charts</li>
            <li>🌙 Financial data, styled for clarity</li>
          </ul>
        </SectionDesc>
      </SectionCard>
    </Grid>
  </>
);

export default Home;
