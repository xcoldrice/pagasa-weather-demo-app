// HomePage tests
import { describe, test, expect, vi } from 'vitest';
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "../components/HomePage";

vi.mock("../api/client", () => ({
  processImage: vi.fn(),
  processSample: vi.fn(),
  getSamples: vi.fn().mockResolvedValue([]),
  getHealth: vi.fn(),
  getVersion: vi.fn(),
  getRuns: vi.fn(),
  getResult: vi.fn(),
  getTrends: vi.fn(),
}));

describe("HomePage", () => {
  test("renders home page", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/pagasa weather decision support demo/i)).toBeInTheDocument();
  });
});