import { Route, Routes, createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import Wallet from '@/pages/wallet';
import Send from '@/pages/send';
import SignPage from '@/pages/sign-page';
import ActivateWallet from '@/pages/activate';
import Create from '@/pages/create';
import Setting from '@/pages/setting';
import Accounts from '@/pages/accounts';
import AddFund from '@/pages/add-fund';
// import RecoverPage from "@/pages/recover";
// import EditGuardians from "@/pages/guardians";
import Launch from '@/pages/launch';
import Test from './pages/test';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: 'wallet', element: <Wallet /> },
      { path: 'accounts', element: <Accounts /> },
      { path: 'send/:tokenAddress', element: <Send /> },
      { path: 'setting', element: <Setting /> },
      { path: 'add-fund', element: <AddFund /> },
      { path: 'sign', element: <SignPage /> },
      { path: 'activate', element: <ActivateWallet /> },
      { path: 'launch', element: <Launch /> },
      { path: 'create', element: <Create /> },
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
