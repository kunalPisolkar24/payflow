import SendMoney from "./send-money";
const P2PPage: React.FC = () => {
  return (
   <main className="pt-[40px] flex items-center justify-center p-4 bg-background text-foreground">
      <SendMoney />
    </main>
  );
}

export default P2PPage;