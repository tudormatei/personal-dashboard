import { H1 } from "../../components/Typography/Headings";
import Analytics from "./Analytics/Analytics";
import Summary from "./Summary";
import Transactions from "./Transactions/Transactions";

const Wallet = () => {
  return (
    <>
      <H1>Wallet Dashboard</H1>

      <Summary />
      <Transactions />
      <Analytics />
    </>
  );
};

export default Wallet;
