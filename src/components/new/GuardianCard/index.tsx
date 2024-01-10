import React from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';

export default function GuardianCard({
  name,
  address,
  time,
  device,
  isDefault,
  ...props
}: any) {
  return (
    <Box
      border="1px solid #DFDFDF"
      padding="19px 13px"
      borderRadius="12px"
      width="270px"
      position="relative"
      overflow="hidden"
      {...props}
    >
      {isDefault && (
        <Box
          position="absolute"
          top="0"
          right="0"
          background="#7F56D9"
          color="white"
          fontSize="10px"
          fontWeight="500"
          fontFamily="Nunito"
          padding="2px 8px"
          borderBottomLeftRadius="12px"
        >
          Default signer
        </Box>
      )}
      <Box
        fontFamily="Nunito"
        fontWeight="700"
        fontSize="16px"
        marginBottom="10px"
      >
        {name}
      </Box>
      <Box
        fontFamily="Nunito"
        fontWeight="400"
        fontSize="12px"
        color="#868686"
      >
        {address}
      </Box>
      <Box
        fontFamily="Nunito"
        fontWeight="400"
        fontSize="12px"
        color="#868686"
      >
        {device}
      </Box>
      <Box
        fontFamily="Nunito"
        fontWeight="500"
        fontSize="12px"
        color="black"
        marginTop="10px"
      >
        {time}
      </Box>
    </Box>
  );
}
