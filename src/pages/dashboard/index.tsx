import React, { useState, useCallback, useEffect } from 'react';
import { Box, Image, Flex, Link } from '@chakra-ui/react';
import Header from '@/components/mobile/Header'
import Button from '@/components/mobile/Button'
import CheckIcon from '@/components/Icons/mobile/Check'
import USDCIcon from '@/assets/tokens/usdc.png'
import config from '@/config';

export default function Dashboard() {
  return (
    <Box
      width="100%"
      height="100%"
      background="linear-gradient(180deg, #F5F6FA 0%, #EEF2FB 100%)"
    >
      <Box width="100%" padding="30px" display="flex" alignItems="center" flexDirection="column">
        <Box fontFamily="Nunito" fontSize="36px" fontWeight="700" textAlign="center">
          Deposit, save and earn
        </Box>
        <Box fontFamily="Nunito" fontSize="14px" fontWeight="500" textAlign="center">
          Deposit to your Soul Wallet account, get <Box fontWeight="700">auto-saved</Box> into the best interest rate pool and start earning today!
        </Box>
        <Button size="xl" type="blue" minWidth="283px" marginTop="50px">Deposit USDC</Button>
        <Button
          size="xl"
          type="text"
          minWidth="283px"
          marginTop="10px"
          color="black"
          marginBottom="20px"
        >
          What’s auto-saving
        </Button>
        <Box
          width="100%"
          background="white"
          borderRadius="24px"
          boxShadow="0px 8px 60px 0px rgba(44, 53, 131, 0.12)"
          border="1px solid #EAECF0"
        >
          <Box
            borderBottom="1px solid rgba(0, 0, 0, 0.1)"
            display="flex"
            flexDirection="column"
            alignItems="center"
            padding="50px 10px"
          >
            <Box display="flex" alignItems="center">
              <Box>
                <Image src={USDCIcon} />
              </Box>
              <Box marginLeft="10px">
                <Box
                  fontFamily="Nunito"
                  fontSize="24px"
                  fontWeight="700"
                  lineHeight="30px"
                >
                  Earn USDC
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                >
                  <Box
                    fontFamily="Nunito"
                    fontSize="14px"
                    fontWeight="700"
                    lineHeight="18px"
                  >
                    on AAVE |
                  </Box>
                  <Box
                    fontSize="14px"
                    fontWeight="400"
                    marginLeft="4px"
                    lineHeight="18px"
                  >
                    Arbitrum
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" marginTop="16px">
              <Box
                fontFamily="Nunito"
                fontSize="72px"
                fontWeight="800"
              >
                12.16
              </Box>
              <Box
                fontFamily="Nunito"
                fontSize="24px"
                fontWeight="800"
                marginTop="24px"
                marginLeft="10px"
              >
                %
              </Box>
            </Box>
            <Box fontFamily="Nunito" fontSize="18px" fontWeight="600">
              7D Average APY
            </Box>
          </Box>
          <Box display="flex">
            <Box
              width="50%"
              borderRight="1px solid rgba(0, 0, 0, 0.1)"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              padding="30px 10px"
            >
              <Box
                fontFamily="Nunito"
                fontWeight="600"
                fontSize="18px"
                textAlign="center"
              >
                Max 10% APY
              </Box>
              <Box
                fontFamily="Nunito"
                fontWeight="600"
                fontSize="14px"
                color="rgba(0, 0, 0, 0.5)"
                marginTop="8px"
                textAlign="center"
              >
                On Exchange
              </Box>
            </Box>
            <Box
              width="50%"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              padding="30px 10px"
            >
              <Box
                fontFamily="Nunito"
                fontWeight="600"
                fontSize="18px"
              >
                Max 5.01% APY
              </Box>
              <Box
                fontFamily="Nunito"
                fontWeight="600"
                fontSize="14px"
                color="rgba(0, 0, 0, 0.5)"
                marginTop="8px"
              >
                On U.S. Treasury
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
