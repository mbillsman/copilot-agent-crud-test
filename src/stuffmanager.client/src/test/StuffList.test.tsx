import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import StuffList from "../components/StuffList";
import stuffReducer from "../store/slices/stuffSlice";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock data
const mockStuffData = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `Stuff Item ${i + 1}`,
  description: `Description for stuff item ${i + 1}`,
}));

const firstPageData = mockStuffData.slice(0, 10);
const secondPageData = mockStuffData.slice(10, 12);

function renderWithStore(initialState = {}) {
  const store = configureStore({
    reducer: {
      stuff: stuffReducer,
    },
    preloadedState: initialState,
  });

  return {
    ...render(
      <Provider store={store}>
        <StuffList />
      </Provider>
    ),
    store,
  };
}

describe("StuffList Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", async () => {
    mockFetch.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: () => Promise.resolve(firstPageData),
              }),
            100
          )
        )
    );

    renderWithStore();

    // Look for the loading spinner element
    expect(
      screen.getByRole("status", { name: /loading/i })
    ).toBeInTheDocument();

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
  });

  it("renders page header and table headers", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(firstPageData),
    });

    renderWithStore();

    await waitFor(() => {
      expect(screen.getByText("Stuff Manager")).toBeInTheDocument();
    });

    expect(screen.getByText("Manage your stuff items")).toBeInTheDocument();
    expect(screen.getByText("Stuff List")).toBeInTheDocument();
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  it("renders first page of stuff items (10 items)", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(firstPageData),
    });

    renderWithStore();

    await waitFor(() => {
      expect(screen.getByText("Stuff Item 1")).toBeInTheDocument();
    });

    // Check that exactly 10 items are displayed
    const rows = screen.getAllByRole("row");
    // Header row + 10 data rows = 11 total rows
    expect(rows).toHaveLength(11);

    // Check first item
    expect(screen.getByText("Stuff Item 1")).toBeInTheDocument();
    expect(
      screen.getByText("Description for stuff item 1")
    ).toBeInTheDocument();

    // Check last item on first page
    expect(screen.getByText("Stuff Item 10")).toBeInTheDocument();
    expect(
      screen.getByText("Description for stuff item 10")
    ).toBeInTheDocument();
  });

  it("allows navigation to second page and shows 2 items", async () => {
    // Mock first page request
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(firstPageData),
    });

    const { store } = renderWithStore();

    await waitFor(() => {
      expect(screen.getByText("Stuff Item 1")).toBeInTheDocument();
    });

    // Mock second page request
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(secondPageData),
    });

    // Click next button - get all buttons and find the Next one
    const buttons = screen.getAllByRole("button");
    const nextButton = buttons.find(
      (button) =>
        button.textContent?.includes("Next") ||
        button.getAttribute("aria-label")?.includes("Next")
    );

    expect(nextButton).toBeDefined();
    fireEvent.click(nextButton!);

    await waitFor(() => {
      // Verify store state has been updated
      expect(store.getState().stuff.currentPage).toBe(2);
    });

    await waitFor(() => {
      // Check that only 2 items are displayed (plus header)
      const rows = screen.getAllByRole("row");
      expect(rows).toHaveLength(3); // Header row + 2 data rows

      // Check the items are 11 and 12
      expect(screen.getByText("Stuff Item 11")).toBeInTheDocument();
      expect(screen.getByText("Stuff Item 12")).toBeInTheDocument();
    });
  });

  it("disables next button when there are fewer than 10 items", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(secondPageData), // Only 2 items
    });

    renderWithStore();

    await waitFor(() => {
      expect(screen.getByText("Stuff Item 11")).toBeInTheDocument();
    });

    // Find Next buttons and verify they are disabled
    const buttons = screen.getAllByRole("button");
    const nextButtons = buttons.filter(
      (button) =>
        button.textContent?.includes("Next") ||
        button.getAttribute("aria-label")?.includes("Next")
    );

    nextButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it("disables previous button on first page", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(firstPageData),
    });

    renderWithStore();

    await waitFor(() => {
      expect(screen.getByText("Stuff Item 1")).toBeInTheDocument();
    });

    // Find Previous buttons and verify they are disabled
    const buttons = screen.getAllByRole("button");
    const previousButtons = buttons.filter(
      (button) =>
        button.textContent?.includes("Previous") ||
        button.getAttribute("aria-label")?.includes("Previous")
    );

    previousButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it("handles API errors gracefully", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    renderWithStore();

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    expect(screen.getByText("Error!")).toBeInTheDocument();
    expect(screen.getByText(/Failed to fetch stuff items/)).toBeInTheDocument();
  });

  it("shows empty state when no items are returned", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    renderWithStore();

    await waitFor(() => {
      expect(screen.getByText("No stuff items found.")).toBeInTheDocument();
    });
  });
});
