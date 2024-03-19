import { createBrowserRouter, Navigate } from 'react-router-dom';
import WalletWrapper from './wrapper/WalletWrapper';
import PublicWrapper from './wrapper/PublicWrapper';
import Dashboard from '@/pages/dashboard';
import Create from '@/pages/create';
import Landing from '@/pages/landing';
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
        path: '/landing',
        element: <PublicWrapper />,
        children: [{ path: '', element: <Landing /> }],
      },
    ],
  },
]);
