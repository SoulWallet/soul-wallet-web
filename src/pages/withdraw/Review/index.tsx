import { Box, Image } from '@chakra-ui/react';
import Button from '@/components/mobile/Button';
import Header from '@/components/mobile/Header';
import CompletedIcon from '@/components/Icons/mobile/Completed';
import { Link } from 'react-router-dom';
import LoadingIcon from '@/assets/mobile/loading.gif';
import { useEffect, useRef, useState } from 'react';
import useWallet from '@/hooks/useWallet';

export default function Review({ onPrev, withdrawAmount, sendTo }: any) {
  const { getWithdrawOp, signAndSend } = useWallet();
  const userOpRef = useRef();
  const [isTransfering, setIsTransfering] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const prepareAction = async () => {
    const _userOp = await getWithdrawOp(withdrawAmount, sendTo);
    userOpRef.current = _userOp;
  };

  useEffect(() => {
    prepareAction();
    const interval = setInterval(() => {
      prepareAction();
    }, 15000);
    return clearInterval(interval);
  }, []);

  const onWithdraw = async () => {
    setIsTransfering(true);
    console.log('on withdraw', userOpRef)
    if (userOpRef.current) {
      try {
        await signAndSend(userOpRef.current);
        setIsTransfering(false);
        setIsCompleted(true);
      } catch (e) {
        setIsTransfering(false);
        setIsCompleted(false);
      }
    } else {
      setTimeout(() => {
        onWithdraw();
      }, 1000);
    }
  };

  return (
    <Box width="100%" height="100%">
      <Header title="Review" showBackButton onBack={onPrev} />
      <Box padding="30px" minHeight="calc(100vh - 62px)">
        {isTransfering && (
          <Box
            fontSize="32px"
            fontWeight="700"
            lineHeight="42px"
            textAlign="center"
            height="200px"
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            flexDirection="column"
          >
            <Box marginBottom="6px">
              <Image width="80px" height="60px" src={LoadingIcon} />
            </Box>
            <Box>Transfer in progress</Box>
          </Box>
        )}
        {isCompleted && (
          <Box
            fontSize="32px"
            fontWeight="700"
            lineHeight="42px"
            textAlign="center"
            height="200px"
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            flexDirection="column"
          >
            <Box marginBottom="20px">
              <CompletedIcon />
            </Box>
            <Box>Transfer completed</Box>
          </Box>
        )}
        {!isCompleted && !isTransfering && (
          <Box
            fontSize="32px"
            fontWeight="700"
            lineHeight="42px"
            textAlign="center"
            height="160px"
            display="flex"
            alignItems="flex-end"
            justifyContent="center"
          >
            Please confirm the detail below
          </Box>
        )}
        <Box
          width="100%"
          borderRadius="24px"
          background="white"
          padding="24px"
          marginTop="40px"
          display="flex"
          flexDirection="column"
          boxShadow="0px 4px 60px 0px rgba(44, 53, 131, 0.08)"
        >
          <Box paddingTop="13px" paddingBottom="27px" borderBottom="1px solid rgba(73, 126, 230, 0.2)">
            <Box fontSize="16px" color="#818181" marginBottom="16px">
              Transfer
            </Box>
            <Box fontSize="32px" lineHeight={'1'} fontWeight="700">
              {withdrawAmount} USDC
            </Box>
          </Box>
          <Box paddingTop="26px" paddingBottom="12px">
            <Box fontSize="16px" color="#818181" marginBottom="16px">
              To
            </Box>
            <Box fontSize="18px" fontWeight="700">
              {sendTo}
            </Box>
          </Box>
        </Box>

        <Box marginTop="40px" width="100%">
          {isTransfering && (
            <Button size="xl" type="blue" width="100%" isDisabled>
              Transferring
            </Button>
          )}

          {!isTransfering && !isCompleted && (
            <Button size="xl" type="blue" width="100%" onClick={onWithdraw}>
              Confirm
            </Button>
          )}

          {isCompleted && (
            <Link to="/dashboard">
              <Button size="xl" type="blue" width="100%">
                Confirm
              </Button>
            </Link>
          )}
        </Box>
      </Box>
    </Box>
  );
}
