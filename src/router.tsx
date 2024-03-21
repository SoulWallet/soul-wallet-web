import { createBrowserRouter, Navigate } from 'react-router-dom';
import WalletWrapper from './wrapper/WalletWrapper';
import PublicWrapper from './wrapper/PublicWrapper';
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
          {
            path: '/',
            element: <Navigate to="/dashboard" replace />,
          },
        ],
      },
      {
        path: '/details',
        element: <PublicWrapper />,
        children: [{ path: '', element: <DashboardDetails /> }],
      },
      {
        path: '/create',
        element: <PublicWrapper />,
        children: [{ path: '', element: <Create /> }],
      },
      {
        path: '/deposit',
        element: <PublicWrapper />,
        children: [{ path: '', element: <Deposit /> }],
      },
      {
        path: '/withdraw',
        element: <PublicWrapper />,
        children: [{ path: '', element: <Withdraw /> }],
      },
      {
        path: '/landing',
        element: <PublicWrapper />,
        children: [{ path: '', element: <Landing /> }],
      },

    ],
  },
]);
