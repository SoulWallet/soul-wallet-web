import { Box, Text, Flex, useToast, Tooltip } from '@chakra-ui/react';
import { InfoWrap, InfoItem } from '@/components/SignModal';
import { Image } from '@chakra-ui/react';
import { copyText } from '@/lib/tools';
import ReceiveCode from '@/components/ReceiveCode';
import Button from '@/components/Button';
import { useAddressStore } from '@/store/address';
import { useChainStore } from '@/store/chain';

export default function Receive() {
  const toast = useToast();
  const { selectedAddress } = useAddressStore();
  const { chainList } = useChainStore();

  const doCopy = () => {
    copyText(selectedAddress);
    toast({
      title: 'Copied',
      status: 'success',
    });
  };

  return (
    <Box>
      <Text mb="3" fontWeight={'800'} textAlign={"center"}>
        Add fund to start using Soul Wallet
      </Text>
      <Box bg="#fff" rounded="20px" p="4" mb="14px">
        <ReceiveCode address={selectedAddress} imgWidth="160px" showFullAddress={true} />
      </Box>
      <InfoWrap gap="3">
        <InfoItem>
          <Text>Supported Networks:</Text>
          <Flex align="center" gap="2px">
            {chainList.map((item, index) => (
              <Tooltip label={item.chainName} key={index}>
                <Image key={index} src={item.icon} w="20px" />
              </Tooltip>
            ))}
          </Flex>
        </InfoItem>
      </InfoWrap>

      <Button w="full" onClick={doCopy} fontSize="20px" py="4" fontWeight={'800'} mt="14px">
        Copy address
      </Button>
    </Box>
  );
}
