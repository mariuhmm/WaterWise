import reportWebVitals from "../reportWebVitals";

jest.mock("web-vitals", () => ({
  getCLS: jest.fn(),
  getFID: jest.fn(),
  getFCP: jest.fn(),
  getLCP: jest.fn(),
  getTTFB: jest.fn(),
}));

describe("reportWebVitals", () => {
// it("should call web vitals functions with the provided onPerfEntry function", async () => {
//   // Arrange
//   const mockOnPerfEntry = jest.fn() as ReportHandler;
  
//   // Act
//   reportWebVitals(mockOnPerfEntry);
  
//   // Wait for any pending promises to resolve
//   await Promise.resolve();
  
//   // Get the mocked functions after reportWebVitals has run
//   const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import("web-vitals");
  
//   // Assert
//   expect(getCLS).toHaveBeenCalledWith(mockOnPerfEntry);
//   expect(getFID).toHaveBeenCalledWith(mockOnPerfEntry);
//   expect(getFCP).toHaveBeenCalledWith(mockOnPerfEntry);
//   expect(getLCP).toHaveBeenCalledWith(mockOnPerfEntry);
//   expect(getTTFB).toHaveBeenCalledWith(mockOnPerfEntry);
// });

  it("should not call web vitals functions if onPerfEntry is undefined", async () => {
    // Act
    reportWebVitals();

    // Wait for the dynamic import to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Assert
    const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import(
      "web-vitals"
    );
    expect(getCLS).not.toHaveBeenCalled();
    expect(getFID).not.toHaveBeenCalled();
    expect(getFCP).not.toHaveBeenCalled();
    expect(getLCP).not.toHaveBeenCalled();
    expect(getTTFB).not.toHaveBeenCalled();
  });
});
