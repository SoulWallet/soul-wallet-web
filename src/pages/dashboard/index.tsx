import { useState, useCallback, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Box, Image, Flex } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import MoreIcon from '@/components/Icons/mobile/More'
import USDCIcon from '@/assets/tokens/usdc.png'
import ActivityDepositIcon from '@/components/Icons/mobile/Activity/Deposit'
import ActivityTransferIcon from '@/components/Icons/mobile/Activity/Transfer'
import { useBalanceStore } from '@/store/balance';
import { useHistoryStore } from '@/store/history';
import BN from 'bignumber.js'
import { toFixed } from '@/lib/tools';

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

  return '20px'
}

export default function Dashboard() {
  const { totalUsdValue, getTokenBalance, sevenDayApy, oneDayInterest, } = useBalanceStore();
  const { historyList } = useHistoryStore();
  const [modalMargin, setModalMargin] = useState(494)
  const [modalHeight, setModalHeight] = useState(window.innerHeight - 494)
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [modalPosition, setModalPosition] = useState('bottom')
  const [isMoving, setIsMoving] = useState(false)
  const contentRef = useRef()

  const pendingUsdcBalance = getTokenBalance(import.meta.env.VITE_TOKEN_USDC)
  const hasBalance = BN(totalUsdValue).isGreaterThan(0);

  const valueLeft = totalUsdValue.split('.')[0]
  const valueRight = totalUsdValue.split('.')[1]

  const fontSize = getFontSize(valueLeft)
  const smFontSize = getSmallFontSize(valueRight)
  const fontBottomMargin = getFontBottomMargin(valueLeft)

  const [startPosition, setStartPosition] = useState(null);

  useEffect(() => {
    getContentHeight()
    console.log('contentRef', contentRef)
  }, [])

  const handleStart = (position: any) => {
    setStartPosition(position);
  };

  const handleMove = (currentPosition: any) => {
    if (startPosition == null) return;

    if (startPosition > currentPosition + 20) {
      console.log('Moving up');
      changeModalPosition('top')
      setTimeout(()=>{
        setShowFullHistory(true);
      }, 600)
    } else if (startPosition < currentPosition - 20) {
      console.log('Moving down');
      changeModalPosition('bottom')
      setTimeout(()=>{
        setShowFullHistory(false);
      }, 600)
    }
  };

  const handleTouchStart = (e: any) => {
    handleStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: any) => {
    handleMove(e.touches[0].clientY);
  };

  const handleMouseDown = (e: any) => {
    handleStart(e.clientY);
  };

  const handleMouseMove = (e: any) => {
    // Only track movement when the mouse button is pressed
    if (e.buttons === 1) {
      handleMove(e.clientY);
    }
  };

  const getContentHeight = () => {
    const elem: any = contentRef.current

    if (elem) {
      return elem.clientHeight + 64 + 60 - 6
    }

    return 494
  }

  const changeModalPosition = useCallback((intentPosition: any) => {
    if (!isMoving && intentPosition !== modalPosition) {
      setIsMoving(true)

      if (modalPosition === 'bottom') {
        setModalMargin(64)
        setModalHeight(window.innerHeight - 64)
        setModalPosition('top')
      } else {
        const height = getContentHeight()
        setModalMargin(height)
        setModalPosition('bottom')

        setTimeout(() => {
          setModalHeight(window.innerHeight - height)
        }, 620)
      }

      setTimeout(() => {
        setIsMoving(false)
      }, 600)
    }
  }, [modalPosition, isMoving])

  const finalHistoryList = showFullHistory ? historyList : historyList.slice(0, 2)
  // const finalHistoryList = historyList

  return (
    <Box>
      <Box padding={{
        xs: '20px',
        sm: '30px'
      }}>
        <Box ref={(v: any) => { contentRef.current = v }}>
          <Box fontSize="18px" fontWeight="700" lineHeight="24px" marginBottom="14px">My Balance</Box>
          <Box
            width="100%"
            background="white"
            borderRadius="24px"
            boxShadow="0px 8px 60px 0px rgba(44, 53, 131, 0.12)"
            border="1px solid #EAECF0"
            padding="28px 24px"
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              paddingTop="16px"
            >
              <Box display="flex" alignItems="center">
                <Box fontSize="24px" fontWeight="700" marginRight="2px">$</Box>
                <Box
                  fontFamily="Nunito"
                  fontSize={fontSize}
                  lineHeight={"1"}
                  fontWeight="800"
                >
                  {valueLeft}
                </Box>
                {Number(toFixed(valueRight.slice(0,3), 3, false)) > 0 && (
                  <Box
                    fontFamily="Nunito"
                    fontSize={smFontSize}
                    lineHeight={"1"}
                    fontWeight="800"
                    marginTop={fontBottomMargin}
                    // marginLeft="10px"
                    color="#939393"
                  >
                    .{toFixed(valueRight.slice(0,3), 3, false)}
                  </Box>
                )}
              </Box>
              <Box
                color="#0CB700"
                fontSize="16px"
                fontWeight="600"
                marginBottom="16px"
                marginTop="4px"
              >
                + ${oneDayInterest} earned  today
              </Box>
              {
                Number(pendingUsdcBalance) > 0 && <Box color="rgba(0, 0, 0, 0.60)" fontSize="14px">
                  Deposit in progress, est complete in <Box color="#497EE6" as="span">1 min</Box>
                </Box>
              }

            </Box>
            {hasBalance && (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap="14px"
                flexDirection={{ xs: 'column', sm: 'row' }}
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  width={{ xs: '100%', sm: '34%' }}
                >
                  <Link to="/withdraw" style={{ width: "100%" }}>
                    <Box width="100%">
                      <Button
                        width="100%"
                        size="xl"
                        type="lightBlue"
                        // minWidth="100px"
                        boxShadow="none"
                        color="#497EE6"
                        minWidth="auto"
                      >
                        Transfer
                      </Button>
                    </Box>
                  </Link>
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  width={{ xs: '100%', sm: 'calc(66% - 14px)' }}
                >
                  <Link to="/deposit" style={{ width: "100%"}}>
                    <Box width="100%">
                      <Button width="100%" size="xl" type="blue" minWidth="auto">
                        Deposit USDC
                      </Button>
                    </Box>
                  </Link>
                </Box>
              </Box>
            )}
            {!hasBalance && (
              <Box display="flex" alignItems="center" justifyContent="center" gap="14px">
                <Link to="/deposit" style={{ width: "100%"}}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Box width="100%">
                      <Button width="100%" size="xl" type="blue">
                        Deposit USDC
                      </Button>
                    </Box>
                  </Box>
                </Link>
              </Box>
            )}
          </Box>
          <Box width="100%" marginTop="24px">
            <Box fontSize="18px" fontWeight="700" marginBottom="12px">Earn from</Box>
            <Box as={Link} to="/details" display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center">
                <Box marginRight="8px">
                  <Image src={USDCIcon} minW="8" w="8" h="8" />
                </Box>
                <Box>
                  <Box fontSize="18px" lineHeight={"23px"} fontWeight="700">USDC on AAVE</Box>
                  <Box fontSize="14px" lineHeight={"1"} fontWeight="400">OP Mainnet</Box>
                </Box>
              </Box>
              <Box display="flex" alignItems="center">
                <Box display="flex" flexDirection="column" alignItems="flex-end">
                  <Box fontSize="18px" lineHeight={"23px"} fontWeight="700">{sevenDayApy}%</Box>
                  <Box fontSize="14px" lineHeight={"1"} fontWeight="400" textAlign="right">7day average APY</Box>
                </Box>
                <Box marginLeft="10px">
                  <MoreIcon />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      {finalHistoryList && finalHistoryList.length > 0 && (
        <Box
          position="fixed"
          // height={modalHeight}
          top="0"
          left="0"
          width="100%"
          height="100vh"
          pointerEvents="none"
          paddingTop={`${modalMargin}px`}
          transition="0.6s all ease"
        >
          <Box
            maxWidth="430px"
            margin="0 auto"
            background="white"
            borderRadius="20px 20px 0 0"
            overflowY="scroll"
            pointerEvents="all"
            height={modalHeight}
          >
            <Box
              paddingTop="90px"
              position="relative"
              height="100%"
              overflow="hidden"
              // onTouchStart={handleTouchStart}
              // onTouchMove={handleTouchMove}
              // onMouseDown={handleMouseDown}
              // onMouseMove={handleMouseMove}
            >
              <Box
                position="absolute"
                height="80px"
                top="0"
                left="0"
                width="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
              >
                <Box
                  height="20px"
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
                <Box
                  width="100%"
                  fontSize="18px"
                  fontWeight="700"
                  padding="10px 30px"
                >
                  Recent activity
                </Box>
              </Box>
              <Flex gap="36px" padding="0 30px" flexDir="column" width="100%" overflow="auto" maxHeight={`${modalHeight - 80 - 20}px`}>
                {finalHistoryList.map(item => (
                  <Box
                    display="flex"
                    alignItems="center"
                  >
                    <Box marginRight="12px">
                      {item.action === 'Deposit' ? <ActivityDepositIcon /> :  <ActivityTransferIcon />}
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
                  </Box>
                ))}
              </Flex>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}
