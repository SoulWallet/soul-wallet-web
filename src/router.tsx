import { Route, Routes, } from "react-router-dom";
import Wallet from "@/pages/wallet";
import Send from "@/pages/send";
import SignPage from "@/pages/sign-page";
import ActivateWallet from "@/pages/activate";
// import CreatePage from "@/pages/create";
import Setting from "@/pages/setting";
import Accounts from "@/pages/accounts";
import AddFund from "@/pages/add-fund";
// import RecoverPage from "@/pages/recover";
// import EditGuardians from "@/pages/guardians";
import Launch from "@/pages/launch";
import Test from "./pages/test";

export default (
  <Routes>
    <Route path="/" element={<Wallet />} />
    <Route path="wallet" element={<Wallet />} />
    <Route path="accounts" element={<Accounts />} />
    <Route path="send/:tokenAddress" element={<Send />} />
    <Route path="setting" element={<Setting />} />
    <Route path="add-fund" element={<AddFund />} />
    <Route path="sign" element={<SignPage />} />
    <Route path="activate" element={<ActivateWallet />} />
    <Route path="launch" element={<Launch />} />
    <Route path="test" element={<Test />} />
    {/* <Route path="create" element={<CreatePage />} />
        <Route path="recover" element={<RecoverPage />} />
        <Route path="edit-guardians" element={<EditGuardians />} /> */}
    <Route path="*" element={<Wallet />} />
  </Routes>
);
