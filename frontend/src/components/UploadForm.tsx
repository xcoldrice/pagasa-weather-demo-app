// Upload form component
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";
import { styled } from "@mui/material/styles";
import { getSamples } from "../api/client";
import type { SampleItem } from "../types/api";

type Props = {
  onSubmit: (file: File, productType: string) => Promise<void>;
  onSampleSubmit: (sampleId: string) => Promise<void>;
};

const VisuallyHiddenInput = styled("input")(() => ({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
}));

export function UploadForm({ onSubmit, onSampleSubmit }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [productType, setProductType] = useState("temperature");
  const [loading, setLoading] = useState(false);
  const [samples, setSamples] = useState<SampleItem[]>([]);

  useEffect(() => {
    getSamples().then(setSamples).catch(() => setSamples([]));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    try {
      await onSubmit(file, productType);
    } finally {
      setLoading(false);
    }
  }

  async function handleUseSample(sampleId: string) {
    setLoading(true);
    try {
      await onSampleSubmit(sampleId);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box className="space-y-8">
      {/* Upload Form Section */}
      <Paper elevation={2} className="p-6">
        <Typography variant="h5" component="h3" className="mb-4 font-semibold flex items-center gap-2">
          <CloudUploadIcon /> Upload Weather Image
        </Typography>
        
        <form onSubmit={handleSubmit} className="mt-4">
          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel id="product-type-label">Weather Product Type</InputLabel>
              <Select
                labelId="product-type-label"
                value={productType}
                label="Weather Product Type"
                onChange={(e) => setProductType(e.target.value)}
              >
                <MenuItem value="temperature">Temperature</MenuItem>
                <MenuItem value="rainfall">Rainfall</MenuItem>
              </Select>
            </FormControl>

            <Box>
              <Button
                component="label"
                variant="outlined"
                startIcon={<ImageIcon />}
                fullWidth
                className="py-3"
              >
                {file ? file.name : "Choose Image File"}
                <VisuallyHiddenInput
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </Button>
              {file && (
                <Typography variant="caption" className="mt-2 block text-gray-600">
                  Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </Typography>
              )}
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="large"
              // disabled={!file || loading}
              startIcon={loading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
              className="py-3"
            >
              {loading ? "Processing..." : "Process Uploaded Image"}
            </Button>
          </Stack>
        </form>
      </Paper>

      <Divider className="my-8">
        <Chip label="OR" />
      </Divider>

      {/* Sample Images Section */}
      <Box>
        <Typography variant="h5" component="h2" className="mb-4 font-semibold flex items-center gap-2">
          <ImageIcon /> Use Sample Image
        </Typography>
        
        {samples.length === 0 ? (
          <Paper elevation={1} className="p-8 text-center">
            <Typography color="text.secondary">
              No sample images available.
            </Typography>
          </Paper>
        ) : (
          <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
            {samples.map((sample) => (
              <Card key={sample.id} elevation={3} className="h-full flex flex-col hover:shadow-lg transition-shadow">
                <CardMedia
                  component="img"
                  height="200"
                  image={`${import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000"}${sample.url}`}
                  alt={sample.name}
                  className="object-cover"
                  sx={{ height: 200 }}
                />
                <CardContent className="flex-grow">
                  <Typography variant="h6" component="div" className="mb-2">
                    {sample.name}
                  </Typography>
                  <Chip
                    label={sample.product_type}
                    size="small"
                    color={sample.product_type === "temperature" ? "error" : "primary"}
                    className="capitalize"
                  />
                </CardContent>
                <CardActions className="p-4 pt-0">
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleUseSample(sample.id)}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} /> : undefined}
                  >
                    {loading ? "Processing..." : "Use This Sample"}
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}