import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { getStations } from '../services/stationsService';
import { getWastewaterReadings } from '../services/readingsService';
import IndustrialWastewaterTable from '../components/IndustrialWastewaterTable';

const originalConsoleError = console.error;
const jsDomCssError = 'Error: Could not parse CSS stylesheet';
console.error = (...params) => {
  if (!params.find(p => p?.toString().includes(jsDomCssError))) {
    originalConsoleError(...params);
  }
};

jest.mock('../services/stationsService');
jest.mock('../services/readingsService');

const mockedGetStations = getStations as jest.Mock;
const mockedGetWastewaterReadings = getWastewaterReadings as jest.Mock;

describe('IndustrialWastewaterTable', () => {
  const mockStations = [
    {
      lastUpdated: "2024-10-03T21:27:42",
      sector: "ORGANIC CHEMICAL MANUFACTURING",
      worksName: "ARLANXEO CANADA INC.",
      companyCode: "0000030007",
      municipality: "SARNIA",
      waterBodyName: null,
      stationCode: null,
      stationDetails: null
    }
  ];

  const mockReadings = [
    {
      parameterName: "BROMOFORM",
      measuredValue: "4.000",
      unitOfMeasure: "KG/D",
      sampleDate: "2016/01",
      frequency: "MONTHLY",
      controlPointName: "PLANT - PROCESS EFFLUENT"
    },
    {
      parameterName: "ALUMINIUM",
      measuredValue: "5.000",
      unitOfMeasure: "KG/D",
      sampleDate: "2016/02",
      frequency: "QUARTERLY",
      controlPointName: "PLANT - O.T.C.W EFFLUENT"
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetStations.mockResolvedValue(mockStations);
    mockedGetWastewaterReadings.mockResolvedValue(mockReadings);
  });

  it('renders the component and loads data correctly', async () => {
    render(
      <MemoryRouter initialEntries={['/industrial-wastewater/chemical']}>
        <Routes>
          <Route path="/industrial-wastewater/:sector" element={<IndustrialWastewaterTable />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockedGetStations).toHaveBeenCalledWith('industrial-wastewater');
    });

    const dropdownTrigger = await screen.findByRole('button', { name: 'Select a Workstation' });
    expect(dropdownTrigger).toBeInTheDocument();
    fireEvent.click(dropdownTrigger);

    const option = await screen.findByText(mockStations[0].worksName);
    fireEvent.click(option);

    await waitFor(() => {
      expect(mockedGetWastewaterReadings).toHaveBeenCalledWith(mockStations[0].companyCode);
    });

    await waitFor(() => {
      expect(screen.getByText(mockReadings[0].parameterName)).toBeInTheDocument();
      expect(screen.getByText(`${mockReadings[0].measuredValue} ${mockReadings[0].unitOfMeasure}`)).toBeInTheDocument();
      expect(screen.getByText(mockReadings[0].frequency)).toBeInTheDocument();
      expect(screen.getByText(mockReadings[0].controlPointName)).toBeInTheDocument();
    });
  });

  it('displays the formatted sector name', async () => {
    render(
      <MemoryRouter initialEntries={['/industrial-wastewater/organic-chemical']}>
        <Routes>
          <Route path="/industrial-wastewater/:sector" element={<IndustrialWastewaterTable />} />
        </Routes>
      </MemoryRouter>
    );

    const sectorHeading = await screen.findByText(/Industrial Wastewater - Organic Chemical/i);
    expect(sectorHeading).toBeInTheDocument();
  });

  it("sorts the table by parameter name", async () => {
    render(
      <MemoryRouter initialEntries={['/industrial-wastewater/chemical']}>
        <Routes>
          <Route path="/industrial-wastewater/:sector" element={<IndustrialWastewaterTable />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockedGetStations).toHaveBeenCalledWith('industrial-wastewater');
    });

    const dropdownTrigger = await screen.findByRole('button', { name: 'Select a Workstation' });
    fireEvent.click(dropdownTrigger);

    const option = await screen.findByText(mockStations[0].worksName);
    fireEvent.click(option);

    await waitFor(() => {
      expect(mockedGetWastewaterReadings).toHaveBeenCalledWith(mockStations[0].companyCode);
    });

    await waitFor(() => {
      expect(screen.getByText("BROMOFORM")).toBeInTheDocument();
      expect(screen.getByText("ALUMINIUM")).toBeInTheDocument();
    });

    const parameterNameHeader = screen.getByRole('columnheader', { name: /parameter name/i });
    fireEvent.click(parameterNameHeader);

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      const firstRowParameter = rows[1].querySelector('td')?.textContent;
      const secondRowParameter = rows[2].querySelector('td')?.textContent;
      expect(firstRowParameter).toBe("ALUMINIUM");
      expect(secondRowParameter).toBe("BROMOFORM");
    });

    fireEvent.click(parameterNameHeader);

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      const firstRowParameter = rows[1].querySelector('td')?.textContent;
      const secondRowParameter = rows[2].querySelector('td')?.textContent;
      expect(firstRowParameter).toBe("BROMOFORM");
      expect(secondRowParameter).toBe("ALUMINIUM");
    });
  });

  it("filters the table based on search input", async () => {
    render(
      <MemoryRouter initialEntries={['/industrial-wastewater/chemical']}>
        <Routes>
          <Route path="/industrial-wastewater/:sector" element={<IndustrialWastewaterTable />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockedGetStations).toHaveBeenCalledWith('industrial-wastewater');
    });

    const dropdownTrigger = await screen.findByRole('button', { name: 'Select a Workstation' });
    fireEvent.click(dropdownTrigger);

    const option = await screen.findByText(mockStations[0].worksName);
    fireEvent.click(option);

    await waitFor(() => {
      expect(mockedGetWastewaterReadings).toHaveBeenCalledWith(mockStations[0].companyCode);
    });

    await waitFor(() => {
      expect(screen.getByText("BROMOFORM")).toBeInTheDocument();
      expect(screen.getByText("ALUMINIUM")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search...");
    fireEvent.change(searchInput, { target: { value: "BROMO" } });

    await waitFor(() => {
      expect(screen.getByText("BROMOFORM")).toBeInTheDocument();
      expect(screen.queryByText("ALUMINIUM")).not.toBeInTheDocument();
    });
  });

  it('handles navigation back', async () => {
    render(
      <MemoryRouter initialEntries={['/industrial-wastewater/chemical']}>
        <Routes>
          <Route path="/industrial-wastewater/:sector" element={<IndustrialWastewaterTable />} />
        </Routes>
      </MemoryRouter>
    );

    const backButton = await screen.findByText('Back');
    expect(backButton).toBeInTheDocument();

    fireEvent.click(backButton);
  });

  it("disables the chemical options if none of the workstations have been chosen", async () => {
    render(
      <MemoryRouter initialEntries={['/industrial-wastewater/chemical']}>
        <Routes>
          <Route path="/industrial-wastewater/:sector" element={<IndustrialWastewaterTable />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockedGetStations).toHaveBeenCalledWith('industrial-wastewater');
    });

    const selectButtons = await screen.findByTestId('chemical-select-buttons')

    expect(selectButtons.children[0]).toHaveAttribute('aria-disabled', 'true')

    const dropdownTrigger = await screen.findByRole('button', { name: 'Select a Workstation' });
    fireEvent.click(dropdownTrigger);

    const option = await screen.findByText(mockStations[0].worksName);
    fireEvent.click(option);

    await waitFor(() => {
      expect(mockedGetWastewaterReadings).toHaveBeenCalledWith(mockStations[0].companyCode);
    });

    await waitFor(() => {
      expect(screen.getByText("BROMOFORM")).toBeInTheDocument();
      expect(screen.getByText("ALUMINIUM")).toBeInTheDocument();
    });

    // After click on a workstation, it should be enabled
    expect(selectButtons.children[0]).toHaveAttribute('aria-disabled', 'false')
  });

});