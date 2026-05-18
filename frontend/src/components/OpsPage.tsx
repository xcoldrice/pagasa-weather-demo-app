import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import StorageIcon from "@mui/icons-material/Storage";
import SpeedIcon from "@mui/icons-material/Speed";
import CodeIcon from "@mui/icons-material/Code";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WarningIcon from "@mui/icons-material/Warning";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { useEffect, useState } from "react";
import { getHealth, getVersion, getTrends } from "../api/client";
import type { TrendsResponse, HealthResponse, VersionResponse } from "../types/api";
import PageContainer from "./PageContainer";

export default function OpsPage() {
  const pageTitle = `Operations`;

  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [version, setVersion] = useState<VersionResponse | null>(null);
  const [trends, setTrends] = useState<TrendsResponse | null>(null);

  useEffect(() => {
    getHealth().then(setHealth).catch(() => setHealth({ status: "error" }));
    getVersion().then(setVersion).catch(() => setVersion(null));
    getTrends().then(setTrends).catch(() => setTrends(null));
  }, []);

  const isHealthy = health?.status === "ready";
  const isDatabaseHealthy = health?.database === true;
  const isRedisHealthy = health?.redis === true;

  return (
    <PageContainer
      title={pageTitle}
      breadcrumbs={[
        { title: 'Home', path: '/' },
        { title: pageTitle },
      ]}
    >
      <Box className="w-full max-w-7xl mx-auto px-4 py-6">
        {/* Header Section */}
        <Box className="mb-8">
          <Typography variant="h4" className="font-bold mb-2 flex items-center gap-2">
            <AssessmentIcon className="text-4xl" />
            System Operations Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor system health, services, and performance trends
          </Typography>
        </Box>

        {/* System Health Section */}
        <Grid container spacing={3} className="mb-6">
          <Grid size={{ xs: 12, md: 4 }}>
            <Card className="h-full shadow-lg hover:shadow-xl transition-shadow">
              <CardContent>
                <Box className="flex items-center justify-between mb-3">
                  <Typography variant="h6" className="font-semibold">
                    System Status
                  </Typography>
                  {isHealthy ? (
                    <CheckCircleIcon className="text-green-500 text-3xl" />
                  ) : (
                    <ErrorIcon className="text-red-500 text-3xl" />
                  )}
                </Box>
                <Chip
                  label={health?.status ?? "unknown"}
                  color={isHealthy ? "success" : "error"}
                  className="font-semibold uppercase"
                  size="medium"
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card className="h-full shadow-lg hover:shadow-xl transition-shadow">
              <CardContent>
                <Box className="flex items-center justify-between mb-3">
                  <Typography variant="h6" className="font-semibold">
                    Database
                  </Typography>
                  <StorageIcon className={`text-3xl ${isDatabaseHealthy ? 'text-blue-500' : 'text-gray-400'}`} />
                </Box>
                <Box className="flex items-center gap-2">
                  {isDatabaseHealthy ? (
                    <CheckCircleIcon className="text-green-500" />
                  ) : (
                    <ErrorIcon className="text-red-500" />
                  )}
                  <Typography variant="body1" className="font-medium">
                    {isDatabaseHealthy ? "Connected" : "Disconnected"}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card className="h-full shadow-lg hover:shadow-xl transition-shadow">
              <CardContent>
                <Box className="flex items-center justify-between mb-3">
                  <Typography variant="h6" className="font-semibold">
                    Redis Cache
                  </Typography>
                  <SpeedIcon className={`text-3xl ${isRedisHealthy ? 'text-orange-500' : 'text-gray-400'}`} />
                </Box>
                <Box className="flex items-center gap-2">
                  {isRedisHealthy ? (
                    <CheckCircleIcon className="text-green-500" />
                  ) : (
                    <ErrorIcon className="text-red-500" />
                  )}
                  <Typography variant="body1" className="font-medium">
                    {isRedisHealthy ? "Connected" : "Disconnected"}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Version Information */}
        <Card className="mb-6 shadow-lg">
          <CardContent>
            <Box className="flex items-center gap-2 mb-4">
              <CodeIcon className="text-purple-500 text-2xl" />
              <Typography variant="h6" className="font-semibold">
                Version Information
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <Typography variant="body2" color="text.secondary" className="mb-1">
                    Application Version
                  </Typography>
                  <Typography variant="h6" className="font-mono">
                    {version?.app_version ?? "unavailable"}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <Typography variant="body2" color="text.secondary" className="mb-1">
                    Git Commit SHA
                  </Typography>
                  <Typography variant="h6" className="font-mono text-sm">
                    {version?.git_sha ?? "unavailable"}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Trends Section */}
        <Card className="shadow-lg">
          <CardContent>
            <Box className="flex items-center gap-2 mb-4">
              <TrendingUpIcon className="text-blue-500 text-2xl" />
              <Typography variant="h6" className="font-semibold">
                Analytics Trends
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg">
                  <Typography variant="body2" color="text.secondary" className="mb-2">
                    Total Recent Runs
                  </Typography>
                  <Typography variant="h4" className="font-bold text-blue-700 dark:text-blue-300">
                    {trends?.count ?? 0}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg">
                  <Typography variant="body2" color="text.secondary" className="mb-2">
                    Avg Max Value
                  </Typography>
                  <Typography variant="h4" className="font-bold text-green-700 dark:text-green-300">
                    {trends?.avg_max_value ? Number(trends.avg_max_value).toFixed(2) : "n/a"}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg">
                  <Typography variant="body2" color="text.secondary" className="mb-2">
                    Avg Mean Value
                  </Typography>
                  <Typography variant="h4" className="font-bold text-purple-700 dark:text-purple-300">
                    {trends?.avg_mean_value ? Number(trends.avg_mean_value).toFixed(2) : "n/a"}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 rounded-lg">
                  <Box className="flex items-center justify-center gap-1 mb-2">
                    <WarningIcon className="text-sm" />
                    <Typography variant="body2" color="text.secondary">
                      High Risk Runs
                    </Typography>
                  </Box>
                  <Typography variant="h4" className="font-bold text-red-700 dark:text-red-300">
                    {trends?.high_risk_runs ?? 0}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </PageContainer>
  );
}