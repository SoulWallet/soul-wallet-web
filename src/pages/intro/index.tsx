import React, { useState, useCallback, useEffect } from 'react';
import { Link as RLink, useNavigate } from 'react-router-dom';
import { Box, Image, Modal, ModalOverlay, ModalContent, ModalHeader, Link, Flex, Text, ModalCloseButton, ModalBody, useDisclosure } from '@chakra-ui/react';
import Header from '@/components/mobile/Header'
import Button from '@/components/mobile/Button'
import CheckIcon from '@/components/Icons/mobile/Check'
import WithdrawIcon from '@/components/Icons/mobile/Withdraw'
import MoreIcon from '@/components/Icons/mobile/More'
import QuestionIcon from '@/components/Icons/mobile/Question'
import USDCIcon from '@/assets/tokens/usdc.png'
import ActivityDepositIcon from '@/components/Icons/mobile/Activity/Deposit'
import ActivityTransferIcon from '@/components/Icons/mobile/Activity/Transfer'
import config from '@/config';
import api from '@/lib/api';
import { useAddressStore } from '@/store/address';
import { useChainStore } from '@/store/chain';
import { useBalanceStore } from '@/store/balance';
import useWallet from '@/hooks/useWallet';
import { useHistoryStore } from '@/store/history';
import { usdcArbPoolReserveId } from '@/config/constants';
import treasuryIcon from '@/assets/mobile/treasury.png'
import CoinbaseIcon from '@/assets/mobile/coinbase.png'
import AAVEIcon from '@/assets/mobile/aave.png'

const getFontSize = (value: any) => {
  const length = value ? String(value).length : 0

  if (length > 9) {
    return '40px'
  } else if (length > 5) {
    return '50px'
  }

  return '72px'
}

const getSmallFontSize = (value: any) => {
  const length = value ? String(value).length : 0

  if (length > 9) {
    return '30px'
  } else if (length > 5) {
    return '50px'
  }

  return '36px'
}

const getFontBottomMargin = (value: any) => {
  const length = value ? String(value).length : 0

  if (length > 9) {
    return '0px'
  } else if (length > 5) {
    return '10px'
  }

  return '26px'
}

export default function Intro() {
  const navigate = useNavigate();
  const { totalUsdValue, getTokenBalance, sevenDayApy, oneDayInterest, } = useBalanceStore();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { historyList } = useHistoryStore();

  const pendingUsdcBalance = getTokenBalance(import.meta.env.VITE_TOKEN_USDC)
  const hasBalance = Number(totalUsdValue) > 0;

  const valueLeft = totalUsdValue.split('.')[0]
  const valueRight = totalUsdValue.split('.')[1]

  const fontSize = getFontSize(valueLeft)
  const smFontSize = getSmallFontSize(valueRight)
  const fontBottomMargin = getFontBottomMargin(valueLeft)

  const innerHeight = window.innerHeight
  const marginHeight = innerHeight - 428

  return (
    <Box
      width="100%"
      height="100%"
      background="linear-gradient(180deg, #F5F6FA 0%, #EEF2FB 100%)"
    >
      <Box width="100%" padding="30px" display="flex" alignItems="center" flexDirection="column">
        <Box fontFamily="Nunito" fontSize="36px" fontWeight="700" textAlign="center" lineHeight="56px">
          Deposit and earn
        </Box>
        <Box fontFamily="Nunito" fontSize="14px" fontWeight="500" textAlign="center" marginTop="14px">
          Deposit to your Soul Wallet account, get <Text as="span" fontWeight="700">auto-saved</Text> into the best interest rate pool and start earning today!
        </Box>
        <Link as={RLink} to="/deposit" mt="50px">
          <Button size="xl" type="blue" minWidth="283px">Deposit USDC</Button>
        </Link>
        <Button
          size="xl"
          type="text"
          minWidth="283px"
          marginTop="10px"
          color="black"
          marginBottom="20px"
          onClick={onOpen}
        >
          What’s auto-saving <Box display="flex" alignItems="center" justifyContent="center" width="14px" height="14px" border="1px solid black" borderRadius="14px"><QuestionIcon /></Box>
        </Button>
        <Box
          width="100%"
          background="white"
          borderRadius="24px"
          boxShadow="0px 8px 60px 0px rgba(44, 53, 131, 0.12)"
          border="1px solid #EAECF0"
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            padding="50px 10px"
            paddingBottom="6px"
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
                {sevenDayApy}
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
              width="33.33%"
              display="flex"
              alignItems="flex-end"
              justifyContent="center"
            >
              <Box
                width="40px"
                height="59px"
                borderRadius="12px 12px 0 0"
                background="linear-gradient(180deg, rgba(73, 126, 230, 0.60) 0%, rgba(73, 126, 230, 0.10) 100%)"
                display="flex"
                alignItems="flex-start"
                paddingTop="6px"
                justifyContent="center"
              >
                <Image width="28px" height="28px" src={CoinbaseIcon} className="icon" />
              </Box>
            </Box>
            <Box
              width="33.33%"
              display="flex"
              alignItems="flex-end"
              justifyContent="center"
            >
              <Box
                width="40px"
                height="59px"
                borderRadius="12px 12px 0 0"
                background="linear-gradient(180deg, rgba(252, 209, 22, 0.60) 0%, rgba(252, 209, 22, 0.10) 100%)"
                display="flex"
                alignItems="flex-start"
                paddingTop="6px"
                justifyContent="center"
              >
                <Image width="28px" height="28px" src={treasuryIcon} className="icon" />
              </Box>
            </Box>
            <Box
              width="33.33%"
              display="flex"
              alignItems="flex-end"
              justifyContent="center"
            >
              <Box
                width="40px"
                height="132px"
                borderRadius="12px 12px 0 0"
                background="linear-gradient(180deg, rgba(70, 167, 191, 0.60) 0%, rgba(176, 84, 160, 0.10) 100%)"
                display="flex"
                alignItems="flex-start"
                paddingTop="6px"
                justifyContent="center"
              >
                <Image width="28px" height="28px" src={AAVEIcon} className="icon" />
              </Box>
            </Box>
          </Box>
          <Box
            display="flex"
            borderTop="1px solid rgba(0, 0, 0, 0.1)"
          >
            <Box
              width="33.33%"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              padding="18px 10px"
            >
              <Box
                fontFamily="Nunito"
                fontWeight="600"
                fontSize="14px"
                textAlign="center"
              >
                5.01% APY
              </Box>
              <Box
                fontFamily="Nunito"
                fontWeight="600"
                fontSize="12px"
                color="rgba(0, 0, 0, 0.5)"
                marginTop="5px"
                textAlign="center"
              >
                Coinbase
              </Box>
            </Box>
            <Box
              width="33.33%"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              padding="18px 10px"
            >
              <Box
                fontFamily="Nunito"
                fontWeight="600"
                fontSize="14px"
                textAlign="center"
              >
                5.03% APY
              </Box>
              <Box
                fontFamily="Nunito"
                fontWeight="600"
                fontSize="12px"
                color="rgba(0, 0, 0, 0.5)"
                marginTop="5px"
                textAlign="center"
              >
                U.S. Treasury bill
              </Box>
            </Box>
            <Box
              width="33.33%"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              padding="18px 10px"
            >
              <Box
                fontFamily="Nunito"
                fontWeight="600"
                fontSize="14px"
                textAlign="center"
              >
                12.16% APY
              </Box>
              <Box
                fontFamily="Nunito"
                fontWeight="600"
                fontSize="12px"
                color="rgba(0, 0, 0, 0.5)"
                marginTop="5px"
                textAlign="center"
              >
                USDC on AAVE
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        blockScrollOnMount={true}
      >
        <ModalOverlay />
        <ModalContent
          borderRadius="20px 20px 0 0"
          maxW="100vw"
          height="428px"
          overflow="auto"
          mb="0"
          marginTop={`${marginHeight}px`}

        >
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            width="100%"
          >
            <Box
              background="#D9D9D9"
              height="120px"
              width="120px"
              borderRadius="120px"
              marginBottom="30px"
              mt="24px"
            />
            <Box fontSize="24px" width="100%" textAlign="center" fontWeight="700" marginBottom="14px">
              Auto-saving
            </Box>
            <Box
              fontSize="16px"
              textAlign="center"
              marginBottom="28px"
            >
              Your assets will be auto saved into AAVE protocol.
              You can transfer anytime after deposited.
            </Box>
            <Box width="100%">
              <Button size="xl" type="blue" width="100%" onClick={onClose}>Got it</Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
