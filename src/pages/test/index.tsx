import Button from "@/components/Button";
import usePasskey from "@/hooks/usePasskey";
import { Box } from "@chakra-ui/react";
import { useCredentialStore } from "@/store/credential";

export default function Test() {
  const { register, authenticate } = usePasskey();
  const { credentials } = useCredentialStore();

  const getCredentials = () => {
    navigator.credentials.get()
  };
  
  return (
    <Box minH={"100vh"} p="16">
      <Button p="4" onClick={getCredentials} mb="6">
        Get Credentials
      </Button>
      <Button p="4" onClick={register} mb="6">
        Register
      </Button>
      <Box>
        <input
          aria-invalid="true"
          autoComplete="webauthn"
          id="username-register"
          name="username"
          type="text"
          autoCapitalize="none"
          autoCorrect="off"
        />
      </Box>
      {credentials.map((item: any) => (
        <Box bg="#fff" rounded={"4px"} my="4" p="4" key={item.id}>
          {JSON.stringify(item)} <Button onClick={() => authenticate(item.id, "111")}>Login</Button>
        </Box>
      ))}
    </Box>
  );
}
