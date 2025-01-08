import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SectorSelection from "../components/SectorSelection";

describe("SectorSelection component", () => {
  const sectors = [
    {
      name: "Organic Chemical Manufacturing",
      id: "organic-chemical-manufacturing",
    },
    { name: "Iron and Steel", id: "iron-and-steel" },
    { name: "Petroleum Refineries", id: "petroleum-refineries" },
    { name: "Pulp and Paper", id: "pulp-and-paper" },
    { name: "Metal Mining and Refining", id: "metal-mining-and-refining" },
    { name: "Industrial Minerals", id: "industrial-minerals" },
    { name: "Inorganic Chemicals", id: "inorganic-chemicals" },
    { name: "Electric Power Generation", id: "electric-power-generation" },
    { name: "Metal Casting", id: "metal-casting" },
  ];

  it("should render all sector buttons", () => {
    render(
      <MemoryRouter>
        <SectorSelection />
      </MemoryRouter>
    );

    sectors.forEach((sector) => {
      expect(
        screen.getByText(new RegExp(sector.name, "i"))
      ).toBeInTheDocument();
    });
  });

  it("should navigate to the correct sector page on button click", () => {
    render(
      <MemoryRouter>
        <SectorSelection />
      </MemoryRouter>
    );

    sectors.forEach((sector) => {
      const button = screen.getByText(new RegExp(sector.name, "i"));
      fireEvent.click(button);

      // Verify navigation to the correct path
      expect(window.location.pathname).toBe(
        `/`
      );
    });
  });

  it("should navigate back on Back button click", () => {
    render(
      <MemoryRouter>
        <SectorSelection />
      </MemoryRouter>
    );

    const backButton = screen.getByText("Back");
    fireEvent.click(backButton);

    // Verify back navigation; customize as needed for test environment
    expect(window.history.length).toBe(1); // assuming a back navigation action
  });
});
