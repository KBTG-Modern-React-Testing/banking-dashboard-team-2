import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TransactionList } from "./TransactionList";
import { Transaction } from "../types";

const transactions: Transaction[] = [
  {
    id: "1",
    description: "Coffee Shop",
    amount: 5.75,
    type: "debit",
    date: "2026-06-03",
    category: "Dining",
  },
  {
    id: "2",
    description: "Direct Deposit",
    amount: 2500.0,
    type: "credit",
    date: "2026-06-04",
    category: "Income",
  },
  {
    id: "3",
    description: "Grocery Store",
    amount: 42.5,
    type: "debit",
    date: "2026-06-05",
    category: "Shopping",
  },
];

describe("TransactionList", () => {
  it("renders All, Income, and Expenses filter buttons", () => {
    render(<TransactionList transactions={transactions} />);

    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Income" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Expenses" }),
    ).toBeInTheDocument();
  });

  it("displays all transactions by default", () => {
    render(<TransactionList transactions={transactions} />);

    expect(screen.getByText("Coffee Shop")).toBeInTheDocument();
    expect(screen.getByText("Direct Deposit")).toBeInTheDocument();
    expect(screen.getByText("Grocery Store")).toBeInTheDocument();
  });

  it("shows only credit transactions when Income filter is clicked", async () => {
    const user = userEvent.setup();
    render(<TransactionList transactions={transactions} />);

    await user.click(screen.getByRole("button", { name: "Income" }));

    expect(screen.getByText("Direct Deposit")).toBeInTheDocument();
    expect(screen.queryByText("Coffee Shop")).not.toBeInTheDocument();
    expect(screen.queryByText("Grocery Store")).not.toBeInTheDocument();
  });

  it("shows only debit transactions when Expenses filter is clicked", async () => {
    const user = userEvent.setup();
    render(<TransactionList transactions={transactions} />);

    await user.click(screen.getByRole("button", { name: "Expenses" }));

    expect(screen.getByText("Coffee Shop")).toBeInTheDocument();
    expect(screen.getByText("Grocery Store")).toBeInTheDocument();
    expect(screen.queryByText("Direct Deposit")).not.toBeInTheDocument();
  });

  it("shows 'No transactions found' when the list is empty", () => {
    render(<TransactionList transactions={[]} />);

    expect(screen.getByText("No transactions found")).toBeInTheDocument();
  });
});
