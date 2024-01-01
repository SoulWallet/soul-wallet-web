import { createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import Wallet from '@/pages/wallet';
import Create from '@/pages/create';
import Recover from '@/pages/recover';
import Popup from '@/pages/popup';
import Apps from '@/pages/apps';
import Launch from '@/pages/launch';
import Asset from '@/pages/asset';
import Activity from '@/pages/activity';
import Security from '@/pages/security';
import Auth from '@/pages/auth';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <Wallet /> },
      { path: 'wallet', element: <Wallet /> },
      { path: 'apps', element: <Apps /> },
      { path: 'launch', element: <Launch /> },
      { path: 'activity', element: <Activity /> },
      { path: 'asset', element: <Asset /> },
      { path: 'create', element: <Create /> },
      { path: 'recover', element: <Recover /> },
      { path: 'popup', element: <Popup />},
      { path: 'security', element: <Security /> },
      { path: 'auth', element: <Auth /> },
    ],
  },
]);
