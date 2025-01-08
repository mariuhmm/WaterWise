import React from "react";
import { render, screen } from "@testing-library/react";
import ChemicalChart from "../components/ChemicalChart";
import { MemoryRouter } from "react-router-dom";

describe("Chemical Chart", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Displays graph correctly when data is provided", async () => {
    const mockLabels = ["2016/01", "2016/02", "2016/03"];
    const mockValues = [0.012, 0.015, 0.008];
    const mockUnitOfMeasure = "KG/D";

    render(
      <MemoryRouter>
        <ChemicalChart
          labels={mockLabels}
          values={mockValues}
          unitOfMeasure={mockUnitOfMeasure}
          chemicalName="Phosphorus"
        />
      </MemoryRouter>
    );

    const chart = screen.getByRole("chart");
    expect(chart).toBeInTheDocument();
  });

  it("Doesn't display graph when no data is provided", async () => {
    const mockLabels: string[] = [];
    const mockValues: number[] = [];
    const mockUnitOfMeasure = "KG/D";

    render(
      <MemoryRouter>
        <ChemicalChart
          labels={mockLabels}
          values={mockValues}
          unitOfMeasure={mockUnitOfMeasure}
          chemicalName="Phosphorus"
        />
      </MemoryRouter>
    );

    const chartAlternativeText = screen.getByRole("chart-alternative");
    expect(chartAlternativeText.textContent).toBe("No information available for the specified workstation chemical readings.");
  });
});
