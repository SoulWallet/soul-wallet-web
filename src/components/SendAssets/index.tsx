import { useState } from 'react';
import Button from '../Button';
import { Flex, Box, Text, useToast } from '@chakra-ui/react';
import useTransaction from '@/hooks/useTransaction';
import { ethers } from 'ethers';
import { useBalanceStore } from '@/store/balance';
import AmountInput from './comp/AmountInput';
import { AddressInput, AddressInputReadonly } from './comp/AddressInput';

interface ISendAssets {
  tokenAddress: string;
}

export default function SendAssets({ tokenAddress = '' }: ISendAssets) {
  const [amount, setAmount] = useState<string>('');
  const { getTokenBalance } = useBalanceStore();
  const [sendToken, setSendToken] = useState(tokenAddress);
  const [receiverAddress, setReceiverAddress] = useState<string>('');
  const toast = useToast();

  const selectedToken = getTokenBalance(sendToken);
  // const selectedTokenBalance = BN(selectedToken.tokenBalance).shiftedBy(-selectedToken.decimals).toFixed();

  const { sendErc20, sendEth } = useTransaction();

  const confirmAddress = async () => {
    const trimedAddress = receiverAddress ? receiverAddress.trim() : '';
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

    // if (new BN(amount).isGreaterThan(selectedTokenBalance)) {
    //   toast({
    //     title: 'Balance not enough',
    //     status: 'error',
    //   });
    //   return;
    // }
    if (sendToken === ethers.ZeroAddress) {
      await sendEth(trimedAddress, amount);
    } else {
      await sendErc20(sendToken, trimedAddress, amount, selectedToken.decimals);
    }
    resetState();
  };

  const resetState = () => {
    setAmount('');
    setReceiverAddress('');
  };

  return (
    <Box>
      <Flex flexDir={'column'} gap="5">
        <AddressInput
          label="To:"
          placeholder="Enter wallet address"
          value={receiverAddress}
          onChange={(e: any) => setReceiverAddress(e.target.value)}
          onEnter={confirmAddress}
        />
        <AmountInput
          label="Send:"
          sendToken={sendToken}
          amount={amount}
          onChange={setAmount}
          onTokenChange={setSendToken}
        />
      </Flex>
      <Button onClick={confirmAddress} w="100%" fontSize={'20px'} py="4" fontWeight={'800'} mt="6">
        Preview
      </Button>
    </Box>
  );
}
