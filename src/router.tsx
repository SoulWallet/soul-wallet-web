import { createBrowserRouter } from 'react-router-dom';
import WalletWrapper from './wrapper/WalletWrapper';
import PublicWrapper from './wrapper/PublicWrapper';
import Dashboard from '@/pages/dashboard';
import Create from '@/pages/create';
import Recover from '@/pages/new_recover';
import Popup from '@/pages/popup';
import Apps from '@/pages/apps';
import Launch from '@/pages/launch';
import Asset from '@/pages/asset';
import Activity from '@/pages/activity';
import Security from '@/pages/security_new';
import Signer from '@/pages/security_new/Signer';
import Guardian from '@/pages/security_new/Guardian';
import Pay from '@/pages/public/Pay';
import Sign from '@/pages/public/Sign';
import Auth from '@/pages/auth';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <WalletWrapper />,
    children: [
      { path: '/', element: <Dashboard /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'apps', element: <Apps /> },
      { path: 'launch', element: <Launch /> },
      { path: 'activity', element: <Activity /> },
      { path: 'asset', element: <Asset /> },
      { path: 'create', element: <Create /> },
      { path: 'recover', element: <Recover /> },
      { path: 'popup', element: <Popup /> },
      {
        path: 'security',
        element: <Security />,
        children: [
          { index: true, element: <Signer /> },
          { path: 'signer', element: <Signer /> },
          { path: 'guardian', element: <Guardian /> },
        ],
      },
      { path: 'auth', element: <Auth /> },
    ],
  },
  {
    path: '/public',
    element: <PublicWrapper />,
    children: [
      { path: 'sign', element: <Sign /> },
      { path: 'pay', element: <Pay /> },
    ]
  },
]);
