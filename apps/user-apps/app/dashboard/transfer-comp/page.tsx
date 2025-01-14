import TransferForm from "./TransferForm";
import WalletCard from "./WalletCard";

const TransferPage: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-[70px] p-4 ">
      <TransferForm />
      <div className="sm:pt-5 ">
      </div>
      <WalletCard />
    </div>
  );
};

export default TransferPage;