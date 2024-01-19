import { Box, Flex, Text, useToast, Image, Link, Input } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useState } from 'react';
import useWalletContext from '@/context/hooks/useWalletContext';
import IconSend from '@/assets/icons/wallet/send.svg';
import IconReceive from '@/assets/icons/wallet/receive.svg';
import IconSwap from '@/assets/icons/wallet/swap.svg';
import IconView from '@/assets/icons/wallet/view.svg';
import IconSendActive from '@/assets/icons/wallet/send-active.svg';
import IconReceiveActive from '@/assets/icons/wallet/receive-active.svg';
import IconSwapActive from '@/assets/icons/wallet/swap-active.svg';
import IconViewActive from '@/assets/icons/wallet/view-active.svg';
import IconEdit from '@/assets/icons/edit.svg';
import useConfig from '@/hooks/useConfig';
import { useAddressStore } from '@/store/address';
import useTools from '@/hooks/useTools';
import AddressIcon from '@/components/AddressIcon';
import Modal from '@/components/Modal';
import Button from '@/components/Button';

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
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter wallet name"
        mb="9"
        rounded="12px"
      />
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

export default function Balance() {
  const { showSend, showReceive } = useWalletContext();
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [editNameModalVisible, setEditNameModalVisible] = useState(false);
  const { selectedAddress } = useAddressStore();
  const { chainConfig } = useConfig();
  const { getWalletName, setWalletName } = useTools();
  const { scanUrl } = chainConfig;

  const walletName = getWalletName();

  const changeWalletName = (name: string) => {
    setWalletName(name);
  };

  const actions = [
    {
      title: 'Send',
      icon: IconSend,
      iconActive: IconSendActive,
      onClick: () => {
        showSend(ethers.ZeroAddress, 'send');
      },
    },
    {
      title: 'Receive',
      icon: IconReceive,
      iconActive: IconReceiveActive,
      onClick: () => {
        showReceive();
      },
    },
    {
      title: 'Swap',
      icon: IconSwap,
      iconActive: IconSwapActive,
      onClick: () => {},
    },
    {
      title: 'View',
      icon: IconView,
      iconActive: IconViewActive,
      onClick: () => {
        window.open(`${scanUrl}/address/${selectedAddress}`, '_blank');
      },
    },
  ];

  return (
    <Box
      w="400px"
      zIndex={'20'}
      pt="14px"
      px="30px"
      pb="20px"
      rounded="20px"
      border="1px solid #EAECF0"
      bg="brand.white"
      boxShadow="0px 4px 30px 0px rgba(0, 0, 0, 0.05)"
    >
      <Flex align={'center'}>
        <AddressIcon address={selectedAddress} width={32} />
        <Box w="2" />
        <Text fontWeight={'800'} fontSize={'18px'}>
          {/** Show wallet name, otherwise default name */}
          {walletName || 'Wallet'}
        </Text>
        <Box w="1" />
        <Image src={IconEdit} w="5" cursor={'pointer'} onClick={() => setEditNameModalVisible(true)} />
      </Flex>
      <Flex align={'center'} mt="24px" mb="20px" gap="2px">
        <Text fontWeight={'700'} fontSize={'24px'} lineHeight={'1'}>
          $
        </Text>
        <Text fontWeight={'800'} fontSize={'72px'} lineHeight={'1'}>
          0
        </Text>
      </Flex>
      <Flex gap="6" align={'center'}>
        {actions.map((item, index) => (
          <Box
            key={index}
            cursor={'pointer'}
            textAlign={'center'}
            onClick={item.onClick}
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(-1)}
          >
            <Image src={hoverIndex === index ? item.iconActive : item.icon} mb="2px" w="8" mx="auto" />
            <Text fontSize={'12px'} fontWeight={'600'} lineHeight={'1.25'} color="#5b606d">
              {item.title}
            </Text>
          </Box>
        ))}
      </Flex>
      {editNameModalVisible && (
        <EditNameModal
          defaultValue={walletName}
          onConfirm={changeWalletName}
          onCancel={() => setEditNameModalVisible(false)}
        />
      )}
    </Box>
  );
}
