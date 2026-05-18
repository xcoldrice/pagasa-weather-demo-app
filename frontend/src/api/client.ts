// API client
import type {
  HealthResponse,
  ProcessResponse,
  VersionResponse,
  RunListItem,
  TrendsResponse,
  SampleItem,
} from "../types/api";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export async function processImage(file: File, productType: string): Promise<ProcessResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("product_type", productType);

  const response = await fetch(`${API_BASE}/api/process`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to process image");
  return response.json();
}

export async function getSamples(): Promise<SampleItem[]> {
  const response = await fetch(`${API_BASE}/api/samples`);
  if (!response.ok) throw new Error("Failed to fetch samples");
  return response.json();
}

export async function processSample(sampleId: string): Promise<ProcessResponse> {
  const response = await fetch(`${API_BASE}/api/process-sample/${sampleId}`, {
    method: "POST",
  });

  if (!response.ok) throw new Error("Failed to process sample image");
  return response.json();
}

export async function getHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE}/ready`);
  if (!response.ok) throw new Error("Failed to fetch health");
  return response.json();
}

export async function getVersion(): Promise<VersionResponse> {
  const response = await fetch(`${API_BASE}/version`);
  if (!response.ok) throw new Error("Failed to fetch version");
  return response.json();
}

export async function getRuns(): Promise<RunListItem[]> {
  const response = await fetch(`${API_BASE}/api/runs`);
  if (!response.ok) throw new Error("Failed to fetch runs");
  return response.json();
}

export async function getResult(runId: string): Promise<ProcessResponse> {
  const response = await fetch(`${API_BASE}/api/results/${runId}`);
  if (!response.ok) throw new Error("Failed to fetch result");
  return response.json();
}

export async function getTrends(): Promise<TrendsResponse> {
  const response = await fetch(`${API_BASE}/api/analytics/trends`);
  if (!response.ok) throw new Error("Failed to fetch trends");
  return response.json();
}