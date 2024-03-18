import Button from '@/components/Button';
import usePasskey from '@/hooks/usePasskey';
import useWallet from '@/hooks/useWallet';
import { Box } from '@chakra-ui/react';

export default function TestPage() {
  const { createWallet } = useWallet();
  const doCreateAndActivate = async () => {
    const res = await createWallet('Wallet', 'HIQ-LAY-M6J');
    console.log('create result', res);
  };
  return (
    <Box p="8">
      <Button onClick={doCreateAndActivate} size="lg">
        Create and activate
      </Button>
    </Box>
  );
}
