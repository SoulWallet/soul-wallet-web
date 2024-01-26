import { Box, Flex, Text, Image } from '@chakra-ui/react';
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
import useConfig from '@/hooks/useConfig';
import { useAddressStore } from '@/store/address';
import AvatarWithName from '@/components/AvatarWithName';
import useTools from '@/hooks/useTools';

export default function WalletCard() {
  const { showSend, showReceive } = useWalletContext();
  const [hoverIndex, setHoverIndex] = useState(-1);
  const { checkInitialized } = useTools();
  const { selectedAddress } = useAddressStore();
  const { chainConfig } = useConfig();
  const { scanUrl } = chainConfig;

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
      w={{ base: '400px', '2xl': '460px' }}
      zIndex={'20'}
      pt="14px"
      px="30px"
      pb="20px"
      rounded="20px"
      border="1px solid #EAECF0"
      bg="brand.white"
      boxShadow="0px 4px 30px 0px rgba(0, 0, 0, 0.05)"
    >
      <AvatarWithName editable={true} />
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
            onClick={() => checkInitialized(true) ? item.onClick() : undefined}
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
    </Box>
  );
}
