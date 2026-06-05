"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import "./page.css";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "debit" | "credit";
  date: string;
  category: string;
}

interface TransferFormData {
  amount: string;
  toAccount: string;
}

const initialTransactions: Transaction[] = [
  {
    id: "1",
    description: "Grocery Store",
    amount: 52.30,
    type: "debit",
    date: "2026-06-05",
    category: "Shopping",
  },
  {
    id: "2",
    description: "Direct Deposit",
    amount: 2500.00,
    type: "credit",
    date: "2026-06-04",
    category: "Income",
  },
  {
    id: "3",
    description: "Coffee Shop",
    amount: 5.75,
    type: "debit",
    date: "2026-06-03",
    category: "Dining",
  },
  {
    id: "4",
    description: "Gas Station",
    amount: 45.00,
    type: "debit",
    date: "2026-06-02",
    category: "Transportation",
  },
  {
    id: "5",
    description: "Online Transfer",
    amount: 200.00,
    type: "debit",
    date: "2026-06-01",
    category: "Transfer",
  },
];

let transactionCounter = Date.now();

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      return (savedTheme as "light" | "dark") || "light";
    }
    return "light";
  });
  const [filter, setFilter] = useState<"all" | "credit" | "debit">("all");
  const [balance, setBalance] = useState(1234.56);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [transferSuccess, setTransferSuccess] = useState("");

  // Save theme preference
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TransferFormData>({
    defaultValues: {
      amount: "",
      toAccount: "",
    },
  });

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === "all") return true;
    return transaction.type === filter;
  });

  const onSubmit = (data: TransferFormData) => {
    const amount = parseFloat(data.amount);

    // Validate amount > 0
    if (amount <= 0) {
      return;
    }

    // Create new transaction
    const newTransaction: Transaction = {
      id: (transactionCounter++).toString(),
      description: `Transfer to ${data.toAccount}`,
      amount,
      type: "debit",
      date: new Date().toISOString().split("T")[0],
      category: "Transfer",
    };

    // Add new transaction to the top of the list
    setTransactions([newTransaction, ...transactions]);

    // Update account balance (subtract the transfer amount)
    setBalance(balance - amount);

    // Show success message
    setTransferSuccess(`Transfer of $${amount.toFixed(2)} to ${data.toAccount} initiated`);

    // Reset form
    reset();

    // Clear success message after 3 seconds
    setTimeout(() => setTransferSuccess(""), 3000);
  };

  return (
    <div className={`page-container ${theme}`}>
      <div className="page-content">
        {/* Theme Switcher */}
        <div className="theme-switcher">
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>

        {/* Account Balance Section */}
        <div className="card-mb">
          <h1 className="balance-label">
            Account Balance
          </h1>
          <p className="balance-amount">${balance.toFixed(2)}</p>
        </div>

        {/* Transfer Form Section */}
        <div className="form-section">
          <h2 className="form-title">
            Transfer Money
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="form-group">
            {/* Amount Input */}
            <div>
              <label className="form-label">
                Amount
              </label>
              <div className="form-input-wrapper">
                <span className="form-input-prefix">$</span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("amount", {
                    required: "Amount is required",
                    validate: (value) => {
                      const num = parseFloat(value);
                      return num > 0 || "Amount must be greater than 0";
                    },
                  })}
                  className={`form-input-base form-input-amount ${errors.amount ? "form-input-error" : "form-input-valid"
                    }`}
                />
              </div>
              {errors.amount && (
                <p className="form-error-text">{errors.amount.message}</p>
              )}
            </div>

            {/* Account Input */}
            <div>
              <label className="form-label">
                To Account
              </label>
              <input
                type="text"
                placeholder="Account number or email"
                {...register("toAccount", {
                  required: "Account is required",
                })}
                className={`form-input-base ${errors.toAccount ? "form-input-error" : "form-input-valid"
                  }`}
              />
              {errors.toAccount && (
                <p className="form-error-text">{errors.toAccount.message}</p>
              )}
            </div>

            {/* Success Message */}
            {transferSuccess && (
              <div className="message-success">
                {transferSuccess}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-submit"
            >
              Transfer
            </button>
          </form>
        </div>

        {/* Transactions Section */}
        <div className="transactions-card">
          <div className="transactions-header">
            <h2 className="transactions-title">
              Recent Transactions
            </h2>

            {/* Filter Buttons */}
            <div className="filter-buttons">
              <button
                onClick={() => setFilter("all")}
                className={`filter-btn-base ${filter === "all" ? "filter-btn-active" : "filter-btn-inactive"
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("credit")}
                className={`filter-btn-base ${filter === "credit" ? "filter-btn-active-income" : "filter-btn-inactive"
                  }`}
              >
                Income
              </button>
              <button
                onClick={() => setFilter("debit")}
                className={`filter-btn-base ${filter === "debit" ? "filter-btn-active-expense" : "filter-btn-inactive"
                  }`}
              >
                Expenses
              </button>
            </div>
          </div>

          <div className="transaction-list">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-inner">
                    <div className="transaction-details">
                      <p className="transaction-description">
                        {transaction.description}
                      </p>
                      <p className="transaction-meta">
                        {transaction.category} •{" "}
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="transaction-amounts">
                      <p
                        className={`transaction-amount-base ${transaction.type === "credit"
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
              ))
            ) : (
              <div className="transaction-empty">
                No transactions found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
