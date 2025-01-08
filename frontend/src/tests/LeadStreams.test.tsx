import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { getTop5LeadStreams, getStations } from '../services/stationsService';
import StreamWaterQualityTable from '../components/StreamWaterQualityTable';

// Silence CSS parsing errors from PrimeReact in Jest
const originalConsoleError = console.error;
const jsDomCssError = 'Error: Could not parse CSS stylesheet';
console.error = (...params) => {
  if (!params.find(p => p && p.toString().includes(jsDomCssError))) {
    originalConsoleError(...params);
  }
};

// Mocking the service functions
jest.mock("../services/stationsService");
const mockedGetTop5LeadStreams = getTop5LeadStreams as jest.MockedFunction<typeof getTop5LeadStreams>;
const mockedGetStations = getStations as jest.MockedFunction<typeof getStations>;

describe('StreamWaterQualityTable Bar Chart', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Displays the bar chart with lead content data", async () => {
        // Mock responses for service functions
        mockedGetStations.mockResolvedValue([]); // Mock getStations to prevent errors
        const mockLeadStreams = [
            { waterBodyName: "Stream A", result: 10 },
            { waterBodyName: "Stream B", result: 15 },
            { waterBodyName: "Stream C", result: 20 },
            { waterBodyName: "Stream D", result: 25 },
            { waterBodyName: "Stream E", result: 30 }
        ];
        mockedGetTop5LeadStreams.mockResolvedValue(mockLeadStreams);

        render(
            <MemoryRouter>
                <StreamWaterQualityTable />
            </MemoryRouter>
        );

        // Wait for the bar chart to appear based on test ID
        await waitFor(() => {
            const barChart = screen.getByTestId("bar-chart");
            expect(barChart).toBeInTheDocument();
        });
    });
});
