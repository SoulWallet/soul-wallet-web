import { Box, Text, Flex, useToast, Tooltip, Link, Input } from '@chakra-ui/react';
import { InfoWrap, InfoItem } from '@/components/SignTransactionModal';
import { useState } from 'react';
import { Image } from '@chakra-ui/react';
import { copyText } from '@/lib/tools';
import ReceiveCode from '@/components/ReceiveCode';
import Button from '@/components/Button';
import { useAddressStore } from '@/store/address';
import { useChainStore } from '@/store/chain';
import useConfig from '@/hooks/useConfig';
import IconPen from '@/assets/icons/pen.svg';
import IconShare from '@/assets/icons/share.svg';
import { useSettingStore } from '@/store/setting';

export default function Receive() {
  const toast = useToast();
  const { selectedAddress } = useAddressStore();
  const { getAddressName, saveAddressName } = useSettingStore()
  const { chainList } = useChainStore();
  const { selectedAddressItem, chainConfig } = useConfig();
  const { scanUrl, scanName } = chainConfig;
  const [editing, setEditing] = useState(false);
  const [editingName, setEditingName] = useState(getAddressName(selectedAddress));

  const doCopy = () => {
    copyText(selectedAddress);
    toast({
      title: 'Copied',
      status: 'success',
    });
  };

  const doEdit = () => {
    saveAddressName(selectedAddress, editingName)
    setEditing(false);
  };

  return (
    <Box w="320px" mx="auto">
      <Flex gap="2" mb="3" align={'center'} justify={'center'}>
        {editing ? (
          <Input value={editingName} onChange={(e) => setEditingName(e.target.value)} />
        ) : (
          <Text fontWeight={'800'} fontSize={'20px'} textAlign={'center'}>
            {getAddressName(selectedAddress)}
          </Text>
        )}

        {editing ? (
          <Button py="2" onClick={doEdit}>
            Done
          </Button>
        ) : (
          <Image cursor={'pointer'} src={IconPen} onClick={() => setEditing(true)} />
        )}
      </Flex>

      <Box bg="#ededed" rounded="20px" p="4" mb="14px" py="6" textAlign={'center'} mx="auto">
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

      <Button w="full" onClick={doCopy} fontSize="20px" py="4" fontWeight={'800'} mt="4">
        Copy address
      </Button>

      <Flex
        gap="1"
        as={Link}
        mt="3"
        textDecoration={'none'}
        justify={'center'}
        align={'center'}
        href={`${scanUrl}/address/${selectedAddress}`}
        target="_blank"
      >
        <Text lineHeight={'1'} fontSize={'18px'} fontWeight={'600'} textDecoration={'none'}>
          {scanName}
        </Text>
        <Image src={IconShare} />
      </Flex>
    </Box>
  );
}
