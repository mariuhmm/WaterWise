// src/index.test.tsx
import React from "react";
import ReactDOM from "react-dom/client";

jest.mock("../App", () => {
  const MockApp = () => <div>App Component</div>;
  MockApp.displayName = "MockApp"; // Add display name to fix react/display-name error
  return MockApp;
});

describe("index.tsx", () => {
  it("renders without crashing", async () => {
    const div = document.createElement("div");
    div.id = "root";
    document.body.appendChild(div);

    const createRootSpy = jest.spyOn(ReactDOM, "createRoot"); // Mock ReactDOM.createRoot

    await import("../index"); // Use dynamic import to avoid require()

    expect(createRootSpy).toHaveBeenCalledTimes(1);

    // Clean up
    createRootSpy.mockRestore();
    document.body.removeChild(div);
  });
});
