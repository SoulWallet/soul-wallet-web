import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Image, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure } from '@chakra-ui/react';
import Header from '@/components/mobile/Header'
import Button from '@/components/mobile/Button'
import CheckIcon from '@/components/Icons/mobile/Check'
import WithdrawIcon from '@/components/Icons/mobile/Withdraw'
import MoreIcon from '@/components/Icons/mobile/More'
import QuestionIcon from '@/components/Icons/mobile/Question'
import USDCIcon from '@/assets/tokens/usdc.png'
import ActivityDepositIcon from '@/components/Icons/mobile/Activity/Deposit'
import config from '@/config';
import api from '@/lib/api';
import { useAddressStore } from '@/store/address';
import { useChainStore } from '@/store/chain';
import { useBalanceStore } from '@/store/balance';
import useWallet from '@/hooks/useWallet';
import { useHistoryStore } from '@/store/history';
import { usdcArbPoolReserveId } from '@/config/constants';

export default function Dashboard() {
  const { totalUsdValue, getTokenBalance, sevenDayApy } = useBalanceStore();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { historyList } = useHistoryStore();

  const pendingUsdcBalance = getTokenBalance(import.meta.env.VITE_TOKEN_USDC)

  const hasBalance = Number(totalUsdValue) > 0;

  console.log('totalUsdValue', totalUsdValue)

  if (hasBalance) {
    return (
      <Box>
        <Box padding="30px">
          <Box>
            <Box fontSize="18px" fontWeight="700" lineHeight="24px" marginBottom="14px">My Balance</Box>
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
                padding="48px 10px 0"
                mb="6"
              >
                <Box display="flex" alignItems="center">
                  <Box
                    fontFamily="Nunito"
                    fontSize="72px"
                    lineHeight={"1"}
                    fontWeight="800"
                  >
                    {totalUsdValue.split('.')[0]}
                  </Box>
                  {Number(totalUsdValue) > 0 && <Box
                                                  fontFamily="Nunito"
                                                  fontSize="36px"
                                                  lineHeight={"1"}
                                                  fontWeight="800"
                                                  marginTop="24px"
                    // marginLeft="10px"
                                                  color="#939393"
                                                >
                    .{totalUsdValue.split('.')[1]}
                  </Box> }
                </Box>
                {
                  pendingUsdcBalance > 0 && <Box color="rgba(0, 0, 0, 0.60)" fontSize="14px">
                    Deposit in progress, est complete in <Box color="#497EE6" as="span">1 min</Box>
                  </Box>
                }

              </Box>
              <Box display="flex" alignItems="center" justifyContent="space-around">
                <Link to="/withdraw" style={{width: "34%"}}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    padding="30px 10px"
                  >
                    <Box width="100%">
                      <Button width="100%" size="xl" type="lightBlue" minWidth="100px" boxShadow="none">
                        <WithdrawIcon />
                      </Button>
                    </Box>
                    <Box
                      fontFamily="Nunito"
                      fontWeight="600"
                      fontSize="14px"
                      color="black"
                      marginTop="8px"
                      textAlign="center"
                    >
                      Withdraw
                    </Box>
                  </Box>
                </Link>
                <Link to="/deposit" style={{ width: "calc(66% - 20px)"}}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    padding="30px 10px"
                    // width=""
                  >
                    <Box width="100%">
                      <Button width="100%" size="xl" type="blue">
                        $
                      </Button>
                    </Box>
                      <Box
                        fontFamily="Nunito"
                        fontWeight="600"
                        fontSize="14px"
                        color="black"
                        marginTop="8px"
                      >
                        Deposit USDC
                      </Box>
                  </Box>
                </Link>
              </Box>
            </Box>
            <Box width="100%" marginTop="24px">
              <Box fontSize="18px" fontWeight="700" marginBottom="12px">Earn from</Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center">
                  <Box marginRight="8px">
                    <Image src={USDCIcon} />
                  </Box>
                  <Box>
                    <Box fontSize="18px" fontWeight="700">USDC on AAVE</Box>
                    <Box fontSize="14px" fontWeight="400">Arbitrum network</Box>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center">
                  <Box display="flex" flexDirection="column" alignItems="flex-end">
                    <Box fontSize="18px" fontWeight="700">{sevenDayApy}%</Box>
                    <Box fontSize="14px" fontWeight="400" textAlign="right">7day average APY</Box>
                  </Box>
                  <Box marginLeft="10px">
                    <MoreIcon />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        {historyList && historyList.length > 0 &&  <Box
          position="fixed"
          height="300px"
          bottom="0"
          width="100%"
          background="white"
          borderRadius="20px 20px 0 0"
        >
          <Box padding="30px" position="relative">
            <Box
              position="absolute"
              height="20px"
              top="0"
              left="0"
              width="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Box
                width="30px"
                height="4px"
                borderRadius="4px"
                background="#CCCDD4"
              />
            </Box>
            <Box fontSize="18px" fontWeight="700">Recent activity</Box>
            <Box width="100%">
              {historyList.slice(0, 2).map(item =>   <Box
                marginTop="36px"
                display="flex"
                alignItems="center"

              >
                <Box marginRight="12px">
                  <ActivityDepositIcon />
                </Box>
                <Box>
                  <Box
                    display="flex"
                    alignItems="center"
                  >
                    <Box fontSize="14px" fontWeight="800">{item.action}</Box>
                    {/* <Box
                      fontSize="12px"
                      background="#F1F1F1"
                      color="rgba(0, 0, 0, 0.60)"
                      padding="0 8px"
                      borderRadius="4px"
                      marginLeft="8px"
                    >
                      Pending
                    </Box> */}
                  </Box>
                  <Box fontSize="12px">{item.dateFormatted}</Box>
                </Box>
                <Box marginLeft="auto">
                  <Box fontSize="14px" fontWeight="700">{item.amountFormatted} USDC</Box>
                </Box>
              </Box>)}
            </Box>
          </Box>
        </Box>}
      </Box>
    )
  }

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
          Deposit to your Soul Wallet account, get <Box fontWeight="700">auto-saved</Box> into the best interest rate pool and start earning today!
        </Box>
        <Link to="/deposit">
          <Button size="xl" type="blue" minWidth="283px" marginTop="50px">Deposit USDC</Button>
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
          height="50vh"
          overflow="auto"
          mb="0"
          marginTop="50vh"

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
            />
            <Box fontSize="24px" fontWeight="700" marginBottom="14px">
              Auto-saving
            </Box>
            <Box
              fontSize="16px"
              textAlign="center"
              marginBottom="40px"
            >
              Each deposit to the Soul Wallet account will be auto saved into AAVE protocol to earn interest. You can withdraw anytime with a flexible term for your assets.
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
