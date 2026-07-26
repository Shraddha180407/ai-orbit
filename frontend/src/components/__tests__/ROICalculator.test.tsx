import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ROICalculator } from "../ROICalculator";

describe("ROICalculator", () => {
  const defaultProps = {
    pricingModel: "PAID" as const,
    pricingAmount: "29",
    name: "TestTool",
  };

  it("renders heading and tool name", () => {
    render(<ROICalculator {...defaultProps} />);
    expect(screen.getByText("ROI & Savings Calculator")).toBeInTheDocument();
    expect(screen.getByText(/Estimate the impact of adopting TestTool/)).toBeInTheDocument();
  });

  it("renders all three sliders with default values", () => {
    render(<ROICalculator {...defaultProps} />);
    expect(screen.getByLabelText("Team Size")).toHaveValue("5");
    expect(screen.getByLabelText("Average Hourly Wage")).toHaveValue("40");
    expect(screen.getByLabelText("Weekly Hours Saved Per Member")).toHaveValue("3");
  });

  it("calculates default values correctly", () => {
    render(<ROICalculator {...defaultProps} />);
    // teamSize=5, hoursSaved=3, hourlyRate=40
    // monthlyHoursSaved = 5 * 3 * 4.33 = 64.95 ≈ 65
    expect(screen.getByText("65h")).toBeInTheDocument();
    // totalToolCost = 5 * 29 = 145
    expect(screen.getByText("$145")).toBeInTheDocument();
  });

  it("updates team size and recalculates", () => {
    render(<ROICalculator {...defaultProps} />);
    const teamSlider = screen.getByLabelText("Team Size");
    fireEvent.change(teamSlider, { target: { value: "10" } });
    // teamSize=10, hoursSaved=3, hourlyRate=40
    // monthlyHoursSaved = 10 * 3 * 4.33 = 129.9 ≈ 130
    expect(screen.getByText("130h")).toBeInTheDocument();
    // totalToolCost = 10 * 29 = 290
    expect(screen.getByText("$290")).toBeInTheDocument();
  });

  it("updates hourly rate and recalculates", () => {
    render(<ROICalculator {...defaultProps} />);
    const rateSlider = screen.getByLabelText("Average Hourly Wage");
    fireEvent.change(rateSlider, { target: { value: "80" } });
    // monthlyHoursSaved = 5 * 3 * 4.33 ≈ 65
    // valueOfTimeSaved = 65 * 80 = 5200
    // totalToolCost = 5 * 29 = 145
    // netSavings = 5200 - 145 = 5055
    expect(screen.getByText("$5,055")).toBeInTheDocument();
  });

  it("updates hours saved and recalculates", () => {
    render(<ROICalculator {...defaultProps} />);
    const hoursSlider = screen.getByLabelText("Weekly Hours Saved Per Member");
    fireEvent.change(hoursSlider, { target: { value: "10" } });
    // monthlyHoursSaved = 5 * 10 * 4.33 = 216.5 ≈ 217
    expect(screen.getByText("217h")).toBeInTheDocument();
  });

  it("shows ROI multiplier", () => {
    render(<ROICalculator {...defaultProps} />);
    expect(screen.getByText(/x ROI/)).toBeInTheDocument();
  });

  it("uses fallback pricing for FREE model", () => {
    render(<ROICalculator pricingModel="FREE" pricingAmount={null} name="FreeTool" />);
    // FREE => costPerUser = 0
    expect(screen.getByText("$0")).toBeInTheDocument();
  });

  it("uses fallback pricing for FREEMIUM model", () => {
    render(<ROICalculator pricingModel="FREEMIUM" pricingAmount={null} name="FreeTool" />);
    // FREEMIUM fallback => costPerUser = 15
    // totalToolCost = 5 * 15 = 75
    expect(screen.getByText("$75")).toBeInTheDocument();
  });

  it("shows person/plural label based on team size", () => {
    render(<ROICalculator {...defaultProps} />);
    expect(screen.getByText("5 people")).toBeInTheDocument();
    const slider = screen.getByLabelText("Team Size");
    fireEvent.change(slider, { target: { value: "1" } });
    expect(screen.getByText("1 person")).toBeInTheDocument();
  });
});
