import { WalletContextProvider } from "@/context/WalletContext";
import { ChakraProvider } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Fonts from "@/styles/Fonts";
import FindRoute from "@/components/FindRoute";
import Theme from "@/styles/Theme";

export default function Layout({ children }: any) {
  return (
    <ChakraProvider theme={Theme} toastOptions={{ defaultOptions: { duration: 1000 } }}>
      <Fonts />
      <FindRoute>
        <WalletContextProvider>
          <Outlet />
        </WalletContextProvider>
      </FindRoute>
    </ChakraProvider>
  );
}
