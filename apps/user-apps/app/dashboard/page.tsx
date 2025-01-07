"use client";

import { SidebarProvider, SidebarInset } from "@repo/ui/components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import { useState, useEffect } from "react";
import { Header } from "./Header";
import TransferComponent from "./transfer-comp/page";
import TransactionComponent from "./transactions-comp/page";
import P2PComponent from "./p2p-comp/page";
import { Loader } from "@repo/ui/components/loader"; 

function Dashboard() {
  const [activePage, setActivePage] = useState("transfer");
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Adjust the timeout as needed

    return () => clearTimeout(timer);
  }, []);

  const renderActivePage = () => {
    if (isLoading) {
      return (
        <div className="flex h-full items-center justify-center">
          <Loader />
        </div>
      );
    }

    switch (activePage) {
      case "transfer":
        return <TransferComponent />;
      case "transaction":
        return <TransactionComponent />;
      case "p2p":
        return <P2PComponent />;
      default:
        return <TransferComponent />;
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar setActivePage={setActivePage} activePage={activePage} />
      <SidebarInset className="flex w-full flex-col">
        <Header activePage={activePage} />
        {renderActivePage()}
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Dashboard;