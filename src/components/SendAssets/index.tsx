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
import { useAddressStore } from '@/store/address';
import { useSettingStore } from '@/store/setting';
import useConfig from '@/hooks/useConfig';
import ENSResolver, { extractENSAddress, isENSAddress } from '@/components/ENSResolver'

interface ISendAssets {
  tokenAddress: string;
  onSent: () => void;
}

export default function SendAssets({ tokenAddress = '', onSent }: ISendAssets) {
  const [amount, setAmount] = useState<string>('');
  const { getTokenBalance } = useBalanceStore();
  const { setFinishedSteps } = useSettingStore();
  const [sendToken, setSendToken] = useState(tokenAddress);
  const [receiverAddress, setReceiverAddress] = useState<string>('');
  const { slotInfo } = useSlotStore();
  const { chainConfig } = useConfig();
  const [isENSOpen, setIsENSOpen] = useState(false)
  const [isENSLoading, setIsENSLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [searchAddress, setSearchAddress] = useState('')
  const [resolvedAddress, setResolvedAddress] = useState('')

  const activeENSNameRef = useRef()
  const menuRef = useRef()
  const inputRef = useRef()

  const inputOnChange = (value: any) => {
    setReceiverAddress(value)
    setSearchText(value)

    if (extractENSAddress(value)) {
      setIsENSOpen(true)
    } else {
      setIsENSOpen(false)
    }
  }

  const inputOnFocus = (value: any) => {
    setSearchText(value)

    if (extractENSAddress(value)) {
      setIsENSOpen(true)
    } else {
      setIsENSOpen(false)
    }
  }

  const setMenuRef = (value: any) => {
    menuRef.current = value
  }

  const setInputRef = (value: any) => {
    inputRef.current = value
  }

  const setActiveENSNameRef = (value: any) => {
    activeENSNameRef.current = value
  }

  const getActiveENSNameRef = (value: any) => {
    return activeENSNameRef.current
  }

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (inputRef.current && !(inputRef.current as any).contains(event.target) && menuRef.current && !(menuRef.current as any).contains(event.target)) {
        setIsENSOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const submitENSName = (name: any) => {
    console.log('submitENSName', resolvedAddress)
    setReceiverAddress(resolvedAddress)
    setIsENSOpen(false)
  }

  const toast = useToast();

  const selectedToken = getTokenBalance(sendToken);

  const selectedTokenBalance = BN(selectedToken.tokenBalance).shiftedBy(-selectedToken.decimals).toFixed();

  const { sendErc20, sendEth } = useTransaction();

  const confirmAddress = async () => {
    let trimedAddress = receiverAddress ? receiverAddress.trim() : '';
    if (trimedAddress.includes(':')) {
      const chainPrefix = `${trimedAddress.split(':')[0]}:`;
      if (chainPrefix !== chainConfig.addressPrefix) {
        toast({
          title: 'Please select the correct network',
          status: 'error',
        });
        return;
      } else {
        trimedAddress = trimedAddress.split(':')[1];
      }
    }
    if (!trimedAddress || !ethers.isAddress(trimedAddress)) {
      toast({
        title: 'Invalid address',
        status: 'error',
      });
      return;
    }
    if (!amount) {
      toast({
        title: 'Amount not valid',
        status: 'error',
      });
      return;
    }

    if (new BN(amount).isGreaterThan(selectedTokenBalance)) {
      toast({
        title: 'Not enough balance',
        status: 'error',
      });
      return;
    }

    if (sendToken === ethers.ZeroAddress) {
      await sendEth(trimedAddress, amount);
    } else {
      await sendErc20(sendToken, trimedAddress, amount, selectedToken.decimals);
    }

    if(slotInfo.slot){
      const res = await api.operation.finishStep({
        slot: slotInfo.slot,
        steps: [1],
      });

      setFinishedSteps(res.data.finishedSteps);
    }

    resetState();

    onSent();
  };

  const resetState = () => {
    setAmount('');
    setReceiverAddress('');
  };

  return (
    <Box>
      <Flex flexDir={'column'} gap="5">
        <Box
          position="relative"
        >
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
              width: "100%",
              top: "70px",
              left: "0",
              right: "0",
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
        <AmountInput
          label="Amount:"
          sendToken={sendToken}
          amount={amount}
          onChange={setAmount}
          onTokenChange={setSendToken}
        />
      </Flex>
      <Button onClick={confirmAddress} w="100%" fontSize={'20px'} py="4" fontWeight={'800'} mt="6">
        Next
      </Button>
    </Box>
  );
}
