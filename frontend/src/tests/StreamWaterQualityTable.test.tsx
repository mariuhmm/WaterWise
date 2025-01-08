import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { getStations } from '../services/stationsService';
import { Station } from '../types/Station';
import StreamWaterQualityTable from '../components/StreamWaterQualityTable';
// import { getMonthlyAveragesForStation } from '../services/readingsService';

/**
 * Silences Error: Could not parse CSS stylesheet caused by primereact with jest
 * See https://github.com/jsdom/jsdom/issues/2177#issuecomment-1724971596 for more details
 */
const originalConsoleError = console.error;
const jsDomCssError = 'Error: Could not parse CSS stylesheet';
console.error = (...params) => {
    if (!params.find(p => p && p.toString().includes(jsDomCssError))) {
        originalConsoleError(...params);
    }
};

jest.mock("../services/stationsService");
const mockedGetStations = getStations as jest.MockedFunction<typeof getStations>;

describe('Stream Water Quality Table', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    it("Displays the correct table and row data", async () => {
        const mockStations = [
            {
                "lastUpdated": "2024-10-03T21:30:33",
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
                <StreamWaterQualityTable />
            </MemoryRouter>
        );

        await waitFor(async () => {
            const rowData = await screen.findAllByRole("cell");

            expect(rowData[0]).toBeInTheDocument();
            expect(rowData[0].textContent).toContain(mockStations[0].lastUpdated);
            expect(rowData[1]).toBeInTheDocument();
            expect(rowData[1].textContent).toContain(mockStations[0].stationDetails);
        });
    });

    it("Opens the dialog when a specific station is selected", async () => {
        const mockStations: Station[] = [
            {
                lastUpdated: "2024-10-03T21:30:33",
                sector: null,
                worksName: null,
                companyCode: null,
                municipality: null,
                waterBodyName: null,
                stationCode: null,
                stationDetails: "10000100302"
            }
        ];
    
        mockedGetStations.mockResolvedValue(mockStations);
    
        render(
            <MemoryRouter>
                <StreamWaterQualityTable />
            </MemoryRouter>
        );
    
        // Use `findAllByRole` to get the specific table cell
        const tableCells = await screen.findAllByRole("cell", { name: /10000100302/i });
        fireEvent.click(tableCells[0]); // Click on the specific cell in the table row
    
        expect(screen.getByText("Station Readings")).toBeInTheDocument();
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
                <StreamWaterQualityTable />
            </MemoryRouter>
        );

        const stationDetailsHeader = await screen.findByText("Station Details");
        fireEvent.click(stationDetailsHeader);

        const rowData = await screen.findAllByRole('cell');

        expect(rowData[1].textContent).toBe("10000100302");
        expect(rowData[4].textContent).toBe("20000100303");
    });

    it("Filters the table based on search input", async () => {
        const mockStations = [
            {
                lastUpdated: "2024-10-03T21:30:33",
                stationDetails: "123",
                sector: null,
                worksName: null,
                companyCode: null,
                municipality: null,
                waterBodyName: null,
                stationCode: null
            },
            {
                lastUpdated: "2024-10-03T21:30:34",
                stationDetails: "456",
                sector: null,
                worksName: null,
                companyCode: null,
                municipality: null,
                waterBodyName: null,
                stationCode: null
            }
        ];
        mockedGetStations.mockResolvedValue(mockStations);
    
        render(
            <MemoryRouter>
                <StreamWaterQualityTable />
            </MemoryRouter>
        );
    
        const searchInput = screen.getByPlaceholderText("Search...");
        fireEvent.change(searchInput, { target: { value: "123" } });
    
        // Use `findAllByRole` for table cells only
        const filteredResults = await screen.findAllByRole("cell", { name: /123/i });
        expect(filteredResults[0]).toBeInTheDocument(); // Check that the filtered item appears in the table
    });
});
