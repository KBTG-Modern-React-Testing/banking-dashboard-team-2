import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { TransactionCard } from "./TransactionCard";
import { Transaction } from "../types";

const debitTransaction: Transaction = {
  id: "1",
  description: "Coffee Shop",
  amount: 5.75,
  type: "debit",
  date: "2026-06-03",
  category: "Dining",
};

const creditTransaction: Transaction = {
  id: "2",
  description: "Direct Deposit",
  amount: 2500.0,
  type: "credit",
  date: "2026-06-04",
  category: "Income",
};

describe("TransactionCard", () => {
  it("displays the description text", () => {
    render(<TransactionCard transaction={debitTransaction} />);

    expect(screen.getByText("Coffee Shop")).toBeInTheDocument();
  });

  it("shows a negative sign and amount for a debit transaction", () => {
    render(<TransactionCard transaction={debitTransaction} />);

    expect(screen.getByText("-$5.75")).toBeInTheDocument();
  });

  it("shows a positive sign and amount for a credit transaction", () => {
    render(<TransactionCard transaction={creditTransaction} />);

    expect(screen.getByText("+$2500.00")).toBeInTheDocument();
  });
});
