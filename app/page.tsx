"use client";

import { useState } from "react";
import Image from "next/image";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "debit" | "credit";
  date: string;
  category: string;
}

const mockTransactions: Transaction[] = [
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

export default function Home() {
  const [filter, setFilter] = useState<"all" | "credit" | "debit">("all");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferAccount, setTransferAccount] = useState("");
  const [transferError, setTransferError] = useState("");
  const [transferSuccess, setTransferSuccess] = useState("");

  const filteredTransactions = mockTransactions.filter((transaction) => {
    if (filter === "all") return true;
    return transaction.type === filter;
  });

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setTransferError("");
    setTransferSuccess("");

    // Validation
    if (!transferAmount || !transferAccount) {
      setTransferError("Please fill in all fields");
      return;
    }

    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      setTransferError("Amount must be greater than 0");
      return;
    }

    // Success
    setTransferSuccess(`Transfer of $${amount.toFixed(2)} to ${transferAccount} initiated`);
    setTransferAmount("");
    setTransferAccount("");

    // Clear success message after 3 seconds
    setTimeout(() => setTransferSuccess(""), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Account Balance Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-gray-600 text-sm font-medium mb-2">
            Account Balance
          </h1>
          <p className="text-4xl font-bold text-gray-900">$1,234.56</p>
        </div>

        {/* Transfer Form Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Transfer Money
          </h2>

          <form onSubmit={handleTransfer} className="space-y-4">
            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Account Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Account
              </label>
              <input
                type="text"
                placeholder="Account number or email"
                value={transferAccount}
                onChange={(e) => setTransferAccount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Error Message */}
            {transferError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                {transferError}
              </div>
            )}

            {/* Success Message */}
            {transferSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
                {transferSuccess}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Transfer
            </button>
          </form>
        </div>

        {/* Transactions Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Transactions
            </h2>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("credit")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === "credit"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                Income
              </button>
              <button
                onClick={() => setFilter("debit")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === "debit"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                Expenses
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-gray-600">
                        {transaction.category} •{" "}
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${transaction.type === "credit"
                          ? "text-green-600"
                          : "text-gray-900"
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
              <div className="px-6 py-8 text-center text-gray-500">
                No transactions found
              </div>
            )}
          </div>

          <div className="px-6 py-4 bg-gray-50 text-center">
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              View All Transactions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
