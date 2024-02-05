import { useState } from 'react';
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
        <AddressInput
          label="To:"
          placeholder="Enter ENS or wallet address"
          value={receiverAddress}
          onChange={(e: any) => setReceiverAddress(e.target.value)}
          onEnter={confirmAddress}
        />
        <AmountInput
          label="Amount:"
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
