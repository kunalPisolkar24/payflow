"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { columns, Transaction } from "./columns";
import { Loader } from "@repo/ui/components/loader"; 

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("api/transactions");
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="container mx-auto py-10">
      {isLoading ? (
        <div className="flex h-full items-center justify-center w-full pt-[150px]">
          <Loader />
        </div>
      ) : (
        <DataTable columns={columns} data={transactions} />
      )}
    </div>
  );
}