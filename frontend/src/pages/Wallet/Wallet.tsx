import { H2 } from "../../components/Typography/Headings";
import Analytics from "./Analytics";
import Summary from "./Summary";
import Transactions from "./Transactions";

const Wallet = () => {
  return (
    <>
      <H2>My Wallet</H2>

      <Summary />
      <Transactions />
      <Analytics />
    </>
  );
};

export default Wallet;
