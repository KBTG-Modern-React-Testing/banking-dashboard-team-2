"use client";

import { useEffect, useState } from "react";
import "./page.css";
import { AccountBalance } from "./components/AccountBalance";
import { TransferForm } from "./components/TransferForm";
import { TransactionList } from "./components/TransactionList";
import { Transaction, TransferFormData } from "./types";

// export const mockOauth2GetState = (resolver: HttpResponseResolver) => {
//   return http.get(`${MOCK_API_ENDPOINT}/oauth2/state`, resolver)
// }

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load initial data from mock API
  useEffect(() => {
    fetch("/api/account")
      .then((res) => res.json())
      .then((data: { balance: number }) => setBalance(data.balance));

    fetch("/api/transactions")
      .then((res) => res.json())
      .then((data: Transaction[]) => setTransactions(data));
  }, []);

  // Save theme preference via API
  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  const handleTransfer = async (data: TransferFormData) => {
    const amount = parseFloat(data.amount);

    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: `Transfer to ${data.toAccount}`,
        amount,
        type: "debit",
        date: new Date().toISOString().split("T")[0],
        category: "Transfer",
      }),
    });

    const result = (await res.json()) as {
      transaction: Transaction;
      balance: number;
    };

    setTransactions((prev) => [result.transaction, ...prev]);
    setBalance(result.balance);
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

        <AccountBalance balance={balance} />
        <TransferForm balance={balance} onTransfer={handleTransfer} />
        <TransactionList transactions={transactions} />
      </div>
    </div>
  );
}
