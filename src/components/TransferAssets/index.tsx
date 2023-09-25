import { useState } from 'react';
import IconPlus from '@/assets/icons/plus.svg';
import IconSend from '@/assets/icons/send.svg';
import { Box, Flex, Image, Text } from '@chakra-ui/react';
import Receive from '../Receive';
import SendAssets from '../SendAssets';
import { ethers } from 'ethers';

const tabs = [
  {
    icon: IconPlus,
    text: 'Receive',
  },
  {
    icon: IconSend,
    text: 'Send',
  },
];

export default function TransferAssets() {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <Box>
      <Flex>
        {tabs.map((item, index) => (
          <Flex
            py="3"
            flex="1"
            gap="2"
            justify={'center'}
            align="center"
            cursor={'pointer'}
            {...{}}
            roundedTopLeft={index === 0 || activeTab === 1 ? '20px' : 'none'}
            roundedTopRight={index === 1 || activeTab === 0 ? '20px' : 'none'}
            bg={activeTab === index ? '#ededed' : 'none'}
            onClick={() => setActiveTab(index)}
          >
            <Image w="10" h="10" src={item.icon} />
            <Text fontWeight={'700'}>{item.text}</Text>
          </Flex>
        ))}
      </Flex>
      <Box
        bg="#ededed"
        roundedBottom="20px"
        roundedTopLeft={activeTab === 0 ? '0' : '20px'}
        roundedTopRight={activeTab === 1 ? '0' : '20px'}
        p="6"
      >
        {activeTab === 0 && <Receive />}
        {activeTab === 1 && <SendAssets tokenAddress={ethers.ZeroAddress} />}
      </Box>
    </Box>
  );
}
