import { Box } from '@chakra-ui/react';
import ReceiveCode from '@/components/ReceiveCode';
import { useAddressStore } from '@/store/address';

export default function Receive() {
  const { selectedAddress } = useAddressStore();

  return (
    <Box mx="auto">
      <ReceiveCode address={selectedAddress} imgWidth="160px" showFullAddress={true} />
    </Box>
  );
}
