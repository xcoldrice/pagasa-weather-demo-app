import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import ImageIcon from "@mui/icons-material/Image";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import PsychologyIcon from "@mui/icons-material/Psychology";
import WarningIcon from "@mui/icons-material/Warning";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CodeIcon from "@mui/icons-material/Code";
import { useLocation, useParams } from "react-router-dom";
import type { ProcessResponse } from "../types/api";
import { getResult } from "../api/client";
import PageContainer from "./PageContainer";

export default function ResultPage() {
  const pageTitle = `Results`;

  const location = useLocation();
  const { runId } = useParams<{ runId: string }>();
  const [result, setResult] = useState<ProcessResponse | undefined>(location.state as ProcessResponse | undefined);
  const [loading, setLoading] = useState(!result);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we already have the result from navigation state, no need to fetch
    if (result) {
      console.log("ResultPage received state:", result);
      return;
    }

    // Otherwise, fetch it from the API
    if (runId) {
      setLoading(true);
      getResult(runId)
        .then((data) => {
          console.log("ResultPage fetched data:", data);
          setResult(data);
          setError(null);
        })
        .catch((err) => {
          console.error("Failed to fetch result:", err);
          setError("Failed to load result. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError("No result ID provided.");
      setLoading(false);
    }
  }, [runId, result]);

  if (loading) {
    return (
      <PageContainer
        title={pageTitle}
        breadcrumbs={[
          { title: 'History', path: '/history' },
          { title: pageTitle },
        ]}
      >
        <Box className="w-full max-w-6xl mx-auto" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  if (error || !result) {
    return (
      <PageContainer
        title={pageTitle}
        breadcrumbs={[
          { title: 'History', path: '/history' },
          { title: pageTitle },
        ]}
      >
        <Box className="w-full max-w-6xl mx-auto">
          <div>{error || "No result found. Please upload an image first."}</div>
        </Box>
      </PageContainer>
    );
  }

  const apiBase = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

  const getRiskColor = (level?: string) => {
    switch (level?.toLowerCase()) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  const getInsightColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "critical":
      case "high":
        return "text-red-600 dark:text-red-400";
      case "medium":
        return "text-orange-600 dark:text-orange-400";
      case "low":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <PageContainer
      title={pageTitle}
      breadcrumbs={[
        { title: 'History', path: '/history' },
        { title: pageTitle },
      ]}
    >
      <Box className="w-full max-w-7xl mx-auto px-4 py-6">
        {/* Header Section */}
        <Box className="mb-6">
          <Typography variant="h4" className="font-bold mb-2 flex items-center gap-2">
            <AssessmentIcon className="text-4xl" />
            Processing Results
          </Typography>
          <Box className="flex items-center gap-3 mt-3">
            <Chip
              label={result.product_type}
              color="primary"
              size="medium"
              className="font-semibold"
            />
            <Chip
              label={result.status}
              color={result.status === "completed" ? "success" : "default"}
              size="medium"
              className="font-semibold uppercase"
            />
            <Chip
              icon={<WarningIcon />}
              label={`Risk: ${result.risk_score?.level ?? "unknown"}`}
              color={getRiskColor(result.risk_score?.level)}
              size="medium"
              className="font-semibold"
            />
          </Box>
        </Box>

        {/* Summary Statistics */}
        <Grid container spacing={3} className="mb-6">
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card className="h-full shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="text-center">
                <Typography variant="body2" color="text.secondary" className="mb-2">
                  Minimum Value
                </Typography>
                <Typography variant="h4" className="font-bold text-blue-600 dark:text-blue-400">
                  {result.summary.min_value?.toFixed(2) ?? "n/a"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card className="h-full shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="text-center">
                <Typography variant="body2" color="text.secondary" className="mb-2">
                  Maximum Value
                </Typography>
                <Typography variant="h4" className="font-bold text-red-600 dark:text-red-400">
                  {result.summary.max_value?.toFixed(2) ?? "n/a"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card className="h-full shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="text-center">
                <Typography variant="body2" color="text.secondary" className="mb-2">
                  Mean Value
                </Typography>
                <Typography variant="h4" className="font-bold text-green-600 dark:text-green-400">
                  {result.summary.mean_value?.toFixed(2) ?? "n/a"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card className="h-full shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="text-center">
                <Box className="flex items-center justify-center gap-1 mb-2">
                  <TrendingUpIcon className="text-sm" />
                  <Typography variant="body2" color="text.secondary">
                    Risk Score
                  </Typography>
                </Box>
                <Typography variant="h4" className="font-bold text-purple-600 dark:text-purple-400">
                  {result.risk_score?.score?.toFixed(0) ?? 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Images Section */}
        <Card className="mb-6 shadow-lg">
          <CardContent>
            <Box className="flex items-center gap-2 mb-4">
              <ImageIcon className="text-blue-500 text-2xl" />
              <Typography variant="h6" className="font-semibold">
                Processed Images
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={2} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Typography variant="subtitle1" className="font-semibold mb-3 text-center">
                    Original Input
                  </Typography>
                  <Box className="flex justify-center">
                    <img
                      src={`${apiBase}${result.files.input_url}`}
                      alt="Input"
                      className="max-w-full h-auto rounded-lg shadow-md hover:shadow-xl transition-shadow"
                      style={{ maxHeight: "400px" }}
                    />
                  </Box>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={2} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Typography variant="subtitle1" className="font-semibold mb-3 text-center">
                    Processed Overlay
                  </Typography>
                  <Box className="flex justify-center">
                    <img
                      src={`${apiBase}${result.files.overlay_url}`}
                      alt="Overlay"
                      className="max-w-full h-auto rounded-lg shadow-md hover:shadow-xl transition-shadow"
                      style={{ maxHeight: "400px" }}
                    />
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Actionable Insights */}
        {(result.insights ?? []).length > 0 && (
          <Card className="mb-6 shadow-lg">
            <CardContent>
              <Box className="flex items-center gap-2 mb-4">
                <LightbulbIcon className="text-yellow-500 text-2xl" />
                <Typography variant="h6" className="font-semibold">
                  Actionable Insights
                </Typography>
              </Box>
              <Box className="space-y-3">
                {result?.insights?.map((insight, idx) => (
                  <Paper
                    key={idx}
                    elevation={1}
                    className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg"
                  >
                    <Box className="flex items-start gap-3">
                      <WarningIcon className={`mt-1 ${getInsightColor(insight.level)}`} />
                      <Box className="flex-1">
                        <Typography variant="subtitle1" className="font-semibold mb-1">
                          {insight.title}
                        </Typography>
                        <Chip
                          label={insight.level}
                          size="small"
                          color={getRiskColor(insight.level)}
                          className="mb-2"
                        />
                        <Typography variant="body2" color="text.secondary">
                          {insight.message}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* AI Summary */}
        {result.ai_summary && (
          <Card className="mb-6 shadow-lg">
            <CardContent>
              <Box className="flex items-center gap-2 mb-4">
                <PsychologyIcon className="text-purple-500 text-2xl" />
                <Typography variant="h6" className="font-semibold">
                  AI-Generated Summary
                </Typography>
              </Box>

              {/* Executive Summary */}
              <Paper elevation={1} className="p-4 mb-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <Typography variant="subtitle2" className="font-semibold mb-2 text-blue-700 dark:text-blue-300">
                  Executive Summary
                </Typography>
                <Typography variant="body1">
                  {result.ai_summary.executive_summary}
                </Typography>
              </Paper>

              {/* Plain Language Summary */}
              <Paper elevation={1} className="p-4 mb-4 bg-green-50 dark:bg-green-900 rounded-lg">
                <Typography variant="subtitle2" className="font-semibold mb-2 text-green-700 dark:text-green-300">
                  Plain Language Summary
                </Typography>
                <Typography variant="body1">
                  {result.ai_summary.plain_language_summary}
                </Typography>
              </Paper>

              <Grid container spacing={3}>
                {/* Key Risks */}
                {(result.ai_summary.key_risks ?? []).length > 0 && (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={1} className="p-4 bg-red-50 dark:bg-red-900 rounded-lg h-full">
                      <Typography variant="subtitle2" className="font-semibold mb-3 text-red-700 dark:text-red-300">
                        Key Risks Identified
                      </Typography>
                      <Box component="ul" className="space-y-2 pl-5">
                        {result.ai_summary.key_risks.map((item, idx) => (
                          <li key={idx}>
                            <Typography variant="body2">{item}</Typography>
                          </li>
                        ))}
                      </Box>
                    </Paper>
                  </Grid>
                )}

                {/* Recommended Actions */}
                {(result.ai_summary.recommended_actions ?? []).length > 0 && (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={1} className="p-4 bg-orange-50 dark:bg-orange-900 rounded-lg h-full">
                      <Typography variant="subtitle2" className="font-semibold mb-3 text-orange-700 dark:text-orange-300">
                        Recommended Actions
                      </Typography>
                      <Box component="ul" className="space-y-2 pl-5">
                        {result.ai_summary.recommended_actions.map((item, idx) => (
                          <li key={idx}>
                            <Typography variant="body2">{item}</Typography>
                          </li>
                        ))}
                      </Box>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Raw JSON */}
        <Card className="shadow-lg">
          <CardContent>
            <Box className="flex items-center gap-2 mb-4">
              <CodeIcon className="text-gray-500 text-2xl" />
              <Typography variant="h6" className="font-semibold">
                Raw Response Data
              </Typography>
            </Box>
            <Divider className="mb-4" />
            <Paper
              elevation={0}
              className="p-4 bg-gray-900 dark:bg-black rounded-lg overflow-auto"
              style={{ maxHeight: "400px" }}
            >
              <pre className="text-xs text-green-400 font-mono">
                {JSON.stringify(result, null, 2)}
              </pre>
            </Paper>
          </CardContent>
        </Card>
      </Box>
    </PageContainer>
  );
}