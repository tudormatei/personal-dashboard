import { H1 } from "../../components/Typography/Headings";
import Summary from "./Summary";
import Transactions from "./Transactions";

const Wallet = () => {
  return (
    <>
      <H1>My Wallet</H1>

      <Summary />
      <Transactions />
    </>
  );
};

export default Wallet;
