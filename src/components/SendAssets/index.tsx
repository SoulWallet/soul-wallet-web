import { useState, useRef, useEffect } from 'react';
import Button from '../Button';
import { Flex, Box, Text, useToast } from '@chakra-ui/react';
import useTransaction from '@/hooks/useTransaction';
import { ethers } from 'ethers';
import BN from 'bignumber.js';
import { useBalanceStore } from '@/store/balance';
import AmountInput from './comp/AmountInput';
import { AddressInput, AddressInputReadonly } from './comp/AddressInput';
import api from '@/lib/api';
import { useSlotStore } from '@/store/slot';
import { useSettingStore } from '@/store/setting';
import useConfig from '@/hooks/useConfig';
import ENSResolver, { extractENSAddress, isENSAddress } from '@/components/ENSResolver';

interface ISendAssets {
  tokenAddress: string;
  onSent: () => void;
}

const ErrorHint = ({ label }: { label: string }) => {
  if (!label) {
    return;
  }
  return (
    <Text color="danger" py="1" px="4">
      {label}
    </Text>
  );
};

export default function SendAssets({ tokenAddress = '', onSent }: ISendAssets) {
  const [amount, setAmount] = useState<string>('');
  const { getTokenBalance } = useBalanceStore();
  const [sendToken, setSendToken] = useState(tokenAddress);
  const [receiverAddress, setReceiverAddress] = useState<string>('');
  const { slotInfo } = useSlotStore();
  const { chainConfig } = useConfig();
  const [isENSOpen, setIsENSOpen] = useState(false);
  const [isENSLoading, setIsENSLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [resolvedAddress, setResolvedAddress] = useState('');
  const [errors, setErrors] = useState<any>({});

  const activeENSNameRef = useRef();
  const menuRef = useRef();
  const inputRef = useRef();

  const inputOnChange = (value: any) => {
    setReceiverAddress(value);
    setSearchText(value);

    if (extractENSAddress(value)) {
      setIsENSOpen(true);
    } else {
      setIsENSOpen(false);
    }
  };

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
    setReceiverAddress(resolvedAddress);
    setErrors(({ receiverAddress, ...rest }: any) => rest);
    setIsENSOpen(false);
  };

  const selectedToken = getTokenBalance(sendToken);

  const selectedTokenBalance =selectedToken ? BN(selectedToken.tokenBalance).shiftedBy(-selectedToken.decimals).toFixed() : 0;

  const { sendErc20, sendEth } = useTransaction();

  const confirmAddress = async () => {
    let trimedAddress = receiverAddress ? receiverAddress.trim() : '';

    if (trimedAddress.includes(':')) {
      trimedAddress = trimedAddress.split(':')[1];
    }

    if (sendToken === ethers.ZeroAddress) {
      await sendEth(trimedAddress, amount);
    } else {
      await sendErc20(sendToken, trimedAddress, amount, selectedToken.decimals);
    }
    resetState();

    onSent();
  };

  useEffect(() => {
    if (!amount) {
      return;
    }
    checkAmount();
  }, [amount]);

  const checkAmount = () => {
    if (!amount) {
      setErrors({
        ...errors,
        amount: 'Amount is required',
      });
      return;
    }

    if (BN(amount).isGreaterThan(selectedTokenBalance)) {
      setErrors({
        ...errors,
        amount: 'Not enough balance',
      });
      return;
    }

    setErrors(({ amount, ...rest }: any) => rest);
  };

  const resetState = () => {
    setAmount('');
    setReceiverAddress('');
  };

  return (
    <Box>
      <Flex flexDir={'column'} gap="5">
        <Box position="relative">
          <AddressInput
            label="To:"
            placeholder="Enter ENS or wallet address"
            value={receiverAddress}
            onChange={(e: any) => inputOnChange(e.target.value)}
            onFocus={(e: any) => inputOnFocus(e.target.value)}
            setInputRef={setInputRef}
            onEnter={confirmAddress}
          />
          <ENSResolver
            _styles={{
              width: '100%',
              top: '70px',
              left: '0',
              right: '0',
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
          <ErrorHint label={errors.receiverAddress} />
        </Box>
        <Box>
          <AmountInput
            label="Amount:"
            sendToken={sendToken}
            amount={amount}
            onChange={setAmount}
            onBlur={checkAmount}
            onTokenChange={setSendToken}
          />
          <ErrorHint label={errors.amount} />
        </Box>
      </Flex>
      <Button
        onClick={confirmAddress}
        disabled={!receiverAddress || !amount || Object.keys(errors).length > 0}
        w="100%"
        fontSize={'20px'}
        py="4"
        fontWeight={'800'}
        mt="6"
      >
        Next
      </Button>
    </Box>
  );
}
