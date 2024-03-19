import { createBrowserRouter, Navigate } from 'react-router-dom';
import WalletWrapper from './wrapper/WalletWrapper';
import PublicWrapper from './wrapper/PublicWrapper';
import Dashboard from '@/pages/dashboard';
import Create from '@/pages/create';
import Deposit from '@/pages/deposit';
import Landing from '@/pages/landing';
// import TestPage from '@/pages/test-page';
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
          // { path: 'test-page', element: <TestPage /> },
          { path: 'dashboard', element: <Dashboard /> },
          {
            path: '/',
            element: <Navigate to="/dashboard" replace />,
          },
        ],
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
        path: '/landing',
        element: <PublicWrapper />,
        children: [{ path: '', element: <Landing /> }],
      },
    ],
  },
]);
