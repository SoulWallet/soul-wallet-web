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
import Security from '@/pages/security';
import NewSecurity from '@/pages/security_new';
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
      { path: 'security', element: <Security /> },
      { path: 'new_security', element: <NewSecurity /> },
      { path: 'auth', element: <Auth /> },
    ],
  },
]);
