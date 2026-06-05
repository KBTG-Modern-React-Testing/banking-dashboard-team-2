import { http, HttpResponse } from "msw";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "debit" | "credit";
  date: string;
  category: string;
}

// In-memory mock data store
let mockBalance = 10000;

let mockTransactions: Transaction[] = [
  {
    id: "1",
    description: "Direct Deposit",
    amount: mockBalance,
    type: "credit",
    date: "2026-06-04",
    category: "Income",
  },
];

export const handlers = [
  // GET /api/account — return current balance
  http.get("/api/account", () => {
    return HttpResponse.json({ balance: mockBalance });
  }),

  // GET /api/transactions — return all transactions
  http.get("/api/transactions", () => {
    return HttpResponse.json(mockTransactions);
  }),

  // POST /api/transactions — create a transfer transaction
  http.post("/api/transactions", async ({ request }) => {
    const body = (await request.json()) as Omit<Transaction, "id">;
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      ...body,
    };
    mockTransactions = [newTransaction, ...mockTransactions];
    mockBalance -= newTransaction.amount;
    return HttpResponse.json(
      { transaction: newTransaction, balance: mockBalance },
      { status: 201 },
    );
  }),
];
