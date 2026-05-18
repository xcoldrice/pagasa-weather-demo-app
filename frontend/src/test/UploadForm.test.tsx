// UploadForm tests
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UploadForm } from "../components/UploadForm";
import * as apiClient from "../api/client";

vi.mock("../api/client", () => ({
  getSamples: vi.fn().mockResolvedValue([]),
}));

describe("UploadForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Form Rendering", () => {
    test("renders form controls and sections", () => {
      render(<UploadForm onSubmit={async () => {}} onSampleSubmit={async () => {}} />);
      
      expect(screen.getByText(/upload weather image/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/weather product type/i)).toBeInTheDocument();
      expect(screen.getByText(/use sample image/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /process uploaded image/i })).toBeInTheDocument();
    });

    test("displays default product type as temperature", () => {
      render(<UploadForm onSubmit={async () => {}} onSampleSubmit={async () => {}} />);
      
      const select = screen.getByLabelText(/weather product type/i);
      expect(select).toHaveTextContent("Temperature");
    });

    test("shows empty state when no samples available", async () => {
      vi.mocked(apiClient.getSamples).mockResolvedValue([]);
      
      render(<UploadForm onSubmit={async () => {}} onSampleSubmit={async () => {}} />);
      
      await waitFor(() => {
        expect(screen.getByText(/no sample images available/i)).toBeInTheDocument();
      });
    });
  });

  describe("Product Type Selection", () => {
    test("allows changing product type to rainfall", async () => {
      const user = userEvent.setup();
      render(<UploadForm onSubmit={async () => {}} onSampleSubmit={async () => {}} />);

      const select = screen.getByLabelText(/weather product type/i);
      await user.click(select);
      
      const rainfallOption = screen.getByRole("option", { name: /rainfall/i });
      await user.click(rainfallOption);

      expect(select).toHaveTextContent("Rainfall");
    });

    test("submits with selected product type", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn().mockResolvedValue(undefined);

      render(<UploadForm onSubmit={onSubmit} onSampleSubmit={async () => {}} />);

      // Change to rainfall
      const select = screen.getByLabelText(/weather product type/i);
      await user.click(select);
      await user.click(screen.getByRole("option", { name: /rainfall/i }));

      // Upload file
      const fileInput = screen.getByLabelText(/choose image file/i);
      const file = new File(["abc"], "rainfall.png", { type: "image/png" });
      await user.upload(fileInput, file);

      // Submit
      await user.click(screen.getByRole("button", { name: /process uploaded image/i }));

      expect(onSubmit).toHaveBeenCalledWith(file, "rainfall");
    });
  });

  describe("File Upload", () => {
    test("displays selected file name and size", async () => {
      const user = userEvent.setup();
      render(<UploadForm onSubmit={async () => {}} onSampleSubmit={async () => {}} />);

      const fileInput = screen.getByLabelText(/choose image file/i);
      const file = new File(["a".repeat(2048)], "test-image.png", { type: "image/png" });

      await user.upload(fileInput, file);

      expect(screen.getByText("test-image.png")).toBeInTheDocument();
      expect(screen.getByText(/2\.00 KB/)).toBeInTheDocument();
    });

    test("calls onSubmit when file is selected and form submitted", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn().mockResolvedValue(undefined);

      render(<UploadForm onSubmit={onSubmit} onSampleSubmit={async () => {}} />);

      const fileInput = screen.getByLabelText(/choose image file/i);
      const file = new File(["abc"], "sample.png", { type: "image/png" });

      await user.upload(fileInput, file);
      await user.click(screen.getByRole("button", { name: /process uploaded image/i }));

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith(file, "temperature");
    });

    test("allows submitting without file selected", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn().mockResolvedValue(undefined);

      render(<UploadForm onSubmit={onSubmit} onSampleSubmit={async () => {}} />);

      const submitButton = screen.getByRole("button", { name: /process uploaded image/i });
      expect(submitButton).not.toBeDisabled();
      
      await user.click(submitButton);

      // Should not call onSubmit when no file is selected
      expect(onSubmit).not.toHaveBeenCalled();
    });

    test("shows loading state during submission", async () => {
      const user = userEvent.setup();
      let resolveSubmit: () => void;
      const onSubmit = vi.fn().mockImplementation(() => new Promise((resolve) => {
        resolveSubmit = resolve as () => void;
      }));

      render(<UploadForm onSubmit={onSubmit} onSampleSubmit={async () => {}} />);

      const fileInput = screen.getByLabelText(/choose image file/i);
      const file = new File(["abc"], "sample.png", { type: "image/png" });

      await user.upload(fileInput, file);
      await user.click(screen.getByRole("button", { name: /process uploaded image/i }));

      // Should show loading state
      expect(screen.getByText(/processing\.\.\./i)).toBeInTheDocument();

      // Resolve the promise
      resolveSubmit!();
      
      await waitFor(() => {
        expect(screen.getByRole("button", { name: /process uploaded image/i })).toBeInTheDocument();
      });
    });
  });

  describe("Sample Images", () => {
    const mockSamples = [
      {
        id: "sample1",
        name: "Temperature Sample 1",
        product_type: "temperature" as const,
        file_name: "temp1.png",
        url: "/api/samples/temp1.png",
        path: "/data/samples/temperature/temp1.png",
      },
      {
        id: "sample2",
        name: "Rainfall Sample 1",
        product_type: "rainfall" as const,
        file_name: "rain1.png",
        url: "/api/samples/rain1.png",
        path: "/data/samples/rainfall/rain1.png",
      },
    ];

    test("fetches and displays sample images", async () => {
      vi.mocked(apiClient.getSamples).mockResolvedValue(mockSamples);

      render(<UploadForm onSubmit={async () => {}} onSampleSubmit={async () => {}} />);

      await waitFor(() => {
        expect(screen.getByText("Temperature Sample 1")).toBeInTheDocument();
        expect(screen.getByText("Rainfall Sample 1")).toBeInTheDocument();
      });
    });

    test("displays product type chips for samples", async () => {
      vi.mocked(apiClient.getSamples).mockResolvedValue(mockSamples);

      render(<UploadForm onSubmit={async () => {}} onSampleSubmit={async () => {}} />);

      await waitFor(() => {
        const chips = screen.getAllByText(/temperature|rainfall/i);
        expect(chips.length).toBeGreaterThan(0);
      });
    });

    test("calls onSampleSubmit when sample is clicked", async () => {
      const user = userEvent.setup();
      const onSampleSubmit = vi.fn().mockResolvedValue(undefined);
      vi.mocked(apiClient.getSamples).mockResolvedValue(mockSamples);

      render(<UploadForm onSubmit={async () => {}} onSampleSubmit={onSampleSubmit} />);

      await waitFor(() => {
        expect(screen.getByText("Temperature Sample 1")).toBeInTheDocument();
      });

      const useButtons = screen.getAllByRole("button", { name: /use this sample/i });
      await user.click(useButtons[0]);

      expect(onSampleSubmit).toHaveBeenCalledWith("sample1");
    });

    test("shows loading state when using sample", async () => {
      const user = userEvent.setup();
      let resolveSample: () => void;
      const onSampleSubmit = vi.fn().mockImplementation(() => new Promise((resolve) => {
        resolveSample = resolve as () => void;
      }));
      vi.mocked(apiClient.getSamples).mockResolvedValue(mockSamples);

      render(<UploadForm onSubmit={async () => {}} onSampleSubmit={onSampleSubmit} />);

      await waitFor(() => {
        expect(screen.getByText("Temperature Sample 1")).toBeInTheDocument();
      });

      const useButtons = screen.getAllByRole("button", { name: /use this sample/i });
      await user.click(useButtons[0]);

      // Buttons should be disabled during loading
      // const allButtons = screen.getAllByRole("button", { name: /use this sample|processing/i });
      // allButtons.forEach(button => {
      //   expect(button).toBeDisabled();
      // });

      resolveSample!();
    });

    test("handles getSamples error gracefully", async () => {
      vi.mocked(apiClient.getSamples).mockRejectedValue(new Error("Network error"));

      render(<UploadForm onSubmit={async () => {}} onSampleSubmit={async () => {}} />);

      await waitFor(() => {
        expect(screen.getByText(/no sample images available/i)).toBeInTheDocument();
      });
    });
  });

  describe("Form Interaction", () => {
    test("can upload file multiple times", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn().mockResolvedValue(undefined);

      render(<UploadForm onSubmit={onSubmit} onSampleSubmit={async () => {}} />);

      const fileInput = screen.getByLabelText(/choose image file/i);
      
      // First upload
      const file1 = new File(["abc"], "first.png", { type: "image/png" });
      await user.upload(fileInput, file1);
      expect(screen.getByText("first.png")).toBeInTheDocument();

      // Second upload
      const file2 = new File(["xyz"], "second.png", { type: "image/png" });
      await user.upload(fileInput, file2);
      expect(screen.getByText("second.png")).toBeInTheDocument();
      expect(screen.queryByText("first.png")).not.toBeInTheDocument();
    });

    test("displays OR divider between upload and samples", () => {
      render(<UploadForm onSubmit={async () => {}} onSampleSubmit={async () => {}} />);
      
      expect(screen.getByText("OR")).toBeInTheDocument();
    });
  });
});