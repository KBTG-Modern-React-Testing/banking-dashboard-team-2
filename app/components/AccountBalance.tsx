"use client";

interface AccountBalanceProps {
  balance: number;
}

export function AccountBalance({ balance }: AccountBalanceProps) {
  return (
    <div className="card-mb">
      <h1 className="balance-label">Account Balance</h1>
      <p className="balance-amount">${balance.toFixed(2)}</p>
    </div>
  );
}
