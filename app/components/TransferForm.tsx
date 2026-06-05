"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { TransferFormData } from "../types";

interface TransferFormProps {
  balance: number;
  onTransfer: (data: TransferFormData) => Promise<void>;
}

export function TransferForm({ balance, onTransfer }: TransferFormProps) {
  const [transferSuccess, setTransferSuccess] = useState("");

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

  const onSubmit = async (data: TransferFormData) => {
    await onTransfer(data);

    const amount = parseFloat(data.amount);
    setTransferSuccess(
      `Transfer of $${amount.toFixed(2)} to ${data.toAccount} initiated`,
    );
    reset();
    setTimeout(() => setTransferSuccess(""), 3000);
  };

  return (
    <div className="form-section">
      <h2 className="form-title">Transfer Money</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="form-group">
        {/* Amount Input */}
        <div>
          <label className="form-label">Amount</label>
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
                  if (num <= 0) return "Amount must be greater than 0";
                  if (num > balance)
                    return `Amount cannot exceed available balance ($${balance.toFixed(2)})`;
                  return true;
                },
              })}
              className={`form-input-base form-input-amount ${
                errors.amount ? "form-input-error" : "form-input-valid"
              }`}
            />
          </div>
          {errors.amount && (
            <p className="form-error-text">{errors.amount.message}</p>
          )}
        </div>

        {/* Account Input */}
        <div>
          <label className="form-label">To Account</label>
          <input
            type="text"
            placeholder="Account number or email"
            {...register("toAccount", {
              required: "Account is required",
            })}
            className={`form-input-base ${
              errors.toAccount ? "form-input-error" : "form-input-valid"
            }`}
          />
          {errors.toAccount && (
            <p className="form-error-text">{errors.toAccount.message}</p>
          )}
        </div>

        {/* Success Message */}
        {transferSuccess && (
          <div className="message-success">{transferSuccess}</div>
        )}

        {/* Submit Button */}
        <button type="submit" className="btn-submit">
          Transfer
        </button>
      </form>
    </div>
  );
}
