import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('WaterWise to be on the splash page', () => {
  render(<App />);
  const waterWiseList = screen.getAllByText(/Waterwise/i);

  expect(waterWiseList.length).toBeGreaterThan(0)
});
