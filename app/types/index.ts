export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "debit" | "credit";
  date: string;
  category: string;
}

export interface TransferFormData {
  amount: string;
  toAccount: string;
}
