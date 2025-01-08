import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { getStations } from '../services/stationsService';
import LakeWaterQualityTable from '../components/LakeWaterQualityTable';

// Silences Error: Could not parse CSS stylesheet caused by PrimeReact with Jest
const originalConsoleError = console.error;
const jsDomCssError = 'Error: Could not parse CSS stylesheet';
console.error = (...params) => {
  if (!params.find(p => p && p.toString().includes(jsDomCssError))) {
    originalConsoleError(...params);
  }
};

jest.mock('../services/stationsService');
const mockedGetStations = getStations as jest.MockedFunction<typeof getStations>;

jest.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="bar-chart" />,  // Mocked Bar chart with a test ID for existence check
}));

describe('Lake Water Quality Table', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Displays the correct table and row data', async () => {
    const mockStations = [
      {
        lastUpdated: '2024-10-03T21:28:29',
        sector: null,
        worksName: null,
        companyCode: null,
        municipality: null,
        waterBodyName: 'Crosson Lake',
        stationCode: 'CN',
        stationDetails: '03007751001',
      },
    ];
    mockedGetStations.mockResolvedValue(mockStations);

    render(
      <MemoryRouter>
        <LakeWaterQualityTable />
      </MemoryRouter>
    );

    await waitFor(async () => {
      const rowData = await screen.findAllByRole('cell');

      setTimeout(function() {}, 2000);
      expect(rowData[0]).toBeInTheDocument();
      expect(rowData[0].textContent).toContain(mockStations[0].lastUpdated);
      expect(rowData[1]).toBeInTheDocument();
      expect(rowData[1].textContent).toContain(mockStations[0].waterBodyName);
      expect(rowData[2]).toBeInTheDocument();
      expect(rowData[2].textContent).toContain(mockStations[0].stationCode);
      expect(rowData[3]).toBeInTheDocument();
      expect(rowData[3].textContent).toContain(mockStations[0].stationDetails);
    });
  });

  it("Sorts the table by station details when clicked", async () => {
    const mockStations = [
        {
            "lastUpdated": "2024-10-03T21:30:33",
            "sector": null,
            "worksName": null,
            "companyCode": null,
            "municipality": null,
            "waterBodyName": null,
            "stationCode": null,
            "stationDetails": "20000100303"
        },
        {
            "lastUpdated": "2024-10-03T21:30:34",
            "sector": null,
            "worksName": null,
            "companyCode": null,
            "municipality": null,
            "waterBodyName": null,
            "stationCode": null,
            "stationDetails": "10000100302"
        }
    ];

    mockedGetStations.mockResolvedValue(mockStations);

    render(
        <MemoryRouter>
            <LakeWaterQualityTable />
        </MemoryRouter>
    );

    // Trigger sorting by clicking the "Station Details" header
    const stationDetailsHeader = screen.getByText("Station Details");
    fireEvent.click(stationDetailsHeader); 

    // Wait for sorting to complete
    await waitFor(() => {
        const rowData = screen.getAllByRole('cell');
        
        // Assert that the data is sorted correctly
        expect(rowData[3].textContent).toBe("10000100302");
        expect(rowData[7].textContent).toBe("20000100303");
    });
});


  it('Filters the table based on search input', async () => {
    const mockStations = [
      {
        lastUpdated: '2024-10-03T21:30:33',
        stationDetails: '123',
        sector: null,
        worksName: null,
        companyCode: null,
        municipality: null,
        waterBodyName: null,
        stationCode: null,
      },
      {
        lastUpdated: '2024-10-03T21:30:34',
        stationDetails: '456',
        sector: null,
        worksName: null,
        companyCode: null,
        municipality: null,
        waterBodyName: null,
        stationCode: null,
      },
    ];
    mockedGetStations.mockResolvedValue(mockStations);

    render(
      <MemoryRouter>
        <LakeWaterQualityTable />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: '123' } });

    const filteredResult = await screen.findByText('123');

    expect(filteredResult).toBeInTheDocument();
  });
});

it('renders the bar graph', async () => {
  // Provide mock data matching the Station type
  const mockStations = [
    {
      lastUpdated: '2024-10-03T21:30:33',
      stationDetails: '123',
      sector: null,
      worksName: null,
      companyCode: null,
      municipality: null,
      waterBodyName: null,
      stationCode: null,
    },
    {
      lastUpdated: '2024-10-03T21:30:34',
      stationDetails: '456',
      sector: null,
      worksName: null,
      companyCode: null,
      municipality: null,
      waterBodyName: null,
      stationCode: null,
    },
  ];
  mockedGetStations.mockResolvedValue(mockStations);

  render(
    <MemoryRouter>
      <LakeWaterQualityTable />
    </MemoryRouter>
  );

  await waitFor(() => {
    // Check that the bar graph is rendered
    const graph = screen.getByTestId('bar-chart');
    expect(graph).toBeInTheDocument();
  });
});

