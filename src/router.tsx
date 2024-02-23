import { createBrowserRouter, Navigate } from 'react-router-dom';
import WalletWrapper from './wrapper/WalletWrapper';
import PublicWrapper from './wrapper/PublicWrapper';
import Dashboard from '@/pages/dashboard';
import Recover from '@/pages/recover';
import Popup from '@/pages/popup';
import Apps from '@/pages/apps';
import Asset from '@/pages/asset';
import Activity from '@/pages/activity';
import Security from '@/pages/security';
import Signer from '@/pages/security/Signer';
import Guardian from '@/pages/security/Guardian';
import Pay from '@/pages/public/Pay';
import Sign from '@/pages/public/Sign';
import Auth from '@/pages/auth';
import DashboardLayout from './components/Layouts/DashboardLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <WalletWrapper />,
    children: [
      {
        path: '/',
        element: <DashboardLayout />,
        children: [
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'apps', element: <Apps /> },
          { path: 'activity', element: <Activity /> },
          { path: 'asset', element: <Asset /> },
          { path: 'popup', element: <Popup /> },
          {
            path: 'security',
            element: <Security />,
            children: [
              { index: true, element: <Navigate to="signer" replace /> },
              { path: 'signer', element: <Signer /> },
              { path: 'guardian', element: <Guardian /> },
            ],
          },
          {
            path: '/',
            element: <Navigate to="/dashboard" replace />,
          },
        ],
      },
      {
        path: '/recover',
        element: <PublicWrapper />,
        children: [{ path: '', element: <Recover /> }],
      },
      {
        path: '/auth',
        element: <PublicWrapper />,
        children: [{ path: '', element: <Auth /> }],
      },
    ],
  },
  {
    path: '/public',
    element: <PublicWrapper />,
    children: [
      { path: 'sign', element: <Sign /> },
      { path: 'sign/:recoverId', element: <Sign /> },
      { path: 'pay', element: <Pay /> },
      { path: 'pay/:recoverId', element: <Pay /> },
    ],
  },
]);
