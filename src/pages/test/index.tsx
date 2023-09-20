import Button from "@/components/Button";
import usePasskey from "@/hooks/usePasskey";
import { Box } from "@chakra-ui/react";
import { useCredentialStore } from "@/store/credential";

export default function Test() {
  const { register, authenticate } = usePasskey();
  const { credentials } = useCredentialStore();
  return (
    <Box minH={"100vh"} p="16">
      <Button onClick={register}>Register</Button>
      {credentials.map((item: any) => (
        <Box>
          {JSON.stringify(item)} <Button onClick={() => authenticate(item.id, "111")}>Login</Button>
        </Box>
      ))}
    </Box>
  );
}
