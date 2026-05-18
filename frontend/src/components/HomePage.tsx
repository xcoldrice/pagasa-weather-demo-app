import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import { processImage, processSample } from "../api/client";
import PageContainer from "./PageContainer";
import { UploadForm } from "../components/UploadForm";

export default function HomePage() {
  const pageTitle = `Home`;
  const navigate = useNavigate();

  async function handleSubmit(file: File, productType: string) {
    const result = await processImage(file, productType);
    navigate(`/results/${result.run_id}`, { state: result });
  }

  async function handleSampleSubmit(sampleId: string) {
    const result = await processSample(sampleId);
    navigate(`/results/${result.run_id}`, { state: result });
  }

  return (
    <PageContainer
      title={pageTitle}
      breadcrumbs={[
        { title: pageTitle },
      ]}
    >
      <Box className="w-full max-w-6xl mx-auto">
        <Paper elevation={0} className="mb-8 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <Typography variant="h3" component="h1" className="mb-4 font-semibold flex items-center gap-2">
            PAGASA Weather Decision Support Demo
          </Typography>
          <Typography variant="body1" className="mb-4 font-semibold flex items-center gap-2">
            Upload a weather image, or use a built-in sample for instant demo analysis.
          </Typography>
        </Paper>

        <UploadForm onSubmit={handleSubmit} onSampleSubmit={handleSampleSubmit} />
      </Box>
    </PageContainer>
  );
}