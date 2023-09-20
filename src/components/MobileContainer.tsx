import { Box } from "@chakra-ui/react";

export default function MobileContainer({ children, ...restProps }: any) {
  return (
    <Box w="500px" mx="auto" minH={"100vh"} {...restProps}>
      {children}
    </Box>
  );
}
