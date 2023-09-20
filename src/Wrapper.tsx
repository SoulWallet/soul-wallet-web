import { WalletContextProvider } from "@/context/WalletContext";
import { ChakraProvider } from "@chakra-ui/react";
import Fonts from "@/styles/Fonts";
import FindRoute from "@/components/FindRoute";
import { BrowserRouter } from "react-router-dom";
import Theme from "@/styles/Theme";

export default function Wrapper({ children }: any) {
  return (
    <BrowserRouter>
      <ChakraProvider
        theme={Theme}
        toastOptions={{ defaultOptions: { duration: 1000 } }}
      >
        <Fonts />
        <FindRoute>
          <WalletContextProvider>{children}</WalletContextProvider>
        </FindRoute>
      </ChakraProvider>
    </BrowserRouter>
  );
}
