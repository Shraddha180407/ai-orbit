import { render, screen } from "@testing-library/react";
import { TaskAuthRequired } from "@/components/TaskAuthRequired";

describe("TaskAuthRequired", () => {
  it("renders default message and sign-in link", () => {
    render(<TaskAuthRequired />);
    expect(screen.getByText("Log in to see this")).toBeInTheDocument();
    expect(
      screen.getByText("Sign in to view tasks personalized to you.")
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign In" })).toHaveAttribute(
      "href",
      "/auth/signin"
    );
  });

  it("renders custom message", () => {
    render(<TaskAuthRequired message="You need to sign in first." />);
    expect(screen.getByText("You need to sign in first.")).toBeInTheDocument();
  });
});
