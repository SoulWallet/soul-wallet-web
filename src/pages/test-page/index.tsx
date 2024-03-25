import Button from '@/components/Button';
import { Flex } from '@chakra-ui/react';
import { client } from '@passwordless-id/webauthn';
import usePasskey from '@/hooks/usePasskey';

export default function TestPage() {
  const { register } = usePasskey();

  const doCreate1 = async () => {
    try {
      // const credential = await register('Test');
      // normal challenge
      await client.authenticate([], 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
      alert('success');
    } catch (e: any) {
      alert('error');
      alert(e.message);
    }
  };

  const doCreate2 = async () => {
    try {
      const credential = await register('Test');
      // hard challenge
      await client.authenticate([credential.id], 'siChYKS7kBJwtLKWAB5PSS5YuEfQs-9CTlmAZaqymA4');
      alert('success');
    } catch (e: any) {
      alert('error');
      alert(e.message);
    }
  };

  return (
    <Flex gap="20" p="4">
      <Button size="xl" onClick={doCreate1}>
        Test 1
      </Button>
      <Button size="xl" onClick={doCreate2}>
        Test 2
      </Button>
    </Flex>
  );
}
