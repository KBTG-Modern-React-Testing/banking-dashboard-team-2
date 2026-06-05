"use client";

import { Transaction } from "../types";

interface TransactionCardProps {
  transaction: Transaction;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  return (
    <div className="transaction-item">
      <div className="transaction-inner">
        <div className="transaction-details">
          <p className="transaction-description">{transaction.description}</p>
          <p className="transaction-meta">
            {transaction.category} •{" "}
            {new Date(transaction.date).toLocaleDateString()}
          </p>
        </div>
        <div className="transaction-amounts">
          <p
            className={`transaction-amount-base ${
              transaction.type === "credit"
                ? "transaction-amount-credit"
                : "transaction-amount-debit"
            }`}
          >
            {transaction.type === "credit" ? "+" : "-"}$
            {transaction.amount.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
