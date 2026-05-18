import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  gridClasses,
} from '@mui/x-data-grid';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router';
import { getRuns } from "../api/client";
import type { RunListItem } from "../types/api";
import PageContainer from "./PageContainer";

const INITIAL_PAGE_SIZE = 10;

export default function HistoryPage() {
  const pageTitle = 'History';
  const navigate = useNavigate();

  const [runs, setRuns] = React.useState<RunListItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const data = await getRuns();
      setRuns(data);
    } catch (loadError) {
      setError(loadError as Error);
      setRuns([]);
    }

    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = React.useCallback(() => {
    if (!isLoading) {
      loadData();
    }
  }, [isLoading, loadData]);

  const handleRowClick = React.useCallback<GridEventListener<'rowClick'>>(
    ({ row }) => {
      navigate(`/results/${row.run_id}`);
    },
    [navigate],
  );

  const handleRowView = React.useCallback(
    (run: RunListItem) => () => {
      navigate(`/results/${run.run_id}`);
    },
    [navigate],
  );

  const initialState = React.useMemo(
    () => ({
      pagination: { paginationModel: { pageSize: INITIAL_PAGE_SIZE } },
    }),
    [],
  );

  const columns = React.useMemo<GridColDef[]>(
    () => [
      { 
        field: 'run_id', 
        headerName: 'Run ID', 
        width: 180,
        filterable: true,
      },
      { 
        field: 'product_type', 
        headerName: 'Product Type', 
        width: 140,
        type: 'singleSelect',
        valueOptions: ['rainfall', 'temperature'],
      },
      { 
        field: 'status', 
        headerName: 'Status', 
        width: 120,
        type: 'singleSelect',
        valueOptions: ['pending', 'processing', 'completed', 'failed'],
      },
      { 
        field: 'risk_level', 
        headerName: 'Risk Level', 
        width: 120,
        type: 'singleSelect',
        valueOptions: ['low', 'moderate', 'high', 'extreme'],
      },
      { 
        field: 'max_value', 
        headerName: 'Max Value', 
        type: 'number',
        width: 120,
        valueFormatter: (value: number | null) => value != null ? value.toFixed(2) : 'N/A',
      },
      { 
        field: 'mean_value', 
        headerName: 'Mean Value', 
        type: 'number',
        width: 120,
        valueFormatter: (value: number | null) => value != null ? value.toFixed(2) : 'N/A',
      },
      {
        field: 'created_at',
        headerName: 'Created At',
        type: 'dateTime',
        width: 200,
        valueGetter: (value) => value && new Date(value),
        valueFormatter: (value: Date | null) => {
          if (!value) return 'N/A';
          return value.toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });
        },
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 80,
        align: 'right',
        getActions: ({ row }) => [
          <GridActionsCellItem
            key="view-item"
            icon={<VisibilityIcon />}
            label="View"
            onClick={handleRowView(row)}
          />,
        ],
      },
    ],
    [handleRowView],
  );

  return (
    <PageContainer
      title={pageTitle}
      breadcrumbs={[
        { title: 'Home', path: '/' },
        { title: pageTitle },
      ]}
      actions={
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Tooltip title="Reload data" placement="right" enterDelay={1000}>
            <div>
              <IconButton size="small" aria-label="refresh" onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </div>
          </Tooltip>
        </Stack>
      }
    >
      <Box sx={{ flex: 1, width: '100%' }}>
        {error ? (
          <Box sx={{ flexGrow: 1 }}>
            <Alert severity="error">{error.message}</Alert>
          </Box>
        ) : (
          <DataGrid
            rows={runs}
            columns={columns}
            getRowId={(row) => row.run_id}
            pagination
            paginationModel={{ page: 0, pageSize: INITIAL_PAGE_SIZE }}
            disableRowSelectionOnClick
            onRowClick={handleRowClick}
            loading={isLoading}
            initialState={initialState}
            pageSizeOptions={[5, INITIAL_PAGE_SIZE, 25, 50]}
            sx={{
              [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
                outline: 'transparent',
              },
              [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]:
                {
                  outline: 'none',
                },
              [`& .${gridClasses.row}:hover`]: {
                cursor: 'pointer',
              },
            }}
            slotProps={{
              loadingOverlay: {
                variant: 'circular-progress',
                noRowsVariant: 'circular-progress',
              },
              baseIconButton: {
                size: 'small',
              },
            }}
          />
        )}
      </Box>
    </PageContainer>
  );
}