import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { AccountBalance } from "./AccountBalance";

describe("AccountBalance", () => {
  it("renders the Account Balance heading", () => {
    render(<AccountBalance balance={0} />);

    expect(
      screen.getByRole("heading", { name: "Account Balance" }),
    ).toBeInTheDocument();
  });

  it("displays a positive balance formatted to 2 decimal places", () => {
    render(<AccountBalance balance={5000} />);

    expect(screen.getByText("$5000.00")).toBeInTheDocument();
  });

  it("rounds balance to 2 decimal places", () => {
    render(<AccountBalance balance={99.999} />);

    expect(screen.getByText("$100.00")).toBeInTheDocument();
  });

  it("applies the balance-amount CSS class to the amount", () => {
    render(<AccountBalance balance={500} />);

    expect(screen.getByText("$500.00")).toHaveClass("balance-amount");
  });
});
