import { useState } from 'react';
import { Box, Flex, Text, Image, useMediaQuery } from '@chakra-ui/react';
import IconEdit from '@/assets/icons/edit.svg';
import Input from '@/components/Input';
import AddressIcon from '@/components/AddressIcon';
import Modal from '@/components/Modal';
import useTools from '@/hooks/useTools';
import Button from '@/components/Button';
import { useAddressStore } from '@/store/address';
import { useTempStore } from '@/store/temp';

export const EditNameModal = ({
  defaultValue,
  onCancel,
  onConfirm,
}: {
  defaultValue: string;
  onCancel: () => void;
  onConfirm: (name: string) => void;
}) => {
  const [name, setName] = useState(defaultValue);

  return (
    <Modal visible={true} width={{ lg: '516px' }} hideClose={true}>
      <Text fontSize="20px" fontWeight={'800'} lineHeight={'1.2'} mb="14px">
        Edit wallet name
      </Text>
      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter wallet name" mb="9" />
      <Flex justify={'flex-end'} gap="3">
        <Button onClick={onCancel} type="white" py="10px" px="6">
          Cancel
        </Button>
        <Button
          onClick={() => {
            onConfirm(name);
            onCancel();
          }}
          type="black"
          py="10px"
          px="6"
        >
          Save
        </Button>
      </Flex>
    </Modal>
  );
};

export default function AvatarWithName({ editable = false }: { editable: boolean }) {
  const { getWalletName, setWalletName } = useTools();
  const [editNameModalVisible, setEditNameModalVisible] = useState(false);
  const [isLargerThan992] = useMediaQuery('(min-width: 992px)');
  const walletName = getWalletName();
  const { selectedAddress } = useAddressStore();
  const { createInfo } = useTempStore();

  const changeWalletName = (name: string) => {
    setWalletName(name);
  };
  return (
    <>
      <Flex align={'center'} gap="1">
        <Flex gap="2" align={'center'}>
          <AddressIcon address={selectedAddress} width={isLargerThan992 ? 32 : 24} />
          <Text fontWeight={'800'} fontSize={{ base: '14px', md: '16px', lg: '18px' }}>
            {createInfo.walletName || walletName || 'Wallet'}
          </Text>
        </Flex>
      </Flex>
      {editNameModalVisible && (
        <EditNameModal
          defaultValue={walletName}
          onConfirm={changeWalletName}
          onCancel={() => setEditNameModalVisible(false)}
        />
      )}
    </>
  );
}
