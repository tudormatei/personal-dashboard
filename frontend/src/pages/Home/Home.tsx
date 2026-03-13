import { FaAppleAlt, FaWallet } from "react-icons/fa";
import { GiWeight } from "react-icons/gi";
import { LuDumbbell } from "react-icons/lu";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { FaBullseye } from "react-icons/fa";
import {
  Grid,
  SectionCard,
  IconWrapper,
  SectionTitle,
  SectionDesc,
  CardHeader,
} from "./Home.styled";
import { H1, SubHeader } from "../../components/Typography/Headings";

const Home = () => (
  <>
    <H1 center>Welcome to Your Personal Dashboard</H1>
    <SubHeader center>
      Explore all features: health, nutrition, fitness, investments, expenses
      and habits—beautifully visualized and easy to use.
    </SubHeader>
    <Grid>
      <SectionCard>
        <CardHeader>
          <SectionTitle>Weight Tracking</SectionTitle>
          <IconWrapper>
            <GiWeight />
          </IconWrapper>
        </CardHeader>
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
        <CardHeader>
          <SectionTitle>Macros Dashboard</SectionTitle>
          <IconWrapper>
            <FaAppleAlt />
          </IconWrapper>
        </CardHeader>
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
        <CardHeader>
          <SectionTitle>Workouts Overview</SectionTitle>
          <IconWrapper>
            <LuDumbbell />
          </IconWrapper>
        </CardHeader>
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
        <CardHeader>
          <SectionTitle>Investments Monitor</SectionTitle>
          <IconWrapper>
            <FaMoneyBillTrendUp />
          </IconWrapper>
        </CardHeader>
        <SectionDesc>
          <ul>
            <li>💼 Portfolio allocation and open positions</li>
            <li>📊 Value over time, cash flows, and trades</li>
            <li>🧾 Detailed tables and interactive charts</li>
            <li>🌙 Financial data, styled for clarity</li>
          </ul>
        </SectionDesc>
      </SectionCard>
      <SectionCard>
        <CardHeader>
          <SectionTitle>Wallet Dashboard</SectionTitle>
          <IconWrapper>
            <FaWallet />
          </IconWrapper>
        </CardHeader>
        <SectionDesc>
          <ul>
            <li>💰 Financial summary: income, expenses, net savings</li>
            <li>📊 Cash flow charts and spending trends</li>
            <li>📋 Transaction history with advanced filtering</li>
            <li>🥧 Category breakdowns and spending analytics</li>
            <li>🔄 Recurring transactions tracking</li>
          </ul>
        </SectionDesc>
      </SectionCard>
      <SectionCard>
        <CardHeader>
          <SectionTitle>Mastery Tracker</SectionTitle>
          <IconWrapper>
            <FaBullseye />
          </IconWrapper>
        </CardHeader>
        <SectionDesc>
          <ul>
            <li>🎯 Track hours toward mastery of any skill</li>
            <li>🔥 Daily streaks and practice consistency</li>
            <li>📊 Progress rings and milestone levels</li>
            <li>🏆 Unlock ranks on the path to mastery</li>
          </ul>
        </SectionDesc>
      </SectionCard>
    </Grid>
  </>
);

export default Home;
