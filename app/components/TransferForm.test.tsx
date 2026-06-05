import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TransferForm } from "./TransferForm";

describe("TransferForm", () => {
  it("shows an error when submitting without an amount", async () => {
    const user = userEvent.setup();
    render(<TransferForm balance={1000} onTransfer={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Transfer" }));

    expect(await screen.findByText("Amount is required")).toBeInTheDocument();
  });

  it("shows an error when submitting without a to account", async () => {
    const user = userEvent.setup();
    render(<TransferForm balance={1000} onTransfer={vi.fn()} />);

    await user.type(screen.getByPlaceholderText("0.00"), "50");
    await user.click(screen.getByRole("button", { name: "Transfer" }));

    expect(await screen.findByText("Account is required")).toBeInTheDocument();
  });

  it("shows an error when amount is 0", async () => {
    const user = userEvent.setup();
    render(<TransferForm balance={1000} onTransfer={vi.fn()} />);

    await user.type(screen.getByPlaceholderText("0.00"), "0");
    await user.type(
      screen.getByPlaceholderText("Account number or email"),
      "friend@example.com",
    );
    await user.click(screen.getByRole("button", { name: "Transfer" }));

    expect(
      await screen.findByText("Amount must be greater than 0"),
    ).toBeInTheDocument();
  });

  it("shows an error when amount exceeds the available balance", async () => {
    const user = userEvent.setup();
    render(<TransferForm balance={100} onTransfer={vi.fn()} />);

    await user.type(screen.getByPlaceholderText("0.00"), "200");
    await user.type(
      screen.getByPlaceholderText("Account number or email"),
      "friend@example.com",
    );
    await user.click(screen.getByRole("button", { name: "Transfer" }));

    expect(
      await screen.findByText(
        "Amount cannot exceed available balance ($100.00)",
      ),
    ).toBeInTheDocument();
  });

  it("calls onTransfer with the correct data on valid submission", async () => {
    const user = userEvent.setup();
    const onTransfer = vi.fn().mockResolvedValue(undefined);
    render(<TransferForm balance={1000} onTransfer={onTransfer} />);

    await user.type(screen.getByPlaceholderText("0.00"), "50");
    await user.type(
      screen.getByPlaceholderText("Account number or email"),
      "friend@example.com",
    );
    await user.click(screen.getByRole("button", { name: "Transfer" }));

    await waitFor(() => {
      expect(onTransfer).toHaveBeenCalledWith({
        amount: "50",
        toAccount: "friend@example.com",
      });
    });
  });

  it("shows a success message after a valid transfer", async () => {
    const user = userEvent.setup();
    render(
      <TransferForm
        balance={1000}
        onTransfer={vi.fn().mockResolvedValue(undefined)}
      />,
    );

    await user.type(screen.getByPlaceholderText("0.00"), "50");
    await user.type(
      screen.getByPlaceholderText("Account number or email"),
      "friend@example.com",
    );
    await user.click(screen.getByRole("button", { name: "Transfer" }));

    expect(
      await screen.findByText(
        "Transfer of $50.00 to friend@example.com initiated",
      ),
    ).toBeInTheDocument();
  });
});
