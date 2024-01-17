import { Box, Flex, Text, useToast, Image, Link } from '@chakra-ui/react';
import HomeCard from '../HomeCard';
import Button from '@/components/Button';
import { ethers } from 'ethers';
import useWalletContext from '@/context/hooks/useWalletContext';
import IconSend from '@/assets/icons/wallet/send.svg';
import IconReceive from '@/assets/icons/wallet/receive.svg';
import IconSwap from '@/assets/icons/wallet/swap.svg';
import IconView from '@/assets/icons/wallet/view.svg';
import IconEdit from '@/assets/icons/edit.svg';
import useConfig from '@/hooks/useConfig';
import { useAddressStore } from '@/store/address';
import useTools from '@/hooks/useTools';
import AddressIcon from '@/components/AddressIcon';

export default function Balance() {
  const { showSend, showReceive } = useWalletContext();
  const { getWalletName } = useTools();
  const { selectedAddress } = useAddressStore();
  const { chainConfig } = useConfig();
  const { scanUrl } = chainConfig;

  const walletName = getWalletName();

  const actions = [
    {
      title: 'Send',
      icon: IconSend,
      onClick: () => {
        showSend(ethers.ZeroAddress, 'send');
      },
    },
    {
      title: 'Receive',
      icon: IconReceive,
      onClick: () => {
        showReceive();
      },
    },
    {
      title: 'Swap',
      icon: IconSwap,
      onClick: () => {},
    },
    {
      title: 'View',
      icon: IconView,
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
      {/* {walletName && (
        <Text color="#000" fontSize={'16px'} fontWeight={'600'} mb="4" fontFamily={'Martian'}>
          {walletName}
        </Text>
      )} */}
      <Flex align={'center'}>
        <AddressIcon address="12345" width={32} />
        <Box w="2" />
        <Text fontWeight={'800'} fontSize={'18px'}>
          Wallet_1
        </Text>
        <Box w="1" />
        <Image src={IconEdit} w="5" cursor={'pointer'} />
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
          <Box key={index} cursor={'pointer'} textAlign={'center'} onClick={item.onClick}>
            <Image src={item.icon} mb="2px" w="8" mx="auto" />
            <Text fontSize={'12px'} fontWeight={'600'} lineHeight={'1.25'} color="#5b606d">
              {item.title}
            </Text>
          </Box>
        ))}
      </Flex>
    </Box>
  );
}
