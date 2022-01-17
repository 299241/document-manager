import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import DashboardApp from './pages/DashboardApp';
import Vault from './pages/Vault';
import Drafts from './pages/Drafts';
import Document from './pages/Document';
import NewDocument from './pages/NewDocument';
import NotFound from './pages/Page404';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard" replace /> },
        { path: 'dashboard', element: <DashboardApp /> },
        { path: 'vault', element: <Vault /> },
        { path: 'drafts', element: <Drafts /> },
        { path: 'document/:id', element: <Document /> }
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'login', element: <Login /> },
        { path: 'new', element: <NewDocument /> },
        { path: '404', element: <NotFound /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
