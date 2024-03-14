import React, { useState, useCallback, useEffect } from 'react';
import { Box, Image, Flex, Link } from '@chakra-ui/react';
import Header from '@/components/mobile/Header'
import Button from '@/components/mobile/Button'
import CheckIcon from '@/components/Icons/mobile/Check'
import USDCIcon from '@/assets/tokens/usdc.png'
import config from '@/config';

export default function Landing() {
  return (
    <Box
      width="100%"
      height="100%"
      background="linear-gradient(180deg, #F5F6FA 0%, #EEF2FB 100%)"
    >
      <Header
        showLogo
        title=""
        height="60px"
        marginTop="0"
        background="transparent"
      />
      <Box width="100%" padding="30px" display="flex" alignItems="center" flexDirection="column">
        <Box fontFamily="Nunito" fontSize="48px" fontWeight="700" textAlign="center">
          Save for Every Human
        </Box>
        <Box fontFamily="Nunito" fontSize="16px" fontWeight="500" textAlign="center">
          Security first. Completely controlled by yourself and your trusted networks
        </Box>
        <Button size="xl" type="blue" minWidth="283px" marginTop="50px">Create free account</Button>
        <Button size="xl" type="text" minWidth="283px" marginTop="10px" color="black">Sign in</Button>
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
        <Box display="flex" alignItems="flex-end" marginTop="42px" marginBottom="20px">
          <Box
            fontSize="24px"
            fontWeight="700"
          >
            Onchain
          </Box>
          <Box
            fontSize="18px"
            fontWeight="400"
            padding="4px 10px"
          >
            vs
          </Box>
          <Box
            fontSize="24px"
            fontWeight="700"
          >
            CEX
          </Box>
        </Box>
        <Box
          width="100%"
          background="white"
          borderRadius="24px"
          boxShadow="0px 8px 60px 0px rgba(44, 53, 131, 0.12)"
          border="1px solid #EAECF0"
        >
          <Box display="flex" padding="24px" borderBottom="1px solid rgba(0, 0, 0, 0.1)">
            <Box width="30px" height="30px" display="flex" alignItems="center" justifyContent="center" marginRight="10px">
              <CheckIcon />
            </Box>
            <Box>
              <Box fontSize="18px" fontWeight="700">
                Higher APY rate
              </Box>
              <Box fontSize="14px" fontWeight="400">
                For USDC, onchain earn has a upto 12.16% APY, which is higher than most CEX.
              </Box>
            </Box>
          </Box>

          <Box display="flex" padding="24px" borderBottom="1px solid rgba(0, 0, 0, 0.1)">
            <Box width="30px" height="30px" display="flex" alignItems="center" justifyContent="center" marginRight="10px">
              <CheckIcon />
            </Box>
            <Box>
              <Box fontSize="18px" fontWeight="700">
                Your key, your return
              </Box>
              <Box fontSize="14px" fontWeight="400">
                Self custody wallet with fully decentralized service.
              </Box>
            </Box>
          </Box>
        </Box>
        <Box display="flex" alignItems="flex-end" marginTop="42px" marginBottom="20px">
          <Box
            fontSize="24px"
            fontWeight="700"
          >
            How Soul Wallet earns
          </Box>
        </Box>
        <Box
          width="100%"
          background="white"
          borderRadius="24px"
          boxShadow="0px 8px 60px 0px rgba(44, 53, 131, 0.12)"
          border="1px solid #EAECF0"
        >
          <Box display="flex" padding="24px" borderBottom="1px solid rgba(0, 0, 0, 0.1)">
            <Box>
              <Box fontSize="18px" fontWeight="700">
                Earn supply interest on AAVE
              </Box>
              <Box fontSize="14px" fontWeight="400">
                Each asset has its own market of supply and demand with its own APY (Annual Percentage Yield) which evolves with time. You can find the average annual rate over the past 30 days to evaluate the rate evolution, and you can also find more data on the reserve overview of each asset in the home section on the app.
              </Box>
            </Box>
          </Box>

          <Box display="flex" padding="24px" borderBottom="1px solid rgba(0, 0, 0, 0.1)">
            <Box>
              <Box fontSize="18px" fontWeight="700">
                Earn the most with Auto-saving
              </Box>
              <Box fontSize="14px" fontWeight="400">
                Soul Wallet empowers each account for a customized risk free feature, auto-saving. Each deposit to the Soul Wallet account will be auto saved into AAVE protocol to earn interest. You can withdraw anytime with a flexible term for your assets. Let auto-saving makes the most of your earnings.
              </Box>
            </Box>
          </Box>
        </Box>
        <Box display="flex" alignItems="flex-end" marginTop="42px" marginBottom="20px">
          <Box
            fontSize="24px"
            fontWeight="700"
          >
            Why Ethereum Layer2
          </Box>
        </Box>

        <Box
          width="100%"
          background="white"
          borderRadius="24px"
          boxShadow="0px 8px 60px 0px rgba(44, 53, 131, 0.12)"
          border="1px solid #EAECF0"
        >
          <Box display="flex" padding="24px" borderBottom="1px solid rgba(0, 0, 0, 0.1)">
            <Box>
              <Box fontSize="18px" fontWeight="700">
                Arbitrum Network
              </Box>
              <Box fontSize="14px" fontWeight="400">
                Arbitrum is a Ethereum scaling solution which provides a safe and low cost way for every human to access DeFi on the most decentralized network.
              </Box>
            </Box>
          </Box>
        </Box>
        <Box marginTop="40px" textAlign="center">
          <Box>Version: Alpha 0.0.1</Box>
          <Flex gap="4" justify="center" align="center" mt="10px">
            {config.socials.map((item, idx) => (
              <Link
                href={item.link}
                target="_blank"
                key={idx}

              >
                <Image w="6" h="6" src={item.icon} className="icon" />
                <Image w="6" h="6" src={item.iconActivated} display="none" className="icon-activated" />
              </Link>
            ))}
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
