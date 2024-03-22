import Button from '@/components/Button';
import usePasskey from '@/hooks/usePasskey';
import useWallet from '@/hooks/useWallet';

export default function TestPage() {
  const { register } = usePasskey();
  const { createWallet } = useWallet();

  const doCreate = async () => {
    try {
      const credential = await register('tttttz');
      await createWallet(credential, 'tttttzf', 'BNX-V2S-31Q');
      alert('success')
    } catch (e: any) {
      alert('error');
      alert(e.message);
    }
  };

  return <Button onClick={doCreate}>Create wallet</Button>;
}
