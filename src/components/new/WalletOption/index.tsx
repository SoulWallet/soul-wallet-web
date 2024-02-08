import React from 'react';
import { Text, Button, Image } from '@chakra-ui/react';
import TextBody from '@/components/new/TextBody'
import { Box } from '@chakra-ui/react';

export default function WalletOption({ name, icon, onClick }: { name: string, icon: any, onClick?: () => void }) {
  return (
    <Box
      display="flex"
      alignItems="center"
      border="1px solid rgba(0, 0, 0, 0.1)"
      borderRadius="12px"
      padding="16px"
      marginRight={{ base: '0px', md: '16px' }}
      marginBottom="24px"
      width="45%"
      cursor="pointer"
      onClick={onClick}
      flexWrap="wrap"
      justifyContent="center"
    >
      <Box
        width="48px"
        height="48px"
        border="1px solid rgba(0, 0, 0, 0.1)"
        borderRadius="12px"
        marginRight={{ base: '0px', md: '12px' }}
        marginBottom={{ base: '4px', md: '0' }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Image src={icon} width="32px" height="32px" />
      </Box>
      <TextBody>{name}</TextBody>
    </Box>
  );
}
