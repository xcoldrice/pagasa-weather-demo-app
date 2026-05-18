import { lazy, Suspense } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createBrowserRouter, RouterProvider } from 'react-router';
import NotificationsProvider from './hooks/useNotifications/NotificationsProvider';
import DialogsProvider from './hooks/useDialogs/DialogsProvider';
import AppTheme from './shared-theme/AppTheme';
import {
  dataGridCustomizations,
  datePickersCustomizations,
  sidebarCustomizations,
  formInputCustomizations,
} from './theme/customizations';

const DashboardLayout = lazy(() => import('./components/DashboardLayout'));
const HomePage = lazy(() => import('./components/HomePage'));
const EmployeeList = lazy(() => import('./components/EmployeeList'));
const EmployeeShow = lazy(() => import('./components/EmployeeShow'));
const EmployeeCreate = lazy(() => import('./components/EmployeeCreate'));
const EmployeeEdit = lazy(() => import('./components/EmployeeEdit'));
const ResultPage = lazy(() => import('./components/ResultPage'));
const HistoryPage = lazy(() => import('./components/HistoryPage'));
const OpsPage = lazy(() => import('./components/OpsPage'));

const router = createBrowserRouter([
  {
    Component: DashboardLayout,
    children: [
      {
        path: '/',
        Component: HomePage,
      },
      {
        path: '/results/:runId',
        Component: ResultPage,
      },
      {
        path: '/history',
        Component: HistoryPage,
      },
      {
        path: '/ops',
        Component: OpsPage,
      },
      {
        path: '/employees',
        Component: EmployeeList,
      },
      {
        path: '/employees/:employeeId',
        Component: EmployeeShow,
      },
      {
        path: '/employees/new',
        Component: EmployeeCreate,
      },
      {
        path: '/employees/:employeeId/edit',
        Component: EmployeeEdit,
      },
      // Fallback route for the example routes in dashboard sidebar items
      {
        path: '*',
        Component: EmployeeList,
      },
    ],
  },
]);

const themeComponents = {
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...sidebarCustomizations,
  ...formInputCustomizations,
};

export default function App() {
  return (
    <AppTheme themeComponents={themeComponents}>
      <CssBaseline enableColorScheme />
      <NotificationsProvider>
        <DialogsProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <RouterProvider router={router} />
          </Suspense>
        </DialogsProvider>
      </NotificationsProvider>
    </AppTheme>
  );
}
