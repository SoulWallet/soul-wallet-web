import { useEffect } from "react";
import useBrowser from "../hooks/useBrowser";
import { Box } from "@chakra-ui/react";
import { useAddressStore } from "@/store/address";

// Find the correct route to go

export default function FindRoute({ children }: any) {
  const { navigate } = useBrowser();
  const { addressList } = useAddressStore();

  const isLaunch =false;

  const findRoute = async () => {
    const recovering = localStorage.getItem("recovering");
    if (isLaunch) {
      navigate("launch");
    } else if (recovering) {
      navigate("recover");
    } else if (!addressList.length) {
      navigate("launch");
    } else {
      navigate("");
    }
  };

  useEffect(() => {
    findRoute();
  }, []);

  return (
    <Box bg="appBg" fontSize={"16px"} overflow={"auto"}>
      {children}
    </Box>
  );
}
