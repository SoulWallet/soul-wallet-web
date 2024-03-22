import { createBrowserRouter, Navigate } from 'react-router-dom';
import WalletWrapper from './wrapper/WalletWrapper';
import Dashboard from '@/pages/dashboard';
import Create from '@/pages/create';
import Deposit from '@/pages/deposit';
import Withdraw from '@/pages/withdraw';
import Landing from '@/pages/landing';
import Intro from '@/pages/intro';
import DashboardDetails from '@/pages/dashboard/Details';
import AppContainer from './components/mobile/AppContainer';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <WalletWrapper />,
    children: [
      {
        path: '/',
        element: <AppContainer />,
        children: [
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'intro', element: <Intro /> },
        ],
      },
      {
        path: '/details',
        element: <DashboardDetails />,
      },
      {
        path: '/create',
        element: <Create />,
      },
      {
        path: '/deposit',
        element: <Deposit />,
      },
      {
        path: '/withdraw',
        element: <Withdraw />,
      },
      {
        path: '/landing',
        element: <Landing />,
      },
      {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
]);
