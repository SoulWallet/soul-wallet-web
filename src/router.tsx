import { Route, Routes, createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import Wallet from '@/pages/wallet';
import SignPage from '@/pages/sign-page';
import ActivateWallet from '@/pages/activate';
import Create from '@/pages/create';
import Setting from '@/pages/setting';
import Accounts from '@/pages/accounts';
import Popup from '@/pages/popup';
import Apps from '@/pages/apps';
// import RecoverPage from "@/pages/recover";
// import EditGuardians from "@/pages/guardians";
import Launch from '@/pages/launch';
import Security from '@/pages/security';
import Test from './pages/test';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: 'wallet', element: <Wallet /> },
      { path: 'accounts', element: <Accounts /> },
      { path: 'setting', element: <Setting /> },
      { path: 'sign', element: <SignPage /> },
      { path: 'activate', element: <ActivateWallet /> },
      { path: 'apps', element: <Apps /> },
      { path: 'launch', element: <Launch /> },
      { path: 'create', element: <Create /> },
      { path: 'popup', element: <Popup />},
      { path: 'security', element: <Security /> },
      { path: 'test', element: <Test /> },
      { path: '*', element: <Wallet /> },
      {
        /* <Route path="create" element={<CreatePage />} />
          <Route path="recover" element={<RecoverPage />} />
          <Route path="edit-guardians" element={<EditGuardians />} /> */
      },
    ],
  },
]);
