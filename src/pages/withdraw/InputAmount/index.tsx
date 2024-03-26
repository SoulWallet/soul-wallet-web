import { useEffect, useRef, useState } from 'react'
import { Box, Input } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import Header from '@/components/mobile/Header'
import { useBalanceStore } from '@/store/balance';
import BN from 'bignumber.js'
import { toFixed } from '@/lib/tools';
import { isAddress } from 'ethers';
import ENSResolver, { extractENSAddress, isENSAddress } from '@/components/ENSResolver';

export default function InputAmount({
  onPrev, onNext,
  withdrawAmount,
  onWithdrawAmountChange,
  sendTo,
  onSendToChange
}: any) {
  const { totalUsdValue, } = useBalanceStore();
  const [isENSOpen, setIsENSOpen] = useState(false);
  const [isENSLoading, setIsENSLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [resolvedAddress, setResolvedAddress] = useState('');

  const onAmountChange = (val: string) => {
    // validate decimals
    const regex = /^\d*(\.\d{0,6})?$/;

    while (val.length > 0 && !regex.test(val)) {
      // 逐步缩短字符串长度，直到找到一个合法的数值或字符串为空
      val = val.slice(0, -1);
    }

    onWithdrawAmountChange(val)
  }

  const onAddressChange = (val: string) => {
    onSendToChange(val);
    setSearchText(val);

    if (extractENSAddress(val)) {
      setIsENSOpen(true);
    } else {
      setIsENSOpen(false);
    }
  }


  const activeENSNameRef = useRef();
  const menuRef = useRef();
  const inputRef = useRef();

  const inputOnFocus = (value: any) => {
    setSearchText(value);

    if (extractENSAddress(value)) {
      setIsENSOpen(true);
    } else {
      setIsENSOpen(false);
    }
  };

  const setMenuRef = (value: any) => {
    menuRef.current = value;
  };

  const setInputRef = (value: any) => {
    inputRef.current = value;
  };

  const setActiveENSNameRef = (value: any) => {
    activeENSNameRef.current = value;
  };

  const getActiveENSNameRef = (value: any) => {
    return activeENSNameRef.current;
  };

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        inputRef.current &&
        !(inputRef.current as any).contains(event.target) &&
        menuRef.current &&
        !(menuRef.current as any).contains(event.target)
      ) {
        setIsENSOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const submitENSName = (name: any) => {
    console.log('submitENSName', resolvedAddress);
    onSendToChange(resolvedAddress)
    // setErrors(({ receiverAddress, ...rest }: any) => rest);
    setIsENSOpen(false);
  };

  const disabled = !withdrawAmount || withdrawAmount <= 0 || withdrawAmount > totalUsdValue || !sendTo || BN(withdrawAmount).isGreaterThan(totalUsdValue) || BN(withdrawAmount).isNaN() || !isAddress(sendTo);

  return (
    <Box width="100%" height="100%">
      <Header
        title="Transfer"
        showBackButton
        onBack={onPrev}
      />
      <Box padding="30px" minHeight="calc(100vh - 62px)">
        <Box marginTop="46px">
          <Box
            fontSize="24px"
            fontWeight="700"
          >
            Amount
          </Box>
          <Box
            borderBottom="1px solid rgba(73, 126, 130, 0.2)"
            padding="10px 0"
            display="flex"
            alignItems="center"
          >
            <Input
              value={withdrawAmount}
              onChange={e => onAmountChange(e.target.value)}
              fontSize="32px"
              lineHeight="100%"
              padding="0"
              fontWeight="700"
              placeholder="0"
              borderRadius="0"
              border="none"
              outline="none"
              _focusVisible={{ border: 'none', boxShadow: 'none' }}
            />
            <Box
              fontSize="32px"
              fontWeight="700"
              color="rgba(0, 0, 0, 0.2)"
            >
              USDC
            </Box>
          </Box>
        </Box>
        <Box pos="absolute">
          {BN(withdrawAmount).isGreaterThan(totalUsdValue) &&  <Box
                                                                 display="flex"
                                                                 alignItems="center"
                                                                 justifyContent="flex-start"
                                                                 marginTop="5px"
                                                               >
            <Box
              fontWeight="700"
              fontSize="14px"
              color="#E83D26"
            >
              Exceed the available balance
            </Box>
          </Box>}
          {withdrawAmount && BN(withdrawAmount).isNaN() &&  <Box
                                                              display="flex"
                                                              alignItems="center"
                                                              justifyContent="flex-start"
                                                              marginTop="5px"
                                                            >
            <Box
              fontWeight="700"
              fontSize="14px"
              color="#E83D26"
            >
              Not a valid number
            </Box>
          </Box>}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
            marginTop="5px"
          >
            <Box
              fontWeight="600"
              fontSize="14px"
            >
              Available: {toFixed(totalUsdValue, 4)} USDC
            </Box>
            <Box
              background="rgba(225, 220, 252, 0.80)"
              color="#6A52EF"
              spellCheck={false}
              fontSize="14px"
              borderRadius="48px"
              padding="2px 12px"
              fontWeight="800"
              marginLeft="10px"
              onClick={()=> onWithdrawAmountChange(Number(totalUsdValue))}
            >
              MAX
            </Box>
          </Box>
        </Box>

        <Box marginTop="88px">
          <Box
            fontSize="24px"
            fontWeight="700"
          >
            To
          </Box>
          <Box
            borderBottom="1px solid rgba(73, 126, 130, 0.2)"
            padding="10px 0"
            display="flex"
            alignItems="center"
            position="relative"
          >
            <Input
              value={sendTo}
              spellCheck={false}
              onChange={e => onAddressChange(e.target.value)}
              onFocus={(e: any) => inputOnFocus(e.target.value)}
              ref={setInputRef}
              fontSize="18px"
              lineHeight="100%"
              padding="0"
              fontWeight="700"
              placeholder="Enter wallet address or ENS"
              borderRadius="0"
              border="none"
              outline="none"
              _focusVisible={{ border: 'none', boxShadow: 'none' }}
            />
            <ENSResolver
              _styles={{
                width: '100%',
                top: '65px',
                left: '0',
                right: '0',
                borderRadius: '12px'
              }}
              isENSOpen={isENSOpen}
              setIsENSOpen={setIsENSOpen}
              isENSLoading={isENSLoading}
              setIsENSLoading={setIsENSLoading}
              searchText={searchText}
              setSearchText={setSearchText}
              searchAddress={searchAddress}
              setSearchAddress={setSearchAddress}
              resolvedAddress={resolvedAddress}
              setResolvedAddress={setResolvedAddress}
              setMenuRef={setMenuRef}
              submitENSName={submitENSName}
              setActiveENSNameRef={setActiveENSNameRef}
              getActiveENSNameRef={getActiveENSNameRef}
            />
          </Box>

        </Box>
        <Box pos={"absolute"} w="330px">
          {sendTo && !isAddress(sendTo) && <Box
                                             display="flex"
                                             alignItems="center"
                                             justifyContent="flex-start"
                                             marginTop="5px"
                                           >
            <Box
              fontWeight="700"
              fontSize="14px"
              color="#E83D26"
            >
              Please enter a valid address
            </Box>
          </Box>
          }
           <Box
          padding="10px"
          borderRadius="12px"
          background="rgba(252, 151, 0, 0.10)"
          marginTop="12px"
          fontSize="14px"
          fontWeight="400"
        >
          Confirm deposit address is on <Box as="span" fontWeight="700">Arbitrum</Box>; deposit to other networks could result in lost assets.
          </Box>
        </Box>
        <Box
          marginTop="120px"
          width="100%"
        >
          <Button disabled={disabled} size="xl" type="blue" width="100%" onClick={onNext}>Continue</Button>
        </Box>
      </Box>
    </Box>
  );
}
