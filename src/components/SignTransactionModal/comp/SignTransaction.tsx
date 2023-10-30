import { Flex, Box, Text, useToast } from '@chakra-ui/react';
import GasSelect from '../../SendAssets/comp/GasSelect';
import { AddressInput, AddressInputReadonly } from '../../SendAssets/comp/AddressInput';
import Button from '../../Button';
import { InfoWrap, InfoItem } from '@/components/SignTransactionModal'
import BN from 'bignumber.js';
import { toShortAddress } from '@/lib/tools';
import useConfig from '@/hooks/useConfig';
import { useState, forwardRef, useImperativeHandle, useEffect, Ref } from 'react';
import useQuery from '@/hooks/useQuery';
import { decodeCalldata } from '@/lib/tools';

import { useChainStore } from '@/store/chain';
import api from '@/lib/api';
import { ethers } from 'ethers';
import { useBalanceStore } from '@/store/balance';
import { UserOpUtils, UserOperation } from '@soulwallet/sdk';
import useTransaction from '@/hooks/useTransaction';
import useWalletContext from '@/context/hooks/useWalletContext';
import useWallet from '@/hooks/useWallet';
import { useAddressStore, getIndexByAddress } from '@/store/address';
import ChainSelect from '@/components/ChainSelect'

export default function SignTransaction({ onSuccess, txns, origin, sendToAddress, showSelectChain, showAmount }: any) {
  const toast = useToast();
  const [loadingFee, setLoadingFee] = useState(true);
  const [promiseInfo, setPromiseInfo] = useState<any>({});
  const [decodedData, setDecodedData] = useState<any>({});
  const [signing, setSigning] = useState<boolean>(false);
  const { checkActivated } = useWalletContext();
  const { getTokenBalance } = useBalanceStore();
  const [prechecked, setPrechecked] = useState(false);
  // const [prefundCalculated, setPrefundCalculated] = useState(false);
  // TODO, remember user's last select
  const [payToken, setPayToken] = useState(ethers.ZeroAddress);
  const [payTokenSymbol, setPayTokenSymbol] = useState('');
  const [feeCost, setFeeCost] = useState('');
  const [activeOperation, setActiveOperation] = useState<UserOperation>();
  const [sponsor, setSponsor] = useState<any>(null);
  const { selectedChainId } = useChainStore();
  const { toggleActivatedChain, addressList, selectedAddress } = useAddressStore();
  // const [targetChainId, setTargetChainId] = useState('');
  const { getPrefund } = useQuery();
  const { chainConfig, selectedAddressItem } = useConfig();
  const { signAndSend, getActivateOp } = useWallet();
  const { getUserOp } = useTransaction();

  const checkSponser = async (userOp: UserOperation) => {
    const res = await api.sponsor.check(
      selectedChainId,
      chainConfig.contracts.entryPoint,
      UserOpUtils.userOperationFromJSON(UserOpUtils.userOperationToJSON(userOp)),
    );
    if (res.data.sponsorInfos && res.data.sponsorInfos.length > 0) {
      // TODO, check >1 sponsor
      setSponsor(res.data.sponsorInfos[0]);
    }
  };

  const clearState = () => {
    // setOrigin('');
    setPromiseInfo({});
    setDecodedData({});
    setLoadingFee(true);
    setSigning(false);
    // setPrefundCalculated(false);
    setPayToken(ethers.ZeroAddress);
    setPayTokenSymbol('');
    setFeeCost('');
    setActiveOperation(undefined);
    setSponsor(null);
    // setSendToAddress('');
  };

  const onConfirm = async () => {
    try {
      setSigning(true);

      let userOp: any;
      if (sponsor && sponsor.paymasterAndData) {
        userOp = { ...activeOperation, paymasterAndData: sponsor.paymasterAndData };
      } else {
        userOp = activeOperation;
      }

      const receipt = await signAndSend(userOp, payToken);

      // IMPORTANT TODO, get these params from receipt
      // if first tx is completed, then it's activated
      if (!checkActivated()) {
        toggleActivatedChain(userOp.sender, selectedChainId);
      }

      toast({
        title: 'Transaction success.',
        status: 'success',
      });

      onSuccess(receipt);

      clearState();
    } catch (err) {
      console.log('sign page failed', err);
      toast({
        title: 'Transaction failed.',
        status: 'error',
      });
    } finally {
      setSigning(false);
    }
  };

  const getFinalPrefund = async (userOp: any) => {
    setLoadingFee(true);
    console.log('get final prefund');
    // TODO, extract this for other functions
    const { requiredAmount } = await getPrefund(userOp, payToken);

    if (ethers.ZeroAddress === payToken) {
      setFeeCost(`${requiredAmount} ${chainConfig.chainToken}`);
    } else {
      setFeeCost(`${requiredAmount} USDC`);
    }
    // setPrefundCalculated(true);
    setLoadingFee(false);
  };

  const getFinalUserOp = async (txns: any) => {
    const isActivated = await checkActivated();
    if (isActivated) {
      // if activated, get userOp directly
      return await getUserOp(txns, payToken);
    } else {
      const activateIndex = getIndexByAddress(addressList, selectedAddress);
      console.log('activate index', activateIndex, addressList, selectedAddress, txns);
      // if not activated, prepend activate txns
      return await getActivateOp(activateIndex, payToken, txns);
    }
  };

  // const onPayTokenChange = async () => {
  //   // const newUserOp = await getFinalUserOp(txns);
  //   // setActiveOperation(newUserOp);
  //   // setPrefundCalculated(false);
  //   setLoadingFee(true);
  //   doPrecheck();
  // };

  const doPrecheck = async () => {
    if (prechecked) {
      return;
    }
    setPrechecked(true);
    setLoadingFee(true);
    setFeeCost('...');
    setPayTokenSymbol(getTokenBalance(payToken).symbol || 'Unknown');
    let userOp = await getFinalUserOp(txns);
    setActiveOperation(userOp);
    const callDataDecodes = await decodeCalldata(selectedChainId, chainConfig.contracts.entryPoint, userOp);
    console.log('decoded data', callDataDecodes);
    setDecodedData(callDataDecodes);
    checkSponser(userOp);
    getFinalPrefund(userOp);
  };

  useEffect(() => {
    setPrechecked(false);
  }, [payToken]);

  // IMPORTANT IMPORTANT TODO, rendered twice
  useEffect(() => {
    if (!txns || !txns.length || !payToken) {
      return;
    }
    console.log('do pre check', txns, payToken);
    doPrecheck();
  }, [txns, payToken]);

  return (
    <>
      <Flex flexDir={'column'} gap="5" mt="6">
        {decodedData && decodedData.length > 0 && (
          <Box bg="#fff" py="3" px="4" rounded="20px" fontWeight={'800'}>
            <Box>
              {decodedData.map((item: any, index: number) => (
                <Text mr="1" textTransform="capitalize" key={index}>
                  {decodedData.length > 1 && `${index + 1}.`}
                  {item.functionName ? item.functionName : item.method ? item.method.name : ''}
                </Text>
              ))}
            </Box>
          </Box>
        )}
        {showSelectChain && (
          <Box width="100%"><ChainSelect isInModal={true} /></Box>
        )}

        {showAmount && (
          <AddressInputReadonly label="Amount" value={`${showAmount} ETH`} />
        )}

        <AddressInputReadonly label="From" value={selectedAddressItem.title} memo={toShortAddress(selectedAddress)} />
        {sendToAddress ? (
          <AddressInput label="To" value={sendToAddress} disabled={true} />
        ) : decodedData[0] && decodedData[0].to ? (
          <AddressInput label="To" value={decodedData[0] && decodedData[0].to} disabled={true} />
        ) : (
          ''
        )}

        <>
          <InfoWrap>
            <InfoItem align={sponsor && 'flex-start'}>
              <Text>Gas fee</Text>
              {sponsor ? (
                <Box textAlign={'right'}>
                  <Flex mb="1" gap="4" justify={'flex-end'}>
                    {feeCost && (
                      <Text textDecoration={'line-through'}>
                        {BN(feeCost.split(' ')[0]).toFixed(6) || '0'} {payTokenSymbol}
                      </Text>
                    )}
                    <Text>0 ETH</Text>
                  </Flex>
                  <Text color="#898989">Sponsored by {sponsor.sponsorParty || 'Soul Wallet'}</Text>
                </Box>
              ) : feeCost ? (
                <Flex gap="2">
                  <Text>{feeCost.split(' ')[0]}</Text>
                  <GasSelect gasToken={payToken} onChange={setPayToken} />
                </Flex>
              ) : (
                <Text>Loading...</Text>
              )}
            </InfoItem>
          </InfoWrap>
        </>
      </Flex>
      <Button
        w="100%"
        fontSize={'20px'}
        py="4"
        fontWeight={'800'}
        mt="6"
        onClick={onConfirm}
        loading={signing}
        disabled={loadingFee && !sponsor}
        checkCanSign
      >
        Confirm
      </Button>
    </>
  );
}
