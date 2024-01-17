import { createBrowserRouter } from 'react-router-dom';
import Wrapper from './Wrapper';
import Dashboard from '@/pages/dashboard';
import Create from '@/pages/create';
import Recover from '@/pages/recover';
import Popup from '@/pages/popup';
import Apps from '@/pages/apps';
import Launch from '@/pages/launch';
import Asset from '@/pages/asset';
import Activity from '@/pages/activity';
import Signer from '@/pages/security_new/signer';
import Guardian from '@/pages/security_new/guardian';
import Auth from '@/pages/auth';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Wrapper />,
    children: [
      { path: '/', element: <Dashboard /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'apps', element: <Apps /> },
      { path: 'launch', element: <Launch /> },
      { path: 'activity', element: <Activity /> },
      { path: 'asset', element: <Asset /> },
      { path: 'create', element: <Create /> },
      { path: 'recover', element: <Recover /> },
      { path: 'popup', element: <Popup />},
      { path: 'security', element: <Signer /> },
      { path: 'security/signer', element: <Signer /> },
      { path: 'security/guardian', element: <Guardian /> },
      { path: 'auth', element: <Auth /> },
    ],
  },
]);
