"use client";

import { useState } from "react";
import { Transaction } from "../types";
import { TransactionCard } from "./TransactionCard";

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  const [filter, setFilter] = useState<"all" | "credit" | "debit">("all");

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === "all") return true;
    return transaction.type === filter;
  });

  return (
    <div className="transactions-card">
      <div className="transactions-header">
        <h2 className="transactions-title">Recent Transactions</h2>

        {/* Filter Buttons */}
        <div className="filter-buttons">
          <button
            onClick={() => setFilter("all")}
            className={`filter-btn-base ${
              filter === "all" ? "filter-btn-active" : "filter-btn-inactive"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("credit")}
            className={`filter-btn-base ${
              filter === "credit"
                ? "filter-btn-active-income"
                : "filter-btn-inactive"
            }`}
          >
            Income
          </button>
          <button
            onClick={() => setFilter("debit")}
            className={`filter-btn-base ${
              filter === "debit"
                ? "filter-btn-active-expense"
                : "filter-btn-inactive"
            }`}
          >
            Expenses
          </button>
        </div>
      </div>

      <div className="transaction-list">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))
        ) : (
          <div className="transaction-empty">No transactions found</div>
        )}
      </div>
    </div>
  );
}
