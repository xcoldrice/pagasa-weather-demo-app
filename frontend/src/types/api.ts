// API types
export type SampleItem = {
  id: string;
  name: string;
  product_type: "temperature" | "rainfall";
  file_name: string;
  url: string;
  path: string;
};

export type Insight = {
  level: string;
  title: string;
  message: string;
};

export type AiSummary = {
  executive_summary: string;
  key_risks: string[];
  recommended_actions: string[];
  plain_language_summary: string;
};

export type ProcessResponse = {
  run_id: string;
  status: string;
  product_type: "temperature" | "rainfall";
  summary: {
    min_value: number;
    max_value: number;
    mean_value: number;
  };
  risk_score?: {
    score: number;
    level: string;
  };
  insights?: Insight[];
  ai_summary?: AiSummary;
  files: {
    input_url: string;
    overlay_url: string;
    result_url: string;
  };
};

export type RunListItem = {
  run_id: string;
  product_type: string;
  status: string;
  risk_level: string;
  max_value: number;
  mean_value: number;
  created_at: string;
};

export type TrendsResponse = {
  count: number;
  avg_max_value: number | null;
  avg_mean_value: number | null;
  high_risk_runs: number;
};

export type VersionResponse = {
  app_version: string;
  git_sha: string;
};

export type HealthResponse = {
  status: string;
  database?: boolean;
  redis?: boolean;
};