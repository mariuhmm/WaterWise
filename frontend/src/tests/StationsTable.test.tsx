import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import StationsTable from "../components/StationsTable";

// Mock the useNavigate hook from react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("StationsTable Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it("renders without crashing", () => {
    render(
      <BrowserRouter>
        <StationsTable />
      </BrowserRouter>
    );

    expect(screen.getByText("Select a dataset")).toBeInTheDocument();
    expect(
      screen.getByText("Industrial Wastewater By Facility")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Inland Lake Drinking Water Quality")
    ).toBeInTheDocument();
    expect(screen.getByText("Stream Water Quality")).toBeInTheDocument();
  });

  it("navigates to Industrial Wastewater By Facility when the button is clicked", async () => {
    render(
      <BrowserRouter>
        <StationsTable />
      </BrowserRouter>
    );

    const button = screen.getByText("Industrial Wastewater By Facility");
    await userEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/sector-selection");
  });

  it("navigates to Inland Lake Drinking Water Quality when the button is clicked", async () => {
    render(
      <BrowserRouter>
        <StationsTable />
      </BrowserRouter>
    );

    const button = screen.getByText("Inland Lake Drinking Water Quality");
    await userEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/inland-lake-drinking-water-quality"
    );
  });

  it("navigates to Stream Water Quality when the button is clicked", async () => {
    render(
      <BrowserRouter>
        <StationsTable />
      </BrowserRouter>
    );

    const button = screen.getByText("Stream Water Quality");
    await userEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/stream-water-quality");
  });
});
