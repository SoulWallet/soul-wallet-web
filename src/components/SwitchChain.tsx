import { useEffect, useState } from 'react';
import { Box, Flex, Text, Menu, MenuButton, MenuList, MenuItem, Tooltip, useDisclosure } from '@chakra-ui/react';
import { Image } from '@chakra-ui/react';
import SwitchNetworkLine from '@/assets/switch-chain-line.svg';
import Button from './Button';
import useConfig from '@/hooks/useConfig';
import IconChevronRight from '@/assets/icons/chevron-right-red.svg';
import IconCheckmark from '@/assets/icons/checkmark.svg';
import { useChainStore } from '@/store/chain';
import { useAddressStore } from '@/store/address';
import { toShortAddress, getChainInfo } from '@/lib/tools';
import useBrowser from '@/hooks/useBrowser';
import ErrorModal from '@/components/ErrorModal';
import config from '@/config';
import { useSettingStore } from '@/store/setting';

const ChainAvatar = ({ avatar }: any) => (
  <Flex align="center" justify={'center'} bg="#fff" rounded="full" w="72px" h="72px">
    <Image src={avatar} w="44px" h="44px" />
  </Flex>
);

export default function ConnectDapp({ onSwitch, targetChainId }: any) {
  const { selectedAddressItem } = useConfig();
  const { selectedChainId, setSelectedChainId } = useChainStore();
  const { address } = selectedAddressItem;
  const [errorType, setErrorType] = useState(0);
  const { navigate } = useBrowser();

  const checkIfCanSwitch = () => {
    const chainSupported = config.chainList.filter((item) => item.chainIdHex === targetChainId).length > 0;
    // const targetChainActivited = selectedAddressItem.activatedChains.includes(targetChainId);
    // const otherAccountsTargetChainActivited =
    //   addressList.filter((item) => item.activatedChains.includes(targetChainId)).length > 0;

    if (!chainSupported) {
      setErrorType(1);
    }
  };

  const cancelSwitch = () => {
    setErrorType(0);
    window.close();
    // throw new Error('User rejected switch network');
  };

  useEffect(() => {
    checkIfCanSwitch();
  }, []);

  const onConfirm = () => {
    setSelectedChainId(targetChainId);
    onSwitch(targetChainId);
  };

  // const canSwitch = selectedAddressItem.activatedChains.includes(targetChainId);

  return (
    <Box pt="5">
      <Box textAlign={'center'}>
        <Flex align="center" display={'inline-flex'} gap="1" mx="auto" mb="5" position={'relative'}>
          <ChainAvatar avatar={getChainInfo(selectedChainId).icon} />
          <Image src={SwitchNetworkLine} />
          <ChainAvatar avatar={getChainInfo(targetChainId).icon} />
        </Flex>
      </Box>

      <Box textAlign={'center'} mb="176px">
        <Text fontSize={'20px'} fontWeight={'800'} mb="1">
          Allow network switch?
        </Text>
        <Text fontWeight={'600'}>
          This will switch the selected network within current dApp to{' '}
          <Text color="#ee3f99" display={'inline'}>
            {getChainInfo(targetChainId).name}
          </Text>
          .
        </Text>
      </Box>
      
      <Button w="100%" fontSize={'20px'} py="4" fontWeight={'800'} mt="6" onClick={onConfirm}>
        Switch network
      </Button>

      {errorType === 1 && (
        <ErrorModal
          text="Unfortunately, your selected network is not supported yet. Please try again later."
          cancelText="Cancel"
          onCancel={cancelSwitch}
          onClose={() => {}}
          okText="Back"
          onOk={() => {
            navigate('/dashboard');
          }}
        />
      )}
      {/* 
      {errorType === 2 && (
        <ErrorModal
          text="Please activate your account or select an activated account on this network to continue"
          cancelText="Other account"
          onCancel={() => {
            setErrorType(0);
          }}
          onClose={() => {
            setErrorType(0);
          }}
          okText="Activate"
          onOk={() => {
            setSelectedChainId(targetChainId);
            navigate('/activate');
          }}
        />
      )}

      {errorType === 3 && (
        <ErrorModal
          text="Please activate your account on this network to continue"
          cancelText="Cancel"
          onCancel={cancelSwitch}
          onClose={() => {}}
          okText="Activate"
          onOk={() => {
            setSelectedChainId(targetChainId);
            navigate('/activate');
          }}
        />
      )} */}
    </Box>
  );
}
